import type { Metadata } from 'next'
import site from '@blog/config/site'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export function genPageMetadata({ title, description, image, ...rest }: PageSEOProps): Metadata {
  return {
    title,
    openGraph: {
      title: `${title} | ${site.title}`,
      description: description || site.description,
      url: './',
      siteName: site.title,
      images: image ? [image] : [site.socialBanner],
      locale: 'zh_CN',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${site.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [site.socialBanner],
    },
    ...rest,
  }
}
