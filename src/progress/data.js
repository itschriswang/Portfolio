// All editorial copy and every number for Australia's Climate Progress
// (/progress/). Words and figures live here, not in components. Australian
// English, no em dashes, Chris's voice: plain, direct, a little dry, honest
// about what is not on track.
//
// DATA HONESTY (this page's whole point). Every metric carries:
//   - value + the period it covers ("data to")
//   - a source id resolving to SOURCES (name, detail, url, accessed)
//   - a `status`: 'sourced' (read straight from a cited release),
//     'derived' (arithmetic shown in the method), or 'estimate' (a benchmark
//     that is a recommendation or a range, labelled as such).
// A figure that could not be verified to citation grade is not shown as a
// confident number; where it matters it is described qualitatively and the
// method says so. Nothing here blends the live grid snapshot with the annual
// figures: they are different quantities and stay apart.

export const META = {
  navLabel: 'Progress',
  // Single source of truth for the last-updated stamp, rendered top and bottom.
  updated: '13 August 2026',
  updatedLabel: 'Last updated',
  cadence: 'Reviewed quarterly, as the national inventory and the market data refresh. Check the date above before you rely on anything below it.',
  live: {
    label: 'On the grid right now',
    building: 'Reading the live grid mix',
    // Shown only when fetchNemSnapshot() returns live data.
    renewLabel: 'renewables',
    coalLabel: 'coal',
    asOf: 'as of',
    note: 'A live snapshot of the five NEM regions, generation share this minute. It is a different quantity from the annual figures below and is never mixed into them. WA and the NT are not in the NEM, so they are not in this number.',
  },
};

export const INTRO = {
  tag: 'The tracker',
  kicker: 'Australia · climate transition',
  title: ['What is changing,', 'and how fast'],
  sub: 'Doom is easy and cheerleading is worse. This is a handful of real numbers on Australia\'s energy transition, each shown against where it was and against what the target needs, with the distance between the two stated plainly in whichever direction it runs.',
  read: 'Each chapter reads the same way. First the reference point: what it was, or what the target needs. Then the number as it stands now. Then one sentence on the gap between them.',
  scroll: 'Scroll',
};

