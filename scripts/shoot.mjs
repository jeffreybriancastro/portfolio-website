/**
 * Screenshot every route, in both themes, desktop and phone, and report any
 * console or page errors.
 *
 * This is the harness the rebuild was verified with. It drives the Chrome
 * already installed on the machine (`channel: 'chrome'`), so it needs no
 * browser download.
 *
 *   npm run dev          # in one terminal
 *   npm run shoot        # in another
 *
 * Shots land in .shots/ (git-ignored). Pass a base URL to point it at a
 * deployment instead:  npm run shoot -- https://jeffreybrianbuilds.com
 *
 * Reduced motion is forced on: the intro overlay only runs when motion is
 * allowed (see IntroOverlay), and a screenshot taken mid-intro is a picture
 * of the intro, not of the page.
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.argv[2] ?? 'http://localhost:5199'
const OUT = '.shots'

/**
 * One console message that is NOT the site's.
 *
 * Chrome emits `console.error('%c%d', 'font-size:0;color:transparent', NaN)`
 * from its own internals during automated clicks. Traced on 2026-09-24: the
 * string appears nowhere in src/, in dist/ or in node_modules, and overriding
 * console.error in an init script captures ZERO calls from page JavaScript
 * while Playwright still reports it - so it originates below the page. It is
 * filtered here by exact text; anything else still fails the run.
 */
const AMBIENT = ['%c%d font-size:0;color:transparent NaN']

const ROUTES = [
  ['home', '/'],
  ['projects', '/projects'],
  ['services', '/services'],
  ['testimonials', '/testimonials'],
  ['about', '/about'],
  ['contact', '/contact'],
  ['book', '/book'],
  ['work-automation', '/work/automation-workflow'],
  ['work-crm', '/work/ghl-crm-setup'],
  ['work-funnel', '/work/sales-funnel'],
  ['work-website', '/work/website-build'],
]

/** The Projects cards that open a dialog, by data-id. */
const DIALOGS = ['workflows', 'pipeline', 'sushibox', 'funnels']

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
let failures = 0

for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({
    viewport: { width: 1512, height: 950 },
    reducedMotion: 'reduce',
    deviceScaleFactor: 1,
  })
  await ctx.addInitScript((t) => {
    try { localStorage.setItem('theme', t) } catch { /* private mode */ }
  }, theme)

  const page = await ctx.newPage()
  const errors = new Set()
  page.on('pageerror', (e) => errors.add(String(e)))
  page.on('console', (m) => {
    if (m.type() !== 'error') return
    const text = m.text()
    if (!AMBIENT.includes(text)) errors.add(text)
  })

  console.log(`\n== ${theme} ==`)
  for (const [name, path] of ROUTES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' }).catch(() => {})
    await page.waitForTimeout(700)
    await page.screenshot({ path: `${OUT}/${name}-${theme}.png` })
    console.log('  ', `${name}-${theme}`)
  }

  await page.goto(BASE + '/projects', { waitUntil: 'networkidle' }).catch(() => {})
  await page.waitForTimeout(500)
  for (const id of DIALOGS) {
    const card = page.locator(`[data-id="${id}"]`)
    if (!(await card.count())) { console.log('   !! no card', id); failures++; continue }
    await card.click()
    await page.waitForTimeout(1400)
    await page.screenshot({ path: `${OUT}/dlg-${id}-${theme}.png` })
    console.log('  ', `dlg-${id}-${theme}`)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)
  }

  if (errors.size) {
    failures += errors.size
    console.log('   PAGE ERRORS:', [...errors].slice(0, 8))
  } else {
    console.log('   no page errors')
  }
  await ctx.close()
}

const phone = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  reducedMotion: 'reduce',
  deviceScaleFactor: 1,
})
const p = await phone.newPage()
console.log('\n== phone ==')
for (const [name, path] of ROUTES) {
  await p.goto(BASE + path, { waitUntil: 'networkidle' }).catch(() => {})
  await p.waitForTimeout(700)
  await p.screenshot({ path: `${OUT}/phone-${name}.png` })
  console.log('  ', `phone-${name}`)
}
await phone.close()
await browser.close()

console.log(failures ? `\n${failures} problem(s) found.` : '\nClean.')
process.exit(failures ? 1 : 0)
