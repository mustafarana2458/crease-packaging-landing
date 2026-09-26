import media from '../generated/media.json';

// Portrait screens get the square, every-2nd-frame set; everything else the 16:9 set.
export const VARIANT = window.matchMedia('(max-aspect-ratio: 1/1)').matches ? 'm' : 'd';

const pad = (n) => String(n).padStart(4, '0');

/**
 * Coarse-to-fine load order: every 8th frame first, then 4th, 2nd, 1st.
 * After the first pass the whole clip is scrubbable (at lower temporal
 * resolution) and fills in while the user is already scrolling.
 */
function progressiveOrder(count) {
  const seen = new Uint8Array(count);
  const order = [];
  let firstPass = 0;
  for (const stride of [8, 4, 2, 1]) {
    for (let i = 0; i < count; i += stride) {
      if (!seen[i]) { seen[i] = 1; order.push(i); }
    }
    if (!seen[count - 1]) { seen[count - 1] = 1; order.push(count - 1); }
    if (!firstPass) firstPass = order.length;
  }
  return { order, firstPass };
}

export class FrameSequence {
  /**
   * @param {string} id               key in media.json (hero, unbox, process, eco)
   * @param {HTMLCanvasElement} canvas
   */
  constructor(id, canvas) {
    const meta = media.sequences[id];
    this.id = id;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.variant = meta[VARIANT];
    this.count = this.variant.count;
    this.base = `${meta.path}/${VARIANT}/`;
    this.frames = new Array(this.count);
    this.loaded = new Uint8Array(this.count);
    this.loadedCount = 0;
    ({ order: this.order, firstPass: this.firstPass } = progressiveOrder(this.count));
    this.current = 0;
    this.drawn = -1;
    this.listeners = new Set();
    this._started = false;

    this.resize = this.resize.bind(this);
    new ResizeObserver(this.resize).observe(canvas);
  }

  onProgress(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }

  /** Fraction of the first (coarse) pass that has loaded, 0–1. */
  get readyProgress() { return Math.min(1, this.loadedCount / this.firstPass); }

  /** Starts loading (idempotent). Resolves when the coarse pass is in; `this.complete` resolves when every frame is. */
  load(concurrency = 6) {
    if (this._started) return this.ready;
    this._started = true;
    let resolveReady, resolveComplete;
    this.ready = new Promise((r) => (resolveReady = r));
    this.complete = new Promise((r) => (resolveComplete = r));

    let next = 0;
    let settled = 0;
    const pump = () => {
      if (next >= this.order.length) return;
      const i = this.order[next++];
      const img = new Image();
      img.decoding = 'async';
      img.src = this.base + pad(i) + '.webp';
      const done = (ok) => {
        settled++;
        if (ok) {
          this.frames[i] = img;
          this.loaded[i] = 1;
          this.loadedCount++;
          // a better frame for the current position may have just arrived
          if (Math.abs(i - this.current) < Math.abs(this.drawn - this.current) || this.drawn < 0) this.render();
        }
        this.listeners.forEach((fn) => fn(this.readyProgress, this));
        if (settled === this.firstPass) resolveReady();
        if (settled === this.order.length) { resolveReady(); resolveComplete(); }
        pump();
      };
      img.decode().then(() => done(true), () => done(false));
    };
    for (let k = 0; k < concurrency; k++) pump();
    return this.ready;
  }

  /** @param {number} p progress 0–1 */
  seek(p) {
    this.current = Math.round(Math.min(1, Math.max(0, p)) * (this.count - 1));
    this.render();
  }

  nearestLoaded(i) {
    if (this.loaded[i]) return i;
    for (let d = 1; d < this.count; d++) {
      if (i - d >= 0 && this.loaded[i - d]) return i - d;
      if (i + d < this.count && this.loaded[i + d]) return i + d;
    }
    return -1;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(this.canvas.clientWidth * dpr);
    const h = Math.round(this.canvas.clientHeight * dpr);
    if (!w || !h || (w === this.canvas.width && h === this.canvas.height)) return;
    this.canvas.width = w;
    this.canvas.height = h;
    this.drawn = -1;
    this.render();
  }

  /** Cover-fit geometry of the frame inside the canvas, in CSS pixels. */
  get fit() {
    const cw = this.canvas.clientWidth;
    const ch = this.canvas.clientHeight;
    const { w, h } = this.variant;
    const s = Math.max(cw / w, ch / h);
    return { s, dx: (cw - w * s) / 2, dy: (ch - h * s) / 2 };
  }

  /**
   * Maps a point given in the ORIGINAL 16:9 frame (0–1) to CSS px inside the canvas,
   * accounting for the square crop used on portrait screens.
   */
  mapPoint(x, y) {
    const { s, dx, dy } = this.fit;
    const { w, h, cropX } = this.variant;
    const fx = cropX === undefined ? x : (x - cropX) / (1 - 2 * cropX);
    return { x: dx + fx * w * s, y: dy + y * h * s };
  }

  render() {
    const i = this.nearestLoaded(this.current);
    if (i < 0 || i === this.drawn || !this.canvas.width) return;
    const img = this.frames[i];
    const { width: cw, height: ch } = this.canvas;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    this.ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    this.drawn = i;
  }
}
