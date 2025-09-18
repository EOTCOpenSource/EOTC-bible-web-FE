// app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from "next/server"
import { ENV } from "@/lib/env"

const AUTH_COOKIE = ENV.jwtCookieName

export async function GET(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const res = await fetch(`${ENV.backendBaseUrl}/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Backend error: ${res.statusText}` }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Profile route error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
