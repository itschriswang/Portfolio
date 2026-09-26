// All editorial copy for the Life Footprint page. Words live here, not in
// components. Australian English, no em dashes, Chris's voice.

export const META = {
  navLabel: 'Life Footprint',
  title: 'Life Footprint',
};

export const INTRO = {
  tag: 'Life Footprint',
  h1a: 'Calculate your year of',
  h1b: 'carbon emissions',
  paras: [
    'I measure carbon for a living, so I pointed the same maths at my own year. This is a plain-English carbon calculator and a visual case study in one: see where a real year of flights, power, food and freight goes, then run your own. Your answers stay in this browser.',
  ],
  chips: ['No account', 'No server', 'Stays in your browser', 'Export any time'],
  ctaStart: 'Calculate your own',
  ctaExample: 'See my worked example',
  disc: 'FY2026 example · quantities from bills, meter reads and a year of records · estimates are labelled',
};

export const MODE = {
  example: 'You are viewing my worked example: Chris\'s FY2026 carbon emissions. Anything you calculate stays private to this browser.',
  mine: 'You are viewing your own footprint. It lives only in this browser; export a backup any time.',
  archived: 'You are viewing a closed year, kept exactly as it ended.',
  switchToMine: 'My footprint',
  switchToExample: 'The worked example',
  startCta: 'Calculate your own',
  resumeNote: 'Your answers auto-save here as you edit.',
  yearLabel: 'Year',
};

// Year rollover and the multi-year record.
export const YEARS = {
  rollTitle: '{label} has ended',
  rollBody: 'The reporting period closed on {end}. Close the year and it is kept exactly as it stands; the new year opens empty, with your diet carried over as an estimate.',
  rollCta: 'Close {label} and open the new year',
  rolledToast: '{label} closed. Welcome to {next}.',
  archiveNote: 'Closed {closedAt}. Entries are kept as they were.',
  switcherAria: 'Choose which year to view',
  gapNote: 'Reporting gap: {note}',
};

export const DASH = {
  tag: '01 / The detail',
  title: ['The working', 'numbers'],
  sub: 'The reveal above is the short version. This is the detail behind it: the exact totals, the year month by month, and the split by category. The worked example runs on the Australian financial year (July to June); your own audit runs on your last twelve complete months.',
  kpis: {
    total: 'total',
    range: '{low} to {high} t, allowing for estimates. Real bills tighten this range',
    aus: 'vs your country\'s average',
    budget: 'vs the 1.5°C benchmark',
    largest: 'biggest single item',
  },
  trendTitle: 'The year, month by month',
  trendSub: 'tCO₂-e per month, stacked by category. Bills spread across the months they cover; dated trips land where they happened; undated estimates spread evenly.',
  trendEmpty: 'No month-by-month story yet: every item here is a typical-year estimate spread evenly, so the months would all read the same. Add a real date to a flight or a bill and this chart fills in by month.',
  worstLabel: 'worst month',
  catTitle: 'By category',
  catSub: 'Annual tCO₂-e by category, and its share of the total. The biggest one or two decide most of the result.',
  flightCallout: 'No car, a modest apartment, transit everywhere, and none of it matters next to the flying. The flights are the footprint, so any real plan has to start there.',
  genericCallout: 'The biggest categories above are where the reductions are.',
};

export const PLAN = {
  tag: '02 / What if',
  title: ['Replay the year', 'differently'],
  sub: 'A sandbox. Every change here is priced against your own audited numbers above: flip one on and see the year you could have had, and the decade that follows. Offsets and green-power products are left out of the options: they retire certificates; the activity still happens.',
  // Worked-example voice: the sandbox opens on the changes I have committed
  // to, so say so rather than let "3 changes on" contradict the needle above.
  subExample: 'A sandbox, priced against my own audited numbers above. It opens with the three changes I have committed to already on; the flight ones are still off. Flip any of them and see the year I could have had, and the decade that follows. Offsets and green-power products are left out of the options: they retire certificates; the activity still happens.',
  scenarioTitle: 'Where it goes from here',
  scenarioSub: 'Two lines. The lower one is the version of the year you just built, carried forward; the upper dashed one is where things stay if nothing changes. They sit together until you switch a change on. The grid keeps getting cleaner in the background either way, and bigger changes take longer to phase in.',
  budgetLabel: '1.5°C lifestyle benchmark · 2.5 t a person',
  bauLabel: 'If nothing changes',
  planLabel: 'With your changes',
  tableTitle: 'Flip the switches',
  tableSub: 'Turn a change on and the chart beside it rebuilds. Each card shows what changes, roughly how much it would save in a year, and how hard it would be.',
  toggleOn: 'On',
  toggleOff: 'Try it',
  na: 'Not relevant here',
  // Per-card money line, from the same figures the impact strip totals.
  cardSaves: 'saves about ${n}/yr',
  cardCosts: 'about ${n}/yr net',
  cardEven: 'roughly cost-neutral',
  ofYear: 'of this year',
  reductionLabel: 'a year',
  whyLabel: 'Why it matters',
  effortLabel: 'Difficulty',
  carouselLabel: 'Reduction options',
  carouselCount: '{n} options',
  prev: 'Previous options',
  next: 'More options',
  impact: {
    label: 'Switched on so far',
    labelExample: 'My committed changes, on to start',
    // Worked-example voice: my year, my pocket.
    lineExample: '{n} change{s} on. By 2030 this version of my year lands at {at2030} t, down {pct}% from the {bau2030} t on the do-nothing line',
    savesExample: 'about ${n} a year back in my pocket',
    none: 'Nothing switched on yet. Flip a change and watch the line pull away from "if nothing changes".',
    line: '{n} change{s} on. By 2030 this version of you lands at {at2030} t, down {pct}% from the {bau2030} t on the do-nothing line',
    over: '{gap} t over the 2.5 t benchmark',
    within: 'inside the 2.5 t benchmark',
    saves: 'about ${n} a year back in your pocket',
    costs: 'about ${n} a year net, upfront costs spread out',
    evens: 'roughly cost-neutral over the year',
  },
  // The takeaway line under the pathway chart. The verdict clauses reuse
  // impact.over / impact.within so the two readouts can never disagree.
  takeaway: {
    lead: 'By FY{year} your choices land you at',
    leadExample: 'By FY{year} these choices land me at',
    mid: 'next to {bau} t if nothing changes. At 2030 that reads {at2030} t,',
    over: 'still',
    within: 'which is',
  },
  // The cost curve view: each change alone, cheapest abatement first.
  chartViewLabel: 'Chart view',
  costTab: 'Best value first',
  pathTab: 'Pathway',
  costTitle: 'What each change costs',
  costSub: 'Every change on its own, best value first: anything below the line pays for itself. Bar width is the tonnes a change saves in a year; bar height is its dollars per tonne. The pathway view sequences them; this ranks them by value.',
  costMoneyNote: 'Indicative net annual figure across your chosen changes, savings and outlays combined. Upfront costs (an EV, solar, a heat pump) are spread over their life; the basis for each is on its card.',
};

