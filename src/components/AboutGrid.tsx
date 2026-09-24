import type { CSSProperties } from 'react'
import { ArrowUpRight, MapPin, Clock } from '@/components/slab'
import { profile } from '@/data/profile'

/**
 * AboutGrid - the About view as a fixed viewport.
 *
 * One glass sheet, two columns: who he is on the left, the portrait on the
 * right. Sized to the panel, so nothing here scrolls.
 *
 * The left column is a ladder, not a paragraph block: one display statement,
 * one line of context, then the four things he does, each carrying the marks
 * of the tools it is built with. The tools are the proof, so they are the
 * visual.
 *
 * The template's bar carried a certification badge and a community
 * affiliation. Both are gone - there is no certificate and no affiliation to
 * name - and the two cells that are true took the space: where he is, and
 * the one profile that is actually his.
 */

const GHL = { src: '/icons/gohighlevel.png', name: 'GoHighLevel' }
const N8N = { src: '/icons/ai/n8n.svg', name: 'n8n' }
const ZAPIER = { src: '/icons/ai/zapier.svg', name: 'Zapier' }
const CLAUDE = { src: '/icons/claude-code-logo.png', name: 'Claude Code' }
const CODEX = { src: '/icons/ai/codex.svg', name: 'Codex' }
const GITHUB = { src: '/icons/ai/github.svg', name: 'GitHub' }
const VSCODE = { src: '/icons/vscode.svg', name: 'VS Code' }

type Capability = {
  index: string
  title: string
  marks: { src: string; name: string }[]
}

/**
 * These mirror the four services exactly. The old site's skills list left out
 * funnels and websites even though both were sold on the same page; listing
 * them here closes that gap.
 */
const CAPABILITIES: Capability[] = [
  {
    index: '01',
    title: 'GoHighLevel specialist',
    marks: [GHL],
  },
  {
    index: '02',
    title: 'Automation builder',
    marks: [GHL, N8N, ZAPIER],
  },
  {
    index: '03',
    title: 'CRM systems and pipelines',
    marks: [GHL],
  },
  {
    index: '04',
    title: 'Funnels and websites, AI-coded',
    marks: [CLAUDE, CODEX, VSCODE, GITHUB],
  },
]

export default function AboutGrid() {
  return (
    <section className="pgrid agrid" aria-labelledby="about-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">About</span>
        <h1 className="pgrid__title" id="about-title">
          {`Hi, I’m ${profile.firstName}.`}
        </h1>
        <p className="pgrid__lede">
          I build the CRM and automation systems that keep a business&rsquo;s leads moving,
          and the funnels and sites that feed them.
        </p>
      </header>

      <div className="home__glass agrid__glass">
        <div className="agrid__copy">
          <p className="agrid__lead">
            I don&rsquo;t just generate leads.
            <span>
              {' '}
              I build the system behind the outreach, so nothing gets lost between the
              enquiry and the invoice.
            </span>
          </p>

          <p className="agrid__note">
            <strong>GoHighLevel is the core</strong>, with n8n, Zapier, APIs and webhooks
            around it. I work with CRM setup, pipeline management, automated follow-ups and
            workflow automation - so a business can track conversations, manage
            opportunities and stop losing people who were already interested.
          </p>

          <ul className="agrid__caps" role="list">
            {CAPABILITIES.map((c) => (
              <li key={c.index} className="agrid__cap">
                <span className="agrid__cap-marks">
                  {c.marks.map((m, i) => (
                    <span
                      key={m.name}
                      className="agrid__mark"
                      style={{ '--i': c.marks.length - i } as CSSProperties}
                    >
                      <img src={m.src} alt={m.name} loading="lazy" decoding="async" />
                    </span>
                  ))}
                </span>
                <span className="agrid__cap-title">{c.title}</span>
                <span className="agrid__cap-index" aria-hidden="true">
                  {c.index}
                </span>
              </li>
            ))}
          </ul>

          {/* One plate, cells sharing a mark / title / meta anatomy. */}
          <div className="agrid__bar">
            <span className="agrid__cell">
              <span className="agrid__cell-mark">
                <MapPin size={16} weight="fill" aria-hidden="true" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">{profile.location}</span>
                <span className="agrid__cell-meta">GMT+8</span>
              </span>
            </span>

            <span className="agrid__cell">
              <span className="agrid__cell-mark">
                <Clock size={16} weight="fill" aria-hidden="true" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">Open for new projects</span>
                <span className="agrid__cell-meta">Full-day overlap with Asia and Australia</span>
              </span>
            </span>

            <a
              className="agrid__cell agrid__cell--wide"
              href={profile.socials[0].href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="agrid__cell-mark agrid__cell-mark--plain">
                <img src="/icons/linkedin.svg" alt="" loading="lazy" decoding="async" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">LinkedIn</span>
                <span className="agrid__cell-meta">{profile.handle.replace('@', '')}</span>
              </span>
              <ArrowUpRight className="agrid__cell-go" size={15} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="agrid__portrait">
          <img
            src={profile.hero.portraitSrc}
            alt={profile.hero.portraitAlt}
            loading="eager"
            decoding="async"
            width={720}
            height={960}
          />
        </div>
      </div>
    </section>
  )
}
