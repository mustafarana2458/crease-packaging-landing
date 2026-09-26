import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$ } from '../lib/utils.js';

/**
 * Endless typographic drift. Speed follows scroll velocity (either direction
 * pushes it along), and the row can be dragged. Only ticks while on screen.
 */
export function initQuotes(lenis) {
  const viewport = $('.quotes__viewport');
  const trackEl = $('.quotes__track', viewport);
  const originals = $$('.quote', trackEl);
  originals.forEach((q) => {
    const c = q.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    trackEl.appendChild(c);
  });

  let x = 0;
  let loop = trackEl.scrollWidth / 2;
  let boost = 0;
  let dragging = false;
  let lastX = 0;
  let fling = 0;
  const base = 0.045; // px per ms

  const setX = gsap.quickSetter(trackEl, 'x', 'px');

  const tick = (time, dt) => {
    if (!dragging) {
      const v = Math.abs(lenis?.velocity || 0);
      boost += (Math.min(v, 60) * 0.02 - boost) * 0.08;
      x -= (base + boost) * dt + fling;
      fling *= 0.92;
    }
    setX(gsap.utils.wrap(-loop, 0, x));
  };

  ScrollTrigger.create({
    trigger: viewport,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
    onRefresh: () => { loop = trackEl.scrollWidth / 2; },
  });

  viewport.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    fling = 0;
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const d = e.clientX - lastX;
    lastX = e.clientX;
    x += d;
    fling = -d * 0.6;
  });
  const end = () => { dragging = false; viewport.classList.remove('is-dragging'); };
  viewport.addEventListener('pointerup', end);
  viewport.addEventListener('pointercancel', end);
}
