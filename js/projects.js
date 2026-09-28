/* Adapted from portfolio-template by BrewedOps (MIT) — see LICENSE. */
/* https://github.com/brewed-ops/portfolio-template  (c) BrewedOps

   The Projects page, made interactive without a build step. Ported from the
   React branch:
     src/components/ProjectsGrid.tsx   the cards, the phone filter, the dialog
     src/components/ProjectPanels.tsx  what each dialog shows
     src/components/WorkflowSamples.tsx  the workflow strip and its viewer
     src/components/FunnelBarrel.tsx   the WebGL drum (Three.js, lazy)
     src/components/FunnelModal.tsx    the page preview the drum opens
     src/data/funnels.ts, src/data/workflows.ts  copied as written there

   The cards themselves are already in projects.html (rendered from the React
   view). This file only builds the dialogs, which React created on demand.

   Where this differs from the React build, on purpose:
   - Escape closes only the top dialog. In React every open dialog listened on
     document, so Escape in a preview closed the Projects dialog under it too.
   - The scroll lock is counted, so closing a preview does not unlock the page
     while the Projects dialog is still open.
   - Reduced motion (the OS setting or the a11y menu's switch) and a missing
     WebGL both get a still grid of the pages instead of the drum. React kept
     a motionless drum for reduced motion and an empty box without WebGL. */
