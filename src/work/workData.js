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

// The Sankey figure as an SVG markup string. Two layouts:
//  - wide (container 900px and up): the original 720 x 220 composition, with
//    every font floored so it renders at 12px or more at the measured width;
//  - narrow (below 900px): drawn at the container's own pixel width, one unit
//    per pixel, so labels hold at 12 to 13px on a phone instead of shrinking
//    to 5px with a fixed viewBox. It drops the unlabelled source bar on small
//    screens and gives the Scope 3 categories a right-hand label column.
// Colours come from classes in work.css (.sk-*), so the figure uses the
// site's warm tokens rather than hard-coded slate hex.
const esc = (t) => t.replace(/&/g, '&amp;');
const CATS = [
  ['CAT 1', 'Purchased goods & services'],
  ['CAT 4', 'Transport & distribution'],
  ['CAT 13', 'Downstream leased assets'],
];

function sankeyLabel(s1p, s2p, s3p, cat1p, cat4p, cat13p) {
  return 'Emissions flow diagram. Scope 1 ' + s1p.toFixed(1) + '%, Scope 2 ' + s2p.toFixed(1)
    + '%, Scope 3 ' + s3p.toFixed(1) + '% of the total footprint. Scope 3 flows to Category 1, purchased goods and services, '
    + cat1p.toFixed(1) + '%; Category 4, transport and distribution, ' + cat4p.toFixed(1)
    + '%; Category 13, downstream leased assets, ' + cat13p.toFixed(1) + '%.';
}

// Word-wrap a description into lines of at most n characters.
function wrap(text, n) {
  const lines = [];
  let cur = '';
  text.split(' ').forEach((w) => {
    if (!cur) cur = w;
    else if ((cur + ' ' + w).length <= n) cur += ' ' + w;
    else { lines.push(cur); cur = w; }
  });
  if (cur) lines.push(cur);
  return lines;
}

const band = (x1, x2, a1, a2, b1, b2, cls, op) => {
  const mx = (x1 + x2) / 2;
  return '<path d="M' + x1 + ',' + a1 + ' C' + mx + ',' + a1 + ' ' + mx + ',' + b1 + ' ' + x2 + ',' + b1
    + ' L' + x2 + ',' + b2 + ' C' + mx + ',' + b2 + ' ' + mx + ',' + a2 + ' ' + x1 + ',' + a2 + ' Z" class="' + cls + '" fill-opacity="' + op + '"/>';
};
const rect = (x, y, w, h, cls, op) => '<rect x="' + x + '" y="' + y.toFixed(1) + '" width="' + w + '" height="' + h.toFixed(1) + '" class="' + cls + '" fill-opacity="' + op + '"/>';
const text = (x, y, size, cls, body, extra = '') => '<text x="' + x + '" y="' + Math.round(y) + '" font-size="' + size + '" class="' + cls + '"' + extra + '>' + esc(body) + '</text>';

function splitHeights(TH, s1p, s2p, cat, min) {
  const s1h = Math.max(min.s1, (s1p / 100) * TH);
  const s2h = Math.max(min.s2, (s2p / 100) * TH);
  const s3h = TH - s1h - s2h;
  const totalCat = cat[0] + cat[1] + cat[2] || 1;
  let c1h = Math.max(min.c1, (cat[0] / totalCat) * s3h);
  const c4h = Math.max(min.c4, (cat[1] / totalCat) * s3h);
  let c13h = s3h - c1h - c4h;
  if (c13h < min.c13) { c13h = min.c13; c1h = s3h - c4h - c13h; }
  return { s1h, s2h, s3h, ch: [c1h, c4h, c13h] };
}

