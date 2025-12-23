import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ENV } from '@/lib/env'
import serverAxiosInstance from '@/lib/server-axios'

export async function PATCH(
  _: Request,
  { params }: { params: { id: string; dayNumber: string } }
) {
    const cookieStore = await cookies()
  const token = cookieStore.get(ENV.jwtCookieName)?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const res = await serverAxiosInstance.patch(
    `/reading-plans/${params.id}/days/${params.dayNumber}/complete`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: () => true,
    }
  )

  return NextResponse.json(res.data, { status: res.status })
}
