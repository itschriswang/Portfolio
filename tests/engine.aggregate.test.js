// aggregate(): the reporting period, and the promise that every view of the
// year adds back up to the same year.

import test from 'node:test';
import assert from 'node:assert/strict';

import { aggregate, monthsBetween, priceEntry } from '../src/footprint/lib/engine';
import { QUALITY_TIERS } from '../src/footprint/data/factors';
import { parseImported } from '../src/footprint/lib/store';
import {
  PERIOD, settings, profileOf, quarterlyEnergy, sumByMonth, sumScopes, close,
} from './support/profiles';

// ---------------------------------------------------------------------------
// The window itself
// ---------------------------------------------------------------------------

test('a twelve-month period yields twelve months, in order', () => {
  const months = monthsBetween('2025-07', '2026-06');
  assert.equal(months.length, 12);
  assert.equal(months[0], '2025-07');
  assert.equal(months[11], '2026-06');
  assert.deepEqual(months, [...months].sort());
});

test('entries outside the window are counted nowhere', () => {
  const profile = profileOf([
    { category: 'electricity', date: '2026-01-15', meta: { kwh: 1000 } },
    { category: 'electricity', date: '2025-06-30', meta: { kwh: 9999 } }, // the day before the window
    { category: 'electricity', date: '2026-07-01', meta: { kwh: 9999 } }, // the day after
  ]);
  const agg = aggregate(profile);
  assert.equal(agg.count, 1, 'only the in-window entry counts');
  close(sumByMonth(agg), agg.total, 1e-9, 'the excluded entries leak into no month');
});

// ---------------------------------------------------------------------------
// Monthly reconciliation
// ---------------------------------------------------------------------------

test('the monthly chart sums back to the annual total', () => {
  const profile = profileOf([
    ...quarterlyEnergy({ kwh: 900, mj: 3000 }),
    { category: 'flight', date: '2026-01-05', meta: { km: 8317, return: true, band: 'longIntl', cabin: 'economy' } },
    { category: 'road', date: '2025-12-31', period_months: 6, meta: { mode: 'pt', km: 2600 } },
    { category: 'diet', date: '2026-06-30', period_months: 12, meta: { dietType: 'medMeat', days: 365 } },
    { category: 'goods', date: '2026-06-30', period_months: 12, meta: { kind: 'other', spendAud: 2160 } },
  ], settings({ householdSize: 2 }));

  const agg = aggregate(profile);
  assert.ok(agg.total > 0);
  close(sumByMonth(agg), agg.total, 1e-9, 'byMonth reconciles to the total');
});

test('a bill reaching back past the window start keeps its early share in the first month', () => {
  // Six months of energy billed to 31 August 2025: March through August. Four
  // of those six months sit before the window opens on 1 July.
  const profile = profileOf([
    { category: 'electricity', date: '2025-08-31', period_months: 6, meta: { kwh: 1200 } },
  ]);
  const agg = aggregate(profile);
  const total = agg.total;

  close(sumByMonth(agg), total, 1e-9, 'nothing is lost off the front of the window');
  close(agg.byMonth['2025-07'].electricity, (total / 6) * 5, 1e-9, 'the four out-of-window sixths land in the first window month, with its own');
  close(agg.byMonth['2025-08'].electricity, total / 6, 1e-9, 'August keeps exactly its own sixth');
  for (const key of agg.months.slice(2)) {
    assert.equal(agg.byMonth[key].electricity, undefined, `${key} is untouched`);
  }
});

test('a bill spanning far more than the window still reconciles', () => {
  // Nobody logs a twenty-year bill, but an imported file can carry anything,
  // and the total must survive it.
  const profile = profileOf([
    { category: 'gas', date: '2025-07-15', period_months: 240, meta: { mj: 12000 } },
  ]);
  const agg = aggregate(profile);
  close(sumByMonth(agg), agg.total, 1e-9, 'a 240-month span reconciles');
  close(agg.byMonth['2025-07'].gas, agg.total, 1e-9, 'all of it lands in the only window month it touches');
});

test('an annual entry dated at the window end spreads evenly across all twelve months', () => {
  const profile = profileOf([
    { category: 'diet', date: '2026-06-30', period_months: 12, meta: { dietType: 'medMeat', days: 365 } },
  ]);
  const agg = aggregate(profile);
  for (const key of agg.months) {
    close(agg.byMonth[key].diet, agg.total / 12, 1e-9, `${key} carries one twelfth`);
  }
  close(sumByMonth(agg), agg.total, 1e-9, 'twelve twelfths');
});

test('an entry with no period_months lands wholly in its own month', () => {
  const profile = profileOf([
    { category: 'flight', date: '2026-01-05', meta: { km: 8317, return: true, band: 'longIntl', cabin: 'economy' } },
  ]);
  const agg = aggregate(profile);
  close(agg.byMonth['2026-01'].flight, agg.total, 1e-9, 'January carries the lot');
  close(sumByMonth(agg), agg.total, 1e-9);
});

// ---------------------------------------------------------------------------
// Scopes
// ---------------------------------------------------------------------------

test('the scope split sums back to the total', () => {
  const profile = profileOf([
    ...quarterlyEnergy({ kwh: 900, mj: 3000 }),
    { category: 'road', date: '2026-01-15', meta: { mode: 'car', fuel: 'petrol', km: 12000, occupants: 1 } },
    { category: 'flight', date: '2026-01-05', meta: { km: 8317, return: true, band: 'longIntl', cabin: 'economy' } },
  ], settings({ householdSize: 2 }));

  const agg = aggregate(profile);
  close(sumScopes(agg), agg.total, 1e-3, 'scopes reconcile to the total');
  for (const n of ['1', '2', '3']) assert.ok(agg.byScope[n] > 0, `scope ${n} is populated`);
});

