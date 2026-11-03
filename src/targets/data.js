// The Target Tracker (/targets/). Every word and every number on the page
// lives here, not in the components. Australian English, no em dashes, plain
// and dry: the page's job is to put a company's claimed line next to its
// reported emissions and let the distance between the two speak.
//
// DATA HONESTY. Each company carries its own sources with access dates, its
// own verification date, and a status:
//   'sourced'    every figure read from a company report or an equivalent
//                published disclosure
//   'partial'    the commitment is sourced but the emissions series has gaps,
//                or part of it is read from a chart label rather than a table
//   'unverified' the commitment is sourced and the emissions series could not
//                be verified, so `reported` is empty and no chart is drawn
// A year that could not be verified is omitted. Nothing is interpolated into
// a reported series, and no claimed line is drawn for a company that has not
// stated an absolute path.

export const META = {
  navLabel: 'Targets',
  // Single source of truth for the last-updated stamp, rendered top and bottom.
  updated: '13 August 2026',
  cadence: 'Reviewed twice a year, after the annual reporting season and again when the Clean Energy Regulator publishes its NGER data. Each company also carries its own verified date, because reports land at different times. If the dates are old, treat the numbers as old.',
  // The vertical rule drawn on every chart.
  nowYear: 2026,
};

export const INTRO = {
  tag: 'The tracker',
  kicker: 'ASX50 · corporate net zero',
  title: ['Fifty promises,', 'one ledger'],
  sub: 'A target year is easy to announce and hard to check. This page does the checking. For each company in the S&P/ASX 50 it draws the trajectory the company itself has claimed, from its stated base year through its interim targets to its net zero date, and then plots the Scope 1 and 2 emissions it has reported on top of it.',
  read: 'Every card reads the same way. The dashed line is what the company said it would do. The solid line is what it has reported. The sentence underneath states the distance between them in the latest reported year, with no adjective attached.',
  scroll: 'Scroll',
};

// How to read a chart, rendered next to a tiny static demo.
export const READING = {
  tag: 'How to read it',
  title: ['Three marks,', 'nothing else'],
  lead: 'The charts carry no axes and no gridlines on purpose. There are only three things on them, and each one means exactly one thing.',
  items: [
    {
      key: 'claimed',
      label: 'Dashed line',
      body: 'The claimed path. It runs from the company\'s stated base year and baseline, through any absolute interim target, down to zero in its net zero year. It is drawn straight between those points because those points are all the company has committed to. Nobody expects the real path to be straight.',
    },
    {
      key: 'reported',
      label: 'Solid line with dots',
      body: 'Reported Scope 1 and 2 emissions, one dot per reporting year, taken from the company\'s own disclosures. Years that could not be verified are left out, so a gap in the line is a gap in the record.',
    },
    {
      key: 'now',
      label: 'Vertical rule',
      body: 'The present year. Everything to the left of it is history and everything to the right of it is a claim. Most of these lines are still almost entirely claim.',
    },
  ],
  note: 'Where a company has set only an intensity target, there is no absolute path to draw and the chart shows the reported line alone.',
};

// Verification status for a company's numbers.
export const STATUS = {
  sourced: 'Sourced figures',
  partial: 'Partial series',
  unverified: 'Series unverified',
};

// How the latest reported year reads against the claimed line.
export const TRACK = {
  ahead: 'Ahead of its line',
  on: 'On its line',
  behind: 'Behind its line',
  na: 'Not assessable',
};

// Every other label, chip and piece of interface text on the page.
export const UI = {
  unit: 'Mt',
  score: {
    tag: 'The scoreboard',
    title: ['What the fifty', 'have promised'],
    lead: 'Four counts, taken across every company on this page. Each company counts once, whatever its size, so this is a count of commitments and not a measure of tonnes.',
    items: [
      { key: 'netZero', label: 'have committed to a dated net zero year' },
      { key: 'interim', label: 'back it with an absolute tonnage target for the 2030 era' },
      { key: 'assessable', label: 'publish enough verified data to be checked against their own claimed line' },
      { key: 'behind', label: 'of the companies that can be checked are behind their own line' },
    ],
    note: 'A company can only be checked when it has stated an absolute path and a verified emissions year beyond its base year exists to hold against it. Most of the fifty fail that test before any judgement about performance starts.',
  },
  ledger: {
    tag: 'The ledger',
    kicker: 'Company by company',
    title: ['The claimed line', 'and the record'],
    lead: 'Filter by sector, sort by how far the reported line sits from the claimed one, and read each company on its own terms. The status at the foot of every card says how much of it is sourced.',
    sectorLabel: 'Filter by sector',
    sectorAll: 'All sectors',
    sortLabel: 'Sort the ledger',
    sorts: [
      { id: 'name', label: 'Company name' },
      { id: 'year', label: 'Net zero year, soonest first' },
      { id: 'gapWorst', label: 'Gap, furthest behind first' },
      { id: 'gapBest', label: 'Gap, furthest ahead first' },
    ],
    trackLabel: 'Filter by tracking status',
    trackAll: 'All',
    countOne: 'company shown',
    countMany: 'companies shown',
    // The ledger opens on a preview; filters and sorts always run over all fifty.
    countPart: '{shown} of {n} companies shown',
    showAll: 'Show all {n}',
    showFewer: 'Show fewer',
    empty: 'No companies match those filters. Clear one of them to see the ledger again.',
  },
  card: {
    targetPrefix: 'Net zero by',
    noTarget: 'No net zero target',
    scopesLabel: 'Covers',
    baseLabel: 'Base year',
    interimLabel: 'Interim',
    scope3Label: 'Scope 3',
    boundaryLabel: 'Boundary',
    verified: 'Verified',
    sourceOne: 'source',
    sourceMany: 'sources',
    methodLink: 'Basis of preparation',
    unverifiedChart: 'The emissions series for this company could not be verified, so no line is drawn',
    noAbsolutePath: 'No absolute path to draw',
    interimAbsolute: 'absolute',
    interimIntensity: 'intensity',
    vsLabel: 'vs',
  },
  gap: {
    reported: 'reported against',
    claimed: 'on the claimed line',
    above: 'per cent above the line',
    below: 'per cent below the line',
    onLine: 'inside the five per cent band either side of the line',
    zeroLine: 'the claimed line has reached zero by this year',
    noLine: 'No absolute path has been stated, so there is no line to measure against',
    noData: 'No verified emissions series, so there is nothing to measure',
  },
  flags: {
    offsets: 'Leans on offsets',
    intensity: 'Intensity target',
    aspirational: 'Aspirational wording',
    weakened: 'Target weakened',
    'sbti-validated': 'SBTi validated',
    'exited-sbti': 'Exited SBTi',
    'exited-alliance': 'Left a climate alliance',
  },
  method: {
    commonHead: 'Sources used across the page',
    perCompanyHead: 'Sources by company',
    perCompanyCount: '{n} sources across {c} companies',
    showAllSources: 'Show sources for all {n} companies',
    showFewerSources: 'Show fewer',
  },
};

