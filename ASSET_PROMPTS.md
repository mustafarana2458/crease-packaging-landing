# CREASE — Asset Prompts for Google Flow (Imagen / Veo)

**Totals: 4 videos + 8 images.** Everything lives in:

```
assets/
  images/   ← 8 images
  videos/   ← 4 videos
```

---

## 0. Read this first

### Shared style line
Every prompt below ends with this exact line. Keep it word-for-word so the whole set looks like one brand shoot:

> **STYLE:** premium product cinematography, seamless warm charcoal studio background (#141210) falling off to near-black at the edges, soft diffused key light from upper left, gentle warm rim light from behind right, muted warm palette of natural kraft brown, bone white and deep charcoal with a single small vermilion-red accent, shallow depth of field, 85mm lens look, subtle fine film grain, soft contrast, photorealistic, high detail, no text, no letters, no logos, no watermarks, no people, no hands.

### Rules for the 4 scroll-scrubbed videos
The videos get turned into image sequences and scrubbed by scroll, forwards and backwards. So:
- **8 seconds, 16:9, one continuous shot.** No cuts, no transitions, no zooms that snap.
- **Locked or very slow camera.** Motion should be even from start to finish, with no fast bursts. Constant speed scrubs best.
- **Clean background** that stays identical through the clip (no flicker, no moving lights).
- **No text, logos, hands or people.** Veo tends to garble these.
- **Audio doesn't matter.** It gets stripped.
- Download at the **highest resolution Flow offers** (1080p upscale if available).
- Generate **3–4 takes** of each and keep the smoothest one. Pick for *smooth, even motion*, not for the most dramatic take.

### Mobile / cropping
All assets are 16:9. On mobile the canvas crops to roughly 4:5, which keeps only the **central ~45% of the width**. So **keep the main subject inside the centre 40% of the frame** with empty studio space on both sides. The prompts already ask for this ("centered, generous negative space").
A 9:16 version is **optional, for the hero only** (see H-3).

### File formats
Images: `.png` or `.jpg` are both fine; I'll convert to WebP in Phase 2. Videos: `.mp4`.
Use the **exact filenames** below (lowercase, underscores).

### Generation order (matters because of Frames to Video)
1. `hero_end_box` → 2. `hero_start_flat` → 3. `hero_fold` video
4. `rigid_closed` → 5. `rigid_unbox` video
6. `eco_start` → 7. `eco_return` video
8. `process_line` video
9. `product_corrugated`, `product_flexible`, `product_kraft`, `industries_flatlay`

---

## SECTION 1 — HERO: "Flat becomes form"

### H-1 · `assets/images/hero_end_box.png`
- **Type:** image · **Aspect:** 16:9
- **Used for:** last frame of the hero video + background of the final CTA section.
- **Generate this one first.** The start frame gets matched to it.

**Prompt:**
> A single finished custom mailer box made of natural brown kraft corrugated cardboard, fully closed with crisp sharp folded edges, standing on a matte dark charcoal surface, centered in the frame and occupying about 30% of the frame width, generous empty negative space on both sides. Camera at a three-quarter elevated angle, about 30 degrees above the box, looking down slightly so the top and two sides are visible. The fine fluted edge of the corrugated board is visible on the front flap. A thin vermilion-red tear strip runs along the front edge as the only accent colour. Soft realistic contact shadow under the box. Calm, still, precise, luxurious minimalism.
> **STYLE:** premium product cinematography, seamless warm charcoal studio background (#141210) falling off to near-black at the edges, soft diffused key light from upper left, gentle warm rim light from behind right, muted warm palette of natural kraft brown, bone white and deep charcoal with a single small vermilion-red accent, shallow depth of field, 85mm lens look, subtle fine film grain, soft contrast, photorealistic, high detail, no text, no letters, no logos, no watermarks, no people, no hands.

### H-2 · `assets/images/hero_start_flat.png`
- **Type:** image · **Aspect:** 16:9
- **Used for:** first frame of the hero video + reduced-motion fallback.
- **Tip:** if Flow lets you add `hero_end_box` as a reference/ingredient image, do that, so the camera angle, lighting, surface and kraft colour match exactly.

**Prompt:**
> The same natural brown kraft corrugated cardboard, but completely flat: one unfolded die-cut box blank lying flat on a matte dark charcoal surface, showing the cross-shaped dieline layout with its flaps, tabs and dust flaps, with subtle pressed crease lines where it will fold. Centered in the frame, occupying about 40% of the frame width, generous empty negative space on both sides. Camera at the exact same three-quarter elevated angle, about 30 degrees above the surface. A thin vermilion-red tear strip printed along one edge as the only accent colour. Perfectly still, clean, precise.
> **STYLE:** premium product cinematography, seamless warm charcoal studio background (#141210) falling off to near-black at the edges, soft diffused key light from upper left, gentle warm rim light from behind right, muted warm palette of natural kraft brown, bone white and deep charcoal with a single small vermilion-red accent, shallow depth of field, 85mm lens look, subtle fine film grain, soft contrast, photorealistic, high detail, no text, no letters, no logos, no watermarks, no people, no hands.

### H-V · `assets/videos/hero_fold.mp4` 🎬 scroll-scrubbed
- **Type:** video · **Aspect:** 16:9 · **Length:** 8 s
- **How:** Flow → **Frames to Video** → **start frame = `hero_start_flat`**, **end frame = `hero_end_box`**.

**Prompt:**
> Locked-off static camera, no camera movement. A flat kraft corrugated cardboard box blank on a dark charcoal surface slowly and smoothly folds itself into a finished closed mailer box, as if by invisible hands: the side walls rise and fold up along their crease lines, the end flaps tuck in, and finally the lid folds over and closes gently. The motion is slow, continuous and mechanically precise, at an even speed across the full 8 seconds, with no sudden jumps. The box stays centered in the same position the whole time. The lighting and background stay perfectly constant. One continuous shot, no cuts. Satisfying, elegant, engineered.
> **STYLE:** premium product cinematography, seamless warm charcoal studio background (#141210) falling off to near-black at the edges, soft diffused key light from upper left, gentle warm rim light from behind right, muted warm palette of natural kraft brown, bone white and deep charcoal with a single small vermilion-red accent, shallow depth of field, 85mm lens look, subtle fine film grain, soft contrast, photorealistic, high detail, no text, no letters, no logos, no watermarks, no people, no hands.

> **If the folding looks messy:** folding is hard for video models. Try the **reverse**: start = `hero_end_box`, end = `hero_start_flat`, with the prompt "the closed box slowly unfolds itself flat". Unfolding often comes out cleaner. I'll reverse the frames in Phase 2, so just tell me you did this.

### H-3 (optional) · `assets/videos/hero_fold_mobile.mp4`
Only if you have credits to spare. Same process at **9:16**: regenerate H-1 and H-2 at 9:16 (`hero_end_box_mobile.png`, `hero_start_flat_mobile.png`), then the same video prompt. If you skip this, I'll centre-crop the 16:9 version for mobile.

---

## SECTION 4 — THE UNBOXING (Rigid box)

### R-1 · `assets/images/rigid_closed.png`
- **Type:** image · **Aspect:** 16:9
- **Used for:** Rigid product card in Product Lines + start frame of the unboxing video.

**Prompt:**
> A luxury rigid gift box with a separate lift-off lid, wrapped in deep charcoal soft-touch paper with a velvety matte texture, closed, resting on a matte dark charcoal surface. A subtle blind-embossed geometric crease pattern on the lid, and a thin hot-foil stamped line in warm vermilion-red around the lid edge as the only accent. Centered in the frame, occupying about 35% of the frame width, generous negative space on both sides. Camera at a three-quarter elevated angle, about 25 degrees above the box, 85mm lens. Light rakes across the lid to reveal the embossing and the soft-touch texture. Quiet, expensive, jewellery-like.
> **STYLE:** premium product cinematography, seamless warm charcoal studio background (#141210) falling off to near-black at the edges, soft diffused key light from upper left, gentle warm rim light from behind right, muted warm palette of natural kraft brown, bone white and deep charcoal with a single small vermilion-red accent, shallow depth of field, 85mm lens look, subtle fine film grain, soft contrast, photorealistic, high detail, no text, no letters, no logos, no watermarks, no people, no hands.

### R-V · `assets/videos/rigid_unbox.mp4` 🎬 scroll-scrubbed
- **Type:** video · **Aspect:** 16:9 · **Length:** 8 s
- **How:** Flow → **Frames to Video** → **start frame = `rigid_closed`** (no end frame).

**Prompt:**
> Very slow, subtle camera push-in toward the box, almost static. The lid of the luxury charcoal rigid gift box slowly lifts straight up by itself and floats upward out of the top of the frame, revealing the inside: bone-white folded tissue paper sealed with a small vermilion-red sticker, nested in a kraft-brown interior tray. As the lid rises the tissue paper gently parts open, revealing an empty sculpted cradle ready for a product. Smooth, weightless, even-speed motion across the full 8 seconds. Background and lighting stay perfectly constant. One continuous shot, no cuts. Anticipation, luxury, ritual.
> **STYLE:** premium product cinematography, seamless warm charcoal studio background (#141210) falling off to near-black at the edges, soft diffused key light from upper left, gentle warm rim light from behind right, muted warm palette of natural kraft brown, bone white and deep charcoal with a single small vermilion-red accent, shallow depth of field, 85mm lens look, subtle fine film grain, soft contrast, photorealistic, high detail, no text, no letters, no logos, no watermarks, no people, no hands.

---

## SECTION 5 — PROCESS: Design → Prototype → Print → Produce → Deliver

### P-V · `assets/videos/process_line.mp4` 🎬 scroll-scrubbed
- **Type:** video · **Aspect:** 16:9 · **Length:** 8 s
- **How:** Flow → **Text to Video**. (Optional: first make a still with the same prompt as an image, then use Frames to Video with it as the start frame for better quality control. That still doesn't need to be saved in the project.)
- The five steps will be **overlaid as HTML text** on this shot, so it only needs to *feel* like a continuous journey through the factory.

**Prompt:**
> A slow, smooth, continuous lateral tracking shot moving from left to right, at a constant speed, along a clean, modern, dimly lit premium packaging factory line at night. In the foreground, flat sheets of kraft cardboard travel along a conveyor; the camera passes a large offset printing press with softly glowing rollers, then a die-cutting station with a precise steel cutting form, then a folder-gluer where flat blanks become boxes, ending on a neat stack of finished kraft boxes on a pallet. Warm pools of light over each machine separated by darkness, faint dust in the light beams, a few small vermilion-red indicator lights on the machines. Camera at waist height, 35mm lens, shallow depth of field, no camera shake. One continuous shot, no cuts, no people. Precise, calm, industrial elegance.
> **STYLE:** premium product cinematography, seamless warm charcoal studio background (#141210) falling off to near-black at the edges, soft diffused key light from upper left, gentle warm rim light from behind right, muted warm palette of natural kraft brown, bone white and deep charcoal with a single small vermilion-red accent, shallow depth of field, 85mm lens look, subtle fine film grain, soft contrast, photorealistic, high detail, no text, no letters, no logos, no watermarks, no people, no hands.

*(The prompt says 35mm and the style line says 85mm look. That's fine: the scene needs the wider lens and the style line keeps the shallow-focus grade. If Veo gets confused, delete "85mm lens look," from the style line for this one prompt only.)*

---

## SECTION 6 — SUSTAINABILITY

### E-1 · `assets/images/eco_start.png`
- **Type:** image · **Aspect:** 16:9
- **Used for:** start frame of the eco video + reduced-motion fallback.

**Prompt:**
> A simple natural kraft cardboard mailer box, slightly worn and used, resting on a bed of rich dark moist soil with a few fallen dry leaves, on a dark studio set. Centered in the frame, occupying about 30% of the frame width, generous negative space. Camera at a low three-quarter angle, about 15 degrees above the soil, 85mm lens. A thin vermilion-red tear strip on the box as the only accent. A soft warm light beam falls on the box from upper left, like early morning light in a forest, with darkness around it. Quiet and hopeful.
> **STYLE:** premium product cinematography, seamless warm charcoal studio background (#141210) falling off to near-black at the edges, soft diffused key light from upper left, gentle warm rim light from behind right, muted warm palette of natural kraft brown, bone white and deep charcoal with a single small vermilion-red accent, shallow depth of field, 85mm lens look, subtle fine film grain, soft contrast, photorealistic, high detail, no text, no letters, no logos, no watermarks, no people, no hands.

### E-V · `assets/videos/eco_return.mp4` 🎬 scroll-scrubbed
- **Type:** video · **Aspect:** 16:9 · **Length:** 8 s
- **How:** Flow → **Frames to Video** → **start frame = `eco_start`** (no end frame).

**Prompt:**
> Locked-off static camera, no camera movement. Smooth time-lapse: the kraft cardboard box slowly softens, sags and breaks down, returning into the dark soil, while small fresh green seedlings and delicate moss sprout and grow up through and around it, unfurling their first leaves toward the warm light beam. By the end, only a faint kraft-coloured trace remains among a small cluster of young green plants. Even, gradual transformation across the full 8 seconds, no sudden changes. Lighting and background stay constant. One continuous shot, no cuts. Regenerative, calm, hopeful.
> **STYLE:** premium product cinematography, seamless warm charcoal studio background (#141210) falling off to near-black at the edges, soft diffused key light from upper left, gentle warm rim light from behind right, muted warm palette of natural kraft brown, bone white and deep charcoal with a single small vermilion-red accent, shallow depth of field, 85mm lens look, subtle fine film grain, soft contrast, photorealistic, high detail, no text, no letters, no logos, no watermarks, no people, no hands.

---

## SECTION 3 — PRODUCT LINES (4 cards: Corrugated · Rigid · Flexible · Kraft)
*(The Rigid card uses `rigid_closed.png` from Section 4, so there are only 3 new images here.)*
These are shown in tall panels with parallax, so **keep extra empty space above and below the subject** (the image is cropped and moved vertically).

### PL-1 · `assets/images/product_corrugated.png`
- **Type:** image · **Aspect:** 16:9 (I'll crop to portrait panels)

**Prompt:**
> A sculptural stack of three custom corrugated shipping boxes in natural kraft brown, of different sizes, stacked slightly offset like an architectural composition, on a matte dark charcoal surface. The front box is open with one flap raised, revealing the clean wavy flute structure in its cut edge. A thin vermilion-red tape line on one box as the only accent. Centered, occupying about 35% of the frame width, lots of empty space above and around. Camera at eye level, slightly low angle, 85mm lens, giving the boxes a monumental, architectural feel. Strong, honest, engineered.
> **STYLE:** premium product cinematography, seamless warm charcoal studio background (#141210) falling off to near-black at the edges, soft diffused key light from upper left, gentle warm rim light from behind right, muted warm palette of natural kraft brown, bone white and deep charcoal with a single small vermilion-red accent, shallow depth of field, 85mm lens look, subtle fine film grain, soft contrast, photorealistic, high detail, no text, no letters, no logos, no watermarks, no people, no hands.

### PL-2 · `assets/images/product_flexible.png`
- **Type:** image · **Aspect:** 16:9

**Prompt:**
> Three premium printed stand-up flexible pouches with resealable zip tops, standing upright in a slightly staggered row on a matte dark charcoal surface: one in matte bone white, one in matte kraft-paper finish, one in deep charcoal with a glossy spot-UV geometric pattern catching the light. Small vermilion-red tear notches as the only accent. Plain surfaces, no printed text or logos. Centered, occupying about 35% of the frame width, lots of empty space around. Camera at eye level, 85mm lens, raking light showing the difference between matte and gloss finishes. Tactile, modern, refined.
> **STYLE:** premium product cinematography, seamless warm charcoal studio background (#141210) falling off to near-black at the edges, soft diffused key light from upper left, gentle warm rim light from behind right, muted warm palette of natural kraft brown, bone white and deep charcoal with a single small vermilion-red accent, shallow depth of field, 85mm lens look, subtle fine film grain, soft contrast, photorealistic, high detail, no text, no letters, no logos, no watermarks, no people, no hands.

### PL-3 · `assets/images/product_kraft.png`
- **Type:** image · **Aspect:** 16:9

**Prompt:**
> An eco packaging set in unbleached natural kraft paper: a folding carton, a molded pulp insert tray with an organic curved shape, and a paper-based mailer tied with plain natural jute twine, arranged together in a calm balanced composition on a matte dark charcoal surface, with a single small sprig of fresh green eucalyptus as a natural accent and a thin vermilion-red twine knot. Visible fibrous paper texture. Centered, occupying about 35% of the frame width, lots of empty space around. Camera at a three-quarter elevated angle, 85mm lens. Honest, natural, considered.
> **STYLE:** premium product cinematography, seamless warm charcoal studio background (#141210) falling off to near-black at the edges, soft diffused key light from upper left, gentle warm rim light from behind right, muted warm palette of natural kraft brown, bone white and deep charcoal with a single small vermilion-red accent, shallow depth of field, 85mm lens look, subtle fine film grain, soft contrast, photorealistic, high detail, no text, no letters, no logos, no watermarks, no people, no hands.

---

## SECTION 7 — INDUSTRIES SERVED

### I-1 · `assets/images/industries_flatlay.png`
- **Type:** image · **Aspect:** 16:9
- **Used for:** big clip-path reveal + parallax behind the industries list.

**Prompt:**
> Top-down overhead flat-lay photograph on a matte dark charcoal surface: a precise grid-like arrangement of unbranded premium packaging from four industries. A small food carton and a coffee pouch (food & beverage), a slim rigid cosmetics box with a glass serum bottle nestled in a kraft insert (beauty), a multipack sleeve of cartons (FMCG), and an open kraft e-commerce mailer box with bone-white tissue paper (e-commerce). Materials: kraft brown, bone white, deep charcoal, with one small vermilion-red accent sticker. All packaging plain with no text or logos. Evenly spaced with clean gaps, like an organised design studio layout, filling the frame edge to edge. Straight overhead camera, 50mm lens, even soft light. Orderly, curated, editorial.
> **STYLE:** premium product cinematography, seamless warm charcoal studio background (#141210) falling off to near-black at the edges, soft diffused key light from upper left, gentle warm rim light from behind right, muted warm palette of natural kraft brown, bone white and deep charcoal with a single small vermilion-red accent, shallow depth of field, 85mm lens look, subtle fine film grain, soft contrast, photorealistic, high detail, no text, no letters, no logos, no watermarks, no people, no hands.

*(For this flat-lay, if everything except the centre is blurry, delete "shallow depth of field," from the style line for this one prompt.)*

---

## ✅ Checklist: what should be in the folder

```
assets/images/
  hero_end_box.png
  hero_start_flat.png
  rigid_closed.png
  eco_start.png
  product_corrugated.png
  product_flexible.png
  product_kraft.png
  industries_flatlay.png

assets/videos/
  hero_fold.mp4
  rigid_unbox.mp4
  process_line.mp4
  eco_return.mp4
  (optional) hero_fold_mobile.mp4
```

### Quality check before you say "assets ready"
- [ ] No garbled text or fake logos anywhere (regenerate if there are)
- [ ] Each video is one continuous shot with smooth, even motion and no cuts
- [ ] Background stays stable in each video (no flicker or colour shift)
- [ ] Subject is centred with empty space on the sides
- [ ] Kraft colour and charcoal background look consistent across all 12 files
- [ ] Tell me if you generated the hero video **reversed** (unfolding) so I can flip it
