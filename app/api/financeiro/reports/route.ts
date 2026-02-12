import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'

export async function GET() {
  try {
    const now = new Date()
    const monthsToFetch = 12
    const reports = []

    // Fetch transactions for the last 12 months
    for (let i = 0; i < monthsToFetch; i++) {
      const monthStart = startOfMonth(subMonths(now, i))
      const monthEnd = endOfMonth(subMonths(now, i))

      const transactions = await prisma.transaction.findMany({
        where: {
          date: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      })

      const income = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0)
      const expenses = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0)

      reports.push({
        month: format(monthStart, 'MMM/yy'),
        monthFull: format(monthStart, 'MMMM yyyy'),
        income,
        expenses,
        profit: income - expenses,
      })
    }

    // DRE Data (Current Month)
    const currentMonthStart = startOfMonth(now)
    const currentMonthEnd = endOfMonth(now)
    
    const currentTransactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    })

    const dre = {
      revenue: currentTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0),
      // Grouping expenses by categories
      categories: currentTransactions.reduce((acc: any, t) => {
        if (t.type === 'EXPENSE') {
          acc[t.category] = (acc[t.category] || 0) + t.amount
        }
        return acc
      }, {}),
    }

    return NextResponse.json({
      history: reports.reverse(),
      dre,
      summary: {
        totalIncome: reports.reduce((sum, r) => sum + r.income, 0),
        totalExpenses: reports.reduce((sum, r) => sum + r.expenses, 0),
      }
    })
  } catch (error) {
    console.error('Reports error:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}
