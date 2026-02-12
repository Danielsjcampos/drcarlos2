import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const keywords = await prisma.blogKeyword.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(keywords)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch keywords' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { term } = await request.json()
    if (!term) return NextResponse.json({ error: 'Term is required' }, { status: 400 })

    const keyword = await prisma.blogKeyword.create({
      data: { term: term.trim() }
    })
    return NextResponse.json(keyword)
  } catch (error) {
    return NextResponse.json({ error: 'Keyword already exists or failed' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    await prisma.blogKeyword.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete keyword' }, { status: 500 })
  }
}
