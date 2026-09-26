// Editorial copy for the reveal story, the guided audit and the share cards.
// Words live here, not in components. Australian English, no em dashes,
// Chris's voice. Most strings come in two voices: 'example' narrates my
// FY2026 worked example, 'own' narrates the visitor's audit back to them.

export const CHROME = {
  skip: 'Skip to the dashboard',
  progressLabel: 'Story progress',
  next: 'Next:',
  keepScrolling: 'Keep scrolling',
  // The persistent way into the audit while the worked example plays.
  floatCta: 'Calculate your own',
};

// Chapter order for the rail and the section numbering. Tags on each moment
// are numbered live from this list as it renders for the audit on screen, so
// a skipped moment (no worst month, no guess on the example) never leaves a
// hole in the numbering.
// "In context" (st-bench) sits right after the total lands, not several
// chapters later: the personal overshoot line is the single most persuasive
// sentence in the reveal, and it hits hardest while the number is still
// fresh, before the detail chapters (equivalences, scopes, hotspots) that
// explain where it came from.
export const CHAPTERS = [
  { id: 'st-cover', label: 'Open' },
  { id: 'st-year', label: 'The year' },
  { id: 'st-guess', label: 'Your benchmarks' },
  { id: 'st-lockin', label: 'Your guess' },
  { id: 'st-total', label: 'The number' },
  { id: 'st-bench', label: 'In context' },
  { id: 'st-equiv', label: 'In real things' },
  { id: 'st-scopes', label: 'Where it comes from' },
  { id: 'st-hotspots', label: 'Hotspots' },
  { id: 'st-months', label: 'Worst month' },
  { id: 'st-character', label: 'Your result' },
  { id: 'st-needle', label: 'Cut it down' },
  { id: 'st-outro', label: 'Share' },
];

export const COVER = {
  tag: 'Life Footprint',
  eyebrow: 'A carbon footprint calculator',
  h1a: { example: 'Calculate your year of', own: 'Your year of' },
  h1b: 'carbon emissions',
  sub: {
    example:
      'I measure carbon for a living, so I pointed the same maths at my own year: every flight, power bill and parcel, plus an estimate of what I ate, added up.',
    own:
      'Your year, measured in carbon: flights, power, food and deliveries. It stays in this browser and nowhere else.',
  },
  // Sets the expectation the home page never does: this is a Wrapped-style
  // scroll-through of the audited year, not another landing page.
  meta: {
    example: 'My {fy} carbon emissions, wrapped',
    own: 'Your {fy} carbon emissions, wrapped',
  },
  start: 'Calculate your own',
  // The field behind the words, explained: one dot is ten kilograms.
  startNote: 'Every dot is 10 kg of carbon',
  scrollCue: 'Scroll to begin',
};

export const YEAR = {
  tag: 'The year',
  headline: { example: 'Twelve months, itemised', own: 'Your twelve months, itemised' },
  // Physical tallies, not a row count: how many ledger lines a year becomes
  // is an artifact of billing (41 lines could be one week of ordinary
  // spending), so the moment leads with quantities that mean something on
  // their own. Labels keyed by tally id; only non-zero tallies render.
  tallies: {
    kmFlown: 'km flown',
    planet: '{x}× around the planet',
    kmGround: 'km on the ground',
    kwh: 'kWh through the home meter',
    parcels: 'parcels delivered',
    nights: 'hotel nights',
    mealDays: 'days of meals',
  },
  sub: {
    example: 'A year of real bills, tickets and receipts, each priced on a published factor. Here they come.',
    own: 'Your answers, turned into priced line items: power, travel, flights, food and freight. Here they come.',
  },
  tickerAria: 'A stream of the individual items behind this footprint.',
};

// Three published benchmarks shown before the total, so the number lands
// with context instead of arriving cold, most-to-least.
export const GUESS = {
  tag: 'Your benchmarks',
  headline: { example: 'Three numbers to hold on to', own: 'Three numbers to hold on to' },
  sub: {
    example: 'Before you see my total, here is what a year of carbon looks like for other people. Keep these in mind.',
    own: 'Before your total, here is what a year of carbon looks like for other people. Keep these in mind.',
  },
  // The home row carries no label here: it reads the home country's own
  // benchmark label off the bench data, so an American or New Zealand audit
  // sees its own average, never Australia's.
  refs: [
    { id: 'home', unit: 't a person', note: 'per person, all greenhouse gases' },
    { id: 'global', label: 'World average', unit: 't a person', note: 'per person, all greenhouse gases' },
    { id: 'budget', label: '1.5°C lifestyle benchmark', unit: 't a person', note: 'where a year needs to be by 2030' },
  ],
  cont: 'See where I land',
  contOwn: 'Take a guess',
};

