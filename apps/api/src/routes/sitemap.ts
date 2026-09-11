import { Hono } from 'hono'
import { payload, type Paginated, type PayloadDoc } from '../lib/payload.js'

interface BlogDoc extends PayloadDoc<BlogDoc> {
  slug: string
  date: string
  lastmod?: string
  status?: string
}

const SITE_URL = process.env.SITE_URL || 'https://www.jxdev.me'

export const sitemapRoutes = new Hono().get('/', async (c) => {
  const data = await payload<Paginated<BlogDoc>>('/api/blogs', {
    query: { limit: 1000, depth: 0, 'where[status][ne]': 'draft' },
  })
  const today = new Date().toISOString().slice(0, 10)
  const staticRoutes = ['', 'blog', 'projects', 'tags']
    .map((r) => `  <url><loc>${SITE_URL}/${r}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')
  const postRoutes = data.docs
    .map(
      (p) =>
        `  <url><loc>${SITE_URL}/blog/${p.slug}</loc><lastmod>${
          (p.lastmod || p.date).slice(0, 10)
        }</lastmod></url>`,
    )
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes}
${postRoutes}
</urlset>`
  c.header('content-type', 'application/xml')
  return c.body(xml)
})