// Units are Mt CO2e, Scope 1 and 2, on the company's own reporting basis.
// Every figure is read from a published disclosure and carries the source and
// page it came from; a year that could not be read stays out of `reported`.
export const COMPANIES = [
  {
    id: 'bhp',
    name: 'BHP',
    ticker: 'BHP',
    sector: 'Materials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Scope 1 and 2 (operational GHG emissions from operated assets)',
      baseYear: 2020,
      interim: [
        {
          year: 2030,
          cutPct: 30,
          vsBaseYear: 2020,
          absolute: true,
          note: 'at least 30% below the FY2020 baseline; BHP states it has not used carbon credits or offsetting in assessing progress against this target'
        }
      ],
      scope3: 'BHP holds a net zero Scope 3 goal for 2050 that it words as a goal rather than a target, alongside 2030 goals for steelmaking and maritime transport emissions intensity, so its largest emissions category carries no absolute reduction target.',
      flags: []
    },
    baseline: { year: 2020, mt: 13.6 },
    reported: [
      { y: 2020, mt: 13.6 },
      { y: 2023, mt: 9.9 },
      { y: 2024, mt: 9.2 },
      { y: 2025, mt: 8.7 }
    ],
    boundaryNote: "The FY2020 baseline of 13.6 Mt is BHP's restated figure, adjusted for the divestment of Petroleum and BMC, the sale of Blackwater and Daunia, the acquisition of OZ Minerals and methodology changes; as-reported FY2021 (16.2 Mt) and FY2022 (12.2 Mt) still include the Petroleum business and are omitted here because they sit on a different boundary.",
    status: 'sourced',
    verified: '27 July 2026',
    sources: [
      {
        name: 'BHP Operational GHG emissions (Scopes 1 and 2 from operated assets)',
        url: 'https://www.bhp.com/sustainability/climate-change/operational-ghg-emissions',
        accessed: '27 July 2026'
      },
      {
        name: 'BHP GHG Emissions Calculation Methodology 2025',
        url: 'https://www.bhp.com/-/media/documents/investors/annual-reports/2025/250819_bhpghgemissionscalculationmethodology2025.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'BHP Group Ltd Form 6-K FY2025',
        url: 'https://www.sec.gov/Archives/edgar/data/811809/000119312525183071/d35528d6k.htm',
        accessed: '27 July 2026'
      }
    ],
    note: 'FY2025 operational emissions of 8.7 Mt are 36% below the restated FY2020 baseline, ahead of the at least 30% by FY2030 target, with the FY2025 fall driven largely by the temporary suspension of Western Australia Nickel and power purchase agreements.'
  },
  {
    id: 'rio',
    name: 'Rio Tinto',
    ticker: 'RIO',
    sector: 'Materials',
    yearBasis: 'CY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Net Scope 1 and 2 (equity basis)',
      baseYear: 2018,
      interim: [
        {
          year: 2025,
          cutPct: 15,
          vsBaseYear: 2018,
          absolute: true,
          note: '15% reduction in net Scope 1 and 2 by 2025, brought forward five years in 2021'
        },
        {
          year: 2030,
          cutPct: 50,
          vsBaseYear: 2018,
          absolute: true,
          note: '50% reduction in net Scope 1 and 2 by 2030, supported by around US$7.5 billion of decarbonisation investment'
        }
      ],
      scope3: 'Rio Tinto sets no absolute Scope 3 reduction target and has publicly resisted doing so, working instead through customer partnerships toward a 2050 net zero ambition.',
      flags: [ 'offsets' ]
    },
    baseline: { year: 2018, mt: 32.6 },
    reported: [
      { y: 2018, mt: 32.6 },
      { y: 2022, mt: 32.7 },
      { y: 2023, mt: 32.6 },
      { y: 2025, mt: 31.5 }
    ],
    boundaryNote: "Emissions are equity basis, matching Rio Tinto's ownership share of production; the company reports against a restated and adjusted 2018 baseline (34.5 Mt in its 2023 reporting) rather than the 32.6 Mt originally published, which is why its stated percentage reductions do not reconcile against the 32.6 Mt figure.",
    status: 'partial',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Rio Tinto Climate Change Report',
        url: 'https://www.riotinto.com/invest/reports/climate-change-report',
        accessed: '27 July 2026'
      },
      {
        name: 'Rio Tinto Decarbonisation progress',
        url: 'https://www.riotinto.com/en/sustainability/climate-change/decarbonisation-progress',
        accessed: '27 July 2026'
      },
      {
        name: 'Rio Tinto PLC Form 20-F FY2024',
        url: 'https://www.sec.gov/Archives/edgar/data/0000863064/000162828025006642/rio-20241231.htm',
        accessed: '27 July 2026'
      }
    ],
    note: 'Gross adjusted Scope 1 and 2 emissions of 31.5 Mt in 2025 sit 14% below the adjusted 2018 baseline, and 17% below once high-integrity offsets are applied, against a 50% target for 2030; the 2024 figure was 0.2 Mt higher than 2025 but is omitted here because no absolute value was corroborated.'
  },
  {
    id: 'fmg',
    name: 'Fortescue',
    ticker: 'FMG',
    sector: 'Materials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2030,
      scopes: 'Scope 1 and 2 (Australian terrestrial iron ore operations), described as Real Zero because it excludes voluntary carbon offsets and carbon capture and storage',
      baseYear: 2021,
      interim: [
        {
          year: 2030,
          cutPct: 100,
          vsBaseYear: 2021,
          absolute: true,
          note: 'Real Zero: eliminate Scope 1 and 2 emissions from Australian terrestrial iron ore operations by the end of 2030, with no offsets and no CCS'
        },
        {
          year: 2030,
          cutPct: 50,
          vsBaseYear: 2021,
          absolute: false,
          note: '50% reduction in emissions intensity from the shipping of iron ore, from FY21 levels; shipping sits in Scope 1 and Scope 3'
        }
      ],
      scope3: 'Fortescue targets Net Zero Scope 3 by 2040 and, by 2030, a 7.5% reduction in customer steelmaking emissions intensity from FY21 levels, making Scope 3 an enablement target rather than an absolute cut.',
      flags: [ 'exited-sbti' ]
    },
    baseline: null,
    reported: [ { y: 2025, mt: 3.02 } ],
    boundaryNote: 'The Real Zero target covers Australian terrestrial iron ore operations, while the reported Scope 1 and 2 total covers the wider group including shipping and energy businesses, so the reported series is broader than the target boundary.',
    status: 'partial',
    verified: '13 August 2026',
    sources: [
      {
        name: 'Fortescue FY25 Climate Transition Plan, Metrics and Targets',
        url: 'https://fy25ctp.fortescue.com/en/metrics-and-targets',
        accessed: '27 July 2026'
      },
      {
        name: 'Fortescue FY25 Sustainability Report, Climate',
        url: 'https://fy25sustainability.fortescue.com/en/climate',
        accessed: '27 July 2026'
      },
      {
        name: 'Fortescue What is Real Zero',
        url: 'https://www.fortescue.com/en/real-zero',
        accessed: '27 July 2026'
      }
    ],
    note: "Fortescue reported Scope 1 and 2 emissions of 3.02 Mt CO2e in FY2025 and says renewable energy projects offset 11% of Scope 1 and 2 emissions that year, with the remainder due to be eliminated by the end of 2030; the FY2021 baseline value could not be corroborated. The SBTi register, at its 6 August 2026 export, records Fortescue's near-term and net zero commitments as removed for expiry, on a register record last updated 20 October 2022, so the most ambitious dated target on this page carries no external validation."
  },
  {
    id: 's32',
    name: 'South32',
    ticker: 'S32',
    sector: 'Materials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Net operational emissions (Scope 1 and 2)',
      baseYear: 2021,
      interim: [
        {
          year: 2035,
          cutPct: 50,
          vsBaseYear: 2021,
          absolute: true,
          note: 'halve net operational Scope 1 and 2 emissions by FY35 relative to FY21; the target is stated on a net basis, so offsets can contribute'
        }
      ],
      scope3: 'South32 expanded its 2050 net zero goal to include Scope 3 in its 2025 Climate Change Action Plan but sets no interim Scope 3 reduction target.',
      flags: [ 'offsets' ]
    },
    baseline: null,
    reported: [ { y: 2023, mt: 21 }, { y: 2025, mt: 20.7 } ],
    boundaryNote: 'Reported figures are group Scope 1 and 2 and are dominated by Scope 2 at the Hillside and Mozal aluminium smelters; the FY2023 and FY2025 values come from third-party compilations of South32 reporting rather than a directly quoted company table, and the FY21 baseline value could not be corroborated.',
    status: 'partial',
    verified: '27 July 2026',
    sources: [
      {
        name: 'South32 Climate Change Action Plan 2025',
        url: 'https://www.south32.net/docs/default-source/annual-reporting-suite/2025/climate-change-action-plan-2025.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'South32 Climate Change Action Plan 2025 briefing presentation',
        url: 'https://www.south32.net/docs/default-source/all-financial-results/all-financial-results-reports-and-presentations/climate-change-action-plan-2025-briefing-presentation.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'ACCR, South32 sets new target, but has more to do',
        url: 'https://www.accr.org.au/news/south32-sets-new-target-but-has-more-to-do/',
        accessed: '27 July 2026'
      }
    ],
    note: 'South32 states its reported operational GHG emissions are 2% below the FY21 baseline, against a target to halve them by FY35, with the largest reductions still dependent on securing low-carbon energy for Hillside Aluminium.'
  },
  {
    id: 'wds',
    name: 'Woodside Energy',
    ticker: 'WDS',
    sector: 'Energy',
    yearBasis: 'CY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Net equity Scope 1 and 2 (gross equity emissions less retired carbon credits)',
      baseYear: 2020,
      interim: [
        {
          year: 2025,
          cutPct: 15,
          vsBaseYear: 2020,
          absolute: true,
          note: '15% below the starting base of 6.32 Mt CO2e, which is the 2016-2020 gross annual average equity Scope 1 and 2 emissions, not a single-year 2020 figure'
        },
        {
          year: 2030,
          cutPct: 30,
          vsBaseYear: 2020,
          absolute: true,
          note: '30% below the same 6.32 Mt starting base, measured on a net equity basis'
        }
      ],
      scope3: 'Woodside sets no Scope 3 emissions reduction target, instead pointing to investment targets in new energy products and lower-carbon services; its 2050 net zero position is worded as an aspiration.',
      flags: [ 'offsets', 'aspirational' ]
    },
    baseline: { year: 2020, mt: 6.32 },
    reported: [ { y: 2023, mt: 5.53 }, { y: 2024, mt: 5.44 }, { y: 2025, mt: 5.33 } ],
    boundaryNote: "The series is net equity Scope 1 and 2, which is Woodside's equity share of gross emissions less retired carbon credits, matching the target boundary; on a gross equity basis the same years were about 6.19 Mt (2023), 6.78 Mt (2024) and 6.62 Mt (2025), so gross emissions have not fallen below the 6.32 Mt starting base.",
    status: 'sourced',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Woodside Scope 1 and 2 GHG emissions',
        url: 'https://www.woodside.com/sustainability/environment/climate/Scope-1-and-2-ghg-emissions',
        accessed: '27 July 2026'
      },
      {
        name: 'Woodside Energy Annual Report 2025',
        url: 'https://www.woodside.com/docs/default-source/investor-documents/major-reports-(static-pdfs)/2025-annual-report/annual-report-2025.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Woodside Climate Transition Action Plan and 2023 Progress Report',
        url: 'https://www.woodside.com/docs/default-source/investor-documents/major-reports-(static-pdfs)/ctap2023/climate-transition-action-plan-and-2023-progress-report.pdf',
        accessed: '27 July 2026'
      }
    ],
    note: 'Woodside met its 2025 target of a 15% reduction, reporting net equity Scope 1 and 2 emissions of 5.33 Mt, after retiring 1.283 Mt of carbon credits; gross equity emissions over the same period rose from 6.19 Mt in 2023 to about 6.62 Mt in 2025, so the reduction against the 6.32 Mt starting base is delivered by credits rather than by lower gross emissions.'
  },
  {
    id: 'sto',
    name: 'Santos',
    ticker: 'STO',
    sector: 'Energy',
    yearBasis: 'CY',
    commitment: {
      netZeroYear: 2040,
      scopes: 'Net equity share Scope 1 emissions by 2040; Scope 2 net zero has been moved out to 2050',
      baseYear: 2020,
      interim: [
        {
          year: 2030,
          cutPct: 30,
          vsBaseYear: 2020,
          absolute: true,
          note: 'reduce equity Scope 1 and 2 emissions to 4.1 Mt CO2e or lower by 2030 from the combined Santos and Oil Search 2019-20 baseline of 5.9 Mt; Santos states the target was reached in 2025'
        }
      ],
      scope3: 'Santos sets no absolute Scope 3 reduction target; it commits to building a carbon storage business handling around 14 Mtpa of third-party CO2e by 2040 and to helping customers cut more than 1 Mtpa by 2030 through fuel switching.',
      flags: [ 'offsets', 'weakened' ]
    },
    baseline: { year: 2020, mt: 5.9 },
    reported: [
      { y: 2020, mt: 5.9 },
      { y: 2025, mt: 3.41 }
    ],
    boundaryNote: "Targets and reporting are equity share, covering Santos's ownership percentage of each asset rather than emissions from assets it operates, and the baseline combines Santos with Oil Search following the 2021 merger. Both points are net, after Moomba carbon capture and storage and offsets: the 2025 Climate Strategy Update publishes no gross figure and no Scope 1 versus Scope 2 split. Only the 2019-20 baseline and 2025 carry data labels on the chart, so the years between them are not recorded here.",
    status: 'partial',
    verified: '13 August 2026',
    sources: [
      {
        name: 'Santos Climate Transition Action Plan',
        url: 'https://www.santos.com/sustainability/ctap/',
        accessed: '27 July 2026'
      },
      {
        name: 'Santos Climate Strategy Update 2025 (Climate-Strategy-Update-2025.pdf), targets and footnotes p4, net emissions chart and Moomba CCS p5',
        url: 'https://www.santos.com/sustainability/ctap/',
        accessed: '13 August 2026'
      },
      {
        name: 'Carbon Pulse, Santos pushes part of net zero target back by a decade',
        url: 'https://carbon-pulse.com/370466/',
        accessed: '27 July 2026'
      }
    ],
    note: 'Net equity share Scope 1 and 2 of 3.41 Mt CO2e in 2025 is 42% below the 5.9 Mt baseline, so Santos passed its 2030 target of 4.1 Mt or lower five years early. The target is explicitly a net one and the result leans on Moomba carbon capture and storage, which stored 1.23 Mt CO2e in 2025, while Santos states its unabated emissions will rise with Barossa, Pikka phase 1 and potential future projects. Santos also moved its Scope 2 net zero date from 2040 to 2050, keeping 2040 only for its net equity share of Scope 1.'
  },
  {
    id: 'org',
    name: 'Origin Energy',
    ticker: 'ORG',
    sector: 'Utilities',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'The 2030 medium-term target covers Scope 1, 2 and 3 equity emissions combined; the 2050 net zero ambition covers Scope 1, 2 and 3',
      baseYear: 2019,
      interim: [
        {
          year: 2030,
          cutPct: 38,
          vsBaseYear: 2019,
          absolute: true,
          note: 'expressed by Origin as a 20 Mt CO2e absolute reduction in Scope 1, 2 and 3 equity emissions from the FY2019 baseline of 53 Mt, taking the group to 33 Mt; the percentage shown is derived from those two figures'
        },
        {
          year: 2030,
          cutPct: 40,
          vsBaseYear: 2019,
          absolute: false,
          note: '40% reduction in emissions intensity by 2030'
        },
        {
          year: 2032,
          cutPct: 50,
          vsBaseYear: 2017,
          absolute: true,
          note: 'SBTi-validated 50% reduction in Scope 1 and 2 emissions by 2032 from a 2017 baseline; Origin was the first Australian company to have a target endorsed by SBTi'
        }
      ],
      scope3: 'Scope 3 sits inside the headline 20 Mt reduction target and the 2050 net zero ambition, and Origin also holds an SBTi-validated 25% Scope 3 reduction by 2032 from a 2017 baseline.',
      flags: [ 'sbti-validated' ]
    },
    baseline: { year: 2019, mt: 53 },
    reported: [ { y: 2019, mt: 53 }, { y: 2025, mt: 45 } ],
    boundaryNote: "The baseline and series here are Scope 1, 2 and 3 equity emissions combined, because that is the boundary of Origin's headline 2030 target; a Scope 1 and 2 only series could not be corroborated, though Eraring's Scope 1 emissions alone were 13.5 Mt CO2e in the year to 30 June 2025.",
    status: 'partial',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Origin Energy 2025 Climate Transition Action Plan',
        url: 'https://www.originenergy.com.au/wp-content/uploads/242/Origin_2025_Climate_Transition_Action_Plan.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Origin Energy 2025 Sustainability Report',
        url: 'https://www.originenergy.com.au/wp-content/uploads/45/Origin_2025_Sustainability_Report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: "Argus Media, Australia's Origin leaves emissions plan unchanged",
        url: 'https://www.argusmedia.com/en/news-and-insights/latest-market-news/2720982-australia-s-origin-leaves-emissions-plan-unchanged',
        accessed: '27 July 2026'
      },
      {
        name: 'SBTi case study, Origin Energy',
        url: 'https://sciencebasedtargets.org/companies-taking-action/case-studies/origin-energy',
        accessed: '27 July 2026'
      }
    ],
    note: 'Origin cut 8 Mt CO2e, or 15%, against its FY2019 baseline of 53 Mt by FY2025, leaving a further 12 Mt to cut by 2030 to meet its 20 Mt target, with the Eraring coal station now scheduled to run to April 2029.'
  },
  {
    id: 'apa',
    name: 'APA Group',
    ticker: 'APA',
    sector: 'Utilities',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Net zero operational (Scope 1 and 2) emissions by 2050; the 2030 interim target covers the gas infrastructure portfolio only',
      baseYear: 2021,
      interim: [
        {
          year: 2030,
          cutPct: 30,
          vsBaseYear: 2021,
          absolute: true,
          note: '30% reduction in gas infrastructure operational emissions from the FY21 base year of 553,512 tCO2e on the adjusted net basis, giving an FY2030 target level of about 387 kt CO2e; first set in the 2022 Climate Transition Plan and reconfirmed in the 2025 Climate Transition Plan, which benchmarks it to well below 2 degrees rather than 1.5. APA also holds a power generation emissions intensity target of 0.25 t CO2e per MWh by 2030, at 0.34 in FY2025'
        }
      ],
      scope3: 'APA reports Scope 3 emissions but sets no Scope 3 reduction target; its net zero commitment is operational only, which excludes the emissions from the gas it transports.',
      flags: [ 'offsets' ]
    },
    baseline: { year: 2021, mt: 0.553512 },
    reported: [
      { y: 2021, mt: 0.553512 },
      { y: 2022, mt: 0.535388 },
      { y: 2023, mt: 0.516474 },
      { y: 2024, mt: 0.498327 },
      { y: 2025, mt: 0.479710 }
    ],
    boundaryNote: 'The series plotted is the gas infrastructure portfolio on APA\'s adjusted net basis, because that is the boundary the 30% by 2030 target is written on. Adjusted restates the earlier years onto the current portfolio, and net is after offsets surrendered and after adding back Australian Carbon Credit Units issued by APA\'s own projects, which is why its FY2025 net group figure exceeds its gross one. This is not the group total: whole of group Scope 1 and 2 on the market method was 2.00 Mt in FY2025 against 2.18 Mt in FY2021 on the same adjusted basis, roughly four times the segment and 8% lower over four years. The 2050 net zero commitment covers total operational Scope 1 and 2, so the claimed line falls to zero on a wider boundary than the series drawn beneath it.',
    status: 'sourced',
    verified: '13 August 2026',
    sources: [
      {
        name: 'APA 2025 Climate Transition Plan (2025_climate_transition_plan.pdf), gas infrastructure emissions chart and 2030 target p13, goals table p14',
        url: 'https://www.apa.com.au/news/asx-and-media-releases/apa-releases-2025-climate-transition-plan',
        accessed: '13 August 2026'
      },
      {
        name: 'APA FY25 Sustainability Data Book (250820_sustainability_report_data_book_fy25.pdf), gas infrastructure emissions p42, group total emissions p43',
        url: 'https://www.apa.com.au/sustainability/climate',
        accessed: '13 August 2026'
      },
      {
        name: 'APA Group Climate',
        url: 'https://www.apa.com.au/sustainability/climate',
        accessed: '27 July 2026'
      },
      {
        name: 'APA Releases 2024 Climate Report',
        url: 'https://admin.apa.com.au/media/iqlpv4ks/240920_asx_release_apa_releases_2024_climate_report.pdf',
        accessed: '27 July 2026'
      }
    ],
    note: 'This card plots gas infrastructure emissions on the adjusted net basis, the one the 2030 target is set on: 553,512 tCO2e in FY2021 falling to 479,710 in FY2025, a 13.3% cut against a 30% cut by 2030, with the FY2030 target level at about 387 kt CO2e. On a gross basis the same segment fell 6.5%. The 2025 Climate Transition Plan realigned the long term goal so that net zero by 2050 now covers total operational Scope 1 and 2 rather than the gas infrastructure segment alone, after securityholders pressed for an absolute goal covering power generation.'
  },
  {
    id: 'qan',
    name: 'Qantas',
    ticker: 'QAN',
    sector: 'Industrials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Net Scope 1 and 2 emissions',
      baseYear: 2019,
      interim: [
        {
          year: 2030,
          cutPct: 25,
          vsBaseYear: 2019,
          absolute: true,
          note: '25% reduction in net Scope 1 and 2 emissions from FY2019 levels; net means after carbon credits, which Qantas says will have an ongoing role'
        }
      ],
      scope3: 'Qantas reports Scope 3 emissions but sets no absolute Scope 3 reduction target; its 2030 and 2050 commitments cover Scope 1 and 2.',
      flags: [ 'offsets' ]
    },
    baseline: { year: 2019, mt: 12.49 },
    reported: [ { y: 2019, mt: 12.49 }, { y: 2025, mt: 12.16 } ],
    boundaryNote: 'The FY2025 figure is gross Scope 1 and 2 (Scope 1 of about 12.10 Mt plus Scope 2 of about 0.06 Mt) taken from third-party compilations of Qantas reporting, whereas the target is expressed on a net basis after carbon credits, so the two are not directly comparable.',
    status: 'partial',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Qantas Group Sustainability Report FY25',
        url: 'https://investor.qantas.com/FormBuilder/_Resource/_module/doLLG5ufYkCyEPjF1tpgyw/file/annual-reports/QAN_2025_Sustainability_Report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Qantas Group, Managing climate risk',
        url: 'https://www.qantas.com/au/en/qantas-group/sustainability/our-planet/managing-climate-risk.html',
        accessed: '27 July 2026'
      },
      {
        name: 'Qantas newsroom, Qantas zeros in on emissions with interim target',
        url: 'https://www.qantasnewsroom.com.au/media-releases/qantas-zeros-in-on-emissions-with-interim-target',
        accessed: '27 July 2026'
      }
    ],
    note: 'Gross Scope 1 and 2 emissions of about 12.16 Mt in FY2025 sit close to the FY2019 baseline of 12.49 Mt as flying volumes returned, against a 25% net reduction target for 2030 that also depends on a 10% sustainable aviation fuel share and about 1.5% a year of fuel efficiency gains.'
  },
  {
    id: 'bxb',
    name: 'Brambles',
    ticker: 'BXB',
    sector: 'Industrials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2040,
      scopes: 'Scope 1 and 2 for the 2030 interim target; the 2040 net zero commitment covers 100% of Scope 1, 2 and relevant Scope 3',
      baseYear: 2020,
      interim: [
        {
          year: 2030,
          cutPct: 42,
          vsBaseYear: 2020,
          absolute: true,
          note: '42% reduction in absolute Scope 1 and 2 emissions on FY2020 levels, validated by the Science Based Targets initiative'
        }
      ],
      scope3: 'Brambles holds an SBTi-validated 17% absolute Scope 3 reduction target for 2030 from FY2020, which matters because Scope 3 makes up the large majority of its footprint.',
      flags: [ 'sbti-validated' ]
    },
    baseline: { year: 2020, mt: 0.044 },
    reported: [
      { y: 2020, mt: 0.044 },
      { y: 2021, mt: 0.042 },
      { y: 2022, mt: 0.038 },
      { y: 2023, mt: 0.033 },
      { y: 2024, mt: 0.032 },
      { y: 2025, mt: 0.0295 }
    ],
    boundaryNote: 'FY2024 (32.0 kt) and FY2025 (29.5 kt) are read from the emissions table; FY2020 to FY2023 are the whole kilotonne labels on the Scope 1 and 2 chart, so those four points are rounded and the baseline implied by the stated 32.3% fall is about 43.6 kt rather than the 44 the chart prints. Scope 2 is market based and has been nil since FY2021, because Brambles buys bundled and unbundled energy attribute certificates against all of its electricity and publishes no location based figure, so the total is effectively fleet and site fuel. Brambles also reports that network changes in CHEP North America moved operational control of some sites and transferred Scope 1 and 2 emissions into Scope 3, so part of the fall is a boundary shift out of the targeted scopes rather than abatement.',
    status: 'partial',
    verified: '13 August 2026',
    sources: [
      {
        name: 'Brambles Sustainability Review 2025 (Brambles-2025-Sustainability-Review.pdf), emissions by source table p21, Scope 1 and 2 chart p20',
        url: 'https://www.brambles.com/Content/cms/FY25-Results/pdf/Sustainability/Brambles-2025-Sustainability-Review.pdf',
        accessed: '13 August 2026'
      },
      {
        name: 'Brambles FY25 Annual Report',
        url: 'https://www.brambles.com/Content/cms/FY25-Results/pdf/Brambles-FY25-Annual-Report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Brambles Net-Zero Roadmap',
        url: 'https://www.brambles.com/net-zero-roadmap',
        accessed: '27 July 2026'
      }
    ],
    note: 'Scope 1 and 2 of 29.5 kt CO2e in FY2025 is about a third below the FY2020 baseline against a 42% cut by 2030, made up of 11.3 kt of CHEP fleet fuel and 18.2 kt of site fuel with nil market based Scope 2. Total Scope 1, 2 and 3 was 1,290.5 kt, 17.2% below FY2020, and Scope 3 alone was 1,261 kt, so almost the whole footprint sits outside the 42% target. Brambles has run on 100% renewable electricity since FY2021 and maintains carbon neutral operations.'
  },
  {
    id: 'nst',
    name: 'Northern Star Resources',
    ticker: 'NST',
    sector: 'Materials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Scope 1 and 2 (operational emissions)',
      baseYear: 2020,
      interim: [
        {
          year: 2030,
          cutPct: 35,
          vsBaseYear: 2020,
          absolute: true,
          note: '35% cut in Scope 1 and 2 by 2030, taking the 1 July 2020 baseline of 931 kt CO2e down to approximately 590 kt CO2e'
        }
      ],
      scope3: 'No Scope 3 target was corroborated in this review; Northern Star reports Scope 3 but no dated reduction commitment was verified.',
      flags: []
    },
    baseline: { year: 2020, mt: 0.93 },
    reported: [ { y: 2025, mt: 1.3 } ],
    boundaryNote: 'FY2025 total is Scope 1 of 836,894 tCO2e plus Scope 2 of 467,881 tCO2e; whether Scope 2 is market-based or location-based was not established in this review.',
    status: 'partial',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Northern Star Resources, Climate Change (corporate site)',
        url: 'https://www.nsrltd.com/sustainability/climate-change/',
        accessed: '27 July 2026'
      },
      {
        name: 'Northern Star Environment & Social Responsibility Approach FY25',
        url: 'https://www.nsrltd.com/media/v21nxqde/fy25-esr-approach-design-v6.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Northern Star FY25 Reasonable and Limited Assurance Statement',
        url: 'https://www.nsrltd.com/sustainability/',
        accessed: '27 July 2026'
      }
    ],
    note: 'FY2025 Scope 1 and 2 of 1.30 Mt sits about 40% above the 931 kt baseline the 35% cut is measured from, as production and the KCGM expansion grew; the company reports its progress as a cumulative 108,297 tCO2e reduction since FY2022 rather than as a fall in absolute emissions.'
  },
  {
    id: 'evn',
    name: 'Evolution Mining',
    ticker: 'EVN',
    sector: 'Materials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Scope 1 and 2 only',
      baseYear: 2020,
      interim: [
        {
          year: 2030,
          cutPct: 30,
          vsBaseYear: 2020,
          absolute: true,
          note: '30% reduction in total Scope 1 and 2 emissions by 2030 against an adjusted FY2020 baseline'
        }
      ],
      scope3: 'Net zero commitment is stated as Scope 1 and 2 only; no Scope 3 reduction target was found.',
      flags: []
    },
    baseline: { year: 2020, mt: 0.919167 },
    reported: [
      { y: 2020, mt: 0.919167 },
      { y: 2025, mt: 0.761424 }
    ],
    boundaryNote: 'Only the two endpoints are published as absolute tonnes: the report gives the FY2020 baseline and FY2025, and FY2021 to FY2024 appear as emissions intensity ratios only, so the line has a four year gap in the middle rather than a series. The FY2020 baseline was validated on a location based method while FY2023 onward are market based, and the baseline has been adjusted for portfolio changes including Northparkes, so the reported fall is not a like-for-like comparison.',
    status: 'partial',
    verified: '13 August 2026',
    sources: [
      {
        name: 'Evolution Mining Integrated Sustainability Report 2025 (evolution-mining-sustainability-report-web.pdf), FY25 emissions performance against FY20 baseline p90, emissions by operation p91',
        url: 'https://evolutionmining.com/wp-content/uploads/2025/11/evolution-mining-sustainability-report-web.pdf',
        accessed: '13 August 2026'
      },
      {
        name: 'Evolution Mining, Energy and Emissions and our Net Zero Commitment',
        url: 'https://evolutionmining.com.au/energy-and-emissions/',
        accessed: '27 July 2026'
      },
      {
        name: 'Evolution Mining, Commitment to Net Zero Emissions by 2050',
        url: 'https://evolutionmining.com.au/wp-content/uploads/2021/07/Commitment-to-Net-Zero-Emissions-by-2050.pdf',
        accessed: '27 July 2026'
      }
    ],
    note: "Total Scope 1 and 2 of 761,424 tCO2e in FY2025 is about 17% below the FY2020 baseline of 919,167 tCO2e, against a 30% cut by 2030, and Evolution revised that figure up from the about 16% first stated in its FY25 Directors' Report after corporate and exploration data were included. Almost all of the reduction is Scope 2: Scope 1 moved from 231,823 to 229,680 tCO2e, about 1%, while Scope 2 fell 23% on the Cowal solar power purchase agreement and market based accounting. The company also disclosed a miscalculation in its previously reported FY2023 and FY2024 market based figures without publishing the corrected tonnages."
  },
  {
    id: 'lyc',
    name: 'Lynas Rare Earths',
    ticker: 'LYC',
    sector: 'Materials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: null,
      scopes: 'No dated net zero or absolute reduction target identified; Lynas committed to the Science Based Targets initiative in September 2021 and said targets would be announced once validated.',
      baseYear: null,
      interim: [],
      scope3: 'No Scope 3 target identified.',
      flags: []
    },
    baseline: null,
    reported: [],
    boundaryNote: null,
    status: 'unverified',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Lynas Rare Earths, Our Commitment to the Science Based Targets initiative (September 2021)',
        url: 'https://lynasrareearths.com/our-commitment-to-the-science-based-targets-initiative-sbti/',
        accessed: '27 July 2026'
      },
      {
        name: 'Lynas Rare Earths 2025 Sustainability Report',
        url: 'https://lynasrareearths.com/wp-content/uploads/2025/10/LYC-Sustainability-Report-2025-Oct25V2-1.pdf',
        accessed: '27 July 2026'
      }
    ],
    note: 'No net zero year and no dated absolute reduction target were corroborated for Lynas; the company committed to the SBTi in September 2021 and, on the evidence found, has not published a validated target, so its emissions work is described through projects such as the gas-firmed hybrid renewable power station at Mt Weld rather than a target.'
  },
  {
    id: 'pls',
    name: 'PLS Group',
    ticker: 'PLS',
    sector: 'Materials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: "Scope 1 and 2, stated as a goal to reach net zero 'between 2040 and 2050' rather than a single dated commitment",
      baseYear: null,
      interim: [],
      scope3: 'No Scope 3 target identified.',
      flags: [ 'aspirational' ]
    },
    baseline: null,
    reported: [],
    boundaryNote: null,
    status: 'unverified',
    verified: '27 July 2026',
    sources: [
      {
        name: 'PLS, Sustainability Reports and Disclosures',
        url: 'https://www.pls.com/sustainability/reports-and-disclosures',
        accessed: '27 July 2026'
      },
      {
        name: 'Pilbara Minerals Annual Report 2023',
        url: 'https://www.pls.com/documents/reports-and-disclosures/pls-annual-report-2023.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Change of Company Name and Constitution (ASX announcement, December 2025)',
        url: 'https://www.marketindex.com.au/data-api/api/v1/announcements/XASX:PLS:6A1300075/pdf/inline/change-of-company-name-constitution',
        accessed: '27 July 2026'
      }
    ],
    note: 'Pilbara Minerals Limited became PLS Group Limited on 3 December 2025 after shareholder approval, with the ASX ticker unchanged; its stated goal is net zero Scope 1 and 2 somewhere between 2040 and 2050, with no interim percentage target and no verifiable emissions series found.'
  },
  {
    id: 'amc',
    name: 'Amcor',
    ticker: 'AMC',
    sector: 'Materials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Net zero greenhouse gas emissions across the value chain (Scope 1, 2 and 3)',
      baseYear: 2022,
      interim: [
        {
          year: 2033,
          cutPct: 54.6,
          vsBaseYear: 2022,
          absolute: true,
          note: 'SBTi-approved near-term target: 54.6% cut in absolute Scope 1 and 2 by FY2033 from FY2022'
        },
        {
          year: 2050,
          cutPct: 90,
          vsBaseYear: 2022,
          absolute: true,
          note: 'SBTi long-term target: 90% cut in absolute Scope 1 and 2 by 2050 from FY2022'
        }
      ],
      scope3: 'SBTi-approved targets to cut absolute Scope 3 by 32.5% by FY2033 and by 90% by 2050 from an FY2022 base year.',
      flags: [ 'sbti-validated' ]
    },
    baseline: null,
    reported: [ { y: 2023, mt: 1.8 } ],
    boundaryNote: "The FY2023 figure is Scope 1 of about 463,000 t plus Scope 2 of about 1.34 Mt as reported in Amcor's 2023 sustainability report; the Scope 2 basis (market or location) was not established, and one secondary source gives a lower Scope 2 for the same period, so the point should be treated as indicative.",
    status: 'partial',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Amcor FY25 Sustainability Report',
        url: 'https://assets.ctfassets.net/f7tuyt85vtoa/335OFZuc1oX9OJSeLEAQW1/3fbd713dedc1488907fe3d433584a468/Amcor_FY25_Sustainability_Report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Amcor Sustainability (reporting hub)',
        url: 'https://sustainability.amcor.com/en',
        accessed: '27 July 2026'
      },
      {
        name: 'Packaging Dive, Amcor releases decarbonization road map (FY2023 emissions figures)',
        url: 'https://www.packagingdive.com/news/amcor-decarbonization-roadmap-recycled-materials-scope-3/724759/',
        accessed: '27 July 2026'
      }
    ],
    note: 'Amcor reports a 20% cut in emissions from its own operations over four years against the FY2022 base year, against a near-term target of 54.6% by FY2033; the Berry Global combination completed in FY2025 materially enlarges the footprint, so figures before and after FY2025 are not comparable and the base year is expected to be restated.'
  },
  {
    id: 'jhx',
    name: 'James Hardie',
    ticker: 'JHX',
    sector: 'Materials',
    // Calendar, not fiscal: every emissions figure James Hardie publishes is on
    // a calendar year, including in its FY2025 report.
    yearBasis: 'CY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Scope 1 and 2',
      baseYear: 2021,
      interim: [
        {
          year: 2030,
          cutPct: 42,
          vsBaseYear: 2021,
          absolute: true,
          note: '42% cut in absolute Scope 1 and 2 by 2030 from a calendar 2021 baseline; an earlier disclosure set a 40% cut in Scope 1 and 2 intensity from a calendar 2019 baseline'
        }
      ],
      scope3: 'Scope 3 is disclosed and is the large majority of the footprint, but no dated Scope 3 reduction target was corroborated.',
      flags: []
    },
    baseline: { year: 2021, mt: 0.662727 },
    reported: [
      { y: 2020, mt: 0.558975 },
      { y: 2021, mt: 0.662727 },
      { y: 2022, mt: 0.646409 },
      { y: 2023, mt: 0.596700 },
      { y: 2024, mt: 0.573039 }
    ],
    boundaryNote: "James Hardie's financial year ends 31 March, but every emissions figure it publishes is on a calendar year, so this series runs CY2020 to CY2024 and the FY2025 report contains no emissions figure for the year ended 31 March 2025. Each year is the sum of the disclosed Scope 1 and location based Scope 2 rows in the data summary. Scope 2 is location based because the market based row reads not applicable for all five years, so the 42% target is tracked on a location based Scope 2 and grid decarbonisation, rather than procurement, does part of the work.",
    status: 'sourced',
    verified: '13 August 2026',
    sources: [
      {
        name: 'James Hardie Sustainability Report FY2025, Building Resilience (JHX_Sustainability_Report_FY2025_FINAL.pdf), data summary p39, decarbonisation pathway p42',
        url: 'https://assets.ctfassets.net/dzi2asncd44t/5jWpMtnrYu30RiNoEVBDge/30b8ef93fac91e8cd6e6f7abd4dcc229/JHX_Sustainability_Report_FY2025_FINAL.pdf',
        accessed: '13 August 2026'
      },
      {
        name: 'James Hardie Releases Annual Sustainability Report 2025 (media release)',
        url: 'https://www.jameshardie.com/all-about-james-hardie/press-releases/performance/james-hardie-releases-annual-sustainability-report-2025/',
        accessed: '27 July 2026'
      }
    ],
    note: 'Scope 1 and 2 of 573,039 tCO2e in CY2024 is 14% below the CY2021 base year of 662,727 tCO2e, the reduction James Hardie states, against a 42% cut by CY2030. The company attributes the fall to lower volumes, grid decarbonisation, the move away from coal and the closure of its Philippines operations rather than to a single abatement programme, and the target baseline itself moved from a 2019 intensity basis to a 2021 absolute basis. Scope 3 is about 80% of the footprint at 2.25 Mt in CY2024 and carries no dated reduction target.'
  },
  {
    id: 'nem',
    name: 'Newmont',
    ticker: 'NEM',
    sector: 'Materials',
    yearBasis: 'CY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Scope 1 and 2, worded as carbon neutral by 2050',
      baseYear: 2018,
      interim: [
        {
          year: 2030,
          cutPct: 32,
          vsBaseYear: 2018,
          absolute: true,
          note: '32% cut in Scope 1 and 2 by 2030 from a 2018 base year'
        }
      ],
      scope3: '30% reduction in Scope 3 by 2030 from a 2019 base year.',
      flags: [ 'aspirational' ]
    },
    baseline: null,
    reported: [],
    boundaryNote: 'Group-level global figures; trailing-year data in the 2024 report does not include the former Newcrest assets, and from 2024 aviation fuel is included in Scope 1 where Newmont owns and operates the aircraft.',
    status: 'unverified',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Newmont 2024 Sustainability Report',
        url: 'https://s24.q4cdn.com/382246808/files/doc_downloads/sustainability/2025/newmont-2024-sustainability-report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Newmont 2024 Performance Data',
        url: 'https://s24.q4cdn.com/382246808/files/doc_downloads/sustainability/2025/newmont-2024-performance-data.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Newmont Commits to Industry-Leading Climate Targets (2020 release)',
        url: 'https://www.newmont.com/investors/news-release/news-details/2020/Newmont-Commits-to-Industry-Leading-Climate-Targets/default.aspx',
        accessed: '27 July 2026'
      }
    ],
    note: "Newmont's 2030 targets were announced in 2020 and described in its earlier climate reports as validated by the Science Based Targets initiative, but the 2024 disclosure words them as aspirational decarbonisation targets, and Newmont is rebaselining Scope 1, 2 and 3 for the post-Newcrest portfolio of four added operations and six divestments, so no comparable absolute series is published for this review."
  },
  {
    id: 'alq',
    name: 'ALS',
    ticker: 'ALQ',
    sector: 'Industrials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Scope 1, 2 and 3, delivered as a 95% cut in absolute Scope 1 and 2 and a 90% cut in Scope 3 by 2050',
      baseYear: 2020,
      interim: [
        {
          year: 2030,
          cutPct: 78,
          vsBaseYear: 2020,
          absolute: true,
          note: '78% cut in absolute Scope 1 and 2 by 2030 from a 2020 base year'
        }
      ],
      scope3: 'Net zero commitment covers Scope 3 with a 90% absolute reduction by 2050 from a 2020 base year.',
      flags: [ 'offsets' ]
    },
    baseline: null,
    reported: [],
    boundaryNote: "ALS's financial year ends 31 March, so FY2025 is the year ended 31 March 2025.",
    status: 'unverified',
    verified: '13 August 2026',
    sources: [
      {
        name: 'ALS Sustainability Report 2025',
        url: 'https://www.alsglobal.com/-/media/ALSGlobal/Resources-Grid/2025-ALS-Sustainability-Report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'ALS Net Zero Commitments and Roadmap (EnviroMail 53)',
        url: 'https://www.alsglobal.com/en/news-and-publications/2023/12/enviromail-53-canada-als-net-zero-commitments-roadmap',
        accessed: '27 July 2026'
      }
    ],
    note: 'ALS reports a 58% cut in Scope 1 and 2 by the end of FY2023 against its 2020 base year and says it reached carbon neutrality for Scope 1 and 2 ahead of plan, which means residual emissions are being offset rather than eliminated; absolute tonnes were not corroborated so no series is shown. The SBTi register, at its 6 August 2026 export, lists ALS as committed as at 14 May 2026, which is a signed commitment letter rather than a validated target, and it is the most recently updated ASX50 record in that file.'
  },
  {
    id: 'tcl',
    name: 'Transurban',
    ticker: 'TCL',
    sector: 'Industrials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Net zero across the value chain by FY2050, delivered as a 90% cut in absolute Scope 1, 2 and 3 from an FY2019 base year',
      baseYear: 2019,
      interim: [
        {
          year: 2030,
          cutPct: 50,
          vsBaseYear: 2019,
          absolute: true,
          note: '50% cut in absolute Scope 1 and 2 by FY2030 from FY2019; Transurban reports meeting this in FY2023, seven years early'
        },
        {
          year: 2030,
          cutPct: 22,
          vsBaseYear: 2019,
          absolute: false,
          note: '22% cut in the carbon intensity of purchased goods and services (Scope 3 category 1) by 2030'
        },
        {
          year: 2030,
          cutPct: 55,
          vsBaseYear: 2019,
          absolute: false,
          note: '55% cut in the carbon intensity of major projects (Scope 3 category 2) by 2030'
        }
      ],
      scope3: "Scope 3 is covered by the FY2050 net zero target and by two 2030 intensity targets on purchased goods and services and on major projects; emissions from vehicles using Transurban's roads are the dominant part of its footprint.",
      flags: [ 'sbti-validated' ]
    },
    baseline: null,
    reported: [ { y: 2024, mt: 0.037 } ],
    boundaryNote: "Scope 1 and 2 covers Transurban's own operations, chiefly tunnel ventilation and road lighting electricity, and is small next to the Scope 3 emissions of the vehicles using its roads; Scope 2 is reported on a market-based approach reflecting renewable electricity contracts.",
    status: 'partial',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Transurban 2025 Corporate Report (year ended 30 June 2025)',
        url: 'https://www.transurban.com/content/dam/investor-centre/04/2025-Corporate-Report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Transurban FY25 GHG Basis of Preparation',
        url: 'https://www.transurban.com/content/dam/transurban-pdfs/01/sustainability-reports/FY25-GHG-Basis-of-Preparation.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Transurban FY24 Sustainability Data Pack',
        url: 'https://www.transurban.com/investor-centre/reporting-suite',
        accessed: '27 July 2026'
      }
    ],
    note: 'FY2024 Scope 1 and 2 of 36,580 tCO2e is reported as 70% below the FY2019 base year, so the 50% by FY2030 target was passed early, largely through renewable electricity contracts rather than reduced energy use; the FY2019 baseline tonnage was not corroborated so it is left blank.'
  },
  {
    id: 'cpu',
    name: 'Computershare',
    ticker: 'CPU',
    sector: 'Industrials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2042,
      scopes: 'Scope 1, 2 and 3',
      baseYear: 2021,
      interim: [
        {
          year: 2033,
          cutPct: 89.3,
          vsBaseYear: 2021,
          absolute: true,
          note: '89.3% cut in Scope 1 and 2 by FY2033 from an FY2021 base year, validated by the SBTi at 1.5 degrees; the target year is FY2033 on the register, not the 2030 previously recorded here'
        }
      ],
      scope3: '32.5% reduction in Scope 3 by FY2033 from an FY2023 base year, rising to 90% by FY2042.',
      flags: [ 'sbti-validated' ]
    },
    baseline: null,
    reported: [],
    boundaryNote: 'Base year is FY2021 for Scope 1 and 2 and FY2023 for Scope 3, so the two target lines start from different years.',
    status: 'unverified',
    verified: '13 August 2026',
    sources: [
      {
        name: 'Computershare Sustainability Report FY25',
        url: 'https://content-assets.computershare.com/eh96rkuu9740/6yPsID4hlPz2JQYVXImDSS/082ba3e038dd1015c7ae16d50c238c1d/CPU_-_Sustainability_Report_-_FY25.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Computershare, Environment (ESG site)',
        url: 'https://www.computershare.com/corporate/about-us/esg/environment',
        accessed: '27 July 2026'
      },
      {
        name: 'Computershare Annual Report FY25',
        url: 'https://content-assets.computershare.com/eh96rkuu9740/6ZnEmST36EeD4hcpst7O1V/9ba01f7fef27950e16853ff8d35de907/CPU_-_Annual_Report_-_FY25.pdf',
        accessed: '27 July 2026'
      }
    ],
    note: 'Computershare states a net zero year of 2042, earlier than the 2050 date most of its peers use. The SBTi register, at its 6 August 2026 export, records the near-term, long-term and net zero targets all as validated at 1.5 degrees, and dates the 89.3% Scope 1 and 2 cut from the FY2021 base year to FY2033 rather than the 2030 this page previously carried, which is three years of extra headroom on the claimed line. Absolute tonnes were not corroborated, so nothing is charted.'
  },
  {
    id: 'cba',
    name: 'Commonwealth Bank',
    ticker: 'CBA',
    sector: 'Financials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: "Net zero by 2050 across operations and financed emissions, supporting Australia's transition to a net zero economy by 2050",
      baseYear: 2020,
      interim: [
        {
          year: 2030,
          cutPct: 42,
          vsBaseYear: 2020,
          absolute: true,
          note: '42% cut in operational Scope 1 and 2 emissions against a FY2020 baseline of 19,282 tCO2e; CBA reported a 65% cut by FY2024, already past the 2030 target'
        }
      ],
      scope3: 'CBA set sector level 2030 financed emissions targets covering sectors that account for more than 75% of its 2020 financed emissions, so its Scope 3 position is a set of sector pathways rather than one group wide absolute target.',
      flags: []
    },
    baseline: { year: 2020, mt: 0.019 },
    reported: [ { y: 2020, mt: 0.019 } ],
    boundaryNote: 'The chart shows operational Scope 1 and 2 only, which for a bank is a rounding error against its financed emissions; the net zero claim covers both, and the financed side is disclosed separately as sector pathways rather than a single comparable tonnage. Financial year ends 30 June.',
    status: 'partial',
    verified: '27 July 2026',
    sources: [
      {
        name: 'CBA 2024 Climate Report',
        url: 'https://www.commbank.com.au/content/dam/commbank-assets/investors/docs/results/fy24/CBA-2024-Climate-Report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'CBA 2025 Sustainability Reporting Appendix',
        url: 'https://www.commbank.com.au/content/dam/commbank-assets/investors/docs/results/fy25/2025-sustainability-reporting-appendix.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'CBA 2025 Environmental and Social Framework',
        url: 'https://www.commbank.com.au/content/dam/commbank/about-us/download-printed-forms/environment-and-social-framework.pdf',
        accessed: '27 July 2026'
      }
    ],
    note: 'Only the FY2020 baseline tonnage could be corroborated at source, so the series is a single point; CBA states a 65% cut in operational Scope 1 and 2 by FY2024 against that baseline, which is ahead of its 42% by 2030 target. CBA stayed in the Net-Zero Banking Alliance until the alliance ceased operations in late 2025 and updated its Environmental and Social Framework in August 2025.'
  },
  {
    id: 'nab',
    name: 'NAB',
    ticker: 'NAB',
    sector: 'Financials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Net zero by 2050 across financed and facilitated emissions and operations',
      baseYear: 2022,
      interim: [
        {
          year: 2030,
          cutPct: 72,
          vsBaseYear: 2022,
          absolute: true,
          note: '72% cut in market-based operational Scope 1 and 2 against a 2022 baseline, built with the SBTi target-setting tool but not submitted to SBTi for validation'
        }
      ],
      scope3: 'NAB has set twelve interim 2030 sectoral decarbonisation targets across eight of the nine high emitting sectors named in the UNEP FI guidance, most of them intensity based, and reports financed emissions in its annual Climate Report; it has no single group wide absolute Scope 3 target.',
      flags: []
    },
    baseline: { year: 2022, mt: 0.023018 },
    reported: [
      { y: 2022, mt: 0.023018 },
      { y: 2023, mt: 0.015041 },
      { y: 2024, mt: 0.009880 },
      { y: 2025, mt: 0.008359 }
    ],
    boundaryNote: "The series is market based Scope 1 and 2, the exact basis the 72% target is set against. NAB's financial year ends 30 September while its environmental reporting year runs 1 July to 30 June, so the two year ends behind each label do not coincide. Market based Scope 2 was nil in 2025 on 100% renewable electricity, which makes that year's total its Scope 1 alone; location based Scope 2 was 44,444 tCO2e in the same year, five times the whole market based total. The commitment covers financed and facilitated emissions as well as operations, and operational Scope 1 and 2 is a tiny fraction of NAB's financed emissions.",
    status: 'sourced',
    verified: '13 August 2026',
    sources: [
      {
        name: 'NAB Climate Report 2025 (2025-climate-report.pdf), operational emissions p45, science based target progress Table 2 p48, GHG emissions and energy use Table 3 p49',
        url: 'https://www.nab.com.au/about-us/sustainability/environment/climate-change',
        accessed: '13 August 2026'
      },
      {
        name: 'NAB Climate Report 2023 (2023-climate-report.pdf), operational emissions by scope p58, science based target progress Table 1 p61',
        url: 'https://www.nab.com.au/content/dam/nab/documents/reports/corporate/2023-climate-report.pdf',
        accessed: '13 August 2026'
      },
      {
        name: 'NAB, Taking action on climate change',
        url: 'https://www.nab.com.au/about-us/sustainability/environment/climate-change',
        accessed: '27 July 2026'
      },
      {
        name: 'NAB, Measuring our environmental performance',
        url: 'https://www.nab.com.au/about-us/sustainability/environment/performance',
        accessed: '27 July 2026'
      }
    ],
    note: "Market based Scope 1 and 2 fell from 23,018 tCO2e in 2022 to 8,359 in 2025, 64% below the base year against a 72% cut by 2030, almost all of it delivered by zeroing market based Scope 2 through renewable electricity procurement. The target replaced an earlier one of 51% by 2025 from a 2015 baseline, moving both the base year and the horizon. NAB states the target uses science based methodology but has not been submitted to the SBTi for validation. NAB retires carbon offsets against residual operational emissions after avoiding and reducing them. It remained a Net-Zero Banking Alliance member until the alliance ceased operations in late 2025 and declined to comment publicly on its membership during the 2025 exodus."
  },
  {
    id: 'wbc',
    name: 'Westpac',
    ticker: 'WBC',
    sector: 'Financials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Net zero by mid century or sooner, with CO2e emissions reaching net zero at the latest by 2050, covering operations, upstream Scope 3 and financed emissions',
      baseYear: 2021,
      interim: [
        {
          year: 2025,
          cutPct: 64,
          vsBaseYear: 2021,
          absolute: true,
          note: '64% cut in absolute operational Scope 1 and 2 against a 2021 baseline'
        },
        {
          year: 2030,
          cutPct: 76,
          vsBaseYear: 2021,
          absolute: true,
          note: '76% cut in absolute operational Scope 1 and 2 against a 2021 baseline'
        }
      ],
      scope3: 'Westpac has a 50% cut in absolute upstream Scope 3 emissions by 2030 against a 2021 baseline, plus sector financed emissions targets in its Climate Transition Plan; it reports reducing corporate lending to institutional thermal coal mining customers to zero.',
      flags: [ 'offsets' ]
    },
    baseline: null,
    reported: [],
    boundaryNote: "Westpac's financial year ends 30 September. The chart would show operational Scope 1 and 2 only; the net zero claim also covers upstream Scope 3 and financed emissions, which are far larger and are disclosed separately as sector pathways.",
    status: 'unverified',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Westpac Climate Transition Plan',
        url: 'https://www.westpac.com.au/content/dam/public/wbc/documents/pdf/aw/sustainability/wbc-climate-transition-plan.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Westpac Sustainability Market Update, 2 December 2025',
        url: 'https://www.westpac.com.au/content/dam/public/wbc/documents/pdf/aw/ic/wbc-Sustainability-Update-2025.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Westpac Climate Change Position Statement and Action Plan 2023-2025',
        url: 'https://www.westpac.com.au/content/dam/public/wbc/documents/pdf/aw/ic/Climate_Change_Position_Statement_and_Action_Plan.pdf',
        accessed: '27 July 2026'
      }
    ],
    note: "Westpac's 2025 Sustainability Update reports a 22% year on year fall in operational Scope 1 and 2 emissions, but a year by year tonnage series could not be read from a Westpac source, so none is charted. Westpac publicly confirmed it remained committed to the Net-Zero Banking Alliance through the 2025 member exodus, and the alliance itself ceased operations in late 2025. Westpac uses carbon offsets and Toitu carbonzero certification for residual operational emissions."
  },
  {
    id: 'anz',
    name: 'ANZ',
    ticker: 'ANZ',
    sector: 'Financials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Transition the lending portfolio to net zero financed emissions by 2050 in line with the Paris Agreement, alongside operational Scope 1 and 2 targets',
      baseYear: 2024,
      interim: [
        {
          year: 2030,
          cutPct: 85,
          vsBaseYear: 2024,
          absolute: true,
          note: '85% cut in combined operational Scope 1 and 2, effective 1 October 2025, set after ANZ met its earlier 90% by 2030 target ahead of schedule and rebased to 2024'
        }
      ],
      scope3: 'ANZ has 2030 interim targets for ten sectors or sub-sectors of its lending book on the path to net zero financed emissions by 2050; most are intensity based and there is no single group wide absolute Scope 3 target.',
      flags: []
    },
    baseline: null,
    reported: [],
    boundaryNote: "ANZ's financial year ends 30 September. The headline claim covers financed emissions from lending; operational Scope 1 and 2 is a small fraction of that and is the only comparably reported series, but no tonnage could be corroborated at source.",
    status: 'unverified',
    verified: '27 July 2026',
    sources: [
      {
        name: 'ANZ 2025 Climate Report',
        url: 'https://www.anz.com.au/content/dam/anzcomau/about-us/anz-2025-climate-report-accessible.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'ANZ 2025 Climate Change Commitment',
        url: 'https://www.anz.com.au/content/dam/anzcomau/about-us/anz-climate-change-commitment-2025.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'ANZ, Reducing our operational emissions',
        url: 'https://www.anz.com.au/about-us/esg/environmental-sustainability/environmental-footprint/',
        accessed: '27 July 2026'
      }
    ],
    note: 'ANZ hit its 90% by 2030 operational cut early and then reset the target to 85% by 2030 against a newer 2024 baseline, so the headline percentage fell while the absolute floor moved; readers comparing the two numbers should note the baseline change. ANZ joined the Net-Zero Banking Alliance in 2021, did not answer directly when asked during the 2025 exodus whether it would stay, and the alliance ceased operations in late 2025.'
  },
  {
    id: 'mqg',
    name: 'Macquarie Group',
    ticker: 'MQG',
    sector: 'Financials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: "Align financing activity with the global goal of net zero emissions by 2050, alongside net zero for Macquarie's own business operations across Scope 1 and 2 from FY2025",
      baseYear: null,
      interim: [],
      scope3: 'Macquarie has financed emissions reduction targets for oil and gas, coal, automotive and, since 2023, Australian residential mortgage lending, together covering about 80% of its balance sheet exposure to carbon intensive industries; it has no single group wide absolute Scope 3 target.',
      flags: [ 'exited-alliance', 'offsets' ]
    },
    baseline: null,
    reported: [],
    boundaryNote: "Macquarie's financial year ends 31 March, so FY2025 is the year to 31 March 2025 and its years do not line up with the June and September reporters. Operational net zero covers Scope 1 and 2 plus business travel and uses renewable electricity and offsets; the 2050 claim covers financing activity, which is far larger and reported separately.",
    status: 'unverified',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Macquarie Group FY25 Sustainability Report',
        url: 'https://www.macquarie.com/assets/macq/about/company/sustainability/macquarie-group-fy25-sustainability-report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Macquarie Group FY2025 Basis of Preparation for Sustainability Reporting',
        url: 'https://www.macquarie.com/assets/macq/about/company/sustainability/macquarie-group-fy25-preparation-for-sustainability-reporting.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Macquarie Exits the Net Zero Banking Alliance, ESG Today, February 2025',
        url: 'https://www.esgtoday.com/macquarie-exits-the-net-zero-banking-alliance/',
        accessed: '27 July 2026'
      }
    ],
    note: 'Macquarie left the Net-Zero Banking Alliance on 11 February 2025, the first major Australian bank to do so, saying its climate strategy was evolving to meet client, government and regulator needs while its net zero commitment remained intact. Macquarie Asset Management is also a Net Zero Asset Managers signatory; that initiative suspended activities in January 2025 and relaunched in January 2026 with the requirement to aim for net zero by 2050 removed. Macquarie sourced 100% renewable electricity globally from FY2023.'
  },
  {
    id: 'asx',
    name: 'ASX Limited',
    ticker: 'ASX',
    sector: 'Financials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2025,
      scopes: 'Net zero Scope 1 and 2 (operational) in FY2025; no dated net zero commitment covering Scope 3 or investment related emissions',
      baseYear: null,
      interim: [],
      scope3: 'ASX has no dated net zero or reduction target for Scope 3. As a market operator it has no lending book, so there is no financed emissions commitment of the kind the banks and insurers carry.',
      flags: [ 'exited-sbti' ]
    },
    baseline: null,
    reported: [],
    boundaryNote: 'ASX reports emissions on a financial control basis for financial years ending 30 June and presents figures to the nearest significant figure. Its net zero claim covers operational Scope 1 and 2 only, which is a much narrower boundary than the 2050 financed emissions claims made by the banks and insurers in this sector.',
    status: 'unverified',
    verified: '13 August 2026',
    sources: [
      {
        name: 'ASX, Environment',
        url: 'https://www.asx.com.au/about/sustainability/environment',
        accessed: '27 July 2026'
      },
      {
        name: 'ASX Sustainability Report 2024',
        url: 'https://www.asx.com.au/content/dam/asx/about/sustainability/asx-2024-sustainability-report.pdf',
        accessed: '27 July 2026'
      }
    ],
    note: "ASX targeted net zero Scope 1 and 2 in FY2025, reached 100% renewable electricity for offices where it chooses the retailer, and expects to cancel the unavoidable residual of under 1% with Australian Carbon Credit Units. No year by year tonnage could be corroborated at source, so nothing is charted. The SBTi register, at its 6 August 2026 export, records ASX's near-term and net zero commitments as removed for expiry, on a register record last updated 12 May 2022. The boundary is the thing to read here: a Scope 1 and 2 net zero says nothing about the emissions of the market ASX operates."
  },
  {
    id: 'qbe',
    name: 'QBE Insurance',
    ticker: 'QBE',
    sector: 'Financials',
    yearBasis: 'CY',
    commitment: {
      netZeroYear: 2030,
      scopes: 'Net zero operations by 2030 across Scope 1, Scope 2 and selected Scope 3 (fuel and energy related activities and business travel). The former 2050 net zero targets for the underwriting and investment portfolios were withdrawn in 2025 and replaced with an undated ambition to support the transition',
      baseYear: null,
      interim: [],
      scope3: 'QBE previously committed to a net zero underwriting portfolio by 2050 and a net zero investment portfolio by 2050. In 2025 it reassessed both and dropped the dated targets, keeping an ambition to support the transition to a net zero economy; from 1 January 2026 it assesses the transition maturity of in scope oil and gas customers instead.',
      flags: [ 'weakened', 'exited-alliance', 'aspirational' ]
    },
    baseline: null,
    reported: [],
    boundaryNote: "QBE reports on a calendar year to 31 December. The only remaining dated net zero commitment covers QBE's own operations, not the underwriting or investment portfolios where the material emissions sit.",
    status: 'unverified',
    verified: '27 July 2026',
    sources: [
      {
        name: "Statement on QBE's climate strategy, QBE Insurance Group",
        url: 'https://www.qbe.com/newsroom/news/statement-on-qbe-climate-strategy',
        accessed: '27 July 2026'
      },
      {
        name: 'QBE 2025 Impact Report',
        url: 'https://www.qbe.com/media/qbe/group/sustainability/2026/qbe-2025-impact-report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'QBE 2024 Sustainability Report',
        url: 'https://www.qbe.com/media/qbe/group/sustainability/2025/qbe-2024-sustainability-report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'QBE Net-Zero Asset Owner Alliance update',
        url: 'https://www.qbe.com/newsroom/news/qbe-announces-resignation-from-the-net-zero-asset-owners-alliance',
        accessed: '27 July 2026'
      }
    ],
    note: 'This is the clearest weakening in the sector: QBE withdrew its 2050 net zero targets for both the underwriting and the investment portfolio in 2025 after reassessing global policy, regulation, emissions projections and technology deployment, and replaced them with an ambition rather than a commitment. Only the 2030 operational target survives. QBE also left the Net-Zero Insurance Alliance in 2023 and resigned from the Net-Zero Asset Owner Alliance. A climate transition plan is due with the Annual Report in February 2026.'
  },
  {
    id: 'iag',
    name: 'Insurance Australia Group',
    ticker: 'IAG',
    sector: 'Financials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Net zero emissions across operations by 2050 with the investment portfolio aligned to net zero by 2050, and an interim commitment to net zero Scope 1 and 2 by FY2030 on an FY2024 baseline',
      baseYear: 2024,
      interim: [],
      scope3: 'IAG aims to align its investment portfolio to net zero by 2050 and says it will accelerate the transition across its value chain, including customers, suppliers and partners, but it has no dated absolute Scope 3 or insurance associated emissions target.',
      flags: [ 'offsets', 'exited-alliance' ]
    },
    baseline: null,
    reported: [],
    boundaryNote: "IAG's financial year ends 30 June. Any chart would show operational Scope 1 and 2 only; IAG has reported carbon neutral status on that boundary since 2012 using offsets, so the operational line says little about the investment portfolio or insurance associated emissions where the material exposure sits.",
    status: 'unverified',
    verified: '27 July 2026',
    sources: [
      {
        name: 'IAG Climate and Disaster Resilience Action Plan, Towards 2030',
        url: 'https://www.iag.com.au/newsroom/community/iag-launches-new-climate-disaster-resilience-action-plan',
        accessed: '27 July 2026'
      },
      {
        name: 'IAG exits Net-Zero Insurance Alliance, Insurance Asia News, June 2023',
        url: 'https://insuranceasianews.com/iag-exits-net-zero-insurance-alliance/',
        accessed: '27 July 2026'
      },
      {
        name: 'IAG Limited financial results and reporting',
        url: 'https://www.iag.com.au/investor-centre/financial-results',
        accessed: '27 July 2026'
      }
    ],
    note: 'IAG has reported carbon neutral Scope 1 and 2 since 2012 through offsets, and in its Towards 2030 plan set net zero Scope 1 and 2 by FY2030 on an FY2024 baseline, which is a shift from buying neutrality toward cutting the emissions themselves. IAG left the Net-Zero Insurance Alliance in June 2023 while saying it remained committed to net zero by 2050. No year by year tonnage could be corroborated at source.'
  },
  {
    id: 'sun',
    name: 'Suncorp',
    ticker: 'SUN',
    sector: 'Financials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2030,
      scopes: "Net zero Scope 1 and 2 (operational) by 2030, covering activities associated with Suncorp's insurance operations in Australia and New Zealand; brought forward from an earlier 2050 target",
      baseYear: 2018,
      interim: [
        {
          year: 2030,
          cutPct: 51,
          vsBaseYear: 2018,
          absolute: true,
          note: '51% cut in absolute Scope 1 and 2 by 2030 against a 2018 baseline, with the residual taken to net zero'
        }
      ],
      scope3: 'Suncorp says it is measuring Scope 3 across operations, supply chain and, historically, financed emissions from lending, and intends to set targets, but it has no dated net zero commitment for Scope 3. Suncorp sold its banking business to ANZ in 2024, which removed most of its financed emissions exposure.',
      flags: [ 'offsets' ]
    },
    baseline: null,
    reported: [],
    boundaryNote: "Suncorp's financial year ends 30 June. The net zero claim covers operational Scope 1 and 2 for the Australian and New Zealand insurance business only; underwriting and investment emissions are outside it.",
    status: 'unverified',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Suncorp FY25 Climate-related Disclosure Report',
        url: 'https://www.suncorpgroup.com.au/uploads/FY25-SUN-Climate-related-Disclsoure-Report-Final.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Suncorp brings forward net-zero target to 2030, Insurance News',
        url: 'https://www.insurancenews.com.au/corporate/suncorp-brings-forward-net-zero-target-to-2030',
        accessed: '27 July 2026'
      },
      {
        name: 'Suncorp-Metway Climate Active Public Disclosure Statement',
        url: 'https://www.climateactive.org.au/sites/default/files/2022-08/Suncorp_Initial%20Cert_Year%201%20FY2021-22%20(projected)_Service_PDS%20FINAL.pdf',
        accessed: '27 July 2026'
      }
    ],
    note: 'Suncorp brought its Scope 1 and 2 net zero target forward by twenty years, from 2050 to 2030, and reports being well ahead of the 51% interim cut. The baseline year is stated inconsistently across the material reviewed, with the 51% target set against 2018 and progress reported in FY2025 as an 85% cut against baseline while another figure cites 74% against an FY2020 baseline, so no series is charted. Suncorp has used Climate Active certification and offsets for its operational footprint alongside renewable electricity and fleet electrification.'
  },
  {
    id: 'sol',
    name: 'Washington H Soul Pattinson',
    ticker: 'SOL',
    sector: 'Financials',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: null,
      scopes: 'No group net zero commitment of any kind, for operations, investments or portfolio emissions',
      baseYear: null,
      interim: [],
      scope3: "No Scope 3 or portfolio emissions target. WHSP's largest climate exposure is its holding in thermal coal miner New Hope Corporation; management has said it assumes New Hope generates no cash flow beyond 2036, the end of the currently approved life of the Bengalla mine, and has said the company does not need to consider the implications of policy shifts to achieve net zero by 2050.",
      flags: []
    },
    baseline: null,
    reported: [],
    boundaryNote: "WHSP's financial year ends 31 July, unlike every other company in this sector group. It reports only its own direct operations, a small head office, estimated at 38 tCO2e Scope 1 and 2 in FY2023, which is far below the resolution of a chart in Mt; the emissions of the listed and unlisted companies it holds, including New Hope, sit entirely outside that boundary.",
    status: 'unverified',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Washington H. Soul Pattinson 2023 Sustainability Report',
        url: 'https://www.datocms-assets.com/104850/1700545642-soul_patts_2023_sustainability_report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: "New Hope's largest shareholder says it doesn't need to think about net-zero by 2050, Market Forces",
        url: 'https://www.marketforces.org.au/new-hopes-largest-shareholder-says-it-doesnt-need-to-think-about-net-zero-by-2050/',
        accessed: '27 July 2026'
      },
      {
        name: 'Washington H. Soul Pattinson, Transition Pathway Initiative',
        url: 'https://transitionpathwayinitiative.org/companies/washington-h-soul-pattinson',
        accessed: '27 July 2026'
      }
    ],
    note: 'WHSP is the only company in this group with no net zero commitment at all. Its managing director has said the company does not need to consider the implications of a policy shift to net zero by 2050, while WHSP remains the largest shareholder in thermal coal miner New Hope. WHSP reports its own head office footprint at 38 tCO2e in FY2023 and began building a carbon emissions measurement and reporting framework in FY2023 while running a gap analysis against the incoming Australian sustainability reporting standards. Its FY2025 statutory annual report appears under a different reporting entity and ABN from the historical company, which suggests a 2025 corporate restructure that could change the reporting boundary; that was not verified here.'
  },
  {
    id: 'wes',
    name: 'Wesfarmers',
    ticker: 'WES',
    sector: 'Consumer Discretionary',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Scope 1 and 2 (market-based), set division by division, with a group ambition of net zero by 2050 or sooner',
      baseYear: 2020,
      interim: [
        {
          year: 2030,
          cutPct: 30,
          vsBaseYear: 2020,
          absolute: true,
          note: "WesCEF (Wesfarmers Chemicals, Energy and Fertilisers) only: at least 30% below its 2020 Scope 1+2 baseline. Wesfarmers publishes no single consolidated group interim percentage; each division sets its own interim and net zero targets, and the retail divisions' targets are framed as 100% renewable electricity rather than a percentage cut."
        }
      ],
      scope3: 'Wesfarmers discloses Scope 3 at division level and has no group-wide absolute Scope 3 reduction target.',
      flags: [ 'aspirational' ]
    },
    baseline: null,
    reported: [ { y: 2024, mt: 1.13 } ],
    boundaryNote: 'FY2024 figure is Scope 1 of 829,889 tCO2e plus market-based Scope 2 of 302,496 tCO2e; on a location-based Scope 2 basis (489,633 tCO2e) the same year totals 1.32 Mt.',
    status: 'partial',
    note: "Scope 1 dominates the group total and sits overwhelmingly in the WesCEF chemicals business, so the retail divisions' renewable electricity switch moves Scope 2 only. Wesfarmers reported Scope 1+2 down 4.9% in FY2024 and down 27.8% in FY2025 as the retail divisions reached 100% renewable electricity, but the FY2020 group baseline tonnage could not be corroborated so no target line can be drawn from a verified starting point.",
    verified: '27 July 2026',
    sources: [
      {
        name: 'Wesfarmers 2025 Annual Report and climate-related disclosures',
        url: 'https://wesfarmers.gcs-web.com/static-files/72f7fa1f-d6cc-43ee-b0a5-b83246a57bfd/',
        accessed: '27 July 2026'
      },
      {
        name: 'Wesfarmers FY2024 sustainability reporting',
        url: 'https://www.wesfarmers.com.au/sustainability/fy2024',
        accessed: '27 July 2026'
      },
      {
        name: 'WesCEF climate roadmap to net zero by 2050',
        url: 'https://www.wesfarmers.com.au/sustainability/fy2022/our-stories/wescef-s-roadmap-to-net-zero-by-2050',
        accessed: '27 July 2026'
      }
    ]
  },
  {
    id: 'wow',
    name: 'Woolworths Group',
    ticker: 'WOW',
    sector: 'Consumer Staples',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Scope 1 and 2 (operational control) for the interim targets; the 2050 net zero commitment covers the full value chain including Scope 3',
      baseYear: 2023,
      interim: [
        {
          year: 2030,
          cutPct: 80,
          vsBaseYear: 2023,
          absolute: true,
          note: '80% below the F23 base year, absolute Scope 1+2, SBTi-validated against a 1.5C pathway'
        },
        {
          year: 2045,
          cutPct: 90,
          vsBaseYear: 2023,
          absolute: true,
          note: '90% below the F23 base year, absolute Scope 1+2, the SBTi long-term target'
        }
      ],
      scope3: 'Woolworths has SBTi-validated Scope 3 and deforestation targets and reports Scope 3 as roughly 96% of its end-to-end footprint in F25, about 23 times its Scope 1+2.',
      flags: [ 'sbti-validated' ]
    },
    baseline: { year: 2023, mt: 1.94 },
    reported: [ { y: 2023, mt: 1.94 }, { y: 2024, mt: 1.84 } ],
    boundaryNote: 'The F23 figure of 1,941,581 tCO2e is the stated operational base year for the SBTi-validated target; the F24 figure of 1,841,031 tCO2e comes from third-party aggregation of the F24 report and the Scope 2 basis (market or location) is not stated in the sources checked. A location-based F23 total of 1,985,174 tCO2e is also published, so the two years may not be on an identical Scope 2 basis.',
    status: 'partial',
    note: 'Woolworths moved its headline base year from 2015 to F23 when SBTi validated the targets in F24. The replacement is a deeper absolute cut: 80% below the F23 level lands well below where 63% off the 2015 level would have landed. Reported Scope 1+2 were 22.9% below the F23 base in F25, the year Woolworths reached 100% renewable electricity in Australia and New Zealand. The Endeavour Group demerger in 2021 breaks comparability with pre-F22 series.',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Woolworths Group 2025 Sustainability Report',
        url: 'https://www.woolworthsgroup.com.au/content/dam/wwg/sustainability/reports/2025_WG_Sustainability_Report_Interactive_SPREADS.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Woolworths Group 2024 Sustainability Report',
        url: 'https://www.woolworthsgroup.com.au/content/dam/wwg/investors/reports/f24/f24/Woolworths%20Group%202024%20Sustainability%20Report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Woolworths Group climate and nature commitments',
        url: 'https://www.woolworthsgroup.com.au/au/en/our-impact/sustainability/climate-and-nature.html',
        accessed: '27 July 2026'
      }
    ]
  },
  {
    id: 'col',
    name: 'Coles Group',
    ticker: 'COL',
    sector: 'Consumer Staples',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Scope 1 and 2 (operational) for the interim target; net zero by 2050 is stated across all three scopes',
      baseYear: 2020,
      interim: [
        {
          year: 2030,
          cutPct: 75,
          vsBaseYear: 2020,
          absolute: true,
          note: 'more than 75% below the FY2020 combined Scope 1+2 baseline by the end of FY2030, aligned with SBTi'
        }
      ],
      scope3: "Coles' Scope 3 goal is supplier engagement rather than an absolute reduction: more than 75% of suppliers by spend to have set science-based targets by the end of FY2027.",
      flags: [ 'sbti-validated' ]
    },
    baseline: { year: 2020, mt: 1.6 },
    reported: [ { y: 2020, mt: 1.6 } ],
    boundaryNote: "Scope 2 is reported market-based and counts voluntary LGC surrenders, the renewable power percentage, the jurisdictional renewable power percentage and onsite solar within Coles' operational control.",
    status: 'partial',
    note: "The FY2020 baseline of about 1.6 Mt is a rounded third-party figure rather than a number read from Coles' own emissions table, so it should be treated as indicative. Coles reported combined Scope 1+2 27.7% below FY2020 in FY2023 and 34.5% below in FY2024, with a much larger step reported at about 71% below FY2020 in the year it reached 100% renewable electricity; the sources checked did not make clear whether that 71.4% figure is stated for FY2024 or FY2025. Refrigerant leakage is the dominant remaining Scope 1 source once electricity is decarbonised.",
    verified: '27 July 2026',
    sources: [
      {
        name: 'Coles Group 2025 Sustainability Report',
        url: 'https://www.colesgroup.com.au/FormBuilder/_Resource/_module/ir5sKeTxxEOndzdh00hWJw/file/Sustainability_Report_2025.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Coles Together to Zero Emissions',
        url: 'https://www.coles.com.au/about/sustainability/environment/emissions',
        accessed: '27 July 2026'
      },
      {
        name: "Australasian Centre for Corporate Responsibility, Emissions are down with Coles' new targets",
        url: 'https://www.accr.org.au/news/emissions-are-down-with-coles%E2%80%99-new-targets/',
        accessed: '27 July 2026'
      }
    ]
  },
  {
    id: 'all',
    name: 'Aristocrat Leisure',
    ticker: 'ALL',
    sector: 'Consumer Discretionary',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Net zero across the value chain (Scope 1, 2 and 3) by 2050, with SBTi-validated near-term and long-term targets',
      baseYear: 2022,
      interim: [
        {
          year: 2033,
          cutPct: 54.6,
          vsBaseYear: 2022,
          absolute: true,
          note: '54.6% absolute cut in Scope 1+2 by FY2033, the SBTi-validated near-term target'
        },
        {
          year: 2050,
          cutPct: 90,
          vsBaseYear: 2022,
          absolute: true,
          note: '90% absolute cut in Scope 1+2, the SBTi-validated long-term target underpinning the net zero claim'
        }
      ],
      scope3: 'Aristocrat has SBTi-validated Scope 3 targets of a 32.5% absolute reduction by 2033 and 90% by 2050 from a 2022 base year.',
      flags: [ 'sbti-validated' ]
    },
    baseline: { year: 2022, mt: 0.017258 },
    reported: [
      { y: 2022, mt: 0.017258 },
      { y: 2023, mt: 0.021163 },
      { y: 2024, mt: 0.016291 },
      { y: 2025, mt: 0.016823 }
    ],
    boundaryNote: "Aristocrat's financial year ends 30 September, so its FY labels are not directly comparable with the June-end reporters in this set. Scope 2 is location based, the only basis Aristocrat discloses. The FY2025 point sits on a different boundary from the three years before it: the company states FY2025 is not directly comparable to earlier years after the NeoGames acquisition, the Plarium divestment and a methodology change, and that it will re-baseline to FY2025, revalidate its science based targets and report against the updated targets from FY2026.",
    status: 'sourced',
    note: 'Scope 1 and 2 of 16,823 tCO2e in FY2025 sits 2.5% below the FY2022 base year of 17,258 tCO2e, against a 54.6% cut by FY2033, and FY2023 at 21,163 tCO2e was above the base year. The target architecture is unusually complete for a company this size, covering all three scopes with SBTi validation and a 90% abatement floor before residuals, but the FY2022 baseline the claimed line runs from is the one Aristocrat has said it will replace with FY2025.',
    verified: '13 August 2026',
    sources: [
      {
        name: 'Aristocrat FY24 Sustainability Report',
        url: 'https://s25652.pcdn.co/wp-content/uploads/2024/12/FY24-Aristocrat-Sustainability-Report_FINAL.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Aristocrat FY25 Sustainability Report (FY25_Sustainability_Report.pdf), emissions and science based targets p37',
        url: 'https://s25652.pcdn.co/wp-content/uploads/2025/12/FY25_Sustainability_Report.pdf',
        accessed: '13 August 2026'
      },
      {
        name: 'Aristocrat launches FY24 Sustainability Report (SBTi validation announcement)',
        url: 'https://www.aristocrat.com/aristocrat-launches-fy24-sustainability-report/',
        accessed: '27 July 2026'
      }
    ]
  },
  {
    id: 'lnw',
    name: 'Light & Wonder',
    ticker: 'LNW',
    sector: 'Consumer Discretionary',
    yearBasis: 'CY',
    commitment: {
      netZeroYear: null,
      scopes: 'No quantified emissions target. Light & Wonder states a qualitative goal to reduce its overall carbon footprint through energy efficiency, recycling and renewable energy, within an ISO 14001-aligned environmental management system.',
      baseYear: null,
      interim: [],
      scope3: 'No Scope 3 target identified; reporting emphasises materials reclaimed from decommissioned gaming machines and logistics optimisation rather than value-chain emissions accounting.',
      flags: []
    },
    baseline: null,
    reported: [],
    boundaryNote: 'Light & Wonder is US-domiciled and reports on a calendar year; its ASX listing is via CDIs, so it is not covered by Australian NGER reporting.',
    status: 'unverified',
    note: 'Light & Wonder is the only company in this batch with neither a net zero year nor any quantified emissions target, and no Scope 1+2 tonnage could be corroborated from its published CSR reporting. That absence is the finding.',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Light & Wonder Environmental Sustainability',
        url: 'https://explore.lnw.com/about/social-responsibility/environmental-sustainability/',
        accessed: '27 July 2026'
      },
      {
        name: 'Light & Wonder 2024 Annual Report to Stockholders',
        url: 'https://s202.q4cdn.com/259407146/files/doc_financials/2024/ar/2024_Annual-Report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Light & Wonder Global Corporate Social Responsibility Report',
        url: 'https://explore.lnw.com/about/social-responsibility/',
        accessed: '27 July 2026'
      }
    ]
  },
  {
    id: 'tlc',
    name: 'The Lottery Corporation',
    ticker: 'TLC',
    sector: 'Consumer Discretionary',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2030,
      scopes: 'Scope 1 and 2',
      baseYear: null,
      interim: [],
      scope3: 'TLC states an aspiration to reduce the environmental impacts of its supply chain and its paper use, but no quantified Scope 3 target was corroborated.',
      flags: []
    },
    baseline: null,
    reported: [ { y: 2024, mt: 0.001 } ],
    boundaryNote: 'The FY2024 figure of about 1,255 tCO2e (Scope 1 932 t, Scope 2 323 t) comes from third-party aggregation rather than a company table read directly, and the Scope 2 basis is not stated. TLC demerged from Tabcorp in May 2022, so there is no comparable series before FY2023.',
    status: 'partial',
    note: 'TLC commits to net zero Scope 1+2 by 2030, one of the earliest dates in this set, from a very small operational footprint: its retail network is franchised, so the controlled boundary is offices and technology infrastructure. No base year and no abatement pathway for the 2030 date were corroborated, so it is not possible to tell how much of the claim rests on abatement versus purchased instruments.',
    verified: '27 July 2026',
    sources: [
      {
        name: 'The Lottery Corporation Sustainability Report 2025',
        url: 'https://www.thelotterycorporation.com/content/dam/projects/tlc/documents/TLC_Sustainability-Report-2025.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'The Lottery Corporation ESG Strategy',
        url: 'https://www.thelotterycorporation.com/esg-strategy',
        accessed: '27 July 2026'
      }
    ]
  },
  {
    id: 'car',
    name: 'CAR Group',
    ticker: 'CAR',
    sector: 'Communication Services',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: null,
      scopes: 'No net zero target. CAR Group states it has decided not to put a net zero target in place, because ongoing acquisitions make it hard to forecast how emissions will move as the greenhouse gas operational boundary expands. It instead maintains carbon neutral certification across its global operations.',
      baseYear: null,
      interim: [],
      scope3: 'No Scope 3 reduction target; CAR Group reports Scope 3 and is preparing to align with mandatory Australian climate disclosure (ASRS) from FY2026.',
      flags: [ 'offsets' ]
    },
    baseline: null,
    reported: [],
    boundaryNote: null,
    status: 'unverified',
    note: 'CAR Group is the clearest case in this batch of a company that discloses but declines to commit: it says in its own reporting that it has chosen not to set a net zero target, while maintaining carbon neutrality across global operations in FY2025 through purchased offsets. No absolute Scope 1+2 tonnage could be corroborated from the sources checked.',
    verified: '27 July 2026',
    sources: [
      {
        name: 'CAR Group FY24 Sustainability Report',
        url: 'https://cargroup.com/wp-content/uploads/2024/08/CAR-Group-FY24-Sustainability-Report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'CAR Group Our Approach (sustainability)',
        url: 'https://cargroup.com/our-approach/',
        accessed: '27 July 2026'
      },
      {
        name: 'CAR Group Annual Report FY25',
        url: 'https://cargroup.com/financial/accounts-and-reports/annual-report-fy25/',
        accessed: '27 July 2026'
      }
    ]
  },
  {
    id: 'tls',
    name: 'Telstra',
    ticker: 'TLS',
    sector: 'Communication Services',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Scope 1 and 2 (operational), with the FY2019 base year excluding Digicel Pacific',
      baseYear: 2019,
      interim: [
        {
          year: 2030,
          cutPct: 70,
          vsBaseYear: 2019,
          absolute: true,
          note: '70% below the FY2019 combined Scope 1+2 base year, raised in 2024 from the original 50%'
        }
      ],
      scope3: 'Telstra targets a 50% absolute reduction in Scope 3 emissions by 2030 from the FY2019 base year, unchanged when the Scope 1+2 target was raised.',
      flags: [ 'sbti-validated' ]
    },
    baseline: null,
    reported: [ { y: 2024, mt: 0.82 } ],
    boundaryNote: "The Scope 2 basis for the FY2024 figure of about 817,606 tCO2e is not stated in the sources checked, and the figure is drawn from third-party aggregation rather than read from Telstra's data pack. The FY2019 base year excludes Digicel Pacific. A published FY2019 all-scopes baseline of 3,974,980 tCO2e circulates in secondary sources but covers Scope 1, 2 and 3 combined, not Scope 1+2 alone.",
    status: 'partial',
    note: 'Telstra left the Climate Active programme on 30 June 2024, stopped buying offsets, and removed carbon neutral claims from its products, redirecting that spend to direct abatement. It raised its 2030 Scope 1+2 target from 50% to 70% at the same time, so the ambition went up as the certification came off. The SBTi register, at its 6 August 2026 export, records the near-term target (70% by FY2030 from FY2019), the long-term target (95% by FY2050) and net zero by FY2050 all as validated at 1.5 degrees. Telstra reported combined Scope 1+2 44% below the FY2019 base year in FY2025, with 116,876 MWh (73,223 tCO2e annualised) saved in FY2025 from legacy network decommissioning and efficiency work.',
    verified: '13 August 2026',
    sources: [
      {
        name: 'Telstra 2025 Bigger Picture Sustainability Report',
        url: 'https://www.telstra.com.au/content/dam/tcom/about-us/community-environment/pdf/2025-Bigger-Picture-Sustainability-Report-Remediated.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Telstra 2024 Bigger Picture Sustainability Report',
        url: 'https://www.telstra.com.au/content/dam/tcom/about-us/community-environment/pdf/2024-Telstra-Bigger-Picture-Sustainability-Report-Remediated.pdf',
        accessed: '27 July 2026'
      },
      {
        name: "Telstra Exchange, How we're evolving our climate change commitments",
        url: 'https://www.telstra.com.au/exchange/updating-our-climate-change-commitments',
        accessed: '27 July 2026'
      },
      {
        name: 'RenewEconomy, Telstra dumps offsets and carbon neutral claims',
        url: 'https://reneweconomy.com.au/telstra-dumps-offsets-and-carbon-neutral-claims-whistleblower-says-others-should-do-the-same/',
        accessed: '27 July 2026'
      }
    ]
  },
  {
    id: 'wtc',
    name: 'WiseTech Global',
    ticker: 'WTC',
    sector: 'Information Technology',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2025,
      scopes: 'Scope 1 and 2 across global operations',
      baseYear: null,
      interim: [],
      scope3: 'WiseTech reports Scope 3 of about 45,000 tCO2e in FY2025, dominated by purchased goods and services (about 34,400 tCO2e), but no Scope 3 reduction target was corroborated.',
      flags: []
    },
    baseline: null,
    reported: [ { y: 2025, mt: 0.002 } ],
    boundaryNote: "FY2025 figure is Scope 1 of about 284 tCO2e plus market-based Scope 2 of about 1,499 tCO2e, a combined 1,783 tCO2e, from third-party aggregation of WiseTech's FY2025 reporting.",
    status: 'partial',
    note: "WiseTech's net zero date is for operations only and falls in 2025, so the claim is already due; its stated critical step is moving to 100% low or no emissions electricity. Scope 1+2 are about 4% of its total footprint, with the value chain carrying the rest and no target attached to it. No base year was corroborated, so the 2025 claim cannot be measured against a starting point.",
    verified: '27 July 2026',
    sources: [
      {
        name: 'WiseTech Global Annual Report 2025',
        url: 'https://www.wisetechglobal.com/media/c2cf32os/wtc-2025-annual-report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'WiseTech Global Environment',
        url: 'https://www.wisetechglobal.com/investors/sustainability/environment/',
        accessed: '27 July 2026'
      }
    ]
  },
  {
    id: 'xro',
    name: 'Xero',
    ticker: 'XRO',
    sector: 'Information Technology',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Company stated net zero by 2050; the SBTi validated near-term target covers absolute Scope 1 and 2, with separate Scope 3 and supplier engagement targets',
      baseYear: 2024,
      interim: [
        {
          year: 2034,
          cutPct: 58.8,
          vsBaseYear: 2024,
          absolute: true,
          note: '58.8% absolute cut in Scope 1 and 2 by FY2034 from an FY2024 base year, validated by the SBTi at 1.5 degrees; the earlier company stated target of a 42% cut by 2030 from an FY2020 base of 991.25 tCO2e is not the target the register carries'
        }
      ],
      scope3: 'The SBTi register records a 35% absolute cut in Scope 3 from purchased goods and services and business travel by FY2034, and 67.4% of suppliers by emissions holding science based targets by FY2029. An earlier company stated 17% Scope 3 cut by 2030 sat on the superseded FY2020 base of about 16,193 tCO2e.',
      flags: [ 'offsets', 'aspirational', 'sbti-validated' ]
    },
    baseline: null,
    reported: [ { y: 2020, mt: 0.001 } ],
    boundaryNote: "Xero's financial year ends 31 March, so its FY labels are offset from the June-end reporters in this set. The single reported point is the FY2020 Scope 1 and 2 total of 991.25 tCO2e, which belonged to the superseded target. No tonnage has been verified for the FY2024 base year the validated target is cut from, so no claimed line is drawn: pricing the 58.8% cut without that base year figure would be a guess.",
    status: 'partial',
    note: "The SBTi register, at its 6 August 2026 export, records Xero's near-term target as validated at 1.5 degrees, a 58.8% absolute cut in Scope 1 and 2 by FY2034 from an FY2024 base year, so the validated flag now applies. The same record removes Xero's net zero commitment for expiry, which leaves the 2050 date as a company statement with nothing on the register behind it. Xero has offset 100% of its emissions since FY2019 and holds carbon neutral certification, so its present-day neutrality claim rests on purchased offsets rather than abatement.",
    verified: '13 August 2026',
    sources: [
      {
        name: 'Xero FY25 Sustainability Report',
        url: 'https://www.listcorp.com/asx/xro/xero-limited/news/fy25-sustainability-report-3189699.html',
        accessed: '27 July 2026'
      },
      {
        name: 'Xero sets climate targets to work towards a net-zero future',
        url: 'https://www.xero.com/us/media-releases/xero-sets-climate-targets/',
        accessed: '27 July 2026'
      },
      {
        name: 'Xero Sustainability, Our Environment',
        url: 'https://www.xero.com/us/sustainability/environment/',
        accessed: '27 July 2026'
      },
      {
        name: 'Xero Limited FY24 Climate Appendix',
        url: 'https://www.aspecthuntley.com.au/asxdata/20240523/pdf/02809623.pdf',
        accessed: '27 July 2026'
      }
    ]
  },
  {
    id: 'csl',
    name: 'CSL',
    ticker: 'CSL',
    sector: 'Health Care',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: null,
      scopes: 'Scope 1 and 2 (absolute, own operations)',
      baseYear: 2021,
      interim: [
        {
          year: 2030,
          cutPct: 42,
          vsBaseYear: 2021,
          absolute: true,
          note: '42% absolute cut in Scope 1 and 2 by FY2030 from an FY2021 base year; raised from the 40% target announced in 2022 when the target was aligned to the SBTi reporting period'
        }
      ],
      scope3: 'Supplier engagement rather than an absolute cut: CSL commits that suppliers covering 73.1% of its Scope 3 emissions (purchased goods and services, capital goods, upstream and downstream transport, business travel) will have science-based targets by FY2030.',
      flags: [ 'sbti-validated' ]
    },
    baseline: { year: 2021, mt: 0.32 },
    reported: [
      { y: 2020, mt: 0.34 },
      { y: 2021, mt: 0.32 },
      { y: 2022, mt: 0.35 },
      { y: 2023, mt: 0.34 },
      { y: 2024, mt: 0.35 },
      { y: 2025, mt: 0.29 }
    ],
    boundaryNote: 'CSL historically reported environmental data on an April to March year; from 2025 it aligned emissions reporting to the group financial year ended 30 June, so the earlier points in this series sit on the older year basis.',
    status: 'partial',
    verified: '27 July 2026',
    sources: [
      {
        name: 'CSL Annual Report 2025',
        url: 'https://www.csl.com/-/media/shared/documents/annual-report/csl-annual-report-2025.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'CSL 2025 Sustainability Fact Sheet',
        url: 'https://www.csl.com/-/media/one-csl/sustainability/data-and-reporting-centre/documents/csl-sustainability-fact-sheet-2025.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'CSL Impact Report 2025',
        url: 'https://investors.csl.com/impactreport/2025/',
        accessed: '27 July 2026'
      }
    ],
    note: 'Emissions rose above the FY2021 base year in FY2022 to FY2024 and fell to 286 kt in FY2025 after Australian sites moved to a renewable power purchase agreement, about 12% below the 324 kt base year against the 42% cut due by FY2030; CSL describes the FY2025 position as about a 14% reduction, which points to a restated base year.'
  },
  {
    id: 'coh',
    name: 'Cochlear',
    ticker: 'COH',
    sector: 'Health Care',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2030,
      scopes: 'Scope 1 and 2 (operations, manufacturing sites the main source)',
      baseYear: 2019,
      interim: [],
      scope3: 'Cochlear disclosed and externally assured a full Scope 3 inventory for the first time in FY2025 and names product distribution and business travel as about 70% of total emissions, but no Scope 3 reduction target was corroborated.',
      flags: []
    },
    baseline: null,
    reported: [],
    boundaryNote: 'The reduction Cochlear reports is measured against an FY2019 base year and is framed around its manufacturing sites rather than the whole group.',
    status: 'unverified',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Cochlear Limited Annual Report 2025 (incorporating sustainability reporting)',
        url: 'https://www.cochlear.com/us/en/corporate/investors/annual-reports',
        accessed: '27 July 2026'
      },
      {
        name: 'Cochlear Europe Limited Carbon Reduction Plan (PPN 06/21), August 2025',
        url: 'https://assets.cochlear.com/api/public/content/1e5637b8249f4534948b97e34b143e6b',
        accessed: '27 July 2026'
      },
      {
        name: 'Cochlear ASX announcement, 15 August 2025 (FY25 results)',
        url: 'https://assets.cochlear.com/api/public/content/3e225db043454396ba51833daf34b7c5',
        accessed: '27 July 2026'
      }
    ],
    note: 'Cochlear states a 71% cut in Scope 1 and 2 emissions from its FY2019 base year, ahead of its 2025 milestone, and 99% renewable energy across manufacturing sites in FY2025, but no absolute tonnage for any year could be corroborated in this review.'
  },
  {
    id: 'rmd',
    name: 'ResMed',
    ticker: 'RMD',
    sector: 'Health Care',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Net zero across the value chain by FY2050; near-term target covers absolute Scope 1 and 2',
      baseYear: 2022,
      interim: [
        {
          year: 2030,
          cutPct: 42,
          vsBaseYear: 2022,
          absolute: true,
          note: '42% absolute cut in Scope 1 and 2 by FY2030 from an FY2022 base year, described by ResMed as set in line with SBTi guidance; the SBTi register carries no validated target for ResMed and records its commitment as removed'
        }
      ],
      scope3: 'Net zero is stated across the whole value chain by FY2050; no separate corroborated near-term Scope 3 reduction target.',
      flags: [ 'exited-sbti' ]
    },
    baseline: null,
    reported: [ { y: 2025, mt: 0.028 } ],
    boundaryNote: 'ResMed is US domiciled and reports in metric tonnes on a 1 July to 30 June financial year; the FY2025 figure is total operational Scope 1 and 2 (Scope 1 of 3,957 tonnes) and the market-based versus location-based basis of Scope 2 was not established.',
    status: 'partial',
    verified: '13 August 2026',
    sources: [
      {
        name: 'ResMed Sustainability Report 2025',
        url: 'https://document.resmed.com/documents/global/ResMed_Sustainability_report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'ResMed UK Carbon Reduction Plan, reporting year 2025 (1 July 2024 to 30 June 2025)',
        url: 'https://document.resmed.com/documents/uk/Resmed-UK-PPN-0621-Carbon-Reduction-Plan-2025-SIGNED.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Tracenable, ResMed greenhouse gas emissions data (secondary, used to corroborate FY2025 totals)',
        url: 'https://tracenable.com/company/resmed/ghg-emissions',
        accessed: '27 July 2026'
      }
    ],
    note: 'Total operational Scope 1 and 2 emissions were 27,530 tonnes in FY2025, about 4% below FY2024, with only the single latest year corroborated so progress against the FY2022 base year cannot be measured here. The SBTi register, at its 6 August 2026 export, records both the near-term and net zero commitments as removed for expiry, on a register record last updated 23 February 2023, which is a stronger statement than an unvalidated target: ResMed signed up and the commitment lapsed.'
  },
  {
    id: 'shl',
    name: 'Sonic Healthcare',
    ticker: 'SHL',
    sector: 'Health Care',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: null,
      scopes: 'Scope 1 and 2 (global operations, Scope 2 market-based)',
      baseYear: 2021,
      interim: [
        {
          year: 2030,
          cutPct: 43,
          vsBaseYear: 2021,
          absolute: true,
          note: '43% cut in global Scope 1 and 2 emissions by FY2030 from an FY2021 base year'
        }
      ],
      scope3: 'Sonic states a long-term net zero ambition but no Scope 3 target or year was corroborated in this review.',
      flags: []
    },
    baseline: { year: 2021, mt: 0.12 },
    reported: [ { y: 2021, mt: 0.12 }, { y: 2024, mt: 0.094 }, { y: 2025, mt: 0.088 } ],
    boundaryNote: 'Scope 2 is market-based; Sonic implemented improved Scope 1 and 2 calculation practices in FY2025, so earlier years may sit on a different basis to the FY2025 figure.',
    status: 'partial',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Sonic Healthcare Sustainability Report 2025',
        url: 'https://investors.sonichealthcare.com/FormBuilder/_Resource/_module/T8Ln_c4ibUqyFnnNe9zNRA/docs/Sustainability/SHL_Sustainability-Report_2025.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Sonic Healthcare Greenhouse gas inventory FY2025, basis of preparation, Scope 1 and 2 emissions',
        url: 'https://www.sonichealthcare.com/media/n5en2r5m/shl_fy2025_ghg-emissions-inventory_bop-scope-1-and-2.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Sonic Healthcare Climate and Environment Policy, August 2025',
        url: 'https://investors.sonichealthcare.com/FormBuilder/_Resource/_module/T8Ln_c4ibUqyFnnNe9zNRA/file/SHL_ClimateandEnvironmentPolicy_2025.pdf',
        accessed: '27 July 2026'
      }
    ],
    note: 'Scope 1 and 2 fell from 121,551 tonnes in FY2021 to 88,415 tonnes in FY2025, a 27% cut on the published base year figures, while Sonic states 22.6% for the same period, which indicates the FY2021 base year has been restated under the FY2025 calculation method.'
  },
  {
    id: 'sig',
    name: 'Sigma Healthcare',
    ticker: 'SIG',
    sector: 'Health Care',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: null,
      scopes: 'No net zero commitment corroborated; reporting covers Scope 1 and 2 for the Sigma wholesale and distribution business',
      baseYear: null,
      interim: [],
      scope3: 'No Scope 3 target corroborated; Sigma has referenced the GRI Standards and the TCFD recommendations in earlier sustainability reports.',
      flags: []
    },
    baseline: null,
    reported: [ { y: 2023, mt: 0.009 } ],
    boundaryNote: 'Sigma reported on a financial year ending 31 January, so the point labelled 2023 is the year ended 31 January 2023; after the Chemist Warehouse Group merger completed on 12 February 2025 the reporting period moves to 1 July to 30 June, and the last standalone sustainability report covered 1 February 2024 to 31 January 2025.',
    status: 'partial',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Sigma Healthcare Limited Annual Report 2024/25',
        url: 'https://investorcentre.sigmahealthcare.com.au/static-files/49507ac8-af4f-4537-ab2f-32a60e708de8',
        accessed: '27 July 2026'
      },
      {
        name: 'Sigma Healthcare Sustainability Report 2022/23',
        url: 'https://investorcentre.sigmahealthcare.com.au/static-files/e3a777f0-df95-4dba-a06b-c955dfd08dc2',
        accessed: '27 July 2026'
      },
      {
        name: 'Sigma Healthcare investor centre, corporate sustainability',
        url: 'https://investorcentre.sigmahealthcare.com.au/corporate-sustainability',
        accessed: '27 July 2026'
      }
    ],
    note: 'The only corroborated figure is total Scope 1 and 2 of 8,613 tonnes for the year ended 31 January 2023, down 23% on the prior year; no emissions target and no post-merger emissions data covering the enlarged Chemist Warehouse Group could be corroborated.'
  },
  {
    id: 'mpl',
    name: 'Medibank',
    ticker: 'MPL',
    sector: 'Health Care',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2040,
      scopes: 'Net zero Scope 1 and 2 from FY2025 (claimed met); net zero Scope 3 by no later than 2040',
      baseYear: 2021,
      interim: [
        {
          year: 2025,
          cutPct: 100,
          vsBaseYear: 2021,
          absolute: true,
          note: 'net zero Scope 1 and 2 by FY2025; Medibank states the target was met at 30 June 2025, with residual emissions equal to 2.55% of base year Scope 1 and 2 covered by purchased carbon removals from the Verra-certified Delta Blue Carbon project'
        }
      ],
      scope3: 'Medibank targets at least a 50% cut in Scope 3 emissions by 2030 and net zero Scope 3 by no later than 2040; the FY2021 Scope 1, 2 and 3 baseline has been recalculated in preparation for AASB S2 reporting.',
      flags: [ 'offsets' ]
    },
    baseline: null,
    reported: [],
    boundaryNote: 'Medibank has re-baselined its FY2021 Scope 1, 2 and 3 inventory under the GHG Protocol Corporate Standard for AASB S2 and is reassessing its targets, so the pre-restatement and post-restatement series are not comparable.',
    status: 'unverified',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Medibank Sustainability Summary 2025',
        url: 'https://www.medibank.com.au/content/dam/retail/about-assets/pdfs/investor-centre/annual-reports/Medibank_SustainabilitySummary2025.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Medibank Annual Report 2025',
        url: 'https://www.medibank.com.au/content/dam/retail/about-assets/pdfs/investor-centre/annual-reports/Medibank_AnnualReport2025.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Climate Active, Medibank Private certified member record',
        url: 'https://www.climateactive.org.au/buy-climate-active/certified-members/medibank-private',
        accessed: '27 July 2026'
      }
    ],
    note: 'Medibank claims it met net zero Scope 1 and 2 at 30 June 2025 by cutting emissions and retiring carbon removals equal to 2.55% of its base year, it has since re-baselined FY2021 and is reassessing its targets, and its Climate Active carbon neutral certification, held since 2019, ended when its withdrawal from the programme took effect on 7 May 2026; no absolute tonnage for any year could be corroborated.'
  },
  {
    id: 'gmg',
    name: 'Goodman Group',
    ticker: 'GMG',
    sector: 'Real Estate',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2050,
      scopes: 'Absolute Scope 1 and 2 for corporate activities and the parts of the portfolio Goodman operationally controls; the 2050 net zero date is company stated, since the SBTi register records that commitment as removed',
      baseYear: 2021,
      interim: [
        {
          year: 2030,
          cutPct: 42,
          vsBaseYear: 2021,
          absolute: true,
          note: '42% absolute cut in Scope 1 and 2 by 2030 from an FY2021 base year, validated by the SBTi'
        }
      ],
      scope3: 'Goodman targets a 50% cut in Scope 3 emissions per square metre by 2030 from an FY2021 base year, covering downstream leased and sold assets, which is an intensity target rather than an absolute one.',
      flags: [ 'offsets', 'sbti-validated' ]
    },
    baseline: null,
    reported: [ { y: 2022, mt: 0.033 } ],
    boundaryNote: "The FY2022 figure is location-based Scope 1 and 2; the Climate Active certification boundary covers corporate activities and areas where Goodman controls day to day operations, and excludes customers' activities in leased areas and embodied emissions.",
    status: 'partial',
    verified: '13 August 2026',
    sources: [
      {
        name: 'Goodman Group Annual Report 2025',
        url: 'https://www.goodman.com/-/media/project/goodman/global/files/investor-centre/gmg-goodman-group/announcements/asx-announcements/2025/2-goodman-2025-annual-report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Goodman Group Sustainability Report 2022, ESG metrics',
        url: 'https://2022sustainabilityreport.goodman.com/esg-metrics/',
        accessed: '27 July 2026'
      },
      {
        name: 'Climate Active Public Disclosure Statement, Goodman Group FY2021-22',
        url: 'https://www.climateactive.org.au/sites/default/files/2023-09/Public%20Disclosure%20Statement%20-%20Goodman%20Group%20-%20FY2021-22%20(002).docx.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Climate Active, Goodman Group certified member record',
        url: 'https://www.climateactive.org.au/buy-climate-active/certified-members/goodman-group',
        accessed: '27 July 2026'
      }
    ],
    note: 'Goodman reached carbon neutral certification for its global operations about four years ahead of its 2025 target, using emissions cuts, GreenPower and international renewable energy certificates plus 100% Australian Carbon Credit Units for the residual, and it has withdrawn its Climate Active organisation certification effective 30 June 2026 while keeping its NABERS buildings profile; only one year of absolute Scope 1 and 2 data, 32,870 tonnes location-based in FY2022, could be corroborated. The SBTi register, at its 6 August 2026 export, validates the 42% by FY2030 near-term target but records the net zero commitment as removed for expiry, so the validated flag on this card covers the 2030 cut and not the 2050 date.'
  },
  {
    id: 'gpt',
    name: 'GPT Group',
    ticker: 'GPT',
    sector: 'Real Estate',
    yearBasis: 'CY',
    commitment: {
      netZeroYear: null,
      scopes: 'Scope 1 and 2 for assets GPT owns and manages and where it has principal decision making authority',
      baseYear: 2005,
      interim: [
        {
          year: 2030,
          cutPct: 98,
          vsBaseYear: 2005,
          absolute: true,
          note: '98% cut in operational emissions by 2030 from a 2005 baseline of 238,750 tonnes; GPT also committed to carbon neutral operations across all managed assets from 2024 and upfront embodied carbon neutral developments it controls from 2023'
        }
      ],
      scope3: 'GPT states that its emissions reduction targets cover Scope 3 as well as operational emissions, and it commits to upfront embodied carbon neutral developments where it has control, but no absolute Scope 3 reduction figure was corroborated.',
      flags: [ 'offsets' ]
    },
    baseline: { year: 2005, mt: 0.24 },
    reported: [],
    boundaryNote: 'GPT reports on a calendar year and its carbon neutral claim rests on Climate Active certification, so headline figures are net of retired offsets rather than gross Scope 1 and 2; the certification scheme itself is closing, with certification expected to cease on 30 June 2027.',
    status: 'unverified',
    verified: '27 July 2026',
    sources: [
      {
        name: 'The GPT Group Climate and Nature Disclosure Statement 2024',
        url: 'https://www.gpt.com.au/sites/default/files/inline-uploads/Climate%20and%20Nature%20Disclosure%20Statement%202024_1.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Climate Active Public Disclosure Statement, GPT Management Holdings CY2023',
        url: 'https://www.climateactive.org.au/sites/default/files/2024-11/GPT%20Group%20Public%20Disclosure%20Statement%20CY2023_SIGNED_0.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'GPT Sustainability Report microsite, environment',
        url: 'https://sustainability.gpt.com.au/environment/',
        accessed: '27 July 2026'
      }
    ],
    note: 'GPT says its owned and managed assets are certified carbon neutral and that it has delivered 87.5% of the reduction required by its 2030 target of a 98% cut from a 2005 baseline of 238,750 tonnes, but the only absolute Scope 1 and 2 figures found for a recent year came from a third-party aggregator whose components did not reconcile with its own stated total, so no series is recorded here.'
  },
  {
    id: 'scg',
    name: 'Scentre Group',
    ticker: 'SCG',
    sector: 'Real Estate',
    yearBasis: 'CY',
    commitment: {
      netZeroYear: 2030,
      scopes: 'Scope 1 and 2 across the wholly-owned Westfield portfolio',
      baseYear: 2014,
      interim: [
        {
          year: 2025,
          cutPct: 50,
          vsBaseYear: 2014,
          absolute: true,
          note: 'at least 50% of the net zero target delivered by 2025, that is a 50% cut in Scope 1 and 2 against the 2014 base year'
        }
      ],
      scope3: 'No Scope 3 target was corroborated; the 2030 net zero commitment is limited to Scope 1 and 2 across wholly-owned centres.',
      flags: []
    },
    baseline: null,
    reported: [ { y: 2024, mt: 0.17 } ],
    boundaryNote: 'Scope 2 is market-based at 159,791 tonnes for 2024, against 175,110 tonnes location-based; the target boundary is the wholly-owned portfolio while emissions are reported portfolio wide, and about 94% of the total is electricity.',
    status: 'partial',
    verified: '27 July 2026',
    sources: [
      {
        name: 'Scentre Group 2024 Responsible Business Report',
        url: 'https://assets.ctfassets.net/0vreywxqlgab/5fKY1xKxf11o4QTNMu5SRh/1e6f20fe63021d822ea7d79b1ddb7698/2024_Responsible_Business_Report.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Scentre Group 2024 Responsible Business limited assurance statement, EY',
        url: 'https://assets.ctfassets.net/0vreywxqlgab/3krRUFoThZKUZuo7ppZ33J/38033fdf5d0f03f1f9f2c7414e7d3da9/SCG_2024_Responsible_Business_Limited_Assurance_Statement.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Scentre Group, reporting and data',
        url: 'https://www.scentregroup.com/sustainability/reporting-data',
        accessed: '27 July 2026'
      }
    ],
    note: 'Scope 1 and 2 were 170,002 tonnes in 2024 on a market-based basis, which Scentre reports as a 41% cut since 2014, short of the halving it set for 2025 and reliant on further renewable electricity agreements to reach net zero by 2030.'
  },
  {
    id: 'sgp',
    name: 'Stockland',
    ticker: 'SGP',
    sector: 'Real Estate',
    yearBasis: 'FY',
    commitment: {
      netZeroYear: 2028,
      scopes: 'Scope 1 and 2 across all business activities, covering about 170 active assets and projects in Australia including residential development emissions',
      baseYear: null,
      interim: [
        {
          year: 2028,
          cutPct: 100,
          vsBaseYear: null,
          absolute: true,
          note: 'net zero Scope 1 and 2 by 2028, brought forward from 2030 and extended across all business activities; Stockland states it reached net zero Scope 1 and 2 in 2025, three years early'
        }
      ],
      scope3: 'No dated Scope 3 target was corroborated; Stockland describes lower carbon concrete and steel partnerships to reduce Scope 3 emissions across its development pipeline.',
      flags: [ 'offsets', 'exited-sbti' ]
    },
    baseline: null,
    reported: [],
    boundaryNote: 'The net zero claim is a net position, reached with onsite rooftop solar, purchased renewable electricity certificates and the retirement of nature-based carbon offsets, so it is not a gross Scope 1 and 2 figure.',
    status: 'unverified',
    verified: '13 August 2026',
    sources: [
      {
        name: 'Stockland media release, achieves net zero Scope 1 and 2 emissions with scalable renewable model',
        url: 'https://www.stockland.com.au/contentassets/7efd87c6a0b64ae297909f670af3103f/media-release_net-zero-scope-1-and-2.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Stockland FY25 Environmental Management Approach',
        url: 'https://www.stockland.com.au/globalassets/esg/fy25/stockland-fy25-environmental-management-approach.pdf',
        accessed: '27 July 2026'
      },
      {
        name: 'Stockland, Net Zero',
        url: 'https://www.stockland.com.au/sustainability/net-zero',
        accessed: '27 July 2026'
      },
      {
        name: 'Stockland media release, accelerates Net Zero Carbon commitment to 2028',
        url: 'https://www.stockland.com.au/media-centre/media-releases/stockland-accelerates-net-zero-carbon-commitment-to-2028',
        accessed: '27 July 2026'
      }
    ],
    note: 'Stockland states it reached net zero Scope 1 and 2 in 2025, three years ahead of its 2028 target, using 75,000 rooftop solar panels of up to 45 MWp, purchased large-scale generation certificates and a small volume of retired nature-based offsets, but no absolute Scope 1 and 2 tonnage for any year could be corroborated. The SBTi register, at its 6 August 2026 export, records its near-term and net zero commitments as removed for expiry, on a register record last updated 1 September 2021, so the 2028 claim rests on Stockland alone.'
  },
];

