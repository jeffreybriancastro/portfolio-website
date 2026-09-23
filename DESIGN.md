---
name: Jeffrey Brian Castro — Portfolio
description: One-operator client-ops dashboard — sidebar-rail portfolio proving site, funnel, CRM, and automation delivery under one hand.
colors:
  neutral-bg: "#100E11"
  surface: "#171519"
  surface-alt: "#231F26"
  ink: "#F2EAE6"
  ink-soft: "#B3A49D"
  ink-faint: "#8E817B"
  accent: "#B89484"
  accent-strong: "#CBAA9C"
  accent-hover: "#CBAA9C"
  accent-soft: "#2A211D"
  accent-on: "#100E11"
  line: "#272329"
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

The site reads like a single operator's own client-ops console, not a marketing brochure: a fixed identity-and-nav rail on the left, a free-flowing proof surface on the right. The ground is Zero Black, ink is a near-white with a faint green cast, and exactly one the logo blue accent carries every call-to-action and live-state signal. Depth stays ambient — flat at rest, lifting only on hover — so the interface feels calm until touched.

Services no longer live in the bento at all: they run as a full-width band of four equal cards directly under the hero, each carrying its tool chips, a proof tag and three checkpoints. The bento beneath holds the remaining five cards at uneven spans. The one photograph on the page — a real rooftop portrait leading the About card — is what sets that card's height, so About is paired with the tall Projects card. This is a corrected system: the shipped build replaced an earlier uniform icon-card layout and a five-times-repeated gear glyph with a differentiated composition and a distinct drawn icon per tool. Nothing in the visual language uses kicker/eyebrow labels, decorative numbering, glyph icon fonts, or nested card-in-card chrome — all four are explicit refusals carried from the direction contract and confirmed absent in the shipped markup.

**Key Characteristics:**
- Deep Charcoal ground with warm near-white ink by default; light is a pale rose drawn from the accent's hue
- One committed accent, the logo's own blue, reserved for action and live-state
- Fixed sidebar rail + fluid content column, collapsing to a slide-in drawer under 900px
- Asymmetric bento card grid (2/2/2/1/1/1 column spans), not uniform tiles
- Drawn stroke-based line icons only, one distinct glyph per concept, sprite-sheeted
- Case-study surfaces state their proof as a drawn system map with one the logo blue live path

## Colors

**Deep Charcoal `#100E11`** grounds the dark theme; **Dusty Rose Beige `#B89484`** is the accent. Unusually, the rose is the accent in *both* themes, because it carries a charcoal label at 6.96:1 either way — the fill does not need to change between them.

What the rose cannot do is carry small text on a pale ground (2.76:1) or take a white label (also 2.76:1). So light mode keeps the rose fill and deepens a separate tone, `#7C5A4B`, for icons and numerals.

### Dark (default)
Ground `#100E11`, surfaces `#171519` / `#231F26`, ink `#F2EAE6` at 16.2:1, softening through `#B3A49D` and `#8E817B`. Accent `#B89484` with a charcoal label at 7.0:1; icons `#CBAA9C`; soft wash `#2A211D`; hairline `#272329`.

### Light
Ground `#F7EDE8`, a pale rose drawn from the accent's own hue; cards `#FFFAF7`. Ink `#100E11` at 16.7:1, softening through `#6B534A` and `#7B6257` — both warm-tinted, because a neutral grey on a warm ground reads as grey-on-colour. Accent `#B89484` (charcoal label), icons `#7C5A4B`, hover `#A67F6E`, soft wash `#F0DDD4`, hairline `#E8D5CB`.

Both themes measured across every pair. Dark: body 16.2:1, secondary 8.0:1, tertiary 5.1:1, CTA label 7.0:1, tag 13.3:1, icons 8.9:1. Light: body 16.7:1, secondary 6.2:1, tertiary 4.9:1, CTA label 7.0:1, tag 14.6:1, icons 5.3:1.

### Named Rules
**The Single Accent Rule.** The rose is the only saturated colour the interface uses — CTAs, live-state marks, focus rings, icon accents, and the one live route per system map.

