import { gsap } from 'gsap';
import { $, $$, isPortrait, track } from '../lib/utils.js';

/**
 * Pinned ~250vh. Lid lifts; numbered hotspots with drawn leader lines appear
 * inside their progress windows and follow the object they describe.
 */
export function initUnbox(seq) {
  const section = $('.unbox');
  const stage = $('.unbox__stage', section);
  const caption = $('.unbox__caption', section);
  const frame = { p: 0 };

  const spots = $$('.hotspot', section).map((el) => ({
    el,
    from: +el.dataset.in,
    to: +el.dataset.out,
    keys: el.dataset.track.trim().split(/\s+/).map((k) => k.split(',').map(Number)),
    title: $('strong', el).textContent,
    text: $('.hotspot__label > span', el).textContent,
    num: $('.hotspot__dot b', el).textContent,
    on: false,
    tl: gsap.timeline({ paused: true })
      .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 })
      .from($('.hotspot__dot', el), { scale: 0, duration: 0.45, ease: 'back.out(2)' })
      .from($('.hotspot__line', el), { scaleX: 0, duration: 0.5, ease: 'expo.out' }, '-=0.2')
      .from($('.hotspot__label', el), { autoAlpha: 0, x: el.classList.contains('hotspot--left') ? 12 : -12, duration: 0.5, ease: 'expo.out' }, '-=0.35'),
  }));

  const place = (p) => {
    let changed = false;
    for (const s of spots) {
      const [x, y] = track(s.keys, p);
      const pt = seq.mapPoint(x, y);
      gsap.set(s.el, { x: pt.x, y: pt.y });
      const on = p >= s.from && p <= s.to;
      if (on !== s.on) {
        s.on = on;
        changed = true;
        on ? s.tl.timeScale(1).play() : s.tl.timeScale(1.8).reverse();
      }
    }
    if (changed && isPortrait()) {
      caption.innerHTML = spots.filter((s) => s.on)
        .map((s) => `<span><strong>${s.num} · ${s.title}</strong>${s.text}</span>`).join('');
    }
  };

  gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => '+=' + window.innerHeight * (isPortrait() ? 1.2 : 1.6),
      pin: stage,
      scrub: 0.5,
      invalidateOnRefresh: true,
      onRefresh: () => place(frame.p),
    },
  }).to(frame, { p: 1, duration: 1, ease: 'none', onUpdate: () => { seq.seek(frame.p); place(frame.p); } });

  place(0);
}
