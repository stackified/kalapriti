import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { BRAND, CONTACT, VALUES, TEAM_ROLES, asset } from '../data/site'

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

          <Reveal delay={0.1} className="about-media">
            <img src={asset('assets/studio.png')} alt="" loading="lazy" />
          </Reveal>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <Reveal className="sec-head">
            <p className="eyebrow">Vision</p>
            <h2 className="serif sec-head__title">
              To shape architectural identities that outlast the trend that
              produced them.
            </h2>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="sec-head">
            <p className="eyebrow">Values</p>
            <h2 className="serif sec-head__title">What we hold to</h2>
          </Reveal>

          <div className="val-grid">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08} className="val">
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
            <p className="eyebrow">The team</p>
            <h2 className="serif sec-head__title">Who you work with</h2>
          </Reveal>

          <Reveal delay={0.08} className="principal">
            <h3 className="principal__name">{CONTACT.principal}</h3>
            <p className="principal__role">{CONTACT.principalRole}</p>
            <a href={CONTACT.phoneHref} className="principal__phone">{CONTACT.phone}</a>
          </Reveal>

          <Reveal delay={0.14} className="roles">
            <p className="eyebrow">Supported by</p>
            <ul className="roles__list">
              {TEAM_ROLES.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <Link to="/contact" className="link-arrow">
              Work with us <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
