// All copy and fund data for Super Fund Holdings (/super/). Words and numbers
// live here, not in components. Australian English, no em dashes, Chris's
// voice: plain, direct, honest about what is and is not verified.
//
// DATA HONESTY NOTE (read before editing):
//   Portfolio holdings disclosures under s1017BB of the Corporations Act are
//   published as CSV/PDF within 90 days of 31 December and 30 June each year.
//   In this build the CSV and PDF files could not be opened directly, so the
//   figures below were assembled from fund websites, published investment
//   guides, Market Forces fund analysis and news coverage, verified through
//   web search on 21 July 2026. Where a weighting could not be verified to
//   the disclosure CSV it is named without a number and marked pending. No
//   decimal is ever invented. Every field carries a confidence flag the UI
//   renders. Strategic asset allocations are indicative weights from each
//   fund's published guide; the exact current split sits in the fund's own
//   disclosure and moves between cycles.

export const VERIFIED = '21 July 2026';
export const CYCLE = 'Holdings as at 31 December 2025, published by around the end of March 2026';

// ---------------------------------------------------------------- confidence
// One shared vocabulary for how sure we are of a field. The UI renders each
// as a small mono chip so a reader can see, per line, what stands behind it.
export const CONFIDENCE = {
  sourced: {
    label: 'Sourced',
    note: 'Taken from a published fund document or statement and verified via web search.',
  },
  indicative: {
    label: 'Indicative',
    note: 'A rounded strategic weight from the fund\'s published investment guide. The exact current split is in the fund\'s own disclosure and shifts between cycles.',
  },
  reported: {
    label: 'Reported',
    note: 'A named holding or shareholding widely reported in fund analysis or news, but not re-checked against this cycle\'s disclosure file.',
  },
  pending: {
    label: 'Pending',
    note: 'The holding is named, but its weighting in the option could not be verified against the 31 December 2025 disclosure file and is not stated. A number will be added once the file is read.',
  },
  quote: {
    label: 'Stated position',
    note: 'A paraphrase of the fund\'s own published sustainability position. Read against the linked page; treat it as the fund\'s stated position, dated to access.',
  },
};

// ------------------------------------------------------------- flag criteria
// The criteria are stated once, plainly, and rendered in full on the method
// page. A flag describes a company against a stated criterion. It is not a
// judgement of the fund's overall quality, and it is not advice.
export const CRITERIA = {
  thermalCoal: {
    key: 'thermalCoal',
    label: 'Thermal coal',
    full: 'Thermal coal mining, or coal-fired power expansion',
    basis: 'Companies whose business is mining thermal (steaming) coal, or building new coal-fired power. The reference line is the Global Coal Exit List approach: material thermal coal mining, or new coal plant or mine capacity. Metallurgical (coking) coal produced by diversified miners is treated separately (see what is not flagged).',
  },
  oilGas: {
    key: 'oilGas',
    label: 'Oil and gas expansion',
    full: 'Oil and gas producers with expansion plans',
    basis: 'Upstream oil and gas producers that are developing new extraction capacity (new fields, LNG trains, or reserves not consistent with a 1.5C pathway). The reference line is the Global Oil and Gas Exit List approach. A company that only refines or retails fuel is not caught here.',
  },
  weapons: {
    key: 'weapons',
    label: 'Controversial weapons',
    full: 'Controversial weapons (cluster munitions, landmines)',
    basis: 'Manufacture of weapons banned or restricted by international convention: cluster munitions (Oslo Convention) and anti-personnel landmines (Ottawa Treaty). Most Australian default options already exclude these by policy; the flag records where a name still appears.',
  },
  tobacco: {
    key: 'tobacco',
    label: 'Tobacco',
    full: 'Tobacco manufacturing',
    basis: 'Manufacture of tobacco products. Most large Australian default options exclude tobacco manufacturers by policy; the flag records where a name still appears.',
  },
};

// What deliberately does NOT get flagged, and why. Stated plainly so the line
// is defensible and the same for every fund.
export const NOT_FLAGGED = [
  {
    head: 'Metallurgical (coking) coal inside a diversified miner',
    body: 'BHP and Rio Tinto sit near the top of almost every default option through the Australian shares sleeve. They produce metallurgical coal for steelmaking, which has no ready substitute at scale today, alongside iron ore, copper and other minerals. We do not flag a diversified miner on its coking coal. We would flag a company whose core business is thermal coal mining. The line is drawn on business model.',
  },
  {
    head: 'Banks and insurers that finance or underwrite fossil fuels',
    body: 'The big four banks are top holdings in every diversified default. Their lending books include fossil fuel exposure. Financed emissions are real, but they are a step removed from the company\'s own operations and are measured on a different basis. We flag producers and expanders directly. Financiers sit outside this boundary, which is a scope choice, stated here so you can weigh it yourself.',
  },
  {
    head: 'High-emitting companies that are not expanding',
    body: 'A cement maker, an airline or a steelmaker can carry a large carbon footprint without meeting any criterion above. The flags target thermal coal, oil and gas expansion, controversial weapons and tobacco specifically. A heavy footprint alone is not a flag here.',
  },
];

// ------------------------------------------------------------------ the funds
// Ten funds whose default (MySuper) option can be sourced. Fewer done properly
// beats more done loosely. Strategic weights are indicative; individual
// holding weightings are pending against this cycle's disclosure file.

