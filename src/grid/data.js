// Grid Intensity (/grid/) — all copy, factors and templates for the page.
// Nothing user-facing is written inline in the components; it all lives here,
// the same way the footprint page keeps its words in data/copy.js.
//
// Two views run off the same National Electricity Market (NEM) data:
//  A · Live   — current generation intensity by state, with one plain answer.
//  B · Explorer — location-based vs market-based Scope 2, taught with toggles.
//
// Data honesty is the whole point of this site, so every number below carries
// its source and an accessed date, and the constructed fallback curves are
// labelled as indicative estimates, never as measured or live figures.

export const ACCESSED = '24 July 2026';
export const LAST_UPDATED = '24 July 2026';

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------
export const NGA_SOURCE = {
  name: 'DCCEEW, Australian National Greenhouse Accounts Factors 2025',
  detail:
    'Table 1: Scope 2 emission factors for purchased electricity by state and territory (kg CO2-e per kWh, consumption-based, transmission and distribution losses included). Published August 2025; replaces the 2024 workbook.',
  url: 'https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors-2025',
  accessed: ACCESSED,
};

export const RMF_SOURCE = {
  name: 'Clean Energy Regulator, Voluntary market-based Scope 2 emissions guideline',
  detail:
    'National residual mix factor (RMF) for the 2025-26 reporting year, 0.81 kg CO2-e per kWh, applying to every facility using the market-based method regardless of its state or whether it is connected to the main grid. This is the market-based reference for any electricity a business or household has not covered with surrendered contractual instruments. Guideline published July 2026.',
  url: 'https://cer.gov.au/document/voluntary-market-based-scope-2-emissions-guideline',
  accessed: ACCESSED,
};

// AEMO/OpenNEM source is imported from src/lib/opennem.js (OPENNEM_SOURCE) so
// the two grid tools cite the live feed identically.

// ---------------------------------------------------------------------------
// Page intro
// ---------------------------------------------------------------------------
export const INTRO = {
  tag: 'Grid intensity',
  title: ['When is the grid', 'clean enough'],
  lead:
    'Run the dishwasher now, or wait two hours. This reads the live National Electricity Market fuel mix and gives you one answer for your state, then explains the factor a business would report against.',
  chips: ['Live NEM data', 'Generation-mix estimate', 'Location vs market-based'],
  note: 'Two views, one data source. Live for the timing call, Explorer for the accounting.',
};

export const TABS_LABEL = 'Choose a view';

export const TABS = [
  { id: 'live', label: 'Live' },
  { id: 'explorer', label: 'Explorer' },
];

// ---------------------------------------------------------------------------
// Regions. The five NEM regions carry a live number; WA and NT do not, and the
// UI says so plainly rather than inventing one.
// ---------------------------------------------------------------------------
export const REGIONS = [
  { code: 'NSW1', state: 'NSW', label: 'New South Wales', nem: true },
  { code: 'QLD1', state: 'QLD', label: 'Queensland', nem: true },
  { code: 'SA1', state: 'SA', label: 'South Australia', nem: true },
  { code: 'TAS1', state: 'TAS', label: 'Tasmania', nem: true },
  { code: 'VIC1', state: 'VIC', label: 'Victoria', nem: true },
  { code: 'WA', state: 'WA', label: 'Western Australia', nem: false, grid: 'SWIS' },
  { code: 'NT', state: 'NT', label: 'Northern Territory', nem: false, grid: 'DKIS' },
];

export const NON_NEM_NOTE =
  'The main grid here is not part of the National Electricity Market, so there is no live figure to read from this feed. The Explorer view still carries its annual reporting factor.';

