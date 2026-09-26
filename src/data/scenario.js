// Decarbonisation scenario model — ported verbatim from the original site so
// every figure the chart and KPIs produce is byte-for-byte identical.

// Operating profiles. Property leads (default); infrastructure is the low-
// emphasis composite. Scales are illustrative but anchored to publicly listed
// peers — property landlords (Charter Hall, Stockland), a services operator
// midway between listed integrated-services peers, and apparel disclosures
// (Nike FY24, Hermès, LVMH) for textile. No profile tracks a single employer.
//
// `curve` selects the abatement decay set (F or F_TEXTILE); `levers` selects
// the label/source set in LEVER_LABELS. SH splits Scope 1&2 (or, for textile,
// the value-chain footprint) across the four lever buckets and sums to 1.
export const SECTOR_PROFILES = {
  property: {
    label: 'Commercial Property', FY20: 123000, FY25: 98000, FY26: 92000,
    SH: { s2: 0.62, lv: 0.10, hv: 0.04, plant: 0.24 },
    curve: 'base', levers: 'property',
    desc: 'Commercial office landlord: base-building grid electricity is the bulk of Scope 2. Renewable procurement decarbonises it fastest, all-electric retrofit removes on-site gas, and HVAC tuning plus green leases reach the tenant-influenced load.',
  },
  retail: {
    label: 'Retail · Shopping Centres', FY20: 105000, FY25: 84000, FY26: 79000,
    SH: { s2: 0.58, lv: 0.12, hv: 0.06, plant: 0.24 },
    curve: 'base', levers: 'retail',
    desc: 'Shopping-centre owner: common-area electricity dominates Scope 2 and refrigeration is the stubborn Scope 1 source. Renewable procurement and a low-GWP refrigerant transition are the big levers; retailer engagement reaches sub-metered tenant load.',
  },
  logistics: {
    label: 'Logistics & Industrial', FY20: 65000, FY25: 52000, FY26: 48000,
    SH: { s2: 0.56, lv: 0.12, hv: 0.12, plant: 0.20 },
    curve: 'base', levers: 'logistics',
    desc: 'Logistics and industrial estates: warehouse electricity with large rooftop-solar and PPA potential, so Scope 2 falls fast. Materials-handling electrification and efficiency close most of the rest; yard and heavy-equipment transition is the slower tail.',
  },
  textile: {
    label: 'Textile Retail', FY20: 42000, FY25: 35000, FY26: 34000,
    SH: { s2: 0.08, lv: 0.40, hv: 0.10, plant: 0.42 },
    curve: 'textile', levers: 'textile',
    desc: 'Textile retail: purchased goods dominate. Raw-material production and Tier-2 wet processing are roughly four-fifths of a value-chain footprint that is ~95% Scope 3. Own-operations renewables cut Scope 2 quickly; materials substitution ramps steadily; supplier decarbonisation (coal phase-out in dyeing and finishing) carries the largest, back-loaded reduction; freight mode shift trims logistics.',
  },
  infrastructure: {
    label: 'Infrastructure Services', FY20: 198000, FY25: 158000, FY26: 152000,
    SH: { s2: 0.12, lv: 0.24, hv: 0.30, plant: 0.34 },
    curve: 'base', levers: 'infrastructure',
    desc: 'Integrated infrastructure services: a diesel fleet and mobile plant drive Scope 1, with grid electricity a minor share. Fleet transition and plant electrification are the primary levers; grid decarbonisation supports Scope 2. Illustrative composite scaled between listed sector peers, not modelled on any single operator.',
  },
};

// Generic FY20 to FY25 shape, as a multiple of each profile's FY25 figure.
// Rounded and smoothed so it follows no single organisation's history.
export const HIST_SHAPE = [1.25, 1.28, 1.27, 1.2, 1.09, 1];

