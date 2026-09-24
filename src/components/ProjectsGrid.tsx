import { useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, X, CursorClick } from '@/components/slab'
import { FlowIcon, GlobeIcon } from './ProjectIcons'
import { CrmIcon, SiteIcon } from './ProjectIcons'
import { AutomationsPanel, BarrelPanel, PipelinePanel, SushiPanel } from './ProjectPanels'
import { allWork, sushiBox } from '@/data/funnels'
import { workflowShots, pipelineShot, pipelineStages } from '@/data/workflows'
import { useIsPhone } from '@/hooks/useMediaQuery'

/**
 * Projects, as one viewport in Home's bento language: a glass panel of cards,
 * each previewing its own body of work with a live inner track, each opening
 * the work itself in a near-fullscreen dialog (see ProjectPanels).
 *
 * Four cards, because four is what there is real proof for. The template
 * shipped eight, including apps, browser extensions and a flagship product;
 * inventing those would be the one thing this portfolio cannot afford.
 *
 * The dialog is a portal at z 8000, under the funnel preview (9000) so the
 * barrel's own "open this page" dialog can still stack on top of it.
 */
type Cat = 'work' | 'sites'

type Project = {
  id: string
  index: string
  title: string
  desc: string
  Icon: ComponentType<{ size?: number }>
  eyebrow: string
  Section: ComponentType
  span?: 2 | 4
  logos?: string[]
  Preview: ComponentType
  cat: Cat
}

const FILTERS: { key: Cat | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'work', label: 'Systems' },
  { key: 'sites', label: 'Sites' },
]

const GHL = '/icons/gohighlevel.png'
const CLAUDE_CODE = '/icons/claude-code-logo.png'

/* ---------- Previews ---------- */

/** The workflow screens, drifting up a clipped column. */
function WorkflowsPreview() {
  const shots = workflowShots.map((s) => s.thumb)
  return (
    <div className="bento__media bento__reel" aria-hidden="true">
      <div className="bento__reel-track">
        {[...shots, ...shots].map((src, i) => (
          <span key={i} className="bento__shot">
            <img src={src} alt="" loading="lazy" decoding="async" />
          </span>
        ))}
      </div>
    </div>
  )
}

/** The pipeline: the board, then its six stage names. */
function PipelinePreview() {
  return (
    <div className="bento__media bento__board" aria-hidden="true">
      <img className="bento__board-img" src={pipelineShot.thumb} alt="" loading="lazy" decoding="async" />
      <span className="bento__board-stages">
        {pipelineStages.map((s) => (
          <i key={s}>{s.split(' ')[0]}</i>
        ))}
      </span>
    </div>
  )
}

/** The four Sushi Box screens, fanned. */
function SushiPreview() {
  return (
    <div className="bento__media bento__fan" aria-hidden="true">
      {sushiBox.map((f, i) => (
        <span key={f.id} className="bento__photo bento__photo--page" style={{ ['--i' as string]: i }}>
          <img src={f.thumb} alt="" loading="lazy" decoding="async" />
        </span>
      ))}
    </div>
  )
}

/** Everything in the barrel, as a drifting row. */
function SitesPreview() {
  const shots = allWork.map((f) => f.thumb)
  return (
    <div className="bento__media bento__reel bento__reel--row" aria-hidden="true">
      <div className="bento__reel-track">
        {[...shots, ...shots].map((src, i) => (
          <span key={i} className="bento__shot bento__shot--app">
            <img src={src} alt="" loading="lazy" decoding="async" />
          </span>
        ))}
      </div>
    </div>
  )
}

