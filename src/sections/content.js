import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { $, $$ } from '../lib/utils.js';

/** Headings reveal line by line from a mask. Re-splits on resize. */
export function initHeadings() {
  $$('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.09,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }),
    });
  });

  $$('.eyebrow').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0, x: -12, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

/** Manifesto: words fill from mute to bone as you scroll. */
export function initManifesto() {
  const text = $('[data-fill]');
  const split = SplitText.create(text, { type: 'words', wordsClass: 'word' });
  gsap.to(split.words, {
    color: '#F2EDE4',
    stagger: 0.12,
    ease: 'none',
    scrollTrigger: { trigger: text, start: 'top 78%', end: 'bottom 48%', scrub: true },
  });
  gsap.fromTo('.manifesto .crease-line i', { scaleX: 0 }, {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: '.manifesto .crease-line', start: 'top 92%', end: 'top 50%', scrub: true },
  });
}

/** Flat-lay unfolds with clip-path and parallaxes; rows are CSS hover. */
export function initIndustries() {
  const media = $('.industries__media');
  gsap.fromTo(media, { clipPath: 'inset(16% 22% 16% 22%)' }, {
    clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
    scrollTrigger: { trigger: media, start: 'top 92%', end: 'top 22%', scrub: true },
  });
  gsap.fromTo($('img', media), { yPercent: -7 }, {
    yPercent: 7, ease: 'none',
    scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true },
  });
  gsap.from($$('.industry'), {
    autoAlpha: 0, y: 40, duration: 1.1, stagger: 0.08, ease: 'expo.out',
    scrollTrigger: { trigger: '.industries__list', start: 'top 85%', once: true },
  });
}

/** Counters scrub with scroll (so they also run backwards). */
export function initNumbers() {
  $$('[data-scrub-count]').forEach((el) => {
    const to = +el.dataset.scrubCount;
    const dec = +(el.dataset.decimals || 0);
    const o = { v: 0 };
    el.textContent = (0).toFixed(dec);
    gsap.to(o, {
      v: to, ease: 'power1.out',
      onUpdate: () => (el.textContent = o.v.toFixed(dec)),
      scrollTrigger: { trigger: el.closest('.number'), start: 'top 88%', end: 'top 42%', scrub: 0.6 },
    });
  });
}

/** CTA: the finished box scales up behind the headline. */
export function initCta() {
  gsap.fromTo('.cta__bg img', { scale: 1 }, {
    scale: 1.22, ease: 'none',
    scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true },
  });
  gsap.from('.form', {
    autoAlpha: 0, y: 48, duration: 1.2, ease: 'expo.out',
    scrollTrigger: { trigger: '.form', start: 'top 85%', once: true },
  });
}

/** Footer: wordmark rises letter by letter, then a crease line cuts through it. */
export function initFooter() {
  const word = $('.wordmark span');
  const split = SplitText.create(word, { type: 'chars', mask: 'chars' });
  const line = $('.wordmark__crease line');
  gsap.set(line, { strokeDashoffset: 1 });
  gsap.timeline({ scrollTrigger: { trigger: '.wordmark', start: 'top 85%', once: true } })
    .from(split.chars, { yPercent: 100, duration: 1.3, stagger: 0.06, ease: 'expo.out' })
    .to(line, { strokeDashoffset: 0, duration: 1.2, ease: 'expo.inOut' }, 0.5);
}

/**
 * Page background tweens between sections (carbon → graphite → kraft → bone …),
 * never a hard cut. Created last, after all pins, so start positions are correct.
 */
export function initBackgrounds() {
  const colors = {
    carbon: '#0F0E0C', graphite: '#1C1A17', bone: '#F2EDE4', kraft: '#B8875A',
  };
  const sections = $$('[data-bg]');
  gsap.set(document.body, { backgroundColor: colors[sections[0].dataset.bg] });
  sections.forEach((s, i) => {
    if (!i) return;
    const from = colors[sections[i - 1].dataset.bg];
    const to = colors[s.dataset.bg];
    if (from === to) return;
    gsap.fromTo(document.body, { backgroundColor: from }, {
      backgroundColor: to, ease: 'none', immediateRender: false,
      scrollTrigger: { trigger: s, start: 'top 80%', end: 'top 30%', scrub: true },
    });
  });
}
