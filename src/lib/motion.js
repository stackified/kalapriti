import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Single GSAP entry point. Register plugins once here; every component imports
 * from this module, never from 'gsap' directly, so there is exactly one place
 * that decides how motion behaves site-wide.
 */
gsap.registerPlugin(ScrollTrigger)

/**
 * Respect the OS motion preference everywhere. Read lazily and cached — the
 * value can change while the tab is open, but re-evaluating per animation
 * is enough; we don't need a live listener.
 */
export const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Desktop pointer — the only place hover/magnetic/cursor effects make sense. */
export const finePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine) and (hover: hover)').matches

/** House easing: a settled, architectural deceleration. Used for every reveal. */
export const EASE = 'power3.out'
export const EASE_DRAW = 'power2.inOut'

gsap.defaults({ ease: EASE, duration: 0.9 })

export { gsap, ScrollTrigger }