function wideSankey(s1p, s2p, s3p, cat, width, label) {
  const TH = 140, yS = 40, yE = 180;
  // Floor every font so it renders at 12px or more at the measured width.
  const scale = width ? width / 720 : 1;
  const f = (n) => +Math.max(n, 12 / scale).toFixed(1);
  const { s1h, s2h, s3h, ch } = splitHeights(TH, s1p, s2p, cat, { s1: 7, s2: 5, c1: 14, c4: 14, c13: 14 });
  const s1y = yS, s2y = s1y + s1h, s3y = s2y + s2h;
  const cy = [s3y, s3y + ch[0], s3y + ch[0] + ch[1]];
  let s = '<svg class="sk-svg" viewBox="0 0 720 220" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + label + '">';
  s += band(36, 220, s1y, s1y + s1h, s1y, s1y + s1h, 'sk-acc', 0.35);
  s += band(36, 220, s2y, s2y + s2h, s2y, s2y + s2h, 'sk-acc', 0.18);
  s += band(36, 220, s3y, yE, s3y, yE, 'sk-ink', 0.07);
  s += band(236, 480, cy[0], cy[0] + ch[0], cy[0], cy[0] + ch[0], 'sk-ink', 0.11);
  s += band(236, 480, cy[1], cy[1] + ch[1], cy[1], cy[1] + ch[1], 'sk-ink', 0.07);
  s += band(236, 480, cy[2], yE, cy[2], yE, 'sk-ink', 0.05);
  s += rect(20, yS, 16, TH, 'sk-ink', 0.28);
  s += rect(220, s1y, 16, s1h, 'sk-acc', 1);
  s += rect(220, s2y, 16, s2h, 'sk-acc', 0.55);
  s += rect(220, s3y, 16, s3h, 'sk-ink', 0.38);
  s += rect(480, cy[0], 16, ch[0], 'sk-ink', 0.34);
  s += rect(480, cy[1], 16, ch[1], 'sk-ink', 0.26);
  s += rect(480, cy[2], 16, ch[2], 'sk-ink', 0.18);
  const ls = ' letter-spacing="0.08em"';
  s += text(240, s1y + s1h / 2 + 3, f(9), 'sk-t-acc', 'SCOPE 1', ls);
  s += text(330, s1y + s1h / 2 + 3, f(9), 'sk-t-acc', s1p.toFixed(1) + '%', ' text-anchor="end"');
  s += text(240, s2y + s2h / 2 + 3, f(9), 'sk-t-acc', 'SCOPE 2', ls);
  s += text(330, s2y + s2h / 2 + 3, f(9), 'sk-t-acc', s2p.toFixed(1) + '%', ' text-anchor="end"');
  if (s3h > 30) {
    s += text(240, s3y + 13, f(9), 'sk-t-mute', 'SCOPE 3', ls);
    s += text(240, s3y + 33, f(20), 'sk-t-strong', s3p.toFixed(1) + '%', ' font-weight="700"');
    if (s3h > 50) s += text(240, s3y + 49, f(8), 'sk-t-mute', 'of total footprint');
  }
  // Every category value sits in the same right-hand column, on the label line.
  CATS.forEach(([lab, desc], i) => {
    if (ch[i] < 14) return;
    const ly = cy[i] + 11;
    s += text(500, ly, f(8), 'sk-t-mute', lab, ' letter-spacing="0.05em"');
    s += text(700, ly, f(10), 'sk-t-strong', cat[i].toFixed(1) + '%', ' font-weight="700" text-anchor="end"');
    if (ch[i] > 26) s += text(500, cy[i] + 21, f(7), 'sk-t-mute', desc);
  });
  return s + '</svg>';
}

