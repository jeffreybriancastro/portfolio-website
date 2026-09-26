/* Adapted from portfolio-template by BrewedOps (MIT) — see LICENSE. */

/**
 * Animated contour background behind the hero (ported from HeroCanvasV2.tsx).
 *
 * Technique inspired by the landonorris.com background (by OFF+BRAND):
 *  - Two-layer simplex noise feedback (a slow large-scale layer warps the
 *    UV of the fast contour layer). This is the single biggest reason their
 *    blobs look "smooth" instead of drifting in a uniform current.
 *  - Cursor effect scaled by mouse VELOCITY (uMousePace), not just position.
 *    Quiet on hover, ripples on flick.
 *  - Aspect-corrected UVs so contours stay circular at any window ratio.
 *
 * Differences from the React original, for this site:
 *  - The canvas is transparent and draws only the hairlines; the page's own
 *    --bg shows through, so a theme switch needs no background repaint.
 *  - Line colour is read from the palette (--accent-strong) at runtime and
 *    re-read when data-theme or the system colour scheme changes.
 *  - It covers the main column only (never the sidebar), and fades out and
 *    stops rendering once the hero has scrolled away.
 *  - The perf gate from lib/perf.ts is folded in, simplified to one step:
 *    if the page cannot hold frame with the shader on, the shader goes.
 *
 * Loading policy (from App.tsx): nothing is fetched for reduced motion or
 * touch-first devices; Three.js is imported only after window load plus an
 * idle callback, because the shader is decoration.
 */

const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.183.2/build/three.module.min.js';
const PERF_KEY = 'jc-perf-low';

const root = document.documentElement;
const reducedMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
const touchMQ = window.matchMedia('(pointer: coarse), (hover: none)');
const lightMQ = window.matchMedia('(prefers-color-scheme: light)');

function perfLow() {
  try { return sessionStorage.getItem(PERF_KEY) === '1'; } catch (e) { return false; }
}
function markPerfLow() {
  try { sessionStorage.setItem(PERF_KEY, '1'); } catch (e) { /* private mode */ }
}

/** The OS setting, or the site's own accessibility menu (js/access.js) if it is on the page. */
function motionReduced() {
  if (reducedMQ.matches || root.getAttribute('data-motion') === 'reduce') return true;
  try { return typeof window.jcMotionReduced === 'function' && !!window.jcMotionReduced(); } catch (e) { return false; }
}

function canRun() {
  return !motionReduced() && !touchMQ.matches && !perfLow() && !!document.getElementById('hero');
}

const noiseGLSL = `
  // Simplex 3D noise - Ashima Arts / Stefan Gustavson (MIT), webgl-noise.
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
    vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;
    vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
    return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
`;

const vert = `
  varying vec2 vUv;
  void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }
`;

