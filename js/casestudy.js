/* Adapted from portfolio-template by BrewedOps (MIT) — see LICENSE. */
/*
 * The walkthrough pages (work/*.html): the system map, ported from
 * SysMap.tsx without changing its behaviour.
 *
 * The nodes are HTML; the edges are SVG paths measured from where those nodes
 * actually landed, so one declaration serves the desktop graph and the phone
 * stack. The captured markup carries the edges drawn at 1440px as a no-JS
 * fallback; this redraws them on load, on every resize of the map, and once
 * the web fonts land (they move every node).
 *
 * The graph itself is declared on the map element:
 *   data-edges="a>b b>c c>a~"   (a trailing ~ marks a feedback edge)
 *   data-route="a b c"          (the live path the accent stroke walks)
 *
 * - Fan-in and fan-out anchors are spread across the node's edge.
 * - In the single-column stack every edge bows out into a lane beside the
 *   stack, so no line is drawn through a node it does not touch.
 * - The route is walked once, on first paint, unless motion is reduced.
 */
(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function motionReduced() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    // The accessibility menu's own "reduce motion" switch.
    return document.documentElement.getAttribute('data-a11y-motion') === 'true';
  }

  function parseEdges(str) {
    return (str || '').trim().split(/\s+/).filter(Boolean).map(function (tok) {
      var feedback = tok.charAt(tok.length - 1) === '~';
      if (feedback) tok = tok.slice(0, -1);
      var parts = tok.split('>');
      return { from: parts[0], to: parts[1], feedback: feedback };
    });
  }

  function initMap(map) {
    var svg = map.querySelector('svg.sysmap-edges');
    if (!svg) return;
    var edges = parseEdges(map.getAttribute('data-edges'));
    var route = (map.getAttribute('data-route') || '').trim().split(/\s+/).filter(Boolean);
    var walked = false;
    var walkAnim = null;

    function box(el) {
      var m = map.getBoundingClientRect();
      var r = el.getBoundingClientRect();
      return { x: r.left - m.left, y: r.top - m.top, w: r.width, h: r.height };
    }

    /* Where an edge meets a node: centred when it is the only one, fanned
       across the edge when it shares the node with siblings. */
    function anchorY(b, i, n) {
      if (!n || n < 2) return b.y + b.h / 2;
      var spread = Math.min(b.h - 18, 36);
      return b.y + b.h / 2 + ((i || 0) - (n - 1) / 2) * (spread / (n - 1));
    }

    function segment(a, b, opts) {
      opts = opts || {};
      var ay = anchorY(a, opts.outI, opts.outN);
      var by = anchorY(b, opts.inI, opts.inN);
      var x1, y1, x2, y2, c;

      if (opts.lane != null) {
        // Single column: bow out into the lane.
        x1 = a.x; y1 = a.y + a.h / 2; x2 = b.x; y2 = b.y + b.h / 2;
        return {
          d: 'M' + x1 + ' ' + y1 + 'C' + opts.lane + ' ' + y1 + ' ' + opts.lane + ' ' + y2 + ' ' + x2 + ' ' + y2,
          feedback: opts.back
        };
      }

      var gapX = b.x - (a.x + a.w);
      var gapY = b.y - (a.y + a.h);

      if (!opts.back && gapX > 4) {
        x1 = a.x + a.w; x2 = b.x;
        c = Math.max(16, (x2 - x1) * 0.55);
        return { d: 'M' + x1 + ' ' + ay + 'C' + (x1 + c) + ' ' + ay + ' ' + (x2 - c) + ' ' + by + ' ' + x2 + ' ' + by, feedback: false };
      }

      if (!opts.back && gapY > 4) {
        x1 = a.x + Math.min(30, a.w / 2); y1 = a.y + a.h;
        x2 = b.x + Math.min(30, b.w / 2); y2 = b.y;
        c = Math.max(12, (y2 - y1) * 0.55);
        return { d: 'M' + x1 + ' ' + y1 + 'C' + x1 + ' ' + (y1 + c) + ' ' + x2 + ' ' + (y2 - c) + ' ' + x2 + ' ' + y2, feedback: false };
      }

      if (!opts.back && b.y + b.h < a.y - 4) {
        x1 = a.x + Math.min(30, a.w / 2); y1 = a.y;
        x2 = b.x + Math.min(30, b.w / 2); y2 = b.y + b.h;
        c = Math.max(12, (y1 - y2) * 0.55);
        return { d: 'M' + x1 + ' ' + y1 + 'C' + x1 + ' ' + (y1 - c) + ' ' + x2 + ' ' + (y2 + c) + ' ' + x2 + ' ' + y2, feedback: false };
      }

      // Feedback: runs back upstream, looped clear of the edge it retraces.
      var off = 26;
      x1 = a.x; y1 = a.y + a.h / 2; x2 = b.x; y2 = b.y + b.h / 2;
      var reach = Math.min(x1, x2) - off;
      return { d: 'M' + x1 + ' ' + y1 + 'C' + reach + ' ' + y1 + ' ' + reach + ' ' + y2 + ' ' + x2 + ' ' + y2, feedback: true };
    }

    function line(cls, d) {
      var p = document.createElementNS(SVG_NS, 'path');
      p.setAttribute('class', cls);
      p.setAttribute('d', d);
      svg.appendChild(p);
      return p;
    }

    function draw() {
      var m = map.getBoundingClientRect();
      if (!m.width) return;
      svg.setAttribute('viewBox', '0 0 ' + m.width + ' ' + m.height);
      svg.setAttribute('width', String(m.width));
      svg.setAttribute('height', String(m.height));
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      var boxes = {};
      var xs = [];
      map.querySelectorAll('[data-node]').forEach(function (el) {
        var b = box(el);
        boxes[el.getAttribute('data-node')] = b;
        xs.push(b.x);
      });
      if (!xs.length) return;

      // One column means the stack: route every edge through a side lane.
      var minX = Math.min.apply(null, xs);
      var stacked = Math.max.apply(null, xs) - minX < 8;
      var lane = stacked ? Math.max(2, minX - 14) : null;

      // Fan counts, so both the grey edges and the route use one set of anchors.
      var inN = {}, outN = {}, inI = {}, outI = {}, opts = {};
      edges.forEach(function (e) {
        inN[e.to] = (inN[e.to] || 0) + 1;
        outN[e.from] = (outN[e.from] || 0) + 1;
      });
      edges.forEach(function (e) {
        var key = e.from + '>' + e.to;
        inI[e.to] = inI[e.to] === undefined ? 0 : inI[e.to] + 1;
        outI[e.from] = outI[e.from] === undefined ? 0 : outI[e.from] + 1;
        opts[key] = {
          inI: inI[e.to], inN: inN[e.to],
          outI: outI[e.from], outN: outN[e.from],
          back: !!e.feedback, lane: lane
        };
      });

      var onRoute = {};
      for (var i = 0; i < route.length - 1; i++) onRoute[route[i] + '>' + route[i + 1]] = true;

      // Everything that is not the live path, drawn first so the route sits over it.
      edges.forEach(function (e) {
        var key = e.from + '>' + e.to;
        if (onRoute[key]) return;
        var a = boxes[e.from], b = boxes[e.to];
        if (!a || !b) return;
        var seg = segment(a, b, opts[key]);
        line('sysmap-edge' + (seg.feedback ? ' sysmap-edge-feedback' : ''), seg.d);
      });

      // The live path: one stroke, start to finish.
      var d = '';
      for (var j = 0; j < route.length - 1; j++) {
        var key = route[j] + '>' + route[j + 1];
        var a = boxes[route[j]], b = boxes[route[j + 1]];
        if (!a || !b) continue;
        var seg = segment(a, b, opts[key] || { lane: lane });
        d += j === 0 ? seg.d : seg.d.replace(/^M[^C]*/, '');
      }
      if (!d) return;

      var path = line('sysmap-route', d);
      var len = path.getTotalLength();
      path.style.strokeDasharray = String(len);

      // A redraw mid-walk (fonts landing, the first ResizeObserver tick, both
      // within ~150ms of load) replaces the path. The template dropped the walk
      // there, so it never showed; here the new path picks it up where the old
      // one was, so the route visibly draws itself once.
      var running = walkAnim && walkAnim.playState === 'running' ? walkAnim.currentTime : null;
      if ((walked && running === null) || motionReduced() || typeof path.animate !== 'function') {
        path.style.strokeDashoffset = '0';
        return;
      }
      path.style.strokeDashoffset = String(len);
      walkAnim = path.animate(
        [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
        { duration: 1150, delay: 260, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
      );
      if (running !== null) walkAnim.currentTime = running;
      walked = true;
    }

    // Fonts land after first paint and move every node; redraw when they do.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(draw).observe(map);
    } else {
      window.addEventListener('resize', draw);
    }
    draw();
  }

  function init() {
    document.querySelectorAll('.sysmap[data-edges]').forEach(initMap);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
