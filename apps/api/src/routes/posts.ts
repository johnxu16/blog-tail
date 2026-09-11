import { Hono } from 'hono'
import { payload, type Paginated, type PayloadDoc } from '../lib/payload.js'

interface BlogDoc extends PayloadDoc<BlogDoc> {
  title: string
  slug: string
  path?: string
  date: string
  lastmod?: string
  summary?: string
  draft?: boolean
  status?: 'draft' | 'review' | 'published'
  tags?: Array<string | number> | null
  biome?: string | number | null
  authors?: Array<string | number> | null
  layout?: string
  content?: { markdown?: string; lexical?: unknown }
}

interface TagDoc extends PayloadDoc<TagDoc> {
  name: string
  slug: string
}

function summaryFromBlog(doc: BlogDoc) {
  return {
    slug: doc.slug,
    title: doc.title,
    date: doc.date,
    lastmod: doc.lastmod,
    summary: doc.summary,
    tags: doc.tags ?? [],
    biome: doc.biome ?? null,
    authors: doc.authors ?? [],
    draft: doc.draft ?? false,
    status: doc.status ?? 'draft',
    layout: doc.layout ?? 'PostSimple',
    content: doc.content ?? {},
  }
}

export const postsRoutes = new Hono()
  .get('/', async (c) => {
    const page = Number(c.req.query('page') || 1)
    const limit = Math.min(Number(c.req.query('limit') || 50), 100)
    const tag = c.req.query('tag')
    const biome = c.req.query('biome')
    const includeDrafts = c.req.query('drafts') === '1' || process.env.NODE_ENV !== 'production'

    const query: Record<string, string | number> = {
      page,
      limit,
      sort: '-date',
      depth: 1,
    }
    if (!includeDrafts) query['where[status][ne]'] = 'draft'
    if (tag) query['where[tags.slug][equals]'] = tag
    if (biome) query['where[biome.slug][equals]'] = biome

    const data = await payload<Paginated<BlogDoc>>('/api/blogs', { query })
    return c.json({ posts: data.docs.map(summaryFromBlog) })
  })
  .get('/:slug', async (c) => {
    const slug = c.req.param('slug')
    const data = await payload<{ docs: BlogDoc[] }>('/api/blogs', {
      query: { 'where[slug][equals]': slug, depth: 1 },
    })
    const doc = data.docs[0]
    if (!doc) return c.json({ error: 'not_found' }, 404)
    return c.json({ post: summaryFromBlog(doc) })
  })