// Sources, resolved by id from each metric. name + detail + url + accessed.
export const SOURCES = {
  openelectricity: {
    name: 'OpenElectricity (OpenNEM)',
    detail: 'Generation-share analysis of AEMO NEM dispatch data, published by the Open Electricity project.',
    url: 'https://openelectricity.org.au/analysis/40-renewable-and-rising-how-the-nems-transition-stacks-up-in-q1-2025',
    accessed: '21 July 2026',
  },
  aemo_qed: {
    name: 'AEMO Quarterly Energy Dynamics, Q4 2025',
    detail: 'AEMO\'s quarterly review of the NEM: generation mix, demand and prices. Covers 1 October to 31 December 2025. Published January 2026.',
    url: 'https://www.aemo.com.au/energy-systems/electricity/national-electricity-market-nem/data-nem/data-dashboard-nem',
    accessed: '13 August 2026',
  },
  aer_som: {
    name: 'AER State of the Energy Market 2025',
    detail: 'Australian Energy Regulator, NEM chapter: renewable and fossil generation shares by year. Headline data period is calendar 2024, where renewables were 38.7 per cent of NEM generation. Published 21 August 2025.',
    url: 'https://www.aer.gov.au/industry/registers/resources/reviews/state-energy-market-2025',
    accessed: '13 August 2026',
  },
  aes_2020: {
    name: 'Australian Energy Statistics (DCCEEW)',
    detail: 'National electricity generation by fuel type, 2020 (all Australia, a wider boundary than the NEM).',
    url: 'https://www.energy.gov.au/energy-data/australian-energy-statistics/electricity-generation',
    accessed: '21 July 2026',
  },
  // Two bodies, two methods, two different shortfall measures. Separate entries
  // because these must never be merged into one figure or attributed to each
  // other: AEMO's gap is against its own optimal development path, the
  // Authority's is against the same target on its own method.
  aemo_isp26: {
    name: 'AEMO 2026 Integrated System Plan',
    detail: 'The final plan, Version 1.0, released 25 June 2026. Its optimal development path reaches the 82 per cent renewable target by 2030 and 98 per cent by 2050. Table 6 sets today\'s capacity and pipeline against what 2030 needs: wind 8.9 GW short, renewables 10.1 GW short in total, storage 14.7 GW in surplus.',
    url: 'https://aemo.com.au/energy-systems/major-publications/integrated-system-plan-isp',
    accessed: '13 August 2026',
  },
  cca_apr25: {
    name: 'Climate Change Authority 2025 Annual Progress Report (chart data pack)',
    detail: 'Published 2025. Figure 12 labels the shortfall of wind capacity needed to meet the 82 per cent target at 5.05 GW. Figure 14 gives the national on-grid renewable share, estimated at 40 per cent for 2025. Figure 1 puts 2025 emissions at 437.5 Mt against a 611.9 Mt 2005 baseline, a different vintage and baseline convention from the national inventory.',
    url: 'https://www.climatechangeauthority.gov.au/',
    accessed: '13 August 2026',
  },
  evc_2025: {
    name: 'Electric Vehicle Council / VFACTS',
    detail: 'EV sales and new-car market share for calendar 2025, reported January 2026 from FCAI VFACTS data.',
    url: 'https://electricvehiclecouncil.com.au/media-releases/ev-sales-hit-record-highs-in-2025-with-38-rise-and-new-monthly-record-in-december/',
    accessed: '21 July 2026',
  },
  nev_strategy: {
    name: 'National EV Strategy context (Climateworks Centre)',
    detail: 'The 60 per cent of new-car sales by 2030 figure is a modelled trajectory recommended to realise Australia\'s EV potential. Australia has no binding EV sales target.',
    url: 'https://climateworkscentre.org/resource/accelerating-ev-uptake-policies-to-realise-australias-electric-vehicle-potential/',
    accessed: '21 July 2026',
  },
  cer_lgc: {
    name: 'Clean Energy Regulator Quarterly Carbon Market Report, March quarter 2026',
    detail: 'Large-scale investment and the scheme pipeline to 31 March 2026, with post-quarter events reported to 23 May 2026. Published 3 June 2026. It carries no calendar-2025 commissioning total, so it is not the source for the 2025 build figure.',
    url: 'https://cer.gov.au/markets/reports-and-data/quarterly-carbon-market-reports',
    accessed: '13 August 2026',
  },
  nga_dec25: {
    name: 'National Greenhouse Gas Inventory Quarterly Update, December Quarter 2025 (DCCEEW)',
    detail: 'Published 2026. Emissions for the year to December 2025 against the June 2005 base year for the 43 per cent target, read from Data Table 1A of its data-sources workbook. Both the all-sectors figure including land use (LULUCF) and the figure without it are worked out here from that table.',
    url: 'https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-gas-inventory-quarterly-update-december-2025',
    accessed: '13 August 2026',
  },
  cec_rooftop: {
    name: 'Clean Energy Council Rooftop solar and storage report, July to December 2025',
    detail: 'Fifth edition of the half-yearly report, published February 2026. Cumulative and annual rooftop capacity, the 3.3 GW of large-scale generation commissioned in 2025, and rooftop measured against AEMO\'s 2024 ISP projection of 36.1 GW of distributed solar in the NEM by 2029/30.',
    url: 'https://cleanenergycouncil.org.au/news-resources/rooftop-solar-and-storage-report-july-to-dec-2025',
    accessed: '13 August 2026',
  },
};

// Freshness labels for the status flag beside each number.
// Small labels around each metric and source line.
export const LABELS = {
  period: 'Period',
  accessed: 'Accessed',
  sourceLink: 'Source',
};

export const STATUS = {
  sourced: 'Sourced figure',
  derived: 'Derived here',
  estimate: 'Benchmark / estimate',
};

