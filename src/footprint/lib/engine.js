// Calculation engine for the Life Footprint Dashboard.
// Pure functions, no DOM: prices activity entries from the factor tables,
// aggregates them for the dashboard, and projects the abatement pathway.

import {
  FACTOR_SET,
  GRID_DECLINE, countryOf, COUNTRIES, electricityFor, electricitySourceFor,
  gasFactorsFor,
  ROAD_FUELS, ROAD_MODES, roadFuelFor, roadSourceFor,
  FLIGHT_FACTORS, FLIGHT_SOURCE, FLIGHT_DISTANCE_UPLIFT, flightBandForKm,
  FREIGHT_MODES, FREIGHT_SOURCE,
  DIET_TYPES, DIET_SOURCE,
  OTHER_FUELS, OTHER_SOURCE,
  GOODS, GOODS_SOURCE, goodsPerDollar, CLOTHING_ITEMS, CLOTHING_ITEMS_SOURCE,
  HOTEL, HOTEL_SOURCE, hotelPerNight,
  HOME, HOME_SOURCE,
  QUALITY_TIERS, qualityOf,
} from '../data/factors';
import { ABATEMENT_OPTIONS, APPLY_ORDER } from '../data/abatement';

let idCounter = 0;
export const newId = (prefix = 'e') =>
  prefix + '-' + Date.now().toString(36) + '-' + (idCounter++).toString(36) + Math.random().toString(36).slice(2, 6);

const round = (v, dp = 4) => Math.round(v * 10 ** dp) / 10 ** dp;

// Activity reads are coerced through this so the engine can never emit a
// non-finite entry, whatever the UI or an imported file feeds it: undefined,
// strings and negatives all price as zero.
const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

