import Main from './Main'
import { fetchAllPosts } from '@/lib/api'
import { sortPosts } from '@/lib/posts'

export const dynamic = 'force-dynamic'

const MAX_DISPLAY = 5

export default async function Page() {
  const posts = sortPosts(await fetchAllPosts()).slice(0, MAX_DISPLAY)
  return <Main posts={posts} />
}