**Role is decided by luminance, not by the swatch name.** Three palettes have now failed a role on arrival: Deep Navy at 1.03:1 as an accent, Deep Teal at 4.30:1 under a white label, Dusty Rose at 2.76:1 as light-mode text. Each was kept, in the role its luminance allowed.

**The hover fill is its own token.** `--accent-hover` is separate from `--accent-strong`. They were one token until this palette, where the icon tone had to go *darker* than the accent while the hover fill had to stay light enough to carry a charcoal label — opposite directions from the same value.

**Tinting secondary text onto an accent wash is direction-sensitive.** `color-mix(in srgb, var(--accent) 12%, var(--ink-soft))`, not 30%: when the accent is lighter than the ink, a heavy mix lifts the text off the wash instead of grounding it. 30% measured 4.0:1 here.

**The pale rose ground is a recorded exception to the `cream-palette` detector rule.** It is not a reflex warm off-white; it is the pinned accent's own hue at ground value. Logged with its reason in `.impeccable/config.json`.

**Open: the JB logo is blue (`#0055FE`) against a charcoal-and-rose system.** Carried over from the previous palette; the mark currently sits on a charcoal tile.

**The vendor marks sit outside the accent rule** as logotypes: n8n `#EA4B71`, Zapier `#FF4F00`, Claude `#D97757`.

**Toggle state travels as tokens.** `--sun-d`, `--moon-d`, `--toggle-x`, `--toggle-track`, `--toggle-thumb`.

## Typography

**Display Font:** Figtree (with Segoe UI, sans-serif fallback)
**Label/Mono Font:** Space Mono (ui-monospace fallback)

**Character:** A single geometric sans (Figtree) carries the entire page at weights 400–800; Space Mono is a deliberate, narrow counterpoint reserved for two proof-of-work moments, not a general label font.

### Hierarchy
- **Display** (800, `clamp(2.1rem, 3.6vw, 3.2rem)`, line-height 1.1, letter-spacing -0.03em): the hero headline, the page's single `<h1>`, capped at 26ch so its authored two-line break holds; and the About band's one-word `<h2>`, where the same size reads as a section marker rather than a rival headline.
- **Title** (700, 1.35rem, letter-spacing -0.02em): every band and bento card heading (`<h2>`), the singular tier below the hero. It was 1.05rem until the detector called the ramp flat, and it was right: a 1.05:1 step over body is not a step, and a section heading that measures the same as the paragraph under it is not doing its job. At 1.35rem it clears body by 1.35:1 and the h3 tier by 1.29:1.
- **Subtitle** (700, 1.05rem, letter-spacing -0.01em): the `<h3>` tier — project card names, the extra system maps' titles — sitting between Title and Body.
- **Body** (400, 1rem–1.1rem, line-height 1.5–1.6): hero subhead (max 58ch) and card body copy.
- **Label** (500–600, 0.86–0.95rem): nav links, pill labels, service/process item names, fact values (`.cs-fact-value` 0.95rem/600), node names (`.sysnode-name` 0.9rem/600).
- **Micro** (400–600, 0.78–0.85rem): the step below Label, used throughout the site since the first build for supporting metadata — stat labels and fact labels (0.78rem), card notes (0.78rem), project and process descriptions (0.82rem), service descriptions and sidebar timestamps (0.85rem), node meta and lateral-link descriptions (0.8rem). Always `--ink-soft` or `--ink-faint`, never `--ink`.
- **Mono Accent** (700, 1.3rem, Space Mono): the "About" stat values only.
- **Mono Micro** (700, 0.75rem, Space Mono): the process step index numbers only.

Written prose sits between Micro and Body at 0.9–0.92rem (`.cs-copy` 0.92rem/1.6, `.quote p` 0.92rem): long-form paragraph copy inside a card, roman.

