import { gsap } from 'gsap';
import { $, $$, canHover } from './utils.js';

/** Small dot that grows into a VIEW / DRAG label over [data-cursor] media. Desktop pointers only. */
export function initCursor() {
  if (!canHover) return;
  const el = $('.cursor');
  const label = $('.cursor__label', el);
  const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
  const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    el.classList.add('is-active');
    x(e.clientX);
    y(e.clientY);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => el.classList.remove('is-active'));

  $$('[data-cursor]').forEach((t) => {
    t.addEventListener('pointerenter', () => {
      label.textContent = t.dataset.cursor;
      el.classList.add('is-label');
    });
    t.addEventListener('pointerleave', () => el.classList.remove('is-label'));
  });
}
