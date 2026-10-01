#!/usr/bin/env node
/**
 * Serve dist/ the way GitHub Pages does, so the build can be tested locally
 * against the behaviour it will actually get in production.
 *
 *   npm run build && npm run preview:pages        -> http://localhost:4173
 *
 * `vite preview` is not a substitute: it falls back to index.html for every
 * unknown path, which hides exactly the cases this site has been bitten by —
 * a route with no file of its own, the 404 shim's redirect, the trailing
 * slash. This mirrors the rules that matter:
 *
 *   /services        -> services.html, else services/index.html
 *   /services/       -> services/index.html
 *   anything else    -> 404.html, with a real 404 status
 *   every response   -> gzip when accepted, Cache-Control: max-age=600
 *
 * The 600 seconds is GitHub Pages' fixed value. Lighthouse flags it; it cannot
 * be changed on this host, so the local server reproduces it rather than
 * flattering the numbers.
 */
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { gzipSync } from 'node:zlib'

const DIST = resolve(import.meta.dirname, '..', 'dist')
const PORT = Number(process.env.PORT) || 4173

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
}
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.svg', '.xml', '.txt', '.json'])

const isFile = (p) => existsSync(p) && statSync(p).isFile()

function resolveRequest(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '')
  const base = join(DIST, clean)
  if (!base.startsWith(DIST)) return null
  if (clean.endsWith('/') || clean.endsWith('\\')) {
    return isFile(join(base, 'index.html')) ? join(base, 'index.html') : null
  }
  if (isFile(base)) return base
  if (isFile(`${base}.html`)) return `${base}.html`
  if (isFile(join(base, 'index.html'))) return join(base, 'index.html')
  return null
}

createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost')
  let file = resolveRequest(pathname)
  let status = 200
  if (!file) {
    file = join(DIST, '404.html')
    status = 404
  }
  let body = readFileSync(file)
  const ext = extname(file)
  const headers = {
    'Content-Type': TYPES[ext] ?? 'application/octet-stream',
    'Cache-Control': 'max-age=600',
  }
  if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')) {
    body = gzipSync(body)
    headers['Content-Encoding'] = 'gzip'
    headers.Vary = 'Accept-Encoding'
  }
  headers['Content-Length'] = body.length
  res.writeHead(status, headers)
  res.end(req.method === 'HEAD' ? undefined : body)
}).listen(PORT, () => {
  console.log(`serving dist/ like GitHub Pages on http://localhost:${PORT}`)
})
