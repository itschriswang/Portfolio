// Abatement options library. Each option is priced against the person's own
// audited numbers, not a generic average: `apply` mutates a baseline activity
// state (at phase p, 0 to 1) and the engine derives the standalone reduction
// by re-pricing the state. `cost` returns an indicative net annual cost in
// dollars (negative = saving), with the basis stated in `source`.
//
// `applicable` reflects circumstance: a renter in an apartment sees
// solar and appliance swaps greyed out as landlord problems, and someone
// without a car never sees an EV bar.
//
// Physical reductions only. Offsets and green power products are excluded
// as abatement by construction: market instruments retire certificates
// rather than remove activity, so they belong in market-based reporting
// (an audited GreenPower purchase still prices the scope 2 line), never on
// the cost curve.
//
// APPLY_ORDER resolves interactions in the pathway model: behaviour changes
// first, then electrification (which adds load), then supply-side measures
// (rooftop solar) act on whatever load is left. The MACC bars are each
// option alone; the pathway line is the sequenced combination.

import { FLIGHT_FACTORS, FLIGHT_DISTANCE_UPLIFT, ROUGH_FLIGHT_KM } from './factors';
import { biggestIntlTrip, domesticTrips, intlTrips, meanFlightT } from '../lib/trips';

export const APPLY_ORDER = [
  'one-less-international', 'closer-trip', 'combine-trips', 'skip-one-domestic',
  'uber-to-pt', 'halve-km', 'diet-low', 'diet-veg', 'sea-not-air', 'fewer-parcels',
  'electrify-gas', 'ev-switch',
  'solar',
];

// The closer trip: one economy return at the representative short overseas
// sector the rough counts already use (about four hours each way), with RF,
// through the same factor and distance uplift the engine prices flights at.
export const CLOSER_TRIP = {
  km: ROUGH_FLIGHT_KM.short,
  t: (ROUGH_FLIGHT_KM.short * 2 * FLIGHT_DISTANCE_UPLIFT * FLIGHT_FACTORS.shortIntl.withRF.economy) / 1000,
};

