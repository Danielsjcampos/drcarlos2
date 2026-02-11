const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

async function main() {
  console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20))
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
  try {
    const users = await prisma.user.findMany()
    console.log('Successfully connected. Users count:', users.length)
  } catch (e) {
    console.error('Failed to connect:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
