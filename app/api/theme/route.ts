import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const theme = cookieStore.get('orbit-theme')?.value || 'dark'
  return NextResponse.json({ theme })
}

export async function POST(request: Request) {
  const { theme } = await request.json()
  const response = NextResponse.json({ theme })
  response.cookies.set('orbit-theme', theme, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  return response
}
