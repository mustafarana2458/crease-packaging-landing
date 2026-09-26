import { gsap } from 'gsap';
import { $, $$ } from '../lib/utils.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MESSAGES = {
  name: 'Please add your name.',
  company: 'Which company is this for?',
  email: 'Enter a valid work email, e.g. name@company.com.',
  industry: 'Choose an industry.',
  line: 'Choose a product line, or “Not sure yet”.',
  quantity: 'Choose an approximate quantity.',
};

/** Front-end validation only; the success state closes a little box. */
export function initForm({ animate = true } = {}) {
  const form = $('.form');
  const fields = $$('[required]', form);
  const success = $('.form__success', form);

  const check = (input) => {
    const v = input.value.trim();
    const ok = input.type === 'email' ? EMAIL.test(v) : v.length > 0;
    const field = input.closest('.field');
    field.classList.toggle('is-invalid', !ok);
    input.setAttribute('aria-invalid', String(!ok));
    $('.field__error', field).textContent = ok ? '' : MESSAGES[input.name];
    return ok;
  };

  fields.forEach((input) => {
    const error = $('.field__error', input.closest('.field'));
    error.id = input.id + '-error';
    input.setAttribute('aria-describedby', error.id);
    input.addEventListener('blur', () => input.dataset.touched && check(input));
    input.addEventListener('input', () => { input.dataset.touched = '1'; if (input.closest('.is-invalid')) check(input); });
    input.addEventListener('change', () => { input.dataset.touched = '1'; check(input); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const invalid = fields.filter((f) => !check(f));
    if (invalid.length) {
      invalid[0].focus();
      if (animate) gsap.fromTo(form, { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      return;
    }
    success.hidden = false;
    const heading = $('h3', success);
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
    if (!animate) return;
    gsap.timeline()
      .from(success, { autoAlpha: 0, duration: 0.4 })
      .fromTo('.sb-lid', { scaleY: 1, svgOrigin: '60 45' }, { scaleY: 0, duration: 0.9, ease: 'expo.inOut' }, 0.2)
      .from('.sb-strip', { scaleX: 0, transformOrigin: 'left center', duration: 0.6, ease: 'expo.out' }, 0.95)
      .from($$('h3, p', success), { autoAlpha: 0, y: 14, stagger: 0.08, duration: 0.8, ease: 'expo.out' }, 1.05);
  });
}
