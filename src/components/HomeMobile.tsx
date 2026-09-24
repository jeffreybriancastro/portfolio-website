import { Link } from 'react-router-dom'
import { ArrowUpRight, Stack, CalendarCheck } from '@/components/slab'
import { profile } from '@/data/profile'
import { allWork } from '@/data/funnels'
import { workflowShots } from '@/data/workflows'
import ThemeButton from './ThemeButton'

/**
 * Home on a phone, the parts the rail and the bento used to carry:
 *
 *   HomeProfile  avatar, name, handle and the theme switch - the rail's
 *                identity block, laid flat
 *   HomeStats    three proof facts (profile.stats)
 *   HomeExplore  one tile per rail view in a snap row, then the client
 *                message as a proof card
 *
 * The template put a verified tick beside the name. It is gone: Jeffrey holds
 * no certification, and a tick that stands for nothing is a claim.
 */

export function HomeProfile() {
  return (
    <header className="hprofile">
      <img className="hprofile__avatar" src={profile.avatarSrc} alt="" width={56} height={56} />
      <div className="hprofile__who">
        <span className="hprofile__name">{profile.name}</span>
        <span className="hprofile__handle">
          {profile.handle} · {profile.role}
        </span>
      </div>
      <ThemeButton className="hprofile__theme" />
    </header>
  )
}

export function HomeStats() {
  return (
    <ul className="hstats" role="list">
      {profile.stats.map((s, i) => (
        <li key={i}>
          <b>{s.value}</b>
          <span>{s.label}</span>
        </li>
      ))}
    </ul>
  )
}

const TILES = [
  {
    n: '01',
    label: 'Projects',
    to: '/projects',
    title: 'Six workflows, one pipeline.',
    desc: 'Real screens from the systems I run for clients.',
    img: workflowShots[0].thumb,
  },
  {
    n: '02',
    label: 'Services',
    to: '/services',
    title: 'Four things I build.',
    desc: 'Automations, CRM, funnels, websites. Most start with one.',
    Icon: Stack,
    dark: true,
  },
  {
    n: '03',
    label: 'Book a call',
    to: '/book',
    title: 'Pick a time.',
    desc: 'Fifteen minutes, and a straight answer on the fit.',
    Icon: CalendarCheck,
    dark: true,
    accent: true,
  },
  {
    n: '04',
    label: 'Testimonials',
    to: '/testimonials',
    title: 'What a client said.',
    desc: 'The message from The Sushi Box CDO, as it arrived.',
    img: allWork[0].thumb,
  },
  {
    n: '05',
    label: 'About',
    to: '/about',
    title: `Hi, I'm ${profile.firstName}.`,
    desc: 'GoHighLevel, the automations around it, and the sites that feed it.',
    img: profile.avatarSrc,
  },
] as const

export function HomeExplore() {
  return (
    <>
      <div className="hsec">
        <h2 className="hsec__title">Explore</h2>
        <span className="hsec__aside">Swipe</span>
      </div>
      <ul className="htiles" role="list">
        {TILES.map((t) => (
          <li key={t.to}>
            <Link to={t.to} className={`htile${'dark' in t && t.dark ? ' htile--dark' : ''}${'accent' in t && t.accent ? ' htile--accent' : ''}`}>
              <span className="htile__n">{t.n} {t.label}</span>
              {'img' in t ? (
                <img className="htile__img" src={t.img} alt="" loading="lazy" />
              ) : (
                <span className="htile__glyph"><t.Icon size={52} weight="duotone" aria-hidden="true" /></span>
              )}
              <span className="htile__body">
                <span className="htile__title">{t.title}</span>
                <span className="htile__desc">{t.desc}</span>
              </span>
              <span className="htile__go" aria-hidden="true"><ArrowUpRight size={16} weight="bold" /></span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="hsec">
        <h2 className="hsec__title">What clients say</h2>
        <Link to="/testimonials" className="hsec__aside">See all</Link>
      </div>
      {/* The client's own message, cropped to a thumbnail. The template put a
          play button here for a video testimonial; there is no video, so
          there is no play button promising one. */}
      <Link to="/testimonials" className="hproof">
        <span className="hproof__thumb">
          <img src="/img/testimonial-sushibox.webp" alt="" width={96} height={96} loading="lazy" />
        </span>
        <span className="hproof__copy">
          <span className="hproof__kicker">Client message · after launch</span>
          <span className="hproof__title">
            &ldquo;You took the time to understand what we actually needed.&rdquo;
          </span>
          <span className="hproof__meta">The Sushi Box CDO · Cagayan de Oro</span>
        </span>
      </Link>
    </>
  )
}
