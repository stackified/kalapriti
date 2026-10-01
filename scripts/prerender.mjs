#!/usr/bin/env node
/**
 * Post-build static output. Runs after both Vite builds (see "build" in
 * package.json):
 *
 *   1. vite build                          -> dist/          the browser bundle
 *   2. vite build --ssr src/entry-server   -> dist-server/   a Node render fn
 *   3. node scripts/prerender.mjs          -> rewrites dist/ into real pages
 *
 * For every route in src/data/seo.js this writes a complete HTML page: its own
 * head (title, description, canonical, Open Graph, robots) and — new — its
 * actual rendered content in the body, with the stylesheet inlined. It also
 * writes sitemap.xml, robots.txt and llms.txt from the same data.
 *
 * Everything that describes a route comes from one table, so a page, its
 * sitemap entry and its llms.txt line cannot disagree.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = resolve(import.meta.dirname, '..')
const DIST = join(ROOT, 'dist')
const SERVER = join(ROOT, 'dist-server')

const fail = (msg) => {
  console.error(`prerender: ${msg}`)
  process.exit(1)
}

if (!existsSync(join(DIST, 'index.html'))) fail('dist/index.html is missing — run `vite build` first.')
const entry = join(SERVER, 'entry-server.js')
if (!existsSync(entry)) fail('dist-server/entry-server.js is missing — run the SSR build first.')

const {
  render, ROUTES, SITE_URL, canonicalFor, BRAND, CONTACT, STREAMS, ENGAGEMENTS,
} = await import(pathToFileURL(entry).href)

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

// ---------------------------------------------------------------------------
// Shell: the Vite-built index.html, with the stylesheet inlined.
// ---------------------------------------------------------------------------

let shell = readFileSync(join(DIST, 'index.html'), 'utf8')

/*
 * Inline the CSS. It is ~7 kB gzipped, and as a <link> it was render-blocking:
 * the browser could not paint until a second request came back (~420 ms on
 * Lighthouse's mobile profile). Inlined, the first response is enough to
 * paint. The cost is that the CSS is not cached across pages, which at this
 * size is the right trade for a site whose visitors mostly land on one page.
 */
const cssLinks = [...shell.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g)]
if (cssLinks.length !== 1) fail(`expected exactly one stylesheet link in the shell, found ${cssLinks.length}`)
const [cssTag, cssHref] = cssLinks[0]
const cssFile = join(DIST, cssHref.replace(/^\/+/, ''))
const css = readFileSync(cssFile, 'utf8')
shell = shell.replace(cssTag, () => `<style>${css}</style>`)

/*
 * Preload the two webfonts the first screen uses. Inlining puts the
 * @font-face rules in the first response, but a browser still only requests a
 * font once layout finds text that needs it. A preload starts both downloads
 * while the HTML is still parsing, so the metric-matched fallback is on screen
 * for as short a time as possible.
 */
