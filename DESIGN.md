---
name: Jeffrey Brian Castro — Portfolio
description: Fixed profile rail beside one scrolling panel; a cream contour-shader page carrying glass sheets of bento cards, with orange as the single accent in both themes.
colors:
  navy: "#0B1E3F"
  navy-ink: "#060C1A"
  cream: "#F4F4ED"
  white: "#FFFFFF"
  orange: "#FF7A1A"
  orange-hover: "#FFA155"
  orange-ink: "#B4490A"
  muted: "#5A6479"
  paper: "#FBFBF7"
  plate: "#F4F4ED"
  panel-dark: "#060C1A"
  line: "rgba(11, 30, 63, 0.14)"
  divider: "rgba(11, 30, 63, 0.12)"
typography:
  display:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "clamp(30px, 3.5vw, 72px)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "clamp(22px, 2vw, 28px)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  eyebrow:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.18em"
rounded:
  sm: "10px"
  md: "16px"
  lg: "20px"
  card: "24px"
  full: "999px"
spacing:
  sm: "10px"
  md: "18px"
  lg: "28px"
  xl: "44px"
components:
  button-primary:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.navy-ink}"
    rounded: "{rounded.full}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.orange-hover}"
    rounded: "{rounded.full}"
    padding: "10px 18px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.navy}"
    rounded: "{rounded.card}"
    padding: "22px"
  plate-dark:
    backgroundColor: "{colors.panel-dark}"
    textColor: "{colors.cream}"
    rounded: "{rounded.lg}"
    padding: "28px"
  chip:
    backgroundColor: "rgba(11, 30, 63, 0.05)"
    textColor: "{colors.muted}"
    rounded: "{rounded.full}"
    padding: "7px 13px"
---

# Design System: Jeffrey Brian Castro — Portfolio

## Overview

The site is built on the MIT-licensed
[portfolio-template](https://github.com/brewed-ops/portfolio-template) by
BrewedOps — see [README.md](README.md) for the attribution this repo carries.
That template supplies the shell, the contour shader, the 3D barrel, the intro
sequence and the component vocabulary. This document records how the shipped
site uses them, and where it departs.

The page is not a document that scrolls. It is a **fixed shell**: a profile
rail pinned to the left from 1100px up, and one scrolling panel beside it.
Routes swap the panel's contents; the rail, the shader and the intro outlive
them. Below 1100px the rail is replaced by a bottom tab bar and the layout
becomes an app screen.

## Colors

One accent — **orange `#FF7A1A`** — in both themes. Everything else is navy ink
on a cream ground, or the inverse.

`--orange` never carries small text on a light ground; `--orange-ink`
(`#B4490A`) exists for that and clears 4.88:1 on cream.

### Light (default)
Ground `--cream #F4F4ED`, ink `--navy #0B1E3F`, raised surfaces `--paper #FBFBF7`.

### Dark (opt-in, persisted in localStorage)
`[data-theme='dark']` redefines the same tokens at the root — `--cream` becomes
`#070B14`, `--navy` becomes `#EDF0F6` — so every existing rule flips without
being rewritten. The theme is set by a pre-paint script in `index.html`, so
there is no flash of the wrong palette.

### Named rules

- **`--plate` stays light in both themes.** Brand marks are external
  identifiers and need a constant backdrop; a GoHighLevel logo must not
  invert with the page.
- **The client's message keeps a white ground in both themes.** A chat
  screenshot recoloured to match the palette stops being a receipt and becomes
  a graphic. Same rule for the testimonial in the Projects dialog.
- **The GoHighLevel widgets do not follow the theme.** Their palette is set
  inside GoHighLevel and cannot be reached from here, so on the dark theme they
  read as a light card on a dark ground. That is the widget, not a leak.

## Typography

Poppins throughout (SIL OFL). The display size is bounded by what fits beside
the Home CTA at 1100px, not by what looks biggest at 1440.

**The headline wraps.** The template held it to one line, sized for a
29-character sentence; this one is 54 characters, so `.home__line` drops the
`white-space: nowrap`. `IntroOverlay` measures the real `.home__title` rect and
gives `.boot__title` the same width and gap, so the flight still lands on the
same shape.

## Layout

- `--rail-w` is `0px` until the rail actually renders at 1100px, so every
  `calc(100% - var(--rail-w))` stays correct on mobile.
- Home, Projects, Services, Testimonials, About, Contact and Book are all sized
  to the panel box and do not scroll the page. Lists inside them scroll.
- The bento is 4 columns from 1100px; `--wide` spans 2 and `--full` spans the
  row.

## Components that were built for this site

### The live board (`.bento__stat`)
Replaces the template's certification badge. There is no certification, and a
badge that stands for nothing is a claim — so the slot carries the board's own
opportunity count instead. Set as a reading, not a marketing stat.

### The pipeline board (`.bento__board`)
The screenshot plus its six stage numbers as chips. The third chip is lit: it
is the stage a record is trying to reach.

### The client's message (`.tgrid__note`, `.wpanel__quote`)
The screenshot as it arrived, on a white plate, with the full text in the
`alt`. Never retyped.

### The project panels (`.wpanel`)
The template framed local HTML pages in these dialogs. These hold documents —
the pipeline write-up and the Sushi Box build — because the real artefacts are
either a client's live site or a screen inside someone's GoHighLevel account,
and neither can be served from this origin.

### The live automation (`Autopilot`)
The template's example flow, relabelled to the actual six-workflow booking
pipeline: enquiry in → tag and assign → opportunity → wait → reminders →
attended? → repeat client or no-show → closed lost.

### The GoHighLevel embeds (`GhlEmbed`, `styles/ghl.css`)
`form_embed.js` measures both iframes correctly and then hides them with inline
styles, restoring only what it recognises as an activated inline form — which a
booking widget never is. The script stays, because the resizing is the part it
gets right; the hiding is overridden with `!important`, which is what beats an
inline style. `height` is deliberately absent from that override.

## What the template shipped that this site does not

Removed rather than filled, because there was no truth behind them: the
flagship product showcase, mobile apps, browser extensions, the AI systems
tree, the certification badge, video testimonials, and the placeholder Privacy
and Terms pages. A portfolio's one job is to be believed.
