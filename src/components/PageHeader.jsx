import { useLocation } from 'wouter'
import Reveal from './Reveal'
import { sheetFor } from '../data/site'

/**
 * Every inner page opens as a drawing sheet: the sheet code and title-block
 * label in the corner, the page title, and a dimension line beneath it that
 * draws in — the recurring signature that makes the set read as one document.
 */
export default function PageHeader({ eyebrow, title, lede, children }) {
  const [loc] = useLocation()
  const { sheet, title: block } = sheetFor(loc)

  return (
    <section className="page-head">
      <div className="container">
        <Reveal className="page-head__block">
          <span className="sheet-code">{sheet}</span>
          <span className="sheet-label">{block}</span>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="serif page-head__title">{title}</h1>
        </Reveal>

        <Reveal variant="draw" delay={0.25} className="dim-line" aria-hidden="true">
          <span className="dim-line__tick" /><span className="dim-line__tick" />
        </Reveal>

        {lede && (
          <Reveal delay={0.18}>
            <p className="page-head__lede">{lede}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}
