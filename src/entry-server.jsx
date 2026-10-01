import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'

/**
 * Build-time render of one route to static HTML. Called by
 * scripts/prerender.mjs for every route in src/data/seo.js; never shipped to
 * the browser.
 *
 * Why the site is prerendered at all: the body used to ship as an empty
 * <div id="root">. Nothing painted until ~120 kB of JavaScript had downloaded,
 * parsed and run — Lighthouse measured 2.5 s of "element render delay" on
 * mobile with the image itself already loaded. And anything that does not run
 * JavaScript saw no content at all, which includes most AI crawlers and the
 * agents the client wants the practice to be found by.
 *
 * The output must match what the client renders on first pass, or React
 * discards it and renders from scratch. Two rules keep that true:
 *   - Nothing reads window, document or matchMedia during render. Every such
 *     read in this codebase lives in an effect or an event handler.
 *   - Animation never changes the markup. Effects set inline styles after
 *     hydration; the HTML is always the resting state.
 */
export function render(path) {
  return renderToString(
    <StrictMode>
      <App ssrPath={path} />
    </StrictMode>,
  )
}

/*
 * Data for the other static files the prerender writes (sitemap, robots,
 * llms.txt). Re-exported from here rather than imported by the script directly
 * because Vite resolves this project's extensionless imports and raw Node does
 * not — this bundle is the one place both can agree on.
 */
export { ROUTES, SITE_URL, canonicalFor } from './data/seo.js'
export { BRAND, CONTACT } from './data/site.js'
export { STREAMS, ENGAGEMENTS } from './data/services.js'
