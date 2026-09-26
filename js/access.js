/* Adapted from portfolio-template by BrewedOps (MIT) — see LICENSE.

   Accessibility menu. One floating button opens a small panel of switches for
   visitors who find the page hard to read: larger text, stronger contrast,
   motion off, underlined links. Each switch is written as a data attribute on
   <html> so css/access.css can act on it, and remembered across visits.

   Load this in <head> WITHOUT defer: the saved switches are applied the moment
   the script runs, before first paint, so a visitor who chose large text never
   sees the page jump. The button and panel are built once the body exists.

   Other scripts read the motion preference through:
     window.jcMotionReduced()   true if the visitor switched motion off here
                                OR the operating system asks for reduced motion
     html[data-motion="reduce"] the same answer, for CSS
     "jc-a11ychange" event      fired on window whenever either answer changes
*/
(() => {
  "use strict";

  const KEY = "jc-a11y";
  const EVENT = "jc-a11ychange";
  const DEFAULTS = { text: "md", contrast: false, motion: false, links: false };
  const root = document.documentElement;
  const osReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { ...DEFAULTS };
      const p = JSON.parse(raw) || {};
      return {
        text: p.text === "lg" || p.text === "xl" ? p.text : "md",
        contrast: !!p.contrast,
        motion: !!p.motion,
        links: !!p.links,
      };
    } catch (e) {
      return { ...DEFAULTS };
    }
  }

  let prefs = read();

  function motionReduced() {
    return prefs.motion || osReduce.matches;
  }

  function flag(name, on) {
    if (on) root.setAttribute(name, "true");
    else root.removeAttribute(name);
  }

  function apply() {
    if (prefs.text === "md") root.removeAttribute("data-a11y-text");
    else root.setAttribute("data-a11y-text", prefs.text);
    flag("data-a11y-contrast", prefs.contrast);
    flag("data-a11y-motion", prefs.motion);
    flag("data-a11y-links", prefs.links);
    if (motionReduced()) root.setAttribute("data-motion", "reduce");
    else root.removeAttribute("data-motion");
  }

  function announce() {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { ...prefs, reduced: motionReduced() } }));
  }

  window.jcMotionReduced = motionReduced;
  apply();

  osReduce.addEventListener("change", () => {
    apply();
    announce();
  });

  function save(next) {
    const textChanged = next.text !== prefs.text;
    prefs = next;
    apply();
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch (e) {
      /* private mode: the choice lasts for this page */
    }
    announce();
    /* Text size moves the layout without resizing the window; scripts that
       measure the layout (the system map's edges) listen for resize. */
    if (textChanged) window.dispatchEvent(new Event("resize"));
  }

  /* ---------- Markup ---------- */
  const SVG = (body, size) =>
    `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
  const ICON_PERSON = SVG('<circle cx="12" cy="4.6" r="1.8"/><path d="M4.5 8.2c2.4.8 4.9 1.2 7.5 1.2s5.1-.4 7.5-1.2"/><path d="M12 9.4v4.8"/><path d="m8.6 21 3.4-6.8 3.4 6.8"/>', 22);
  const ICON_CLOSE = SVG('<path d="M6 6l12 12M18 6 6 18"/>', 16);
  const ICON_RESET = SVG('<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/>', 14);

  const SIZES = [
    { value: "md", label: "A", hint: "Default text size" },
    { value: "lg", label: "A+", hint: "Larger text" },
    { value: "xl", label: "A++", hint: "Largest text" },
  ];
  const SWITCHES = [
    { key: "contrast", label: "High contrast", desc: "Darker text, stronger edges" },
    { key: "motion", label: "Reduce motion", desc: "No animation or drifting" },
    { key: "links", label: "Underline links", desc: "Every link gets a line" },
  ];

  function build() {
    if (document.querySelector("[data-widget='jc-a11y']")) return;

    const wrap = document.createElement("div");
    wrap.className = "jc-a11y";
    wrap.setAttribute("data-widget", "jc-a11y");
    wrap.innerHTML = `
      <div class="jc-a11y__panel" id="jc-a11y-panel" role="dialog" aria-labelledby="jc-a11y-title" hidden>
        <div class="jc-a11y__head">
          <p class="jc-a11y__title" id="jc-a11y-title">Accessibility</p>
          <button type="button" class="jc-a11y__close" aria-label="Close accessibility options">${ICON_CLOSE}</button>
        </div>
        <div class="jc-a11y__group" role="group" aria-labelledby="jc-a11y-size-label">
          <p class="jc-a11y__label" id="jc-a11y-size-label">Text size</p>
          <div class="jc-a11y__sizes">
            ${SIZES.map((s) => `<button type="button" class="jc-a11y__size" data-size="${s.value}" aria-label="${s.hint}">${s.label}</button>`).join("")}
          </div>
        </div>
        <ul class="jc-a11y__list">
          ${SWITCHES.map((s) => `
            <li>
              <button type="button" class="jc-a11y__switch" data-key="${s.key}">
                <span class="jc-a11y__switch-text">
                  <span class="jc-a11y__switch-label">${s.label}</span>
                  <span class="jc-a11y__switch-desc">${s.desc}</span>
                </span>
                <span class="jc-a11y__toggle" aria-hidden="true"></span>
              </button>
            </li>`).join("")}
        </ul>
        <button type="button" class="jc-a11y__reset">${ICON_RESET}Reset to default</button>
      </div>
      <button type="button" class="jc-a11y__button" aria-expanded="false" aria-controls="jc-a11y-panel" aria-label="Accessibility options" title="Accessibility options">${ICON_PERSON}</button>`;
    document.body.appendChild(wrap);

    const panel = wrap.querySelector(".jc-a11y__panel");
    const button = wrap.querySelector(".jc-a11y__button");
    const closeBtn = wrap.querySelector(".jc-a11y__close");
    const resetBtn = wrap.querySelector(".jc-a11y__reset");
    const sizeBtns = Array.from(wrap.querySelectorAll(".jc-a11y__size"));
    const switchBtns = Array.from(wrap.querySelectorAll(".jc-a11y__switch"));
    let open = false;
    let hideTimer = 0;

    function render() {
      sizeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.size === prefs.text)));
      switchBtns.forEach((b) => b.setAttribute("aria-pressed", String(!!prefs[b.dataset.key])));
      const changed = prefs.text !== "md" || prefs.contrast || prefs.motion || prefs.links;
      resetBtn.disabled = !changed;
    }

    function setOpen(next, { restoreFocus = false } = {}) {
      if (next === open) return;
      open = next;
      button.setAttribute("aria-expanded", String(open));
      clearTimeout(hideTimer);
      if (open) {
        panel.hidden = false;
        /* one frame with the closed styles so the panel transitions in */
        requestAnimationFrame(() => {
          wrap.classList.add("is-open");
          const first = panel.querySelector(".jc-a11y__size[aria-pressed='true']") || sizeBtns[0];
          first.focus();
        });
      } else {
        wrap.classList.remove("is-open");
        const hide = () => { if (!open) panel.hidden = true; };
        if (motionReduced()) hide();
        else hideTimer = setTimeout(hide, 200);
        if (restoreFocus) button.focus();
      }
    }

    button.addEventListener("click", () => setOpen(!open, { restoreFocus: open }));
    closeBtn.addEventListener("click", () => setOpen(false, { restoreFocus: true }));

    sizeBtns.forEach((b) =>
      b.addEventListener("click", () => {
        save({ ...prefs, text: b.dataset.size });
        render();
      })
    );
    switchBtns.forEach((b) =>
      b.addEventListener("click", () => {
        const k = b.dataset.key;
        save({ ...prefs, [k]: !prefs[k] });
        render();
      })
    );
    resetBtn.addEventListener("click", () => {
      save({ ...DEFAULTS });
      render();
      /* the reset button disables itself; keep focus inside the panel */
      (sizeBtns[0] || closeBtn).focus();
    });

    /* Escape closes and hands focus back to the button. */
    wrap.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && open) {
        e.stopPropagation();
        setOpen(false, { restoreFocus: true });
      }
    });

    /* A non-modal panel: Tab can leave it, and leaving closes it. */
    wrap.addEventListener("focusout", (e) => {
      if (!open) return;
      const to = e.relatedTarget;
      if (to && !wrap.contains(to)) setOpen(false);
    });

    /* A press anywhere else closes it. */
    window.addEventListener("pointerdown", (e) => {
      if (open && !wrap.contains(e.target)) setOpen(false);
    });

    render();
  }

  if (document.body) build();
  else document.addEventListener("DOMContentLoaded", build, { once: true });
})();
