# jeffreybrianbuilds.com

Portfolio for **Jeffrey Brian Castro** — GoHighLevel CRM, automation workflows,
sales funnels and websites. Cagayan de Oro, Philippines.

Stack: Vite 6, React 19, TypeScript, plain CSS custom properties, Three.js,
GSAP, Lenis, React Router 7, Phosphor icons, Poppins.

## Run it

```bash
npm install
npm run dev        # http://localhost:5199
npm run build      # typecheck + production build to dist/
npm run shoot      # screenshot every route, both themes, desktop + phone
```

`npm run shoot` drives the Chrome already installed on the machine, so there
is no browser download. Start the dev server first, then run it in a second
terminal. Shots land in `.shots/`. Point it somewhere else with
`npm run shoot -- https://jeffreybrianbuilds.com`.

## Deployment

Vercel, building from `main`. `vercel.json` sets the Vite framework preset and
one rewrite that sends every unmatched path to `/index.html` — React Router
owns `/projects`, `/services`, `/book` and the rest, and without that rewrite a
refresh on any of them would 404. Vercel checks the filesystem before applying
rewrites, so real files still win.

## Where the content lives

| What | Where |
|---|---|
| Name, handle, photo, email, the Home headline, the three proof stats | `src/data/profile.ts` |
| The six GoHighLevel workflows, the pipeline board, the stage names | `src/data/workflows.ts` |
| Shipped sites and funnels (the 3D barrel and its previews) | `src/data/funnels.ts` |
| FAQs on the Contact view | `src/data/faqs.ts` |
| Services, the four-step method, the live automation diagram | `src/components/ServicesGrid.tsx`, `src/components/Autopilot.tsx` |
| The four service walkthroughs at `/work/:slug` | `src/data/caseStudies.ts` |
| Client list and the testimonial | `src/components/TestimonialsGrid.tsx` |
| Bio and skills | `src/components/AboutGrid.tsx` |
| GoHighLevel form + calendar ids | `src/lib/ghl.ts` |
| SEO, Open Graph, favicon | `index.html` |
| Colours | `src/styles/tokens.css` |

Screenshots live in `public/img/`. The GoHighLevel form's own colours are set
in `ghl/form-theme.css`, which is pasted into the form's Custom CSS **inside
GoHighLevel** — nothing in this repo can reach inside that iframe.

## Still to do

- **Name the three anonymised clients.** `TestimonialsGrid.tsx` and
  `HomeBento.tsx` list three as "Client, name withheld". The role line is real;
  the missing name is the weakest thing on the site, sitting directly under a
  named client with a testimonial. Get permission and they go straight in.
- **Describe Team Easy Crane, Find The Pulse and Easy Crane.** See the TODO in
  `src/data/funnels.ts`. Right now they say only what the screenshot shows,
  because there is no written record of what each build had to do.
- **Pricing and lead time.** `src/data/faqs.ts` has one question answered the
  honest way ("I quote after we talk") because a number invented here would be
  a commitment you had not made.
- **A privacy notice.** The contact form collects personal data into
  GoHighLevel. The template's placeholder Privacy and Terms pages were removed
  rather than filled with invented legal text; a real notice should describe
  what that form actually collects and how long it is kept.
- **Point the domain at Vercel** (Settings → Domains). The canonical URL,
  sitemap and Open Graph tags already say `jeffreybrianbuilds.com`.

## Credits and licence

This site is built on the **[portfolio-template](https://github.com/brewed-ops/portfolio-template)**
by BrewedOps, used under the MIT licence. That licence is reproduced in full in
[LICENSE](LICENSE) and its copyright notice is retained as the licence requires.
The layout, the contour background, the 3D barrel, the intro sequence and the
component system come from that template; the content, the copy, the
screenshots, the GoHighLevel integration and the sections built for this site
are Jeffrey's.

Credits carried over from the template, which apply equally here:

- Contour background technique inspired by the landonorris.com site by
  OFF+BRAND. The simplex noise is Ashima Arts / Ian McEwan (MIT).
- Icons: [Phosphor](https://phosphoricons.com) (MIT).
- Font: Poppins (SIL Open Font License).
- Tool logos in `public/icons/` are trademarks of their owners and are used
  nominatively, to name the tools Jeffrey works in.

Site content, copy and screenshots © 2026 Jeffrey Brian Castro.
