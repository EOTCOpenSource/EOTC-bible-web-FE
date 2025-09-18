export async function clientApiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Calls our Next.js proxy, which attaches Authorization for us
  const res = await fetch(`/api/proxy${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    cache: "no-store",
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Proxy ${res.status}: ${text}`)
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
