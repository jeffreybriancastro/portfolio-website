import { useEffect, useRef, useState } from 'react'
import { PersonArmsSpread, X, ArrowCounterClockwise } from '@/components/slab'
import { DEFAULT_PREFS, readPrefs, savePrefs, type A11yPrefs, type TextSize } from '@/lib/a11y'

/**
 * AccessMenu - fixed bottom-left, the mirror of the reviews widget.
 * One button opens a small panel of switches for visitors who find the page
 * hard to read: larger text, stronger contrast, motion off, underlined links.
 * Every switch is a real button with aria-pressed; Escape closes the panel.
 */
const SIZES: { value: TextSize; label: string; hint: string }[] = [
  { value: 'md', label: 'A', hint: 'Default text size' },
  { value: 'lg', label: 'A+', hint: 'Larger text' },
  { value: 'xl', label: 'A++', hint: 'Largest text' },
]

const SWITCHES: { key: 'contrast' | 'motion' | 'links'; label: string; desc: string }[] = [
  { key: 'contrast', label: 'High contrast', desc: 'Darker text, stronger edges' },
  { key: 'motion', label: 'Reduce motion', desc: 'No animation or drifting' },
  { key: 'links', label: 'Underline links', desc: 'Every link gets a line' },
]

export default function AccessMenu() {
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState<A11yPrefs>(readPrefs)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  function update(next: A11yPrefs) {
    setPrefs(next)
    savePrefs(next)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (panelRef.current?.contains(t) || buttonRef.current?.contains(t)) return
      setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const changed = prefs.text !== 'md' || prefs.contrast || prefs.motion || prefs.links

  return (
    <div className={`a11y${open ? ' is-open' : ''}`} data-widget="a11y">
      <div
        className="a11y__panel"
        role="dialog"
        aria-label="Accessibility options"
        ref={panelRef}
        inert={!open || undefined}
      >
        <header className="a11y__head">
          <span className="a11y__title">Accessibility</span>
          <button
            type="button"
            className="a11y__close"
            onClick={() => {
              setOpen(false)
              buttonRef.current?.focus()
            }}
            aria-label="Close accessibility options"
          >
            <X size={16} weight="bold" aria-hidden="true" />
          </button>
        </header>

        <div className="a11y__group" role="group" aria-label="Text size">
          <span className="a11y__label">Text size</span>
          <div className="a11y__sizes">
            {SIZES.map((s) => (
              <button
                key={s.value}
                type="button"
                className={`a11y__size${prefs.text === s.value ? ' is-on' : ''}`}
                aria-pressed={prefs.text === s.value}
                aria-label={s.hint}
                onClick={() => update({ ...prefs, text: s.value })}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="a11y__list">
          {SWITCHES.map((s) => (
            <li key={s.key}>
              <button
                type="button"
                className={`a11y__switch${prefs[s.key] ? ' is-on' : ''}`}
                aria-pressed={prefs[s.key]}
                onClick={() => update({ ...prefs, [s.key]: !prefs[s.key] })}
              >
                <span className="a11y__switch-text">
                  <span className="a11y__switch-label">{s.label}</span>
                  <span className="a11y__switch-desc">{s.desc}</span>
                </span>
                <span className="a11y__toggle" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="a11y__reset"
          onClick={() => update(DEFAULT_PREFS)}
          disabled={!changed}
        >
          <ArrowCounterClockwise size={14} weight="bold" aria-hidden="true" />
          Reset to default
        </button>
      </div>

      <button
        type="button"
        className="a11y__button"
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Accessibility options"
        title="Accessibility options"
      >
        <PersonArmsSpread size={22} weight="fill" aria-hidden="true" />
      </button>
    </div>
  )
}
