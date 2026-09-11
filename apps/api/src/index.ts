import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import { postsRoutes } from './routes/posts.js'
import { tagsRoutes } from './routes/tags.js'
import { biomesRoutes } from './routes/biomes.js'
import { feedRoutes } from './routes/feed.js'
import { sitemapRoutes } from './routes/sitemap.js'
import { cacheRoutes } from './routes/cache.js'

const app = new Hono()

app.use('*', logger())
app.use('*', cors())

app.get('/healthz', (c) => c.json({ ok: true }))

app.route('/posts', postsRoutes)
app.route('/tags', tagsRoutes)
app.route('/biomes', biomesRoutes)
app.route('/feed.xml', feedRoutes)
app.route('/sitemap.xml', sitemapRoutes)
app.route('/cache', cacheRoutes)

const port = Number(process.env.PORT || 3002)
console.log(`[api] listening on :${port}`)
serve({ fetch: app.fetch, port })

export type AppType = typeof app
