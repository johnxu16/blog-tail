import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import { buildConfig } from 'payload/dist/config/build.js'
import { postgresAdapter } from '@payloadcms/db-postgres'

const require = createRequire(import.meta.url)
const { lexicalEditor } = require('@payloadcms/richtext-lexical') as {
  lexicalEditor: (props?: Record<string, unknown>) => unknown
}

import { Blog } from './src/collections/Blog.js'
import { Tag } from './src/collections/Tag.js'
import { Author } from './src/collections/Author.js'
import { Biome } from './src/collections/Biome.js'
import { Users } from './src/collections/Users.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    meta: { titleSuffix: ' — John Xu CMS' },
    // Admin UI is shipped as a webpack bundle that Payload normally compiles at
    // boot. On a standalone Express + tsx setup that bundler isn't wired up, so
    // the admin routes 500 with "bundler.dev is undefined". REST API still works,
    // which is all the first-boot migration needs. The full admin UI ships with
    // a later MVP (separate Next.js handler, or build the admin bundle first).
    disable: true,
  },
  collections: [Users, Blog, Tag, Author, Biome],
  editor: lexicalEditor({}) as never,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // MVP 1: dev-only schema push. Replace with explicit `payload migrate`
    // before going to prod so destructive column changes don't auto-apply.
    push: true,
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
})
