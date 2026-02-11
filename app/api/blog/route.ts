import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import OpenAI from 'openai'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { generateWithAI, topic } = body

    if (generateWithAI) {
      const settings = await prisma.settings.findUnique({ where: { id: 'global' } })
      
      if (!settings?.openaiApiKey) {
        return NextResponse.json({ error: 'OpenAI API Key not configured' }, { status: 400 })
      }

      const openai = new OpenAI({ apiKey: settings.openaiApiKey })

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é um especialista em fisioterapia esportiva e SEO. Crie um post de blog atraente e otimizado para SEO em Português do Brasil. Retorne os dados em formato JSON com as chaves: title, content (em HTML), slug, metaTitle, metaDescription, keywords (array)." },
          { role: "user", content: `Crie um post sobre: ${topic || 'Benefícios da fisioterapia para atletas'}. Foque em pacientes de São José dos Campos.` }
        ],
        response_format: { type: "json_object" }
      })

      const aiContent = JSON.parse(completion.choices[0].message.content || '{}')
      
      const post = await prisma.blogPost.create({
        data: {
          title: aiContent.title,
          slug: aiContent.slug,
          content: aiContent.content,
          metaTitle: aiContent.metaTitle,
          metaDescription: aiContent.metaDescription,
          keywords: aiContent.keywords,
          status: 'DRAFT'
        }
      })
      
      return NextResponse.json(post)
    }

    const post = await prisma.blogPost.create({
      data: body
    })
    return NextResponse.json(post)
  } catch (error: any) {
    console.error('Blog Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to process post' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    const post = await prisma.blogPost.update({
      where: { id },
      data
    })
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    
    await prisma.blogPost.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
