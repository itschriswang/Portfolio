import { useMemo } from 'react';

// A cross-section of a tree, drawn as one vector in line-work on the dark hero. It is decoration: it carries
// no data and makes no claim, so it is aria-hidden and has no caption. What it
// does is bring the site's accent colours (amber, lime, indigo, berry) into the
// first screen at full strength, in a shape that suits the work.
//
// Everything is generated once from a fixed seed, so the drawing is the same on
// every visit and in every build. Rings are closed paths whose radius wobbles
// with a few shared low harmonics (so neighbours stay parallel and never cross)
// plus a little fine grain; the centre drifts a touch ring to ring, the way a
// leaning trunk lays wood down unevenly.

const SIZE = 560;            // viewBox is -280..280 on both axes
const HALF = SIZE / 2;
const RINGS = 46;
const STEPS = 200;

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function ramp(stops, t) {
  const x = Math.min(0.9999, Math.max(0, t)) * (stops.length - 1);
  const i = Math.floor(x), f = x - i;
  const a = hex(stops[i]), b = hex(stops[i + 1]);
  return 'rgb(' + a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(',') + ')';
}

// Drawn for the dark hero: near-black wood with each ring picked out in a thin
// line that runs from amber at the pith, through lime, to a quiet olive at the
// rim. Accent years take the site's berry and indigo, plus one white ring.
const WOOD = ['#2B2412', '#1F2012', '#191A10', '#15160E'];
const LINE = ['#FF9500', '#F2D24B', '#D0F055', '#C1E043', '#B2C633', '#8FA02A'];

function build() {
  const rnd = mulberry32(2910);
  // Four shared low harmonics: amplitude (fraction of radius), phase, and how
  // fast the phase drifts ring to ring.
  const H = [2, 3, 4, 6].map((n, i) => ({
    n,
    amp: [0.026, 0.018, 0.012, 0.007][i],
    ph: rnd() * Math.PI * 2,
    drift: (rnd() - 0.5) * 0.05,
  }));
  const grain = Array.from({ length: 5 }, () => ({
    n: 9 + Math.floor(rnd() * 12), ph: rnd() * Math.PI * 2, amp: 0.0016 + rnd() * 0.0012,
  }));

  // Ring widths: a steady base with a dry spell (narrow) and a wet run (wide).
  const radii = [];
  let r = 7;
  const widths = [];
  for (let k = 0; k < RINGS; k++) {
    let w = 4.6 + rnd() * 2.1;
    if (k >= 17 && k <= 21) w *= 0.5;       // dry years
    if (k >= 29 && k <= 33) w *= 1.35;      // wet years
    if (k < 4) w *= 0.8;                    // juvenile wood
    widths.push(w);
    r += w;
    radii.push(r);
  }
  const scale = (HALF - 18) / radii[RINGS - 1];

  const ringPath = (k, extra = 0) => {
    const base = radii[k] * scale + extra;
    const cx = k * 0.13, cy = -k * 0.07;
    let d = '';
    for (let s = 0; s < STEPS; s++) {
      const th = (s / STEPS) * Math.PI * 2;
      let wob = 0;
      for (const h of H) wob += h.amp * Math.sin(h.n * th + h.ph + h.drift * k);
      for (const g of grain) wob += g.amp * Math.sin(g.n * th + g.ph + k * 0.2);
      const rr = base * (1 + wob * (0.5 + 0.5 * (k / RINGS)));
      d += (s ? 'L' : 'M') + (cx + rr * Math.cos(th)).toFixed(1) + ' ' + (cy + rr * Math.sin(th)).toFixed(1);
    }
    return d + 'Z';
  };

  // Accent years: the colours that make the rings read as a palette.
  const accents = { 8: '#FF9500', 19: '#FF3B60', 25: '#8A83FF', 31: '#F4F7E8', 40: '#8A83FF' };

  const rings = [];
  for (let k = RINGS - 1; k >= 0; k--) {
    const t = k / (RINGS - 1);
    const narrow = widths[k] < 3.6;
    rings.push({
      k,
      d: ringPath(k),
      fill: ramp(WOOD, t),
      stroke: accents[k] || ramp(LINE, t),
      sw: accents[k] ? 2.2 : narrow ? 1.5 : 0.8 + rnd() * 0.4,
      accent: Boolean(accents[k]),
    });
  }

  // Medullary rays: faint spokes from the pith.
  const rays = [];
  for (let i = 0; i < 70; i++) {
    const th = rnd() * Math.PI * 2;
    const r0 = 12 + rnd() * 30, r1 = r0 + 40 + rnd() * (HALF - 60 - r0);
    rays.push([
      (r0 * Math.cos(th)).toFixed(1), (r0 * Math.sin(th)).toFixed(1),
      (r1 * Math.cos(th)).toFixed(1), (r1 * Math.sin(th)).toFixed(1),
    ]);
  }

  // Drying checks: two wedge cracks from the rim inward.
  const cracks = [[0.62, 120, 0.05], [3.7, 90, 0.04]].map(([th, len, wid]) => {
    const r1 = (HALF - 20) * 0.995, r0 = r1 - len;
    const p = (rr, a) => (rr * Math.cos(a)).toFixed(1) + ' ' + (rr * Math.sin(a)).toFixed(1);
    return 'M' + p(r1, th - wid * 0.5) + 'L' + p(r0, th) + 'L' + p(r1, th + wid * 0.5) + 'Z';
  });

  // Bark: a rough annulus outside the last ring.
  const barkOuter = (() => {
    let d = '';
    for (let s = 0; s < STEPS; s++) {
      const th = (s / STEPS) * Math.PI * 2;
      const rr = (HALF - 2) - 3.5 * (0.5 + 0.5 * Math.sin(th * 23 + 1.3)) - 2 * Math.sin(th * 7 + 0.4);
      d += (s ? 'L' : 'M') + (rr * Math.cos(th)).toFixed(1) + ' ' + (rr * Math.sin(th)).toFixed(1);
    }
    return d + 'Z';
  })();

  return { rings, rays, cracks, barkOuter, pith: [RINGS * 0 + 0.0, 0.0] };
}

export default function TreeRings({ still }) {
  const g = useMemo(build, []);
  return (
    <div className={'tree-rings' + (still ? '' : ' tr-grow')} aria-hidden="true">
      <svg viewBox={`${-HALF} ${-HALF} ${SIZE} ${SIZE}`} focusable="false">
        <defs>
          <radialGradient id="tr-pith">
            <stop offset="0" stopColor="#D0F055" stopOpacity="0.55" />
            <stop offset="1" stopColor="#D0F055" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={g.barkOuter} fill="#0B0C07" />
        <path d={g.barkOuter} fill="none" stroke="#D0F055" strokeOpacity="0.45" strokeWidth="1.2" />
        {g.rings.map((r) => (
          <path
            key={r.k}
            className="tr-ring"
            style={{ '--i': r.k }}
            d={r.d}
            fill={r.fill}
            stroke={r.stroke}
            strokeWidth={r.sw}
            strokeLinejoin="round"
          />
        ))}
        <g className="tr-rays" stroke="#F4F7E8" strokeWidth="0.5" strokeLinecap="round">
          {g.rays.map((l, i) => <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} />)}
        </g>
        {g.cracks.map((d, i) => <path key={i} d={d} fill="#070804" fillOpacity="0.9" stroke="#D0F055" strokeOpacity="0.4" strokeWidth="0.8" />)}
        <circle r="16" fill="url(#tr-pith)" />
        <circle r="2.6" fill="#D0F055" />
      </svg>
    </div>
  );
}
