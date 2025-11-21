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
  { status: 401 }
)

export async function GET() {
  try {
    const token = await getAuthToken()
    if (!token) {
      return unauthorizedResponse
    }

    const response = await serverAxiosInstance.get('/highlights', {
      headers: { Authorization: `Bearer ${token}` },
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error fetching highlights:', error.message)

    if (error.response?.status === 401) {
      return unauthorizedResponse
    }

    return NextResponse.json(
      {
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch highlights',
      },
      { status: error.response?.status || 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getAuthToken()
    if (!token) {
      return unauthorizedResponse
    }

    const body = await req.json()
    const response = await serverAxiosInstance.post('/highlights', body, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error adding highlight:', error.message)

    if (error.response?.status === 401) {
      return unauthorizedResponse
    }

    return NextResponse.json(
      {
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to add highlight',
      },
      { status: error.response?.status || 500 }
    )
  }
}

