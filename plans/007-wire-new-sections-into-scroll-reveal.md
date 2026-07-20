# 007 — Wire this session's new sections into the existing scroll-reveal system

- **Status**: TODO
- **Commit**: a4fd311
- **Severity**: LOW-MEDIUM (missed opportunity)
- **Category**: Missed opportunity / cohesion
- **Estimated scope**: 1 file, ~10 lines

## Problem

`scroll-reveal.js:338-362` registers staggered fade-up entrances for the site's card grids:

```js
// scroll-reveal.js:338-362 — current
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
```

Four sections added this same session — the Applied-AI credentials band (`.ai-creds`), the reusable-patterns strip (`.patterns-grid`), the AI value-scenario cards (`.value-grid`), and the Selected Work proof strip (`.proof-strip`) — were never added to either list. `services-grid`, `work-grid`, and `about-grid` get a staggered, tilted fade-up entrance on scroll; these four newer sections just render instantly with no reveal treatment at all. The result is a visible drop in polish partway down the page: Services and Selected Work feel considered and animated, while the sections sitting between and around them (credentials, patterns, value scenarios, proof numbers) feel static by comparison.

## Target

```js
// scroll-reveal.js — target, extending the existing two reveal registrations
[
  ".about-grid",
  ".ai-creds",
  ".value-grid",
  ".patterns-grid",
  ".proof-strip",
].forEach(function (sel) {
  var grid = document.querySelector(sel);
  if (!grid || !grid.children.length) return;
  reveal(grid.children, grid, { stagger: 0.06 });
});
```

All five now share the simpler `.about-grid`-style reveal (plain fade + rise, no tilt) rather than the `.services-grid`/`.work-grid` tilted variant — because `.ai-creds`, `.value-grid`, `.patterns-grid`, and `.proof-strip` are lighter-weight content (credential cards, stat numbers, short pattern descriptions) rather than the heavier service/case cards, the simpler treatment is the better match and requires no new options object.

## Repo conventions to follow

- The `reveal()` helper (`scroll-reveal.js:27-54`) already accepts any element list + a scroll-trigger element + an options object — this plan adds four new selectors to the existing first registration array, it does not introduce a new call pattern.
- Each of the four new sections' direct children are the actual card/item elements to stagger (`.ai-creds > .ai-cred`, `.value-grid > .value-card`, `.patterns-grid > .pattern-item`, `.proof-strip > .proof-item`) — confirmed by their existing HTML structure in `index.html` and `es/index.html`, matching how `.about-grid`'s children are staggered.

## Steps

1. In `scroll-reveal.js`, find the first grid-reveal registration array (currently just `[".about-grid"]`, starting at line 339).
2. Add four more selector strings to that array: `".ai-creds"`, `".value-grid"`, `".patterns-grid"`, `".proof-strip"` — one per line, matching the existing formatting style (one selector string per line, trailing comma).
3. Leave the `.forEach(...)` body and the `reveal(grid.children, grid, { stagger: 0.06 });` call completely unchanged — the new sections use the exact same simple reveal as `.about-grid`.
4. Do not add these selectors to the second registration array (`.services-grid`, `.work-grid`) — that one uses the heavier tilted/scaled treatment intentionally suited to the larger service/case cards, not appropriate for these four.

## Boundaries

- Do NOT change the `reveal()` helper function itself (lines 27-54).
- Do NOT add `.ai-creds`, `.value-grid`, `.patterns-grid`, or `.proof-strip` to the `.services-grid`/`.work-grid` registration — only the `.about-grid`-style one.
- Do NOT touch `index.html` or `es/index.html` — this is a pure JS registration change; both pages share `scroll-reveal.js` so one fix covers both languages.
- If any of these four class names no longer exist in the markup (renamed since commit `a4fd311`), STOP and report rather than guessing a replacement selector.

## Verification

- **Mechanical**: none (no build step). Confirm no console errors on load.
- **Feel check**: reload the page and scroll slowly through Services → AI value scenarios → Selected Work (credentials band + proof strip) → How We Work → About.
  - The AI-credentials cards, the value-scenario cards, the reusable-patterns items, and the proof-strip numbers should each fade up with a staggered entrance as they scroll into view — matching the feel of the About section's existing card reveal (not the tilted Services/Work variant).
  - Confirm the reveal fires once per element (scrolling back up and down again should not re-trigger it — `reveal()`'s underlying `ScrollTrigger` config already sets `once: true`, so this should hold automatically).
  - Confirm the count-up numbers in the proof strip (`.proof-item .count-up`) still animate correctly alongside the new fade-up — the two systems (`reveal()` here and `initCountUps()` elsewhere in the file) both scroll-trigger independently on the same elements and should not conflict.
- **Done when**: all four newly-registered sections fade up on scroll with the same stagger treatment as `.about-grid`, and nothing about `.services-grid`/`.work-grid`'s existing reveal changed.
