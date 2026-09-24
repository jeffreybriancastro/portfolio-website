import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from '@/components/slab'
import { workflowShots, type Shot } from '@/data/workflows'

/**
 * WorkflowSamples
 *
 * A horizontally scrolling marquee of the GoHighLevel workflow screens.
 * Clicking any frame opens the full screenshot in a faux macOS window.
 *
 * These are tall: a published GoHighLevel flow runs to two thousand pixels.
 * The window therefore scrolls rather than scaling the image down to fit the
 * viewport - being able to read the steps is the whole reason to open it.
 *
 * Marquee: the list is duplicated so the CSS keyframe can translate -50% and
 * land the reset on a seamless seam. The duplicate half is aria-hidden and out
 * of the tab order, so each frame is announced once.
 */

type Props = {
  /** Defaults to the six workflows plus the list screen. */
  shots?: Shot[]
  caption?: string
}

export default function WorkflowSamples({
  shots = workflowShots,
  caption = 'Six published workflows in GoHighLevel, and the list they sit in. Open one to read the steps.',
}: Props) {
  const doubled = useMemo(() => [...shots, ...shots], [shots])

  const [active, setActive] = useState<Shot | null>(null)
  const lastTriggerRef = useRef<HTMLElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  const open = useCallback((s: Shot, trigger: HTMLElement | null) => {
    lastTriggerRef.current = trigger ?? (document.activeElement as HTMLElement | null)
    setActive(s)
  }, [])

  const close = useCallback(() => {
    setActive(null)
    requestAnimationFrame(() => lastTriggerRef.current?.focus())
  }, [])

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active, close])

  return (
    <section className="wfs" id="workflow-samples" aria-labelledby="wfs-heading" data-reveal>
      <p className="wfs__caption" id="wfs-heading">
        {caption}
      </p>

      <div className="wfs__strip">
        <div className="wfs__track">
          {doubled.map((s, i) => {
            const clone = i >= shots.length
            return (
              <button
                key={`${s.id}-${i}`}
                type="button"
                className="wfs__frame"
                onClick={(e) => open(s, e.currentTarget)}
                aria-hidden={clone || undefined}
                tabIndex={clone ? -1 : undefined}
                aria-label={clone ? undefined : `Open ${s.label}`}
              >
                <span className="wfs__frame-bar" aria-hidden="true">
                  <span className="wfs__dot wfs__dot--r" />
                  <span className="wfs__dot wfs__dot--y" />
                  <span className="wfs__dot wfs__dot--g" />
                  {s.num && <span className="wfs__frame-num">{s.num}</span>}
                </span>
                <img
                  className="wfs__img"
                  src={s.thumb}
                  alt={clone ? '' : s.alt}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            )
          })}
        </div>
      </div>

      {active &&
        createPortal(
          <div
            className="wfs__modal"
            role="dialog"
            aria-modal="true"
            aria-label={active.label}
            onClick={(e) => {
              if (e.target === e.currentTarget) close()
            }}
          >
            <div className="wfs__window">
              <div className="wfs__bar">
                <span className="wfs__bar-dots" aria-hidden="true">
                  <span className="wfs__dot wfs__dot--r" />
                  <span className="wfs__dot wfs__dot--y" />
                  <span className="wfs__dot wfs__dot--g" />
                </span>
                <span className="wfs__bar-title">
                  {active.num && <b>{active.num}</b>}
                  {active.label}
                </span>
                <button
                  ref={closeRef}
                  type="button"
                  className="wfs__close"
                  onClick={close}
                  aria-label="Close image"
                >
                  <X weight="bold" size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="wfs__imgwrap">
                <img className="wfs__full" src={active.full} alt={active.alt} />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  )
}
