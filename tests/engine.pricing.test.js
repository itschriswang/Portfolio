// priceEntry: what a single logged activity is charged, and what happens when
// the thing being logged is nonsense.

import test from 'node:test';
import assert from 'node:assert/strict';

import { priceEntry } from '../src/footprint/lib/engine';
import {
  ELECTRICITY, ROAD_MODES, ROAD_FUELS, FACTOR_SET, PT_MODE_RATIO,
} from '../src/footprint/data/factors';
import { settings, close } from './support/profiles';

const scopeOf = (entry, n) =>
  (entry.components || []).filter((c) => c.scope === n).reduce((s, c) => s + c.tco2e, 0);

// ---------------------------------------------------------------------------
// Certified renewable purchases
// ---------------------------------------------------------------------------

test('GreenPower nets off scope 2 on the home meter and leaves scope 3 whole', () => {
  const meta = { kwh: 1000, wholeHousehold: false };
  const none = priceEntry({ category: 'electricity', date: '2026-01-15', meta }, settings({ greenpowerPct: 0 }));
  const full = priceEntry({ category: 'electricity', date: '2026-01-15', meta }, settings({ greenpowerPct: 100 }));
  const half = priceEntry({ category: 'electricity', date: '2026-01-15', meta }, settings({ greenpowerPct: 50 }));

  const { s2, s3 } = ELECTRICITY.NSW;
  close(scopeOf(none, '2'), s2, 1e-9, 'scope 2 at no GreenPower');
  close(scopeOf(full, '2'), 0, 1e-9, 'scope 2 at 100% GreenPower');
  close(scopeOf(half, '2'), s2 / 2, 1e-9, 'scope 2 at 50% GreenPower');

  // Scope 3 is the fuel cycle and the network losses behind the kWh. Buying a
  // certificate does not undo either, so it is untouched at every level.
  for (const entry of [none, full, half]) {
    close(scopeOf(entry, '3'), s3, 1e-9, 'scope 3 is never netted');
  }
});

test('GreenPower nets EV charging the same way it nets the home meter', () => {
  const meta = { mode: 'car', fuel: 'ev', km: 10000, occupants: 1 };
  const none = priceEntry({ category: 'road', date: '2026-01-15', meta }, settings({ greenpowerPct: 0 }));
  const full = priceEntry({ category: 'road', date: '2026-01-15', meta }, settings({ greenpowerPct: 100 }));

  const kwh = 10000 * ROAD_FUELS.ev.kWhPerKm;
  const { s2, s3 } = ELECTRICITY.NSW;

  close(scopeOf(none, '2'), (kwh * s2) / 1000, 1e-9, 'EV scope 2 at no GreenPower');
  close(scopeOf(full, '2'), 0, 1e-9, 'EV scope 2 at 100% GreenPower');
  close(scopeOf(none, '3'), (kwh * s3) / 1000, 1e-9, 'EV scope 3 at no GreenPower');
  close(scopeOf(full, '3'), (kwh * s3) / 1000, 1e-9, 'EV scope 3 is never netted');

  // An EV never burns anything, so it must carry no scope 1 at all.
  close(scopeOf(none, '1'), 0, 1e-12, 'an EV has no scope 1');
});

test('a petrol car is unaffected by a GreenPower purchase', () => {
  const meta = { mode: 'car', fuel: 'petrol', km: 10000, occupants: 1 };
  const none = priceEntry({ category: 'road', date: '2026-01-15', meta }, settings({ greenpowerPct: 0 }));
  const full = priceEntry({ category: 'road', date: '2026-01-15', meta }, settings({ greenpowerPct: 100 }));
  assert.equal(none.tco2e, full.tco2e);
  assert.ok(none.tco2e > 0);
});

// ---------------------------------------------------------------------------
// United States, priced per state
// ---------------------------------------------------------------------------

test('US electricity prices from the state, not a national average', () => {
  const meta = { kwh: 5400 };
  const priceIn = (state) => priceEntry({ category: 'electricity', date: '2026-01-15', meta }, settings({ country: 'US', state })).tco2e;

  for (const key of ['US-VT', 'US-WV', 'US-CA', 'US-OH']) {
    const row = ELECTRICITY[key];
    close(priceIn(key), (5400 * (row.s2 + row.s3)) / 1000, 5e-4, `${row.label} prices from its own row`);
  }

  // The whole point of the state table: these two are the same household.
  assert.ok(priceIn('US-WV') > priceIn('US-VT') * 20, 'the spread survives into a priced entry');
});

