import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$ } from './utils.js';

/** Lenis smooth scroll driven by GSAP's ticker, so ScrollTrigger and Lenis share one clock. */
export function initSmoothScroll() {
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 }); // touch keeps native scrolling
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const el = id.length > 1 && $(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { duration: 1.6 });
      if (id !== '#top') el.setAttribute('tabindex', '-1'), el.focus({ preventScroll: true });
    });
  });
  return lenis;
}

/** Nav: glass background once scrolled, hides on scroll down, returns on scroll up. */
export function initNav(lenis) {
  const nav = $('[data-nav]');
  let last = 0;
  const update = (y) => {
    nav.classList.toggle('is-scrolled', y > 40);
    const down = y > last + 2;
    const up = y < last - 2;
    if (down && y > window.innerHeight * 0.8) nav.classList.add('is-hidden');
    else if (up || y < 80) nav.classList.remove('is-hidden');
    last = y;
  };
  if (lenis) lenis.on('scroll', ({ scroll }) => update(scroll));
  else window.addEventListener('scroll', () => update(window.scrollY), { passive: true });
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));
  update(window.scrollY);
}
