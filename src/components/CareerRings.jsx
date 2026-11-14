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
  const label = EXPERIENCE_INTRO.rings.label
    .replace('{start}', String(g.startYear)).replace('{n}', String(g.bands.length));

  // One layer per ring: every calendar year and every employer's last month
  // closes a ring. Each is a filled disc in the tone of the employer it falls
  // in, stroked as a year line or, where an employer ends, in its colour.
  // Painted outer-first so a ring that has not arrived yet hides nothing.
  const layers = useMemo(() => {
    const toned = g.bands.map((b, i) => ({ ...b, tone: TONES[i % TONES.length] }));
    const bandAt = (f) => toned.find((b) => f > b.from && f <= b.to + 1e-9) || toned[toned.length - 1];
    const list = [
      ...g.years.map((y) => ({ key: 'y' + y.year, at: y.at, end: false })),
      ...toned.map((b) => ({ key: 'b' + b.org, at: b.to, end: true })),
    ].sort((a, b) => a.at - b.at || (a.end ? 1 : -1));
    return list.map((l) => ({ ...l, band: bandAt(l.at) })).reverse();
  }, [g]);
  const changes = g.bands.flatMap((b) => b.changes.map((c) => ({ ...c, org: b.org, clr: b.clr })));

  // Scroll-driven growth: progress through the timeline beside the figure
  // decides how far out the rings have been laid down.
  useEffect(() => {
    const fig = figRef.current;
    if (!fig) return undefined;
    const rings = [...fig.querySelectorAll('[data-at]')].sort((x, y) => x.dataset.at - y.dataset.at);
    // Rings that arrive in the same frame (a fast scroll, or landing mid-way)
    // still go down one after another, inner first, 40ms apart.
    const show = (p) => {
      let k = 0;
      rings.forEach((el) => {
        const on = Number(el.dataset.at) <= p + 1e-6;
        if (on === el.classList.contains('on')) return;
        el.style.transitionDelay = on ? (k++ * 40) + 'ms' : '0ms';
        el.classList.toggle('on', on);
      });
    };
    if (prefersReducedMotion()) { show(1); return undefined; }
    const tl = fig.closest('.exp-body')?.querySelector('.exp-timeline');
    let raf = 0;
    const update = () => {
      raf = 0;
      const box = (tl || fig).getBoundingClientRect();
      const vh = window.innerHeight;
      // Starts as the timeline enters, done before its last entry leaves.
      const p = Math.min(1, Math.max(0, (vh * 0.85 - box.top) / (box.height * 0.8)));
      show(p);
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
        {layers.map((l) => (
          <path
            key={l.key}
            data-at={l.at}
            d={ring(rad(l.at))}
            className={'cr-layer' + (l.end ? ' cr-end' : '')}
            style={{ '--bc': `var(--${l.band.clr})`, '--tone': l.band.tone }}
          />
        ))}
        {changes.map((c) => (
          <path key={c.org + c.title} data-at={c.at} d={ring(rad(c.at))} className="cr-change" style={{ '--bc': `var(--${c.clr})` }} />
        ))}
        <circle r={R0 * 0.55} className="cr-pith" />
      </svg>
    </figure>
  );
}
