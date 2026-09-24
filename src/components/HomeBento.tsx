import type React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  FolderOpen,
  User,
  FlowArrow,
  ChartLineUp,
  Stack,
  Quotes,
  FunnelSimple,
  Gear,
  AddressBook,
  Globe,
} from '@/components/slab'
import { allWork } from '@/data/funnels'
import { workflowShots } from '@/data/workflows'
import { profile } from '@/data/profile'

/**
 * Home's showcase: one card per rail view, each an index of what that view
 * holds, each built from content the portfolio already ships. Every card is
 * a link. Nothing here invents a fact - the work, the workflows, the clients
 * and the numbers are the same records the views render in full.
 *
 * The template's fourth card was a certification badge. Jeffrey holds no
 * certification, and a badge that means nothing is worse than no badge, so
 * that slot carries the thing he can actually prove instead: the live board.
 *
 * Motion is transform-only on a clipped inner track, so a card never adds
 * height and Home stays a single viewport.
 */

const PROJECT_SHOTS = allWork.slice(0, 4)

const OFFERS = [
  { Icon: Gear, title: 'Automation Workflows', note: 'Follow-up that runs without you' },
  { Icon: AddressBook, title: 'CRM Setup', note: 'A GoHighLevel build nobody works around' },
  { Icon: FunnelSimple, title: 'AI-Coded Funnels', note: 'Pages that end in a booking' },
  { Icon: Globe, title: 'AI-Coded Websites', note: 'Fast, on-brand, yours to keep' },
] as const

/**
 * TODO (Jeffrey): three of these four are anonymised because the old site
 * shipped them that way. The role line is yours, which is real information,
 * but an unnamed client is weaker proof than a named one sitting right above
 * it. Give me permission for any of the three names and they go in.
 */
const CLIENTS = [
  {
    name: 'The Sushi Box CDO',
    role: 'Website and booking system',
    work: 'Website · GoHighLevel · Booking',
  },
  { name: 'Client, name withheld', role: 'Automation and GHL Specialist', work: 'Workflows · Automation · GHL' },
  { name: 'Client, name withheld', role: 'Funnel Designer · CRM Manager', work: 'Funnels · CRM · Pipelines' },
  { name: 'Client, name withheld', role: 'Automation Architect', work: 'Systems Design · Automation · GHL' },
]

/** The six workflows as chips, in the order the build runs them. */
const BUILDS = workflowShots.filter((s) => s.num)

// The two photographs there actually are. The fan shows them under 100px.
const PHOTOS = [profile.hero.portraitSrc, profile.avatarSrc]

function CardHead({
  Icon,
  title,
  desc,
}: {
  Icon: typeof FolderOpen
  title: string
  desc: string
}) {
  return (
    <header className="bento__head">
      <span className="bento__label">
        <span className="bento__icon">
          <Icon size={20} weight="fill" aria-hidden="true" />
        </span>
        <h3 className="bento__title">{title}</h3>
      </span>
      <p className="bento__desc">{desc}</p>
      <ArrowUpRight size={15} weight="bold" aria-hidden="true" className="bento__arrow" />
    </header>
  )
}

export default function HomeBento() {
  const half = Math.ceil(BUILDS.length / 2)
  const chipRows = [BUILDS.slice(0, half), BUILDS.slice(half)]

  return (
    <nav className="bento" aria-label="Explore the portfolio">
      {/* Projects: the work thumbnails drift upward on a looped track. */}
      <Link to="/projects" className="bento__card bento__card--projects">
        <CardHead
          Icon={FolderOpen}
          title="Projects"
          desc="Shipped client systems, and the screens from inside them."
        />
        <div className="bento__media bento__reel" aria-hidden="true">
          <div className="bento__reel-track">
            {[...PROJECT_SHOTS, ...PROJECT_SHOTS].map((f, i) => (
              <span key={i} className="bento__shot">
                <img src={f.thumb} alt="" loading="lazy" decoding="async" />
              </span>
            ))}
          </div>
        </div>
      </Link>

      {/* About: a fanned stack of photos. */}
      <Link to="/about" className="bento__card bento__card--about">
        <CardHead Icon={User} title="About" desc="Who you would actually be working with." />
        <div className="bento__media bento__fan" aria-hidden="true">
          {PHOTOS.map((src, i) => (
            <span key={src} className="bento__photo" style={{ ['--i' as string]: i }}>
              <img src={src} alt="" loading="lazy" decoding="async" />
            </span>
          ))}
        </div>
      </Link>

      {/* The six workflows, two chip rows scrolling against each other. */}
      <Link to="/projects" className="bento__card bento__card--ai">
        <CardHead
          Icon={FlowArrow}
          title="Automations"
          desc="Six published workflows carrying a lead from first message to closed deal."
        />
        <div className="bento__media bento__chips" aria-hidden="true">
          {chipRows.map((row, r) => (
            <div key={r} className="bento__chip-row" data-dir={r ? 'right' : 'left'}>
              <div className="bento__chip-track">
                {[...row, ...row].map((n, i) => (
                  <span key={`${n.id}-${i}`} className="bento__chip" data-status="Live">
                    <b>{n.num}</b>
                    {n.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Link>

      {/* The live board. The number is the board's own count, not a claim. */}
      <Link to="/projects" className="bento__card bento__card--creds">
        <CardHead
          Icon={ChartLineUp}
          title="The live board"
          desc="One pipeline, six stages, running in GoHighLevel right now."
        />
        <div className="bento__media bento__stat" aria-hidden="true">
          <span className="bento__stat-big">359</span>
          <span className="bento__stat-label">opportunities tracked</span>
          <span className="bento__stat-sub">
            <img src="/icons/gohighlevel.png" alt="" width={15} height={15} />
            6 workflows moving them
          </span>
        </div>
      </Link>

      {/* Services: the four offers as a compact index. */}
      <Link to="/services" className="bento__card bento__card--services">
        <CardHead
          Icon={Stack}
          title="Services"
          desc="Four things I build. Most clients start with one."
        />
        <ul className="bento__media bento__offers" role="list">
          {OFFERS.map(({ Icon, title, note }, i) => (
            <li key={title} className="bento__offer" style={{ '--i': i } as React.CSSProperties}>
              <span className="bento__offer-tile">
                <Icon size={15} weight="duotone" aria-hidden="true" />
              </span>
              <span className="bento__offer-text">
                <span className="bento__offer-title">{title}</span>
                <span className="bento__offer-note">{note}</span>
              </span>
              <span className="bento__offer-num" aria-hidden="true">
                0{i + 1}
              </span>
            </li>
          ))}
        </ul>
      </Link>

      {/* Testimonials: client cards drifting up a clipped column. */}
      <Link to="/testimonials" className="bento__card bento__card--quotes">
        <CardHead Icon={Quotes} title="Testimonials" desc="What a client said after launch." />
        <div className="bento__media bento__reviews" aria-hidden="true">
          <div className="bento__reviews-track">
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <span key={i} className="bento__review">
                <span className="bento__review-top">
                  <Quotes size={14} weight="fill" />
                  <b>{c.name}</b>
                </span>
                <span className="bento__review-role">{c.role}</span>
                <span className="bento__review-work">{c.work}</span>
              </span>
            ))}
          </div>
        </div>
      </Link>
    </nav>
  )
}
