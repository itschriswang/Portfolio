// Figures the site states in prose, checked against the factor tables they
// were derived from.
//
// The rule this enforces is the one the whole footprint section rests on: no
// sentence quotes a number the data does not carry. When a factor refresh
// moves one of these, the test fails and the copy has to move with it, which
// is the point. A failure here is not a bug in the engine, it is a sentence
// that has gone out of date.

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ELECTRICITY, ROAD_MODES, US_GRID_SPREAD, PT_MODE_RATIO,
} from '../src/footprint/data/factors';
import { ONBOARD, METHOD, PLAN, ENERGY_PRESETS, listOf } from '../src/footprint/data/copy';
import { GRID_ST, NEEDLE } from '../src/footprint/data/storyCopy';
import { gridSwapFor, modeSwapFor, GRID_SWAP_MIN_SWING_T } from '../src/footprint/lib/swaps';
import { aggregate } from '../src/footprint/lib/engine';
import { settings, profileOf, quarterlyEnergy, close } from './support/profiles';

const paras = (block) => block.paras.join(' ');

// ---------------------------------------------------------------------------
// The American grid spread
// ---------------------------------------------------------------------------

test('the extremes of the US table are Vermont and West Virginia', () => {
  assert.equal(US_GRID_SPREAD.clean.key, 'US-VT');
  assert.equal(US_GRID_SPREAD.dirty.key, 'US-WV');
  assert.equal(US_GRID_SPREAD.clean.s2, ELECTRICITY['US-VT'].s2);
  assert.equal(US_GRID_SPREAD.dirty.s2, ELECTRICITY['US-WV'].s2);
});

test('the spread the site quotes is the spread the table carries', () => {
  const rounded = Math.round(US_GRID_SPREAD.ratio);
  assert.equal(rounded, 38, `the derived ratio rounds to ${rounded}, not 38`);

  // Every place the number appears in prose.
  assert.match(ONBOARD.you.usGridNote, new RegExp(`about ${rounded} times`));
  assert.match(paras(METHOD.sources), new RegExp(`a spread of about ${rounded} times`));
});

test('the two factors the method quotes to two decimals are the ones in the table', () => {
  const text = paras(METHOD.sources);
  assert.match(text, new RegExp(`${US_GRID_SPREAD.clean.s2.toFixed(2)} kg CO`), 'the Vermont figure');
  assert.match(text, new RegExp(`to ${US_GRID_SPREAD.dirty.s2.toFixed(2)} in West Virginia`), 'the West Virginia figure');
  assert.match(text, /Vermont/);
  assert.match(text, /West Virginia/);
});

test('the reveal never hard-codes a state name the table could move', () => {
  // The moment reads its labels from the factor rows, so the copy carries
  // placeholders rather than "Vermont" and "West Virginia" in prose.
  const copy = [GRID_ST.headline, GRID_ST.sub, GRID_ST.punch, GRID_ST.swing.line, GRID_ST.note].join(' ');
  assert.doesNotMatch(copy, /Vermont|West Virginia/);
  assert.match(GRID_ST.rows.clean, /\{name\}/);
  assert.match(GRID_ST.rows.dirty, /\{name\}/);
});

// ---------------------------------------------------------------------------
// The 4.9 t swing, on the household the US quick path actually builds
// ---------------------------------------------------------------------------

// The US "House" preset: 1,350 kWh per adult per quarter, two adults, which is
// the EIA average residential customer (10,791 kWh a year) split per adult.
const usHouse = (state) => {
  const preset = ENERGY_PRESETS.US.find((p) => p.id === 'house');
  return profileOf(
    quarterlyEnergy({ kwh: preset.kwhPerAdult * 2, mj: Math.round(preset.gasPerAdult * 2 * 105.505) })
      .concat([{ category: 'diet', date: '2026-06-30', period_months: 12, meta: { dietType: 'medMeat', days: 365 } }]),
    settings({ country: 'US', state, householdSize: 2, dwelling: 'house', roofOwn: true }),
  );
};

test('the same household moves 4.9 t between the lightest state grid and the heaviest', () => {
  const preset = ENERGY_PRESETS.US.find((p) => p.id === 'house');
  assert.equal(preset.kwhPerAdult, 1350, 'the preset this figure is quoted against');

  const kwhPerAdultPerYear = preset.kwhPerAdult * 4;
  assert.equal(kwhPerAdultPerYear, 5400);

  const vt = aggregate(usHouse('US-VT'));
  const wv = aggregate(usHouse('US-WV'));
  const swing = wv.total - vt.total;

  // 5,400 kWh a year at the difference between the two rows.
  const expected = (kwhPerAdultPerYear
    * ((ELECTRICITY['US-WV'].s2 + ELECTRICITY['US-WV'].s3) - (ELECTRICITY['US-VT'].s2 + ELECTRICITY['US-VT'].s3))) / 1000;
  close(swing, expected, 5e-3, 'the swing is the factor difference times the audited kilowatt-hours');
  close(swing, 4.9, 0.05, 'and it rounds to the 4.9 t the finding names');

  // Nothing but the electricity line moved.
  for (const category of ['gas', 'diet']) {
    close(wv.byCategory[category], vt.byCategory[category], 1e-9, `${category} is untouched by the swap`);
  }
});

