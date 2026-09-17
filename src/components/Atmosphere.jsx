import { FEATURES } from '../data/site'

/**
 * The paper. A fixed, non-interactive layer that turns a flat cream ground into
 * a sheet from a drawing set: a faint drafting grid with a heavier line every
 * eighth cell, and a grain tile so large flat areas don't read as digital.
 *
 * Cost: zero JavaScript, two CSS backgrounds. The grain is a 160px SVG
 * turbulence tile rasterised once and repeated — far cheaper than a full-screen
 * filter, and it never repaints on scroll because the layer is fixed.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")"

export default function Atmosphere() {
  return (
    <div className="atmos" aria-hidden="true">
      <div className="atmos__grid" />
      {FEATURES.grain && <div className="atmos__grain" style={{ backgroundImage: GRAIN }} />}
    </div>
  )
}
