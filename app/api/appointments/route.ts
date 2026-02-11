import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { date: 'asc' }
    })
    return NextResponse.json(appointments)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patientName, phone, date, time, duration, type, notes, leadId } = body

    const appointment = await prisma.appointment.create({
      data: {
        patientName,
        phone,
        date: new Date(date),
        time,
        duration: duration || 60,
        type: type || 'AVALIACAO',
        notes: notes || null,
        leadId: leadId || null,
      }
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Appointment creation error:', error)
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (data.date) data.date = new Date(data.date)

    const appointment = await prisma.appointment.update({
      where: { id },
      data
    })

    return NextResponse.json(appointment)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await prisma.appointment.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 })
  }
}
