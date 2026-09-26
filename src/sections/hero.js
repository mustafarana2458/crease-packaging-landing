import { gsap } from 'gsap';
import { $, $$, isPortrait } from '../lib/utils.js';

// The clip is trimmed at source frame 165 (see scripts/build-media.mjs).
// From frame 124 the lid swings shut about twice as fast as the rest of the fold.
const KNEE = 124 / 165; // share of the clip before the lid rush
const KNEE_AT = 0.55; // share of the fold scroll spent reaching it
const FOLD = 0.8; // share of the pinned scroll that plays the fold; the rest holds the final frame

const easeOut = gsap.parseEase('power2.out');

/**
 * Scroll (0–1 of the fold) → clip position (0–1). Linear up to the knee, then the
 * lid gets 45% of the scroll and eases out, so it settles instead of slamming.
 * Slope is ~1.37 before the knee and ~1.1 after it, so there is no visible jolt.
 */
function foldCurve(s) {
  if (s <= KNEE_AT) return (s / KNEE_AT) * KNEE;
  return KNEE + (1 - KNEE) * easeOut((s - KNEE_AT) / (1 - KNEE_AT));
}

/**
 * Pinned ~380vh. The canvas scrubs flat → folded; the headline's two lines
 * split apart to make room for the box; spec labels arrive as the lid lands,
 * and the finished box holds still for the last fifth of the pin.
 */
export function initHero(seq) {
  const section = $('.hero');
  const stage = $('.hero__stage', section);
  const [l1, l2] = $$('.hero__line', section);
  const specs = $$('.hero__specs li', section);
  const fades = $$('.hero__lede, .hero__meta, .hero__scroll', section);
  const portrait = isPortrait();
  const frame = { p: 0 };

  gsap.set(specs, { autoAlpha: 0, x: (i, el) => (el.classList.contains('is-right') ? 12 : -12) });

  /**
   * End offsets for the two headline lines, measured from the untransformed
   * layout (offset* ignores transforms), so both lines always stop fully inside
   * the viewport: line 1 just under the nav, line 2 just above the bottom edge.
   * Horizontally they drift apart but never closer than --pad to the edges.
   */
  const title = $('.hero__title', section);
  const splitTargets = () => {
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const pad = parseFloat(getComputedStyle(section).getPropertyValue('--pad')) || 24;
    const nav = $('.nav').offsetHeight;
    const titleTop = title.offsetTop - title.offsetHeight / 2; // title is centred with translate: 0 -50%
    const top1 = titleTop + l1.offsetTop;
    const bottom2 = titleTop + l2.offsetTop + l2.offsetHeight;
    const w1 = l1.firstElementChild.offsetWidth;
    const w2 = l2.firstElementChild.offsetWidth;
    const room1 = Math.max(0, (W - w1) / 2 - pad);
    const room2 = Math.max(0, (W - w2) / 2 - pad);
    return {
      y1: Math.min(0, nav + H * 0.02 - top1),
      y2: Math.max(0, H - H * 0.03 - bottom2),
      x1: portrait ? 0 : -Math.min(W * 0.17, room1),
      x2: portrait ? 0 : Math.min(W * 0.15, room2),
    };
  };

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      // longer than before so the fold itself keeps roughly the same scroll length
      end: () => '+=' + window.innerHeight * (portrait ? 1.9 : 2.8),
      pin: stage,
      scrub: 0.5,
      invalidateOnRefresh: true,
    },
  });

  tl.to(frame, { p: 1, duration: FOLD, onUpdate: () => seq.seek(foldCurve(frame.p)) }, 0)
    .to(fades, { autoAlpha: 0, y: 16, duration: 0.12 }, 0.02)
    .to(l1, {
      y: () => splitTargets().y1,
      x: () => splitTargets().x1,
      duration: 0.5, ease: 'power1.inOut',
    }, 0.1)
    .to(l2, {
      y: () => splitTargets().y2,
      x: () => splitTargets().x2,
      duration: 0.5, ease: 'power1.inOut',
    }, 0.1)
    .to(specs, { autoAlpha: 1, x: 0, duration: 0.08, stagger: 0.025 }, FOLD - 0.1)
    .to({}, { duration: 1 - FOLD }, FOLD); // hold: last clean frame, box sits still

  return tl;
}

/** Plays once, right after the preloader lifts. */
export function heroIntro() {
  const section = $('.hero');
  return gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from($('.seq-media', section), { scale: 1.08, autoAlpha: 0, duration: 1.8 }, 0)
    .from($$('.hero__line > span', section), { yPercent: 115, duration: 1.4, stagger: 0.12 }, 0.2)
    .from($$('.hero__lede, .hero__meta, .hero__scroll', section), { autoAlpha: 0, y: 14, duration: 1, stagger: 0.06 }, 0.7)
    .from('.nav', { autoAlpha: 0, duration: 1 }, 0.7)
    .from($$('.crop-marks i', section), { scale: 0, duration: 1, stagger: 0.05 }, 0.8);
}
