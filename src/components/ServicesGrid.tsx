import type { CSSProperties } from 'react'
import { MagnetStraight, Timer, PlugsConnected, Trophy, CheckCircle } from '@/components/slab'
import type { Icon } from '@/components/slab'
import Autopilot, { TOOLS } from '@/components/Autopilot'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from '@/components/slab'

/**
 * ServicesGrid - the Services view on one glass sheet.
 *
 * Three bands, top to bottom: the four-step method (on a dark plate so it is
 * the first thing the eye lands on), the four services as cards carrying the
 * marks of what each is built with, and the live automation diagram scaled
 * into whatever height is left.
 *
 * Four services, not the template's five, and four method steps, not three:
 * both numbers are what Jeffrey actually sells and actually does. The grids
 * in services-grid.css were widened to match.
 */

/* ---------- The method ---------- */

type Stage = {
  index: string
  label: string
  body: string
  Icon: Icon
  chips: string[]
}

const STAGES: Stage[] = [
  {
    index: '01',
    label: 'Discover',
    body: 'We map the workflow you actually need, not the one the software assumes.',
    Icon: MagnetStraight,
    chips: ['Audit', 'Pipeline map', 'Scope'],
  },
  {
    index: '02',
    label: 'Design & build',
    body: 'The site or funnel goes live on your stack, in your account.',
    Icon: Timer,
    chips: ['Funnel', 'Website', 'Copy fit'],
  },
  {
    index: '03',
    label: 'Connect & automate',
    body: 'CRM, forms and tools wired together so records move themselves.',
    Icon: PlugsConnected,
    chips: ['Workflows', 'Webhooks', 'Calendars'],
  },
  {
    index: '04',
    label: 'Launch & support',
    body: 'You run it. I stay on for the fixes and the changes.',
    Icon: Trophy,
    chips: ['Handover', 'Fixes', 'Updates'],
  },
]

/* ---------- The services ---------- */

const GHL = '/icons/gohighlevel.png'
const N8N = '/icons/ai/n8n.svg'
const ZAPIER = '/icons/ai/zapier.svg'
const CLAUDE_CODE = '/icons/claude-code-logo.png'
const CODEX = '/icons/ai/codex.svg'
const GITHUB = '/icons/ai/github.svg'

type Service = {
  index: string
  /** The walkthrough behind this service, under /work/. */
  slug: string
  title: string
  description: string
  chip: string
  logos: string[]
  bullets: string[]
}

const SERVICES: Service[] = [
  {
    index: '01',
    slug: 'automation-workflow',
    title: 'Automation Workflows',
    description: 'Follow-up that keeps working after you log off.',
    chip: 'Runs without you',
    logos: [GHL, N8N, ZAPIER],
    bullets: [
      'Every enquiry gets chased, every time',
      'Deals advance as the work actually happens',
      'Nothing waits on you to notice',
      'Works with the stack you already have',
    ],
  },
  {
    index: '02',
    slug: 'ghl-crm-setup',
    title: 'CRM Setup',
    description: 'A GoHighLevel build your team stops working around.',
    chip: 'No training',
    logos: [GHL],
    bullets: [
      'Every record sits where you would look for it',
      'Stages named after your real sales process',
      'A new hire can run it on day one',
    ],
  },
  {
    index: '03',
    slug: 'sales-funnel',
    title: 'AI-Coded Funnels',
    description: 'Multi-step pages that carry a lead to a booked call.',
    chip: 'Fast turnaround',
    logos: [GHL, CLAUDE_CODE, CODEX],
    bullets: [
      'No step where people quietly drop off',
      'Booking and checkout wired in',
      'Ends in a booking, not a maybe',
      'Lives and connects inside GoHighLevel',
    ],
  },
  {
    index: '04',
    slug: 'website-build',
    title: 'AI-Coded Websites',
    description: 'On-brand sites that load quickly and hand over clean.',
    chip: 'Yours to keep',
    logos: [CLAUDE_CODE, GITHUB, GHL],
    bullets: [
      'Quick on a phone, not just your laptop',
      'Connects straight into your GoHighLevel',
      'You get the repository, not a rental',
    ],
  },
]

