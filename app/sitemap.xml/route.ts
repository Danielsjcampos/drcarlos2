import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    // Busca URLs de Blog Publicadas
    const blogPosts = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true }
    })

    // Busca URLs de Glossario Publicados
    const glossaryTerms = await prisma.glossaryTerm.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true }
    })

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sporthealth.com.br'

    // Estrutura Base
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/glossario</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`

    // Injeta os Blogs dinâmicos
    blogPosts.forEach((post) => {
      xml += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    })

    // Injeta os termos de glossário 
    glossaryTerms.forEach((term) => {
      xml += `
  <url>
    <loc>${baseUrl}/glossario/${term.slug}</loc>
    <lastmod>${term.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    })

    xml += `
</urlset>`

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
      },
    })
  } catch (err: any) {
    console.error('Sitemap generation error:', err)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}