// The one dark band: a few companies worth reading twice.
export const SPOTLIGHTS = {
  ids: ['wds', 'nst', 'csl'],
  tag: 'Worth a second look',
  kicker: 'Three cases',
  title: ['Where the gap', 'is a decision'],
  lead: 'Most of the distance between a claimed line and a reported one is not a measurement problem. It is a choice about what the company will do first, what it will buy to cover the rest, and what it will leave until the target year is close.',
  items: [
    {
      id: 'wds',
      head: 'The word doing the work is net',
      body: 'Woodside declared its 2025 milestone delivered, and on the target\'s own terms it was: net equity emissions of 5.33 Mt against a line at 5.37. But gross equity emissions were about 6.62 Mt that year, higher than the 6.32 Mt starting base, and 1.28 Mt of retired carbon credits closed the distance. Both numbers are disclosed. Only one of them is the one the chart is usually drawn from, which is why this card names the other.',
    },
    {
      id: 'nst',
      head: 'A cut promised while the mine grows',
      body: 'Northern Star\'s 35 per cent cut is measured from a 931 kt baseline set in 2020. FY2025 emissions were 1.30 Mt, roughly 40 per cent above that starting point, as production and the KCGM expansion grew. The company reports progress as cumulative tonnes avoided since FY2022, which is a real quantity, and also a different one from the falling absolute line the target is written in.',
    },
    {
      id: 'csl',
      head: 'No net zero date, and a real target anyway',
      body: 'CSL is one of the few companies here with no net zero year at all. What it has instead is an SBTi validated 42 per cent cut by FY2030 and a published series, which sat above the base year for three straight years before a renewable power deal pulled FY2025 down to about 12 per cent below it. A dated absolute cut with a published series behind it is a far more testable thing than a distant zero with neither.',
    },
  ],
};

