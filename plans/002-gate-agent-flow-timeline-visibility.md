# 002 — Gate the hero agent-flow GSAP timeline behind visibility

- **Status**: TODO
- **Commit**: a4fd311
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file, ~15 lines added

## Problem

`initAgentFlowAnimation()` in `scroll-reveal.js:172-224` builds an infinitely-repeating GSAP timeline animating the hero's SVG pulse-dots and core glow:

```js
// scroll-reveal.js:172-176 — current
function initAgentFlowAnimation() {
  var svg = document.getElementById("agent-flow-svg");
  if (!svg) return;

  var tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
```

This timeline is created once at page load (`scroll-reveal.js:328`, `initAgentFlowAnimation();`) and, with `repeat: -1`, runs forever — including once the user has scrolled far past the hero into Services, Selected Work, About, or FAQ, where the SVG is nowhere on screen. Each cycle animates `cx`/`cy`/`opacity` on 7 pulse-dot circles plus `scale`/`opacity` on the core glow, all off-screen and invisible, burning CPU and battery for the entire time the page is open.

This is the identical class of problem this repo already fixed for the hero's canvas background grid in `hero-shapes.js:242-268` (added this session): an `IntersectionObserver` + `visibilitychange` pair that pauses the render loop when the element scrolls out of view or the tab is hidden, and resumes it when it comes back. That fix covers the *canvas* grid; this GSAP timeline animating the *SVG* sits in the exact same hero region and was missed in the same pass.

## Target

```js
// scroll-reveal.js — target, replacing the tl.forEach(...) block's closing brace
// and everything after it, through the end of initAgentFlowAnimation()

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

    // Pause the infinite timeline when the SVG is scrolled out of view or the
    // tab is hidden — otherwise it ticks forever, animating invisible nodes.
    // Mirrors the pause/resume pattern in hero-shapes.js for the canvas grid.
    tl.pause();
    var onScreen = false;
    function syncPlayState() {
      if (onScreen && !document.hidden) {
        tl.play();
      } else {
        tl.pause();
      }
    }
    if (typeof IntersectionObserver === "function") {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        syncPlayState();
      }).observe(svg);
    } else {
      onScreen = true;
      tl.play();
    }
    document.addEventListener("visibilitychange", syncPlayState);
  }
```

Key change: the timeline starts paused (`tl.pause()`) instead of running immediately. An `IntersectionObserver` on the `#agent-flow-svg` element toggles a `onScreen` flag and calls `syncPlayState()`, which plays the timeline when the SVG is both on-screen and the tab is visible, and pauses it otherwise. `tl.play()`/`tl.pause()` resume/suspend GSAP's internal playhead in place — no restart-from-zero, no visual jump when it resumes.

## Repo conventions to follow

- `hero-shapes.js:242-268` (added this session) is the exemplar for this exact pattern — `IntersectionObserver` + `document.addEventListener("visibilitychange", ...)` gating a continuous animation loop. This plan is the GSAP-timeline equivalent of that canvas-rAF fix; reuse its naming style (`onScreen`, checking `document.hidden`) for consistency.
- `scroll-reveal.js` already checks `typeof IntersectionObserver === "function"` nowhere else, but `hero-shapes.js:260` does — follow that same feature-detection guard so the site doesn't break in an environment without `IntersectionObserver` (falls back to always-on, matching current behavior).

## Steps

1. In `scroll-reveal.js`, locate the end of `initAgentFlowAnimation()` — the `outputs.forEach(...)` block (lines 213-223) followed by the function's closing `}` (line 224).
2. Immediately after the `outputs.forEach(...)` block and before the closing `}`, insert the `tl.pause()` call and the `onScreen`/`syncPlayState`/`IntersectionObserver`/`visibilitychange` block shown in Target, observing the `svg` variable already defined at the top of the function (line 173).
3. Do not change anything inside the `outputs.forEach(...)` block or any of the tween definitions above it (lines 172-223) — only append the gating logic after them, inside the same function, before its closing brace.

## Boundaries

- Do NOT touch `hero-shapes.js` — it already has its own correct gating; this plan only adds gating to the SVG timeline in `scroll-reveal.js`.
- Do NOT create a second, separate `IntersectionObserver` for anything else in this file — this plan's observer is scoped to `#agent-flow-svg` only.
- Do NOT change the timeline's internal tweens, durations, or eases (including the `ease: "power1.in"` on line 187 — that's a separate, deliberately-flagged finding; see `plans/006`).
- Do NOT modify `index.html` or `es/index.html` — this is a pure JS fix inside the existing `initAgentFlowAnimation()` function.
- If `initAgentFlowAnimation()`'s structure has changed since commit `a4fd311` (e.g. the `outputs.forEach` block moved or was refactored), STOP and report instead of guessing where to insert the gating code.

## Verification

- **Mechanical**: none (no build step). Open `index.html`, confirm no console errors on load.
- **Feel check**:
  - On page load, the hero SVG animation plays as before (dots travel from input nodes to the core, then out to output nodes, looping continuously).
  - Scroll down until the hero is fully out of view (past Services). Open DevTools Performance panel or just observe CPU usage — the timeline should stop ticking (no more `cx`/`cy` updates on the pulse-dot circles).
  - Scroll back up until the hero SVG re-enters view — the animation resumes smoothly from wherever it paused, without snapping back to the start of its cycle or restarting from dot-position zero.
  - Switch to a different browser tab for a few seconds, then switch back with the hero visible — the animation should have paused while the tab was hidden and resume on return.
- **Done when**: the timeline only advances while `#agent-flow-svg` is both on-screen and the tab is visible, and resumes in-place (not from scratch) whenever either condition is restored.
