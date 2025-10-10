import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ENV } from '@/lib/env'

const AUTH_COOKIE = ENV.jwtCookieName

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get(AUTH_COOKIE)?.value

  // Define protected routes (everything under /dashboard)
  const isProtected = pathname.startsWith('/dashboard')
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')

  // Redirect to login if not authenticated
  if (isProtected && !token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname) // preserve intended path
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if already logged in
  if (isAuthRoute && token) {
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard' // adjust to your main dashboard route
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