const frag = `
  uniform float uTime;
  uniform vec2  uMouse;       // [-1, 1]
  uniform float uMousePace;   // [0, ~1] eased mouse velocity
  uniform float uAspect;      // canvas width / height
  uniform vec3  uLine;        // palette line colour (linear 0..1)
  uniform float uAlpha;       // peak line opacity for the current theme
  varying vec2 vUv;
  ${noiseGLSL}

  // Tuning constants, as in the original. SCALE drives how many big sweeping
  // curves cross the canvas (2-4, not dense topographic detail).
  const float SCALE             = 0.72;  // base noise scale - LOWER = larger cells = fewer, sparser blobs
  const float NOISE_DETAIL      = 3.0;   // contour bands per noise cell - LOWER = fewer parallel lines
  const float DISTORT_SCALE     = 0.55;  // size of the slow underlying blobs
  const float DISTORT_INTENSITY = 0.50;  // how much the slow blobs warp the contours
  const float HAIRLINE_PIXELS   = 1.5;   // contour line width in screen pixels (fwidth-driven)
  const float CURSOR_SCALE      = 1.5;   // falloff sharpness around the cursor
  const float CURSOR_INTENSITY  = 0.05;  // how much the cursor drags contour UVs
  const vec2  ANISOTROPY        = vec2(1.0, 1.0);

  void main(){
    vec2 uv = vUv;
    uv.x *= uAspect;

    vec2 mouse = uMouse * 0.5 + 0.5;
    mouse.x *= uAspect;
    float cursor = 1.0 - distance(mouse, uv) * CURSOR_SCALE;
    cursor *= uMousePace;
    cursor = clamp(cursor, 0.0, 1.0);

    // Layer 1: slow, large-scale noise.
    float noiseDistort = 0.5 + snoise(vec3(uv * DISTORT_SCALE, uTime * 0.1)) * 0.5;

    // Layer 2: low-frequency noise whose UV is warped by layer 1 + the cursor.
    vec2 warpedUv = (uv + cursor * CURSOR_INTENSITY + noiseDistort * DISTORT_INTENSITY) * SCALE * ANISOTROPY;
    float n = snoise(vec3(warpedUv, uTime));

    // Multiply by NOISE_DETAIL BEFORE fract() - the topographic-map trick:
    // several parallel contours per noise cell that flow along the gradient.
    float bands = (n * 0.5 + 0.5) * NOISE_DETAIL;

    // Hairline contour lines via fwidth - resolution independent.
    float contour = fract(bands);
    float dist    = abs(contour - 0.5);
    float w       = fwidth(bands) * HAIRLINE_PIXELS * 0.5;
    float line    = 1.0 - smoothstep(0.0, w, dist);

    // Tiny cursor-velocity lift so flicks leave a faint glow.
    float a = line * uAlpha * (1.0 + cursor * 0.6);
    // Premultiplied output: the page ground shows through everywhere else.
    gl_FragColor = vec4(uLine * a, a);
  }
`;

/* ---------- palette ---------- */

const probe = document.createElement('canvas').getContext('2d');
function toRGB(value, fallback) {
  if (!probe || !value) return fallback;
  probe.fillStyle = '#000';
  probe.fillStyle = value.trim();
  const s = probe.fillStyle;
  if (s[0] === '#' && s.length === 7) {
    return [parseInt(s.slice(1, 3), 16) / 255, parseInt(s.slice(3, 5), 16) / 255, parseInt(s.slice(5, 7), 16) / 255];
  }
  const m = s.match(/[\d.]+/g);
  return m && m.length >= 3 ? [m[0] / 255, m[1] / 255, m[2] / 255] : fallback;
}
function luminance([r, g, b]) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** Line colour and strength from the live tokens. Subtle on purpose: text sits on top. */
function readPalette() {
  const cs = getComputedStyle(root);
  const bg = toRGB(cs.getPropertyValue('--bg'), [0.063, 0.055, 0.067]);
  const line = toRGB(cs.getPropertyValue('--accent-strong'), [0.8, 0.67, 0.61]);
  const dark = luminance(bg) < 0.5;
  return { line, alpha: dark ? 0.36 : 0.2 };
}

/* ---------- mount ---------- */

