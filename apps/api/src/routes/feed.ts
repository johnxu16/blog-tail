import { Hono } from 'hono'
import { payload, type Paginated, type PayloadDoc } from '../lib/payload.js'

interface BlogDoc extends PayloadDoc<BlogDoc> {
  title: string
  slug: string
  date: string
  summary?: string
  tags?: Array<{ slug?: string } | string | number> | null
  status?: string
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildFeed(siteUrl: string, title: string, description: string, posts: BlogDoc[]) {
  const items = posts
    .filter((p) => p.status !== 'draft')
    .map((p) => {
      const link = `${siteUrl}/blog/${p.slug}`
      const tagCats = (p.tags ?? [])
        .map((t) => {
          const slug = typeof t === 'object' && t && 'slug' in t ? t.slug : undefined
          return slug ? `<category>${escapeXml(slug)}</category>` : ''
        })
        .join('')
      return `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      ${p.summary ? `<description>${escapeXml(p.summary)}</description>` : ''}
      ${tagCats}
    </item>`
    })
    .join('')
  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}/blog</link>
    <description>${escapeXml(description)}</description>
    <language>zh-cn</language>
    ${items}
  </channel>
</rss>`
}

export const feedRoutes = new Hono()
  .get('/', async (c) => {
    const data = await payload<Paginated<BlogDoc>>('/api/blogs', {
      query: { limit: 50, sort: '-date', depth: 0, 'where[status][ne]': 'draft' },
    })
    const xml = buildFeed('https://www.jxdev.me', 'John Xu — Blog', 'Latest posts', data.docs)
    c.header('content-type', 'application/rss+xml')
    return c.body(xml)
  })
