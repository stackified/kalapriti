import { useEffect, useRef } from 'react'
import { Link } from 'wouter'
import { ArrowUpRight } from 'lucide-react'
import { gsap, ScrollTrigger, reducedMotion } from '../lib/motion'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { PROCESS } from '../data/process'

/**
 * The showpiece. Six steps read as one continuous drawing:
 *
 * - A ghosted numeral, sticky beside the list, counts 01 → 06 as the reader
 *   scrolls. It is the page's clock.
 * - The vertical rail fills in step with scroll position (scrubbed, not timed),
 *   so the reader always sees how far through the sequence they are.
 * - Each step's marker switches from outline to solid green while it is the
 *   active one, then back — a live cursor on the sequence.
 *
 * All of it degrades to a plain, fully readable list under reduced-motion.
 */
export default function Process() {
  const ref = useRef(null)
  const ghostRef = useRef(null)

  useEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.process__item')

      gsap.fromTo('.process__rail-fill',
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: '.process__list', start: 'top 55%', end: 'bottom 55%', scrub: 0.4 } })

      items.forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 58%',
          end: 'bottom 58%',
          onToggle: (self) => {
            item.classList.toggle('is-active', self.isActive)
            if (self.isActive && ghostRef.current) {
              const g = ghostRef.current
              gsap.timeline()
                .to(g, { autoAlpha: 0, y: -14, duration: 0.22, ease: 'power2.in' })
                .add(() => { g.textContent = PROCESS[i].step })
                .fromTo(g, { y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' })
            }
          },
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <PageHeader
        eyebrow="Process"
        title="How a project runs"
        lede="The same six steps on every project, so you always know what has been settled and what comes next."
      />

      <section className="section process" ref={ref}>
        <div className="container process__layout">
          <div className="process__aside" aria-hidden="true">
            <div className="process__ghost-wrap">
              <span ref={ghostRef} className="process__ghost serif">01</span>
              <span className="process__ghost-of">of 06</span>
            </div>
          </div>

          <ol className="process__list">
            <span className="process__rail" aria-hidden="true"><span className="process__rail-fill" /></span>
            {PROCESS.map((s, i) => (
              <li key={s.step} className="process__item">
                <div className="process__marker" aria-hidden="true">
                  <span className="process__num">{s.step}</span>
                </div>
                <Reveal delay={0.05} className="process__body">
                  <h2 className="serif process__name">{s.name}</h2>
                  <p className="process__text">{s.body}</p>
                  <p className="process__output">
                    <span className="eyebrow">You receive</span>
                    {s.output}
                  </p>
                  {i < PROCESS.length - 1 && <Reveal variant="draw" className="hairline" aria-hidden="true" />}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--deep">
        <div className="container cta__inner">
          <Reveal variant="lines">
            <h2 className="serif cta__title">Step one is a conversation.</h2>
          </Reveal>
          <Reveal delay={0.12} className="cta__actions">
            <Link href="/contact" className="btn btn--light">
              Book an initial consultation <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
