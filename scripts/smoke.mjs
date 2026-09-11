#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
process.chdir(ROOT)

const checks = []
function record(name, ok, detail = '') {
  checks.push({ name, ok, detail })
  const tag = ok ? '\u001b[32mPASS\u001b[0m' : '\u001b[31mFAIL\u001b[0m'
  console.log(`${tag}  ${name}${detail ? `\n      ${detail}` : ''}`)
}

function run(label, cmd, args, opts = {}) {
  const startedAt = Date.now()
  const useShell = process.platform === 'win32'
  const r = spawnSync(cmd, args, {
    cwd: opts.cwd ?? ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, ...(opts.env ?? {}) },
    timeout: opts.timeout ?? 180_000,
    shell: useShell,
  })
  const ms = Date.now() - startedAt
  if (r.error) {
    record(label, false, `${r.error.message} (${ms}ms)`)
    return { ok: false, stdout: r.stdout, stderr: r.stderr, code: -1 }
  }
  const ok = opts.expect ?? (r.status === 0)
  const tail = (s) => (s || '').split('\n').slice(-5).join('\n')
  record(label, ok, `exit=${r.status} (${ms}ms)${ok ? '' : `\n      stdout:\n${tail(r.stdout)}\n      stderr:\n${tail(r.stderr)}`}`)
  return { ok, stdout: r.stdout, stderr: r.stderr, code: r.status }
}

function runYarn(args, opts = {}) {
  return run(`yarn ${args.join(' ')}`, 'yarn', args, opts)
}

console.log('=== blog-tail smoke test ===\n')

// 1. Workspace resolution
const ws = runYarn(['workspaces', 'list', '--json'], { timeout: 30_000 })
let wsCount = 0
try {
  const lines = (ws.stdout || '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('{'))
  for (const line of lines) {
    try {
      const obj = JSON.parse(line)
      if (obj.location && /(\bapps|\bpackages)\/(web|cms|api|config)$/.test(obj.location)) {
        wsCount++
      }
    } catch {}
  }
} catch {}
record('Yarn workspaces resolve (4 expected)', ws.ok && wsCount === 4, `found ${wsCount}`)

// 2. apps/web lint
runYarn(['workspace', 'web', 'lint'], { timeout: 120_000 })

// 3. apps/web build
const buildWeb = runYarn(['workspace', 'web', 'build'], { timeout: 300_000 })

// 4. apps/api typecheck
runYarn(['workspace', 'api', 'exec', '--', 'tsc', '--noEmit'], { timeout: 120_000 })

// 5. apps/cms typecheck
const cmsType = runYarn(['workspace', 'cms', 'exec', '--', 'tsc', '--noEmit'], { timeout: 180_000 })
record('apps/cms tsc --noEmit', cmsType.ok)

// 6. packages/config typecheck (npx directly since it's a sub-package without scripts)
const cfgType = run('packages/config tsc --noEmit', 'npx', ['--no-install', 'tsc', '--noEmit'], {
  cwd: `${ROOT}packages/config`,
  timeout: 60_000,
})
record('packages/config tsc --noEmit', cfgType.ok)

// 7. Docker compose config validation (doesn't require daemon)
const composeCheck = run(
  'docker compose config',
  'docker',
  ['compose', '--project-directory', ROOT, 'config'],
  { timeout: 30_000 },
)
record('docker compose config validates', composeCheck.ok)

// 8. CI workflow YAML validity
const ciCheck = await (async () => {
  try {
    const { createRequire } = await import('node:module')
    const require = createRequire(import.meta.url)
    const fs = require('node:fs')
    const yaml = require('yaml')
    const doc = yaml.parse(
      fs.readFileSync(`${ROOT}.github/workflows/docker-image.yml`, 'utf8'),
    )
    if (!doc?.jobs?.build?.strategy) throw new Error('missing jobs.build.strategy')
    const include = doc.jobs.build.strategy.matrix?.include
    if (!Array.isArray(include) || include.length !== 3) {
      throw new Error('expected 3 matrix entries')
    }
    const tags = include.map((e) => e.tag).join(',')
    return { ok: true, message: `tags=${tags}` }
  } catch (err) {
    return { ok: false, message: String(err) }
  }
})()
record('CI workflow has 3-image matrix', ciCheck.ok, ciCheck.message ?? '')

// 9. apps/api runtime smoke
console.log('\n--- runtime: apps/api ---')
const apiProc = spawn('npx', ['--no-install', 'tsx', 'apps/api/src/index.ts'], {
  cwd: ROOT,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env },
  shell: process.platform === 'win32',
  detached: !process.platform.startsWith('win'), // POSIX: own process group
})

let apiLog = ''
apiProc.stdout.on('data', (d) => (apiLog += d.toString()))
apiProc.stderr.on('data', (d) => (apiLog += d.toString()))

let apiOk = false
let biomesOk = false
let healthBody = ''
let biomesBody = ''
try {
  await sleep(4_000)
  const hRes = await fetch('http://127.0.0.1:3002/healthz').catch((err) => ({ error: String(err) }))
  if (hRes && typeof hRes === 'object' && 'status' in hRes) {
    healthBody = await hRes.text()
    apiOk = hRes.status === 200 && healthBody.includes('"ok":true')
  }
  const bRes = await fetch('http://127.0.0.1:3002/biomes').catch((err) => ({ error: String(err) }))
  if (bRes && typeof bRes === 'object' && 'status' in bRes) {
    biomesBody = await bRes.text()
    let parsed = null
    try { parsed = JSON.parse(biomesBody) } catch {}
    biomesOk = bRes.status === 200 && Array.isArray(parsed?.biomes) && parsed.biomes.length === 6
  }
} finally {
  // Force-kill the entire tree. SIGTERM alone leaves the npx/tsx child
  // running on Windows, which keeps port 3002 bound and the parent waiting.
  if (process.platform === 'win32') {
    try {
      spawnSync('taskkill', ['/pid', String(apiProc.pid), '/T', '/F'], { stdio: 'ignore' })
    } catch {}
  } else {
    try {
      process.kill(-apiProc.pid, 'SIGKILL')
    } catch {}
    if (!apiProc.killed) apiProc.kill('SIGKILL')
  }
  await sleep(300)
}

record('api /healthz returns 200 {ok:true}', apiOk, healthBody ? `body=${healthBody.slice(0, 64)}` : 'no response')
record(
  'api /biomes returns 6 biomes (static fallback)',
  biomesOk,
  biomesBody ? `biomes=${JSON.parse(biomesBody).biomes.length}` : 'no response'
)

// 10. apps/web build report mentions globe chunking or routes
if (buildWeb.ok && buildWeb.stdout) {
  const routesReported = buildWeb.stdout.includes('Route (app)')
  record('apps/web build emits route report', routesReported)
}

// Summary
console.log('\n=== summary ===')
const passed = checks.filter((c) => c.ok).length
const failed = checks.filter((c) => !c.ok).length
console.log(`${passed} passed, ${failed} failed of ${checks.length}`)

// Hard overall deadline: if anything is still alive after this, force exit.
// Prevents the script from hanging when an orphaned child keeps the event
// loop alive (Windows: orphaned npx/tsx grand-children).
const HARD_DEADLINE_MS = 5_000
const hardTimer = setTimeout(() => {
  console.error(`hard deadline ${HARD_DEADLINE_MS}ms exceeded; forcing exit`)
  process.exit(failed === 0 ? 0 : 1)
}, HARD_DEADLINE_MS)
hardTimer.unref()