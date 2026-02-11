import prisma from './lib/db'

async function test() {
  try {
    console.log('Testing DB connection...')
    const settings = await prisma.settings.findFirst()
    console.log('Settings found:', !!settings)
    process.exit(0)
  } catch (err) {
    console.error('DB Connection Failed:', err)
    process.exit(1)
  }
}

test()
