/* ==========================================================================
   System map — draws the real edges between nodes.

   The nodes are HTML (so the labels stay selectable, translatable and
   reflowable); the edges are SVG paths measured from where those nodes
   actually landed, so one declaration serves the desktop graph and the
   mobile stack without a second set of coordinates.

   Markup contract:
     <div class="sysmap" data-sysmap
          data-edges='[{"from":"a","to":"b"}, ...]'
          data-route='["a","b","c"]'>
       <svg class="sysmap-edges"></svg>
       <div class="sysnode" data-node="a" style="--col:1; --row:2"> ... </div>
     </div>

   The route is the live path: one continuous amber stroke walked through the
   nodes a record actually travels, drawn once on first paint.

   Two rules keep the drawing honest rather than merely decorative:

   - Fan-in and fan-out anchors are spread across the node's edge instead of
     all meeting at one point, so three sources feeding one record read as
     three edges rather than one congested corner.

   - When the layout collapses to a single column, every edge is routed out
     into a lane beside the stack. A straight line between two stacked nodes
     would cross whatever sits between them, and on a fan-in that means the
     route appears to pass through parallel sources it never visits — a
     different system, drawn confidently. The lane costs a bend and keeps the
     graph true.
   ========================================================================== */
(() => {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll("[data-sysmap]").forEach(setup);

  function setup(map) {
    const svg = map.querySelector(".sysmap-edges");
    if (!svg) return;

    let edges = [];
    let route = [];
    try {
      edges = JSON.parse(map.dataset.edges || "[]");
      route = JSON.parse(map.dataset.route || "[]");
    } catch (e) {
      return;
    }

    const node = (id) => map.querySelector(`[data-node="${id}"]`);
    let walked = false;

    function box(el) {
      const m = map.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return { x: r.left - m.left, y: r.top - m.top, w: r.width, h: r.height };
    }

    /* Where an edge meets a node: centred when it is the only one, fanned
       across the edge when it shares the node with siblings. */
    function anchorY(b, i, n) {
      if (!n || n < 2) return b.y + b.h / 2;
      const spread = Math.min(b.h - 18, 36);
      return b.y + b.h / 2 + (i - (n - 1) / 2) * (spread / (n - 1));
    }

    function segment(a, b, opts) {
      const o = opts || {};
      const ay = anchorY(a, o.outI, o.outN);
      const by = anchorY(b, o.inI, o.inN);

      if (o.lane != null) {
        // Single column: bow out into the lane so nothing is drawn through
        // a node the edge does not touch.
        const x1 = a.x;
        const y1 = a.y + a.h / 2;
        const x2 = b.x;
        const y2 = b.y + b.h / 2;
        return {
          d: `M${x1} ${y1}C${o.lane} ${y1} ${o.lane} ${y2} ${x2} ${y2}`,
          feedback: o.back,
        };
      }

      const gapX = b.x - (a.x + a.w);
      const gapY = b.y - (a.y + a.h);

      if (!o.back && gapX > 4) {
        const x1 = a.x + a.w;
        const x2 = b.x;
        const c = Math.max(16, (x2 - x1) * 0.55);
        return { d: `M${x1} ${ay}C${x1 + c} ${ay} ${x2 - c} ${by} ${x2} ${by}` };
      }

      if (!o.back && gapY > 4) {
        const x1 = a.x + Math.min(30, a.w / 2);
        const y1 = a.y + a.h;
        const x2 = b.x + Math.min(30, b.w / 2);
        const y2 = b.y;
        const c = Math.max(12, (y2 - y1) * 0.55);
        return { d: `M${x1} ${y1}C${x1} ${y1 + c} ${x2} ${y2 - c} ${x2} ${y2}` };
      }

      if (!o.back && b.y + b.h < a.y - 4) {
        const x1 = a.x + Math.min(30, a.w / 2);
        const y1 = a.y;
        const x2 = b.x + Math.min(30, b.w / 2);
        const y2 = b.y + b.h;
        const c = Math.max(12, (y1 - y2) * 0.55);
        return { d: `M${x1} ${y1}C${x1} ${y1 - c} ${x2} ${y2 + c} ${x2} ${y2}` };
      }

      // Feedback: runs back upstream, looped clear of the edge it retraces.
      const off = 26;
      const x1 = a.x;
      const y1 = a.y + a.h / 2;
      const x2 = b.x;
      const y2 = b.y + b.h / 2;
      const reach = Math.min(x1, x2) - off;
      return {
        d: `M${x1} ${y1}C${reach} ${y1} ${reach} ${y2} ${x2} ${y2}`,
        feedback: true,
      };
    }

    function line(cls, d) {
      const p = document.createElementNS(SVG_NS, "path");
      p.setAttribute("class", cls);
      p.setAttribute("d", d);
      svg.appendChild(p);
      return p;
    }

    function draw() {
      const m = map.getBoundingClientRect();
      if (!m.width) return;
      svg.setAttribute("viewBox", `0 0 ${m.width} ${m.height}`);
      svg.setAttribute("width", m.width);
      svg.setAttribute("height", m.height);
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      const boxes = {};
      map.querySelectorAll("[data-node]").forEach((el) => {
        boxes[el.dataset.node] = box(el);
      });
      const xs = Object.values(boxes).map((b) => b.x);
      if (!xs.length) return;

      // One column means the stack: route every edge through a side lane.
      const stacked = Math.max(...xs) - Math.min(...xs) < 8;
      const lane = stacked ? Math.max(2, Math.min(...xs) - 14) : null;

      // Fan counts, so both the grey edges and the route use one set of anchors.
      const inN = {};
      const outN = {};
      edges.forEach((e) => {
        inN[e.to] = (inN[e.to] || 0) + 1;
        outN[e.from] = (outN[e.from] || 0) + 1;
      });
      const inI = {};
      const outI = {};
      const opts = {};
      edges.forEach((e) => {
        const key = e.from + ">" + e.to;
        inI[e.to] = inI[e.to] === undefined ? 0 : inI[e.to] + 1;
        outI[e.from] = outI[e.from] === undefined ? 0 : outI[e.from] + 1;
        opts[key] = {
          inI: inI[e.to],
          inN: inN[e.to],
          outI: outI[e.from],
          outN: outN[e.from],
          back: !!e.feedback,
          lane,
        };
      });

      const onRoute = new Set();
      for (let i = 0; i < route.length - 1; i++) onRoute.add(route[i] + ">" + route[i + 1]);

      // Everything that is not the live path, drawn first so the route sits over it.
      edges.forEach((e) => {
        const key = e.from + ">" + e.to;
        if (onRoute.has(key)) return;
        const a = boxes[e.from];
        const b = boxes[e.to];
        if (!a || !b) return;
        const seg = segment(a, b, opts[key]);
        line("sysmap-edge" + (seg.feedback ? " sysmap-edge-feedback" : ""), seg.d);
      });

      // The live path: one stroke, start to finish.
      let d = "";
      for (let i = 0; i < route.length - 1; i++) {
        const key = route[i] + ">" + route[i + 1];
        const a = boxes[route[i]];
        const b = boxes[route[i + 1]];
        if (!a || !b) continue;
        const seg = segment(a, b, opts[key] || { lane });
        d += i === 0 ? seg.d : seg.d.replace(/^M[^C]*/, "");
      }
      if (!d) return;

      const path = line("sysmap-route", d);
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;

      if (walked || reduceMotion.matches) {
        path.style.strokeDashoffset = "0";
        return;
      }
      path.style.strokeDashoffset = `${len}`;
      path.animate(
        [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
        { duration: 1150, delay: 260, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" }
      );
      walked = true;
    }

    // Fonts land after first paint and move every node; redraw when they do.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    if ("ResizeObserver" in window) {
      new ResizeObserver(draw).observe(map);
    } else {
      window.addEventListener("resize", draw);
    }
    draw();
  }
})();
