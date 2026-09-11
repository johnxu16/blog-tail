import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { biomes as staticBiomes } from '@blog/config/biomes'
import { payload, type Paginated, type PayloadDoc } from './payload.js'

const CACHE_DIR = path.resolve(process.cwd(), '.cache')
const SNAPSHOT_PATH = path.join(CACHE_DIR, 'biomes.json')

export interface BiomeSnapshot {
  slug: string
  name: string
  spriteKey: string
  description: string
  postCount: number
  posts: Array<{
    slug: string
    title: string
    summary?: string
    date: string
  }>
}

interface BiomeDoc extends PayloadDoc<BiomeDoc> {
  slug: string
  name: string
  spriteKey: string
  description?: string
}

interface BlogDoc extends PayloadDoc<BlogDoc> {
  title: string
  slug: string
  summary?: string
  date: string
  biome?: { slug?: string } | string | number | null
  status?: string
}

export async function readSnapshot(): Promise<BiomeSnapshot[] | null> {
  if (!existsSync(SNAPSHOT_PATH)) return null
  try {
    return JSON.parse(await readFile(SNAPSHOT_PATH, 'utf-8'))
  } catch {
    return null
  }
}

export async function writeSnapshot(rows: BiomeSnapshot[]): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true })
  await writeFile(SNAPSHOT_PATH, JSON.stringify(rows, null, 2))
}

export async function buildBiomeSnapshot(): Promise<BiomeSnapshot[]> {
  const [biomeData, postData] = await Promise.all([
    payload<Paginated<BiomeDoc>>('/api/biomes', { query: { limit: 100, depth: 0 } }),
    payload<Paginated<BlogDoc>>('/api/blogs', {
      query: { limit: 1000, depth: 0, 'where[status][ne]': 'draft' },
    }),
  ])

  const map = new Map<string, BiomeSnapshot>()
  for (const b of staticBiomes) {
    map.set(b.slug, { ...b, postCount: 0, posts: [] })
  }
  for (const b of biomeData.docs) {
    if (!map.has(b.slug)) {
      map.set(b.slug, {
        slug: b.slug,
        name: b.name,
        spriteKey: b.spriteKey,
        description: b.description ?? '',
        postCount: 0,
        posts: [],
      })
    }
  }

  for (const p of postData.docs) {
    const slug = typeof p.biome === 'object' && p.biome ? p.biome.slug : null
    if (!slug) continue
    const target = map.get(slug) ?? map.get('wilderness')
    if (!target) continue
    target.postCount += 1
    target.posts.push({ slug: p.slug, title: p.title, summary: p.summary, date: p.date })
  }

  return Array.from(map.values())
}
