import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Picture from '../components/Picture'
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
              <article key={p.slug} className={`proj ${i % 2 ? 'proj--offset' : ''}`}>
                <Reveal variant="clip" delay={i * 0.06} className="proj__media">
                  <Picture name={`project${i + 1}`} alt="" sizes="(max-width: 700px) 100vw, 50vw" />
                  <span className="proj__fig">Fig. {String(i + 1).padStart(2, '0')}</span>
                  {p.isPlaceholder && <span className="proj__badge">Placeholder</span>}
                </Reveal>
                <Reveal delay={i * 0.06 + 0.2}>
                  <div className="proj__meta">
                    <h2 className="proj__title">{p.title}</h2>
                    <span className="proj__year">{p.type} · {p.year}</span>
                  </div>
                  <dl className="proj__facts">
                    <div><dt>Location</dt><dd>{p.location ?? 'To be confirmed'}</dd></div>
                    <div><dt>Area</dt><dd>{p.area ?? 'To be confirmed'}</dd></div>
                  </dl>
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
