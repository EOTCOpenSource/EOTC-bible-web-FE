import { NextResponse } from 'next/server'
import { ENV } from '@/lib/env'

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()

    const res = await fetch(`${ENV.backendBaseUrl}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: text || 'OTP verification failed' }, { status: res.status })
    }

    // Parse JSON
    let data: any
    try {
      data = await res.json()
    } catch {
      const text = await res.text()
      return NextResponse.json(
        { error: `Failed to parse backend response: ${text}` },
        { status: 500 },
      )
    }

    // Prepare response
    const response = NextResponse.json(
      { success: true, user: data.user || null }, // expose only safe fields
      { status: 200 },
    )

    // ✅ Save token in HttpOnly cookie
    if (data.token) {
      response.cookies.set({
        name: ENV.jwtCookieName,
        value: data.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
    } else {
      console.warn('No token received from backend on verify-otp')
    }

    return response
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
