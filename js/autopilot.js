/* Adapted from portfolio-template by BrewedOps (MIT) — see LICENSE. */

/* ==========================================================================
   Autopilot. The booking pipeline with signals running along its wires.

   Nodes are HTML in index.html (readable without JS, and by screen readers
   as two lists); this file draws the wires between them from measured rects
   and animates a signal along each wire with GSAP MotionPathPlugin.

   Markup contract:
     <figure class="ap" data-autopilot
             data-links='[{"from":"a","to":"b","kind":"solid|dash|loop","label":"..."}]'
             data-route='["a","b","c"]'>
       <div class="ap-flow">
         <svg class="ap-cables"></svg><svg class="ap-signals"></svg>
         <ol class="ap-chain"> <li class="ap-node" data-node="a" style="--x:80; --y:12"> ... </ol>
         <ul class="ap-outcomes"> ... </ul>
       </div>
     </figure>

   GSAP is loaded here, not by a <script> tag: only when the diagram comes
   within 400px of the viewport, never under prefers-reduced-motion, and with
   SRI. If a page already has window.gsap it is reused. If the CDN fails the
   diagram stays in its settled state: wires drawn, no signals.

   Motion: signals play only while the diagram is on screen and the tab is
   visible. Reduced motion (checked live) gets the settled state and no GSAP.
   ========================================================================== */