// ---------------------------------------------------------------------------
// The grid moment: when it appears, and what it says when it does
// ---------------------------------------------------------------------------

test('the grid moment appears for a US audit and for nobody else', () => {
  const us = usHouse('US-OH');
  assert.ok(gridSwapFor(us, aggregate(us)), 'a US audit gets it');

  for (const s of [
    settings({ country: 'AU', state: 'NSW', householdSize: 2 }),
    settings({ country: 'NZ', state: 'NZ', householdSize: 2 }),
  ]) {
    const p = profileOf(quarterlyEnergy({ kwh: 1600, mj: 3000 }), s);
    assert.equal(gridSwapFor(p, aggregate(p)), null, `${s.country} never sees it`);
  }
});

test('the grid moment stays away when there is nothing to say', () => {
  const noPower = profileOf(
    [{ category: 'diet', date: '2026-06-30', period_months: 12, meta: { dietType: 'medMeat', days: 365 } }],
    settings({ country: 'US', state: 'US-OH' }),
  );
  assert.equal(gridSwapFor(noPower, aggregate(noPower)), null, 'no electricity, no moment');

  // A tiny meter cannot move enough between the extremes to earn a screen.
  const tiny = profileOf(
    [{ category: 'electricity', date: '2026-01-15', meta: { kwh: 50 } }],
    settings({ country: 'US', state: 'US-OH' }),
  );
  assert.equal(gridSwapFor(tiny, aggregate(tiny)), null, 'a trivial swing is not a moment');
});

test('a fully certified renewable plan collapses the swap, and the moment stands down', () => {
  const green = profileOf(
    quarterlyEnergy({ kwh: 2700 }),
    settings({ country: 'US', state: 'US-OH', householdSize: 2, greenpowerPct: 100 }),
  );
  // Scope 2 is netted off, so only the loss gross-up is left to differ.
  assert.equal(gridSwapFor(green, aggregate(green)), null, 'nothing worth a screen survives the netting');
});

test('the grid moment reports the visitor’s own year, with only the wire changed', () => {
  const profile = usHouse('US-OH');
  const agg = aggregate(profile);
  const g = gridSwapFor(profile, agg);

  assert.equal(g.your.total, agg.total, 'the "where you live" row is the total the rest of the story shows');
  assert.ok(g.clean.total < g.your.total && g.your.total < g.dirty.total, 'Ohio sits between the two');
  close(g.swing, g.dirty.total - g.clean.total, 1e-9);
  close(g.swing, 4.9, 0.05, 'the same 4.9 t, reached through the moment');
  assert.ok(g.swing >= GRID_SWAP_MIN_SWING_T);
  assert.equal(g.ratio, 38);

  assert.equal(g.clean.label, ELECTRICITY['US-VT'].label);
  assert.equal(g.dirty.label, ELECTRICITY['US-WV'].label);
  assert.equal(g.your.label, ELECTRICITY['US-OH'].label);
});

test('the grid axis places every state, with the extremes at the ends', () => {
  const profile = usHouse('US-OH');
  const g = gridSwapFor(profile, aggregate(profile));

  assert.equal(g.ticks.length, 52, 'every state, DC and Puerto Rico, and no national average');
  for (const t of g.ticks) {
    assert.ok(t.pos >= -1e-9 && t.pos <= 1 + 1e-9, `${t.key} sits on the axis (${t.pos})`);
  }
  close(g.ticks.find((t) => t.key === 'US-VT').pos, 0, 1e-9);
  close(g.ticks.find((t) => t.key === 'US-WV').pos, 1, 1e-9);
  assert.equal(g.ticks.filter((t) => t.you).length, 1, 'exactly one tick is marked as yours');
  assert.equal(g.ticks.find((t) => t.you).key, 'US-OH');
  close(g.your.pos, g.ticks.find((t) => t.you).pos, 1e-9);
});

// ---------------------------------------------------------------------------
// The bus and the train
// ---------------------------------------------------------------------------

test('the four times the site states is the ratio the two rows carry', () => {
  const rounded = Math.round(PT_MODE_RATIO);
  assert.equal(rounded, 4, `the derived ratio rounds to ${rounded}, not 4`);
  close(PT_MODE_RATIO, ROAD_MODES.bus.perKm / ROAD_MODES.pt.perKm, 1e-12);

  assert.match(paras(METHOD.quality), /roughly four times the carbon of a train per passenger-kilometre/);
  assert.match(ROAD_MODES.bus.source, /bus/i);
  assert.match(NEEDLE.modeSwap.tail, /\{x\} times the carbon of a train/);
});

