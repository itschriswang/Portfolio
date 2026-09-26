// All /work content, plus the Sankey SVG generator ported from the original
// page. Every figure on this page is illustrative: the samples show methods on
// representative data, not client or employer deliverables.

export const TABS = [
  { id: 'baseline', letter: 'A', label: 'Emissions baseline', icon: 'chart' },
  { id: 'roadmap', letter: 'B', label: 'Decarb roadmap', icon: 'target' },
  { id: 'mca', letter: 'C', label: 'MCA framework', icon: 'list' },
  { id: 'lca', letter: 'D', label: 'Lifecycle carbon', icon: 'leaf' },
];

// Narrative lead-in: the order the work runs in, so a reader meets the
// sequence before the four methods.
export const WORK_NARRATIVE = {
  tag: 'The through-line',
  title: 'The order the work runs in',
  paras: [
    'Emissions work starts by confirming the boundary, grading the data and naming the gaps. The first finding is usually that most emissions sit in the value chain, outside direct operational control, and that decides whether the levers worth modelling sit inside the business or with its suppliers.',
    'From there the work runs in a fixed order. Options get quantified before any pathway is modelled, because a pathway is only as good as the levers underneath it. Targets come last, once the pathway exists, so the interim numbers are ones the roadmap can deliver.',
    'The four frameworks below follow that order, each as an interactive example on illustrative data. The case study at the end is a composite walk-through of all four.',
  ],
};

