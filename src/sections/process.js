import { gsap } from 'gsap';
import { $, $$, isPortrait } from '../lib/utils.js';

/**
 * Where each step lives in process_line (240 desktop frames), found by viewing the frames:
 *   Design     0–23   bare lit conveyor, flat pre-creased kraft blanks
 *   Prototype 24–47   sheets feed into the first unit as the press comes into view
 *   Print     48–111  press rollers close up, then the units' side frames + red status lamp
 *   Produce  112–191  converting line: blanks lift and fold into boxes (clearest ~150–175)
 *   Deliver  192–239  finished boxes stacked on a pallet
 * Stored as fractions of the clip so the half-length portrait set maps the same way.
 */
const CLIP_BOUNDS = [0, 24, 48, 112, 192, 240].map((f) => f / 240);

/**
 * Scroll share per step: halfway between equal (20% each) and the step's share of
 * the footage. Short scenes (Design) stay readable, and the tracking speed only
 * varies 0.67×–1.25× between steps instead of stopping and rushing.
 */
const SCROLL_BOUNDS = (() => {
  const n = CLIP_BOUNDS.length - 1;
  const out = [0];
  for (let i = 0; i < n; i++) {
    const share = 0.5 / n + 0.5 * (CLIP_BOUNDS[i + 1] - CLIP_BOUNDS[i]);
    out.push(out[i] + share);
  }
  out[n] = 1;
  return out;
})();

/** scroll progress (0–1) → { step index, clip position (0–1) } */
function mapScroll(p) {
  let i = 0;
  while (i < SCROLL_BOUNDS.length - 2 && p >= SCROLL_BOUNDS[i + 1]) i++;
  const t = (p - SCROLL_BOUNDS[i]) / (SCROLL_BOUNDS[i + 1] - SCROLL_BOUNDS[i]);
  return { step: i, clip: CLIP_BOUNDS[i] + t * (CLIP_BOUNDS[i + 1] - CLIP_BOUNDS[i]) };
}

/**
 * Pinned ~400vh. A slow tracking shot; the 5-step rail advances with scroll.
 *
 * Each .step (label + heading + body + meta) is one unit and only ever moves as
 * a whole. Changes are state-driven: every change kills the previous transition,
 * fades out *every* other step from wherever it currently is, and only then
 * brings the active step in. However fast or in whichever direction you scroll,
 * two steps never share the screen and no half-transitioned step is left behind.
 */
export function initProcess(seq) {
  const section = $('.process');
  const stage = $('.process__stage', section);
  const steps = $$('.step', section);
  const railItems = $$('.rail li', section);
  const bar = $('.rail__bar i', section);
  const frame = { p: 0 };
  let active = 0;
  let swap = null;

  // Rail columns follow the scroll shares, so a label lights up exactly when the bar reaches it
  $('.rail', section).style.gridTemplateColumns = SCROLL_BOUNDS.slice(1)
    .map((b, i) => `${(b - SCROLL_BOUNDS[i]).toFixed(4)}fr`).join(' ');

  gsap.set(steps, { autoAlpha: 0, y: 0 });
  gsap.set(steps[0], { autoAlpha: 1 });

  const show = (next) => {
    if (next === active) return;
    const dir = next > active ? 1 : -1;
    active = next;
    steps.forEach((s, i) => s.classList.toggle('is-active', i === next));
    railItems.forEach((li, i) => li.classList.toggle('is-active', i <= next));

    swap?.kill();
    gsap.killTweensOf(steps);
    const incoming = steps[next];
    const alpha = (s) => gsap.getProperty(s, 'autoAlpha');

    // Fast scrolls can leave several steps part-faded. Keep only the most visible
    // other step to fade out; cut everything else (including a half-visible
    // incoming step), so at most one step is ever on screen.
    const [fading] = steps.filter((s) => s !== incoming && alpha(s) > 0).sort((a, b) => alpha(b) - alpha(a));
    steps.forEach((s) => s !== fading && s !== incoming && gsap.set(s, { autoAlpha: 0, y: 0 }));

    swap = gsap.timeline();
    if (fading) {
      gsap.set(incoming, { autoAlpha: 0 });
      swap.to(fading, { autoAlpha: 0, y: -18 * dir, duration: 0.22, ease: 'power2.in' });
    }
    // Enter from below when moving forward, from above when moving back.
    // (If the incoming step is still partly visible and alone, it just continues.)
    if (alpha(incoming) === 0) swap.set(incoming, { y: 26 * dir });
    swap.to(incoming, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'expo.out' });
  };

  gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => '+=' + window.innerHeight * (isPortrait() ? 2 : 3),
      pin: stage,
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  }).to(frame, {
    p: 1, duration: 1, ease: 'none',
    onUpdate: () => {
      const { step, clip } = mapScroll(frame.p);
      seq.seek(clip);
      bar.style.transform = `scaleX(${frame.p})`;
      show(step);
    },
  });
}
