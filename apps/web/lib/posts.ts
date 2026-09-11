export interface Post {
  id: string
  slug: string
  path: string
  title: string
  date: string
  lastmod?: string
  draft?: boolean
  status?: 'draft' | 'review' | 'published'
  summary?: string
  tags?: string[]
  images?: string[]
  authors?: string[]
  layout?: 'PostSimple' | 'PostLayout' | 'PostBanner'
  canonicalUrl?: string
  bibliography?: string
  locale?: string
  biome?: string | null
  content?: {
    markdown?: string
    lexical?: unknown
  }
}

export type CoreContent<T extends Post> = Omit<T, 'body' | '_raw' | '_id' | 'content'>

export function coreContent<T extends Post>(post: T): CoreContent<T> {
  const {
    content: _content,
    body: _body,
    _raw: _raw,
    _id: _id,
    ...rest
  } = post as T & {
    body?: unknown
    _raw?: unknown
    _id?: unknown
  }
  return rest as CoreContent<T>
}

export function sortPosts<T extends { date: string; title: string }>(posts: T[]): T[] {
  return [...posts].sort((a, b) => {
    const dateDiff = String(b.date).localeCompare(String(a.date))
    if (dateDiff !== 0) return dateDiff
    return String(a.title).localeCompare(String(b.title))
  })
}

export function allCoreContent<T>(posts: T[]): T[] {
  return posts.map((p) => p)
}
