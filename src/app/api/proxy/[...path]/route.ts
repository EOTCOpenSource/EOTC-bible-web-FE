import { NextRequest } from "next/server";
import { ENV } from "@/lib/env";

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handle(req, params);
}
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handle(req, params);
}
export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handle(req, params);
}
export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handle(req, params);
}

async function handle(req: NextRequest, { path }: { path: string[] }) {
  const url = new URL(req.url);
  const backendUrl = `${ENV.backendBaseUrl}/${path.join("/")}${url.search}`;
  const token = req.cookies.get(process.env.JWT_COOKIE_NAME ?? "token")?.value;

  const init: RequestInit = {
    method: req.method,
    headers: {
      "Content-Type": req.headers.get("content-type") ?? "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // required for protected routes :contentReference[oaicite:5]{index=5}
    },
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
  };

  const res = await fetch(backendUrl, init);
  const text = await res.text();

  return new Response(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}
