import { useState } from 'react'
import { EnvelopeSimple, CaretDown, CalendarCheck, ArrowUpRight } from '@/components/slab'
import { Link } from 'react-router-dom'
import { FAQS } from '@/data/faqs'
import { profile } from '@/data/profile'
import GhlEmbed from './GhlEmbed'
import { GHL_FORM_SRC, GHL_FORM_FRAME_ID } from '@/lib/ghl'

/**
 * ContactGrid - the Contact view as a fixed viewport.
 *
 * One glass sheet, two columns: the questions people ask before they write on
 * the left, on a dark plate (one open at a time), and the enquiry form on the
 * right.
 *
 * The form is Jeffrey's real GoHighLevel form, not a local one. That is a
 * deliberate trade: the template's own form is prettier and matches this
 * palette, but it posts to a mailto: by default, and this portfolio's whole
 * argument is that an enquiry should land in a CRM as an opportunity with an
 * owner on it. The form on this page is the same wiring as the workflows on
 * the Projects page. It is worth the seam.
 *
 * The seam is real, though: the widget carries its own light palette from
 * GoHighLevel and does not follow the visitor's colour scheme, so on the dark
 * theme it reads as a light card on a dark ground. Its colours are set in
 * ghl/form-theme.css, pasted into the form's Custom CSS inside GoHighLevel -
 * nothing on this side can reach into the iframe.
 */
export default function ContactGrid() {
  // One question open at a time so the plate never grows past the form.
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <section className="pgrid cgrid" aria-labelledby="contact-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">FAQs / Contact</span>
        <h1 className="pgrid__title" id="contact-title">
          Tell me what you&rsquo;re building.
        </h1>
        <p className="pgrid__lede">
          What you&rsquo;re running now, what&rsquo;s still manual, and where it&rsquo;s
          leaking. I&rsquo;ll come back with how I&rsquo;d wire it and what it takes.
        </p>
      </header>

      <div className="home__glass cgrid__glass">
        {/* Left: the dark plate. What happens after you press send. */}
        <aside className="cgrid__aside" aria-labelledby="contact-faq">
          <div className="cgrid__aside-head">
            <span className="cgrid__eyebrow">FAQs</span>
            <h2 className="cgrid__aside-title" id="contact-faq">
              Quick answers.
              <br />
              <span>Still have one? Write beside this.</span>
            </h2>
          </div>

          <ul className="cgrid__faqs" role="list">
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i
              return (
                <li key={f.q} className={`cgrid__faq${isOpen ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className="cgrid__faq-q"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`cfaq-${i}`}
                  >
                    <span className="cgrid__step-index" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="cgrid__faq-text">{f.q}</span>
                    <CaretDown size={14} weight="bold" className="cgrid__faq-caret" aria-hidden="true" />
                  </button>
                  <div className="cgrid__faq-a" id={`cfaq-${i}`} hidden={!isOpen}>
                    <p>{f.a}</p>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="cgrid__direct">
            <a className="cgrid__mail" href={`mailto:${profile.email}`}>
              <EnvelopeSimple size={16} weight="fill" aria-hidden="true" />
              <span>{profile.email}</span>
            </a>
            <Link className="cgrid__book" to="/book">
              <CalendarCheck size={15} weight="fill" aria-hidden="true" />
              <span>Or pick a time</span>
              <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </aside>

        {/* Right: the real GoHighLevel form. */}
        <div className="cgrid__panel cgrid__panel--embed">
          <GhlEmbed
            kind="form"
            src={GHL_FORM_SRC}
            frameId={GHL_FORM_FRAME_ID}
            title="Enquiry form"
            pending="If the form does not load, email me."
          />
          <noscript>
            <p className="ghl-pending">
              <strong>The enquiry form needs JavaScript.</strong>
              <a href={`mailto:${profile.email}`}>{profile.email}</a> reaches me just as fast.
            </p>
          </noscript>
        </div>
      </div>
    </section>
  )
}