async function mount() {
  if (!canRun()) return;

  let THREE;
  try {
    THREE = await import(THREE_URL);
  } catch (e) {
    return; // CDN unreachable: the page keeps its flat ground.
  }
  if (!canRun()) return;

  const host = document.createElement('div');
  host.className = 'hero-canvas';
  host.setAttribute('aria-hidden', 'true');

  let renderer;
  try {
    // antialias off: one fullscreen quad whose only edges are the contour
    // lines, which the shader already smooths with fwidth().
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' });
  } catch (e) {
    return; // No WebGL.
  }
  renderer.setClearColor(0x000000, 0);
  // Kept at 1:1 like the original: on HiDPI a higher ratio shades 2-4x the
  // fragments every frame. If it ever costs scroll smoothness, step it DOWN.
  const RENDER_SCALE = 1.0;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, RENDER_SCALE));
  host.appendChild(renderer.domElement);
  document.body.appendChild(host);

  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
  cam.position.z = 1;

  let pal = readPalette();
  const lineCur = new THREE.Vector3(...pal.line);
  const lineTgt = new THREE.Vector3(...pal.line);
  let alphaTgt = pal.alpha;

  const mouse = new THREE.Vector2(0, 0);
  const geo = new THREE.PlaneGeometry(2, 2);
  const mat = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: mouse },
      uMousePace: { value: 0 },
      uAspect: { value: 1 },
      uLine: { value: lineCur },
      uAlpha: { value: pal.alpha },
    },
  });
  scene.add(new THREE.Mesh(geo, mat));

  /* size follows the host box (main column x viewport height) */
  let rect = host.getBoundingClientRect();
  const resize = () => {
    rect = host.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    renderer.setSize(w, h);
    mat.uniforms.uAspect.value = w / h;
  };
  resize();
  const ro = 'ResizeObserver' in window ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(host);
  else window.addEventListener('resize', resize);

  /* theme: data-theme attribute, or the system scheme when it is absent */
  const onTheme = () => {
    pal = readPalette();
    lineTgt.set(...pal.line);
    alphaTgt = pal.alpha;
    if (!running) { // apply at once when paused so a resume never eases from stale colours
      lineCur.copy(lineTgt);
      mat.uniforms.uAlpha.value = alphaTgt;
    }
  };
  const mo = new MutationObserver(onTheme);
  mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  lightMQ.addEventListener('change', onTheme);

  /* pointer */
  const tgt = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  const onMove = (e) => {
    tgt.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    tgt.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };
  window.addEventListener('mousemove', onMove, { passive: true });

  /* run only while the tab is visible AND the hero is on screen */
  let tabVisible = document.visibilityState !== 'hidden';
  let heroVisible = true;
  let running = false;
  let raf = 0;
  let pauseTimer = 0;

  const update = () => {
    const want = tabVisible && heroVisible;
    host.classList.toggle('is-away', !heroVisible);
    if (want && !running) {
      clearTimeout(pauseTimer);
      running = true;
      lastTs = performance.now();
      raf = requestAnimationFrame(loop);
    } else if (!want && running) {
      // Let the CSS fade finish before the last frame freezes.
      clearTimeout(pauseTimer);
      const stop = () => { running = false; cancelAnimationFrame(raf); };
      if (!tabVisible) stop();
      else pauseTimer = setTimeout(stop, 700);
    }
  };
  const onVisibility = () => { tabVisible = document.visibilityState !== 'hidden'; update(); };
  document.addEventListener('visibilitychange', onVisibility);

  const hero = document.getElementById('hero');
  const io = new IntersectionObserver((entries) => {
    heroVisible = entries[entries.length - 1].isIntersecting;
    update();
  }, { rootMargin: '0px 0px -25% 0px' });
  io.observe(hero);

  /* the loop: ~30fps, delta-time so the pace is refresh-rate independent */
  const FRAME_INTERVAL = 1000 / 30;
  const DRIFT_PER_SECOND = 0.09;
  const FOLLOW_PER_SECOND = 4.0;
  const PACE_PER_SECOND = 8.0;
  const THEME_PER_SECOND = 7.0;
  let time = Math.random() * 40; // a different map each visit
  let lastTs = performance.now();
  let lastCurX = 0, lastCurY = 0, pace = 0;
  let firstFrame = true;

  function loop(now) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    if (!firstFrame && now - lastTs < FRAME_INTERVAL - 1) return;
    const dt = Math.min(0.05, Math.max(0, (now - lastTs) / 1000));
    lastTs = now;

    time += DRIFT_PER_SECOND * dt;

    const followK = 1 - Math.exp(-FOLLOW_PER_SECOND * dt);
    cur.x += (tgt.x - cur.x) * followK;
    cur.y += (tgt.y - cur.y) * followK;
    mouse.set(cur.x, cur.y);

    const dx = (cur.x - lastCurX) / Math.max(dt, 0.001);
    const dy = (cur.y - lastCurY) / Math.max(dt, 0.001);
    const velRaw = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 0.4);
    pace += (velRaw - pace) * (1 - Math.exp(-PACE_PER_SECOND * dt));
    lastCurX = cur.x; lastCurY = cur.y;

    const themeK = 1 - Math.exp(-THEME_PER_SECOND * dt);
    lineCur.lerp(lineTgt, themeK);
    mat.uniforms.uAlpha.value += (alphaTgt - mat.uniforms.uAlpha.value) * themeK;

    mat.uniforms.uTime.value = time;
    mat.uniforms.uMousePace.value = pace;
    renderer.render(scene, cam);

    if (firstFrame) {
      firstFrame = false;
      host.classList.add('is-on');
    }
  }

  /* teardown: reduced motion switched on, context lost, or frame health failed */
  let dead = false;
  function teardown() {
    if (dead) return;
    dead = true;
    running = false;
    cancelAnimationFrame(raf);
    clearTimeout(pauseTimer);
    io.disconnect();
    mo.disconnect();
    if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
    lightMQ.removeEventListener('change', onTheme);
    reducedMQ.removeEventListener('change', onReduced);
    window.removeEventListener('jc-a11ychange', onReduced);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('mousemove', onMove);
    renderer.domElement.removeEventListener('webglcontextlost', teardown);
    geo.dispose();
    mat.dispose();
    renderer.dispose();
    host.remove();
  }
  const onReduced = () => { if (motionReduced()) teardown(); };
  reducedMQ.addEventListener('change', onReduced);
  window.addEventListener('jc-a11ychange', onReduced);
  renderer.domElement.addEventListener('webglcontextlost', teardown);

  update();
  watchFrameHealth(() => running && !dead, () => { markPerfLow(); teardown(); });
}

