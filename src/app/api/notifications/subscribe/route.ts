import { NextRequest, NextResponse } from 'next/server'
import serverAxiosInstance from '@/lib/server-axios'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const res = await serverAxiosInstance.post(
      `/notifications/subscribe`,
      body,
      {
        validateStatus: () => true,
      },
    )

    if (res.status < 200 || res.status >= 300) {
      return NextResponse.json(
        { error: res.data?.message || 'Failed to subscribe' },
        { status: res.status },
      )
    }

    return NextResponse.json(res.data, { status: res.status })
  } catch (error) {
    console.error('Subscribe POST error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
