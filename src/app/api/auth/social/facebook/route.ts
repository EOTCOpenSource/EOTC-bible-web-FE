import { NextRequest, NextResponse } from 'next/server'
import { ENV } from '@/lib/env'
import serverAxiosInstance from '@/lib/server-axios'

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json()
        const { accessToken } = body

        if (!accessToken) {
            return NextResponse.json({ error: 'Facebook access token is required' }, { status: 400 })
        }

        const res = await serverAxiosInstance.post('/auth/social/facebook', { accessToken }, {
            validateStatus: () => true,
        })

        if (res.status < 200 || res.status >= 300) {
            const errorData = res.data
            return NextResponse.json(
                { error: errorData?.message || 'Facebook login failed' },
                { status: res.status },
            )
        }

        const data = res.data
        const token = data.data.token
        const user = data.data.user

        const response = NextResponse.json({ success: true, user })
        response.cookies.set({
            name: ENV.jwtCookieName,
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV.toLowerCase() === 'production',
            sameSite: 'lax',
            path: '/',
        })

        return response
    } catch (error: any) {
        console.error('Facebook Auth API error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
