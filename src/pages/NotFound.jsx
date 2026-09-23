import { Link } from 'wouter'
import { ArrowUpRight } from 'lucide-react'
import Reveal from '../components/Reveal'

export default function NotFound() {
  return (
    <section className="section notfound">
      <div className="container notfound__inner">
        <Reveal variant="lines">
          <p className="eyebrow">404</p>
          <h1 className="serif notfound__title">that page isn&rsquo;t here.</h1>
          <p className="lede">The link may be out of date, or the page may have moved.</p>
        </Reveal>
        <Reveal delay={0.15}>
          <Link href="/" className="btn btn--dark">
            Back to home <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
