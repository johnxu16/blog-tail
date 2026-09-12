import 'dotenv/config'
import { readFile, writeFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../../../..')
const BLOG_DIR = path.join(ROOT, 'data/blog')
const AUTHOR_DIR = path.join(ROOT, 'data/authors')
const MAP_PATH = path.join(ROOT, 'data/migration-map.json')

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://127.0.0.1:3001'
const FORCE = process.argv.includes('--force')

interface MapEntry {
  source: string
  mtime: string
  size: number
  hash: string
  payloadId: string | number | null
  kind: 'blog' | 'author'
}

type MapFile = Record<string, MapEntry>

async function loadMap(): Promise<MapFile> {
  if (!existsSync(MAP_PATH)) return {}
  return JSON.parse(await readFile(MAP_PATH, 'utf-8')) as MapFile
}

async function saveMap(map: MapFile) {
  await writeFile(MAP_PATH, JSON.stringify(map, null, 2))
}

async function sha256(buf: Buffer | string) {
  return createHash('sha256').update(buf).digest('hex').slice(0, 16)
}

function parseFrontmatter(raw: string) {
  // Normalize CRLF -> LF so the regex below matches Windows-authored files.
  const normalized = raw.replace(/\r\n/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { data: {} as Record<string, unknown>, content: raw }
  const [, fm, body] = match
  const data: Record<string, unknown> = {}
  for (const line of fm.split('\n')) {
    const m = line.match(/^([\w-]+):\s*(.*)$/)
    if (!m) continue
    const [, key, valRaw] = m
    let val: unknown = valRaw.replace(/^['"]|['"]$/g, '')
    // Inline YAML list: ['tool', 'frontend']
    if (typeof val === 'string' && val.startsWith('[') && val.endsWith(']')) {
      const inner = val.slice(1, -1).trim()
      if (inner === '') {
        val = []
      } else {
        val = inner
          .split(',')
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean)
      }
    } else if (val === 'true') val = true
    else if (val === 'false') val = false
    data[key] = val
  }
  return { data, content: body }
}

async function ensureTag(payloadFetch: typeof fetch, name: string): Promise<number> {
  const list = await payloadFetch(
    `${PAYLOAD_URL}/api/tags?where[name][equals]=${encodeURIComponent(name)}`,
  )
  const json = (await list.json()) as { docs?: Array<{ id: number }> }
  if (json.docs?.[0]) return json.docs[0].id
  const created = await payloadFetch(`${PAYLOAD_URL}/api/tags`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, slug: name.toLowerCase().replace(/\s+/g, '-') }),
  })
  if (!created.ok) {
    const errText = await created.text().catch(() => '')
    console.error(`[tag-fail] ensureTag(${name}): ${created.status} ${errText}`)
    return 0
  }
  const cjson = (await created.json()) as { doc?: { id: number }; id?: number }
  return cjson.doc?.id ?? cjson.id ?? 0
}

async function ensureAuthor(payloadFetch: typeof fetch, name: string, body: string): Promise<number> {
  const slug = name.toLowerCase().replace(/\s+/g, '-')
  const payload = await payloadFetch(`${PAYLOAD_URL}/api/authors?where[slug][equals]=${slug}`)
  const json = (await payload.json()) as { docs?: Array<{ id: number }> }
  if (json.docs?.[0]) return json.docs[0].id
  const created = await payloadFetch(`${PAYLOAD_URL}/api/authors`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, slug, body }),
  })
  if (!created.ok) {
    const errText = await created.text().catch(() => '')
    console.error(`[author-fail] ensureAuthor(${name}): ${created.status} ${errText}`)
    return 0
  }
  const cjson = (await created.json()) as { doc?: { id: number }; id?: number }
  return cjson.doc?.id ?? cjson.id ?? 0
}

async function ensureBiome(payloadFetch: typeof fetch, slug: string, name: string, spriteKey: string): Promise<number> {
  const found = await payloadFetch(`${PAYLOAD_URL}/api/biomes?where[slug][equals]=${slug}`)
  const fjson = (await found.json()) as { docs?: Array<{ id: number }> }
  if (fjson.docs?.[0]) return fjson.docs[0].id
  const created = await payloadFetch(`${PAYLOAD_URL}/api/biomes`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ slug, name, spriteKey, description: '' }),
  })
  if (!created.ok) {
    const errText = await created.text().catch(() => '')
    console.error(`[biome-fail] ensureBiome(${slug}): ${created.status} ${errText}`)
    return 0
  }
  const cjson = (await created.json()) as { doc?: { id: number }; id?: number }
  return cjson.doc?.id ?? cjson.id ?? 0
}

