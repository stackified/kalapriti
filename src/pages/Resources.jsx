import { useState } from 'react'
import { Link } from 'wouter'
import { ArrowUpRight, Plus, Minus } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { GUIDES, JOURNAL, QUESTIONS, RESOURCES_ARE_PROTOTYPE } from '../data/resources'

function Accordion({ item, index }) {
  const [open, setOpen] = useState(index === 0)
  const id = `faq-${index}`
  return (
    <div className={`faq ${open ? 'is-open' : ''}`}>
      <h3>
        <button
          type="button"
          className="faq__trigger"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{item.q}</span>
          {open ? <Minus size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
        </button>
      </h3>
      <div id={id} className="faq__panel" hidden={!open}>
        <p>{item.a}</p>
      </div>
    </div>
  )
}

export default function Resources() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Useful before you enquire"
        lede="Practical guidance on planning, budgeting and running a design project — free to read, no form in the way."
      />

      <section className="section section--top-tight">
        <div className="container">
          {RESOURCES_ARE_PROTOTYPE && (
            <Reveal className="notice notice--lg">
              <strong>Prototype for client review.</strong>
              <p>
                Resources was on the agreed page list but had never been
                defined. This is a proposal in page form — three formats
                (guides, journal, common questions), each shown with sample
                entries. Nothing here is approved copy; the structure is what
                needs a decision.
              </p>
            </Reveal>
          )}

          <Reveal className="sec-head">
            <p className="eyebrow">Guides</p>
            <h2 className="serif sec-head__title">Before you start</h2>
          </Reveal>

          <div className="res-grid">
            {GUIDES.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.07} className="res">
                <span className="res__meta">{g.meta}</span>
                <h3 className="res__title">{g.title}</h3>
                <p className="res__body">{g.body}</p>
                <span className="res__link">
                  Read <ArrowUpRight size={14} aria-hidden="true" />
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <Reveal className="sec-head">
            <p className="eyebrow">Journal</p>
            <h2 className="serif sec-head__title">Notes from the studio</h2>
          </Reveal>

          <div className="jrnl">
            {JOURNAL.map((j, i) => (
              <Reveal key={j.title} delay={i * 0.07} className="jrnl__item">
                <h3 className="serif jrnl__title">{j.title}</h3>
                <p className="jrnl__body">{j.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container faq-wrap">
          <Reveal className="sec-head">
            <p className="eyebrow">Common questions</p>
            <h2 className="serif sec-head__title">Asked in every first meeting</h2>
          </Reveal>

          <div className="faq-list">
            {QUESTIONS.map((item, i) => (
              <Accordion key={item.q} item={item} index={i} />
            ))}
          </div>

          <Reveal delay={0.1}>
            <Link href="/contact" className="link-arrow">
              Ask us something else <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
