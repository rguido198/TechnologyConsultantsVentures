# 001 — Fix featured-card hover selectors that no longer match new markup

- **Status**: TODO
- **Commit**: a4fd311
- **Severity**: MEDIUM
- **Category**: Correctness / regression
- **Estimated scope**: 1 file, ~6 lines

## Problem

`initCardHovers()` in `scroll-reveal.js:122-146` sets up a GSAP hover timeline for every `.case` card: it zooms the card's media on mouseenter and shifts an arrow icon. It selects its targets like this:

```js
// scroll-reveal.js:124-125 — current
var media = card.querySelector(".case-placeholder, .browser-mockup");
var arr = card.querySelector(".btn-link .arr");
```

The featured Appt Helper / Open Cita case card added this session uses a different media structure — two `.shot` wrapper divs, not `.case-placeholder` or `.browser-mockup` — and has **two** `.btn-link` anchors in its footer, not one:

```html
<!-- index.html:526-528 — current -->
<article class="case case-featured">
  <div class="case-media">
    <div class="shot"><img src="images/appt-helper.webp" ... /></div>
    <div class="shot"><img src="images/open-cita.webp" ... /></div>
  </div>
```

```html
<!-- index.html:539-541 — current -->
<span class="case-links">
  <a class="btn-link" href="https://appthelper.com" target="_blank" rel="noreferrer">appthelper.com <span class="arr">↗</span></a>
  <a class="btn-link" href="https://opencita.com" target="_blank" rel="noreferrer">opencita.com <span class="arr">↗</span></a>
</span>
```

Because `.case-placeholder, .browser-mockup` matches neither `.shot`, the media-zoom effect silently never fires on this card (the `if (media) {...}` guard just skips it — no error, no visible sign anything is missing). Because `card.querySelector(".btn-link .arr")` returns only the **first** match, only the `appthelper.com` arrow shifts on hover; the `opencita.com` arrow never does. This is the site's most important proof card (it leads Selected Work) and it's missing half its intended hover polish.

The identical markup and hover script exist in `es/index.html` (Spanish page) — the fix must apply to both.

## Target

```js
// scroll-reveal.js — target
function initCardHovers() {
  gsap.utils.toArray(".case").forEach(function (card) {
    var media = card.querySelectorAll(".case-placeholder, .browser-mockup, .shot img");
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
```

Key changes: `querySelector` → `querySelectorAll` for both `media` and `arr` (renamed `arrs` for clarity), so GSAP tweens *all* matching elements inside a card, not just the first. `.shot img` added to the media selector list so the featured card's two screenshots zoom together. `if (media)`/`if (arr)` truthy checks become `if (media.length)`/`if (arrs.length)` since NodeLists are always truthy even when empty.

## Repo conventions to follow

- `initCardHovers()` already uses `gsap.utils.toArray(...)` for the outer card loop (`scroll-reveal.js:123`) — this plan extends the same "collection, not single element" pattern to the inner selectors instead of introducing a new idiom.
- GSAP accepts an array/NodeList directly as a tween target (used elsewhere in this file, e.g. `tl.to(["#pulse-in-1", "#pulse-in-2", "#pulse-in-3"], {...})` at `scroll-reveal.js:179`) — no `Array.from()` conversion needed.

## Steps

1. In `scroll-reveal.js`, inside `initCardHovers()` (starts at line 122), replace the `var media = ...` and `var arr = ...` lines (124-125) with the `querySelectorAll` versions shown in Target.
2. Update the `if (media) {...}` block to `if (media.length) {...}`, keeping the tween body (`scale: 1.03`, `boxShadow`, `duration: 0.35`, `ease: "power2.out"`) unchanged.
3. Rename the `arr` variable to `arrs` throughout the function (the `if (arr) {...}` block and its tween), changing the guard to `if (arrs.length) {...}`. Keep the tween body (`x: 4`, `duration: 0.25`, `ease: "power2.out"`) unchanged.
4. No changes needed to `index.html` or `es/index.html` — this is a pure JS fix. `scroll-reveal.js` is shared by both pages (loaded via `<script defer src="scroll-reveal.js">` in each), so fixing it once covers both languages.

## Boundaries

- Do NOT touch any other function in `scroll-reveal.js` (`applyHeadingAnimations`, `initHeroIntro`, `initCountUps`, `initAgentFlowAnimation`, `initBookingForm`, the grid-reveal registrations, or the pinned-timeline `matchMedia` block).
- Do NOT change `index.html` or `es/index.html` markup — this is a selector-only fix in the JS.
- Do NOT change the tween values (`scale: 1.03`, `duration: 0.35`, `ease: "power2.out"`, `x: 4`, `duration: 0.25`) — only the target-selection lines and the two guard conditions.
- If the featured-card markup has changed since commit `a4fd311` (e.g. `.shot` renamed, or the card restructured again), STOP and report instead of guessing at new selectors.

## Verification

- **Mechanical**: none (no build step). Open `index.html` in a browser and confirm no console errors on load.
- **Feel check**: hover over the featured Appt Helper / Open Cita card (first card in Selected Work).
  - Both screenshots (`.shot img`) zoom to 1.03× together, not just one.
  - Both the `appthelper.com` arrow and the `opencita.com` arrow shift right by 4px.
  - Moving the mouse off the card reverses both effects smoothly (GSAP's `tl.reverse()` handles interruption — confirm there's no visual snap/jump if you re-enter mid-reverse).
  - Repeat the same hover check on the other three `.case` cards (Border Bills, Baja Care) — confirm their existing single-media, single-arrow hover behavior is unchanged.
- **Done when**: hovering the featured card zooms both screenshots and shifts both arrows; all other case cards behave exactly as before.