// ---------------------------------------------------------------------------
// Fallback: indicative typical daily curves per NEM region.
//
// These are NOT sourced measurements. They are hand-constructed daily shapes
// that reflect the well-known pattern of each grid: coal-heavy states sit high
// overnight and dip in the middle of the day as rooftop and utility solar
// arrive; hydro and wind states sit far lower. Values are hourly gCO2e/kWh of
// generation, midnight first. They exist only so the page can still answer a
// timing question when the live feed cannot be reached, and they are always
// labelled as an indicative estimate on screen. Do not present them as live.
// ---------------------------------------------------------------------------
export const TYPICAL_CURVES = {
  NSW1: [660, 655, 650, 650, 655, 665, 670, 640, 600, 540, 480, 440, 420, 430, 470, 540, 610, 660, 690, 695, 685, 675, 670, 665],
  QLD1: [610, 605, 600, 600, 605, 615, 620, 590, 540, 470, 400, 360, 345, 360, 400, 470, 560, 620, 650, 655, 645, 630, 620, 615],
  VIC1: [880, 875, 870, 870, 875, 885, 895, 880, 840, 780, 710, 660, 640, 650, 690, 760, 840, 895, 915, 915, 905, 895, 888, 882],
  SA1: [250, 240, 230, 225, 230, 250, 280, 270, 220, 160, 110, 75, 60, 65, 90, 150, 230, 300, 340, 345, 330, 300, 280, 260],
  TAS1: [60, 55, 50, 48, 50, 60, 75, 85, 80, 65, 45, 30, 25, 28, 38, 55, 80, 100, 110, 105, 95, 85, 75, 66],
};

export const TYPICAL_LABEL =
  'Typical pattern, indicative estimate. The live feed could not be reached, so this is a hand-built daily shape for the region.';

// ---------------------------------------------------------------------------
// Live view: status bands, verdicts and narrative templates.
//
// The answer comes from where the current reading sits inside the region's own
// 24 hour range (the live curve when the feed is up, the indicative curve when
// it is not). Bottom third of the day is a good window, top third is a poor
// one, the middle third does not much matter. That logic is stated on the page
// in the method section.
// ---------------------------------------------------------------------------
export const BANDS = {
  good: {
    tone: 'good',
    kicker: 'Good window',
    verdict: 'Run it now',
    // matcha / lime family. Deep forest ink on a pale lime wash: the number
    // reads well past 7:1, the wash carries the "cleaner" cue.
    logic: 'The reading is in the bottom third of the day for this grid, so now is a cleaner time than most.',
  },
  mid: {
    tone: 'mid',
    kicker: 'Middle of the pack',
    verdict: 'It does not matter much today',
    // amber. Amber-ink (var(--amber-ink)) on a faint amber wash clears 4.5:1;
    // used for the number and label.
    logic: 'The reading sits in the middle third of the day, so shifting the load an hour or two changes very little.',
  },
  poor: {
    tone: 'poor',
    kicker: 'Dirtier window',
    verdict: 'Wait if you can',
    // berry. Dark berry (#A81F3D) on a faint berry wash clears 4.5:1.
    logic: 'The reading is in the top third of the day for this grid, so a flexible load is worth delaying toward a cleaner hour.',
  },
};

// Thresholds on the fraction (current - dayMin) / (dayMax - dayMin).
export const BAND_CUTS = { good: 0.34, poor: 0.66 };

export function bandFor(fraction) {
  if (fraction == null || Number.isNaN(fraction)) return BANDS.mid;
  if (fraction <= BAND_CUTS.good) return BANDS.good;
  if (fraction >= BAND_CUTS.poor) return BANDS.poor;
  return BANDS.mid;
}

// Plain-English line built from the fuel mix and the local hour. Templates only;
// the component passes in the live numbers.
export function mixLine({ renewableShare, coalShare, label }) {
  const pct = (x) => Math.round(x * 100);
  if (renewableShare >= 0.6) return `Wind, solar and hydro are carrying about ${pct(renewableShare)}% of ${label} right now.`;
  if (renewableShare >= 0.4) return `Renewables are running close to half of ${label} right now, at about ${pct(renewableShare)}%.`;
  if (coalShare >= 0.6) return `Coal is doing most of the work in ${label} right now, about ${pct(coalShare)}% of it.`;
  if (coalShare >= 0.35) return `Coal is still the biggest single source in ${label} right now, about ${pct(coalShare)}%, with gas and renewables filling in.`;
  return `The mix in ${label} is spread across gas, coal and renewables right now, with renewables near ${pct(renewableShare)}%.`;
}

