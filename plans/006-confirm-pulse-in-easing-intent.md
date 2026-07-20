# 006 — Confirm intent behind ease-in on inbound hero pulse-dots

- **Status**: TODO
- **Commit**: a4fd311
- **Severity**: LOW (flagged for confirmation, not asserted as wrong)
- **Category**: Easing
- **Estimated scope**: 1 file, 1 line (only if changed)

## Problem

`scroll-reveal.js:179-189` animates three pulse-dots traveling from input nodes (Docs/Feeds/APIs) toward the SVG's central "core" node using a pure ease-in curve:

```js
// scroll-reveal.js:179-189 — current
tl.fromTo(["#pulse-in-1", "#pulse-in-2", "#pulse-in-3"],
  { cx: 40, cy: function(i) { return [80, 160, 240][i]; }, opacity: 0 },
  {
    cx: 200,
    cy: 160,
    opacity: 1,
    duration: 1.1,
    stagger: 0.15,
    ease: "power1.in"
  }
);
```

This is the one place in the entire codebase using a pure `ease-in` curve. Per the audit playbook's easing decision order, elements *moving/morphing on screen* (as opposed to entering/exiting via opacity) should use `ease-in-out`, not `ease-in` — `ease-in` starts slow and accelerates, which for a user-triggered UI response "delays the exact moment the user is watching."

This case is different from the typical UI complaint, though: it's an ambient, continuously-looping decorative animation (not a click-triggered response), and starting slow / accelerating toward the core plausibly reads as an intentional physical metaphor — "data being pulled in, accelerating as it approaches the AI core," similar to gravitational acceleration. Whether that's the deliberate intent or an oversight can't be determined from the code alone.

## Target

**This plan does not prescribe a change.** It requires a human decision first:

- **If the accelerating-toward-the-core effect is intentional** (a deliberate "gravity/pull" metaphor): mark this plan `DONE` with no code change, and add a one-line comment above the `tl.fromTo(...)` call documenting the intent, so a future audit doesn't re-flag it:
  ```js
  // Deliberate: dots accelerate as they're pulled toward the core (gravity metaphor).
  tl.fromTo(["#pulse-in-1", "#pulse-in-2", "#pulse-in-3"],
    ...
    { ..., ease: "power1.in" }
  );
  ```
- **If it's not intentional** (just an oversight, or the desired feel is a smoother arrival rather than an accelerating one): change `ease: "power1.in"` to `ease: "power2.inOut"`, matching the audit playbook's guidance for on-screen movement.

## Repo conventions to follow

- `EASE` (`scroll-reveal.js:16`, `= "power2.out"`) is this file's general-purpose ease constant, used for entrances/exits. There is no existing `ease-in-out` constant in this file — if this plan results in a change, `"power2.inOut"` should be hand-typed inline here (consistent with how `"power1.in"` and `"power3.out"` are already hand-typed elsewhere in this same function), not added as a new shared constant, since this is the only place in the codebase that would use it.

## Steps

1. **Before touching code**, ask the site owner (or whoever set the original design direction) whether the pulse-dots' accelerating approach to the core SVG node is a deliberate physical metaphor.
2. If intentional: make no functional change. Add the one-line comment shown in Target directly above the `tl.fromTo(...)` call at `scroll-reveal.js:179`. Mark this plan `DONE`.
3. If not intentional: change `ease: "power1.in"` (line 187) to `ease: "power2.inOut"`. Leave `duration: 1.1` and `stagger: 0.15` unchanged.

## Boundaries

- Do NOT change this without first getting a decision on intent — this is the one plan in this batch where "no code change" is a fully valid, correct outcome.
- Do NOT touch the outbound pulse-dot animation (`scroll-reveal.js:197-208`, which already correctly uses `ease: "power2.out"` for dots moving away from the core) — that one is not part of this finding.
- Do NOT touch `duration` or `stagger` values regardless of which branch is taken.

## Verification

- **Mechanical**: none.
- **Feel check** (only if the ease is changed): reload the page, watch the hero SVG's input-side pulse dots travel from Docs/Feeds/APIs toward the center. With `power2.inOut`, the dots should now decelerate slightly as they arrive at the core, rather than arriving at full speed. Confirm this doesn't look worse than the original acceleration — if it does, this is a signal the original `power1.in` was in fact the better choice, and the plan's own recommendation should be reconsidered rather than blindly applied.
- **Done when**: either (a) intent is documented via the comment and no code changed, or (b) the ease is changed to `power2.inOut` and the feel-check confirms it still reads well.