// The scroll-driven chapters. Each: a reference point first, then the reveal,
// then one plain sentence on the gap. `reveal.value` is the number the
// CountUp animates to; formatting is decimals + prefix/suffix.
export const CHAPTERS = [
  {
    id: 'coal',
    icon: 'flame',
    tag: 'Coal',
    kicker: 'Chapter 01 · NEM generation',
    reference: {
      label: 'For the whole life of the National Electricity Market',
      value: 'Coal ran the grid',
      note: 'Black and brown coal supplied the majority of NEM generation every year until recently. In 2020 coal was about 54 per cent of Australia\'s electricity generation.',
    },
    reveal: {
      value: 1, decimals: 0, prefix: '', suffix: '',
      big: 'A first',
      label: 'September 2025 was the first month ever in which renewables out-generated coal across the NEM.',
    },
    gap: 'Coal is still the single largest fuel over a full year, but its quarterly output hit an all-time low in the December 2025 quarter, down about 5 per cent on the year before. The fleet itself is largely still standing, and most of the closure dates that would retire it fall well after 2030.',
    period: 'Month and quarter to December 2025',
    status: 'sourced',
    sources: ['openelectricity', 'aemo_qed', 'aes_2020'],
  },
  {
    id: 'renewables',
    icon: 'bolt',
    tag: 'Renewables',
    kicker: 'Chapter 02 · NEM generation',
    reference: {
      label: 'Five years ago',
      value: 'About a quarter',
      note: 'Renewables supplied roughly a quarter of Australia\'s electricity generation in 2020, on the wider all-Australia boundary. The 2030 target is 82 per cent of the NEM from renewables.',
    },
    reveal: {
      value: 51, decimals: 0, prefix: '', suffix: '%',
      label: 'renewables share of NEM supply in the December 2025 quarter, including storage, up from 46 per cent a year earlier',
      sub: 'Over the full year 2024 renewables were 38.7 per cent of NEM generation, which the AER rounds to 39 per cent. On the Climate Change Authority\'s national on-grid series, a wider boundary than the NEM, the share first passed 40 per cent during 2025.',
    },
    gap: 'The target is 82 per cent by 2030, and AEMO\'s final 2026 Integrated System Plan does reach it: the least-cost path delivers 82 per cent by 2030. The gap is in the building. Today\'s grid-scale pipeline covers about three-quarters of the new capacity that path needs by 2030, 28.3 GW of about 38 GW, which leaves wind 8.9 GW short on AEMO\'s own table. The Climate Change Authority, working from its own method, puts the wind shortfall at 5.05 GW. Halfway there on a quarterly basis, with the hardest stretch left.',
    period: 'Quarter to December 2025; full year 2024; the 2026 ISP, June 2026',
    status: 'sourced',
    sources: ['openelectricity', 'aer_som', 'aemo_isp26', 'cca_apr25'],
  },
  {
    id: 'ev',
    icon: 'car',
    tag: 'Electric cars',
    kicker: 'Chapter 03 · New-car sales',
    reference: {
      label: 'Five years ago',
      value: 'Under 1%',
      note: 'Battery-electric cars were less than 1 per cent of new-car sales in 2020. A modelled path to net zero has them near 60 per cent of new sales by 2030.',
    },
    reveal: {
      value: 8.3, decimals: 1, prefix: '', suffix: '%',
      label: 'battery-electric share of new-car sales in 2025, with more than 103,000 sold',
      sub: 'Counting plug-in hybrids as well, the electric share was 13.1 per cent in 2025, up from about 9.5 per cent in 2024.',
    },
    gap: 'From under 1 per cent to 8 per cent in five years is a real climb. The 60 per cent by 2030 figure is a recommended trajectory, and there is no binding sales target. At the current pace the country is well short of that line.',
    period: 'Calendar year 2025',
    status: 'sourced',
    sources: ['evc_2025', 'nev_strategy'],
  },
  {
    id: 'build',
    icon: 'chart',
    tag: 'Build rate',
    kicker: 'Chapter 04 · Renewable capacity added',
    reference: {
      label: 'What the target needs',
      value: 'A sustained, higher rate',
      note: 'The 82 per cent target needs new wind and solar built and connected year after year. The pipeline is judged against that sustained run rate.',
    },
    reveal: {
      value: 5.9, decimals: 1, prefix: '', suffix: ' GW',
      label: 'renewable capacity added in 2025, large and small scale combined: 2.6 GW of rooftop solar and 3.3 GW of large-scale generation commissioned',
      sub: 'The rooftop half fell, from 3,167 MW in 2024 to 2,616 MW in 2025, the first year since 2020 under 300,000 installations. The Clean Energy Council reads that as the rooftop peak passing, with household demand moving to batteries. No verified figure exists here for large-scale capacity commissioned in 2024, so the two years are not compared as a whole.',
    },
    gap: 'Not closing the gap, and on the rooftop side it is easing off. AEMO\'s final 2026 Integrated System Plan puts the 2030 requirement at about 38 GW of new grid-scale wind and solar against 28.3 GW in the pipeline, leaving wind 8.9 GW short and renewables as a whole 10.1 GW short. Storage runs the other way, 14.7 GW above what 2030 needs, and AEMO is clear that storage alone cannot substitute for generation. Investment is turning: the Clean Energy Regulator counted about 2.4 GW of final investment decisions in the year to March 2026, above the 2.1 GW for all of 2025. Even sustained, the current rate leaves the 2030 requirement unmet.',
    period: 'Calendar year 2025, rooftop back to 2024; the 2026 ISP, June 2026',
    status: 'derived',
    sources: ['cec_rooftop', 'cer_lgc', 'aemo_isp26'],
  },
  {
    id: 'emissions',
    icon: 'globe',
    tag: 'National emissions',
    kicker: 'Chapter 05 · All sectors',
    reference: {
      label: 'Where the straight line says we should be',
      value: '~34% below',
      note: 'A straight line from the 2005 base year to a 43 per cent cut by 2030 passes through roughly 34 per cent below by 2025. That is the pace the target implies.',
    },
    reveal: {
      value: 24.5, decimals: 1, prefix: '', suffix: '% below',
      label: 'where emissions stood in the year to December 2025, against the June 2005 base year',
      sub: 'Total emissions were 458.9 Mt CO2-e, down 2.1 per cent on the year before, all sectors including land use. Take the land sector out and the same release gives 510.9 Mt, only 3.8 per cent below 2005.',
    },
    gap: 'The target is 43 per cent below 2005 by 2030. At 24.5 per cent below, Australia sits roughly 10 percentage points behind the straight line to that target, with five years to close it. The Climate Change Authority puts the same gap as a rate: emissions fell about 10 Mt in 2025 and have averaged 8 Mt a year over five years, against the 18 Mt a year the 2030 target needs. That is roughly half the required pace. The land sector heavily shapes the headline, which is why the method spells out how it is counted.',
    period: 'Year to December 2025',
    status: 'sourced',
    sources: ['nga_dec25', 'cca_apr25'],
  },
  {
    id: 'rooftop',
    icon: 'house',
    tag: 'Rooftop solar',
    kicker: 'Chapter 06 · Installed base',
    reference: {
      label: 'A decade ago',
      value: 'A niche',
      note: 'Rooftop solar was a fringe of the grid. It is now one of the largest single sources of generating capacity in the country.',
    },
    reveal: {
      value: 28.3, decimals: 1, prefix: '', suffix: ' GW',
      label: 'of rooftop solar installed by the end of 2025, across about 4.3 million homes and small businesses',
      sub: 'On the Clean Energy Council\'s read, rooftop is projected to pass its 2029/30 benchmark by about 1 GW. That benchmark is AEMO\'s 2024 ISP projection of 36.1 GW of distributed solar in the NEM, a modelled capacity requirement.',
    },
    gap: 'Households built this faster than any policy asked them to, and it now carries a real share of daytime demand: rooftop alone was 14.2 per cent of generation in the second half of 2025. It is the only line on this page running ahead of what was modelled for it.',
    period: 'To end of 2025',
    status: 'sourced',
    sources: ['cec_rooftop'],
  },
];

