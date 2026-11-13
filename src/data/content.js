// All editorial copy for the home page, plus the shared footer, tool index and
// gate copy. Components only lay these strings out.

// The in-page anchors run in the order the sections sit on the home page, and
// each label matches the sec-tag the link lands on. The hero needs no link (the
// logo is the way back to the top), and neither does the Tools band, whose two
// cards are the two page links. Page links (`external`) come last and render
// apart from the anchors (see navLinkClass in Chrome.jsx).
export const NAV_LINKS = [
  { href: '#bio', label: 'Profile' },
  { href: '#principles', label: 'My practice' },
  { href: '#scenario', label: 'Decarb model' },
  { href: '#experience', label: 'Experience' },
  { href: 'work/', label: 'Work samples', external: true },
  { href: 'footprint/', label: 'Life Footprint', external: true },
];

// Years since a start date, to the nearest whole year: a part year of six
// months or more rounds up, less than six months rounds down. So 4 years and
// 9 months reads 5, and 5 years and 1 month still reads 5, not 6. The counters
// carry no "+" because the figure can already be rounded up.
export function yearsSince(startISO, now = Date.now()) {
  const years = (now - new Date(startISO)) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, Math.round(years));
}

const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

// "Five years": the bio says in words what the hero counter shows in figures,
// from the same start date and the same rounding.
function yearsInWords(startISO) {
  const y = yearsSince(startISO);
  const word = NUMBER_WORDS[y] ?? String(y);
  return `${word} year${y === 1 ? '' : 's'}`;
}

const SUSTAINABILITY_START = '2022-02-01';
const PROFESSIONAL_START = '2020-03-01';

export const HERO = {
  name: ['Chris', 'Wang'],
  roles: ['Senior Sustainability Advisor', 'ESG Reporting and Assurance', 'Decarbonisation and Net Zero'],
  location: 'Melbourne, Australia',
  prop: 'I deliver emissions and ESG reporting that holds up under assurance, and turn it into net zero plans the business can act on. Consulting at WSP, now in-house at an ASX-listed group, across NGER, AASB S2 and GRESB.',
  ctas: [
    { label: 'Get in touch', href: '#contact', primary: true, icon: 'linkedin' },
  ],
  // Animated counters: the start date drives the live figure, rounded to the
  // nearest whole year by yearsSince above.
  instruments: [
    { id: 'years-sustainability', label: ['Years in', 'sustainability'], start: SUSTAINABILITY_START, suffix: '' },
    { id: 'years-professional', label: ['Years of professional', 'experience'], start: PROFESSIONAL_START, suffix: '' },
  ],
};

// The profile's section label, in the rail beside the bio.
export const BIO_TAG = { tag: 'Profile', idx: '00 / ' };

export const BIO_PARAS = [
  'At ASX-listed Downer Group I rebuilt the workbook behind our statutory National Greenhouse and Energy Reporting (NGER) report with checks that tie its totals to the assured data, loaded the regulator\'s system from it and wrote the method down, for my manager to review and submit. I also help prepare the Group greenhouse gas inventory for limited assurance, with my manager and a colleague. I built the Net Zero pathway model our business units\' decarbonisation plans run on, and ran the FY27 emissions budget cycle for four business units.',
  `I have spent ${yearsInWords(SUSTAINABILITY_START).toLowerCase()} in sustainability, the first four as a consultant at WSP and now in-house. At WSP I delivered a NSW water business's first Scope 1, 2 and 3 baseline, including wastewater, helped deliver limited assurance of a property trust's emissions data each year and led a GRESB submission for an electricity network. Before that I worked on the owner's side at the Department of Defence, administering $1.3 billion of capital works contracts.`,
  'I went to an agricultural high school, which taught me early that business has to grow in an environmentally conscious way. In my own time I built Life Footprint, a public carbon calculator for anyone who wants to see their footprint clearly enough to change it.',
];

