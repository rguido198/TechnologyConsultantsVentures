# Technology Consultants — Design System & Brand Guidelines

**Repository:** Technology Consultants Ventures (`technologyconsultants.ventures`)  
**Scope:** Sitewide design tokens, UI components, typography, color palette, and presentation slide design specs.

---

## 1. Brand Foundation & Positioning

Technology Consultants is a specialized technical practice founded by **Roberto Guido** — an electrical engineer (UC San Diego) with an MBA from NYU Stern. The practice bridges the gap between what is technically possible and what delivers measurable business outcomes.

### Core Pillars
1. **Engineering Meets Strategy:** Hardware and software engineering discipline combined with business ROI and operational realism.
2. **Enterprise Systems Integration:** Deep financial backend integrations (Workday Finance, Workday Adaptive Planning, PostgreSQL) connected to custom modern frontends.
3. **Applied AI & Intelligent Automation:** Custom Model Context Protocol (MCP) servers, LLM orchestration, and Human-In-The-Loop (HITL) safety controls.
4. **Tested Architecture:** Every recommendation is proven against live, in-house products (*Appt Helper*, *Open Cita*, *Border Bills*, *Baja Care*).

---

## 2. Color System & Design Tokens

The site utilizes a dual-theme canvas: a high-contrast dark theme for the navigation and terminal components, paired with a warm, editorial light background for readable content.

### Color Palette

| Token | Hex / Value | Usage & Meaning |
|---|---|---|
| `--ink-dark` | `#121216` | Navigation bar, dark hero sections, terminal background, presentation dark slides |
| `--ink` | `#16161a` | Primary body text, dark buttons, display headlines |
| `--ink-soft` | `#454337` | Secondary body text, card descriptions, paragraph text |
| `--ink-quiet` | `#5f5c52` | Captions, metadata, subtle labels |
| `--bg-warm` | `#f4f1ea` | Main site background, light canvas, slide backgrounds |
| `--bg-warm-2` | `#efe9d8` | Subtle card fills, hover container backgrounds |
| `--blue` | `#2b59d9` | Primary action blue, interactive links, brand accent mark |
| `--blue-hover` | `#1e46b8` | Hover state for buttons and links |
| `--teal` | `#35b9cc` | Accent highlights, terminal log status, active indicators |
| `--accent-gold` | `#d99b26` | Eyebrow badges, quote callouts, key metric callouts |
| `--line` | `#c9c3b2` | Card borders, subtle dividers |
| `--line-soft` | `#ddd7c8` | Light container borders |

### Contrast & Accessibility Rules
- Text on `--bg-warm` uses `--ink` (`#16161a`) or `--ink-soft` (`#454337`), ensuring a contrast ratio ≥ 7:1.
- Buttons on dark backgrounds use white text (`#FFFFFF`) with `--blue` (`#2b59d9`) or gold (`#d99b26`) backgrounds.
- Interactive elements use `--blue` for standard actions and gold for primary referral highlights.

---

## 3. Typography & Hierarchy

### Font Stacks
- **UI & Display:** `"Helvetica Neue", Helvetica, Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- **Code & Accents:** `"IBM Plex Mono", ui-monospace, monospace`

### Typographic Scale
- **Display H1 / Hero Title:** 44px – 56px (Mobile: 32px – 38px), Bold (`700`), `-0.02em` tracking
- **Section Heading (H2):** 28px – 36px, Bold (`700`)
- **Card Heading (H3):** 20px – 24px, Bold (`700`)
- **Body Text:** 16px – 17px, Line Height `1.5` – `1.65`
- **Eyebrow / Badge:** 11px – 13px, `IBM Plex Mono`, Uppercase, Medium (`500` / `600`)

---

## 4. Components & Layout Principles

### 1. Navigation Header
- **Background:** Sticky `--ink-dark` (`#121216`) with bottom border `#26262c`.
- **Brand Mark:** Blue rounded square (`28x28px`, `radius: 7px`) with a monospace cursor glyph (`›_`).

### 2. Cards & Containers
- **Border Radius:** `12px` (`var(--r-md)`) or `20px` (`var(--r-lg)`) for major feature cards.
- **Card Background:** Pure white (`#FFFFFF`) on `--bg-warm` canvas, or `--ink-dark` container cards.
- **Borders:** Thin 1px stroke (`--line` or `#26262c` on dark theme).

### 3. Interactive Hero Terminal & Canvas
- Real-time terminal log animation (`.hero-terminal`) illustrating automated invoice ingestion and Human-In-The-Loop (HITL) gates.
- Symmetrical perspective wave grid (`hero-shapes.js`) wrapped around hero headers.

---

## 5. PowerPoint (.PPTX) Slide Design Standards

Slide decks generated for Technology Consultants follow the exact color palette, typography scale, and card container styling as the website:

1. **Title & Conclusion Slides (Dark Theme):**
   - Background: `--ink-dark` (`#121216`)
   - Left Accent Bar: Gold (`#D99B26`)
   - Title Text: White (`#FFFFFF`) with Gold Eyebrow (`TECHNOLOGY CONSULTANTS`)
   - Author Info: White & Muted Silver

2. **Content & Detail Slides (Light Editorial Theme):**
   - Background: Warm Light (`#F4F1EA` / `#F8F9FA`)
   - Header Eyebrow: Blue (`#2B59D9`) or Gold (`#D99B26`)
   - Card Containers: White rounded cards (`#FFFFFF`) with subtle borders (`#E5E7EB` / `#2563EB`)
   - Grid Layout: 3-column feature cards, 2-column comparison containers, or 3-row stacked triggers.

---

## 6. Localization & Language Standards (EN & es-MX)

The brand maintains full bilingual symmetry across English and Mexican Spanish (`es-MX`):
- **English:** Clean B2B tone ("Custom Interfaces & Systems Integration", "Who to Send My Way").
- **Mexican Spanish (`es-MX`):** Natural, professional Mexican business Spanish ("Interfaces Personalizadas e Integración de Sistemas", "¿A quién enviarme? / Guía de Referencias").
