import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import OpenAI from 'openai'
import { injectAds } from '@/lib/adSystem'

// Força execução máxima em ambientes serverless (se Vercel, max 300s no Pro, 10s no Hobby. O ideal é usar fila)
export const maxDuration = 60; // Configuração Vercel

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

/**
 * Função auxiliar para gerar um slug a partir de uma string
 */
function generateSlug(text: string) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

/**
 * Lógica de Internal Linking (Auto-Linking com Glossário)
 */
async function applyAutoLinking(content: string) {
  const terms = await prisma.glossaryTerm.findMany({
    where: { status: 'PUBLISHED' },
    select: { term: true, slug: true }
  })

  let linkedContent = content
  terms.forEach(({ term, slug }: { term: string, slug: string }) => {
    // Procura o termo (case insensitive, respeitando limites de palavras)
    // Evita substituir caso já esteja dentro de uma tag <a> ou um heading H1/H2
    const regex = new RegExp(`\\b(${term})\\b(?![^<]*>|[^<>]*<\/a>)`, 'gi')
    
    // Substitui apenas a primeira ocorrência para não encher o texto de links
    let replacedCount = 0
    linkedContent = linkedContent.replace(regex, (match) => {
      if (replacedCount === 0) {
        replacedCount++
        return `<a href="/glossario/${slug}" class="text-emerald-600 font-semibold hover:underline" title="O que é ${term}?">${match}</a>`
      }
      return match
    })
  })

  return linkedContent
}

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
    let queueItem = null
    
    // Tenta ler o body. Se vier queueId, processamos um item específico (Trigger manual)
    try {
      const body = await req.json()
      if (body.queueId) {
        queueItem = await prisma.contentQueue.findUnique({ where: { id: body.queueId } })
      }
    } catch (e) {
      // Ignora erro de JSON parse caso seja chamado via Cron sem body
    }

    // Se não encontrou do body, pega o artigo PENDING mais antigo
    if (!queueItem || queueItem.status !== 'PENDING') {
      queueItem = await prisma.contentQueue.findFirst({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'asc' }
      })
    }

    if (!queueItem) {
      return NextResponse.json({ message: 'No pending items in queue' })
    }

    // 1. Marca como processando
    await prisma.contentQueue.update({
      where: { id: queueItem.id },
      data: { status: 'PROCESSING' }
    })

    const keyword = queueItem.keyword
    const type = queueItem.type // 'BLOG' or 'GLOSSARY'
    const slug = generateSlug(keyword)

    // 2. Prompt GEO (Generative Engine Optimization)
    let prompt = ''
    let systemPrompt = 'Como especialista em Marketing e Criação de Conteúdo para Internet, você é focado em SEO e GEO (Generative Engine Optimization). Seu conteúdo deve ser claro, profissional e otimizado para rankear bem no Google.'
    
    if (type === 'BLOG') {
      prompt = `
Escreva um artigo de blog robusto sobre o tópico "${keyword}" focado na área de saúde e fisioterapia.

REGRAS OBRIGATÓRIAS (SEO E GEO):
1. O primeiro parágrafo DEVE ter exatamente 40 a 60 palavras, indo direto ao ponto sobre "O que é [tópico]". Isso é vital para capturar o Featured Snippet do Google.
2. Escreva com legibilidade impecável para SEO, utilizando palavras-chave LSI (Latent Semantic Indexing) relacionadas a "${keyword}".
3. Adicione a tag <h2> para os Headings em todos os Subtópicos do conteúdo.
4. É obrigatório ter Headings a cada 2 ou 3 parágrafos.
5. NÃO adicione uma conclusão genérica, Considerações Finais, "Em resumo", ou "Para concluir". Termine o texto com utilidade prática ou não faça fechamento.
6. Retorne APENAS o HTML da postagem começando já em <h2> (não use tag <h1>, não use formatação HTML no retorno).
`
    } else {
      prompt = `
Escreva um verbete enciclopédico rigoroso para o termo médico/fisioterápico: "${keyword}".

REGRAS OBRIGATÓRIAS (SEO E GEO):
1. O primeiro parágrafo DEVE ter exatamente 40 a 60 palavras, contendo uma definição clínica clara e inequívoca de dicionário, ideal para AI Overviews e Featured Snippets.
2. O conteúdo restante deve detalhar o termo de forma rica utilizando termos LSI do nicho de fisioterapia.
3. Adicione a tag <h2> para delimitar sub-tópicos essenciais (ex: Causas, Sintomas, Tratamentos).
4. O conteúdo PRECISA ter obrigatoriamente Headings (<h2>) bem definidos.
5. NÃO adicione Introduções longas ou Conclusões vazias/Considerações Finais ao glossário. Seja 100% conceitual.
6. Retorne APENAS o HTML da definição (não use tag <h1>, não use formatação HTML no retorno).
`
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    })

    let rawContent = completion.choices[0].message.content || ''
    
    // Cleanup markdown wrapping that OpenAI sometimes injects despite instruction
    rawContent = rawContent.replace(/^```html\s*/i, '')
    rawContent = rawContent.replace(/```\s*$/i, '')
    rawContent = rawContent.trim()
    
    // 3. Auto-Linking
    const linkedContent = await applyAutoLinking(rawContent)

    // 3.5 Inject Ads
    const finalContent = await injectAds(linkedContent)

    // 4. Salvar Rascunho
    if (type === 'BLOG') {
      // Como a OpenAI não nos deu titulo e meta separados, vamos derivar
      const title = keyword.charAt(0).toUpperCase() + keyword.slice(1)
      const excerpt = rawContent.substring(0, 160).replace(/<[^>]*>/g, '')

      await prisma.blogPost.create({
        data: {
          title: `Tudo sobre ${title}`,
          slug: slug,
          content: finalContent,
          metaTitle: `${title} - Guia Completo | Sport Health`,
          metaDescription: excerpt,
          keywords: [keyword],
          status: 'DRAFT', // Requer revisão humana no admin
        }
      })
    } else {
      const title = keyword.charAt(0).toUpperCase() + keyword.slice(1)
      await prisma.glossaryTerm.create({
        data: {
          term: title,
          slug: slug,
          definition: finalContent,
          status: 'DRAFT'
        }
      })
    }

    // 5. Concluir Item na Fila
    await prisma.contentQueue.update({
      where: { id: queueItem.id },
      data: { status: 'COMPLETED' }
    })

    return NextResponse.json({ success: true, item: queueItem.keyword })

  } catch (error: any) {
    console.error('Queue Worker Error:', error)
    
    // Falhou, marca como erro se conseguir
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
