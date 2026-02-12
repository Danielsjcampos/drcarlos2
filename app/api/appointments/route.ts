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

import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patientName, phone, date, time, duration, type, notes } = body

    // 1. Procurar Lead pelo telefone
    let lead = await prisma.lead.findFirst({
      where: { phone }
    })

    const generateHealthCode = () => `HEALTH-${crypto.randomBytes(2).toString('hex').toUpperCase()}`
    const newCode = generateHealthCode()

    // 2. Garantir Lead e accessCode (Usando RAW SQL para contornar o Client desatualizado)
    if (!lead) {
      const id = crypto.randomUUID()
      await prisma.$executeRawUnsafe(
        'INSERT INTO "Lead" (id, name, phone, status, interest, origin, "accessCode", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())',
        id, patientName, phone, 'SCHEDULED', 'Avaliação', 'Site', newCode
      )
      const results = await prisma.$queryRawUnsafe<any[]>('SELECT * FROM "Lead" WHERE id = $1', id)
      lead = results[0]
    } else {
      // Check if accessCode is missing using raw SQL since lead object might be stale
      const currentLeads = await prisma.$queryRawUnsafe<any[]>('SELECT "accessCode" FROM "Lead" WHERE id = $1', lead.id)
      const currentCode = currentLeads[0]?.accessCode

      if (!currentCode) {
        await prisma.$executeRawUnsafe(
          'UPDATE "Lead" SET status = $1, "accessCode" = $2 WHERE id = $3',
          'SCHEDULED', newCode, lead.id
        )
      } else {
        await prisma.$executeRawUnsafe(
          'UPDATE "Lead" SET status = $1 WHERE id = $2',
          'SCHEDULED', lead.id
        )
      }
      
      const results = await prisma.$queryRawUnsafe<any[]>('SELECT * FROM "Lead" WHERE id = $1', lead.id)
      lead = results[0]
    }

    if (!lead) throw new Error('Failed to retrieve or create lead')

    // 3. Criar Agendamento vinculado
    const appointment = await prisma.appointment.create({
      data: {
        patientName,
        phone,
        date: new Date(date),
        time,
        duration: duration || 60,
        type: type || 'AVALIACAO',
        notes: notes || null,
        leadId: lead.id,
      }
    })

    // 4. Retornar dados + código de acesso
    return NextResponse.json({ ...appointment, accessCode: lead.accessCode })
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
