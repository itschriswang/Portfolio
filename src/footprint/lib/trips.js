// Trips, not ledger lines. A flight entry is whatever the log happened to
// record: one leg, a return, a five-leg circuit split across five rows, or a
// rough count of several returns folded into one row. The reduction levers
// and the reveal both reason about trips (the thing a person books, takes or
// skips), so this module turns entries back into trips.
//
// Grouping: flight entries sharing meta.trip are one trip; a flight without
// one is its own trip. A rough-count entry (meta.rough, N returns priced as
// passengers: N) splits into N equal trips, because "drop one return" must
// drop one return, not the whole bundle. Hotel entries carrying a matching
// meta.trip attach to that trip; unkeyed hotel nights stay loose.
//
// Pure functions, no DOM.

const flightsIn = (entries) => entries.filter((e) => e.category === 'flight');

export function tripsOf(entries) {
  const byKey = new Map();
  const order = [];
  const ensure = (key) => {
    if (!byKey.has(key)) {
      byKey.set(key, { key, name: '', flightT: 0, hotelT: 0, legs: [], intl: false, longHaul: false });
      order.push(key);
    }
    return byKey.get(key);
  };

  for (const e of flightsIn(entries)) {
    const m = e.meta || {};
    const n = m.rough ? Math.max(1, Math.round(Number(m.passengers) || 1)) : 1;
    for (let i = 0; i < n; i++) {
      const key = m.rough ? e.id + '#' + i : (m.trip || e.id);
      const trip = ensure(key);
      trip.flightT += e.tco2e / n;
      trip.legs.push(e);
      if (m.band && m.band !== 'domestic') trip.intl = true;
      if (m.band === 'longIntl') trip.longHaul = true;
      if (!trip.name) trip.name = m.tripName || (m.rough ? (e.label || '').replace(/ × \d+.*$/, '') : e.label || '');
    }
  }

  for (const e of entries) {
    if (e.category !== 'hotel') continue;
    const key = (e.meta || {}).trip;
    if (key && byKey.has(key)) byKey.get(key).hotelT += e.tco2e;
  }

  return order.map((k) => {
    const t = byKey.get(k);
    return { ...t, t: t.flightT + t.hotelT };
  });
}

export const intlTrips = (trips) => trips.filter((t) => t.intl);
export const domesticTrips = (trips) => trips.filter((t) => !t.intl);

// The largest international trip by its whole weight (flights and the hotel
// nights attached to it). Both the "drop it" and "go closer" levers act on
// this same trip, so switching both on can never cut two different trips.
export const biggestIntlTrip = (trips) => {
  const intl = intlTrips(trips);
  return intl.length ? intl.reduce((a, b) => (b.t > a.t ? b : a)) : null;
};

export const meanFlightT = (list) =>
  list.length ? list.reduce((s, t) => s + t.flightT, 0) / list.length : 0;
