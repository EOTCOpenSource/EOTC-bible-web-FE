import { NextRequest, NextResponse } from 'next/server'
import { ENV } from '@/lib/env'
import { cookies } from 'next/headers'
import serverAxiosInstance from '@/lib/server-axios'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore: any = cookies()
    const token = cookieStore.get(ENV.jwtCookieName)?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const res = await serverAxiosInstance.delete(
      `/bookmarks/${id}`, // backend: http://localhost:8000/api/v1/bookmarks/:id
      {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      },
    )

    if (res.status < 200 || res.status >= 300) {
      const errorData = res.data
      return NextResponse.json(
        { error: errorData?.message || 'Failed to delete bookmark' },
        { status: res.status },
      )
    }

    return NextResponse.json(res.data)
  } catch (error: any) {
    console.error('Bookmarks DELETE error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
