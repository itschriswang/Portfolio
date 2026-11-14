import { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Geometry, Mesh } from 'ogl';
import { prefersReducedMotion } from '../../utils/media';
import { stencilCells, stencilPoints, drawEmblemDots, lighten } from '../lib/emblem';

// The carbon field: a WebGL particle system where one particle is 10 kg of
// CO2-e, so the audited year is literally on screen as matter. Two modes:
// 'swarm' drifts behind the total reveal, coloured by category, repelled by
// the pointer, and clusters a category when the visitor focuses its chip;
// 'emblem' pulls every particle into the character's stencil. Follows the
// Aurora house rules: RAF pauses off-screen, reduced motion never mounts a
// loop, context is released on unmount.

const VERT = `#version 300 es
in vec2 position;
in vec3 color;
in float size;
uniform vec2 uScale;
uniform float uDpr;
out vec3 vColor;
void main() {
  vColor = color;
  gl_PointSize = size * uDpr;
  gl_Position = vec4(position * uScale, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;
in vec3 vColor;
uniform float uAlpha;
out vec4 fragColor;
void main() {
  float d = distance(gl_PointCoord, vec2(0.5));
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.32, d) * uAlpha;
  fragColor = vec4(vColor * a, a);
}
`;

const KG_PER_PARTICLE = 10;

// Golden-angle disc: category-contiguous so the swarm forms readable arcs.
function swarmTargets(n, radius) {
  const pts = new Float32Array(n * 2);
  const GA = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const r = radius * Math.sqrt((i + 0.5) / n);
    const a = i * GA;
    pts[i * 2] = Math.cos(a) * r;
    pts[i * 2 + 1] = Math.sin(a) * r;
  }
  return pts;
}

// n jittered points over a category stencil. Unlike stencilPoints (which
// wraps cell-first and would draw only the top rows when particles are
// scarce), this strides evenly across the cells, so a small category still
// sketches the whole silhouette rather than a fragment of it.
function shapePoints(stencil, n) {
  const cells = stencilCells(stencil);
  if (!cells.length || !n) return [];
  const rows = stencil.length;
  const cols = Math.max(...stencil.map((r) => r.length));
  const jitter = 0.8 / Math.max(rows, cols);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const cell = cells[Math.floor((i * cells.length) / n) % cells.length];
    const a = ((i * 0.618033) % 1) * 2 - 1;
    const b = ((i * 0.754877) % 1) * 2 - 1;
    pts.push({ x: cell.x + a * jitter, y: cell.y + b * jitter });
  }
  return pts;
}