export const F = {
  grid: {
    base: [0.891, 0.813, 0.672, 0.453, 0.266, 0.250, 0.234, 0.219, 0.188, 0.188, 0.188, 0.172, 0.172, 0.172, 0.172, 0.163, 0.155, 0.147, 0.140, 0.133, 0.126, 0.120, 0.114, 0.108, 0.103],
    faster: [0.623, 0.447, 0.269, 0.136, 0.053, 0.038, 0.023, 0.022, 0.019, 0.019, 0.019, 0.017, 0.017, 0.017, 0.017, 0.016, 0.016, 0.015, 0.014, 0.013, 0.013, 0.012, 0.011, 0.011, 0.010],
    slower: [0.980, 0.894, 0.739, 0.498, 0.292, 0.275, 0.258, 0.241, 0.206, 0.206, 0.206, 0.189, 0.189, 0.189, 0.189, 0.180, 0.171, 0.162, 0.154, 0.146, 0.139, 0.132, 0.125, 0.119, 0.113],
    off: Array(25).fill(1.0),
  },
  lv: {
    base: [1.000, 0.940, 0.780, 0.613, 0.453, 0.387, 0.348, 0.313, 0.282, 0.254, 0.228, 0.205, 0.185, 0.166, 0.150, 0.135, 0.121, 0.109, 0.098, 0.088, 0.080, 0.072, 0.064, 0.058, 0.052],
    faster: [0.940, 0.780, 0.613, 0.453, 0.387, 0.348, 0.313, 0.282, 0.254, 0.228, 0.205, 0.185, 0.166, 0.150, 0.135, 0.121, 0.109, 0.098, 0.088, 0.080, 0.072, 0.064, 0.058, 0.052, 0.047],
    slower: [1.000, 1.000, 0.940, 0.780, 0.613, 0.453, 0.387, 0.348, 0.313, 0.282, 0.254, 0.228, 0.205, 0.185, 0.166, 0.150, 0.135, 0.121, 0.109, 0.098, 0.088, 0.080, 0.072, 0.064, 0.058],
  },
  hv: {
    base: [1.000, 0.968, 0.937, 0.905, 0.874, 0.842, 0.789, 0.737, 0.684, 0.632, 0.579, 0.526, 0.474, 0.421, 0.368, 0.316, 0.263, 0.211, 0.158, 0.105, 0.053, 0.000, 0.000, 0.000, 0.000],
    faster: [0.968, 0.937, 0.905, 0.874, 0.842, 0.789, 0.737, 0.684, 0.632, 0.579, 0.526, 0.474, 0.421, 0.368, 0.316, 0.263, 0.211, 0.158, 0.105, 0.053, 0.000, 0.000, 0.000, 0.000, 0.000],
    slower: [1.000, 1.000, 0.968, 0.937, 0.905, 0.874, 0.842, 0.789, 0.737, 0.684, 0.632, 0.579, 0.526, 0.474, 0.421, 0.368, 0.316, 0.263, 0.211, 0.158, 0.105, 0.053, 0.000, 0.000, 0.000],
  },
  plant: {
    base: [0.938, 0.875, 0.812, 0.750, 0.687, 0.625, 0.563, 0.530, 0.498, 0.466, 0.434, 0.402, 0.369, 0.337, 0.305, 0.273, 0.241, 0.208, 0.176, 0.144, 0.112, 0.080, 0.047, 0.015, 0.000],
    faster: [0.703, 0.656, 0.609, 0.563, 0.516, 0.469, 0.422, 0.398, 0.374, 0.349, 0.325, 0.301, 0.277, 0.253, 0.229, 0.205, 0.180, 0.156, 0.132, 0.108, 0.084, 0.060, 0.036, 0.011, 0.000],
    slower: [1.000, 1.000, 1.000, 0.938, 0.859, 0.781, 0.703, 0.663, 0.623, 0.582, 0.542, 0.502, 0.462, 0.421, 0.381, 0.341, 0.301, 0.260, 0.220, 0.180, 0.140, 0.100, 0.059, 0.019, 0.000],
    off: Array(25).fill(1.0),
  },
};

export const REV = { flat: 1.000, moderate: 1.015, high: 1.030 };

