// All editorial copy for the home page, plus the shared footer, tool index and
// gate copy. Components only lay these strings out.

export const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#bio', label: 'Capabilities' },
  { href: '#principles', label: 'My practice' },
  { href: '#experience', label: 'Experience' },
  { href: '#scenario', label: 'Decarb model' },
  { href: '#tools', label: 'Tools' },
  { href: 'work/', label: 'Work samples', external: true },
  { href: 'footprint/', label: 'Life Footprint', external: true },
];

// Years since a start date, floored to the half year. Never rounds up, so a
// counter or a sentence built on it cannot claim a half year not yet served.
export function yearsSince(startISO, now = Date.now()) {
  const years = (now - new Date(startISO)) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, Math.floor(years * 2) / 2);
}

const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

// "Four and a half years", "Five years": the bio says in words what the hero
// counter shows in figures, from the same start date and the same floor.
function yearsInWords(startISO) {
  const y = yearsSince(startISO);
  const whole = Math.floor(y);
  const half = y - whole === 0.5;
  const word = NUMBER_WORDS[whole] ?? String(whole);
  if (half) return `${word} and a half years`;
  return `${word} year${whole === 1 ? '' : 's'}`;
}

const SUSTAINABILITY_START = '2022-02-01';
const PROFESSIONAL_START = '2020-03-01';

export const HERO = {
  name: ['Chris', 'Wang'],
  roles: ['Senior Sustainability Advisor', 'Emissions Modeller', 'GHG Reporting and Assurance'],
  location: 'Melbourne, Australia',
  prop: 'I help large organisations turn emissions data into governed reporting and decarbonisation pathways, documented well enough for an assurer to follow.',
  ctas: [
    { label: 'Get in touch', href: '#contact', primary: true, icon: 'linkedin' },
  ],
  // Animated counters: the start date drives the live figure, floored to the
  // half year by yearsSince above.
  instruments: [
    { id: 'years-sustainability', label: ['Years in', 'sustainability'], start: SUSTAINABILITY_START, suffix: '+' },
    { id: 'years-professional', label: ['Years professional', 'experience'], start: PROFESSIONAL_START, suffix: '+' },
  ],
};

export const BIO_PARAS = [
  `${yearsInWords(SUSTAINABILITY_START)} in sustainability, at WSP and now Downer Group, after two years delivering capital infrastructure projects at the Department of Defence. The work covers GHG accounting, regulatory reporting, decarbonisation modelling and supply chain emissions.`,
  'I build the data infrastructure behind sustainability commitments: GHG inventories with documented methodology, Scope 1-3 baselines that hold up under external assurance, decarbonisation models with traceable lever assumptions, and reporting systems the team can run without me.',
  'Longer term, I am interested in sustainability roles in fashion, consumer goods and technology, where supply chain transparency and decarbonisation are core work.',
];

export const OUTCOMES = [
  { color: 'var(--accent-ink)', num: '×57', small: '', what: 'Supplier spend overstated about 57 times, found during PwC assurance and traced to its source field in three days', where: 'FY26 Scope 3 · Downer Group' },
  { color: 'var(--indigo-ink)', num: 'All', small: ' NSW Government entities', what: 'Covered by the emissions accounting guidelines I co-developed under NSW Treasury\'s reporting framework', where: 'NGERS · AASB S2 · GHG Protocol · WSP' },
  { color: 'var(--amber-ink)', num: '+63', small: '%', what: 'GRESB Infrastructure global ranking in year one, with the score up 35%', where: 'Major Australian energy distributor · FY22 submission I led · WSP' },
];

