import type { BeforeChangeHook } from 'payload/dist/collections/config/types'

interface AiSuggestion {
  tags?: string[]
  summary?: string
  slug?: string
}

const SUGGESTION_SYSTEM_PROMPT = `You are a writing assistant for a personal tech blog.
Output strict JSON only, matching the requested shape.`

async function generate(provider: string, model: string, prompt: string): Promise<string> {
  if (provider === 'openai') {
    const { openai } = await import('@ai-sdk/openai')
    const { generateText } = await import('ai')
    const { text } = await generateText({
      model: openai(model),
      prompt,
      system: SUGGESTION_SYSTEM_PROMPT,
    })
    return text
  }
  if (provider === 'anthropic') {
    const { anthropic } = await import('@ai-sdk/anthropic')
    const { generateText } = await import('ai')
    const { text } = await generateText({
      model: anthropic(model),
      prompt,
      system: SUGGESTION_SYSTEM_PROMPT,
    })
    return text
  }
  throw new Error(`Unknown AI provider: ${provider}`)
}

function parseJsonSafe<T>(raw: string): T | null {
  const trimmed = raw.trim().replace(/^```json/i, '').replace(/```$/g, '').trim()
  try {
    return JSON.parse(trimmed) as T
  } catch {
    return null
  }
}

export const aiAssistHook: BeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  const request = (data as { aiRequest?: { tags?: boolean; summary?: boolean; slug?: boolean } })
    .aiRequest
  if (!request || operation !== 'update' && operation !== 'create') return data

  const provider = process.env.AI_PROVIDER || 'openai'
  const model = process.env.AI_MODEL || 'gpt-4o-mini'
  const apiKey = process.env.AI_API_KEY
  if (!apiKey) {
    req.payload.logger.warn('[ai-assist] AI_API_KEY not set; skipping suggestions')
    return data
  }

  const suggestions: AiSuggestion = (data as { aiSuggestions?: AiSuggestion }).aiSuggestions ?? {}

  const title = String((data as { title?: string }).title ?? '')
  const body =
    String((data as { content?: { markdown?: string } }).content?.markdown ?? '').slice(0, 4000) ||
    JSON.stringify((data as { content?: { lexical?: unknown } }).content?.lexical ?? {}).slice(0, 4000)

  if (request.tags) {
    try {
      const raw = await generate(
        provider,
        model,
        `Suggest up to 5 short, kebab-case tags for this post. Title: "${title}". Body excerpt: ${body.slice(0, 800)}\nReply with JSON: {"tags": ["tag-1", "tag-2"]}`,
      )
      const parsed = parseJsonSafe<{ tags?: string[] }>(raw)
      if (parsed?.tags) suggestions.tags = parsed.tags
    } catch (err) {
      req.payload.logger.error({ msg: '[ai-assist] tag suggestion failed', err: String(err) })
    }
  }

  if (request.summary) {
    try {
      const raw = await generate(
        provider,
        model,
        `Write a 1-2 sentence summary in Chinese (or English if the post is in English). Title: "${title}". Body excerpt: ${body.slice(0, 1200)}\nReply with JSON: {"summary": "..."}`,
      )
      const parsed = parseJsonSafe<{ summary?: string }>(raw)
      if (parsed?.summary) suggestions.summary = parsed.summary
    } catch (err) {
      req.payload.logger.error({ msg: '[ai-assist] summary failed', err: String(err) })
    }
  }

  if (request.slug) {
    try {
      const raw = await generate(
        provider,
        model,
        `Propose a URL-safe kebab-case slug for this post (max 60 chars). Title: "${title}".\nReply with JSON: {"slug": "the-slug"}`,
      )
      const parsed = parseJsonSafe<{ slug?: string }>(raw)
      if (parsed?.slug) suggestions.slug = parsed.slug
    } catch (err) {
      req.payload.logger.error({ msg: '[ai-assist] slug failed', err: String(err) })
    }
  }

  return { ...data, aiSuggestions: suggestions, aiRequest: { tags: false, summary: false, slug: false } }
}