// The lock-in: own voice only, between the benchmarks and the number.
// Prediction error is the single most memorable stat a reveal can produce,
// so the visitor calls their year before it lands. Locked means locked.
export const LOCKIN = {
  tag: 'Your guess',
  headline: 'Before it lands, call it',
  sub: 'Slide to what you reckon your year adds up to, then lock it in. The three benchmarks above are your bearings.',
  sliderLabel: 'Your guess, tonnes of CO₂-e',
  unit: 't CO₂-e',
  lock: 'Lock it in',
  locked: 'Locked at {g} t. The number is next.',
  skip: 'No guess, just show me',
  cta: 'Reveal the number',
};

export const TOTAL = {
  tag: 'The number',
  chipsLabel: 'Tap a category to watch it take shape',
  chipsHint: 'Tap a category to watch it take shape.',
  kicker: { example: 'My FY2026 carbon emissions', own: 'Your year in carbon' },
  unit: 'tonnes CO₂-e',
  // Cute, accurate aside explaining the "-e" the first time it appears.
  eNote: 'CO₂-e means "carbon dioxide equivalent". It lets different greenhouse gases sit in one number, like converting currencies before you add them up.',
  line: {
    example: 'Every flight, power bill and parcel, plus an estimate of what I ate, added up.',
    own: 'Everything you entered, added up, awkward bits included.',
  },
  // One instant everyday anchor beside the number, so the unit means
  // something in the same breath it is read; the equivalences moment does
  // the full counting later.
  anchor: 'That is about {n} {unit}.',
  // The guess, settled. Shown only when a guess was locked in; "close" is
  // within ten percent either way.
  guess: {
    kicker: 'Your guess',
    under: 'You guessed {g} t. Under by {d} t: your year runs bigger than you thought.',
    over: 'You guessed {g} t. Over by {d} t: your year is smaller than you feared.',
    close: 'You guessed {g} t. Within {pct}% of the audit.',
  },
};

// The total re-counted in everyday things. Tangible, controllable units only:
// no coal barges, no wind turbines, nothing a person cannot order or switch
// off themselves. Factors and assumptions live in data/equivalences.js and on
// the method page.
export const EQUIV_ST = {
  tag: 'In real things',
  headline: { example: 'My year, counted in burgers', own: 'Your year, counted in burgers' },
  sub: {
    example: 'Tonnes are abstract. Here is the same total counted out in things I choose, at published factors. Pick a unit.',
    own: 'Tonnes are abstract. Here is your same total counted out in things you choose, at published factors. Pick a unit.',
  },
  chipsLabel: 'Count the year in a different unit',
  // {n} pre-formatted; {unit} singular or plural to match.
  cadence: {
    day: 'about {n} a day, every day of the year',
    week: 'about {n} a week, every week of the year',
    year: 'across the whole year',
  },
  legendOne: 'one dot = one {unit}',
  legendMany: 'one dot = {k} {unit}',
  note: {
    example: 'Display conversions only: nothing here changes my total, and every factor and assumption is on the how-it-works page.',
    own: 'Display conversions only: nothing here changes your total, and every factor and assumption is on the how-it-works page.',
  },
};

