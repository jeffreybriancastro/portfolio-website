/**
 * GoHighLevel embeds.
 *
 * Both the enquiry form and the booking calendar are iframes served from
 * Jeffrey's white-labelled domain rather than api.leadconnectorhq.com, so the
 * embed and the site stay on one name.
 *
 * form_embed.js is what resizes them to their content. Without it the
 * calendar sits at the iframe default of 150px. What it ALSO does, having
 * measured them, is hide them: opacity 0, visibility hidden, pointer-events
 * none, position absolute, left -9999px, all written inline. It only puts
 * back the ones it recognises as an activated inline form, and a booking
 * widget never qualifies - so the calendar stays parked off screen forever
 * and the form goes with it whenever its own check fails.
 *
 * Dropping the script is not the answer, because the resizing is the part it
 * gets right. So the measurement stays and the hiding is overridden in
 * styles/ghl.css with !important, which is what beats an inline style. Height
 * is deliberately NOT in that override: height is the part the script is for.
 */

export const GHL_HOST = 'https://go.jeffreybrianbuilds.com'
export const GHL_FORM_ID = 'JR1k6svoHw7m89w5ktwL'
export const GHL_CALENDAR_ID = 'BM4TEwBq3SHULwPurILW'

export const GHL_FORM_SRC = `${GHL_HOST}/widget/form/${GHL_FORM_ID}`
export const GHL_CALENDAR_SRC = `${GHL_HOST}/widget/booking/${GHL_CALENDAR_ID}`

/**
 * The calendar's iframe id must be `<calendarId>_<timestamp>`: that is the
 * handle form_embed.js resizes against, and renaming it leaves the iframe
 * stuck at its initial height. The timestamp itself is never parsed, so it is
 * fixed here rather than generated - a value that changes every render would
 * remount the iframe on every render.
 */
export const GHL_CALENDAR_FRAME_ID = `${GHL_CALENDAR_ID}_1790172790406`
export const GHL_FORM_FRAME_ID = `inline-${GHL_FORM_ID}`

const SCRIPT_SRC = `${GHL_HOST}/js/form_embed.js`

/**
 * Load form_embed.js once per document. Two copies bind every resize handler
 * twice, and React 18+ mounts effects twice in StrictMode, so the guard is
 * not optional here.
 */
export function loadGhlEmbedScript(): void {
  if (typeof document === 'undefined') return
  const already = Array.prototype.some.call(
    document.scripts,
    (s: HTMLScriptElement) => /form_embed\.js/.test(s.src || ''),
  )
  if (already) return
  const s = document.createElement('script')
  s.src = SCRIPT_SRC
  s.async = true
  document.body.appendChild(s)
}
