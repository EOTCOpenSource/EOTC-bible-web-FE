import { NextRequest, NextResponse } from 'next/server'
import serverAxiosInstance from '@/lib/server-axios'

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const query = searchParams.toString()
        const url = `/notes/public/verse${query ? `?${query}` : ''}`

        const res = await serverAxiosInstance.get(url, {
            validateStatus: () => true,
        })

        if (res.status < 200 || res.status >= 300) {
            return NextResponse.json(
                { error: res.data?.message || 'Failed to fetch public notes for verse' },
                { status: res.status }
            )
        }

        return NextResponse.json(res.data)
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch public notes for verse',
            },
            { status: error.response?.status || 500 }
        )
    }
}
