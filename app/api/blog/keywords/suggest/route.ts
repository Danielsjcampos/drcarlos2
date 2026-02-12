import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import OpenAI from 'openai'

export async function POST() {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: 'global' } })
    
    if (!settings?.openaiApiKey) {
      return NextResponse.json({ error: 'OpenAI API Key not configured' }, { status: 400 })
    }

    const openai = new OpenAI({ apiKey: settings.openaiApiKey })

    // Fetch existing posts to identify gaps
    const existingPosts = await prisma.blogPost.findMany({
      select: { title: true },
      take: 20
    })

    const titles = existingPosts.map(p => p.title).join(', ')

    const prompt = `
      Você é um especialista em conteúdo estratégico de saúde e SEO.
      Com base nestes títulos de posts já existentes: [${titles}]
      
      Sugira 5 novas keywords estratégicas (foco em Fisioterapia, Performance, Recuperação) que ainda não foram totalmente exploradas, focando no público de São José dos Campos (SJC).
      
      Retorne APENAS um JSON com a chave "suggestions" contendo um array de strings.
      Exemplo: { "suggestions": ["Fisioterapia para dor no joelho SJC", "..."] }
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um gestor de conteúdo estratégico. Retorne apenas JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    })

    const data = JSON.parse(completion.choices[0].message.content || '{}')
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Suggest Keywords Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