test('a US audit with no state, or an unknown one, falls back to the national average', () => {
  const meta = { kwh: 5400 };
  const national = (5400 * (ELECTRICITY.US.s2 + ELECTRICITY.US.s3)) / 1000;
  for (const state of [undefined, '', 'US-ZZ', 'NSW-typo']) {
    const entry = priceEntry({ category: 'electricity', date: '2026-01-15', meta }, settings({ country: 'US', state }));
    close(entry.tco2e, national, 5e-4, `state ${String(state)} falls back to the national row`);
  }
});

test('the Australian state keys never collide with the American ones', () => {
  // WA means Western Australia here and Washington there. If the namespacing
  // ever broke, a Perth audit would silently price on the Washington grid.
  const perth = priceEntry({ category: 'electricity', date: '2026-01-15', meta: { kwh: 1000 } }, settings({ country: 'AU', state: 'WA' }));
  const washington = priceEntry({ category: 'electricity', date: '2026-01-15', meta: { kwh: 1000 } }, settings({ country: 'US', state: 'US-WA' }));
  close(perth.tco2e, (1000 * (ELECTRICITY.WA.s2 + ELECTRICITY.WA.s3)) / 1000, 5e-4, 'Western Australia');
  close(washington.tco2e, (1000 * (ELECTRICITY['US-WA'].s2 + ELECTRICITY['US-WA'].s3)) / 1000, 5e-4, 'Washington state');
  assert.notEqual(perth.tco2e, washington.tco2e);
});

// ---------------------------------------------------------------------------
// The bus / rail split
// ---------------------------------------------------------------------------

test('bus and rail price from their own rows, not one blended proxy', () => {
  const km = 5200;
  const rail = priceEntry({ category: 'road', date: '2026-01-15', meta: { mode: 'pt', km } }, settings());
  const bus = priceEntry({ category: 'road', date: '2026-01-15', meta: { mode: 'bus', km } }, settings());

  close(rail.tco2e, (km * ROAD_MODES.pt.perKm) / 1000, 5e-4, 'rail');
  close(bus.tco2e, (km * ROAD_MODES.bus.perKm) / 1000, 5e-4, 'bus');

  // The finding the split exists for: a bus is about four times a train.
  close(bus.tco2e / rail.tco2e, PT_MODE_RATIO, 1e-3, 'bus/rail ratio');
  assert.equal(Math.round(PT_MODE_RATIO), 4, 'the "about four times" the copy states');
});

test('per-passenger modes take no occupancy split', () => {
  // Rail, bus and rideshare factors are already per passenger-km. Dividing
  // them by occupants a second time would understate a shared trip.
  for (const mode of ['pt', 'bus', 'rideshare', 'taxi']) {
    const alone = priceEntry({ category: 'road', date: '2026-01-15', meta: { mode, km: 100 } }, settings());
    const together = priceEntry({ category: 'road', date: '2026-01-15', meta: { mode, km: 100, occupants: 4 } }, settings());
    assert.equal(alone.tco2e, together.tco2e, `${mode} ignores occupancy`);
  }
});

test('a car splits across its occupants', () => {
  const alone = priceEntry({ category: 'road', date: '2026-01-15', meta: { mode: 'car', fuel: 'petrol', km: 1000, occupants: 1 } }, settings());
  const shared = priceEntry({ category: 'road', date: '2026-01-15', meta: { mode: 'car', fuel: 'petrol', km: 1000, occupants: 4 } }, settings());
  close(shared.tco2e, alone.tco2e / 4, 5e-4, 'four to a car is a quarter each');
});

// ---------------------------------------------------------------------------
// Household share
// ---------------------------------------------------------------------------

test('a whole-household bill splits per adult, a personal one does not', () => {
  const solo = priceEntry({ category: 'electricity', date: '2026-01-15', meta: { kwh: 1000, wholeHousehold: true } }, settings({ householdSize: 1 }));
  const shared = priceEntry({ category: 'electricity', date: '2026-01-15', meta: { kwh: 1000, wholeHousehold: true } }, settings({ householdSize: 4 }));
  const personal = priceEntry({ category: 'electricity', date: '2026-01-15', meta: { kwh: 1000 } }, settings({ householdSize: 4 }));

  close(shared.tco2e, solo.tco2e / 4, 5e-4, 'a shared bill is a quarter of it');
  close(personal.tco2e, solo.tco2e, 5e-4, 'a personal entry is never split');
});

// ---------------------------------------------------------------------------
// Malformed and missing input
// ---------------------------------------------------------------------------

const JUNK = [undefined, null, '', 'abc', NaN, Infinity, -Infinity, -5, {}, []];

