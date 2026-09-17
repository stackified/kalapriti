import { useEffect, useRef } from 'react'
import { Link } from 'wouter'
import { ArrowUpRight, ArrowDown } from 'lucide-react'
import { gsap, reducedMotion } from '../lib/motion'
import Reveal from '../components/Reveal'
import Picture from '../components/Picture'
import { BRAND, CONTACT, NAV } from '../data/site'
import { STREAMS } from '../data/services'
import { PROCESS } from '../data/process'
import { PROJECTS, PROJECTS_ARE_PLACEHOLDER } from '../data/projects'

/**
 * Hero — one orchestrated entrance, then scroll-driven depth.
 *
 * Entrance is a single timeline: scrim settles, sheet code stamps in, headline
 * lines rise out of clipped wrappers, lede and actions follow. Content is
 * authored visible and only hidden by JS a frame before animating, so a slow
 * script never leaves a blank hero. Parallax is scrubbed to scroll, not time.
 */
function Hero() {
  const ref = useRef(null)
  const cover = NAV[0]

  useEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('.hero__scrim', { opacity: 0.4 }, { opacity: 1, duration: 1.4, ease: 'power2.out' }, 0)
        .fromTo('.hero__stamp', { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.8 }, 0.2)
        .fromTo('.hero__eyebrow', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.35)
        .fromTo('.hero__title .line__inner', { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0.45)
        .fromTo('.hero__lede', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.95)
        .fromTo('.hero__foot', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 1.1)
        .fromTo('.hero__dim', { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: 'power2.inOut', transformOrigin: 'top center' }, 0.6)
        .fromTo('.hero__cue', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1.5)

      // Safety net: the entrance runs on requestAnimationFrame, which browsers
      // throttle or suspend for background tabs. If the timeline hasn't finished
      // on its own by 3.5s, snap it to its end — the headline must never stay
      // clipped inside its overflow wrapper because a tab loaded unfocused.
      const safety = setTimeout(() => { if (tl.progress() < 1) tl.progress(1) }, 3500)
      tl.eventCallback('onComplete', () => clearTimeout(safety))

      gsap.to('.hero__media picture', {
        yPercent: 18, scale: 1.08, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero__inner', {
        yPercent: -10, autoAlpha: 0.15, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" ref={ref}>
      <div className="hero__media">
        <Picture name="hero" alt="" sizes="100vw" priority />
        <div className="hero__scrim" />
      </div>

      <div className="hero__stamp" aria-hidden="true">
        <span className="sheet-code sheet-code--light">{cover.sheet}</span>
        <span className="sheet-label sheet-label--light">{cover.title}</span>
      </div>

      <div className="hero__dim" aria-hidden="true"><span /><span /></div>

      <div className="container hero__inner">
        <p className="hero__eyebrow">{BRAND.discipline}</p>

        <h1 className="serif hero__title">
          <span className="line"><span className="line__inner">designing spaces</span></span>
          <span className="line"><span className="line__inner">that hold their value</span></span>
        </h1>

        <p className="hero__lede">
          {BRAND.nameFull} is an architecture and interior practice working across
          exterior and interior design — from first sketch to styled handover.
        </p>

        <div className="hero__foot">
          <Link href="/projects" className="btn btn--light">
            View our work <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <a href={CONTACT.phoneHref} className="hero__phone">{CONTACT.phone}</a>
        </div>
      </div>

      <div className="hero__cue" aria-hidden="true">
        <ArrowDown size={15} />
        <span>Scroll</span>
      </div>
    </section>
  )
}

function Statement() {
  return (
    <section className="section">
      <div className="container statement">
        <Reveal className="fig">
          <span className="fig__num">Fig. 01</span>
          <span className="eyebrow">The studio</span>
        </Reveal>
        <Reveal variant="lines" stagger={0.1}>
          <h2 className="serif statement__text">
            Architecture is the art of shaping environments — and the discipline
            of making sure they still work in ten years.
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="statement__body">
          <p className="prose">
            We work brand-first. Every decision — a plan, a material, a line of
            copy — is filtered through what the space is meant to say and who it
            is meant to say it to. Buildability is designed in from the start,
            not negotiated afterwards.
          </p>
          <Link href="/about" className="link-arrow">
            More about the practice <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function ServicesPreview() {
  return (
    <section className="section section--tint">
      <div className="container">
        <Reveal className="sec-head">
          <span className="fig__num">Fig. 02</span>
          <p className="eyebrow">What we do</p>
          <h2 className="serif sec-head__title">Two streams, one practice</h2>
        </Reveal>

        <div className="stream-grid">
          {STREAMS.map((stream, i) => (
            <Reveal key={stream.id} delay={i * 0.1} className="stream-card">
              <span className="stream-card__ghost serif" aria-hidden="true">{stream.number}</span>
              <span className="stream-card__num">{stream.number}</span>
              <h3 className="serif stream-card__name">{stream.name}</h3>
              <p className="stream-card__summary">{stream.summary}</p>
              <ul className="stream-card__list">
                {stream.services.map((s) => <li key={s.name}>{s.name}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <Link href="/services" className="link-arrow">
            All services and engagement models <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function ProjectsPreview() {
  return (
    <section className="section">
      <div className="container">
        <Reveal className="sec-head sec-head--row">
          <div>
            <span className="fig__num">Fig. 03</span>
            <p className="eyebrow">Selected work</p>
            <h2 className="serif sec-head__title">Projects</h2>
          </div>
          <Link href="/projects" className="link-arrow">
            All projects <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </Reveal>

        {PROJECTS_ARE_PLACEHOLDER && (
          <Reveal className="notice">
            <strong>Sample layout.</strong> Real project photography and details
            are still to come from the client — nothing below represents completed work.
          </Reveal>
        )}

        <div className="proj-grid">
          {PROJECTS.slice(0, 4).map((p, i) => (
            <article key={p.slug} className={`proj ${i % 2 ? 'proj--offset' : ''}`}>
              <Reveal variant="clip" delay={i * 0.06} className="proj__media">
                <Picture name={`project${i + 1}`} alt="" sizes="(max-width: 700px) 100vw, 50vw" />
              </Reveal>
              <Reveal delay={i * 0.06 + 0.2} className="proj__meta">
                <h3 className="proj__title">{p.title}</h3>
                <span className="proj__year">{p.type} · {p.year}</span>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProcessPreview() {
  return (
    <section className="section section--deep">
      <div className="container">
        <Reveal className="sec-head sec-head--row">
          <div>
            <span className="fig__num fig__num--light">Fig. 04</span>
            <p className="eyebrow">How we work</p>
            <h2 className="serif sec-head__title">Six steps, every project</h2>
          </div>
          <Link href="/process" className="link-arrow link-arrow--light">
            The full process <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </Reveal>

        <Reveal as="ol" variant="lines" stagger={0.07} className="steps-strip">
          {PROCESS.map((s) => (
            <li key={s.step} className="steps-strip__item">
              <span className="steps-strip__num">{s.step}</span>
              <span className="steps-strip__name">{s.name}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="section cta">
      <div className="container cta__inner">
        <Reveal variant="lines" stagger={0.1}>
          <h2 className="serif cta__title">Let&rsquo;s build something<br />worth keeping.</h2>
        </Reveal>
        <Reveal delay={0.15} className="cta__actions">
          <Link href="/contact" className="btn btn--dark">
            Start a project <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <a href={CONTACT.phoneHref} className="cta__phone">{CONTACT.phone}</a>
        </Reveal>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <ServicesPreview />
      <ProjectsPreview />
      <ProcessPreview />
      <CTA />
    </>
  )
}
