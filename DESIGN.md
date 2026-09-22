---
name: Jeffrey Brian Castro — Portfolio
description: One-operator client-ops dashboard — sidebar-rail portfolio proving site, funnel, CRM, and automation delivery under one hand.
colors:
  neutral-bg: "#F6F4FB"
  surface: "#FFFFFF"
  surface-alt: "#EDEAF7"
  ink: "#14121F"
  ink-soft: "#514B69"
  ink-faint: "#6B6480"
  accent: "#FF6B2C"
  accent-strong: "#E85A1F"
  accent-soft: "#FFE7D6"
  accent-on: "#14121F"
  line: "#E2DEF0"
typography:
  display:
    fontFamily: "Figtree, 'Segoe UI', sans-serif"
    fontSize: "clamp(2.1rem, 3.6vw, 3.2rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Figtree, 'Segoe UI', sans-serif"
    fontSize: "1.05rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Figtree, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Figtree, 'Segoe UI', sans-serif"
    fontSize: "0.86rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  micro:
    fontFamily: "Figtree, 'Segoe UI', sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  mono-accent:
    fontFamily: "'Space Mono', ui-monospace, monospace"
    fontSize: "1.3rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  sm: "10px"
  md: "16px"
  lg: "24px"
  full: "999px"
spacing:
  sm: "10px"
  md: "20px"
  lg: "30px"
  xl: "56px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-on}"
    rounded: "{rounded.full}"
    padding: "13px 22px"
  button-primary-hover:
    backgroundColor: "{colors.accent-strong}"
    rounded: "{rounded.full}"
    padding: "13px 22px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "13px 22px"
  pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.full}"
    padding: "9px 16px 9px 12px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "30px"
  card-contact:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "30px"
  sysnode:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "15px 16px"
---

# Design System: Jeffrey Brian Castro — Portfolio

## Overview

**Creative North Star: "The Operator's Dashboard"**

The site reads like a single operator's own client-ops console, not a marketing brochure: a fixed identity-and-nav rail on the left, a free-flowing proof surface on the right. The ground is a warm, lavender-tinted off-white (never stark white-on-white), ink is a near-black navy rather than true black, and exactly one warm amber accent carries every call-to-action and live-state signal. Depth stays ambient — flat at rest, lifting only on hover — so the interface feels calm until touched.

The bento grid beneath the hero is deliberately uneven: services and projects run two columns wide, process and about run one, testimonials run two again. This is a corrected system: the shipped build replaced an earlier uniform icon-card layout and a five-times-repeated gear glyph with a differentiated composition and a distinct drawn icon per tool. Nothing in the visual language uses kicker/eyebrow labels, decorative numbering, glyph icon fonts, or nested card-in-card chrome — all four are explicit refusals carried from the direction contract and confirmed absent in the shipped markup.