/* ---------- frame health (simplified lib/perf.ts) ----------
   Median rAF frame time over a window, tab-switch outliers dropped. A median
   over a full window is what gets judged, so one hitch cannot trip it. Only
   windows in which the shader was actually rendering count. */

const BAD_FRAME_MS = 22;   // sustained frame time above this: cannot hold ~45fps
const SAMPLE_MS = 1500;
const MAX_SAMPLE_MS = 5000;
const OUTLIER_MS = 100;
const MIN_SAMPLES = 20;
const MAX_CHECKS = 6;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function measure(active) {
  return new Promise((resolve) => {
    const deltas = [];
    let last = performance.now();
    const end = last + SAMPLE_MS;
    const hardEnd = last + MAX_SAMPLE_MS;
    const tick = (now) => {
      const dt = now - last;
      last = now;
      if (document.visibilityState === 'hidden' || !active()) return resolve(null);
      if (dt < OUTLIER_MS) deltas.push(dt);
      const enough = now >= end && deltas.length >= MIN_SAMPLES;
      if (!enough && now < hardEnd) return void requestAnimationFrame(tick);
      if (deltas.length < MIN_SAMPLES) return resolve(null);
      deltas.sort((a, b) => a - b);
      resolve(deltas[deltas.length >> 1]);
    };
    requestAnimationFrame(tick);
  });
}

async function watchFrameHealth(active, fail) {
  // Wait for the intro overlay to hand the page back, then a beat more.
  while (root.classList.contains('is-intro')) await wait(250);
  await wait(800);
  for (let check = 0; check < MAX_CHECKS; check++) {
    if (!active()) { await wait(1500); continue; }
    const median = await measure(active);
    if (median === null) { await wait(1200); continue; }
    if (median > BAD_FRAME_MS) { fail(); return; }
    await wait(2500);
  }
}

/* ---------- start: after load, at idle ---------- */

function start() {
  if (!canRun()) return;
  const go = () => { mount().catch(() => { /* decoration only */ }); };
  if ('requestIdleCallback' in window) window.requestIdleCallback(go, { timeout: 3000 });
  else setTimeout(go, 1500);
}

if (canRun()) {
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
