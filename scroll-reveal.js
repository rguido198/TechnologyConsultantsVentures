// Subtle reveal-on-scroll for section headers and card grids, via GSAP +
// ScrollTrigger (loaded from CDN in index.html). Elevated with text reveals,
// responsive timeline pinning, card hovers, and tech-forward countups.
(function () {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  var EASE = "power2.out";
  var DURATION = 0.55;
  var DISTANCE = 16;
  var START = "top 85%";

  // Cards (.service, .case, etc.) declare their own CSS
  // `transition: transform ...` for hover effects. That transition fights
  // GSAP's rapid inline transform updates during the reveal — the browser
  // keeps trying to "catch up" to a moving target and the element visibly
  // never settles. Suspend each element's transition for the duration of
  // the reveal, then hand it back so hover effects work normally after.
  function reveal(targets, scrollTriggerEl, opts) {
    var els = gsap.utils.toArray(targets);
    if (!els.length) return;
    var prevTransitions = els.map(function (el) {
      return el.style.transition;
    });
    els.forEach(function (el) {
      el.style.transition = "none";
    });
    gsap.from(
      els,
      Object.assign(
        {
          opacity: 0,
          y: DISTANCE,
          duration: DURATION,
          ease: EASE,
          scrollTrigger: { trigger: scrollTriggerEl || els[0], start: START, once: true },
          onComplete: function () {
            els.forEach(function (el, i) {
              el.style.transition = prevTransitions[i];
            });
          },
        },
        opts || {}
      )
    );
  }

  // Split text by word nodes recursively (preserving tags like em, br)
  function prepareTextReveal(el) {
    var nodes = Array.from(el.childNodes);
    el.innerHTML = "";
    nodes.forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        var text = node.textContent;
        var words = text.split(/(\s+)/);
        words.forEach(function (word) {
          if (word.trim() === "") {
            el.appendChild(document.createTextNode(word));
          } else {
            var mask = document.createElement("span");
            mask.className = "word-mask";
            var inner = document.createElement("span");
            inner.className = "word-inner";
            inner.textContent = word;
            mask.appendChild(inner);
            el.appendChild(mask);
          }
        });
      } else if (node.nodeName === "BR") {
        el.appendChild(document.createElement("br"));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        var cloned = node.cloneNode(true);
        prepareTextReveal(cloned);
        el.appendChild(cloned);
      }
    });
  }

  function applyHeadingAnimations() {
    gsap.utils.toArray(".hero h1, .sec-head h2").forEach(function (h) {
      prepareTextReveal(h);
      var inners = h.querySelectorAll(".word-inner");
      if (!inners.length) return;

      gsap.killTweensOf(inners);

      if (h.closest(".hero")) {
        // Immediate load for hero
        gsap.to(inners, {
          y: "0%",
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.02,
          delay: 0.05
        });
      } else {
        // ScrollTrigger for sections
        gsap.to(inners, {
          y: "0%",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.015,
          scrollTrigger: {
            trigger: h,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        });
      }
    });
  }

  // Case study card hovers (screenshot scales 1.03, arrow shifts, shadow lifts)
  function initCardHovers() {
    gsap.utils.toArray(".case").forEach(function (card) {
      var media = card.querySelector(".case-placeholder, .browser-mockup");
      var arr = card.querySelector(".btn-link .arr");

      var tl = gsap.timeline({ paused: true });
      if (media) {
        tl.to(media, {
          scale: 1.03,
          boxShadow: "0 24px 48px -16px rgba(20,30,50,0.16)",
          duration: 0.35,
          ease: "power2.out"
        }, 0);
      }
      if (arr) {
        tl.to(arr, {
          x: 4,
          duration: 0.25,
          ease: "power2.out"
        }, 0);
      }

      card.addEventListener("mouseenter", function () { tl.play(); });
      card.addEventListener("mouseleave", function () { tl.reverse(); });
    });
  }

  // Dynamic numerical count-up triggered by ScrollTrigger
  function initCountUps() {
    gsap.utils.toArray(".count-up").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      gsap.killTweensOf(el);
      gsap.fromTo(el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 1.2,
          ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            toggleActions: "play none none none"
          }
        }
      );
    });
  }

  // AI Agent Flow Looping Animation in Hero
  function initAgentFlowAnimation() {
    var svg = document.getElementById("agent-flow-svg");
    if (!svg) return;

    var tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });

    // 1. Pulse dots travel from inputs (left) to Core (center)
    tl.fromTo(["#pulse-in-1", "#pulse-in-2", "#pulse-in-3"],
      { cx: 40, cy: function(i) { return [80, 160, 240][i]; }, opacity: 0 },
      {
        cx: 200,
        cy: 160,
        opacity: 1,
        duration: 1.1,
        stagger: 0.15,
        ease: "power1.in"
      }
    );

    // 2. Trigger core glow expands on arrival
    tl.to(["#pulse-in-1", "#pulse-in-2", "#pulse-in-3"], { opacity: 0, duration: 0.05 }, "-=0.05");
    tl.to("#node-core .core-outer", { scale: 1.3, opacity: 0.3, duration: 0.25, yoyo: true, repeat: 1, transformOrigin: "center center" }, "-=0.05");
    tl.to("#node-core .core-inner", { scale: 1.08, duration: 0.25, yoyo: true, repeat: 1, transformOrigin: "center center" }, "-=0.2");

    // 3. Pulse dots dispatch from Core (center) to outputs (right)
    tl.fromTo(["#pulse-out-1", "#pulse-out-2", "#pulse-out-3", "#pulse-out-4"],
      { cx: 200, cy: 160, opacity: 0 },
      {
        cx: 360,
        cy: function(i) { return [60, 130, 200, 270][i]; },
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: "power2.out"
      },
      "-=0.15"
    );

    // 4. Output nodes expand slightly when hit
    tl.to(["#pulse-out-1", "#pulse-out-2", "#pulse-out-3", "#pulse-out-4"], { opacity: 0, duration: 0.05 }, "-=0.05");
    
    var outputs = ["#node-out-1", "#node-out-2", "#node-out-3", "#node-out-4"];
    outputs.forEach(function (sel, i) {
      tl.to(sel + " circle", {
        scale: 1.08,
        stroke: "#06c",
        duration: 0.18,
        yoyo: true,
        repeat: 1,
        transformOrigin: "center center"
      }, "-=" + (0.4 - i * 0.08));
    });
  }

  // Booking CTA form submission
  function initBookingForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('button[type="submit"]');
      var successMsg = document.getElementById("form-success");

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";
        var btnText = submitBtn.querySelector("span");
        if (btnText) btnText.textContent = "...";
      }

      setTimeout(function () {
        var row = form.querySelector(".form-row");
        var text = form.querySelector("textarea");
        gsap.to([row, text, submitBtn], {
          opacity: 0,
          y: -10,
          duration: 0.35,
          stagger: 0.05,
          onComplete: function () {
            if (row) row.style.display = "none";
            if (text) text.style.display = "none";
            if (submitBtn) submitBtn.style.display = "none";

            successMsg.style.display = "block";
            gsap.fromTo(successMsg,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.4, ease: EASE }
            );
          }
        });
      }, 950);
    });
  }

  // Initial runs
  applyHeadingAnimations();
  initCardHovers();
  initCountUps();
  initAgentFlowAnimation();
  initBookingForm();

  // Re-split, refresh triggers, and update count-ups when language toggles
  window.addEventListener("i18n-update", function () {
    applyHeadingAnimations();
    setTimeout(initCountUps, 50); // slight delay to let DOM render updated HTML
    ScrollTrigger.refresh();
  });

  // Grid card reveals
  [
    ".about-grid",
  ].forEach(function (sel) {
    var grid = document.querySelector(sel);
    if (!grid || !grid.children.length) return;
    reveal(grid.children, grid, { stagger: 0.06 });
  });

  [
    ".services-grid",
    ".work-grid",
  ].forEach(function (sel) {
    var grid = document.querySelector(sel);
    if (!grid || !grid.children.length) return;
    reveal(grid.children, grid, {
      stagger: 0.06,
      y: 16,
      rotateX: 2,
      scale: 0.98,
      transformOrigin: "center top",
      ease: EASE,
      duration: DURATION
    });
  });

  var ctaCard = document.querySelector(".cta-card");
  if (ctaCard) reveal(ctaCard);

  // How We Work: Pinned slide deck scrub for desktop
  var mm = gsap.matchMedia();
  mm.add("(min-width: 901px)", function () {
    // Pin container
    ScrollTrigger.create({
      trigger: ".how-container",
      start: "top 104px",
      end: "+=" + (window.innerHeight * 1.5),
      pin: true,
      scrub: true,
      id: "how-pin"
    });

    var cells = gsap.utils.toArray(".how-cell");
    var progressEl = document.querySelector(".how-timeline-progress");

    if (cells.length) {
      cells[0].classList.add("active");

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".how-container",
          start: "top 104px",
          end: "+=" + (window.innerHeight * 1.5),
          scrub: true
        }
      });

      cells.forEach(function (cell, idx) {
        var targetProgress = ((idx + 1) / cells.length) * 100;

        if (idx > 0) {
          var prevCell = cells[idx - 1];

          // Cross-fade stacked elements
          tl.to(prevCell, {
            autoAlpha: 0,
            scale: 0.94,
            y: -20,
            duration: 0.8,
            ease: "power1.inOut",
            onStart: function () {
              prevCell.classList.remove("active");
              prevCell.style.pointerEvents = "none";
            },
            onReverseComplete: function () {
              prevCell.classList.add("active");
              prevCell.style.pointerEvents = "auto";
            }
          }, idx * 1.5 - 0.8);

          tl.to(cell, {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power1.inOut",
            onStart: function () {
              cell.classList.add("active");
              cell.style.pointerEvents = "auto";
            },
            onReverseComplete: function () {
              cell.classList.remove("active");
              cell.style.pointerEvents = "none";
            }
          }, idx * 1.5 - 0.8);
        }

        if (progressEl) {
          tl.to(progressEl, {
            height: targetProgress + "%",
            duration: 0.7,
            ease: "none"
          }, idx * 1.5 - 0.5);
        }
      });
    }

    return function () {
      var cells = gsap.utils.toArray(".how-cell");
      cells.forEach(function (c) {
        c.classList.remove("active");
        c.style.opacity = "";
        c.style.transform = "";
        c.style.pointerEvents = "";
      });
    };
  });
})();