### Named Rules
**The Six-Step Ramp Rule.** The type ramp is Display → Title → Subtitle → Body → Prose (0.9–0.92rem) → Label (0.86–0.95rem) → Micro (0.78–0.85rem), plus the two Space Mono numerals. Micro is a real, long-standing step, not drift: it carries every supporting label on the site. New surfaces pick a step from this list; they do not invent a seventh size.

**The Italic-Means-Pending Rule.** Italic prose (`.placeholder-text`, 0.9rem) means the content is bracketed and still waiting on a client. Finished, written prose is roman (`.cs-copy`). A paragraph that is done must not be dressed as pending, and bracketed copy must not be dressed as done — the case-study problem paragraphs were deliberately moved off `.placeholder-text` for exactly this reason. `.quote p` italic is the one unrelated use: quotation, not pendency.

**The Two-Weight, Two-Family Rule.** Figtree carries every word on the page. Space Mono appears in exactly two places — stat values and process-step indices — as a numeric, technical counterpoint that reads as evidence rather than as a competing type voice. It never carries prose or headings.

## Layout

A CSS grid app shell: a fixed-width sidebar rail (`--sidebar-w: 288px`) beside a fluid content column (`minmax(0, 1fr)`), both filling `min-height: 100vh`. The sidebar is `position: sticky` on desktop; the content column caps at `max-width: 1180px` with `padding: 64px 56px 40px`.

The hero itself is three stacked blocks. The headline and the single primary action share the first row (`display: flex; justify-content: space-between`, the action `flex: none`), so the action sits out of the text column rather than interrupting the reading; the subhead follows at 62ch; then the tool rail spans the full column. Below them, still inside the hero section, sits the overview panel. It stacks to a column at 900px, where the action returns under the subhead.

Below the hero sit two full-width bands on the page ground, then the projects index, then the bento, and after the projects card a third band: the featured build. The projects index is a four-column grid (`gap: 16px`), spans 3+1 then 2+1+1 so neither row leaves a hole, dropping to two columns at 1040px and one at 900px. Automations takes the widest span because it carries the only real product screenshots on the page and they have to be legible: at three columns the workflow table renders ~742px wide and its rows read at full size, which a two-column card could not do. Four cards name a kind of work; the fifth names the spine they are all built on (trigger, wait, condition, move) with the last step carrying the accent, because the outcome is what the accent marks everywhere else on the page. It sits on the page ground with no wash behind it: the overview panel up top already owns that treatment, and a second tinted panel would read as the same section twice. That band is a project told as a diagram rather than a screenshot — the pipeline as a four-column system map, then the six workflows that move it as a two-column numbered list, then the tools. It is the one place numbers lead a list, because the workflows carry those numbers in the build itself.

Below the hero sit two full-width bands on the page ground, then the bento. The services band is a four-column grid (`repeat(4, minmax(0,1fr))`, `gap: 16px`) stepping to a 2x2 at 1040px and one column at 480px — three columns would orphan the fourth card; the automation band is a centred statement, copy capped at 54ch, and three tool pills. Neither is wrapped in a card — the service cards are themselves the surfaces, so wrapping would nest card-in-card.

The bento grid (`grid-template-columns: repeat(3, minmax(0,1fr))`, `gap: 20px`) then holds five cards whose spans total exactly 9, so no row is left with a hole: Projects 2 + About 1, Process 2 + Testimonials 1, Contact 3. This is the load-bearing layout decision, and the pairing is chosen rather than incidental: cards stretch to their row's tallest sibling, so the photo-bearing About card sits beside Projects, the only other card tall enough to absorb it. Process runs its four steps as a 2x2 grid at its 2-column width; Testimonials stacks its quotes at 1 column; Contact runs the full width as a horizontal CTA with the button trailing right. Card order is Projects, About, Process, Testimonials, Contact, which also matches the sidebar nav's own sequence that the scroll-spy observer reads.

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

