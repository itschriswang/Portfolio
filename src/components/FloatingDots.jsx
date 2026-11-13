import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../utils/media';

// The decarbonisation model's FY30 tonnes as a living field: one dot per
// kilotonne (counts from dotField() in src/data/scenario.js), drifting in two
// loose clouds. Net emissions are solid forest dots on the left; what the
// levers abate are hollow lime rings on the right. When a lever moves, the dots
// that change state glide from one cloud to the other while both clouds
// re-pack around them, so the reader watches tonnes leave rather than a bar
// re-scale. The counts are the model's; this only lays them out.
//
// House rules: the loop pauses off-screen (IntersectionObserver) and stops on
// unmount; under reduced motion the field is drawn once, still, and redrawn in
// place when the counts change.

const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const FOREST = [39, 46, 9];      // --forest
const LIME = [181, 196, 43];     // --matcha, the ring colour

// Each dot keeps its own drift so the cloud never moves in lockstep.
function makeDot(i) {
  const h = (n) => { const x = Math.sin((i + 1) * n) * 43758.5453; return x - Math.floor(x); };
  return {
    x: null, y: null, m: 0, a: 0,
    p1: h(12.9898) * 6.283, p2: h(78.233) * 6.283,
    w1: 0.25 + h(37.719) * 0.3, w2: 0.2 + h(19.19) * 0.3,
    // A fixed offset off the packing grid, so the clouds read as scattered
    // rather than laid out.
    jx: h(4.1414) - 0.5, jy: h(9.7391) - 0.5,
  };
}

// Home position of the k-th of n dots in a cloud: a sunflower packing inside
// an ellipse, so any count fills its cloud evenly.
function home(k, n, cx, cy, rx, ry) {
  const r = Math.sqrt((k + 0.5) / Math.max(1, n));
  const th = k * GOLDEN;
  return [cx + rx * r * Math.cos(th), cy + ry * r * Math.sin(th)];
}

export default function FloatingDots({ net, avoided }) {
  const cvRef = useRef(null);
  const state = useRef({ dots: [], net: 0, avoided: 0, draw: null });

  // New counts: grow or shrink the pool, and let the frame loop do the rest.
  useEffect(() => {
    const st = state.current;
    const total = net + avoided;
    while (st.dots.length < total) st.dots.push(makeDot(st.dots.length));
    st.dots.forEach((d, i) => { d.alive = i < total; });
    st.net = net; st.avoided = avoided;
    if (st.draw) st.draw(true);
  }, [net, avoided]);

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return undefined;
    const ctx = cv.getContext('2d');
    const reduce = prefersReducedMotion();
    const st = state.current;
    let W = 0, H = 0, raf = 0, t = 0, inView = true;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(true);
    }

    function draw(snap) {
      const small = W < 520;
      const R = small ? 3.4 : 4.2;
      const nets = st.net, avs = st.avoided;
      // Two clouds: net on the left, abated on the right, each sized to its
      // share so the split reads at a glance.
      const share = (n) => Math.sqrt(Math.max(1, n) / Math.max(1, nets + avs));
      const ryMax = H * 0.42;
      const nC = [W * 0.28, H * 0.52], aC = [W * 0.72, H * 0.48];
      const nR = [W * 0.2 * share(nets), ryMax * share(nets)];
      const aR = [W * 0.2 * share(avs), ryMax * share(avs)];

      ctx.clearRect(0, 0, W, H);
      let kn = 0, ka = 0;
      st.dots.forEach((d, i) => {
        // A dot no longer counted fades where it stands, outside the packing.
        if (!d.alive) {
          d.a += (0 - d.a) * (reduce ? 1 : 0.08);
          if (d.a < 0.01 || d.x === null) return;
          ctx.beginPath(); ctx.arc(d.x, d.y, R * 0.85, 0, Math.PI * 2);
          ctx.lineWidth = 1.5; ctx.strokeStyle = `rgba(${LIME},${d.a})`; ctx.stroke();
          return;
        }
        const isNet = i < nets;
        const [hx, hy] = isNet ? home(kn++, nets, nC[0], nC[1], nR[0], nR[1])
          : home(ka++, avs, aC[0], aC[1], aR[0], aR[1]);
        const amp = reduce ? 0 : 4.5;
        const jit = R * 2.6;
        const tx = hx + d.jx * jit + amp * Math.sin(t * d.w1 + d.p1);
        const ty = hy + d.jy * jit + amp * Math.cos(t * d.w2 + d.p2);
        const targetM = isNet ? 0 : 1;
        const targetA = 1;
        if (d.x === null || snap && reduce) { d.x = tx; d.y = ty; d.m = targetM; d.a = reduce ? targetA : d.a; }
        // Abated dots float a little looser and slower, as if released.
        const k = reduce ? 1 : (isNet ? 0.07 : 0.045);
        d.x += (tx - d.x) * k; d.y += (ty - d.y) * k;
        d.m += (targetM - d.m) * (reduce ? 1 : 0.08);
        d.a += (targetA - d.a) * (reduce ? 1 : 0.08);
        if (d.a < 0.01) return;
        const r = R * (1 - 0.15 * d.m);
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        if (d.m < 0.99) { ctx.fillStyle = `rgba(${FOREST},${(1 - d.m) * d.a})`; ctx.fill(); }
        if (d.m > 0.01) { ctx.lineWidth = 1.5; ctx.strokeStyle = `rgba(${LIME},${d.m * d.a})`; ctx.stroke(); }
      });
    }
    st.draw = (snap) => { if (reduce || !raf) draw(snap); };

    function frame() {
      t += 1 / 60;
      draw(false);
      raf = inView ? requestAnimationFrame(frame) : 0;
    }

    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    resize();
    let io;
    if (!reduce) {
      io = new IntersectionObserver((es) => es.forEach((e) => {
        inView = e.isIntersecting;
        if (inView && !raf) raf = requestAnimationFrame(frame);
      }));
      io.observe(cv);
      raf = requestAnimationFrame(frame);
    }
    return () => { ro.disconnect(); if (io) io.disconnect(); cancelAnimationFrame(raf); raf = 0; st.draw = null; };
  }, []);

  return <canvas ref={cvRef} className="df-canvas" aria-hidden="true" />;
}
