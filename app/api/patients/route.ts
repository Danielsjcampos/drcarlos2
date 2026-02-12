import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const patient = await prisma.lead.findUnique({
        where: { id },
        include: { appointments: { orderBy: { date: 'desc' } } }
      })
      return NextResponse.json(patient)
    }

    const patients = await prisma.lead.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(patients)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (data.birthDate) data.birthDate = new Date(data.birthDate)

    const patient = await prisma.lead.update({
      where: { id },
      data
    })

    return NextResponse.json(patient)
  } catch (error) {
    console.error('Patient Update Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await prisma.lead.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