export const BASELINE_SECTORS = {
  property: {
    label: 'Commercial property',
    claim: 'Base-building electricity and leased building operations drive the footprint. Renewable procurement and all-electric retrofit are the primary reduction levers.',
    meta: 'FY25 baseline · Scope 1-3 · Illustrative: representative commercial office portfolio. Not client data.',
    s1: '8.2%', s2: '22.4%', s3: '69.4%',
    s1b: 'On-site plant and gas combustion. All-electric retrofit removes the direct emissions over time.',
    s2b: 'Dominant operational category. Base-building electricity drives most Scope 2 exposure. Renewable procurement (PPA / GreenPower) and grid decarbonisation are the primary levers.',
    s3b: 'Downstream leased assets (Cat 13: tenant electricity), purchased goods and services (Cat 1), and supplier transport (Cat 4) dominate.',
    sk: [8.2, 22.4, 69.4, 22.0, 12.6, 34.8],
    tiles: [
      { h: '69% of emissions sit outside direct operational control', b: 'Tenant electricity (Cat 13) and supply chain (Cat 1) dominate. Green leases and procurement policy are the primary reduction mechanisms.' },
      { h: 'Renewable procurement is the largest near-term lever', b: 'Scope 2 is 22% of the portfolio footprint. A PPA plus the grid decarbonisation trajectory is the most immediate route to net zero Scope 2.' },
      { h: 'All-electric retrofit removes on-site gas for good', b: 'Asset use-phase emissions then track the grid. Gas phase-out removes on-site combustion from Scope 1, and a renewable PPA covering the electricity that replaces it takes market-based Scope 2 toward zero at the portfolio level over time.' },
    ],
  },
  retail: {
    label: 'Retail · shopping centres',
    claim: 'Common-area electricity and refrigeration drive operations, but tenant energy and merchandise supply chains dominate the total footprint.',
    meta: 'FY25 baseline · Scope 1-3 · Illustrative: representative shopping-centre portfolio. Not client data.',
    s1: '9.5%', s2: '27.0%', s3: '63.5%',
    s1b: 'Refrigerant leakage and minor gas combustion. A low-GWP refrigerant transition is the primary Scope 1 lever.',
    s2b: 'Common-area lighting, HVAC and vertical transport. Renewable procurement and grid decarbonisation are the largest near-term levers.',
    s3b: 'Downstream leased assets (Cat 13: tenant electricity), purchased goods (Cat 1), and construction and fit-out (embodied). Retailer engagement and green leases drive reduction.',
    sk: [9.5, 27.0, 63.5, 18.0, 7.5, 38.0],
    tiles: [
      { h: '64% of emissions sit with tenants and suppliers', b: 'Tenant electricity (Cat 13) is the single largest category. Green leases, sub-metering and retailer engagement are the primary reduction mechanisms.' },
      { h: 'Refrigerant transition is the stubborn Scope 1 lever', b: 'Common-area and tenant refrigeration leak high-GWP gases. A low-GWP transition tracks the HFC phase-down and removes most direct emissions.' },
      { h: 'Renewable procurement clears common-area Scope 2', b: 'Centre-controlled electricity is ~27% of the footprint. A renewable PPA plus grid decarbonisation drives it toward zero this decade.' },
    ],
  },
  logistics: {
    label: 'Logistics and industrial',
    claim: 'Warehouse operations are low-intensity and quick to decarbonise; the footprint is dominated by embodied carbon in the sheds and downstream transport.',
    meta: 'FY25 baseline · Scope 1-3 · Illustrative: representative logistics estate portfolio. Not client data.',
    s1: '6.5%', s2: '18.5%', s3: '75.0%',
    s1b: 'Yard equipment and minor combustion. Materials-handling electrification (forklifts) is the primary direct lever.',
    s2b: 'Warehouse lighting, refrigeration and cold-chain. Large rooftop-solar and PPA potential decarbonises Scope 2 quickly.',
    s3b: 'Embodied carbon in tilt-up construction (Cat 1) and downstream transport and distribution (Cat 4). Design specification and modal shift drive reduction.',
    sk: [6.5, 18.5, 75.0, 40.0, 22.0, 13.0],
    tiles: [
      { h: 'Rooftop solar makes Scope 2 the quick win', b: 'Large, unshaded warehouse roofs support major on-site generation. Solar plus a PPA can take base-building Scope 2 close to zero within a few years.' },
      { h: 'Embodied carbon is locked in at construction', b: 'Tilt-up concrete and steel dominate Cat 1. Low-carbon concrete specification and structural efficiency at design stage have the most effect.' },
      { h: 'Downstream transport needs modal and fuel shift', b: 'Distribution (Cat 4) is the second-largest category. Load optimisation, modal shift and low-carbon fuels reduce it, but it depends on supply-chain partners.' },
    ],
  },
  infrastructure: {
    label: 'Infrastructure services',
    claim: 'Value chain emissions are 83% of the footprint, so that is where net zero action has to focus.',
    meta: 'FY25 baseline · Scope 1-3 · Illustrative composite scaled between listed sector peers. Not client data.',
    s1: '11.5%', s2: '5.8%', s3: '82.7%',
    s1b: 'Stationary combustion, diesel fleet, and mobile plant. Highest direct control. Largest lever is fleet and plant electrification.',
    s2b: 'Driven by grid emission factor trajectory and on-site renewable procurement (PPA / GreenPower).',
    s3b: 'Purchased goods and services (Cat 1), transport and distribution (Cat 4), and downstream leased assets (Cat 13). Reduction requires design choices and supplier collaboration.',
    sk: [11.5, 5.8, 82.7, 42.5, 20.4, 19.9],
    tiles: [
      { h: '83% of emissions sit outside direct control', b: 'Cutting this line means changing what gets specified and who supplies it, which sits with design teams and procurement. An operational efficiency programme barely touches it.' },
      { h: 'Purchased goods are the dominant driver', b: 'Category 1 (subcontracted goods and services) is the largest line. Supplier engagement and SBTi-aligned procurement carry most of the reduction.' },
      { h: 'Fleet and plant electrification lead Scope 1', b: 'A diesel fleet and mobile plant drive direct emissions. Electrification pace, tracking the grid, is the key near-term variable.' },
    ],
  },
};

