import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import App from './App.jsx'

const base = import.meta.env.BASE_URL.replace(/\/$/, '')

/**
 * One URL per page. GitHub Pages answers both /services and /services/ with
 * the same file, but the router, the SEO table and the canonical all use the
 * bare form. Left alone, /services/ rendered the right page while the head
 * code failed to find it and retitled the page "Page not found" with a
 * noindex. Done before the first render so nothing ever sees the slash.
 */
{
  const { pathname, search, hash } = window.location
  if (pathname.length > 1 && pathname.endsWith('/')) {
    window.history.replaceState(null, '', pathname.replace(/\/+$/, '') + search + hash)
  }
}

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

/**
 * Hydrate only markup that was rendered for this URL.
 *
 * scripts/prerender.mjs stamps each page's root with the route it drew. Most
 * of the time that matches. It does not when GitHub Pages' 404 shim has
 * bounced an unknown path through index.html: the URL is /whatever but the
 * markup is the homepage. Hydrating that would make React log a mismatch and
 * throw the markup away anyway, so it is cleared and rendered fresh instead.
 * The dev server ships an empty root, which takes the same branch.
 */
const here = window.location.pathname.slice(base.length) || '/'
if (root.firstElementChild && root.dataset.route === here) {
  hydrateRoot(root, app)
} else {
  root.replaceChildren()
  createRoot(root).render(app)
}