// ---------------------------------------------------------------------------
// Entry pricing. Takes a draft { category, date, label, notes, period_months,
// meta } plus profile settings, returns a complete schema-shaped entry:
// activity_data, unit, factor_used (effective per-unit), factor_source,
// scope (dominant), tco2e, and per-scope components for scope reporting.
// The factor is snapshotted onto the entry at pricing time.
// ---------------------------------------------------------------------------
export function priceEntry(draft, settings) {
  const meta = draft.meta || {};
  const country = countryOf(settings);
  const share = meta.wholeHousehold ? 1 / Math.max(1, settings.householdSize || 1) : 1;
  let activity = 0, unit = '', components = [], scope = '3', source = '';

  switch (draft.category) {
    case 'electricity': {
      const f = electricityFor(settings);
      const gp = Math.min(1, Math.max(0, (settings.greenpowerPct || 0) / 100));
      activity = num(meta.kwh); unit = 'kWh';
      // Market-based scope 2 nets off certified renewable purchases (GreenPower
      // in Australia); scope 3 retained in full (conservative treatment of
      // losses and fuel cycle).
      components = [
        { scope: '2', tco2e: activity * f.s2 * (1 - gp) * share / 1000 },
        { scope: '3', tco2e: activity * f.s3 * share / 1000 },
      ];
      scope = '2'; source = electricitySourceFor(f.country).name + ' (' + f.label + (gp > 0 ? ', ' + Math.round(gp * 100) + '% renewable market-based' : '') + ')';
      break;
    }
    case 'gas': {
      const g = gasFactorsFor(settings);
      activity = num(meta.mj); unit = 'MJ';
      components = [
        { scope: '1', tco2e: activity * g.s1 * share / 1000 },
        { scope: '3', tco2e: activity * g.s3 * share / 1000 },
      ];
      scope = '1'; source = g.source;
      break;
    }
    case 'road': {
      const mode = meta.mode || 'car';
      if (mode === 'rideshare' || mode === 'taxi') {
        activity = num(meta.km); unit = 'km';
        components = [{ scope: '3', tco2e: activity * ROAD_MODES.rideshare.perKm / 1000 }];
        scope = '3'; source = ROAD_MODES.rideshare.source.split('.')[0] + '.';
      } else if (mode === 'pt' || mode === 'bus') {
        // Rail and bus are both per-passenger-km modes needing no occupancy
        // split, but a bus runs about four times the rail factor, so they
        // price from their own rows rather than one blended proxy.
        const m = ROAD_MODES[mode];
        activity = num(meta.km); unit = 'km';
        components = [{ scope: '3', tco2e: activity * m.perKm / 1000 }];
        scope = '3'; source = m.source.split('.')[0] + '.';
      } else if (meta.fuel === 'ev') {
        // Average occupancy splits car emissions per person, the same
        // equal-share attribution used for household bills. A certified
        // renewable purchase nets off the charged kWh the same way it nets
        // the home meter, so the audit and the pathway model agree.
        const occ = Math.max(1, Math.round(meta.occupants || 1));
        const gp = Math.min(1, Math.max(0, (settings.greenpowerPct || 0) / 100));
        const f = electricityFor(settings);
        const kwh = num(meta.km) * ROAD_FUELS.ev.kWhPerKm / occ;
        activity = num(meta.km); unit = 'km';
        components = [
          { scope: '2', tco2e: kwh * f.s2 * (1 - gp) / 1000 },
          { scope: '3', tco2e: kwh * f.s3 / 1000 },
        ];
        scope = '2'; source = electricitySourceFor(f.country).name + ' (EV at ' + ROAD_FUELS.ev.kWhPerKm + ' kWh/km, ' + f.label
          + (gp > 0 ? ', ' + Math.round(gp * 100) + '% renewable market-based' : '') + ')'
          + (occ > 1 ? ', split across ' + occ + ' occupants' : '');
      } else {
        const occ = Math.max(1, Math.round(meta.occupants || 1));
        const fuel = roadFuelFor(country, meta.fuel);
        const litres = meta.litres != null ? num(meta.litres) : (num(meta.km) * (meta.l100km || fuel.defaultL100km)) / 100;
        activity = meta.litres != null ? litres : num(meta.km);
        unit = meta.litres != null ? 'L' : 'km';
        components = [
          { scope: '1', tco2e: litres * fuel.s1_per_L / occ / 1000 },
          { scope: '3', tco2e: litres * fuel.s3_per_L / occ / 1000 },
        ];
        scope = '1'; source = roadSourceFor(country).name + ' (' + fuel.label.toLowerCase() + ')'
          + (occ > 1 ? ', split across ' + occ + ' occupants' : '');
      }
      break;
    }
    case 'flight': {
      const band = meta.band || flightBandForKm(meta.km, meta.international);
      const cabin = meta.cabin || 'economy';
      const legs = meta.return ? 2 : 1;
      const paxkm = num(meta.km) * FLIGHT_DISTANCE_UPLIFT * legs * (num(meta.passengers) || 1);
      const perKm = FLIGHT_FACTORS[band].withRF[cabin] || FLIGHT_FACTORS[band].withRF.economy;
      activity = Math.round(paxkm); unit = 'pax-km';
      components = [{ scope: '3', tco2e: paxkm * perKm / 1000 }];
      scope = '3';
      source = FLIGHT_SOURCE.name + ' (' + FLIGHT_FACTORS[band].label.toLowerCase() + ', ' + cabin + ', with RF)';
      break;
    }
    case 'freight': {
      if (meta.parcels != null) {
        activity = num(meta.parcels); unit = 'parcels';
        components = [{ scope: '3', tco2e: activity * FREIGHT_MODES.parcel.perParcel / 1000 }];
      } else {
        const mode = FREIGHT_MODES[meta.mode] || FREIGHT_MODES.road;
        activity = num(meta.tonneKm); unit = 't-km';
        components = [{ scope: '3', tco2e: activity * mode.perTonneKm / 1000 }];
      }
      scope = '3'; source = FREIGHT_SOURCE.name;
      break;
    }
    case 'diet': {
      const dt = DIET_TYPES[meta.dietType] || DIET_TYPES.medMeat;
      activity = num(meta.days); unit = 'days';
      components = [{ scope: '3', tco2e: activity * dt.perDay / 1000 }];
      scope = '3'; source = DIET_SOURCE.name + ' (' + dt.label.toLowerCase() + ')';
      break;
    }
    case 'other': {
      const f = OTHER_FUELS[meta.fuel] || OTHER_FUELS.lpg;
      activity = num(meta.amount); unit = f.unit;
      components = [
        { scope: '1', tco2e: activity * f.s1 * share / 1000 },
        { scope: '3', tco2e: activity * f.s3 * share / 1000 },
      ];
      scope = '1'; source = OTHER_SOURCE.name;
      break;
    }
    case 'goods': {
      // Two routes into the same category. Clothing counted by item prices
      // each bucket at the ADEME per-garment life-cycle factor: physical
      // counts, so ten cheap tees weigh ten tees whatever they cost.
      if (meta.kind === 'clothingItems') {
        const items = meta.items || {};
        let t = 0, count = 0;
        for (const [k, n] of Object.entries(items)) {
          if (!CLOTHING_ITEMS[k] || !(n > 0)) continue;
          t += n * CLOTHING_ITEMS[k].perItem;
          count += n;
        }
        activity = count; unit = 'items';
        components = [{ scope: '3', tco2e: t / 1000 }];
        scope = '3';
        source = CLOTHING_ITEMS_SOURCE.name + ' (per-item, cradle-to-grave)';
        break;
      }
      // Spend-based screening: dollars of purchaser-price spend times the EPA
      // per-dollar factor bridged into the home country's dollars. Always
      // scope 3 (embodied in goods and services made elsewhere). activity is
      // the spend in local dollars (the meta key keeps its original spendAud
      // name so nothing stored re-prices); the snapshotted factor is per
      // dollar.
      const kind = GOODS[meta.kind] ? meta.kind : 'other';
      activity = num(meta.spendAud); unit = '$';
      components = [{ scope: '3', tco2e: activity * goodsPerDollar(kind, country) / 1000 }];
      scope = '3';
      source = GOODS_SOURCE.name + ' (' + GOODS[kind].label.toLowerCase() + ', spend-based screening, ' + COUNTRIES[country].currency + ')';
      break;
    }
    case 'hotel': {
      // Per occupied room-night at the country factor. Scope 3 (accommodation
      // energy bought on your behalf elsewhere). Nights logged without a trip
      // country price at the home country; the worked example sets it per trip.
      const stayCountry = meta.country || country;
      const perNight = hotelPerNight(stayCountry);
      activity = num(meta.nights); unit = 'nights';
      components = [{ scope: '3', tco2e: activity * perNight / 1000 }];
      scope = '3';
      const c = HOTEL.countries[stayCountry];
      source = HOTEL_SOURCE.name + ' (' + (c ? c.label : 'home-country default') + ', per room-night)';
      break;
    }
    case 'dwelling': {
      // Upfront (A1-A5) embodied carbon of a home built or bought new, turned
      // into an annual line by straight-line amortisation over the building
      // life, then split per adult like the energy bills. activity is the
      // floor area; the effective factor snapshotted is the annual per-m2
      // share. A home logged as an existing (not new) build never reaches here.
      const t = HOME.types[meta.dwelling] || HOME.types.house;
      const area = num(meta.areaM2);
      const annualKg = (area * t.perM2) / HOME.amortiseYears;
      activity = area; unit = 'm²';
      components = [{ scope: '3', tco2e: annualKg * share / 1000 }];
      scope = '3';
      source = HOME_SOURCE.name.split(',')[0] + ' (' + t.label + ', A1-A5 ÷ ' + HOME.amortiseYears + ' yr'
        + (share < 1 ? ', per adult' : '') + ')';
      break;
    }
    default:
      throw new Error('Unknown category: ' + draft.category);
  }

  const tco2e = components.reduce((s, c) => s + c.tco2e, 0);
  const entry = {
    id: draft.id || newId(),
    date: draft.date,
    category: draft.category,
    label: draft.label || '',
    activity_data: round(activity, 1),
    unit,
    factor_used: activity > 0 ? round((tco2e * 1000) / activity, 4) : 0,
    factor_source: source,
    // Vintage pinning: every entry records the factor set that priced it, so
    // a future refresh can never silently re-price history.
    factor_set: FACTOR_SET.id,
    scope,
    tco2e: round(tco2e),
    notes: draft.notes || '',
    period_months: draft.period_months || 0,
    meta,
    components: components.map((c) => ({ scope: c.scope, tco2e: round(c.tco2e) })),
  };
  if (draft.quality) entry.quality = draft.quality;
  return entry;
}