test('a component with an unrecognised scope folds into scope 3 rather than poisoning the tiles', () => {
  const profile = profileOf([
    { category: 'electricity', date: '2026-01-15', meta: { kwh: 1000 } },
  ]);
  // What a hand-edited or future-schema export could contain.
  profile.entries[0].components = [
    { scope: '2', tco2e: 0.4 },
    { scope: '9', tco2e: 0.2 },
    { scope: 'nonsense', tco2e: 0.1 },
  ];
  profile.entries[0].tco2e = 0.7;

  const agg = aggregate(profile);
  for (const n of ['1', '2', '3']) assert.ok(Number.isFinite(agg.byScope[n]), `scope ${n} is finite`);
  close(agg.byScope['2'], 0.4, 1e-9);
  close(agg.byScope['3'], 0.3, 1e-9, 'both unrecognised scopes fold into 3');
  close(sumScopes(agg), agg.total, 1e-9);
});

test('an entry saved before per-scope components still reports a scope', () => {
  const profile = profileOf([
    { category: 'gas', date: '2026-01-15', meta: { mj: 3000 } },
  ]);
  const { tco2e } = profile.entries[0];
  delete profile.entries[0].components;

  const agg = aggregate(profile);
  close(agg.byScope['1'], tco2e, 1e-9, 'it falls back to its dominant scope');
  close(sumScopes(agg), agg.total, 1e-9);
});

// ---------------------------------------------------------------------------
// Imported files
// ---------------------------------------------------------------------------

test('an import with malformed numbers aggregates to finite figures, not NaN', () => {
  const good = priceEntry({ category: 'electricity', date: '2026-01-15', meta: { kwh: 1000 } }, settings());
  const file = JSON.stringify({
    schema: 'cw-footprint/2',
    settings: settings(),
    period: PERIOD,
    entries: [
      good,
      { ...good, id: 'x1', tco2e: 'not a number' },
      { ...good, id: 'x2', tco2e: null, period_months: 'three' },
      { ...good, id: 'x3', components: 'broken' },
      { ...good, id: 'x4', components: [{ scope: null, tco2e: undefined }] },
      { date: '2026-02-01' }, // no category: dropped outright
      null,
    ],
    plan: { enabled: [] },
  });

  const profile = parseImported(file);
  const agg = aggregate(profile);

  assert.ok(Number.isFinite(agg.total), 'the total survives');
  for (const n of ['1', '2', '3']) assert.ok(Number.isFinite(agg.byScope[n]), `scope ${n} survives`);
  for (const v of Object.values(agg.byCategory)) assert.ok(Number.isFinite(v), 'every category survives');
  assert.ok(Number.isFinite(sumByMonth(agg)), 'every month survives');
  assert.ok(Number.isFinite(agg.uncertainty.low) && Number.isFinite(agg.uncertainty.high), 'the range survives');
  close(sumByMonth(agg), agg.total, 1e-9, 'and it still reconciles');
});

// ---------------------------------------------------------------------------
// Uncertainty and the derived readouts
// ---------------------------------------------------------------------------

test('the uncertainty band is each entry at its own tier, summed without correlation credit', () => {
  const profile = profileOf([
    { category: 'electricity', date: '2026-01-15', quality: 'metered', meta: { kwh: 1000 } },
    { category: 'goods', date: '2026-02-15', quality: 'estimated', meta: { kind: 'other', spendAud: 2000 } },
  ]);
  const agg = aggregate(profile);
  const expected = profile.entries[0].tco2e * QUALITY_TIERS.metered.band
    + profile.entries[1].tco2e * QUALITY_TIERS.estimated.band;

  close(agg.uncertainty.band, expected, 1e-9);
  close(agg.uncertainty.high, agg.total + expected, 1e-9);
  close(agg.uncertainty.low, Math.max(0, agg.total - expected), 1e-9);
});

test('the low end of the range never goes negative', () => {
  const profile = profileOf([
    { category: 'goods', date: '2026-02-15', quality: 'estimated', meta: { kind: 'other', spendAud: 100 } },
  ]);
  profile.entries[0].quality = 'estimated';
  // Force a band wider than the total, which linear summation can do on a
  // ledger of nothing but estimates.
  profile.entries.push({ ...profile.entries[0], id: 'neg', quality: 'estimated' });
  const agg = aggregate(profile);
  assert.ok(agg.uncertainty.low >= 0);
});

test('the largest entry and the worst month are the real ones', () => {
  const profile = profileOf([
    { category: 'electricity', date: '2025-09-15', meta: { kwh: 500 } },
    { category: 'flight', date: '2026-01-05', label: 'the big one', meta: { km: 8317, return: true, band: 'longIntl', cabin: 'economy' } },
    { category: 'road', date: '2026-03-15', meta: { mode: 'pt', km: 1000 } },
  ]);
  const agg = aggregate(profile);
  assert.equal(agg.largest.label, 'the big one');
  assert.equal(agg.worstMonth.month, '2026-01');
});

test('an empty year aggregates to zero, not to nothing', () => {
  const agg = aggregate(profileOf([]));
  assert.equal(agg.total, 0);
  assert.equal(agg.count, 0);
  assert.equal(agg.months.length, 12);
  assert.equal(agg.largest, null);
  assert.ok(Number.isFinite(agg.uncertainty.low) && Number.isFinite(agg.uncertainty.high));
  close(sumByMonth(agg), 0, 1e-12);
});
