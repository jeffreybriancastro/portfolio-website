import { useEffect, useRef, useState } from 'react'
import { loadGhlEmbedScript } from '@/lib/ghl'
import { profile } from '@/data/profile'

type Props = {
  src: string
  frameId: string
  title: string
  kind: 'form' | 'calendar'
  /** What the note behind it says while it has not reported in. */
  pending: string
}

/**
 * A GoHighLevel widget, with the note that shows through until it loads.
 *
 * Two signals clear the note, because either can arrive first: the iframe's
 * own load event, and the ready message the widget posts. The message is
 * matched against this frame's contentWindow, so the form loading never
 * clears the calendar's note or the other way round.
 *
 * If neither ever arrives the note stays, which is the point - a visitor
 * looking at a widget that failed still gets an email address.
 */
export default function GhlEmbed({ src, frameId, title, kind, pending }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    loadGhlEmbedScript()
  }, [])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (frameRef.current && event.source === frameRef.current.contentWindow) {
        setReady(true)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <div className={`ghl-embed ghl-embed--${kind}`}>
      {!ready && (
        <p className="ghl-pending">
          <strong>{pending}</strong>
          <a href={`mailto:${profile.email}`}>{profile.email}</a> reaches me just as fast.
        </p>
      )}

      <iframe
        ref={frameRef}
        src={src}
        id={frameId}
        title={title}
        loading="lazy"
        onLoad={() => setReady(true)}
        {...(kind === 'form'
          ? {
              'data-layout': '{"id":"INLINE"}',
              'data-trigger-type': 'alwaysShow',
              'data-activation-type': 'alwaysActivated',
              'data-deactivation-type': 'neverDeactivate',
              'data-form-name': 'Portfolio enquiry',
              'data-height': '600',
              'data-layout-iframe-id': frameId,
              'data-form-id': frameId.replace(/^inline-/, ''),
              'data-cookie-consent': 'true',
              'data-cookie-consent-provider': 'auto',
            }
          : { allow: 'payment', scrolling: 'no' })}
      />
    </div>
  )
}
