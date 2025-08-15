import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/lib/env";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${ENV.backendBaseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  const token: string = data.token; // returned by backend :contentReference[oaicite:4]{index=4}
  const response = NextResponse.json({ user: data.user });

  response.cookies.set(process.env.JWT_COOKIE_NAME ?? "auth_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
