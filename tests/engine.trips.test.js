// Trips, not ledger rows: the flight levers act on what a person books or
// skips. A rough count of three returns is three trips; a five-leg circuit is
// one; a trip's hotel nights leave with it when it is dropped.

import test from 'node:test';
import assert from 'node:assert/strict';

import { aggregate, maccData, projectPathway } from '../src/footprint/lib/engine';
import { CLOSER_TRIP } from '../src/footprint/data/abatement';
import { FLIGHT_FACTORS, FLIGHT_DISTANCE_UPLIFT } from '../src/footprint/data/factors';
import { tripsOf, biggestIntlTrip } from '../src/footprint/lib/trips';
import { buildSeedProfile } from '../src/footprint/data/seedProfile';
import { settings, profileOf, close } from './support/profiles';

const rough = (n, km = 11000) => ({
  category: 'flight',
  meta: { km, band: 'longIntl', international: true, cabin: 'economy', return: true, passengers: n, rough: true },
});
const row = (rows, id) => rows.find((r) => r.id === id);

test('a rough count of three returns is three trips, and dropping one drops one', () => {
  const profile = profileOf([rough(3)], settings({ dwelling: 'apartment', roofOwn: false }));
  const agg = aggregate(profile);
  const trips = tripsOf(profile.entries);
  assert.equal(trips.length, 3);
  close(trips[0].t, agg.total / 3, 1e-9);

  const macc = maccData(profile, agg);
  close(row(macc, 'one-less-international').reduction, agg.total / 3, 1e-3);
  // Combining needs two trips, and three rough returns are three.
  assert.equal(row(macc, 'combine-trips').applicable, true);
});

test('the worked example counts five trips, and the biggest takes its hotel nights with it', () => {
  const profile = buildSeedProfile();
  const agg = aggregate(profile);
  const trips = tripsOf(profile.entries);
  assert.equal(trips.length, 5);

  const big = biggestIntlTrip(trips);
  assert.equal(big.key, 'circuit');
  const legs = profile.entries.filter((e) => (e.meta || {}).trip === 'circuit');
  const expected = legs.reduce((s, e) => s + e.tco2e, 0);
  assert.ok(big.hotelT > 0, 'the circuit carries its Tokyo and Shanghai nights');
  close(big.t, expected, 1e-9);
  close(row(maccData(profile, agg), 'one-less-international').reduction, expected, 1e-3);
});

test('the closer trip is priced as one short overseas economy return', () => {
  close(
    CLOSER_TRIP.t,
    (CLOSER_TRIP.km * 2 * FLIGHT_DISTANCE_UPLIFT * FLIGHT_FACTORS.shortIntl.withRF.economy) / 1000,
    1e-12,
  );
  const profile = buildSeedProfile();
  const agg = aggregate(profile);
  const big = biggestIntlTrip(tripsOf(profile.entries));
  close(row(maccData(profile, agg), 'closer-trip').reduction, big.flightT - CLOSER_TRIP.t, 1e-3);
});

test('dropping and moving the same trip count once, as the larger cut', () => {
  const profile = buildSeedProfile();
  const agg = aggregate(profile);
  const macc = maccData(profile, agg);
  const drop = row(macc, 'one-less-international').reduction;
  const at = (enabled) => {
    const p = projectPathway({ ...profile, plan: { enabled } }, agg);
    return p.bau[5] - p.plan[5];
  };
  // Year five: every option is fully phased in, and grid decline only
  // touches electricity, which these levers leave alone.
  close(at(['one-less-international', 'closer-trip']), at(['one-less-international']), 1e-9);
  close(at(['one-less-international']), drop, 1e-3);
});

test('with two overseas trips, dropping one leaves nothing to combine', () => {
  const s = settings({ dwelling: 'apartment', roofOwn: false });
  const profile = profileOf([
    { category: 'flight', meta: { km: 8317, return: true, band: 'longIntl', cabin: 'economy' } },
    { category: 'flight', meta: { km: 6288, return: true, band: 'longIntl', cabin: 'economy' } },
  ], s);
  const agg = aggregate(profile);
  const at = (enabled) => {
    const p = projectPathway({ ...profile, plan: { enabled } }, agg);
    return p.bau[5] - p.plan[5];
  };
  close(at(['one-less-international', 'combine-trips']), at(['one-less-international']), 1e-9);
  assert.ok(at(['one-less-international', 'combine-trips']) <= agg.total + 1e-9);
});

test('short-haul trips are never offered "go closer"', () => {
  const profile = profileOf(
    [{ category: 'flight', meta: { km: 2156, return: true, band: 'shortIntl', cabin: 'economy' } }],
    settings({ dwelling: 'apartment', roofOwn: false }),
  );
  const agg = aggregate(profile);
  assert.equal(row(maccData(profile, agg), 'closer-trip').applicable, false);
});
