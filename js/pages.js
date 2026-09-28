/* Adapted from portfolio-template by BrewedOps (MIT) — see LICENSE. */
/*
 * The behaviour the React shell carried, on the captured static markup:
 *   theme toggle (lib/theme.ts, Rail, ThemeButton), accessibility menu
 *   (AccessMenu.tsx, lib/a11y.ts), the Contact FAQ (ContactGrid.tsx), the
 *   GoHighLevel embeds and their pending notes (GhlEmbed.tsx, lib/ghl.ts) and
 *   the scroll reveal (hooks/useScrollReveal.ts).
 * Every feature checks its elements exist, so one file serves every page.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var EMAIL = 'jeffreybriancastro@gmail.com';

  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function $all(sel, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(sel));
  }
  function emit(name, detail) {
    var ev;
    try { ev = new CustomEvent(name, { detail: detail }); }
    catch (e) { ev = document.createEvent('CustomEvent'); ev.initCustomEvent(name, false, false, detail); }
    window.dispatchEvent(ev);
  }

  /* ---------------------------------------------------------------- a11y --
     lib/a11y.ts: four switches, each a data-a11y-* attribute on <html>,
     stored as JSON under "kv-a11y". Applied first so the page settles once. */
  var A11Y_KEY = 'kv-a11y';
  var DEFAULT_PREFS = { text: 'md', contrast: false, motion: false, links: false };

  function readPrefs() {
    try {
      var raw = localStorage.getItem(A11Y_KEY);
      if (!raw) return copy(DEFAULT_PREFS);
      var p = JSON.parse(raw) || {};
      return {
        text: p.text === 'lg' || p.text === 'xl' ? p.text : 'md',
        contrast: !!p.contrast,
        motion: !!p.motion,
        links: !!p.links
      };
    } catch (e) {
      return copy(DEFAULT_PREFS);
    }
  }
  function copy(p) {
    return { text: p.text, contrast: p.contrast, motion: p.motion, links: p.links };
  }
  function applyPrefs(p) {
    var d = root.dataset;
    if (p.text === 'md') delete d.a11yText; else d.a11yText = p.text;
    if (p.contrast) d.a11yContrast = 'true'; else delete d.a11yContrast;
    if (p.motion) d.a11yMotion = 'true'; else delete d.a11yMotion;
    if (p.links) d.a11yLinks = 'true'; else delete d.a11yLinks;
  }
  function savePrefs(p) {
    applyPrefs(p);
    try { localStorage.setItem(A11Y_KEY, JSON.stringify(p)); } catch (e) { /* private mode */ }
    emit('a11ychange', p);
  }
  // theme.js should already have done this before first paint; repeating it
  // is harmless and covers a page whose head script is older.
  applyPrefs(readPrefs());

  function initAccessMenu() {
    var wrap = document.querySelector('.a11y[data-widget="a11y"]') || document.querySelector('.a11y');
    if (!wrap) return;
    var panel = wrap.querySelector('.a11y__panel');
    var button = wrap.querySelector('.a11y__button');
    if (!panel || !button) return;
    var closeBtn = wrap.querySelector('.a11y__close');
    var sizeBtns = $all('.a11y__size', wrap);
    var switches = $all('.a11y__switch', wrap);
    var reset = wrap.querySelector('.a11y__reset');
    var SIZES = ['md', 'lg', 'xl'];
    var SWITCH_KEYS = ['contrast', 'motion', 'links'];
    var prefs = readPrefs();
    var open = false;

    function render() {
      sizeBtns.forEach(function (b, i) {
        var on = prefs.text === SIZES[i];
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      switches.forEach(function (b, i) {
        var on = !!prefs[SWITCH_KEYS[i]];
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (reset) {
        reset.disabled = !(prefs.text !== 'md' || prefs.contrast || prefs.motion || prefs.links);
      }
    }
    function update(next) {
      prefs = next;
      savePrefs(prefs);
      render();
    }
    function setOpen(v, returnFocus) {
      open = v;
      wrap.classList.toggle('is-open', v);
      button.setAttribute('aria-expanded', v ? 'true' : 'false');
      if (v) {
        panel.removeAttribute('inert');
        document.addEventListener('keydown', onKey);
        document.addEventListener('pointerdown', onDown, true);
      } else {
        panel.setAttribute('inert', '');
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('pointerdown', onDown, true);
        if (returnFocus) button.focus();
      }
    }
    function onKey(e) {
      if (e.key === 'Escape' || e.key === 'Esc') setOpen(false, true);
    }
    function onDown(e) {
      var t = e.target;
      if (panel.contains(t) || button.contains(t)) return;
      setOpen(false, false);
    }

    button.addEventListener('click', function () { setOpen(!open, false); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false, true); });
    sizeBtns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        var n = copy(prefs); n.text = SIZES[i] || 'md'; update(n);
      });
    });
    switches.forEach(function (b, i) {
      b.addEventListener('click', function () {
        var k = SWITCH_KEYS[i]; if (!k) return;
        var n = copy(prefs); n[k] = !prefs[k]; update(n);
      });
    });
    if (reset) reset.addEventListener('click', function () { update(copy(DEFAULT_PREFS)); });

    // Captured closed; make sure the markup says so, then show saved state.
    setOpen(false, false);
    render();
  }

  /* --------------------------------------------------------------- theme --
     lib/theme.ts: data-theme on <html>, stored under "theme", a circular
     View Transitions sweep out of the button, a `themechange` event. */
  var THEME_KEY = 'theme';

  function getTheme() {
    return root.dataset.theme === 'dark' ? 'dark' : 'light';
  }
  function syncThemeUi() {
    var t = getTheme();
    $all('svg.tg[data-theme]').forEach(function (g) { g.setAttribute('data-theme', t); });
    var label = t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    $all(THEME_BTNS).forEach(function (b) { b.setAttribute('aria-label', label); });
  }
  function applyTheme(t) {
    root.dataset.theme = t;
    try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* private mode */ }
    syncThemeUi();
    emit('themechange', t);
  }
  function setTheme(t, origin) {
    if (!document.startViewTransition || reducedMotion() || getTheme() === t) {
      applyTheme(t);
      return;
    }
    var w = window.innerWidth, h = window.innerHeight;
    var x = origin ? origin.x : w / 2;
    var y = origin ? origin.y : h / 2;
    var r = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
    root.style.setProperty('--sweep-x', x + 'px');
    root.style.setProperty('--sweep-y', y + 'px');
    root.style.setProperty('--sweep-r', r + 'px');
    root.dataset.themeSweep = 'on';
    var vt = document.startViewTransition(function () { applyTheme(t); });
    var done = function () { delete root.dataset.themeSweep; };
    if (vt && vt.finished) vt.finished.then(done, done); else done();
  }
  function toggleTheme(from) {
    var next = getTheme() === 'dark' ? 'light' : 'dark';
    var r = from && from.getBoundingClientRect ? from.getBoundingClientRect() : null;
    setTheme(next, r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined);
  }
  var THEME_BTNS = '.rail__theme, .theme-btn, .nav__theme, [data-theme-toggle]';

  function initTheme() {
    // theme.js set the attribute pre-paint; the glyphs were captured light.
    syncThemeUi();
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest(THEME_BTNS);
      if (!b) return;
      e.preventDefault();
      toggleTheme(b);
    });
    // Another tab switched: follow it.
    window.addEventListener('storage', function (e) {
      if (e.key === THEME_KEY && (e.newValue === 'dark' || e.newValue === 'light') && e.newValue !== getTheme()) {
        root.dataset.theme = e.newValue;
        syncThemeUi();
        emit('themechange', e.newValue);
      }
      if (e.key === A11Y_KEY) applyPrefs(readPrefs());
    });
  }

  /* ----------------------------------------------------------------- FAQ --
     ContactGrid.tsx: one question open at a time. */
  function initFaq() {
    var items = $all('.cgrid__faq');
    if (!items.length) return;
    function set(openItem) {
      items.forEach(function (li) {
        var q = li.querySelector('.cgrid__faq-q');
        var id = q && q.getAttribute('aria-controls');
        var a = (id && document.getElementById(id)) || li.querySelector('.cgrid__faq-a');
        var on = li === openItem;
        li.classList.toggle('is-open', on);
        if (q) q.setAttribute('aria-expanded', on ? 'true' : 'false');
        if (a) a.hidden = !on;
      });
    }
    // Normalise the captured state: whatever is marked open stays open.
    set(items.filter(function (li) { return li.classList.contains('is-open'); })[0] || null);
    items.forEach(function (li) {
      var q = li.querySelector('.cgrid__faq-q');
      if (!q) return;
      q.addEventListener('click', function () {
        set(li.classList.contains('is-open') ? null : li);
      });
    });
  }

  /* ----------------------------------------------------------------- GHL --
     GhlEmbed.tsx + lib/ghl.ts. The pages were captured after form_embed.js
     had run, so each iframe carries its inline hiding and "already set up"
     markers; left in place, the script would skip them and never resize. */
  var GHL_SCRIPT = 'https://go.jeffreybrianbuilds.com/js/form_embed.js';
  var PENDING = {
    form: 'If the form does not load, email me.',
    calendar: 'If the calendar does not load, email me.'
  };

  function initGhl() {
    var frames = $all('iframe[src*="go.jeffreybrianbuilds.com"]');
    if (!frames.length) return;

    frames.forEach(function (frame) {
      ['data-initial-iframe-hidden', 'data-unique-id-mapped', 'data-iframe-resizer-initialized'].forEach(function (a) {
        frame.removeAttribute(a);
      });
      frame.removeAttribute('style');
      if (frame.getAttribute('scrolling') === 'yes') {
        // React rendered the calendar with scrolling="no"; the form had none.
        if (/\/widget\/booking\//.test(frame.src)) frame.setAttribute('scrolling', 'no');
        else frame.removeAttribute('scrolling');
      }

      var box = frame.closest('.ghl-embed');
      if (!box) return;
      var note = box.querySelector('.ghl-pending');
      if (!note) {
        // Captured after the form loaded, so React had already dropped it.
        var kind = box.classList.contains('ghl-embed--calendar') ? 'calendar' : 'form';
        var mail = document.querySelector('a[href^="mailto:"]');
        var email = mail ? mail.getAttribute('href').replace(/^mailto:/, '').split('?')[0] : EMAIL;
        note = document.createElement('p');
        note.className = 'ghl-pending';
        var strong = document.createElement('strong');
        strong.textContent = PENDING[kind];
        var a = document.createElement('a');
        a.href = 'mailto:' + email;
        a.textContent = email;
        note.appendChild(strong);
        note.appendChild(a);
        note.appendChild(document.createTextNode(' reaches me just as fast.'));
        box.insertBefore(note, frame);
      }
      var ready = function () {
        if (note && note.parentNode) note.parentNode.removeChild(note);
        note = null;
      };
      frame.addEventListener('load', ready);
      window.addEventListener('message', function (e) {
        if (e.source && e.source === frame.contentWindow) ready();
      });
    });

    var already = $all('script').some(function (s) { return /form_embed\.js/.test(s.src || ''); });
    if (!already) {
      var s = document.createElement('script');
      s.src = GHL_SCRIPT;
      s.async = true;
      document.body.appendChild(s);
    }
  }

  /* -------------------------------------------------------------- reveal --
     useScrollReveal: [data-reveal] gets .is-revealed once it is on screen. */
  function initReveal() {
    var els = $all('[data-reveal]:not(.is-revealed)');
    if (!els.length) return;
    if (reducedMotion() || root.dataset.a11yMotion === 'true' || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-revealed');
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -80px 0px' });
    els.forEach(function (el) { obs.observe(el); });
  }

  function init() {
    initTheme();
    initAccessMenu();
    initFaq();
    initGhl();
    initReveal();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
