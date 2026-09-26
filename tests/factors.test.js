// The factor table itself: shape, completeness, and the conventions the basis
// of preparation claims it follows.

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  COUNTRIES, ELECTRICITY, ELECTRICITY_SOURCE, ELECTRICITY_SOURCE_NZ, ELECTRICITY_SOURCE_US,
  GAS, GAS_INTL, GAS_SOURCE, GAS_SOURCE_US, GAS_SOURCE_NZ, gasFactorsFor,
  ROAD_FUELS, ROAD_FUELS_INTL, ROAD_MODES, ROAD_SOURCE, ROAD_SOURCE_US, ROAD_SOURCE_NZ,
  FLIGHT_FACTORS, FLIGHT_SOURCE, FREIGHT_MODES, FREIGHT_SOURCE,
  DIET_TYPES, DIET_SOURCE, GOODS, GOODS_SOURCE, CLOTHING_ITEMS, CLOTHING_ITEMS_SOURCE,
  HOTEL, HOTEL_SOURCE, HOME, HOME_SOURCE, OTHER_FUELS, OTHER_SOURCE,
  QUALITY_TIERS, QUALITY_SOURCE, GRID_DECLINE, FACTOR_SET,
  regionsForCountry, electricityFor, electricitySourceFor, roadFuelFor,
} from '../src/footprint/data/factors';

// The share of a consumed kilowatt-hour that has to be generated to cover
// eGRID's 4.2% grid gross loss: 1/(1-0.042) - 1.
const EGRID_GROSS_LOSS = 0.042;
const US_LOSS_GROSS_UP = 1 / (1 - EGRID_GROSS_LOSS) - 1;

// ---------------------------------------------------------------------------
// Shape
// ---------------------------------------------------------------------------

test('every electricity row is complete and finite', () => {
  for (const [key, row] of Object.entries(ELECTRICITY)) {
    assert.ok(typeof row.label === 'string' && row.label.length > 0, `${key} has a label`);
    assert.ok(COUNTRIES[row.country], `${key} names a country the audit can run in`);
    assert.ok(Number.isFinite(row.s2) && row.s2 > 0, `${key} scope 2 is a positive number`);
    assert.ok(Number.isFinite(row.s3) && row.s3 >= 0, `${key} scope 3 is a number`);
    assert.ok(row.s3 < row.s2, `${key} scope 3 is smaller than scope 2`);
  }
});

test('every country has a default region that exists in the table', () => {
  for (const [code, country] of Object.entries(COUNTRIES)) {
    const row = ELECTRICITY[country.defaultRegion];
    assert.ok(row, `${code} default region ${country.defaultRegion} exists`);
    assert.equal(row.country, code, `${code} default region belongs to ${code}`);
    assert.ok(regionsForCountry(code).length > 0, `${code} offers at least one region`);
    assert.ok(Number.isFinite(country.mjPerGasUnit) && country.mjPerGasUnit > 0, `${code} converts its gas unit`);
  }
});

test('the United States table carries all fifty states, DC and Puerto Rico', () => {
  const rows = Object.keys(ELECTRICITY).filter((k) => k.startsWith('US-'));
  assert.equal(rows.length, 52, '50 states + DC + PR');
  for (const code of ['US-VT', 'US-WV', 'US-DC', 'US-PR', 'US-HI', 'US-AK']) {
    assert.ok(ELECTRICITY[code], `${code} is present`);
  }
  assert.ok(ELECTRICITY.US, 'the national average row stays, as the pre-state default');
});

