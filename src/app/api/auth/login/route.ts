// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server"
import { ENV } from "@/lib/env"
import axios from "axios"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Call backend login
    const res = await axios.post(`${ENV.backendBaseUrl}/auth/login`, body, {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true, // allow handling non-2xx responses
    })

    if (res.status < 200 || res.status >= 300) {
      const errorData = res.data
      return NextResponse.json(
        { error: errorData?.message || "Login failed" },
        { status: res.status }
      )
    }

    const data = res.data

    // Access token and user correctly based on backend response
    const token = data.data.token
    const user = data.data.user


    // Set cookie in browser
    const response = NextResponse.json({ success: true, user })
    response.cookies.set({
      name: ENV.jwtCookieName,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV.toLowerCase() === "production",
      sameSite: "lax",
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
