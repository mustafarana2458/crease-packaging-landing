#!/usr/bin/env node
/**
 * Media pipeline: assets/ (masters)  →  static/media/ (what the site ships)
 *
 *  - Each scroll-scrubbed video becomes two WebP frame sequences:
 *      d/  desktop · every frame · 1280×720 (16:9)
 *      m/  mobile  · every 2nd frame · 720×720 square crop around a focal point
 *  - Each still becomes a responsive WebP pair (800w + 1376w).
 *  - Writes src/generated/media.json so the JS knows frame counts.
 *
 * Requires ffmpeg on PATH.
 *   npm run media                 → everything
 *   node scripts/build-media.mjs hero unbox   → only those sequences (images skipped)
 * Outputs are committed, so Netlify never needs ffmpeg.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_V = join(root, 'assets/videos');
const SRC_I = join(root, 'assets/images');
const OUT = join(root, 'static/media');
const manifestPath = join(root, 'src/generated/media.json');

// focal = horizontal centre of the subject (0–1) used for the square mobile crop
// last  = last source frame to keep (inclusive); frames after it are dropped
const SEQUENCES = [
  // hero: cut after 165 — from 166 the lid flaps warp and the box snaps to a new angle (~180)
  { id: 'hero', file: 'hero_fold.mp4', focal: 0.5, last: 165 },
  { id: 'unbox', file: 'rigid_unbox.mp4', focal: 0.5 },
  // process: machines and the final pallet enter from the right, so the square crop leans right
  { id: 'process', file: 'process_line.mp4', focal: 0.62 },
  { id: 'eco', file: 'eco_return.mp4', focal: 0.5 },
];

const IMAGES = [
  'hero_start_flat', 'hero_end_box', 'rigid_closed', 'eco_start',
  'product_corrugated', 'product_flexible', 'product_kraft', 'industries_flatlay',
];

const only = process.argv.slice(2);

function ff(args) {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('ffmpeg failed: ' + args.join(' '));
}

const dirSize = (d) => readdirSync(d).reduce((s, f) => s + statSync(join(d, f)).size, 0);
const kb = (b) => (b / 1024).toFixed(0) + ' KB';

const manifest = only.length && existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, 'utf8'))
  : { sequences: {}, images: {} };

for (const s of SEQUENCES) {
  if (only.length && !only.includes(s.id)) continue;
  const src = join(SRC_V, s.file);
  const base = join(OUT, 'seq', s.id);
  rmSync(base, { recursive: true, force: true });
  const d = join(base, 'd');
  const m = join(base, 'm');
  mkdirSync(d, { recursive: true });
  mkdirSync(m, { recursive: true });

  const keep = s.last === undefined ? '' : `lte(n\\,${s.last})`;

  ff(['-i', src, '-an', '-vf', (keep ? `select=${keep},` : '') + 'scale=1280:720:flags=lanczos',
    '-fps_mode', 'passthrough',
    '-c:v', 'libwebp', '-quality', '68', '-compression_level', '5',
    '-start_number', '0', join(d, '%04d.webp')]);

  const cropX = `min(max(iw*${s.focal}-ih/2\\,0)\\,iw-ih)`;
  ff(['-i', src, '-an', '-vf', `select=${keep ? keep + '*' : ''}not(mod(n\\,2)),crop=ih:ih:${cropX}:0,scale=720:720:flags=lanczos`,
    '-fps_mode', 'passthrough',
    '-c:v', 'libwebp', '-quality', '66', '-compression_level', '5',
    '-start_number', '0', join(m, '%04d.webp')]);

  const dn = readdirSync(d).length;
  const mn = readdirSync(m).length;
  manifest.sequences[s.id] = {
    path: `/media/seq/${s.id}`,
    d: { count: dn, w: 1280, h: 720 },
    // cropX: left edge of the square crop as a fraction of the 16:9 frame (hotspots use it)
    m: { count: mn, w: 720, h: 720, cropX: +(Math.min(Math.max(s.focal * 1280 - 360, 0), 560) / 1280).toFixed(5) },
  };
  console.log(`${s.id.padEnd(8)} desktop ${dn} frames ${kb(dirSize(d))} · mobile ${mn} frames ${kb(dirSize(m))}`);
}

if (!only.length) {
  const imgDir = join(OUT, 'img');
  rmSync(imgDir, { recursive: true, force: true });
  mkdirSync(imgDir, { recursive: true });
  for (const name of IMAGES) {
    const src = join(SRC_I, name + '.jpg');
    for (const w of [800, 1376]) {
      ff(['-i', src, '-vf', `scale=${w}:-2:flags=lanczos`, '-c:v', 'libwebp', '-quality', '78',
        join(imgDir, `${name}-${w}.webp`)]);
    }
    manifest.images[name] = { w: 1376, h: 768 };
  }
  console.log('images   ' + kb(dirSize(imgDir)));
}

mkdirSync(dirname(manifestPath), { recursive: true });
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('wrote src/generated/media.json');
