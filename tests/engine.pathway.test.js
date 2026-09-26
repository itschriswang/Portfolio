// The pathway model and the cost curve: the plan must start from the audited
// numbers, and a change in how a household is described must never change what
// an action costs per tonne.

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  aggregate, baselineState, stateEmissions, projectPathway, maccData, ABATEMENT_OPTIONS,
} from '../src/footprint/lib/engine';
import { APPLY_ORDER } from '../src/footprint/data/abatement';
import { ELECTRICITY, GRID_DECLINE, ROAD_FUELS } from '../src/footprint/data/factors';
import { settings, profileOf, quarterlyEnergy, close } from './support/profiles';

const year0 = (profile) => {
  const agg = aggregate(profile);
  return { agg, emissions: stateEmissions({ ...baselineState(profile, agg), addedKwh0: 0 }, 0) };
};

// ---------------------------------------------------------------------------
// The plan starts where the audit ended
// ---------------------------------------------------------------------------

test('year zero of the pathway reproduces what the audit charged, on every grid', () => {
  // This is the invariant the grid-decline floor has to respect. A grid that
  // already sits below the floor must not be lifted up to it: the projection
  // would then open by charging a Vermont or New Zealand household more than
  // its own audit did.
  for (const [state, row] of Object.entries(ELECTRICITY)) {
    const profile = profileOf(
      [{ category: 'electricity', date: '2026-01-15', meta: { kwh: 5000 } }],
      settings({ country: row.country, state }),
    );
    const { agg, emissions } = year0(profile);
    // Tolerance is the engine's own 4 dp rounding of a stored entry, nothing
    // more: the two figures are the same arithmetic on the same factor.
    close(
      emissions.byCategory.electricity,
      agg.byCategory.electricity,
      1e-4,
      `${row.label} (${state}) opens the projection where the audit closed`,
    );
  }
});

test('the grid-decline floor never lifts a grid that is already cleaner than it', () => {
  const clean = Object.entries(ELECTRICITY).filter(([, r]) => r.s2 < GRID_DECLINE.floor);
  assert.ok(clean.length > 0, 'the factor table contains a grid below the floor, which is what makes this a real case');

  for (const [state, row] of clean) {
    const profile = profileOf(
      [{ category: 'electricity', date: '2026-01-15', meta: { kwh: 5000 } }],
      settings({ country: row.country, state }),
    );
    const agg = aggregate(profile);
    const base = baselineState(profile, agg);
    const series = Array.from({ length: 11 }, (_, i) => stateEmissions({ ...base, addedKwh0: 0 }, i).byCategory.electricity);

    close(series[0], agg.byCategory.electricity, 1e-4, `${row.label} year 0`);
    for (let i = 1; i < series.length; i++) {
      assert.ok(
        series[i] <= series[i - 1] + 1e-9,
        `${row.label}: the projected grid must never get dirtier (year ${i}: ${series[i]} > ${series[i - 1]})`,
      );
    }
  }
});

test('a dirty grid still decarbonises over the horizon', () => {
  const profile = profileOf(
    [{ category: 'electricity', date: '2026-01-15', meta: { kwh: 5000 } }],
    settings({ country: 'AU', state: 'VIC' }),
  );
  const agg = aggregate(profile);
  const base = baselineState(profile, agg);
  const y0 = stateEmissions({ ...base, addedKwh0: 0 }, 0).byCategory.electricity;
  const y10 = stateEmissions({ ...base, addedKwh0: 0 }, 10).byCategory.electricity;
  assert.ok(y10 < y0 * 0.6, 'ten years of background decline is visible');
});

test('the business-as-usual line opens on the audited total', () => {
  const profile = profileOf([
    ...quarterlyEnergy({ kwh: 1600, mj: 3000 }),
    { category: 'road', date: '2026-06-30', period_months: 12, meta: { mode: 'car', fuel: 'petrol', km: 12000, occupants: 1 } },
    { category: 'road', date: '2026-06-30', period_months: 12, meta: { mode: 'pt', km: 2600 } },
    { category: 'road', date: '2026-06-30', period_months: 12, meta: { mode: 'bus', km: 1200 } },
    { category: 'flight', date: '2026-01-05', meta: { km: 8317, return: true, band: 'longIntl', cabin: 'economy' } },
    { category: 'diet', date: '2026-06-30', period_months: 12, meta: { dietType: 'medMeat', days: 365 } },
    { category: 'goods', date: '2026-06-30', period_months: 12, meta: { kind: 'other', spendAud: 2160 } },
  ], settings({ householdSize: 2 }));

  const agg = aggregate(profile);
  const pathway = projectPathway(profile, agg);
  close(pathway.bau[0], agg.total, 0.02, 'the projection opens on the audited year');
  assert.equal(pathway.years[0], 2026);
  assert.equal(pathway.years.length, 11, 'a ten-year horizon, inclusive of year zero');
});