// ---------------------------------------------------------------------------
// Aggregation.
// ---------------------------------------------------------------------------
const monthKey = (d) => d.slice(0, 7);

function addMonths(key, delta) {
  const [y, m] = key.split('-').map(Number);
  const t = y * 12 + (m - 1) + delta;
  const yy = Math.floor(t / 12), mm = (t % 12) + 1;
  return yy + '-' + String(mm).padStart(2, '0');
}

export function monthsBetween(startKey, endKey) {
  const out = [];
  let k = startKey;
  while (k <= endKey && out.length < 60) { out.push(k); k = addMonths(k, 1); }
  return out;
}

export function aggregate(profile) {
  const { entries, period } = profile;
  const months = monthsBetween(monthKey(period.start), monthKey(period.end));
  const inWindow = entries.filter((e) => e.date >= period.start && e.date <= period.end);

  const byCategory = {}, byScope = { 1: 0, 2: 0, 3: 0 };
  const byMonth = Object.fromEntries(months.map((m) => [m, {}]));
  let total = 0, largest = null, band = 0;

  for (const e of inWindow) {
    total += e.tco2e;
    // Uncertainty: each entry contributes its quality tier's half-width,
    // summed linearly (no correlation credit). Central estimate untouched.
    band += e.tco2e * QUALITY_TIERS[qualityOf(e)].band;
    byCategory[e.category] = (byCategory[e.category] || 0) + e.tco2e;
    for (const c of e.components || [{ scope: e.scope, tco2e: e.tco2e }]) {
      // Malformed imports fold into scope 3 rather than poisoning the tiles with NaN.
      byScope[byScope[c.scope] != null ? c.scope : '3'] += c.tco2e;
    }
    if (!largest || e.tco2e > largest.tco2e) largest = e;
    // Spread bills across the months they cover (date = period end). A bill
    // reaching back past the window start keeps its early share in the first
    // window month, so byMonth always sums back to the total.
    const span = Math.max(1, e.period_months || 1);
    const endK = monthKey(e.date);
    for (let i = 0; i < span; i++) {
      const k = addMonths(endK, -i);
      const target = byMonth[k] ? k : months[0];
      if (byMonth[target]) byMonth[target][e.category] = (byMonth[target][e.category] || 0) + e.tco2e / span;
    }
  }

  let worstMonth = null;
  for (const m of months) {
    const t = Object.values(byMonth[m]).reduce((s, v) => s + v, 0);
    if (!worstMonth || t > worstMonth.total) worstMonth = { month: m, total: t, cats: byMonth[m] };
  }

  return {
    months, byMonth, byCategory, byScope, total, largest, worstMonth,
    count: inWindow.length,
    uncertainty: { band, low: Math.max(0, total - band), high: total + band },
  };
}