// The clear-eyed close: progress and shortfall in one block, no framing tricks.
export const SUMMARY = {
  tag: 'The honest read',
  kicker: 'Progress and shortfall, together',
  title: ['Moving, and', 'not fast enough'],
  lead: 'Both columns below are true at the same time. Picking one of them is where most coverage of this subject goes wrong.',
  moving: {
    head: 'What is moving',
    items: [
      'Renewables passed half the NEM in the December 2025 quarter, and out-generated coal for a whole month for the first time in September 2025.',
      'Electric cars went from under 1 per cent of new sales to more than 8 per cent in five years.',
      'Rooftop solar reached 28.3 GW across roughly 4.3 million roofs, on course to pass the 36.1 GW AEMO models for 2029/30.',
      'National emissions are 24.5 per cent below 2005 and still falling, down 2.1 per cent in the year to December 2025.',
    ],
  },
  short: {
    head: 'What still falls short',
    items: [
      'AEMO\'s 2026 plan reaches 82 per cent by 2030 only if the build arrives, and on its own table the pipeline is 8.9 GW short on wind and 10.1 GW short on renewables overall.',
      'A path to net zero implies EVs near 60 per cent of new sales by 2030; the country is at 8 per cent with no binding target.',
      'Emissions are falling at about 8 Mt a year against the 18 Mt a year the 43 per cent 2030 goal needs, roughly 10 percentage points behind the straight line.',
      'Almost the whole of that 24.5 per cent is the land sector. Without it, the year to December 2025 is 3.8 per cent below 2005.',
      'Coal is smaller, but it is not gone, and the last stretch of its retirement is the hardest.',
    ],
  },
  close: 'The numbers are moving in the right direction and they are not moving fast enough to hit the stated targets on current settings. Both halves of that sentence come from the figures themselves, which is why every one of them carries its source. Come back next quarter; if the date at the top has not moved, this page has fallen behind the data and should be read that way.',
};

