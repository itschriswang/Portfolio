import test from 'node:test';
import assert from 'node:assert/strict';
import { monthIndex, parseSpan, careerRings } from '../src/lib/careerRings';
import { EXPERIENCE } from '../src/data/content';

// The Track record's ring figure is drawn from these numbers, so they are
// checked against the record itself rather than against a screenshot.
const NOW = new Date(2026, 10, 13); // 13 Nov 2026

test('dates read the way the record writes them', () => {
  assert.equal(monthIndex('Mar 2020'), 2020 * 12 + 2);
  assert.equal(monthIndex('present', NOW), 2026 * 12 + 10);
  assert.deepEqual(parseSpan('Mar 2020 to Feb 2022'), [2020 * 12 + 2, 2022 * 12 + 2]);
  assert.throws(() => parseSpan('2020'));
});

test('the rings run from the first role to today', () => {
  const g = careerRings(EXPERIENCE, NOW);
  const fromDates = Math.min(...EXPERIENCE.flatMap((e) => e.roles.map((r) => parseSpan(r.date, NOW)[0])));
  assert.equal(g.startYear, Math.floor(fromDates / 12));
  assert.equal(g.bands[0].from, 0, 'the first band starts at the pith');
  assert.equal(Math.max(...g.bands.map((b) => b.to)), 1, 'the last band ends at the bark');
});

test('one ring closes per calendar year, in order, inside the figure', () => {
  const g = careerRings(EXPERIENCE, NOW);
  const ys = g.years.map((y) => y.year);
  assert.deepEqual(ys, ys.slice().sort((a, b) => a - b));
  assert.equal(ys[0], g.startYear + 1);
  for (const y of g.years) assert.ok(y.at > 0 && y.at < 1);
});

test('every employer in the record is a band, oldest at the centre', () => {
  const g = careerRings(EXPERIENCE, NOW);
  assert.equal(g.bands.length, EXPERIENCE.length);
  for (let i = 1; i < g.bands.length; i++) assert.ok(g.bands[i].from >= g.bands[i - 1].from);
  for (const b of g.bands) assert.ok(b.to > b.from);
});

test('role changes inside an employer sit inside its band', () => {
  const g = careerRings(EXPERIENCE, NOW);
  for (const b of g.bands) {
    const exp = EXPERIENCE.find((e) => e.org === b.org);
    assert.equal(b.changes.length, exp.roles.length - 1);
    for (const c of b.changes) assert.ok(c.at > b.from && c.at < b.to);
  }
});
