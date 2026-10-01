/**
 * GALLERY
 *
 * ⚠ The tiles below are the same placeholder renders the Projects page uses.
 * They exist so the layout, the lightbox and the responsive behaviour are
 * built and tested before the real photography arrives — not to stand in for
 * the practice's work.
 *
 * TO GO LIVE when the client's Drive folder is populated:
 *   1. Drop the photos into public/assets/.
 *   2. Add a PLAN entry per photo in scripts/images.py, then `npm run images`.
 *   3. Replace ITEMS below with one entry per photo, each `name` matching the
 *      PLAN key, and write a real `alt` for every one.
 *   4. Set IS_PLACEHOLDER to false.
 *
 * That last flag is the only switch. It reveals the nav entry, drops the
 * noindex, and adds the page to the sitemap — all three read it, so the page
 * cannot go half-live.
 *
 * Keep this file free of imports: vite.config.js loads it in plain Node, where
 * import.meta.env and anything Vite-specific does not exist.
 */

export const GALLERY_IS_PLACEHOLDER = true

/**
 * `span` drives the masonry rhythm — 'tall' takes two rows, 'wide' two
 * columns. It is a layout hint, not a crop: <Picture> still uses each image's
 * real intrinsic ratio, so nothing is distorted and CLS stays at zero.
 */
export const GALLERY = [
  { name: 'project1', alt: '', span: 'tall' },
  { name: 'project2', alt: '', span: null },
  { name: 'studio', alt: '', span: null },
  { name: 'project3', alt: '', span: 'wide' },
  { name: 'project4', alt: '', span: null },
  { name: 'hero', alt: '', span: 'tall' },
]
