import { allCoreContent, getBlogByLang, sortPosts } from 'util/contentLayer'
import { allBlogs } from 'contentlayer/generated'
import Main from '../Main'

export default async function Page({ params: { lang } }) {
  const sortedPosts = sortPosts(getBlogByLang(allBlogs, lang))
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} />
}