export const PIPELINE = [
  {
    step: 'raw', n: '01', label: 'Raw data', icon: 'box', color: 'var(--step-raw)',
    desc: 'Pre-configured collection templates, automated upload pipelines and review tools that cut manual handling and keep the audit trail with the data.',
    examples: [
      { title: 'Subcontractor diesel reporting templates', body: 'Pre-configured Excel templates with embedded calculation logic that generate the Envizi upload. They replaced manual supplier sorting and matching each quarter across three Downer business units.', outcome: 'Three business units, Downer Group' },
      { title: 'Subcontractor diesel estimation pipeline', body: 'Rebuilt the subcontractor diesel estimate: survey actuals first, then a category proxy from CPI-adjusted pooled responses, then a fallback. Then specified it, with a 65-check validator, for handover to the data team.', outcome: 'Subcontractor emissions reporting, Downer Group' },
    ],
  },
  {
    step: 'calc', n: '02', label: 'Calculation', icon: 'spark', color: 'var(--step-calc)',
    desc: 'GHG inventory preparation and Scope 1-3 accounting aligned to the GHG Protocol and NGER, with the method documented for external assurance and reuse across reporting cycles.',
    examples: [
      { title: 'GHG recalculation module', body: 'Independent recalculation module with operational control boundary filtering, built to reconcile Group-level emissions calculations against Envizi outputs.', outcome: 'Group Scope 1 and 2 reconciled to the reporting platform ahead of external limited assurance, Downer Group' },
      { title: 'LCA automation in Python', body: 'Python scripts that automated data downloads and material linking for life cycle assessments, plus internal tools that populated calculators and reporting templates.', outcome: 'About four hours saved per study, and more than 13 labour hours on one project, WSP in Australia' },
    ],
  },
  {
    step: 'report', n: '03', label: 'Reporting', icon: 'chart', color: 'var(--step-report)',
    desc: 'Statutory reporting and disclosure across NGER, AASB S2, GRESB and CDP, built so an assurer or a regulator can follow every figure back to its source.',
    examples: [
      { title: 'NGER statutory report', body: 'Data manager, reviewer and uploader for Downer Group\'s FY26 National Greenhouse and Energy Reporting submission. Rebuilt the dataset by script into a calculation workbook with facility threshold checks, a factor register and a change log, and wrote the review standard down before lodging: 26 rules, each with its threshold and source, tied to 61 automated controls and a verification script.', outcome: 'FY26 NGER report to the Clean Energy Regulator, Downer Group' },
      { title: 'AASB S2 climate statement: physical risk', body: 'Built the physical risk and opportunity model behind the FY26 climate statement, with basis of preparation paragraphs and an audit trail from finance extract to report wording. When the method question stalled, produced three complete versions with six decision questions and a recommended answer to each, so management could sign one off in one meeting.', outcome: 'FY26 climate statement under AASB S2, Downer Group' },
      { title: 'GRESB Infrastructure Assessment', body: 'Led the FY22 GRESB Infrastructure submission for a major Australian energy distributor on behalf of its institutional investor. Built the procedures for data collection, materiality assessment, gap analysis, mock scoring and submission compilation.', outcome: 'Score up 35% and global ranking up 63% in year one, WSP in Australia' },
      { title: 'NSW Government emissions accounting guidelines', body: 'Co-developed emissions accounting guidelines for all NSW Government entities under NSW Treasury\'s reporting framework. Reviewed NGERS, AASB S2 and the GHG Protocol, and ran the stakeholder engagement.', outcome: 'Guidelines for every NSW Government entity, WSP in Australia' },
      { title: 'Statutory fuel reporting notice', body: 'Managed the response to a statutory notice under the Petroleum and Other Fuels Reporting Act 2017. Interpreted the requirements, coordinated diesel capacity and reserves data across business units, and delivered the first return inside the ten-day window.', outcome: 'Monthly returns kept up to 30 June 2026, Downer Group' },
    ],
  },
  {
    step: 'strategy', n: '04', label: 'Strategy', icon: 'target', color: 'var(--step-strategy)',
    desc: 'Decarbonisation scenario models with every lever assumption traced to a published source, built so a non-specialist can test them.',
    examples: [
      { title: 'Net zero pathway model', body: 'Toggle-based net zero pathway model to FY2050 across 130 initiatives, with DCCEEW grid emission factor projections, NVES Act 2024 light-fleet trajectories, CSIRO heavy-fleet pathways and business unit filters. Its outputs went into the Reasonable Grounds board papers and the FY26 Annual Report decarbonisation graphs.', outcome: 'Board papers and the FY26 Annual Report, Downer Group' },
      { title: 'Scope 1-3 baselines', body: 'A first Scope 1-3 baseline for a state-owned water utility, with standard, drought-year and five-year forecast profiles, and a first Scope 1 and 2 baseline for a mining equipment supplier, with client workshops on data collection that fed its decarbonisation strategy.', outcome: 'Government and private sector clients, WSP in Australia' },
    ],
    cta: { href: '#scenario', label: '→ See the live scenario model below' },
  },
  {
    step: 'comms', n: '05', label: 'Communication', icon: 'people', color: 'var(--step-comms)',
    desc: 'Technical analysis turned into board papers, all-employee training and public disclosure.',
    examples: [
      { title: 'Climate change eLearn', body: 'Co-developed an all-employee climate eLearn with an external learning designer, covering GHG accounting fundamentals, decarbonisation levers and role-specific actions. Took it from storyboard review to a staged rollout plan.', outcome: 'First cohort from November 2026, Downer Group' },
      { title: 'ESG Impact Report workshop', body: 'Designed and ran a content workshop for ten environment and sustainability managers, including a General Manager, drawing out the case studies in one session. Then coordinated section authors through the Workiva cycle to sign-off.', outcome: 'Annual ESG Impact Report, Downer Group' },
    ],
  },
];