A generous, consistent four-step radius scale (`10px` / `16px` / `24px` / `32px`) plus a fully-round `999px` for anything pill-shaped (buttons, tool pills, status badge, sidebar toggle track, avatar marks). Borders are a single hairline (`1px solid var(--line)`) throughout; the only deliberate exception is placeholder content, which uses a `1px dashed` border to mark itself as unfinished scaffolding rather than shipped work. In the projects index this runs further: a card with a write-up behind it carries the accent chip, the underlined title link and the diagonal arrow, while a card still being documented is dashed, drops the chip for a glyph set in the heading, and carries no arrow — an empty slot never wears the affordance of a page that is not there. The top step (`--radius-xl: 32px`) belongs to the home overview panel alone: a container holding 24px tiles needs a larger corner than the tiles it holds, or the two radii fight at the corner. It drops to 24px under 900px, where the panel's padding halves. The skip-link is the one asymmetric corner (`border-radius: 0 0 10px 0`), justified by its off-canvas positioning; the project screenshots inside the overview panel are the second, opening left (`10px 0 0 10px`) because their right edge runs off the tile. Icons are a single stroke-based line system (`stroke-width: 1.8`, round caps/joins) sprite-sheeted once in the document and referenced by `<use>` — a distinct symbol per concept (website, funnel, CRM, automation, and one dedicated icon per tool-stack pill), never a repeated or generic glyph.

## Components

### Buttons
- **Shape:** fully round (`border-radius: 999px`), `padding: 13px 22px`.
- **Primary:** the logo blue fill (`--accent`), Zero Black text (`--accent-on`), ambient shadow at rest, deepens to `--accent-strong` + lift-shadow + `translateY(-2px)` on hover; trailing arrow icon nudges `translateX(3px)` on hover.
- **Ghost:** transparent fill, hairline border, ink text; hover fills with the neutral tint surface (`--surface-alt`) and lifts.

### Chips / Pills
- **Style:** white surface, hairline border, fully round, `9px 16px 9px 12px` padding, label at 0.86rem/500.
- **State:** static (no selected/unselected toggle - the tool strip is informational, not filterable); each entry carries its own distinct icon in `--accent-strong`, one per tool (GoHighLevel, n8n, Zapier, Claude Code).
- **Hero tool strip** (`.toolbar`): the hero states the stack as one bordered rail rather than loose pills - a standing label, a hairline, then the tools divided by hairlines, scrolling horizontally when they outrun the rail and stacking the label above them under 600px. It carries no eyebrow: the label is the heading, and a kicker above it is a standing ban the direction contract names explicitly. Vendor logos stay out; the entries use the drawn sprite like everything else.

### Service Band (signature component)

Four equal cards, the one place the system accepts uniform tiles, because each card carries four distinct registers rather than the icon-heading-text triple the craft floor refuses:

- **Tool chips** (`.svc-tool`): a row of 28px round `--surface-alt` chips, each holding a 15px line icon in `--accent-strong`, naming the stack that service is built on. They reuse the sprite's existing tool glyphs rather than third-party brand marks, so the drawn icon system holds.
- **Name** (`.svc-name`): Title step, with the service's own 18px line glyph in `--ink-soft` set inline before it.
- **Tag** (`.svc-tag`): a Micro-step uppercase pill on the `--accent-soft` wash. Its text is `--ink`, not `--accent-strong`: near-white on that wash measures 14.1:1, well clear of the 4.5:1 floor for 12.5px text.
- **Checkpoints** (`.svc-points`): three `i-check` lines above a hairline rule, pinned to the card foot with `margin-top: auto` so the lists align across the row even when the copy above them runs to different depths.

This band is the second deliberate use of `--accent-soft`; it is no longer a one-off wash, but it stays a tint behind small elements, never a large surface fill.

### Brand Mark

The JB hexagon, extracted from the supplied lockup by unpremultiplying it off its black ground, then set on an `--ink` tile because the mark's left half is white and disappears on a light surface. Two shipped sizes: `img/favicon-32.png` (32px, corners baked since browsers render favicons unrounded) and `img/logo-mark.png` (256px, square, so CSS rounds it in the topbar and iOS masks it as the touch icon). Both are palette-quantised to 64 colours, together under 13KB. It replaced a placeholder favicon that set "JC" in Arial — a system face standing in for a brand, which the craft floor refuses outright.

