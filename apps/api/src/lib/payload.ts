const PAYLOAD = process.env.PAYLOAD_API_URL || 'http://127.0.0.1:3001'

export async function payload<T>(
  path: string,
  init?: RequestInit & { query?: Record<string, string | number | undefined> },
): Promise<T> {
  const url = new URL(`${PAYLOAD}${path}`)
  if (init?.query) {
    for (const [k, v] of Object.entries(init.query)) {
      if (v !== undefined) url.searchParams.set(k, String(v))
    }
  }
  const res = await fetch(url, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  })
  if (!res.ok) {
    throw new Error(`payload ${path} -> ${res.status}`)
  }
  return (await res.json()) as T
}

export interface PayloadDoc<T> {
  id: string | number
  createdAt: string
  updatedAt: string
  [k: string]: unknown
}

export interface Paginated<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}
