/* ==========================================================================
   Testimonials page: every client's words in the left panel.

   On desktop (>= 1100px) the page must fit one screen, so the quotes become
   tab panels: one shows at a time, and the dots (the tabs), the arrows, and
   the client rows in the list on the right pick which. On phones every
   quote shows, stacked, and the controls are hidden. Same shape as the
   switch in js/services.js. Reduced motion (the OS setting or the site's
   accessibility menu) drops the fade; css/pages.css handles that.
   ========================================================================== */
(() => {
  "use strict";

  const root = document.querySelector(".tgrid");
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll(".tgrid__dot"));
  const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
  const rows = Array.from(root.querySelectorAll(".tgrid__client"));
  if (!tabs.length || !panels.every(Boolean)) return;

  const desk = window.matchMedia("(min-width: 1100px)");
  let active = 0;
  let tabbed = false;

  function select(i, focus) {
    const prev = active;
    active = (i + tabs.length) % tabs.length;
    tabs.forEach((t, n) => {
      const on = n === active;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      panels[n].hidden = tabbed && !on;
    });
    rows.forEach((r, n) => r.classList.toggle("is-quoted", tabbed && n === active));
    if (tabbed && prev !== active) {
      const p = panels[active];
      p.classList.remove("is-entering");
      void p.offsetWidth; // restart the fade
      p.classList.add("is-entering");
    }
    if (focus) tabs[active].focus();
  }

  function setTabbed(on) {
    tabbed = on;
    panels.forEach((p, n) => {
      if (on) {
        p.setAttribute("role", "tabpanel");
        p.setAttribute("aria-labelledby", tabs[n].id);
      } else {
        p.removeAttribute("role");
        p.removeAttribute("aria-labelledby");
        p.classList.remove("is-entering");
        p.hidden = false;
      }
    });
    select(active, false);
  }

  tabs.forEach((t, n) => t.addEventListener("click", () => select(n, false)));
  root.querySelectorAll(".tgrid__arrow").forEach((b) =>
    b.addEventListener("click", () => select(active + Number(b.dataset.step), false))
  );
  root.querySelector(".tgrid__dots").addEventListener("keydown", (e) => {
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

  // The client list runs in the same order as the quotes: a row shows its quote.
  rows.forEach((r, n) => {
    if (!panels[n]) return;
    r.dataset.quote = "";
    r.addEventListener("click", (e) => {
      if (!tabbed || e.target.closest("a")) return;
      select(n, false);
    });
  });

  const applyDesk = () => setTabbed(desk.matches);
  if (desk.addEventListener) desk.addEventListener("change", applyDesk);
  else desk.addListener(applyDesk);
  applyDesk();
})();