// Ported verbatim from the original drawSankey(): returns an SVG markup string.
export function buildSankey(s1p, s2p, s3p, cat1p, cat4p, cat13p) {
  const TH = 140, yS = 40, yE = 180;
  const s1h = Math.max(7, (s1p / 100) * TH);
  const s2h = Math.max(5, (s2p / 100) * TH);
  const s3h = TH - s1h - s2h;
  const s1y = yS, s2y = s1y + s1h, s3y = s2y + s2h;
  const totalCat = cat1p + cat4p + cat13p || 1;
  let c1h = Math.max(12, (cat1p / totalCat) * s3h);
  const c4h = Math.max(10, (cat4p / totalCat) * s3h);
  let c13h = s3h - c1h - c4h;
  if (c13h < 8) { c13h = 8; c1h = s3h - c4h - c13h; }
  const c1y = s3y, c4y = c1y + c1h, c13y = c4y + c4h;
  const acc = '#75821D', accM = 'rgba(117,130,29,0.55)';
  let s = '<svg viewBox="0 0 720 220" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;min-height:280px;max-width:100%" role="img" aria-label="Emissions flow diagram">';
  s += '<path d="M36,' + s1y + ' C130,' + s1y + ' 130,' + s1y + ' 220,' + s1y + ' L220,' + (s1y + s1h) + ' C130,' + (s1y + s1h) + ' 130,' + (s1y + s1h) + ' 36,' + (s1y + s1h) + ' Z" fill="rgba(117,130,29,0.35)"/>';
  s += '<path d="M36,' + s2y + ' C130,' + s2y + ' 130,' + s3y + ' 220,' + s2y + ' L220,' + (s2y + s2h) + ' C130,' + (s2y + s2h) + ' 130,' + s3y + ' 36,' + (s2y + s2h) + ' Z" fill="rgba(117,130,29,0.18)"/>';
  s += '<path d="M36,' + s3y + ' C130,' + s3y + ' 130,' + s3y + ' 220,' + s3y + ' L220,' + yE + ' C130,' + yE + ' 130,' + yE + ' 36,' + yE + ' Z" fill="rgba(15,23,42,0.07)"/>';
  s += '<path d="M236,' + s3y + ' C358,' + s3y + ' 358,' + s3y + ' 480,' + s3y + ' L480,' + (c1y + c1h) + ' C358,' + (c1y + c1h) + ' 358,' + (c1y + c1h) + ' 236,' + (c1y + c1h) + ' Z" fill="rgba(15,23,42,0.11)"/>';
  s += '<path d="M236,' + (c1y + c1h) + ' C358,' + (c1y + c1h) + ' 358,' + (c1y + c1h) + ' 480,' + (c1y + c1h) + ' L480,' + (c4y + c4h) + ' C358,' + (c4y + c4h) + ' 358,' + (c4y + c4h) + ' 236,' + (c4y + c4h) + ' Z" fill="rgba(15,23,42,0.07)"/>';
  s += '<path d="M236,' + (c4y + c4h) + ' C358,' + (c4y + c4h) + ' 358,' + (c4y + c4h) + ' 480,' + (c4y + c4h) + ' L480,' + yE + ' C358,' + yE + ' 358,' + yE + ' 236,' + yE + ' Z" fill="rgba(15,23,42,0.05)"/>';
  s += '<rect x="20" y="' + yS + '" width="16" height="' + TH + '" fill="rgba(15,23,42,0.28)"/>';
  s += '<rect x="220" y="' + s1y + '" width="16" height="' + s1h + '" fill="' + acc + '"/>';
  s += '<rect x="220" y="' + s2y + '" width="16" height="' + s2h + '" fill="' + accM + '"/>';
  s += '<rect x="220" y="' + s3y + '" width="16" height="' + s3h + '" fill="rgba(15,23,42,0.38)"/>';
  s += '<rect x="480" y="' + c1y + '" width="16" height="' + c1h + '" fill="rgba(15,23,42,0.34)"/>';
  s += '<rect x="480" y="' + c4y + '" width="16" height="' + c4h + '" fill="rgba(15,23,42,0.26)"/>';
  s += '<rect x="480" y="' + c13y + '" width="16" height="' + c13h + '" fill="rgba(15,23,42,0.18)"/>';
  const s1cy = (s1y + s1h / 2 + 3).toFixed(0), s2cy = (s2y + s2h / 2 + 3).toFixed(0), s3ty = (s3y + 13).toFixed(0), s3py = (s3y + 33).toFixed(0), s3sy = (s3y + 49).toFixed(0);
  s += '<text x="240" y="' + s1cy + '" font-family="JetBrains Mono,monospace" font-size="9" fill="' + acc + '" letter-spacing="0.08em">SCOPE 1</text>';
  s += '<text x="315" y="' + s1cy + '" font-family="JetBrains Mono,monospace" font-size="9" fill="' + acc + '" text-anchor="end">' + s1p.toFixed(1) + '%</text>';
  s += '<text x="240" y="' + s2cy + '" font-family="JetBrains Mono,monospace" font-size="9" fill="#75821D">SCOPE 2</text>';
  s += '<text x="315" y="' + s2cy + '" font-family="JetBrains Mono,monospace" font-size="9" fill="#75821D" text-anchor="end">' + s2p.toFixed(1) + '%</text>';
  if (s3h > 30) {
    s += '<text x="240" y="' + s3ty + '" font-family="JetBrains Mono,monospace" font-size="9" fill="#64748B">SCOPE 3</text>';
    s += '<text x="240" y="' + s3py + '" font-family="JetBrains Mono,monospace" font-size="20" font-weight="bold" fill="#0F172A">' + s3p.toFixed(1) + '%</text>';
    if (s3h > 50) s += '<text x="240" y="' + s3sy + '" font-family="JetBrains Mono,monospace" font-size="8" fill="#64748B">of total footprint</text>';
  }
  const catLabel = (label, desc, pct, cy, ch) => {
    if (ch < 14) return;
    const ly = (cy + 11).toFixed(0), dy = (cy + 21).toFixed(0), py = (cy + 34).toFixed(0);
    s += '<text x="500" y="' + ly + '" font-family="JetBrains Mono,monospace" font-size="8" fill="#64748B" letter-spacing="0.05em">' + label + '</text>';
    if (ch > 44) {
      s += '<text x="500" y="' + dy + '" font-family="JetBrains Mono,monospace" font-size="7" fill="#64748B">' + desc + '</text>';
      s += '<text x="500" y="' + py + '" font-family="JetBrains Mono,monospace" font-size="11" font-weight="bold" fill="#0F172A">' + pct.toFixed(1) + '%</text>';
    } else {
      s += '<text x="700" y="' + ly + '" font-family="JetBrains Mono,monospace" font-size="10" font-weight="bold" fill="#0F172A" text-anchor="end">' + pct.toFixed(1) + '%</text>';
      if (ch > 26) s += '<text x="500" y="' + dy + '" font-family="JetBrains Mono,monospace" font-size="7" fill="#64748B">' + desc + '</text>';
    }
  };
  catLabel('CAT 1', 'Purchased goods &amp; services', cat1p, c1y, c1h);
  catLabel('CAT 4', 'Transport &amp; distribution', cat4p, c4y, c4h);
  catLabel('CAT 13', 'Downstream leased assets', cat13p, c13y, c13h);
  s += '</svg>';
  return s;
}

