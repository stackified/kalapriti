import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * DEPLOY PATH — SINGLE SOURCE OF TRUTH
 *
 * The site is served from the apex of kalapritidesigns.com on Hostinger
 * shared hosting, so the base is "/". Everything else derives from this:
 * asset URLs come from `asset()` in src/data/site.js, which reads
 * import.meta.env.BASE_URL. Never hardcode a prefix in a component.
 *
 * If the site ever moves back under a subpath, change this line only.
 */
export default defineConfig({
  plugins: [react()],
  base: '/',
})
