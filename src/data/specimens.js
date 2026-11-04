// ---------------------------------------------------------------------------
// SPECIMENS — the small live charts drawn inside the home page's tool cards
// (src/components/ToolSpecimen.jsx, rendered by src/components/Tools.jsx).
//
// WHY THE NUMBERS ARE COPIED HERE, NOT IMPORTED.
//   Each tool's data module is large: targets is ~128 kB, fashion ~170 kB,
//   footprint ~168 kB. Importing any of them would pull the whole file into
//   the home page bundle for the sake of a handful of numbers, because the
//   exports are single large arrays and there is nothing for the bundler to
//   shake off. So each specimen carries a hand-lifted slice instead.
//
// THE RULE THAT COMES WITH THAT.
//   Every slice below names the file and export it was lifted from, and the
//   figures are read out of that source, never estimated to fit the drawing.
//   When a tool's data changes, its slice here changes in the same commit.
//   `derivedOn` records when the slice was last read across.
//
// Each specimen also carries a `caption` (what the drawing shows) and a
// `basis` (what stands behind it: sourced, derived, or illustrative). The card
// renders both, because a chart with no basis is exactly what the rest of this
// section argues against.
// ---------------------------------------------------------------------------

export const DERIVED_ON = '28 July 2026';

export const SPECIMENS = {
  // From src/targets/data.js → COMPANIES, id 'bhp'. Claimed path: FY2020
  // restated baseline 13.6 Mt, at least 30% below by FY2030, net zero 2050.
  // Reported is BHP's own operational Scope 1 and 2 series. FY2021 and FY2022
  // are absent in the source because they sit on a pre-divestment boundary,
  // so the line skips them here too rather than interpolating across.
  targets: {
    kind: 'trajectory',
    company: 'BHP',
    baseYear: 2020,
    baseMt: 13.6,
    netZeroYear: 2050,
    interim: [{ year: 2030, cutPct: 30 }],
    reported: [[2020, 13.6], [2023, 9.9], [2024, 9.2], [2025, 8.7]],
    nowYear: 2026,
    caption: 'BHP: the claimed path against what it reported',
    basis: 'Sourced · Mt CO2e, Scope 1 and 2, operated assets',
  },

  // From src/work/workData.js → BASELINE_SECTORS.infrastructure. The source
  // labels this an illustrative representative portfolio, not client data,
  // and the card repeats that word rather than dropping it.
  work: {
    kind: 'scopes',
    sector: 'Infrastructure services',
    parts: [
      { label: 'Scope 1', pct: 11.5 },
      { label: 'Scope 2', pct: 5.8 },
      { label: 'Scope 3', pct: 82.7 },
    ],
    caption: 'Infrastructure services: where the emissions sit',
    basis: 'Illustrative, not client data · composite scaled to listed sector peers',
  },

  // From src/fashion/data.js → BRANDS, counting the Fashion Transparency Index
  // score on each. 248 of 258 brands carry a score; the other 10 are marked
  // needs-research and are left out of the count rather than binned at zero.
  fashion: {
    kind: 'histogram',
    scored: 248,
    total: 258,
    bins: [
      { label: '0-20', n: 110 },
      { label: '21-40', n: 72 },
      { label: '41-60', n: 50 },
      { label: '61-80', n: 14 },
      { label: '81-100', n: 2 },
    ],
    median: 24,
    caption: 'How much 248 brands disclose',
    basis: 'Fashion Transparency Index 2023 · a disclosure score',
  },

  // From src/super/data.js → FUNDS, counting entries in each fund's `flagged`
  // list. Every one of the ten default options carries at least one holding
  // flagged under the page's stated criteria.
  super: {
    kind: 'matrix',
    funds: 10,
    flaggedFunds: 10,
    dots: [3, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    caption: 'Flagged holdings in each default option',
    basis: 'Sourced and reported, flagged under stated criteria',
  },

  // From src/grid/data.js → LOCATION_FACTORS and RMF. kg CO2e per kWh.
  // The residual mix factor is the market-based reference for electricity a
  // business has not covered with surrendered instruments; GreenPower and
  // surrendered LGCs are the zero at the other end of the same scale.
  grid: {
    kind: 'factors',
    unit: 'kg CO2e / kWh',
    bars: [
      { label: 'Residual mix', v: 0.81, mode: 'market' },
      { label: 'VIC', v: 0.78, mode: 'location' },
      { label: 'NSW', v: 0.64, mode: 'location' },
      { label: 'SA', v: 0.22, mode: 'location' },
      { label: 'TAS', v: 0.20, mode: 'location' },
      { label: 'GreenPower', v: 0, mode: 'market' },
    ],
    caption: 'The same kilowatt hour, priced six ways',
    basis: 'Sourced · DCCEEW NGA Factors 2025, CER residual mix',
  },

  // Computed by the site's own engine: aggregate(buildSeedProfile(),
  // SEED_SETTINGS, SEED_PERIOD).byCategory in src/footprint/lib/engine.js,
  // over the worked example year. Totals 14.6 t CO2e on the 2026 DEFRA
  // factor set, which revised flights and air freight down.
  footprint: {
    kind: 'stack',
    totalT: 14.6,
    parts: [
      { label: 'Flights', pct: 63.5 },
      { label: 'Diet', pct: 14.1 },
      { label: 'Hotel nights', pct: 6.7 },
      { label: 'Freight', pct: 3.9 },
      { label: 'Goods', pct: 3.3 },
      { label: 'Everything else', pct: 8.5 },
    ],
    caption: 'One real year, 14.6 t, priced by category',
    basis: 'Derived · the page engine over the worked example',
  },

  // From src/progress/data.js → CHAPTERS, id 'emissions'. 24.5% below the
  // June 2005 base year in the year to December 2025; the 43% by 2030 target
  // implies roughly 34% below by 2025 on a straight line.
  progress: {
    kind: 'gap',
    nowPct: 24.5,
    pacePct: 34,
    targetPct: 43,
    targetYear: 2030,
    caption: 'Emissions against the 2030 target',
    basis: 'Sourced · per cent below the 2005 base year',
  },

  // From src/daily/data.js → GUESS_POOL, id 'flight-bali', priced by the
  // footprint factor tables. The benchmark line is the 2.5 t per person
  // 1.5 degree lifestyle figure the footprint calculator uses.
  daily: {
    kind: 'scale',
    item: 'A return flight to Bali',
    kg: 1170,
    unitNote: 'CO2e, one economy seat',
    benchmarkKg: 2500,
    benchmarkLabel: '2.5 t · a 1.5°C year',
    caption: 'Guess the footprint, then see the factor',
    basis: 'Derived · the same factor set the footprint model uses',
  },
};
