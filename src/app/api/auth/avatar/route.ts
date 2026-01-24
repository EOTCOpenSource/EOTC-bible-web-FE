import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ENV } from '@/lib/env'
import serverAxiosInstance from '@/lib/server-axios'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ENV.jwtCookieName)?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()

    // Use serverAxiosInstance to match the pattern used in profile route
    // The baseURL should already include /api/v1, so /auth/avatar becomes /api/v1/auth/avatar
    const res = await serverAxiosInstance.post('/auth/avatar', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Let axios set the correct multipart boundary for FormData
      },
      validateStatus: () => true, // allow handling non-2xx responses
    })

    // Handle backend errors
    if (res.status < 200 || res.status >= 300) {
      return NextResponse.json(
        {
          error:
            res.data?.message ||
            res.data?.error ||
            'Failed to upload profile image',
        },
        { status: res.status },
      )
    }

    const user = res.data?.data?.user || res.data?.user

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error('Avatar upload API error:', error)
    return NextResponse.json(
      { error: 'Internal server error while uploading avatar' },
      { status: 500 },
    )
  }
}


