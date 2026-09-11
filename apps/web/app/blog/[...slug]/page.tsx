import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { fetchAllPosts, fetchPostBySlug } from '@/lib/api'
import { allCoreContent, sortPosts } from '@/lib/posts'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import LegacyMarkdown from '@/components/post/LegacyMarkdown'
import Lexical from '@/components/post/Lexical'
import site from '@blog/config/site'

export const dynamic = 'force-dynamic'

const defaultLayout = 'PostSimple'
const layouts = { PostSimple, PostLayout, PostBanner }

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join('/'))
  const post = await fetchPostBySlug(slug)
  if (!post) return

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  let imageList = [site.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => ({
    url: img.includes('http') ? img : site.siteUrl + img,
  }))

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: site.title,
      locale: 'zh_CN',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: post.authors?.length ? post.authors : [site.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export async function generateStaticParams() {
  try {
    const posts = await fetchAllPosts()
    return posts.map((p) => ({ slug: p.slug.split('/') }))
  } catch (err) {
    console.warn(
      '[blog/[...slug] generateStaticParams] API unreachable, falling back to dynamic render',
      err
    )
    return []
  }
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))
  const summaries = allCoreContent(sortPosts(await fetchAllPosts()))
  const postIndex = summaries.findIndex((p) => p.slug === slug)
  if (postIndex === -1) return notFound()

  const prev = summaries[postIndex + 1]
  const next = summaries[postIndex - 1]
  const post = await fetchPostBySlug(slug)
  if (!post) return notFound()

  const Layout = layouts[(post.layout as keyof typeof layouts) || defaultLayout]

  return (
    <Layout
      content={post}
      authorDetails={[]}
      next={next ? { path: next.slug, title: next.title } : undefined}
      prev={prev ? { path: prev.slug, title: prev.title } : undefined}
    >
      {post.content?.lexical ? (
        <Lexical state={post.content.lexical} />
      ) : (
        <LegacyMarkdown markdown={post.content?.markdown ?? ''} />
      )}
    </Layout>
  )
}
