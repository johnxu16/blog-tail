import type { Post } from './posts'

const API_BASE = process.env.WEB_API_URL || 'http://127.0.0.1:3002'

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
    next: { revalidate: 60 },
  })
  if (!res.ok) {
    throw new Error(`API ${path} -> ${res.status}`)
  }
  return (await res.json()) as T
}

export interface BiomeDto {
  slug: string
  name: string
  spriteKey: string
  description: string
  postCount?: number
}

export interface PostSummary {
  slug: string
  title: string
  date: string
  summary?: string
  tags: string[]
  biome?: string | null
  draft?: boolean
  status?: string
}

export async function fetchAllPosts(): Promise<PostSummary[]> {
  const data = await fetchJson<{ posts: PostSummary[] }>('/posts')
  return data.posts
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  try {
    const data = await fetchJson<{ post: Post }>(`/posts/${encodeURIComponent(slug)}`)
    return data.post
  } catch (err) {
    if (err instanceof Error && err.message.includes('-> 404')) return null
    throw err
  }
}

export async function fetchAllTags(): Promise<Record<string, number>> {
  const data = await fetchJson<{ tags: Array<{ slug: string; count: number }> }>('/tags')
  return data.tags.reduce<Record<string, number>>((acc, t) => {
    acc[t.slug] = t.count
    return acc
  }, {})
}

export async function fetchPostsByTag(tag: string): Promise<PostSummary[]> {
  const data = await fetchJson<{ posts: PostSummary[] }>(`/tags/${encodeURIComponent(tag)}`)
  return data.posts
}

export async function fetchBiomes(): Promise<BiomeDto[]> {
  const data = await fetchJson<{ biomes: BiomeDto[] }>('/biomes')
  return data.biomes
}

export async function fetchAuthorBySlug(slug: string): Promise<unknown | null> {
  try {
    return await fetchJson(`/authors/${encodeURIComponent(slug)}`)
  } catch {
    return null
  }
}
