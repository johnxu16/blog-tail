import { Hono } from 'hono'
import { writeSnapshot, buildBiomeSnapshot } from '../lib/globeSnapshot.js'

export const cacheRoutes = new Hono().post('/invalidate', async (c) => {
  try {
    const body = (await c.req.json().catch(() => ({}))) as { kind?: string }
    if (body.kind !== 'biome') {
      return c.json({ ok: false, error: 'unsupported kind' }, 400)
    }
    const snapshot = await buildBiomeSnapshot()
    await writeSnapshot(snapshot)
    return c.json({ ok: true, count: snapshot.length })
  } catch (err) {
    return c.json({ ok: false, error: String(err) }, 500)
  }
})
