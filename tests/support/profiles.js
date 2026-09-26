// Profile builders shared by the suites. Everything here goes through the
// real priceEntry, so a fixture can never drift from what the app would
// actually store.

import { priceEntry } from '../../src/footprint/lib/engine';

export const PERIOD = { label: 'FY2026', start: '2025-07-01', end: '2026-06-30' };

export const settings = (over = {}) => ({
  country: 'AU',
  state: 'NSW',
  householdSize: 1,
  dwelling: 'house',
  roofOwn: true,
  dietType: 'medMeat',
  fuelType: 'petrol',
  greenpowerPct: 0,
  ...over,
});

// A profile from a list of drafts, priced through the engine under `s`.
export const profileOf = (drafts, s = settings(), period = PERIOD) => ({
  schema: 'cw-footprint/2',
  kind: 'own',
  settings: s,
  period: { ...period },
  entries: drafts.map((d) => priceEntry({ date: period.end, ...d }, s)),
  plan: { enabled: [] },
  pastYears: [],
});

// The four quarterly bills the guided audit writes, at a whole-household
// quantity. Dates match the onboarding's own quarter ends closely enough for
// the aggregation to behave the same way.
export const quarterlyEnergy = ({ kwh = 0, mj = 0 }) => {
  const dates = ['2025-09-28', '2025-12-28', '2026-03-28', '2026-06-28'];
  const out = [];
  for (const date of dates) {
    if (kwh > 0) out.push({ category: 'electricity', date, period_months: 3, meta: { kwh, wholeHousehold: true } });
    if (mj > 0) out.push({ category: 'gas', date, period_months: 3, meta: { mj, wholeHousehold: true } });
  }
  return out;
};

// Sum of every month bucket in an aggregate, across every category.
export const sumByMonth = (agg) =>
  agg.months.reduce(
    (total, key) => total + Object.values(agg.byMonth[key] || {}).reduce((s, v) => s + v, 0),
    0,
  );

export const sumScopes = (agg) => ['1', '2', '3'].reduce((s, n) => s + (agg.byScope[n] || 0), 0);

export const close = (actual, expected, tolerance, message) => {
  const ok = Math.abs(actual - expected) <= tolerance;
  if (!ok) {
    throw new Error(
      (message || 'value out of tolerance')
      + `: got ${actual}, expected ${expected} (±${tolerance}, off by ${Math.abs(actual - expected)})`,
    );
  }
};