export const PRINCIPLES = [
  { num: '01', icon: 'list', title: 'Data integrity comes before the narrative', body: 'A net zero commitment is a claim, and it is only as credible as the inventory behind it: defensible, independently verifiable, and documented before anyone writes the narrative.' },
  { num: '02', icon: 'spark', title: 'Build it for the team to keep', body: 'I build models and processes the internal team owns and understands, so the next reporting cycle does not depend on me being in the room.' },
  { num: '03', icon: 'target', title: 'Ambition backed by evidence, gaps named', body: 'Pathway models need lever assumptions from published data, with the uncertainty stated beside each figure. Carbon credits belong on residual hard-to-abate emissions only, once near-term reduction has been done.' },
];

// ---------------------------------------------------------------------------
// SCENARIO MODEL (#scenario). The section's own words.
//
// The basis strip governs how every figure the model produces should be read,
// so it is stated before the numbers and at their weight. It used to sit under
// the sub-heading as one line of 11px grey mono, which is the wrong weight for
// the most important sentence in the section.
// ---------------------------------------------------------------------------
export const SCENARIO_UI = {
  basis: {
    label: 'Illustrative',
    text: 'Nothing in this model is client data. The operating profiles are scaled to published peer disclosures and each lever names its basis, but no figure here belongs to an organisation I have worked for. Read it as a demonstration of method rather than as a result.',
    meta: 'FY30 interim target year \u00b7 FY50 endpoint \u00b7 tCO\u2082-e per year',
  },
  // Labels for the run summary that captions the result panel.
  frameLead: 'This run',
  frameGrowth: 'Growth',
};

// ---------------------------------------------------------------------------
// TOOLS: the standalone subpages, gathered on the home page as evidence.
//
// Framing note (deliberate, do not soften): this section exists to answer a
// hiring manager's question, "can this person actually do the work". So every
// card carries two lines, not one. `what` says what the tool does; `proves`
// names the capability a role would be buying. `scope` is a plain fact about
// the page's coverage, never a vanity metric, and each figure below is the
// real count in that tool's data file. Refresh it when the data grows.
//
// Order is by relevance to a senior sustainability role, not by build date.
// Accent colours are picked to clear contrast on the forest band the section
// sits on, which is why the indigo used elsewhere on the page is absent here.
// ---------------------------------------------------------------------------
export const TOOLS_INTRO = {
  tag: 'Tools',
  idx: '03 / ',
  title: ['Working', 'tools'],
  paras: [
    'Two tools, built in my own time and maintained since. Each takes a question a sustainability team has to answer and works it through in public, with a stated method and the gaps named.',
    'The chart on each card is drawn from that tool\'s own data, with its basis printed underneath.',
  ],
  rules: [
    {
      icon: 'list', head: 'Every figure sourced or labelled',
      body: 'A sourced figure carries its source and the date it was read. Estimates and illustrative figures say so, at the number.',
    },
    {
      icon: 'book', head: 'Each tool states its basis',
      body: 'Method, boundary, exclusions and update cadence sit on the page, the way an assurance-ready inventory carries its basis of preparation.',
    },
    {
      icon: 'loop', head: 'One source per tool',
      body: 'Data, copy and methodology live in one place per tool, so refreshing a factor moves every place it appears.',
    },
  ],
  note: 'The decarbonisation model above is the third, built the same way.',
};

