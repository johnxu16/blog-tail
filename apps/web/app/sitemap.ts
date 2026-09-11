import { MetadataRoute } from 'next'
import site from '@blog/config/site'
import { fetchAllPosts } from '@/lib/api'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = site.siteUrl
  const posts = await fetchAllPosts()

  const blogRoutes = posts
    .filter((post) => !post.draft && post.status !== 'draft')
    .map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    }))

  const routes = ['', 'blog', 'projects', 'tags'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes]
}
