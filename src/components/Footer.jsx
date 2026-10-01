import { Link } from 'wouter'
import { Instagram, ArrowUpRight } from 'lucide-react'
import { BRAND, VISIBLE_NAV, CONTACT, LOGO, asset } from '../data/site'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            {/* Mark only, matching the header. Nothing else in this column
                names the practice now, so the logo takes a real alt. */}
            <img src={asset(LOGO.reverse)} alt={BRAND.nameFull} width="78" height="64" />
          </div>

          {/* h2, not h3: these are the footer's top-level sections. Since the
              wordmark heading came out of the footer there is no h2 above them
              to be subsections of, and the outline jumped from the page's last
              heading straight to h3. */}
          <div className="footer__cols">
            <div className="footer__col">
              <h2 className="eyebrow">Navigate</h2>
              {VISIBLE_NAV.filter((n) => n.path !== '/').map((item) => (
                <Link key={item.path} href={item.path}>{item.label}</Link>
              ))}
            </div>

            <div className="footer__col">
              <h2 className="eyebrow">Contact</h2>
              <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
              {CONTACT.phoneAlt && <a href={CONTACT.phoneAltHref}>{CONTACT.phoneAlt}</a>}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              <p className="footer__note">{CONTACT.addressNote}</p>
            </div>

            <div className="footer__col">
              <h2 className="eyebrow">Follow</h2>
              {/* Icon only, per the client: the handle is already the brand
                  name, so spelling it out read as repetition. The label moves
                  to aria-label so the link is still announced. */}
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social"
                aria-label={`${BRAND.nameFull} on Instagram — ${CONTACT.instagramHandle}`}
              >
                <Instagram size={26} aria-hidden="true" />
              </a>
              <Link href="/contact" className="footer__cta">
                Start a project <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {year} {BRAND.nameFull}. All rights reserved.</p>
          <p>{BRAND.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
