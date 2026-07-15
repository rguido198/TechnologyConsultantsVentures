// Hero background: An interactive 3D perspective grid wave ("Chaos to Structure")
// built with Vanilla HTML5 Canvas. As the page scrolls, the wave amplitude
// dampens to 0 and the camera tilts, morphing fluid dynamic ripples into a
// rigid, structured grid. Cursor movement deforms the grid locally.
(function () {
  "use strict";

  var COLORS = {
    line: "rgba(55,85,134,", // Navy base
    dot: "rgba(75,236,215,"  // Teal highlight
  };

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
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

    // 3D Grid Parameters
    var cols = 28;
    var rows = 24;
    var spacing = 52;
    var maxAmplitude = 34;
    
    // Camera settings
    var fov = 420;
    var camZ = -440;

    var pointer = { x: null, y: null };
    hero.addEventListener("mousemove", function (e) {
      var box = hero.getBoundingClientRect();
      pointer.x = e.clientX - box.left;
      pointer.y = e.clientY - box.top;
    });
    hero.addEventListener("mouseleave", function () {
      pointer.x = null;
      pointer.y = null;
    });

    function project3D(x, y, z, pitch, yaw, camDist, centerX, centerY) {
      // Yaw rotation (around Y axis)
      var cosY = Math.cos(yaw), sinY = Math.sin(yaw);
      var x1 = x * cosY - z * sinY;
      var z1 = x * sinY + z * cosY;

      // Pitch rotation (around X axis)
      var cosX = Math.cos(pitch), sinX = Math.sin(pitch);
      var y2 = y * cosX - z1 * sinX;
      var z1Rot = y * sinX + z1 * cosX;

      // Perspective projection
      var depth = z1Rot - camDist;
      if (depth <= 0) return null;

      var scale = fov / depth;
      return {
        x: centerX + x1 * scale,
        y: centerY + y2 * scale,
        scale: scale
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

      // Sizing adaptations for smaller devices
      if (width < 600) {
        cols = 16;
        rows = 14;
        spacing = 32;
        maxAmplitude = 20;
        fov = 300;
        camZ = -320;
      } else if (width < 1000) {
        cols = 22;
        rows = 18;
        spacing = 42;
        maxAmplitude = 26;
        fov = 380;
        camZ = -380;
      } else {
        cols = 28;
        rows = 24;
        spacing = 52;
        maxAmplitude = 34;
        fov = 420;
        camZ = -440;
      }

      activeHeight = height;
      var visual = hero.querySelector(".hero-visual");
      if (visual) {
        var visualTop = visual.getBoundingClientRect().top - box.top;
        if (visualTop > 120) activeHeight = visualTop;
      }
    }

    function step(now) {
      if (width && height) {
        ctx.clearRect(0, 0, width, height);

        var currentScrollY = window.scrollY;
        // Limit transitions within the active height bounds of the hero
        var scrollPct = Math.min(currentScrollY / (activeHeight || 600), 1);
        
        // Morph grid parameters by scroll percentage
        var amplitude = maxAmplitude * (1 - scrollPct);
        var pitch = lerp(0.65, 1.25, scrollPct);
        var yaw = lerp(0.20, 0.0, scrollPct);
        var curCamZ = lerp(camZ, camZ - 60, scrollPct);

        var projectedPoints = [];
        var time = now * 0.001; // seconds

        // 1. Calculate and project grid coordinates
        for (var gx = 0; gx < cols; gx++) {
          projectedPoints[gx] = [];
          for (var gy = 0; gy < rows; gy++) {
            // Coordinate relative to center of the grid plane
            var x3d = (gx - (cols - 1) / 2) * spacing;
            var z3d = (gy - (rows - 1) / 2) * spacing;

            var y3d = 0;
            if (!reduceMotion && amplitude > 0.1) {
              // Sine wave combinations
              var waveVal = Math.sin(gx * 0.26 + time * 1.3) * Math.cos(gy * 0.22 + time * 1.1);
              waveVal += Math.sin((gx + gy) * 0.14 - time * 0.8) * 0.28;
              y3d = waveVal * amplitude;
            }

            // Project 3D point to 2D Screen
            var p2d = project3D(x3d, y3d, z3d, pitch, yaw, curCamZ, width / 2, height / 2.3);

            // Apply interactive mouse magnetic force
            if (p2d && pointer.x !== null && pointer.y !== null && !reduceMotion) {
              var dx = p2d.x - pointer.x;
              var dy = p2d.y - pointer.y;
              var dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 160) {
                var force = 1 - dist / 160;
                // Pull vertical coordinate in 3D downwards
                y3d += -45 * force * force * (1 - scrollPct);
                // Re-project
                p2d = project3D(x3d, y3d, z3d, pitch, yaw, curCamZ, width / 2, height / 2.3);
              }
            }

            projectedPoints[gx][gy] = p2d;
          }
        }

        // 2. Draw connections (lines)
        ctx.strokeStyle = COLORS.line + (0.16 * (1 - scrollPct * 0.35)).toFixed(3) + ")";
        ctx.lineWidth = 1.2;

        for (var gx = 0; gx < cols; gx++) {
          for (var gy = 0; gy < rows; gy++) {
            var p = projectedPoints[gx][gy];
            if (!p) continue;

            if (gx < cols - 1) {
              var pRight = projectedPoints[gx + 1][gy];
              if (pRight) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(pRight.x, pRight.y);
                ctx.stroke();
              }
            }
            if (gy < rows - 1) {
              var pBottom = projectedPoints[gx][gy + 1];
              if (pBottom) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(pBottom.x, pBottom.y);
                ctx.stroke();
              }
            }
          }
        }

        // 3. Draw grid nodes (intersection dots)
        for (var gx = 0; gx < cols; gx++) {
          for (var gy = 0; gy < rows; gy++) {
            var p = projectedPoints[gx][gy];
            if (!p) continue;

            // Fade grid edges dynamically to prevent hard borders
            var edgeFactorX = Math.sin((gx / (cols - 1)) * Math.PI);
            var edgeFactorY = Math.sin((gy / (rows - 1)) * Math.PI);
            var vignette = edgeFactorX * edgeFactorY;

            var dotAlpha = 0.65 * vignette * (1 - scrollPct * 0.3);
            if (dotAlpha < 0.01) continue;

            ctx.beginPath();
            ctx.fillStyle = COLORS.dot + dotAlpha.toFixed(3) + ")";
            var r = Math.max(0.8, 1.6 * p.scale);
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      requestAnimationFrame(step);
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

    // Force initial sizing calculations
    resize();
    requestAnimationFrame(step);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
