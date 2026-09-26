/* Adapted from portfolio-template by BrewedOps (MIT) — see LICENSE. */

/**
 * Intro overlay - "the workflow writes the line" (ported from IntroOverlay.tsx).
 *
 * The site's pitch is a system that runs itself, so the intro is a workflow
 * execution, drawn the way n8n draws one: a half-pill trigger node, square step
 * nodes, thin connectors, and the run streaming through them left to right.
 * Each node lights as the execution reaches it and earns a check; the headline
 * is written by the same progress, one word rising per stretch of cable.
 *
 *   Ignition  0.00-0.30  nodes and cables draw in
 *   Run       0.30-1.90  the execution streams the cables; nodes succeed as it
 *                        passes; words mask-reveal on the same progress value
 *   Lock      1.90-2.25  the last node succeeds, the status flips to done
 *   Handoff   2.25-3.15  the canvas falls away, the headline FLIES onto the
 *                        real `.hero-headline` at scale 1, and the page
 *                        assembles around it
 *
 * Static-site rules:
 *  - This is a small CLASSIC script loaded in <head>, so the page can be held
 *    back before first paint. Content is visible by default; nothing is hidden
 *    unless this script decides to run, and a failsafe hands the page back
 *    even if something below throws.
 *  - Runs once per tab session, only with motion allowed, never on a deep link.
 *  - Any click, key, wheel, touch or scroll skips it.
 *  - The words are read from the real headline, and each one lands on the
 *    exact box the browser laid it out in (Range rects), so the swap is exact
 *    at every width, including the forced line break.
 *
 * No animation library: Web Animations API for the keyframed parts and one rAF
 * loop for the progress-driven parts. Transform, opacity and stroke-dashoffset
 * only.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var KEY = 'jc-intro-seen';

  /* ---------- should it run at all? ---------- */
  var reducedMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  if (!reducedMQ || reducedMQ.matches) return;
  // The site's own "Reduce motion" switch (js/access.js), read straight from
  // storage because this script may run before that one.
  if (root.getAttribute('data-motion') === 'reduce') return;
  try {
    var a11y = JSON.parse(localStorage.getItem('jc-a11y') || 'null');
    if (a11y && a11y.motion) return;
  } catch (e) { /* no storage: the OS setting above decides */ }
  if (!Element.prototype.animate || !window.requestAnimationFrame || !document.createRange) return;
  // A deep link is someone going somewhere; do not make them watch a show first.
  var hash = window.location.hash;
  if (hash && hash !== '#hero' && hash !== '#main') return;
  try {
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, '1');
  } catch (e) {
    return; // Cannot promise "once per session", so do not run.
  }

  // Three classes: `intro-on` marks the page for its lifetime (the real
  // headline must never replay its own entrance under the clone that landed on
  // it); `is-intro` holds the page; `is-intro-head` holds only the headline,
  // which stays hidden until the flying clone has landed on it.
  root.classList.add('intro-on', 'is-intro', 'is-intro-head');

  var released = false;
  var cancelled = false;
  var overlay = null;
  var raf = 0;
  var timers = [];
  var anims = [];

  function releasePage() { root.classList.remove('is-intro'); }
  function releaseHead() { root.classList.remove('is-intro-head'); }

  function finish() {
    if (released) return;
    released = true;
    cancelled = true;
    cancelAnimationFrame(raf);
    for (var i = 0; i < timers.length; i++) clearTimeout(timers[i]);
    for (var j = 0; j < anims.length; j++) { try { anims[j].cancel(); } catch (e) { /* gone */ } }
    releasePage();
    releaseHead();
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = null;
    removeSkipListeners();
  }

  // Failsafe: whatever happens below, the page comes back.
  var failsafe = setTimeout(finish, 7000);

  /* ---------- skipping ---------- */
  var skipEvents = ['pointerdown', 'keydown', 'wheel', 'touchmove'];
  function onSkip(e) {
    // A click that skips must not also land on a link the visitor could not see.
    if (e && e.type === 'pointerdown') {
      var swallow = function (ev) { ev.preventDefault(); ev.stopPropagation(); };
      window.addEventListener('click', swallow, { capture: true, once: true });
      setTimeout(function () { window.removeEventListener('click', swallow, { capture: true }); }, 600);
    }
    finish();
  }
  function onScroll() { if (Math.abs(window.scrollY - startScroll) > 4) finish(); }
  var startScroll = 0;
  function addSkipListeners() {
    for (var i = 0; i < skipEvents.length; i++) window.addEventListener(skipEvents[i], onSkip, { passive: true, capture: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    if (reducedMQ.addEventListener) reducedMQ.addEventListener('change', onSkip);
    window.addEventListener('jc-a11ychange', onSkip);
  }
  function removeSkipListeners() {
    for (var i = 0; i < skipEvents.length; i++) window.removeEventListener(skipEvents[i], onSkip, { capture: true });
    window.removeEventListener('scroll', onScroll);
    if (reducedMQ.removeEventListener) reducedMQ.removeEventListener('change', onSkip);
    window.removeEventListener('jc-a11ychange', onSkip);
  }
  addSkipListeners();

  /* ---------- constants ---------- */
  var IGNITE_MS = 300, RUN_MS = 1600, LOCK_MS = 350, FLY_MS = 900;
  var NODE = 40, CANVAS_H = 96, NODE_Y = 34;
  var EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
  var EASE_SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  var EASE_CAMERA = 'cubic-bezier(0.76, 0, 0.24, 1)';
  var NS = 'http://www.w3.org/2000/svg';

  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  /** The four steps of the run. Icons are Tabler outlines, 24-unit grid. */
  var STEPS = [
    { label: 'Lead comes in', trigger: true, d: 'M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11' },
    { label: 'Tag & route', trigger: false, d: 'M4 4m0 2a2 2 0 0 1 2 -2h4.5a2 2 0 0 1 1.4 .6l7 7a2 2 0 0 1 0 2.8l-4.5 4.5a2 2 0 0 1 -2.8 0l-7 -7a2 2 0 0 1 -.6 -1.4v-4.5M8 8h.01' },
    { label: 'Follow up', trigger: false, d: 'M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10M3 7l9 6l9 -6' },
    { label: 'Call booked', trigger: false, d: 'M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12M16 3v4M8 3v4M4 11h16M9 16l2 2l4 -4' },
  ];

  function wait(ms) { return new Promise(function (res) { timers.push(setTimeout(res, ms)); }); }
  function play(el, frames, opts) {
    opts.fill = 'both';
    var a = el.animate(frames, opts);
    anims.push(a);
    return a;
  }
  function el(tag, cls) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }
  function svgIcon(d, size, width) {
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('width', size);
    s.setAttribute('height', size);
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', width);
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round');
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    s.appendChild(p);
    return s;
  }

  /** Every word of the real headline, with the box the browser laid it out in. */
  function measureWords(h1) {
    var out = [];
    var walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT, null);
    var range = document.createRange();
    var node;
    while ((node = walker.nextNode())) {
      var text = node.nodeValue;
      var re = /\S+/g;
      var m;
      while ((m = re.exec(text))) {
        range.setStart(node, m.index);
        range.setEnd(node, m.index + m[0].length);
        var r = range.getBoundingClientRect();
        if (r.width && r.height) out.push({ text: m[0], left: r.left, top: r.top, width: r.width, height: r.height });
      }
    }
    return out;
  }
  function inkBox(words) {
    var l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      l = Math.min(l, w.left); t = Math.min(t, w.top);
      r = Math.max(r, w.left + w.width); b = Math.max(b, w.top + w.height);
    }
    return { left: l, top: t, width: r - l, height: b - t };
  }

  /* ---------- build + run ---------- */
  function build(h1, words, box) {
    overlay = el('div', 'boot');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('role', 'presentation');

    // The clone carries the headline's own computed type, so scale 1 IS the headline.
    var cs = getComputedStyle(h1);
    var title = el('div', 'boot__title');
    title.style.width = box.width + 'px';
    title.style.height = box.height + 'px';
    title.style.fontFamily = cs.fontFamily;
    title.style.fontSize = cs.fontSize;
    title.style.fontWeight = cs.fontWeight;
    title.style.fontStyle = cs.fontStyle;
    title.style.letterSpacing = cs.letterSpacing;
    title.style.fontFeatureSettings = cs.fontFeatureSettings;
    title.style.fontVariationSettings = cs.fontVariationSettings;
    title.style.fontKerning = cs.fontKerning;

    var inners = [];
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      var word = el('span', 'boot__word');
      word.style.left = (w.left - box.left) + 'px';
      word.style.top = (w.top - box.top) + 'px';
      var inner = el('span', 'boot__word-in');
      // line-height equal to the measured content box: zero half-leading, so
      // the baseline sits exactly where the real glyphs sit.
      inner.style.lineHeight = w.height + 'px';
      inner.textContent = w.text;
      word.appendChild(inner);
      title.appendChild(word);
      inners.push(inner);
    }

    var canvas = el('div', 'boot__canvas');
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'boot__cables');
    canvas.appendChild(svg);

    var nodes = [];
    for (var k = 0; k < STEPS.length; k++) {
      var s = STEPS[k];
      var n = el('span', 'boot__n' + (s.trigger ? ' boot__n--trigger' : '') + (k === STEPS.length - 1 ? ' boot__n--last' : ''));
      var card = el('span', 'boot__n-card');
      card.appendChild(svgIcon(s.d, 18, 1.8));
      var check = el('span', 'boot__n-check');
      check.appendChild(svgIcon('M5 12l5 5l9 -10', 9, 3.2));
      card.appendChild(check);
      card.appendChild(el('i', 'boot__n-port boot__n-port--in'));
      card.appendChild(el('i', 'boot__n-port boot__n-port--out'));
      n.appendChild(card);
      var label = el('span', 'boot__n-label');
      label.textContent = s.label;
      n.appendChild(label);
      canvas.appendChild(n);
      nodes.push(n);
    }

    var dot = el('i', 'boot__dot');
    var dotCore = el('i', 'boot__dot-core');
    dot.appendChild(dotCore);
    canvas.appendChild(dot);

    var status = el('span', 'boot__status');
    status.appendChild(el('i', 'boot__status-dot'));
    var statusText = el('span', 'boot__status-text');
    statusText.textContent = 'Executing workflow';
    status.appendChild(statusText);
    canvas.appendChild(status);

    overlay.appendChild(title);
    overlay.appendChild(canvas);
    document.body.appendChild(overlay);

    return { title: title, inners: inners, canvas: canvas, svg: svg, nodes: nodes, dot: dot, dotCore: dotCore, status: status, statusText: statusText };
  }

  function run() {
    if (cancelled) return;
    var h1 = document.querySelector('.hero-headline');
    if (!h1) return finish();
    startScroll = window.scrollY;

    var words = measureWords(h1);
    if (!words.length) return finish();
    var box = inkBox(words);
    // The headline has to be on screen for anything to land on it.
    var onScreen = box.top >= 0 && box.top + box.height <= window.innerHeight;

    var ui = build(h1, words, box);
    var vw = window.innerWidth, vh = window.innerHeight;

    // Phones get the same sequence at two-thirds speed: a thumb is waiting.
    var k = vw < 1100 ? 0.62 : 1;
    var IGNITE = IGNITE_MS * k, RUN = RUN_MS * k, LOCK = LOCK_MS * k, FLY = FLY_MS * k;

    var width = box.width, height = box.height;
    var scale = Math.min((vw * 0.86) / width, (vh * 0.42) / height, 2.6);
    var w = width * scale, h = height * scale;
    var sx = (vw - w) / 2;
    var sy = (vh - h) / 2 - Math.min(96, vh * 0.09);

    var restTransform = 'translate(' + sx + 'px, ' + sy + 'px) scale(' + scale + ')';
    var canvasTransform = 'translate(' + sx + 'px, ' + (sy + h + 44 * scale) + 'px) scale(' + scale + ')';
    ui.title.style.transform = restTransform;
    ui.canvas.style.width = width + 'px';
    ui.canvas.style.height = CANVAS_H + 'px';
    ui.canvas.style.transform = canvasTransform;
    ui.title.style.opacity = '1';
    ui.canvas.style.opacity = '1';

    // ---- Lay the nodes out on the design canvas ----
    var n = ui.nodes.length;
    var xs = [];
    for (var i = 0; i < n; i++) xs.push(NODE / 2 + (i * (width - NODE)) / (n - 1));
    ui.nodes.forEach(function (node, i) {
      node.style.left = (xs[i] - NODE / 2) + 'px';
      node.style.top = (NODE_Y - NODE / 2) + 'px';
    });

    // Cables: one base path per gap and one accent path on top whose
    // dashoffset the run pays out, drawn as gentle beziers like n8n's.
    ui.svg.setAttribute('viewBox', '0 0 ' + width + ' ' + CANVAS_H);
    ui.svg.setAttribute('width', String(width));
    ui.svg.setAttribute('height', String(CANVAS_H));
    var cables = [];
    for (var c = 0; c < n - 1; c++) {
      var x1 = xs[c] + NODE / 2;
      var x2 = xs[c + 1] - NODE / 2;
      var cx = (x2 - x1) * 0.5;
      var d = 'M ' + x1 + ' ' + NODE_Y + ' C ' + (x1 + cx) + ' ' + NODE_Y + ', ' + (x2 - cx) + ' ' + NODE_Y + ', ' + x2 + ' ' + NODE_Y;
      var base = document.createElementNS(NS, 'path');
      base.setAttribute('d', d);
      base.setAttribute('class', 'boot__cable');
      var live = document.createElementNS(NS, 'path');
      live.setAttribute('d', d);
      live.setAttribute('class', 'boot__cable boot__cable--live');
      ui.svg.appendChild(base);
      ui.svg.appendChild(live);
      var len = live.getTotalLength();
      live.style.strokeDasharray = String(len);
      live.style.strokeDashoffset = String(len);
      cables.push({ live: live, len: len, from: x1, to: x2 });
      play(base, [{ opacity: 0 }, { opacity: 1 }], { duration: 420, delay: 90 + c * 70, easing: EASE_OUT });
    }

    // Words reveal in reading order, spread across the run.
    var gates = ui.inners.map(function (inner, i) { return { inner: inner, at: i / ui.inners.length, done: false }; });

    // ---- Ignition: nodes pop in, left to right ----
    ui.nodes.forEach(function (node, i) {
      play(node, [
        { opacity: 0, transform: 'translateY(8px) scale(0.86)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' },
      ], { duration: 520, delay: i * 70, easing: EASE_SPRING });
    });
    play(ui.dotCore, [{ opacity: 0, transform: 'scale(0.2)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 320, delay: 200, easing: EASE_SPRING });
    play(ui.status, [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 160, easing: EASE_OUT });

    var nodeDone = ui.nodes.map(function () { return false; });
    var x0 = xs[0], xn = xs[n - 1];
    var nodeAt = xs.map(function (x) { return (x - x0) / (xn - x0); });
    function succeed(i) {
      nodeDone[i] = true;
      var node = ui.nodes[i];
      node.classList.add('is-done');
      var badge = node.querySelector('.boot__n-check');
      if (badge) play(badge, [{ opacity: 0, transform: 'scale(0.3)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 460, easing: EASE_SPRING });
      var card = node.querySelector('.boot__n-card');
      if (card) play(card, [{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 420, easing: EASE_OUT });
    }

    wait(IGNITE).then(function () {
      if (cancelled) return;
      succeed(0);
      // ---- The run: one progress value drives cables, dot, nodes and words ----
      return new Promise(function (res) {
        var start = performance.now();
        function step(now) {
          if (cancelled) return res();
          var raw = Math.min(1, Math.max(0, (now - start) / RUN));
          var p = easeInOut(raw);
          var x = x0 + p * (xn - x0);
          ui.dot.style.transform = 'translate3d(' + x + 'px, ' + NODE_Y + 'px, 0)';
          for (var ci = 0; ci < cables.length; ci++) {
            var cb = cables[ci];
            var f = Math.min(1, Math.max(0, (x - cb.from) / (cb.to - cb.from)));
            cb.live.style.strokeDashoffset = String(cb.len * (1 - f));
          }
          for (var ni = 1; ni < n - 1; ni++) if (!nodeDone[ni] && p >= nodeAt[ni]) succeed(ni);
          for (var gi = 0; gi < gates.length; gi++) {
            var g = gates[gi];
            if (!g.done && p >= g.at) {
              g.done = true;
              play(g.inner, [{ transform: 'translateY(132%)' }, { transform: 'translateY(0)' }], { duration: 760, easing: EASE_OUT });
            }
          }
          if (raw < 1) raf = requestAnimationFrame(step);
          else res();
        }
        raf = requestAnimationFrame(step);
      });
    }).then(function () {
      if (cancelled) return;
      // ---- Lock: the last node succeeds, the run reports done ----
      play(ui.dotCore, [{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'linear' });
      succeed(n - 1);
      ui.status.classList.add('is-done');
      ui.statusText.textContent = 'Workflow executed successfully';
      return wait(LOCK);
    }).then(function () {
      if (cancelled) return;
      // ---- Handoff: the canvas falls away, the headline flies home ----
      play(ui.canvas, [
        { transform: canvasTransform, opacity: 1 },
        { transform: 'translate(' + sx + 'px, ' + (sy + h + 72 * scale) + 'px) scale(' + scale + ')', opacity: 0 },
      ], { duration: 420, easing: EASE_OUT });
      // Re-measure: late layout (images, fonts) may have nudged the headline.
      var now = measureWords(h1);
      var t = now.length === words.length ? inkBox(now) : box;
      if (onScreen) {
        play(ui.title, [
          { transform: restTransform },
          { transform: 'translate(' + t.left + 'px, ' + t.top + 'px) scale(1)' },
        ], { duration: FLY, easing: EASE_CAMERA });
      } else {
        play(ui.title, [{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: EASE_OUT });
        releaseHead();
      }
      return wait(onScreen ? FLY - 150 : 300);
    }).then(function () {
      if (cancelled) return;
      releasePage();
      return wait(150);
    }).then(function () {
      if (cancelled) return;
      clearTimeout(failsafe);
      finish();
    })['catch'](finish);
  }

  function begin() {
    if (cancelled) return;
    // Measure only with the real face loaded, but never wait on it for long.
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    var cap = new Promise(function (res) { timers.push(setTimeout(res, 1500)); });
    Promise.race([fontsReady, cap]).then(function () {
      try { run(); } catch (e) { finish(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', begin, { once: true });
  else begin();
})();