// Representative top listed holdings shared by essentially every index-inclusive
// Australian default option, through the Australian and international shares
// sleeves. Named, not weighted: the per-option weighting is pending.
const AU_TOP = ['Commonwealth Bank', 'BHP Group', 'CSL', 'National Australia Bank', 'Westpac', 'Macquarie Group', 'ANZ Group', 'Wesfarmers', 'Woodside Energy', 'Rio Tinto', 'Goodman Group'];
const INTL_TOP = ['Apple', 'Microsoft', 'Nvidia', 'Amazon', 'Alphabet', 'Meta Platforms'];

const SRC_MF_AUS = { doc: 'Market Forces, AustralianSuper Balanced fund analysis', url: 'https://www.marketforces.org.au/superfunds/australiansuper-balanced/' };
const SRC_MF_FFX = { doc: 'Market Forces, Top Australian super funds invest $33 billion in fossil fuel expansion (2025)', url: 'https://www.marketforces.org.au/top-australian-super-funds-invest-33-billion-in-fossil-fuel-expansion/' };

export const FUNDS = [
  {
    id: 'australiansuper',
    name: 'AustralianSuper',
    defaultOption: 'Balanced (MySuper)',
    optionType: 'Single diversified option',
    growthDefensive: 'Around two-thirds growth, one-third defensive',
    saa: [
      { class: 'Australian shares', pct: '20 to 25%' },
      { class: 'International shares', pct: '25 to 30%' },
      { class: 'Private markets (infrastructure, property, private equity)', pct: '20 to 25%' },
      { class: 'Fixed interest and credit', pct: '12 to 18%' },
      { class: 'Cash', pct: '3 to 8%' },
    ],
    saaConf: 'indicative',
    saaSource: { doc: 'AustralianSuper, Balanced (MySuper) investment option fact sheet and Investment Guide (issued 1 August 2025)', url: 'https://www.australiansuper.com/investments/your-investment-options/pre-mixed-investment-choice', asOf: '1 August 2025' },
    topHoldings: [...AU_TOP, ...INTL_TOP],
    topHoldingsConf: 'pending',
    topHoldingsNote: 'Representative top listed holdings through the Australian and international shares sleeves. Names are the sort that sit at the top of the option; individual weightings are pending against the 31 December 2025 disclosure file.',
    flagged: [
      { company: 'Whitehaven Coal', criterion: 'thermalCoal', conf: 'reported', basis: 'AustralianSuper is Whitehaven Coal\'s largest shareholder, having divested in 2020 and re-built a stake through 2025 that reached 11.8 per cent of the company by February 2026. Whitehaven is a thermal coal miner with expansion plans.', source: SRC_MF_AUS, weighting: 'stake is in the company; weighting in the option not verified this cycle' },
      { company: 'Woodside Energy', criterion: 'oilGas', conf: 'reported', basis: 'AustralianSuper is reported to own more than 7 per cent of Woodside, Australia\'s largest oil and gas producer, held at more than $2 billion as at June 2025. Woodside has upstream expansion (for example Scarborough).', source: SRC_MF_FFX, weighting: 'stake is in the company; weighting in the option not verified this cycle' },
      { company: 'Santos', criterion: 'oilGas', conf: 'reported', basis: 'Santos is an upstream oil and gas producer with expansion plans (for example Barossa) and is held across the Australian shares sleeve of large diversified options.', source: SRC_MF_FFX, weighting: 'not verified this cycle' },
    ],
    marketing: [
      { quote: 'Committed to net zero carbon emissions in the investment portfolio by 2050, pursued through engagement with companies rather than blanket divestment.', attribution: 'AustralianSuper, climate and responsible investing pages', url: 'https://www.australiansuper.com/investments/how-we-invest/responsible-investing', accessed: VERIFIED },
      { quote: 'The fund holds no blanket exclusion of thermal coal companies, and has publicly described thermal coal as having a role in the energy transition.', attribution: 'AustralianSuper responsible investing policy, as reported by Market Forces', url: 'https://www.marketforces.org.au/australiansuper-re-invests-in-whitehaven-claims-thermal-coal-is-important-in-energy-transition/', accessed: VERIFIED },
    ],
    disclosure: { doc: 'AustralianSuper portfolio holdings disclosure (what we invest in)', url: 'https://www.australiansuper.com/investments/what-we-invest-in', asOf: '31 December 2025' },
  },
  {
    id: 'art',
    name: 'Australian Retirement Trust',
    defaultOption: 'Lifecycle Investment Strategy (Balanced Pool)',
    optionType: 'Lifecycle: High Growth Pool to age 50, then gliding to the Balanced and Cash Pools',
    growthDefensive: 'Balanced Pool holds around 70% growth; the High Growth Pool used before age 50 holds more',
    saa: [
      { class: 'Australian shares', pct: '20 to 25%' },
      { class: 'International shares', pct: '25 to 30%' },
      { class: 'Unlisted assets (infrastructure, property, private equity)', pct: '20 to 25%' },
      { class: 'Fixed interest and credit', pct: '12 to 18%' },
      { class: 'Cash', pct: '2 to 6%' },
    ],
    saaConf: 'indicative',
    saaSource: { doc: 'Australian Retirement Trust, Lifecycle Investment Strategy and Balanced option pages', url: 'https://www.australianretirementtrust.com.au/investments/lifecycle-investment-strategy', asOf: 'accessed 21 July 2026' },
    topHoldings: [...AU_TOP, ...INTL_TOP],
    topHoldingsConf: 'pending',
    topHoldingsNote: 'Representative top listed holdings through the shares sleeves. Weightings pending against the 31 December 2025 disclosure file.',
    flagged: [
      { company: 'Woodside Energy', criterion: 'oilGas', conf: 'reported', basis: 'Held through the Australian shares sleeve, as with almost all index-inclusive default options. Woodside is an oil and gas producer with expansion plans.', source: SRC_MF_FFX, weighting: 'not verified this cycle' },
      { company: 'Santos', criterion: 'oilGas', conf: 'reported', basis: 'Held through the Australian shares sleeve. Santos is an oil and gas producer with expansion plans.', source: SRC_MF_FFX, weighting: 'not verified this cycle' },
    ],
    marketing: [
      { quote: 'States an ambition to reach net zero emissions across the investment portfolio by 2050, with responsible investment integrated into its process.', attribution: 'Australian Retirement Trust, responsible investment pages', url: 'https://www.australianretirementtrust.com.au/investments/how-we-invest/responsible-investment', accessed: VERIFIED },
    ],
    disclosure: { doc: 'Australian Retirement Trust portfolio holdings disclosure', url: 'https://www.australianretirementtrust.com.au/investments/portfolio-holdings', asOf: '31 December 2025' },
  },
  {
    id: 'rest',
    name: 'Rest',
    defaultOption: 'Core Strategy (MySuper)',
    optionType: 'Single diversified option',
    growthDefensive: 'Growth-oriented diversified; around 70 to 76% growth',
    saa: [
      { class: 'Australian shares', pct: '20 to 25%' },
      { class: 'International shares', pct: '25 to 32%' },
      { class: 'Unlisted assets (infrastructure, property, private equity)', pct: '18 to 24%' },
      { class: 'Fixed interest and credit', pct: '12 to 18%' },
      { class: 'Cash', pct: '3 to 8%' },
    ],
    saaConf: 'indicative',
    saaSource: { doc: 'Rest, Core Strategy investment option and How we invest pages', url: 'https://rest.com.au/investments/how-we-invest', asOf: 'accessed 21 July 2026' },
    topHoldings: [...AU_TOP, ...INTL_TOP],
    topHoldingsConf: 'pending',
    topHoldingsNote: 'Representative top listed holdings through the shares sleeves. Weightings pending against the 31 December 2025 disclosure file.',
    flagged: [
      { company: 'Woodside Energy', criterion: 'oilGas', conf: 'reported', basis: 'Held through the Australian shares sleeve. Woodside is an oil and gas producer with expansion plans. Note Rest\'s thermal coal policy below limits some coal exposure but does not exclude oil and gas.', source: SRC_MF_FFX, weighting: 'not verified this cycle' },
      { company: 'Santos', criterion: 'oilGas', conf: 'reported', basis: 'Held through the Australian shares sleeve. Santos is an oil and gas producer with expansion plans.', source: SRC_MF_FFX, weighting: 'not verified this cycle' },
    ],
    marketing: [
      { quote: 'Committed to net zero absolute carbon emissions in the investment portfolio by 2050, aligned with the Paris Agreement, and a signatory to the UN Principles for Responsible Investment.', attribution: 'Rest, Sustainability and Responsible Investing pages', url: 'https://rest.com.au/why-rest/about-rest/sustainability', accessed: VERIFIED },
      { quote: 'Does not invest in listed companies deriving 10 per cent or more of total annual revenue from thermal coal mining, unless the company has a credible net zero by 2050 target or science-based targets as assessed by the SBTi.', attribution: 'Rest, approach to responsible investing', url: 'https://rest.com.au/investments/how-we-invest/approach-to-responsible-investing', accessed: VERIFIED },
    ],
    disclosure: { doc: 'Rest portfolio holdings disclosure', url: 'https://rest.com.au/investments/how-we-invest/portfolio-holdings', asOf: '31 December 2025' },
  },
  {
    id: 'hostplus',
    name: 'Hostplus',
    defaultOption: 'Balanced (MySuper)',
    optionType: 'Single diversified option',
    growthDefensive: 'Bias to growth; around 75% growth',
    saa: [
      { class: 'Australian shares', pct: '18 to 24%' },
      { class: 'International shares', pct: '22 to 30%' },
      { class: 'Unlisted assets (infrastructure, property, private equity)', pct: '22 to 30%' },
      { class: 'Fixed interest and credit', pct: '8 to 14%' },
      { class: 'Cash and alternatives', pct: '6 to 12%' },
    ],
    saaConf: 'indicative',
    saaSource: { doc: 'Hostplus, Balanced investment option and Investment Governance pages', url: 'https://hostplus.com.au/about-us/company-overview/investment-governance', asOf: 'accessed 21 July 2026' },
    topHoldings: [...AU_TOP, ...INTL_TOP],
    topHoldingsConf: 'pending',
    topHoldingsNote: 'Representative top listed holdings through the shares sleeves. Hostplus runs a large unlisted allocation, so listed shares are a smaller share of the whole than at some peers. Weightings pending against the 31 December 2025 disclosure file.',
    flagged: [
      { company: 'Santos', criterion: 'oilGas', conf: 'reported', basis: 'Held through the Australian shares sleeve. Santos is an oil and gas producer with expansion plans (for example Barossa).', source: SRC_MF_FFX, weighting: 'not verified this cycle' },
      { company: 'Woodside Energy', criterion: 'oilGas', conf: 'reported', basis: 'Held through the Australian shares sleeve. Woodside is an oil and gas producer with expansion plans.', source: SRC_MF_FFX, weighting: 'not verified this cycle' },
    ],
    marketing: [
      { quote: 'Committed to transition to net zero emissions across the investment portfolio by 2050, and a signatory to the UN-supported Principles for Responsible Investment.', attribution: 'Hostplus, net zero commitment announcement', url: 'https://hostplus.com.au/about-us/news/hostplus-commits-to-transition-to-net-zero-emissions-by-2050', accessed: VERIFIED },
    ],
    disclosure: { doc: 'Hostplus portfolio holdings disclosure', url: 'https://hostplus.com.au/investment/managing-your-investment/portfolio-holdings-disclosure', asOf: '31 December 2025' },
  },
  {
    id: 'hesta',
    name: 'HESTA',
    defaultOption: 'Balanced Growth (MySuper)',
    optionType: 'Single diversified option',
    growthDefensive: 'Around 75% growth',
    saa: [
      { class: 'Australian shares', pct: '18 to 24%' },
      { class: 'International shares', pct: '25 to 32%' },
      { class: 'Infrastructure, property and private equity', pct: '18 to 26%' },
      { class: 'Debt (fixed interest and credit)', pct: '10 to 16%' },
      { class: 'Cash and alternatives', pct: '4 to 10%' },
    ],
    saaConf: 'indicative',
    saaSource: { doc: 'HESTA, Balanced Growth MySuper option and MySuper dashboard', url: 'https://www.hesta.com.au/members/investments/balanced-growth-mysuper', asOf: 'accessed 21 July 2026' },
    topHoldings: [...AU_TOP, ...INTL_TOP],
    topHoldingsConf: 'pending',
    topHoldingsNote: 'Representative top listed holdings through the shares sleeves. Weightings pending against the 31 December 2025 disclosure file.',
    flagged: [
      { company: 'Woodside Energy', criterion: 'oilGas', conf: 'reported', basis: 'HESTA placed Woodside and Santos on an engagement watchlist and has been a vocal Woodside shareholder at AGMs. It has reduced some holdings in prior cycles but remains exposed through the Australian shares sleeve. Woodside is an oil and gas producer with expansion plans.', source: SRC_MF_FFX, weighting: 'not verified this cycle' },
      { company: 'Santos', criterion: 'oilGas', conf: 'reported', basis: 'On HESTA\'s engagement watchlist alongside Woodside. Santos is an oil and gas producer with expansion plans.', source: SRC_MF_FFX, weighting: 'not verified this cycle' },
    ],
    marketing: [
      { quote: 'Aims for net zero emissions across the investment portfolio by 2050, with an interim target of a 50 per cent reduction in normalised emissions by 2030 against a 2020 baseline; reports having met an earlier interim target ahead of schedule.', attribution: 'HESTA, climate action pages', url: 'https://www.hesta.com.au/about-us/super-with-impact/investment-excellence-with-impact/climate-action', accessed: VERIFIED },
    ],
    disclosure: { doc: 'HESTA portfolio holdings disclosure', url: 'https://www.hesta.com.au/members/investments/how-hesta-invests/portfolio-holdings', asOf: '31 December 2025' },
  },
  {
    id: 'aware',
    name: 'Aware Super',
    defaultOption: 'FutureSaver MySuper Lifecycle (High Growth stage)',
    optionType: 'Lifecycle: High Growth to age 55, gliding to Balanced then Conservative Balanced',
    growthDefensive: 'High Growth stage holds around 88% growth (members aged 55 and under)',
    saa: [
      { class: 'Australian shares', pct: '20 to 26%' },
      { class: 'International shares', pct: '30 to 38%' },
      { class: 'Infrastructure, property and private equity', pct: '18 to 26%' },
      { class: 'Fixed interest and credit', pct: '6 to 12%' },
      { class: 'Cash', pct: '2 to 6%' },
    ],
    saaConf: 'indicative',
    saaSource: { doc: 'Aware Super, FutureSaver MySuper Lifecycle and High Growth option pages', url: 'https://aware.com.au/member/investments-and-performance/investment-options', asOf: 'accessed 21 July 2026' },
    topHoldings: [...AU_TOP, ...INTL_TOP],
    topHoldingsConf: 'pending',
    topHoldingsNote: 'Representative top listed holdings through the shares sleeves. The default is a lifecycle option, so weights shift with member age. Weightings pending against the 31 December 2025 disclosure file.',
    flagged: [
      { company: 'Woodside Energy', criterion: 'oilGas', conf: 'reported', basis: 'Held through the Australian shares sleeve. Market Forces noted Aware Super\'s stance on the Woodside 2026 AGM as softening relative to peers. Woodside is an oil and gas producer with expansion plans.', source: SRC_MF_FFX, weighting: 'not verified this cycle' },
      { company: 'Santos', criterion: 'oilGas', conf: 'reported', basis: 'Held through the Australian shares sleeve. Santos is an oil and gas producer with expansion plans.', source: SRC_MF_FFX, weighting: 'not verified this cycle' },
    ],
    marketing: [
      { quote: 'States that it seeks to transition towards achieving net zero emissions by 2050.', attribution: 'Aware Super, responsible investment pages', url: 'https://aware.com.au/member/investments-and-performance/how-we-invest/responsible-ownership', accessed: VERIFIED },
      { quote: 'Named among a small group of the 30 largest funds identified as holding direct investments in Australian renewable energy or battery storage projects.', attribution: 'Market Forces analysis of large fund renewable investment', url: 'https://www.marketforces.org.au/campaigns/super/', accessed: VERIFIED },
    ],
    disclosure: { doc: 'Aware Super portfolio holdings disclosure', url: 'https://aware.com.au/member/investments-and-performance/how-we-invest/portfolio-holdings-disclosure', asOf: '31 December 2025' },
  },
  {
    id: 'cbus',
    name: 'Cbus',
    defaultOption: 'Growth (MySuper)',
    optionType: 'Single diversified option',
    growthDefensive: 'Around 73% growth',
    saa: [
      { class: 'Australian shares', pct: '18 to 24%' },
      { class: 'International shares', pct: '24 to 32%' },
      { class: 'Infrastructure, property and private equity', pct: '20 to 28%' },
      { class: 'Fixed interest and credit', pct: '10 to 16%' },
      { class: 'Cash', pct: '3 to 8%' },
    ],
    saaConf: 'indicative',
    saaSource: { doc: 'Cbus, Growth (MySuper) option comparison and MySuper dashboard', url: 'https://www.cbussuper.com.au/super/my-investment-options/cbus-mysuper-dashboard', asOf: 'accessed 21 July 2026' },
    topHoldings: [...AU_TOP, ...INTL_TOP],
    topHoldingsConf: 'pending',
    topHoldingsNote: 'Representative top listed holdings through the shares sleeves. Cbus holds a large property and infrastructure allocation. Weightings pending against the 31 December 2025 disclosure file.',
    flagged: [
      { company: 'Woodside Energy', criterion: 'oilGas', conf: 'reported', basis: 'Held through the Australian shares sleeve. Woodside is an oil and gas producer with expansion plans.', source: SRC_MF_FFX, weighting: 'not verified this cycle' },
      { company: 'Santos', criterion: 'oilGas', conf: 'reported', basis: 'Held through the Australian shares sleeve. Santos is an oil and gas producer with expansion plans.', source: SRC_MF_FFX, weighting: 'not verified this cycle' },
    ],
    marketing: [
      { quote: 'Committed to net zero absolute portfolio emissions by 2050, with a target of a 45 per cent reduction in absolute portfolio emissions by 2030; the first Australian asset owner to join the UN-convened Net-Zero Asset Owner Alliance.', attribution: 'Cbus, climate change goals pages', url: 'https://www.cbussuper.com.au/about-us/sustainability/climate-change-goals', accessed: VERIFIED },
    ],
    disclosure: { doc: 'Cbus portfolio holdings disclosure', url: 'https://www.cbussuper.com.au/super/my-investment-options/portfolio-holdings-disclosure', asOf: '31 December 2025' },
  },
  {
    id: 'unisuper',
    name: 'UniSuper',
    defaultOption: 'Balanced (MySuper)',
    optionType: 'Single diversified option',
    growthDefensive: 'Around 70% growth',
    saa: [
      { class: 'Australian shares', pct: '22 to 30%' },
      { class: 'International shares', pct: '22 to 30%' },
      { class: 'Property, infrastructure and private equity', pct: '14 to 22%' },
      { class: 'Fixed interest and credit', pct: '10 to 18%' },
      { class: 'Cash', pct: '3 to 8%' },
    ],
    saaConf: 'indicative',
    saaSource: { doc: 'UniSuper, Balanced investment option and MySuper dashboard', url: 'https://www.unisuper.com.au/investments/our-investment-options/balanced', asOf: 'accessed 21 July 2026' },
    topHoldings: [...AU_TOP, ...INTL_TOP],
    topHoldingsConf: 'pending',
    topHoldingsNote: 'Representative top listed holdings through the shares sleeves. UniSuper runs a relatively high listed-shares allocation. Weightings pending against the 31 December 2025 disclosure file.',
    flagged: [
      { company: 'Woodside Energy', criterion: 'oilGas', conf: 'reported', basis: 'Held through the Australian shares sleeve. UniSuper has an active climate stewardship position; the name is still held. Woodside is an oil and gas producer with expansion plans.', source: { doc: 'Market Forces, UniSuper Balanced fund analysis', url: 'https://www.marketforces.org.au/superfunds/unisuper-balanced/' }, weighting: 'not verified this cycle' },
      { company: 'Santos', criterion: 'oilGas', conf: 'reported', basis: 'Held through the Australian shares sleeve. Santos is an oil and gas producer with expansion plans.', source: { doc: 'Market Forces, UniSuper Balanced fund analysis', url: 'https://www.marketforces.org.au/superfunds/unisuper-balanced/' }, weighting: 'not verified this cycle' },
    ],
    marketing: [
      { quote: 'Committed to net zero emissions across the fund by 2050 in line with the Paris Agreement, with targets to contribute to a 45 per cent reduction in Australia\'s emissions by 2030 and to have its major Australian holdings on Paris-aligned targets.', attribution: 'UniSuper, climate risk and our investments pages', url: 'https://www.unisuper.com.au/investments/how-we-invest/climate-risk-and-our-investments', accessed: VERIFIED },
    ],
    disclosure: { doc: 'UniSuper portfolio holdings disclosure', url: 'https://www.unisuper.com.au/investments/how-we-invest/portfolio-holdings', asOf: '31 December 2025' },
  },
  {
    id: 'vanguard',
    name: 'Vanguard Super',
    defaultOption: 'Lifecycle (MySuper)',
    optionType: 'Lifecycle: 36 age-based stages that shift growth to defensive over time',
    growthDefensive: 'Members aged 47 and under hold 90% growth / 10% defensive; the mix glides to 40% growth / 60% defensive by age 82',
    saa: [
      { class: 'Australian shares', pct: '25 to 35% (under 47)' },
      { class: 'International shares (developed, emerging, small cap)', pct: '50 to 60% (under 47)' },
      { class: 'Fixed interest', pct: '8 to 12% (under 47)' },
      { class: 'Cash', pct: '0 to 3% (under 47)' },
    ],
    saaConf: 'sourced',
    saaSource: { doc: 'Vanguard Super, Lifecycle option and MySuper Product Dashboard', url: 'https://www.vanguard.com.au/super/choose-your-super/investment-options', asOf: 'accessed 21 July 2026' },
    topHoldings: [...AU_TOP, ...INTL_TOP],
    topHoldingsConf: 'pending',
    topHoldingsNote: 'A predominantly index-based option, so the top listed holdings track the broad Australian and global share indices closely: the same large-cap names, at index weight. Individual weightings are pending against the 31 December 2025 disclosure file.',
    flagged: [
      { company: 'Woodside Energy', criterion: 'oilGas', conf: 'reported', basis: 'Held at broad-index weight through the Australian shares component. A broad index option holds the whole market, so oil and gas producers are included by design unless a screen removes them. Woodside is an oil and gas producer with expansion plans.', source: SRC_MF_FFX, weighting: 'not verified this cycle' },
      { company: 'Santos', criterion: 'oilGas', conf: 'reported', basis: 'Held at broad-index weight through the Australian shares component. Santos is an oil and gas producer with expansion plans.', source: SRC_MF_FFX, weighting: 'not verified this cycle' },
    ],
    marketing: [
      { quote: 'The default Lifecycle option is a low-cost, broad-index option. Vanguard markets it on simplicity and cost; a separate ESG-screened choice is offered for members who want screening.', attribution: 'Vanguard Super, investment options pages', url: 'https://www.vanguard.com.au/super/choose-your-super/investment-options', accessed: VERIFIED },
    ],
    disclosure: { doc: 'Vanguard Super portfolio holdings disclosure', url: 'https://www.vanguard.com.au/super/help-and-resources/forms-and-documents', asOf: '31 December 2025' },
  },
  {
    id: 'cfs',
    name: 'Colonial First State',
    defaultOption: 'FirstChoice Employer Super, CFS Lifestage (MySuper)',
    optionType: 'Lifecycle: growth-heavy while young, gliding to defensive near retirement',
    growthDefensive: 'Growth-heavy in the early stages (roughly 88 to 90% growth), gliding down with age',
    saa: [
      { class: 'Australian shares', pct: '22 to 30% (early stage)' },
      { class: 'International shares', pct: '32 to 42% (early stage)' },
      { class: 'Property, infrastructure and alternatives', pct: '12 to 20% (early stage)' },
      { class: 'Fixed interest and credit', pct: '6 to 12% (early stage)' },
      { class: 'Cash', pct: '1 to 5% (early stage)' },
    ],
    saaConf: 'indicative',
    saaSource: { doc: 'Colonial First State, FirstChoice Employer Super and CFS Lifestage pages', url: 'https://www.cfs.com.au/personal/products/superannuation/employer-super/investment-options', asOf: 'accessed 21 July 2026' },
    topHoldings: [...AU_TOP, ...INTL_TOP],
    topHoldingsConf: 'pending',
    topHoldingsNote: 'Representative top listed holdings through the shares sleeves of the CFS Lifestage default. Weightings pending against the 31 December 2025 disclosure file.',
    flagged: [
      { company: 'Woodside Energy', criterion: 'oilGas', conf: 'reported', basis: 'Held through the Australian shares sleeve of the default Lifestage option. Woodside is an oil and gas producer with expansion plans.', source: SRC_MF_FFX, weighting: 'not verified this cycle' },
      { company: 'Santos', criterion: 'oilGas', conf: 'reported', basis: 'Held through the Australian shares sleeve. Santos is an oil and gas producer with expansion plans.', source: SRC_MF_FFX, weighting: 'not verified this cycle' },
    ],
    marketing: [
      { quote: 'CFS describes a responsible investment and stewardship approach across the fund; the default FirstChoice Lifestage option is a mainstream diversified option.', attribution: 'Colonial First State, responsible investment pages', url: 'https://www.cfs.com.au/personal/resources/responsible-investments.html', accessed: VERIFIED },
    ],
    disclosure: { doc: 'Colonial First State portfolio holdings disclosure', url: 'https://www.cfs.com.au/personal/resources/funds-and-performance/portfolio-holdings.html', asOf: '31 December 2025' },
  },
];

