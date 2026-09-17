import { Link } from 'wouter'
import { ArrowUpRight } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Picture from '../components/Picture'
import { BRAND, CONTACT, VALUES, TEAM_ROLES } from '../data/site'

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="The practice"
        lede="An online-first architecture and design consultancy, built around brand value and buildable detail."
      />

      <section className="section section--top-tight">
        <div className="container about-grid">
          <Reveal className="about-copy">
            <p className="about-lead">
              {BRAND.nameFull} is an architectural and design consultancy working
              across exterior and interior design. We take projects from the
              first conversation through to a styled handover — either as design
              consultants alongside your contractor, or as a turnkey team.
            </p>
            <p className="prose">
              We are deliberately an online-first studio. That keeps overheads
              out of the fee and puts our time where it changes the outcome: on
              site, in the drawing set, and in front of the people who will use
              the space.
            </p>
            <p className="prose">
              The work is brand-led. Before a plan is drawn we settle what the
              space is meant to communicate — because a building that photographs
              well but says nothing is a missed opportunity, and one that says
              the wrong thing is worse.
            </p>
          </Reveal>

          <Reveal variant="clip" delay={0.1} className="about-media">
            <Picture name="studio" alt="" sizes="(max-width: 860px) 100vw, 42vw" />
            <span className="proj__fig">Fig. 01 — Studio</span>
          </Reveal>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <Reveal className="fig">
            <span className="fig__num">Fig. 02</span>
            <span className="eyebrow">Vision</span>
          </Reveal>
          <Reveal variant="lines" stagger={0.1}>
            <h2 className="serif sec-head__title sec-head__title--wide">
              To shape architectural identities that outlast the trend that
              produced them.
            </h2>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="sec-head">
            <span className="fig__num">Fig. 03</span>
            <p className="eyebrow">Values</p>
            <h2 className="serif sec-head__title">What we hold to</h2>
          </Reveal>

          <div className="val-grid">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1} className="val">
                <Reveal variant="draw" className="val__rule" aria-hidden="true" />
                <span className="val__idx">0{i + 1}</span>
                <h3 className="val__title">{v.title}</h3>
                <p className="val__body">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container about-team">
          <Reveal>
            <span className="fig__num">Fig. 04</span>
            <p className="eyebrow">The team</p>
            <h2 className="serif sec-head__title">Who you work with</h2>
          </Reveal>

          <Reveal delay={0.1} className="principal">
            <h3 className="serif principal__name">{CONTACT.principal}</h3>
            <p className="principal__role">{CONTACT.principalRole}</p>
            <a href={CONTACT.phoneHref} className="principal__phone">{CONTACT.phone}</a>
          </Reveal>

          <Reveal delay={0.16} className="roles">
            <p className="eyebrow">Supported by</p>
            <ul className="roles__list">
              {TEAM_ROLES.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </Reveal>

          <Reveal delay={0.22}>
            <Link href="/contact" className="link-arrow">
              Work with us <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
