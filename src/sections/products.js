import { gsap } from 'gsap';
import { $, $$, canHover } from '../lib/utils.js';

/**
 * Pinned horizontal scroll. Each card's media unfolds with clip-path as it
 * slides in; the image inside drifts the opposite way. Hover: 3D tilt + spec sheet.
 */
export function initProducts() {
  const section = $('.products');
  const track = $('.products__track', section);
  const cards = $$('.card', section);
  const current = $('.products__current', section);
  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

  const slide = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => '+=' + distance(),
      pin: $('.products__pin', section),
      scrub: 0.8,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        current.textContent = '0' + Math.min(cards.length, Math.floor(self.progress * cards.length) + 1);
      },
    },
  });

  cards.forEach((card) => {
    const media = $('.card__media', card);
    const img = $('img', card);
    const startsVisible = card.offsetLeft < window.innerWidth * 0.9;

    const unfold = { clipPath: 'inset(0% 100% 0% 0%)' };
    const done = { clipPath: 'inset(0% 0% 0% 0%)', ease: 'expo.out' };
    if (startsVisible) {
      gsap.fromTo(media, unfold, { ...done, duration: 1.4, delay: card.offsetLeft / window.innerWidth * 0.4,
        scrollTrigger: { trigger: section, start: 'top 65%', once: true } });
    } else {
      gsap.fromTo(media, unfold, { ...done, ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left 98%', end: 'left 55%', scrub: true } });
    }

    gsap.fromTo(img, { xPercent: 5 }, {
      xPercent: -5, ease: 'none',
      scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
    });

    // .card__spec is excluded: its hover reveal is a CSS opacity transition
    gsap.from($$('.card__body > :not(.card__spec)', card), {
      autoAlpha: 0, y: 24, duration: 1, stagger: 0.06, ease: 'expo.out',
      scrollTrigger: startsVisible
        ? { trigger: section, start: 'top 55%', once: true }
        : { trigger: card, containerAnimation: slide, start: 'left 80%', once: true },
    });

    if (canHover) {
      const rx = gsap.quickTo(media, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      const ry = gsap.quickTo(media, 'rotationY', { duration: 0.6, ease: 'power3.out' });
      card.addEventListener('pointermove', (e) => {
        const r = media.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 9);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 7);
      });
      card.addEventListener('pointerleave', () => { rx(0); ry(0); });
    }
  });
}
