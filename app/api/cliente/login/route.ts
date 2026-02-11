import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    if (!code) {
       return NextResponse.json({ error: 'Code required' }, { status: 400 })
    }

    const leads = await prisma.$queryRawUnsafe<any[]>(
      'SELECT * FROM "Lead" WHERE "accessCode" = $1 LIMIT 1',
      code
    )
    const lead = leads[0]

    if (!lead) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
    }

    // Retorna ok e o lead (sem appointments para login leve)
    return NextResponse.json({ success: true, lead })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
