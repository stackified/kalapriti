/**
 * Site-wide constants. Every brand string, contact detail and nav item comes
 * from here — no brand name is ever typed inline in a component.
 *
 * Brand spelling is KALAPRITI (client-confirmed). The deploy path is a
 * separate concern and lives in vite.config.js; see `asset()` below.
 */

export const BRAND = {
  name: 'Kalapriti',
  nameFull: 'Kalapriti Designs',
  nameUpper: 'KALAPRITI',
  nameSuffix: 'Designs',
  discipline: 'Architectural & Design Consultancy',
  tagline: 'stories behind every detail',
  established: 2025,
}

/**
 * Builds a URL for anything in /public. Always use this — never write the
 * deploy prefix by hand, or the site breaks the next time the base changes.
 *   asset('assets/hero.jpg') -> '/kalapriti/assets/hero.jpg'
 */
export const asset = (path) =>
  `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, '')}`

/**
 * Logo variants. The supplied mark is dark and vanishes on dark grounds, so a
 * true reverse asset (off-white fills, identical geometry) sits alongside it.
 * Pick by the surface behind it — never re-colour the dark mark with a filter.
 */
export const LOGO = {
  dark: 'assets/logo/logo-mark.svg',
  reverse: 'assets/logo/logo-mark-reverse.svg',
}

/**
 * Hero video. The client asked for motion in the hero; drop the file into
 * public/assets and set this to { src, poster } to switch it on. While it is
 * null the hero renders the responsive still instead.
 *
 * Keep it short (6-10s), muted, H.264 .mp4, and ideally under ~3 MB — it is the
 * first thing that loads, so weight here is felt directly.
 */
export const HERO_VIDEO = null
// export const HERO_VIDEO = { src: 'assets/hero.mp4', poster: 'assets/img/hero-1280.avif' }

export const CONTACT = {
  principal: 'Jitendrakumar Patel',
  principalRole: 'Principal Consultant',
  // Primary: drives the header, hero, floating Call/WhatsApp buttons, the
  // contact form handoff, and the number Google reads from the JSON-LD.
  phone: '+91 75677 50161',
  phoneHref: 'tel:+917567750161',
  whatsappHref: 'https://wa.me/917567750161',
  // Secondary: shown wherever someone is actively looking for a way to get in
  // touch (contact page, footer). Deliberately not on the buttons — two calls
  // to action competing for the same tap helps nobody.
  phoneAlt: '+91 96387 34126',
  phoneAltHref: 'tel:+919638734126',
  email: 'kalapritidesigns@gmail.com',
  // Online-only practice — client confirmed no published address (Q9).
  address: null,
  addressNote: 'Online-first studio — we work on site, across Gujarat and beyond.',
  instagram: 'https://instagram.com/kalapritidesigns',
  instagramHandle: '@kalapritidesigns',
}

/**
 * Site navigation. `hidden: true` keeps the route working (so the client can
 * still preview the page by URL) while leaving it out of every menu — Projects
 * and Resources are held back until real content arrives.
 */
export const NAV = [
  { label: 'Home',      path: '/' },
  { label: 'Projects',  path: '/projects',  hidden: true },
  { label: 'Services',  path: '/services' },
  { label: 'Process',   path: '/process' },
  { label: 'Resources', path: '/resources', hidden: true },
  { label: 'About',     path: '/about' },
  { label: 'Contact',   path: '/contact' },
]

/** What appears in menus. */
export const VISIBLE_NAV = NAV.filter((n) => !n.hidden)

/**
 * Feature switches. `cursor` is the desktop drafting crosshair; turn it off if
 * it reads as too playful for the brand.
 */
export const FEATURES = { cursor: true, smoothScroll: true, grain: true }

export const VALUES = [
  {
    title: 'Brand value first',
    body: 'Brand value is the primary filter for every design and communication decision — ahead of trend, ahead of scale.',
  },
  {
    title: 'Integrity in engineering',
    body: 'Buildability is not a compromise made after the design. It is part of the design, and it is non-negotiable.',
  },
  {
    title: 'Creative excellence',
    body: 'Every project carries a narrative. The drawing, the material and the copy should all be telling the same one.',
  },
]

export const TEAM_ROLES = [
  'Project Consultant',
  'Interior Designer',
  'BE Civil',
  'Engineer Consultant',
]
