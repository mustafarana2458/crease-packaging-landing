# CREASE — Engineered to be opened.

A scroll-driven landing page for **CREASE**, a fictional premium packaging manufacturer (a portfolio / interview piece, not a real company).
Story arc: **Flat → Form → Craft → Process → Planet → Proof → You.** See `BRAND_BRIEF.md` for the full creative brief and `ASSET_PROMPTS.md` for how every image and video was generated (Google Flow · Imagen / Veo).

**Stack:** Vite · GSAP 3 (ScrollTrigger, SplitText) · Lenis · vanilla JS/CSS, no framework. Four AI-generated videos are converted into WebP frame sequences and scrubbed on `<canvas>` by scroll.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # serve dist/ locally
```

Node 18+ (Netlify uses 22).

## Deploy (Netlify)

Everything is in `netlify.toml`: build `npm run build`, publish `dist/`. Connect the repo, or drag `dist/` into Netlify Drop.
Frame sequences are **pre-generated and committed** in `static/media/`, so the Netlify build does not need ffmpeg.
Caching: hashed JS/CSS is immutable, `/media/*` is cached for 7 days.

**"Powered by Netlify" badge / toolbar:** nothing in this repo injects it. If you see one on a deploy preview, branch deploy or unique deploy URL (`<hash>--<site>.netlify.app`), it is Netlify's collaboration drawer. Turn it off in the Netlify UI (Deploy Previews settings). If it still appears on the production URL in a private window, check the site's Snippet injection settings.

---

## Project structure

```
index.html                 all markup (real text, semantic sections)
src/
  main.js                  boot: preloader → build sections → lazy-load sequences
  styles/main.css          tokens, layout, static fallback, motion layout
  lib/
    sequence.js            FrameSequence: progressive loader + cover-fit canvas renderer
    scroll.js              Lenis ↔ ScrollTrigger sync, anchor links, auto-hiding nav
    preloader.js           dieline draw + 000→100 counter tied to hero frames
    cursor.js              dot → VIEW / DRAG label (fine pointers only)
    utils.js
  sections/                one module per scroll section
  generated/media.json     frame counts per sequence (written by the media script)
scripts/build-media.mjs    ffmpeg pipeline: assets/ → static/media/
assets/                    master files (checklist names from ASSET_PROMPTS.md)
  images/*.jpg  videos/*.mp4
static/                    served as-is (Vite publicDir)
  media/seq/<id>/d/        desktop frames · 1280×720 · every frame
  media/seq/<id>/m/        portrait frames · 720×720 square crop · every 2nd frame
  media/img/               stills · 800w + 1376w WebP
public/                    raw Google Flow downloads (git-ignored, not shipped)
```

`publicDir` is set to `static/` on purpose: `public/` still holds the original Flow downloads and must not end up in the build.

## Media pipeline

```bash
npm run media                          # regenerate everything (≈2.5 min)
node scripts/build-media.mjs unbox     # only one sequence, images untouched
```

| Sequence | Source | Desktop | Portrait |
|---|---|---|---|
| hero | `hero_fold.mp4` (8 s, trimmed to frames 0–165) | 166 frames · 1.4 MB | 83 · 0.5 MB |
| unbox | `rigid_unbox.mp4` (8 s) | 192 · 1.7 MB | 96 · 0.6 MB |
| process | `process_line.mp4` (10 s) | 240 · 2.9 MB | 120 · 0.8 MB |
| eco | `eco_return.mp4` (8 s) | 192 · 5.1 MB | 96 · 1.7 MB |

Stills total ≈ 0.4 MB. Audio is stripped.

**Loading strategy.** Frames load coarse-to-fine: every 8th frame, then every 4th, 2nd, 1st. The preloader only waits for the hero's first pass (22 frames). The rest fills in while you scroll, and the renderer always draws the nearest frame that has loaded. The other three sequences load one after another in the background. Any of them jumps the queue when the user comes within ~2 screens of it.

**Portrait screens** (`max-aspect-ratio: 1/1`) use the square crop. The canvas becomes a band that fades into the page, with text above and below it. Hotspot coordinates are stored against the 16:9 frame and remapped through the crop (`cropX` in `media.json`).

---

## Sections

| # | Section | Technique |
|---|---|---|
| 0 | Preloader | SVG dieline stroke + mono counter, driven by real hero-frame progress |
| 1 | Hero | pinned ~380vh, `hero_fold` scrub with an ease-out on the lid, headline lines split apart, spec labels arrive, final frame holds for the last 20% |
| 2 | Manifesto | SplitText words fill mute → bone (scrubbed), crease line draws |
| 3 | Product lines | pinned horizontal scroll, clip-path unfold, counter-parallax, 3D tilt + spec reveal on hover |
| 4 | The unboxing | pinned ~260vh, `rigid_unbox` scrub, 5 hotspots with drawn leader lines that track the objects |
| 5 | Process | pinned ~400vh, `process_line` scrub; each step is tied to the footage that shows it (Design 0–23 flat creased sheets · Prototype 24–47 sheets feed into the line · Print 48–111 press rollers and units · Produce 112–191 blanks folding into boxes · Deliver 192–239 pallet stack), see `CLIP_BOUNDS` in `process.js`; 5-step rail with proportional columns; each step (label, heading, body, meta) crossfades as one unit, only one on screen at a time |
| 6 | Sustainability | background → kraft, pinned `eco_return` in a framed canvas, stats count with scroll |
| 7 | Industries | flat-lay clip-path reveal + parallax, hoverable giant rows |
| 8 | Numbers | bone section, counters scrub (run backwards too) |
| 9 | Clients | endless drift, speed follows scroll velocity, draggable |
| 10 | Request a quote | box image scales behind the headline, validated form, "box closes" success state |
| 11 | Footer | wordmark rises letter by letter, crease line cuts through it |

Page background colours tween between sections (never hard cuts). Grain is a static SVG noise overlay at 5%.

## Accessibility & performance

- **`prefers-reduced-motion`:** no Lenis, no pins, no scrubbing, no preloader. Sequences are replaced by stills, all copy is visible, hotspots become a list, and each section paints its own background. **No-JS** gets the same static page.
- Real text everywhere; canvases have `role="img"` + `aria-label`; skip link; visible focus rings.
- Form: labels, `aria-invalid`, `aria-describedby` error messages, focus moves to the first error and then to the success message. Front-end only, nothing is sent.
- Contrast: small red text uses `--dieline-soft` (#F2775E) on dark, because `--dieline` falls below AA there. Button text is carbon on red (4.8:1).
- Only a changed frame triggers a canvas redraw; DPR is capped at 2; the testimonial ticker runs only while on screen; images are lazy with `srcset`; fonts use `display=swap`.
- JS ≈ 59 KB gzip, CSS ≈ 7 KB gzip.

---

## Asset mapping (Google Flow download → checklist name)

| Flow file | Asset |
|---|---|
| Cardboard_box_blank_on_surface | `images/hero_start_flat.jpg` |
| Custom_mailer_box_on_surface | `images/hero_end_box.jpg` |
| Cardboard_box_folding_itself | `videos/hero_fold.mp4` |
| Gift_box_on_dark_surface | `images/rigid_closed.jpg` |
| Gift_box_lid_lifts | `videos/rigid_unbox.mp4` |
| Factory_line_producing_kraft_boxes | `videos/process_line.mp4` |
| Cardboard_mailer_box_on_soil | `images/eco_start.jpg` |
| Cardboard_box_decomposing_into_soil | `videos/eco_return.mp4` |
| Sculptural_stack_of_shipping_boxes | `images/product_corrugated.jpg` |
| Three_standing_pouches_on_surface | `images/product_flexible.jpg` |
| Eco_packaging_set_arranged_together | `images/product_kraft.jpg` |
| Packaging_grid_on_dark_surface | `images/industries_flatlay.jpg` |

### Known asset quirks
- Videos are 1280×720 (Flow's export), so desktop frames are capped at 720p.
- The videos don't start or end on the matching stills (different angle and box). The stills are used only where the video isn't shown: CTA, product card, reduced-motion fallbacks.
- `hero_fold`: from source frame 166 the lid flaps warp and the box snaps into a different 3/4 view (~frame 180). **Fixed without regenerating:** the sequence is cut after frame 165 (`last: 165` in `scripts/build-media.mjs`). `foldCurve()` in `src/sections/hero.js` gives the lid (frames 124–165, where it moved about twice as fast) 45% of the fold scroll with an ease-out. Frame 165 then holds for the last 20% of the pin.
- `hero_fold` is really 12 fps with every frame doubled, so the every-2nd-frame portrait set loses no motion.
- `rigid_unbox`: the floating lid has a thin "tether" artefact and drops behind the box on the right.
- `process_line`: 10 s instead of 8 s; one small forward jump at 2.5 s.
- `eco_return`: the light beam brightens during the first ~2 s.