export default function CarbonField({
  mode, total, categories = [], stencil = null, hex = '#B5C42B',
  focus = null, shapes = null, alpha = 1, className, fallback = null,
}) {
  const ctnRef = useRef(null);
  const stateRef = useRef({ mode, focus, stencil, hex, shapes });
  stateRef.current = { mode, focus, stencil, hex, shapes };
  const [failed, setFailed] = useState(false);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const ctn = ctnRef.current;
    if (!ctn || reduced) return undefined;

    let renderer;
    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: true, dpr: Math.min(2, window.devicePixelRatio || 1) });
    } catch { setFailed(true); return undefined; }
    const gl = renderer.gl;
    if (!gl) { setFailed(true); return undefined; }
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.inset = '0';

    const small = window.innerWidth < 700;
    const N = Math.max(240, Math.min(small ? 900 : 1400, Math.round((total * 1000) / KG_PER_PARTICLE)));

    // Category assignment: contiguous blocks proportional to share.
    const catOf = new Uint8Array(N);
    const catHex = categories.length ? categories : [{ hex }];
    {
      let idx = 0;
      const totalShare = catHex.reduce((s, c) => s + (c.share || 1), 0);
      catHex.forEach((c, ci) => {
        const count = ci === catHex.length - 1 ? N - idx : Math.round(((c.share || 1) / totalShare) * N);
        for (let k = 0; k < count && idx < N; k++, idx++) catOf[idx] = ci;
      });
      while (idx < N) catOf[idx++] = catHex.length - 1;
    }

    const pos = new Float32Array(N * 2);
    const vel = new Float32Array(N * 2);
    const target = new Float32Array(N * 2);
    const colors = new Float32Array(N * 3);
    const sizes = new Float32Array(N);
    const seeds = new Float32Array(N);

    const setColors = (m) => {
      for (let i = 0; i < N; i++) {
        const c = m === 'emblem' ? lighten(stateRef.current.hex, 0.28) : lighten(catHex[catOf[i]].hex, 0.35);
        const n = parseInt(c.slice(1), 16);
        colors[i * 3] = ((n >> 16) & 255) / 255;
        colors[i * 3 + 1] = ((n >> 8) & 255) / 255;
        colors[i * 3 + 2] = (n & 255) / 255;
      }
    };

    const base = swarmTargets(N, 0.72);
    const rebuildTargets = () => {
      const { mode: m, focus: f, stencil: st, shapes: sh } = stateRef.current;
      if (m === 'emblem' && st) {
        const pts = stencilPoints(st, N);
        if (!pts.length) return;
        for (let i = 0; i < N; i++) { target[i * 2] = pts[i].x * 0.78; target[i * 2 + 1] = pts[i].y * 0.78; }
      } else {
        const fi = f ? catHex.findIndex((c) => c.id === f) : -1;
        // A focused category with a known silhouette morphs into it; its
        // particles are counted first so the whole shape gets sketched.
        const shape = fi >= 0 && sh && sh[f] ? sh[f] : null;
        let shapePts = null;
        if (shape) {
          let count = 0;
          for (let i = 0; i < N; i++) if (catOf[i] === fi) count++;
          shapePts = shapePoints(shape, count);
        }
        let si = 0;
        for (let i = 0; i < N; i++) {
          if (fi >= 0 && catOf[i] === fi && shapePts && shapePts.length) {
            const p = shapePts[si++] || shapePts[0];
            target[i * 2] = p.x * 0.72;
            target[i * 2 + 1] = p.y * 0.72;
          } else if (fi >= 0 && catOf[i] === fi) {
            // No silhouette carried: gather into a tight inner disc.
            const a = seeds[i] * Math.PI * 2;
            const r = 0.26 * Math.sqrt((i % 97) / 97);
            target[i * 2] = Math.cos(a) * r;
            target[i * 2 + 1] = Math.sin(a) * r;
          } else if (fi >= 0) {
            // Other categories clear the centre entirely: a filled disc would
            // sit on top of the focused silhouette and hide it, so remap each
            // dot's radius into a ring outside the symbol while keeping its
            // golden-angle bearing (the organic spread survives, the middle
            // opens up for the shape). u: 0 at the disc centre, 1 at its edge.
            const bx = base[i * 2], by = base[i * 2 + 1];
            const r0 = Math.sqrt(bx * bx + by * by);
            const u = Math.min(1, r0 / 0.72);
            const RIN = 0.9, ROUT = 1.12;
            const rn = Math.sqrt(RIN * RIN + u * u * (ROUT * ROUT - RIN * RIN));
            const ang = r0 > 1e-4 ? Math.atan2(by, bx) : seeds[i] * Math.PI * 2;
            target[i * 2] = Math.cos(ang) * rn;
            target[i * 2 + 1] = Math.sin(ang) * rn;
          } else {
            target[i * 2] = base[i * 2];
            target[i * 2 + 1] = base[i * 2 + 1];
          }
        }
      }
    };

    for (let i = 0; i < N; i++) {
      seeds[i] = (i * 0.618033) % 1;
      const a = seeds[i] * Math.PI * 2;
      pos[i * 2] = Math.cos(a) * (1.4 + seeds[i]);
      pos[i * 2 + 1] = Math.sin(a) * (1.4 + ((i * 0.754877) % 1));
      sizes[i] = 2.2 + seeds[i] * 2.6;
    }
    setColors(mode);
    rebuildTargets();

    let geometry, program;
    try {
      geometry = new Geometry(gl, {
      position: { size: 2, data: pos, usage: gl.DYNAMIC_DRAW },
      color: { size: 3, data: colors },
      size: { size: 1, data: sizes },
    });
    program = new Program(gl, {
      vertex: VERT, fragment: FRAG,
      uniforms: {
        uScale: { value: [1, 1] },
        uDpr: { value: Math.min(2, window.devicePixelRatio || 1) },
        uAlpha: { value: alpha },
      },
      transparent: true, depthTest: false,
    });
    } catch {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      setFailed(true);
      return undefined;
    }
    const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });
    ctn.appendChild(gl.canvas);

    const resize = () => {
      const w = ctn.offsetWidth, h = ctn.offsetHeight;
      if (!w || !h) return;
      // devicePixelRatio changes when the window crosses monitors: the
      // renderer's dpr and the point-size uniform must move together or
      // points render at the wrong size.
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      renderer.dpr = dpr;
      program.uniforms.uDpr.value = dpr;
      renderer.setSize(w, h);
      // Keep the field square-ish so emblems never stretch.
      program.uniforms.uScale.value = w > h ? [h / w, 1] : [1, w / h];
    };
    resize();
    window.addEventListener('resize', resize);

    // Pointer in field units (matches uScale mapping).
    const pointer = { x: 0, y: 0, on: false };
    const onMove = (e) => {
      const r = ctn.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
      const [sx, sy] = program.uniforms.uScale.value;
      pointer.x = nx / sx;
      pointer.y = ny / sy;
      pointer.on = true;
    };
    const onLeave = () => { pointer.on = false; };
    ctn.addEventListener('pointermove', onMove);
    ctn.addEventListener('pointerdown', onMove);
    ctn.addEventListener('pointerleave', onLeave);

    let lastSig = mode + '|' + (focus || '') + '|' + hex;
    let raf = 0;
    let intersecting = false;
    let inView = false;
    let lastT = 0;
    const syncInView = () => {
      inView = intersecting && !document.hidden;
      if (inView && !raf) { lastT = performance.now(); raf = requestAnimationFrame(tick); }
    };
    const tick = (t) => {
      raf = inView ? requestAnimationFrame(tick) : 0;
      const dt = Math.min(0.05, (t - lastT) / 1000 || 0.016);
      lastT = t;
      const { mode: m, focus: f, hex: hx } = stateRef.current;
      const sig = m + '|' + (f || '') + '|' + hx;
      if (sig !== lastSig) { lastSig = sig; rebuildTargets(); setColors(m); geometry.attributes.color.needsUpdate = true; }

      const spring = m === 'emblem' ? 4.2 : f ? 2.8 : 1.6;
      // Damping and the position step are per 60Hz frame, scaled by the
      // frame's real length, so the field moves at one speed on a 60Hz or a
      // 120Hz screen.
      const fr = dt * 60;
      const damp = Math.pow(m === 'emblem' ? 0.86 : 0.92, fr);
      const time = t * 0.001;
      for (let i = 0; i < N; i++) {
        const ix = i * 2, iy = ix + 1;
        let ax = (target[ix] - pos[ix]) * spring;
        let ay = (target[iy] - pos[iy]) * spring;
        // Gentle organic wobble, calmer once an emblem or a shape has formed.
        const w = m === 'emblem' ? 0.05 : f ? 0.08 : 0.22;
        ax += Math.sin(time * (0.6 + seeds[i]) + seeds[i] * 40) * w;
        ay += Math.cos(time * (0.5 + seeds[i]) + seeds[i] * 60) * w;
        if (pointer.on) {
          const dx = pos[ix] - pointer.x, dy = pos[iy] - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 0.16 && d2 > 0.00001) {
            const push = (0.16 - d2) * 26;
            ax += (dx / Math.sqrt(d2)) * push;
            ay += (dy / Math.sqrt(d2)) * push;
          }
        }
        vel[ix] = (vel[ix] + ax * dt) * damp;
        vel[iy] = (vel[iy] + ay * dt) * damp;
        pos[ix] += vel[ix] * fr;
        pos[iy] += vel[iy] * fr;
      }
      geometry.attributes.position.needsUpdate = true;
      renderer.render({ scene: mesh });
    };

    // The observer's guaranteed initial callback starts the loop, so a field
    // mounted below the fold never spins a hidden WebGL loop; without
    // IntersectionObserver the loop starts directly.
    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { intersecting = e.isIntersecting; });
        syncInView();
      });
      io.observe(ctn);
    } else {
      intersecting = true;
      syncInView();
    }
    const onVis = () => syncInView();
    document.addEventListener('visibilitychange', onVis);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', resize);
      ctn.removeEventListener('pointermove', onMove);
      ctn.removeEventListener('pointerdown', onMove);
      ctn.removeEventListener('pointerleave', onLeave);
      if (gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
    // Rebuild only when the audit itself changes; mode and focus flow
    // through stateRef without tearing the context down. Invariant: the
    // categories array and stencil identity only change together with the
    // audit (Story remounts on voice switch via key), so they are read
    // through stateRef instead of deps; adding the array itself to deps
    // would tear the context down on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, reduced]);

  if (reduced || failed) {
    return <div className={className} aria-hidden="true">{fallback}</div>;
  }
  return <div className={className} ref={ctnRef} aria-hidden="true" />;
}

// Static dot-matrix emblem: the reduced-motion and no-WebGL face of a
// character, and the badge used on the dashboard and in onboarding.
export function EmblemDots({ stencil, hex, size = 120, className, label }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);
    drawEmblemDots(ctx, stencil, { x: 0, y: 0, size, color: hex });
  }, [stencil, hex, size]);
  return (
    <canvas
      ref={ref}
      className={className}
      style={{ width: size, height: size }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
    />
  );
}
