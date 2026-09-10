import VimMenu from '@/components/VimMenu'
import { lazy, Suspense } from 'react'

const items = [{ label: 'Option 1' }, { label: 'Option 2' }, { label: 'Option 3' }]

const DisplacementSphere = lazy(() =>
  import('@/components/displacement-sphere/displacement-sphere').then((module) => ({
    default: module.DisplacementSphere,
  }))
)

export default async function Page() {
  return (
    <section className="relative h-screen w-screen overflow-x-hidden">
      <Suspense>
        <DisplacementSphere />
      </Suspense>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-8 text-4xl">
        {/* TODO: add typewriter effect */}
        <div>John Xu</div>
        <div>Explore the world with curiosity and creativity</div>
        <div>
          {/* TODO: add retro-game style text with background glitched text */}
          <VimMenu items={items} />
        </div>
      </div>
    </section>
  )
}
