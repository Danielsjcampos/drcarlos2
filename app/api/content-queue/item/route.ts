import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { pingGoogleSitemap } from '@/lib/googlePing'

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const keyword = searchParams.get('keyword')
  const type = searchParams.get('type')

  if (!keyword || !type) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })

  const slug = generateSlug(keyword)

  try {
    if (type === 'BLOG') {
      const post = await prisma.blogPost.findUnique({ where: { slug } })
      return NextResponse.json(post)
    } else {
      const term = await prisma.glossaryTerm.findUnique({ where: { slug } })
      return NextResponse.json(term)
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, type, title, term, content, definition, status } = body

    if (type === 'BLOG') {
      const updated = await prisma.blogPost.update({
        where: { id },
        data: { title, content, status }
      })
      if (status === 'PUBLISHED') {
        pingGoogleSitemap().catch(console.error)
      }
      return NextResponse.json(updated)
    } else {
      const updated = await prisma.glossaryTerm.update({
        where: { id },
        data: { term, definition, status }
      })
      if (status === 'PUBLISHED') {
        pingGoogleSitemap().catch(console.error)
      }
      return NextResponse.json(updated)
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type')

    if (!id || !type) return NextResponse.json({ error: 'ID and type required' }, { status: 400 })

    if (type === 'BLOG') {
      await prisma.blogPost.delete({ where: { id } })
    } else {
      await prisma.glossaryTerm.delete({ where: { id } })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
  }
}
