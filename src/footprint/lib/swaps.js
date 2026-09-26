// Counterfactuals the reveal tells: the same audited year with exactly one
// thing changed. Pure functions over a profile and its aggregate, kept out of
// the story components so they can be tested against the factor tables
// directly, and so the numbers on screen are always the visitor's own year
// re-priced rather than a reference household nobody can check.

import {
  ELECTRICITY, US_GRID_SPREAD, PT_MODE_RATIO, ROAD_MODES,
  countryOf, electricityFor,
} from '../data/factors';

// Below this, the swap is not worth stopping a reveal for.
export const GRID_SWAP_MIN_SWING_T = 0.25;

// The same year on the lightest state grid and the heaviest.
//
// United States audits only: no other country in the factor set has a spread
// worth swapping across (Australia runs about four times end to end, New
// Zealand is one national grid). Scaled off the audited electricity line
// rather than re-derived from kilowatt-hours, so the "where you live" row is
// exactly the total the rest of the story shows, and a certified renewable
// purchase carries through the netting it already got at pricing time.
//
// Returns null whenever there is nothing true to say, which is what keeps the
// moment out of every audit it does not belong in.
export function gridSwapFor(profile, agg) {
  if (!profile || !agg) return null;
  if (countryOf(profile.settings) !== 'US') return null;

  const hereT = agg.byCategory.electricity || 0;
  if (!(hereT > 0)) return null;

  const gp = Math.min(1, Math.max(0, ((profile.settings || {}).greenpowerPct || 0) / 100));
  const effective = (row) => row.s2 * (1 - gp) + row.s3;

  const here = electricityFor(profile.settings);
  const hereF = effective(here);
  if (!(hereF > 0)) return null;

  const { clean, dirty, ratio } = US_GRID_SPREAD;
  const at = (row) => (hereT * effective(row)) / hereF;
  const cleanT = at(clean);
  const dirtyT = at(dirty);
  if (dirtyT - cleanT < GRID_SWAP_MIN_SWING_T) return null;

  // A log axis, because the American distribution clusters low with a long
  // coal tail: a linear one would pile four fifths of the states into the
  // first sixth of the track.
  const lo = Math.log(clean.s2);
  const hi = Math.log(dirty.s2);
  const posOf = (s2) => (hi > lo ? (Math.log(s2) - lo) / (hi - lo) : 0);

  return {
    ratio: Math.round(ratio),
    swing: dirtyT - cleanT,
    clean: { label: clean.label, factor: clean.s2, total: agg.total - hereT + cleanT },
    dirty: { label: dirty.label, factor: dirty.s2, total: agg.total - hereT + dirtyT },
    your: { label: here.label, factor: here.s2, total: agg.total, pos: posOf(here.s2) },
    ticks: Object.entries(ELECTRICITY)
      .filter(([key, r]) => r.country === 'US' && key !== 'US')
      .map(([key, r]) => ({ key, pos: posOf(r.s2), you: ELECTRICITY[key] === here })),
  };
}

// The visitor's own ground public-transport kilometres, priced as the mode
// they logged and as the other one. Leads with whichever they actually used,
// because the useful sentence for a bus commuter (the train would cost a
// quarter of this) is not the sentence for a train commuter (the bus would
// cost four times). Returns null when they logged neither.
export function modeSwapFor(profile) {
  if (!profile) return null;
  const { period, entries } = profile;
  const inWindow = entries.filter((e) => e.date >= period.start && e.date <= period.end);
  const kmOf = (mode) => inWindow.reduce(
    (s, e) => s + (e.category === 'road' && (e.meta || {}).mode === mode ? (e.meta.km || 0) : 0),
    0,
  );

  const busKm = kmOf('bus');
  const railKm = kmOf('pt');
  const lead = busKm > 0 ? 'bus' : railKm > 0 ? 'rail' : null;
  if (!lead) return null;

  const km = lead === 'bus' ? busKm : railKm;
  const own = lead === 'bus' ? ROAD_MODES.bus.perKm : ROAD_MODES.pt.perKm;
  const other = lead === 'bus' ? ROAD_MODES.pt.perKm : ROAD_MODES.bus.perKm;
  return {
    lead,
    km: Math.round(km),
    asIs: (km * own) / 1000,
    swapped: (km * other) / 1000,
    ratio: Math.round(PT_MODE_RATIO),
  };
}
