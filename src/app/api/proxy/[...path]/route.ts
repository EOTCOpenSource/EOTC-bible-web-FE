import { NextRequest } from "next/server";
import { ENV } from "@/lib/env";

async function handle(req: NextRequest, pathSegments: string[]) {
  const url = new URL(req.url);
  const backendUrl = `${ENV.backendBaseUrl}/${pathSegments.join("/")}${url.search}`;

  const token = req.cookies.get(process.env.JWT_COOKIE_NAME ?? "token")?.value;

  const init: RequestInit = {
    method: req.method,
    headers: {
      "Content-Type": req.headers.get("content-type") ?? "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
  };

  try {
    const res = await fetch(backendUrl, init);
    return new Response(res.body, {
      status: res.status,
      headers: res.headers,
    });
  } catch {
    return new Response(JSON.stringify({ error: "Proxy request failed" }), { status: 500 });
  }
}

// DO NOT TYPE the second argument!
export async function GET(req: NextRequest, { params }: any) {
  return handle(req, params.path);
}

export async function POST(req: NextRequest, { params }: any) {
  return handle(req, params.path);
}

export async function PUT(req: NextRequest, { params }: any) {
  return handle(req, params.path);
}

export async function DELETE(req: NextRequest, { params }: any) {
  return handle(req, params.path);
}

export async function PATCH(req: NextRequest, { params }: any) {
  return handle(req, params.path);
}
