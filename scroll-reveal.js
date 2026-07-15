// Subtle reveal-on-scroll for section headers and card grids, via GSAP +
// ScrollTrigger (loaded from CDN in index.html). Each section's heading
// fades/slides in as it enters the viewport, then its cards follow with a
// short stagger — restrained on purpose, not a showcase animation.
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

  // Cards (.service, .case, .how-cell, etc.) declare their own CSS
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

  gsap.utils.toArray(".sec-head").forEach(function (el) {
    reveal(el);
  });

  [
    ".trust-grid",
    ".services-grid",
    ".work-grid",
    ".how-grid",
    ".about-grid",
  ].forEach(function (sel) {
    var grid = document.querySelector(sel);
    if (!grid || !grid.children.length) return;
    reveal(grid.children, grid, { stagger: 0.08 });
  });

  var ctaCard = document.querySelector(".cta-card");
  if (ctaCard) reveal(ctaCard);
})();
