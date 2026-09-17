/**
 * Site-wide constants. Every brand string, contact detail and nav item comes
 * from here — no brand name is ever typed inline in a component.
 *
 * Brand spelling is KALAPRITI (client-confirmed). The deploy path is a
 * separate concern and lives in vite.config.js; see `asset()` below.
 */

export const BRAND = {
  name: 'Kalapriti',
  nameFull: 'Kalapriti Associates',
  nameUpper: 'KALAPRITI',
  discipline: 'Architectural & Design Consultancy',
  tagline: 'shaping spaces that hold their value',
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

export const CONTACT = {
  principal: 'Jitendrakumar Patel',
  principalRole: 'Principal Consultant',
  phone: '+91 97275 79905',
  phoneHref: 'tel:+919727579905',
  // TODO(client): destination inbox not yet confirmed — Q10 deferred.
  // Leave null; the UI hides the email row rather than inventing an address.
  email: null,
  // Online-only practice — client confirmed no published address (Q9).
  address: null,
  addressNote: 'Online-first studio — we work on site, across Gujarat and beyond.',
  instagram: 'https://instagram.com', // TODO(client): real handle pending (Q7)
}

/**
 * Every page is a sheet in the drawing set. `sheet` is the title-block code
 * rendered in each page header — the site's visual signature, so it belongs
 * with the route rather than being typed into components.
 */
export const NAV = [
  { label: 'Home',      path: '/',          sheet: 'A-000', title: 'Cover' },
  { label: 'Projects',  path: '/projects',  sheet: 'A-100', title: 'Selected work' },
  { label: 'Services',  path: '/services',  sheet: 'A-200', title: 'Scope of work' },
  { label: 'Process',   path: '/process',   sheet: 'A-300', title: 'Sequence' },
  { label: 'Resources', path: '/resources', sheet: 'A-400', title: 'Reference' },
  { label: 'About',     path: '/about',     sheet: 'A-500', title: 'The practice' },
  { label: 'Contact',   path: '/contact',   sheet: 'A-600', title: 'Enquiry' },
]

export const sheetFor = (path) => NAV.find((n) => n.path === path) ?? { sheet: 'A-999', title: 'Not found' }

/** Desktop-only drafting crosshair cursor. One flag to disable if the client dislikes it. */
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
