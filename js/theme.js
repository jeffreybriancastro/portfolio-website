/* Adapted from portfolio-template by BrewedOps (MIT) — see LICENSE.
   Runs in <head>, before the body paints, so the first frame is already the
   visitor's theme. Light is the default; dark is the opt-in. Same storage key
   as the template ("theme"). */
(function () {
  var t = "light";
  try { if (localStorage.getItem("theme") === "dark") t = "dark"; } catch (e) { /* private mode */ }
  var d = document.documentElement.dataset;
  d.theme = t;
  /* Saved accessibility settings too (js/pages.js owns the menu; same key and
     attributes), so a larger text size or high contrast is there on the
     first frame rather than one frame late. */
  try {
    var a = JSON.parse(localStorage.getItem("kv-a11y") || "null");
    if (a) {
      if (a.text === "lg" || a.text === "xl") d.a11yText = a.text;
      if (a.contrast) d.a11yContrast = "true";
      if (a.motion) d.a11yMotion = "true";
      if (a.links) d.a11yLinks = "true";
    }
  } catch (e) { /* storage unavailable or malformed: defaults */ }
})();
