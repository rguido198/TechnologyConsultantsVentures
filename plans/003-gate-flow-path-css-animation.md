# 003 — Gate the hero SVG's flowLine CSS animation behind visibility

- **Status**: TODO
- **Commit**: a4fd311
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 2 files (~10 lines JS added, 1 line CSS changed)

## Problem

`components.css` defines a continuous, infinite CSS animation on the hero SVG's connector lines:

```css
/* components.css:1338-1339 — current */
@keyframes flowLine {
  to { stroke-dashoffset: -360; }
}
```

```css
/* components.css:1332-1335 — current (approximate location, .flow-path rule) */
.flow-path {
  stroke-dasharray: 6, 6;
  animation: flowLine 20s linear infinite;
}
```

This runs on all 7 `.flow-path` elements inside `#agent-flow-svg` (`path-input-1/2/3`, `path-output-1/2/3/4`) forever, with no visibility gating — identical in spirit to the GSAP timeline problem fixed in `plans/002`, but this one is pure CSS. `stroke-dashoffset` is a paint-triggering SVG property (not compositor-only like `transform`/`opacity`), so the browser's main thread keeps recalculating it every frame for the animation's full 20s cycle, indefinitely, even when the SVG is scrolled far out of view.

## Target

Add a class-based pause switch, toggled by the same visibility signal used in `plans/002`:

```css
/* components.css — target, replacing the .flow-path rule */
.flow-path {
  stroke-dasharray: 6, 6;
  animation: flowLine 20s linear infinite;
  animation-play-state: paused;
}
.hero-visual-in-view .flow-path {
  animation-play-state: running;
}
```

```js
// scroll-reveal.js — target, appended inside the same IntersectionObserver
// callback added in plans/002 (inside initAgentFlowAnimation, after tl setup)
new IntersectionObserver(function (entries) {
  onScreen = entries[0].isIntersecting;
  syncPlayState();
  svg.closest(".hero-visual").classList.toggle("hero-visual-in-view", onScreen);
}).observe(svg);
```

## Repo conventions to follow

- This plan deliberately reuses the exact `IntersectionObserver` instance and `onScreen` flag introduced in `plans/002` rather than creating a second observer on the same element — **execute `plans/002` first**, then layer this change into the same callback.
- Class-toggle-driven CSS state (rather than inline styles) matches the existing pattern in `nav.js`/`components.css` for the mobile nav (`.nav.nav-open .nav-links {...}`, `components.css:192-196`) — toggling a state class and letting CSS own the animation is the established idiom here, not `element.style.animationPlayState = ...` from JS directly.

## Steps

1. **Depends on `plans/002` being applied first** (it introduces the `IntersectionObserver` and `onScreen` variable this plan extends). If `plans/002` has not been executed, STOP and execute it first.
2. In `components.css`, find the `.flow-path` rule (`animation: flowLine 20s linear infinite;`). Add `animation-play-state: paused;` as a new declaration in that rule.
3. Immediately after the `.flow-path` rule, add a new rule: `.hero-visual-in-view .flow-path { animation-play-state: running; }`.
4. In `scroll-reveal.js`, inside the `IntersectionObserver` callback added by `plans/002` (the one observing `svg`), add one line after `syncPlayState();`: `svg.closest(".hero-visual").classList.toggle("hero-visual-in-view", onScreen);`. This toggles the `hero-visual-in-view` class on the `.hero-visual` container (confirm this class exists as the parent wrapping `.agent-flow-container` in `index.html` and `es/index.html` — it does, per the current markup) based on the same `onScreen` state already being tracked.

## Boundaries

- Do NOT modify the `@keyframes flowLine` definition itself, the `stroke-dasharray` value, or the 20s/linear timing — those are unrelated to this fix.
- Do NOT add a second `IntersectionObserver` — this plan must reuse the one from `plans/002`.
- Do NOT touch `hero-shapes.js` or the canvas grid — unrelated element.
- If `.hero-visual` is not the actual parent of `.agent-flow-container` at execution time (markup drift since commit `a4fd311`), STOP and report the correct parent selector instead of guessing.

## Verification

- **Mechanical**: none (no build step). Confirm no console errors on load.
- **Feel check**:
  - On page load, once the hero is visible, the dashed connector lines in the SVG visibly animate (dashes appear to travel along the paths).
  - Scroll the hero out of view, then open DevTools' Rendering panel → "Paint flashing" (or the Performance panel) and confirm no repeated paint activity tied to the SVG paths while it's off-screen.
  - Scroll back up — the dash animation resumes (it's a `linear infinite` loop, so "resume" here just means paint activity restarts; a slight visual jump in dash position on resume is expected and acceptable since `animation-play-state` doesn't preserve exact CSS animation timeline position across a long pause the way a GSAP tween would — note this is fine here since the motion is a decorative ambient loop, not a state-carrying transition).
- **Done when**: the `.flow-path` dash animation only runs while `.hero-visual` has the `hero-visual-in-view` class (i.e., only while the hero SVG is on-screen and the tab is visible).
