export async function clientApiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  // Calls our Next.js proxy, which attaches Authorization for us
  const res = await fetch(`/api/proxy${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Proxy ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}
