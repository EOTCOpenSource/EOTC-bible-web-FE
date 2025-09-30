import { NextRequest, NextResponse } from "next/server"
import { ENV } from "@/lib/env"
import { cookies } from "next/headers"
import serverAxiosInstance from "@/lib/server-axios";


export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ENV.jwtCookieName)?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    
    const backendRes = await serverAxiosInstance.post(
      `/auth/logout`,
      {}, 
      {
        validateStatus: () => true,
      }
    )

    if (backendRes.status !== 200) {
      const errorData = backendRes.data
      return NextResponse.json(
        { error: errorData?.message || "Logout failed" },
        { status: backendRes.status }
      )
    }

    // Clear JWT cookie
    cookieStore.set({
      name: ENV.jwtCookieName,
      value: "",
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    })

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 })
  } catch (err: any) {
    console.error("Logout error:", err?.response?.error || err.message)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
