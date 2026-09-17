import { useEffect, useRef } from 'react'
import { useLocation } from 'wouter'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger, finePointer, reducedMotion } from '../lib/motion'
import { FEATURES } from '../data/site'
import Nav from './Nav'
import Footer from './Footer'
import Atmosphere from './Atmosphere'
import Cursor from './Cursor'

/**
 * Smooth scroll, synced to ScrollTrigger so every scroll-driven animation
 * reads Lenis's position, not the browser's. Off for reduced-motion users —
 * their scrollbar should behave exactly as the OS says it should.
 */
function useLenis() {
  const ref = useRef(null)
  useEffect(() => {
    if (!FEATURES.smoothScroll || reducedMotion()) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    ref.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy(); ref.current = null }
  }, [])
  return ref
}

/**
 * Magnetic CTAs via event delegation, so buttons rendered by any page pick it
 * up without registering themselves. Pointer-fine only.
 */
function useMagnetic() {
  useEffect(() => {
    if (!finePointer() || reducedMotion()) return
    const tweens = new WeakMap()
    const get = (el) => {
      let t = tweens.get(el)
      if (!t) {
        t = { x: gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' }),
              y: gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' }) }
        tweens.set(el, t)
      }
      return t
    }
    const onMove = (e) => {
      const el = e.target.closest?.('.btn')
      if (!el) return
      const r = el.getBoundingClientRect()
      const t = get(el)
      t.x((e.clientX - (r.left + r.width / 2)) * 0.22)
      t.y((e.clientY - (r.top + r.height / 2)) * 0.22)
    }
    const onOut = (e) => {
      const el = e.target.closest?.('.btn')
      if (!el || el.contains(e.relatedTarget)) return
      const t = get(el); t.x(0); t.y(0)
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onOut, { passive: true })
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onOut)
    }
  }, [])
}

/**
 * Route change: jump to top (SPAs don't), then a sheet-change transition —
 * a hairline draws across the top edge and the page settles in from below.
 */
function usePageTransition(lenisRef, mainRef, ruleRef) {
  const [loc] = useLocation()
  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)

    if (reducedMotion()) return
    // Capture the nodes now; refs may point elsewhere by the time cleanup runs.
    const rule = ruleRef.current
    const main = mainRef.current
    const tl = gsap.timeline()
    tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.inOut', transformOrigin: 'left center' })
      .to(rule, { autoAlpha: 0, duration: 0.3 }, '+=0.1')
      .fromTo(main, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, clearProps: 'transform' }, 0.08)
    // Layout changed under every ScrollTrigger; recalc after paint.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => { tl.kill(); cancelAnimationFrame(id); gsap.set(rule, { autoAlpha: 1 }) }
  }, [loc, lenisRef, mainRef, ruleRef])
}

export default function Layout({ children }) {
  const lenisRef = useLenis()
  const mainRef = useRef(null)
  const ruleRef = useRef(null)
  useMagnetic()
  usePageTransition(lenisRef, mainRef, ruleRef)

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Atmosphere />
      <Cursor />
      <div ref={ruleRef} className="sheet-rule" aria-hidden="true" />
      <Nav />
      <main id="main" ref={mainRef}>
        {children}
      </main>
      <Footer />
    </>
  )
}
