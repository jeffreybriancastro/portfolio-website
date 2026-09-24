import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, CheckCircle } from '@/components/slab'
import { caseStudies, bySlug } from '@/data/caseStudies'
import SysMap from './SysMap'

/**
 * One service walkthrough: how the build gets made.
 *
 * The copy is carried over word for word from the old site's work/*.html
 * pages, including the `frame` line that says out loud these are walkthroughs
 * of the build rather than accounts of a single engagement. That sentence is
 * the reason the page can carry this much detail honestly, so it stays near
 * the top where it is read rather than buried at the bottom.
 *
 * This route scrolls, unlike the six fixed viewports. There is roughly five
 * hundred words here and a diagram; laying that out to the panel box would
 * mean cutting it, and the cutting is the part that was already done once.
 */
export default function CaseStudy() {
  const { slug } = useParams()
  const cs = bySlug(slug)
  if (!cs) return <Navigate to="/services" replace />

  const others = caseStudies.filter((c) => c.slug !== cs.slug)

  return (
    <article className="pgrid cs" aria-labelledby="cs-title">
      <header className="pgrid__head cs__head">
        <Link className="cs__back" to="/services">
          <ArrowLeft size={14} weight="bold" aria-hidden="true" />
          All services
        </Link>
        <h1 className="pgrid__title" id="cs-title">{cs.title}</h1>
        <p className="pgrid__lede">{cs.outcome}</p>
        <p className="cs__frame">{cs.frame}</p>

        <dl className="cs__facts">
          {cs.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="home__glass cs__glass">
        <section className="cs__map" aria-labelledby="cs-system">
          <h2 className="cs__h2" id="cs-system">The system that got built</h2>
          <SysMap
            nodes={cs.sysmap.nodes}
            edges={cs.sysmap.edges}
            route={cs.sysmap.route}
            cols={cs.sysmap.cols}
            gap={cs.sysmap.gap}
          />
        </section>

        <div className="cs__detail">
          <section className="cs__card cs__card--problem">
            <h2 className="cs__h2">The problem</h2>
            <p className="cs__copy">{cs.problem}</p>
          </section>

          <section className="cs__card">
            <h2 className="cs__h2">What I built</h2>
            <ul className="cs__list" role="list">
              {cs.built.map((b) => (
                <li key={b}>
                  <CheckCircle size={15} weight="duotone" aria-hidden="true" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="cs__card">
            <h2 className="cs__h2">What you get</h2>
            <ul className="cs__list" role="list">
              {cs.get.map((g) => (
                <li key={g}>
                  <CheckCircle size={15} weight="duotone" aria-hidden="true" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="cs__card cs__card--wired">
            <h2 className="cs__h2">How it&rsquo;s wired</h2>
            <ol className="cs__steps" role="list">
              {cs.wired.map((w, i) => (
                <li key={w.name}>
                  <span className="cs__step-num" aria-hidden="true">{i + 1}</span>
                  <div>
                    <p className="cs__step-name">{w.name}</p>
                    <p className="cs__step-desc">{w.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

        </div>

        <ul className="cs__tools" role="list" aria-label="Tools used on this build">
          {cs.tools.map((t) => (
            <li key={t} className="cs__tool">{t}</li>
          ))}
        </ul>
      </div>

      <section className="cs__close" aria-label="Keep going">
        <div className="cs__more">
          <h2 className="cs__h2">Other work</h2>
          <div className="cs__more-list">
            {others.map((o) => (
              <Link key={o.slug} className="cs__more-link" to={`/work/${o.slug}`}>
                <span>
                  <span className="cs__more-name">{o.short}</span>
                  <span className="cs__more-desc">{o.blurb}</span>
                </span>
                <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>

        <div className="cs__cta">
          <h2 className="cs__h2">Want this build?</h2>
          <p className="cs__copy">
            Tell me what you&rsquo;re trying to build, and I&rsquo;ll tell you how to get there.
          </p>
          <Link className="cs__cta-btn" to="/contact">
            Get in touch
            <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </article>
  )
}
