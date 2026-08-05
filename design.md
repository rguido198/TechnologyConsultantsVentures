# Technology Consultants — Design System & Brand Guidelines

**Repository:** Technology Consultants Ventures (`technologyconsultants.ventures`)  
**Core Identity:** Human Technology — *"We build technology around your people — not instead of them."*

---

## 1. Brand Philosophy & Core Positioning

Technology Consultants is a specialized technical practice led by **Roberto Guido** — an electrical engineer (UC San Diego) with an MBA from NYU Stern. We build custom React web applications, enterprise systems integrations (Workday Finance & Adaptive Planning), and applied AI automations.

### Core Brand Principles
1. **Human Technology (People-First Automation):** We build software that takes repetitive work off your team's plate — clearing routine tasks while keeping humans in the loop wherever trust, money, or judgment is on the line.
2. **Dark, Editorial B2B Engineering — Restraint Over Bold Statements (2026.08 reskin):** The site runs on a dark "dusk-lit workspace" canvas — void-black page background, frosted-glass panels, hairline borders instead of shadows, weight-500 display type. This replaced the prior warm-parchment/light system. **The human-photography commitment from principle 2's original wording is preserved, not dropped**: the hero's real team photo stays, now wrapped in a frosted-glass panel rather than a plain white card. What changed is tone (dark, quiet, restrained) and surface language (glass/hairline instead of light cards/shadows) — not the decision to show real people doing the work.
3. **Clean System Sans Typography:** High-contrast display titles, restrained to weight 500 (never bolder) for hero-scale type and weight 600 for section headers, paired with selective *italicized emphasis* (*instead*, *both*, *human*). Type stack is system-native (`-apple-system, "Segoe UI", "Helvetica Neue", Arial`) — no webfont added for display/body, a deliberate call to preserve the site's no-render-blocking-fetch performance decision even through the reskin. Monospace (`IBM Plex Mono`, self-hosted, unchanged) is used strictly for subtle 11px category tags and status badges.
4. **Code-First Production Rigor:** Every recommendation is backed by real working software proven on live, self-developed products (*Appt Helper*, *Open Cita*, *Border Bills*, *Baja Care*).

---

## 2. Color Palette & Design Tokens

Void-black canvas (`#0A0A0A`) with graphite elevated surfaces (`#161616`) for cards, a frosted-glass panel treatment for floating overlays, and hairline borders (`#E5E5E5` at full or low opacity) in place of the prior shadow-based elevation. Blue and teal — the site's original accent colors — are kept as general-purpose accents (links, tags, status dots) rather than retired in favor of a single-accent system; violet is layered in as a new accent alongside them, used only in gradient washes and glows, never as a solid fill. This is a deliberate, narrower application of the reference dark system's own "single accent only" rule, chosen to preserve continuity with the site's existing brand recognition.

| Token | Hex / Value | Usage & Meaning |
|---|---|---|
| `--bg-warm` (page canvas) | `#0A0A0A` | Void — primary page background, replaces the prior warm parchment |
| `--ink-dark` / `--card-bg` | `#161616` | Graphite — elevated card surfaces, nav fill, dark section bands |
| `--bg-warm-2` | `#1C1C1C` | Secondary elevated surface (browser-mockup chrome bar) |
| `--ink` | `#EDEDED` | Bone — primary text on dark surfaces (was near-black; inverted) |
| `--ink-soft` | `#C2C2C2` | Ash — secondary body text |
| `--ink-quiet` | `#686868` | Slate — captions, metadata, quiet labels |
| `--line` | `#E5E5E5` | Hairline — emphasized/hover border state |
| `--line-soft` | `rgba(229,229,229,0.12)` | Hairline — default-state border, dimmer |
| `--color-snow-white` | `#FFFFFF` | Primary CTA fill (white pill), icon glyphs on colored chips |
| `--glass-fill` | `rgba(212,212,212,0.1)` | Frosted-glass panel fill (hero photo card, feature panels) |
| `--blue` | `#2B59D9` | Kept as general accent — links, brand mark fill, hero gradient cobalt stop |
| `--blue-hover` | `#1E46B8` | Hover state for blue actions |
| `--teal` | `#35B9CC` | Kept as general accent — status dots, tags, highlighter blocks |
| `--violet` | `#6B62F2` | New accent — gradient washes and radial glows only, never a solid fill |
| `--gold-accent` | `#D99B26` (PPTX only, see §5) | Eyebrow badges, quote callouts in presentation decks |
| `--red-disqual` | `#DC2626` (PPTX only, see §5) | Alert red for disqualifier cards in presentation decks |

