import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * DEPLOY PATH — SINGLE SOURCE OF TRUTH
 *
 * The brand is spelled "Kalapriti" everywhere a human can see it.
 * This path is NOT the brand name — it is the GitHub repository name,
 * which GitHub Pages serves from and which is case-sensitive:
 *
 *   repo  github.com/stackified/kalapriti
 *   live  stackified.github.io/kalapriti/
 *
 * Never hardcode this prefix anywhere else. Every asset URL is built from
 * `import.meta.env.BASE_URL`, so this line is the only place that changes if
 * the repo is renamed to `kalapriti`, or when the site moves to kalapriti.com
 * (at which point this becomes "/").
 */
export default defineConfig({
  plugins: [react()],
  base: '/kalapriti/',
})
