import { useMemo, useRef } from 'react';
import { useInView } from 'framer-motion';
import { careerRings } from '../lib/careerRings';
import { EXPERIENCE, EXPERIENCE_INTRO } from '../data/content';
import { prefersReducedMotion } from '../utils/media';

// The Track record's tree-ring figure. The hero's rings are decoration; these
// are the same motif carrying the record: one ring per calendar year from the
// first role to today, a band per employer in the timeline's own colours, and a
// finer line where a role changed inside an employer. All positions come from
// careerRings() over the dates in EXPERIENCE, so the figure cannot drift from
// the timeline printed beside it.

const R = 92;        // bark radius in the 200 x 200 viewBox
const R0 = 7;        // the pith
const STEPS = 160;

// A gentle, fixed wobble shared by every ring, so they read as grown wood but
// stay parallel and never cross.
const WOB = [[2, 0.022, 0.6], [3, 0.014, 2.1], [5, 0.007, 4.0]];
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
// Band tones, heart outwards, from the site's green ramp.
const TONES = ['var(--sage-soft)', 'var(--lime-wash)', 'var(--lime-soft)', 'var(--sage)'];

export default function CareerRings() {
  const g = useMemo(() => careerRings(EXPERIENCE), []);
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const still = prefersReducedMotion();
  const copy = EXPERIENCE_INTRO.rings;
  const label = copy.label.replace('{start}', String(g.startYear)).replace('{n}', String(g.bands.length));
  const motion = still ? '' : seen ? ' cr-grow' : ' cr-wait';

  // Bands outermost first, so each inner disc paints over the one around it.
  const toned = g.bands.map((b, i) => ({ ...b, tone: TONES[i % TONES.length] }));
  const bands = [...toned].reverse();

  return (
    <figure className={'career-rings' + motion} ref={ref}>
      <svg viewBox="-100 -100 200 200" role="img" aria-label={label}>
        <path d={ring(R + 3)} className="cr-bark" />
        {bands.map((b, i) => (
          <path key={b.org} d={ring(rad(b.to))} className="cr-band" style={{ '--bc': `var(--${b.clr})`, '--tone': b.tone, '--i': bands.length - i }} />
        ))}
        {g.years.map((y) => (
          <path key={y.year} d={ring(rad(y.at))} className="cr-year" />
        ))}
        {g.bands.flatMap((b) => b.changes.map((c) => (
          <path key={b.org + c.title} d={ring(rad(c.at))} className="cr-change" style={{ '--bc': `var(--${b.clr})` }} />
        )))}
        <path d={ring(R)} className="cr-edge" />
        <circle r={R0 * 0.55} className="cr-pith" />
        {/* Year labels along one ray, each set where its ring crosses it. */}
        {g.years.map((y) => {
          const r = rad(y.at);
          return (
            <text key={'t' + y.year} x={r + 1.2} y={-1.4} className="cr-yr">{'\u2019' + String(y.year).slice(2)}</text>
          );
        })}
      </svg>
      <ul className="cr-legend">
        {toned.slice().reverse().map((b) => (
          <li key={b.org} style={{ '--bc': `var(--${b.clr})`, '--tone': b.tone }}><span aria-hidden="true" />{b.org}</li>
        ))}
      </ul>
      <figcaption className="cr-cap">
        {copy.caption}
        <span className="cr-basis">{copy.basis}</span>
      </figcaption>
    </figure>
  );
}