**Not reskinned:** the "Browser Mockup" product-screenshot component (`.browser-mockup` and its `.mock-*` family in `components.css`) is intentionally kept on light, self-contained literal values — it represents an actual product UI screenshot, and a real screenshot doesn't recolor itself to match the page around it.

---

## 3. Typography & Text Hierarchy

### Typeface Stacks
- **Display, Headlines, Body & UI (website):** `-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif` — system-native, no webfont added. Display weight is capped at **500** (never bolder), section-level headings sit at **600**; scale and negative tracking (`-0.035em` at display size) carry the hierarchy, matching the reference dark system's own restraint principle.
- **Monospace Accent:** `"IBM Plex Mono", ui-monospace, monospace` (Self-hosted; used strictly for 11px uppercase category tags and status badges) — unchanged.
- **PPTX decks** still use `Helvetica Neue` / `Helvetica` / `Arial` at their existing weights — see §5, intentionally not reskinned in this pass.

### Typographic Hierarchy & Presentation Font Scale (Mapped to Website CSS Tokens)

The **Color** column below is the PPTX deck's own (unchanged, light-canvas) palette — decks are out of scope for the dark reskin, see §5. The website side of this mapping now renders those same sizes in Bone (`#EDEDED`) on the dark canvas rather than Deep Charcoal on parchment.

| Element Role | Website CSS Size | PPTX Widescreen Size | Font Weight & Color |
|---|---|---|---|
| **Cover Display Title (H1)** | `clamp(34px, 4.5vw, 54px)` | `Pt(40)` | Bold (`700`), Deep Charcoal (`#16161A`) |
| **Slide Main Headline (H2)** | `32px` | `Pt(30)` | Bold (`700`), Deep Charcoal (`#16161A`) |
| **Section & Feature Title (H3)** | `20px – 22px` | `Pt(20)` | Bold (`700`), Deep Charcoal (`#16161A`) |
| **Column Numbers (01, 02, 03)** | `28px – 32px` | `Pt(28)` | Bold (`700`), Action Blue (`#2B59D9`) / Gold (`#D99B26`) |
| **Category Eyebrows / Badges** | `11px` (Uppercase, `0.08em` tracking) | `Pt(11)` | Bold (`700`), Action Blue (`#2B59D9`) / Gold (`#D99B26`) |
| **Lede Paragraphs** | `18px` (`line-height: 1.5`) | `Pt(16)` | Regular (`400`), Soft Charcoal (`#454337`) |
| **Body Text & Bullet Points** | `14.5px – 15px` | `Pt(13.5) – Pt(14)` | Regular (`400`) / Bold lead-in (`700`), Soft Charcoal (`#454337`) |
| **Proof Band Stat Headings** | `16px` | `Pt(15)` | Bold (`700`), Deep Charcoal (`#16161A`) |
| **Proof Band Stat Labels** | `13px` | `Pt(12)` | Regular (`400`), Soft Charcoal (`#454337`) |
| **Footer Metadata** | `12px` | `Pt(10.5)` | Regular (`400`), Quiet Charcoal (`#736E62`) |

---

## 4. Components & Interface Architecture

