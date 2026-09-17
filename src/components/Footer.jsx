import { Link } from 'wouter'
import { Instagram, ArrowUpRight } from 'lucide-react'
import { BRAND, NAV, CONTACT, LOGO, asset } from '../data/site'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <img src={asset(LOGO.reverse)} alt="" aria-hidden="true" width="78" height="64" />
            <h2 className="serif footer__wordmark">
              {BRAND.nameUpper}<br />Associates
            </h2>
            <p className="footer__tag">{BRAND.discipline}</p>
          </div>

          <div className="footer__cols">
            <div className="footer__col">
              <h3 className="eyebrow">Sheet index</h3>
              {NAV.filter((n) => n.path !== '/').map((item) => (
                <Link key={item.path} href={item.path} className="footer__sheet">
                  <span>{item.sheet}</span>{item.label}
                </Link>
              ))}
            </div>

            <div className="footer__col">
              <h3 className="eyebrow">Contact</h3>
              <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
              {CONTACT.email && <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>}
              <p className="footer__note">{CONTACT.addressNote}</p>
            </div>

            <div className="footer__col">
              <h3 className="eyebrow">Follow</h3>
              <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="footer__social">
                <Instagram size={15} aria-hidden="true" /> Instagram
              </a>
              <Link href="/contact" className="footer__cta">
                Start a project <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Title block — the strip every drawing sheet carries. */}
        <div className="footer__titleblock">
          <div><span>Project</span>{BRAND.nameFull}</div>
          <div><span>Discipline</span>{BRAND.discipline}</div>
          <div><span>Issued</span>{year}</div>
          <div><span>Status</span>© All rights reserved</div>
        </div>
      </div>
    </footer>
  )
}
