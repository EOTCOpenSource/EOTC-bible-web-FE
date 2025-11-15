import { NextRequest, NextResponse } from 'next/server'
import { ENV } from '@/lib/env'
import { cookies } from 'next/headers'
import serverAxiosInstance from '@/lib/server-axios'

// CREATE bookmark or GET all bookmarks
export async function POST(req: NextRequest) {
  try {
    const cookieStore: any = cookies()
    const token = cookieStore.get(ENV.jwtCookieName)?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const res = await serverAxiosInstance.post(
      `/bookmarks`, // backend: http://localhost:8000/api/v1/bookmarks
      body,
      {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      },
    )

    if (res.status < 200 || res.status >= 300) {
      const errorData = res.data
      return NextResponse.json(
        { error: errorData?.message || 'Failed to create bookmark' },
        { status: res.status },
      )
    }

    return NextResponse.json(res.data)
  } catch (error: any) {
    console.error('Bookmarks POST error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore: any = cookies()
    const token = cookieStore.get(ENV.jwtCookieName)?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const res = await serverAxiosInstance.get(`/bookmarks`, {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: () => true,
    })

    if (res.status < 200 || res.status >= 300) {
      return NextResponse.json(
        { error: res.data?.message || 'Failed to fetch bookmarks' },
        { status: res.status },
      )
    }

    return NextResponse.json(res.data)
  } catch (error) {
    console.error('Bookmarks GET error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