// The public tool index, one card per page the site links to. Each carries what
// the tool does, the capability it demonstrates, a scope line whose figures are
// hand-counted from the real data, a spec (its chart, see ToolSpecimen.jsx) and
// a span (its width in the bento grid). Spans are chosen so the rows fill:
// 3-3 across the six-column grid.
//
// Most of the tools are not here. Target Tracker, Cost Per Wear, Super Fund
// Holdings, Grid Intensity, Australia's Climate Progress and Sustainability
// Daily are drafts rather than finished work, so they sit behind the passphrase
// at /lab/ in PRIVATE_TOOLS below and nothing public links to them. Moving one
// back is moving its entry between the two lists, restoring its footer link,
// and putting its URL back in the sitemap.
export const TOOLS = [
  {
    n: '01', icon: 'chart', color: 'var(--lime)',
    name: 'Work samples', spec: 'work', span: 3, href: 'work/',
    what: 'Four frameworks as interactive examples on illustrative data: emissions baseline, decarbonisation roadmap, multi-criteria prioritisation and lifecycle carbon. A composite case study runs through all four.',
    proves: 'The method I use from baseline to roadmap: boundary and data grading, quantified options, weighted screening, then a sequenced roadmap.',
    tags: ['Scope 1-3 baseline', 'MCA framework', 'A1-A5 lifecycle'],
    scope: '4 frameworks · illustrative data, not client data',
  },
  {
    n: '02', icon: 'house', color: 'var(--matcha)',
    name: 'Life Footprint', spec: 'footprint', span: 3, href: 'footprint/',
    what: 'A full personal emissions model across ten categories, with a guided audit, an abatement planner, a forecast pathway and an animated summary of the year at the end.',
    proves: 'An inventory in miniature: boundary, cited factor set, calculation, abatement pathway, and a basis of preparation kept in sync with the engine.',
    tags: ['Cited factor set', 'Abatement planner', 'Basis of preparation'],
    scope: '10 categories · each factor names its source',
  },
];

// The drafts. Same shape as TOOLS, indexed only by /lab/, which is why the
// hrefs climb out of that directory first. Spans run 4-2, 2-4, 3-3 so the three
// rows fill.
export const PRIVATE_TOOLS = [
  {
    n: '01', icon: 'target', color: 'var(--berry)',
    name: 'Target Tracker', spec: 'targets', span: 4, href: '../targets/',
    what: 'Every ASX50 net zero claim drawn as the trajectory the company itself stated, from base year through interim targets, with its reported Scope 1 and 2 emissions plotted on top.',
    proves: 'Reading corporate disclosure at scale, then holding a claimed pathway against reported data with no adjective attached.',
    tags: ['Corporate disclosure', 'Trajectory maths', 'Verification status'],
    scope: '50 companies · each flagged sourced, partial or unverified',
  },
  {
    n: '02', icon: 'shirt', color: 'var(--amber)',
    name: 'Cost Per Wear', spec: 'fashion', span: 2, href: '../fashion/',
    what: 'A transparency lookup across 258 fashion brands: who owns them, what they disclose, and what you still cannot find out. A garment studio sits alongside it for footprint, fabric and supply chain.',
    proves: 'Supply chain transparency work in the sector I am aiming at, built on a disclosure vocabulary that reports status and never grades a brand good or bad.',
    tags: ['Supply chain', 'Fashion Transparency Index', 'Ownership mapping'],
    scope: '258 brands · disclosure status, field by field',
  },
  {
    n: '03', icon: 'coins', color: 'var(--sage-2)',
    name: 'Super Fund Holdings', spec: 'super', span: 2, href: '../super/',
    what: 'What the big default super options hold and where the sector exposure sits, put next to what each fund says about sustainability in its own marketing.',
    proves: 'Turning a statutory disclosure obligation into something a member can read, with a confidence flag on every field and a last-verified date per fund.',
    tags: ['s1017BB holdings', 'Sector exposure', 'Confidence flags'],
    scope: '10 funds · MySuper default options · methodology on its own route',
  },
  {
    n: '04', icon: 'bolt', color: 'var(--lime-bright)',
    name: 'Grid Intensity', spec: 'grid', span: 4, href: '../grid/',
    what: 'Reads the live National Electricity Market fuel mix and answers one question: run it now, or wait. Then explains the factor a business would report against.',
    proves: 'Scope 2 accounting taught properly, location-based against market-based, with GreenPower, PPAs and LGC surrender all in the toggle.',
    tags: ['Live AEMO data', 'Scope 2', 'Market vs location'],
    scope: '5 NEM regions live · WA and NT named as out of scope',
  },
  {
    n: '05', icon: 'globe', color: 'var(--lime)',
    name: "Australia's Climate Progress", spec: 'progress', span: 3, href: '../progress/',
    what: 'Six national numbers on the energy transition. Each is drawn against its own reference point and the 2030 target, with the shortfall named wherever there is one.',
    proves: 'Keeping sourced, derived and estimated figures apart, and refusing to blend a live grid snapshot into an annual inventory because the two are different quantities.',
    tags: ['NGER and AEMO data', 'Live NEM feed', 'Target gap'],
    scope: '6 indicators · reviewed quarterly, date on the page',
  },
  {
    n: '06', icon: 'spark', color: 'var(--amber)',
    name: 'Sustainability Daily', spec: 'daily', span: 3, href: '../daily/',
    what: 'Two daily puzzles: guess the footprint, and call the greenwash. Both rotate deterministically by date, and streaks stay in your browser.',
    proves: 'Making a factor set legible to a non-specialist, and applying the ACCC greenwashing principles consistently enough to survive being graded every day.',
    tags: ['ACCC principles', 'Shared factor set', 'No server'],
    scope: '33 footprint items · 30 claims · figures derived from the footprint model',
  },
];

