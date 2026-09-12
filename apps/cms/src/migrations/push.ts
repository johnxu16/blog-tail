import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../payload.config.js'

async function main() {
  const p = await getPayload({
    config,
    secret: process.env.PAYLOAD_SECRET || 'dev-only-not-secret',
  })

  console.log('[push] running db migrate (fresh)...')
  // Force-migrate: drops the schema and recreates from collection definitions.
  // For MVP1 dev only. Production must use versioned migrations.
  try {
    // payload.db.migrateFresh internally invokes prompts unless to
    // forceAcceptWarning is true; it's a (() => Promise<void>) factory.
    const migrateFn = p.db.migrateFresh as unknown as (opts?: {
      forceAcceptWarning?: boolean
    }) => Promise<void>
    await migrateFn.call(p.db, { forceAcceptWarning: true })
  } catch (err) {
    console.error('[push] migrate failed', err)
    process.exit(1)
  }

  console.log('[push] done.')
  process.exit(0)
}

main()