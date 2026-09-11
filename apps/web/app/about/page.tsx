import AuthorLayout from '@/layouts/AuthorLayout'
import LegacyMarkdown from '@/components/post/LegacyMarkdown'
import { genPageMetadata } from 'app/seo'
import { fetchAuthorBySlug } from '@/lib/api'

export const dynamic = 'force-dynamic'

export const metadata = genPageMetadata({ title: 'About' })

export default async function Page() {
  const authorRaw = (await fetchAuthorBySlug('default')) as {
    name?: string
    avatar?: string
    occupation?: string
    company?: string
    email?: string
    twitter?: string
    linkedin?: string
    github?: string
    body?: string
  } | null

  const content = {
    name: authorRaw?.name ?? 'John Xu',
    avatar: authorRaw?.avatar,
    occupation: authorRaw?.occupation,
    company: authorRaw?.company,
    email: authorRaw?.email,
    twitter: authorRaw?.twitter,
    linkedin: authorRaw?.linkedin,
    github: authorRaw?.github,
  }

  return (
    <>
      <AuthorLayout content={content}>
        <LegacyMarkdown markdown={authorRaw?.body ?? ''} />
      </AuthorLayout>
    </>
  )
}
