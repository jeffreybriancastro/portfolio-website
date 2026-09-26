/* Adapted from portfolio-template by BrewedOps (MIT) — see LICENSE.
   https://github.com/brewed-ops/portfolio-template  (c) BrewedOps

   Workflow marquee (001-006), after WorkflowSamples on the React branch.

   The HTML holds the one real list (ul.wf-gallery.wfm-set[data-gallery]).
   This file adds a copy after it so the CSS keyframe can translate -50% onto
   a seamless seam. The copy:
   - is aria-hidden, and every button in it is tabindex=-1, so each frame is
     announced and tabbed to once;
   - carries no data-gallery, so js/gallery.js never counts it (the viewer
     still says "1 / 7", not "1 / 14") whichever script runs first;
   - forwards a click to the real button, so the viewer opens on the right
     shot and gives focus back to a control that is in the tab order.

   It also sets the loop's duration from the measured width, so the speed is
   the same however many frames there are or however wide they render. */
(() => {
  "use strict";

  const SPEED = 38; // px per second

  document.querySelectorAll("[data-wf-marquee]").forEach((root) => {
    const track = root.querySelector(".wfm-track");
    const set = track && track.querySelector(".wfm-set[data-gallery]");
    if (!set) return;
    const originals = Array.from(set.querySelectorAll(".wf-open"));
    if (!originals.length) return;

    const copy = set.cloneNode(true);
    copy.removeAttribute("data-gallery");
    copy.removeAttribute("aria-label");
    copy.removeAttribute("id");
    copy.setAttribute("aria-hidden", "true");
    copy.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
    Array.from(copy.querySelectorAll(".wf-open")).forEach((btn, i) => {
      btn.tabIndex = -1;
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const real = originals[i];
        if (!real) return;
        /* Focus first so the viewer records the real button as its opener. */
        real.focus({ preventScroll: true });
        real.click();
      });
    });
    track.appendChild(copy);

    function measure() {
      const w = set.getBoundingClientRect().width;
      if (w > 0) root.style.setProperty("--wfm-duration", Math.round(w / SPEED) + "s");
    }
    measure();
    if ("ResizeObserver" in window) new ResizeObserver(measure).observe(set);
    root.dataset.loop = "";

    /* A looping strip nobody can see still costs a compositor layer; hold it
       while off screen. */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        const on = entries[0] ? entries[0].isIntersecting : true;
        if (on) delete root.dataset.paused;
        else root.dataset.paused = "";
      }).observe(root);
    }
  });
})();
