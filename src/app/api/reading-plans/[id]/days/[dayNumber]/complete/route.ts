import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ENV } from '@/lib/env'
import serverAxiosInstance from '@/lib/server-axios'

export async function PATCH(
  _: Request,
  { params }: { params: Promise<{ id: string; dayNumber: string }> }
) {
  const cookieStore = await cookies()
  const { id, dayNumber } = await params
  const token = cookieStore.get(ENV.jwtCookieName)?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const res = await serverAxiosInstance.patch(
    `/reading-plans/${id}/days/${dayNumber}/complete`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: () => true,
    }
  )

  return NextResponse.json(res.data, { status: res.status })
}