// ------------------------------------------------------------------ page copy
export const COPY = {
  intro: {
    tag: 'Super Fund Holdings',
    title: ['What your default', 'super option holds'],
    paras: [
      'You are placed in a MySuper default when you start a job, and it invests a large share of your retirement money for decades. Few members ever read what that option holds. This tool puts one thing next to another: the holdings picture of a fund\'s default option, and that same fund\'s own sustainability marketing, in the fund\'s own words.',
      'It is not an accusation. Pick a fund, read what it says about climate and responsibility, then look at what the default option holds, and make up your own mind.',
    ],
    chips: ['MySuper defaults', 'Holdings next to marketing', 'Every figure sourced or marked pending', 'Neutral and factual'],
    pick: 'Pick a fund',
    pickAria: 'Choose a super fund to view its default option',
  },
  tool: {
    tag: 'The tool',
  },
  looking: {
    tag: 'Scope and limits',
    head: 'What you are looking at',
    points: [
      'The default (MySuper) option only. Most funds also offer a screened or sustainable option; those are a member\'s active choice and are not shown here.',
      'Holdings move. A fund can buy or sell a stock the week after it discloses, and this tool cannot see that.',
      'Disclosure lags. Under the Corporations Act, funds publish portfolio holdings every six months, within 90 days of 31 December and 30 June. The most recent cycle is holdings as at 31 December 2025, published by around the end of March 2026.',
      'Strategic asset allocations shown here are indicative weights from each fund\'s published guide. The exact current split is in the fund\'s own disclosure, and it shifts between cycles.',
      'A flag describes a company against a stated criterion. It is not a judgement of the fund\'s overall quality, and nothing here is financial advice.',
    ],
  },
  detail: {
    lastVerified: 'Last verified',
    sourceDoc: 'From',
    optionLabel: 'Default option',
    typeLabel: 'How the default works',
    saaHead: 'What the option holds, by asset class',
    saaSub: 'Indicative strategic allocation from the fund\'s published investment guide. Shown as ranges, because the exact split moves between cycles and sits in the fund\'s own disclosure.',
    growthLabel: 'Growth and defensive split',
    topHead: 'Top listed shareholdings',
    flaggedHead: 'Flagged holdings',
    flaggedSub: 'Companies in the option that meet one of the stated criteria, named with the public basis. A flag is factual, against a criterion. It is not a rating of the fund.',
    noFlagged: 'No flagged holdings recorded for this option in this cycle. That does not mean none exist: it means none were verified to the standard this page holds.',
    marketingHead: 'What the fund says',
    marketingSub: 'The fund\'s own published sustainability position, in short. Attributed, with the page and access date. Read against the live page; treat it as the fund\'s stated position.',
    criterionLabel: 'Criterion',
    basisLabel: 'Basis',
    weightingLabel: 'Weighting',
    sourceLabel: 'Source',
    fundPageLink: 'Fund page',
    quoteSourceLink: 'Source',
    accessedLabel: 'Accessed',
    disclosureHead: 'Disclosure this reads from',
    holdingsAsAt: 'Holdings as at',
    disclosureLink: 'Fund disclosure page',
    verifyChipAria: 'Confidence in this figure',
  },
  method: {
    tag: 'Method',
    title: ['How this is', 'put together'],
    body: 'The full basis of preparation lives on its own page: the boundary, every source, how the numbers are read, the flag criteria in full, the update cadence, and the corrections policy. If you run a fund and something here is wrong, that page says how to reach me and how a correction is handled.',
    cta: 'Read the method and sources',
    href: 'method/',
  },
  backlog: {
    tag: 'Backlog and changes',
    title: ['What is queued,', 'and what changed'],
    sub: 'This tool is deliberately unfinished in the open. The most valuable next step is reading the actual disclosure CSVs to replace pending weightings with verified figures. Below is what is queued and a dated record of changes.',
    queuedHead: 'Still queued',
    queued: [
      'Read each fund\'s 31 December 2025 disclosure CSV directly and replace every pending weighting with a verified figure, distinguishing the weight in the whole option from the weight in the Australian shares sleeve (they are very different numbers).',
      'Add the whole-of-option percentage in flagged companies, alongside the company-level shareholding, once the CSV is read.',
      'Add funds where the default could not yet be sourced to this standard: AMP, HUB24, Brighter Super, Spirit Super, NGS Super, Australian Ethical (as a screened contrast).',
      'Capture each fund\'s marketing quote verbatim from the live page with a saved snapshot, so the wording is exact.',
      'Cross-check the indicative asset allocations against the current investment guide PDFs when they can be opened, and replace ranges with the published point figures.',
    ],
    changelogHead: 'Change log',
  },
};

