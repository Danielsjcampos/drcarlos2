import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'global' }
    })

    if (!settings) {
      settings = await prisma.settings.create({
        data: { id: 'global' }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const settings = await prisma.settings.upsert({
      where: { id: 'global' },
      update: body,
      create: { id: 'global', ...body }
    })
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
