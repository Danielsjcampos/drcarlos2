import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' }
    })

    const income = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0)
    const expenses = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0)

    return NextResponse.json({
      transactions,
      summary: {
        income,
        expenses,
        profit: income - expenses,
        count: transactions.length,
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { description, amount, type, category, patientName, appointmentId, date } = body

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount: parseFloat(amount),
        type,
        category,
        patientName: patientName || null,
        appointmentId: appointmentId || null,
        date: date ? new Date(date) : new Date(),
      }
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Transaction creation error:', error)
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await prisma.transaction.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 })
  }
}