The mark does not appear in the sidebar. That rail already carries a 240px portrait, the name, the role, a status line, socials and the nav; a wordmark above it would be a second identity in the same column.

### About Band (signature component)

About is the one section that leaves the bento entirely and runs full width, because a portrait and a photo strip cannot breathe in a one-column cell. Three parts:

- **Heading** (`.about-heading`): the Display step, lowercase, closed with a full stop. It is the only place besides the hero where Display appears, and it is an `<h2>`, not a second `<h1>` — the hero keeps the page's single `<h1>`. One word at that size reads as a section marker rather than as a competing headline.
- **Lead** (`.about-lead`): a two-column grid, copy against a portrait capped at 400px. The portrait is a 3:4 crop of the same rooftop frame, cut vertically because the landscape crop cannot hold a column at this height. Collapses to one column at 900px with the portrait capped at 340px.
- **Strip** (`.about-strip`): six 4:3 tiles, `1px dashed var(--line)`, stepping 6 -> 3 -> 2 columns. Dashed because they are scaffolding, exactly as the project tiles mark themselves — the site's one convention for "real content lands here later".

Lifting About out leaves the bento at four cards across two clean rows of three: Projects 2 + Process 1, then Testimonials 2 + Contact 1. The band sits between them, which also keeps the scroll order matching the sidebar nav.

### Photography

One photograph, used twice, both crops from the same rooftop frame:

- **Identity mark** (`.avatar`, `.avatar-lg`): a head-and-shoulders crop that replaced the `JC` monogram in the sidebar rail (128px at `--radius-lg`, stepping to 96px at `--radius-md` under 820px of viewport height, since the rail is a scroll container) and mobile topbar (34px, 10px radius). It keeps the monogram's exact geometry and adds a 1px `--line` hairline, which is what stops the night-dark crop dissolving into the dark theme's surface. It ships on all five pages.
- **About lead** (`.about-photo`): a 3:2 environmental crop bleeding to the About card's inner edge via a `-30px` wrapper, top corners only, at `calc(var(--radius-lg) - 1px)` so the curve is concentric with the card's 1px border. The wrapper — not the image — carries the negative margin, so the image stays at `width: 100%` and cannot widen the page; the image needs an explicit `height: auto`, because the `height` HTML attribute is a presentational hint that otherwise beats `aspect-ratio`.

Both are WebP, 37KB combined. WebP is safe without a fallback here because the stylesheet already depends on `color-mix()`, which has a strictly newer support baseline.

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

### Overview Panel (signature component)
- **What it is:** a tinted region directly under the tool rail holding one tile per section of the page below — Projects, About, Services, and the contact CTA. Each tile is a preview with the real artefact in it (the shipped screenshots, the portrait, the service names), never an icon and a sentence.
- **The panel:** `--panel-wash`, a 135° gradient that starts at the page ground and warms toward the accent (3%→17% in dark, 8%→26% in light). `--radius-xl` corner, `16px` padding, and deliberately **no border and no shadow** — it is a lit region of the page, so a tile sitting on it is not a card inside a card.
- **The tiles:** `--panel-tile` (a step lighter than the wash in either theme: `--surface-alt` dark, `--surface` light), 24px radius, 1px hairline, 22px padding, the standard hover lift.
- **Grid:** `repeat(4, minmax(0,1fr))`, `gap: 14px`, every tile at span 2 — a 2x2 of equal tiles. Two columns at 1040px, one at 600px, where every span drops to 1: a span-2 tile in a one-column grid conjures an implicit second column and breaks out of the panel.
- **Mark and title:** a 36px `--radius-sm` accent chip at the top-left and a diagonal arrow (the shared `#i-arrow`, rotated -45°) at the top-right; the title is the tile's one link, given the whole box by a stretched `::after`. The contact tile takes neither — it acts rather than links, so its button is the affordance and it carries the `--accent-soft` fill instead.
- **Bleeds:** the projects screenshots and the about portrait run off the tile's own edge (negative margins against `overflow: hidden`) rather than sitting inset — the preview continues past what the tile shows. The screenshots stand side by side rather than stacked below 1040px, where a full-row stack would be two very wide bands.