export const ONBOARD = {
  title: 'Calculate your footprint',
  intro: 'Five quick steps, then an optional sixth. Rough answers are fine; you can put real bills in later. Everything stays in this browser.',
  steps: ['You', 'Trips', 'Getting around', 'Home energy', 'Food & parcels', 'More detail'],
  // The fork before the flow: a one-minute estimate or the full audit. Both
  // price from the same factors; the quick path leans on typical-home
  // figures and rough counts, so its range reads wider.
  chooser: {
    title: 'How much time do you have?',
    sub: 'Both paths build a real footprint from the same factors. The quick one leans on typical-home figures and rough counts, so its range reads wider; you can deepen it any time.',
    quick: 'Quick estimate',
    quickNote: 'About a minute · six questions',
    full: 'The full audit',
    fullNote: 'About three minutes · five steps plus an optional sixth',
  },
  express: {
    title: 'The quick version',
    sub: 'Six answers, one screen. Rough is fine: every figure here can be sharpened later, and the result shows its range.',
    name: 'Quick estimate',
    cta: 'See your estimate',
    refine: 'Do the full audit instead',
  },
  // Rough flight counts: the fallback for a year nobody can reconstruct trip
  // by trip. Shared by the quick path and the trips step's disclosure.
  roughFlights: {
    summary: 'Cannot remember each trip? Use rough counts',
    label: 'Return flights in a typical year',
    dom: 'Domestic returns',
    short: 'Short overseas returns (under about 4 hours)',
    long: 'Long overseas returns (Asia, Europe, the Americas)',
    note: 'Priced at representative sector lengths ({dom} km domestic, {short} km short overseas, {long} km long haul, each way, economy). A named trip card beats a rough count, so cover a given trip once, either way.',
  },
  you: {
    title: 'About you',
    sub: 'Where you live sets your power mix, and shared home energy is split across the adults who live there.',
    country: 'Where is home?',
    usGridNote: 'Pick your state and your power is priced on that state\'s own grid, from the EPA\'s eGRID data. The cleanest state grid runs about forty times lighter than the dirtiest, so the same house reads very differently in Vermont and West Virginia.',
    state: 'Where do you live?',
    stateNote: 'Your state sets how clean your electricity is, so it shapes every powered line in the result.',
    household: 'How many adults share your home? (counting you)',
    householdNote: 'Shared home energy is split across the adults at home, so you are counted for your share only. Two adults means half of each bill is yours.',
    dwelling: 'Your place',
    dwellingHouse: 'House',
    dwellingApartment: 'Apartment or unit',
    // Tenure asked separately from building type: a renter in a house was
    // previously forced into a wrong answer either way.
    roof: 'Is the roof yours to change?',
    roofYes: 'Yes',
    roofNo: 'No, renting or strata',
    roofNote: 'Rooftop solar and appliance swaps only appear in your plan when the roof is yours to change.',
  },
  energy: {
    title: 'Home energy',
    sub: 'Usually one of the bigger slices of a footprint. Pick a typical home to start, or better, read the figures straight off a power and gas bill.',
    presetLabel: 'Which sounds most like your place?',
    presetNote: 'Rough starting points, sized to your household: each adult adds their share, so a busier home reads higher. The figures below are the whole-home total per quarter for the number of adults you set. For scale, the regulator puts average annual household use between about 4,400 and 6,700 kWh depending on where you live, which the apartment and house rungs bracket. The dollar figures beside each are indicative only, at typical rates. Gas-heated homes in cold climates often run well above these. Swap in your real bills whenever you find them.',
    kwh: 'Electricity, kWh per quarter (whole home)',
    gas: 'Gas, {unit} per quarter (0 if no gas)',
    // {n}/{s} filled with the household size in the component.
    splitNote: 'These are whole-home figures. Your share is the bill split evenly across the {n} adult{s} at home. Change the number of adults back on the first step.',
    splitNoteSolo: 'These are whole-home figures. With one adult at home, the whole bill is yours.',
    // The renewable-plan question and note come from COUNTRIES in factors.js
    // (GreenPower is an Australian product name); only the chips live here.
    gpNo: 'No',
    gpUnsure: 'Not sure',
    gpHalf: 'Partly (50%)',
    gpFull: 'Yes, 100%',
    gpUnsureNote: '"Not sure" counts as standard grid power, the safe assumption. If you later find your plan is certified renewable, switch it and the result updates.',
  },
  travel: {
    title: 'Getting around',
    sub: 'Rough weekly figures are fine; you can put real numbers in later.',
    car: 'Car kilometres per week (0 if car-free)',
    fuelType: 'Car fuel',
    occupancy: 'Who is usually in the car?',
    occupancyChips: [
      { value: 1, label: 'Usually just me' },
      { value: 2, label: 'Me plus one' },
      { value: 3, label: 'Three of us' },
      { value: 4, label: 'Four or more' },
    ],
    occupancyNote: 'Car emissions are split across everyone in the car, the same way as the home bills. Two people halves your share.',
    rideshare: 'Rideshare spend per week, $',
    pt: 'Public transport spend per week, $',
    ptMix: 'Mostly trains, or mostly buses?',
    ptMixChips: [
      { value: 'rail', label: 'Mostly trains' },
      { value: 'mixed', label: 'A mix' },
      { value: 'bus', label: 'Mostly buses' },
    ],
    ptMixNote: 'A bus carries about four times the carbon of a train per passenger-kilometre, so this is worth a tap. A mix splits your fares evenly between the two.',
    // Filled in the component. Exact = NSW's published weekly cap; approx =
    // a derived ceiling for networks that cap by the day, by the trip, or not
    // at all right now. {asOf} dates the approximate figures.
    ptCapNoteExact: 'In {state}, {label} applies, so the calculator counts no more than ${cap} a week unless you override it. Spending past the cap does not buy more travel.',
    ptCapNoteApprox: 'In {state}, fares are capped ({label}), so the calculator counts no more than about ${cap} a week unless you override it. A rough ceiling, current as at {asOf}.',
    ptOverride: 'Count your full spend anyway',
    ptCapApplied: 'Counting up to ${cap} a week',
    ptCapAppliedApprox: 'Counting up to about ${cap} a week',
  },
  flights: {
    title: 'Your trips, one at a time',
    sub: 'Flights are often the biggest single category in a footprint, so this step earns the most care. Think through a typical year: holidays, work trips, weddings. Add a card for each trip, pick where it went, and pop in any hotel nights while you were there.',
    from: 'From',
    to: 'To',
    pickTo: 'Choose a destination',
    pickFrom: 'Choose a starting city',
    when: 'When',
    whenAny: 'Sometime in the year',
    whenNote: 'Optional. Give a trip its month and it shows in the month-by-month chart and the worst-month reveal; leave it open and it spreads evenly across the year.',
    cabins: { economy: 'Economy', premium: 'Premium', business: 'Business', first: 'First' },
    // Retained for the activity log's simple quick-add route picker.
    customOpt: 'Custom distance…',
    oneWay: 'One way',
    roundTrip: 'Return',
    cabin: 'Cabin',
    trip: 'Trip',
    passengers: 'Seats you paid for',
    passengersNote: 'Usually just you. Bump it up only if you are counting seats you booked for others.',
    paxSummary: 'Booked seats for others?',
    add: 'Add a flight',
    addAnother: 'Add another flight',
    quickAdd: 'Popular from {city}',
    duplicate: 'Duplicate',
    remove: 'Remove',
    tripLabel: 'Flight {n}',
    listTitle: 'Your flights',
    none: 'No flights yet. Flew somewhere this year? Add a card for each trip.',
    // Distance is shown (not carbon) so the estimate feels transparent.
    dist: '≈ {km} km each way',
    sameCities: 'Pick two different cities.',
    // Hotel nights ride with the trip that caused them, so each night is
    // priced at the factor for the country you actually slept in.
    nights: 'Hotel nights there',
    otherNights: 'Hotel nights with no flight attached',
    otherNightsNote: 'Road trips, work stays, weekends away. Counted at your home country\'s per-room-night factor. Nights on the trips above are priced at the destination country instead.',
    sourceSummary: 'How this is estimated',
    sourceBody: 'Flight emissions are estimated from the route distance and published UK Government (DESNZ) emissions factors, with an uplift for the extra warming of burning fuel at altitude. It is a route-and-cabin estimate; airline, aircraft type and load factor are not in it. Hotel nights are priced per occupied room-night at the destination country\'s published factor (UK Government DEFRA hotel-stay table), and land in the trip\'s month when you give one.',
  },
  food: {
    title: 'Food and parcels',
    sub: 'Pick the diet that sounds most like your week. Rough is fine.',
    diet: 'Your diet',
    dietHints: {
      highMeat: 'Meat most meals, or big serves daily',
      medMeat: 'A standard serve most days',
      lowMeat: 'Small serves, a few times a week',
      pescetarian: 'Fish, but no other meat',
      vegetarian: 'No meat or fish',
      vegan: 'No animal products',
    },
    parcels: 'Parcels delivered per month',
    intlOrders: 'Overseas orders per month (the ones that arrive by air)',
    intlOrdersNote: 'Think express orders from overseas that land within a week or two: fast fashion, gadgets, small parcels that come by air. Slow sea-freight orders count as ordinary parcels above.',
  },
  // The optional sixth step. Everything here is opt-in and starts at zero, so
  // skipping it (or the whole step) leaves the result unchanged. No average
  // person is ever substituted in: a skipped field counts nothing, and the
  // context chapter's caveat says the total leaves that basket out.
  advanced: {
    title: 'A little more detail',
    sub: 'Optional. The quick survey leaves out the things you buy: clothes, gadgets, going out and health. Pop in rough monthly figures to estimate those too, or skip the lot.',
    optional: 'Every field starts at zero and skipping adds nothing: an average person\'s spending is never swapped in for yours. Skip it and your total leaves this basket out, and the benchmark chapter says so.',
    // Clothing counts items by default: per-garment factors weigh garments,
    // not dollars, so a fast-fashion haul reads as heavy as it is. Spend
    // stays as the fallback for someone who only knows their budget.
    clothingHow: 'Clothing and footwear: how do you want to count it?',
    clothingByItems: 'Count the items',
    clothingByItemsNote: 'Recommended',
    clothingBySpend: 'Count the spend',
    clothingItemsLabel: 'Bought new in the last 12 months',
    // Preset starting counts, like the energy presets: coarse on purpose, so
    // nobody has to reconstruct a year of shopping from memory to continue.
    clothingPresets: {
      label: 'Start from a typical year',
      note: 'Rough starting counts; nudge any of them to match your year.',
      options: [
        { id: 'few', label: 'A few pieces', items: { tops: 3, jumpers: 1, trousers: 1, dresses: 0, coats: 0, shoes: 1 } },
        { id: 'typical', label: 'A typical year', items: { tops: 6, jumpers: 2, trousers: 3, dresses: 2, coats: 1, shoes: 2 } },
        { id: 'big', label: 'A big year', items: { tops: 12, jumpers: 4, trousers: 6, dresses: 5, coats: 2, shoes: 5 } },
      ],
    },
    clothingItemsNote: 'Each item is priced on a published per-garment life-cycle factor, so ten cheap tees weigh ten times one tee, whatever they cost. Count what you bought new; second-hand pieces carry almost none of this and can be left out.',
    clothing: 'Clothing and footwear, $ a month',
    clothingNote: 'Spend-based, so every dollar carries the same factor: a $300 boutique jacket counts ten times a $30 fast-fashion tee, even though the physical impact of the cheap haul may be no smaller. Counting items is the more accurate measure.',
    electronics: 'Electronics and tech, $ a month',
    electronicsNote: 'New phones, laptops, headphones, consoles, small appliances and accessories, averaged out. A $1,200 phone every two years is $50 a month.',
    entertainment: 'Entertainment and going out, $ a month',
    entertainmentNote: 'Streaming and subscriptions, the gym, gigs, cinema and events. Not meals and drinks: your diet already covers the food.',
    health: 'Health, out of pocket, $ a month',
    healthNote: 'Gap payments, pharmacy, physio, dental, glasses: whatever leaves your pocket after Medicare and insurance. Typically $20 to $150 a month. Not sure? $50 is a fair estimate, about one pharmacy run plus a specialist gap fee.',
    other: 'Other goods and services, $ a month',
    otherNote: 'Everything else in the trolley: furniture and homewares, personal care, haircuts, hobbies, gifts, pet food and vet bills. Rent, groceries and transport are counted elsewhere. Typically $100 to $400 a month. Not sure? $200 is a fair estimate, about a haircut, toiletries and a bit of pet care.',
    homeQuestion: 'Did you build or buy this home brand new?',
    homeYes: 'Yes, new build',
    homeNo: 'No',
    homeNoNote: 'An existing home',
    homeNote: 'Only a home you built or bought new counts here: a new purchase is what pulled that construction into existence. Buy an existing home and you caused no new build, so it adds nothing here. Leave this off if you rent.',
    homeArea: 'Floor area of your {type}, m²',
    homeAreaNote: 'The upfront carbon locked in when it was built (materials, transport, construction) spread over a 50-year life and split per adult, so it lands as a small yearly share. Indicative only: real homes vary widely, so treat it as a rough screening figure.',
    skip: 'Skip this step',
    sourceSummary: 'How this is estimated',
    sourceBody: 'Clothing counted by item uses published per-garment life-cycle factors (ADEME\'s consumer-products LCA study, the basis of the French national per-item factors), so the physical count carries the number. The spend fields come from how much you spend: dollars times a published spend-based factor (US EPA supply-chain factors, bridged into your home country\'s dollars). The home line, when you turn it on, prices the floor area at an indicative per-square-metre upfront (A1-A5) embodied-carbon figure from Australian residential studies, amortised over a 50-year life and split per adult. All of it is a screening estimate for the wider basket the simple survey leaves out. A skipped field adds exactly nothing.',
  },
  finish: 'See your footprint',
  back: 'Back',
  next: 'Next',
  cancel: 'Cancel',
};