// The flight levers act on trips, not ledger rows (lib/trips.js): a rough
// count of three returns is three trips, and a five-leg circuit is one.
// "Drop" and "go closer" both act on the same biggest overseas trip and take
// the larger of their two cuts, so both on never cuts two trips.
export const ABATEMENT_OPTIONS = [
  {
    id: 'one-less-international',
    category: 'flight',
    // Two options act on this same trip; the reveal shows only the larger.
    target: 'biggest-intl-trip',
    action: 'Drop the biggest overseas trip',
    detail: 'Drops the single largest overseas trip in the year, every leg of it, and the hotel nights booked on it, assuming the year would otherwise repeat. The hardest change here, and on a flight-heavy year the only one that moves the total by whole tonnes.',
    effort: 'high',
    source: 'Reduction is your own largest overseas trip (all its legs and attached hotel nights) at the DEFRA factors; saving is an indicative $900 economy return fare.',
    applicable: (st) => intlTrips(st.trips).length > 0,
    apply: (st, p) => {
      const trip = biggestIntlTrip(st.trips);
      if (!trip) return;
      st.tripCutFlightT = Math.max(st.tripCutFlightT, trip.flightT * p);
      st.tripCutHotelT = Math.max(st.tripCutHotelT, trip.hotelT * p);
    },
    cost: () => -900,
  },
  {
    id: 'closer-trip',
    category: 'flight',
    target: 'biggest-intl-trip',
    action: 'Take the biggest trip somewhere closer',
    detail: 'Keep the week away and fly less far: the biggest long-haul trip in the year re-priced as one short overseas return, about four hours each way. The hotel nights stay, because you are still away.',
    effort: 'med',
    source: 'Reduction is your largest overseas trip at the DEFRA factors, less one economy return at the representative 2,400 km short overseas sector with RF; saving is an indicative $400 cheaper fare.',
    applicable: (st) => {
      const trip = biggestIntlTrip(st.trips);
      return !!trip && trip.longHaul && trip.flightT - CLOSER_TRIP.t > 0.05;
    },
    apply: (st, p) => {
      const trip = biggestIntlTrip(st.trips);
      if (!trip || !trip.longHaul) return;
      st.tripCutFlightT = Math.max(st.tripCutFlightT, Math.max(0, trip.flightT - CLOSER_TRIP.t) * p);
    },
    cost: () => -400,
  },
  {
    id: 'combine-trips',
    category: 'flight',
    action: 'Combine two overseas trips into one',
    detail: 'Two shorter trips combined into one longer one saves a whole overseas trip\'s flights. Same holidays, one fewer set of flights.',
    effort: 'med',
    source: 'Reduction is your mean overseas trip (all its legs) at the DEFRA factors; saving is an indicative $800 return fare, offset by nothing except planning.',
    applicable: (st) => intlTrips(st.trips).length >= 2,
    apply: (st, p) => {
      // With the biggest trip already dropped or moved, the two combined
      // come from the trips that are left, so the levers never overlap.
      const intl = intlTrips(st.trips);
      const big = biggestIntlTrip(st.trips);
      const pool = st.tripCutFlightT > 0 ? intl.filter((t) => t !== big) : intl;
      if (pool.length < 2) return;
      st.droppedFlightT += meanFlightT(pool) * p;
    },
    cost: () => -800,
  },
  {
    id: 'skip-one-domestic',
    category: 'flight',
    action: 'Skip one domestic return (rail or video)',
    detail: 'One average domestic trip from your year taken by train, or joined by video.',
    effort: 'low',
    source: 'Reduction is your mean domestic trip at the DEFRA domestic factor; saving is an indicative $350 return fare.',
    applicable: (st) => domesticTrips(st.trips).length > 0,
    apply: (st, p) => {
      const dom = domesticTrips(st.trips);
      if (!dom.length) return;
      st.droppedFlightT += meanFlightT(dom) * p;
    },
    cost: () => -350,
  },
  {
    id: 'uber-to-pt',
    category: 'road',
    action: 'Shift most rideshare trips to the train',
    detail: 'Seventy percent of rideshare kilometres move to public transport. The per-kilometre factor drops by four fifths and the fare drops by more.',
    effort: 'med',
    source: 'Factor delta per the road modes table; saving is the fare difference at about $1.85 per km avoided, less additional Opal fares.',
    applicable: (st) => st.kmRide > 0,
    apply: (st, p) => {
      const moved = st.kmRide * 0.7 * p;
      st.kmRide -= moved;
      st.kmPt += moved;
    },
    cost: (st) => 100 - st.kmRide * 0.7 * 1.85,
  },
  {
    id: 'halve-km',
    category: 'road',
    action: 'Halve car kilometres (PT, bike, feet)',
    detail: 'Mode shift on the trips that do not need a car. Applied to kilometres before any EV switch, so the two compose and are counted once.',
    effort: 'med',
    source: 'Fuel saving at your audited consumption and $1.85/L, less indicative public transport spend of $200/yr.',
    applicable: (st) => st.kmCar > 0,
    apply: (st, p) => { st.kmCar *= 1 - 0.5 * p; },
    cost: (st) => 200 - ((st.kmCar * st.l100km) / 100) * 0.5 * 1.85,
  },
  {
    id: 'ev-switch',
    category: 'road',
    action: 'Switch the car to an EV',
    detail: 'Petrol goes to zero; charging load is added to the meter at 0.16 kWh/km, where rooftop solar can act on it. At low annual mileage on a fossil grid the standalone win is small, and the curve says so.',
    effort: 'high',
    source: 'Electric Vehicle Council cost-of-ownership guidance: purchase premium amortised about $1,400/yr, less fuel and servicing savings scaled to your audited kilometres.',
    applicable: (st) => st.kmCar > 0 && st.evShare < 1,
    apply: (st, p) => { st.evShare = Math.max(st.evShare, p); },
    cost: (st) => 1400 - (((st.kmCar * st.l100km) / 100) * 1.85 + 150),
  },
  {
    id: 'diet-low',
    category: 'diet',
    action: 'Medium meat to low meat',
    detail: 'Meat under 50 g a day on average. The factor set treats diet coarsely, so read this for direction and rough size only.',
    effort: 'low',
    source: 'Scarborough et al. 2014 per-day factors; grocery saving indicative $300/yr (less red meat, more legumes).',
    applicable: (st) => st.dietPerDay > 4.67,
    apply: (st, p) => { st.dietPerDay += (Math.min(st.dietPerDay, 4.67) - st.dietPerDay) * p; },
    cost: () => -300,
  },
  {
    id: 'diet-veg',
    category: 'diet',
    action: 'Vegetarian',
    detail: 'Supersedes the low-meat option when both are on; the pathway takes the lower factor and counts it once.',
    effort: 'med',
    source: 'Scarborough et al. 2014 per-day factors; grocery saving indicative $500/yr.',
    applicable: (st) => st.dietPerDay > 3.81,
    apply: (st, p) => { st.dietPerDay += (Math.min(st.dietPerDay, 3.81) - st.dietPerDay) * p; },
    cost: () => -500,
  },
  {
    id: 'sea-not-air',
    category: 'freight',
    action: 'Sea shipping for overseas orders',
    detail: 'Moving overseas orders to consolidated sea freight cuts the international parcel factor by about 90 percent. The parcel arrives three weeks later and the planet does not notice the difference in your cupboard.',
    effort: 'low',
    source: 'DEFRA modal factors: deep-sea container at roughly one seventieth of long-haul air freight per tonne-km; shipping fee difference typically saves money.',
    applicable: (st) => st.freightAirT > 0.005,
    apply: (st, p) => { st.seaShift = Math.max(st.seaShift || 0, 0.9 * p); },
    cost: () => -50,
  },
  {
    id: 'fewer-parcels',
    category: 'freight',
    action: 'Consolidate parcels into standard shipping',
    detail: 'On most footprints this barely moves the total.',
    effort: 'low',
    source: 'Assumes 40% fewer parcel movements at the indicative per-parcel factor; no net cost.',
    applicable: (st) => st.freightOtherT > 0.005,
    apply: (st, p) => { st.freightOtherT *= 1 - 0.4 * p; },
    cost: () => 0,
  },
  {
    id: 'electrify-gas',
    category: 'gas',
    action: 'Electrify the gas appliances',
    detail: 'Reverse-cycle heating and heat pump hot water replace 90% of gas use; the new electric load is added to the meter before solar acts on it. Flagged not applicable for renters and apartments: this one belongs to the landlord.',
    effort: 'high',
    source: 'Heat pump COP 3.5 against gas appliance efficiency 0.85; capex about $3,000 net of state rebates, amortised over 12 years and split across the household; running-cost delta at indicative 4c/MJ gas and 30c/kWh electricity, scaled to your audited gas use.',
    applicable: (st) => st.mj > 0 && st.dwelling === 'house' && st.roofOwn,
    apply: (st, p) => {
      const cut = st.mj * 0.9 * p;
      st.mj -= cut;
      st.addedKwh0 += (cut * 0.85) / 3.6 / 3.5;
    },
    // Same per-person boundary as the reduction: capex splits across the
    // household, and the running saving scales with the audited (per-person)
    // gas share instead of a flat figure.
    cost: (st) => {
      const cutMj = st.mj * 0.9;
      const addedKwh = (cutMj * 0.85) / 3.6 / 3.5;
      return 250 / st.householdSize - (cutMj * 0.04 - addedKwh * 0.3);
    },
  },
  {
    id: 'solar',
    category: 'electricity',
    action: 'Rooftop solar (6.6 kW)',
    detail: 'Assumes 60% of annual grid draw displaced (generation minus export). Requires a roof you own, so it is flagged not applicable for apartments and rentals.',
    effort: 'high',
    source: 'System cost about $5,500 installed (Solar Choice price index), amortised over 15 years against bill savings at typical capital-city yield, both split across the household.',
    applicable: (st) => st.dwelling === 'house' && st.roofOwn && st.kwh > 0,
    apply: (st, p) => { st.solarReduction = Math.max(st.solarReduction, 0.6 * p); },
    // Costed whole-household then split per adult, so the $/t sits on the
    // same boundary as the per-person reduction. st.kwh is the audited
    // per-person share; the system's capex and yield belong to the home.
    cost: (st) => (367 - Math.min(st.kwh * st.householdSize, 4400) * 0.6 * 0.3) / st.householdSize,
  },
];
