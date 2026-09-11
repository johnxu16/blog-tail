'use client'

import { useState } from 'react'
import site from '@blog/config/site'

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)

  if (!site.comments?.provider) {
    return null
  }

  if (site.comments.provider !== 'giscus') {
    return null
  }

  const cfg = site.comments.giscusConfig

  const theme =
    typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
      ? cfg.darkTheme
      : cfg.theme

  return (
    <>
      {loadComments ? (
        <script
          src="https://giscus.app/client.js"
          data-repo={cfg.repo}
          data-repo-id={cfg.repositoryId}
          data-category={cfg.category}
          data-category-id={cfg.categoryId}
          data-mapping={cfg.mapping}
          data-reactions-enabled={cfg.reactions}
          data-emit-metadata={cfg.metadata}
          data-theme={theme}
          data-lang={cfg.lang}
          data-input-position="top"
          crossOrigin="anonymous"
          async
        />
      ) : (
        <button onClick={() => setLoadComments(true)}>Load Comments</button>
      )}
    </>
  )
}
