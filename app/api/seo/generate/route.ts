import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import OpenAI from 'openai'

export async function POST(request: Request) {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: 'global' } })
    
    if (!settings?.openaiApiKey) {
      return NextResponse.json({ error: 'OpenAI API Key not configured' }, { status: 400 })
    }

    const openai = new OpenAI({ apiKey: settings.openaiApiKey })

    const prompt = `
      Você é um especialista em SEO de nível mundial e Especialista em GEO (Generative Engine Optimization).
      Analise os dados da clínica abaixo e gere metadados otimizados para o site como um todo.
      
      Dados Atuais:
      Nome: ${settings.siteName}
      Descrição: ${settings.description}
      Local: ${settings.addressCity}, ${settings.addressRegion}
      
      Objetivo: Maximizar a visibilidade no Google e em ferramentas de busca por IA (Perplexity, ChatGPT, Claude).
      
      Retorne um JSON com:
      1. titleTemplate: Um padrão de título forte (ex: "%s | Clínica Dr. Carlos - Fisioterapia SJC")
      2. description: Uma meta descrição persuasiva de 150-160 caracteres.
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Você é um consultor premium de SEO e GEO. Retorne apenas JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    })

    const aiSEO = JSON.parse(completion.choices[0].message.content || '{}')
    
    return NextResponse.json(aiSEO)
  } catch (error: any) {
    console.error('SEO Gen Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
