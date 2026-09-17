import { Link } from 'wouter'
import { ArrowUpRight } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { STREAMS, ENGAGEMENTS } from '../data/services'

export default function Services() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="What we take on"
        lede="Four disciplines across two streams, offered through two engagement models — advisory, or end-to-end."
      />

      {STREAMS.map((stream, si) => (
        <section key={stream.id} className={`section stream-sec ${si % 2 ? 'section--tint' : ''}`}>
          <div className="container">
            <div className="stream-sec__head">
              <Reveal className="stream-sec__numwrap">
                <span className="stream-sec__ghost serif" aria-hidden="true">{stream.number}</span>
                <span className="stream-sec__num">{stream.number} / 02</span>
              </Reveal>
              <div>
                <Reveal variant="lines" stagger={0.08}>
                  <h2 className="serif stream-sec__name">{stream.name}</h2>
                  <p className="lede">{stream.summary}</p>
                </Reveal>
              </div>
            </div>

            <Reveal variant="draw" className="hairline hairline--strong" aria-hidden="true" />

            <div className="svc-grid">
              {stream.services.map((s, i) => (
                <Reveal key={s.name} delay={i * 0.1} className="svc">
                  <span className="svc__idx">{stream.number}.{i + 1}</span>
                  <h3 className="svc__name">{s.name}</h3>
                  <p className="svc__body">{s.body}</p>
                  <ul className="svc__tags">
                    {s.tags.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section section--deep">
        <div className="container">
          <Reveal className="sec-head">
            <span className="fig__num fig__num--light">Schedule</span>
            <p className="eyebrow">Engagement models</p>
            <h2 className="serif sec-head__title">How far we carry it</h2>
            <p className="prose sec-head__note">
              Both models are available across either stream. The difference is
              who holds responsibility once building starts.
            </p>
          </Reveal>

          <div className="eng-grid">
            {ENGAGEMENTS.map((e, i) => (
              <Reveal key={e.name} delay={i * 0.1} className="eng">
                <span className="eng__idx">{String.fromCharCode(65 + i)}</span>
                <h3 className="serif eng__name">{e.name}</h3>
                <p className="eng__body">{e.body}</p>
                <p className="eng__suits">{e.suits}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <Link href="/contact" className="link-arrow link-arrow--light">
              Discuss which fits your project <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
