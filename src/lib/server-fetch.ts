import { ENV, validateEnvironment } from "./env"
import { cookies } from "next/headers"

export async function serverApiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    validateEnvironment()
  } catch (error: any) {
    throw new Error(
      `Configuration error: ${error.message}. Please set up your environment variables in Project Settings.`,
    )
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ENV.jwtCookieName)?.value;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(`${ENV.backendBaseUrl}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text}`)
  }

  const contentType = res.headers.get("content-type")
  if (!contentType || !contentType.includes("application/json")) {
    const text = await res.text()
    throw new Error(`Expected JSON response but got: ${contentType}. Response: ${text}`)
  }

  try {
    return (await res.json()) as T
  } catch (error) {
    const text = await res.text()
    throw new Error(`Failed to parse JSON response: ${text}`)
  }
}
