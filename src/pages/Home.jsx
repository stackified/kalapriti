import { Link } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ArrowDown } from 'lucide-react'
import Reveal from '../components/Reveal'
import { BRAND, CONTACT, asset } from '../data/site'
import { STREAMS } from '../data/services'
import { PROCESS } from '../data/process'
import { PROJECTS, PROJECTS_ARE_PLACEHOLDER } from '../data/projects'

function Hero() {
  const reduce = useReducedMotion()
  const rise = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
        }

  return (
    <section className="hero">
      <div className="hero__media">
        <img src={asset('assets/hero.png')} alt="" fetchPriority="high" />
        <div className="hero__scrim" />
      </div>

      <div className="container hero__inner">
        <motion.p className="hero__eyebrow" {...rise(0.05)}>
          {BRAND.discipline}
        </motion.p>

        <motion.h1 className="serif hero__title" {...rise(0.15)}>
          designing spaces<br />that hold their value
        </motion.h1>

        <motion.p className="hero__lede" {...rise(0.3)}>
          {BRAND.nameFull} is an architecture and interior practice working across
          exterior and interior design — from first sketch to styled handover.
        </motion.p>

        <motion.div className="hero__foot" {...rise(0.45)}>
          <Link to="/projects" className="btn btn--light">
            View our work <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <a href={CONTACT.phoneHref} className="hero__phone">{CONTACT.phone}</a>
        </motion.div>
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
        <Reveal delay={0.08}>
          <h2 className="serif statement__text">
            Architecture is the art of shaping environments — and the discipline
            of making sure they still work in ten years.
          </h2>
        </Reveal>
        <Reveal delay={0.16} className="statement__body">
          <p className="prose">
            We work brand-first. Every decision — a plan, a material, a line of
            copy — is filtered through what the space is meant to say and who it
            is meant to say it to. Buildability is designed in from the start,
            not negotiated afterwards.
          </p>
          <Link to="/about" className="link-arrow">
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
          <p className="eyebrow">What we do</p>
          <h2 className="serif sec-head__title">Two streams, one practice</h2>
        </Reveal>

        <div className="stream-grid">
          {STREAMS.map((stream, i) => (
            <Reveal key={stream.id} delay={i * 0.08} className="stream-card">
              <span className="stream-card__num">{stream.number}</span>
              <h3 className="serif stream-card__name">{stream.name}</h3>
              <p className="stream-card__summary">{stream.summary}</p>
              <ul className="stream-card__list">
                {stream.services.map((s) => (
                  <li key={s.name}>{s.name}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.16}>
          <Link to="/services" className="link-arrow">
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
            <p className="eyebrow">Selected work</p>
            <h2 className="serif sec-head__title">Projects</h2>
          </div>
          <Link to="/projects" className="link-arrow">
            All projects <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </Reveal>

        {PROJECTS_ARE_PLACEHOLDER && (
          <Reveal className="notice">
            <strong>Sample layout.</strong> Real project photography and details
            are still to come from the client — nothing below represents
            completed work.
          </Reveal>
        )}

        <div className="proj-grid">
          {PROJECTS.slice(0, 4).map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06} className={`proj ${i % 2 ? 'proj--offset' : ''}`}>
              <div className="proj__media">
                <img src={asset(p.image)} alt="" loading="lazy" />
              </div>
              <div className="proj__meta">
                <h3 className="proj__title">{p.title}</h3>
                <span className="proj__year">{p.type} · {p.year}</span>
              </div>
            </Reveal>
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
            <p className="eyebrow">How we work</p>
            <h2 className="serif sec-head__title">Six steps, every project</h2>
          </div>
          <Link to="/process" className="link-arrow link-arrow--light">
            The full process <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </Reveal>

        <ol className="steps-strip">
          {PROCESS.map((s, i) => (
            <Reveal as="li" key={s.step} delay={i * 0.05} className="steps-strip__item">
              <span className="steps-strip__num">{s.step}</span>
              <span className="steps-strip__name">{s.name}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="section cta">
      <div className="container cta__inner">
        <Reveal>
          <h2 className="serif cta__title">Let&rsquo;s build something<br />worth keeping.</h2>
        </Reveal>
        <Reveal delay={0.1} className="cta__actions">
          <Link to="/contact" className="btn btn--dark">
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
