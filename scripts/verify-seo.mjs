#!/usr/bin/env node
/**
 * Build guard for the per-route SEO artifacts.
 *
 * Run after `npm run build`, locally or in CI:  node scripts/verify-seo.mjs
 *
 * This exists because the failure mode is silent. If the per-route emit in
 * vite.config.js stops running, the site still builds, still deploys, and still
 * works — every page just quietly goes back to sharing the homepage's title,
 * description and link preview. Nobody notices until someone checks Search
 * Console weeks later.
 */
import { existsSync, readFileSync } from 'node:fs'
import { readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { ROUTES, canonicalFor } from '../src/data/seo.js'

const DIST = resolve(import.meta.dirname, '..', 'dist')
const problems = []
const fail = (msg) => problems.push(msg)

if (!existsSync(DIST)) {
  console.error('dist/ does not exist — run `npm run build` first.')
  process.exit(1)
}

/** Exactly one of each. Two titles is as broken as none: the browser and the
 *  crawler each pick one, and they do not have to pick the same one. */
const SINGLETONS = [
  ['title', /<title>([^<]*)<\/title>/g],
  ['description', /name="description"\s+content="([^"]*)"/g],
  ['og:title', /property="og:title"\s+content="([^"]*)"/g],
  ['og:description', /property="og:description"\s+content="([^"]*)"/g],
  ['canonical', /<link rel="canonical" href="([^"]*)"/g],
  ['og:url', /property="og:url"\s+content="([^"]*)"/g],
]

const read = (p) => readFileSync(p, 'utf8')
const all = (html, re) => [...html.matchAll(new RegExp(re.source, 'g'))].map((m) => m[1])

const seenTitles = new Map()

for (const route of ROUTES) {
  const slug = route.path === '/' ? null : route.path.replace(/^\//, '')
  // Both URL shapes, because which one GitHub Pages prefers is not worth
  // guessing at — and a page that 404s is worse than one indexed twice.
  const files = slug ? [`${slug}.html`, join(slug, 'index.html')] : ['index.html']

  for (const rel of files) {
    const abs = join(DIST, rel)
    if (!existsSync(abs)) {
      fail(`${rel} was not emitted — per-route SEO did not run for ${route.path}`)
      continue
    }
    const html = read(abs)

    for (const [label, re] of SINGLETONS) {
      const found = all(html, re)
      if (found.length !== 1) fail(`${rel}: ${found.length} ${label} tags, expected exactly 1`)
    }

    const [title] = all(html, /<title>([^<]*)<\/title>/)
    const [canonical] = all(html, /<link rel="canonical" href="([^"]*)"/)
    const [desc] = all(html, /name="description"\s+content="([^"]*)"/)
    const [ogDesc] = all(html, /property="og:description"\s+content="([^"]*)"/)

    const want = canonicalFor(route.path)
    if (canonical !== want) fail(`${rel}: canonical is ${canonical}, expected ${want}`)
    if (desc !== ogDesc) fail(`${rel}: description and og:description diverged`)

    // Decoded, because the shell escapes & as &amp; before this ever runs.
    const decoded = title.replace(/&amp;/g, '&')
    if (decoded !== route.title) fail(`${rel}: title is "${decoded}", expected "${route.title}"`)

    const robots = all(html, /name="robots"\s+content="([^"]*)"/)
    if (route.noindex && robots.length !== 1) fail(`${rel}: placeholder route is missing noindex`)
    if (!route.noindex && robots.length) fail(`${rel}: indexable route carries a robots tag`)

    const owner = seenTitles.get(title)
    if (owner && owner !== route.path) fail(`${rel} shares its title with ${owner}`)
    seenTitles.set(title, route.path)
  }
}

// Nothing should be left behind claiming a title that no route owns.
for (const entry of readdirSync(DIST, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.html') || entry.name === '404.html') continue
  const slug = entry.name === 'index.html' ? '/' : `/${entry.name.replace(/\.html$/, '')}`
  if (!ROUTES.some((r) => r.path === slug)) fail(`dist/${entry.name} has no route in src/data/seo.js`)
}

const sitemap = existsSync(join(DIST, 'sitemap.xml')) ? read(join(DIST, 'sitemap.xml')) : ''
if (!sitemap) fail('sitemap.xml was not generated')
for (const route of ROUTES) {
  const listed = sitemap.includes(`<loc>${canonicalFor(route.path)}</loc>`)
  if (route.noindex && listed) fail(`sitemap lists ${route.path}, which is noindex`)
  if (!route.noindex && !listed) fail(`sitemap is missing ${route.path}`)
}

if (problems.length) {
  for (const p of problems) console.error(`::error::${p}`)
  console.error(`\nper-route SEO verification failed: ${problems.length} problem(s)`)
  process.exit(1)
}

const indexed = ROUTES.filter((r) => !r.noindex).length
console.log(
  `per-route SEO OK — ${ROUTES.length} routes, ${seenTitles.size} distinct titles, ` +
  `${indexed} in the sitemap`,
)