export const SCOPES = {
  tag: 'Where it comes from',
  headline: 'Three places emissions come from',
  gloss: {
    example: 'Companies sort their emissions into Scope 1, 2 and 3: what they burn, the energy they buy, and everything caused by their choices further down the chain. The same three buckets work for a person.',
    own: 'Companies sort their emissions into Scope 1, 2 and 3: what they burn, the energy they buy, and everything else their choices cause. The same three buckets work for a person.',
  },
  items: [
    {
      n: '1',
      name: 'Scope 1 · what you burn',
      plain: { example: 'Fuel I burn myself', own: 'Fuel you burn yourself' },
      line: {
        example: 'The gas heating my water and cooktop. If I had a car, the petrol I burned would sit here too.',
        own: 'Gas burned at home, and petrol if you drive. Fuel you light directly.',
      },
    },
    {
      n: '2',
      name: 'Scope 2 · energy you buy',
      plain: { example: 'Electricity I buy', own: 'Electricity you buy' },
      line: {
        example: 'The electricity for my apartment. A power station burns the fuel; the emissions are still mine.',
        own: 'Your electricity. A power station burns the fuel on your behalf.',
      },
    },
    {
      n: '3',
      name: 'Scope 3 · everything else',
      plain: { example: 'Caused by me, made elsewhere', own: 'Caused by you, made elsewhere' },
      line: {
        example: 'Flights, food, freight, rideshare, goods and services. Caused by my choices, but the emissions happen somewhere else.',
        own: 'Flights, food, freight, rideshare, goods and services. Your choices, emitted somewhere else.',
      },
    },
  ],
  punch: {
    example: 'of my year is Scope 3: things my choices set in motion, but that happen out of sight.',
    own: 'of your year is Scope 3: things your choices set in motion, but that happen out of sight.',
  },
};

export const HOTSPOTS_ST = {
  tag: 'Hotspots',
  rankWord: 'Hotspot',
  headline: { example: 'Where the tonnes are', own: 'Where your tonnes are' },
  ofYear: 'of the year',
  punch: {
    example: 'A few categories decide almost everything. Working on the biggest ones is how I cut my carbon the most.',
    own: 'A few categories decide almost everything. Working on the biggest ones is how you cut your carbon the most.',
  },
};

// Playful one-liners per category, used on story bars and share cards.
export const CATEGORY_QUIPS = {
  flight: { example: 'The flights. Almost always the flights.', own: 'The flights. It is almost always the flights.' },
  diet: { example: 'Dinner, added up over a year.', own: 'Dinner, added up over a year.' },
  freight: { example: 'Parcels, and how they travel.', own: 'Parcels, and how they travel.' },
  electricity: { example: 'The apartment on the meter.', own: 'Your electricity on the meter.' },
  gas: { example: 'Hot water and the cooktop.', own: 'Hot water and the cooktop.' },
  road: { example: 'Trains, buses and rideshare.', own: 'Wheels on the ground.' },
  other: { example: 'Everything else.', own: 'Everything else.' },
  goods: { example: 'The stuff, tallied up.', own: 'Clothes, gadgets and the rest.' },
  hotel: { example: 'Nights away from home.', own: 'Nights away from home.' },
  dwelling: { example: 'The carbon poured into the walls.', own: 'The carbon poured into your walls.' },
};

export const MONTHS_ST = {
  tag: 'The worst month',
  line: {
    example: 'in a single month, almost all of it flights. One month of travel outweighed the rest of the year.',
    own: 'in a single month. Bills spread out evenly; big trips spike.',
  },
  chartAria: 'One small bar per month; the worst month, {name} at {t} tonnes, is highlighted.',
};

export const BENCH_ST = {
  tag: 'In context',
  headline: { example: 'How my year compares', own: 'How your year compares' },
  // The synthesis first, then the tiles and bars that unpack it: one sentence
  // a lay reader can leave with. {home}/{world}/{budget} arrive pre-phrased
  // ("58% of" or "2.2 times") from ratioPhrase.
  verdict: {
    example: 'My {t} t is {home} the {homeName}, {world} the world average, and {budget} the 2.5 t benchmark.',
    own: 'Your {t} t is {home} the {homeName}, {world} the world average, and {budget} the 2.5 t benchmark.',
  },
  rows: {
    you: { example: 'My emissions', own: 'Your emissions' },
    // The home-country row's label comes from the benchmark data itself
    // (Australian, American or New Zealand average), set where the bench
    // rows are built in Story.jsx.
    global: 'World average',
    budget: '1.5°C lifestyle benchmark',
  },
  tiles: {
    // {name} is the home benchmark's short label, e.g. "Australian average".
    home: 'of the {name}',
    global: 'of the world average',
    budget: 'of the 1.5°C lifestyle benchmark',
  },
  line: {
    example: 'Under the Australian average, but still well over the 1.5°C lifestyle benchmark of 2.5 tonnes a person. Cutting the flights is how I close that gap.',
    own: 'Of the three, the 2.5 tonne benchmark is the one to aim under. The next section is how you move toward it.',
  },
  // What the 2.5 t line means, in plain English, restated from the source
  // (benchmarks.js): where an average footprint needs to be by 2030. The
  // tooltip and label variants below say the same thing in fewer words for
  // the row name and the tile.
  benchNote: 'The 2.5 t line is the 1.5°C-aligned lifestyle benchmark: where an average person\'s footprint needs to be by 2030 to hold warming near 1.5°C.',
  benchNoteTooltip: 'Where a year needs to be by 2030.',
  benchNoteLabel: 'Aim to stay under this line',
  // Personal overshoot day: the date the 2.5 t budget ran out at this pace.
  overshoot: {
    kicker: 'Budget day',
    line: {
      example: 'At my pace, a whole year of the 2.5 t benchmark was used up by {date}. Day {day} of 365; the rest of the year ran over.',
      own: 'At your pace, a whole year of the 2.5 t benchmark was used up by {date}. Day {day} of 365; everything after ran over.',
    },
    within: {
      example: 'I stayed inside the 2.5 t benchmark all year. That almost never happens.',
      own: 'You stayed inside the 2.5 t benchmark all year. That almost never happens.',
    },
  },
  caveat: 'The national and world averages count a wider basket than the core survey does. The optional detail step adds some of it back (clothes, gadgets, services), and hotel nights ride along with your trips; even then a few things stay out, so the real gap is if anything bigger.',
};