// Plain-text forms of the control settings, for the run summary the result
// panel carries. The model owns these rather than the component, because the
// summary has to say exactly what was fed into the maths.
const OPT_TEXT = { base: 'Base', faster: 'Faster', slower: 'Slower', off: 'Off' };
const REV_TEXT = { flat: 'flat', moderate: '+1.5%/yr', high: '+3.0%/yr' };

// Number formatting for the KPI tiles. `kt` matches the thousand-tonne form
// the chart and contribution bars already use; `signed` and `pct1` carry an
// explicit direction so a change never has to be inferred from context.
const kt = (v) => Math.round(v / 1000) + 'k\u00a0t';
const signed = (v) => (v > 0 ? '+' : v < 0 ? '\u2212' : '') + kt(Math.abs(v));
const pct1 = (v) => (v > 0 ? '+' : v < 0 ? '\u2212' : '') + Math.abs(v).toFixed(1) + '%';
// A rounding-width deadband, so a change smaller than the tile can show is
// called flat rather than dressed up as movement.
const dirOf = (v, base) => (v / base < -0.001 ? 'down' : v / base > 0.001 ? 'up' : 'flat');

// Textile-specific lever curves (illustrative). Distinct decay shapes so the
// boutique-textile scenario produces a visibly different pathway.
export const F_TEXTILE = (() => {
  const build = (fn) => {
    const a = [];
    for (let i = 0; i < 25; i++) a.push(+Math.max(0, Math.min(1, fn(i))).toFixed(3));
    return a;
  };
  const faster = (a) => { const b = a.slice(1); b.push(a[a.length - 1]); return b; };
  const slower = (a) => { const b = a.slice(0, -1); b.unshift(a[0]); return b; };
  const off = () => Array(25).fill(1.0);
  const renew = build((i) => Math.max(0.02, Math.exp(-i / 2.5)));
  const dye = build((i) => Math.max(0.40, 1 - i * 0.025));
  const freight = build((i) => 1 / (1 + Math.exp((i - 8) / 2)));
  const bio = build((i) => 1 / (1 + Math.exp((i - 14) / 2.5)));
  return {
    grid: { base: renew, faster: faster(renew), slower: slower(renew), off: off() },
    lv: { base: dye, faster: faster(dye), slower: slower(dye) },
    hv: { base: freight, faster: faster(freight), slower: slower(freight) },
    plant: { base: bio, faster: faster(bio), slower: slower(bio), off: off() },
  };
})();

