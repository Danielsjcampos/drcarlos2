import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import prisma from '@/lib/db'

// This endpoint could take longer if generating large lists
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: 'global' } })
    const apiKey = settings?.openaiApiKey || process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not configured no painel de configurações' }, { status: 500 })
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    })

    const body = await req.json()
    const { topic, count = 50, letter = 'A-Z' } = body

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    let letterInstruction = `A lista deve focar em gerar os termos que iniciem especificamente pela letra "${letter}". Gere exatamente (ou aproximadamente) ${count} termos para essa letra.`
    if (letter === 'A-Z') {
        letterInstruction = `A lista DEVE estar em ordem alfabética cobrindo as letras de A a Z. Tente gerar ao final o montante exato de ${count} termos misturados passando pelo alfabeto.`
    }

    const systemPrompt = `Você é um especialista em Fisioterapia e SEO Médico.
O usuário vai pedir um glossário de termos essenciais sobre um Setor/Assunto específico.
Você deve gerar uma lista rica de termos fáceis focada neste assunto, conforme os parâmetros abaixo.

REGRAS OBRIGATÓRIAS:
1. Retorne ESTRITAMENTE em formato JSON.
2. A estrutura do JSON deve ser obrigatoriamente um objeto com a chave "suggestions", que é um array de objetos.
3. Cada objeto "suggestion" deve ter as chaves: "keyword" (o termo ou dor) e "type" (SEMPRE "GLOSSARY").
4. ${letterInstruction}
5. O formato da "keyword" deve ser apenas o termo em si (ex: "Alongamento", "Bursite"). Não inclua as letras "A -", "B - " na frente do termo nem enumere.

Exemplo de formato de saída JSON:
{
  "suggestions": [
    { "keyword": "Alongamento", "type": "GLOSSARY" },
    { "keyword": "Bursite", "type": "GLOSSARY" }
  ]
}`

    console.log(`[Queue Suggest] Solicitando A-Z para o tema: ${topic}...`)

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `Crie a lista de termos de A a Z relevantes e mais buscados detalhando: ${topic}. Exemplo prático do que estou buscando: 'O QUE É [termo]', separando as áreas, dores e tratamentos.` 
        }
      ],
      temperature: 0.7,
    })

    const rawContent = completion.choices[0].message.content || '{"suggestions": []}'
    let jsonContent
    
    try {
      jsonContent = JSON.parse(rawContent)
    } catch (parseError) {
      console.error("[Queue Suggest] Erro no Parse JSON:", rawContent)
      return NextResponse.json({ error: "O Assistente IA retornou uma resposta inválida." }, { status: 500 })
    }

    if (!jsonContent.suggestions || !Array.isArray(jsonContent.suggestions)) {
      console.error("[Queue Suggest] Estrutura incorreta:", jsonContent)
      return NextResponse.json({ error: "Estrutura JSON desconhecida." }, { status: 500 })
    }

    return NextResponse.json(jsonContent)

  } catch (error: any) {
    console.error('[Queue Suggest] Worker Error:', error)
    return NextResponse.json({ error: error.message || "Erro interno desconhecido" }, { status: 500 })
  }
}

