(() => {
  "use strict";

  /* Theme toggle. Dark is the authored default; the page otherwise follows the
     system preference, and an explicit choice is remembered. */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "jc-theme";

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") root.setAttribute("data-theme", theme);
    else root.removeAttribute("data-theme");
  }

  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) applyTheme(saved);
  } catch (e) {
    /* storage unavailable, fall back to system preference */
  }

  if (themeToggle) themeToggle.addEventListener("click", () => {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const current = root.getAttribute("data-theme") || (prefersLight ? "light" : "dark");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      /* ignore */
    }
  });

  /* Mobile menu */
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("scrim");
  const menuToggle = document.getElementById("menuToggle");
  const menuClose = document.getElementById("menuClose");

  function setMenu(open) {
    if (sidebar) sidebar.dataset.open = String(open);
    if (scrim) scrim.dataset.open = String(open);
    if (menuToggle) menuToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }

  const openMenu = () => setMenu(true);
  const closeMenu = () => setMenu(false);

  if (menuToggle) menuToggle.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (scrim) scrim.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebar && sidebar.dataset.open === "true") closeMenu();
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("is-active"));
      link.classList.add("is-active");
      closeMenu();
    });
  });

  /* Active nav link on scroll. */
  function spy(ids, linkSelector) {
    if (!("IntersectionObserver" in window)) return;
    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const links = document.querySelectorAll(linkSelector);
    if (!targets.length || !links.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          links.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
          });
        });
      },
      { rootMargin: "-15% 0px -75% 0px" }
    );
    targets.forEach((target) => observer.observe(target));
  }

  spy(["hero", "services", "projects", "about", "testimonials", "contact"], ".nav-link");
})();