export const ROADMAP_INTRO = 'A three-stage method for moving from emissions data to a sequenced decarbonisation roadmap with CAPEX implications.';

export const ROADMAP_STAGES = [
  {
    n: 'Stage 01', title: 'Establish the baseline and constraints', obj: 'Objective: understand the starting point and limits',
    pts: ['Confirm Scope 1-3 boundaries, data confidence, and material gaps', 'Identify constraints: regulatory, commercial, operational', 'Map key stakeholders: portfolio managers, facility managers, procurement', 'Understand existing decarbonisation efforts and commitments'],
    note: 'Likely data gaps at this stage (capital goods, business travel, waste in operations) are flagged for a proxy method or excluded with a stated reason.',
  },
  {
    n: 'Stage 02', title: 'Identify and quantify mitigation options', obj: 'Objective: generate and evaluate options',
    pts: ['Develop long-list of initiatives across Scope 1-3', 'Quantify abatement, cost, and timing for each option', 'Identify initiatives to avoid, reduce, and replace emissions', 'Cover operations, design, supply chain, and asset use-phase'],
    note: 'Acknowledge ongoing decarbonisation scenarios: national grid trajectory, material and technology changes, policy pipeline.',
  },
  {
    n: 'Stage 03', title: 'Screen options and build the roadmap', obj: 'Objective: narrow options into a sequenced plan',
    pts: ['Short-list options with stakeholders using MCA (see next tab)', 'Build sequenced roadmap with CAPEX implications by year', 'Set interim targets aligned to SBTi or AASB S2 scenarios', 'Define governance, ownership, and monitoring cadence'],
    note: 'Output: a pathway model whose toggles show how lever choices move the trajectory, gross and net, by scope and business unit.',
  },
];

