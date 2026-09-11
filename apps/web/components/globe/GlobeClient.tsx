'use client'

import dynamic from 'next/dynamic'
import type { GlobeHotspot } from './Globe'

const GlobeScene = dynamic(() => import('./Globe'), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-square w-full max-w-2xl items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-900">
      <span className="text-sm text-gray-500">Loading globe…</span>
    </div>
  ),
})

export interface GlobeProps {
  hotspots: GlobeHotspot[]
}

export default function Globe({ hotspots }: GlobeProps) {
  return <GlobeScene hotspots={hotspots} />
}
