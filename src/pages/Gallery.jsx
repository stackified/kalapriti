import { useCallback, useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Picture from '../components/Picture'
import { GALLERY, GALLERY_IS_PLACEHOLDER } from '../data/gallery'

/**
 * Lightbox.
 *
 * Rendered only while open, so there is no hidden copy of every image sitting
 * in the DOM. Keyboard: Escape closes, arrows move. Focus goes to the close
 * button on open and returns to the tile that opened it, which is the part
 * that is easy to leave out and makes the whole thing unusable without a
 * mouse.
 */
function Lightbox({ items, index, onClose, onStep, restoreTo }) {
  const closeRef = useRef(null)
  const item = items[index]

  // Focus in on mount, back out on unmount. Doing the restore here rather than
  // in the close handler means it runs however the dialog closed — Escape,
  // backdrop, the button — and it runs after React has removed the dialog, so
  // nothing can steal the focus back.
  //
  // It deliberately does not go through requestAnimationFrame. rAF does not
  // fire in a background tab, and a focus restore that silently does not
  // happen is how a gallery becomes unusable by keyboard without anyone
  // noticing. The tile is never unmounted, so there is nothing to wait for.
  useEffect(() => {
    closeRef.current?.focus()
    const opener = restoreTo.current
    return () => opener?.focus()
  }, [restoreTo])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'ArrowLeft') onStep(-1)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, onStep])

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${items.length}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <button ref={closeRef} type="button" className="lightbox__btn lightbox__close" onClick={onClose} aria-label="Close">
        <X size={20} aria-hidden="true" />
      </button>

      {items.length > 1 && (
        <button type="button" className="lightbox__btn lightbox__prev" onClick={() => onStep(-1)} aria-label="Previous image">
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
      )}

      <figure className="lightbox__figure">
        <Picture name={item.name} alt={item.alt} sizes="90vw" imgClassName="lightbox__img" />
        <figcaption className="lightbox__count">{index + 1} / {items.length}</figcaption>
      </figure>

      {items.length > 1 && (
        <button type="button" className="lightbox__btn lightbox__next" onClick={() => onStep(1)} aria-label="Next image">
          <ChevronRight size={22} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

export default function Gallery() {
  const [open, setOpen] = useState(null)
  // The tile that opened the viewer, not the tile currently shown: WAI-ARIA
  // puts focus back on the invoking element, and after arrowing through six
  // images "where I came in" is the only predictable place to land.
  const opener = useRef(null)

  const close = useCallback(() => setOpen(null), [])

  // Wraps at both ends, so arrowing never dead-ends on the last image.
  const step = useCallback(
    (delta) => setOpen((i) => (i + delta + GALLERY.length) % GALLERY.length),
    [],
  )

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="The work"
        lede="Interiors, exteriors and the detail in between."
      />

      <section className="section section--top-tight">
        <div className="container">
          {GALLERY_IS_PLACEHOLDER && (
            <Reveal className="notice notice--lg">
              <strong>This page is layout only.</strong>
              <p>
                The tiles below are placeholder renders, shown so the grid and
                the viewer can be finished ahead of time. They will be replaced
                with the practice&rsquo;s own photography — nothing here is
                presented as completed work.
              </p>
            </Reveal>
          )}

          <ul className="gallery">
            {GALLERY.map((item, i) => (
              <li key={item.name} className={`gallery__cell ${item.span ? `gallery__cell--${item.span}` : ''}`}>
                <Reveal variant="clip" delay={(i % 3) * 0.06}>
                  <button
                    type="button"
                    className="gallery__tile"
                    onClick={(e) => { opener.current = e.currentTarget; setOpen(i) }}
                    aria-label={item.alt || `Open image ${i + 1} of ${GALLERY.length}`}
                  >
                    <Picture
                      name={item.name}
                      alt=""
                      sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                      imgClassName="gallery__img"
                    />
                  </button>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {open !== null && (
        <Lightbox items={GALLERY} index={open} onClose={close} onStep={step} restoreTo={opener} />
      )}
    </>
  )
}
