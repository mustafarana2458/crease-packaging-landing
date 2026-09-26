# CREASE — Brand Brief

> Fictional brand created for an interview landing page. Not affiliated with any real company.

---

## 1. Brand

| | |
|---|---|
| **Name** | **CREASE** (legal: Crease Packaging Works) |
| **Tagline** | **Engineered to be opened.** |
| **Secondary line** | Packaging, precisely folded. |
| **Founded (story)** | 2009, as a two-machine die-cutting shop. Today: 4 plants, 38 export countries. |
| **Positioning** | The packaging partner for brands that treat the unboxing as part of the product. Industrial precision with an atelier's eye: every box is engineered like a product and finished like a gift. |
| **Audience** | B2B — brand, packaging and procurement teams at FMCG, food & beverage, cosmetics & beauty, and e-commerce/DTC companies. |
| **Promise** | From a sketch to 1 million units with one partner: structural design, prototyping in 72 hours, print, production, delivery. |

### Why the name
A crease is the single most important line in a box: the place where a flat sheet becomes a three-dimensional object. It's technical (a real term in die-cutting) and it's quietly beautiful. The whole site hangs off that one idea: **flat becomes form.**

### Product lines
1. **Corrugated** — custom shipping and mailer boxes, E/B/C-flute, retail-ready displays.
2. **Rigid** — luxury rigid gift boxes: magnetic closures, soft-touch lamination, foil and blind embossing.
3. **Flexible** — printed stand-up pouches, sachets, flow-wrap; matte/gloss, spot-UV, resealable zips.
4. **Kraft / Eco** — FSC-certified kraft, mono-material and fully curbside-recyclable or compostable formats.

---

## 2. Colour palette

Warm, material and restrained. The page is mostly **dark**, like a product studio, with **light "paper" sections** for contrast. One accent colour only, taken from the red dieline printers use to mark cut lines.

| Token | Hex | Use |
|---|---|---|
| `--carbon` | `#0F0E0C` | Primary background (warm near-black) |
| `--graphite` | `#1C1A17` | Raised surfaces, cards, form fields |
| `--bone` | `#F2EDE4` | Primary text on dark; light-section background |
| `--paper` | `#E4DACB` | Secondary light surface, dividers on light |
| `--kraft` | `#B8875A` | Brand material colour: highlights, eco section background |
| `--kraft-deep` | `#7A5634` | Kraft on light backgrounds, hover states |
| `--dieline` | `#E4472B` | **Single accent** (CTAs, progress lines, crease marks, active step) |
| `--moss` | `#6F7F5E` | Sustainability section only |
| `--mute` | `#8A847A` | Secondary text, captions, spec labels |

Rules: the accent is never a fill larger than a button. No gradients except soft vignettes on media. Dark ↔ light section changes are animated on scroll (background colour tween), not hard cuts.

---

## 3. Typography (all free, Google Fonts)

| Role | Font | Notes |
|---|---|---|
| Display | **Instrument Serif** (regular + italic) | Huge headlines, 8–14vw on hero; italic for the emotional word ("*opened.*") |
| Body / UI | **Inter Tight** 400/500/600 | Body 17–18px, tight tracking on headings |
| Technical | **JetBrains Mono** 400 | Uppercase spec labels: `E-FLUTE · 1.5 MM`, `STEP 03 / 05`, coordinates, counters |

The mix of an editorial serif with a monospace "spec sheet" voice is the visual signature: *atelier + engineering*.

---

## 4. Tone of voice

- **Precise, calm, confident.** Short sentences. Numbers over adjectives.
- **Industrial poetry:** talk about materials the way a watchmaker talks about steel. "Board with memory." "A lid that sighs."
- Never salesy, never exclamation marks, no buzzwords ("synergy", "solutions provider").
- Microcopy uses the technical voice: `REQUEST A QUOTE →`, `72 H PROTOTYPE`, `MOQ 500`.

Sample lines:
- "Flat becomes form."
- "The first thing your customer touches isn't your product."
- "We engineer the moment between the knife and the smile."
- "Sustainable isn't a finish. It's a structure."

---

## 5. Visual language & motion

