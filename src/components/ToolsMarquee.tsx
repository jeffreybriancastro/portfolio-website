import { useMemo } from 'react'

/**
 * ToolsMarquee
 *
 * Horizontally scrolling strip of brand logos + labels for the tools you work with.
 * The tools Jeffrey actually works in. Marks are the vendors' own and are used
 * nominatively - to name the tool - which is what the template's credits note
 * covers. Anything he does not use has been removed rather than left in to pad
 * the strip.
 * The strip lives on the cream shader page, NOT inside a dark section.
 *
 * Implementation notes:
 * - The tools list is duplicated in JSX (`doubled`) so the CSS keyframe can translate
 *   by exactly -50% and produce a seamless loop. The halfway point lands on the seam
 *   between the two copies, so the reset at 100% is invisible.
 * - Icons come in two flavors:
 *     1. Single-color simple-icons SVGs (.svg) are rendered as CSS masks tinted
 *        via a per-item `--brand-color` custom property. This lets us ship one
 *        black-shape file per brand and paint it with the brand color.
 *     2. Multi-color brand marks (PNG or multi-color SVG - GoHighLevel,
 *        Lightspeed, Claude Code, VS Code, Google Workspace) are rendered as
 *        raw `<img>` tags because gradients/layered fills cannot be reduced to
 *        a single silhouette.
 *   The renderer picks the mode by whether a `color` is set: color -> mask,
 *   no color -> img.
 * - Brand colors live in the data layer below (not tokens.css) because they are
 *   external brand identifiers, not part of the site palette. They are passed to
 *   CSS via `--brand-color` custom properties so the component stylesheet stays
 *   free of inline hex values.
 * - Accessibility: the animated track is aria-hidden because its content is
 *   duplicated and moving. The real semantic list sits in an sr-only <ul> so
 *   screen readers get a clean, deduped enumeration of the tools.
 */

type Tool = {
  name: string
  iconPath: string
  /** When set, the SVG silhouette is tinted via CSS mask. Omit for multi-color marks. */
  color?: string
}

export const tools: Tool[] = [
  { name: 'GoHighLevel',  iconPath: '/icons/gohighlevel.png' },
  { name: 'n8n',          iconPath: '/icons/ai/n8n.svg',       color: '#EA4B71' },
  { name: 'Zapier',       iconPath: '/icons/ai/zapier.svg',    color: '#FF4F00' },
  { name: 'Claude Code',  iconPath: '/icons/claude-code-logo.png' },
  { name: 'Codex',        iconPath: '/icons/ai/codex.svg',     color: '#000000' },
  { name: 'VS Code',      iconPath: '/icons/vscode.svg' },
  { name: 'GitHub',       iconPath: '/icons/ai/github.svg',    color: '#181717' },
]

export default function ToolsMarquee() {
  // Duplicate the list so the -50% translate lands on a seamless seam.
  // useMemo keeps the doubled array reference-stable across renders.
  const doubled = useMemo(() => [...tools, ...tools], [])

  return (
    <section className="tools-marquee" aria-label="Tools I work with" data-reveal>
      <div className="tools-marquee__track" aria-hidden="true">
        {doubled.map((tool, i) => {
          const useMask = tool.iconPath.endsWith('.svg') && !!tool.color
          return (
            <div key={`${tool.name}-${i}`} className="tools-marquee__item">
              {useMask ? (
                <span
                  className="tools-marquee__icon"
                  style={{
                    ['--icon-url' as string]: `url('${tool.iconPath}')`,
                    ['--brand-color' as string]: tool.color ?? 'var(--navy)',
                  }}
                />
              ) : (
                <img
                  className="tools-marquee__img"
                  src={tool.iconPath}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  width={20}
                  height={20}
                />
              )}
              <span className="tools-marquee__label">{tool.name}</span>
            </div>
          )
        })}
      </div>

      {/* Real semantic list for screen readers, dedupes the visual loop. */}
      <ul className="sr-only">
        {tools.map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>
    </section>
  )
}
