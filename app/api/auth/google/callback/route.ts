import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  const settings = await prisma.settings.findUnique({
    where: { id: 'global' }
  })

  const client_id = settings?.googleClientId
  const client_secret = settings?.googleClientSecret
  const redirect_uri = settings?.googleRedirectUri

  if (!client_id || !client_secret || !redirect_uri) {
    return NextResponse.json({ error: 'Google OAuth credentials missing in database' }, { status: 500 })
  }

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uri
  )

  try {
    const { tokens } = await oauth2Client.getToken(code)
    
    // Save tokens to global settings
    await prisma.settings.update({
      where: { id: 'global' },
      data: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
        googleTokenExpiry: tokens.expiry_date ? BigInt(tokens.expiry_date) : null
      }
    })

    return NextResponse.redirect(new URL('/dashboard/agenda?sync=success', request.url))
  } catch (error: any) {
    console.error('Google Auth Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
