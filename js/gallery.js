/* ==========================================================================
   Workflow screenshot viewer.

   The thumbnails in the projects index are buttons, not links: there is no
   page to go to, and a control that opens an overlay is a button. Each one
   carries the full image, its intrinsic size, a caption, and the alt text the
   overlay should announce, so this file holds no copy of its own.

   The screenshots are tall — a GoHighLevel flow runs to two thousand pixels —
   so the frame scrolls rather than shrinking the image to fit a viewport
   height. Reading the flow is the point; seeing all of it at once is not.
   ========================================================================== */
(() => {
  "use strict";

  const lb = document.getElementById("lightbox");
  /* Each gallery is its own sequence: stepping off the end of one should wrap
     back to its own first shot, not wander into the next gallery on the page. */
  const galleries = Array.from(document.querySelectorAll("[data-gallery]"))
    .map((g) => Array.from(g.querySelectorAll(".wf-open")))
    .filter((set) => set.length);
  if (!lb || !galleries.length) return;
  let triggers = galleries[0];

  const caption = document.getElementById("lb-caption");
  const count = document.getElementById("lb-count");
  const frame = lb.querySelector(".lb-frame");
  const img = document.createElement("img");
  img.className = "lb-img";
  frame.appendChild(img);
  const dialog = lb.querySelector(".lb-dialog");
  const prevBtn = lb.querySelector(".lb-prev");
  const nextBtn = lb.querySelector(".lb-next");

  let index = 0;
  let opener = null;

  function show(i) {
    index = (i + triggers.length) % triggers.length;
    const t = triggers[index];
    img.src = t.dataset.full;
    img.alt = t.dataset.alt || "";
    img.width = Number(t.dataset.w) || 0;
    img.height = Number(t.dataset.h) || 0;
    caption.textContent = t.dataset.caption || "";
    count.textContent = index + 1 + " / " + triggers.length;
    frame.scrollTop = 0;
  }

  /* `hidden` stays on for semantics; `data-open` drives the transition, set a
     frame later so the browser has a 0-opacity state to animate away from. */
  let exitTimer = null;

  function open(i) {
    clearTimeout(exitTimer);
    opener = document.activeElement;
    show(i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => { lb.dataset.open = "true"; });
    lb.querySelector(".lb-close").focus();
  }

  function close() {
    if (lb.hidden) return;
    lb.dataset.open = "false";
    document.body.style.overflow = "";
    if (opener && document.contains(opener)) opener.focus();
    opener = null;
    /* Hidden only once it has finished leaving, or the exit never renders. */
    clearTimeout(exitTimer);
    exitTimer = setTimeout(() => {
      lb.hidden = true;
      img.removeAttribute("src");
    }, 160);
  }

  galleries.forEach((set) =>
    set.forEach((t, i) =>
      t.addEventListener("click", () => {
        triggers = set;
        open(i);
      })
    )
  );
  prevBtn.addEventListener("click", () => show(index - 1));
  nextBtn.addEventListener("click", () => show(index + 1));
  lb.querySelectorAll("[data-lb-close]").forEach((el) =>
    el.addEventListener("click", close)
  );

  document.addEventListener("keydown", (event) => {
    if (lb.hidden) return;
    if (event.key === "Escape") { close(); return; }
    if (event.key === "ArrowLeft") { show(index - 1); return; }
    if (event.key === "ArrowRight") { show(index + 1); return; }

    /* Focus stays inside the dialog while it is modal. */
    if (event.key !== "Tab") return;
    const focusable = dialog.querySelectorAll("button");
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
