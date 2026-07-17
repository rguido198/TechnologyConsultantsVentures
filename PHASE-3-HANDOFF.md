# Phase 3 Handoff — technologyconsultants.ventures

Context for whichever agent picks this up next. Phases 1 and 2 of the SEO audit are done and deployed (see git log — commits "SEO audit Phase 1" and "Phase 2"). This doc exists because Phase 3 needs both codebase context and business decisions that weren't available to automate.

## Site architecture — read this before writing any code

- **No build step, no framework.** This is hand-written static HTML/CSS/JS deployed as Cloudflare Workers static assets (`wrangler.jsonc`, `assets.directory: "./"`). There is no React/Next/bundler — every page is a real `.html` file sitting in the repo root.
- **`not_found_handling: "404-page"`** in `wrangler.jsonc` means any path without a matching physical file 404s for real (this was a deliberate fix in Phase 1 — do not change it back to `single-page-application`).
- **New pages = new physical HTML files.** If you create `/services/ai-agent-consulting/`, that means an actual `services/ai-agent-consulting/index.html` file (or `services/ai-agent-consulting.html`) in the repo, not a client-side route.
- **Shared markup is duplicated by hand**, not templated. `index.html` and `404.html` both contain their own copy of the `<header class="nav">` block and footer. Any new page needs the same nav markup (including the `<nav class="nav-toggle-btn">`/`.nav-actions` structure added in Phase 2) plus `<script defer src="nav.js"></script>` for mobile nav to work, and `<link rel="stylesheet" href="fonts.css">` instead of the old Google Fonts link.
- **i18n system**: `i18n.js` drives the EN/ES toggle via `data-i18n`/`data-i18n-attr` attributes, client-side only, single URL. The audit's biggest content-technical finding was that this makes Spanish content invisible to search — a real `/es/` path with server-side (i.e., separately-authored) Spanish HTML and `hreflang` tags is what Phase 3 calls for, not an extension of the JS toggle.
- **Scroll animations**: `scroll-reveal.js` (GSAP) has a fail-safe timeout added in Phase 1 so sections can't stay permanently invisible to crawlers — if new pages add scroll-reveal'd content, extend the same fail-safe selector list in that file.
- **Deploy**: push to `main` on GitHub → Cloudflare Worker auto-builds (Git-connected). No manual deploy step.
- **Audit artifacts**: full findings, evidence, and ready-to-paste code (including two drafted JSON-LD blocks not yet fully utilized — see `findings/schema.md` in the audit output) are at `/private/tmp/claude-501/.../scratchpad/technologyconsultants.ventures-audit/` from this session — but that's a scratchpad path that may not persist. Worth re-reading `findings/sxo.md` and `findings/geo.md` specifically before starting, since they contain the exact competitor research and citation-length findings behind several Phase 3 items.

## Decisions only Roberto can make — do not fabricate these

An agent should **stop and ask** rather than invent:

1. **Client testimonials / case studies** — the SXO audit's #1 finding was that all 4 portfolio items are self-built products, not client work, which is a real trust gap. Fixing this requires an actual client quote or case study — nothing can be synthesized here without misrepresenting the business.
2. **Pricing** — "starting at $X" per engagement model needs real numbers from Roberto. Do not guess based on competitor research.
3. **Phone number** — only add if one actually exists and Roberto wants it public.
4. **Business entity name** — a Privacy Policy/Terms page should reference the actual legal entity if one exists (LLC, sole proprietorship, etc.) — confirm before drafting.
5. **Spanish translations** — `/es/` needs real Spanish copy, not machine translation of the marketing copy, given tone/brand voice matters here (the EN copy is intentionally punchy/editorial). Confirm whether existing `i18n.js` Spanish strings can be reused as source material — check for a translations JSON/object inside that file before writing anything new.

## Phase 3 checklist (from ACTION-PLAN.md, now with implementation notes)

- [ ] **Client testimonial/trust signal** — needs Roberto's input first (see above).
- [ ] **Split into dedicated service pages** (`/services/ai-agent-consulting/`, `/services/react-web-development/`) — new static HTML files, 1,200+ words each, `Service` JSON-LD, linked from the existing homepage service cards. Keep homepage as the summary/hub (per SXO audit recommendation — don't remove the existing sections, add pages that expand on them).
- [ ] **`/es/` Spanish version** — real static HTML file(s), reciprocal `hreflang="en"`/`hreflang="es"`/`hreflang="x-default"` tags on both language versions, needs real Spanish copy (see above).
- [ ] **FAQ section** — 5-8 Q&As, `FAQPage` JSON-LD, content ideas are in `findings/geo.md` and `findings/sxo.md` from the audit.
- [ ] **Pricing signals** — needs Roberto's numbers (see above).
- [ ] **Citation-length answer blocks** — consolidate the founder bio (About p1+p2 are already ~126 words combined per the content audit — close to the 134-167 word target, light expansion needed) and one ~140-word block per flagship product. Exact target paragraphs are identified in `findings/geo.md` finding #4.
- [ ] **"web development consulting" keyword gap** — small copy tweak in the existing services section, no new page needed.
- [ ] **Dead-end "Case study" link fix** — `index.html`, the Border Bills card links `href="#work"` labeled "Case study" — either relabel to match Baja Care's honest "Watch this space" copy, or build real case study content once the dedicated service pages exist.
- [ ] **Privacy Policy / Terms** — new static page(s), needs business entity confirmation (see above).
- [ ] **Deepen fractional-CTO/retainer content** — governance/guardrails/escalation detail, per `findings/sxo.md` finding #7. Can live on the homepage "How we work" section or get its own page depending on how big the split-page work above gets.

## Verification pattern used in Phases 1-2 (recommended to repeat)

Every change in this project was verified against the **live production URL** after deploy (not just "looks right locally") — DNS/HTTP checks via `curl`, and actual browser screenshots at mobile+desktop viewports for anything touching layout/nav. Given Phase 1 shipped a real regression (mobile nav hiding the CTA) that only surfaced under live browser testing, don't skip this step for Phase 3's page-split and `/es/` work.
