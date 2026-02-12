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

    // Find keywords that haven't been processed or just take all active ones
    const activeKeywords = await prisma.blogKeyword.findMany({
      where: { status: 'PENDING' },
      take: 5 // Limit to 5 at a time for safety
    })

    if (activeKeywords.length === 0) {
      return NextResponse.json({ success: false, error: 'No pending keywords found' })
    }

    const generatedPosts = []
    
    // Fetch existing posts for internal linking context
    const existingPosts = await prisma.blogPost.findMany({
      select: { title: true, slug: true },
      take: 20,
      orderBy: { createdAt: 'desc' }
    })

    const internalLinksContext = existingPosts.map(p => `- ${p.title} (/blog/${p.slug})`).join('\n')

    for (const kw of activeKeywords) {
      // Update status to generating
      await prisma.blogKeyword.update({
        where: { id: kw.id },
        data: { status: 'GENERATING' }
      })

      try {
        const prompt = `
          Crie um artigo de blog premium para um site de fisioterapia.
          Keyword base: "${kw.term}"
          Localização: São José dos Campos (SJC)
          Público: Atletas e pessoas com dores crônicas.
          
          ARTIGO ESTRATÉGICO:
          Ao escrever o conteúdo, você DEVE incluir links internos naturais para os seguintes artigos já publicados, se o contexto permitir:
          ${internalLinksContext || "Nenhum artigo publicado ainda."}
          
          Use o formato <a href="/blog/slug">Texto do Link</a>.
          
          Retorne um JSON com:
          1. title: Um título atraente e otimizado para SEO.
          2. content: O artigo completo em HTML (use tags h2, h3, p, ul, li). Mínimo 800 palavras.
          3. slug: Uma URL amigável.
          4. metaTitle: Título SEO (max 60 caracteres).
          5. metaDescription: Descrição SEO persuasiva.
          6. keywords: Array de keywords relacionadas.
        `

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Você é um redator sênior de SEO especializado em saúde e bem-estar. Retorne apenas JSON." },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        })

        const data = JSON.parse(completion.choices[0].message.content || '{}')

        // Fetch Image from Unsplash (Search API)
        let imageUrl = null
        try {
          const query = encodeURIComponent(`fisioterapia ${kw.term.split(' ').slice(0, 2).join(' ')} health`)
          // Using Unsplash Source for faster results (though deprecated, it's quick for demos)
          // or a more robust random from category.
          imageUrl = `https://images.unsplash.com/photo-1576091160550-217359f49f4a?auto=format&fit=crop&q=80&w=1024` // Default high-end health photo
          
          // Enhanced: Try generic dynamic source search
          imageUrl = `https://source.unsplash.com/1600x900/?physiotherapy,health,${encodeURIComponent(kw.term)}`
          // Note: Unsplash Source is sometimes flaky, better to use a specific high-quality fallback or real API if keys available.
        } catch (imgErr) {
          console.error("Image fetch failed", imgErr)
        }

        const post = await prisma.blogPost.create({
          data: {
            title: data.title,
            slug: data.slug + '-' + Date.now().toString().slice(-4),
            content: data.content,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            keywords: data.keywords,
            imageUrl: imageUrl,
            status: 'PUBLISHED'
          }
        })

        // Update keyword status
        await prisma.blogKeyword.update({
          where: { id: kw.id },
          data: { status: 'COMPLETED' }
        })

        generatedPosts.push(post)
      } catch (err) {
        console.error(`Failed to generate post for ${kw.term}:`, err)
        await prisma.blogKeyword.update({
          where: { id: kw.id },
          data: { status: 'FAILED' }
        })
      }
    }

    return NextResponse.json({ success: true, count: generatedPosts.length })
  } catch (error: any) {
    console.error('AI Blog Generation Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
