/* Adapted from portfolio-template by BrewedOps (MIT) — see LICENSE.
   https://github.com/brewed-ops/portfolio-template  (c) BrewedOps

   Funnel barrel: a WebGL drum of page screenshots, and the dialog a page
   opens into. Ported from src/components/FunnelBarrel.tsx and
   src/components/FunnelModal.tsx on the React branch; the data below is
   src/data/funnels.ts as written there.

   Upstream notes, kept:
   - FunnelBarrel is the "dialect barrel gallery" technique, a spiral-template
     port: a wide/fat/short cylinder (COLS 16, RAD 11, camera z31) inside a
     two-group tilt stack. The inner group spins, the outer tilt frames the
     drum. A contained fade band crops it to a few rows so it never eats the
     page, and a cone taper widens the top ring (the tornado/funnel look).
   - The template framed a local HTML page in the dialog. These builds are
     either a client's live site or a screen inside someone's GoHighLevel
     account, so neither can be served from this origin. The dialog shows the
     screenshot, and when the build is public the address is a real link.

   Progressive enhancement. The card keeps its three static screenshots
   (.proj-shots) in the HTML. They are hidden only after the drum has
   rendered with its textures. No WebGL, reduced motion, a failed CDN import
   or every texture failing: the screenshots simply stay.

   Mount: <div class="barrel" data-barrel></div> inside the card. */

/* Three.js is fetched only when a drum is about to scroll into view: most
   visitors land on the hero, and ~700KB for a card further down should not
   compete with the first paint. The module cache shares it with the hero
   shader if that already loaded it. */
const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.183.2/build/three.module.min.js";
let THREE = null;

/* ---------- Data: src/data/funnels.ts ----------
   Paths are kept as the source writes them ("/img/...") and resolved against
   this file, so the page works from any directory. */

/**
 * Shipped work, as screenshots.
 *
 * The template shipped this as local HTML pages it could iframe. Jeffrey's
 * builds are either a client's live site or a screen inside someone's
 * GoHighLevel account, so neither can be served from this origin: the first
 * is not ours to re-host, the second is behind a login. Screenshots are the
 * honest form, and the preview dialog shows them full size the same way the
 * old site's lightbox did.
 *
 * Every description below is either observable in the screenshot or was given
 * by Jeffrey. Nothing here is inferred from a filename.
 */

const SUSHI = "https://thesushiboxcdo.com/the-sushi-box-cdo";

const sushiBox = [
  {
    id: "sushi-01-home",
    label: "The Sushi Box CDO",
    tag: "Website",
    desc: "A maki shop in Cagayan de Oro. The homepage carries the menu bento, Book Now and Message to Order in the header, and the opening hours strip.",
    thumb: "/img/sushi-01-home-thumb.webp",
    full: "/img/sushi-01-home.webp",
    w: 1600,
    h: 835,
    href: SUSHI,
  },
  {
    id: "sushi-02-reviews",
    label: "Delivery-app reviews",
    tag: "Website",
    desc: "Their real Grab, Foodpanda and Facebook reviews pulled onto the page as a nine-card wall, each one carrying the customer name and the app it came from.",
    thumb: "/img/sushi-02-reviews-thumb.webp",
    full: "/img/sushi-02-reviews.webp",
    w: 1600,
    h: 833,
    href: SUSHI,
  },
  {
    id: "sushi-03-catering",
    label: "The Sushi Corner",
    tag: "Website",
    desc: "The catering section: sushi boat spreads laid out for weddings and parties, shot by the client and set as a gallery.",
    thumb: "/img/sushi-03-catering-thumb.webp",
    full: "/img/sushi-03-catering.webp",
    w: 1600,
    h: 770,
    href: SUSHI,
  },
  {
    id: "sushi-04-booking",
    label: "Pickup booking",
    tag: "Booking",
    desc: "A GoHighLevel calendar taking pickup bookings from inside the site. One-hour slots, Asia/Manila, no third-party booking tool in the middle.",
    thumb: "/img/sushi-04-booking-thumb.webp",
    full: "/img/sushi-04-booking.webp",
    w: 1600,
    h: 835,
    href: SUSHI,
  },
];

