import { NextRequest, NextResponse } from 'next/server'
import { ENV } from '@/lib/env'
import { cookies } from 'next/headers'
import serverAxiosInstance from '@/lib/server-axios'

const AUTH_COOKIE = ENV.jwtCookieName

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE)?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.log('Logging out with token:', token)
    const backendRes = await serverAxiosInstance.post(
      `/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: () => true,
      },
    )

    if (backendRes.status !== 200) {
      const errorData = backendRes.data
      return NextResponse.json(
        { error: errorData?.message || 'Logout failed' },
        { status: backendRes.status },
      )
    }
    const cookieStore = await cookies()
    if (backendRes.status === 200) {
      cookieStore.set(ENV.jwtCookieName, '', {
        path: '/',
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
      })
    }

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
  } catch (err: any) {
    console.error('Logout error:', err?.response?.error || err.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
