import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ENV } from '@/lib/env'
import serverAxiosInstance from '@/lib/server-axios'

const getAuthToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get(ENV.jwtCookieName)?.value
}

const unauthorizedResponse = NextResponse.json(
  { error: 'Unauthorized. Please login first.' },
  { status: 401 },
)

export async function POST(req: NextRequest) {
  try {
    const token = await getAuthToken()
    if (!token) {
      return unauthorizedResponse
    }

    const body = await req.json()

    const res = await serverAxiosInstance.post('/progress/sync-verses', body, {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: () => true,
    })

    if (res.status < 200 || res.status >= 300) {
      return NextResponse.json(
        { error: res.data?.message || 'Failed to sync verse progress' },
        { status: res.status },
      )
    }

    return NextResponse.json(res.data)
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to sync verse progress',
      },
      { status: error.response?.status || 500 },
    )
  }
}

