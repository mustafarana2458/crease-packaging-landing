import { gsap } from 'gsap';
import { $ } from './utils.js';

/**
 * Draws the dieline and counts 000 → 100 while the hero's coarse frame pass loads.
 * Resolves once the counter has reached 100 (never earlier than `minTime`).
 */
export function runPreloader(seq, { minTime = 1.2, maxTime = 12 } = {}) {
  const root = $('.preloader');
  const count = $('.preloader__count', root);
  const cut = $('.pl-cut', root);
  const crease = $('.pl-crease', root);
  const shown = { v: 0 };
  const start = performance.now();

  return new Promise((resolve) => {
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      const timeCap = Math.min(1, elapsed / minTime);
      const target = elapsed > maxTime ? 1 : Math.min(seq.readyProgress, timeCap);
      shown.v += (target - shown.v) * 0.12;
      if (target === 1 && shown.v > 0.995) shown.v = 1;

      count.textContent = String(Math.round(shown.v * 100)).padStart(3, '0');
      cut.style.strokeDashoffset = 1 - Math.min(1, shown.v * 1.15);
      crease.style.opacity = shown.v > 0.8 ? (shown.v - 0.8) * 5 : 0;

      if (shown.v === 1) {
        gsap.ticker.remove(tick);
        resolve();
      }
    };
    gsap.ticker.add(tick);
  });
}

export function hidePreloader() {
  const root = $('.preloader');
  return gsap
    .timeline({ onComplete: () => root.remove() })
    .to(root.children, { autoAlpha: 0, y: -12, duration: 0.5, ease: 'power2.in', stagger: 0.05 })
    .to(root, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '-=0.1');
}
