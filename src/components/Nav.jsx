import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'wouter'
import { Menu, X } from 'lucide-react'
import { BRAND, NAV, CONTACT, LOGO, asset } from '../data/site'

const isActive = (loc, path) => (path === '/' ? loc === '/' : loc.startsWith(path))

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [loc] = useLocation()
  const toggleRef = useRef(null)

  // Close on navigation — adjusted during render, the React-recommended shape
  // for state that derives from a changing value; avoids a cascading effect.
  const [lastLoc, setLastLoc] = useState(loc)
  if (loc !== lastLoc) { setLastLoc(loc); setOpen(false) }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape closes; background scroll locks while the panel is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus() } }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey) }
  }, [open])

  // The transparent treatment is only legible over the home hero; every other
  // page opens on cream, so it renders solid from the first paint.
  const overHero = loc === '/'
  const solid = !overHero || scrolled || open

  return (
    <header className={`nav ${solid ? 'is-solid' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav__inner container">
        <Link href="/" className="nav__brand" aria-label={`${BRAND.nameFull} — home`}>
          <span className="nav__mark" aria-hidden="true">
            <img className="nav__mark-dark" src={asset(LOGO.dark)} alt="" width="46" height="38" />
            <img className="nav__mark-reverse" src={asset(LOGO.reverse)} alt="" width="46" height="38" />
          </span>
          <span className="nav__brand-text">
            <strong>{BRAND.nameUpper}</strong>
            <em>Associates</em>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`nav__link ${isActive(loc, item.path) ? 'is-active' : ''}`}
              aria-current={isActive(loc, item.path) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav__actions">
          <a href={CONTACT.phoneHref} className="nav__phone">{CONTACT.phone}</a>
          <button
            ref={toggleRef}
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Panel is always in the DOM; CSS transitions drive open/close, so there
          is no JS animation to stall and no library to ship for it. */}
      <div id="mobile-menu" className="nav__panel" hidden={!open} aria-hidden={!open}>
        <div className="container nav__panel-inner">
          {NAV.map((item, i) => (
            <Link
              key={item.path}
              href={item.path}
              className={`nav__panel-link ${isActive(loc, item.path) ? 'is-active' : ''}`}
              style={{ '--i': i }}
            >
              <span className="nav__panel-sheet">{item.sheet}</span>
              {item.label}
            </Link>
          ))}
          <a href={CONTACT.phoneHref} className="nav__panel-phone">{CONTACT.phone}</a>
        </div>
      </div>
    </header>
  )
}