// ---------------------------------------------------------------------------
// The cost curve
// ---------------------------------------------------------------------------

// The same home, described as one adult, two adults or four. Household-shared
// energy is held constant in whole-home terms; personal activity is personal
// and stays as it is.
const sameHomeWith = (householdSize) => profileOf([
  ...quarterlyEnergy({ kwh: 1600, mj: 3000 }),
  { category: 'road', date: '2026-06-30', period_months: 12, meta: { mode: 'car', fuel: 'petrol', km: 12000, occupants: 1 } },
  { category: 'road', date: '2026-06-30', period_months: 12, meta: { mode: 'rideshare', km: 700 } },
  { category: 'road', date: '2026-06-30', period_months: 12, meta: { mode: 'pt', km: 2600 } },
  { category: 'flight', date: '2026-01-05', meta: { km: 8317, return: true, band: 'longIntl', cabin: 'economy' } },
  { category: 'flight', date: '2025-08-16', meta: { km: 2024, return: true, band: 'domestic', cabin: 'economy' } },
  { category: 'flight', date: '2026-04-05', meta: { km: 6288, return: true, band: 'longIntl', cabin: 'economy' } },
  { category: 'diet', date: '2026-06-30', period_months: 12, meta: { dietType: 'medMeat', days: 365 } },
  { category: 'freight', date: '2026-06-30', period_months: 12, meta: { mode: 'air', tonneKm: 600 } },
  { category: 'freight', date: '2026-06-30', period_months: 12, meta: { parcels: 40 } },
], settings({ householdSize, dwelling: 'house', roofOwn: true }));

test('dollars per tonne do not move when the same home is described with more adults', () => {
  const sizes = [1, 2, 4];
  const curves = sizes.map((n) => {
    const profile = sameHomeWith(n);
    return maccData(profile, aggregate(profile));
  });

  const reference = curves[0];
  assert.ok(reference.some((r) => r.id === 'solar' && r.applicable), 'solar is on the curve for this home');
  assert.ok(reference.some((r) => r.id === 'electrify-gas' && r.applicable), 'electrifying the gas is on the curve for this home');

  for (const row of reference) {
    if (!row.applicable || row.costPerTonne == null) continue;
    for (let i = 1; i < curves.length; i++) {
      const other = curves[i].find((r) => r.id === row.id);
      assert.equal(
        other.costPerTonne,
        row.costPerTonne,
        `${row.id}: $${other.costPerTonne}/t at ${sizes[i]} adults against $${row.costPerTonne}/t at ${sizes[0]}`,
      );
    }
  }
});

test('the whole-household measures do halve their per-person reduction as the household grows', () => {
  // The counterpart to the test above: the ratio holds because both sides of
  // it move, not because neither does.
  const one = maccData(sameHomeWith(1), aggregate(sameHomeWith(1)));
  const two = maccData(sameHomeWith(2), aggregate(sameHomeWith(2)));
  for (const id of ['solar', 'electrify-gas']) {
    const a = one.find((r) => r.id === id);
    const b = two.find((r) => r.id === id);
    close(b.reduction, a.reduction / 2, 5e-3, `${id} reduction halves per person`);
    assert.ok(a.reduction > 0.01, `${id} is a real reduction to begin with`);
  }
});

test('a personal measure is untouched by how many adults are at home', () => {
  const one = maccData(sameHomeWith(1), aggregate(sameHomeWith(1)));
  const four = maccData(sameHomeWith(4), aggregate(sameHomeWith(4)));
  for (const id of ['one-less-international', 'diet-low', 'halve-km']) {
    const a = one.find((r) => r.id === id);
    const b = four.find((r) => r.id === id);
    close(b.reduction, a.reduction, 1e-6, `${id} reduction is personal`);
    assert.equal(b.cost, a.cost, `${id} cost is personal`);
  }
});

// ---------------------------------------------------------------------------
// Applicability
// ---------------------------------------------------------------------------

test('solar and gas electrification are offered on a house you own the roof of, and nowhere else', () => {
  const cases = [
    [{ dwelling: 'house', roofOwn: true }, true],
    [{ dwelling: 'house', roofOwn: false }, false],
    [{ dwelling: 'apartment', roofOwn: true }, false],
    [{ dwelling: 'apartment', roofOwn: false }, false],
  ];
  for (const [over, expected] of cases) {
    const profile = profileOf(quarterlyEnergy({ kwh: 1600, mj: 3000 }), settings({ householdSize: 2, ...over }));
    const rows = maccData(profile, aggregate(profile));
    for (const id of ['solar', 'electrify-gas']) {
      assert.equal(
        rows.find((r) => r.id === id).applicable,
        expected,
        `${id} on a ${over.dwelling} with roofOwn ${over.roofOwn}`,
      );
    }
  }
});

