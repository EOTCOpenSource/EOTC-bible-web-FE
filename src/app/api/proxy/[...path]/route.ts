import type { NextRequest } from "next/server"
import { ENV } from "@/lib/env"

async function handle(req: NextRequest, pathSegments: string[]) {
  const url = new URL(req.url)
  const backendUrl = `${ENV.backendBaseUrl}/${pathSegments.join("/")}${url.search}`

  // Get token from cookies
  const token = req.cookies.get(ENV.jwtCookieName)?.value


  // Forward all cookies
  const cookieHeader = req.headers.get("cookie") ?? ""

  const init: RequestInit = {
    method: req.method,
    headers: {
      // forward original content-type if available
      "Content-Type": req.headers.get("content-type") ?? "application/json",
      // forward cookies
      cookie: cookieHeader,
      // add Authorization if token exists
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
  }

  try {
    const res = await fetch(backendUrl, init)
    return new Response(res.body, {
      status: res.status,
      headers: res.headers,
    })
  } catch (e) {
    console.error("Proxy error:", e)
    return new Response(JSON.stringify({ error: "Proxy request failed" }), { status: 500 })
  }
}

// Generic handler for all methods
async function withParams(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params
  return handle(req, path)
}

export { withParams as GET, withParams as POST, withParams as PUT, withParams as DELETE, withParams as PATCH }
