import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { asset } from '../data/site'
import { PROJECTS, PROJECTS_ARE_PLACEHOLDER } from '../data/projects'

export default function Projects() {
  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        title="Projects"
        lede="Exterior and interior work across residential and commercial briefs."
      />

      <section className="section section--top-tight">
        <div className="container">
          {PROJECTS_ARE_PLACEHOLDER && (
            <Reveal className="notice notice--lg">
              <strong>This page is layout only.</strong>
              <p>
                The previous build published four invented projects with
                fabricated locations and areas. Those have been removed. The
                cards below show how real work will be presented once
                photography and project details are supplied.
              </p>
            </Reveal>
          )}

          <div className="proj-grid proj-grid--page">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06} className={`proj ${i % 2 ? 'proj--offset' : ''}`}>
                <div className="proj__media">
                  <img src={asset(p.image)} alt="" loading="lazy" />
                  {p.isPlaceholder && <span className="proj__badge">Placeholder</span>}
                </div>
                <div className="proj__meta">
                  <h2 className="proj__title">{p.title}</h2>
                  <span className="proj__year">{p.type} · {p.year}</span>
                </div>
                <dl className="proj__facts">
                  <div>
                    <dt>Location</dt>
                    <dd>{p.location ?? 'To be confirmed'}</dd>
                  </div>
                  <div>
                    <dt>Area</dt>
                    <dd>{p.area ?? 'To be confirmed'}</dd>
                  </div>
                </dl>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
