import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  
  const settings = await prisma.settings.findUnique({
    where: { id: 'global' }
  })

  const client_id = settings?.googleClientId
  const redirect_uri = settings?.googleRedirectUri

  if (!client_id || !redirect_uri) {
    return NextResponse.json({ 
      error: 'Google OAuth não configurado no painel administrativo. Vá em Configurações > Motores de IA / Google.' 
    }, { status: 400 })
  }

  const options = {
    redirect_uri: redirect_uri,
    client_id: client_id,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar'
    ].join(' ')
  }

  const qs = new URLSearchParams(options)
  return NextResponse.redirect(`${rootUrl}?${qs.toString()}`)
}