### Workflow Gallery and Screenshot Viewer
- **What it is:** the Automations card's body — seven real GoHighLevel screens (the workflows list, then 001 through 006) as a four-column thumbnail grid, three-up under 1040px and two-up under 600px, each opening a viewer.
- **Thumbnails** (`.wf-frame`): a fixed `4 / 3` box with `object-fit: cover; object-position: left top`, so seven screenshots of seven different heights read as one grid. Each is a `<button>`, not a link: it opens an overlay, and there is no page to go to. The label carries the workflow's own number in Mono Micro.
- **Viewer** (`.lb`): a `role="dialog" aria-modal="true"` overlay over a blurred backdrop. Prev/next buttons sit on the frame's flanks (bottom on phones, where the flanks are the image), with ← → to move, Escape to close, wrap-around at both ends, a `1 / 7` counter in Mono Micro, focus moved in on open and restored to the thumbnail on close, and Tab held inside the dialog.
- **The frame scrolls, the image does not shrink.** A GoHighLevel flow runs to two thousand pixels; fitting it to the viewport would make it unreadable, which is the only reason anyone opened it. `.lb-frame` takes `overflow: auto` and the image stays at full width.
- **The image is built in JS on open,** never sitting in the markup with an empty `src` — that is a broken image, and preloading a full screenshot for a closed dialog is waste.

### System Map (signature component)

The proof device of every case-study surface: the delivered system drawn as a real graph, hairline-stroked in ink with the live path walked in the logo blue.

- **Container** (`.sysmap`): a CSS grid sitting directly on the page ground, never inside a card — the nodes are themselves bordered surfaces, so wrapping the map in a card would nest card-in-card. Columns come from a per-map `--cols` custom property (3 or 4 in the shipped maps) and the gutter from `--gap` (default `62px`; the CRM map widens to `88px` to give its longer edges room). Row gap `16px`; nodes are placed explicitly by per-node `--col` / `--row`.
- **Node** (`.sysnode`): white surface, 1px hairline border, 16px radius (`--radius-md`), `15px 16px` padding, a 20px line icon in `--ink-soft` beside a name (0.9rem/600) and one meta line (0.8rem, `--ink-soft`). Ambient rest shadow only, and **flat on hover — no lift, no border shift**: nodes are diagram elements, not interactive controls, so the Hover-Only Lift Rule has nothing to act on.
- **Live node** (`.sysnode-live`): the nodes the live path runs through, including the route's origin. Border moves to `color-mix(in srgb, var(--accent) 50%, var(--line))` and the icon to `--accent-strong`. Nothing else changes; no fill, no shadow.
- **Edge layer** (`.sysmap-edges`): an SVG sitting at `z-index: 0` behind the nodes (`z-index: 1`), `overflow: visible`, pointer-events off.
- **Edges** (`.sysmap-edge`): 1.5px hairline in `--line`, round caps, fill none. `.sysmap-edge-feedback` adds `stroke-dasharray: 3 5` and is reserved for edges running back upstream (a retry or nurture loop) — declared as `"feedback": true` on the edge. The booking-pipeline map is the shipped example: a no-show that rebooks runs back to Booked.
- **Collapse:** every map turns the corner to a single column, edges rerouted into a side lane. Three-column maps hold to 900px; the four-column booking map takes the corner at 1140px, because below that its node labels start wrapping to four and five lines. Stack order is DOM order, so nodes are authored in the sequence a reader should meet them, not in grid order.
- **Route** (`.sysmap-route`): one continuous 2px `--accent` stroke, the single path a record actually travels from entry to outcome, drawn over the grey edges. One per map.
- **Fan anchors:** when several edges meet one node, their anchors spread across that node's edge (max `36px`) instead of converging on one point, so three sources feeding one record read as three edges.