// Soft time-of-day window hint. Deliberately not tied to an exact clock time:
// state local time, daylight saving and the browser clock do not always agree,
// so the wording stays relative.
export function windowLine(hour) {
  if (hour >= 22 || hour < 6) return 'Overnight base load is carrying the grid, and the solar-led dip is still hours away.';
  if (hour < 10) return 'Solar is climbing, so the grid usually keeps easing through the morning.';
  if (hour < 15) return 'The solar-led dip is around now and tends to hold into the early afternoon.';
  if (hour < 19) return 'The evening peak is building as solar drops away, so cleaner hours are behind you for today.';
  return 'The evening peak is easing back toward the overnight base load.';
}

export const LIVE_COPY = {
  tag: 'Live',
  heading: 'Right now on your grid',
  sub: 'Pick your state. One number, one answer. The chart is one tap away if you want to see the shape of the day.',
  unit: 'gCO2e/kWh',
  showDay: 'Show the day',
  hideDay: 'Hide the day',
  sparkNote: 'Intensity over the last 24 hours, oldest on the left. Gaps are intervals the feed did not return.',
  typicalSparkNote: 'Indicative daily shape for this grid, midnight on the left. Not measured data.',
  // Axis ends and range under the day chart. The dot marks the reading above:
  // the latest interval when live, the current hour on the indicative shape.
  sparkEnds: { live: ['24 hours ago', 'Now'], typical: ['00:00', '23:00'] },
  sparkRange: (lo, hi) => `Low ${lo}, high ${hi} gCO2e/kWh`,
  sparkLabel: (label, live) => `24 hour intensity for ${label}. ${live ? 'Live estimate.' : 'Indicative pattern.'}`,
  liveState: (t) => `Live, as of ${t}`,
  liveStateNoTime: 'Live',
  estimateTag: 'Estimate from the fuel mix',
  fallbackState: 'Live feed unavailable, showing the indicative pattern',
  refreshing: 'Refreshing…',
  typicalNowLabel: 'Typical for this time',
  liveNowLabel: 'Intensity now',
  srValue: (v) => (v != null ? `${v} grams of CO2 equivalent per kilowatt-hour.` : 'No reading available.'),
  noValue: 'n/a',
  regionsLabel: 'Choose a state',
  // The figure is the selected region's total dispatch, not the whole NEM.
  genLabel: 'Generation now',
  renewLabel: 'Renewables',
  coalLabel: 'Coal',
  estimateFootnote:
    'The live number is a generation-mix estimate, derived from the AEMO fuel mix with indicative technology-average factors. It is not a metered, settlement-grade figure, and it is a different quantity from the annual reporting factor in the Explorer view.',
};

// ---------------------------------------------------------------------------
// Explorer view: location-based vs market-based Scope 2.
// ---------------------------------------------------------------------------
// Location-based Scope 2 factors, NGA Factors 2025, Table 1. These match the
// values the site's Life Footprint engine already prices from, kept in step by
// hand and cited to the same DCCEEW workbook.
export const LOCATION_FACTORS = {
  NSW: { label: 'New South Wales & ACT', s2: 0.64 },
  QLD: { label: 'Queensland', s2: 0.67 },
  SA: { label: 'South Australia', s2: 0.22 },
  TAS: { label: 'Tasmania', s2: 0.20 },
  VIC: { label: 'Victoria', s2: 0.78 },
  WA: { label: 'Western Australia (SWIS grid)', s2: 0.50 },
  NT: { label: 'Northern Territory (DKIS grid)', s2: 0.56 },
};

// National residual mix factor for the 2025-26 reporting year. The published
// RMF is a single national figure that applies to every facility using the
// market-based method, whatever state it is in and whether or not it is on the
// main grid, so market-based sits on the same number everywhere. Only the
// jurisdictional renewable power percentage varies by state, and that is a
// renewables share rather than an emissions factor, so it is not modelled here.
export const RMF = 0.81;

