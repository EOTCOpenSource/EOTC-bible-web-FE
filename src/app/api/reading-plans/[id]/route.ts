import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ENV } from '@/lib/env'
import serverAxiosInstance from '@/lib/server-axios'

interface Params {
  params: { id: string }
}

// GET /api/reading-plans/:id
export async function GET(_: NextRequest, { params }: Params) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ENV.jwtCookieName)?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const res = await serverAxiosInstance.get(
      `/reading-plans/${params.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      }
    )

    if (res.status < 200 || res.status >= 300) {
      return NextResponse.json(
        { error: res.data?.message || 'Failed to fetch plan' },
        { status: res.status }
      )
    }

    return NextResponse.json(res.data)
  } catch (err) {
    console.error('Get plan error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// PUT /api/reading-plans/:id
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ENV.jwtCookieName)?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const res = await serverAxiosInstance.put(
      `/reading-plans/${params.id}`,
      body,
      {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      }
    )

    if (res.status < 200 || res.status >= 300) {
      return NextResponse.json(
        { error: res.data?.message || 'Failed to update plan' },
        { status: res.status }
      )
    }

    return NextResponse.json(res.data)
  } catch (err) {
    console.error('Update plan error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// DELETE /api/reading-plans/:id
export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ENV.jwtCookieName)?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const res = await serverAxiosInstance.delete(
      `/reading-plans/${params.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      }
    )

    if (res.status < 200 || res.status >= 300) {
      return NextResponse.json(
        { error: res.data?.message || 'Failed to delete plan' },
        { status: res.status }
      )
    }

    return NextResponse.json(res.data)
  } catch (err) {
    console.error('Delete plan error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
