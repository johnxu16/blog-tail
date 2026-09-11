import type { CollectionConfig } from 'payload/dist/collections/config/types'

export const Author: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'occupation', 'company'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'avatar', type: 'text' },
    { name: 'occupation', type: 'text' },
    { name: 'company', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'twitter', type: 'text' },
    { name: 'linkedin', type: 'text' },
    { name: 'github', type: 'text' },
    {
      name: 'body',
      type: 'textarea',
      admin: { description: 'Legacy markdown body (used until Lexical conversion lands).' },
    },
  ],
}