export const OUTCOMES = [
  { color: 'var(--accent-ink)', num: '×65', small: '', what: 'A currency defect overstated one country\'s supplier spend about 65 times in our Scope 3 purchased goods and services data, and nothing in the totals showed it. I found it against the invoices, proved it was a system fault, worked out the affected companies with Finance and specified the correction, now applied to FY25 and FY26.', where: 'Found during assurance · FY26 Scope 3 · Downer Group' },
  { color: 'var(--indigo-ink)', num: 'All', small: ' NSW Government entities', what: 'Covered by the emissions accounting guidelines I contributed to under the State\'s emerging mandatory reporting framework', where: 'NGER · AASB S2 · GHG Protocol · WSP' },
  { color: 'var(--amber-ink)', num: '+63', small: '%', what: 'GRESB Infrastructure global ranking, with the score up 35%', where: 'Major NSW electricity distribution network · submission I led · WSP' },
];

// The two subheads inside the profile section. They share one quiet style
// (.sub-head) so neither reads as a numbered section of its own.
export const OUTCOMES_HEAD = 'Selected outcomes';
export const PIPELINE_INTRO = {
  head: 'How the work fits together',
  sub: 'Five stages, from raw data to the decisions it informs. Open a stage to see delivered examples.',
};

export const PIPELINE = [
  {
    step: 'raw', n: '01', label: 'Raw data', icon: 'box', color: 'var(--step-raw)',
    desc: 'Collection templates and automated uploads that replace manual sorting each quarter, and checks that catch bad data before it reaches the inventory.',
    examples: [
      { title: 'Monthly data review controls', body: 'Wrote the controls agreed at the monthly emissions data review into a governed control set, with business units signing off proposed data changes before they are loaded, and updated the Group emissions reporting procedure.', outcome: 'Sign-off gate before data moves, Downer Group' },
      { title: 'Subcontractor diesel reporting templates', body: 'Replaced the manual supplier sorting and survey matching behind three business units\' quarterly reporting with Excel templates that generate the Envizi upload.', outcome: 'Manual quarterly process retired for three business units, Downer Group' },
      { title: 'Subcontractor diesel estimate', body: 'Found the subcontractor diesel method wrong in four ways and issued corrected files with each change documented, before the figures were published and with supplier totals unchanged. Then specified the estimate\'s rebuild in Databricks and handed it to our data team in writing.', outcome: 'Double counting removed before publication, Downer Group' },
    ],
  },
  {
    step: 'calc', n: '02', label: 'Calculation', icon: 'calc', color: 'var(--step-calc)',
    desc: 'Greenhouse gas inventories and Scope 1-3 accounting under the GHG Protocol and NGER, tested against invoices and source systems to find the errors that platforms and totals hide.',
    examples: [
      { title: 'Group greenhouse gas inventory for limited assurance', body: 'Prepared the Group greenhouse gas inventory for limited assurance with my manager and a colleague, and reconciled my share of the interim Scope 1 and 2 samples to invoices.', outcome: 'FY26 Group inventory, Downer Group' },
      { title: 'Emission factor error in the reporting platform', body: 'Checked the emission factors in IBM Envizi, Downer\'s emissions data platform, against an independent recalculation, and caught a wrong electricity factor before it reached the assured figures.', outcome: 'Caught before it reached the assured figures, Downer Group' },
      { title: 'Recurring calculations in Python', body: 'Automated recurring emissions calculations in Python, including Scope 3 fuel and energy, business travel and the state split of Downer\'s diesel for NGER, and reconciled the prior year\'s fuel and energy emissions to the reporting platform.', outcome: 'Scripted, and reconciled to the platform, Downer Group' },
      { title: 'Life cycle assessments for high-rise developments', body: 'Delivered life cycle assessments for high-rise residential, commercial and mixed-use developments, showing developers, architects and builders what each reduction option meant for procurement. Worked with concrete suppliers on custom reference mixes and argued for a stricter reference case on cement replacement and reinforcement rates. Taught myself Python and SQL and wrote tooling that cut about four hours from each study.', outcome: 'Upfront carbon from the design stage, WSP in Australia' },
    ],
  },
  {
    step: 'report', n: '03', label: 'Reporting', icon: 'chart', color: 'var(--step-report)',
    desc: 'Statutory reporting and disclosure across NGER, AASB S2, GRESB and CDP.',
    examples: [
      { title: 'NGER statutory report', body: 'Rebuilt Downer\'s National Greenhouse and Energy Reporting (NGER) workbook with checks that tie its totals to the assured data and test the NGER facility and aggregation rules, and wrote the method down for next year\'s report. Loaded the Clean Energy Regulator\'s system from it and reconciled it to the assured data with every difference explained, as data manager and reviewer, for my manager\'s review and submission.', outcome: 'FY26 NGER report, Downer Group' },
      { title: 'CDP 2026 and the S&P Corporate Sustainability Assessment', body: 'Submitted Downer\'s CDP 2026 response and the S&P Corporate Sustainability Assessment, from first draft to submission, and built the sign-off pack that laid out the CDP response\'s open points for decision.', outcome: 'Two investor questionnaires submitted, Downer Group' },
      { title: 'AASB S2 climate statement: physical risk', body: 'Management adopted the method I recommended for the physical risk analysis behind Downer\'s AASB S2 climate statement, from three ready-to-adopt options I set out. I developed the analysis across three SSP scenarios and drafted the basis of preparation paragraphs for its method.', outcome: 'FY26 climate statement under AASB S2, Downer Group' },
      { title: 'GRESB Infrastructure Assessment', body: 'Led a GRESB Infrastructure submission for a major NSW electricity distribution network on behalf of its institutional investor, built the data collection, gap analysis and mock scoring procedures behind it, and supported every one of the client\'s submissions from its first.', outcome: 'Score up 35% and global ranking up 63%, WSP in Australia' },
      { title: 'Green Star Performance across property portfolios', body: 'Coordinated Green Star Performance submissions across more than 400 property assets for property and fund managers, and produced a water resilience assessment with more than 30 recommended measures for a major property manager.', outcome: 'One client\'s 50-plus asset retail portfolio rose from two stars to three for the first time, WSP in Australia' },
      { title: 'NSW Government emissions accounting guidelines', body: 'Contributed to emissions accounting guidelines for all NSW Government entities under the State\'s emerging mandatory reporting framework, reviewing NGER, AASB S2 and the GHG Protocol and running stakeholder engagement and workshops.', outcome: 'Guidelines for every NSW Government entity, WSP in Australia' },
      { title: 'Statutory fuel reporting notice', body: 'Delivered Downer\'s first return under a statutory notice (Petroleum and Other Fuels Reporting Act 2017) inside its ten-day window, with no precedent in the team to follow, coordinating diesel capacity and reserves data across the business units.', outcome: 'Monthly returns kept up to 30 June 2026, Downer Group' },
    ],
  },
  {
    step: 'strategy', n: '04', label: 'Strategy', icon: 'target', color: 'var(--step-strategy)',
    desc: 'Net zero pathway models, emissions budgets and abatement reviews behind business units\' plans and targets.',
    examples: [
      { title: 'Net Zero pathway model', body: 'Built Downer\'s Net Zero pathway model to FY2050 across 130 initiatives, with DCCEEW grid factor projections and NVES light-fleet and CSIRO heavy-fleet trajectories, then rebuilt it on FY26 actuals. The business units\' FY27 decarbonisation plans now run on it.', outcome: 'FY27 decarbonisation plans, Downer Group' },
      { title: 'Scope 1-3 baselines', body: 'Delivered a NSW water business\'s first Scope 1, 2 and 3 baseline, including wastewater, and built a separate drought-year profile and a five-year forecast. Supported a mining services supplier\'s first Scope 1 and 2 baseline, running the workshops that taught its team to collect the data.', outcome: 'First baselines for both clients, WSP in Australia' },
      { title: 'Residential energy ratings and ESD', body: 'Helped deliver NatHERS modelling, BASIX strategies and energy, water and thermal comfort analysis for residential and aged care developments, and supported ESD concept design reports for planning submissions.', outcome: 'Residential and aged care developments, WSP in Australia' },
      { title: 'Board committee papers and the FY26 Annual Report', body: 'Contributed to the papers for the Board\'s Zero Harm Committee setting out the reasonable grounds for Downer\'s 2032 and 2050 targets, and supplied the data and chart specification for the decarbonisation pathway in the FY26 Annual Report.', outcome: 'A Board committee and the published Annual Report, Downer Group' },
    ],
    cta: { href: '#scenario', label: '→ See the live scenario model below' },
  },
  {
    step: 'comms', n: '05', label: 'Communication', icon: 'people', color: 'var(--step-comms)',
    desc: 'Papers for Board committees and management, explainers for the business units, a climate eLearn and public disclosure.',
    examples: [
      { title: 'Climate change eLearn', body: 'Took Downer\'s all-employee climate eLearn from concept to a staged rollout plan, co-developing it with an external learning designer. It covers mitigation and adaptation, GHG emissions, decarbonisation and what each role can do.', outcome: 'First cohort from November 2026, Downer Group' },
      { title: 'ESG Impact Report workshop', body: 'Designed and ran a workshop that drew the raw content for the environment case studies out of ten environment and sustainability managers in one session, then coordinated the report\'s section authors and reviewers through to the final Board documents.', outcome: 'FY26 ESG Impact Report, Downer Group' },
      { title: 'Why two models give two numbers', body: 'Wrote an explainer on why the emissions budget forecast and the Net Zero pathway model give different numbers for the same year. The General Manager overseeing the cycle approved it for the business units\' environment and sustainability managers.', outcome: 'One explanation for both models, Downer Group' },
    ],
  },
];

