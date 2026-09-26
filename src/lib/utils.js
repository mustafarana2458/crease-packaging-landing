export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Portrait layout: square frames, stacked overlays, shorter pins. Read once; a rotate reloads layout via refresh. */
export const isPortrait = () => window.matchMedia('(max-aspect-ratio: 1/1)').matches;

export const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * Linear interpolation along keyframes [[p, x, y], ...] sorted by p.
 * Used to make hotspots follow objects that drift during a clip.
 */
export function track(keys, p) {
  if (p <= keys[0][0]) return [keys[0][1], keys[0][2]];
  for (let i = 1; i < keys.length; i++) {
    const [p1, x1, y1] = keys[i];
    if (p <= p1) {
      const [p0, x0, y0] = keys[i - 1];
      const t = (p - p0) / (p1 - p0 || 1);
      return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
    }
  }
  const last = keys[keys.length - 1];
  return [last[1], last[2]];
}