// The clear-eyed close, progress style: both columns true at once.
export const SUMMARY = {
  tag: 'The honest read',
  kicker: 'What the ledger adds up to',
  title: ['Well stated,', 'thinly evidenced'],
  lead: 'Reading every card in one sitting leaves two impressions, and they do not cancel each other out.',
  moving: {
    head: 'What the record supports',
    items: [
      '42 of the 50 carry a dated net zero commitment, and 32 back it with an absolute tonnage target for the 2030 era. Five years ago neither count would have been close.',
      'Some targets got harder. Telstra lifted its 2030 cut from 50 to 70 per cent as it walked away from offset backed neutrality claims, and Woolworths replaced its old target with a deeper SBTi validated one.',
      'Suncorp pulled its operational net zero date forward by twenty years, and Transurban passed its 2030 halving seven years early on renewable electricity contracts.',
      'The best disclosers leave nothing to reconstruct. BHP publishes a restated baseline and a clean series, and sits about 25 per cent below its own claimed line without counting a single credit.',
    ],
  },
  short: {
    head: 'What the charts do not support',
    items: [
      'Only 16 of the 50 publish enough verified data to be checked against their own line, and 7 of those 16 are behind it. For most of the rest the claim simply cannot be tested from what is public.',
      'Woodside met its 2025 target on a net basis by retiring 1.28 Mt of carbon credits, while its gross equity emissions never fell below the base the target is cut from.',
      'The retreat is real: QBE withdrew its 2050 targets for underwriting and investments, Santos moved Scope 2 net zero out a decade, Macquarie was the first major Australian bank to leave the Net-Zero Banking Alliance, and the alliance itself has since ceased operations. The SBTi register carries expired commitments for Fortescue, ASX Limited, Stockland and ResMed, and has removed the net zero commitments of Goodman and Xero for the same reason.',
      'Five companies have no net zero commitment this page could find at all, and one of them, CAR Group, says in its own reporting that it has chosen not to set one while calling its operations carbon neutral on purchased offsets.',
    ],
  },
  close: 'None of this is an accusation. A company can be behind its own line for defensible reasons and still be doing more than a company sitting comfortably ahead of a soft one. What the page insists on is that the claim and the record be shown at the same size, on the same axis, with the date on both.',
};