export const ROADMAP_LEVERS = {
  caption: 'Example mitigation levers by scope',
  head: ['Lever', 'Scope', 'Timing', 'Notes'],
  rows: [
    ['Renewable electricity (PPA / GreenPower)', 'Scope 2', 'Near-term', 'Largest early effect. Covers all purchased electricity with credible instruments.'],
    ['LV fleet transition (EV)', 'Scope 1', 'Near-to-mid', 'NVES trajectory sets baseline expectation. Faster procurement cycles speed it up.'],
    ['HV fleet transition', 'Scope 1', 'Mid-term', 'CSIRO pathway. Technology readiness constrains pace: most impact post-FY2029.'],
    ['Low-carbon materials procurement', 'Scope 3 Cat 1', 'Mid-term', 'Specification and supplier engagement. Locks in embodied carbon reductions at design stage.'],
    ['Supplier engagement programme', 'Scope 3 Cat 1/4', 'Ongoing', 'CDP supply chain, contractual requirements, capacity building for key suppliers.'],
    ['Asset performance upgrades', 'Scope 3 Cat 13', 'Long-term', 'NABERS ratings, all-electric design, green lease provisions. Aligned to capital planning cycles.'],
    ['Offsetting programmes', 'Residual', 'Long-term', 'Applied to residual hard-to-abate emissions only. Not a substitute for reduction.'],
  ],
};

export const MCA_INTRO = 'A multi-criteria analysis framework for prioritising decarbonisation initiatives, used to narrow a long-list of options into a sequenced roadmap with CAPEX implications. Stakeholders agree the weightings, and the framework structures the decision they make.';

export const MCA_CRITERIA = [
  { crit: 'Impact (carbon)', metric: 'Metric: total tCO₂-e reduction to 2050', body: 'Will the option deliver significant carbon reductions toward net zero targets? Primary quantitative screen.' },
  { crit: 'Cost-effectiveness', metric: 'Metric: net present cost / tCO₂-e avoided', body: 'Is the initiative cost-effective in achieving carbon reductions? Levelised cost of abatement used to identify the efficiency frontier before CAPEX commitments.' },
  { crit: 'Readiness', metric: 'Metric: technology and commercial maturity', body: 'Is the option technically and commercially ready to deploy at scale? When does it become feasible? Informs sequencing.' },
  { crit: 'Ability to influence', metric: 'Metric: organisational control vs. external dependency', body: 'Does the organisation have direct ability to act, or are collaboration and third-party decisions required? Determines ownership model.' },
  { crit: 'Risks and constraints', metric: 'Metric: safety, regulatory, reputational exposure', body: 'Significant safety, licensing, regulatory, or community risks? Go/no-go screen for initiatives with material downside exposure.' },
  { crit: 'Co-benefits', metric: 'Metric: value beyond carbon savings', body: 'Associated environmental, community, or strategic value beyond carbon savings. Includes resilience, regulatory positioning, and commercial differentiation.' },
];

export const MCA_ANALYSIS = {
  caption: 'Further analysis to support prioritisation',
  head: ['Analysis', 'Purpose', 'Key data sources'],
  rows: [
    ['Embodied carbon assessments', 'Quantify upfront emissions by building typology; identify material hotspots and assess impact of material and construction alternatives', 'LCA databases, supplier EPDs, BIM models, QS schedules'],
    ['Marginal abatement cost curve', 'Prioritise initiatives by cost-effectiveness and scale of emissions reduction', 'Supplier quotes, CAPEX estimates, financial models, market benchmarks'],
    ['Use-phase performance modelling', 'Project operational emissions over 30 years; validate NABERS and Green Star targets', 'NatHERS, FirstRate5, NABERS forecasting, utility benchmarks'],
    ['Capital planning alignment', 'Align decarbonisation measures with existing asset lifecycles and CAPEX planning', 'CAPEX plans, maintenance schedules, climate risk assessments'],
  ],
};

