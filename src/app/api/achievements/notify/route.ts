import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ENV } from '@/lib/env'
import serverAxiosInstance from '@/lib/server-axios'

const getAuthToken = async () => {
    const cookieStore = await cookies()
    return cookieStore.get(ENV.jwtCookieName)?.value
}

export async function POST(req: NextRequest) {
    try {
        const token = await getAuthToken()
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized. Please login first.' }, { status: 401 })
        }

        const body = await req.json()
        const { achievementIds } = body

        if (!achievementIds || !Array.isArray(achievementIds) || achievementIds.length === 0) {
            return NextResponse.json({ error: 'achievementIds array is required' }, { status: 400 })
        }

        const res = await serverAxiosInstance.post(
            '/achievements/notify',
            { achievementIds },
            {
                headers: { Authorization: `Bearer ${token}` },
                validateStatus: () => true,
            }
        )

        if (res.status < 200 || res.status >= 300) {
            return NextResponse.json(
                { error: res.data?.message || 'Failed to send achievement notification' },
                { status: res.status }
            )
        }

        return NextResponse.json(res.data)
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data?.error || error.message || 'Failed to notify achievement' },
            { status: error.response?.status || 500 }
        )
    }
}
