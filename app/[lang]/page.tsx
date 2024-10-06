import { allCoreContent, sortPosts } from 'util/contentLayer'
import { allBlogs } from 'contentlayer/generated'
import Main from '../Main'

export default async function Page({ params: { lang } }) {
  const sortedPosts = sortPosts(allBlogs, lang)
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} />
}
