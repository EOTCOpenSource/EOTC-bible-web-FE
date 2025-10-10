import { NextRequest, NextResponse } from 'next/server'
import { ENV } from '@/lib/env'
import serverAxiosInstance from '@/lib/server-axios'

const AUTH_COOKIE = ENV.jwtCookieName

export async function GET(req: NextRequest) {
  try {
    // Get token from cookie
    const token = req.cookies.get(AUTH_COOKIE)?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.log('Profile route fetched token from cookies:', token)

    // Call backend profile endpoint
    const res = await serverAxiosInstance.get(`/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: () => true, // allow handling non-2xx responses
    })

    // Handle backend errors
    if (res.status < 200 || res.status >= 300) {
      return NextResponse.json(
        { error: res.data?.message || 'Failed to fetch profile' },
        { status: res.status },
      )
    }
    if (!res.data?.data) {
      console.error('No user data in profile response:', res.data)
    }
    // Return user data
    const userData = res.data.data.user // adjust according to your backend structure
    return NextResponse.json({ success: true, user: userData }, { status: 200 })
  } catch (error: any) {
    console.error('Profile API error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
