import { useEffect, useRef } from 'react'
import { Link } from 'wouter'
import { ArrowUpRight, ArrowDown } from 'lucide-react'
import { gsap, reducedMotion } from '../lib/motion'
import Reveal from '../components/Reveal'
import Picture from '../components/Picture'
import { BRAND, CONTACT, HERO_VIDEO, asset } from '../data/site'
import { STREAMS } from '../data/services'
import { PROCESS } from '../data/process'

/**
 * Hero — light beige ground with an asymmetric editorial split: a text column
 * beside a tall architectural capture, following the 5/7 proportion in the
 * client's own Stitch design spec.
 *
 * The media slot takes a looping muted video when one is supplied (see
 * HERO_VIDEO in src/data/site.js) and falls back to the responsive still
 * otherwise, so dropping the file in is a one-line change.
 */
function Hero() {
  const ref = useRef(null)

  useEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('.hero__eyebrow', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.1)
        .fromTo('.hero__title .line__inner', { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0.2)
        .fromTo('.hero__lede', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.7)
        .fromTo('.hero__foot', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.85)
        .fromTo('.hero__media', { autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' },
                { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power3.inOut' }, 0.3)
        .fromTo('.hero__cue', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1.3)

      // rAF is suspended in background tabs; a timer still fires. Without this
      // the headline could stay clipped inside its overflow wrapper.
      const safety = setTimeout(() => { if (tl.progress() < 1) tl.progress(1) }, 3500)
      tl.eventCallback('onComplete', () => clearTimeout(safety))

      gsap.to('.hero__media-inner', {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" ref={ref}>
      <div className="container hero__grid">
        <div className="hero__inner">
          <p className="hero__eyebrow">{BRAND.discipline}</p>

          <h1 className="serif hero__title">
            <span className="line"><span className="line__inner">stories behind</span></span>
            <span className="line"><span className="line__inner">every detail</span></span>
          </h1>

          <p className="hero__lede">
            {BRAND.nameFull} is an architecture and interior practice working across
            exterior and interior design — from first sketch to styled handover.
          </p>

          <div className="hero__foot">
            <Link href="/contact" className="btn btn--dark">
              Start a project <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <a href={CONTACT.phoneHref} className="hero__phone">{CONTACT.phone}</a>
          </div>
        </div>

        <div className="hero__media">
          <div className="hero__media-inner">
            {HERO_VIDEO ? (
              <video
                className="hero__video"
                src={asset(HERO_VIDEO.src)}
                poster={asset(HERO_VIDEO.poster)}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <Picture name="hero" alt="" sizes="(max-width: 900px) 100vw, 55vw" priority />
            )}
          </div>
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
        <Reveal>
          <p className="eyebrow">The studio</p>
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
    <section className="section section--deep">
      <div className="container">
        <Reveal className="sec-head">
          <p className="eyebrow">What we do</p>
          <h2 className="serif sec-head__title">Two streams, one practice</h2>
        </Reveal>

        <div className="stream-grid">
          {STREAMS.map((stream, i) => (
            <Reveal key={stream.id} delay={i * 0.1} className="stream-card">
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
          <Link href="/services" className="link-arrow link-arrow--light">
            All services and engagement models <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function ProcessPreview() {
  return (
    <section className="section section--wine">
      <div className="container">
        <Reveal className="sec-head sec-head--row">
          <div>
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
          <h2 className="serif cta__title">let&rsquo;s build something<br />worth keeping.</h2>
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
      <ProcessPreview />
      <CTA />
    </>
  )
}
