import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ArrowUpRight } from '@/components/slab'
import type { Funnel } from '@/data/funnels'

/**
 * The work preview: a browser-chrome dialog holding the full-size screenshot.
 *
 * The template framed a local HTML page here. These builds are either a
 * client's live site or a screen inside someone's GoHighLevel account, so
 * neither can be served from this origin - the first is not ours to re-host,
 * the second is behind a login. So the dialog shows the screenshot, and when
 * the build is public the address bar is a real link to it.
 *
 * It lives here rather than inside the barrel because two surfaces open it:
 * the Projects view and the reel on Home. One dialog, one focus contract,
 * one scroll lock.
 */
export function thumbSrc(funnel: Funnel) {
  return funnel.thumb
}

export function useFunnelModal() {
  const [funnel, setFunnel] = useState<Funnel | null>(null)
  // Track what opened the dialog so focus goes back there on close, instead of
  // dumping keyboard users at the top of the document.
  const lastTriggerRef = useRef<HTMLElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  const openFull = useCallback((next: Funnel, trigger?: HTMLElement | null) => {
    lastTriggerRef.current = trigger ?? (document.activeElement as HTMLElement | null)
    setFunnel(next)
  }, [])

  const close = useCallback(() => {
    setFunnel(null)
    requestAnimationFrame(() => lastTriggerRef.current?.focus())
  }, [])

  // Escape to dismiss, scroll locked while open, focus moved into the dialog.
  useEffect(() => {
    if (!funnel) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      // Always clear to default - never restore a possibly stale 'hidden'.
      document.body.style.overflow = ''
    }
  }, [funnel, close])

  const host = funnel?.href
    ? funnel.href.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    : 'screenshot'

  const modal =
    funnel &&
    createPortal(
      <div
        className="funnels__modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${funnel.label} preview`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        <div className="funnels__modal-shell">
          <div className="funnels__modal-bar">
            <div className="funnels__modal-lights" aria-hidden="true">
              <span className="funnels__modal-light funnels__modal-light--red" />
              <span className="funnels__modal-light funnels__modal-light--amber" />
              <span className="funnels__modal-light funnels__modal-light--green" />
            </div>
            {/* A real link when the build is public, plain text when it is
                not. An address bar that looks clickable and is not is worse
                than one that never offered. */}
            {funnel.href ? (
              <a
                className="funnels__modal-url"
                href={funnel.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="funnels__modal-url-scheme">{host}</span>
                <span className="funnels__modal-url-path">{funnel.label}</span>
                <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
              </a>
            ) : (
              <div className="funnels__modal-url" aria-hidden="true">
                <span className="funnels__modal-url-scheme">{funnel.tag}</span>
                <span className="funnels__modal-url-path">{funnel.label}</span>
              </div>
            )}
            <div className="funnels__modal-actions">
              <button
                ref={closeRef}
                type="button"
                className="funnels__modal-close"
                onClick={close}
                aria-label="Close preview"
              >
                <X weight="bold" size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="funnels__modal-stage">
            <img
              className="funnels__modal-img"
              src={funnel.full}
              width={funnel.w}
              height={funnel.h}
              alt={funnel.desc}
              decoding="async"
            />
          </div>
        </div>
      </div>,
      document.body,
    )

  return { openFull, modal }
}