- **Art direction:** dark seamless studio, soft top-left key light, warm rim light, shallow depth of field, subtle grain. Every asset shares one style line (see `ASSET_PROMPTS.md`).
- **Graphic device:** thin 1px dieline-red "crease lines" and crop/registration marks that draw themselves on scroll (SVG stroke animation), framing media and separating sections.
- **Motion principles:** everything is tied to scroll (scrub), nothing autoplays aggressively. Eases are long and soft (`power3.out`, `expo.inOut`). Text reveals line-by-line from a mask. Media scales from 0.9 → 1 with clip-path "unfolding".
- **Cursor:** small custom dot that grows into a `VIEW` / `DRAG` label over interactive media (desktop only).
- **Grain overlay:** static SVG noise at 4–6% opacity over the whole page.

---

## 6. Page plan — the scroll story

Story arc: **Flat → Form → Craft → Process → Planet → Proof → You.**

| # | Section | Media | Scroll technique |
|---|---|---|---|
| 0 | **Preloader** | — | Dieline SVG draws a box outline while frames preload; mono counter 000 → 100. |
| 1 | **Hero — "Flat becomes form"** | 🎬 `hero_fold` video → frame sequence | Pinned ~300vh. Canvas scrubs a flat kraft sheet folding itself into a finished box. Headline "Engineered / to be *opened.*" splits apart as the box closes; mono spec labels fade in around the box. Scroll-down indicator draws a crease line. |
| 2 | **Manifesto** | — | Large serif paragraph, words fill from `--mute` to `--bone` as you scroll (scrubbed). |
| 3 | **Product lines** | 🖼 4 images (corrugated, rigid, flexible, kraft) | Pinned horizontal scroll: 4 panels slide sideways. Each image unfolds via clip-path, inner image parallaxes opposite direction. Hover: slight 3D tilt + spec sheet reveal. Background tweens carbon → graphite. |
| 4 | **The Unboxing** | 🎬 `rigid_unbox` video → frame sequence | Pinned ~250vh. Luxury rigid box lid lifts slowly. Hotspot callouts with drawn leader lines appear at set progress points: *magnetic closure*, *soft-touch lamination*, *hot-foil stamp*, *tissue wrap*. |
| 5 | **Process** | 🎬 `process_line` video → frame sequence | Pinned ~400vh. Slow tracking shot along a production line. A 5-step rail — **Design → Prototype → Print → Produce → Deliver** — advances with scroll; active step turns dieline red, its copy swaps with a masked reveal. |
| 6 | **Sustainability** | 🎬 `eco_return` video → frame sequence | Background tweens to `--kraft` / `--moss`. Pinned ~250vh: a kraft box on soil softens and returns to earth as seedlings grow through. Three eco stats count up alongside. |
| 7 | **Industries served** | 🖼 `industries_flatlay` | Four giant serif rows (FMCG · Food & Beverage · Cosmetics & Beauty · E-commerce). Flat-lay image reveals with clip-path and parallaxes; hovering a row highlights it and shows a mono detail line. |
| 8 | **Numbers** | — | Light (`--bone`) section. Counters: **1.2B** units/yr, **38** countries, **72 h** prototypes, **99.2%** on-time. Counters scrub with scroll. |
| 9 | **Testimonials** | — | Typographic quotes, slow horizontal drift tied to scroll velocity; client names in mono. |
| 10 | **CTA + Request a Quote** | 🖼 `hero_end_box` | Box image scales up behind "Let's make something worth opening." Form: name, company, email, industry, product line, quantity, message. Front-end validation only, success state animates a box "closing". |
| 11 | **Footer** | — | Giant "CREASE" wordmark with a crease line cutting through it; plants, contact, socials. |

### Media summary
- **Videos (4, all scroll-scrubbed → WebP frame sequences):** hero_fold, rigid_unbox, process_line, eco_return
- **Images (8):** hero_start_flat, hero_end_box, rigid_closed, product_corrugated, product_flexible, product_kraft, eco_start, industries_flatlay
  - `rigid_closed` doubles as the Rigid product card image *and* the start frame of the unboxing video.
  - `hero_end_box` doubles as the CTA background *and* the end frame of the hero video.

---

## 7. Accessibility & performance commitments

- `prefers-reduced-motion`: no pinning or scrubbing; sequences replaced with a single still frame, text shown without animation.
- Mobile: fewer, smaller frames (every 2nd frame, ~720px wide), shorter pins.
- Real text (no text baked into images), AA contrast, keyboard-accessible form with visible focus states.
- Target Lighthouse performance 85+: WebP frames, lazy-loaded sequences below the fold, fonts preloaded with `display=swap`.
