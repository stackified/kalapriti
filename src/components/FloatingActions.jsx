import { useEffect, useRef, useState } from 'react'
import { Phone, X } from 'lucide-react'
import { CONTACT } from '../data/site'

/** Lucide has no WhatsApp glyph, and one path is cheaper than a second icon package. */
function WhatsAppIcon({ size = 19 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2A9.9 9.9 0 0 0 2.1 11.9c0 1.75.46 3.46 1.33 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01A9.9 9.9 0 0 0 22 11.95 9.9 9.9 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37 8.24 8.24 0 0 1 14.07-5.82 8.18 8.18 0 0 1 2.42 5.83 8.24 8.24 0 0 1-8.24 8.22z" />
    </svg>
  )
}

/**
 * Floating contact actions.
 *
 * Both buttons open a menu of numbers rather than acting on one directly: the
 * practice publishes two, and committing to either silently would make the
 * other unreachable from here.
 *
 * Only one menu is open at a time. Each closes on Escape (returning focus to
 * its trigger), on a pointerdown outside, and on making a choice. Entries are
 * plain anchors, so long-press, copy and "open in app" behave natively.
 */
export default function FloatingActions() {
  // null | 'call' | 'whatsapp' — a single value means opening one closes the other.
  const [openMenu, setOpenMenu] = useState(null)
  const wrapRef = useRef(null)
  const callRef = useRef(null)
  const waRef = useRef(null)

  const numbers = [
    { label: CONTACT.phone, tel: CONTACT.phoneHref, wa: CONTACT.whatsappHref },
    CONTACT.phoneAlt && {
      label: CONTACT.phoneAlt, tel: CONTACT.phoneAltHref, wa: CONTACT.whatsappAltHref,
    },
  ].filter(Boolean)

  useEffect(() => {
    if (!openMenu) return
    const triggerFor = () => (openMenu === 'call' ? callRef : waRef).current

    const onKey = (e) => {
      if (e.key === 'Escape') { const t = triggerFor(); setOpenMenu(null); t?.focus() }
    }
    // pointerdown rather than click: fires before an anchor navigates, so the
    // menu is already closing if the tap landed outside it.
    const onPointerDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpenMenu(null)
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [openMenu])

  const menu = (kind, title, hrefKey, icon) => {
    // Bound as a const rather than used as a capitalised parameter: this
    // project's ESLint has no jsx-uses-vars, so the parameter form reads as
    // unused even though it is the JSX element name.
    const Icon = icon
    return (
    <div id={`${kind}-menu`} className="fab__menu" hidden={openMenu !== kind}>
      <div className="fab__menu-head">
        <span>{title}</span>
        <button
          type="button"
          className="fab__menu-close"
          aria-label="Close"
          onClick={() => {
            const t = (kind === 'call' ? callRef : waRef).current
            setOpenMenu(null); t?.focus()
          }}
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>
      {numbers.map((n) => (
        <a
          key={n[hrefKey]}
          href={n[hrefKey]}
          className="fab__menu-item"
          {...(kind === 'whatsapp' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          onClick={() => setOpenMenu(null)}
        >
          <Icon size={15} />
          {n.label}
        </a>
      ))}
    </div>
    )
  }

  return (
    <div className="fab" role="group" aria-label="Contact shortcuts" ref={wrapRef}>
      <div className="fab__wrap">
        {menu('whatsapp', 'WhatsApp us', 'wa', WhatsAppIcon)}
        <button
          ref={waRef}
          type="button"
          className="fab__btn fab__btn--wa"
          aria-expanded={openMenu === 'whatsapp'}
          aria-controls="whatsapp-menu"
          aria-label={openMenu === 'whatsapp' ? 'Close WhatsApp menu' : 'Message us on WhatsApp'}
          onClick={() => setOpenMenu((v) => (v === 'whatsapp' ? null : 'whatsapp'))}
        >
          <WhatsAppIcon />
          <span className="fab__label">WhatsApp</span>
        </button>
      </div>

      <div className="fab__wrap">
        {menu('call', 'Call us', 'tel', Phone)}
        <button
          ref={callRef}
          type="button"
          className="fab__btn fab__btn--call"
          aria-expanded={openMenu === 'call'}
          aria-controls="call-menu"
          aria-label={openMenu === 'call' ? 'Close call menu' : 'Call us'}
          onClick={() => setOpenMenu((v) => (v === 'call' ? null : 'call'))}
        >
          <Phone size={18} aria-hidden="true" />
          <span className="fab__label">Call</span>
        </button>
      </div>
    </div>
  )
}