/**
 * TODO (Jeffrey): these three are yours, but the old site shipped them with
 * empty alt text and the clients anonymised, so there is no written record of
 * what each one was. Give me the client, the industry and what the build had
 * to do and these descriptions get replaced. Until then they say only what
 * the screenshot shows.
 */
const clientSites = [
  {
    id: "work-teameasycrane",
    label: "Team Easy Crane",
    tag: "Funnel",
    desc: "A funnel build shipped and handed over to the client.",
    thumb: "/img/work-teameasycrane.webp",
    full: "/img/work-teameasycrane.webp",
    w: 640,
    h: 360,
  },
  {
    id: "work-findthepulse",
    label: "Find The Pulse",
    tag: "Website",
    desc: "A website build shipped and handed over to the client.",
    thumb: "/img/work-findthepulse.webp",
    full: "/img/work-findthepulse.webp",
    w: 640,
    h: 360,
  },
  {
    id: "work-easycrane",
    label: "Easy Crane",
    tag: "Website",
    desc: "A website build shipped and handed over to the client.",
    thumb: "/img/work-easycrane.webp",
    full: "/img/work-easycrane.webp",
    w: 640,
    h: 360,
  },
];

/** Everything the barrel spins, newest and best-documented first. */
const allWork = [...sushiBox, ...clientSites];

const asset = (p) => new URL(".." + p, import.meta.url).href;

/* ---------- Dialog ----------
   One dialog for every barrel on the page. It wears the site's viewer classes
   (.lb, .lb-dialog, .lb-bar, .lb-btn, .lb-frame, .lb-img) so it looks and
   moves like the screenshot viewer, but it is its own element: gallery.js
   binds only to #lightbox and never sees this one. */

const SVG_NS = "http://www.w3.org/2000/svg";
function icon(id) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "icon");
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS(SVG_NS, "use");
  use.setAttribute("href", "#" + id);
  svg.appendChild(use);
  return svg;
}
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

let dialogApi = null;
function getDialog() {
  if (dialogApi) return dialogApi;

  const root = el("div", "lb barrel-lb");
  root.id = "barrel-dialog";
  root.hidden = true;
  const backdrop = el("div", "lb-backdrop");
  const dialog = el("div", "lb-dialog barrel-lb-dialog");
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "barrel-dialog-title");
  dialog.setAttribute("aria-describedby", "barrel-dialog-desc");

  const bar = el("div", "lb-bar barrel-lb-bar");
  const heading = el("div", "barrel-lb-head");
  const tag = el("span", "barrel-lb-tag");
  const title = el("h2", "lb-caption barrel-lb-title");
  title.id = "barrel-dialog-title";
  heading.append(tag, title);

  const link = el("a", "barrel-lb-link");
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  const linkHost = el("span", "barrel-lb-host");
  link.append(linkHost, icon("i-arrow"));

  const closeBtn = el("button", "lb-btn lb-close barrel-lb-close");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close preview");
  closeBtn.appendChild(icon("i-close"));
  bar.append(heading, link, closeBtn);

  const frame = el("div", "lb-frame barrel-lb-frame");
  const img = el("img", "lb-img barrel-lb-img");
  img.decoding = "async";
  img.draggable = false;
  frame.appendChild(img);

  const desc = el("p", "barrel-lb-desc");
  desc.id = "barrel-dialog-desc";

  dialog.append(bar, frame, desc);
  root.append(backdrop, dialog);
  document.body.appendChild(root);

  let opener = null;
  let exitTimer = 0;
  const listeners = new Set();

  function focusables() {
    return Array.from(dialog.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"))
      .filter((n) => !n.hidden && n.getClientRects().length);
  }

  function onKey(e) {
    if (root.hidden) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== "Tab") return;
    const f = focusables();
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (!dialog.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function open(f, trigger) {
    clearTimeout(exitTimer);
    opener = trigger || document.activeElement;
    tag.textContent = f.tag;
    title.textContent = f.label;
    desc.textContent = f.desc;
    img.src = asset(f.full);
    img.alt = f.desc;
    img.width = f.w;
    img.height = f.h;
    if (f.href) {
      link.href = f.href;
      linkHost.textContent = f.href.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
      link.hidden = false;
    } else {
      link.removeAttribute("href");
      link.hidden = true;
    }
    frame.scrollTop = 0;
    root.hidden = false;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() => { root.dataset.open = "true"; });
    closeBtn.focus();
    listeners.forEach((fn) => fn(true));
  }

  function close() {
    if (root.hidden) return;
    root.dataset.open = "false";
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    const back = opener;
    opener = null;
    if (back && document.contains(back) && typeof back.focus === "function") {
      back.focus({ preventScroll: true });
    }
    clearTimeout(exitTimer);
    /* Hidden only once it has finished leaving, or the exit never renders. */
    exitTimer = setTimeout(() => {
      root.hidden = true;
      img.removeAttribute("src");
    }, 160);
    listeners.forEach((fn) => fn(false));
  }

  backdrop.addEventListener("click", close);
  closeBtn.addEventListener("click", close);

  dialogApi = { open, close, onToggle: (fn) => listeners.add(fn) };
  return dialogApi;
}