// Year selector. Only one edition is shipped because only one is verified to
// citation grade from the published workbook and guideline. The UI says so.
export const EXPLORER_YEARS = [
  {
    id: '2025',
    label: '2025 workbook, 2025-26 RMF',
    locationSource: NGA_SOURCE,
    rmf: RMF,
    rmfSource: RMF_SOURCE,
  },
];

export const EXPLORER_COPY = {
  tag: 'Explorer',
  heading: 'Location-based or market-based',
  sub: 'The same kilowatt-hour has two carbon numbers. This shows both side by side, and lets you move the one your electricity contract can change.',
  yearLabel: 'Reporting edition',
  yearNote:
    'Only the current edition is shown. Earlier years are left out because their exact published figures could not be verified to citation grade here, and a wrong factor is worse than a missing one. One thing is worth knowing: the 2025-26 residual mix factor is a single national figure, and the guideline applies it to every facility on the market-based method, whatever state it is in and whether or not it is on the main grid. There is no state-level residual mix factor to pick from.',
  stateLabel: 'State',
  locTitle: 'Location-based',
  locSub: 'What the wires around you averaged over the year.',
  mktTitle: 'Market-based',
  mktSub: 'What your contract leaves you accountable for.',
  locTag: 'Does not move',
  mktTag: 'Moves with your contract',
  unit: 'kg CO2e/kWh',
  coverLabel: 'Consumption covered by GreenPower or a renewable PPA',
  coverHint: 'Slide to the share of your electricity backed by a contractual instrument.',
  coverValueText: (cov) => `${cov} per cent covered`,
  lgcLabel: 'Certificates surrendered',
  lgcOn: 'Surrendered',
  lgcOff: 'Not surrendered',
  lgcHint:
    'A green tariff or PPA only lowers your market-based number when the certificates behind it are cancelled on your behalf. Toggle this off to see what an unsurrendered purchase is worth: nothing.',
  // Teaching paragraph. The component fills the two numbers in.
  explain: (s2, covered, lgcOn) => {
    const cov = Math.round(covered * 100);
    if (!lgcOn) {
      return `Your location-based factor stays ${s2.toFixed(2)} because it describes the wires around you. And your market-based figure is back up at the full residual mix, because certificates that are never surrendered do not count. A green plan you cannot show was cancelled buys you no reduction on paper.`;
    }
    if (cov === 0) {
      return `Your location-based factor stays ${s2.toFixed(2)} because it describes the wires around you. With nothing under contract yet, your market-based figure sits on the residual mix, the grid with everyone else's renewables already claimed and stripped out. Move the coverage slider and watch only the market-based side change.`;
    }
    if (cov >= 100) {
      return `Your location-based factor stays ${s2.toFixed(2)} because it describes the wires around you. Cover every kilowatt-hour with surrendered certificates and your market-based figure falls to zero, even though the physical electricity reaching you is unchanged. Both numbers get reported, which is how a company can show a falling market-based figure and a flat location-based one in the same disclosure.`;
    }
    return `Your location-based factor stays ${s2.toFixed(2)} because it describes the wires around you. You have covered ${cov}% with surrendered certificates, so your market-based figure is that share of the residual mix removed. The location-based side never moves, no matter what you buy.`;
  },
  mathTitle: 'The market-based sum',
  mathLine:
    'Market-based = (share not covered by surrendered certificates) × residual mix factor + (covered share × 0).',
  mathNote: 'Covered electricity counts as zero. Everything else sits on the residual mix, which is dirtier than the grid average because the renewables in it belong to someone else already.',
};

