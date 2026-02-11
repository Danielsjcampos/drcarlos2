import 'server-only'
import prisma from './db'

export async function getSiteSettings() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'global' }
    })
    return settings
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
}
