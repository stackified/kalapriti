import { useEffect, useRef, useState } from 'react'
import { Phone, X } from 'lucide-react'
import { CONTACT } from '../data/site'

/**
 * Floating contact actions — WhatsApp, and a Call button that opens a small
 * menu of numbers.
 *
 * Call opens a menu rather than dialling straight away because the practice
 * publishes two numbers; dialling one of them silently would make the other
 * unreachable from here. WhatsApp stays a direct link — it only has one
 * destination, so a menu would be friction for nothing.
 *
 * The menu closes on Escape (returning focus to the trigger), on a click
 * outside, and on choosing a number. Numbers are plain `tel:` anchors, so
 * long-press, copy and "add to contacts" all behave natively.
 */
export default function FloatingActions() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const triggerRef = useRef(null)
  const firstItemRef = useRef(null)

  const numbers = [
    { label: CONTACT.phone, href: CONTACT.phoneHref },
    CONTACT.phoneAlt && { label: CONTACT.phoneAlt, href: CONTACT.phoneAltHref },
  ].filter(Boolean)

  useEffect(() => {
    if (!open) return

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    // Pointer rather than click: fires before the anchor navigates, so the menu
    // is already closing if the tap landed outside it.
    const onPointerDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    firstItemRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div className="fab" role="group" aria-label="Contact shortcuts">
      <a
        className="fab__btn fab__btn--wa"
        href={CONTACT.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message us on WhatsApp"
      >
        {/* Inline mark: lucide has no WhatsApp glyph, and one path is cheaper
            than pulling in a second icon package. */}
        <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
          <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z" />
          <path d="M12.04 2A9.9 9.9 0 0 0 2.1 11.9c0 1.75.46 3.46 1.33 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01A9.9 9.9 0 0 0 22 11.95 9.9 9.9 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37 8.24 8.24 0 0 1 14.07-5.82 8.18 8.18 0 0 1 2.42 5.83 8.24 8.24 0 0 1-8.24 8.22z" />
        </svg>
        <span className="fab__label">WhatsApp</span>
      </a>

      <div className="fab__wrap" ref={wrapRef}>
        <div id="call-menu" className="fab__menu" hidden={!open}>
          <div className="fab__menu-head">
            <span>Call us</span>
            <button
              type="button"
              className="fab__menu-close"
              aria-label="Close"
              onClick={() => { setOpen(false); triggerRef.current?.focus() }}
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
          {numbers.map((n, i) => (
            <a
              key={n.href}
              ref={i === 0 ? firstItemRef : undefined}
              href={n.href}
              className="fab__menu-item"
              onClick={() => setOpen(false)}
            >
              <Phone size={15} aria-hidden="true" />
              {n.label}
            </a>
          ))}
        </div>

        <button
          ref={triggerRef}
          type="button"
          className="fab__btn fab__btn--call"
          aria-expanded={open}
          aria-controls="call-menu"
          aria-label={open ? 'Close call menu' : 'Call us'}
          onClick={() => setOpen((v) => !v)}
        >
          <Phone size={18} aria-hidden="true" />
          <span className="fab__label">Call</span>
        </button>
      </div>
    </div>
  )
}
