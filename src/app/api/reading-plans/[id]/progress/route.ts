import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ENV } from '@/lib/env'
import serverAxiosInstance from '@/lib/server-axios'

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
    const cookieStore = await cookies()
  const token = cookieStore.get(ENV.jwtCookieName)?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const res = await serverAxiosInstance.get(
    `/reading-plans/${params.id}/progress`,
    {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: () => true,
    }
  )

  return NextResponse.json(res.data, { status: res.status })
}
