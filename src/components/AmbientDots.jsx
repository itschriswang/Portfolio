import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../utils/media';

// Background flavour for the decarbonisation model: a slow field of dots
// drifting behind the section, in the spirit of the Life Footprint's carbon
// field, in a soft translucent green. It is not a chart and carries no labels. Its one tie to the model is
// the share of dots held in the field: the levers' FY30 abatement (from
// dotField() in src/data/scenario.js) decides how many dots let go, turn into
// hollow lime rings and lift off the top of the section, so pushing the levers
// harder visibly lightens the field. Nothing here is read as a number.
//
// House rules: the loop pauses off-screen and stops on unmount; under reduced
// motion the field is drawn once, still, and redrawn when the levers change.

const GREEN = '193,224,67';   // --matcha, held dots
const LIME = '193,224,67';

function seeded(i) {
  return (n) => { const x = Math.sin((i + 1) * n) * 43758.5453; return x - Math.floor(x); };
}

export default function AmbientDots({ net, avoided }) {
  const cvRef = useRef(null);
  const share = useRef(1);
  const redraw = useRef(null);

  // The share of dots that stay; the rest are released.
  useEffect(() => {
    const total = net + avoided;
    share.current = total > 0 ? net / total : 1;
    if (redraw.current) redraw.current();
  }, [net, avoided]);

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return undefined;
    const ctx = cv.getContext('2d');
    const reduce = prefersReducedMotion();
    let W = 0, H = 0, raf = 0, inView = false, t = 0;
    let dots = [];

    function build(pw, ph) {
      const n = Math.max(30, Math.min(110, Math.round((W * H) / 18000)));
      // A resize that keeps the count only rescales the field, so released
      // dots stay released rather than dropping back and lifting off again.
      if (dots.length === n && pw && ph) {
        for (const d of dots) { d.x *= W / pw; d.y *= H / ph; }
        return;
      }
      dots = Array.from({ length: n }, (_, i) => {
        const h = seeded(i);
        return {
          u: h(12.9898),                       // rank: below the held share, the dot stays
          x: h(78.233) * W, y: h(37.719) * H,
          r: 1.4 + h(19.19) * 2.2,
          a: 0.12 + h(4.1414) * 0.16,
          vx: (h(9.7391) - 0.5) * 0.18,
          ph: h(2.71) * 6.283, w: 0.3 + h(3.3) * 0.5,
          lift: 0.25 + h(5.17) * 0.35,
          m: 0,                                 // 0 held, 1 released (eased)
        };
      });
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const box = cv.parentElement.getBoundingClientRect();
      const pw = W, ph = H;
      W = box.width; H = box.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build(pw, ph);
      draw();
    }

    // k scales each per-frame step to the real frame time (1 at 60fps), so the
    // field moves at the same speed on a 60Hz and a 120Hz screen.
    function draw(k = 1) {
      ctx.clearRect(0, 0, W, H);
      const held = share.current;
      const ease = reduce ? 1 : 1 - Math.pow(0.97, k);
      for (const d of dots) {
        const released = d.u >= held;
        d.m += ((released ? 1 : 0) - d.m) * ease;
        if (!reduce) {
          d.x += (d.vx + Math.sin(t * d.w + d.ph) * 0.12) * k;
          // Held dots bob in place; released ones rise and fade as they go.
          d.y += (Math.cos(t * d.w + d.ph) * 0.1 - d.lift * d.m) * k;
          if (d.x < -8) d.x = W + 8; else if (d.x > W + 8) d.x = -8;
          if (d.y < -8) { d.y = H + 8; }
          else if (d.y > H + 8) d.y = -8;
        }
        // Released dots thin out towards the top of the section.
        const fade = d.m > 0.01 ? Math.max(0.15, d.y / H) : 1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        if (d.m < 0.99) { ctx.fillStyle = `rgba(${GREEN},${d.a * (1 - d.m)})`; ctx.fill(); }
        if (d.m > 0.01) { ctx.lineWidth = 1.2; ctx.strokeStyle = `rgba(${LIME},${Math.min(0.4, d.a * 2) * d.m * fade})`; ctx.stroke(); }
      }
    }
    redraw.current = () => { if (reduce || !raf) draw(); };

    let last = 0;
    function frame(now) {
      const k = last ? Math.min(6, (now - last) / (1000 / 60)) : 1;
      last = now;
      t += k / 60;
      draw(k);
      raf = inView ? requestAnimationFrame(frame) : 0;
    }

    const ro = new ResizeObserver(resize);
    ro.observe(cv.parentElement);
    resize();
    let io;
    if (!reduce) {
      io = new IntersectionObserver((es) => es.forEach((e) => {
        inView = e.isIntersecting;
        if (inView && !raf) { last = 0; raf = requestAnimationFrame(frame); }
      }));
      io.observe(cv.parentElement);
    }
    return () => { ro.disconnect(); if (io) io.disconnect(); cancelAnimationFrame(raf); raf = 0; redraw.current = null; };
  }, []);

  return <canvas ref={cvRef} className="ambient-dots" aria-hidden="true" />;
}
