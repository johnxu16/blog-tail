import { ReactNode } from 'react'
import { formatDate } from '@/lib/formatDate'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import { Glass } from '@/components/Glass'
import { Parallax } from '@/components/Parallax'
import site from '@blog/config/site'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

export interface PostNav {
  path: string
  title: string
}

interface LayoutProps {
  content: { slug: string; path?: string; date: string; title: string }
  children: ReactNode
  next?: PostNav
  prev?: PostNav
}

export default function PostSimple({ content, next, prev, children }: LayoutProps) {
  const { slug, date, title } = content

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <header>
            <Parallax offset={30}>
              <Glass className="mx-auto mb-6 max-w-3xl px-6 py-8 text-center">
                <dl>
                  <div>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>{formatDate(date, site.locale)}</time>
                    </dd>
                  </div>
                </dl>
                <div className="mt-2">
                  <PageTitle>{title}</PageTitle>
                </div>
              </Glass>
            </Parallax>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:divide-y-0 dark:divide-gray-700">
            <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
              <div className="prose dark:prose-invert max-w-none pb-8 pt-10">{children}</div>
            </div>
            <div className="pb-6 pt-6 text-center" id="comment">
              <Comments slug={slug} />
            </div>
            <footer>
              <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                {prev && prev.path && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/blog/${prev.path}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label={`Previous post: ${prev.title}`}
                    >
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {next && next.path && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/blog/${next.path}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label={`Next post: ${next.title}`}
                    >
                      {next.title} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
