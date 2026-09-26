/* Adapted from portfolio-template by BrewedOps (MIT) — see LICENSE.

   Cursor ring: one lagged ring that trails the native cursor.

   - The native cursor is never hidden. The OS arrow stays the instant layer,
     so the I-beam, the pointer hand and text selection all work as before.
   - One element, pointer-events: none and aria-hidden: it can never take a
     click or be announced.
   - mix-blend-mode: difference on a white ring, so it reads light on the dark
     theme and dark on the light one with no per-section logic.
   - It grows over links and buttons, fades out over form fields and over the
     GoHighLevel form and calendar (an iframe keeps the pointer to itself, so
     the ring would otherwise freeze at its edge), and shows "Open" only on the
     workflow screenshots, which open a viewer.
   - Runs only with a mouse or trackpad on a window at least 900px wide, and
     never when motion is reduced, by the OS or by the accessibility menu.
*/
(() => {
  "use strict";

  const GATE = window.matchMedia(
    "(pointer: fine) and (hover: hover) and (min-width: 900px) and (prefers-reduced-motion: no-preference)"
  );
  const SIZE = 36;
  /* Time constant of the trail, in seconds: about the feel of a 0.45s
     power3 ease-out. */
  const TAU = 0.085;

  function userReduced() {
    return typeof window.jcMotionReduced === "function" && window.jcMotionReduced();
  }

  let active = null;

  function stateFor(el) {
    if (!el || !el.closest) return "default";
    if (el.closest("[data-cursor='none'], iframe, input, textarea, select, label, [contenteditable='true']")) return "hidden";
    if (el.closest(".wf-open")) return "open";
    if (el.closest("a, button, [role='button'], summary")) return "grow";
    return "default";
  }

  function start() {
    const ring = document.createElement("div");
    ring.className = "jc-cursor";
    ring.setAttribute("aria-hidden", "true");
    ring.innerHTML = '<span class="jc-cursor__ring"></span><span class="jc-cursor__label"></span>';
    document.body.appendChild(ring);
    const label = ring.querySelector(".jc-cursor__label");

    let x = 0, y = 0, tx = 0, ty = 0;
    let seen = false;
    let raf = 0;
    let last = 0;
    let state = "default";

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      const k = 1 - Math.exp(-dt / TAU);
      x += (tx - x) * k;
      y += (ty - y) * k;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) raf = requestAnimationFrame(frame);
      else raf = 0;
    }

    function kick() {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }

    function setState(next) {
      if (next === state) return;
      state = next;
      ring.dataset.state = next;
      if (next === "open") label.textContent = "Open";
    }

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      tx = e.clientX - SIZE / 2;
      ty = e.clientY - SIZE / 2;
      if (!seen) {
        seen = true;
        x = tx;
        y = ty;
        ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        ring.classList.add("is-visible");
      }
      kick();
    };
    const onOver = (e) => setState(stateFor(e.target));
    const onDown = () => ring.classList.add("is-pressed");
    const onUp = () => ring.classList.remove("is-pressed");
    const onLeave = () => {
      seen = false;
      ring.classList.remove("is-visible", "is-pressed");
    };
    const onOut = (e) => { if (!e.relatedTarget) onLeave(); };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("blur", onLeave);
      ring.remove();
    };
  }

  function sync() {
    const want = GATE.matches && !userReduced();
    if (want && !active) active = start();
    else if (!want && active) {
      active();
      active = null;
    }
  }

  function init() {
    sync();
    GATE.addEventListener("change", sync);
    window.addEventListener("jc-a11ychange", sync);
  }

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init, { once: true });
})();