export const NEEDLE = {
  tag: 'The needle',
  headline: 'How could I have cut my carbon this year?',
  headlineOwn: 'How could you cut your carbon this year?',
  sub: {
    example: 'The three changes that would have cut the biggest share of my own audited year. Tap them on and off and watch the year rebuild.',
    own: 'The three changes that would cut the biggest share of your own audited year. Tap them on and off and watch your year rebuild.',
  },
  ofYear: 'of the year',
  perYear: 't / yr',
  // The live readout under the cards: the year re-priced with the switched-on
  // changes applied in the pathway's sequence, so overlapping levers compose
  // instead of double counting.
  live: {
    label: { example: 'My year, rebuilt', own: 'Your year, rebuilt' },
    none: 'All three are off. Tap a card and watch the number fall.',
    cut: '{cut} t off · down {pct}%',
    note: 'Changes overlap, so together they are priced as a sequence and counted once.',
    benchTick: '2.5 t benchmark',
    on: 'On',
    off: 'Off',
  },
  cta: 'Open the what-if machine',
};

export const OUTRO = {
  tag: 'Share',
  headline: { example: 'Share the year', own: 'Share your year' },
  sub: {
    example: 'Save a card to post, or send the link. The supporting detail, the reduction options and how it all works are below.',
    own: 'Save a card to post, or send the link. Your working detail and the reduction options are below. It all stays in this browser.',
  },
  galleryLabel: 'Shareable cards',
  explore: 'See the detail below',
  start: 'Calculate your own',
  again: 'Watch it again',
};

export const SHARE_ST = {
  button: 'Share this card',
  copyLink: 'Copy link',
  copyLinkDone: 'Link copied',
  // The share sheet: pick a size, preview it, then share or save.
  sheet: {
    title: 'Share this',
    sub: 'Preview it, then send it straight to a story, a post or LinkedIn. Nothing leaves your device until you choose to share.',
    previewAlt: 'Preview of the share image',
    rendering: 'Drawing your card…',
    share: 'Share',
    shareHint: 'Opens your phone\'s share sheet: Instagram Story, LinkedIn, Messages.',
    save: 'Save image',
    saveHint: 'Saves the PNG, ready to post yourself.',
    saved: 'Saved to your device.',
    shared: 'Shared.',
    close: 'Close',
    formatLabel: 'Format',
    formats: {
      story: 'Instagram story',
      post: 'Square post',
      linkedin: 'LinkedIn',
    },
    formatNote: {
      story: '9:16 · Instagram or TikTok stories',
      post: '4:5 · Instagram, Facebook or a message',
      linkedin: 'Landscape banner sized for the LinkedIn feed',
    },
  },
  // Card footers and titles by moment.
  site: 'itschriswang.com/footprint',
  // What rides beside the card file through the native share sheet: a human
  // sentence and the canonical page link.
  shareText: 'A year of carbon, priced on published factors.',
  shareUrl: 'https://itschriswang.com/footprint/',
  method: 'Home energy, travel, freight and diet · published factors, no offsets',
  cards: {
    total: { example: 'CARBON EMISSIONS', own: 'CARBON EMISSIONS' },
    hotspot: { example: 'BIGGEST SOURCE', own: 'BIGGEST SOURCE' },
    bench: { example: 'IN CONTEXT', own: 'IN CONTEXT' },
    needle: { example: 'BIGGEST CUTS', own: 'BIGGEST CUTS' },
    character: { example: 'MY CARBON RESULT', own: 'YOUR CARBON RESULT' },
  },
};