test('every source carries a name, a detail and a URL', () => {
  const sources = {
    ELECTRICITY_SOURCE, ELECTRICITY_SOURCE_NZ, ELECTRICITY_SOURCE_US,
    GAS_SOURCE, GAS_SOURCE_US, GAS_SOURCE_NZ,
    ROAD_SOURCE, ROAD_SOURCE_US, ROAD_SOURCE_NZ,
    FLIGHT_SOURCE, FREIGHT_SOURCE, DIET_SOURCE, GOODS_SOURCE,
    CLOTHING_ITEMS_SOURCE, HOTEL_SOURCE, HOME_SOURCE, OTHER_SOURCE, QUALITY_SOURCE,
  };
  for (const [name, src] of Object.entries(sources)) {
    assert.ok(src.name && src.name.length > 0, `${name} names its publisher`);
    assert.ok(src.detail && src.detail.length > 0, `${name} says what was read`);
    assert.match(src.url, /^https:\/\//, `${name} links to the document`);
  }
});

test('the factor set records its vintage', () => {
  assert.ok(FACTOR_SET.id && FACTOR_SET.updated && FACTOR_SET.note);
});

// ---------------------------------------------------------------------------
// The scope 3 electricity conventions, which are not the same in all three
// countries. The basis of preparation now says so out loud; these tests are
// what keep the statement true.
// ---------------------------------------------------------------------------

test('US scope 3 electricity is the eGRID grid loss grossed up, and nothing else', () => {
  for (const [key, row] of Object.entries(ELECTRICITY)) {
    if (row.country !== 'US') continue;
    assert.ok(
      Math.abs(row.s3 - row.s2 * US_LOSS_GROSS_UP) < 1e-5,
      `${key}: scope 3 ${row.s3} against the ${(EGRID_GROSS_LOSS * 100).toFixed(1)}% gross-up of ${row.s2} (${(row.s2 * US_LOSS_GROSS_UP).toFixed(6)})`,
    );
  }
});

test('US scope 3 is therefore a fixed share of scope 2 in every state', () => {
  const shares = Object.values(ELECTRICITY)
    .filter((r) => r.country === 'US')
    .map((r) => r.s3 / r.s2);
  const spread = Math.max(...shares) - Math.min(...shares);
  assert.ok(spread < 0.001, `every US state carries the same ratio (spread ${spread})`);
});

test('Australian scope 3 electricity is a wider boundary, and varies by state because of it', () => {
  // The NGA scope 3 factor is fuel extraction and production plus network
  // losses, so it is not a fixed percentage of the generation factor: it moves
  // with the fuel mix behind each grid. If this ever collapsed to a constant
  // share, the table would have quietly switched to the losses-only
  // convention the other two countries use, and the method page would be wrong.
  const shares = Object.values(ELECTRICITY)
    .filter((r) => r.country === 'AU')
    .map((r) => r.s3 / r.s2);
  const spread = Math.max(...shares) - Math.min(...shares);
  assert.ok(spread > 0.05, `Australian scope 3 shares span a real range (${spread.toFixed(3)})`);
  assert.ok(Math.max(...shares) > US_LOSS_GROSS_UP * 2, 'and reach well past a losses-only figure');
});

test('New Zealand scope 3 electricity is its own published loss factor', () => {
  const share = ELECTRICITY.NZ.s3 / ELECTRICITY.NZ.s2;
  assert.ok(share > 0 && share < 0.2, `a loss factor, not a fuel cycle (${share.toFixed(4)})`);
  assert.match(ELECTRICITY_SOURCE_NZ.detail, /loss/i, 'and the source says that is what it is');
});

// ---------------------------------------------------------------------------
// Gas, road, air, and the rest
// ---------------------------------------------------------------------------

test('gas prices in every country, per state in Australia', () => {
  for (const country of Object.keys(COUNTRIES)) {
    const state = COUNTRIES[country].defaultRegion;
    const g = gasFactorsFor({ country, state });
    assert.ok(Number.isFinite(g.s1) && g.s1 > 0, `${country} gas scope 1`);
    assert.ok(Number.isFinite(g.s3) && g.s3 >= 0, `${country} gas scope 3`);
    assert.ok(g.source && g.source.length > 0, `${country} gas names a source`);
  }
  for (const state of Object.keys(GAS.s3_per_MJ)) {
    assert.ok(GAS.s3_per_MJ[state] > 0, `${state} carries a metro scope 3`);
    assert.ok(ELECTRICITY[state], `${state} is a real Australian region`);
  }
  // The two countries with no published upstream figure read zero, which is an
  // understatement the method page has to keep declaring.
  assert.equal(GAS_INTL.US.s3_per_MJ, 0, 'US gas carries no fuel cycle');
  assert.ok(GAS_INTL.NZ.s3_per_MJ > 0, 'NZ gas carries its network losses');
});

test('every country offers the same four road fuels, and an EV burns nothing', () => {
  for (const country of Object.keys(COUNTRIES)) {
    for (const fuel of ['petrol', 'hybrid', 'diesel', 'ev']) {
      const f = roadFuelFor(country, fuel);
      assert.ok(f && f.label, `${country} ${fuel} exists`);
      assert.ok(Number.isFinite(f.s1_per_L) && Number.isFinite(f.s3_per_L), `${country} ${fuel} is finite`);
    }
    const ev = roadFuelFor(country, 'ev');
    assert.equal(ev.s1_per_L, 0, `${country} EV has no combustion`);
    assert.ok(ev.kWhPerKm > 0, `${country} EV has a consumption figure`);
  }
  assert.equal(Object.keys(ROAD_FUELS_INTL).length, Object.keys(COUNTRIES).length - 1, 'Australia is the base set, the others override it');
  assert.ok(ROAD_FUELS.diesel.s1_per_L > ROAD_FUELS.petrol.s1_per_L, 'diesel is denser than petrol');
});

test('the per-passenger road modes are ordered the way the copy claims', () => {
  const { rideshare, pt, bus } = ROAD_MODES;
  assert.ok(pt.perKm < bus.perKm, 'a train beats a bus');
  assert.ok(bus.perKm < rideshare.perKm, 'a bus beats a car you did not fill');
  for (const [id, m] of Object.entries(ROAD_MODES)) {
    assert.ok(m.perKm > 0 && Number.isFinite(m.perKm), `${id} has a factor`);
    assert.ok(m.source && m.source.length > 20, `${id} states its basis`);
  }
});

test('every flight band publishes every cabin, with and without radiative forcing', () => {
  for (const [band, row] of Object.entries(FLIGHT_FACTORS)) {
    for (const cabin of ['economy', 'premium', 'business', 'first']) {
      assert.ok(row.withRF[cabin] > 0, `${band} ${cabin} with RF`);
      assert.ok(row.withoutRF[cabin] > 0, `${band} ${cabin} without RF`);
      assert.ok(row.withRF[cabin] > row.withoutRF[cabin], `${band} ${cabin}: RF adds, never subtracts`);
    }
    assert.ok(row.withRF.business >= row.withRF.economy, `${band}: a bigger seat is never lighter`);
  }
});

test('air freight is the heaviest mode and sea the lightest', () => {
  const perTonneKm = Object.entries(FREIGHT_MODES).filter(([, m]) => m.perTonneKm > 0);
  const sorted = [...perTonneKm].sort((a, b) => a[1].perTonneKm - b[1].perTonneKm);
  assert.equal(sorted[0][0], 'sea');
  assert.equal(sorted[sorted.length - 1][0], 'air');
  assert.ok(FREIGHT_MODES.parcel.perParcel > 0, 'parcels price per parcel');
});

test('the diet scale runs downhill from most meat to least', () => {
  const perDay = Object.values(DIET_TYPES).map((d) => d.perDay);
  assert.deepEqual([...perDay], [...perDay].sort((a, b) => b - a), 'the table is declared heaviest first');
  for (const [id, d] of Object.entries(DIET_TYPES)) {
    assert.ok(d.perDay > 0 && Number.isFinite(d.perDay), `${id} has a factor`);
  }
});

test('the remaining tables are positive and finite throughout', () => {
  const tables = {
    goods: Object.values(GOODS).map((g) => g.usPerUsd),
    clothing: Object.values(CLOTHING_ITEMS).map((c) => c.perItem),
    hotels: Object.values(HOTEL.countries).map((h) => h.perNight),
    homes: Object.values(HOME.types).map((t) => t.perM2),
    otherFuels: Object.values(OTHER_FUELS).map((f) => f.s1 + f.s3),
  };
  for (const [name, values] of Object.entries(tables)) {
    assert.ok(values.length > 0, `${name} is not empty`);
    for (const v of values) assert.ok(Number.isFinite(v) && v > 0, `${name} value ${v}`);
  }
  assert.ok(HOME.amortiseYears > 0);
  assert.ok(HOTEL.default > 0, 'an unlisted country still prices');
});

test('the quality tiers widen in the right direction and stay inside 0 to 1', () => {
  const { metered, forecast, estimated } = QUALITY_TIERS;
  assert.ok(metered.band < forecast.band && forecast.band < estimated.band);
  for (const [id, t] of Object.entries(QUALITY_TIERS)) {
    assert.ok(t.band > 0 && t.band < 1, `${id} band`);
    assert.ok(t.label && t.plain, `${id} explains itself`);
  }
});

test('the grid decline is a decline', () => {
  assert.ok(GRID_DECLINE.ratePerYear > 0 && GRID_DECLINE.ratePerYear < 1);
  assert.ok(GRID_DECLINE.floor > 0);
  assert.ok(GRID_DECLINE.source.length > 20);
});

test('the electricity lookup resolves to the right country every time', () => {
  const names = new Set();
  for (const code of Object.keys(COUNTRIES)) {
    assert.equal(electricityFor({ country: code }).country, code, `${code} with no state`);
    assert.equal(electricityFor({ country: code, state: 'nonsense' }).country, code, `${code} with a bad state`);
    const src = electricitySourceFor(code);
    assert.ok(src.name && src.url, `${code} names and links its source`);
    names.add(src.name);
  }
  assert.equal(names.size, Object.keys(COUNTRIES).length, 'each country cites its own publisher, not a shared one');
  assert.equal(electricityFor(undefined).country, 'AU', 'settings saved before country support price as Australian');
  assert.equal(electricityFor({}).country, 'AU');
});