// The passphrase screen in front of the drafts, shared by /lab/ and by each
// draft's own page (see src/components/Gate.jsx).
export const GATE = {
  eyebrow: 'Not published',
  title: 'Still on the bench',
  body: 'This one is not finished enough to show. If you have the passphrase, it opens from here and stays open on this browser for thirty days.',
  label: 'Passphrase',
  submit: 'Open',
  checking: 'Checking',
  wrong: 'That is not it. Try again.',
  unavailable: 'This browser will not check a passphrase on an insecure connection. Open the page over https.',
  back: 'Back to the site',
  homeAria: 'Chris Wang, home',
};

export const EXPERIENCE = [
  {
    mark: 'DG', clr: 'downer',
    logo: 'Downer_Group_logo.svg.png', logoClass: 'logo-downer', logoAlt: 'Downer Group logo', logoW: 252, logoH: 90,
    org: 'Downer Group', dept: 'Group Environment, Sustainability & Reporting',
    roles: [{ title: 'Senior Sustainability Advisor', date: 'Mar 2026 - Present' }],
    bullets: [
      { section: 'Facilitation and stakeholder influence' },
      { text: 'Designed and ran an ESG Impact Report content workshop for ten environment and sustainability managers, including a General Manager, then coordinated section authors through Workiva for the annual report.' },
      { text: 'Co-developed an all-employee climate eLearn with an external learning designer and took it from storyboard review to a staged rollout plan, with the first cohort from November 2026.' },
      { section: 'Data tools and systems' },
      { text: 'Built a toggle-based net zero pathway model to FY2050 on government and research-sourced lever assumptions. Its outputs went into the Reasonable Grounds board papers and the FY26 Annual Report decarbonisation graphs.' },
      { text: 'Designed subcontractor diesel reporting templates with embedded calculation logic that generate the Envizi upload, replacing manual supplier sorting and matching across three business units.' },
      { text: 'Developed an independent GHG recalculation module with operational control boundary filtering to support external assurance.' },
      { text: 'Rebuilt the subcontractor diesel estimation pipeline with proxy rate calculations, prior-period response pooling and CPI adjustment.' },
      { text: 'Built a Python pipeline that took raw spend data across 13,391 suppliers to a 153-supplier CDP Supply Chain shortlist at 93.5% contact coverage.' },
      { text: 'Redesigned the FY emissions data review tools with cross-BU anomaly detection, site completeness tracking and emission factor checks.' },
      { section: 'Reporting and governance' },
      { text: 'Data manager, reviewer and uploader for Downer Group\'s FY26 NGER report, due 31 October 2026.' },
      { text: 'Managed the response to a statutory notice under the Petroleum and Other Fuels Reporting Act 2017: the first return inside the ten-day window, then monthly returns to 30 June 2026.' },
      { text: 'Took over a handover portfolio of more than 12 workstreams in the first month and set its priorities and timelines.' },
      { text: 'Set up fortnightly check-ins with environment managers in three business units within the first six weeks.' },
    ],
  },
  {
    mark: 'WSP', clr: 'wsp',
    logo: 'img-png-wsp-red.png', logoClass: 'logo-wsp', logoAlt: 'WSP logo', logoW: 126, logoH: 60,
    org: 'WSP in Australia', dept: 'Sustainability and Climate Change Advisory',
    roles: [
      { title: 'Project Consultant', date: 'Oct 2025 - Feb 2026' },
      { title: 'Design Consultant', date: 'Oct 2023 - Oct 2025' },
      { title: 'Consultant', date: 'Feb 2022 - Oct 2023' },
    ],
    bullets: [
      { text: 'Led the FY22 GRESB Infrastructure submission for a major Australian energy distributor on behalf of its institutional investor: score up 35% and global ranking up 63% in year one.' },
      { text: 'Co-developed emissions accounting guidelines for all NSW Government entities under NSW Treasury\'s reporting framework, drawing on NGERS, AASB S2 and the GHG Protocol.' },
      { text: 'Coordinated and delivered life cycle assessments for more than ten high-rise developments across NSW, Queensland and Victoria, and for transport infrastructure, with carbon reduction options and procurement advice for developers, engineers and builders.' },
      { text: 'Automated LCA data downloads and material linking in Python, saving about four hours per study, and built reporting tools that saved more than 13 labour hours on one project.' },
      { text: 'Delivered first emissions baselines for government and private sector clients, with client workshops on data collection that fed their decarbonisation strategies.' },
    ],
  },
  {
    // No logo: the Defence lockup is the Commonwealth Coat of Arms, which is
    // not for personal use. Entries without a logo show a text eyebrow instead.
    mark: 'DoD', clr: 'defence',
    eyebrow: 'Government', eyebrowIcon: 'building',
    org: 'Department of Defence', dept: 'Capital Facilities and Infrastructure',
    roles: [{ title: 'Assistant Project Officer', date: 'Mar 2020 - Feb 2022' }],
    bullets: [
      { text: 'Administered contracts totalling $1.3 billion across five capital facilities projects in Sydney and Darwin.' },
    ],
  },
];