export const CHANGELOG = [
  { date: '21 July 2026', text: 'First build. Ten MySuper defaults, holdings picture next to each fund\'s sustainability marketing, flag criteria and method page. Individual weightings marked pending against the 31 December 2025 disclosure cycle; company-level shareholdings cited where reported.' },
];

export const FOOTER = { name: 'Chris Wang · 2026', back: 'Back to profile' };

// ------------------------------------------------------------------ method page
// The basis of preparation, on its own route (/super/method/). Rendered from the
// same fund set the tool reads from, so the source table cannot drift from the
// tool. Any change to a fund, a source, a flag criterion or the boundary must
// land here in the same change.
export const METHOD = {
  tag: 'Super Fund Holdings / Method',
  title: ['How this is', 'put together'],
  sub: 'What this tool counts, where every number comes from, how the numbers are read, the flag criteria in full, how often it updates, and how a fund can get an error fixed. If you run a fund and something here is wrong, the corrections note below says how to reach me.',
  backToTool: 'Back to the tool',
  boundary: {
    title: 'Boundary: default options only',
    paras: [
      'This tool looks at one thing per fund: the default MySuper option, the one you are placed in when you start a job and never choose an option yourself. The default is where most people\'s money sits, most of them without ever picking it, so it is the option that describes what the fund does with a typical member\'s retirement savings.',
      'Most funds also offer a screened, sustainable or ethical option. Those are a member\'s active choice, they hold different things, and they are not shown here. Judging a fund\'s default by its sustainable option, or the reverse, would be misleading, so the two are kept apart. Where a fund\'s default is a lifecycle strategy that shifts with age, the tool describes the growth-stage settings a younger member sits in, and says so.',
      'The tool reads the option level. A large fund runs many options; a holding can be heavy in one and absent from another. Reporting a whole-of-fund number against a single option would overstate or understate it. The unit here is the option.',
    ],
  },
  sources: {
    title: 'Sources',
    paras: [
      'Portfolio holdings disclosure. Since an amendment to the Corporations Act (section 1017BB), every superannuation fund must publish the holdings of each investment option every six months, as a CSV or PDF, within 90 days of 31 December and 30 June. The most recent cycle is holdings as at 31 December 2025, published by around the end of March 2026. This is the primary source for what an option holds.',
      'The honest limit, stated plainly. In this build the disclosure CSV and PDF files could not be opened directly. So the holdings picture here was assembled from fund websites and investment guides, Market Forces fund analysis, and news coverage, and verified through web search on 21 July 2026. That is why individual holding weightings are marked pending: naming a holding is well supported, but pricing its exact weight in the option needs the CSV, and inventing a decimal would be the one thing this page must never do. Reading those files and replacing every pending figure is the top item in the backlog.',
      'PDS, TMD and investment guides, for the strategic asset allocation and the option\'s design. These give the growth and defensive split and the broad asset-class mix. The figures here are shown as indicative ranges from those documents, because the exact split moves between cycles and the point figure sits in the fund\'s own current disclosure.',
      'Fund sustainability and climate pages, for the marketing language. Each quote states the fund\'s own published position on climate and responsible investment, attributed with the page and the access date. Because the live pages could not be captured verbatim in this build, the marketing text is a paraphrase of each fund\'s stated position, and is flagged that way; capturing exact wording with a saved snapshot is queued.',
      'Market Forces, for fossil fuel holdings analysis, and its per-fund profiles, used where a company-level shareholding or a change in a stake is cited. APRA MySuper statistics and product dashboards for context on option design. Performance is deliberately left out: this tool is about what an option holds and what the fund says. Returns are a separate question, and mixing the two would blur both.',
    ],
  },
  reading: {
    title: 'How the numbers are read',
    paras: [
      'As-at dates matter. A disclosure is a photograph on one day. A fund can trade the next day, and the tool cannot see that, so every fund carries the as-at date of the cycle it reads from and a last-verified date for this tool\'s own check.',
      'Look-through has limits. A default option holds listed shares directly, but also pooled funds, unlisted infrastructure, property and private equity where the underlying names are reported at a coarser grain or a quarter later. Named listed shareholdings are the clearest part of the picture; the unlisted sleeves are the haziest, and a large unlisted allocation (Hostplus and Cbus, for example) means the listed names shown are a smaller share of the whole than the list alone suggests.',
      'The sleeve and the whole option are different denominators. A number like "8 per cent Commonwealth Bank" is usually the weight in the Australian shares sleeve; across the whole option the same holding is a few per cent. This tool names the top listed holdings but marks their weightings pending precisely to avoid publishing a sleeve number as if it were an option number. When the CSVs are read, the two will be reported separately.',
    ],
  },
  flags: {
    title: 'The flag criteria, in full',
    intro: 'A flag is factual and narrow. It records that a named company in the option meets one stated criterion, with a public basis. It says nothing about the fund\'s overall quality, nothing about the share of the option affected (that weighting is pending), and nothing about whether to invest. The criteria are:',
    notFlaggedHead: 'What does not get flagged, and why',
    noteHead: 'What a flag is not',
    note: 'A flag is a company against a criterion, nothing more. It does not say the fund is bad, does not net off the fund\'s renewable or climate-positive holdings, and does not weigh the flagged company against the rest of the portfolio. A fund can carry a flagged name and still run a serious climate program; both facts can be true, and the tool shows the holding and the fund\'s own words side by side so a reader can hold them together.',
  },
  cadence: {
    title: 'Update cadence',
    paras: [
      'The disclosure cycle is six-monthly: holdings as at 31 December and 30 June, each published within 90 days. This tool aims to refresh against each cycle, replacing pending weightings with verified figures as the CSVs are read. Every fund entry carries its own last-verified date, so a reader can see how fresh each one is.',
      'The current build is verified as at 21 July 2026, reading the 31 December 2025 cycle. Where a fund had not published, or the figure could not be verified, the entry says so.',
    ],
  },
  corrections: {
    title: 'Corrections',
    paras: [
      'This is the tool most likely to draw a correction request from a fund, and that is welcome. If you work at a fund and something here is wrong, a holding that is not held, a weighting that is off, a sustainability line that misreads your position, reach me through the LinkedIn link on my profile page. Tell me what is wrong and point me to the disclosure or page that shows it.',
      'Corrections ship with the change noted in the change log below, dated. I would rather fix an error in the open than defend it.',
    ],
  },
  limitationsTitle: 'Named limitations',
  limitations: [
    'Individual holding weightings are pending: named, but not priced to this cycle\'s CSV. This is the biggest single gap.',
    'Strategic asset allocations are indicative ranges from published guides; the exact current split sits in each fund\'s disclosure.',
    'Marketing quotes are paraphrases of each fund\'s published position, until captured verbatim with a saved snapshot.',
    'Unlisted assets (infrastructure, property, private equity) are reported at a coarser grain than listed shares, so the flagged-holdings view is strongest for listed companies and weakest inside the unlisted sleeves.',
    'Lifecycle defaults shift with member age; the tool describes the growth-stage settings and does not model every age step.',
    'Performance and fees are out of scope on purpose. This tool is about holdings and marketing.',
    'Ten funds are covered. Several major defaults (AMP, HUB24, and others) are still queued, because their default could not yet be sourced to this standard.',
  ],
  sourceTableTitle: 'The funds and their sources',
  sourceTableSub: 'Every fund in the tool, its default option, the disclosure cycle it reads from, and the fund pages used. Rendered from the same data the tool uses, so this table cannot drift from it.',
  sourceTable: {
    cols: ['Fund', 'Default option', 'Disclosure read', 'Fund pages used'],
    asAt: 'as at',
    disclosureLink: 'Disclosure',
    guideLink: 'Investment guide',
    sustainabilityLink: 'Sustainability',
  },
};

