export interface Site {
  title: string
  author: string
  description: string
  siteUrl: string
  siteRepo: string
  siteLogo: string
  socialBanner: string
  email: string
  github: string
  locale: 'cn'
  theme: 'system' | 'dark' | 'light'
  comments: {
    provider: 'giscus'
    giscusConfig: {
      repo: string | undefined
      repositoryId: string | undefined
      category: string | undefined
      categoryId: string | undefined
      mapping: string
      reactions: string
      metadata: string
      theme: string
      darkTheme: string
      lang: string
    }
  }
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: string | undefined
    }
  }
}

const site: Site = {
  title: 'Exploring multimodal interaction with AI',
  author: 'John Xu',
  description:
    'Explore the world of technology as a professional senior software engineer. Find technical passages, instructional videos, and innovative software projects.',
  siteUrl: 'https://www.jxdev.me',
  siteRepo: 'https://github.com/johnxu16/blog-tail',
  siteLogo: '/static/images/logo.png',
  socialBanner: '/static/images/twitter-card.png',
  email: 'bringerxu@163.com',
  github: 'https://github.com/johnxu16',
  locale: 'cn',
  theme: 'system',
  comments: {
    provider: 'giscus',
    giscusConfig: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      lang: 'en',
    },
  },
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: process.env.NEXT_PUBLIC_UMAMI_ID,
    },
  },
}

export default site
