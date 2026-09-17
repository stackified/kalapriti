import Reveal from './Reveal'

/** Shared masthead for inner pages — keeps every page opening on the same grid. */
export default function PageHeader({ eyebrow, title, lede, children }) {
  return (
    <section className="page-head">
      <div className="container">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="serif page-head__title">{title}</h1>
        </Reveal>
        {lede && (
          <Reveal delay={0.08}>
            <p className="page-head__lede">{lede}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}