(function () {
  "use strict";

  var THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.183.2/build/three.module.min.js";
  /* Images resolve against this script's own URL, not the page's: on
     GoHighLevel the page is jeffreybrianbuilds.com but the files live on the
     Cloudflare Worker, so asset("/img/x") would ask GHL for a file it doesn't have. */
  var ASSET_ROOT = (document.currentScript && document.currentScript.src)
    ? new URL("../", document.currentScript.src).href : "/";
  var asset = function (p) { return ASSET_ROOT + p.replace(/^\//, ""); };
  /** Below the shell breakpoint: the rail is gone and the app chrome takes over. */
  var PHONE_QUERY = "(max-width: 1099px)";

  /* ---------- Data: src/data/workflows.ts ---------- */

  /**
   * The GoHighLevel build: six published workflows and the pipeline they move
   * records through.
   *
   * Every screenshot here is from Jeffrey's own account. The stage names, the
   * workflow numbers (001-006) and the 359 opportunity count are what the board
   * actually says - they are not illustrative. Contact names are blurred in the
   * pipeline shot; the workflow screens carry no personal data.
   */

  /** The seven workflow screens, in the order the build runs. */
  var workflowShots = [
    {
      id: "wf-00-list",
      thumb: asset("/img/wf-00-list-thumb.webp"),
      full: asset("/img/wf-00-list.webp"),
      label: "All six, in GoHighLevel",
      alt: "The GoHighLevel workflows list: six workflows, 001 New Enquiry Intake through 006 Closed Lost, every one published.",
    },
    {
      id: "wf-01-enquiry",
      thumb: asset("/img/wf-01-enquiry-thumb.webp"),
      full: asset("/img/wf-01-enquiry.webp"),
      label: "New enquiry intake",
      num: "001",
      alt: "The 001 workflow: a Messenger reply or form submission tags the contact, finds or creates the opportunity, assigns an owner, then checks an hour later whether a booking happened.",
    },
    {
      id: "wf-02-booked",
      thumb: asset("/img/wf-02-booked-thumb.webp"),
      full: asset("/img/wf-02-booked.webp"),
      label: "Appointment booked",
      num: "002",
      alt: "The 002 workflow: a booking fires a confirmation email, then a reminder, then a final reminder.",
    },
    {
      id: "wf-03-attended",
      thumb: asset("/img/wf-03-attended-thumb.webp"),
      full: asset("/img/wf-03-attended.webp"),
      label: "Attended",
      num: "003",
      alt: "The 003 workflow: an attended appointment notifies the team, sends a thank-you, and moves the deal to Closed / Repeat.",
    },
    {
      id: "wf-04-noshow",
      thumb: asset("/img/wf-04-noshow-thumb.webp"),
      full: asset("/img/wf-04-noshow.webp"),
      label: "No show",
      num: "004",
      alt: "The 004 workflow: a no-show email, then two rebooking checks, then the deal moves to Closed Lost.",
    },
    {
      id: "wf-05-repeat",
      thumb: asset("/img/wf-05-repeat-thumb.webp"),
      full: asset("/img/wf-05-repeat.webp"),
      label: "Closed / repeat",
      num: "005",
      alt: "The 005 workflow: the contact is tagged a repeat client and gets a promo email seven days later.",
    },
    {
      id: "wf-06-lost",
      thumb: asset("/img/wf-06-lost-thumb.webp"),
      full: asset("/img/wf-06-lost.webp"),
      label: "Closed lost",
      num: "006",
      alt: "The 006 workflow: the no-show tag is removed and three re-engagement emails go out over two months.",
    },
  ];

  /** The pipeline board itself. */
  var pipelineShot = {
    id: "crm-pipeline",
    thumb: asset("/img/crm-pipeline-thumb.webp"),
    full: asset("/img/crm-pipeline.webp"),
    label: "The live board, names blurred",
    alt: "The GoHighLevel opportunities board for the booking pipeline: six stages from 001 New Inquiry to 006 Closed Lost, 359 opportunities in total, every card a real record with the contact name blurred.",
  };

  /** What each workflow does, in plain words. */
  var buildSteps = [
    {
      num: "001",
      name: "New enquiry intake",
      desc: "A Messenger reply or a form submission tags the contact, finds or creates the opportunity, assigns an owner and notifies the team. An hour later it checks whether a booking happened and flags the ones that did not.",
    },
    {
      num: "002",
      name: "Appointment booked",
      desc: "Confirmation email the moment the slot is taken, a reminder an hour later, and a final one after that.",
    },
    {
      num: "003",
      name: "Attended",
      desc: "The team gets the notification, the client gets a thank-you, and the deal moves itself to Closed / Repeat.",
    },
    {
      num: "004",
      name: "No show",
      desc: "A no-show email goes out, then the workflow checks for a rebooking after an hour and again two days later. Two days after that with still no booking, a last email goes out and the deal moves to Closed Lost.",
    },
    {
      num: "005",
      name: "Closed / repeat",
      desc: "Tagged as a repeat client, then a promo email seven days later.",
    },
    {
      num: "006",
      name: "Closed lost",
      desc: "The no-show tag comes off and three re-engagement emails go out at two weeks, then twenty days later, then thirty after that.",
    },
  ];

  /** The six stages a record passes through on the board. */
  var pipelineStages = [
    "001 New Inquiry",
    "002 Appointment Booked",
    "003 Attended",
    "004 No Show",
    "005 Closed / Repeat Client",
    "006 Closed Lost",
  ];

  /* ---------- Data: src/data/funnels.ts ---------- */

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

  var SUSHI = "https://thesushiboxcdo.com/the-sushi-box-cdo";

  var sushiBox = [
    {
      id: "sushi-01-home",
      label: "The Sushi Box CDO",
      tag: "Website",
      desc: "A maki shop in Cagayan de Oro. The homepage carries the menu bento, Book Now and Message to Order in the header, and the opening hours strip.",
      thumb: asset("/img/sushi-01-home-thumb.webp"),
      full: asset("/img/sushi-01-home.webp"),
      w: 1600,
      h: 835,
      href: SUSHI,
    },
    {
      id: "sushi-02-reviews",
      label: "Delivery-app reviews",
      tag: "Website",
      desc: "Their real Grab, Foodpanda and Facebook reviews pulled onto the page as a nine-card wall, each one carrying the customer name and the app it came from.",
      thumb: asset("/img/sushi-02-reviews-thumb.webp"),
      full: asset("/img/sushi-02-reviews.webp"),
      w: 1600,
      h: 833,
      href: SUSHI,
    },
    {
      id: "sushi-03-catering",
      label: "The Sushi Corner",
      tag: "Website",
      desc: "The catering section: sushi boat spreads laid out for weddings and parties, shot by the client and set as a gallery.",
      thumb: asset("/img/sushi-03-catering-thumb.webp"),
      full: asset("/img/sushi-03-catering.webp"),
      w: 1600,
      h: 770,
      href: SUSHI,
    },
    {
      id: "sushi-04-booking",
      label: "Pickup booking",
      tag: "Booking",
      desc: "A GoHighLevel calendar taking pickup bookings from inside the site. One-hour slots, Asia/Manila, no third-party booking tool in the middle.",
      thumb: asset("/img/sushi-04-booking-thumb.webp"),
      full: asset("/img/sushi-04-booking.webp"),
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
  var clientSites = [
    {
      id: "work-teameasycrane",
      label: "Team Easy Crane",
      tag: "Funnel",
      desc: "A funnel build shipped and handed over to the client.",
      thumb: asset("/img/work-teameasycrane.webp"),
      full: asset("/img/work-teameasycrane.webp"),
      w: 640,
      h: 360,
    },
    {
      id: "work-findthepulse",
      label: "Find The Pulse",
      tag: "Website",
      desc: "A website build shipped and handed over to the client.",
      thumb: asset("/img/work-findthepulse.webp"),
      full: asset("/img/work-findthepulse.webp"),
      w: 640,
      h: 360,
    },
    {
      id: "work-easycrane",
      label: "Easy Crane",
      tag: "Website",
      desc: "A website build shipped and handed over to the client.",
      thumb: asset("/img/work-easycrane.webp"),
      full: asset("/img/work-easycrane.webp"),
      w: 640,
      h: 360,
    },
  ];

  /** Everything the barrel spins, newest and best-documented first. */
  var allWork = sushiBox.concat(clientSites);

  /* ---------- Helpers ---------- */

  /* Phosphor "X" (bold) and "ArrowUpRight" (bold), as the React build renders them. */
  function iconX(size, hidden) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" fill="currentColor" viewBox="0 0 256 256"' + (hidden ? ' aria-hidden="true"' : "") +
      ' focusable="false"><path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"></path></svg>'
    );
  }
  function iconArrow(size) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true" focusable="false"><path d="M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z"></path></svg>'
    );
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fromHTML(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function reducedMotion() {
    return (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.getAttribute("data-a11y-motion") === "true"
    );
  }

  /* ---------- Dialog stack ----------
     ProjectModal, WorkflowSamples and useFunnelModal each ran their own
     Escape listener and scroll lock. Here they share one stack: Escape and
     the focus trap act on the top dialog only, the page behind is inert while
     any dialog is open, and focus goes back to whatever opened each one. */

  var FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var layers = [];
  var appRoot = document.getElementById("root");

  function focusablesIn(node) {
    return Array.prototype.filter.call(node.querySelectorAll(FOCUSABLE), function (n) {
      return n.tabIndex >= 0 && !n.closest("[inert]") && n.getClientRects().length > 0;
    });
  }

  function canFocus(n) {
    return !!(n && n.isConnected && typeof n.focus === "function" && !n.closest("[inert]") && !n.closest('[aria-hidden="true"]') &&
      (n.matches(FOCUSABLE) || n.tabIndex >= 0) && n.getClientRects().length > 0);
  }

  function onStackKey(e) {
    var top = layers[layers.length - 1];
    if (!top) return;
    if (e.key === "Escape" || e.key === "Esc") {
      e.preventDefault();
      e.stopPropagation();
      closeLayer(top);
      return;
    }
    if (e.key !== "Tab") return;
    var f = focusablesIn(top.root);
    if (!f.length) {
      e.preventDefault();
      return;
    }
    var first = f[0];
    var last = f[f.length - 1];
    var active = document.activeElement;
    if (!top.root.contains(active)) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    } else if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /**
   * Put a dialog on the stack. `root` is the backdrop element (it carries
   * role="dialog"); a click on it, not on its content, closes it.
   */
  function openLayer(root, opts) {
    var layer = {
      root: root,
      opener: opts.opener || document.activeElement,
      onClose: opts.onClose || null,
      onCover: opts.onCover || null,
      onUncover: opts.onUncover || null,
    };
    var below = layers[layers.length - 1];
    if (below) {
      below.root.inert = true;
      if (below.onCover) below.onCover();
    } else {
      if (appRoot) appRoot.inert = true;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onStackKey, true);
    }
    layers.push(layer);
    document.body.appendChild(root);
    root.addEventListener("click", function (e) {
      if (e.target === e.currentTarget) closeLayer(layer);
    });
    var initial = opts.initialFocus;
    requestAnimationFrame(function () {
      if (initial && layers.indexOf(layer) !== -1) initial.focus();
    });
    return layer;
  }

  function closeLayer(layer) {
    var i = layers.indexOf(layer);
    if (i === -1) return;
    // Anything stacked above it goes first.
    while (layers.length - 1 > i) closeLayer(layers[layers.length - 1]);
    layers.pop();
    if (layer.onClose) layer.onClose();
    layer.root.remove();
    var top = layers[layers.length - 1];
    if (top) {
      top.root.inert = false;
      if (top.onUncover) top.onUncover();
    } else {
      if (appRoot) appRoot.inert = false;
      // Always clear to default - never restore a possibly stale 'hidden'.
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onStackKey, true);
    }
    var back = layer.opener;
    requestAnimationFrame(function () {
      if (canFocus(back)) {
        back.focus({ preventScroll: true });
      } else if (top) {
        var f = focusablesIn(top.root);
        if (f[0]) f[0].focus({ preventScroll: true });
      }
    });
  }

  /* ---------- FunnelModal ----------
     The work preview: a browser-chrome dialog holding the full-size screenshot.

     The template framed a local HTML page here. These builds are either a
     client's live site or a screen inside someone's GoHighLevel account, so
     neither can be served from this origin - the first is not ours to re-host,
     the second is behind a login. So the dialog shows the screenshot, and when
     the build is public the address bar is a real link to it. */
  function openFull(funnel, trigger) {
    var host = funnel.href
      ? funnel.href.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
      : "screenshot";
    // A real link when the build is public, plain text when it is not. An
    // address bar that looks clickable and is not is worse than one that
    // never offered.
    var url = funnel.href
      ? '<a class="funnels__modal-url" href="' + esc(funnel.href) + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="funnels__modal-url-scheme">' + esc(host) + "</span>" +
        '<span class="funnels__modal-url-path">' + esc(funnel.label) + "</span>" + iconArrow(13) + "</a>"
      : '<div class="funnels__modal-url" aria-hidden="true">' +
        '<span class="funnels__modal-url-scheme">' + esc(funnel.tag) + "</span>" +
        '<span class="funnels__modal-url-path">' + esc(funnel.label) + "</span></div>";
    var root = fromHTML(
      '<div class="funnels__modal" role="dialog" aria-modal="true" aria-label="' + esc(funnel.label + " preview") + '">' +
        '<div class="funnels__modal-shell">' +
          '<div class="funnels__modal-bar">' +
            '<div class="funnels__modal-lights" aria-hidden="true">' +
              '<span class="funnels__modal-light funnels__modal-light--red"></span>' +
              '<span class="funnels__modal-light funnels__modal-light--amber"></span>' +
              '<span class="funnels__modal-light funnels__modal-light--green"></span>' +
            "</div>" + url +
            '<div class="funnels__modal-actions">' +
              '<button type="button" class="funnels__modal-close" aria-label="Close preview">' + iconX(18, true) + "</button>" +
            "</div>" +
          "</div>" +
          '<div class="funnels__modal-stage">' +
            '<img class="funnels__modal-img" src="' + esc(funnel.full) + '" width="' + funnel.w + '" height="' + funnel.h +
            '" alt="' + esc(funnel.desc) + '" decoding="async">' +
          "</div>" +
        "</div>" +
      "</div>"
    );
    var closeBtn = root.querySelector(".funnels__modal-close");
    var layer = openLayer(root, { opener: trigger, initialFocus: closeBtn });
    closeBtn.addEventListener("click", function () {
      closeLayer(layer);
    });
  }

  /* ---------- WorkflowSamples ----------
     A horizontally scrolling marquee of the GoHighLevel workflow screens.
     Opening a frame shows the full screenshot in a faux macOS window.

     These are tall: a published GoHighLevel flow runs to two thousand pixels.
     The window therefore scrolls rather than scaling the image down to fit the
     viewport - being able to read the steps is the whole reason to open it.

     Marquee: the list is duplicated so the CSS keyframe can translate -50% and
     land the reset on a seamless seam. The duplicate half is aria-hidden and
     out of the tab order, so each frame is announced once.

     Inside the Projects dialog the template sets the frames to
     pointer-events: none (the strip only drifts), so the viewer is reached by
     keyboard there, as in the React build. */
  function workflowSamples(caption) {
    caption = caption || "Six published workflows in GoHighLevel, and the list they sit in. Open one to read the steps.";
    var shots = workflowShots;
    var frames = shots.concat(shots).map(function (s, i) {
      var clone = i >= shots.length;
      return (
        '<button type="button" class="wfs__frame" data-shot="' + (i % shots.length) + '"' +
        (clone ? ' aria-hidden="true" tabindex="-1"' : ' aria-label="' + esc("Open " + s.label) + '"') + ">" +
        '<span class="wfs__frame-bar" aria-hidden="true">' +
        '<span class="wfs__dot wfs__dot--r"></span><span class="wfs__dot wfs__dot--y"></span><span class="wfs__dot wfs__dot--g"></span>' +
        (s.num ? '<span class="wfs__frame-num">' + esc(s.num) + "</span>" : "") +
        "</span>" +
        '<img class="wfs__img" src="' + esc(s.thumb) + '" alt="' + (clone ? "" : esc(s.alt)) + '" loading="lazy" decoding="async">' +
        "</button>"
      );
    });
    var section = fromHTML(
      '<section class="wfs" id="workflow-samples" aria-labelledby="wfs-heading" data-reveal="true">' +
        '<p class="wfs__caption" id="wfs-heading">' + esc(caption) + "</p>" +
        '<div class="wfs__strip"><div class="wfs__track">' + frames.join("") + "</div></div>" +
      "</section>"
    );
    section.addEventListener("click", function (e) {
      var btn = e.target.closest(".wfs__frame");
      if (btn) openShot(shots[Number(btn.getAttribute("data-shot"))], btn);
    });
    return section;
  }

  function openShot(s, trigger) {
    var root = fromHTML(
      '<div class="wfs__modal" role="dialog" aria-modal="true" aria-label="' + esc(s.label) + '">' +
        '<div class="wfs__window">' +
          '<div class="wfs__bar">' +
            '<span class="wfs__bar-dots" aria-hidden="true">' +
              '<span class="wfs__dot wfs__dot--r"></span><span class="wfs__dot wfs__dot--y"></span><span class="wfs__dot wfs__dot--g"></span>' +
            "</span>" +
            '<span class="wfs__bar-title">' + (s.num ? "<b>" + esc(s.num) + "</b>" : "") + esc(s.label) + "</span>" +
            '<button type="button" class="wfs__close" aria-label="Close image">' + iconX(18, true) + "</button>" +
          "</div>" +
          '<div class="wfs__imgwrap"><img class="wfs__full" src="' + esc(s.full) + '" alt="' + esc(s.alt) + '"></div>' +
        "</div>" +
      "</div>"
    );
    var closeBtn = root.querySelector(".wfs__close");
    var layer = openLayer(root, { opener: trigger, initialFocus: closeBtn });
    closeBtn.addEventListener("click", function () {
      closeLayer(layer);
    });
  }

  /* ---------- ProjectPanels ----------
     What the Projects dialogs show. Each panel is the work itself, on screen
     the moment the dialog opens - no section chrome to read past and no second
     dialog to click into. */

  /** The six workflow screens, drifting on the backdrop. No window. */
  function automationsPanel() {
    var panel = fromHTML('<div class="ppanel ppanel--strip"></div>');
    panel.appendChild(workflowSamples());
    return { el: panel };
  }

  /** A plain mac window with a scrolling body, for the panels that are pages
   *  rather than frames. */
  function sectionWindow(label, bodyHTML) {
    return (
      '<div class="ppanel ppanel--window">' +
        '<div class="ppanel__bar">' +
          '<span class="ppanel__dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
          '<span class="ppanel__url"><span class="ppanel__url-host">' + esc(label) + "</span></span>" +
        "</div>" +
        '<div class="ppanel__scroll">' + bodyHTML + "</div>" +
      "</div>"
    );
  }

  /**
   * The pipeline the six workflows move records through: the board itself, then
   * the stages, then what each workflow does. The 359 is the board's own count.
   * The stage chips are labels, not controls: the React panel renders them as
   * a static list.
   */
  function pipelinePanel() {
    var stages = pipelineStages
      .map(function (s) {
        var parts = s.split(" ");
        var num = parts.shift();
        return '<li class="wpanel__stage"><span class="wpanel__stage-num">' + esc(num) + "</span><span>" + esc(parts.join(" ")) + "</span></li>";
      })
      .join("");
    var steps = buildSteps
      .map(function (b) {
        return (
          '<li class="wpanel__step"><span class="wpanel__step-num">' + esc(b.num) + "</span>" +
          '<div><h3 class="wpanel__step-name">' + esc(b.name) + '</h3><p class="wpanel__step-desc">' + esc(b.desc) + "</p></div></li>"
        );
      })
      .join("");
    var body =
      '<div class="wpanel">' +
        '<header class="wpanel__head">' +
          '<h2 class="wpanel__title">Six stages, 359 opportunities</h2>' +
          '<p class="wpanel__lede">Every record has an owner and a stage, and the six workflows move it between them. Contact names are blurred; nothing else is touched.</p>' +
        "</header>" +
        '<figure class="wpanel__figure">' +
          '<img src="' + esc(pipelineShot.full) + '" alt="' + esc(pipelineShot.alt) + '" loading="lazy" decoding="async">' +
          "<figcaption>" + esc(pipelineShot.label) + "</figcaption>" +
        "</figure>" +
        '<ol class="wpanel__stages" role="list">' + stages + "</ol>" +
        '<ol class="wpanel__steps" role="list">' + steps + "</ol>" +
      "</div>";
    return { el: fromHTML(sectionWindow("The booking pipeline", body)) };
  }

  /**
   * The one client build that is public end to end: the site is live, the
   * booking calendar inside it is his GoHighLevel, and the client wrote about it
   * afterwards. Four screens, each opening full size.
   */
  function sushiPanel() {
    var shots = sushiBox
      .map(function (f, i) {
        return (
          '<li><button type="button" class="wpanel__shot" data-funnel="' + i + '">' +
          '<img src="' + esc(f.thumb) + '" alt="' + esc(f.desc) + '" loading="lazy" decoding="async">' +
          '<span class="wpanel__shot-label">' + esc(f.label) + "</span></button></li>"
        );
      })
      .join("");
    /* The client's own message, as it arrived. Retyping it and setting it in
       the site's face turns a receipt into copy I wrote; the screenshot is the
       part that cannot be. The full text is in the alt, so it is still there
       for a screen reader. */
    var quoteAlt =
      'A message from The Sushi Box CDO, sent at 4:18 PM: "Jeffrey, thank you for helping bring The Sushi Box CDO’s online presence to life. You took the time to understand what we actually needed and turned our ideas into a website and booking system that feels simple, professional, and useful for our customers. I really appreciate how hands on you were throughout the process, from planning up to launch. We’re very happy with how everything came together."';
    var body =
      '<div class="wpanel">' +
        '<header class="wpanel__head">' +
          '<h2 class="wpanel__title">The Sushi Box CDO</h2>' +
          '<p class="wpanel__lede">A maki shop in Cagayan de Oro, built and handed over: the menu, the catering gallery, their real Grab and Foodpanda reviews on the page, and a GoHighLevel calendar taking pickup bookings from inside the site.</p>' +
          '<a class="wpanel__link" href="https://thesushiboxcdo.com/the-sushi-box-cdo" target="_blank" rel="noopener noreferrer">Open the live site' + iconArrow(14) + "</a>" +
        "</header>" +
        '<ul class="wpanel__shots" role="list">' + shots + "</ul>" +
        '<figure class="wpanel__quote">' +
          '<figcaption class="wpanel__quote-lead">After launch, from the client.</figcaption>' +
          '<img src=asset("/img/testimonial-sushibox.webp") width="952" height="237" loading="lazy" decoding="async" alt="' + esc(quoteAlt) + '">' +
        "</figure>" +
      "</div>";
    var el = fromHTML(sectionWindow("thesushiboxcdo.com", body));
    el.addEventListener("click", function (e) {
      var btn = e.target.closest(".wpanel__shot");
      if (btn) openFull(sushiBox[Number(btn.getAttribute("data-funnel"))], btn);
    });
    return { el: el };
  }

  /**
   * Demo sites he designed and built as templates. Not client work: the
   * businesses, people and numbers in them are fictional, and the panel says
   * so before anything else. Each opens the live demo in a new tab
   * (templates/, served next to the site).
   */
  var templates = [
    {
      slug: "driftwood-orthodontics",
      name: "Driftwood Orthodontics",
      kind: "Orthodontist",
      thumb: asset("/img/tpl-driftwood-thumb.webp"),
      alt: "The Driftwood Orthodontics demo: an orthodontist's home page with the headline \"A smile that makes waves, starting on the Eastern Shore.\"",
    },
    {
      slug: "westmont-family-dental",
      name: "Westmont Family Dental",
      kind: "Dental clinic",
      thumb: asset("/img/tpl-westmont-thumb.webp"),
      alt: "The Westmont Family Dental demo: a family dental clinic's home page with a booking button, an insurance check and a clinic photo.",
    },
    {
      slug: "solana-residences",
      name: "Solana Residences",
      kind: "Condominium launch",
      thumb: asset("/img/tpl-solana-thumb.webp"),
      alt: "The Solana Residences demo: a luxury condominium launch page with a large serif title over a faded living-room photo.",
    },
  ];

  function templatesPanel() {
    var items = templates
      .map(function (t) {
        return (
          '<li><a class="wpanel__shot wpanel__shot--link" href="' + esc(asset("/templates/" + t.slug + ".html")) + '" target="_blank" rel="noopener">' +
          '<img src="' + esc(t.thumb) + '" alt="' + esc(t.alt) + '" loading="lazy" decoding="async">' +
          '<span class="wpanel__shot-label">' + esc(t.name) + " · " + esc(t.kind) + iconArrow(13) + "</span></a></li>"
        );
      })
      .join("");
    var body =
      '<div class="wpanel">' +
        '<header class="wpanel__head">' +
          '<h2 class="wpanel__title">Templates</h2>' +
          '<p class="wpanel__lede">Demo sites I designed and built. The businesses, people and numbers in them are fictional. Open one to click through the live demo.</p>' +
        "</header>" +
        '<ul class="wpanel__shots" role="list">' + items + "</ul>" +
      "</div>";
    return { el: fromHTML(sectionWindow("Templates", body)) };
  }

  /** Only the barrel, spinning on the backdrop. Its own preview still stacks
   *  above it (z 9000). */
  function barrelPanel() {
    var panel = fromHTML('<div class="ppanel ppanel--barrel"></div>');
    var barrel = createBarrel(allWork, openFull);
    panel.appendChild(barrel.el);
    return {
      el: panel,
      onOpen: barrel.start,
      onClose: barrel.destroy,
      onCover: barrel.pause,
      onUncover: barrel.resume,
    };
  }

  /* ---------- FunnelBarrel ----------
     FunnelBarrel - the "dialect barrel gallery" technique.

     A WebGL drum of page-thumbnail cards (a spiral-template port). A
     wide/fat/short cylinder (COLS 16, RAD 11, camera z31) inside a two-group
     tilt stack: the inner group spins, the outer tilt frames the drum. A
     contained fade band crops it to ~2-3 rows so it never eats the page, and a
     cone taper widens the top ring (the tornado/funnel look).

     Adapted for the portfolio: contained in a section (not fullscreen), idle
     auto-spin + slow vertical drift + pointer parallax + drag to explore, and
     clicking a card opens the funnel in the existing modal via onOpen. A
     visually-hidden button list keeps every page keyboard/SR accessible.

     Three.js is fetched the first time the drum is opened, and kept in the
     module cache after that. */
  var threePromise = null;
  function loadThree() {
    if (!threePromise) {
      threePromise = import(THREE_URL).catch(function (err) {
        threePromise = null;
        throw err;
      });
    }
    return threePromise;
  }

  var hasWebGL = null;
  function webglAvailable() {
    if (hasWebGL !== null) return hasWebGL;
    try {
      var c = document.createElement("canvas");
      var ctx = c.getContext("webgl2") || c.getContext("webgl");
      hasWebGL = !!(window.WebGLRenderingContext && ctx);
      // Hand the probe's context straight back; browsers cap live contexts.
      var lose = ctx && ctx.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    } catch (e) {
      hasWebGL = false;
    }
    return hasWebGL;
  }

  function createBarrel(funnels, onOpen) {
    var wrap = fromHTML(
      '<div class="funnels__barrel">' +
        '<div class="funnels__barrel-skeleton" aria-hidden="true"></div>' +
        '<ul class="funnels__barrel-a11y sr-only">' +
          funnels
            .map(function (f, i) {
              return '<li><button type="button" data-funnel="' + i + '">' + esc("Open " + f.label + " (" + f.tag + ")") + "</button></li>";
            })
            .join("") +
        "</ul>" +
      "</div>"
    );
    // Accessible fallback: every page reachable by keyboard / screen reader.
    wrap.querySelector(".funnels__barrel-a11y").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-funnel]");
      if (b) onOpen(funnels[Number(b.getAttribute("data-funnel"))], b);
    });

    var gl = null; // the running drum, once mounted
    var destroyed = false;
    var covered = false;

    /* No WebGL, reduced motion or a failed CDN import: the pages as a still
       grid, each one opening the same preview. */
    function still() {
      if (destroyed || wrap.querySelector(".funnels__still")) return;
      var sk = wrap.querySelector(".funnels__barrel-skeleton");
      if (sk) sk.remove();
      wrap.dataset.still = "true";
      var ul = fromHTML(
        '<ul class="wpanel__shots funnels__still" role="list">' +
          funnels
            .map(function (f, i) {
              return (
                '<li><button type="button" class="wpanel__shot" data-funnel="' + i + '">' +
                '<img src="' + esc(f.thumb) + '" alt="' + esc(f.desc) + '" loading="lazy" decoding="async">' +
                '<span class="wpanel__shot-label">' + esc(f.label) + "</span></button></li>"
              );
            })
            .join("") +
        "</ul>"
      );
      ul.addEventListener("click", function (e) {
        var b = e.target.closest(".wpanel__shot");
        if (b) onOpen(funnels[Number(b.getAttribute("data-funnel"))], b);
      });
      // The still grid is the accessible list now; drop the hidden duplicate.
      var a11y = wrap.querySelector(".funnels__barrel-a11y");
      if (a11y) a11y.remove();
      wrap.appendChild(ul);
    }

    function start() {
      if (reducedMotion() || !webglAvailable()) {
        still();
        return;
      }
      loadThree().then(
        function (THREE) {
          if (destroyed) return;
          gl = mountDrum(THREE, wrap, funnels, onOpen);
          if (!gl) {
            wrap.dataset.failed = "true";
            still();
            return;
          }
          var sk = wrap.querySelector(".funnels__barrel-skeleton");
          if (sk) sk.remove();
          if (covered) gl.pause();
        },
        function () {
          wrap.dataset.failed = "true";
          still();
        }
      );
    }

    return {
      el: wrap,
      start: start,
      pause: function () {
        covered = true;
        if (gl) gl.pause();
      },
      resume: function () {
        covered = false;
        if (gl) gl.resume();
      },
      destroy: function () {
        destroyed = true;
        if (gl) gl.destroy();
        gl = null;
      },
    };
  }

  function mountDrum(THREE, wrap, funnels, onOpen) {
    if (funnels.length === 0) return null;
    var canvas = fromHTML('<canvas class="funnels__barrel-gl" aria-hidden="true"></canvas>');
    var labelEl = fromHTML(
      '<div class="funnels__barrel-label" aria-hidden="true"><span class="funnels__barrel-label-cat"></span><span class="funnels__barrel-label-title"></span></div>'
    );
    var hint = fromHTML('<span class="funnels__barrel-hint" aria-hidden="true">Drag to spin · click a page to open</span>');

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    } catch (e) {
      return null;
    }
    wrap.insertBefore(hint, wrap.firstChild);
    wrap.insertBefore(labelEl, hint);
    wrap.insertBefore(canvas, labelEl);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 4.2, 31); // back + above: wide drum sits low-centre, rim reads as an ellipse
    camera.lookAt(0, 0.5, 0);

    // ---- barrel geometry: wide, fat, short drum ----
    var COLS = 16;
    var ROWS = Math.max(6, Math.ceil(funnels.length / COLS));
    var RAD = 11;
    var anglePer = (Math.PI * 2) / COLS;
    var thetaLen = anglePer * 0.9;
    var arcW = thetaLen * RAD;
    var cardH = arcW * (4 / 3); // 3:4 portrait
    var rowGap = cardH * 1.04;
    var TOWER_H = ROWS * rowGap;

    var loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    var maxAniso = renderer.capabilities.getMaxAnisotropy();
    var texCache = new Map();
    var mats = [];
    function loadTex(url, matIndex) {
      var cached = texCache.get(url);
      if (cached) return cached;
      var t = loader.load(url, undefined, undefined, function () {
        // On failure, drop to a dark flat panel instead of a broken texture.
        var m = mats[matIndex];
        if (m) {
          if (m.map) {
            m.map.dispose();
            m.map = null;
          }
          m.userData.base = 0.22;
          m.needsUpdate = true;
        }
      });
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter; // NPOT thumbnails -> no mipmaps
      t.anisotropy = maxAniso;
      texCache.set(url, t);
      return t;
    }

    // Rounded-corner alpha mask so each card reads as a floating tile, not a
    // hard rectangle (premium polish). MeshBasicMaterial reads alpha from the
    // green channel; white rounded-rect on black -> rounded card.
    function makeRoundedAlpha() {
      var w = 300;
      var h = 400;
      var r = 30;
      var c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      var ctx = c.getContext("2d");
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
      var t = new THREE.CanvasTexture(c);
      t.minFilter = THREE.LinearFilter;
      return t;
    }
    var roundTex = makeRoundedAlpha();

    // one shared geometry centered on +X; each card just gets a rotation.y
    var sharedGeo = new THREE.CylinderGeometry(RAD, RAD, cardH, 24, 1, true, -thetaLen / 2, thetaLen);
    // STACK: inner `group` spins on its own Y axis; outer `tilt` frames the drum.
    var group = new THREE.Group();
    var tilt = new THREE.Group();
    tilt.add(group);
    tilt.rotation.z = -0.04; // barely-there lean
    tilt.rotation.x = 0.16; // tip down so we see the top-rim ellipse
    tilt.position.set(0, -1, 0);
    scene.add(tilt);

    var cards = [];
    var SLOTS = ROWS * COLS;
    var N = funnels.length;
    var gcd = function (a, b) {
      return b ? gcd(b, a % b) : a;
    };
    var stride = Math.max(1, Math.round(N / 3));
    while (N > 1 && gcd(stride, N) !== 1) stride++;
    var order = [];
    for (var k = 0; k < SLOTS; k++) order.push(k < N ? k : (k * stride) % N);

    var counter = 0;
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var funnel = funnels[order[counter]];
        var material = new THREE.MeshBasicMaterial({
          side: THREE.FrontSide,
          transparent: true,
          alphaMap: roundTex,
        });
        material.userData.base = 1;
        mats[counter] = material;
        material.map = loadTex(funnel.thumb, counter);
        var mesh = new THREE.Mesh(sharedGeo, material);
        var baseAngle = c * anglePer + (r % 2 ? anglePer * 0.5 : 0); // brick offset
        mesh.rotation.y = baseAngle;
        mesh.position.y = r * rowGap - TOWER_H / 2 + rowGap / 2;
        mesh.userData = { funnel: funnel, baseY: mesh.position.y, baseAngle: baseAngle, cur: 0, dim: 1 };
        group.add(mesh);
        cards.push(mesh);
        counter++;
      }
    }

    // ---- interaction ----
    var raycaster = new THREE.Raycaster();
    var pointer = new THREE.Vector2(-2, -2);
    var hovered = null;
    var scrollTarget = 0;
    var scrollCurrent = 0;
    var spinTarget = 0;
    var spinAngle = 0;
    var dragSpin = 0;
    var pointerInside = false;

    var labCat = labelEl.querySelector(".funnels__barrel-label-cat");
    var labTitle = labelEl.querySelector(".funnels__barrel-label-title");
    var a11yButtons = wrap.querySelectorAll(".funnels__barrel-a11y button");

    function setPointerFromEvent(e) {
      var rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      labelEl.style.left = e.clientX - rect.left + "px";
      labelEl.style.top = e.clientY - rect.top + "px";
    }
    function pick() {
      raycaster.setFromCamera(pointer, camera);
      var hits = raycaster.intersectObjects(cards, false);
      for (var i = 0; i < hits.length; i++) {
        if (hits[i].object.material.opacity > 0.08) return hits[i].object;
      }
      return null;
    }

    // drag-to-explore
    var dragging = false;
    var downX = 0;
    var downY = 0;
    var lastX = 0;
    var lastY = 0;
    var moved = 0;

    function onPointerMove(e) {
      setPointerFromEvent(e);
      spinTarget = pointer.x * 0.22;
      if (dragging) {
        var dx = e.clientX - lastX;
        var dy = e.clientY - lastY;
        dragSpin += dx * 0.006;
        scrollTarget += dy * 0.01;
        moved += Math.abs(dx) + Math.abs(dy);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    }
    function onPointerEnter() {
      pointerInside = true;
    }
    function onPointerLeave() {
      pointerInside = false;
      pointer.set(-2, -2);
      hovered = null;
      labelEl.classList.remove("is-on");
    }
    function onPointerDown(e) {
      dragging = true;
      downX = lastX = e.clientX;
      downY = lastY = e.clientY;
      moved = 0;
      setPointerFromEvent(e);
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (err) {
        /* no capture */
      }
    }
    function onPointerUp(e) {
      if (!dragging) return;
      var wasTap = moved < 6 && Math.abs(e.clientX - downX) < 6 && Math.abs(e.clientY - downY) < 6;
      dragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (err) {
        /* nothing to release */
      }
      if (wasTap) {
        setPointerFromEvent(e);
        var hit = pick();
        if (hit && hit.userData.funnel) {
          // The canvas is aria-hidden and cannot take focus, so focus comes
          // back to the page's own (visually hidden) button for that funnel.
          var btn = a11yButtons[funnels.indexOf(hit.userData.funnel)] || null;
          onOpen(hit.userData.funnel, btn);
        }
      }
    }
    function onPointerCancel() {
      dragging = false;
    }

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerenter", onPointerEnter);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerCancel);

    function resize() {
      var w = Math.max(1, wrap.clientWidth);
      var h = Math.max(1, wrap.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    var ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    // pause when the section is offscreen, the tab is hidden or another
    // dialog covers it - the loop fully stops (stops scheduling) and is
    // re-kicked when it returns.
    var onScreen = true;
    var covered = false;
    var running = false;
    var io = new IntersectionObserver(
      function (entries) {
        onScreen = entries[0] ? entries[0].isIntersecting : true;
        if (onScreen) kick();
      },
      { threshold: 0.01 }
    );
    io.observe(wrap);
    function onVis() {
      if (!document.hidden && onScreen) kick();
    }
    document.addEventListener("visibilitychange", onVis);

    var clock = new THREE.Clock();
    var raf = 0;
    function kick() {
      if (running || covered) return;
      running = true;
      clock.getDelta(); // do not jump by the time spent asleep
      raf = requestAnimationFrame(animate);
    }
    function animate() {
      if (document.hidden || !onScreen || covered) {
        running = false; // sleep: stop scheduling until kicked
        return;
      }
      raf = requestAnimationFrame(animate);
      var dt = Math.min(clock.getDelta(), 0.05);
      // The a11y menu's "Reduce motion" can be switched on while this runs.
      var reduce = reducedMotion();

      // horizontal: idle spin (slows while the pointer is inside) + parallax + drag
      var idleSpeed = reduce ? 0 : pointerInside ? 0.04 : 0.16;
      spinAngle += idleSpeed * dt;
      group.rotation.y = spinAngle + dragSpin + spinTarget * 0.4;

      // vertical: slow auto-drift (paused while pointing) + drag scrub, infinite wrap
      if (!reduce && !pointerInside) scrollTarget += 0.35 * dt;
      scrollCurrent += (scrollTarget - scrollCurrent) * Math.min(1, dt * 5);
      var i, m;
      for (i = 0; i < cards.length; i++) {
        m = cards[i];
        var y = m.userData.baseY + scrollCurrent;
        y = ((((y + TOWER_H / 2) % TOWER_H) + TOWER_H) % TOWER_H) - TOWER_H / 2;
        if (m === hovered && Math.abs(y - m.position.y) > rowGap * 1.5) {
          hovered = null;
          labelEl.classList.remove("is-on");
        }
        m.position.y = y;
      }

      // hover pick
      if (pointerInside && !dragging) {
        var top = pick();
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

      var anyHover = !!hovered;
      var VIS = rowGap * 0.7;
      var FADE = rowGap * 0.85;
      for (i = 0; i < cards.length; i++) {
        m = cards[i];
        var data = m.userData;
        var isHot = m === hovered;
        data.cur += ((isHot ? 1 : 0) - data.cur) * Math.min(1, dt * 10);
        var dimTarget = !anyHover || isHot ? 1 : 0.4;
        data.dim += (dimTarget - data.dim) * Math.min(1, dt * 8);
        var pop = 1 + data.cur * 0.06;
        var worldY = tilt.position.y + m.position.y;
        // SPIRAL: twist each card's angle by its height so the drum reads as a
        // helix. Computed from worldY (not the row index) so it stays consistent
        // as cards scroll-wrap through the band.
        m.rotation.y = data.baseAngle + worldY * 0.05;
        // cone taper: top ring widest, lower rows narrower
        var coneN = Math.min(1, Math.max(0, (worldY + VIS + FADE) / (2 * (VIS + FADE))));
        var taper = 0.6 + 0.5 * coneN;
        m.scale.set(taper * pop, pop, taper * pop);
        var op = Math.min(1, Math.max(0, (VIS + FADE - Math.abs(worldY)) / FADE));
        var mat = m.material;
        mat.opacity = op;
        m.visible = op > 0.01;
        mat.color.setScalar(mat.userData.base * data.dim);
      }

      renderer.render(scene, camera);
    }
    canvas.style.cursor = "grab";
    kick();

    return {
      pause: function () {
        covered = true;
      },
      resume: function () {
        covered = false;
        kick();
      },
      destroy: function () {
        cancelAnimationFrame(raf);
        running = false;
        ro.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerenter", onPointerEnter);
        canvas.removeEventListener("pointerleave", onPointerLeave);
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointercancel", onPointerCancel);
        sharedGeo.dispose();
        roundTex.dispose();
        mats.forEach(function (mm) {
          mm.dispose();
        });
        texCache.forEach(function (t) {
          t.dispose();
        });
        renderer.dispose();
        // Free the context now: each open of the dialog makes a new one.
        renderer.forceContextLoss();
      },
    };
  }

  /* ---------- ProjectsGrid ----------
     Projects, as one viewport in Home's bento language: a glass panel of
     cards, each previewing its own body of work with a live inner track, each
     opening the work itself in a near-fullscreen dialog.

     The dialog is at z 8000, under the funnel preview (9000) so the barrel's
     own "open this page" dialog can still stack on top of it. */

  var PROJECTS = {
    workflows: { cat: "work", title: "Six workflows, running", Section: automationsPanel },
    pipeline: { cat: "work", title: "The booking pipeline", Section: pipelinePanel },
    sushibox: { cat: "sites", title: "The Sushi Box CDO", Section: sushiPanel },
    templates: { cat: "sites", title: "Templates", Section: templatesPanel },
    funnels: { cat: "sites", title: "Pages and sites", Section: barrelPanel },
  };

  /* A backdrop, a close button in the corner, and the work. No panel, no
     header: each Section brings its own window (or, for the strip, none). */
  function openProject(p, trigger) {
    var section = p.Section();
    var root = fromHTML(
      '<div class="pmodal" role="dialog" aria-modal="true" aria-label="' + esc(p.title) + '">' +
        '<button type="button" class="pmodal__close" aria-label="Close">' + iconX(18, true) + "</button>" +
        '<div class="pmodal__stage"></div>' +
      "</div>"
    );
    root.querySelector(".pmodal__stage").appendChild(section.el);
    var closeBtn = root.querySelector(".pmodal__close");
    var layer = openLayer(root, {
      opener: trigger,
      initialFocus: closeBtn,
      onClose: section.onClose,
      onCover: section.onCover,
      onUncover: section.onUncover,
    });
    closeBtn.addEventListener("click", function () {
      closeLayer(layer);
    });
    if (section.onOpen) section.onOpen();
  }

  function init() {
    var grid = document.querySelector(".bento--projects");
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".bento__card[data-id]"));

    grid.addEventListener("click", function (e) {
      var card = e.target.closest(".bento__card[data-id]");
      if (!card) return;
      var p = PROJECTS[card.getAttribute("data-id")];
      if (p) openProject(p, card);
    });

    /* Phone-only filter. React rendered it, and filtered the cards, only
       below the shell breakpoint; pages.css hides it on desktop, and here the
       filter applies only while the phone query matches. The choice is kept
       across a resize, as React's state was. */
    var FILTER_KEYS = ["all", "work", "sites"];
    var phoneMq = window.matchMedia(PHONE_QUERY);
    var cat = "all";
    var filterBtns = Array.prototype.slice.call(document.querySelectorAll(".pfilter .pfilter__btn"));
    function applyFilter() {
      var phone = phoneMq.matches;
      cards.forEach(function (card) {
        var p = PROJECTS[card.getAttribute("data-id")];
        card.hidden = !!(phone && cat !== "all" && p && p.cat !== cat);
      });
      filterBtns.forEach(function (b, i) {
        b.setAttribute("aria-pressed", String(FILTER_KEYS[i] === cat));
      });
    }
    filterBtns.forEach(function (b, i) {
      b.addEventListener("click", function () {
        cat = FILTER_KEYS[i] || "all";
        applyFilter();
      });
    });
    if (phoneMq.addEventListener) phoneMq.addEventListener("change", applyFilter);
    else if (phoneMq.addListener) phoneMq.addListener(applyFilter);
    applyFilter();

    // The drum is the heaviest thing here: warm the Three.js fetch when the
    // pointer or focus reaches its card, so the dialog opens onto it sooner.
    var funnelsCard = grid.querySelector('.bento__card[data-id="funnels"]');
    if (funnelsCard) {
      var warm = function () {
        if (!reducedMotion() && webglAvailable()) loadThree().catch(function () {});
      };
      funnelsCard.addEventListener("pointerenter", warm, { once: true });
      funnelsCard.addEventListener("focus", warm, { once: true });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
