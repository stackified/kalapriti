import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/motion'

/**
 * Scroll reveal on GSAP + ScrollTrigger.
 *
 * Content is authored at its resting state and only *set* to the hidden
 * state by JS immediately before animating — so if JS is slow or blocked the
 * page is fully readable, and with prefers-reduced-motion nothing moves at all.
 *
 * `variant`:
 *   'rise'  — fade + short rise (default; body copy, cards)
 *   'draw'  — scaleX 0→1 from the left (hairline rules, dimension lines)
 *   'clip'  — clip-path wipe upward + slight settle (images)
 *   'lines' — staggers direct children (headline lines, list items)
 */
export default function Reveal({
  children,
  as = 'div',
  variant = 'rise',
  delay = 0,
  stagger = 0.08,
  className,
  once = true,
  ...rest
}) {
  const ref = useRef(null)
  // Bound as a const rather than a renamed param: this project's ESLint has no
  // jsx-uses-vars, so a capitalised *parameter* reads as unused even when it is
  // the JSX element name. Capitalised consts are covered by varsIgnorePattern.
  const Tag = as

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) return

    const targets = variant === 'lines' ? Array.from(el.children) : el
    let from, to

    switch (variant) {
      case 'draw':
        from = { scaleX: 0, transformOrigin: 'left center' }
        to = { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }
        break
      case 'clip':
        from = { clipPath: 'inset(100% 0 0 0)', scale: 1.06 }
        to = { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1.2, ease: 'power3.out' }
        break
      case 'lines':
        from = { autoAlpha: 0, y: 24 }
        to = { autoAlpha: 1, y: 0, duration: 0.9, stagger }
        break
      default:
        from = { autoAlpha: 0, y: 18 }
        to = { autoAlpha: 1, y: 0, duration: 0.9 }
    }

    const tween = gsap.fromTo(targets, from, {
      ...to,
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once,
        toggleActions: once ? 'play none none none' : 'play none none reverse',
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [variant, delay, stagger, once])

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