/* ---------- Barrel ---------- */

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) {
    return false;
  }
}

function mount(wrap, funnels) {
  const card = wrap.closest(".proj") || wrap.parentElement;
  const fallback = card ? card.querySelector(".proj-shots") : null;

  const canvas = el("canvas", "barrel-gl");
  canvas.setAttribute("aria-hidden", "true");
  const labelEl = el("div", "barrel-label");
  labelEl.setAttribute("aria-hidden", "true");
  const labCat = el("span", "barrel-label-cat");
  const labTitle = el("span", "barrel-label-title");
  labelEl.append(labCat, labTitle);
  const hint = el("span", "barrel-hint", "Drag to spin · click a page to open");
  hint.setAttribute("aria-hidden", "true");

  /* Every page reachable by keyboard and screen reader. Visually hidden until
     one of them has focus, then shown, so a keyboard user can see where they are. */
  const list = el("ul", "barrel-list");
  const dlg = getDialog();
  funnels.forEach((f) => {
    const li = el("li");
    const b = el("button", "barrel-list-btn", `Open ${f.label} (${f.tag})`);
    b.type = "button";
    b.addEventListener("click", () => dlg.open(f, b));
    li.appendChild(b);
    list.appendChild(li);
  });

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    return null;
  }
  wrap.append(canvas, labelEl, hint, list);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const FOV = 40;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

  /* ---- geometry: wide, fat, short drum ----
     The upstream cards were 3:4 portrait, built for tall page thumbnails.
     Every screenshot here is landscape (about 16:9 to 2:1), and stretching
     one onto a portrait tile squashes the page. So the tiles are 4:3 and each
     texture is cover-cropped from the top of the page, where the header and
     the hero are. */
  const COLS = 16;
  const ROWS = Math.max(8, Math.ceil(funnels.length / COLS));
  const RAD = 11;
  const CARD_ASPECT = 4 / 3;
  const anglePer = (Math.PI * 2) / COLS;
  const thetaLen = anglePer * 0.9;
  const arcW = thetaLen * RAD;
  const cardH = arcW / CARD_ASPECT;
  const rowGap = cardH * 1.06;
  const TOWER_H = ROWS * rowGap;
  /* Fade band in world units: about three rows at full strength. */
  const VIS = rowGap * 1.15;
  const FADE = rowGap * 1.25;

  const manager = new THREE.LoadingManager();
  const loader = new THREE.TextureLoader(manager);
  loader.crossOrigin = "anonymous";
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const texCache = new Map();
  const matsByUrl = new Map();
  const mats = [];
  let failures = 0;

  function coverCrop(t) {
    const im = t.image;
    if (!im || !im.width || !im.height) return;
    const ia = im.width / im.height;
    if (ia > CARD_ASPECT) {
      t.repeat.set(CARD_ASPECT / ia, 1);
      t.offset.set((1 - t.repeat.x) / 2, 0);
    } else {
      t.repeat.set(1, ia / CARD_ASPECT);
      t.offset.set(0, 1 - t.repeat.y); // keep the top of the page
    }
  }

  function loadTex(url) {
    const cached = texCache.get(url);
    if (cached) return cached;
    const t = loader.load(url, coverCrop, undefined, () => {
      /* On failure, drop to a flat panel instead of a broken texture. */
      failures++;
      (matsByUrl.get(url) || []).forEach((m) => {
        m.map = null;
        m.userData.base = 0.22;
        m.needsUpdate = true;
      });
      t.dispose();
    });
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter; // NPOT thumbnails -> no mipmaps
    t.generateMipmaps = false;
    t.anisotropy = maxAniso;
    texCache.set(url, t);
    return t;
  }

  /* Rounded-corner alpha mask so each card reads as a floating tile, not a
     hard rectangle. MeshBasicMaterial reads alpha from the green channel;
     white rounded-rect on black -> rounded card. */
  function makeRoundedAlpha() {
    const w = 400;
    const h = Math.round(w / CARD_ASPECT);
    const r = 26;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(w, 0, w, h, r);
    ctx.arcTo(w, h, 0, h, r);
    ctx.arcTo(0, h, 0, 0, r);
    ctx.arcTo(0, 0, w, 0, r);
    ctx.closePath();
    ctx.fill();
    const t = new THREE.CanvasTexture(c);
    t.minFilter = THREE.LinearFilter;
    return t;
  }
  const roundTex = makeRoundedAlpha();

  /* one shared geometry centred on +Z; each card just gets a rotation.y */
  const sharedGeo = new THREE.CylinderGeometry(RAD, RAD, cardH, 24, 1, true, -thetaLen / 2, thetaLen);

  /* STACK: inner `group` spins on its own Y axis; outer `tilt` frames the drum. */
  const group = new THREE.Group();
  const tilt = new THREE.Group();
  tilt.add(group);
  tilt.rotation.z = -0.04; // barely-there lean
  tilt.rotation.x = 0.16; // tip down so we see the top-rim ellipse
  tilt.position.set(0, -0.6, 0);
  scene.add(tilt);

  const cards = [];
  const SLOTS = ROWS * COLS;
  const N = funnels.length;
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  let stride = Math.max(1, Math.round(N / 3));
  while (N > 1 && gcd(stride, N) !== 1) stride++;
  const order = [];
  for (let k = 0; k < SLOTS; k++) order.push(k < N ? k : (k * stride) % N);

  let counter = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const funnel = funnels[order[counter]];
      const url = asset(funnel.thumb);
      const material = new THREE.MeshBasicMaterial({
        side: THREE.FrontSide,
        transparent: true,
        alphaMap: roundTex,
      });
      material.userData.base = 1;
      material.map = loadTex(url);
      if (!matsByUrl.has(url)) matsByUrl.set(url, []);
      matsByUrl.get(url).push(material);
      mats.push(material);
      const mesh = new THREE.Mesh(sharedGeo, material);
      const baseAngle = c * anglePer + (r % 2 ? anglePer * 0.5 : 0); // brick offset
      mesh.rotation.y = baseAngle;
      mesh.position.y = r * rowGap - TOWER_H / 2 + rowGap / 2;
      mesh.userData = { funnel, baseY: mesh.position.y, baseAngle, cur: 0, dim: 1 };
      group.add(mesh);
      cards.push(mesh);
      counter++;
    }
  }

  /* ---- interaction ---- */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(-2, -2);
  let hovered = null;
  let scrollTarget = 0;
  let scrollCurrent = 0;
  let spinTarget = 0;
  let spinAngle = 0;
  let dragSpin = 0;
  let pointerInside = false;
  let dialogOpen = false;
  let destroyed = false;

  function setPointerFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    labelEl.style.left = e.clientX - rect.left + "px";
    labelEl.style.top = e.clientY - rect.top + "px";
  }

  function pick() {
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(cards, false).find((h) => h.object.material.opacity > 0.08);
    return hit ? hit.object : null;
  }

  /* drag-to-explore */
  let dragging = false;
  let downX = 0;
  let downY = 0;
  let lastX = 0;
  let lastY = 0;
  let moved = 0;

  const onPointerMove = (e) => {
    setPointerFromEvent(e);
    spinTarget = pointer.x * 0.22;
    if (dragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      dragSpin += dx * 0.006;
      scrollTarget += dy * 0.01;
      moved += Math.abs(dx) + Math.abs(dy);
      lastX = e.clientX;
      lastY = e.clientY;
    }
    kick();
  };
  const onPointerEnter = () => { pointerInside = true; };
  const onPointerLeave = () => {
    pointerInside = false;
    pointer.set(-2, -2);
    hovered = null;
    labelEl.classList.remove("is-on");
  };
  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    dragging = true;
    downX = lastX = e.clientX;
    downY = lastY = e.clientY;
    moved = 0;
    setPointerFromEvent(e);
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* no capture */ }
    canvas.style.cursor = "grabbing";
  };
  const onPointerUp = (e) => {
    if (!dragging) return;
    const wasTap = moved < 6 && Math.abs(e.clientX - downX) < 6 && Math.abs(e.clientY - downY) < 6;
    dragging = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch (err) { /* nothing to release */ }
    canvas.style.cursor = hovered ? "pointer" : "grab";
    if (wasTap) {
      setPointerFromEvent(e);
      const hit = pick();
      if (hit && hit.userData.funnel) {
        /* The canvas is aria-hidden; focus goes back to the page's own
           button for that funnel, which is in the tab order. */
        const idx = funnels.indexOf(hit.userData.funnel);
        const btn = list.querySelectorAll("button")[idx] || null;
        dlg.open(hit.userData.funnel, btn);
      }
    }
  };
  const onPointerCancel = () => {
    dragging = false;
    canvas.style.cursor = "grab";
  };

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerenter", onPointerEnter);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerCancel);

  function resize() {
    const w = Math.max(1, wrap.clientWidth);
    const h = Math.max(1, wrap.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    /* Upstream sat at z31 in a full-width section. In a card the box can be
       nearly square, so back the camera off until the widest ring fits. */
    const halfW = RAD * 1.32;
    const fit = halfW / (Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * camera.aspect);
    const z = Math.max(31, fit);
    camera.position.set(0, 4.2 * (z / 31), z);
    camera.lookAt(0, -0.9, 0); // drum mass sits a touch below its centre
    camera.updateProjectionMatrix();
    kick();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(wrap);

  /* Pause when off screen, when the tab is hidden and while the dialog is
     open: the loop stops scheduling entirely and is re-kicked on return. */
  let onScreen = true;
  let running = false;
  const io = new IntersectionObserver((entries) => {
    onScreen = entries[0] ? entries[0].isIntersecting : true;
    if (onScreen) kick();
  }, { threshold: 0.01 });
  io.observe(wrap);
  const onVis = () => { if (!document.hidden && onScreen) kick(); };
  document.addEventListener("visibilitychange", onVis);
  dlg.onToggle((isOpen) => { dialogOpen = isOpen; if (!isOpen) kick(); });

  /* Frame time by hand: THREE.Clock is deprecated in r183. */
  let last = 0;
  let raf = 0;
  function kick() {
    if (running || destroyed) return;
    running = true;
    last = performance.now(); // drop the time spent asleep
    raf = requestAnimationFrame(animate);
  }

  function frame(dt) {
    /* horizontal: idle spin (slows while the pointer is inside) + parallax + drag */
    const idleSpeed = pointerInside ? 0.04 : 0.16;
    spinAngle += idleSpeed * dt;
    group.rotation.y = spinAngle + dragSpin + spinTarget * 0.4;

    /* vertical: slow auto-drift (paused while pointing) + drag scrub, infinite wrap */
    if (!pointerInside) scrollTarget += 0.35 * dt;
    scrollCurrent += (scrollTarget - scrollCurrent) * Math.min(1, dt * 5);
    for (const m of cards) {
      let y = m.userData.baseY + scrollCurrent;
      y = ((((y + TOWER_H / 2) % TOWER_H) + TOWER_H) % TOWER_H) - TOWER_H / 2;
      if (m === hovered && Math.abs(y - m.position.y) > rowGap * 1.5) {
        hovered = null;
        labelEl.classList.remove("is-on");
      }
      m.position.y = y;
    }

    /* hover pick */
    if (pointerInside && !dragging) {
      const top = pick();
      if (top !== hovered) {
        hovered = top;
        if (hovered) {
          labCat.textContent = hovered.userData.funnel.tag;
          labTitle.textContent = hovered.userData.funnel.label;
          labelEl.classList.add("is-on");
          canvas.style.cursor = "pointer";
        } else {
          labelEl.classList.remove("is-on");
          canvas.style.cursor = "grab";
        }
      }
    }

    const anyHover = !!hovered;
    for (const m of cards) {
      const data = m.userData;
      const isHot = m === hovered;
      data.cur += ((isHot ? 1 : 0) - data.cur) * Math.min(1, dt * 10);
      const dimTarget = !anyHover || isHot ? 1 : 0.4;
      data.dim += (dimTarget - data.dim) * Math.min(1, dt * 8);
      const pop = 1 + data.cur * 0.06;
      const worldY = tilt.position.y + m.position.y;
      /* SPIRAL: twist each card's angle by its height so the drum reads as a
         helix. Computed from worldY (not the row index) so it stays consistent
         as cards scroll-wrap through the band. */
      m.rotation.y = data.baseAngle + worldY * 0.05;
      /* cone taper: top ring widest, lower rows narrower */
      const coneN = Math.min(1, Math.max(0, (worldY + VIS + FADE) / (2 * (VIS + FADE))));
      const taper = 0.6 + 0.5 * coneN;
      m.scale.set(taper * pop, pop, taper * pop);
      const op = Math.min(1, Math.max(0, (VIS + FADE - Math.abs(worldY)) / FADE));
      const mat = m.material;
      mat.opacity = op;
      m.visible = op > 0.01;
      mat.color.setScalar(mat.userData.base * data.dim);
    }

    renderer.render(scene, camera);
  }

  function animate() {
    if (document.hidden || !onScreen || dialogOpen || destroyed) {
      running = false; // sleep: stop scheduling until kicked
      return;
    }
    raf = requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    frame(dt);
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    sharedGeo.dispose();
    roundTex.dispose();
    mats.forEach((m) => m.dispose());
    texCache.forEach((t) => t.dispose());
    renderer.dispose();
    wrap.replaceChildren();
    delete wrap.dataset.state;
    if (fallback) fallback.hidden = false;
  }

  /* Reveal only once there is something to show. Until then the static
     screenshots stay and the container takes no space. */
  let revealed = false;
  function reveal() {
    if (revealed || destroyed) return;
    if (failures >= texCache.size) { destroy(); return; }
    revealed = true;
    wrap.dataset.state = "ready";
    if (fallback) fallback.hidden = true;
    resize();
    frame(0);
    kick();
  }
  manager.onLoad = reveal;
  /* A texture that never settles should not hold the drum back for ever. */
  setTimeout(() => { if (failures < texCache.size) reveal(); }, 6000);

  canvas.style.cursor = "grab";
  return { destroy };
}

function init() {
  const mounts = document.querySelectorAll("[data-barrel]");
  if (!mounts.length || !webglAvailable()) return;
  const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.documentElement;
  /* The OS setting, or the site's own accessibility menu (js/access.js). */
  const reduced = () => rm.matches || root.dataset.motion === "reduce";
  const live = new Map();
  const near = new Set();

  async function start() {
    if (reduced() || !near.size) return;
    if (!THREE) {
      try { THREE = await import(THREE_URL); } catch (e) { return; }
    }
    if (reduced()) return;
    near.forEach((m) => {
      if (live.has(m)) return;
      const inst = mount(m, allWork);
      if (inst) live.set(m, inst);
    });
  }
  function stop() {
    live.forEach((inst) => inst.destroy());
    live.clear();
  }

  /* Watch the card, not the mount: the mount is display:none until the drum
     is ready, and an observer never reports a hidden box as intersecting. */
  const watched = new Map();
  mounts.forEach((m) => watched.set(m.closest(".proj") || m.parentElement, m));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      near.add(watched.get(e.target));
      io.unobserve(e.target);
    });
    start();
  }, { rootMargin: "600px 0px" });
  watched.forEach((_, card) => io.observe(card));

  /* A drum that spins on its own is the kind of motion reduced-motion asks us
     to drop, so the setting swaps back to the still screenshots, live. */
  const onChange = () => (reduced() ? stop() : start());
  if (rm.addEventListener) rm.addEventListener("change", onChange);
  else if (rm.addListener) rm.addListener(onChange);
  new MutationObserver(onChange).observe(root, { attributes: true, attributeFilter: ["data-motion"] });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
