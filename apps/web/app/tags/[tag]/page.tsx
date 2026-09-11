import { slug } from 'github-slugger'
import { fetchAllPosts, fetchAllTags, fetchPostsByTag } from '@/lib/api'
import { allCoreContent, sortPosts } from '@/lib/posts'
import site from '@blog/config/site'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { genPageMetadata } from 'app/seo'
import type { Metadata } from 'next'
import { Parallax } from '@/components/Parallax'
import { Glass } from '@/components/Glass'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${site.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${site.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export async function generateStaticParams() {
  try {
    const tags = await fetchAllTags()
    return Object.keys(tags).map((tag) => ({ tag: encodeURI(tag) }))
  } catch (err) {
    console.warn(
      '[tags/[tag] generateStaticParams] API unreachable, falling back to dynamic render',
      err
    )
    return []
  }
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURI(params.tag)
  const title = tag[0]?.toUpperCase() + tag.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(await fetchPostsByTag(tag)).filter((post) =>
      (post.tags ?? []).map((t) => slug(t)).includes(tag)
    )
  )
  const tagCounts = Object.entries(await fetchAllTags()).map(([s, count]) => ({
    slug: s,
    count,
  }))
  return <ListLayout posts={filteredPosts} title={title} tagCounts={tagCounts} />
}