### 1. Navigation Header Bar — Floating Frosted Nav
- **Background:** No longer flush/sticky — floats detached from the viewport edge (`position: fixed`, 16px offset), 19px asymmetric border-radius, `rgba(22,22,22,0.7)` fill with backdrop blur, 1px hairline border.
- **Brand Mark:** Blue rounded square (`28x28px`, `#2B59D9`) containing a white (`--color-snow-white`) cursor symbol (`›`) — unchanged color role, since the square was always a colored chip needing light glyph contrast.
- **Brand Text:** `Technology Consultants` in bold white sans-serif.
- **Nav Items:** `Services` · `Work` · `How we work` · `About` · `FAQ` · `ES · Español`.
- **Primary CTA:** White rounded pill button `Book a call` (`--color-snow-white` background, `--ink-dark` text) — Dimension's inverted "White Pill CTA" pattern.

### 2. Buttons & Action Links
- **Primary Action Pill:** Inverted fill — white pill, dark text (`--ink-dark`), pill radius (`border-radius: 999px`), right arrow icon (`→`). No hover shadow; hover dims to `rgba(255,255,255,.85)`.
- **Secondary Ghost Pill:** Transparent fill, hairline border (`--line`), `--ink` text.
- **Blue Action Button:** `--blue` fill, white text — kept as a secondary filled option per the color-palette decision to retain blue/teal as general accents.

### 3. Proof Principles Bar (4 Columns)
- **In production.** Real users today on our self-developed products.
- **Senior team.** The people who pitch your project ship it.
- **Code first.** No decks before working software.
- **One team.** Interfaces and automations: same engineers, same stack.

### 4. Human Photography & Operational Badge
- Hero section still includes human collaboration photography (`images/team-hero.webp`) — this stays, unconditionally, per brand principle 2. What changed is the frame around it: the floating "operational badge" card (`.hero-photo-card`) is now a **frosted-glass panel** (`--glass-fill` translucent dark fill + backdrop blur, hairline border, hairline-inset shadow instead of a drop shadow) rather than a near-opaque white card. Content unchanged:
  - Label: `INVOICE REVIEW`
  - Stat: `245 cleared automatically`
  - Badge: `2 need you` (Human-in-the-loop highlight, gold chip, unchanged)

### 5. Cards & Containers
- Graphite rounded containers (`--card-bg` `#161616`, `border-radius: 24px`), hairline border (`--line-soft`), generous inner padding. No box-shadow elevation anywhere on the site — hairline borders and surface contrast (void canvas vs. graphite card) carry all depth cues, replacing the prior shadow-based system.
- **Exception, by design:** the "Browser Mockup" product-screenshot component stays light (self-contained literal values, not the shared dark tokens) — see §2.

---

## 5. PowerPoint (.PPTX) Presentation Design Rules

All slide decks representing Technology Consultants must adhere 100% to this design specification:

1. **Typography:** `Helvetica Neue` / `Helvetica` / `Arial` across ALL text elements (titles, subtitles, section headers, body text). **No typewriter, serif, or newspaper fonts.**
2. **Slide Canvas:** Warm Off-White Canvas `#FBFAF5`.
3. **Canvas-Native Layout (No Card Overload):** Content sits directly on the warm parchment canvas (`#FBFAF5`) with generous whitespace. **Avoid enclosing every section or paragraph in rounded white card containers.**
4. **Subtle Accent Dividers:** Use thin horizontal or vertical accent lines (`Pt(1)` – `Pt(3)` in Action Blue `#2B59D9`, Gold `#D99B26`, or Line Subtle `#E2DDD0`) to separate content areas cleanly instead of heavy box outlines.
5. **Executive Cover Slide (Slide 1):**
   - Category Line: `TECHNOLOGY CONSULTANTS  ·  PRACTICE OVERVIEW & REFERRAL GUIDE`
   - Primary Presentation Title: **Who to Send My Way** (`38pt` Bold) / **¿A quién enviarme?**
   - Subtitle: **Partner Referral Guide & Ideal Client Profile** (`18pt` Medium)
   - Brand Motto Callout Block: *"We build technology around your people — not instead of them."* (`16pt` Bold Italic quote with a `3px` solid Action Blue `#2B59D9` left accent line).
   - Presented By: **Roberto Guido** | Founder & Principal Engineer (UC San Diego EE · NYU Stern MBA)
   - Location & Contact: San Diego, CA & Tijuana, MX · `technologyconsultants.ventures`
   - Bottom 4-Column Proof Bar: **In production.** | **Senior team.** | **Code first.** | **One team.**
