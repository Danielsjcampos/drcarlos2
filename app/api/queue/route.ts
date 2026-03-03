import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const queue = await prisma.contentQueue.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(queue)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch queue' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { keyword, type } = body

    if (!keyword || !type) {
      return NextResponse.json({ error: 'Keyword and type are required' }, { status: 400 })
    }

    const item = await prisma.contentQueue.create({
      data: {
        keyword,
        type,
        status: 'PENDING'
      }
    })

    return NextResponse.json(item)
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Keyword already in queue' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await prisma.contentQueue.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
