import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload/dist/config/build.js'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Blog } from './src/collections/Blog.js'
import { Tag } from './src/collections/Tag.js'
import { Author } from './src/collections/Author.js'
import { Biome } from './src/collections/Biome.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    meta: { titleSuffix: ' — John Xu CMS' },
  },
  collections: [Blog, Tag, Author, Biome],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
})
