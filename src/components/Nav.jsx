import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { BRAND, NAV, CONTACT, LOGO, asset } from '../data/site'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const toggleRef = useRef(null)

  // Close the menu on navigation. Adjusted during render rather than in an
  // effect — this is the pattern React recommends for state that derives from
  // a changing prop, and it avoids a cascading second render.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape to close, and lock background scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // The transparent/light treatment only works over the home hero. Every other
  // page opens on a cream ground, where a white mark and white links would be
  // invisible — so those render solid from the first paint.
  const overHero = pathname === '/'
  const solid = !overHero || scrolled || open

  return (
    <header className={`nav ${solid ? 'is-solid' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav__inner container">
        <Link to="/" className="nav__brand" aria-label={`${BRAND.nameFull} — home`}>
          <span className="nav__mark" aria-hidden="true">
            <img className="nav__mark-dark" src={asset(LOGO.dark)} alt="" />
            <img className="nav__mark-reverse" src={asset(LOGO.reverse)} alt="" />
          </span>
          <span className="nav__brand-text">
            <strong>{BRAND.nameUpper}</strong>
            <em>Associates</em>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
            >
              {item.label}
            </NavLink>
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

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="nav__panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container nav__panel-inner">
              {NAV.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `nav__panel-link ${isActive ? 'is-active' : ''}`}
                >
                  {item.label}
                </NavLink>
              ))}
              <a href={CONTACT.phoneHref} className="nav__panel-phone">{CONTACT.phone}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