// Per-sector lever labels + sources. Every sector's `grid` slot is a grid /
// renewable-electricity lever (grid decarbonisation applies to all electricity-
// consuming sectors, textile included); the other three slots differ by sector
// so no two profiles share the same decarbonisation story. The curve each slot
// drives is fixed by the engine, so labels are chosen to match each curve's
// real-world timing (fast grid, steady mid, slow/late, linear electrification).
export const LEVER_LABELS = {
  property: {
    grid: { name: 'Renewable Electricity Procurement', src: 'PPA + GreenPower · market-based Scope 2' },
    lv: { name: 'HVAC & Plant Efficiency', src: 'NABERS-rated base-building tuning' },
    hv: { name: 'Green Leases & Tenant Engagement', src: 'Better Buildings Partnership green-lease pathway' },
    plant: { name: 'All-Electric Retrofit', src: 'Gas heating & hot-water electrification' },
    cbar: { grid: 'Renewable Electricity', lv: 'HVAC Efficiency', hv: 'Green Leases', plant: 'All-Electric Retrofit' },
    sub: 'Adjust the levers to see how a commercial office portfolio reaches net-zero Scope 1 and 2. Assumptions draw on the DCCEEW 2025 grid emission-factor trajectory, NABERS base-building performance, and published property-sector electrification pathways.',
  },
  retail: {
    grid: { name: 'Renewable Electricity Procurement', src: 'PPA + GreenPower · market-based Scope 2' },
    lv: { name: 'Refrigeration & HVAC Efficiency', src: 'Common-area plant optimisation' },
    hv: { name: 'Retailer & Tenant Engagement', src: 'Green-lease + sub-metering pathway' },
    plant: { name: 'Low-GWP Refrigerant Transition', src: 'HFC phase-down · Kigali / Montreal Protocol' },
    cbar: { grid: 'Renewable Electricity', lv: 'Refrigeration Efficiency', hv: 'Tenant Engagement', plant: 'Refrigerant Transition' },
    sub: 'Model how a shopping-centre portfolio decarbonises. Common-area electricity follows the DCCEEW grid trajectory and renewable procurement; refrigeration efficiency and a low-GWP refrigerant transition track the HFC phase-down; tenant engagement reaches sub-metered retail load.',
  },
  logistics: {
    grid: { name: 'On-site Solar & Renewable PPA', src: 'Rooftop PV + PPA · market-based Scope 2' },
    lv: { name: 'Warehouse Energy Efficiency', src: 'LED, cold-chain and BMS optimisation' },
    hv: { name: 'Yard & Heavy Equipment Transition', src: 'CSIRO Net Zero Pathways · technology-constrained' },
    plant: { name: 'Materials-Handling Electrification', src: 'Forklift + MHE fleet electrification' },
    cbar: { grid: 'On-site Solar & PPA', lv: 'Energy Efficiency', hv: 'Heavy Equipment', plant: 'MHE Electrification' },
    sub: 'Explore a logistics and industrial estate pathway. Warehouse roofs carry large solar and PPA potential, so Scope 2 falls fast; materials-handling electrification and efficiency follow; yard and heavy-equipment transition is technology-constrained and lands later.',
  },
  infrastructure: {
    grid: { name: 'Grid Decarbonisation', src: 'DCCEEW 2025 Table 42 NEM trajectory' },
    lv: { name: 'LV Fleet Transition', src: 'NVES Act 2024 · 1-yr adoption lag' },
    hv: { name: 'HV Fleet & Mobile Plant', src: 'CSIRO Net Zero Pathways 2023 · 1-yr lag' },
    plant: { name: 'Plant Electrification', src: 'Industry plant electrification analysis' },
    cbar: { grid: 'Grid (Scope 2)', lv: 'LV Fleet', hv: 'HV Fleet & Plant', plant: 'Plant Electrification' },
    sub: 'A services operator with a diesel fleet and mobile plant. Lever assumptions draw on the DCCEEW 2025 grid emission-factor tables, the NVES Act 2024 (light vehicles), CSIRO Net Zero Pathways (heavy fleet), and published plant-electrification analysis. Illustrative composite, not any single operator.',
  },
  textile: {
    grid: { name: 'Renewable Electricity (own operations)', src: 'RE100 · Nike 96%, Hermès 98% market-based' },
    lv: { name: 'Preferred Materials Substitution', src: 'Recycled / organic / bio fibre · Textile Exchange' },
    hv: { name: 'Freight Mode Shift (Air → Ocean)', src: 'Clean Cargo · logistics decarbonisation' },
    plant: { name: 'Supplier Decarbonisation (Tier-2)', src: 'Coal phase-out in dyeing · SBTi supplier pathway' },
    cbar: { grid: 'Own-ops Renewables', lv: 'Materials Substitution', hv: 'Freight Mode Shift', plant: 'Supplier (Tier-2)' },
    sub: 'Explore how a textile retailer cuts a value-chain footprint that is ~95% Scope 3. Own-operations renewables saturate early; preferred-materials substitution ramps steadily; supplier (Tier-2) decarbonisation and coal phase-out in wet processing carry the largest, back-loaded reduction; freight mode shift trims logistics. Anchored to Nike FY24, Hermès and LVMH disclosures.',
  },
};

// Property leads (default). All profiles get identical selector treatment;
// infrastructure sits among the property peers rather than dangling last.
export const SECTOR_OPTIONS = [
  { value: 'property', label: 'Commercial Property' },
  { value: 'retail', label: 'Retail · Shopping Centres' },
  { value: 'logistics', label: 'Logistics & Industrial' },
  { value: 'infrastructure', label: 'Infrastructure Services' },
  { value: 'textile', label: 'Textile Retail' },
];

