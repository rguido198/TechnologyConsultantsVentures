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
        end: function () { return "+=" + Math.round(window.innerHeight * 1.3); },
        pin: true,
        // Low scrub value: light smoothing without letting the visual lag
        // meaningfully behind real scroll position. The previous 0.6 let a
        // fast, bursty real-world scroll gesture outrun the animation --
        // the page would unpin and reveal content below while the portal
        // was still catching up, leaving a stray box hovering over content
        // it should have already cleared.
        scrub: 0.2,
        invalidateOnRefresh: true
      }
    });

    // Everything below completes by progress 0.8, leaving a 20% buffer
    // before the pin releases at 1.0 -- so even with scrub smoothing and a
    // fast scroll, the portal is fully closed well before normal scroll
    // resumes underneath it.
    tl.to(frame, { opacity: 1, duration: 0.05, ease: "none" }, 0)
      .to(frame, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        borderRadius: "0px",
        duration: 0.33,
        ease: "power2.inOut"
      }, 0.05)
      .to(lines, {
        opacity: 1,
        y: 0,
        duration: 0.1,
        stagger: 0.07,
        ease: "power2.out"
      }, 0.32)
      .to(lines, {
        opacity: 0,
        duration: 0.05,
        ease: "none"
      }, 0.54)
      .to(frame, {
        x: function () { return navMark.getBoundingClientRect().left; },
        y: function () { return navMark.getBoundingClientRect().top; },
        scaleX: rect.width / vw,
        scaleY: rect.height / vh,
        borderRadius: "7px",
        duration: 0.2,
        ease: "power2.inOut"
      }, 0.58)
      .to(frame, { opacity: 0, duration: 0.06, ease: "none" }, 0.74);

    return function () {
      gsap.set(portal, { visibility: "hidden" });
    };
  });
})();
