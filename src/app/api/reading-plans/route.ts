import { NextRequest, NextResponse } from 'next/server'
import { ENV } from '@/lib/env'
import { cookies } from 'next/headers'
import serverAxiosInstance from '@/lib/server-axios'

// CREATE reading plan or GET all reading plans
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ENV.jwtCookieName)?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const res = await serverAxiosInstance.post(
      `/reading-plans`, // backend: /api/v1/reading-plans
      body,
      {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      },
    )

    if (res.status < 200 || res.status >= 300) {
      return NextResponse.json(
        { error: res.data?.message || 'Failed to create reading plan' },
        { status: res.status },
      )
    }

    return NextResponse.json(res.data)
  } catch (error) {
    console.error('ReadingPlans POST error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ENV.jwtCookieName)?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const res = await serverAxiosInstance.get(`/reading-plans`, {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: () => true,
    })

    if (res.status < 200 || res.status >= 300) {
      return NextResponse.json(
        { error: res.data?.message || 'Failed to fetch reading plans' },
        { status: res.status },
      )
    }

    return NextResponse.json(res.data)
  } catch (error) {
    console.error('ReadingPlans GET error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
