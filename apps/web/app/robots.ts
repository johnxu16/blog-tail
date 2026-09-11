import { MetadataRoute } from 'next'
import site from '@blog/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${site.siteUrl}/sitemap.xml`,
    host: site.siteUrl,
  }
}
