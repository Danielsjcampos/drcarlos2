import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

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

  // Fetch appointments separately since we can't 'include' in raw query easily
  const appointments = await prisma.appointment.findMany({
    where: { leadId: lead.id },
    orderBy: { date: 'desc' }
  })

  return NextResponse.json({ ...lead, appointments })
}
