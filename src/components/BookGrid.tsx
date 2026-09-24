import { CheckCircle } from '@/components/slab'
import { profile } from '@/data/profile'
import GhlEmbed from './GhlEmbed'
import { GHL_CALENDAR_SRC, GHL_CALENDAR_FRAME_ID } from '@/lib/ghl'

/**
 * BookGrid - the discovery call calendar.
 *
 * Its own route rather than a second column on Contact: split into a half
 * width the GoHighLevel calendar folds its time slots under the month and
 * doubles in height. So the copy sits beside it on a narrow rail and the
 * widget gets the rest of the measure.
 *
 * Like the enquiry form, the calendar carries its own light palette from
 * GoHighLevel and does not follow the visitor's colour scheme. On the dark
 * theme it is a light card on a dark ground. That is the widget, not a leak.
 */
const POINTS = [
  'Fifteen minutes, and a straight answer on whether I am the right fit.',
  'You talk to me, not an account manager.',
  'Bring what you are running now and what keeps breaking.',
]

export default function BookGrid() {
  return (
    <section className="pgrid bgrid" aria-labelledby="book-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Book a call</span>
        <h1 className="pgrid__title" id="book-title">
          Or just pick a time.
        </h1>
        <p className="pgrid__lede">
          Same answer as the form, faster. The calendar below is my own GoHighLevel - the
          same kind of booking widget I put inside client sites.
        </p>
      </header>

      <div className="home__glass bgrid__glass">
        <aside className="bgrid__aside">
          <ul className="bgrid__points" role="list">
            {POINTS.map((p) => (
              <li key={p} className="bgrid__point">
                <CheckCircle size={16} weight="duotone" aria-hidden="true" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="bgrid__note">
            Nothing here suits? Email <a href={`mailto:${profile.email}`}>{profile.email}</a> and
            we will find a time.
          </p>
        </aside>

        <div className="bgrid__frame">
          <GhlEmbed
            kind="calendar"
            src={GHL_CALENDAR_SRC}
            frameId={GHL_CALENDAR_FRAME_ID}
            title="Booking calendar"
            pending="If the calendar does not load, email me."
          />
          <noscript>
            <p className="ghl-pending">
              <strong>The calendar needs JavaScript.</strong>
              <a href={`mailto:${profile.email}`}>{profile.email}</a> reaches me just as fast.
            </p>
          </noscript>
        </div>
      </div>
    </section>
  )
}
