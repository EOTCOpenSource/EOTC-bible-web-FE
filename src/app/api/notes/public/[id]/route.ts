import { NextRequest, NextResponse } from 'next/server'
import serverAxiosInstance from '@/lib/server-axios'

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const res = await serverAxiosInstance.get(`/notes/public/${id}`, {
            validateStatus: () => true,
        })

        if (res.status < 200 || res.status >= 300) {
            return NextResponse.json(
                { error: res.data?.message || 'Failed to fetch public note' },
                { status: res.status }
            )
        }

        return NextResponse.json(res.data)
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch public note',
            },
            { status: error.response?.status || 500 }
        )
    }
}
