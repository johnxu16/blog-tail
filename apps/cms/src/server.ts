import express from 'express'
import cors from 'cors'
import payload from 'payload'
import config from '../payload.config.js'

const PORT = Number(process.env.PORT || 3001)

async function main() {
  const app = express()

  app.use(cors())
  app.get('/healthz', (_req, res) => res.json({ ok: true }))

  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'dev-only-not-secret',
    express: app,
    config,
  })

  app.listen(PORT, () => {
    payload.logger.info(`cms listening on :${PORT}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
