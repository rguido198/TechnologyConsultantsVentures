# 004 — Gate card hover-lift transforms behind prefers-reduced-motion

- **Status**: TODO
- **Commit**: a4fd311
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file, 4 rules changed

## Problem

Four card components move on hover via an unconditional `transform: translateY(-3px)`:

```css
/* components.css:403-407 — current */
.value-card:hover {
  transform: translateY(-3px);
  border-color: var(--line);
  box-shadow: var(--shadow-md);
}
```

```css
/* components.css:651-654 — current */
.service:hover {
  transform: translateY(-3px);
  border-color: var(--line);
  box-shadow: var(--shadow-md);
}
```

```css
/* components.css:726-729 — current */
.case:hover {
  transform: translateY(-3px);
  border-color: var(--line);
  box-shadow: var(--shadow-md);
}
```

`.ai-cred:hover` (`components.css:503-506`) does the same with a slightly different transition list. (`.how-cell:hover`, `components.css:877`, was checked and only changes `background` — no transform — so it's correctly out of scope for this plan.)

The only `prefers-reduced-motion` handling anywhere in `components.css` is at line 1132, and it just hides the reading-progress bar. Meanwhile, `scroll-reveal.js:9-12` bails out of *all* GSAP-driven motion (heading reveals, hero cascade, count-ups, scroll reveals, the agent-flow timeline) the instant `prefers-reduced-motion: reduce` is detected. The result is an inconsistent reduced-motion story: users who've asked for less motion still get a `translateY` lift on every hover of a service card, case card, AI-credential card, or value-scenario card, because those are pure-CSS `:hover` rules that were never gated — while everything on the JS side is gated all-or-nothing.

## Target

```css
/* components.css — target for each of the 4 rules */
@media (prefers-reduced-motion: no-preference) {
  .value-card:hover,
  .service:hover,
  .case:hover,
  .ai-cred:hover {
    transform: translateY(-3px);
  }
}
```

The `border-color` and `box-shadow` hover feedback stay ungated (they're color/paint feedback, not movement — AUDIT.md's guidance is to keep non-movement feedback even under reduced motion, not remove it wholesale).

## Repo conventions to follow

- `components.css:1132` is the one existing `@media (prefers-reduced-motion: reduce)` block in this file — this plan uses the inverse (`no-preference`) instead, since it's cleaner to opt *into* the movement than to override it back out for four separate rules. Either form is valid CSS; using `no-preference` here avoids restating `transform: none` four times.
- Keep each hover rule's non-transform declarations (`border-color`, `box-shadow`) exactly where they are, in the base `:hover` rule — only the `transform` line moves into the gated block.

## Steps

1. In `components.css`, find `.value-card:hover` (line 403). Remove the `transform: translateY(-3px);` line from inside it, leaving `border-color` and `box-shadow`.
2. Find `.service:hover` (line 651) and `.case:hover` (line 726). Do the same — remove `transform: translateY(-3px);` from each, leaving their other declarations in place.
3. Find `.ai-cred:hover` (line 503). Remove its `transform: translateY(-3px);` line (check the exact declaration order there — it may differ slightly from the others — leave `border-color`/`box-shadow` untouched).
4. Add one new block anywhere in the file near these rules (e.g. directly after the last of the four `:hover` rules):
   ```css
   @media (prefers-reduced-motion: no-preference) {
     .value-card:hover,
     .service:hover,
     .case:hover,
     .ai-cred:hover {
       transform: translateY(-3px);
     }
   }
   ```

## Boundaries

- Do NOT touch `.how-cell:hover` (`components.css:877`) — it has no transform, it's out of scope.
- Do NOT change the `border-color`/`box-shadow` values or timing (`transition: transform .25s ease, ...` etc. stay as-is) — only relocate the `transform` declaration for each of the 4 rules into the new media-query block.
- Do NOT touch `scroll-reveal.js` — the JS-side `if (reduceMotion) return;` early exit (line 12) is a separate, coarser mechanism and is not part of this plan's scope.
- Do NOT add `prefers-reduced-motion` gating to any other rule in the file beyond these 4 — this plan is scoped to the hover-lift finding only.

## Verification

- **Mechanical**: none (no build step). Confirm the CSS parses (no syntax errors) by loading the page and checking DevTools' Styles panel shows no invalid-declaration warnings for the changed rules.
- **Feel check**:
  - With no OS-level reduced-motion setting (default), hover over a service card, a case card, an AI-credential card, and a value-scenario card — each still lifts (`translateY(-3px)`) plus shows the border/shadow change, exactly as before.
  - In DevTools, open the Rendering panel and set "Emulate CSS media feature prefers-reduced-motion" to `reduce`. Re-hover the same four card types — confirm they no longer lift/move, but the border-color and box-shadow hover feedback still changes (so hover isn't silently doing *nothing*).
- **Done when**: hover-lift movement on these four card types only occurs when `prefers-reduced-motion` is `no-preference`; border/shadow feedback remains in both states.
