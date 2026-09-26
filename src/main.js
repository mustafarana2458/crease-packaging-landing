import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import { FrameSequence } from './lib/sequence.js';
import { initSmoothScroll, initNav } from './lib/scroll.js';
import { runPreloader, hidePreloader } from './lib/preloader.js';
import { initCursor } from './lib/cursor.js';
import { $$ } from './lib/utils.js';

import { initHero, heroIntro } from './sections/hero.js';
import { initProducts } from './sections/products.js';
import { initUnbox } from './sections/unbox.js';
import { initProcess } from './sections/process.js';
import { initEco } from './sections/eco.js';
import { initQuotes } from './sections/quotes.js';
import { initForm } from './sections/form.js';
import {
  initHeadings, initManifesto, initIndustries, initNumbers, initCta, initFooter, initBackgrounds,
} from './sections/content.js';

const root = document.documentElement;
const reducedMotion = root.classList.contains('rm');

if (reducedMotion) {
  // Static page: no pinning, no scrubbing, stills instead of sequences.
  initNav(null);
  initForm({ animate: false });
} else {
  start();
}

async function start() {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  root.classList.add('is-loading');

  const lenis = initSmoothScroll();
  lenis.stop();

  const seq = {};
  $$('canvas[data-seq]').forEach((c) => (seq[c.dataset.seq] = new FrameSequence(c.dataset.seq, c)));
  seq.hero.load(8);

  // Fonts must be in before SplitText measures lines.
  await document.fonts.ready;

  // Build order matters: pins top-to-bottom, then everything that measures positions after them.
  initHero(seq.hero);
  initManifesto();
  initProducts();
  initUnbox(seq.unbox);
  initProcess(seq.process);
  initEco(seq.eco);
  initIndustries();
  initNumbers();
  initQuotes(lenis);
  initCta();
  initFooter();
  initHeadings();
  initBackgrounds();
  initForm();
  initNav(lenis);
  initCursor();
  ScrollTrigger.refresh();

  await runPreloader(seq.hero);
  root.classList.remove('is-loading');
  hidePreloader();
  heroIntro();
  lenis.start();

  lazyLoadSequences(seq);
}

/**
 * Below-the-fold sequences load one after another once the hero is complete,
 * and any of them jumps the queue when the user gets within ~2 screens of it.
 */
function lazyLoadSequences(seq) {
  const queue = ['unbox', 'process', 'eco'];
  queue.forEach((id) => {
    ScrollTrigger.create({
      trigger: seq[id].canvas.closest('section'),
      start: 'top 300%',
      once: true,
      onEnter: () => seq[id].load(),
    });
  });
  queue.reduce((chain, id) => chain.then(() => seq[id].load()).then(() => seq[id].complete), seq.hero.complete);
}