test('the mode line leads with whichever mode the visitor actually logged', () => {
  const rail = profileOf([{ category: 'road', date: '2026-06-30', period_months: 12, meta: { mode: 'pt', km: 5200 } }], settings());
  const bus = profileOf([{ category: 'road', date: '2026-06-30', period_months: 12, meta: { mode: 'bus', km: 5200 } }], settings());
  const both = profileOf([
    { category: 'road', date: '2026-06-30', period_months: 12, meta: { mode: 'pt', km: 5200 } },
    { category: 'road', date: '2026-06-30', period_months: 12, meta: { mode: 'bus', km: 1200 } },
  ], settings());

  const r = modeSwapFor(rail);
  assert.equal(r.lead, 'rail');
  assert.equal(r.km, 5200);
  close(r.asIs, (5200 * ROAD_MODES.pt.perKm) / 1000, 1e-9);
  close(r.swapped, (5200 * ROAD_MODES.bus.perKm) / 1000, 1e-9);
  close(r.swapped / r.asIs, PT_MODE_RATIO, 1e-9, 'the train commuter sees the bus cost four times');

  const b = modeSwapFor(bus);
  assert.equal(b.lead, 'bus');
  close(b.asIs / b.swapped, PT_MODE_RATIO, 1e-9, 'the bus commuter sees the train cost a quarter');

  // Someone who logged both is a bus rider for the purposes of this line: the
  // actionable sentence is the one about the kilometres they could move.
  const t = modeSwapFor(both);
  assert.equal(t.lead, 'bus');
  assert.equal(t.km, 1200);
});

test('the mode line stays away from someone who logged no ground public transport', () => {
  const drives = profileOf([
    { category: 'road', date: '2026-06-30', period_months: 12, meta: { mode: 'car', fuel: 'petrol', km: 12000, occupants: 1 } },
    { category: 'road', date: '2026-06-30', period_months: 12, meta: { mode: 'rideshare', km: 700 } },
  ], settings());
  assert.equal(modeSwapFor(drives), null);
  assert.equal(modeSwapFor(profileOf([], settings())), null);
});

test('kilometres outside the reporting window are not in the mode line', () => {
  const p = profileOf([
    { category: 'road', date: '2026-06-30', period_months: 12, meta: { mode: 'bus', km: 1000 } },
    { category: 'road', date: '2024-06-30', period_months: 12, meta: { mode: 'bus', km: 9000 } },
  ], settings());
  assert.equal(modeSwapFor(p).km, 1000);
});

// ---------------------------------------------------------------------------
// The scope 3 convention, as the method page now describes it
// ---------------------------------------------------------------------------

test('the method describes the three scope 3 conventions the table actually uses', () => {
  const text = paras(METHOD.scope3);
  assert.match(text, /4\.2 per cent/, 'the eGRID gross loss');
  assert.match(text, /0\.958/, 'and the gross-up it implies');

  // The Australian range the section quotes, to the nearest whole per cent.
  const auShares = Object.values(ELECTRICITY)
    .filter((r) => r.country === 'AU')
    .map((r) => (r.s3 / r.s2) * 100);
  assert.match(text, new RegExp(`about ${Math.round(Math.min(...auShares))} per cent`), 'the lightest Australian scope 3 share');
  assert.match(text, new RegExp(`about ${Math.round(Math.max(...auShares))} per cent`), 'the heaviest');

  const nzShare = Math.round((ELECTRICITY.NZ.s3 / ELECTRICITY.NZ.s2) * 100);
  assert.match(text, new RegExp(`about ${nzShare} per cent`), 'the New Zealand loss factor');

  // And it says which way the difference bites, rather than only that it exists.
  assert.match(text, /understates|reads slightly light|light against/i);
});

test('the section that used to carry the gross-up in passing no longer does', () => {
  // It moved into its own section; leaving both would let them drift apart.
  assert.doesNotMatch(paras(METHOD.sources), /grid gross loss/);
});

// ---------------------------------------------------------------------------
// The quick path's stated assumption
// ---------------------------------------------------------------------------

test('the quick path says on screen what it is assuming about the home', () => {
  assert.match(ONBOARD.express.assumeNote, /flat/);
  assert.match(ONBOARD.express.assumeNote, /solar/);
  assert.match(ONBOARD.express.assumeNote, /results page/);
  // And the method page carries the same disclosure.
  assert.match(paras(METHOD.quality), /never asks about the building or the roof/);
});

test('the nudge wording covers both the one-option and two-option cases', () => {
  assert.match(PLAN.dwellingNudge.kicker, /\{n\}/);
  assert.match(PLAN.dwellingNudge.kicker, /\{verb\}/);
  assert.equal(PLAN.dwellingNudge.counts[1], 'One');
  assert.equal(PLAN.dwellingNudge.counts[2], 'Two');
});

test('the list helper joins the way the copy expects', () => {
  assert.equal(listOf([]), '');
  assert.equal(listOf(['Rooftop solar (6.6 kW)']), 'Rooftop solar (6.6 kW)');
  assert.equal(listOf(['a', 'b']), 'a and b');
  assert.equal(listOf(['a', 'b', 'c']), 'a, b and c', 'no serial comma');
  assert.equal(listOf([null, 'a', undefined, 'b']), 'a and b', 'gaps are dropped');
  assert.equal(listOf(undefined), '');
});