// Common sources. Per company sources live on each company object and are
// listed separately in the method section.
export const SOURCES = {
  cer_nger: {
    name: 'Clean Energy Regulator, published NGER data',
    detail: 'Corporate emissions and energy data reported under the National Greenhouse and Energy Reporting scheme, used to cross check company reported Scope 1 and 2 figures for Australian operations.',
    url: 'https://cer.gov.au/markets/reports-and-data/national-greenhouse-and-energy-reporting-data',
    accessed: '27 July 2026',
  },
  ca100: {
    name: 'Climate Action 100+ Net Zero Company Benchmark',
    detail: 'Independent assessment of target coverage, ambition and alignment for the largest listed emitters, used to corroborate scope coverage and to flag aspirational wording.',
    url: 'https://www.climateaction100.org/progress/net-zero-company-benchmark/',
    accessed: '27 July 2026',
  },
  sbti: {
    name: 'Science Based Targets initiative, Companies Taking Action export, snapshot of 6 August 2026',
    detail: 'The public register of commitments and validated targets, read as the full companies export, and used only to set the validated and exited flags, to confirm target years and to record a commitment the register shows as removed. The export states no publication date of its own, so it is dated by its latest updated record and its file timestamps, both 6 August 2026.',
    url: 'https://sciencebasedtargets.org/companies-taking-action',
    accessed: '13 August 2026',
  },
};