// Rendered with the same entry layout as EXPERIENCE so education reads as a
// peer of the employment history, not an isolated card. org/dept/roles mirror
// the shape of an EXPERIENCE entry; bullets carry a bold lead-in label.
export const EDUCATION = {
  mark: 'UNSW', clr: 'unsw',
  org: 'University of New South Wales',
  dept: 'Bachelor of Engineering (Civil with Architecture)',
  roles: [{ title: 'Honours Class 1' }],
  bullets: [
    { lead: 'Honours', text: "First Class, Dean's Honours List." },
    { lead: 'Thesis · 92/100', text: 'Vertical Greenery Systems and the Indoor Setting.' },
    { lead: 'Leadership', text: 'President, CEVSOC 2021 · Arc Club of the Year · executive team of 56, 2,000-member society.' },
    { lead: 'Capstone', text: 'Sustainable infrastructure masterplanning · Green Star, NABERS, Envision.' },
  ],
};

// The footer is the site's single closing statement. The old standalone
// Contact section folded in here: the availability line, the location, and one
// primary LinkedIn action. There is deliberately no second LinkedIn CTA.
export const FOOTER = {
  wordmark: 'Chris Wang',
  availability: 'Happy to talk emissions reporting, assurance and decarbonisation modelling.',
  // Merged from the former Contact section.
  location: 'Melbourne, Australia · flexible on working arrangements',
  ctaLabel: 'Connect on LinkedIn',
  ctaHref: 'https://linkedin.com/in/itschriswang',
  ctaHandle: 'linkedin.com/in/itschriswang',
  rights: 'All rights reserved © 2026 · Chris Wang',
  tagline: 'Senior Sustainability Advisor · Melbourne, Australia',
  // Link columns. hrefs beginning with '#' or a sub-path are prefixed with the
  // page base at render time so the footer works from the root and /work/.
  // How many there are drives the grid (see --footer-col-n in SiteFooter.jsx),
  // so moving a page behind the gate can empty a column without leaving a gap.
  columns: [
    {
      head: 'Profile', icon: 'people',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Capabilities', href: '#bio' },
        { label: 'My practice', href: '#principles' },
        { label: 'Experience', href: '#experience' },
      ],
    },
    {
      head: 'Work', icon: 'chart',
      links: [
        { label: 'Decarb model', href: '#scenario' },
        { label: 'Work samples', href: 'work/' },
        { label: 'Life Footprint', href: 'footprint/' },
      ],
    },
  ],
};
