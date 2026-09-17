import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="section notfound">
      <div className="container notfound__inner">
        <p className="eyebrow">404</p>
        <h1 className="serif notfound__title">
          That page isn&rsquo;t here.
        </h1>
        <p className="lede">
          The link may be out of date, or the page may have moved.
        </p>
        <Link to="/" className="btn btn--dark">
          Back to home <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
