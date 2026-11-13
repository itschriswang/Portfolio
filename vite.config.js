import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { rmSync } from 'fs';

// Relative base so the build works whether served from a domain root
// (itschriswang.github.io) or a project sub-path (/portfolio/).
// Multi-page. Public: the main profile at /, work samples at /work/, and the
// life-footprint dashboard at /footprint/ (basis of preparation at
// /footprint/method/).
//
// The drafts (the /lab/ index and the six tools it gates: /targets/,
// /fashion/, /super/ with /super/method/, /grid/, /progress/ and /daily/) are
// NOT in the production build. They hold unfinished claims about named
// companies and funds, and the passphrase in front of them is a curtain in a
// static site, not a lock (src/lib/gate.js), so the only way to keep them off
// the public site is not to publish them. `npm run dev` still serves every
// page, drafts included, because the dev server serves any html under the
// root. To build them anyway (a local preview), set BUILD_DRAFTS=1.
const DRAFTS = process.env.BUILD_DRAFTS === '1';
const PUBLIC_PAGES = {
  main: 'index.html',
  work: 'work/index.html',
  footprint: 'footprint/index.html',
  footprintMethod: 'footprint/method/index.html',
};
const DRAFT_PAGES = {
  fashion: 'fashion/index.html',
  grid: 'grid/index.html',
  daily: 'daily/index.html',
  superHoldings: 'super/index.html',
  superMethod: 'super/method/index.html',
  progress: 'progress/index.html',
  targets: 'targets/index.html',
  lab: 'lab/index.html',
};
const pages = { ...PUBLIC_PAGES, ...(DRAFTS ? DRAFT_PAGES : {}) };

// public/ is copied into the build whole, so the drafts' own static files
// (their share cards, and Cost Per Wear's brand CSV) would ship even with the
// pages left out. Without the drafts, they are removed from dist/ once the
// bundle is written.
const DRAFT_STATIC = [
  'og-fashion.png', 'og-grid.png', 'og-daily.png', 'og-super.png',
  'og-progress.png', 'og-targets.png', 'data',
];
const dropDraftStatic = {
  name: 'drop-draft-static',
  apply: 'build',
  closeBundle() {
    if (DRAFTS) return;
    for (const f of DRAFT_STATIC) rmSync(resolve(__dirname, 'dist', f), { recursive: true, force: true });
  },
};


export default defineConfig({
  base: './',
  plugins: [react(), dropDraftStatic],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: Object.fromEntries(Object.entries(pages).map(([k, p]) => [k, resolve(__dirname, p)])),
      output: {
        // Stable vendor chunks: both pages share react/framer-motion, and the
        // heavier chart.js/ogl code is only fetched by the main page. Splitting
        // them lets the browser cache vendors across deploys and pages.
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
          chart: ['chart.js'],
          ogl: ['ogl'],
        },
      },
    },
  },
});
