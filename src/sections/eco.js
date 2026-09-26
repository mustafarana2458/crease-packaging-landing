import { gsap } from 'gsap';
import { $, $$, clamp, isPortrait } from '../lib/utils.js';

/** Pinned ~250vh on kraft. The box returns to soil while three stats count up alongside. */
export function initEco(seq) {
  const section = $('.eco');
  const stage = $('.eco__stage', section);
  // prefix (e.g. "−") is only drawn once the value is non-zero, so we never show "−0"
  const counters = $$('[data-count]', section).map((el) => ({ el, to: +el.dataset.count, prefix: el.dataset.prefix || '' }));
  const week = $('.eco__week', section);
  const frame = { p: 0 };

  const paint = (p) => {
    counters.forEach(({ el, to, prefix }, i) => {
      // staggered: each stat finishes a little later than the last
      const t = clamp((p - i * 0.12) / 0.6);
      const v = Math.round(to * gsap.parseEase('power2.out')(t));
      el.textContent = (v ? prefix : '') + v;
    });
    week.textContent = 'WEEK ' + String(Math.round(p * 12)).padStart(2, '0');
  };
  paint(0);

  gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => '+=' + window.innerHeight * (isPortrait() ? 1.2 : 1.5),
      pin: stage,
      scrub: 0.5,
      invalidateOnRefresh: true,
    },
  }).to(frame, { p: 1, duration: 1, ease: 'none', onUpdate: () => { seq.seek(frame.p); paint(frame.p); } });

  gsap.from($$('.crop-marks i', section), {
    scale: 0, duration: 1, stagger: 0.08, ease: 'expo.out',
    scrollTrigger: { trigger: section, start: 'top 60%', once: true },
  });
}
