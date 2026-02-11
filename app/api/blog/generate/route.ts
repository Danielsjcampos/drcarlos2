import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { keywords, tone = 'informativo', word_count = 1000 } = await request.json()
    
    // In a real scenario, we would call Gemini/OpenAI here.
    // Mocking the AI response for demonstration:
    const mockTitle = `Guia Definitivo: ${keywords[0]} em São José dos Campos`
    const mockSlug = keywords[0].toLowerCase().replace(/ /g, '-')
    const mockContent = `
      <h1>${mockTitle}</h1>
      <p>Este é um post gerado automaticamente pela IA para a keyword: ${keywords[0]}.</p>
      <p>A fisioterapia em SJC tem crescido muito, e o Dr. Carlos Prado é referência...</p>
      <h2>Benefícios do Tratamento</h2>
      <ul>
        <li>Melhora da mobilidade</li>
        <li>Alívio imediato</li>
        <li>Performance</li>
      </ul>
      <p>Agende sua avaliação agora!</p>
    `

    const post = await prisma.blogPost.create({
      data: {
        title: mockTitle,
        slug: mockSlug,
        content: mockContent,
        metaTitle: mockTitle.substring(0, 60),
        metaDescription: `Saiba tudo sobre ${keywords[0]} com o Dr. Carlos Prado em SJC.`,
        keywords: keywords,
        status: 'PUBLISHED'
      }
    })

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('AI Blog Generation Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to generate post' }, { status: 500 })
  }
}
