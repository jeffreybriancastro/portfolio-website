/* ==========================================================================
   Contact / Book a call: the enquiry form and the booking calendar share one
   panel, behind a two-way switch. The Book a call page folded into this one,
   so every "book a call" link lands here as contact.html#book and opens on
   the calendar; "Or pick a time" beside the FAQs flips the switch in place.

   Both panels ship visible, so without this script the form and the
   calendar simply stack.
   ========================================================================== */
(() => {
  "use strict";

  const root = document.querySelector(".cgrid__reach");
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll(".cgrid__switch-tab"));
  const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
  if (!tabs.length || !panels.every(Boolean)) return;

  let active = 0;

  function select(i, focus) {
    active = (i + tabs.length) % tabs.length;
    tabs.forEach((t, n) => {
      const on = n === active;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      panels[n].hidden = !on;
    });
    if (focus) tabs[active].focus();
  }

  // #book / #message name a panel through data-hash, not its id: an element
  // with that id would make the browser jump to it, past the switch.
  const byHash = (h) => panels.findIndex((p) => "#" + p.dataset.hash === h);
  const fromHash = () => byHash(location.hash);

  panels.forEach((p, n) => {
    p.setAttribute("role", "tabpanel");
    p.setAttribute("aria-labelledby", tabs[n].id);
  });
  tabs.forEach((t, n) => t.addEventListener("click", () => select(n, false)));
  root.querySelector(".cgrid__switch").addEventListener("keydown", (e) => {
    const n = tabs.indexOf(document.activeElement);
    if (n < 0) return;
    let next = -1;
    if (e.key === "ArrowRight") next = n + 1;
    else if (e.key === "ArrowLeft") next = n - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next === -1) return;
    e.preventDefault();
    select(next, true);
  });

  // In-page links to a panel (#book, #message) flip the switch instead of
  // jumping; on phones the switch is scrolled into view with them.
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const n = byHash(a.getAttribute("href"));
    if (n < 0) return;
    e.preventDefault();
    select(n, true);
    root.scrollIntoView({ block: "nearest" });
  });
  window.addEventListener("hashchange", () => {
    const n = fromHash();
    if (n >= 0) select(n, false);
  });

  select(Math.max(0, fromHash()), false);
})();
