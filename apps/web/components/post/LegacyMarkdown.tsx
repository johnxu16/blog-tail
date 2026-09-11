import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

export interface LegacyMarkdownProps {
  markdown: string
}

marked.setOptions({ gfm: true, breaks: false })

export default function LegacyMarkdown({ markdown }: LegacyMarkdownProps) {
  const html = marked.parse(markdown ?? '', { async: false }) as string
  const clean = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel'],
  })
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
