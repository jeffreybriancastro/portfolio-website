# Where this stands

Last updated **2026-09-26**. Branch `rebuild-on-portfolio-template`, two commits, pushed.
**Not merged.** Your live site is untouched.

---

## Pick it up in 30 seconds

Open a **new** terminal window (Node was added to `~/.zshrc`, which existing windows
won't have picked up), then:

```bash
cd ~/Projects/portfolio-website
npm run preview          # http://localhost:5199
```

Leave that window open; `Ctrl+C` stops it. If a link I gave you is dead, this is why —
a server started inside a Claude session dies when the session ends.

To rebuild after changing anything: `npm run build`. To re-verify: `npm run shoot` in a
second terminal.

---

## What happened

The site was static HTML/CSS/JS. It is now **Vite 6 + React 19 + TypeScript** built on
[portfolio-template](https://github.com/brewed-ops/portfolio-template) by BrewedOps,
used under the **MIT licence**. The `LICENSE` file, the upstream credits and the
"what's theirs / what's yours" note in `README.md` all stay — that's what the licence
requires and what keeps you clear of the copyright and plagiarism worry you've raised.

This Mac had no Node at all. It's now at `~/.local/node` (official tarball, checksum
verified, no admin password). Uninstall: `rm -rf ~/.local/node` and drop the line from
`~/.zshrc`.

### Commit 1 — the rebuild

Every piece of content moved across: profile, the six GoHighLevel workflows, the
359-opportunity pipeline board, The Sushi Box CDO (four screens, live link, the client's
message), the three other client sites, four services, bio and skills, FAQs, and both
GoHighLevel embeds.

Three of the template's set pieces were **adapted to carry real work** rather than
decorated:

- the **3D barrel** spins your actual screenshots, and its dialog opens the full
  screenshot — the template framed local HTML pages, but your builds are either a
  client's live site or a screen inside someone's GoHighLevel account, and neither is
  ours to re-host;
- the **live automation diagram** is relabelled to your real booking pipeline;
- the **workflow marquee** carries your seven GoHighLevel screens, numbered 001–006.

**Removed rather than filled**, because there was nothing true to put in them: the
flagship product showcase, mobile apps, browser extensions, the AI-systems tree, the
certification badge and its "verified" tick, video testimonials, and the placeholder
Privacy and Terms pages.

### Commit 2 — what the rebuild had dropped

Two things from the old site didn't make the first pass and are now back, carried over
**word for word** (extracted programmatically, not retyped):

- **The four service walkthroughs**, ~2,000 words, now real routes at `/work/:slug`,
  each linked from its Services card. The system map came with them — `js/sysmap.js`
  ported to React with its behaviour intact.
- **The LinkedIn lead generation add-on** under your About skills.

---

## What's verified, and what isn't

`npm run shoot` covers **11 routes × 2 themes × desktop and phone, plus the four project
dialogs**. Clean against the production build.

`npm ci && npm run build` from a clean clone of this exact commit also succeeds — the
same sequence Vercel runs. So a failed Vercel build would be environmental, not code.

**Two things I have never been able to check:**

1. **The GoHighLevel form and calendar** on `/contact` and `/book`. Headless Chrome
   won't render a cross-origin widget, so the fallback note shows instead. All three
   endpoints (form, calendar, `form_embed.js`) return 200, so they should work — but
   open those two pages in a real browser and confirm.
2. **Deep-link refresh on Vercel.** Load the preview, click to `/projects`, hit reload.
   If it 404s, the rewrite in `vercel.json` needs adjusting. `vite preview` and Vercel
   handle SPA fallback differently, so local success doesn't prove it.

---

## Next decision: merging

The branch is pushed but not merged, so `main` still serves the old site.

- **Preview URL** — I can't read it; I have no access to your Vercel account. It's on
  **vercel.com → portfolio-website → Deployments**, or Vercel's bot posts it when you
  open the PR:
  <https://github.com/jeffreybriancastro/portfolio-website/pull/new/rebuild-on-portfolio-template>
- If the dashboard shows no preview, the likeliest cause is **Deployment Protection** —
  the Vercel Authentication toggle that caught you before. It often applies to previews
  even when production is public, so the link exists but asks you to log in.
- Merging to `main` deploys it. The old site stays recoverable at commit `9f76c83`.

---

## Still to do — see README for the full list

The four content gaps are in [README.md](README.md#still-to-do). The one that matters
most: **three clients are still "name withheld"**, sitting directly under a named client
with a testimonial and a live link. That contrast is sharper on the new design than it
was on the old one. Permission for even one name would do more for the page than any
further design work.
