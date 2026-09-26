import { gsap } from 'gsap';
import { $, $$, isPortrait } from '../lib/utils.js';

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
      seq.seek(frame.p);
      bar.style.transform = `scaleX(${frame.p})`;
      show(Math.min(steps.length - 1, Math.floor(frame.p * steps.length)));
    },
  });
}
