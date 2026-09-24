import { lazy, Suspense, type ReactNode } from 'react'
import { ArrowUpRight } from '@/components/slab'
import WorkflowSamples from './WorkflowSamples'
import { useFunnelModal } from './FunnelModal'
import { allWork, sushiBox } from '@/data/funnels'
import { pipelineShot, buildSteps, pipelineStages } from '@/data/workflows'

const FunnelBarrel = lazy(() => import('./FunnelBarrel'))

/**
 * What the Projects dialogs show. Each panel is the work itself, on screen
 * the moment the dialog opens - no section chrome to read past and no second
 * dialog to click into.
 */

/** The six workflow screens, drifting on the backdrop. No window. */
export function AutomationsPanel() {
  return (
    <div className="ppanel ppanel--strip">
      <WorkflowSamples />
    </div>
  )
}

/** A plain mac window with a scrolling body, for the panels that are pages
 *  rather than frames. */
function SectionWindow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ppanel ppanel--window">
      <div className="ppanel__bar">
        <span className="ppanel__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="ppanel__url">
          <span className="ppanel__url-host">{label}</span>
        </span>
      </div>
      <div className="ppanel__scroll">{children}</div>
    </div>
  )
}

/** Only the barrel, spinning on the backdrop. Its own preview still stacks
 *  above it (z 9000). */
export function BarrelPanel() {
  const { openFull, modal } = useFunnelModal()
  return (
    <div className="ppanel ppanel--barrel">
      <Suspense fallback={<div className="funnels__barrel-skeleton" aria-hidden="true" />}>
        <FunnelBarrel funnels={allWork} onOpen={openFull} />
      </Suspense>
      {modal}
    </div>
  )
}

/**
 * The pipeline the six workflows move records through: the board itself, then
 * the stages, then what each workflow does. The 359 is the board's own count.
 */
export function PipelinePanel() {
  return (
    <SectionWindow label="The booking pipeline">
      <div className="wpanel">
        <header className="wpanel__head">
          <h2 className="wpanel__title">Six stages, 359 opportunities</h2>
          <p className="wpanel__lede">
            Every record has an owner and a stage, and the six workflows move it between them.
            Contact names are blurred; nothing else is touched.
          </p>
        </header>

        <figure className="wpanel__figure">
          <img src={pipelineShot.full} alt={pipelineShot.alt} loading="lazy" decoding="async" />
          <figcaption>{pipelineShot.label}</figcaption>
        </figure>

        <ol className="wpanel__stages" role="list">
          {pipelineStages.map((s) => {
            const [num, ...rest] = s.split(' ')
            return (
              <li key={s} className="wpanel__stage">
                <span className="wpanel__stage-num">{num}</span>
                <span>{rest.join(' ')}</span>
              </li>
            )
          })}
        </ol>

        <ol className="wpanel__steps" role="list">
          {buildSteps.map((b) => (
            <li key={b.num} className="wpanel__step">
              <span className="wpanel__step-num">{b.num}</span>
              <div>
                <h3 className="wpanel__step-name">{b.name}</h3>
                <p className="wpanel__step-desc">{b.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </SectionWindow>
  )
}

/**
 * The one client build that is public end to end: the site is live, the
 * booking calendar inside it is his GoHighLevel, and the client wrote about it
 * afterwards. Four screens, each opening full size.
 */
export function SushiPanel() {
  const { openFull, modal } = useFunnelModal()
  return (
    <>
      <SectionWindow label="thesushiboxcdo.com">
        <div className="wpanel">
          <header className="wpanel__head">
            <h2 className="wpanel__title">The Sushi Box CDO</h2>
            <p className="wpanel__lede">
              A maki shop in Cagayan de Oro, built and handed over: the menu, the catering
              gallery, their real Grab and Foodpanda reviews on the page, and a GoHighLevel
              calendar taking pickup bookings from inside the site.
            </p>
            <a
              className="wpanel__link"
              href="https://thesushiboxcdo.com/the-sushi-box-cdo"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open the live site
              <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
            </a>
          </header>

          <ul className="wpanel__shots" role="list">
            {sushiBox.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  className="wpanel__shot"
                  onClick={(e) => openFull(f, e.currentTarget)}
                >
                  <img src={f.thumb} alt={f.desc} loading="lazy" decoding="async" />
                  <span className="wpanel__shot-label">{f.label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* The client's own message, as it arrived. Retyping it and setting
              it in the site's face turns a receipt into copy I wrote; the
              screenshot is the part that cannot be. The full text is in the
              alt, so it is still there for a screen reader. */}
          <figure className="wpanel__quote">
            <figcaption className="wpanel__quote-lead">After launch, from the client.</figcaption>
            <img
              src="/img/testimonial-sushibox.webp"
              width={952}
              height={237}
              loading="lazy"
              decoding="async"
              alt={'A message from The Sushi Box CDO, sent at 4:18 PM: "Jeffrey, thank you for helping bring The Sushi Box CDO’s online presence to life. You took the time to understand what we actually needed and turned our ideas into a website and booking system that feels simple, professional, and useful for our customers. I really appreciate how hands on you were throughout the process, from planning up to launch. We’re very happy with how everything came together."'}
            />
          </figure>
        </div>
      </SectionWindow>
      {modal}
    </>
  )
}
