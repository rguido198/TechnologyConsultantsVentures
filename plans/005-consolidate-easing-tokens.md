# 005 — Consolidate hand-typed easing curves into shared tokens

- **Status**: TODO
- **Commit**: a4fd311
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 2 files (~10 lines CSS added, ~6 call sites updated)

## Problem

No `--ease-*` or `--duration-*` custom properties exist anywhere in `styles.css` or `components.css`, despite the same or near-identical values being hand-typed repeatedly:

```css
/* components.css:156 — current */
transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
```

```css
/* components.css:186 — current */
transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
```

The same `cubic-bezier(0.16, 1, 0.3, 1)` curve is typed out twice, in the mobile hamburger icon and the mobile nav-links panel. Separately, `scroll-reveal.js` hand-types the GSAP ease string `"power2.out"` roughly 15 times and `"power3.out"` twice as inline object literals rather than named constants (it does already have `var EASE = "power2.out";` at line 16 — but roughly half the `.to()`/`.from()` calls in the file still hand-type `ease: "power2.out"` directly instead of referencing `EASE`). Retuning the site's motion feel later (e.g. making entrances snappier) currently means hunting down every literal instead of changing one token.

## Target

Add two CSS custom properties to the existing `:root` block in `styles.css`, matching the values already used for the strongest curve in the codebase:

```css
/* styles.css — target, added inside the existing :root block */
:root {
  /* ...existing tokens... */

  /* Motion */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 0.2s;
  --duration-base: 0.3s;
}
```

Then reference `var(--ease-out)` at the two call sites that currently hand-type the identical curve:

```css
/* components.css:156 — target */
transition: transform 0.25s var(--ease-out), opacity 0.2s ease;
```

```css
/* components.css:186 — target */
transition: transform 0.35s var(--ease-out), opacity 0.3s ease;
```

In `scroll-reveal.js`, the module already defines `var EASE = "power2.out";` (line 16) for exactly this purpose — this plan just needs the calls that currently hand-type `ease: "power2.out"` inline to reference `EASE` instead, so future retuning is a one-line change.

## Repo conventions to follow

- `styles.css:6-46` is the existing `:root` token block (colors, fonts, radii, rhythm, shadows) — add the new `--ease-*`/`--duration-*` tokens as a new labeled group inside it (`/* Motion */`), following the file's existing comment-per-group style (`/* Radii */`, `/* Rhythm */`, `/* Shadows */`).
- `scroll-reveal.js:16` already declares `var EASE = "power2.out";` and uses it correctly in several places (e.g. the `reveal()` helper's default options, line 42). This plan does not introduce a new constant — it just finishes applying the one that already exists.

## Steps

1. In `styles.css`, inside the existing `:root { ... }` block, add a new `/* Motion */` group with `--ease-out: cubic-bezier(0.16, 1, 0.3, 1);`, `--duration-fast: 0.2s;`, and `--duration-base: 0.3s;` — placed after the existing `/* Shadows */` group.
2. In `components.css:156`, replace the literal `cubic-bezier(0.16, 1, 0.3, 1)` with `var(--ease-out)`. Leave the `0.25s` duration and the `opacity 0.2s ease` half of the declaration unchanged.
3. In `components.css:186`, replace the literal `cubic-bezier(0.16, 1, 0.3, 1)` with `var(--ease-out)`. Leave `0.35s` and `opacity 0.3s ease` unchanged.
4. In `scroll-reveal.js`, search for every `ease: "power2.out"` that is hand-typed as a string literal inside a `.to()`/`.from()`/`.fromTo()` call (rather than already referencing the `EASE` variable). Replace each hand-typed instance with `ease: EASE`. Do NOT touch any `ease: "power1.in"` (see `plans/006`), `ease: "power3.out"`, `ease: "none"`, or other distinct ease strings — only the ones that are literally `"power2.out"`.

## Boundaries

- Do NOT introduce new duration/easing values not already present in the codebase — this plan only names and reuses existing ones, it doesn't retune anything.
- Do NOT touch the `"power3.out"` eases (used for heading text reveals) — those are intentionally distinct from `EASE`/`"power2.out"` and are out of scope.
- Do NOT touch `ease: "power1.in"` (flagged separately in `plans/006`).
- Do NOT change the mobile nav's actual timing (`0.25s`, `0.35s`, `0.2s`, `0.3s` durations) — only the curve, and only where it's already `cubic-bezier(0.16, 1, 0.3, 1)` literally.
- If a `--ease-out` or `--duration-*` token name already exists in `styles.css` under different values (drift since commit `a4fd311`), STOP and report instead of overwriting it.

## Verification

- **Mechanical**: none (no build step). Confirm the CSS/JS parse with no console errors on load.
- **Feel check**:
  - Toggle the mobile nav open/closed (resize to a mobile viewport, tap the hamburger) — the icon morph and the nav-panel slide-down should look and feel identical to before this change (same curve, just tokenized).
  - Trigger a few of the scroll-reveal animations that used to hand-type `"power2.out"` (e.g. scroll to Services and watch the card grid reveal) — timing and feel should be unchanged.
  - In DevTools' Elements → Styles panel, inspect `.nav-toggle-btn .hamburger-line` and confirm `transition` now resolves through `var(--ease-out)` to the same `cubic-bezier(0.16, 1, 0.3, 1)` value as before.
- **Done when**: the two `cubic-bezier(0.16, 1, 0.3, 1)` literals in `components.css` reference `var(--ease-out)`, every hand-typed `"power2.out"` in `scroll-reveal.js` reads `EASE` instead, and nothing about the site's actual motion timing changed.
