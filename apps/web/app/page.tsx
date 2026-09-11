import nextDynamic from 'next/dynamic'
import { fetchBiomes, fetchAllPosts } from '@/lib/api'
import { sortPosts } from '@/lib/posts'
import { Glass } from '@/components/Glass'
import { Parallax } from '@/components/Parallax'
import Link from '@/components/Link'

export const dynamic = 'force-dynamic'

const MAX_DISPLAY = 5
const GLOBE_BUDGET_KB = 200

const Globe = nextDynamic(() => import('@/components/globe/GlobeClient'), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-square w-full max-w-2xl items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-900">
      <span className="text-sm text-gray-500">Loading globe…</span>
    </div>
  ),
})

export default async function HomePage() {
  let hotspots: Awaited<ReturnType<typeof fetchBiomes>> = []
  let posts: Awaited<ReturnType<typeof fetchAllPosts>> = []
  try {
    ;[hotspots, posts] = await Promise.all([fetchBiomes(), fetchAllPosts()])
  } catch (err) {
    console.warn('[home] API unreachable; rendering empty globe', err)
  }

  const globeHotspots = hotspots.map((b) => ({
    slug: b.slug,
    name: b.name,
    description: b.description,
    postCount: b.postCount ?? 0,
  }))

  const featured = sortPosts(posts).slice(0, MAX_DISPLAY)

  return (
    <div className="space-y-12">
      <Parallax offset={40}>
        <Glass className="mx-auto max-w-3xl px-6 py-8 text-center">
          <h1 className="md:leading-14 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl dark:text-gray-100">
            Latest
          </h1>
          <p className="mt-3 text-base leading-7 text-gray-500 dark:text-gray-400">
            Pick a biome on the globe below to wander into.
          </p>
        </Glass>
      </Parallax>

      <div className="flex justify-center">
        <Globe hotspots={globeHotspots} />
      </div>

      <p className="text-center text-xs text-gray-400 dark:text-gray-600">
        Homepage globe budget: <span className="font-mono">{`< ${GLOBE_BUDGET_KB} kB gzip`}</span>
      </p>

      <section className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent dispatches</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!featured.length && <li className="py-4 text-gray-500">No posts yet.</li>}
          {featured.map((post) => (
            <li key={post.slug} className="py-4">
              <Link
                href={`/blog/${post.slug}`}
                className="hover:text-primary-500 text-lg font-semibold text-gray-900 dark:text-gray-100"
              >
                {post.title}
              </Link>
              <div className="text-sm text-gray-500">{post.date}</div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{post.summary}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