// ---------------------------------------------------------------------------
// Year rollover. Closes the current reporting period into pastYears and
// opens the next twelve months against the factor set in force. Pure:
// returns a new profile, touches nothing.
// ---------------------------------------------------------------------------
const fyLabelFor = (startIso, endIso) => {
  if (startIso.slice(5, 10) === '07-01') return 'FY' + endIso.slice(0, 4);
  const mon = (iso) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(iso.slice(5, 7)) - 1];
  return mon(startIso) + ' ' + startIso.slice(0, 4) + ' to ' + mon(endIso) + ' ' + endIso.slice(0, 4);
};

const plusMonthsEnd = (startIso, months) => {
  // Last day of the month `months - 1` after the start month.
  const [y, m] = [Number(startIso.slice(0, 4)), Number(startIso.slice(5, 7))];
  const t = y * 12 + (m - 1) + months;
  const yy = Math.floor(t / 12), mm = (t % 12) + 1;
  const lastDay = new Date(yy, mm - 1, 0);
  return lastDay.getFullYear() + '-' + String(lastDay.getMonth() + 1).padStart(2, '0') + '-' + String(lastDay.getDate()).padStart(2, '0');
};

const addYearIso = (iso) => String(Number(iso.slice(0, 4)) + 1) + iso.slice(4);