test('a profile saved before the roof question was asked reads as owning its roof', () => {
  const profile = profileOf(quarterlyEnergy({ kwh: 1600, mj: 3000 }), settings({ householdSize: 2, dwelling: 'house' }));
  delete profile.settings.roofOwn;
  const base = baselineState(profile, aggregate(profile));
  assert.equal(base.roofOwn, true, 'absent means yes, not no');
});

test('an EV driver is never offered an EV', () => {
  const profile = profileOf([
    { category: 'road', date: '2026-06-30', period_months: 12, meta: { mode: 'car', fuel: 'ev', km: 12000, occupants: 1 } },
  ], settings());
  const rows = maccData(profile, aggregate(profile));
  assert.equal(rows.find((r) => r.id === 'ev-switch').applicable, false);
});

test('someone without a car is offered neither an EV nor fewer kilometres', () => {
  const profile = profileOf([
    { category: 'road', date: '2026-06-30', period_months: 12, meta: { mode: 'pt', km: 5200 } },
  ], settings());
  const rows = maccData(profile, aggregate(profile));
  for (const id of ['ev-switch', 'halve-km']) {
    assert.equal(rows.find((r) => r.id === id).applicable, false, id);
  }
});

// ---------------------------------------------------------------------------
// Sequencing
// ---------------------------------------------------------------------------

test('rooftop solar acts on the charging load an EV switch adds', () => {
  const carKm = 15000;
  const profile = profileOf([
    ...quarterlyEnergy({ kwh: 1600 }),
    { category: 'road', date: '2026-06-30', period_months: 12, meta: { mode: 'car', fuel: 'petrol', km: carKm, occupants: 1 } },
  ], settings({ householdSize: 2, dwelling: 'house', roofOwn: true }));
  const agg = aggregate(profile);

  const rows = maccData(profile, agg);
  const evAlone = rows.find((r) => r.id === 'ev-switch').reduction;
  const solarAlone = rows.find((r) => r.id === 'solar').reduction;

  // The same year zero the standalone bars are drawn at, with both actions
  // applied in APPLY_ORDER: electrification adds the load, then solar meets it.
  const base = baselineState(profile, agg);
  const before = stateEmissions({ ...base, addedKwh0: 0 }, 0).total;
  const st = { ...base, addedKwh0: 0 };
  for (const id of APPLY_ORDER) {
    const opt = ABATEMENT_OPTIONS.find((o) => o.id === id);
    if (opt && ['ev-switch', 'solar'].includes(id) && opt.applicable(base)) opt.apply(st, 1);
  }
  const combined = before - stateEmissions(st, 0).total;

  assert.ok(combined > Math.max(evAlone, solarAlone), 'the pair beats either alone');

  // The MACC bars are deliberately standalone, so the pair beats their sum
  // rather than falling short of it: the surplus is solar covering the EV's
  // new charging load, which neither bar can see on its own.
  const f = ELECTRICITY.NSW;
  const chargingCoveredBySolar = (carKm * ROAD_FUELS.ev.kWhPerKm * 0.6 * (f.s2 + f.s3)) / 1000;
  close(combined, evAlone + solarAlone + chargingCoveredBySolar, 1e-3, 'the interaction is exactly the solar-covered charging');
});

test('a bigger EV switch adds exactly the charging load the factor table says', () => {
  const profile = profileOf([
    { category: 'road', date: '2026-06-30', period_months: 12, meta: { mode: 'car', fuel: 'petrol', km: 10000, occupants: 1 } },
  ], settings());
  const agg = aggregate(profile);
  const base = baselineState(profile, agg);
  const switched = { ...base, addedKwh0: 0, evShare: 1 };
  const before = stateEmissions({ ...base, addedKwh0: 0 }, 0);
  const after = stateEmissions(switched, 0);

  const f = ELECTRICITY.NSW;
  const expectedCharging = (10000 * ROAD_FUELS.ev.kWhPerKm * (f.s2 + f.s3)) / 1000;
  close(after.byCategory.electricity, expectedCharging, 1e-6, 'the charging load lands on the meter');
  assert.equal(after.byCategory.road, 0, 'and the petrol goes to zero');
  assert.ok(after.total < before.total, 'on the NSW grid the swap is still a cut');
});

test('the enabled plan never includes an option that does not apply', () => {
  const profile = profileOf([
    ...quarterlyEnergy({ kwh: 1600 }),
  ], settings({ householdSize: 2, dwelling: 'apartment', roofOwn: false }));
  const agg = aggregate(profile);
  const pathway = projectPathway({ ...profile, plan: { enabled: ['solar', 'electrify-gas', 'one-less-international'] } }, agg);
  assert.deepEqual(pathway.enabled, [], 'none of the three apply to a renter in a flat with no flights');
  close(pathway.plan[0], pathway.bau[0], 1e-9, 'so the plan line sits on business as usual');
});