// Typical-home starting points for the energy step, per country, expressed
// PER ADULT per quarter. The whole-home figure the engine prices from is
// kwhPerAdult times the number of adults at home, so a busier home reads
// higher rather than splitting one fixed number ever thinner. gasPerAdult is
// in the country's own bill unit (MJ, kWh or therms; see COUNTRIES), and the
// audit converts to MJ when it builds. At the default two adults the
// Australian ladder reproduces the long-standing whole-home defaults (e.g.
// an apartment at 1,100 kWh); the US ladder is anchored on the EIA average
// household near 10,800 kWh a year, and the NZ ladder on the commonly cited
// 7,000 to 8,500 kWh a year. Deliberately coarse: they exist so someone
// without a bill in reach can still finish, and the note tells them to swap
// in real numbers later.
export const ENERGY_PRESETS = {
  // Sanity-checked against the AER Annual Retail Markets Report 2024-25
  // (published 30 November 2025), Table A2.1: average annual electricity use
  // per residential customer runs 4,449 kWh (CitiPower, Victoria) to 6,692
  // (Ergon, Queensland). At two adults the apartment rung is 4,400 a year and
  // the house rung 6,400, so the ladder brackets the published range.
  // The US house rung is anchored on the EIA average of 10,791 kWh a year per
  // residential customer (1,348.9 per adult per quarter at two adults); the
  // other US rungs and every gas figure remain a coarse construction, because
  // the uploaded RECS tables carry housing characteristics, not consumption.
  // The AU `bill` strings are an indicative feel only, NOT a published figure:
  // the AER prints residential bills as chart images rather than tables, so no
  // dollar amount in that report can be read to this page's standard.
  // Anchors only, never converted: the engine prices from kWh.
  AU: [
    { id: 'aptSmall', label: 'Small apartment', kwhPerAdult: 350, gasPerAdult: 0, bill: '≈ $300 power / quarter' },
    { id: 'apt', label: 'Apartment', kwhPerAdult: 550, gasPerAdult: 1250, bill: '≈ $450 power / quarter' },
    { id: 'house', label: 'House', kwhPerAdult: 800, gasPerAdult: 2750, bill: '≈ $600 power / quarter' },
    { id: 'houseLarge', label: 'Large house', kwhPerAdult: 1150, gasPerAdult: 4500, bill: '≈ $800 power / quarter' },
  ],
  NZ: [
    { id: 'aptSmall', label: 'Small apartment', kwhPerAdult: 400, gasPerAdult: 0 },
    { id: 'apt', label: 'Apartment', kwhPerAdult: 650, gasPerAdult: 350 },
    { id: 'house', label: 'House', kwhPerAdult: 1000, gasPerAdult: 750 },
    { id: 'houseLarge', label: 'Large house', kwhPerAdult: 1400, gasPerAdult: 1250 },
  ],
  US: [
    { id: 'aptSmall', label: 'Small apartment', kwhPerAdult: 500, gasPerAdult: 0 },
    { id: 'apt', label: 'Apartment', kwhPerAdult: 800, gasPerAdult: 35 },
    { id: 'house', label: 'House', kwhPerAdult: 1350, gasPerAdult: 70 },
    { id: 'houseLarge', label: 'Large house', kwhPerAdult: 2000, gasPerAdult: 110 },
  ],
};

