import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { startOfDay, endOfDay, subDays } from 'date-fns'

export async function GET() {
  try {
    // Fix timezone issue by using UTC boundaries for the current date string
    const todayStr = new Date().toISOString().split('T')[0]
    const todayStart = new Date(`${todayStr}T00:00:00.000Z`)
    const todayEnd = new Date(`${todayStr}T23:59:59.999Z`)

    // Parallel fetching for performance
    const [
      totalLeads, 
      newLeads, 
      totalPosts, 
      todayAppointments,
      recentLeads,
      recentAppointments
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.blogPost.count(),
      prisma.appointment.findMany({
        where: {
          date: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        include: { lead: true },
        orderBy: { time: 'asc' },
      }),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.appointment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { lead: true }
      })
    ])

    // Format recent activities
    const activities = [
      ...recentLeads.map(lead => ({
        id: `lead-${lead.id}`,
        title: 'Novo Lead Capturado',
        desc: `${lead.name} se interessou por '${lead.interest || 'Avaliação'}'`,
        time: lead.createdAt,
        type: 'NEW_LEAD'
      })),
      ...recentAppointments.map(app => ({
        id: `app-${app.id}`,
        title: 'Novo Agendamento',
        desc: `${app.patientName} marcou ${app.type} para ${app.time}`,
        time: app.createdAt,
        type: 'APPOINTMENT'
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5)

    return NextResponse.json({
      stats: {
        totalLeads,
        newLeads,
        totalPosts,
        conversionRate: totalLeads > 0 ? ((recentAppointments.length / totalLeads) * 100).toFixed(1) : 0,
      },
      todayAppointments,
      activities
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}