export const CHARACTER_ST = {
  tag: 'Your result',
  kicker: { example: 'My year in carbon is', own: 'Your year in carbon is' },
  // The reveal leads; the workings follow under this small heading.
  howTitle: 'How this was read',
  sub: {
    example: 'A playful label for the shape of the year, read from three things: how big it is, how much sits in one category, and whether it came in spikes or evenly.',
    own: 'A playful label for the shape of your year, read from three things: how big it is, how much sits in one category, and whether it came in spikes or evenly.',
  },
  // The three meters that produced the verdict. Each axis has a label, a
  // plain-words gloss, a name per level, and a reading template.
  axes: {
    weight: {
      label: 'Size',
      gloss: 'how big the year is',
      levels: { feather: 'Small', middle: 'Medium', heavy: 'Large' },
      reading: '{t} t',
      // {t} is filled from GLOBAL_T / HEAVY_T (characters.js), so a
      // benchmark refresh moves these labels with the tick positions.
      ticks: [
        { label: '{t} t · world avg' },
        { label: '{t} t' },
      ],
    },
    shape: {
      label: 'Focus',
      gloss: 'how much sits in one category',
      levels: { specialist: 'One big category', generalist: 'Spread out' },
      reading: '{share}% in the biggest category',
      tickLabel: '40%',
    },
    rhythm: {
      label: 'Timing',
      gloss: 'spikes or evenly',
      levels: { spiky: 'Comes in spikes', steady: 'Fairly even' },
      reading: 'worst month {x}× an average month',
      tickLabel: '2×',
    },
  },
  metersAria: 'Three readings: size {weight}, focus {shape}, timing {rhythm}.',
  badge: {
    kicker: 'Rare result',
    note: 'Inside the 2.5 t lifestyle benchmark, which almost nobody is.',
  },
  topEntry: 'Biggest single item: {label}, {t} t on its own.',
  // The verdict's bridge to action: the label is the screenshot moment, so
  // the one-line "what would change it" lives right here, not three moments
  // later. {label} is the biggest category.
  hook: {
    example: 'The {label} line is the biggest lever: changing it moves next year the most.',
    own: 'Your biggest lever is the {label} line: changing it moves next year the most.',
  },
  matrixTitle: 'The twelve results',
  matrixCols: [
    ['One category', 'in spikes'],
    ['One category', 'even'],
    ['Spread out', 'in spikes'],
    ['Spread out', 'even'],
  ],
  // {g} and {h} are GLOBAL_T and HEAVY_T (characters.js): the row labels
  // move together with the thresholds on a benchmark refresh.
  matrixRows: { feather: 'Under {g} t', middle: '{g} to {h} t', heavy: 'Over {h} t' },
  matrixAria: 'The twelve results as a grid: three size rows by four pattern columns. Yours is {name}.',
  othersNote: 'A bit of fun, worked out from your numbers. The exact cut-offs are on the how-it-works page.',
  yoursFlag: 'you',
};

// One-line phrasing helpers for the ratio sentences: under one reads as a
// percentage, over as a multiplier, matching the benchmark tiles.
export const ratioPhrase = (total, base) => {
  const r = total / base;
  return r < 1
    ? Math.round(r * 100) + '% of'
    : (Math.round(r * 10) / 10).toString().replace(/\.0$/, '') + ' times';
};

