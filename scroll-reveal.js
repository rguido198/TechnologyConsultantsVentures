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
    gsap.utils.toArray(".work-grid").forEach(function (card) {
      var media = card.querySelectorAll(".shot img");
      var arrs = card.querySelectorAll(".btn-link .arr");

      var tl = gsap.timeline({ paused: true });
      if (media.length) {
        tl.to(media, {
          scale: 1.03,
          boxShadow: "0 24px 48px -16px rgba(20,30,50,0.16)",
          duration: 0.35,
          ease: "power2.out"
        }, 0);
      }
      if (arrs.length) {
        tl.to(arrs, {
          x: 4,
          duration: 0.25,
          ease: "power2.out"
        }, 0);
      }

      card.addEventListener("mouseenter", function () { tl.play(); });
      card.addEventListener("mouseleave", function () { tl.reverse(); });
    });
  }

  // Spotlight-border glow: sets --mx/--my (percentages) on each card so the
  // ::before radial-gradient mask in components.css can trace the cursor.
  // Paint-only -- no transform/layout touched here. The CSS itself already
  // gates this to (hover: hover) and (pointer: fine), so this JS is inert
  // (harmless extra listeners) on touch devices.
  function initSpotlightCards() {
    gsap.utils.toArray(".service, .ai-cred").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var mx = ((e.clientX - rect.left) / rect.width) * 100;
        var my = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mx", mx + "%");
        card.style.setProperty("--my", my + "%");
      });
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

  // Booking CTA form submission
  function initBookingForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('button[type="submit"]');
      var successMsg = document.getElementById("form-success");
      var errorMsg = document.getElementById("form-error");
      var btnText = submitBtn && submitBtn.querySelector("span");
      var originalBtnText = btnText && btnText.textContent;

      if (errorMsg) errorMsg.style.display = "none";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";
        if (btnText) btnText.textContent = "...";
      }

      fetch(form.action, {
        method: form.method || "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Form submission failed");

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
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
            if (btnText) btnText.textContent = originalBtnText;
          }
          if (errorMsg) {
            errorMsg.style.display = "block";
            gsap.fromTo(errorMsg,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.4, ease: EASE }
            );
          }
        });
    });
  }

  // Hero intro choreography: headline words lead (see applyHeadingAnimations),
  // then meta row, lede, and CTAs cascade in behind it from the same
  // direction. Load-only — no ScrollTrigger needed. The proof band right
  // below the hero reveals on scroll instead (see the grid registrations).
  function initHeroIntro() {
    var els = [".hero-meta-row", ".hero .lede", ".hero-cta-row"]
      .map(function (s) { return document.querySelector(s); })
      .filter(Boolean);
    if (els.length) {
      gsap.from(els, {
        opacity: 0,
        y: 18,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.09,
        delay: 0.25,
        clearProps: "all"
      });
    }
    var visual = document.querySelector(".hero-visual");
    if (visual) {
      gsap.from(visual, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power2.out",
        delay: 0.45,
        clearProps: "all"
      });
    }
  }

  // Initial runs
  applyHeadingAnimations();
  initHeroIntro();
  initCardHovers();
  initSpotlightCards();
  initCountUps();
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

  var proofBand = document.querySelector(".proof-band");
  if (proofBand && proofBand.children.length) {
    reveal(proofBand.children, proofBand, { stagger: 0.06 });
  }

  // Long-form detail pages (service pages, privacy/terms): each heading,
  // paragraph, and list in the article reveals progressively as the reader
  // scrolls to it, rather than bursting in all at once like the homepage's
  // grid cards — more appropriate for a long editorial-style article.
  // ScrollTrigger.batch() coordinates nearby elements into one tween so a
  // fast scroll doesn't fire 15 separate tweens back to back.
  gsap.utils.toArray(".content-block, .legal-content").forEach(function (container) {
    var children = gsap.utils.toArray(container.children);
    if (!children.length) return;
    gsap.set(children, { opacity: 0, y: 20 });
    ScrollTrigger.batch(children, {
      start: "top 88%",
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: DURATION,
          ease: EASE,
          stagger: 0.08,
          overwrite: true
        });
      }
    });
  });

  var sidebarBox = document.querySelector(".sidebar-box");
  if (sidebarBox) reveal(sidebarBox, sidebarBox, { y: 24 });

  // Reading progress bar for long-form article pages. Injected via JS so no
  // markup changes were needed across the six service/privacy pages.
  var article = document.querySelector(".content-block, .legal-content");
  if (article) {
    var progressWrap = document.createElement("div");
    progressWrap.className = "reading-progress";
    progressWrap.setAttribute("aria-hidden", "true");
    var progressBar = document.createElement("div");
    progressBar.className = "reading-progress-bar";
    progressWrap.appendChild(progressBar);
    document.body.appendChild(progressWrap);

    gsap.to(progressBar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: article,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3
      }
    });
  }

  // Fail-safe: reveal-on-scroll relies on a real scroll event to fire
  // ScrollTrigger. Single-pass renderers (crawlers, screenshot/QA tools,
  // link-preview bots) never dispatch one, which would otherwise leave the
  // services grid, portfolio cards, about section, CTA, and long-form
  // article content permanently at opacity:0. Force everything visible
  // after a grace period if it hasn't revealed itself yet, so content is
  // never structurally unreachable.
  setTimeout(function () {
    var selector = ".services-grid > *, .work-grid > *, .about-grid > *, .cta-card, "
      + ".content-block > *, .legal-content > *, .sidebar-box";
    document.querySelectorAll(selector).forEach(function (el) {
      if (parseFloat(window.getComputedStyle(el).opacity) < 1) {
        gsap.killTweensOf(el);
        gsap.set(el, { opacity: 1, y: 0, rotateX: 0, scale: 1, clearProps: "transform" });
      }
    });
  }, 3000);
})();
