/* Adapted from portfolio-template by BrewedOps (MIT) — see LICENSE.

   Phone tab bar: five destinations along the bottom edge under 900px, with
   Contact as the filled action in the middle. The top menu button stays: the
   drawer it opens still carries Book a call, Testimonials, FAQs, email,
   LinkedIn and the theme switch, none of which fit in five slots.

   Page depth: the site root is read from a data-root attribute on this script
   tag if there is one (data-root="../" on work/*.html), otherwise from where
   this file was loaded (js/tabbar.js sits one folder below the root). On the
   homepage the tabs are plain #anchors; everywhere else they point back at
   index.html#... . The homepage is recognised by carrying all five sections.

   On the homepage the active tab follows the scroll. On any other page Work is
   the current tab, since those pages are the case studies.
*/
(() => {
  "use strict";

  const script = document.currentScript;

  const SVG = (body) =>
    `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
  const ICONS = {
    home: SVG('<path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z"/>'),
    work: SVG('<path d="M3.5 7.5a2 2 0 0 1 2-2h3.8l2 2h7.2a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>'),
    contact: SVG('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 6.5 8 6.5 8-6.5"/>'),
    services: SVG('<path d="m12 3 8.5 4.6L12 12.2 3.5 7.6 12 3z"/><path d="m3.5 12 8.5 4.6 8.5-4.6"/><path d="m3.5 16.4 8.5 4.6 8.5-4.6"/>'),
    about: SVG('<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c0-3.7 3.4-6.2 7.5-6.2s7.5 2.5 7.5 6.2"/>'),
  };

  const TABS = [
    { key: "home", label: "Home", id: "hero" },
    { key: "work", label: "Work", id: "projects" },
    { key: "contact", label: "Contact", id: "contact", primary: true },
    { key: "services", label: "Services", id: "services" },
    { key: "about", label: "About", id: "about" },
  ];

  /* Homepage sections that are not a tab of their own light up the tab they
     belong to. Anything not listed takes the nearest tab section above it. */
  const OWNER = { faqs: "contact", book: "contact" };

  function siteRoot() {
    const attr = script && script.getAttribute("data-root");
    if (attr != null) return new URL(attr || "./", location.href);
    if (script && script.src) return new URL("../", script.src);
    return new URL("./", location.href);
  }

  function build() {
    if (document.querySelector(".jc-tabbar")) return;

    const root = siteRoot();
    /* The homepage is whichever page holds all five sections, whatever its
       URL (/, /index.html, or the homepage folded into a GoHighLevel page). */
    const isHome = TABS.every((t) => document.getElementById(t.id));

    const nav = document.createElement("nav");
    nav.className = "jc-tabbar";
    nav.setAttribute("aria-label", "Sections");
    nav.innerHTML = TABS.map((t) => {
      const href = isHome ? `#${t.id}` : new URL(`index.html#${t.id}`, root).href;
      const cls = `jc-tabbar__tab${t.primary ? " jc-tabbar__tab--primary" : ""}`;
      const inner = t.primary
        ? `<span class="jc-tabbar__fab">${ICONS[t.key]}</span><span class="jc-tabbar__label">${t.label}</span>`
        : `${ICONS[t.key]}<span class="jc-tabbar__label">${t.label}</span>`;
      return `<a class="${cls}" href="${href}" data-tab="${t.key}">${inner}</a>`;
    }).join("");
    document.body.appendChild(nav);
    document.documentElement.setAttribute("data-tabbar", "");

    const links = Array.from(nav.querySelectorAll(".jc-tabbar__tab"));
    function setActive(key) {
      links.forEach((a) => {
        if (a.dataset.tab === key) a.setAttribute("aria-current", isHome ? "location" : "page");
        else a.removeAttribute("aria-current");
      });
    }

    if (!isHome) {
      setActive("work");
      return;
    }

    /* Map every homepage section to its tab. */
    const tabIds = new Set(TABS.map((t) => t.id));
    const keyForId = Object.fromEntries(TABS.map((t) => [t.id, t.key]));
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const ownerOf = new Map();
    let current = "home";
    sections.forEach((s) => {
      if (tabIds.has(s.id)) current = keyForId[s.id];
      else if (OWNER[s.id]) current = OWNER[s.id];
      ownerOf.set(s, current);
    });

    setActive(keyForId[(location.hash || "#hero").slice(1)] || "home");

    if (!("IntersectionObserver" in window) || !sections.length) return;
    /* The same band as the sidebar's own scroll spy: a section is current
       once its top passes 15% down the viewport. */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(ownerOf.get(entry.target));
        });
      },
      { rootMargin: "-15% 0px -75% 0px" }
    );
    sections.forEach((s) => io.observe(s));

    /* At the very bottom the last short sections may never cross the band. */
    window.addEventListener(
      "scroll",
      () => {
        const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        if (atEnd && sections.length) setActive(ownerOf.get(sections[sections.length - 1]));
      },
      { passive: true }
    );
  }

  if (document.body) build();
  else document.addEventListener("DOMContentLoaded", build, { once: true });
})();
