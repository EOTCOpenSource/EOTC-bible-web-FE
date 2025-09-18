import { type NextRequest, NextResponse } from "next/server"
import { ENV } from "@/lib/env"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await fetch(`${ENV.backendBaseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body), // {name, email, password}
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: text || "Registration failed" }, { status: res.status })
    }

    const contentType = res.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text()
      return NextResponse.json({ error: `Backend returned non-JSON response: ${text}` }, { status: 500 })
    }

    let data
    try {
      data = await res.json()
    } catch (error) {
      const text = await res.text()
      return NextResponse.json({ error: `Failed to parse backend response: ${text}` }, { status: 500 })
    }

    const token: string = data.token // returned by backend
    const response = NextResponse.json({ user: data.user, message: data.message }, { status: 200 })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