const assetsDir = join(DIST, 'assets')
const fontFor = (prefix) => {
  const hit = readdirSync(assetsDir).find((f) => f.startsWith(prefix) && f.endsWith('.woff2'))
  if (!hit) fail(`no ${prefix}*.woff2 in dist/assets — did the font import change?`)
  return cssHref.replace(/[^/]+$/, hit)
}
const fontPreloads = ['dm-sans-latin-wght-normal', 'eb-garamond-latin-wght-normal']
  .map((p) => `<link rel="preload" href="${fontFor(p)}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ')
shell = shell.replace('</title>', () => `</title>\n    ${fontPreloads}`)

/*
 * Let the script yield to what the first screen needs. Every page now arrives
 * fully rendered, so the bundle is an enhancement — it adds the menu, the
 * contact shortcuts, the form and the motion — not a precondition for seeing
 * anything. At default priority its ~125 kB competed with the hero image and
 * the two fonts for the same slow connection. Measured on Lighthouse's mobile
 * profile, lowering it took first contentful paint from 1.37 s to 0.66 s.
 */
const scriptTags = shell.match(/<script type="module" crossorigin src="[^"]+"><\/script>/g) ?? []
if (scriptTags.length !== 1) fail(`expected one module script in the shell, found ${scriptTags.length}`)
shell = shell.replace('<script type="module" crossorigin', '<script type="module" fetchpriority="low" crossorigin')

// ---------------------------------------------------------------------------
// Head rewriting — unchanged rules, moved here from vite.config.js.
// ---------------------------------------------------------------------------

function withHead(html, route) {
  const url = canonicalFor(route.path)
  const sub = (pattern, replacement, label) => {
    if (!pattern.test(html)) {
      fail(`no ${label} tag in index.html to rewrite for ${route.path}. ` +
           'The shell changed shape — update this script rather than ship a wrong head.')
    }
    html = html.replace(pattern, replacement)
  }
  sub(/<title>[\s\S]*?<\/title>/, `<title>${esc(route.title)}</title>`, 'title')
  sub(/(<meta\s+name="description"\s+content=")[\s\S]*?(")/, `$1${esc(route.description)}$2`, 'description')
  sub(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`, 'canonical')
  sub(/(<meta property="og:title" content=")[\s\S]*?(")/, `$1${esc(route.title)}$2`, 'og:title')
  sub(/(<meta\s+property="og:description"\s+content=")[\s\S]*?(")/, `$1${esc(route.description)}$2`, 'og:description')
  sub(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`, 'og:url')
  if (route.noindex) {
    html = html.replace('</head>', '    <meta name="robots" content="noindex, follow" />\n  </head>')
  }
  return html
}

/*
 * The body. `data-route` records which page this markup was drawn for;
 * main.jsx hydrates only when it matches the URL, so a 404-shim bounce through
 * index.html renders fresh instead of mismatching.
 */
function withBody(html, route) {
  const markup = render(route.path)
  if (!markup || markup.length < 200) fail(`render("${route.path}") returned almost nothing`)
  const root = '<div id="root"></div>'
  if (!html.includes(root)) fail('the shell has no empty <div id="root"></div> to fill')
  return html.replace(root, () => `<div id="root" data-route="${route.path}">${markup}</div>`)
}

// ---------------------------------------------------------------------------
// Write every route. Two files per route, as before: GitHub Pages serves
// services.html at /services and services/index.html at /services/. Both
// carry the same canonical, so the duplicate collapses.
// ---------------------------------------------------------------------------

for (const route of ROUTES) {
  const html = withBody(withHead(shell, route), route)
  if (route.path === '/') {
    writeFileSync(join(DIST, 'index.html'), html)
    continue
  }
  const slug = route.path.replace(/^\//, '')
  writeFileSync(join(DIST, `${slug}.html`), html)
  mkdirSync(join(DIST, slug), { recursive: true })
  writeFileSync(join(DIST, slug, 'index.html'), html)
}

// Nothing links to the stylesheet any more; leaving it would be a dead file
// that looks like it is in use.
rmSync(cssFile)

// ---------------------------------------------------------------------------
// sitemap.xml and robots.txt
// ---------------------------------------------------------------------------

const indexed = ROUTES.filter((r) => !r.noindex)

writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<!--
  GENERATED by scripts/prerender.mjs from src/data/seo.js — do not edit by hand.
  Routes marked noindex are deliberately absent.
-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexed.map((r) => `  <url><loc>${canonicalFor(r.path)}</loc><priority>${r.priority}</priority></url>`).join('\n')}
</urlset>
`)

writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)

// ---------------------------------------------------------------------------
// llms.txt — https://llmstxt.org
//
// A plain-Markdown map of the site for language models: who the practice is,
// what it does, and where each page is. Only client-confirmed facts go in
// here. Where the site has not settled something (a street address, a precise
// service area) this file does not guess either — an LLM will repeat whatever
// it is told with total confidence.
// ---------------------------------------------------------------------------

const line = (r) => `- [${r.title.split(' | ')[0]}](${canonicalFor(r.path)}): ${r.description}`
const services = STREAMS.flatMap((s) => s.services.map((x) => `- **${x.name}** (${s.name}): ${x.body}`))
const engagements = ENGAGEMENTS.map((e) => `- **${e.name}**: ${e.body}`)

writeFileSync(join(DIST, 'llms.txt'), `# ${BRAND.nameFull}

> ${BRAND.nameFull} is an ${BRAND.discipline.toLowerCase()} working across exterior and interior design, from first sketch to styled handover. Principal consultant: ${CONTACT.principal}. ${CONTACT.addressNote}

## Pages

${indexed.map(line).join('\n')}

## Services

${services.join('\n')}

## How we engage

${engagements.join('\n')}

## Contact

- Phone: ${CONTACT.phone}${CONTACT.phoneAlt ? ` or ${CONTACT.phoneAlt}` : ''}
- WhatsApp: [${CONTACT.phone}](${CONTACT.whatsappHref})
- Email: [${CONTACT.email}](mailto:${CONTACT.email})
- Instagram: [${CONTACT.instagramHandle}](${CONTACT.instagram})
- Enquiry form: [${canonicalFor('/contact')}](${canonicalFor('/contact')})
`)

rmSync(SERVER, { recursive: true, force: true })

console.log(
  `prerender: ${ROUTES.length} routes rendered (${indexed.length} indexable), ` +
  `CSS inlined (${(css.length / 1024).toFixed(1)} kB), 2 fonts preloaded, ` +
  'sitemap.xml, robots.txt, llms.txt written',
)