export function rolloverProfile(profile, todayIso) {
  // Advance whole years until today sits inside the new period, so a long
  // absence never manufactures empty intermediate "years".
  let start = addYearIso(profile.period.start);
  let end = plusMonthsEnd(start, 12);
  let skipped = 0;
  while (end < todayIso) { start = addYearIso(start); end = plusMonthsEnd(start, 12); skipped++; }

  const label = fyLabelFor(start, end);
  // A year can hold entries priced under more than one factor set (logged
  // either side of a refresh); the close record says so rather than
  // pretending one vintage covered the year.
  const vintages = [...new Set(profile.entries.map((e) => e.factor_set || 'unrecorded'))];
  const past = {
    label: profile.period.label,
    start: profile.period.start,
    end: profile.period.end,
    entries: profile.entries,
    plan: { ...profile.plan },
    settingsAtClose: { ...profile.settings },
    factorSetAtClose: vintages.length ? vintages.join(' + ') : FACTOR_SET.id,
    closedAt: todayIso,
  };

  const entries = [];
  if (profile.entries.some((e) => e.category === 'diet')) {
    entries.push(priceEntry({
      category: 'diet', date: end, period_months: 12,
      label: DIET_TYPES[profile.settings.dietType || 'medMeat'].label,
      quality: 'forecast',
      meta: { dietType: profile.settings.dietType || 'medMeat', days: 365 },
      notes: 'Carried from your settings at rollover as a forecast. Adjust if your diet changed.',
    }, profile.settings));
  }

  return {
    ...profile,
    period: {
      label, start, end,
      note: skipped > 0 ? 'Nothing was logged for ' + skipped + ' intervening year' + (skipped > 1 ? 's' : '') + '; the gap is carried, not filled.' : undefined,
    },
    entries,
    pastYears: [...(profile.pastYears || []), past],
  };
}

