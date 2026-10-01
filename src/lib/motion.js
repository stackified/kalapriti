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

/**
 * First load versus later navigation.
 *
 * Every page is prerendered, so on the first load whatever is in the viewport
 * has already been painted by the time an effect runs. Animating it in from
 * hidden would mean painting it, hiding it, then revealing it again — a flash,
 * and the moment Lighthouse records as LCP pushed back behind the script.
 *
 * So until the router moves for the first time, anything already on screen is
 * left exactly as the HTML drew it. Content further down still reveals on
 * scroll, and after a client-side navigation — where nothing was prerendered
 * and the new page really is arriving — everything animates as before.
 */
let initialLoad = true
export const isInitialLoad = () => initialLoad
export const endInitialLoad = () => { initialLoad = false }

/** True when any part of the element is inside the viewport right now. */
export const onScreen = (el) => {
  const r = el.getBoundingClientRect()
  return r.bottom > 0 && r.top < window.innerHeight
}

/** House easing: a settled, architectural deceleration. Used for every reveal. */
export const EASE = 'power3.out'
export const EASE_DRAW = 'power2.inOut'

gsap.defaults({ ease: EASE, duration: 0.9 })

export { gsap, ScrollTrigger }
