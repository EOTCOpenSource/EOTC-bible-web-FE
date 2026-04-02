import { NextRequest, NextResponse } from 'next/server'
import { ENV } from '@/lib/env'
import { cookies } from 'next/headers'
import serverAxiosInstance from '@/lib/server-axios'

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ENV.jwtCookieName)?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const res = await serverAxiosInstance.put(
      `/notifications/toggle`,
      body,
      {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      },
    )

    if (res.status < 200 || res.status >= 300) {
      return NextResponse.json(
        { error: res.data?.message || 'Failed to toggle notification' },
        { status: res.status },
      )
    }

    return NextResponse.json(res.data)
  } catch (error) {
    console.error('Notification toggle PUT error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
