import { Link } from 'wouter'
import { ArrowUpRight } from 'lucide-react'
import Reveal from '../components/Reveal'

export default function NotFound() {
  return (
    <section className="section notfound">
      <div className="container notfound__inner">
        <Reveal className="page-head__block">
          <span className="sheet-code">A-404</span>
          <span className="sheet-label">Sheet not issued</span>
        </Reveal>
        <Reveal variant="lines">
          <h1 className="serif notfound__title">That page isn&rsquo;t in the set.</h1>
          <p className="lede">The link may be out of date, or the page may have moved.</p>
        </Reveal>
        <Reveal delay={0.15}>
          <Link href="/" className="btn btn--dark">
            Back to cover <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