/** The tool marks, stacked horizontally on white tiles (same as Projects). */
function Marks({ logos }: { logos: string[] }) {
  return (
    <span className="bento__logos" aria-hidden="true">
      {logos.map((src) => (
        <span key={src} className="bento__logo">
          <img src={src} alt="" width={22} height={22} decoding="async" />
        </span>
      ))}
    </span>
  )
}

/* ---------- The page ---------- */

export default function ServicesGrid() {
  return (
    <section className="pgrid sgrid" aria-labelledby="services-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Services</span>
        <h1 className="pgrid__title" id="services-title">
          Four things I build. Most clients start with one.
        </h1>
        <p className="pgrid__lede">
          They end up connected, because a funnel that does not feed the CRM is just a page.
        </p>
      </header>

      <div className="home__glass sgrid__glass">
        {/* One dark plate, the headline on the left, the four stages wired in
            order on the right with a signal running them. */}
        <div className="sgrid__method" aria-labelledby="method-title">
          <div className="sgrid__method-copy">
            <span className="sgrid__method-eyebrow">How a project runs</span>
            <h2 className="sgrid__method-title" id="method-title">
              Map it. Build it.
              <br />
              <span>Wire it. Hand it over.</span>
            </h2>
            <p className="sgrid__method-sub">
              The mapping comes first because most of what breaks later is a stage nobody
              named at the start.
            </p>
          </div>

          <ol className="sgrid__stages" role="list">
            {STAGES.map((s, i) => {
              const StageIcon = s.Icon
              return (
                <li key={s.index} className="sgrid__stage" style={{ '--i': i } as CSSProperties}>
                  <span className="sgrid__stage-ghost" aria-hidden="true">{s.index}</span>
                  <span className="sgrid__stage-icon" aria-hidden="true">
                    <StageIcon size={22} weight="duotone" />
                  </span>
                  <h3 className="sgrid__stage-label">{s.label}.</h3>
                  <p className="sgrid__stage-body">{s.body}</p>
                  <ul className="sgrid__stage-chips" role="list" aria-label={`${s.label} touches`}>
                    {s.chips.map((c) => (
                      <li key={c} className="sgrid__stage-chip">{c}</li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Four cards, each carrying the marks of what it is built with. */}
        <div className="sgrid__offers">
          <div className="sgrid__offers-head">
            <h2 className="sgrid__offers-title">What I build.</h2>
            <p className="sgrid__offers-sub">Open one to see how it gets built.</p>
          </div>
          <ul className="bento sgrid__services" role="list">
            {SERVICES.map((s) => (
              <li key={s.title} className="bento__card sgrid__service">
                <span className="bento__head">
                  <span className="sgrid__service-top">
                    <Marks logos={s.logos} />
                    <span className="sgrid__service-index" aria-hidden="true">
                      {s.index} / {String(SERVICES.length).padStart(2, '0')}
                    </span>
                  </span>
                  <span className="bento__title">
                    <Link className="sgrid__service-link" to={`/work/${s.slug}`}>
                      {s.title}
                      <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
                    </Link>
                  </span>
                  <span className="bento__desc">{s.description}</span>
                </span>
                <span className="sgrid__chip" aria-hidden="true">{s.chip}</span>
                <ul className="sgrid__bullets" role="list">
                  {s.bullets.map((b) => (
                    <li key={b} className="sgrid__bullet">
                      <CheckCircle size={15} weight="duotone" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        {/* The live workflow. Its caption and the tool chips sit in a header
            above the window, so the canvas gets the whole glass width. */}
        <div className="sgrid__flow">
          <header className="sgrid__flow-head">
            <div className="sgrid__flow-copy">
              <span className="sgrid__flow-eyebrow">Live automation</span>
              <h2 className="sgrid__flow-title">A lead arrives. Nothing after it waits on you.</h2>
              <p className="sgrid__flow-sub">
                This is the booking pipeline on the Projects page, drawn as it runs: the
                enquiry lands, the call is booked, the reminders go out, and the record
                moves stage without anyone touching it.
              </p>
            </div>
            <ul className="sgrid__flow-tools" role="list" aria-label="Tools that power this flow">
              {TOOLS.map(({ Icon: ToolIcon, label }) => (
                <li key={label} className="sgrid__flow-tool">
                  <ToolIcon size={14} weight="duotone" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </header>
          <div className="sgrid__flow-main">
            <Autopilot compact maxScale={1.08} />
          </div>
        </div>
      </div>
    </section>
  )
}
