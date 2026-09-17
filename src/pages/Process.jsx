import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { PROCESS } from '../data/process'

export default function Process() {
  return (
    <>
      <PageHeader
        eyebrow="Process"
        title="How a project runs"
        lede="The same six steps on every project, so you always know what has been settled and what comes next."
      />

      <section className="section process">
        <div className="container">
          <ol className="process__list">
            {PROCESS.map((s, i) => (
              <Reveal as="li" key={s.step} delay={i * 0.05} className="process__item">
                <div className="process__marker" aria-hidden="true">
                  <span className="process__num">{s.step}</span>
                  {i < PROCESS.length - 1 && <span className="process__rule" />}
                </div>
                <div className="process__body">
                  <h2 className="serif process__name">{s.name}</h2>
                  <p className="process__text">{s.body}</p>
                  <p className="process__output">
                    <span className="eyebrow">You receive</span>
                    {s.output}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--deep">
        <div className="container cta__inner">
          <Reveal>
            <h2 className="serif cta__title">Step one is a conversation.</h2>
          </Reveal>
          <Reveal delay={0.1} className="cta__actions">
            <Link to="/contact" className="btn btn--light">
              Book an initial consultation <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
