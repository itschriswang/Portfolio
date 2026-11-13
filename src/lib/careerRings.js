// The arithmetic behind the Track record's tree-ring figure (CareerRings.jsx),
// kept in a plain module so the tests can read it (Node cannot parse JSX).
//
// A tree lays down one ring a year, so the figure does too: the pith is the
// first day of the first role, each calendar year closes a ring, and the bark is
// today. Employers are the bands between, and the role changes inside an
// employer are the finer lines within its band. Every position comes from the
// dates in EXPERIENCE (src/data/content.js), the same dates the timeline prints,
// so the figure can never say something the record does not.

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

// 'Mar 2020' -> months since year 0 (an absolute month index). 'present' and
// friends resolve to the month of `now`.
export function monthIndex(text, now = new Date()) {
  const t = String(text || '').trim().toLowerCase();
  if (!t || t === 'present' || t === 'now' || t === 'today') return now.getFullYear() * 12 + now.getMonth();
  const m = t.match(/^([a-z]{3})[a-z]*\s+(\d{4})$/);
  if (!m) throw new Error(`Unreadable date: "${text}"`);
  const mi = MONTHS.indexOf(m[1]);
  if (mi < 0) throw new Error(`Unreadable month: "${text}"`);
  return Number(m[2]) * 12 + mi;
}

// 'Mar 2020 to Feb 2022' -> [start, end], end inclusive of that month.
export function parseSpan(date, now = new Date()) {
  const [a, b] = String(date).split(/\s+to\s+/i);
  if (!b) throw new Error(`Unreadable span: "${date}"`);
  return [monthIndex(a, now), monthIndex(b, now) + 1];
}

// The figure's geometry, as fractions of the radius from pith (0) to bark (1).
export function careerRings(experience, now = new Date()) {
  const bands = experience.map((exp) => {
    const roles = exp.roles.map((r) => {
      const [from, to] = parseSpan(r.date, now);
      return { title: r.title, from, to };
    }).sort((x, y) => x.from - y.from);
    return {
      org: exp.org,
      clr: exp.clr,
      from: Math.min(...roles.map((r) => r.from)),
      to: Math.max(...roles.map((r) => r.to)),
      roles,
    };
  }).sort((x, y) => x.from - y.from);

  const start = bands[0].from;
  const end = Math.max(...bands.map((b) => b.to));
  const span = end - start;
  const at = (m) => Math.min(1, Math.max(0, (m - start) / span));

  // A ring closes at each new calendar year after the start.
  const years = [];
  const firstYear = Math.floor(start / 12) + 1;
  for (let y = firstYear; y * 12 < end; y++) years.push({ year: y, at: at(y * 12) });

  return {
    startYear: Math.floor(start / 12),
    months: span,
    years,
    bands: bands.map((b) => ({
      org: b.org,
      clr: b.clr,
      from: at(b.from),
      to: at(b.to),
      // Role changes inside the band: every start after the band's first.
      changes: b.roles.slice(1).map((r) => ({ title: r.title, at: at(r.from) })),
    })),
  };
}