export const METHOD = {
  tag: 'Life Footprint / How it works',
  title: ['How the', 'calculator works'],
  sub: 'A plain explanation of what this calculator counts, where the numbers come from, and how to read the result. The tables further down are the exact factors it uses.',
  backToDash: 'Back to the calculator',
  boundary: {
    title: 'What it includes',
    paras: [
      'The calculator covers the things a person controls or pays for directly: home electricity and gas, personal travel on the ground, flights, parcel deliveries, and diet. It groups them the way companies do, translated to a person: Scope 1 is fuel you burn yourself (home gas, and petrol if you drive), Scope 2 is the electricity you buy, and Scope 3 is everything else your choices cause but that happens elsewhere.',
      'An optional detail step adds part of the wider basket the quick survey skips. Clothing is counted by items bought by default, priced on published per-garment life-cycle factors, because a spend-based factor prices five cheap tees below one expensive coat and so misreads fast fashion; a spend option remains for someone who only knows their budget. Electronics, entertainment, health, and other goods and services are estimated from how much you spend, so they are labelled screening estimates and carry more uncertainty than a metered bill. The same step carries one home line: if you built or bought your home new, its upfront (A1-A5) embodied carbon is counted at an indicative per-square-metre figure, amortised over a 50-year life and split per adult. It is demand-side and new-build only, so a second-hand home adds nothing and buying existing reads as the lower-carbon choice; a rented home is out too. They are all off unless you fill them in, and count as Scope 3. Skipping the step adds nothing: no average-person spending is ever substituted in, so a skipped basket stays out of the total. Hotel nights are gathered in the flights step instead: each trip carries its own nights, priced per occupied room-night at the destination country\'s published factor, and nights with no flight attached use the home country\'s figure.',
      'Shared home energy is split evenly between the adults in the home: two adults means half of each bill counts as yours. Shared car trips are split the same way, by the average number of people in the car. Rideshare and public-transport factors are already per passenger, so they need no split.',
    ],
  },
  period: {
    title: 'The reporting period',
    paras: [
      'The worked example runs on the Australian financial year, July to June: it is FY2026 (July 2025 to June 2026). Your own audit runs on your last twelve complete months, whichever country is home, and rolls over a year at a time from there.',
      'Timing follows what is known. Dated trips land in the month they happened, bills spread across the months they cover, and rough typical-year estimates spread evenly across the year. A bill that reaches back past the start of the reporting window keeps its early share in the window\'s first month, so the monthly chart always sums to the annual total. The month-by-month chart and the worst-month reveal only appear once real dates give them something to show.',
    ],
  },
  sources: {
    title: 'Where the numbers come from',
    paras: [
      'Australian electricity, gas and road-fuel factors carry the values published in the Australian Government (DCCEEW) National Greenhouse Accounts Factors 2025, Tables 1, 5, 6 and 9. I could not download DCCEEW\'s own workbook when I built this set, so I checked those values against published summaries and a mirrored copy of the tables rather than reading them from the source file. They are the one part of this page not read from the publisher\'s workbook, and I will read them against it at the next refresh. Flights, freight, hotel nights, rail and bus use the UK Government conversion factors 2026 edition, published by DESNZ and still widely known as the DEFRA factors, because they are the most complete public source for aviation by distance and cabin. Those numbers match the 2026 workbook cell for cell.',
      'The calculator also runs a United States or New Zealand audit, with the home country picked in the first step. US electricity is priced from the state you live in: every state, the District of Columbia and Puerto Rico carries its own factor from the EPA eGRID2023 workbook, read cell for cell. The American grid runs from about 0.02 kg CO₂-e per kWh in Vermont to about 0.89 in West Virginia, a spread of nearly forty times, so a national average would overstate half the country and understate the other half. Scope 3 adds the eGRID grid gross loss of 4.2 per cent. US gas and road fuels use the EPA GHG Emission Factors Hub defaults. New Zealand electricity, gas, road fuels and hotel nights come from the MfE Measuring Emissions Catalogue 2026, including its separate transmission-loss factor. One New Zealand line still rides a proxy: the fuel-cycle (scope 3) side of petrol and diesel, where the catalogue publishes no equivalent, so the Australian well-to-tank factors stand in and the table says so.',
      'Diet is a coarse estimate: it uses published UK per-day values by diet type, chosen because they separate the six diet patterns cleanly. Australian studies find the same direction (CSIRO and Ridoutt), but on different accounting boundaries, so they anchor the size of the figure. Public transport uses a UK rail factor as a stand-in until a published Australian per-passenger figure is available. On the physical NSW grid the real rail figure is higher than this proxy, because the grid is coal-heavy; measured against Sydney Trains renewable electricity contracts it is close to zero. Public transport is a small line, so the choice barely moves a total. The optional detail is the coarsest part: clothing counted by item uses the ADEME consumer-products LCA study (2018, the basis of the French Base Empreinte per-item textile factors), cross-checked against the Mistra Future Fashion per-garment assessments and the WRAP UK aggregate; the remaining goods and services are a spend-based screening estimate from the US EPA Supply Chain factors converted to Australian dollars; and hotel nights use the UK Government (DEFRA) per-room-night factors by country, priced at the destination country of the trip they belong to. The optional home line uses indicative per-square-metre upfront embodied-carbon figures for Australian dwellings (detached houses from Illankoon et al. 2023; apartments anchored on the GBCA and thinkstep-anz 2021 report), amortised over 50 years; residential figures span a wide range, so it is a screening estimate. All are labelled that way. Every factor and its source is in the tables below.',
    ],
  },
  quality: {
    title: 'How results are calculated',
    paras: [
      'Each item is activity times a factor: kilowatt-hours times the grid factor, litres times the fuel factor, passenger-kilometres times the flight factor, and so on. Flights include the extra warming effect of burning fuel at altitude, which calculators treat differently, so this one reads a little higher than a CO₂-only figure. The 2026 factor set publishes both views, so the table below shows the without-altitude figure beside the one used; note the uplift applies to the carbon dioxide alone, so the two differ by about 1.69 times, slightly under the 1.7 the uplift itself implies. Public transport splits between rail and bus on the answer you give, because a bus carries roughly four times the carbon of a train per passenger-kilometre and pricing every fare as rail would understate a bus commute.',
      'Where a real bill or itinerary is not to hand, the calculator estimates: it turns spend into litres, kilometres or parcels at stated rates, or extends a metered daily average over an unbilled period. The quick-estimate path works the same way, only coarser: a typical-home preset stands in for the bills, and rough flight counts price each return at a stated representative sector length (1,100 km domestic, 2,400 km short overseas, 11,000 km long haul, each way, economy), so the range beside the total reads wider until named trips and real bills replace them. In Australia, public-transport spend is capped at the state weekly fare cap first (in NSW, the $50 Opal cap), because spending past the cap buys no extra travel; US and NZ networks cap too differently to carry one ceiling, so spend there is counted as given. Gas bills read in the local unit (megajoules in Australia, kilowatt-hours in New Zealand, therms in the United States) and convert to megajoules before pricing. Estimates are labelled, and replacing one with a real number tightens the range shown next to the total. A certified renewable purchase (GreenPower in Australia, a certified green-power plan elsewhere), where you have it, lowers your purchased-electricity figure, and the same netting applies to electricity an EV draws from the grid; no offsets are subtracted anywhere.',
    ],
  },
  interpret: {
    title: 'How to read the result',
    paras: [
      'The total is compared against three published benchmarks: your home country\'s per-person average (Australian, American or New Zealand), the world average, and a 1.5°C-aligned lifestyle benchmark of 2.5 t a person by 2030. The two averages are national figures that count whole economies, so they are broader than a personal footprint. The 2.5 t figure is a lifestyle benchmark of the same kind this calculator estimates.',
      'By default this calculator leaves out the wider basket of goods and services, so a core total understates a full consumption footprint. The optional detail step adds a screening estimate of that basket (clothing, electronics, entertainment, health, other); even with it switched on a few things stay out, so the gap to the benchmark is if anything larger than it looks.',
    ],
  },
  plan: {
    title: 'How the reductions are modelled',
    paras: [
      'Each reduction is worked out against your own numbers, so the estimate fits your year. When you choose several, the calculator applies them in order (behaviour first, then switching to electric, then rooftop solar on the load that remains) so they add up without double-counting. Bigger changes take a year or two to fully phase in. Indicative costs sit on the same boundary as the reductions: a whole-household outlay like solar or electrifying the gas is split across the adults at home, the same way the bills are, and running-cost savings scale with your own audited use.',
      'The background grid keeps getting cleaner in both lines, because that happens whether or not you act. Offsets and green-power products are left out of the reductions on purpose: they retire certificates; the activity still happens.',
    ],
  },
  character: {
    title: 'How the "result" label is worked out',
    paras: [
      'The playful result at the end is read from three things: how big the year is (small, medium or large, split at the 6.6 t world average and 16 t), how much sits in one category (40% or more in one is "focused"), and whether it came in spikes (a worst month at least twice an average month). That gives twelve labels. A year at or under the 2.5 t benchmark also earns a rare bonus label.',
      'The 40% and 2× cut-offs are editorial choices for the labels only. They never change any number.',
    ],
  },
  equiv: {
    title: 'How the everyday equivalences are worked out',
    paras: [
      'The reveal offers the total re-counted in everyday things: beef burgers, flat whites, hot showers, dryer loads, kilometres of driving, phone charges and a familiar domestic flight. Each is the same tonnes divided by a per-item figure, stated with its assumptions in the table below. They are display conversions only: they never change any number, and the units are things a person chooses.',
      'Where an equivalence depends on the grid or a fuel it derives live from the same factor tables the calculator prices from, with the NSW grid and metro gas as the stated reference case. The food items use Poore & Nemecek 2018 means, the same source as the per-kilogram reference table. The reveal also invites a guess at the total before it lands; the guess is kept on the page for the comparison and stored nowhere.',
    ],
  },
  factorsTitle: 'The factors it uses',
  factorsSub: 'These tables are the exact factors the calculator prices from.',
  exclusions: {
    title: 'What it still leaves out',
    groups: [
      {
        head: 'Outside the boundary',
        items: [
          'Employer emissions (your office, work systems) belong to your employer\'s footprint. Work flights you book yourself are still counted.',
          'Anything owned but rented to others (for example an investment property\'s energy) sits in the tenant\'s footprint.',
        ],
      },
      {
        head: 'Left out because reliable data is unlikely',
        items: [
          'Rideshare "deadheading" (the car driving empty to reach you): hard to know, so rideshare here is a slight underestimate.',
          'The exact split of some shared or one-off spending, which is estimated.',
        ],
      },
      {
        head: 'Not counted, even with the optional detail on',
        items: [
          'Accommodation other than hotels (short-stay rentals, hostels, staying with friends). Hotel nights are counted at a country-average factor, so the specific hotel makes no difference.',
          'Financial and professional services, and any spending the screening factors above do not cover. The goods estimate is a screening tool, so it catches the shape of the basket.',
          'Still queued, because the numbers could not be verified to this page\'s standard in this edition: household waste to landfill, pets (dog and cat food), the embodied emissions of building or buying a car, mains water supply, an Australian spend-based factor set to replace the US one, and published Australian rail and bus figures to replace the UK proxies. Each stays out until its source can be read, and is recorded in the research trail for the next refresh.',
          'What is still a stated proxy, and where each one bites: the fuel-cycle (scope 3) side of New Zealand petrol and diesel uses Australian well-to-tank factors, because no New Zealand equivalent is published. US gas fuel-cycle is not counted at all, so that line understates. Rideshare and public transport outside Australia keep the Australian and UK per-kilometre figures. The Australian electricity, gas and fuel factors carry the NGA Factors 2025 values but were checked against published summaries and a mirrored copy, not read from DCCEEW\'s workbook. That is the largest verification gap left on this page.',
        ],
      },
    ],
  },
  // The change log, kept apart from the method so the method reads as a
  // statement of what the calculator does now.
  changes: {
    title: 'Changes in this edition',
    items: [
      'Flights, freight, hotel nights, rail and bus moved to the UK Government conversion factors 2026 edition. The Australian electricity, gas and fuel lines did not change edition and stay on the NGA Factors 2025 values.',
      'US electricity is now priced per state, read from the eGRID2023 workbook for all fifty states, the District of Columbia and Puerto Rico.',
      'New Zealand electricity (with its separate transmission-loss factor), gas, road-fuel combustion and hotel nights now come from the MfE Measuring Emissions Catalogue 2026, in place of the Australian stand-ins used before. The UK hotel table lists New Zealand but leaves it blank.',
      'Public transport gained a bus factor, so it is no longer priced entirely as rail.',
      'Two items that were queued now ship with their sources read: the garment-count clothing option and the home-embodied line for a new build.',
    ],
  },
};

