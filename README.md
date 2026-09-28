# jeffreybrianbuilds.com

Jeffrey Brian Castro's portfolio: GoHighLevel CRM, automation workflows, funnels
and websites. A static site, plain HTML, CSS and JavaScript with no build step.
It runs on GoHighLevel: `ghl/build-embed.py` folds each page into one element
to paste into a GHL page (see "Where it is live").

## Running it

```bash
python3 -m http.server 5288     # then open http://localhost:5288
```

## Where it is live

**https://jeffreybrianbuilds.com**, as five GoHighLevel website pages, one per
page here (`/`, `/automation-workflow`, `/ghl-crm-setup`, `/sales-funnel`,
`/website-build`). Each GHL page holds one Custom Code element.

Images and the feature scripts load from a Cloudflare Worker,
`https://jeffreybrianbuilds.jeffreybriancastro.workers.dev`, which deploys this
repo's `main` branch automatically (`wrangler.jsonc`, `scripts/build-site.sh`)
and sends the cross-origin headers the GHL pages need (`_headers`). **Do not
delete that Worker**: every page's images and scripts come from it.

To publish a change:

1. Commit and push to `main`. The Worker picks it up in under a minute.
2. `python3 ghl/build-embed.py`, then re-paste the changed page's block from
   `ghl/embed/` into its GHL page and publish. `ghl/embed/PAGES.md` lists each
   page's path, SEO title and description.

A change to shared CSS or JS alone (no HTML) only needs step 1, as long as the
`?v=` tags in the pages are bumped so browsers fetch the new files; bumping
them changes the HTML, so in practice re-paste all five.

## What is on the page

The site's own design, with features carried over from the React rebuild on the
`rebuild-on-portfolio-template` branch:

| Feature | Files |
|---|---|
| Tools marquee, live-board tile, Testimonials ledger, FAQs | `index.html`, `css/styles.css` |
| Live automation diagram | `js/autopilot.js`, `css/autopilot.css` |
| 3D barrel of client sites, with its dialog | `js/barrel.js`, `css/barrel.css` |
| Workflow screenshot marquee (001 to 006) | `js/wf-marquee.js`, `css/wf-marquee.css` |
| Accessibility menu (text size, contrast, reduce motion, underline links) | `js/access.js`, `css/access.css` |
| Smooth scrolling | `js/smooth.js`, `css/smooth.css` |
| Phone tab bar | `js/tabbar.js`, `css/tabbar.css` |

Three more were ported and then switched off because too much moved at once:
the intro (`js/intro.js`), the contour shader behind the hero
(`js/hero-canvas.js`) and the cursor ring (`js/cursor.js`). Their files and CSS
are kept; a comment in the `<head>` of `index.html` says how to restore each.

Three.js, GSAP and Lenis load from jsDelivr, pinned to the versions the React
branch uses, and only when they are needed: nothing heavy loads on a phone or
when the visitor asks for reduced motion, either in their system settings or in
the accessibility menu. Every animated feature has a still version.

## Still to do

Only Jeffrey can supply these; nothing has been invented to fill them.

- **Team Easy Crane, Find The Pulse, Easy Crane** are named now, but have no
  link and no write-up beyond the role line and what their screenshots show (the TODO in `js/barrel.js`).
- **Pricing.** The FAQ answers "I quote after we talk" (TODO in `index.html`).
- **A privacy notice.** The contact form posts personal data into GoHighLevel.

## Credits and licence

The features in the table above, other than the first row, are adapted from
**[portfolio-template](https://github.com/brewed-ops/portfolio-template)** by
BrewedOps, used under the MIT licence. That licence is reproduced in full in
[LICENSE](LICENSE); each adapted file says so in its first line, and the
copyright notice is retained as the licence requires. They were rewritten from
React into plain JavaScript and restyled in this site's own design. The rest of
the site (its design, layout, code, content, copy, screenshots and the
GoHighLevel integration) is Jeffrey's.

Credits carried over from the template:

- Contour background technique inspired by the landonorris.com site by
  OFF+BRAND. The simplex noise is Ashima Arts / Ian McEwan / Stefan Gustavson (MIT).
- Libraries: [Three.js](https://threejs.org) (MIT), [Lenis](https://lenis.darkroom.engineering)
  (MIT), [GSAP](https://gsap.com) (GreenSock standard licence, free for commercial use).
- Tool logos are trademarks of their owners and are used nominatively, to name
  the tools Jeffrey works in.

Site content, copy and screenshots © 2026 Jeffrey Brian Castro.
