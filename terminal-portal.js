// Scroll-driven "terminal portal": the small nav-bar logo (">_" mark)
// visually grows into a fullscreen terminal window as the user makes their
// first scroll past the hero, plays a two-line boot sequence, then shrinks
// back down and releases into normal scroll. Purely decorative -- the real
// hero content underneath is always present in the DOM and fully visible
// without JS, so nothing here gates content visibility or accessibility.
//
// Only transform/opacity/border-radius/background are animated (never
// width/height) so the fullscreen frame stays GPU-composited throughout.
(function () {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  var portal = document.querySelector(".terminal-portal");
  var frame = document.querySelector(".terminal-portal-frame");
  var hero = document.querySelector(".hero");
  var navMark = document.querySelector(".nav-mark");
  if (!portal || !frame || !hero || !navMark) return;

  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();

  mm.add("(min-width: 901px)", function () {
    var rect = navMark.getBoundingClientRect();
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    gsap.set(frame, {
      transformOrigin: "0 0",
      x: rect.left,
      y: rect.top,
      scaleX: rect.width / vw,
      scaleY: rect.height / vh,
      borderRadius: "7px",
      opacity: 0
    });
    gsap.set(portal, { visibility: "visible" });

    var lines = gsap.utils.toArray(".terminal-portal-line");
    gsap.set(lines, { opacity: 0, y: 8 });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: function () { return "+=" + Math.round(window.innerHeight * 1.6); },
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true
      }
    });

    tl.to(frame, { opacity: 1, duration: 0.08, ease: "none" }, 0)
      .to(frame, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        borderRadius: "0px",
        duration: 0.42,
        ease: "power2.inOut"
      }, 0.04)
      .to(lines, {
        opacity: 1,
        y: 0,
        duration: 0.14,
        stagger: 0.08,
        ease: "power2.out"
      }, 0.4)
      .to(lines, {
        opacity: 0,
        duration: 0.08,
        ease: "none"
      }, 0.66)
      .to(frame, {
        x: function () { return navMark.getBoundingClientRect().left; },
        y: function () { return navMark.getBoundingClientRect().top; },
        scaleX: rect.width / vw,
        scaleY: rect.height / vh,
        borderRadius: "7px",
        duration: 0.34,
        ease: "power2.inOut"
      }, 0.62)
      .to(frame, { opacity: 0, duration: 0.08, ease: "none" }, 0.92);

    return function () {
      gsap.set(portal, { visibility: "hidden" });
    };
  });
})();
