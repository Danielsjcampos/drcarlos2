import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const blocked = await prisma.blockedSlot.findMany()
    return NextResponse.json(blocked)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blocked slots' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { dayOfWeek, time } = body
    
    // Toggle block: if exists, delete; if not, create
    const existing = await prisma.blockedSlot.findFirst({
      where: { dayOfWeek, time }
    })

    if (existing) {
      await prisma.blockedSlot.delete({ where: { id: existing.id } })
      return NextResponse.json({ success: true, action: 'unblocked' })
    } else {
      const blocked = await prisma.blockedSlot.create({
        data: { dayOfWeek, time }
      })
      return NextResponse.json({ success: true, action: 'blocked', data: blocked })
    }
  } catch {
    return NextResponse.json({ error: 'Failed to toggle block' }, { status: 500 })
  }
}
