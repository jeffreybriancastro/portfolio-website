import { ArrowUpRight, Gauge, Robot, Code, Storefront } from '@/components/slab'
import type { Icon } from '@/components/slab'

/**
 * TestimonialsGrid - the Testimonials view as a fixed viewport.
 *
 * Two columns inside one glass sheet: the client's own message on the left,
 * the client ledger on the right.
 *
 * The template put a video player here. There are no videos, and a disabled
 * play button that says "no video added yet" is a placeholder wearing a
 * product's clothes - so the left column carries the thing that does exist:
 * the message from The Sushi Box CDO, as a screenshot, exactly as it arrived.
 *
 * It keeps its own white ground on purpose. A chat bubble recoloured to match
 * this palette stops being a receipt and becomes a graphic, which is the
 * opposite of the point. The full text is in the alt, so a screen reader gets
 * all of it.
 */

const QUOTE_ALT =
  'A message from The Sushi Box CDO, sent at 4:18 PM: "Jeffrey, thank you for helping bring The Sushi Box CDO’s online presence to life. You took the time to understand what we actually needed and turned our ideas into a website and booking system that feels simple, professional, and useful for our customers. I really appreciate how hands on you were throughout the process, from planning up to launch. We’re very happy with how everything came together."'

type Client = {
  index: string
  name: string
  role: string
  daily: string
  work: string[]
  href?: string
  Icon: Icon
}

/**
 * TODO (Jeffrey): 02, 03 and 04 are anonymised because the old site shipped
 * them that way. The role line is real - it is what you did for them - but an
 * unnamed client directly under a named one reads as the weaker of the two.
 * Get permission for any of the three and the name goes straight in.
 */
const CLIENTS: Client[] = [
  {
    index: '01',
    name: 'The Sushi Box CDO',
    role: 'Website and booking system',
    daily:
      'A maki shop and event caterer in Cagayan de Oro. I built the site, put their real delivery-app reviews on it, and wired a GoHighLevel calendar into the menu page so pickup bookings land straight in the CRM.',
    work: ['Website', 'GoHighLevel', 'Booking'],
    href: 'https://thesushiboxcdo.com/the-sushi-box-cdo',
    Icon: Storefront,
  },
  {
    index: '02',
    name: 'Client, name withheld',
    role: 'Automation and GHL Specialist',
    daily: 'Built the workflows that save their team hours every day.',
    work: ['Workflows', 'Automation', 'GHL'],
    Icon: Gauge,
  },
  {
    index: '03',
    name: 'Client, name withheld',
    role: 'Funnel Designer and CRM Manager',
    daily:
      'Designed the funnels that turn their traffic into revenue, and manage the CRM behind them.',
    work: ['Funnels', 'CRM', 'Pipelines'],
    Icon: Robot,
  },
  {
    index: '04',
    name: 'Client, name withheld',
    role: 'Automation Architect and GHL Specialist',
    daily: 'Designed a complete business automation system from the ground up.',
    work: ['Systems Design', 'Automation', 'GHL'],
    Icon: Code,
  },
]

export default function TestimonialsGrid() {
  return (
    <section className="pgrid tgrid" aria-labelledby="testimonials-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Testimonials</span>
        <h1 className="pgrid__title" id="testimonials-title">
          One client, in their own words.
        </h1>
        <p className="pgrid__lede">
          A short list on purpose. This is the message that came in after launch, and the
          clients behind the systems on the Projects page.
        </p>
      </header>

      <div className="home__glass tgrid__glass">
        {/* Left: the message itself. */}
        <div className="tgrid__reel">
          <figure className="tgrid__note">
            <figcaption className="tgrid__note-head">
              <span className="tgrid__note-kicker">Client message · after launch</span>
              <span className="tgrid__note-who">The Sushi Box CDO</span>
            </figcaption>
            <div className="tgrid__note-shot">
              <img
                src="/img/testimonial-sushibox.webp"
                width={952}
                height={237}
                alt={QUOTE_ALT}
                decoding="async"
              />
            </div>
            <a
              className="tgrid__note-link"
              href="https://thesushiboxcdo.com/the-sushi-box-cdo"
              target="_blank"
              rel="noopener noreferrer"
            >
              See the site they are talking about
              <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
            </a>
          </figure>
        </div>

        {/* Right: the client ledger, one row per client. */}
        <div className="tgrid__ledger">
          <div className="tgrid__ledger-head">
            <h2 className="tgrid__ledger-title">Who the work was for.</h2>
            <p className="tgrid__ledger-sub">Named where I have permission to.</p>
          </div>

          {/* One plate, rows split by hairlines. Boxed cards each carrying
              their own border read as separate widgets; a single ledger reads
              as one record. */}
          <ul className="tgrid__clients" role="list">
            {CLIENTS.map((c) => {
              const FallbackIcon = c.Icon
              return (
                <li key={c.index} className="tgrid__client">
                  <span className="tgrid__client-ghost" aria-hidden="true">{c.index}</span>
                  <span className="tgrid__client-mark" aria-hidden="true">
                    <FallbackIcon size={22} weight="duotone" />
                  </span>

                  <span className="tgrid__client-body">
                    <span className="tgrid__client-head">
                      {c.href ? (
                        <a
                          className="tgrid__client-name"
                          href={c.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {c.name}
                          <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
                        </a>
                      ) : (
                        <span className="tgrid__client-name">{c.name}</span>
                      )}
                      <span className="tgrid__client-role">{c.role}</span>
                    </span>
                    <span className="tgrid__client-daily">{c.daily}</span>
                    <ul className="tgrid__client-tags" role="list">
                      {c.work.map((w, i) => (
                        <li key={`${w}-${i}`} className="tgrid__client-tag">
                          {w}
                        </li>
                      ))}
                    </ul>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
