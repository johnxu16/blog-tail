import { Hono } from 'hono'
import { payload, type Paginated, type PayloadDoc } from '../lib/payload.js'

interface BlogDoc extends PayloadDoc<BlogDoc> {
  title: string
  slug: string
  date: string
  status?: string
  tags?: Array<{ slug?: string; id?: string | number } | string | number> | null
  biome?: { slug?: string } | string | number | null
}

interface TagDoc extends PayloadDoc<TagDoc> {
  name: string
  slug: string
}

export const tagsRoutes = new Hono()
  .get('/', async (c) => {
    const [tagsData, postsData] = await Promise.all([
      payload<Paginated<TagDoc>>('/api/tags', { query: { limit: 1000 } }),
      payload<Paginated<BlogDoc>>('/api/blogs', {
        query: { limit: 1000, depth: 0, 'where[status][ne]': 'draft' },
      }),
    ])
    const counts = new Map<string, number>()
    for (const post of postsData.docs) {
      for (const t of post.tags ?? []) {
        const slug = typeof t === 'object' ? t.slug : undefined
        if (!slug) continue
        counts.set(slug, (counts.get(slug) ?? 0) + 1)
      }
    }
    const tags = tagsData.docs
      .map((t) => ({ slug: t.slug, name: t.name, count: counts.get(t.slug) ?? 0 }))
      .sort((a, b) => b.count - a.count)
    return c.json({ tags })
  })
  .get('/:slug', async (c) => {
    const slug = c.req.param('slug')
    const tag = await payload<{ docs: TagDoc[] }>('/api/tags', {
      query: { 'where[slug][equals]': slug },
    })
    if (!tag.docs[0]) return c.json({ posts: [] })
    const posts = await payload<Paginated<BlogDoc>>('/api/blogs', {
      query: {
        'where[tags.slug][equals]': slug,
        depth: 0,
        sort: '-date',
        'where[status][ne]': 'draft',
      },
    })
    return c.json({
      tag: tag.docs[0],
      posts: posts.docs.map((p) => ({
        slug: p.slug,
        title: p.title,
        date: p.date,
        summary: (p as unknown as { summary?: string }).summary,
        tags: p.tags ?? [],
      })),
    })
  })
