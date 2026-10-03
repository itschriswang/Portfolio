// The arithmetic behind three reveal moments, kept out of the components so
// the suite can check it against the factor tables:
//
//   tripShare        how much of the year a handful of trips decided, and the
//                    biggest trip re-counted in the visitor's own daily lines
//                    (months of their own meals, years of their own commute)
//   sequencedCut     a set of levers applied in the pathway's order at full
//                    phase, so overlapping changes count once
//   commitmentSplit  what the plan has switched on against the flight
//                    changes it has left off (the worked example's decision)
//
// Pure functions, no DOM.

import { baselineState, stateEmissions } from './engine';
import { ABATEMENT_OPTIONS, APPLY_ORDER } from '../data/abatement';
import { tripsOf } from './trips';

const inWindow = (profile) =>
  profile.entries.filter((e) => e.date >= profile.period.start && e.date <= profile.period.end);

// A line belongs to a trip when it is a flight, a hotel night, or anything
// logged as spent while away (taxis abroad).
export const isTripLine = (e) =>
  e.category === 'flight' || e.category === 'hotel' || !!(e.meta && e.meta.abroad);

// The biggest trip re-counted in the visitor's own everyday lines. Each rate
// comes from their own audit, never an outside average; a line they did not
// log simply drops out.
function ownExchange(entries, tripT, months) {
  const yearShare = 12 / Math.max(1, months);
  const sum = (pred) => entries.filter(pred).reduce((s, e) => s + e.tco2e, 0);
  const out = [];

  const dietT = sum((e) => e.category === 'diet');
  const dietDays = entries.filter((e) => e.category === 'diet').reduce((s, e) => s + ((e.meta && e.meta.days) || 0), 0);
  if (dietT > 0.005 && dietDays > 0) {
    const days = tripT / (dietT / dietDays);
    const months = days / (365 / 12);
    out.push(months < 24 ? { id: 'food', unit: 'months', value: months } : { id: 'food', unit: 'years', value: days / 365 });
  }
  const groundT = sum((e) => e.category === 'road' && !(e.meta && e.meta.abroad)) * yearShare;
  if (groundT > 0.005) out.push({ id: 'ground', unit: 'years', value: tripT / groundT });
  const homeT = sum((e) => e.category === 'electricity' || e.category === 'gas') * yearShare;
  if (homeT > 0.005) out.push({ id: 'home', unit: 'years', value: tripT / homeT });

  return out.filter((r) => r.value >= 0.5);
}

export function tripShare(profile, agg) {
  const entries = inWindow(profile);
  const trips = tripsOf(entries);
  if (!trips.length || !(agg.total > 0.005)) return null;
  const tripT = entries.filter(isTripLine).reduce((s, e) => s + e.tco2e, 0);
  const restT = Math.max(0, agg.total - tripT);
  const biggest = trips.reduce((a, b) => (b.t > a.t ? b : a));
  return {
    count: trips.length,
    tripT,
    restT,
    pct: Math.min(100, Math.round((tripT / agg.total) * 100)),
    ratio: restT > 0.005 ? tripT / restT : null,
    biggest: { name: biggest.name, t: biggest.t },
    exchange: ownExchange(entries, biggest.t, agg.months.length),
  };
}

// The year-zero cut from switching on `ids`, applied in APPLY_ORDER at full
// phase: the same sequencing the pathway uses, so two levers acting on the
// same trip or the same kilowatt-hours are counted once.
export function sequencedCut(profile, agg, ids) {
  const base = baselineState(profile, agg);
  const before = stateEmissions({ ...base, addedKwh0: 0 }, 0).total;
  const on = new Set(ids);
  if (!on.size) return 0;
  const st = { ...base, addedKwh0: 0 };
  for (const id of APPLY_ORDER) {
    if (!on.has(id)) continue;
    const opt = ABATEMENT_OPTIONS.find((o) => o.id === id);
    if (opt && opt.applicable(base)) opt.apply(st, 1);
  }
  return Math.max(0, before - stateEmissions(st, 0).total);
}

// What the plan has committed to, against the flight changes it has left
// off. Null when there is nothing on one side or the other to set apart.
export function commitmentSplit(profile, agg) {
  const enabled = (profile.plan && profile.plan.enabled) || [];
  const base = baselineState(profile, agg);
  const openFlight = ABATEMENT_OPTIONS
    .filter((o) => o.category === 'flight' && !enabled.includes(o.id) && o.applicable(base))
    .map((o) => o.id);
  if (!enabled.length || !openFlight.length) return null;
  return {
    committed: sequencedCut(profile, agg, enabled),
    open: sequencedCut(profile, agg, openFlight),
  };
}