**The Measured Edge Rule.** Edges are measured, never implied. `js/sysmap.js` reads the real node boxes and emits an SVG path between the specific nodes that connect; a column gutter with no path in it is not an edge, and a grid of nodes without drawn connections is a card grid mislabelled as a diagram. Every connection a map claims must exist as a path.

**The Single-Column Lane Rule.** When the map collapses to one column (900px), every edge bows out into a lane beside the stack rather than running straight down it. A straight line between two stacked nodes crosses whatever sits between them, which on a fan-in makes the the logo blue route appear to pass through parallel sources it never visits — drawing a system that was not built. The lane costs a bend and keeps the graph true.

### Case-Study Entrance (signature motion)
A short head stagger, then one drawn gesture. The back-link, title, outcome, framing line, and fact strip each `rise-in` on a `--d` delay (0.02s / 0.08s / 0.16s / 0.22s / 0.28s), with the map's section heading closing the sequence at 0.34s. The map then renders with its nodes already in place and its grey edges static, and the one authored moment is the the logo blue route drawing itself via `stroke-dashoffset` over 1150ms on `--ease-out-expo` after a 260ms delay, once per page. Everything below the map renders settled. Both halves respect `prefers-reduced-motion` (the route appears fully drawn).

### Hero Entrance (signature motion)
A single orchestrated entrance, not a repeated scroll-fade: the hero headline, subhead, action, tool rail, and overview panel each `rise-in` (opacity 0→1, `translateY(16px)→0`) on page load with a staggered delay (0.05s / 0.16s / 0.26s / 0.36s / 0.46s), all on `var(--ease-out-expo)`. Everything below the fold renders settled with no entrance animation. Respects `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** reserve the logo blue (`#D7FFE0`/`#A8F0BE`) for CTAs, active/live-state marks, focus rings, and icon accents; keep it off large surface fills except the one Contact-card shadow-tint exception.
- **Do** keep the hero headline as the page's single `<h1>`; every bento card heading is an `<h2>`.
- **Do** give every distinct tool, service, or capability its own distinct line icon from the sprite; never reuse one glyph to stand in for multiple items.
- **Do** vary bento card column-span to keep the grid asymmetric (2/2/2/1/1/1); never let it settle into uniform same-size tiles.
- **Do** stagger only the hero's first-viewport elements on load (headline → subhead → actions → tool-strip); render below-the-fold content already settled, with no repeated scroll-triggered fades.
- **Do** keep shadows near-invisible at rest and structural only on hover, on the shared `--ease-out-expo` easing.
- **Do** draw a system map on the page ground with measured SVG edges, one the logo blue route, and flat non-lifting nodes; give each map its own `--cols`/`--gap` rather than a new stylesheet.
- **Do** pick a type size from the six-step ramp, Micro (0.78–0.85rem) included, and keep Micro on `--ink-soft`/`--ink-faint`.
- **Do** set finished prose roman and reserve italic (`.placeholder-text`) for genuinely bracketed, client-pending content.
- **Do** keep photography to the one rooftop frame and its two crops; a photo bleeds to a card's inner edge through a wrapper, never by widening the image itself.

### Don't:
- **Don't** add kicker/eyebrow labels above headings or sections anywhere in the system.
- **Don't** add decorative section numbering (e.g. 01–05 style markers); the process list's numbers are functional sequence indicators, not decoration, and that distinction should hold.
- **Don't** nest a card inside another card's chrome; each bento cell is a single flat bordered surface.
- **Don't** introduce a second type family for prose or headings; Space Mono is reserved for the two numeric proof-of-work moments only.
- **Don't** give system-map nodes a hover lift, hover border shift, or link affordance; they are diagram elements, and nothing in the map is clickable.
- **Don't** imply a connection with a gap, a divider, or an aligned column; if two nodes connect, a measured path is drawn between them.
- **Don't** wrap a system map inside a card — the nodes are the surfaces, and the card-in-card refusal still holds.
