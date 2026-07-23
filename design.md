# Technology Consultants — Design System & Brand Guidelines

**Repository:** Technology Consultants Ventures (`technologyconsultants.ventures`)  
**Core Identity:** Human Technology — *"We build technology around your people — not instead of them."*

---

## 1. Brand Philosophy & Core Positioning

Technology Consultants is a specialized technical practice led by **Roberto Guido** — an electrical engineer (UC San Diego) with an MBA from NYU Stern. We build custom React web applications, enterprise systems integrations (Workday Finance & Adaptive Planning), and applied AI automations.

### Core Brand Principles
1. **Human Technology (People-First Automation):** We build software that takes repetitive work off your team's plate — clearing routine tasks while keeping humans in the loop wherever trust, money, or judgment is on the line.
2. **Modern B2B Engineering Excellence:** Clean, approachable, warm, and sophisticated. We avoid dense computer terminal dumps or harsh developer gimmicks in favor of clean layouts, expansive whitespace, warm canvas tones, and real human photography.
3. **Clean System Sans Typography:** High-contrast, bold display titles paired with selective *italicized emphasis* (*instead*, *both*, *human*) set in `Helvetica Neue` / `Helvetica` / `Arial`. Monospace (`IBM Plex Mono`) is used strictly for subtle 11px category tags and status badges.
4. **Code-First Production Rigor:** Every recommendation is backed by real working software proven on live, self-developed products (*Appt Helper*, *Open Cita*, *Border Bills*, *Baja Care*).

---

## 2. Color Palette & Design Tokens

The visual aesthetic combines a dark, sleek navigation bar with a warm organic parchment background canvas (`#FBFAF5`) and clean white card containers (`#FFFFFF`).

| Token | Hex / Value | Usage & Meaning |
|---|---|---|
| `--ink-dark` | `#121216` | Navigation header background, dark card fills, dark slide header bar |
| `--ink-primary` | `#16161A` | Deep charcoal primary headlines, main body text, primary pill buttons |
| `--ink-soft` | `#454337` | Secondary body text, paragraph descriptions, card summaries |
| `--ink-muted` | `#5F5C52` | Captions, metadata, footer links, and page counters |
| `--bg-canvas` | `#FBFAF5` | Primary warm organic background canvas (page body & presentation slides) |
| `--bg-warm-2` | `#F4F1EA` | Secondary warm background for section containers and subtle card fills |
| `--card-white` | `#FFFFFF` | Raised white card surfaces providing clean contrast over the warm canvas |
| `--blue-action` | `#2B59D9` | Primary action blue for links, brand mark fill, and active indicators |
| `--blue-hover` | `#1E46B8` | Hover state for buttons and interactive links |
| `--teal-status` | `#35B9CC` | Active status dot (`● Booking projects · Q3 2026`) |
| `--gold-accent` | `#D99B26` | Eyebrow badges, quote callouts, and key referral highlights |
| `--line-subtle` | `#E2DDD0` | Soft card border strokes and horizontal section dividers |
| `--line-nav` | `#26262C` | Dark navigation bar bottom border stroke |
| `--red-disqual` | `#DC2626` | Alert red for disqualifier cards |

---

## 3. Typography & Text Hierarchy

### Typeface Stacks
- **Display, Headlines, Body & UI:** `"Helvetica Neue", Helvetica, Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- **Monospace Accent:** `"IBM Plex Mono", ui-monospace, monospace` (Self-hosted; used strictly for 11px uppercase category tags and status badges)

### Typographic Hierarchy & Presentation Font Scale (Mapped to Website CSS Tokens)

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

### 1. Navigation Header Bar
- **Background:** Sticky `--ink-dark` (`#121216`) with bottom border stroke `#26262C`.
- **Brand Mark:** Blue rounded square (`28x28px`, `#2B59D9`) containing white cursor symbol (`›`).
- **Brand Text:** `Technology Consultants` in bold white sans-serif.
- **Nav Items:** `Services` · `Work` · `How we work` · `About` · `FAQ` · `ES · Español`.
- **Primary CTA:** White rounded pill button `Book a call` (`#FFFFFF` background, `#16161A` text).

### 2. Buttons & Action Links
- **Primary Action Pill:** `#16161A` solid dark pill, white text, pill radius (`border-radius: 999px`), right arrow icon (`→`).
- **Secondary Ghost Pill:** `#FBFAF5` warm background, `#E2DDD0` soft border, `#16161A` text.

### 3. Proof Principles Bar (4 Columns)
- **In production.** Real users today on our self-developed products.
- **Senior team.** The people who pitch your project ship it.
- **Code first.** No decks before working software.
- **One team.** Interfaces and automations: same engineers, same stack.

### 4. Human Photography & Operational Badge
- Hero section includes human collaboration photography (`images/team-hero.webp`) paired with a floating operational badge:
  - Label: `INVOICE REVIEW`
  - Stat: `245 cleared automatically`
  - Badge: `2 need you` (Human-in-the-loop highlight)

### 5. Cards & Containers
- White rounded containers (`#FFFFFF`, `border-radius: 16px`), thin soft border (`#E2DDD0`), and generous inner padding.

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
