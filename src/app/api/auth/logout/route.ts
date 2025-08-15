import { NextResponse } from "next/server";
import { ENV } from "@/lib/env";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ENV.jwtCookieName, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
