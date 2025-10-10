import { type NextRequest, NextResponse } from 'next/server'
import { serverApiFetch } from '@/lib/server-fetch'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name } = body

    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 })
    }

    const response = await serverApiFetch('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    })

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Resend OTP error:', error)
    return NextResponse.json({ error: error.message || 'Failed to resend OTP' }, { status: 500 })
  }
}