test('every category prices missing or malformed activity to zero, never NaN', () => {
  const cases = [
    ['electricity', (v) => ({ kwh: v })],
    ['gas', (v) => ({ mj: v })],
    ['road', (v) => ({ mode: 'car', fuel: 'petrol', km: v })],
    ['road', (v) => ({ mode: 'car', fuel: 'ev', km: v })],
    ['road', (v) => ({ mode: 'pt', km: v })],
    ['road', (v) => ({ mode: 'bus', km: v })],
    ['road', (v) => ({ mode: 'rideshare', km: v })],
    ['flight', (v) => ({ km: v, band: 'longIntl', cabin: 'economy' })],
    ['freight', (v) => ({ mode: 'air', tonneKm: v })],
    ['freight', (v) => ({ parcels: v })],
    ['diet', (v) => ({ dietType: 'medMeat', days: v })],
    ['other', (v) => ({ fuel: 'lpg', amount: v })],
    ['goods', (v) => ({ kind: 'clothing', spendAud: v })],
    ['hotel', (v) => ({ nights: v })],
    ['dwelling', (v) => ({ dwelling: 'house', areaM2: v })],
  ];

  for (const [category, metaOf] of cases) {
    for (const junk of JUNK) {
      const entry = priceEntry({ category, date: '2026-01-15', meta: metaOf(junk) }, settings());
      assert.equal(entry.tco2e, 0, `${category} with ${String(junk)} prices to zero`);
      assert.ok(Number.isFinite(entry.tco2e), `${category} with ${String(junk)} is finite`);
      assert.ok(Number.isFinite(entry.activity_data), `${category} activity with ${String(junk)} is finite`);
      assert.ok(Number.isFinite(entry.factor_used), `${category} factor with ${String(junk)} is finite`);
      for (const c of entry.components) {
        assert.ok(Number.isFinite(c.tco2e), `${category} component with ${String(junk)} is finite`);
      }
    }
  }
});

test('an entry with no meta at all still prices to a complete, finite entry', () => {
  for (const category of ['electricity', 'gas', 'road', 'flight', 'freight', 'diet', 'other', 'goods', 'hotel', 'dwelling']) {
    const entry = priceEntry({ category, date: '2026-01-15' }, settings());
    assert.equal(entry.tco2e, 0, `${category} with no meta`);
    assert.ok(typeof entry.unit === 'string', `${category} still reports a unit`);
    assert.ok(typeof entry.factor_source === 'string' && entry.factor_source.length > 0, `${category} still names a source`);
    assert.equal(entry.factor_set, FACTOR_SET.id, `${category} still records its factor vintage`);
  }
});

test('unknown sub-types fall back rather than throwing or pricing to NaN', () => {
  const cases = [
    { category: 'road', meta: { mode: 'car', fuel: 'unobtainium', km: 100 } },
    { category: 'diet', meta: { dietType: 'breatharian', days: 365 } },
    { category: 'goods', meta: { kind: 'antimatter', spendAud: 500 } },
    { category: 'other', meta: { fuel: 'plutonium', amount: 10 } },
    { category: 'freight', meta: { mode: 'teleport', tonneKm: 100 } },
    { category: 'hotel', meta: { nights: 3, country: 'ZZ' } },
    { category: 'dwelling', meta: { dwelling: 'yurt', areaM2: 80 } },
  ];
  for (const c of cases) {
    const entry = priceEntry({ ...c, date: '2026-01-15' }, settings());
    assert.ok(Number.isFinite(entry.tco2e), `${c.category} ${JSON.stringify(c.meta)} is finite`);
    assert.ok(entry.tco2e > 0, `${c.category} ${JSON.stringify(c.meta)} falls back to a real factor`);
  }
});

test('clothing counted by item ignores junk rows and counts the real ones', () => {
  const entry = priceEntry({
    category: 'goods',
    date: '2026-01-15',
    meta: { kind: 'clothingItems', items: { tops: 4, notAThing: 10, jumpers: 'two', shoes: -3, coats: 1 } },
  }, settings());
  assert.equal(entry.activity_data, 5, 'four tops and one coat, nothing else');
  assert.ok(entry.tco2e > 0 && Number.isFinite(entry.tco2e));
});

test('an unknown category is a programming error, and says so', () => {
  assert.throws(
    () => priceEntry({ category: 'unicorns', date: '2026-01-15', meta: {} }, settings()),
    /Unknown category/,
  );
});

// ---------------------------------------------------------------------------
// Provenance
// ---------------------------------------------------------------------------

test('every priced entry snapshots its factor and its vintage', () => {
  const entry = priceEntry({ category: 'electricity', date: '2026-01-15', meta: { kwh: 1000 } }, settings());
  assert.equal(entry.factor_set, FACTOR_SET.id);
  close(entry.factor_used, ELECTRICITY.NSW.s2 + ELECTRICITY.NSW.s3, 1e-4, 'the effective per-unit factor is recorded');
  assert.match(entry.factor_source, /DCCEEW/);
});
