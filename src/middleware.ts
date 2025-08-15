import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = process.env.JWT_COOKIE_NAME ?? "auth_token";
const PROTECTED_PREFIXES = ["/", "/bookmarks", "/notes", "/highlights", "/progress"].map(
  p => `/` + "(dashboard)".replace(/[()]/g, "") + p // adjust if you rename segment
);

// Easier: guard everything under / (dashboard)
const PROTECTED = ["/", "/bookmarks", "/notes", "/highlights", "/progress"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE)?.value;

  const isProtected = pathname.startsWith("/(dashboard)");
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (isAuthRoute && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/"; // already logged in
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/(dashboard)/(.*)", "/login", "/register"],
};
