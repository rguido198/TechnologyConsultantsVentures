# 008 — Add a reveal transition to FAQ answers instead of an instant snap

- **Status**: TODO
- **Commit**: a4fd311
- **Severity**: LOW-MEDIUM (missed opportunity)
- **Category**: Missed opportunity
- **Estimated scope**: 1 file, ~15 lines

## Problem

Each FAQ item is a native `<details>`/`<summary>` element:

```css
/* components.css:1550-1564 — current */
.faq-item {
  background: #fff;
  border: 1px solid var(--line-soft);
  border-radius: var(--r-xl);
  overflow: hidden;
  transition: border-color 0.22s ease, box-shadow 0.22s ease;
}
.faq-item:hover {
  border-color: var(--line);
  box-shadow: var(--shadow-sm);
}
.faq-item[open] {
  border-color: var(--navy);
  box-shadow: var(--shadow-md);
}
```

```css
/* components.css:1582-1593 — current */
.faq-item summary::after {
  content: "+";
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 300;
  color: var(--ink-quiet);
  transition: transform 0.25s ease;
}
.faq-item[open] summary::after {
  content: "−";
  transform: rotate(180deg);
  color: var(--blue);
}
```

```css
/* components.css:1595-1603 — current */
.faq-answer {
  padding: 0 clamp(20px, 2.5vw, 32px) 24px;
  font-size: clamp(14.5px, 1.25vw, 16px);
  line-height: 1.6;
  color: var(--ink-soft);
}
.faq-answer p {
  margin: 0;
}
```

Only the `+`/`−` icon rotates (`.faq-item summary::after`, line 1588) and the card's border/shadow crossfade (`.faq-item`, line 1555). The `.faq-answer` content itself has no transition at all — native `<details>` toggles its open/closed state instantly, so the answer text appears or disappears in a single frame, a layout jump with no motion connecting the two states. This is exactly the "state change that teleports" pattern the audit playbook calls out as a missed opportunity: a brief transition would prevent the jarring snap without adding any interactive risk (FAQ toggling is an occasional action, well within the "standard animation" budget for occasional UI).

## Target

Use the CSS grid-rows trick to animate a `<details>` element's content height smoothly (works without JS, without knowing the answer's rendered height in advance, and degrades gracefully — browsers that don't support animating `grid-template-rows` just show/hide instantly, which is the current behavior anyway):

```css
/* components.css — target, restructuring .faq-answer's containment */
.faq-item {
  background: #fff;
  border: 1px solid var(--line-soft);
  border-radius: var(--r-xl);
  overflow: hidden;
  transition: border-color 0.22s ease, box-shadow 0.22s ease;
}

.faq-answer-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1));
}
.faq-item[open] .faq-answer-wrap {
  grid-template-rows: 1fr;
}
.faq-answer-wrap > .faq-answer {
  overflow: hidden;
  min-height: 0;
}

.faq-answer {
  padding: 0 clamp(20px, 2.5vw, 32px) 24px;
  font-size: clamp(14.5px, 1.25vw, 16px);
  line-height: 1.6;
  color: var(--ink-soft);
  opacity: 0;
  transition: opacity 0.2s ease;
}
.faq-item[open] .faq-answer {
  opacity: 1;
  transition-delay: 0.05s;
}
```

```html
<!-- index.html / es/index.html — target, wrapping the existing .faq-answer -->
<details class="faq-item">
  <summary>...</summary>
  <div class="faq-answer-wrap">
    <div class="faq-answer">
      <p>...</p>
    </div>
  </div>
</details>
```

`grid-template-rows` animating from `0fr` to `1fr` is the standard technique for animating a `<details>`/accordion's height without JavaScript measuring `scrollHeight` — it works because a `0fr`/`1fr` track can be transitioned like any other value, and the child's `min-height: 0` lets it actually collapse to zero instead of being clipped by its own content's intrinsic height.

## Repo conventions to follow

- If `plans/005` (easing-token consolidation) has already been applied, `--ease-out` will exist as a real custom property — use `var(--ease-out)` directly instead of the fallback form. This plan's CSS includes `var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1))` specifically so it works correctly whether `plans/005` has run yet or not; once `plans/005` is applied, this fallback becomes redundant but harmless — no follow-up edit is required.
- `.faq-item` already uses `overflow: hidden` at the card level (line 1554) for its rounded corners — this plan adds a second, nested `overflow: hidden` on `.faq-answer-wrap` specifically to make the grid-rows collapse trick work; it does not remove or change the existing one.

## Steps

1. In `index.html`, find each of the 5 `<details class="faq-item">` blocks (the FAQ section, `id="faq"`). For each, wrap the existing `<div class="faq-answer">...</div>` in a new `<div class="faq-answer-wrap">...</div>`, so the structure becomes `<details><summary>...</summary><div class="faq-answer-wrap"><div class="faq-answer">...</div></div></details>`.
2. Repeat step 1 for the equivalent 5 FAQ blocks in `es/index.html`.
3. In `components.css`, add the new `.faq-answer-wrap` rule (grid-rows transition) and its `.faq-item[open] .faq-answer-wrap` counterpart, placed immediately before the existing `.faq-answer` rule (line 1595).
4. Update the existing `.faq-answer` rule to add `opacity: 0;` and `transition: opacity 0.2s ease;`, and add a new `.faq-item[open] .faq-answer { opacity: 1; transition-delay: 0.05s; }` rule directly after it.
5. Leave `.faq-item`, `.faq-item:hover`, `.faq-item[open]` (the card-level border/shadow rule), and the `summary::after` icon-rotation rule completely unchanged.

## Boundaries

- Do NOT change the FAQ questions/answers text content — markup structure only (adding one wrapper div per item).
- Do NOT touch the `+`/`−` icon rotation (`summary::after`) or the card border/shadow transition — both already work correctly.
- Do NOT add JavaScript for this — the grid-rows technique is pure CSS and works with native `<details>` semantics (no `open`/`close` event listeners needed).
- If any FAQ item's markup doesn't match the expected `<details class="faq-item"><summary>...</summary><div class="faq-answer">...</div></details>` shape (drift since commit `a4fd311`), STOP and report instead of guessing where to insert the wrapper.

## Verification

- **Mechanical**: none (no build step). Confirm valid HTML (each `<details>` still has exactly one `<summary>` followed by the new wrapper) and no console errors.
- **Feel check**:
  - Click a FAQ question — the answer should expand smoothly over ~300ms (height animates via the grid-rows transition) with the text fading in slightly after the height starts opening (the 0.05s `transition-delay` on opacity), rather than snapping open instantly.
  - Click the same question again to collapse — it should smoothly shrink back to zero height.
  - Click a second FAQ item without waiting for the first to finish — confirm both operate independently with no visual conflict (each `<details>` is independent, so this should hold automatically).
  - In DevTools' Animations panel (or by setting playback to 10%), confirm the height change is smooth, not stepped, and that the answer's text doesn't overflow or clip awkwardly mid-transition.
  - Toggle `prefers-reduced-motion` in the Rendering panel — height/opacity transitions still apply since this is content-reveal, not decorative movement (per the audit playbook, reduced motion means fewer/gentler animations, not zero — a height reveal that aids comprehension of what just opened is appropriate to keep).
- **Done when**: every FAQ item expands and collapses with a smooth, non-jarring transition instead of an instant snap, in both `index.html` and `es/index.html`.