// The section's label and headline. `titleAccent` is the word index SplitText
// picks out in matcha.
export const PRINCIPLES_INTRO = { tag: 'My practice', idx: '01 / ', title: 'How I work', titleAccent: 1 };

export const PRINCIPLES = [
  { num: '01', icon: 'list', title: 'Test the numbers before they set targets', body: 'As Group reviewer I recalculated a business unit\'s proposed decarbonisation initiatives from first principles before their figures set its FY27 targets, and showed the abatement claimed was the top of a credible range, not the floor.' },
  { num: '02', icon: 'people', title: 'Teach the people who will run it', body: 'I built self-service emissions forecast workbooks for three business units, each with a written guide, for finance and sustainability managers to run without me. At WSP I typically managed one or two consultants on a project and mentored juniors across Australia and South-East Asia.' },
  { num: '03', icon: 'target', title: 'Claim only what the evidence supports', body: 'I reworded a renewable electricity commitment so it claimed only what would be true on the day it took effect. Carbon credits belong on residual, hard-to-abate emissions, once the business has cut what it can.' },
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
  tag: 'Decarbonisation scenario model',
  idx: '02 / ',
  // The section headline, at the same size as every other numbered section's.
  // `titleAccent` is the word index SplitText picks out in matcha.
  title: 'Model the pathway',
  titleAccent: 2,
  basis: {
    label: 'Illustrative',
    text: 'Nothing in this model is client data, and no figure in it belongs to an organisation I have worked for. I scaled the operating profiles to published peer disclosures, and each lever names its basis. Read it as a demonstration of method rather than as a result.',
    meta: 'FY30 interim target year \u00b7 FY50 endpoint \u00b7 tCO\u2082-e per year',
  },
  // Labels for the run summary that captions the result panel.
  frameLead: 'This run',
  frameGrowth: 'Growth',
  // The three steps, in reading order: controls on the left, result on the right.
  steps: [
    { num: 'Step 01', title: 'Choose an operating profile', sub: 'Each profile loads a different emissions mix and its own set of abatement levers.' },
    { num: 'Step 02', title: 'Set the abatement levers', sub: 'Card colours match the wedges in the chart.' },
    { num: 'Step 03', title: 'Read the result', sub: 'The headline recalculates as you move the levers.' },
  ],
  growth: { name: 'Volume or revenue growth', src: 'Scales gross emissions before abatement is applied' },
  chartSub: 'tCO\u2082-e per year \u00b7 coloured wedges show the abatement each lever contributes against business\u2011as\u2011usual',
  // The contribution card takes the same title and sub-line shape as the
  // chart card above it.
  contrib: {
    title: 'Abatement contribution by lever at FY30',
    sub: 'Interim target year \u00b7 tCO\u2082-e avoided vs gross pathway',
  },
  foot: 'More of the method, shown on illustrative data: emissions baseline, decarbonisation roadmap, multi-criteria prioritisation and lifecycle carbon.',
  footCta: 'View work samples \u2192',
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
    'Two tools I built and still maintain. Each takes a question a sustainability team has to answer and works it through in public, with a stated method and the gaps named.',
    'The chart on each card is drawn from that tool\'s own data, with its basis printed underneath.',
  ],
  rules: [
    {
      icon: 'list', head: 'Every figure sourced or labelled',
      body: 'A sourced figure carries its source and the date it was read. Estimates and illustrative figures say so, at the number.',
    },
    {
      icon: 'book', head: 'Each tool states its basis',
      body: 'Method, boundary, exclusions and update cadence sit on the page.',
    },
    {
      icon: 'house', head: 'Your data stays with you',
      body: 'Life Footprint runs in your browser, and what you enter stays there.',
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
    what: 'Four methods as interactive examples: emissions baseline, decarbonisation roadmap, multi-criteria prioritisation and lifecycle carbon. A composite case study runs through all four.',
    proves: 'The method I use: boundary and data grading, quantified options, weighted screening, then a sequenced roadmap.',
    tags: ['Scope 1-3 baseline', 'Multi-criteria analysis', 'Upfront carbon (A1-A5)'],
    scope: '4 frameworks · illustrative data, not client data',
  },
  {
    n: '02', icon: 'house', color: 'var(--matcha)',
    name: 'Life Footprint', spec: 'footprint', span: 3, href: 'footprint/',
    what: 'A full personal emissions model across ten categories, with a guided audit, an abatement planner, a forecast pathway and an animated summary of the year at the end.',
    proves: 'Explaining emissions to people outside the field without loosening the method behind the numbers.',
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
    n: '06', icon: 'clock', color: 'var(--amber)',
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

// The track record's label and headline, and the eyebrow on the education entry.
export const EXPERIENCE_INTRO = { tag: 'Experience', idx: '04 / ', title: 'Track record', titleAccent: 1, education: 'Education' };

export const EXPERIENCE = [
  {
    mark: 'DG', clr: 'downer',
    logo: 'Downer_Group_logo.svg.png', logoClass: 'logo-downer', logoAlt: 'Downer Group logo', logoW: 252, logoH: 90,
    org: 'Downer Group', dept: 'Group Environment, Sustainability and Reporting',
    roles: [{ title: 'Senior Sustainability Advisor', date: 'Mar 2026 to present' }],
  },
  {
    mark: 'WSP', clr: 'wsp',
    logo: 'img-png-wsp-red.png', logoClass: 'logo-wsp', logoAlt: 'WSP logo', logoW: 126, logoH: 60,
    org: 'WSP in Australia', dept: 'Sustainability and Climate Change Advisory',
    roles: [
      { title: 'Project Consultant', date: 'Oct 2025 to Feb 2026' },
      { title: 'Design Consultant', date: 'Oct 2023 to Oct 2025' },
      { title: 'Consultant', date: 'Feb 2022 to Oct 2023' },
    ],
  },
  {
    // No logo: the Defence lockup is the Commonwealth Coat of Arms, which is
    // not for personal use. Entries without a logo show a text eyebrow instead.
    mark: 'DoD', clr: 'defence',
    eyebrow: 'Government', eyebrowIcon: 'building',
    org: 'Department of Defence', dept: 'Capital Facilities and Infrastructure',
    roles: [{ title: 'Assistant Project Officer', date: 'Mar 2020 to Feb 2022' }],
  },
];

// Rendered with the same entry layout as EXPERIENCE so education reads as a
// peer of the employment history. The track record lists roles only; outcomes
// live in the tailored CV sent with each application.
export const EDUCATION = {
  mark: 'UNSW', clr: 'unsw',
  org: 'University of New South Wales',
  dept: 'Bachelor of Engineering (Civil Engineering with Architecture)',
  roles: [{ title: "Honours Class 1, Dean's Honours List", date: '' }],
};

// The footer is the site's single closing statement. The old standalone
// Contact section folded in here: the availability line, the location, and one
// primary LinkedIn action. There is deliberately no second LinkedIn CTA.
export const FOOTER = {
  wordmark: 'Chris Wang',
  availability: 'Happy to talk emissions reporting, decarbonisation planning and climate risk',
  // Merged from the former Contact section.
  location: 'Melbourne, Australia',
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
      head: 'About', icon: 'people',
      links: [
        { label: 'Profile', href: '#bio' },
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
