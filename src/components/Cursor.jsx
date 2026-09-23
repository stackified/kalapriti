import { useEffect, useRef } from 'react'
import { gsap, finePointer, reducedMotion } from '../lib/motion'
import { FEATURES } from '../data/site'

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary'

/**
 * Drafting crosshair. Desktop only — a fine pointer and hover capability are
 * required, and it stands down entirely for reduced-motion users and touch
 * devices, where the native cursor (or none) is the right answer.
 *
 * Two hairlines and a centre point, eased toward the pointer with quickTo so it
 * trails by a beat. Over anything interactive it opens into a small reticle.
 */
export default function Cursor() {
  const ref = useRef(null)

  useEffect(() => {
    if (!FEATURES.cursor || !finePointer() || reducedMotion()) return
    const el = ref.current
    const root = document.documentElement
    root.classList.add('has-cursor')

    const xTo = gsap.quickTo(el, 'x', { duration: 0.32, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.32, ease: 'power3' })
    let shown = false

    const onMove = (e) => {
      if (!shown) { gsap.set(el, { x: e.clientX, y: e.clientY }); el.classList.add('is-shown'); shown = true }
      xTo(e.clientX); yTo(e.clientY)
      el.classList.toggle('is-active', !!e.target.closest?.(INTERACTIVE))
    }
    const onLeave = () => el.classList.remove('is-shown')
    const onEnter = () => shown && el.classList.add('is-shown')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      root.classList.remove('has-cursor')
    }
  }, [])

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span className="cursor__h" />
      <span className="cursor__v" />
      <span className="cursor__dot" />
    </div>
  )
}
