import express from 'express'
import cors from 'cors'
import payload from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import config from '../payload.config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
  const app = express()

  app.use(cors())
  app.get('/healthz', (_req, res) => res.json({ ok: true }))

  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'dev-only-not-secret',
    express: app,
    config,
  })

  app.listen(Number(process.env.PORT || 3001), () => {
    payload.logger.info(`cms listening on :${process.env.PORT || 3001}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
