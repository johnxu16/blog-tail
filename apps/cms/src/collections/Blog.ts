import type { CollectionConfig } from 'payload/dist/collections/config/types'
import { aiAssistHook } from '../hooks/aiAssist.js'

export const Blog: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'date', 'updatedAt'],
  },
  access: {
    read: () => true,
    // First-boot migration runs as an unauthenticated POST gated by RUN_MIGRATION=true.
    // Once the admin UI ships, tighten these to require an authenticated user.
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL slug. Stable across migrations.' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Review', value: 'review' },
        { label: 'Published', value: 'published' },
      ],
      required: true,
      index: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'lastmod',
      type: 'date',
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'images',
      type: 'json',
    },
    {
      name: 'bibliography',
      type: 'text',
    },
    {
      name: 'canonicalUrl',
      type: 'text',
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'PostSimple',
      options: [
        { label: 'PostSimple', value: 'PostSimple' },
        { label: 'PostLayout', value: 'PostLayout' },
        { label: 'PostBanner', value: 'PostBanner' },
      ],
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'biome',
      type: 'relationship',
      relationTo: 'biomes',
    },
    {
      name: 'locale',
      type: 'text',
      defaultValue: 'cn',
      required: true,
    },
    {
      name: 'content',
      type: 'group',
      fields: [
        {
          name: 'markdown',
          type: 'textarea',
          admin: {
            description: 'Legacy markdown body. Used when lexical is empty.',
            condition: (data: { content?: { lexical?: unknown } }) => !data?.content?.lexical,
          },
        },
        {
          name: 'lexical',
          type: 'json',
          admin: {
            description: 'Lexical editor state. Used when markdown is empty.',
          },
        },
      ],
    },
    {
      name: 'aiRequest',
      type: 'group',
      admin: {
        description: 'Mark a field to request AI assist on the next save.',
      },
      fields: [
        {
          name: 'tags',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'summary',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'slug',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'aiSuggestions',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Cached AI suggestions. Author must accept or reject via the admin UI.',
      },
      fields: [
        {
          name: 'tags',
          type: 'json',
        },
        {
          name: 'summary',
          type: 'text',
        },
        {
          name: 'slug',
          type: 'text',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [aiAssistHook],
  },
}