(() => {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const CDN = "https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/";
  const GSAP = {
    src: CDN + "gsap.min.js",
    integrity: "sha384-XmJ9SoHtVOHoQUcKvFAzVXwdkKo1Ie3bhmSoIAkcdsHGaIrVJIkmozyq0FJeb/Ly",
  };
  const MOTION_PATH = {
    src: CDN + "MotionPathPlugin.min.js",
    integrity: "sha384-YAP0gHFFPxr8wOSUhn4e+TuP5bfNLSK+i4tU3G9qh+IDMZRxsjxzPkb+sg037k23",
  };

  /* The OS setting or the site's own accessibility menu (js/access.js, which
     sets html[data-motion] and fires jc-a11ychange). Shaped like the
     MediaQueryList it replaces, so the checks below read either. */
  const osReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduceMotion = {
    get matches() { return osReduce.matches || document.documentElement.dataset.motion === "reduce"; },
    addEventListener(type, fn) {
      if (osReduce.addEventListener) osReduce.addEventListener(type, fn);
      window.addEventListener("jc-a11ychange", fn);
    },
  };

  const roots = document.querySelectorAll("[data-autopilot]");
  if (!roots.length) return;

  /* ---- GSAP, on demand ---- */
  let gsapReady = null;

  function loadScript(file) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = file.src;
      s.integrity = file.integrity;
      s.crossOrigin = "anonymous";
      s.async = false;
      s.onload = resolve;
      s.onerror = () => reject(new Error("autopilot: could not load " + file.src));
      document.head.appendChild(s);
    });
  }

  function loadGsap() {
    if (!gsapReady) {
      gsapReady = (window.gsap ? Promise.resolve() : loadScript(GSAP))
        .then(() => (window.MotionPathPlugin ? null : loadScript(MOTION_PATH)))
        .then(() => {
          window.gsap.registerPlugin(window.MotionPathPlugin);
          return window.gsap;
        });
      // A failed load leaves the settled diagram; nothing else depends on it.
      gsapReady.catch(() => {});
    }
    return gsapReady;
  }

  /* ---- Wire geometry ----
     Ported from Autopilot.tsx: dStraight (cubic, handles on the dominant
     axis), dBranch (always leaves the bottom of the decision) and dLoop
     (dips just under both nodes). dLane is new: the narrow layout's loop,
     bowed out into the lane left of the stack. */
  const path = (p1, c1, c2, p2) =>
    `M${p1.x},${p1.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;

  function dStraight(a, b) {
    const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
    const bx = b.x + b.w / 2, by = b.y + b.h / 2;
    let p1, p2, c1, c2;
    if (Math.abs(bx - ax) >= Math.abs(by - ay)) {
      const dir = bx > ax ? 1 : -1, off = Math.max(34, Math.abs(bx - ax) * 0.45);
      p1 = { x: a.x + (dir > 0 ? a.w : 0), y: ay };
      p2 = { x: b.x + (dir > 0 ? 0 : b.w), y: by };
      c1 = { x: p1.x + dir * off, y: p1.y };
      c2 = { x: p2.x - dir * off, y: p2.y };
    } else {
      const dir = by > ay ? 1 : -1;
      p1 = { x: ax, y: a.y + (dir > 0 ? a.h : 0) };
      p2 = { x: bx, y: b.y + (dir > 0 ? 0 : b.h) };
      const off = Math.max(12, Math.abs(p2.y - p1.y) * 0.5);
      c1 = { x: p1.x, y: p1.y + dir * off };
      c2 = { x: p2.x, y: p2.y - dir * off };
    }
    return { d: path(p1, c1, c2, p2), p1, p2 };
  }

  function dBranch(a, b) {
    const p1 = { x: a.x + a.w / 2, y: a.y + a.h };
    const p2 = { x: b.x + b.w / 2, y: b.y };
    const dy = Math.max(24, (p2.y - p1.y) * 0.55);
    return { d: path(p1, { x: p1.x, y: p1.y + dy }, { x: p2.x, y: p2.y - dy }, p2), p1, p2 };
  }

  function dLoop(a, b) {
    const p1 = { x: a.x + a.w / 2, y: a.y + a.h };
    const p2 = { x: b.x + b.w / 2, y: b.y + b.h };
    const dip = Math.max(p1.y, p2.y) + 10;
    return { d: path(p1, { x: p1.x, y: dip }, { x: p2.x, y: dip }, p2), p1, p2, dip };
  }

  /* Wide layout's dispatch: straight down out from under the decision's
     caption to a shared bus, along it, and down into the outcome. A diagonal
     fan from the gate would cut across the loop and its label. */
  function dBus(a, b, busY) {
    const p1 = { x: a.x + a.w / 2, y: a.y + a.h + 4 };
    const p2 = { x: b.x + b.w / 2, y: b.y };
    if (Math.abs(p2.x - p1.x) < 2) return { d: `M${p1.x},${p1.y} L${p2.x},${p2.y}`, p1, p2 };
    const dir = p2.x > p1.x ? 1 : -1;
    const r = Math.min(14, Math.abs(p2.x - p1.x) / 2, (p2.y - busY) / 2);
    const d =
      `M${p1.x},${p1.y} L${p1.x},${busY - r} Q${p1.x},${busY} ${p1.x + dir * r},${busY} ` +
      `L${p2.x - dir * r},${busY} Q${p2.x},${busY} ${p2.x},${busY + r} L${p2.x},${p2.y}`;
    return { d, p1, p2 };
  }

  function dLane(a, b, lane) {
    const p1 = { x: a.x, y: a.y + a.h / 2 };
    const p2 = { x: b.x, y: b.y + b.h / 2 };
    return { d: path(p1, { x: lane, y: p1.y }, { x: lane, y: p2.y }, p2), p1, p2 };
  }

  /* ---- One diagram ---- */
  function setup(root) {
    const flow = root.querySelector(".ap-flow");
    const cables = root.querySelector(".ap-cables");
    const signals = root.querySelector(".ap-signals");
    if (!flow || !cables || !signals) return;

    let links = [];
    let route = [];
    try {
      links = JSON.parse(root.dataset.links || "[]");
      route = JSON.parse(root.dataset.route || "[]");
    } catch (e) {
      return;
    }

    const onRoute = new Set();
    for (let i = 0; i < route.length - 1; i++) onRoute.add(route[i] + ">" + route[i + 1]);

    let wires = [];      // { d, route, dashed, order } from the last draw
    let tweens = [];
    let onScreen = false;
    let walked = false;
    let lastKey = "";

    const node = (id) => flow.querySelector(`[data-node="${id}"]`);

    function rectOf(el, origin) {
      const r = el.getBoundingClientRect();
      return { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height };
    }

    function el(name, attrs, parent) {
      const e = document.createElementNS(SVG_NS, name);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      parent.appendChild(e);
      return e;
    }

    function draw(force) {
      const w = flow.offsetWidth;
      const h = flow.offsetHeight;
      if (!w || !h) return;
      const key = `${w}x${h}`;
      if (key === lastKey && !force) return;
      lastKey = key;

      killSignals();
      cables.replaceChildren();
      signals.replaceChildren();
      for (const svg of [cables, signals]) {
        svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
        svg.setAttribute("width", w);
        svg.setAttribute("height", h);
      }

      const origin = flow.getBoundingClientRect();
      const first = flow.querySelector(".ap-node");
      const wide = first && getComputedStyle(first).position === "absolute";
      wires = [];

      // Off-route wires first, so the accent route is always drawn over them.
      const ordered = links
        .map((l, i) => ({ l, i, r: onRoute.has(l.from + ">" + l.to) }))
        .sort((a, b) => a.r - b.r);

      for (const { l, i, r } of ordered) {
        const kind = l.kind || "solid";
        const A = node(l.from), B = node(l.to);
        if (!A || !B) continue;
        const ta = rectOf(A.querySelector(".ap-tile"), origin);
        const tb = rectOf(B.querySelector(".ap-tile"), origin);

        let geo;
        if (kind === "loop") {
          geo = wide
            ? dLoop(rectOf(A, origin), rectOf(B, origin))
            : dLane(ta, tb, Math.min(ta.x, tb.x) - 26);
        } else if (kind === "dash") {
          geo = wide ? dBus(rectOf(A, origin), tb, tb.y - 40) : dBranch(ta, tb);
        } else if (Math.abs(tb.x - ta.x) < Math.abs(tb.y - ta.y)) {
          // Running down: leave from under the caption, never through it.
          const na = rectOf(A, origin);
          geo = dStraight({ x: ta.x, w: ta.w, y: na.y, h: na.h + 4 }, tb);
        } else {
          geo = dStraight(ta, tb);
        }

        const cls = ["ap-wire"];
        if (kind === "dash") cls.push("ap-wire-dash");
        if (kind === "loop") cls.push("ap-wire-loop");
        if (r) cls.push("ap-wire-route");
        const p = el("path", { class: cls.join(" "), d: geo.d }, cables);

        for (const pt of [geo.p1, geo.p2]) {
          el("circle", { class: r ? "ap-port ap-port-route" : "ap-port", cx: pt.x, cy: pt.y, r: 2.6 }, cables);
        }

        if (l.label) {
          const t = el("text", { class: "ap-label", "text-anchor": "middle" }, cables);
          t.textContent = l.label;
          if (wide) {
            t.setAttribute("x", (geo.p1.x + geo.p2.x) / 2);
            t.setAttribute("y", geo.dip + 16);
          } else {
            // Up the lane, reading bottom to top, beside the bow of the wire.
            const x = Math.min(ta.x, tb.x) - 30;
            const y = (geo.p1.y + geo.p2.y) / 2;
            t.setAttribute("x", x);
            t.setAttribute("y", y);
            t.setAttribute("transform", `rotate(-90 ${x} ${y})`);
          }
        }

        wires.push({ d: geo.d, el: p, route: r, dashed: kind !== "solid", order: i });
      }

      if (!walked && !reduceMotion.matches) {
        // Hold the route undrawn until it is walked on first sight.
        for (const wire of wires) {
          if (!wire.route || wire.dashed) continue;
          const len = wire.el.getTotalLength();
          wire.el.style.strokeDasharray = `${len}`;
          wire.el.style.strokeDashoffset = `${len}`;
        }
      }
      if (walked) startSignals();
    }

    /* The route walks in once, in route order, the first time it is seen:
       the same gesture as the system map's route, then the signals start. */
    function walk() {
      if (walked) return;
      walked = true;
      if (reduceMotion.matches || !Element.prototype.animate) {
        startSignals();
        return;
      }
      const steps = wires
        .filter((w) => w.route && !w.dashed)
        .sort((a, b) => a.order - b.order);
      steps.forEach((w, n) => {
        const len = w.el.getTotalLength();
        w.el.animate(
          [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
          { duration: 420, delay: 120 + n * 150, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" }
        ).finished.then(() => {
          w.el.style.strokeDasharray = "";
          w.el.style.strokeDashoffset = "";
        }, () => {});
      });
      setTimeout(startSignals, 120 + steps.length * 150);
    }

    function killSignals() {
      tweens.forEach((t) => t.kill());
      tweens = [];
      signals.replaceChildren();
    }

    function startSignals() {
      if (reduceMotion.matches || tweens.length) return;
      loadGsap().then((gsap) => {
        if (reduceMotion.matches || tweens.length || !wires.length) return;
        wires.forEach((w, i) => {
          const sig = el("circle", {
            class: w.route ? "ap-signal ap-signal-route" : "ap-signal",
            r: w.route ? 4 : 2.6,
          }, signals);
          const len = w.el.getTotalLength();
          const t = gsap.to(sig, {
            duration: Math.min(7, Math.max(2.4, len / 95)),
            repeat: -1,
            ease: "none",
            paused: true,
            motionPath: { path: w.d, autoRotate: false },
          });
          // Stagger by starting each loop part-way, as the original's negative delay did.
          t.progress(((w.order % 6) * 0.17) % 1);
          tweens.push(t);
        });
        sync();
      }, () => {});
    }

    function sync() {
      const run = onScreen && !document.hidden && !reduceMotion.matches;
      for (const t of tweens) run ? t.play() : t.pause();
    }

    /* ---- Lifecycle ---- */
    if ("IntersectionObserver" in window) {
      // Near: fetch GSAP ahead of arrival, so the first frame on screen moves.
      new IntersectionObserver((entries, io) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          if (!reduceMotion.matches) loadGsap();
        }
      }, { rootMargin: "400px 0px" }).observe(root);

      // On screen: walk once, then play; off screen: pause.
      new IntersectionObserver((entries) => {
        onScreen = entries[entries.length - 1].isIntersecting;
        if (onScreen) walk();
        sync();
      }, { threshold: 0.15 }).observe(root);
    } else {
      onScreen = true;
      walk();
    }

    document.addEventListener("visibilitychange", sync);

    const onReduce = () => {
      killSignals();
      draw(true);
      if (walked) startSignals();
    };
    if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", onReduce);

    let raf = 0;
    const redraw = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => draw(false));
    };
    if ("ResizeObserver" in window) new ResizeObserver(redraw).observe(flow);
    else window.addEventListener("resize", redraw);
    // Fonts land after first paint and move every caption; redraw when they do.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => draw(true));
    draw(true);
  }

  roots.forEach(setup);
})();
