import type { CollectionConfig } from 'payload/dist/collections/config/types'

export const Biome: CollectionConfig = {
  slug: 'biomes',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'spriteKey', 'postCount'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'spriteKey',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'postCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          const url = process.env.PAYLOAD_API_INTERNAL_URL || 'http://api:3002'
          await fetch(`${url}/cache/invalidate`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ kind: 'biome', slug: doc.slug }),
          })
        } catch (err) {
          console.warn('[biome afterChange] cache invalidate failed', err)
        }
        return doc
      },
    ],
  },
}
