import { NextResponse } from 'next/server'
import { ENV } from '@/lib/env'
import { cookies } from 'next/headers'
import serverAxiosInstance from '@/lib/server-axios'

export async function DELETE() {
  const cookieStore: any = cookies()
  const token = cookieStore.get(ENV.jwtCookieName)?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Call backend delete account API
    const backendRes = await serverAxiosInstance.delete(`/auth/account`, {
      validateStatus: () => true,
    })

    if (backendRes.status < 200 || backendRes.status >= 300) {
      return NextResponse.json(
        { error: backendRes.data?.message || 'Delete account failed' },
        { status: backendRes.status },
      )
    }

    // Clear JWT cookie
    cookieStore.set({
      name: ENV.jwtCookieName,
      value: '',
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
    })

    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 })
  } catch (err: any) {
    console.error('Delete account error:', err?.response?.data || err.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
