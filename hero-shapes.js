// Hero background: a living constellation of drifting nodes and connecting
// lines, in brand teal/navy/blue, with an occasional pulse traveling along a
// connection and gentle mouse parallax. Spans the whole hero as a genuine
// background — brightness fades continuously near the copy (measured from
// the real rendered text boxes) so it never fights legibility, instead of
// being cut off in a hard box. Vanilla canvas, no framework needed.
(function () {
  "use strict";

  var COLORS = ["#4BECD7", "#375586", "#06c"];
  var FEATHER = 120; // px over which brightness ramps from 0 to full near text
  var MIN_ALPHA = 0.05; // never fully vanish behind copy — keeps it "whole hero"
  var LINK_DIST_RATIO = 0.15;
  var LINK_DIST_MIN = 90;
  var LINK_DIST_MAX = 170;
  var PARTICLE_AREA = 15000; // one particle per this many px² of hero
  var PARTICLE_MIN = 26;
  var PARTICLE_MAX = 70;
  var DRIFT_SPEED = 0.10; // px/frame at 60fps baseline
  var PARALLAX_MAX = 16; // px of camera shift toward the cursor
  var PULSE_EVERY_MS = [1400, 3200]; // random interval between pulses
  var PULSE_DURATION_MS = 950;

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function smoothstep(edge0, edge1, x) {
    var t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  // Rectangles (in hero-local coordinates) that the copy occupies. Brightness
  // fades toward 0 as a particle nears one of these, full-strength once it
  // clears FEATHER px past the edge — measured live, not guessed.
  function computeTextBoxes(hero) {
    var heroBox = hero.getBoundingClientRect();
    var metaRow = hero.querySelector(".hero-meta-row");
    var h1 = hero.querySelector("h1");
    var lede = hero.querySelector(".lede");
    var ctaRow = hero.querySelector(".hero-cta-row");
    var stats = hero.querySelector(".hero-stats");
    var visual = hero.querySelector(".hero-visual");

    function toLocal(el) {
      if (!el) return null;
      var b = el.getBoundingClientRect();
      return {
        left: b.left - heroBox.left,
        top: b.top - heroBox.top,
        right: b.right - heroBox.left,
        bottom: b.bottom - heroBox.top,
      };
    }

    var boxes = [];
    // Meta row and stats each span the full row width already; the headline
    // block only spans its own text width, so union it with the lede/CTA.
    [metaRow, stats, visual].forEach(function (el) {
      var b = toLocal(el);
      if (b) boxes.push(b);
    });
    var copyRight = 0;
    [h1, lede].forEach(function (el) {
      var b = toLocal(el);
      if (b) copyRight = Math.max(copyRight, b.right);
    });
    if (ctaRow) {
      for (var i = 0; i < ctaRow.children.length; i++) {
        copyRight = Math.max(copyRight, toLocal(ctaRow.children[i]).right);
      }
    }
    var h1Box = toLocal(h1);
    var ctaBox = toLocal(ctaRow);
    if (h1Box && ctaBox) {
      boxes.push({ left: 0, top: h1Box.top, right: copyRight, bottom: ctaBox.bottom });
    }
    return boxes;
  }

  // 0 = fully dimmed (inside a text box), 1 = full brightness.
  function textFadeAt(x, y, boxes) {
    var minFactor = 1;
    for (var i = 0; i < boxes.length; i++) {
      var b = boxes[i];
      var dx = x < b.left ? b.left - x : x > b.right ? x - b.right : 0;
      var dy = y < b.top ? b.top - y : y > b.bottom ? y - b.bottom : 0;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var factor = smoothstep(0, FEATHER, dist);
      if (factor < minFactor) minFactor = factor;
    }
    return MIN_ALPHA + (1 - MIN_ALPHA) * minFactor;
  }

  function makeParticles(width, height, count) {
    var list = [];
    for (var i = 0; i < count; i++) {
      var angle = rand(0, Math.PI * 2);
      list.push({
        x: rand(0, width),
        y: rand(0, height),
        vx: Math.cos(angle) * DRIFT_SPEED * rand(0.5, 1.5),
        vy: Math.sin(angle) * DRIFT_SPEED * rand(0.5, 1.5),
        r: rand(1.4, 3.2),
        color: COLORS[i % COLORS.length],
      });
    }
    return list;
  }

  function hexToRgb(hex) {
    var v = parseInt(hex.replace("#", ""), 16);
    var r, g, b;
    if (hex.length === 4) {
      r = ((v >> 8) & 0xf) * 17;
      g = ((v >> 4) & 0xf) * 17;
      b = (v & 0xf) * 17;
    } else {
      r = (v >> 16) & 0xff;
      g = (v >> 8) & 0xff;
      b = v & 0xff;
    }
    return r + "," + g + "," + b;
  }

  function init() {
    var container = document.querySelector("[data-hero-shapes]");
    var hero = container && container.closest(".hero");
    if (!container || !hero) return;

    var canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);
    var ctx = canvas.getContext("2d");

    var width = 0,
      height = 0,
      activeHeight = 0,
      dpr = Math.min(window.devicePixelRatio || 1, 2);
    var particles = [];
    var textBoxes = [];
    var linkDist = 120;

    var pointer = { x: null, y: null, targetX: 0, targetY: 0, curX: 0, curY: 0 };
    hero.addEventListener("mousemove", function (e) {
      var box = hero.getBoundingClientRect();
      var nx = (e.clientX - box.left) / box.width - 0.5;
      var ny = (e.clientY - box.top) / box.height - 0.5;
      pointer.targetX = -nx * PARALLAX_MAX * 2;
      pointer.targetY = -ny * PARALLAX_MAX * 2;
    });
    hero.addEventListener("mouseleave", function () {
      pointer.targetX = 0;
      pointer.targetY = 0;
    });

    var pulse = null; // { a, b, start, duration }
    function maybeStartPulse(now) {
      if (reduceMotion) return;
      if (pulse && now - pulse.start < pulse.duration) return;
      var links = [];
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < linkDist) links.push([particles[i], particles[j]]);
        }
      }
      if (!links.length) return;
      var pick = links[Math.floor(Math.random() * links.length)];
      pulse = {
        a: pick[0],
        b: pick[1],
        start: now,
        duration: PULSE_DURATION_MS,
        next: now + rand(PULSE_EVERY_MS[0], PULSE_EVERY_MS[1]),
      };
    }

    function resize() {
      var box = hero.getBoundingClientRect();
      width = box.width;
      height = box.height;
      if (!width || !height) return;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // The hero can be much taller than its visible "open" area once a
      // full-width screenshot sits below the copy — spreading a fixed
      // particle budget across the whole height would waste most of them
      // behind that opaque image. Confine spawning/movement to the region
      // above it, where the constellation is actually seen.
      var visual = hero.querySelector(".hero-visual");
      activeHeight = height;
      if (visual) {
        var visualTop = visual.getBoundingClientRect().top - box.top;
        if (visualTop > 120) activeHeight = visualTop;
      }

      var count = Math.round(
        Math.max(PARTICLE_MIN, Math.min(PARTICLE_MAX, (width * activeHeight) / PARTICLE_AREA))
      );
      particles = makeParticles(width, activeHeight, count);
      linkDist = Math.max(LINK_DIST_MIN, Math.min(LINK_DIST_MAX, Math.min(width, activeHeight) * LINK_DIST_RATIO));
      textBoxes = computeTextBoxes(hero);
    }

    function step(now) {
      if (width && height) {
        pointer.curX += (pointer.targetX - pointer.curX) * 0.08;
        pointer.curY += (pointer.targetY - pointer.curY) * 0.08;

        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(pointer.curX, pointer.curY);

        if (!reduceMotion) {
          particles.forEach(function (p) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < -20) p.x = width + 20;
            if (p.x > width + 20) p.x = -20;
            if (p.y < -20) p.y = activeHeight + 20;
            if (p.y > activeHeight + 20) p.y = -20;
          });
          maybeStartPulse(now);
        }

        // Connections first, underneath the nodes.
        for (var i = 0; i < particles.length; i++) {
          for (var j = i + 1; j < particles.length; j++) {
            var a = particles[i],
              b = particles[j];
            var dx = a.x - b.x,
              dy = a.y - b.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist >= linkDist) continue;
            var proximity = 1 - dist / linkDist;
            var fadeA = textFadeAt(a.x, a.y, textBoxes);
            var fadeB = textFadeAt(b.x, b.y, textBoxes);
            var alpha = proximity * 0.35 * Math.min(fadeA, fadeB);
            if (alpha < 0.01) continue;
            ctx.strokeStyle = "rgba(55,85,134," + alpha.toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Nodes, with a soft glow.
        particles.forEach(function (p) {
          var fade = textFadeAt(p.x, p.y, textBoxes);
          var alpha = 0.55 * fade;
          if (alpha < 0.01) return;
          var rgb = hexToRgb(p.color);
          ctx.beginPath();
          ctx.fillStyle = "rgba(" + rgb + "," + alpha.toFixed(3) + ")";
          ctx.shadowColor = "rgba(" + rgb + "," + (0.5 * fade).toFixed(3) + ")";
          ctx.shadowBlur = 6;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.shadowBlur = 0;

        // A bright pulse traveling along one active connection at a time.
        if (pulse && now - pulse.start < pulse.duration) {
          var t = (now - pulse.start) / pulse.duration;
          var px = pulse.a.x + (pulse.b.x - pulse.a.x) * t;
          var py = pulse.a.y + (pulse.b.y - pulse.a.y) * t;
          var pf = textFadeAt(px, py, textBoxes);
          var pAlpha = Math.sin(t * Math.PI) * pf;
          if (pAlpha > 0.02) {
            ctx.beginPath();
            ctx.fillStyle = "rgba(75,236,215," + pAlpha.toFixed(3) + ")";
            ctx.shadowColor = "rgba(75,236,215," + pAlpha.toFixed(3) + ")";
            ctx.shadowBlur = 10;
            ctx.arc(px, py, 2.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        } else if (pulse && now >= pulse.next) {
          pulse.start = now;
        }

        ctx.restore();
      }

      if (!reduceMotion) requestAnimationFrame(step);
    }

    if (typeof ResizeObserver === "function") {
      var lastWidth = -1;
      var ro = new ResizeObserver(function (entries) {
        var box = entries[0] && entries[0].contentRect;
        if (!box || box.width === 0 || box.width === lastWidth) return;
        lastWidth = box.width;
        resize();
      });
      ro.observe(hero);
    } else {
      window.addEventListener("load", resize);
      var resizeTimer;
      window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 300);
      });
    }

    requestAnimationFrame(step);
    if (reduceMotion) {
      // Draw a couple of extra static frames shortly after layout settles,
      // since resize() (and therefore the first draw) may run async.
      setTimeout(function () { requestAnimationFrame(step); }, 300);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
