import { Hono } from 'hono'
import { readSnapshot, buildBiomeSnapshot, writeSnapshot, type BiomeSnapshot } from '../lib/globeSnapshot.js'
import { biomes as staticBiomes } from '@blog/config/biomes'

export const biomesRoutes = new Hono().get('/', async (c) => {
  let snapshot = await readSnapshot()
  if (!snapshot) {
    try {
      snapshot = await buildBiomeSnapshot()
      await writeSnapshot(snapshot)
    } catch (err) {
      console.warn('[biomes] snapshot build failed; falling back to static config', err)
      const fallback: BiomeSnapshot[] = staticBiomes.map((b) => ({ ...b, postCount: 0, posts: [] }))
      return c.json({ biomes: fallback })
    }
  }
  return c.json({ biomes: snapshot })
})