export const LCA = {
  claim: 'Upfront embodied carbon is emitted in the construction phase, and the window to reduce it closes at design stage.',
  meta: 'Illustrative · representative commercial office typology · method per GBCA Upfront Carbon Reduction guide v1.1 · not client data',
  modulesHead: 'System boundary: lifecycle modules in scope',
  modules: [
    { ref: 'A1-A3', label: 'Product stage', state: 'active' },
    { ref: 'A4', label: 'Transport to site', state: 'active' },
    { ref: 'A5', label: 'Construction', state: 'active' },
    { ref: 'B1-B7', label: 'Use stage', state: 'out' },
    { ref: 'C1-C4', label: 'End of life', state: 'out' },
    { ref: 'D', label: 'Beyond boundary', state: 'noted' },
  ],
  legend: [
    { cls: 'act', text: 'In scope (A1-A5)' },
    { cls: 'not', text: 'Module D: noted, outside the total' },
    { cls: 'oot', text: 'Out of scope for this assessment' },
  ],
  methodHead: 'Method: Upfront Carbon Reduction credit, Green Star Buildings v1.1',
  methodNote: 'Upfront carbon (A1-A5) is calculated to EN 15978 and EN 15804+A2, GWP100 on IPCC AR6 factors, over Gross Floor Area, aligned to the NABERS Embodied Carbon Rules. A reduction is demonstrated against one of two baselines. The companion Impacts Disclosure credit reports the same assessment across life cycle modules B to D.',
  pathwaysHead: 'Comparison pathways',
  pathways: [
    { tag: 'Pathway A · Benchmark', body: 'Beat a GBCA-defined carbon intensity benchmark for the building class. The direct route where a benchmark already exists.' },
    { tag: 'Pathway B · Reference building', body: 'Beat a self-built reference building of the same size, shape and function, priced on present-day typical construction and default specifications.' },
    { tag: 'Pathway C · NABERS Embodied Carbon', body: 'Reads across from the project NABERS Embodied Carbon rating. Noted in the guide as in development at the time of publication.' },
  ],
  hierarchy: {
    caption: 'Emission factor hierarchy: best available data first',
    head: ['Rank', 'Source', 'Basis'],
    rows: [
      ['01', 'Product-specific declaration', 'EPD, product carbon footprint or Climate Active certification for the actual product used'],
      ['02', 'Industry-average EPD', 'Worst-case value from the published industry range'],
      ['03', 'Database default', 'NABERS national material emission factors database, or a generic value from an LCA tool'],
      ['04', 'Global literature scan', 'Worst credible value for the product type, used only where nothing above is available'],
    ],
  },
  systemsHead: 'Upfront carbon by building system',
  systems: [
    { tag: 'Structural frame', pct: '65%', body: 'Concrete (in-situ and precast) and reinforcing steel. Primary hotspot. Reduction via structural efficiency, low-carbon concrete specification, and supplier EPD procurement.' },
    { tag: 'Envelope and MEP', pct: '27%', body: 'Building envelope (cladding, glazing, roofing) plus mechanical, electrical, and hydraulic services. Reduction via specification choices and system right-sizing.' },
    { tag: 'Internal fit-out', pct: '8%', body: 'Partitions, finishes, and fitments. Smallest upfront contribution. Circular economy and demountable design reduce end-of-life impact.' },
  ],
  hotspotsCaption: 'Material hotspot breakdown: upfront embodied carbon (A1-A5)',
  hotspots: [
    { name: 'In-situ concrete and precast', sub: 'Post-tensioned slabs, cores, columns', pct: '42%', w: 100, bg: 'var(--matcha)' },
    { name: 'Reinforcing and structural steel', sub: 'Rebar, fabricated sections', pct: '23%', w: 55, bg: 'rgba(62,110,52,0.8)' },
    { name: 'Building envelope', sub: 'Curtain wall, cladding, roofing', pct: '16%', w: 38, bg: 'rgba(62,110,52,0.6)' },
    { name: 'MEP systems', sub: 'Mechanical, electrical, hydraulic', pct: '11%', w: 26, bg: 'rgba(62,110,52,0.4)' },
    { name: 'Internal fit-out and other', sub: 'Partitions, finishes, landscaping', pct: '8%', w: 19, bg: 'rgba(62,110,52,0.25)' },
  ],
  benchHead: 'Benchmark comparison: upfront embodied carbon intensity (kgCO₂-e/m² GFA)',
  benchTicks: ['0', '200', '400', '600', '800'],
  benchLegend: [
    { color: '#CBBFB4', text: 'Reference building / benchmark range (400-700 kgCO₂-e/m²)' },
    { color: 'var(--matcha)', text: 'Illustrative building (520 kgCO₂-e/m²)' },
    { color: 'rgba(62,110,52,0.45)', text: 'Best practice target (<400 kgCO₂-e/m²)' },
  ],
  benchNote: 'Ranges indicative for a commercial office, GFA basis, A1-A5 boundary. Method follows the GBCA Upfront Carbon Reduction calculation guide v1.1 and the NABERS Embodied Carbon Rules.',
  levers: {
    caption: 'Reduction levers',
    head: ['Lever', 'Module', 'Reduction potential', 'Notes'],
    rows: [
      ['Structural efficiency (design-led)', 'A1-A3', '10-15%', 'Optimised structural form, reduced over-design, post-tensioning to cut concrete volume. Measured against the reference building at detailed design. Requires early engagement with the structural engineer.'],
      ['Low-carbon concrete specification', 'A1-A3', '15-30%', 'Supplementary cementitious materials (fly ash, GGBFS) to reduce clinker ratio. The reference building already defaults to 20-30% replacement, so gains are claimed above that baseline. EPD-backed and feasible now on most projects.'],
      ['EPD-informed procurement', 'A1-A3', '5-20%', 'Product-specific EPDs sit at the top of the emission factor hierarchy and displace worst-case industry averages. Compare across steel grades, concrete mixes and envelope systems to drive the market signal.'],
      ['Material reuse and retention', 'A1-A5', 'Varies', 'Reused materials carry zero embodied carbon in the assessment, transport and reprocessing aside. Retaining existing structure also avoids the demolition emissions owed under the Existing Building Compensation criterion on buildings under 50 years old.'],
    ],
  },
  tiles: [
    { h: 'Upfront carbon is set at design stage', b: 'The structural frame carries about 65% of upfront carbon (A1-A5), and it is fixed at design stage. Procurement and specification decisions determine the outcome.' },
    { h: 'Operational carbon is addressable', b: 'All-electric design paired with a grid decarbonisation trajectory can drive use-phase Scope 2 emissions to near-zero by the mid-2030s. This is the primary lever for buildings with long asset lives.' },
    { h: 'Removals are reported on their own', b: 'Carbon offsets, carbon-neutral certified products and stored biogenic carbon no longer reduce a project upfront carbon. Under v1.1 they are reported on their own in the Upfront Carbon Compensation credit, so A1-A5 hotspots have to be designed out.' },
  ],
};

