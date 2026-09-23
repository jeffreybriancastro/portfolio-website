/* ==========================================================================
   Workflow screenshot viewer.

   The thumbnails in the projects index are buttons, not links: there is no
   page to go to, and a control that opens an overlay is a button. Each one
   carries the full image, its intrinsic size, a caption, and the alt text the
   overlay should announce, so this file holds no copy of its own.

   The screenshots are tall. A GoHighLevel flow runs to two thousand pixels,
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
  /* Without this the browser's own image drag starts on pointerdown and eats
     the gesture before any of the panning below ever runs. */
  img.draggable = false;
  frame.appendChild(img);
  const dialog = lb.querySelector(".lb-dialog");
  const prevBtn = lb.querySelector(".lb-prev");
  const nextBtn = lb.querySelector(".lb-next");
  const zoomLevel = document.getElementById("lb-zoom-level");

  const MIN_ZOOM = 0.4;
  const MAX_ZOOM = 4;
  let zoom = 1;

  /* Zooming around the frame's centre rather than its top-left, so the thing
     being looked at stays where it was. */
  function setZoom(next) {
    const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(next * 100) / 100));
    if (z === zoom) return;
    const cx = (frame.scrollLeft + frame.clientWidth / 2) / Math.max(frame.scrollWidth, 1);
    const cy = (frame.scrollTop + frame.clientHeight / 2) / Math.max(frame.scrollHeight, 1);
    zoom = z;
    img.style.setProperty("--zoom", z);
    zoomLevel.textContent = Math.round(z * 100) + "%";
    /* Reading scrollWidth here flushes the new layout, so the cursor is right
       immediately rather than a frame later. */
    markPannable();
    requestAnimationFrame(() => {
      frame.scrollLeft = cx * frame.scrollWidth - frame.clientWidth / 2;
      frame.scrollTop = cy * frame.scrollHeight - frame.clientHeight / 2;
      markPannable();
    });
  }

  /* The grab cursor is a promise that something will move. Only make it when
     there is somewhere to go. */
  function markPannable() {
    const can = frame.scrollWidth > frame.clientWidth + 1 ||
                frame.scrollHeight > frame.clientHeight + 1;
    frame.dataset.pannable = String(can);
  }

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
    zoom = 1;
    img.style.setProperty("--zoom", 1);
    zoomLevel.textContent = "100%";
    frame.scrollTop = 0;
    frame.scrollLeft = 0;
    img.decode ? img.decode().then(markPannable, markPannable) : markPannable();
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
  lb.querySelector(".lb-zoom-in").addEventListener("click", () => setZoom(zoom * 1.25));
  lb.querySelector(".lb-zoom-out").addEventListener("click", () => setZoom(zoom / 1.25));

  /* Plain wheel scrolls, which is what a tall screenshot wants; ctrl or the
     trackpad pinch zooms, which is what the browser already means by it. */
  frame.addEventListener("wheel", (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    setZoom(zoom * (event.deltaY < 0 ? 1.12 : 1 / 1.12));
  }, { passive: false });

  /* Drag to pan. Scroll position moves opposite the pointer, so the image
     follows the hand. */
  let dragging = null;
  frame.addEventListener("pointerdown", (event) => {
    /* Touch already pans this scroller natively and does it better. */
    if (event.button !== 0 || event.pointerType === "touch") return;
    event.preventDefault();
    dragging = {
      x: event.clientX,
      y: event.clientY,
      left: frame.scrollLeft,
      top: frame.scrollTop,
    };
    frame.dataset.dragging = "true";
    /* Capture is the nicety, not the mechanism: if it fails the drag still
       has to work, so it never sits above the state it guards. */
    try { frame.setPointerCapture(event.pointerId); } catch (e) { /* no capture */ }
  });
  frame.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    event.preventDefault();
    frame.scrollLeft = dragging.left - (event.clientX - dragging.x);
    frame.scrollTop = dragging.top - (event.clientY - dragging.y);
  });
  function endDrag(event) {
    if (!dragging) return;
    dragging = null;
    delete frame.dataset.dragging;
    try {
      if (event && frame.hasPointerCapture(event.pointerId)) {
        frame.releasePointerCapture(event.pointerId);
      }
    } catch (e) { /* nothing to release */ }
  }
  frame.addEventListener("pointerup", endDrag);
  frame.addEventListener("pointercancel", endDrag);
  frame.addEventListener("pointerleave", endDrag);
  frame.addEventListener("dragstart", (event) => event.preventDefault());

  /* Double-click is how every image viewer toggles between fit and close up. */
  frame.addEventListener("dblclick", () => setZoom(zoom > 1.4 ? 1 : 2.5));
  lb.querySelectorAll("[data-lb-close]").forEach((el) =>
    el.addEventListener("click", close)
  );

  document.addEventListener("keydown", (event) => {
    if (lb.hidden) return;
    if (event.key === "Escape") { close(); return; }
    if (event.key === "ArrowLeft") { show(index - 1); return; }
    if (event.key === "ArrowRight") { show(index + 1); return; }
    if (event.key === "+" || event.key === "=") { setZoom(zoom * 1.25); return; }
    if (event.key === "-") { setZoom(zoom / 1.25); return; }
    if (event.key === "0") { setZoom(1); return; }

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