// In-page basis of preparation, in the footprint method style.
export const METHOD = {
  tag: 'Basis of preparation',
  title: ['How this tracker', 'is built'],
  sourcesTitle: 'Sources in full',
  sub: 'Every number above, where it comes from, how the gaps are worked out, and what the figures leave out. A claim here that is not backed by a cited release is described in words.',
  blocks: [
    {
      icon: 'list',
      title: 'Sources',
      paras: [
        'Grid mix: OpenElectricity (OpenNEM) and AEMO Quarterly Energy Dynamics for the December 2025 quarter, both built on AEMO NEM dispatch data. Renewable and fossil shares by year cross-checked against the AER State of the Energy Market 2025, whose headline data period is calendar 2024.',
        'Electric vehicles: the Electric Vehicle Council\'s reporting of FCAI VFACTS new-car sales for calendar 2025.',
        'Renewable build: the Clean Energy Council\'s Rooftop solar and storage report for July to December 2025 for both halves of the 2025 build, with the Clean Energy Regulator\'s March quarter 2026 carbon market report for investment decisions and the scheme pipeline.',
        'National emissions: the DCCEEW National Greenhouse Gas Inventory Quarterly Update for the December quarter 2025, published 2026, read from Data Table 1A of its data-sources workbook.',
        'Targets and trajectories: the 82 per cent renewables and 43 per cent emissions goals are Australian Government targets, and the EV trajectory is a modelled recommendation. The shortfall figures come from two separate bodies and are named as theirs: AEMO\'s final 2026 Integrated System Plan, Version 1.0, released 25 June 2026, and the Climate Change Authority\'s 2025 Annual Progress Report. They are different measures on different methods, so they are never merged or added together.',
      ],
    },
    {
      icon: 'bolt',
      title: 'What "share of the NEM" means',
      paras: [
        'The grid figures are generation share of the National Electricity Market, the interconnected system down the east coast and across South Australia and Tasmania. They measure electricity generated. Installed capacity and energy consumed are different quantities.',
        'The NEM is not all of Australia. Western Australia (the SWIS) and the Northern Territory run separate grids and are outside these numbers. That matters, because the national picture is a little more fossil-heavy than the NEM alone. Where a five-years-ago figure could only be found on the wider all-Australia boundary, it is labelled as such.',
      ],
    },
    {
      icon: 'target',
      title: 'How the gaps are worked out',
      paras: [
        'Emissions straight line: the 43 per cent target runs from the June 2005 base year to 2030. A straight line between those two points passes through about 34 per cent below by 2025 (43 per cent spread evenly across 25 years reaches roughly 34 per cent by year 20). The year to December 2025 sat 24.5 per cent below, so the gap to the straight line is roughly 10 percentage points. The real pathway is not a straight line, but the straight line is the simplest honest yardstick and it is stated as an approximation.',
        'A second yardstick sits beside it, and it is the better sourced of the two. The Climate Change Authority states the rates outright: about 10 Mt cut in 2025, an 8 Mt a year average over the five years to 2025, against the 18 Mt a year needed to reach the 2030 target. Australia is cutting at roughly half the required pace.',
        'Renewables gap: AEMO\'s final 2026 Integrated System Plan, released 25 June 2026, projects that its optimal development path reaches the 82 per cent target by 2030. Table 6 of that plan sets existing plus pipeline capacity against what 2030 needs: solar 1.1 GW short, wind 8.9 GW short, renewables 10.1 GW short in total, with batteries 14.2 GW and total storage 14.7 GW in surplus. The pipeline column is applications received discounted by 10 per cent, because historically about one project in ten applies and does not proceed. Separately, and on its own method, the Climate Change Authority\'s 2025 Annual Progress Report puts the wind shortfall against the same target at 5.05 GW. Two bodies, two measures, cited as theirs and kept apart. An earlier version of this page merged them under the Authority\'s name, and read the plan\'s three-quarters of required new capacity as a three-quarters renewable share by 2030. Both were wrong, and both are corrected here.',
        'Build rate: the 5.9 GW for 2025 is worked out here by adding the two figures the Clean Energy Council reports on the same page, 2.6 GW of rooftop solar installed and 3.3 GW of large-scale generation commissioned. No source states the combined total, which is why that chapter is flagged as derived. An earlier figure of about 7 GW is withdrawn: nothing published supports it for 2025, and the nearest number to it is the Clean Energy Regulator\'s 6.5 to 8.2 GW projection for 2026, which is a forecast of a different year.',
        'EV gap: 8.3 per cent battery-electric today against a modelled path near 60 per cent of new sales by 2030. That 60 per cent is a recommendation for reaching net zero, and is labelled that way every time it appears.',
      ],
    },
    {
      icon: 'globe',
      title: 'The land sector, stated plainly',
      paras: [
        'The emissions figure above includes LULUCF: land use, land-use change and forestry. Including the land sector, the year to December 2025 was 24.5 per cent below the year to June 2005, 458.9 Mt CO2-e against 607.7 Mt.',
        'Without the land sector the picture is far worse, and it is now stated as a figure. Excluding LULUCF, the year to December 2025 was 510.9 Mt CO2-e against 530.9 Mt in the base year: 3.8 per cent below, and down 1.9 per cent on the year. The whole of the difference is the land sector itself, which moved from a net source of 76.8 Mt in the base year to a net sink of 52.0 Mt now, a swing of 128.8 Mt.',
        'Both figures are worked out here from Data Table 1A of the December quarter 2025 update, which publishes quarterly sector totals. The without-land totals cross-check against the same workbook\'s Figure 3 and Figure 5. The land sector also swings the headline from quarter to quarter as estimates are revised, which is why both numbers are shown.',
        'Which release a "per cent below 2005" comes from matters as well. On this national inventory the year to December 2025 is 24.5 per cent below. The Climate Change Authority\'s 2025 Annual Progress Report puts calendar 2025 at 437.5 Mt against a 611.9 Mt 2005 baseline, which is 28.5 per cent below. Both are net of land; the difference is release vintage and baseline convention. Every percentage on this page names its release for that reason, and the chapter above uses the inventory.',
      ],
    },
    {
      icon: 'clock',
      title: 'Freshness and cadence',
      paras: [
        'Each metric carries the period it covers, so a reader can see at a glance how fresh it is. Quarterly grid and inventory data lag real time by a few months by nature; annual figures lag more.',
        'The tracker is reviewed quarterly, when the national inventory and the market data refresh. The last-updated date sits at the top and the bottom of the page, drawn from a single field, so it cannot silently drift. If the date is old, treat the numbers as old.',
        'Currency behind this update, metric by metric: the grid mix and the national inventory both run to December 2025, the AER annual series to calendar 2024, rooftop solar to December 2025, and the Clean Energy Regulator market data to March 2026. The newest release read for it is AEMO\'s 2026 Integrated System Plan of 25 June 2026.',
      ],
    },
    {
      icon: 'book',
      title: 'What this is not',
      paras: [
        'This is not a forecast and not a model. It is a reading of published figures, lined up against stated targets, with the gap shown. It does not predict whether the targets will be met.',
        'The live grid snapshot, when it loads, is a separate real-time reading of the NEM fuel mix and is never blended into the annual figures. If it fails to load, the page shows nothing live and the dated figures stand on their own.',
      ],
    },
  ],
};

export const FOOT = {
  name: 'Chris Wang · 2026',
  back: 'Back to profile',
};