async function importBlogFile(file: string, map: MapFile, force: boolean) {
  const filePath = path.join(BLOG_DIR, file)
  const buf = await readFile(filePath)
  const stat = await import('node:fs/promises').then((m) => m.stat(filePath))
  const hash = await sha256(buf)
  const key = `blog:${file}`
  const existing = map[key]
  if (
    !force &&
    existing &&
    existing.hash === hash &&
    existing.size === stat.size &&
    existing.payloadId
  ) {
    console.log(`[skip] ${file} (unchanged)`)
    return
  }

  const { data, content } = parseFrontmatter(buf.toString('utf-8'))
  const title = String(data.title ?? file.replace(/\.md$/, ''))
  const slug = String(data.slug ?? file.replace(/\.md$/, ''))
  const date = String(data.date ?? new Date().toISOString().slice(0, 10))
  const draft = data.draft === true
  const tags = Array.isArray(data.tags) ? (data.tags as string[]) : []
  const summary = data.summary ? String(data.summary) : undefined

  const tagIds: number[] = []
  for (const t of tags) {
    const id = await ensureTag(fetch, String(t))
    if (id === 0) {
      console.warn(`[warn] tag lookup/insert failed for "${t}"`)
    }
    tagIds.push(id)
  }
  const validTagIds = tagIds.filter((id) => id > 0)
  console.log(`  → ${tags.length} tag(s) requested, ${validTagIds.length} resolved`)

  // Tag-to-biome mapping (duplicated from packages/config; intentionally simple — server runs before the web workspace symlink is wired)
const biomeMap: Record<string, string> = {
    docker: 'workshop',
    lvm: 'workshop',
    'net-reset': 'workshop',
    zerotier: 'workshop',
    upstream: 'workshop',
    dwm: 'workshop',
    stow: 'workshop',
    vfox: 'workshop',
    database: 'workshop',
    backend: 'workshop',
    frontend: 'workshop',
    homelab: 'workshop',
    devex: 'workshop',
    maintenance: 'workshop',
    datax: 'town',
    maven: 'town',
    jdk9: 'town',
    postcss: 'town',
    unocss: 'town',
    v8: 'town',
    asdf: 'town',
    'npm-package': 'town',
    'vim-text-object': 'town',
    aspnet: 'mountain',
    'github-http2': 'mountain',
    nginx: 'beach',
    'docker-network': 'beach',
    'learn-dockerfile': 'forest',
    'inspect-mvn-dep': 'forest',
  }
  // Pick the first tag that maps to a known biome. Falls back to 'wilderness'.
  const biomeSlug =
    tags.map((t) => biomeMap[String(t)]).find((b) => typeof b === 'string') ??
    'wilderness'
const biomeId = await ensureBiome(fetch, biomeSlug, biomeSlug[0].toUpperCase() + biomeSlug.slice(1), biomeSlug)

// Author: default for now
  const authorId = await ensureAuthor(fetch, 'John Xu', '')

  console.log(`  → biomeId=${biomeId} authorId=${authorId}`)

  const payload = {
    title,
    slug,
    status: draft ? 'draft' : 'published',
    date,
    summary,
    tags: validTagIds,
    biome: biomeId > 0 ? biomeId : undefined,
    authors: authorId > 0 ? [authorId] : [],
    locale: 'cn',
    content: { markdown: content },
    layout: 'PostSimple',
  }

  const res = await fetch(`${PAYLOAD_URL}/api/blogs?draft=true&fallbackLocale=cn`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    console.error(`[fail] ${file}: ${res.status} ${text}`)
    return
  }
  const created = (await res.json()) as { doc?: { id: number | string }; id?: number | string }
  const id = created.doc?.id ?? created.id ?? null

  map[key] = {
    source: file,
    mtime: stat.mtime.toISOString(),
    size: stat.size,
    hash,
    payloadId: id,
    kind: 'blog',
  }
  console.log(`[ok] ${file} -> #${id}`)
}

async function importAuthorFile(file: string) {
  const filePath = path.join(AUTHOR_DIR, file)
  const buf = await readFile(filePath, 'utf-8')
  const { data, content } = parseFrontmatter(buf)
  const name = String(data.name ?? file.replace(/\.mdx?$/, ''))
  await ensureAuthor(fetch, name, content)
}

async function main() {
  if (!process.env.RUN_MIGRATION) {
    console.log('[mdImport] RUN_MIGRATION not set; refusing to run. Set RUN_MIGRATION=true or pass --force.')
    process.exit(0)
  }

  const map = await loadMap()

  if (!existsSync(BLOG_DIR)) {
    console.error(`[mdImport] blog dir not found: ${BLOG_DIR}`)
    process.exit(1)
  }

  const blogFiles = (await readdir(BLOG_DIR)).filter((f) => /\.md$/.test(f))
  for (const f of blogFiles) {
    try {
      await importBlogFile(f, map, FORCE)
    } catch (err) {
      console.error(`[err] ${f}`, err)
    }
  }

  if (existsSync(AUTHOR_DIR)) {
    const authorFiles = (await readdir(AUTHOR_DIR)).filter((f) => /\.mdx?$/.test(f))
    for (const f of authorFiles) {
      try {
        await importAuthorFile(f)
      } catch (err) {
        console.error(`[err] ${f}`, err)
      }
    }
  }

  await saveMap(map)
  console.log(`[done] map written to ${MAP_PATH}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

