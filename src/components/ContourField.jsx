import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../utils/media';

// Animated emissions topology (marching squares), ported from the original.
// Reads as a soft background texture behind the hero.
export default function ContourField({ tone = 'light' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || !cv.getContext) return;
    const ctx = cv.getContext('2d');
    const hero = cv.parentElement;
    const reduce = prefersReducedMotion();
    let W = 0, H = 0, t = 0, raf = null, inView = true;
    const CELL = 20, LEVELS = [-1.6, -0.8, 0, 0.8, 1.6];

    function field(x, y, tt) {
      return Math.sin(x * 0.011 + tt)
        + Math.sin(y * 0.013 - tt * 0.7)
        + Math.sin((x * 0.7 + y) * 0.0065 + tt * 0.45)
        + 1.4 * Math.sin(Math.hypot(x - W * 0.72, y - H * 0.3) * 0.006 - tt * 0.5);
    }
    const lerp = (p, q) => p / (p - q);

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const cols = Math.ceil(W / CELL) + 1, rows = Math.ceil(H / CELL) + 1;
      const grid = new Array(cols * rows);
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) grid[j * cols + i] = field(i * CELL, j * CELL, t);
      for (let li = 0; li < LEVELS.length; li++) {
        const lv = LEVELS[li], hi = (li === 2);
        ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const x = i * CELL, y = j * CELL;
            const a = grid[j * cols + i] - lv, b = grid[j * cols + i + 1] - lv, c = grid[(j + 1) * cols + i + 1] - lv, d = grid[(j + 1) * cols + i] - lv;
            const idx = (a > 0 ? 8 : 0) | (b > 0 ? 4 : 0) | (c > 0 ? 2 : 0) | (d > 0 ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const top = [x + CELL * lerp(a, b), y], right = [x + CELL, y + CELL * lerp(b, c)], bot = [x + CELL * lerp(d, c), y + CELL], left = [x, y + CELL * lerp(a, d)];
            let segs;
            switch (idx) {
              case 1: case 14: segs = [[left, bot]]; break;
              case 2: case 13: segs = [[bot, right]]; break;
              case 3: case 12: segs = [[left, right]]; break;
              case 4: case 11: segs = [[top, right]]; break;
              case 5: segs = [[top, left], [bot, right]]; break;
              case 6: case 9: segs = [[top, bot]]; break;
              case 7: case 8: segs = [[top, left]]; break;
              case 10: segs = [[top, right], [left, bot]]; break;
              default: segs = [];
            }
            for (let s = 0; s < segs.length; s++) {
              ctx.moveTo(segs[s][0][0], segs[s][0][1]);
              ctx.lineTo(segs[s][1][0], segs[s][1][1]);
            }
          }
        }
        ctx.strokeStyle = tone === 'dark'
          ? (hi ? 'rgba(208,240,85,0.20)' : 'rgba(255,255,255,0.05)')
          : (hi ? 'rgba(139,160,30,0.18)' : 'rgba(15,23,42,0.05)');
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = hero.offsetWidth; H = hero.offsetHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }
    let last = 0;
    function frame(now) {
      // Seconds since the last frame, so the field drifts at the same speed on
      // a 60Hz and a 120Hz screen (0.0028 a frame at 60fps).
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
      last = now;
      t += 0.168 * dt;
      draw();
      raf = inView ? requestAnimationFrame(frame) : null;
    }
    // The hero's height moves with its pacing and with font loading, not only
    // with the window, so the canvas follows the hero itself.
    const ro = new ResizeObserver(resize);
    ro.observe(hero);
    resize();
    let io;
    if (!reduce) {
      io = new IntersectionObserver((es) => {
        es.forEach((e) => {
          inView = e.isIntersecting;
          if (inView && !raf) raf = requestAnimationFrame(frame);
        });
      });
      io.observe(hero);
      raf = requestAnimationFrame(frame);
    }
    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (io) io.disconnect();
    };
  }, [tone]);

  return <canvas id="contour-field" ref={canvasRef} aria-hidden="true" />;
}
