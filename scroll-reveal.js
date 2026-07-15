// Subtle reveal-on-scroll for section headers and card grids, via GSAP +
// ScrollTrigger (loaded from CDN in index.html). Elevated with text reveals,
// responsive timeline pinning, and tech-forward 3D grid entrance effects.
(function () {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  var EASE = "power2.out";
  var DURATION = 0.7;
  var DISTANCE = 24;
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
          scrollTrigger: { trigger: scrollTriggerEl || els[0], start: START },
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
          duration: 0.95,
          ease: "power3.out",
          stagger: 0.025,
          delay: 0.1
        });
      } else {
        // ScrollTrigger for sections
        gsap.to(inners, {
          y: "0%",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.02,
          scrollTrigger: {
            trigger: h,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        });
      }
    });
  }

  // Setup initial layout animations
  applyHeadingAnimations();

  // Re-split and re-run animations when i18n switches languages
  window.addEventListener("i18n-update", function () {
    applyHeadingAnimations();
    ScrollTrigger.refresh();
  });

  // Grid card reveals
  [
    ".trust-grid",
    ".about-grid",
  ].forEach(function (sel) {
    var grid = document.querySelector(sel);
    if (!grid || !grid.children.length) return;
    reveal(grid.children, grid, { stagger: 0.08 });
  });

  [
    ".services-grid",
    ".work-grid",
  ].forEach(function (sel) {
    var grid = document.querySelector(sel);
    if (!grid || !grid.children.length) return;
    reveal(grid.children, grid, {
      stagger: 0.08,
      y: 36,
      rotateX: 4,
      scale: 0.97,
      transformOrigin: "center top",
      ease: "power2.out",
      duration: 0.85
    });
  });

  var ctaCard = document.querySelector(".cta-card");
  if (ctaCard) reveal(ctaCard);

  // How We Work: Pinned sticky timeline for desktop
  var mm = gsap.matchMedia();
  mm.add("(min-width: 901px)", function () {
    // Pin left column
    ScrollTrigger.create({
      trigger: ".how-container",
      start: "top 104px",
      end: "bottom bottom",
      pin: ".how-left",
      pinSpacing: false
    });

    // Animate progress line
    var progressEl = document.querySelector(".how-timeline-progress");
    if (progressEl) {
      gsap.fromTo(progressEl,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: ".how-grid",
            start: "top 30%",
            end: "bottom 70%",
            scrub: true
          }
        }
      );
    }

    // Toggle active state on scroll
    var cells = gsap.utils.toArray(".how-cell");
    if (cells.length) {
      cells[0].classList.add("active");
    }
    
    cells.forEach(function (cell) {
      ScrollTrigger.create({
        trigger: cell,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: function (self) {
          if (self.isActive) {
            cells.forEach(function (c) { c.classList.remove("active"); });
            cell.classList.add("active");
          }
        }
      });
    });

    return function () {
      var cells = gsap.utils.toArray(".how-cell");
      cells.forEach(function (c) { c.classList.remove("active"); });
    };
  });
})();