---

## Presentation Deck Collateral Suite

1. **Executive Company Overview & Applied AI Impact Deck (10 Slides):**
   - **Slide 1 (Cover):** **Applied AI & Custom Web Engineering** (Subtitle: *What Real AI Means for Operations & How We Build Systems That Impact Business*).
   - **Slide 2 (Demystifying AI):** **What "AI" Actually Means for Business Operations** (Generic Chatbots vs Connected Systems vs Human-in-the-Loop).
   - **Slide 3 (Core Practice):** **Websites, Enterprise Integrations & Intelligent Automations** (React Web Apps, Workday/PostgreSQL, MCP & AI Agents).
   - **Slide 4 (Case Study 1 - Workday MCP):** **Workday Finance & Enterprise MCP Integration** (Automating invoice reviews with 100% security & audit trails).
   - **Slide 5 (Case Study 2 - Voice AI):** **Encounter AI — High-Volume Voice AI Hardware & Software** (Backed by Morgan Stanley Inclusive Ventures Lab).
   - **Slide 6 (Case Study 3 - Proprietary Suite):** **Self-Developed Applications Live in Production Today** (Appt Helper, Open Cita, Border Bills).
   - **Slide 7 (Operational Transformation):** **How We Transform Company Workflows in 30–90 Days** (Automate 90% routine, flag 10% exceptions, zero copy-pasting).
   - **Slide 8 (Ideal Client Profile & Referral Signals):** **Companies in Your Network That We Can Help Most** (Target profiles + trigger quotes).
   - **Slide 9 (Engagement Methodology):** **Low-Risk Sprints to Working Production Software** (2–4 week Proof-of-Concept Sprint, Full Build, Retainer).
   - **Slide 10 (Next Steps):** **How to Make the Introduction** (Gold callout box with recommended email template & contact details).

2. **Partner Referral & ICP Guide Deck (8 Slides):**
   - **Slide 1 (Cover):** **Who to Send My Way** (Partner Referral Guide & Ideal Client Profile).
   - **Slide 2:** **Custom Web Apps, Enterprise Integrations & AI Agents**
   - **Slide 3:** **Target Organizations & Key Decision Makers**
   - **Slide 4:** **Operational Trigger Signals That Indicate a Fit**
   - **Slide 5:** **Live Enterprise Integrations & Proprietary Products**
   - **Slide 6:** **Unsuitable Projects That We Politely Pass On**
   - **Slide 7:** **Sprint, Project, and Retainer Engagement Options**
   - **Slide 8:** **Recommended Partner Email Introduction Template**

---

## 6. Language & Localization Standards (EN & es-MX)

The brand maintains full tone and messaging symmetry across English and Mexican Spanish (`es-MX`):
- **English Hero Motto:** *"We build technology around your people — not instead of them."*
- **Mexican Spanish (`es-MX`) Hero Motto:** *"Desarrollamos tecnología alrededor de tu equipo — no para reemplazarlo."*
- **English Deck Title:** *Technology Consultants — Who to Send My Way (Partner Referral Guide)*
- **Mexican Spanish (`es-MX`) Deck Title:** *Technology Consultants — ¿A quién enviarme? (Guía de Referencias para Socios)*