// ---------------------------------------------------------------------------
// Method / basis of preparation. Same shape and voice as the footprint method.
// ---------------------------------------------------------------------------
export const METHOD = {
  tag: 'How it works',
  title: ['Basis of', 'preparation'],
  sub: 'What this reads, where the numbers come from, how the answer is worked out, and what it leaves out. Two different quantities live on this page, so it is worth being exact about which is which.',
  blocks: [
    {
      icon: 'bolt',
      title: 'What the live number is',
      paras: [
        'The Live view reads the current fuel mix for each NEM region from the AEMO dispatch data that OpenNEM (OpenElectricity) republishes, then derives a generation-weighted emissions intensity from it using indicative technology-average factors, one per fuel type.',
        'That makes it an estimate of how clean the electricity being generated is at this moment, in grams of CO2e per kilowatt-hour. It covers generation only, before network losses, and it is not a metered, settlement-grade figure. Use it to time a load; the Explorer factors are the ones to report against.',
      ],
    },
    {
      icon: 'chart',
      title: 'How the answer is worked out',
      paras: [
        'The single answer, run it now, wait, or it does not matter much, comes from where the current reading sits inside this grid\'s own range for the last 24 hours. Bottom third of the day is a good window, top third is a dirtier one, and the middle third is close enough that shifting a load an hour or two barely moves it.',
        'The plain-English line is generated from the live renewable and coal shares and the time of day. When the live feed cannot be reached, the same logic runs against an indicative daily shape for the region, and the page says clearly that it is doing so.',
      ],
    },
    {
      icon: 'globe',
      title: 'What the reporting factor is',
      paras: [
        'The Explorer view is a different quantity. The location-based factor is the annual, consumption-based average for your state from the DCCEEW National Greenhouse Accounts, with transmission and distribution losses included. It describes the wires around you and does not change with the time of day or with your contract.',
        'The market-based factor is what you are left accountable for once contractual instruments are taken into account. Electricity you have covered with surrendered certificates counts as zero; the rest sits on the Clean Energy Regulator\'s national residual mix factor for the 2025-26 reporting year, which is higher than the grid average because the renewables in the grid have already been claimed by the people who surrendered those certificates.',
        'That residual mix factor is one national number. The guideline applies it to every facility using the market-based method, whatever state it is in and whether or not it is connected to the main grid, so the market-based side of the Explorer does not vary by state the way the location-based side does.',
      ],
    },
    {
      icon: 'clock',
      title: 'How often it updates',
      paras: [
        'The live feed refreshes every few minutes at the source, and this page re-reads it about every five minutes while the tab is open and visible. The "as of" time is the timestamp of the most recent interval the feed returned.',
        'The reporting factors update once a year. The National Greenhouse Accounts workbook is published around August, and the residual mix factor follows the reporting year it is calculated from, in the market-based guideline reissued for that year. The edition read here is the July 2026 guideline, for 2025-26, which still cites the 2025 workbook for how the factor is calculated. This page was last checked against those sources on ' + LAST_UPDATED + '.',
      ],
    },
    {
      icon: 'bin',
      title: 'What it leaves out',
      wide: true,
      exclusions: [
        'Western Australia (SWIS) and the Northern Territory (DKIS) are not in the National Electricity Market, so there is no live figure for them from this feed. Their annual reporting factors are still shown in the Explorer view.',
        'Behind-the-meter generation and consumption, most of all rooftop solar you use on site, is only partly captured. The mix reflects grid-scale dispatch plus the rooftop solar the market operator estimates.',
        'The live intensity covers generation only. It excludes network losses, embodied emissions in the plant and fuel supply chains, and any Scope 3 electricity factor. The Explorer factors are the ones to use for reporting.',
        'Bioenergy is counted at zero combustion CO2e in the live estimate, which understates its full life-cycle figure. It is a rounding-level share of NEM generation.',
        'Only the current reporting edition is shown in the Explorer. Earlier years are left out until their figures can be read from the published workbook.',
      ],
    },
  ],
  sourcesTitle: 'Sources',
  sourcesSub: 'Every figure on the page traces to one of these.',
  sourceLink: 'Source',
  accessed: (d) => `Accessed ${d}`,
  lastChecked: (d) => `Last checked against these sources on ${d}.`,
};

export const METHOD_SOURCES = [NGA_SOURCE, RMF_SOURCE];