export const CASE_INTRO = 'A composite walk-through of how the work runs, from raw fuel invoices to a pathway ready for a board paper. The figures are illustrative. Scroll through the four phases; the figure changes with each one.';

export const CASE_STEPS = [
  { num: '01', title: 'Establish the baseline', body: 'Fuel invoices, meter reads and subcontractor spend all arrive at different quality, so the first job is grading them: metered, estimated, or missing entirely. Boundaries then get set under operational control and the Scope 3 categories screened for materiality. Whatever falls out is written down with the reason attached, because an exclusion nobody documented is the thing an assurer finds first.', src: 'GHG Protocol · NGER · documented for external assurance' },
  { num: '02', title: 'Build the roadmap', body: 'A long-list runs to dozens of initiatives, most of which will not survive contact with a cost. Each one gets an abatement figure, a cost, and the year it becomes feasible. Stakeholders weight the criteria, the multi-criteria screen ranks what is left, and the survivors are sequenced against the capital plan so the CAPEX lands where the business can carry it.', src: 'MCA framework · marginal abatement cost · capital planning alignment' },
  { num: '03', title: 'Model the pathway', body: 'A toggle-based scenario model in which each lever (grid trajectory, fleet transition, plant electrification) carries its assumption and the source behind it. Built so a non-specialist can interrogate it, and so its outputs can go straight into a board paper.', src: 'DCCEEW 2025 · NVES Act 2024 · CSIRO Net Zero Pathways' },
  { num: '04', title: 'Make it repeatable', body: 'The method gets written down before the numbers go anywhere: data sources, boundary decisions, factors and exclusions, each with its reason. Repetitive steps such as supplier matching and fuel sorting move into scripts and templates, so the next reporting cycle reruns the same logic and an assurer can follow it line by line.', src: 'Excel · Python · Envizi' },
];