// Compact pointer to the how-it-works page, which lives on its own page.
export const METHOD_LINK = {
  tag: '03 / How it works',
  title: ['How the', 'calculator works'],
  body: 'The boundary, the factor sources, the arithmetic behind each line, and what the total leaves out. It lives on its own page, with the full factor tables the calculator prices from.',
  cta: 'See how it works',
  factorLine: 'Australian factors (DCCEEW) for energy and fuel, with US (EPA / EIA) and NZ (MfE) sets for audits based there; UK Government (DESNZ / DEFRA) factors for flights and freight.',
};

// The difficulty labels the option cards and the cost-curve tip both read
// from, so the two can never drift apart.
export const EFFORT_LABELS = { low: 'Easy', med: 'Moderate', high: 'Harder' };

// Chart furniture previously inline in charts.jsx.
export const CHART_UI = {
  maccEmpty: 'Nothing applicable to plot yet. Add some entries first.',
  maccHint: 'Tap, hover or tab across the bars. Width is tonnes; below the line pays you.',
  maccCapNote: 'Axis capped at -${cap}/t, MACC convention; marked bars run further and carry their true figure.',
  maccEffortSuffix: 'difficulty',
  monthTotal: 'Month total: {t} t',
};

// Nav control labels previously inline in Nav.jsx.
export const NAV_UI = { menuOpen: 'Open menu', menuClose: 'Close menu' };