// ---------------------------------------------------------------------------
// Baseline activity state for the pathway model, derived from the audited
// year. BAU assumption, stated in the method: the audited year repeats.
// ---------------------------------------------------------------------------
export function baselineState(profile, agg) {
  const s = profile.settings;
  const share = 1 / Math.max(1, s.householdSize || 1);
  let kwh = 0, mj = 0, kmCar = 0, kmEv = 0, litres = 0, kmRide = 0, kmPt = 0, kmBus = 0;
  let dietDays = 0, freightAirT = 0, freightOtherT = 0, otherT = 0, goodsT = 0, dwellingT = 0;
  const flights = [];
  for (const e of profile.entries) {
    if (e.date < profile.period.start || e.date > profile.period.end) continue;
    const m = e.meta || {};
    if (e.category === 'electricity') kwh += (m.kwh || 0) * (m.wholeHousehold ? share : 1);
    else if (e.category === 'gas') mj += (m.mj || 0) * (m.wholeHousehold ? share : 1);
    else if (e.category === 'road') {
      const mode = m.mode || 'car';
      // Per-person shares carry into the pathway model: occupancy divides
      // car activity the same way pricing divides its emissions. EV
      // kilometres stay electric (no synthetic litres), and km-only entries
      // reconstruct fuel at the same default consumption pricing used, so
      // the plan always starts from the audited numbers.
      const occ = Math.max(1, Math.round(m.occupants || 1));
      if (mode === 'rideshare' || mode === 'taxi') kmRide += m.km || 0;
      else if (mode === 'pt') kmPt += m.km || 0;
      else if (mode === 'bus') kmBus += m.km || 0;
      else if (m.fuel === 'ev') { kmCar += (m.km || 0) / occ; kmEv += (m.km || 0) / occ; }
      else {
        const dflt = roadFuelFor(countryOf(s), m.fuel).defaultL100km || 7;
        if (m.litres != null) { litres += m.litres / occ; kmCar += (m.litres * 100) / (m.l100km || dflt) / occ; }
        else { kmCar += (m.km || 0) / occ; litres += ((m.km || 0) * (m.l100km || dflt)) / 100 / occ; }
      }
    } else if (e.category === 'flight') flights.push(e);
    else if (e.category === 'diet') dietDays += m.days || 0;
    else if (e.category === 'freight') {
      if (m.mode === 'air') freightAirT += e.tco2e; else freightOtherT += e.tco2e;
    } else if (e.category === 'other') otherT += e.tco2e;
    // Spend-based goods and hotel nights carry through the pathway as a flat
    // annual band: no abatement lever acts on them, so BAU and plan hold them
    // steady while the levers move the categories they do touch.
    else if (e.category === 'goods' || e.category === 'hotel') goodsT += e.tco2e;
    // Home embodied carbon is already locked in at construction, so no future
    // lever abates it; it rides through both lines as its own flat band.
    else if (e.category === 'dwelling') dwellingT += e.tco2e;
  }
  const dietType = s.dietType || 'medMeat';
  return {
    // Whole-household outlays in the option costs split by this, so cost and
    // reduction sit on the same per-person boundary.
    householdSize: Math.max(1, s.householdSize || 1),
    country: countryOf(s),
    state: s.state || COUNTRIES[countryOf(s)].defaultRegion,
    dwelling: s.dwelling || 'house',
    // Tenure travels separately from building type. Profiles saved before
    // the roof question packed ownership into dwelling === 'house', so an
    // absent value means yes, not no.
    roofOwn: s.roofOwn !== false,
    greenpowerPct: (s.greenpowerPct || 0) / 100,
    kwh, mj,
    kmCar, kmRide, kmPt, kmBus,
    // l100km describes the combustion share only; audited EV kilometres set
    // the starting evShare so an EV driver is never offered "switch to an EV".
    l100km: kmCar - kmEv > 0 ? (litres / (kmCar - kmEv)) * 100 : (roadFuelFor(countryOf(s), s.fuelType || 'petrol').defaultL100km || 7),
    fuelType: s.fuelType || 'petrol',
    evShare: kmCar > 0 ? kmEv / kmCar : 0,
    solarReduction: 0, seaShift: 0,
    flights,
    flightT: flights.reduce((t, f) => t + f.tco2e, 0),
    droppedFlightT: 0,
    dietPerDay: DIET_TYPES[dietType].perDay,
    dietDays: dietDays || 365,
    freightAirT, freightOtherT, otherT, goodsT, dwellingT,
    agg,
  };
}