export const chartLabels = (() => {
  const a = [];
  for (let y = 2020; y <= 2050; y++) a.push('FY' + y);
  return a;
})();

// Resolve the active sector profile (FY20/FY25/SH/HIST), its abatement curve
// set ('base' | 'textile') and its lever-label key.
export function resolveSector(sectorKey) {
  const prof = SECTOR_PROFILES[sectorKey] || SECTOR_PROFILES.property;
  return {
    mode: prof.curve,
    levers: prof.levers,
    FY20: prof.FY20, FY25: prof.FY25, FY26: prof.FY26,
    SH: prof.SH,
    HIST: HIST_SHAPE.map((h) => Math.round(h * prof.FY25)),
    desc: prof.desc,
    label: prof.label,
  };
}

// Core model. Returns everything the UI needs to render: series for the chart,
// KPI values, the dynamic takeaway, and per-lever FY30 contribution bars.
export function runModel(scn) {
  const { grid: gk, lv: lk, hv: hk, plant: pk, rev: rk } = scn;
  const { mode, levers, FY20, FY25, FY26, SH, HIST, label } = resolveSector(scn.sector);
  const FT = mode === 'textile' ? F_TEXTILE : F;
  const currentYear = new Date().getFullYear();

  const net = [], gridLayer = [], lvLayer = [], hvLayer = [], plantLayer = [], bau = [], actuals = [];
  let net30 = 0, bau30 = 0;

  for (let y = 2020; y <= 2050; y++) {
    if (y <= 2025) {
      const h = HIST[y - 2020];
      net.push(h);
      gridLayer.push(h); lvLayer.push(h); hvLayer.push(h); plantLayer.push(h);
      bau.push(h);
      actuals.push(y <= currentYear ? h : null);
    } else {
      const n = y - 2025, fi = y - 2026;
      const gf = Math.pow(REV[rk], n);
      const g = Math.round(FY25 * gf);
      bau.push(g);
      const gFac = fi < 25 ? FT.grid[gk][fi] : 0.10;
      const lvFac = fi < 25 ? FT.lv[lk][fi] : 0.01;
      const hvFac = fi < 25 ? FT.hv[hk][fi] : 0.00;
      const pFac = fi < 25 ? FT.plant[pk][fi] : 0.00;
      const s2gross = FY25 * SH.s2 * gf;
      const lvGross = FY25 * SH.lv * gf;
      const hvGross = FY25 * SH.hv * gf;
      const plGross = FY25 * SH.plant * gf;
      const s2net = s2gross * gFac;
      const lvNet = lvGross * lvFac;
      const hvNet = hvGross * hvFac;
      const plNet = plGross * pFac;
      const netVal = Math.max(0, s2net + lvNet + hvNet + plNet);
      const gridAbat = s2gross - s2net;
      const lvAbat = lvGross - lvNet;
      const hvAbat = hvGross - hvNet;
      const plAbat = plGross - plNet;
      net.push(netVal);
      gridLayer.push(netVal + gridAbat);
      lvLayer.push(netVal + gridAbat + lvAbat);
      hvLayer.push(netVal + gridAbat + lvAbat + hvAbat);
      plantLayer.push(netVal + gridAbat + lvAbat + hvAbat + plAbat);
      actuals.push(y <= currentYear ? netVal : null);
      if (y === 2030) { net30 = netVal; bau30 = g; }
    }
  }

  // KPI tiles. Enterprise climate-reporting UI pins every metric to its
  // baseline and states the change in the same tile, absolute and relative
  // both. That convention is worth taking: a bare number is a fact the reader
  // then has to go and look up, and the four unpaired figures this strip used
  // to carry made them do the arithmetic by eye. Each tile now brings its own
  // comparator and a signed change.
  const d26 = FY26 - FY20;
  const d30 = net30 - FY20;
  const avoided30 = Math.max(0, bau30 - net30);
  const anchor = 'Baseline FY20 \u00b7 ' + kt(FY20);
  const kpis = [
    {
      key: 'base',
      label: 'FY20 Baseline',
      value: kt(FY20),
      note: 'Illustrative \u00b7 every change below is measured against it',
    },
    {
      key: 'fy26',
      label: 'FY26 (illustrative)',
      value: kt(FY26),
      base: anchor,
      change: [signed(d26), pct1(d26 / FY20 * 100)],
      dir: dirOf(d26, FY20),
    },
    {
      key: 'net',
      label: 'FY30 Net',
      value: kt(net30),
      base: anchor,
      change: [signed(d30), pct1(d30 / FY20 * 100)],
      dir: dirOf(d30, FY20),
      live: true,
    },
    {
      key: 'abated',
      label: 'FY30 Abatement',
      value: kt(avoided30),
      base: 'Business as usual \u00b7 ' + kt(bau30),
      change: [pct1(-avoided30 / bau30 * 100) + ' vs BAU'],
      dir: dirOf(-avoided30, bau30),
      live: true,
    },
  ];

  // Dynamic takeaway — the headline a board slide would carry.
  const pct = (FY20 - net30) / FY20 * 100;
  const avoided = Math.max(0, Math.round((bau30 - net30) / 1000));
  const rel = pct >= 0
    ? Math.round(pct) + '% below the FY20 baseline'
    : Math.abs(Math.round(pct)) + '% above the FY20 baseline';
  const verdict = pct >= 50
    ? 'ahead of a 1.5°C-aligned interim cut of ~50%.'
    : 'short of a 1.5°C-aligned interim cut of ~50%.';
  const takeaway = {
    head: 'These levers land FY30 at ',
    value: Math.round(net30 / 1000) + 'k tCO₂-e',
    tail: ', ' + rel + ', avoiding ' + avoided + 'k t against business-as-usual, ' + verdict,
    note: 'Headline recalculates from your lever settings · FY30 interim target year · illustrative figures',
  };

  // Contribution bars at FY30 (the interim target year).
  const fi30 = 4, gf30 = Math.pow(REV[rk], 5);
  const sv_g = FY25 * SH.s2 * gf30 * (1 - FT.grid[gk][fi30]);
  const sv_lv = FY25 * SH.lv * gf30 * (1 - FT.lv[lk][fi30]);
  const sv_hv = FY25 * SH.hv * gf30 * (1 - FT.hv[hk][fi30]);
  const sv_pl = FY25 * SH.plant * gf30 * (1 - FT.plant[pk][fi30]);
  const maxSv = Math.max(sv_g, sv_lv, sv_hv, sv_pl, 1);
  const bar = (s) => ({ width: Math.max(0, s / maxSv * 100), label: s > 0 ? Math.round(s / 1000) + 'k t' : '0' });

  // The run summary. A results panel that does not restate its own settings
  // makes the reader scroll back to the levers to find out what they are
  // looking at, so the panel carries the profile, the growth assumption and
  // every lever position alongside the numbers they produced. The horizon is
  // not here because it is not a control: the basis strip states it once.
  const cb = LEVER_LABELS[levers].cbar;
  const frame = {
    profile: label,
    growth: REV_TEXT[rk],
    levers: [
      { name: cb.grid, set: OPT_TEXT[gk] },
      { name: cb.lv, set: OPT_TEXT[lk] },
      { name: cb.hv, set: OPT_TEXT[hk] },
      { name: cb.plant, set: OPT_TEXT[pk] },
    ],
  };

  return {
    mode, leverKey: levers,
    series: { net, gridLayer, lvLayer, hvLayer, plantLayer, bau, actuals },
    kpis, frame,
    takeaway,
    contrib: { grid: bar(sv_g), lv: bar(sv_lv), hv: bar(sv_hv), plant: bar(sv_pl) },
    chartTitle: mode === 'textile' ? 'Value chain footprint pathway to FY50' : 'Scope 1 & 2 emissions pathway to FY50',
  };
}
