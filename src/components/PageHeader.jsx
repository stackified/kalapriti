import Reveal from './Reveal'

/**
 * Shared masthead for inner pages. The drawing-set sheet codes that used to sit
 * here were removed at the client's request; a hairline rule now carries the
 * same structural role without the technical labelling.
 */
export default function PageHeader({ eyebrow, title, lede, children }) {
  return (
    <section className="page-head">
      <div className="container">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="serif page-head__title">{title}</h1>
        </Reveal>

        <Reveal variant="draw" delay={0.2} className="dim-line" aria-hidden="true" />

        {lede && (
          <Reveal delay={0.15}>
            <p className="page-head__lede">{lede}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}