// Emissions (tCO2e/yr) for an activity state in projection year offset i.
export function stateEmissions(st, yearOffset) {
  const f = electricityFor({ state: st.state, country: st.country });
  // The floor is an asymptote for a grid on its way down, not a minimum
  // charge. Applied flat it would lift a grid already cleaner than it, and the
  // projection would open by charging a Vermont household (0.0237) more than
  // its own audit did; New Zealand crosses the same line partway through the
  // horizon. Clamping the floor to today's factor keeps year zero equal to the
  // audited year on every grid in the table.
  const floor = Math.min(GRID_DECLINE.floor, f.s2);
  const s2f = Math.max(floor, f.s2 * Math.pow(GRID_DECLINE.ratePerYear, Math.max(0, yearOffset)));
  const fuel = roadFuelFor(st.country, st.fuelType);

  const evKwh = st.kmCar * st.evShare * ROAD_FUELS.ev.kWhPerKm;
  const gridKwh = (st.kwh + st.addedKwh0 + evKwh) * (1 - st.solarReduction);
  const elec = (gridKwh * s2f * (1 - st.greenpowerPct) + gridKwh * f.s3) / 1000;

  const g = gasFactorsFor({ state: st.state, country: st.country });
  const gas = (st.mj * (g.s1 + g.s3)) / 1000;
  const litres = (st.kmCar * (1 - st.evShare) * st.l100km) / 100;
  const road = (litres * (fuel.s1_per_L + fuel.s3_per_L)
    + st.kmRide * ROAD_MODES.rideshare.perKm
    + st.kmPt * ROAD_MODES.pt.perKm
    + (st.kmBus || 0) * ROAD_MODES.bus.perKm) / 1000;
  const flight = Math.max(0, st.flightT - st.droppedFlightT);
  const diet = (st.dietPerDay * st.dietDays) / 1000;
  // The sea-shift residual derives from the freight table itself, so a
  // factor refresh reaches the pathway without a hand edit here.
  const freight = st.freightAirT * (1 - (st.seaShift || 0) * (1 - FREIGHT_MODES.sea.perTonneKm / FREIGHT_MODES.air.perTonneKm)) + st.freightOtherT;

  return {
    total: elec + gas + road + flight + diet + freight + st.otherT + (st.goodsT || 0) + (st.dwellingT || 0),
    byCategory: { electricity: elec, gas, road, flight, diet, freight, other: st.otherT, goods: st.goodsT || 0, dwelling: st.dwellingT || 0 },
  };
}

const cloneState = (st) => ({ ...st, addedKwh0: 0 });

// Phase-in multiplier by effort: low lands next year, high takes three.
function phase(effort, yearsIn) {
  if (yearsIn <= 0) return 0;
  const ramp = effort === 'low' ? 1 : effort === 'med' ? 2 : 3;
  return Math.min(1, yearsIn / ramp);
}

// ---------------------------------------------------------------------------
// Pathway projection. Applies enabled actions in APPLY_ORDER (behaviour, then
// electrification, then supply measures) so interactions resolve rather than
// double count: an EV's charging load exists before rooftop solar acts on
// it. Grid decarbonisation runs in the background in both BAU and plan.
// st.greenpowerPct is the audited purchase from settings (market-based
// accounting of what is actually bought), not an abatement option.
// ---------------------------------------------------------------------------
export function projectPathway(profile, agg, horizonYears = 10) {
  const base = baselineState(profile, agg);
  const y0 = Number(profile.period.end.slice(0, 4));
  const enabled = ABATEMENT_OPTIONS.filter((o) => profile.plan.enabled.includes(o.id) && o.applicable(base));
  const years = [], bau = [], plan = [];

  for (let i = 0; i <= horizonYears; i++) {
    years.push(y0 + i);
    bau.push(stateEmissions(cloneState(base), i).total);
    const st = cloneState(base);
    for (const orderId of APPLY_ORDER) {
      const opt = enabled.find((o) => o.id === orderId);
      if (opt) opt.apply(st, phase(opt.effort, i));
    }
    plan.push(stateEmissions(st, i).total);
  }
  return { years, bau, plan, y0, enabled: enabled.map((o) => o.id) };
}

// ---------------------------------------------------------------------------
// MACC: each applicable action alone, at current-year factors. The scenario
// line resolves interactions; these bars are deliberately standalone and the
// method says so.
// ---------------------------------------------------------------------------
export function maccData(profile, agg) {
  const base = baselineState(profile, agg);
  const before = stateEmissions(cloneState(base), 0).total;
  const rows = [];
  for (const opt of ABATEMENT_OPTIONS) {
    const applicable = opt.applicable(base);
    const st = cloneState(base);
    opt.apply(st, 1);
    const reduction = Math.max(0, before - stateEmissions(st, 0).total);
    const cost = opt.cost(base);
    rows.push({
      id: opt.id, category: opt.category, action: opt.action, effort: opt.effort,
      source: opt.source, detail: opt.detail, applicable,
      reduction: round(reduction, 3),
      cost: Math.round(cost),
      costPerTonne: reduction > 0.005 ? Math.round(cost / reduction) : null,
    });
  }
  return rows;
}

export { ABATEMENT_OPTIONS };
