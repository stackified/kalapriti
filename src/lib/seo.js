import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { ROUTE_SEO, NOT_FOUND_SEO, OG_DEFAULTS, canonicalFor } from '../data/seo'

/**
 * Keeps the live document's metadata in step with the route.
 *
 * This *mutates* the tags the build already put in the head rather than
 * rendering new ones. React 19 can hoist <title> and <meta> on its own, but it
 * appends — it does not replace what the static HTML shipped — so rendering
 * them would leave two titles and two descriptions on every page, and the
 * browser would keep the first.
 *
 * Only client-side navigation needs this. On a cold load the file the server
 * sent is already correct: vite.config.js emits one HTML file per route. That
 * matters because link scrapers (WhatsApp, Facebook, Twitter) never run this
 * code — they read the shipped HTML and stop.
 */

const setMeta = (selector, attr, value) => {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
  return el
}

/**
 * Creates the tag if it is absent, updates it if present, removes it when
 * `value` is null. Tags that only some routes carry — robots on placeholders,
 * canonical on anything real — have to be addable and removable, not just
 * settable: leaving a stale one behind is worse than never having had it.
 */
function syncTag(selector, make, attr, value) {
  const existing = document.head.querySelector(selector)
  if (value === null) {
    existing?.remove()
    return
  }
  const el = existing ?? document.head.appendChild(make())
  el.setAttribute(attr, value)
}

const makeMeta = (name, key = 'name') => () => {
  const el = document.createElement('meta')
  el.setAttribute(key, name)
  return el
}

const makeCanonical = () => {
  const el = document.createElement('link')
  el.setAttribute('rel', 'canonical')
  return el
}

export function useRouteMeta() {
  const [loc] = useLocation()

  useEffect(() => {
    // main.jsx strips a trailing slash before the first render, but a lookup
    // that misses here retitles a real page "Page not found" and noindexes it,
    // so it is normalised again rather than trusted.
    const key = loc.length > 1 ? loc.replace(/\/+$/, '') : loc
    const seo = ROUTE_SEO[key] ?? NOT_FOUND_SEO
    const url = seo.path ? canonicalFor(seo.path) : null

    document.title = seo.title
    setMeta('meta[name="description"]', 'content', seo.description)
    setMeta('meta[property="og:title"]', 'content', seo.title)
    setMeta('meta[property="og:description"]', 'content', seo.description)
    setMeta('meta[property="og:site_name"]', 'content', OG_DEFAULTS.siteName)

    // An unknown path has no canonical URL of its own, so the tag is removed
    // rather than left pointing at whichever page was open before — a stale
    // canonical tells Google this URL is a duplicate of that one, which is a
    // worse claim than making none.
    syncTag('link[rel="canonical"]', makeCanonical, 'href', url)
    // og:url still gets the real address: link previews should show where the
    // reader actually is, and nothing indexes on the strength of it.
    syncTag(
      'meta[property="og:url"]',
      makeMeta('og:url', 'property'),
      'content',
      url ?? window.location.href,
    )

    syncTag(
      'meta[name="robots"]',
      makeMeta('robots'),
      'content',
      seo.noindex ? 'noindex, follow' : null,
    )
  }, [loc])
}
