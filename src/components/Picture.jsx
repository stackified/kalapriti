import { IMAGES } from '../data/images'
import { asset } from '../data/site'

/**
 * Responsive image with zero layout shift.
 *
 * - AVIF first, WebP second, the original PNG as the fallback.
 * - `width`/`height` are always set from the manifest, so the browser reserves
 *   the box before a single byte arrives (CLS = 0).
 * - `sizes` tells the browser how wide the image will render so it can pick the
 *   smallest adequate candidate. Pass the real layout width, not "100vw", for
 *   anything that isn't full-bleed.
 * - `priority` marks the LCP image: eager, high fetch priority, sync decode.
 *   Everything else lazy-loads.
 */
export default function Picture({
  name,
  alt = '',
  sizes = '100vw',
  priority = false,
  className,
  imgClassName,
  style,
}) {
  const meta = IMAGES[name]
  if (!meta) {
    // Fail loudly in dev, quietly in prod — a broken picture beats a crash.
    if (import.meta.env.DEV) console.warn(`[Picture] no manifest entry for "${name}"`)
    return null
  }

  const srcset = (ext) =>
    meta.widths.map((w) => `${asset(`assets/img/${name}-${w}.${ext}`)} ${w}w`).join(', ')

  return (
    <picture className={className} style={style}>
      <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
      <img
        src={asset(meta.fallback)}
        alt={alt}
        width={meta.width}
        height={meta.height}
        className={imgClassName}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  )
}
