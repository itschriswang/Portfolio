import { useEffect, useMemo, useRef } from 'react';
import { careerRings } from '../lib/careerRings';
import { EXPERIENCE, EXPERIENCE_INTRO } from '../data/content';
import { prefersReducedMotion } from '../utils/media';

// The Track record's tree-ring figure: the record itself as a cross-section.
// One thin ring per calendar year from the first role to today, a band per
// employer in the green ramp, closed by a line in that employer's timeline
// colour, and a dashed ring where a role changed inside an employer. All
// positions come from careerRings() over the dates in EXPERIENCE.
//
// It grows as you scroll: a clip widens from the pith to the bark with your
// progress through the timeline beside it, so each employer's band arrives in
// turn, oldest first. No labels, legend or caption; the timeline carries the
// words and the figure carries the shape. Under reduced motion it is drawn
// whole.

const R = 92;
const R0 = 7;
const STEPS = 160;
const WOB = [[2, 0.022, 0.6], [3, 0.014, 2.1], [5, 0.007, 4.0]];
const TONES = ['var(--sage-soft)', 'var(--lime-wash)', 'var(--lime-soft)', 'var(--sage)'];
const FULL = R * 1.06;
const START = R0 * 0.6;

function ring(r) {
  let d = '';
  for (let s = 0; s <= STEPS; s++) {
    const th = (s / STEPS) * Math.PI * 2;
    let w = 0;
    for (const [n, a, p] of WOB) w += a * Math.sin(n * th + p);
    const rr = r * (1 + w * (r / R));
    d += (s ? 'L' : 'M') + (rr * Math.cos(th)).toFixed(2) + ' ' + (rr * Math.sin(th)).toFixed(2);
  }
  return d + 'Z';
}
const rad = (f) => R0 + (R - R0) * f;

export default function CareerRings() {
  const g = useMemo(() => careerRings(EXPERIENCE), []);
  const figRef = useRef(null);
  const clipRef = useRef(null);
  const label = EXPERIENCE_INTRO.rings.label
    .replace('{start}', String(g.startYear)).replace('{n}', String(g.bands.length));
  const toned = g.bands.map((b, i) => ({ ...b, tone: TONES[i % TONES.length] }));
  const outerFirst = [...toned].reverse();

  // Scroll-driven growth: progress through the timeline beside the figure.
  useEffect(() => {
    const clip = clipRef.current;
    const fig = figRef.current;
    if (!clip || !fig) return undefined;
    if (prefersReducedMotion()) { clip.setAttribute('r', String(FULL)); return undefined; }
    const tl = fig.closest('.exp-body')?.querySelector('.exp-timeline');
    let raf = 0;
    const update = () => {
      raf = 0;
      const box = (tl || fig).getBoundingClientRect();
      const vh = window.innerHeight;
      // Starts as the timeline enters, done before its last entry leaves.
      const p = Math.min(1, Math.max(0, (vh * 0.85 - box.top) / (box.height * 0.8)));
      const eased = 1 - Math.pow(1 - p, 2);
      clip.setAttribute('r', (START + (FULL - START) * eased).toFixed(2));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <figure className="career-rings" ref={figRef}>
      <svg viewBox="-100 -100 200 200" role="img" aria-label={label}>
        <defs>
          <clipPath id="cr-grow">
            <circle ref={clipRef} r={START} />
          </clipPath>
        </defs>
        <g clipPath="url(#cr-grow)">
          {outerFirst.map((b) => (
            <path key={b.org} d={ring(rad(b.to))} className="cr-band" style={{ '--bc': `var(--${b.clr})`, '--tone': b.tone }} />
          ))}
          {g.years.map((y) => (
            <path key={y.year} d={ring(rad(y.at))} className="cr-year" />
          ))}
          {g.bands.flatMap((b) => b.changes.map((c) => (
            <path key={b.org + c.title} d={ring(rad(c.at))} className="cr-change" style={{ '--bc': `var(--${b.clr})` }} />
          )))}
          <circle r={R0 * 0.55} className="cr-pith" />
        </g>
      </svg>
    </figure>
  );
}
