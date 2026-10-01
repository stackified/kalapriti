/**
 * PER-ROUTE SEO — one table, two consumers.
 *
 * At build time, vite.config.js reads this to emit a real HTML file per route,
 * each with its own title, description, canonical and Open Graph tags. That is
 * what crawlers and link scrapers see, and it is the only version WhatsApp,
 * Facebook and Twitter ever see, because none of them run JavaScript.
 *
 * At runtime, src/lib/seo.js reads the same table to update the live document
 * when the router moves between pages client-side, so the tab title and the
 * canonical stay correct without a reload.
 *
 * Keep this file free of imports. vite.config.js loads it in plain Node, where
 * import.meta.env and anything Vite-specific does not exist.
 *
 * Writing rules, so these stay useful rather than decorative:
 *   title       — under ~60 characters before Google truncates it. The brand
 *                 suffix is added here, not by the consumer.
 *   description — 120-158 characters. It is not a ranking factor; it is the
 *                 line that decides whether anyone clicks.
 *   noindex     — for routes that exist and route correctly but have nothing
 *                 worth indexing yet. They stay reachable; they stay out of
 *                 the sitemap and out of the index.
 */

export const SITE_URL = 'https://kalapritidesigns.com'

/** Shared Open Graph values. Per-route entries override title and description. */
export const OG_DEFAULTS = {
  siteName: 'Kalapriti Designs',
  image: `${SITE_URL}/assets/hero.png`,
  type: 'website',
}

export const ROUTES = [
  {
    path: '/',
    title: 'Kalapriti Designs | Architectural & Design Consultancy',
    description:
      'Kalapriti Designs is an architecture and interior practice working across exterior and interior design — from first sketch to styled handover.',
    priority: '1.0',
  },
  {
    path: '/services',
    title: 'Services — Architecture, Interiors, Landscape | Kalapriti Designs',
    description:
      'Architecture planning, landscape, interior design and renovation — offered as advisory or end-to-end turnkey delivery. What we take on, and how far we carry it.',
    priority: '0.9',
  },
  {
    path: '/process',
    title: 'How a Project Runs | Kalapriti Designs',
    description:
      'The same six steps on every project — brief, concept, drawings, approvals, build and handover — so you always know what is settled and what comes next.',
    priority: '0.8',
  },
  {
    path: '/about',
    title: 'About the Practice | Kalapriti Designs',
    description:
      'An online-first architecture and design consultancy led by Jitendrakumar Patel, built around brand value and buildable detail. Working across Gujarat and beyond.',
    priority: '0.8',
  },
  {
    path: '/contact',
    title: 'Start a Project | Kalapriti Designs',
    description:
      'Tell us roughly what you have in mind. The first consultation is a conversation, not a commitment. Call, WhatsApp or send an enquiry.',
    priority: '0.9',
  },

  // Routed and reachable, but placeholder content. Indexing them now would put
  // thin pages in front of the pages that are finished.
  {
    path: '/projects',
    title: 'Projects | Kalapriti Designs',
    description:
      'Exterior and interior work across residential and commercial briefs.',
    noindex: true,
  },
  {
    path: '/resources',
    title: 'Resources | Kalapriti Designs',
    description:
      'Practical guidance on planning, budgeting and running a design project — free to read, no form in the way.',
    noindex: true,
  },
]

export const ROUTE_SEO = Object.fromEntries(ROUTES.map((r) => [r.path, r]))

/** Unknown paths render NotFound, which should never be indexed. */
export const NOT_FOUND_SEO = {
  path: null,
  title: 'Page not found | Kalapriti Designs',
  description: 'That page does not exist. Everything else is one click away.',
  noindex: true,
}

export const canonicalFor = (path) => `${SITE_URL}${path === '/' ? '/' : path}`