// Transient UI feedback, previously inline in components.
export const TOASTS = {
  shareCopied: 'That link carries a summary only; your details stay in this browser.',
  sharePrompt: 'Copy your share link:',
  auditDeleted: 'Deleted from this browser.',
  auditLive: 'Your footprint is ready. It saves to this browser as you edit.',
  backupImported: 'Backup restored.',
};

export const SHARE = {
  // {who} is a possessive ("Ada's" or "My"); {label} is the period.
  bannerTitle: '{who} {label} carbon emissions',
  bannerBody: 'Someone shared their footprint summary with you. Totals and categories only; their details stayed in their browser.',
  // The character verdict carried on the link, when the sharer's audit had one.
  readsAs: 'A year that reads as',
  // The nudge that converts a viewer into a player.
  tease: 'Reckon yours is smaller? Find out.',
  namePrompt: 'Add a name to the shared page? Leave blank to keep it as "My {label} carbon emissions".',
  provenance: 'The numbers come from a calculator built on published factors.',
  provenanceCta: 'See how it works',
  cta: 'Calculate your own',
  dismiss: 'View the full page',
};

// The compact "your data" controls that replace the old activity log. No
// per-item log is shown publicly; these just let someone move or delete their
// own footprint.
export const DATA_CTRL = {
  title: 'Your data',
  body: 'Your footprint saves to this browser as you edit. It is never sent anywhere. Export a backup before switching devices, and restore it on the other side.',
  share: 'Copy a share link',
  export: 'Export a backup',
  import: 'Restore a backup',
  importError: 'That file is not a footprint backup.',
  reset: 'Delete from this browser',
  resetConfirm: 'Delete your footprint from this browser? Export a backup first if you want to keep it.',
};

export const FOOTER = {
  name: 'Chris Wang · 2026',
  back: 'Back to profile',
};

// Dashboard furniture previously inline in the component.
export const DASH_UI = {
  worstSuffix: '% of the year in one month',
  benchSummary: 'How the benchmarks are set',
};

export const fmtT = (t, dp = 1) => (Math.round(t * 10 ** dp) / 10 ** dp).toFixed(dp);
// A year against a benchmark, in one format site-wide: under the benchmark it
// reads as a percentage ("57%"), over it as a multiple ("5.8×").
export const fmtRatio = (total, base) => {
  const r = base > 0 ? total / base : 0;
  return r < 1
    ? { v: String(Math.round(r * 100)), unit: '%' }
    : { v: (Math.round(r * 10) / 10).toFixed(1), unit: '×' };
};
