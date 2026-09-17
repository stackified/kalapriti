import { useState, useRef } from 'react'
import { ArrowUpRight, Phone, Check } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { CONTACT } from '../data/site'

/**
 * FORM TRANSPORT — interim.
 *
 * The previous build called preventDefault() and did nothing else, so every
 * enquiry was silently discarded. The destination inbox is still unconfirmed
 * (client Q10), so rather than invent an address, the form hands off to
 * WhatsApp on the number the client *has* confirmed. Nothing is lost, and the
 * visitor can see exactly what is being sent.
 *
 * TO SWITCH to a real backend: set MODE to 'endpoint', put the Formspree /
 * Resend / EmailJS URL in ENDPOINT, and the submit handler posts instead.
 */
const MODE = 'whatsapp' // 'whatsapp' | 'endpoint'
const ENDPOINT = null

const WA_NUMBER = CONTACT.phoneHref.replace(/[^\d]/g, '')

const PROJECT_TYPES = [
  'Architecture planning',
  'Interior design',
  'Landscape',
  'Renovation & staging',
  'Turnkey project',
  'Not sure yet',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact() {
  const [values, setValues] = useState({
    name: '', contact: '', type: PROJECT_TYPES[0], message: '',
  })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const statusRef = useRef(null)

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    setErrors((err) => (err[key] ? { ...err, [key]: undefined } : err))
  }

  const validate = () => {
    const next = {}
    if (!values.name.trim()) next.name = 'Please tell us your name.'
    const c = values.contact.trim()
    if (!c) {
      next.contact = 'Add a phone number or email so we can reply.'
    } else if (!EMAIL_RE.test(c) && c.replace(/[^\d]/g, '').length < 8) {
      next.contact = 'That does not look like a valid phone number or email.'
    }
    if (values.message.trim().length < 10) {
      next.message = 'A sentence or two about the project helps us reply usefully.'
    }
    return next
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) {
      const first = document.getElementById(Object.keys(next)[0])
      first?.focus()
      return
    }

    setBusy(true)
    try {
      if (MODE === 'endpoint' && ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        if (!res.ok) throw new Error('Request failed')
      } else {
        const text =
          `New enquiry\n\n` +
          `Name: ${values.name}\n` +
          `Contact: ${values.contact}\n` +
          `Project: ${values.type}\n\n` +
          `${values.message}`
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
      }
      setSent(true)
      requestAnimationFrame(() => statusRef.current?.focus())
    } catch {
      setErrors({ form: 'Something went wrong sending that. Please call us instead.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Start a project"
        lede="Tell us roughly what you have in mind. The first consultation is a conversation, not a commitment."
      />

      <section className="section section--top-tight">
        <div className="container contact-grid">
          <div className="contact-aside">
            <Reveal>
              <h2 className="eyebrow">Speak to us</h2>
              <a href={CONTACT.phoneHref} className="contact-phone">
                <Phone size={18} aria-hidden="true" />
                {CONTACT.phone}
              </a>
              <p className="contact-person">
                {CONTACT.principal}<br />
                <span>{CONTACT.principalRole}</span>
              </p>
            </Reveal>

            <Reveal delay={0.08} className="contact-note">
              <h3 className="eyebrow">Where we work</h3>
              <p>{CONTACT.addressNote}</p>
            </Reveal>

            <Reveal delay={0.14} className="contact-note">
              <h3 className="eyebrow">What happens next</h3>
              <ol className="contact-next">
                <li>We reply to arrange an initial consultation.</li>
                <li>We visit the site and measure up.</li>
                <li>You get an indicative scope, timeline and fee.</li>
              </ol>
            </Reveal>
          </div>

          <Reveal delay={0.06} className="contact-form-wrap">
            {sent ? (
              <div className="form-done" tabIndex={-1} ref={statusRef} role="status">
                <span className="form-done__icon" aria-hidden="true"><Check size={22} /></span>
                <h2 className="serif form-done__title">Message ready to send</h2>
                <p>
                  We&rsquo;ve opened WhatsApp with your details filled in — press
                  send there and it reaches us directly. If it didn&rsquo;t open,
                  call <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>.
                </p>
                <button type="button" className="btn btn--dark" onClick={() => setSent(false)}>
                  Send another
                </button>
              </div>
            ) : (
              <form className="form" onSubmit={onSubmit} noValidate>
                {errors.form && <p className="form__error form__error--top" role="alert">{errors.form}</p>}

                <div className="field">
                  <label htmlFor="name">Your name</label>
                  <input
                    id="name" name="name" type="text" autoComplete="name"
                    value={values.name} onChange={set('name')}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-err' : undefined}
                  />
                  {errors.name && <p className="form__error" id="name-err" role="alert">{errors.name}</p>}
                </div>

                <div className="field">
                  <label htmlFor="contact">Phone or email</label>
                  <input
                    id="contact" name="contact" type="text" autoComplete="tel"
                    value={values.contact} onChange={set('contact')}
                    aria-invalid={!!errors.contact}
                    aria-describedby={errors.contact ? 'contact-err' : undefined}
                  />
                  {errors.contact && <p className="form__error" id="contact-err" role="alert">{errors.contact}</p>}
                </div>

                <div className="field">
                  <label htmlFor="type">What kind of project?</label>
                  <select id="type" name="type" value={values.type} onChange={set('type')}>
                    {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="message">About the project</label>
                  <textarea
                    id="message" name="message" rows="5"
                    value={values.message} onChange={set('message')}
                    placeholder="Location, rough size, what stage you're at, and what you're hoping for."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-err' : undefined}
                  />
                  {errors.message && <p className="form__error" id="message-err" role="alert">{errors.message}</p>}
                </div>

                <button type="submit" className="btn btn--dark form__submit" disabled={busy}>
                  {busy ? 'Sending…' : 'Send enquiry'}
                  {!busy && <ArrowUpRight size={17} aria-hidden="true" />}
                </button>

                <p className="form__fine">
                  Sends via WhatsApp to {CONTACT.phone} so nothing gets lost while
                  our enquiry inbox is being set up.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}
