import { ENV } from '@/lib/env';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        // Adjust the backend URL as needed
        const backendRes = await fetch(`${ENV.backendBaseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        

        const data = await backendRes.json();

        if (!backendRes.ok) {
            return NextResponse.json({ error: data.error || 'Login failed' }, { status: backendRes.status });
        }

        // Assume backend returns a token in data.token
        const response = NextResponse.json({ success: true, user: data.user });
        response.cookies.set(process.env.JWT_COOKIE_NAME ?? "auth_token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}