function narrowSankey(s1p, s2p, s3p, cat, width, label) {
  const W = Math.max(300, Math.round(width));
  const TH = W < 520 ? 300 : 260, yS = 8, yE = yS + TH, H = yE + 8;
  const NW = 12;
  const withSource = W >= 560;
  const xS = withSource ? Math.round(W * 0.2) : 0;
  const labelW = Math.round(Math.min(260, Math.max(150, W * 0.42)));
  const xC = W - labelW - NW - 10;
  const { s1h, s2h, s3h, ch } = splitHeights(TH, s1p, s2p, cat, { s1: 16, s2: 16, c1: 18, c4: 18, c13: 18 });
  const s1y = yS, s2y = s1y + s1h, s3y = s2y + s2h;
  const cy = [s3y, s3y + ch[0], s3y + ch[0] + ch[1]];
  let s = '<svg class="sk-svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + label + '">';
  if (withSource) {
    s += band(NW, xS, s1y, s1y + s1h, s1y, s1y + s1h, 'sk-acc', 0.35);
    s += band(NW, xS, s2y, s2y + s2h, s2y, s2y + s2h, 'sk-acc', 0.18);
    s += band(NW, xS, s3y, yE, s3y, yE, 'sk-ink', 0.07);
    s += rect(0, yS, NW, TH, 'sk-ink', 0.28);
  }
  const x0 = xS + NW;
  s += band(x0, xC, cy[0], cy[0] + ch[0], cy[0], cy[0] + ch[0], 'sk-ink', 0.11);
  s += band(x0, xC, cy[1], cy[1] + ch[1], cy[1], cy[1] + ch[1], 'sk-ink', 0.07);
  s += band(x0, xC, cy[2], yE, cy[2], yE, 'sk-ink', 0.05);
  s += rect(xS, s1y, NW, s1h, 'sk-acc', 1);
  s += rect(xS, s2y, NW, s2h, 'sk-acc', 0.55);
  s += rect(xS, s3y, NW, s3h, 'sk-ink', 0.38);
  s += rect(xC, cy[0], NW, ch[0], 'sk-ink', 0.34);
  s += rect(xC, cy[1], NW, ch[1], 'sk-ink', 0.26);
  s += rect(xC, cy[2], NW, ch[2], 'sk-ink', 0.18);
  const lx = x0 + 8, rx = xC - 8, ls = ' letter-spacing="0.06em"';
  s += text(lx, s1y + s1h / 2 + 4, 12, 'sk-t-acc', 'SCOPE 1', ls);
  s += text(rx, s1y + s1h / 2 + 4, 13, 'sk-t-acc', s1p.toFixed(1) + '%', ' font-weight="700" text-anchor="end"');
  s += text(lx, s2y + s2h / 2 + 4, 12, 'sk-t-acc', 'SCOPE 2', ls);
  s += text(rx, s2y + s2h / 2 + 4, 13, 'sk-t-acc', s2p.toFixed(1) + '%', ' font-weight="700" text-anchor="end"');
  s += text(lx, s3y + 20, 12, 'sk-t-mute', 'SCOPE 3', ls);
  s += text(lx, s3y + 46, 24, 'sk-t-strong', s3p.toFixed(1) + '%', ' font-weight="700"');
  if (s3h > 80) s += text(lx, s3y + 66, 12, 'sk-t-mute', 'of total footprint');
  const cx = xC + NW + 8, perLine = Math.floor((W - cx) / 7.3);
  CATS.forEach(([lab, desc], i) => {
    const top = cy[i];
    s += text(cx, top + 15, 12, 'sk-t-mute', lab, ' letter-spacing="0.05em"');
    s += text(W, top + 15, 13, 'sk-t-strong', cat[i].toFixed(1) + '%', ' font-weight="700" text-anchor="end"');
    // The description shows whole or not at all: half a phrase reads as a
    // different category.
    const lines = wrap(desc, perLine);
    if (top + 31 + (lines.length - 1) * 15 + 3 <= top + ch[i]) {
      lines.forEach((line, j) => { s += text(cx, top + 31 + j * 15, 12, 'sk-t-mute', line); });
    }
  });
  return s + '</svg>';
}

// width: the container's measured width in px. Omitted, the wide layout is
// returned at its original sizes.
export function buildSankey(s1p, s2p, s3p, cat1p, cat4p, cat13p, width) {
  const cat = [cat1p, cat4p, cat13p];
  const label = sankeyLabel(s1p, s2p, s3p, cat1p, cat4p, cat13p);
  return width && width < 900
    ? narrowSankey(s1p, s2p, s3p, cat, width, label)
    : wideSankey(s1p, s2p, s3p, cat, width, label);
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
