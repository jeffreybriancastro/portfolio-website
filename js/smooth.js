/* Adapted from portfolio-template by BrewedOps (MIT) — see LICENSE.

   Smooth scroll with Lenis (https://lenis.darkroom.engineering), on the window.

   Skipped entirely, and Lenis never downloaded, when:
   - motion is reduced, by the OS or by the accessibility menu;
   - the device is a phone or tablet ((pointer: coarse) and (hover: none)),
     whose native momentum scroll feels better than a JS-driven one;
   - the window is narrower than 900px, where the page is one plain column.
   It switches itself on and off as those change.

   In-page links (#services, #projects, ...) are glided to by Lenis; the target
   section's scroll-margin-top is honoured and it receives focus, so keyboard
   users continue from where they landed.

   Dialogs: window.jcLenis is the live instance, or null when smooth scroll is
   off. A dialog that locks the page should call
     window.jcLenis && window.jcLenis.stop()    on open
     window.jcLenis && window.jcLenis.start()   on close
   The screenshot viewer and the phone menu already lock the page by setting
   body.style.overflow = "hidden"; this script watches for that and stops and
   starts Lenis on its own, so neither needs changing.
*/
(() => {
  "use strict";

  const SRC = "https://cdn.jsdelivr.net/npm/lenis@1.3.23/dist/lenis.min.js";
  const touchDevice = window.matchMedia("(pointer: coarse) and (hover: none)");
  const wide = window.matchMedia("(min-width: 900px)");
  const osReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  let lenis = null;
  let raf = 0;
  let loading = null;
  let lockObserver = null;
  window.jcLenis = null;

  function reduced() {
    if (typeof window.jcMotionReduced === "function") return window.jcMotionReduced();
    return osReduce.matches;
  }

  function wanted() {
    return !reduced() && !touchDevice.matches && wide.matches;
  }

  function load() {
    if (window.Lenis) return Promise.resolve(window.Lenis);
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      s.crossOrigin = "anonymous";
      s.onload = () => (window.Lenis ? resolve(window.Lenis) : reject(new Error("Lenis missing")));
      s.onerror = () => {
        loading = null;
        reject(new Error("Lenis failed to load"));
      };
      document.head.appendChild(s);
    });
    return loading;
  }

  /* Scroll containers inside the page keep their own native wheel. */
  const NESTED = ".sidebar, .lb, .lb-frame, [data-lenis-prevent]";

  /* Acts only when the lock changes, so a style write that leaves overflow
     alone never restarts a Lenis a dialog stopped on purpose. */
  let wasLocked = false;
  function syncLock() {
    if (!lenis) return;
    const locked = document.body.style.overflow === "hidden";
    if (locked === wasLocked) return;
    wasLocked = locked;
    if (locked) lenis.stop();
    else lenis.start();
  }

  function onAnchorClick(e) {
    if (!lenis || e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const link = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!link || (link.target && link.target !== "_self")) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
    if (!url.hash || url.hash === "#") return;
    /* the skip link keeps the browser's own focus handling */
    if (url.hash === "#main") return;

    let target = null;
    try {
      target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    } catch (err) {
      target = null;
    }
    if (!target) return;

    e.preventDefault();
    if (location.hash !== url.hash) history.pushState(null, "", url.hash);
    lenis.scrollTo(target, {
      duration: 1.1,
      onComplete: () => {
        if (target.hasAttribute("tabindex") || target.matches("a, button, input, select, textarea")) {
          target.focus({ preventScroll: true });
        }
      },
    });
  }

  function start(Lenis) {
    if (lenis || !wanted()) return;
    lenis = new Lenis({
      /* Short and steep: smooths the notched wheel without feeling heavy. */
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -12 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      prevent: (node) => !!(node && node.closest && node.closest(NESTED)),
    });

    const tick = (time) => {
      if (!lenis) return;
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    document.addEventListener("click", onAnchorClick);
    lockObserver = new MutationObserver(syncLock);
    lockObserver.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    wasLocked = false;
    syncLock();

    window.jcLenis = lenis;
  }

  function stopAll() {
    if (!lenis) return;
    cancelAnimationFrame(raf);
    document.removeEventListener("click", onAnchorClick);
    if (lockObserver) lockObserver.disconnect();
    lockObserver = null;
    lenis.destroy();
    lenis = null;
    window.jcLenis = null;
  }

  function sync() {
    if (wanted()) {
      if (!lenis) load().then(start).catch(() => { /* native scroll it is */ });
    } else {
      stopAll();
    }
  }

  function init() {
    sync();
    [touchDevice, wide, osReduce].forEach((mq) => mq.addEventListener("change", sync));
    window.addEventListener("jc-a11ychange", sync);
  }

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init, { once: true });
})();
