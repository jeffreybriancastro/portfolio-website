/* Adapted from portfolio-template by BrewedOps (MIT) — see LICENSE. */

/* ==========================================================================
   Services page: the segmented switch that keeps the page on one screen,
   and the live automation diagram (Autopilot.tsx) running on the captured
   markup.

   Switch. On desktop (>= 1100px) the three bands of the glass sheet become
   tab panels and the switch above them picks one; .is-tabbed on .sgrid is
   what css/services-page.css keys the one-screen layout on. On phones the
   switch is hidden and every band shows, stacked, as React rendered it.

   Diagram. The nodes sit on a fixed 1000x388 design canvas that CSS scales
   into its box with --flow-scale (recomputed here whenever the box changes).
   The wires are measured from the live node rects and redrawn when the
   canvas or the fonts change; a signal runs along each one on a
   requestAnimationFrame clock (getPointAtLength, no GSAP to fetch). The
   happy path draws itself in the first time the diagram is seen. Signals
   run only while the diagram is shown, on screen, and the tab is visible.
   Reduced motion (the OS setting or the site's accessibility menu,
   html[data-a11y-motion="true"]) gets the settled still state: wires
   drawn, no signals.
   ========================================================================== */
(() => {
  "use strict";

  const root = document.querySelector(".sgrid");
  if (!root) return;

  const html = document.documentElement;
  const osReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => osReduce.matches || html.getAttribute("data-a11y-motion") === "true";
  const desk = window.matchMedia("(min-width: 1100px)");

  const listeners = [];
  const onMotionChange = (fn) => listeners.push(fn);
  const motionChanged = () => listeners.forEach((fn) => fn());
  if (osReduce.addEventListener) osReduce.addEventListener("change", motionChanged);
  new MutationObserver(motionChanged).observe(html, { attributes: true, attributeFilter: ["data-a11y-motion"] });

  /* ------------------------------------------------------------------------
     The switch
     ------------------------------------------------------------------------ */
  const tabs = Array.from(root.querySelectorAll(".sgrid__tab"));
  const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
  const KEY = "jc-services-tab";
  const panelLabel = new Map(panels.map((p) => [p, p && p.getAttribute("aria-labelledby")]));
  let active = 0;
  let tabbed = false;
  const panelChange = [];

  function readStored() {
    const fromHash = panels.findIndex((p) => p && "#" + p.id === location.hash);
    if (fromHash >= 0) return fromHash;
    try {
      const n = Number(sessionStorage.getItem(KEY));
      if (n >= 0 && n < tabs.length) return n;
    } catch (e) { /* storage blocked: start on the first band */ }
    return 0;
  }

  function select(i, focus) {
    active = (i + tabs.length) % tabs.length;
    tabs.forEach((t, n) => {
      const on = n === active;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (panels[n]) panels[n].hidden = tabbed && !on;
    });
    if (focus) tabs[active].focus();
    try { sessionStorage.setItem(KEY, String(active)); } catch (e) { /* not kept */ }
    panelChange.forEach((fn) => fn());
  }

  function setTabbed(on) {
    tabbed = on;
    root.classList.toggle("is-tabbed", on);
    panels.forEach((p, n) => {
      if (!p) return;
      if (on) {
        p.setAttribute("role", "tabpanel");
        p.setAttribute("aria-labelledby", tabs[n].id);
        p.tabIndex = 0;
      } else {
        p.removeAttribute("role");
        p.removeAttribute("tabindex");
        const label = panelLabel.get(p);
        if (label) p.setAttribute("aria-labelledby", label);
        else p.removeAttribute("aria-labelledby");
        p.hidden = false;
      }
    });
    select(active, false);
  }

  if (tabs.length && panels.every(Boolean)) {
    active = readStored();
    tabs.forEach((t, n) => t.addEventListener("click", () => select(n, false)));
    root.querySelector(".sgrid__tabs").addEventListener("keydown", (e) => {
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
    window.addEventListener("hashchange", () => {
      const n = panels.findIndex((p) => "#" + p.id === location.hash);
      if (n >= 0) select(n, false);
    });
    const applyDesk = () => setTabbed(desk.matches);
    if (desk.addEventListener) desk.addEventListener("change", applyDesk);
    else desk.addListener(applyDesk);
    applyDesk();
  }

  /* ------------------------------------------------------------------------
     The diagram
     ------------------------------------------------------------------------ */
  const section = root.querySelector(".autopilot");
  const fit = section && section.querySelector(".autopilot__fit");
  const flow = section && section.querySelector(".autopilot__flow");
  const cables = section && section.querySelector(".autopilot__cables");
  const signals = section && section.querySelector(".autopilot__signals");
  if (!section || !fit || !flow || !cables || !signals) return;

  const SVG_NS = "http://www.w3.org/2000/svg";
  const DESIGN_W = 1000;
  const DESIGN_H = 388;
  const MAX_SCALE = 1.08;

  // The booking pipeline, as Autopilot.tsx wires it.
  const LINKS = [
    { from: "n-form", to: "n-email" },
    { from: "n-email", to: "n-booked" },
    { from: "n-booked", to: "n-24hr" },
    { from: "n-24hr", to: "n-1hr" },
    { from: "n-1hr", to: "n-call" },
    { from: "n-1hr", to: "n-booked", kind: "loop", label: "Rebooked" },
    { from: "n-call", to: "n-proposal", kind: "dash" },
    { from: "n-call", to: "n-maybe", kind: "dash" },
    { from: "n-call", to: "n-lost", kind: "dash" },
    { from: "n-proposal", to: "n-won" },
    { from: "n-maybe", to: "n-nurture" },
  ];
  // The happy path along the top, walked in on first sight.
  const ROUTE = 5;

  const path = (p1, c1, c2, p2) => `M${p1.x},${p1.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;

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
      const dir = by > ay ? 1 : -1, off = Math.max(40, Math.abs(by - ay) * 0.5);
      p1 = { x: ax, y: a.y + (dir > 0 ? a.h : 0) };
      p2 = { x: bx, y: b.y + (dir > 0 ? 0 : b.h) };
      c1 = { x: p1.x, y: p1.y + dir * off };
      c2 = { x: p2.x, y: p2.y - dir * off };
    }
    return { d: path(p1, c1, c2, p2), p1, p2 };
  }

  function dBranch(a, b) {
    const p1 = { x: a.x + a.w / 2, y: a.y + a.h };
    const p2 = { x: b.x + b.w / 2, y: b.y };
    const dy = Math.max(48, (p2.y - p1.y) * 0.55);
    return { d: path(p1, { x: p1.x, y: p1.y + dy }, { x: p2.x, y: p2.y - dy }, p2), p1, p2 };
  }

  function dLoop(a, b) {
    const p1 = { x: a.x + a.w / 2, y: a.y + a.h };
    const p2 = { x: b.x + b.w / 2, y: b.y + b.h };
    const dip = Math.max(p1.y, p2.y) + 10;
    return { d: path(p1, { x: p1.x, y: dip }, { x: p2.x, y: dip }, p2), p1, p2 };
  }

  function svgEl(name, attrs, parent) {
    const e = document.createElementNS(SVG_NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    parent.appendChild(e);
    return e;
  }

  /* ---- Fit the design canvas to its box (compact mode, desktop) ---- */
  function applyFit() {
    const w = fit.clientWidth, h = fit.clientHeight;
    if (!w || !h) return;
    const s = Math.min(w / DESIGN_W, h / DESIGN_H, MAX_SCALE);
    fit.style.setProperty("--flow-scale", String(s > 0 ? s : 1));
  }

  /* ---- Wires ---- */
  let wires = [];        // { el, len, dashed, order, sig }
  let lastKey = "";
  let walked = false;

  function visible() {
    return flow.getClientRects().length > 0;
  }

  function draw(force) {
    if (!visible()) { lastKey = ""; return false; }
    const w = flow.scrollWidth, h = flow.scrollHeight;
    const key = `${w}x${h}`;
    if (key === lastKey && !force) return true;
    lastKey = key;

    cables.replaceChildren();
    signals.replaceChildren();
    for (const svg of [cables, signals]) {
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.style.width = `${w}px`;
      svg.style.height = `${h}px`;
    }

    // Rects come back in screen pixels; divide the CSS scale back out so the
    // wires stay in design units and attach to the nodes at any size.
    const origin = flow.getBoundingClientRect();
    const scale = flow.offsetWidth ? origin.width / flow.offsetWidth : 1;
    const rectOf = (id, whole) => {
      const el = flow.querySelector(whole ? `#${id}` : `#${id} .autopilot__node-card`);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: (r.left - origin.left) / scale, y: (r.top - origin.top) / scale, w: r.width / scale, h: r.height / scale };
    };

    wires = [];
    LINKS.forEach((link, i) => {
      const kind = link.kind || "solid";
      const a = rectOf(link.from, kind === "loop");
      const b = rectOf(link.to, kind === "loop");
      if (!a || !b) return;
      const geo = kind === "loop" ? dLoop(a, b) : kind === "dash" ? dBranch(a, b) : dStraight(a, b);
      const dashed = kind !== "solid";

      const p = svgEl("path", {
        d: geo.d,
        fill: "none",
        "stroke-width": kind === "loop" ? "2" : "2.3",
        "stroke-linecap": "round",
      }, cables);
      p.style.stroke = kind === "loop" ? "var(--ap-loop)" : dashed ? "var(--ap-cable-dash)" : "var(--ap-cable)";
      if (dashed) p.setAttribute("stroke-dasharray", kind === "loop" ? "7 8" : "1 7");

      for (const pt of [geo.p1, geo.p2]) {
        const dot = svgEl("circle", { cx: pt.x, cy: pt.y, r: "3.2" }, cables);
        dot.style.fill = kind === "loop" ? "var(--ap-loop)" : "var(--ap-port)";
      }

      if (link.label) {
        const t = svgEl("text", {
          x: (geo.p1.x + geo.p2.x) / 2,
          y: kind === "loop" ? Math.max(geo.p1.y, geo.p2.y) + 25 : (geo.p1.y + geo.p2.y) / 2 - 10,
          "text-anchor": "middle",
          "font-size": "10.5",
          "font-weight": "600",
          "font-family": "Poppins, sans-serif",
        }, cables);
        t.style.fill = "var(--ap-loop)";
        t.textContent = link.label;
      }

      const len = p.getTotalLength ? p.getTotalLength() : 360;
      wires.push({ el: p, len, dashed, order: i, sig: null });
    });

    // Before the first walk, hold the happy path undrawn.
    if (!walked && !reduced()) {
      for (const w of wires.slice(0, ROUTE)) {
        w.el.style.strokeDasharray = String(w.len);
        w.el.style.strokeDashoffset = String(w.len);
      }
    }
    placeSignals();
    return true;
  }

  /* ---- Signals on a rAF clock ---- */
  let clock = 0;       // seconds of motion so far; only advances while running
  let last = 0;
  let raf = 0;
  let onScreen = false;
  let started = false; // signals released (after the walk)

  function placeSignals() {
    signals.replaceChildren();
    if (reduced() || !started) {
      wires.forEach((w) => { w.sig = null; });
      return;
    }
    wires.forEach((w) => {
      w.sig = svgEl("circle", {
        r: w.dashed ? "3.2" : "4.4",
        filter: "drop-shadow(0 0 5px rgba(255,122,26,.9))",
      }, signals);
    });
    tick(0, true);
  }

  function tick(now, once) {
    if (!once) {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      clock += dt;
    }
    for (const w of wires) {
      if (!w.sig) continue;
      const dur = Math.min(7, Math.max(2.4, w.len / 95));
      const t = (((clock + (w.order % 6) * 0.42) % dur) + dur) % dur / dur;
      const pt = w.el.getPointAtLength(t * w.len);
      w.sig.setAttribute("cx", pt.x.toFixed(2));
      w.sig.setAttribute("cy", pt.y.toFixed(2));
    }
    if (!once) raf = requestAnimationFrame(tick);
  }

  function shouldRun() {
    return started && onScreen && !document.hidden && !reduced() && visible();
  }

  function sync() {
    if (shouldRun()) {
      if (!raf) { last = 0; raf = requestAnimationFrame(tick); }
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  /* The happy path walks in once, left to right, then the signals start. */
  function walk() {
    if (walked || !visible() || !onScreen) return;
    walked = true;
    const steps = wires.slice(0, ROUTE);
    const release = () => {
      started = true;
      placeSignals();
      sync();
    };
    if (reduced() || !Element.prototype.animate) {
      steps.forEach((w) => { w.el.style.strokeDasharray = ""; w.el.style.strokeDashoffset = ""; });
      release();
      return;
    }
    steps.forEach((w, n) => {
      w.el.animate(
        [{ strokeDashoffset: w.len }, { strokeDashoffset: 0 }],
        { duration: 420, delay: 120 + n * 150, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" }
      ).finished.then(() => {
        w.el.style.strokeDasharray = "";
        w.el.style.strokeDashoffset = "";
      }, () => {});
    });
    setTimeout(release, 120 + steps.length * 150);
  }

  function refresh(force) {
    applyFit();
    const drawn = draw(force);
    if (drawn) walk();
    sync();
  }

  /* ---- Lifecycle ---- */
  let pending = 0;
  const schedule = (force) => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(() => refresh(force));
  };

  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => schedule(false));
    ro.observe(fit);
    ro.observe(flow);
  } else {
    window.addEventListener("resize", () => schedule(false));
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      onScreen = entries[entries.length - 1].isIntersecting;
      if (onScreen) schedule(false);
      else sync();
    }, { threshold: 0.1 }).observe(section);
  } else {
    onScreen = true;
  }

  panelChange.push(() => schedule(false));
  document.addEventListener("visibilitychange", sync);
  onMotionChange(() => {
    if (reduced()) {
      wires.slice(0, ROUTE).forEach((w) => {
        w.el.getAnimations().forEach((a) => a.finish());
        w.el.style.strokeDasharray = "";
        w.el.style.strokeDashoffset = "";
      });
      if (walked) started = true;
    }
    placeSignals();
    sync();
  });
  // Fonts land after first paint and move every caption; redraw when they do.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => schedule(true));
  refresh(true);
})();