export const OB = {
  title: 'Your footprint',
  intro: 'About three minutes: five short steps, then an optional sixth. Rough answers now, real bills whenever you like. Everything stays in this browser, and the total waits for the reveal.',
  // Neutral, spoiler-free footer line. The running total is deliberately not
  // shown: seeing it here would spoil the reveal that follows.
  keepForReveal: 'The total waits for the reveal',
  stepOf: 'Step {n} of {total}',
  // Gentle per-step confirmations, no tonnes: progress, never a total.
  progress: {
    you: 'Basics set',
    energy: 'Home energy added',
    travel: 'Getting-around added',
    flights: { none: 'No flights yet', some: '{n} flight{s} added' },
    food: 'Food and parcels added',
    advanced: 'Optional detail (skip any time)',
  },
  stepLabels: ['You', 'Trips', 'Getting around', 'Home energy', 'Food & parcels', 'More detail'],
  // One playful, sourced fact per step: about the world, never about the
  // visitor's own numbers, so the reveal keeps its punch. Figures match the
  // factor set this calculator prices from. The first two steps carry a
  // home-country fact (the place and energy steps are where country lands),
  // the rest are shared.
  factKicker: 'While you are here',
  factsByCountry: (() => {
    const rideshare = {
      text: 'Per kilometre, rideshare carries about six and a half times the carbon of the train.',
      src: 'NGA 2025 and DESNZ / DEFRA 2026 factors',
    };
    const diet = {
      text: 'The gap between a high-meat year and a vegan year is about 1.6 tonnes, roughly 8,000 km of petrol driving.',
      src: 'Scarborough et al. 2014',
    };
    const spend = {
      text: 'Every $100 a month of general spending adds roughly 0.12 tonnes a year, which is why this step is worth the extra minute.',
      src: 'US EPA supply-chain factors',
    };
    // Step order: you, trips, travel, energy, food, detail. The country
    // facts ride on the steps where country and energy actually land.
    const build = (you, energy, flight) => [you, flight, rideshare, energy, diet, spend];
    return {
      AU: build(
        { text: 'The average Australian sits near 22 tonnes of CO₂-e a year, more than three times the world average.', src: 'EDGAR / JRC 2025' },
        { text: 'The same home reads very differently by state: Tasmania\'s grid factor is about a quarter of Victoria\'s.', src: 'DCCEEW NGA Factors 2025' },
        { text: 'One Sydney to London economy return is about 4 tonnes with the high-altitude effect counted: more than a year of electricity for most whole households.', src: 'DESNZ / DEFRA 2026 factors' },
      ),
      NZ: build(
        { text: 'The average New Zealander sits near 15 tonnes of CO₂-e a year, more than twice the world average, and much of it is agricultural methane.', src: 'EDGAR / JRC 2025' },
        { text: 'New Zealand\'s grid is about 85% renewable: a kilowatt-hour there carries about a tenth of the carbon of the same kilowatt-hour in Sydney.', src: 'MfE Measuring Emissions Catalogue 2026' },
        { text: 'One Auckland to London economy return is about 4.6 tonnes with the high-altitude effect counted: several years of electricity for a typical New Zealand home.', src: 'DESNZ / DEFRA 2026 factors' },
      ),
      US: build(
        { text: 'The average American sits near 17 tonnes of CO₂-e a year, more than two and a half times the world average.', src: 'EDGAR / JRC 2025' },
        { text: 'The US grid averages about 0.37 kg of CO₂-e per kilowatt-hour, but state grids run from a small fraction of that to well over double.', src: 'US EIA and EPA eGRID' },
        { text: 'One New York to London economy return is about 1.4 tonnes with the high-altitude effect counted: a few months of driving in a typical American car.', src: 'DESNZ / DEFRA 2026 factors' },
      ),
    };
  })(),
  // The corner swarm that thickens as answers land: felt mass, never a number.
  swarmLabel: 'Your year, gathering',
  done: {
    title: 'That is everything',
    sub: 'Your footprint is saved to this browser. Now the fun part: your reveal takes about a minute and walks you through what it all adds up to, where it lands, and how to cut it down. Skipping loses nothing; the detail below carries it all.',
    ready: 'All answered. Nothing left to fill in.',
    watch: 'Watch your reveal',
    skip: 'Straight to the detail',
  },
};

export const DASH_EXTRA = {
  compare: {
    vsExample: "Overlay Chris's FY2026",
    vsOwn: 'Overlay your footprint',
    note: 'Priced on the same boundary and factors. Diamonds mark the overlaid footprint.',
    overlaid: 'Overlaid: {label}, {t} t total.',
  },
  replayChip: 'Replay the reveal',
  characterLabel: 'Result',
};

// Strings drawn onto the canvas share cards.
export const CARD_TEXT = {
  tonnes: 'TONNES CO₂-E · ',
  ofYear: '% OF THE YEAR',
  benchNote: 'National figures cover a wider boundary than this calculator.',
  counted: 'SELF-COUNTED',
};

// Small helpers shared by story components.
export const fill = (tpl, vals) => tpl.replace(/\{(\w+)\}/g, (_, k) => String(vals[k] ?? ''));
