import { defineConfig } from 'vite';

export default defineConfig({
  // `public/` holds the raw Google Flow downloads, so static files live in `static/` instead.
  publicDir: 'static',
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
});