// In-page basis of preparation, in the footprint method style.
export const METHOD = {
  tag: 'Basis of preparation',
  title: ['How this tracker', 'is built'],
  sub: 'What is counted, how the claimed line is drawn, what the tracking labels mean, and everything this page deliberately leaves out. If a figure could not be read from a published disclosure, it is not on a card.',
  blocks: [
    {
      icon: 'people',
      title: 'The fifty, and how they were compiled',
      paras: [
        'The companies are the constituents of the S&P/ASX 50 as at the June 2026 quarterly rebalance, which brought ALS in for Pro Medicus, following the March 2026 review that added Light and Wonder and PLS Group for Seek and TechnologyOne. Index membership shifts quarterly, so the tail of the list is checked at each review and the make up is stated here.',
        'Every figure was compiled from the company\'s own disclosures, its annual, sustainability, climate or transition reports, and cross checked against published summaries, regulator data and independent registers. Where a number could not be confirmed back to the company\'s own reporting it was left out, and the company is marked partial or unverified. A series read off a chart label is marked partial as well, because a printed label carries rounding a table would not.',
        'More than half the ledger fails some part of that test, which is what the status at the foot of every card records.',
      ],
    },
    {
      icon: 'list',
      title: 'What is counted',
      paras: [
        'Every figure charted is Scope 1 and 2 emissions on the company\'s own reporting basis, in Mt CO2e. Scope 2 is market based where the company discloses it, and where only a location based figure exists that is noted on the card.',
        'Financial years are labelled by the year they end in. A company that reports on a calendar year is labelled CY and its years are not shifted to line up with anyone else\'s. Several companies end their year in March, September or January; each card\'s boundary note says so.',
        'Where the reported series and the target sit on different boundaries, for example equity share against operational control, the card says so. One company, Origin Energy, is charted on a Scope 1, 2 and 3 boundary because that is the boundary its own headline target is set on; its card states this.',
      ],
    },
    {
      icon: 'target',
      title: 'How the claimed line is drawn',
      paras: [
        'The line starts at the company\'s stated base year and baseline level, passes through any absolute interim target, and ends at zero in the stated net zero year. It is straight between those anchors because those anchors are all the company has committed to. A company with an absolute interim target but no net zero year gets a line that ends at its last interim and never reaches zero, which is exactly what it has committed to.',
        'Intensity targets are not drawn. An intensity target says nothing about a tonnage on its own, and converting one into tonnes would require a production forecast this page does not have. Where a company\'s only interim target is an intensity one, the chart shows the reported line alone and says so.',
        'An interim target cut from a base year other than the one the baseline is held on is skipped, because pricing it would need that other year\'s level.',
        'A company with no verifiable baseline, or with neither an absolute interim target nor a net zero year, gets no claimed line at all.',
      ],
    },
    {
      icon: 'chart',
      title: 'What the tracking labels mean',
      paras: [
        'The label compares one number against one number: the latest reported year against the claimed line interpolated to that same year. Inside five per cent either way reads as on the line, below reads as ahead, above reads as behind.',
        'The five per cent band is a judgement. It exists because a single reporting year is a noisy way to judge a path that runs to 2050, and a company should not be labelled behind for a rounding difference.',
        'Not assessable means exactly that: no claimed line, no reported year, or a reported year that falls outside the claimed line\'s range. It is not a judgement about the company.',
      ],
    },
    {
      icon: 'book',
      title: 'Sources and verification',
      paras: [
        'Company reports come first: the annual report, the sustainability or climate report, and the climate transition action plan where one exists. Clean Energy Regulator NGER data and independent registers are used to cross check a figure that already came from the company.',
        'The August 2026 review read seven of those reports directly, and each of those cards names the file and the page the table sits on: the Aristocrat FY25 Sustainability Report (p37), the James Hardie FY2025 Sustainability Report (p39), the Brambles Sustainability Review 2025 (p21 table and p20 chart), the Evolution Mining Integrated Sustainability Report 2025 (p90), the NAB Climate Report 2025 (p48 and p49) with the 2023 report (p61), the APA FY25 Sustainability Data Book (p42 and p43) with the 2025 Climate Transition Plan (p13), and the Santos Climate Strategy Update 2025 (p4 and p5). Seven cards that had no series before now carry one, which is why the assessable count moved.',
        'Climate Action 100+ and the Science Based Targets initiative register are used only to corroborate scope coverage and to set the validated, weakened and alliance flags. The register is read as the Companies Taking Action export, snapshot of 6 August 2026. Where that record and a company\'s own wording disagree about a target year the register is followed and the card says so, which is why Computershare now shows FY2033 and Xero FY2034, both moved from the 2030 shown previously. A commitment the register shows as removed is recorded as removed, with the date and the reason, because a lapsed commitment is a different fact from a target that was never submitted. A handful of single year figures rest on third party compilations of company reporting; every card that leans on one says so in its boundary note.',
        'Where two sources conflict, the company\'s most recent report is used and the conflict is named on the card, and where it could not be resolved at all no number is shown. Where a series has been restated, the restated basis is used consistently across all years, and three companies with restatements in flight are flagged as such.',
      ],
    },
    {
      icon: 'clock',
      title: 'Freshness',
      paras: [
        'Every company carries its own verified date, because annual reports land at different times of the year and a page level date would hide that.',
        'The page level date at the top and the bottom comes from one field, so it cannot drift apart. The review cadence is twice yearly, after the reporting season and again when NGER data publishes.',
      ],
    },
    {
      icon: 'globe',
      title: 'What this is not',
      paras: [
        'This is not a ranking and there is no score. Two companies with the same distance from their own line can have set targets of wildly different ambition, and the page will not pretend otherwise.',
        'It is not a forecast. Nothing here predicts whether a target will be met; it only shows the distance between the claim and the record so far.',
        'The scoreboard counts companies. One large emitter behind its line matters far more for the atmosphere than several small ones ahead of theirs, and a count cannot show that.',
        'Scope 3 is outside the charts. For the energy companies and the banks on this list that is where most of the emissions are, and the cards say so in words because the numbers are not comparable enough to plot.',
      ],
    },
  ],
};

export const FOOT = {
  name: 'Chris Wang · 2026',
  back: 'Back to profile',
};
