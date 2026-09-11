export interface Biome {
  slug: string
  name: string
  spriteKey: string
  description: string
}

export const biomes: Biome[] = [
  { slug: 'forest', name: 'Forest', spriteKey: 'forest', description: 'Deep roots and patient study.' },
  { slug: 'beach', name: 'Beach', spriteKey: 'beach', description: 'Where wires meet the tide.' },
  { slug: 'town', name: 'Town', spriteKey: 'town', description: 'Tools, editors, and daily craft.' },
  { slug: 'mountain', name: 'Mountain', spriteKey: 'mountain', description: 'Steep climbs, sharper hindsight.' },
  { slug: 'workshop', name: 'Workshop', spriteKey: 'workshop', description: 'Bits, kernels, and plumbing.' },
  { slug: 'wilderness', name: 'Wilderness', spriteKey: 'wilderness', description: 'Anything that does not fit a biome yet.' },
]

export const allBiomeSlugs = biomes.map((b) => b.slug)

const tagToBiomeMap: Record<string, string> = {
  // Workshop — bits, kernels, plumbing
  docker: 'workshop',
  lvm: 'workshop',
  'net-reset': 'workshop',
  zerotier: 'workshop',
  upstream: 'workshop',
  dwm: 'workshop',
  stow: 'workshop',
  vfox: 'workshop',
  // Town — tools, editors, daily craft
  datax: 'town',
  maven: 'town',
  jdk9: 'town',
  postcss: 'town',
  unocss: 'town',
  v8: 'town',
  asdf: 'town',
  'npm-package': 'town',
  'vim-text-object': 'town',
  // Mountain — steep climbs, sharper hindsight
  aspnet: 'mountain',
  'github-http2': 'mountain',
  // Beach — where wires meet the tide
  nginx: 'beach',
  'docker-network': 'beach',
  // Forest — deep roots and patient study
  'learn-dockerfile': 'forest',
  'inspect-mvn-dep': 'forest',
  // database / backend / frontend / homelab / devex / maintenance — toss into workshop by default
  database: 'workshop',
  backend: 'workshop',
  frontend: 'workshop',
  homelab: 'workshop',
  devex: 'workshop',
  maintenance: 'workshop',
}

export function tagToBiome(tag: string): string {
  return tagToBiomeMap[tag] ?? 'wilderness'
}