**Key Characteristics:**
- Lavender-warm neutral ground with near-black navy ink, never pure white/black
- One committed amber accent (#FF6B2C), reserved for action and live-state
- Fixed sidebar rail + fluid content column, collapsing to a slide-in drawer under 900px
- Asymmetric bento card grid (2/2/2/1/1/1 column spans), not uniform tiles
- Drawn stroke-based line icons only, one distinct glyph per concept, sprite-sheeted
- Case-study surfaces state their proof as a drawn system map with one amber live path

## Colors

Warm, lavender-leaning neutrals carry the page; a single amber accent is the only saturated color in the system, and it is load-bearing everywhere it appears.

### Primary
- **Signal Amber** (`#FF6B2C`): the one accent. CTAs (`.btn-primary`), the sidebar status dot, tool-pill icon color (`accent-strong` variant), focus rings, and the skip-link.
- **Signal Amber, Deep** (`#E85A1F`): `.btn-primary:hover` state and the mono stat/accent-icon color (`--accent-strong`); the pressed/hovered register of the primary accent.
- **Signal Amber, Soft** (`#FFE7D6`): a wash, not a solid — the contact card's tinted background and the status-dot's ambient ring only.

### Neutral
- **Lavender Paper** (`#F6F4FB`): page background (`--bg`).
- **Card White** (`#FFFFFF`): card, pill, and topbar surface background.
- **Lavender Tint** (`#EDEAF7`): secondary surface for hover states (`.nav-link:hover`, `.icon-btn:hover`) and icon-badge backgrounds.
- **Ink Navy** (`#14121F`): primary text; also the text-on-accent color for buttons and the monogram mark.
- **Soft Navy** (`#514B69`): secondary text — subheads, nav-link default, pill labels, card copy.
- **Faint Navy** (`#6B6480`): tertiary text — captions, timestamps, footer copyright.
- **Hairline** (`#E2DEF0`): all borders and dividers (`--line`).

A parallel dark theme exists (`:root[data-theme="dark"]` and `prefers-color-scheme: dark`) that inverts the same roles onto a near-black purple ground (`#100D1A` bg, `#181425` surface, `#F4F2FA` ink, accent shifted to `#FF7A3D`/`#FF9257`). It reuses the identical role structure above; it is a toggleable mode of this one palette, not a second system.

### Named Rules
**The Single Accent Rule.** Amber (`#FF6B2C`/`#E85A1F`) is the only saturated color on the page. It appears only on calls-to-action, active/live-state indicators (status dot, active nav-link's text is neutral but its background is a neutral tint — the dot and the CTA are the accent's actual territory), icon accents on the tool pills, and focus rings. Its soft tint (`#FFE7D6`) is the sole exception, used once as a card wash, not repeated as a background pattern.

## Typography

**Display Font:** Figtree (with Segoe UI, sans-serif fallback)
**Label/Mono Font:** Space Mono (ui-monospace fallback)

**Character:** A single geometric sans (Figtree) carries the entire page at weights 400–800; Space Mono is a deliberate, narrow counterpoint reserved for two proof-of-work moments, not a general label font.

### Hierarchy
- **Display** (800, `clamp(2.1rem, 3.6vw, 3.2rem)`, line-height 1.1, letter-spacing -0.03em): the hero headline only, the page's single `<h1>`, capped at 26ch so its authored two-line break holds.
- **Title** (700, 1.05rem, letter-spacing -0.01em): every bento card heading (`<h2>`), the singular tier below the hero.
- **Body** (400, 1rem–1.1rem, line-height 1.5–1.6): hero subhead (max 58ch) and card body copy.
- **Label** (500–600, 0.86–0.95rem): nav links, pill labels, service/process item names, fact values (`.cs-fact-value` 0.95rem/600), node names (`.sysnode-name` 0.9rem/600).
- **Micro** (400–600, 0.78–0.85rem): the step below Label, used throughout the site since the first build for supporting metadata — stat labels and fact labels (0.78rem), card notes (0.78rem), project and process descriptions (0.82rem), service descriptions and sidebar timestamps (0.85rem), node meta and lateral-link descriptions (0.8rem). Always `--ink-soft` or `--ink-faint`, never `--ink`.
- **Mono Accent** (700, 1.3rem, Space Mono): the "About" stat values only.
- **Mono Micro** (700, 0.75rem, Space Mono): the process step index numbers only.

Written prose sits between Micro and Body at 0.9–0.92rem (`.cs-copy` 0.92rem/1.6, `.quote p` 0.92rem): long-form paragraph copy inside a card, roman.

### Named Rules
**The Six-Step Ramp Rule.** The type ramp is Display → Title → Body → Prose (0.9–0.92rem) → Label (0.86–0.95rem) → Micro (0.78–0.85rem), plus the two Space Mono numerals. Micro is a real, long-standing step, not drift: it carries every supporting label on the site. New surfaces pick a step from this list; they do not invent a seventh size.

**The Italic-Means-Pending Rule.** Italic prose (`.placeholder-text`, 0.9rem) means the content is bracketed and still waiting on a client. Finished, written prose is roman (`.cs-copy`). A paragraph that is done must not be dressed as pending, and bracketed copy must not be dressed as done — the case-study problem paragraphs were deliberately moved off `.placeholder-text` for exactly this reason. `.quote p` italic is the one unrelated use: quotation, not pendency.

**The Two-Weight, Two-Family Rule.** Figtree carries every word on the page. Space Mono appears in exactly two places — stat values and process-step indices — as a numeric, technical counterpoint that reads as evidence rather than as a competing type voice. It never carries prose or headings.

## Layout

A CSS grid app shell: a fixed-width sidebar rail (`--sidebar-w: 288px`) beside a fluid content column (`minmax(0, 1fr)`), both filling `min-height: 100vh`. The sidebar is `position: sticky` on desktop; the content column caps at `max-width: 1180px` with `padding: 64px 56px 40px`.

Below the hero, a bento grid (`grid-template-columns: repeat(3, minmax(0,1fr))`, `gap: 20px`) holds six cards at uneven spans — Services, Projects, and Testimonials each run 2 columns wide; About, Process, and Contact each run 1. This asymmetry is the load-bearing layout decision: it is what keeps the page from reading as a uniform icon-card grid.

Case-study surfaces (`work/*.html`) reuse the same shell, then run three stacked blocks down the content column at a `64px` rhythm (`44px` under 900px): the head (back-link, `<h1>`, outcome, hairline-topped auto-fit fact strip at `minmax(150px, 1fr)`), the system map, and a detail grid. The detail grid is the bento asymmetry applied to a new surface — three columns with spans 1/2/2/1 (problem, what I built, how it's wired, result) plus a 2/1 close row (other work, contact) — and collapses to one column at the same 900px step.

Responsive collapse happens in three steps: at 1040px, two-column internal lists (services, quotes) drop to one column; at 900px, the sidebar becomes a fixed slide-in drawer (`transform: translateX(-100%)` → `translateX(0)` on `data-open`) behind a topbar + scrim, and the bento grid drops to a single column; at 480px, hero actions stack vertically.

## Elevation & Depth

Flat at rest, lifted only in response to interaction — a hybrid of near-invisible ambient shadow and hover-triggered structural shadow. Every shadow is HSL-derived from a single `--shadow-color` custom property (`250 30% 15%` light / `260 60% 3%` dark), so light and dark modes keep the same shadow character.

### Shadow Vocabulary
- **Ambient rest** (`box-shadow: 0 1px 2px hsl(var(--shadow-color) / 0.15)` on buttons, `0 1px 2px hsl(var(--shadow-color) / 0.04)` on cards): near-invisible default state.
- **Hover lift** (`box-shadow: 0 10px 24px -8px hsl(var(--shadow-color) / 0.35)` on buttons, `0 20px 40px -20px hsl(var(--shadow-color) / 0.25)` on cards): paired with a `translateY(-2px)`/`translateY(-3px)` shift, always on `var(--ease-out-expo)`.

### Named Rules
**The Hover-Only Lift Rule.** Nothing casts a meaningful shadow at rest. Structural shadow and vertical lift appear together, only on hover/focus, on buttons, cards, and social icons alike — depth is earned by interaction, not decoration.

## Shapes

A generous, consistent three-step radius scale (`10px` / `16px` / `24px`) plus a fully-round `999px` for anything pill-shaped (buttons, tool pills, status badge, sidebar toggle track, avatar marks). Borders are a single hairline (`1px solid var(--line)`) throughout; the only deliberate exception is the placeholder project tiles, which use a `1px dashed` border to visually mark themselves as unfinished scaffolding rather than shipped content. The skip-link is the one asymmetric corner (`border-radius: 0 0 10px 0`), justified by its off-canvas positioning. Icons are a single stroke-based line system (`stroke-width: 1.8`, round caps/joins) sprite-sheeted once in the document and referenced by `<use>` — a distinct symbol per concept (website, funnel, CRM, automation, and one dedicated icon per tool-stack pill), never a repeated or generic glyph.

## Components

### Buttons
- **Shape:** fully round (`border-radius: 999px`), `padding: 13px 22px`.
- **Primary:** amber fill (`--accent`), ink text (`--accent-on`), ambient shadow at rest, deepens to `--accent-strong` + lift-shadow + `translateY(-2px)` on hover; trailing arrow icon nudges `translateX(3px)` on hover.
- **Ghost:** transparent fill, hairline border, ink text; hover fills with the neutral tint surface (`--surface-alt`) and lifts.

### Chips / Pills
- **Style:** white surface, hairline border, fully round, `9px 16px 9px 12px` padding, label at 0.86rem/500.
- **State:** static (no selected/unselected toggle — the tool-stack strip is informational, not filterable); each pill carries its own distinct icon in `--accent-strong`, one per tool (GoHighLevel, n8n, Zapier, Make, Claude Code).

### Cards / Containers
- **Corner Style:** 24px radius (`--radius-lg`) on every bento card.
- **Background:** white surface by default; the Contact card is the one tinted variant, filled with `--accent-soft` and borderless.
- **Shadow Strategy:** ambient at rest, hover-lift per the Elevation section above; hover also nudges the border toward the accent (`color-mix(in srgb, var(--accent) 30%, var(--line))`).
- **Border:** 1px hairline, absent only on the Contact card.
- **Internal Padding:** 30px.

### Navigation
- **Style:** vertical stacked links in the sidebar rail, 0.92rem/500, `--ink-soft` default.
- **Active/hover:** background fills with `--surface-alt`; active additionally bolds to weight 600 and sets text to `--ink`. Active state syncs to scroll position via `IntersectionObserver`.
- **Mobile:** rail becomes a fixed slide-in drawer behind a scrim, triggered by a topbar hamburger; identical link styling inside.

### System Map (signature component)

The proof device of every case-study surface: the delivered system drawn as a real graph, hairline-stroked in ink with the live path walked in amber.

- **Container** (`.sysmap`): a CSS grid sitting directly on the page ground, never inside a card — the nodes are themselves bordered surfaces, so wrapping the map in a card would nest card-in-card. Columns come from a per-map `--cols` custom property (3 or 4 in the shipped maps) and the gutter from `--gap` (default `62px`; the CRM map widens to `88px` to give its longer edges room). Row gap `16px`; nodes are placed explicitly by per-node `--col` / `--row`.
- **Node** (`.sysnode`): white surface, 1px hairline border, 16px radius (`--radius-md`), `15px 16px` padding, a 20px line icon in `--ink-soft` beside a name (0.9rem/600) and one meta line (0.8rem, `--ink-soft`). Ambient rest shadow only, and **flat on hover — no lift, no border shift**: nodes are diagram elements, not interactive controls, so the Hover-Only Lift Rule has nothing to act on.
- **Live node** (`.sysnode-live`): the nodes the live path runs through, including the route's origin. Border moves to `color-mix(in srgb, var(--accent) 50%, var(--line))` and the icon to `--accent-strong`. Nothing else changes; no fill, no shadow.
- **Edge layer** (`.sysmap-edges`): an SVG sitting at `z-index: 0` behind the nodes (`z-index: 1`), `overflow: visible`, pointer-events off.
- **Edges** (`.sysmap-edge`): 1.5px hairline in `--line`, round caps, fill none. `.sysmap-edge-feedback` adds `stroke-dasharray: 3 5` and is reserved for edges running back upstream (a retry or nurture loop).
- **Route** (`.sysmap-route`): one continuous 2px `--accent` stroke, the single path a record actually travels from entry to outcome, drawn over the grey edges. One per map.
- **Fan anchors:** when several edges meet one node, their anchors spread across that node's edge (max `36px`) instead of converging on one point, so three sources feeding one record read as three edges.

**The Measured Edge Rule.** Edges are measured, never implied. `js/sysmap.js` reads the real node boxes and emits an SVG path between the specific nodes that connect; a column gutter with no path in it is not an edge, and a grid of nodes without drawn connections is a card grid mislabelled as a diagram. Every connection a map claims must exist as a path.

**The Single-Column Lane Rule.** When the map collapses to one column (900px), every edge bows out into a lane beside the stack rather than running straight down it. A straight line between two stacked nodes crosses whatever sits between them, which on a fan-in makes the amber route appear to pass through parallel sources it never visits — drawing a system that was not built. The lane costs a bend and keeps the graph true.

### Case-Study Entrance (signature motion)
A short head stagger, then one drawn gesture. The back-link, title, outcome, framing line, and fact strip each `rise-in` on a `--d` delay (0.02s / 0.08s / 0.16s / 0.22s / 0.28s), with the map's section heading closing the sequence at 0.34s. The map then renders with its nodes already in place and its grey edges static, and the one authored moment is the amber route drawing itself via `stroke-dashoffset` over 1150ms on `--ease-out-expo` after a 260ms delay, once per page. Everything below the map renders settled. Both halves respect `prefers-reduced-motion` (the route appears fully drawn).

### Hero Entrance (signature motion)
A single orchestrated entrance, not a repeated scroll-fade: the hero headline, subhead, actions, and tool-strip each `rise-in` (opacity 0→1, `translateY(16px)→0`) on page load with a staggered delay (0.05s / 0.18s / 0.3s / 0.42s), all on `var(--ease-out-expo)`. Everything below the fold renders settled with no entrance animation. Respects `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** reserve amber (`#FF6B2C`/`#E85A1F`) for CTAs, active/live-state marks, focus rings, and icon accents; keep it off large surface fills except the one Contact-card soft-tint exception.
- **Do** keep the hero headline as the page's single `<h1>`; every bento card heading is an `<h2>`.
- **Do** give every distinct tool, service, or capability its own distinct line icon from the sprite; never reuse one glyph to stand in for multiple items.
- **Do** vary bento card column-span to keep the grid asymmetric (2/2/2/1/1/1); never let it settle into uniform same-size tiles.
- **Do** stagger only the hero's first-viewport elements on load (headline → subhead → actions → tool-strip); render below-the-fold content already settled, with no repeated scroll-triggered fades.
- **Do** keep shadows near-invisible at rest and structural only on hover, on the shared `--ease-out-expo` easing.
- **Do** draw a system map on the page ground with measured SVG edges, one amber route, and flat non-lifting nodes; give each map its own `--cols`/`--gap` rather than a new stylesheet.
- **Do** pick a type size from the six-step ramp, Micro (0.78–0.85rem) included, and keep Micro on `--ink-soft`/`--ink-faint`.
- **Do** set finished prose roman and reserve italic (`.placeholder-text`) for genuinely bracketed, client-pending content.

### Don't:
- **Don't** add kicker/eyebrow labels above headings or sections anywhere in the system.
- **Don't** add decorative section numbering (e.g. 01–05 style markers); the process list's numbers are functional sequence indicators, not decoration, and that distinction should hold.
- **Don't** nest a card inside another card's chrome; each bento cell is a single flat bordered surface.
- **Don't** introduce a second type family for prose or headings; Space Mono is reserved for the two numeric proof-of-work moments only.
- **Don't** give system-map nodes a hover lift, hover border shift, or link affordance; they are diagram elements, and nothing in the map is clickable.
- **Don't** imply a connection with a gap, a divider, or an aligned column; if two nodes connect, a measured path is drawn between them.
- **Don't** wrap a system map inside a card — the nodes are the surfaces, and the card-in-card refusal still holds.