const PROJECTS: Project[] = [
  {
    id: 'workflows',
    cat: 'work',
    index: '01',
    title: 'Six workflows, running',
    desc: 'The published GoHighLevel automations that carry a lead from the first message to a closed deal. Open one to read the steps.',
    Icon: FlowIcon,
    logos: [GHL],
    eyebrow: 'Screenshots',
    Section: AutomationsPanel,
    span: 2,
    Preview: WorkflowsPreview,
  },
  {
    id: 'pipeline',
    cat: 'work',
    index: '02',
    title: 'The booking pipeline',
    desc: 'The board those workflows move records through. Six stages, an owner on every record, 359 opportunities so far.',
    Icon: CrmIcon,
    logos: [GHL],
    eyebrow: 'CRM build',
    Section: PipelinePanel,
    Preview: PipelinePreview,
  },
  {
    id: 'sushibox',
    cat: 'sites',
    index: '03',
    title: 'The Sushi Box CDO',
    desc: 'A maki shop in Cagayan de Oro, live now, with a GoHighLevel calendar taking pickup bookings from inside the site.',
    Icon: SiteIcon,
    logos: [CLAUDE_CODE, GHL],
    eyebrow: 'Live client build',
    Section: SushiPanel,
    Preview: SushiPreview,
  },
  {
    id: 'funnels',
    cat: 'sites',
    index: '04',
    title: 'Pages and sites',
    desc: 'Everything shipped and handed over, on one drum. Drag to spin it, click a page to open it full size.',
    Icon: GlobeIcon,
    logos: [GHL, CLAUDE_CODE],
    eyebrow: 'Pages and sites',
    Section: BarrelPanel,
    span: 4,
    Preview: SitesPreview,
  },
]

/** The icon tile, or the real marks stacked horizontally in its place. */
function Marks({ p, size = 22 }: { p: Project; size?: number }) {
  if (!p.logos?.length) {
    return (
      <span className="bento__icon">
        <p.Icon size={size} />
      </span>
    )
  }
  return (
    <span className="bento__logos" aria-hidden="true">
      {p.logos.map((src) => (
        <span key={src} className="bento__logo">
          <img src={src} alt="" width={22} height={22} decoding="async" />
        </span>
      ))}
    </span>
  )
}

/* ---------- Dialog ----------
   A backdrop, a close button in the corner, and the work. No panel, no
   header: each Section brings its own window (or, for the strip, none). */
function ProjectModal({ project, onClose, children }: { project: Project; onClose: () => void; children: ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div
      className="pmodal"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button ref={closeRef} type="button" className="pmodal__close" onClick={onClose} aria-label="Close">
        <X size={18} weight="bold" />
      </button>
      <div className="pmodal__stage">{children}</div>
    </div>,
    document.body,
  )
}

/* ---------- The page ---------- */

export default function ProjectsGrid() {
  const [open, setOpen] = useState<Project | null>(null)
  const phone = useIsPhone()
  const [cat, setCat] = useState<Cat | 'all'>('all')
  const keep = (p: Project) => !phone || cat === 'all' || p.cat === cat
  const projects = PROJECTS.filter(keep)
  const triggerRef = useRef<HTMLElement | null>(null)

  const show = useCallback((p: Project, el: HTMLElement) => {
    triggerRef.current = el
    setOpen(p)
  }, [])
  const close = useCallback(() => {
    setOpen(null)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  return (
    <section className="pgrid" aria-labelledby="projects-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Projects</span>
        <h1 className="pgrid__title" id="projects-title">
          The systems, and the sites that feed them.
        </h1>
        <p className="pgrid__lede">
          Real screens from real builds - no mockups. Open a card to see it full size.
        </p>
      </header>

      {phone && (
        <div className="pfilter" role="group" aria-label="Filter projects">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className="pfilter__btn"
              aria-pressed={cat === f.key}
              onClick={() => setCat(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="home__glass pgrid__glass">
        {/* Hung on the sheet's top edge so it reads as a tag on the container,
            not an extra card. aria-hidden: the lede already says it. */}
        <span className="pgrid__hint" aria-hidden="true">
          <CursorClick size={14} weight="duotone" />
          Click a card to open it
        </span>
        <div className="bento bento--projects">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`bento__card bento__card--btn${p.span === 4 ? ' bento__card--wide bento__card--full' : p.span === 2 ? ' bento__card--wide' : ''}`}
              data-id={p.id}
              onClick={(e) => show(p, e.currentTarget)}
              aria-haspopup="dialog"
            >
              <span className="bento__head">
                <Marks p={p} />
                <span className="bento__title">{p.title}</span>
                <span className="bento__desc">{p.desc}</span>
                <ArrowUpRight size={15} weight="bold" aria-hidden="true" className="bento__arrow" />
              </span>
              <p.Preview />
            </button>
          ))}
        </div>
      </div>

      {open && (
        <ProjectModal project={open} onClose={close}>
          <open.Section />
        </ProjectModal>
      )}
    </section>
  )
}
