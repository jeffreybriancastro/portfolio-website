# jeffreybrianbuilds.com

Jeffrey Brian Castro's portfolio: GoHighLevel CRM, automation workflows, funnels
and websites. A static site, plain HTML, CSS and JavaScript with no build step.
It deploys anywhere, and `ghl/build-embed.py` folds the homepage into a single
element that can be pasted into a GoHighLevel page.

## Running it

```bash
python3 -m http.server 5288     # then open http://localhost:5288
```

After changing `index.html` or anything it links, rebuild the GoHighLevel
version with `python3 ghl/build-embed.py`.

## What is on the page

The site's own design, with features carried over from the React rebuild on the
`rebuild-on-portfolio-template` branch:

| Feature | Files |
|---|---|
| Tools marquee, live-board tile, Testimonials ledger, FAQs | `index.html`, `css/styles.css` |
| Intro (plays once a session, any key or click skips it) | `js/intro.js`, `css/intro.css` |
| Contour shader behind the hero | `js/hero-canvas.js`, `css/hero-canvas.css` |
| Live automation diagram | `js/autopilot.js`, `css/autopilot.css` |
| 3D barrel of client sites, with its dialog | `js/barrel.js`, `css/barrel.css` |
| Workflow screenshot marquee (001 to 006) | `js/wf-marquee.js`, `css/wf-marquee.css` |
| Accessibility menu (text size, contrast, reduce motion, underline links) | `js/access.js`, `css/access.css` |
| Cursor ring | `js/cursor.js`, `css/cursor.css` |
| Smooth scrolling | `js/smooth.js`, `css/smooth.css` |
| Phone tab bar | `js/tabbar.js`, `css/tabbar.css` |

Three.js, GSAP and Lenis load from jsDelivr, pinned to the versions the React
branch uses, and only when they are needed: nothing heavy loads on a phone or
when the visitor asks for reduced motion, either in their system settings or in
the accessibility menu. Every animated feature has a still version.

## Still to do

Only Jeffrey can supply these; nothing has been invented to fill them.

- **Three clients are still unnamed** ("Client 1-3" in the Testimonials ledger),
  directly under The Sushi Box CDO, which is named. Permission for even one name
  would help the page more than anything else.
- **Team Easy Crane, Find The Pulse, Easy Crane** have no write-up beyond what
  their screenshots show (the TODO in `js/barrel.js`).
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
