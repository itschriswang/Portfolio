// Emission factor set for the Life Footprint Dashboard.
// Single source of truth: the calculation engine prices entries from these
// tables, and the Basis of Preparation section renders them directly, so the
// method page can never drift from the numbers actually used.
//
// Factors are snapshotted onto entries when they are logged, so a future
// factor refresh never silently rewrites history (re-saving an entry
// re-prices it). Research notes and verification status for every value:
// docs/footprint-research/factor-sources.md.

// Internal provenance tag stamped on each entry so a future factor update
// never silently re-prices old entries. It is a data key, not a brand: the
// UI shows the plain source list below, never this string.
export const FACTOR_SET = {
  id: 'nga2025-ukghg2026-intl2',
  updated: 'August 2026',
  note: 'Australian electricity, gas and transport fuels carry the values published in the DCCEEW National Greenhouse Accounts Factors 2025 (Tables 1, 5, 6 and 9). DCCEEW\'s workbook could not be downloaded when this set was built, so these values were checked against published summaries and a mirrored copy of the tables, not read from the source file; they are to be read against the workbook at the next refresh. Flights, freight, hotel nights, rail and bus use the UK Government conversion factors (2026 edition), published by DESNZ and still widely known as the DEFRA factors, read cell for cell. United States electricity is priced per state from EPA eGRID2023 rev2, with gas and motor fuels from the EPA GHG Emission Factors Hub. New Zealand electricity, gas, transport fuels and hotel nights come from the MfE Measuring Emissions Catalogue 2026; only the NZ fuel-cycle line still rides an Australian proxy. Updated when new editions are published and verified against the source workbook.',
};

// ---------------------------------------------------------------------------
// Countries the audit can run in. `region` describes what the place picker
// asks for; `gasUnit` is the unit a local bill shows (converted to MJ before
// pricing, so the engine stays single-unit); `defaultRegion` keys ELECTRICITY.
// Settings saved before country support carry no `country`, so countryOf()
// treats a missing value as Australia and nothing old re-prices.
// ---------------------------------------------------------------------------
export const COUNTRIES = {
  AU: {
    label: 'Australia', currency: 'A$', defaultRegion: 'NSW',
    regionQuestion: 'Which state or territory?',
    gasUnit: 'MJ', mjPerGasUnit: 1, gasMax: 40000, gasStep: 50,
    homeAirport: 'SYD',
    renewableQuestion: 'Is your electricity on GreenPower?',
    renewableNote: 'GreenPower is an optional 100% renewable add-on some electricity plans include. If you have never heard of it, you are almost certainly not on it, so choose No or Not sure.',
  },
  NZ: {
    label: 'New Zealand', currency: 'NZ$', defaultRegion: 'NZ',
    regionQuestion: null, // one national grid, nothing to pick
    gasUnit: 'kWh', mjPerGasUnit: 3.6, gasMax: 11000, gasStep: 25,
    homeAirport: 'AKL',
    renewableQuestion: 'Is your electricity on a certified 100% renewable plan?',
    renewableNote: 'A certified renewable plan retires certificates for the power you use. If you have never chosen one, you are almost certainly not on it, so choose No or Not sure.',
  },
  US: {
    label: 'United States', currency: 'US$', defaultRegion: 'US',
    regionQuestion: 'Which state?',
    gasUnit: 'therms', mjPerGasUnit: 105.505, gasMax: 400, gasStep: 5,
    homeAirport: 'JFK',
    renewableQuestion: 'Is your electricity on a 100% renewable (green power) plan?',
    renewableNote: 'A certified green power plan retires renewable certificates for the power you use. If you have never chosen one, you are almost certainly not on it, so choose No or Not sure.',
  },
};

export const countryOf = (settings) =>
  settings && COUNTRIES[settings.country] ? settings.country : 'AU';

// Canonical category order: identity colours and stack order everywhere.
// Palette validated for CVD separation and contrast (dataviz six checks).
export const CATEGORIES = [
  { id: 'electricity', label: 'Electricity', color: 'var(--fp-electricity)', hex: '#75821D' },
  { id: 'flight', label: 'Flights', color: 'var(--fp-flight)', hex: '#635BFF' },
  { id: 'road', label: 'Road & rail', color: 'var(--fp-road)', hex: '#B56A00' },
  { id: 'freight', label: 'Freight', color: 'var(--fp-freight)', hex: '#0891B2' },
  { id: 'gas', label: 'Gas', color: 'var(--fp-gas)', hex: '#C7274A' },
  { id: 'diet', label: 'Diet', color: 'var(--fp-diet)', hex: '#8A4FBE' },
  { id: 'other', label: 'Other', color: 'var(--fp-other)', hex: '#6E7469' },
  // Optional goods-and-services module (spend-based screening) and hotel
  // nights. Appended so identity/stack order stays stable for the core seven;
  // colours are the two most CVD-distinct additions to the palette (deep plum
  // and dark teal, both dark enough for white-on-fill labels).
  { id: 'goods', label: 'Goods & services', color: 'var(--fp-goods)', hex: '#8E2D6E' },
  { id: 'hotel', label: 'Hotel nights', color: 'var(--fp-hotel)', hex: '#1F5F6E' },
  // Optional home-embodied module: the upfront (A1-A5) carbon of a home you
  // built or bought new, amortised over the building life and split per adult.
  // Appended last so the core order stays stable; a warm umber, dark enough
  // for white-on-fill labels and CVD-distinct from the browns above.
  { id: 'dwelling', label: 'Home (embodied)', color: 'var(--fp-dwelling)', hex: '#7A5C3E' },
];

export const categoryById = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES.find((c) => c.id === 'other');

// ---------------------------------------------------------------------------
// Electricity: DCCEEW National Greenhouse Accounts Factors 2025, Table 1.
// Scope 2 = generation attribute of purchased electricity (location-based).
// Scope 3 = fuel extraction plus transmission and distribution losses.
// kg CO2-e per kWh.
// ---------------------------------------------------------------------------
export const ELECTRICITY_SOURCE = {
  name: 'DCCEEW, Australian National Greenhouse Accounts Factors 2025',
  detail: 'Table 1: scope 2 and scope 3 emission factors for purchased electricity by state. Published August 2025; replaces the 2024 edition. Checked against published summaries and a mirrored copy of the table, not yet read from DCCEEW\'s own workbook.',
  url: 'https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors-2025',
};

// Grid factors for the other two countries. New Zealand genuinely runs one
// national grid factor (MfE publishes a single grid average). The United
// States is priced per state from eGRID, with the national average kept as
// the default until a state is chosen.
export const ELECTRICITY_SOURCE_NZ = {
  name: 'NZ Ministry for the Environment, Measuring Emissions Catalogue 2026',
  detail: 'Purchased grid-average electricity for the national grid, about 85% renewable (hydro, wind, geothermal), read from Table 5.2 (annual averages, 2010 to 2025) at the 2025 annual figure. Scope 3 is the catalogue\'s own separate transmission-and-distribution loss factor from Table 5.4. The annual series is volatile because a dry hydrological year pulls thermal generation in: 2024 read 0.0993596 against 2025\'s 0.0786625, a 26% swing, so a New Zealand total moves with the year it is priced in.',
  url: 'https://environment.govt.nz/publications/measuring-emissions-a-guide-for-organisations-2026-detailed-guide/',
};

export const ELECTRICITY_SOURCE_US = {
  name: 'US EPA eGRID2023 (rev2, 12 June 2025), state annual CO2-equivalent total output emission rates',
  detail: 'Every state, the District of Columbia and Puerto Rico priced from its own eGRID row (sheet ST23), read cell for cell and converted from lb CO2e/MWh at 0.45359237/1000. The national average row is eGRID\'s own US figure (770.884 lb CO2e/MWh, 0.3497 kg CO2e/kWh) and applies until a state is chosen. Scope 3 is the eGRID grid gross loss factor of 4.2% (sheet GGL23), grossed up, because a kWh consumed needs 1/(1-0.042) generated behind it; upstream fuel-cycle is not counted, so that side still understates. Vermont reads 0.0237 and West Virginia 0.8931, a factor of 38, so a national average was never a fair answer for an individual. eGRID2024 was scheduled for January 2026 but has not been published, so rev2 of the 2023 edition remains current.',
  url: 'https://www.epa.gov/egrid/download-data',
};

// label: the full place name, used consistently everywhere the visitor picks
// a place (guided audit) and on the method factor table. grid: the named
// interconnected system the factor applies to, shown only on the method
// table where the region detail belongs. ACT sits on the NSW grid. Keys are
// stable storage keys (settings.state), so the Australian ones never change;
// NZ and US carry one national row each (see the sources above for why).
export const ELECTRICITY = {
  NSW: { label: 'New South Wales & ACT', country: 'AU', s2: 0.64, s3: 0.03 },
  VIC: { label: 'Victoria', country: 'AU', s2: 0.78, s3: 0.09 },
  QLD: { label: 'Queensland', country: 'AU', s2: 0.67, s3: 0.09 },
  SA: { label: 'South Australia', country: 'AU', s2: 0.22, s3: 0.04 },
  WA: { label: 'Western Australia', country: 'AU', grid: 'SWIS grid', s2: 0.50, s3: 0.06 },
  TAS: { label: 'Tasmania', country: 'AU', s2: 0.20, s3: 0.03 },
  NT: { label: 'Northern Territory', country: 'AU', grid: 'Darwin-Katherine (DKIS)', s2: 0.56, s3: 0.09 },
  NZ: { label: 'New Zealand', country: 'NZ', grid: 'national grid', s2: 0.0786625, s3: 0.00595616 },
  // United States: 50 states, DC and Puerto Rico, each from eGRID2023 rev2
  // sheet ST23, converted lb CO2e/MWh to kg CO2e/kWh at 0.45359237/1000.
  // Scope 3 grosses the state factor up for the 4.2% grid gross loss
  // (GGL23), because a consumed kWh needs 1/(1-0.042) generated behind it.
  // Keys are namespaced US-XX: the bare two-letter codes would collide with
  // the Australian rows, where WA already means Western Australia. The plain
  // 'US' row stays as the national average, both as the default before a
  // state is chosen and so profiles saved before state pricing still price.
  US: { label: 'United States (national average)', country: 'US', grid: 'national average', s2: 0.3497, s3: 0.01533 },
  'US-AL': { label: 'Alabama', country: 'US', grid: 'eGRID AL', s2: 0.3239, s3: 0.0142 },
  'US-AK': { label: 'Alaska', country: 'US', grid: 'eGRID AK', s2: 0.3694, s3: 0.01619 },
  'US-AZ': { label: 'Arizona', country: 'US', grid: 'eGRID AZ', s2: 0.3126, s3: 0.0137 },
  'US-AR': { label: 'Arkansas', country: 'US', grid: 'eGRID AR', s2: 0.4529, s3: 0.01986 },
  'US-CA': { label: 'California', country: 'US', grid: 'eGRID CA', s2: 0.1791, s3: 0.00785 },
  'US-CO': { label: 'Colorado', country: 'US', grid: 'eGRID CO', s2: 0.4949, s3: 0.0217 },
  'US-CT': { label: 'Connecticut', country: 'US', grid: 'eGRID CT', s2: 0.2452, s3: 0.01075 },
  'US-DE': { label: 'Delaware', country: 'US', grid: 'eGRID DE', s2: 0.3194, s3: 0.014 },
  'US-DC': { label: 'District of Columbia', country: 'US', grid: 'eGRID DC', s2: 0.1792, s3: 0.00786 },
  'US-FL': { label: 'Florida', country: 'US', grid: 'eGRID FL', s2: 0.3579, s3: 0.01569 },
  'US-GA': { label: 'Georgia', country: 'US', grid: 'eGRID GA', s2: 0.3254, s3: 0.01427 },
  'US-HI': { label: 'Hawaii', country: 'US', grid: 'eGRID HI', s2: 0.6326, s3: 0.02773 },
  'US-ID': { label: 'Idaho', country: 'US', grid: 'eGRID ID', s2: 0.1424, s3: 0.00624 },
  'US-IL': { label: 'Illinois', country: 'US', grid: 'eGRID IL', s2: 0.2152, s3: 0.00943 },
  'US-IN': { label: 'Indiana', country: 'US', grid: 'eGRID IN', s2: 0.6647, s3: 0.02914 },
  'US-IA': { label: 'Iowa', country: 'US', grid: 'eGRID IA', s2: 0.2876, s3: 0.01261 },
  'US-KS': { label: 'Kansas', country: 'US', grid: 'eGRID KS', s2: 0.3326, s3: 0.01458 },
  'US-KY': { label: 'Kentucky', country: 'US', grid: 'eGRID KY', s2: 0.7924, s3: 0.03474 },
  'US-LA': { label: 'Louisiana', country: 'US', grid: 'eGRID LA', s2: 0.3461, s3: 0.01517 },
  'US-ME': { label: 'Maine', country: 'US', grid: 'eGRID ME', s2: 0.1437, s3: 0.0063 },
  'US-MD': { label: 'Maryland', country: 'US', grid: 'eGRID MD', s2: 0.2369, s3: 0.01039 },
  'US-MA': { label: 'Massachusetts', country: 'US', grid: 'eGRID MA', s2: 0.3765, s3: 0.01651 },
  'US-MI': { label: 'Michigan', country: 'US', grid: 'eGRID MI', s2: 0.3617, s3: 0.01586 },
  'US-MN': { label: 'Minnesota', country: 'US', grid: 'eGRID MN', s2: 0.3413, s3: 0.01496 },
  'US-MS': { label: 'Mississippi', country: 'US', grid: 'eGRID MS', s2: 0.3757, s3: 0.01647 },
  'US-MO': { label: 'Missouri', country: 'US', grid: 'eGRID MO', s2: 0.6598, s3: 0.02893 },
  'US-MT': { label: 'Montana', country: 'US', grid: 'eGRID MT', s2: 0.4826, s3: 0.02116 },
  'US-NE': { label: 'Nebraska', country: 'US', grid: 'eGRID NE', s2: 0.4653, s3: 0.0204 },
  'US-NV': { label: 'Nevada', country: 'US', grid: 'eGRID NV', s2: 0.292, s3: 0.0128 },
  'US-NH': { label: 'New Hampshire', country: 'US', grid: 'eGRID NH', s2: 0.1253, s3: 0.00549 },
  'US-NJ': { label: 'New Jersey', country: 'US', grid: 'eGRID NJ', s2: 0.2133, s3: 0.00935 },
  'US-NM': { label: 'New Mexico', country: 'US', grid: 'eGRID NM', s2: 0.3509, s3: 0.01538 },
  'US-NY': { label: 'New York', country: 'US', grid: 'eGRID NY', s2: 0.2117, s3: 0.00928 },
  'US-NC': { label: 'North Carolina', country: 'US', grid: 'eGRID NC', s2: 0.2841, s3: 0.01246 },
  'US-ND': { label: 'North Dakota', country: 'US', grid: 'eGRID ND', s2: 0.5887, s3: 0.02581 },
  'US-OH': { label: 'Ohio', country: 'US', grid: 'eGRID OH', s2: 0.4846, s3: 0.02125 },
  'US-OK': { label: 'Oklahoma', country: 'US', grid: 'eGRID OK', s2: 0.2943, s3: 0.0129 },
  'US-OR': { label: 'Oregon', country: 'US', grid: 'eGRID OR', s2: 0.1655, s3: 0.00726 },
  'US-PA': { label: 'Pennsylvania', country: 'US', grid: 'eGRID PA', s2: 0.2939, s3: 0.01288 },
  'US-PR': { label: 'Puerto Rico', country: 'US', grid: 'eGRID PR', s2: 0.7024, s3: 0.03079 },
  'US-RI': { label: 'Rhode Island', country: 'US', grid: 'eGRID RI', s2: 0.381, s3: 0.0167 },
  'US-SC': { label: 'South Carolina', country: 'US', grid: 'eGRID SC', s2: 0.2542, s3: 0.01114 },
  'US-SD': { label: 'South Dakota', country: 'US', grid: 'eGRID SD', s2: 0.1522, s3: 0.00667 },
  'US-TN': { label: 'Tennessee', country: 'US', grid: 'eGRID TN', s2: 0.2999, s3: 0.01315 },
  'US-TX': { label: 'Texas', country: 'US', grid: 'eGRID TX', s2: 0.3498, s3: 0.01534 },
  'US-UT': { label: 'Utah', country: 'US', grid: 'eGRID UT', s2: 0.6447, s3: 0.02826 },
  'US-VT': { label: 'Vermont', country: 'US', grid: 'eGRID VT', s2: 0.0237, s3: 0.00104 },
  'US-VA': { label: 'Virginia', country: 'US', grid: 'eGRID VA', s2: 0.2448, s3: 0.01073 },
  'US-WA': { label: 'Washington', country: 'US', grid: 'eGRID WA', s2: 0.1209, s3: 0.0053 },
  'US-WV': { label: 'West Virginia', country: 'US', grid: 'eGRID WV', s2: 0.8931, s3: 0.03915 },
  'US-WI': { label: 'Wisconsin', country: 'US', grid: 'eGRID WI', s2: 0.5278, s3: 0.02314 },
  'US-WY': { label: 'Wyoming', country: 'US', grid: 'eGRID WY', s2: 0.8316, s3: 0.03646 },
};

// Regions offered by the guided audit's place picker for a country, in table
// order. NZ and US return a single row, so the picker hides itself.
export const regionsForCountry = (country) =>
  Object.entries(ELECTRICITY).filter(([, r]) => r.country === country);

// The electricity row for a settings object, falling back to the home
// country's default region rather than always NSW.
export const electricityFor = (settings) =>
  ELECTRICITY[settings && settings.state] || ELECTRICITY[COUNTRIES[countryOf(settings)].defaultRegion];

export const electricitySourceFor = (country) =>
  country === 'NZ' ? ELECTRICITY_SOURCE_NZ : country === 'US' ? ELECTRICITY_SOURCE_US : ELECTRICITY_SOURCE;

// Stylised grid decarbonisation trajectory used only by the pathway model:
// annual multiplicative decline applied to the scope 2 factor, floored.
export const GRID_DECLINE = {
  ratePerYear: 0.92,
  floor: 0.05,
  source: 'Stylised from DCCEEW, Australia\'s emissions projections 2024 (electricity sector decline to 2035 under the 82% renewables trajectory), flattened to a single annual rate and applied as the background decline for whichever grid is home; a US or NZ audit inherits it as a stated simplification.',
};

// ---------------------------------------------------------------------------
// Natural gas (residential pipeline). NGA Factors 2025, Tables 5 and 6.
// Scope 1 combustion 51.53 kg CO2-e/GJ; scope 3 (metro) varies by state.
// Converted to kg CO2-e per MJ.
// ---------------------------------------------------------------------------
export const GAS_SOURCE = {
  name: 'DCCEEW, Australian National Greenhouse Accounts Factors 2025',
  detail: 'Table 5 (natural gas distributed in a pipeline, scope 1 combined CO2, CH4, N2O: 51.53 kg CO2-e/GJ) and Table 6 (scope 3 fuel-cycle, metropolitan, by state). Checked against published summaries and a mirrored copy of the table, not yet read from DCCEEW\'s own workbook.',
  url: 'https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors-2025',
};

export const GAS = {
  s1_per_MJ: 0.05153,
  // Metro scope 3 by state, kg CO2-e per MJ (TAS uses VIC, NT uses WA per NGA note).
  s3_per_MJ: { NSW: 0.0131, VIC: 0.0040, QLD: 0.0088, SA: 0.0107, WA: 0.0041, TAS: 0.0040, NT: 0.0041 },
};

export const gasS3 = (state) => GAS.s3_per_MJ[state] ?? GAS.s3_per_MJ.NSW;

// US and NZ natural gas. The US scope 1 figure is the EPA GHG Emission
// Factors Hub stationary-combustion default (53.06 kg CO2 plus 1.0 g CH4 and
// 0.10 g N2O per MMBtu at AR5 GWPs, about 53.11 kg CO2e per MMBtu, converted
// at 1,055.06 MJ per MMBtu). New Zealand uses the Australian NGA combustion
// factor as a stated proxy: the fuel is chemically near-identical and
// published NZ figures sit within a few per cent; the MfE cell is queued for
// primary verification. Neither country ships an upstream (fuel-cycle) gas
// factor here: distribution losses are network-specific, so scope 3 reads
// zero for gas outside Australia and the method says the line understates.
export const GAS_SOURCE_US = {
  name: 'US EPA GHG Emission Factors Hub (2025), natural gas stationary combustion',
  detail: '53.06 kg CO2, 1.0 g CH4 and 0.10 g N2O per MMBtu (AR5 GWPs), about 53.11 kg CO2e per MMBtu, converted at 1,055.06 MJ per MMBtu; bills in therms convert at 105.505 MJ per therm. Upstream fuel-cycle and distribution losses are not counted, so the line understates slightly.',
  url: 'https://www.epa.gov/climateleadership/ghg-emission-factors-hub',
};

export const GAS_SOURCE_NZ = {
  name: 'NZ Ministry for the Environment, Measuring Emissions Catalogue 2026',
  detail: 'Reticulated natural gas at the catalogue\'s commercial-use stationary combustion factor (Table 3.2, 54.2862 kg CO2-e per GJ), which runs about 5% above the Australian figure this line used as a proxy before. Scope 3 is the catalogue\'s reticulated-gas transmission and distribution loss factor (Table 3.5, 1.61768 kg CO2-e per GJ), which is a network-loss figure rather than a full well-to-tank fuel cycle, so the upstream side still understates a little and says so.',
  url: 'https://environment.govt.nz/publications/measuring-emissions-a-guide-for-organisations-2026-detailed-guide/',
};

export const GAS_INTL = {
  US: { s1_per_MJ: 0.05034, s3_per_MJ: 0 },
  NZ: { s1_per_MJ: 0.0542862, s3_per_MJ: 0.00161768 },
};

// Effective gas factors for a settings object: AU prices per state; US and
// NZ price at the national figures above.
export function gasFactorsFor(settings) {
  const country = countryOf(settings);
  if (country === 'AU') {
    return {
      s1: GAS.s1_per_MJ, s3: gasS3(settings.state),
      source: GAS_SOURCE.name + ' (metro, ' + (settings.state || 'NSW') + ')',
    };
  }
  const g = GAS_INTL[country];
  const src = country === 'US' ? GAS_SOURCE_US : GAS_SOURCE_NZ;
  return { s1: g.s1_per_MJ, s3: g.s3_per_MJ, source: src.name };
}

export const gasSourceFor = (country) =>
  country === 'US' ? GAS_SOURCE_US : country === 'NZ' ? GAS_SOURCE_NZ : GAS_SOURCE;

// ---------------------------------------------------------------------------
// Road transport. NGA Factors 2025, Table 9 (cars and light commercial
// vehicles), converted to kg CO2-e per litre via published energy contents.
// ---------------------------------------------------------------------------
export const ROAD_SOURCE = {
  name: 'DCCEEW, Australian National Greenhouse Accounts Factors 2025',
  detail: 'Table 9, cars and light commercial vehicles: petrol 67.62 kg CO2-e/GJ scope 1 and 17.2 scope 3 at 34.2 GJ/kL; diesel 70.41 and 17.3 at 38.6 GJ/kL. Converted to per litre. A hybrid burns petrol at the petrol factors; only the default consumption differs (4.5 L/100km, indicative real-world figure for current hybrids). Checked against published summaries and a mirrored copy of the table, not yet read from DCCEEW\'s own workbook.',
  url: 'https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors-2025',
};

export const ROAD_FUELS = {
  petrol: { label: 'Petrol', s1_per_L: 2.31, s3_per_L: 0.59, defaultL100km: 7.0 },
  hybrid: { label: 'Hybrid (petrol)', s1_per_L: 2.31, s3_per_L: 0.59, defaultL100km: 4.5 },
  diesel: { label: 'Diesel', s1_per_L: 2.72, s3_per_L: 0.67, defaultL100km: 6.5 },
  ev: { label: 'Electric (grid-charged)', s1_per_L: 0, s3_per_L: 0, kWhPerKm: 0.16 },
};

// US combustion factors are the EPA defaults (8.78 kg CO2 per gallon of
// gasoline, 10.21 for diesel, at 3.78541 L per gallon; the per-mile CH4 and
// N2O factors add under 1% and are left out, stated). New Zealand uses the
// Australian NGA combustion factors as a stated proxy (published NZ figures:
// petrol about 2.31, diesel about 2.68 kg CO2 per litre, within a few per
// cent). Both countries keep the NGA fuel-cycle (scope 3) factors as a
// stated proxy so the well-to-tank boundary matches across countries:
// refining and crude supply chains are close enough for a screening line,
// and dropping them would make one country's petrol read misleadingly light.
export const ROAD_SOURCE_US = {
  name: 'US EPA GHG Emission Factors Hub (2025), mobile combustion',
  detail: 'Motor gasoline 8.78 and diesel 10.21 kg CO2 per gallon (2.32 and 2.70 per litre); per-mile CH4 and N2O add under 1% and are left out, stated. Fuel-cycle (scope 3) uses the Australian NGA factors as a stated proxy so the boundary matches the other countries. A hybrid burns petrol at the petrol factors; only the default consumption differs.',
  url: 'https://www.epa.gov/climateleadership/ghg-emission-factors-hub',
};

export const ROAD_SOURCE_NZ = {
  name: 'NZ Ministry for the Environment, Measuring Emissions Catalogue 2026 (combustion), with Australian NGA fuel-cycle factors as a stated proxy',
  detail: 'Combustion is read from the catalogue\'s transport fuel table (Table 3.3): regular petrol 2.36143 and diesel 2.67177 kg CO2-e per litre. The separate fuel-cycle (scope 3) line has no NZ equivalent in the catalogue, so it keeps the Australian NGA well-to-tank factors as a stated proxy and is marked as such. A hybrid burns petrol at the petrol factors; only the default consumption differs.',
  url: 'https://environment.govt.nz/publications/measuring-emissions-a-guide-for-organisations-2026-detailed-guide/',
};

export const ROAD_FUELS_INTL = {
  US: {
    petrol: { label: 'Petrol (gasoline)', s1_per_L: 2.32, s3_per_L: 0.59, defaultL100km: 9.0 },
    hybrid: { label: 'Hybrid (gasoline)', s1_per_L: 2.32, s3_per_L: 0.59, defaultL100km: 4.5 },
    diesel: { label: 'Diesel', s1_per_L: 2.70, s3_per_L: 0.67, defaultL100km: 8.0 },
    ev: { label: 'Electric (grid-charged)', s1_per_L: 0, s3_per_L: 0, kWhPerKm: 0.16 },
  },
  // Combustion (s1) from the MfE 2026 catalogue Table 3.3; the fuel-cycle
  // (s3) side has no NZ equivalent published, so it keeps the Australian NGA
  // figures as a stated proxy. Default consumption follows the AU set.
  NZ: {
    petrol: { label: 'Petrol', s1_per_L: 2.36143, s3_per_L: ROAD_FUELS.petrol.s3_per_L, defaultL100km: ROAD_FUELS.petrol.defaultL100km },
    hybrid: { label: 'Hybrid (petrol)', s1_per_L: 2.36143, s3_per_L: ROAD_FUELS.hybrid.s3_per_L, defaultL100km: ROAD_FUELS.hybrid.defaultL100km },
    diesel: { label: 'Diesel', s1_per_L: 2.67177, s3_per_L: ROAD_FUELS.diesel.s3_per_L, defaultL100km: ROAD_FUELS.diesel.defaultL100km },
    ev: ROAD_FUELS.ev,
  },
};

export const roadFuelSetFor = (country) => ROAD_FUELS_INTL[country] || ROAD_FUELS;

export const roadFuelFor = (country, fuel) => {
  const set = roadFuelSetFor(country);
  return set[fuel] || set.petrol;
};

export const roadSourceFor = (country) =>
  country === 'US' ? ROAD_SOURCE_US : country === 'NZ' ? ROAD_SOURCE_NZ : ROAD_SOURCE;

// Car-free ground transport, per passenger-km. Someone else's vehicle, so
// scope 3 in a personal inventory.
export const ROAD_MODES = {
  rideshare: {
    label: 'Rideshare / taxi',
    perKm: 0.232,
    source: 'Derived: petrol car at 8.0 L/100km fleet average on the NGA 2025 factors above, fuel cycle included. Deadheading between fares excluded and noted as an understatement.',
  },
  pt: {
    label: 'Public transport (rail, indicative)',
    perKm: 0.03092,
    source: 'UK Government GHG Conversion Factors 2026, national rail per passenger-km (sheet "Business travel- land", cell D87, tank-to-wheel), used as an indicative proxy pending a published Australian per-passenger-km figure. The 2026 edition rebuilt the rail factors on new Office of Rail and Road and Transport for London data, the first CO2 update since 2021, which had still been running on pre-COVID 2019 loadings. The range is wide and depends on how you count the grid. On a location-based (physical grid) basis the real Sydney figure is higher than this, roughly twice, because the NSW grid is far more coal-heavy than the UK one. On a market-based basis it is close to zero, because Sydney Trains has bought 100 per cent renewable electricity since 2021. This proxy sits between the two. Public transport is a small line for most people, so the choice moves the total very little.',
  },
  // Buses run about four times the rail factor per passenger-km, so a
  // bus-heavy commute priced at the rail proxy reads far too low. Same proxy
  // caveat as rail: a UK figure standing in until an Australian one is
  // published, and the local (non-London) row is the closest match to an
  // Australian urban route.
  bus: {
    label: 'Public transport (bus, indicative)',
    perKm: 0.12552,
    source: 'UK Government GHG Conversion Factors 2026, local bus excluding London, per passenger-km (sheet "Business travel- land", cell D79, tank-to-wheel). A stated proxy pending a published Australian per-passenger-km bus figure. Australian urban buses run a diesel fleet of broadly similar occupancy, so the figure is a defensible stand-in; a fuller electric-bus rollout would pull it down.',
  },
};

// ---------------------------------------------------------------------------
// Flights: distance-based, per passenger-km. UK Government (DESNZ/DEFRA)
// GHG Conversion Factors 2026 edition, business travel: air, WITH radiative
// forcing. Values below match the 2026 workbook cell-for-cell, read from
// docs/ghg-conversion-factors-2026-full-set (1).xlsx, sheet 'Business travel-
// air', rows 23 to 31. The 2026 edition left aviation unchanged in method: its
// "What's new" sheet lists electricity, rail, electric cars and HGV naming,
// and never mentions aviation.
// The workbook publishes without-RF factors in their own columns (I23:I31), so
// they are carried here as read rather than derived. Note the with-RF total is
// NOT 1.7x the without-RF total: the uplift applies to the CO2 component only,
// leaving CH4 and N2O untouched, so the ratio of the totals lands near 1.69.
// Cross-check methodology: ICAO Carbon Emissions Calculator (CO2 only, no RF,
// route-specific fuel burn), which reads materially lower.
// ---------------------------------------------------------------------------
export const FLIGHT_SOURCE = {
  name: 'UK Government (DESNZ / DEFRA) GHG Conversion Factors 2026, business travel: air',
  detail: 'Per passenger-km by haul and cabin, radiative forcing included, read cell for cell from the 2026 full set (Year 2026, Version 1). Great-circle distance uplifted 8% per the DEFRA method, which the 2026 workbook restates. Without-RF factors are published in the same table and are carried as read, not derived: the uplift lands on the CO2 component alone, so the with-RF total is about 1.69 times the without-RF total rather than exactly 1.7. The domestic band is applied to Australian domestic sectors as a stated proxy: a BITRE-derived Australian figure (about 0.156 kg CO2-e per passenger-km, CO2 only, from 2018-19 domestic aviation emissions over revenue passenger-km) lands close to this once radiative forcing is added, so the DEFRA-with-RF value is a defensible stand-in. The 2026 edition also publishes a fourth band for flights between two non-UK destinations, averaging about 6.7% below the equivalent to-and-from-UK cabin; this tool keeps the distance-banded UK figures because they stay sensitive to sector length, which makes its international flights marginally conservative. ICAO calculator used as a further cross-check.',
  url: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026',
};

// Bands: domestic (a sector within one country, DEFRA domestic
// average-passenger proxy), short-haul international (< 3,700 km), long-haul
// international (>= 3,700 km). A domestic sector at or beyond 3,700 km (a US
// transcontinental or Hawaii leg; no Australian pair reaches it) prices at
// the long-haul factor instead: the domestic band describes short sectors,
// and stretching it across an ocean would overstate by half.
// kg CO2-e per passenger-km. withRF is what the engine prices from; withoutRF
// is published alongside it and shown in the method, both as read from the
// 2026 workbook. Short-haul publishes only three rows (average, economy,
// business), so premium repeats economy and first repeats business, which is
// the workbook's own coverage rather than an assumption of ours.
export const FLIGHT_FACTORS = {
  domestic: {
    label: 'Domestic',
    withRF: { economy: 0.22928, premium: 0.22928, business: 0.22928, first: 0.22928 },
    withoutRF: { economy: 0.13552, premium: 0.13552, business: 0.13552, first: 0.13552 },
    noCabinSplit: true,
  },
  shortIntl: {
    label: 'Short-haul international',
    withRF: { economy: 0.12576, premium: 0.12576, business: 0.18863, first: 0.18863 },
    withoutRF: { economy: 0.07435, premium: 0.07435, business: 0.11152, first: 0.11152 },
  },
  longIntl: {
    label: 'Long-haul international',
    withRF: { economy: 0.11704, premium: 0.18726, business: 0.3394, first: 0.46814 },
    withoutRF: { economy: 0.06926, premium: 0.11081, business: 0.20083, first: 0.27701 },
  },
};

// The stated uplift DEFRA applies to the CO2 component of an aviation factor.
// It is not the ratio between the published with-RF and without-RF totals,
// because CH4 and N2O are left un-uplifted; that ratio lands near 1.69.
export const FLIGHT_RF_MULTIPLIER = 1.7;
export const FLIGHT_DISTANCE_UPLIFT = 1.08;

// Great-circle distances (km, one way) for the simple route picker used by the
// activity log's quick-add form. The guided audit uses a From/To airport
// picker instead (AIRPORTS below), computing the same great-circle distance
// live so no origin is baked in.
export const FLIGHT_ROUTES = [
  { id: 'SYD-MEL', label: 'Sydney to Melbourne', km: 706, band: 'domestic' },
  { id: 'SYD-BNE', label: 'Sydney to Brisbane', km: 750, band: 'domestic' },
  { id: 'SYD-PER', label: 'Sydney to Perth', km: 3278, band: 'domestic' },
  { id: 'SYD-AYQ', label: 'Sydney to Uluru', km: 2024, band: 'domestic' },
  { id: 'MEL-ADL', label: 'Melbourne to Adelaide', km: 643, band: 'domestic' },
  { id: 'SYD-AKL', label: 'Sydney to Auckland', km: 2156, band: 'shortIntl' },
  { id: 'SYD-DPS', label: 'Sydney to Denpasar', km: 4630, band: 'longIntl' },
  { id: 'SYD-SIN', label: 'Sydney to Singapore', km: 6288, band: 'longIntl' },
  { id: 'SYD-ICN', label: 'Sydney to Seoul', km: 8317, band: 'longIntl' },
  { id: 'SYD-HND', label: 'Sydney to Tokyo', km: 7823, band: 'longIntl' },
  { id: 'SYD-MNL', label: 'Sydney to Manila', km: 6264, band: 'longIntl' },
  { id: 'SYD-LAX', label: 'Sydney to Los Angeles', km: 12051, band: 'longIntl' },
  { id: 'SYD-LHR', label: 'Sydney to London', km: 17016, band: 'longIntl' },
  // New Zealand and United States quick-adds. A domestic sector at or beyond
  // 3,700 km (LA to New York, LA to Honolulu) prices at the long-haul factor
  // per flightBandForKm, and the band here says so.
  { id: 'AKL-WLG', label: 'Auckland to Wellington', km: 480, band: 'domestic' },
  { id: 'AKL-CHC', label: 'Auckland to Christchurch', km: 744, band: 'domestic' },
  { id: 'AKL-ZQN', label: 'Auckland to Queenstown', km: 1019, band: 'domestic' },
  { id: 'AKL-SYD', label: 'Auckland to Sydney', km: 2156, band: 'shortIntl' },
  { id: 'LAX-SFO', label: 'Los Angeles to San Francisco', km: 543, band: 'domestic' },
  { id: 'LAX-JFK', label: 'Los Angeles to New York', km: 3983, band: 'longIntl' },
  { id: 'LAX-HNL', label: 'Los Angeles to Honolulu', km: 4113, band: 'longIntl' },
  { id: 'JFK-LHR', label: 'New York to London', km: 5540, band: 'longIntl' },
];

// ---------------------------------------------------------------------------
// Airport reference for the guided-audit flight picker. Any From can pair with
// any To: the distance is the great-circle (haversine) between the two, so the
// picker is not Sydney-centric and stays consistent with FLIGHT_SOURCE, which
// already prices on great-circle distance uplifted 8% (the DEFRA method; the
// engine applies FLIGHT_DISTANCE_UPLIFT). country is used to decide domestic
// versus international; region only groups the dropdown. Coordinates are the
// airport's published latitude and longitude in degrees.
// ---------------------------------------------------------------------------
export const AIRPORTS = [
  // Australia
  { code: 'SYD', city: 'Sydney', country: 'AU', region: 'Australia', lat: -33.95, lon: 151.18 },
  { code: 'MEL', city: 'Melbourne', country: 'AU', region: 'Australia', lat: -37.67, lon: 144.84 },
  { code: 'BNE', city: 'Brisbane', country: 'AU', region: 'Australia', lat: -27.38, lon: 153.12 },
  { code: 'PER', city: 'Perth', country: 'AU', region: 'Australia', lat: -31.94, lon: 115.97 },
  { code: 'ADL', city: 'Adelaide', country: 'AU', region: 'Australia', lat: -34.95, lon: 138.53 },
  { code: 'CBR', city: 'Canberra', country: 'AU', region: 'Australia', lat: -35.31, lon: 149.20 },
  { code: 'OOL', city: 'Gold Coast', country: 'AU', region: 'Australia', lat: -28.16, lon: 153.51 },
  { code: 'CNS', city: 'Cairns', country: 'AU', region: 'Australia', lat: -16.89, lon: 145.75 },
  { code: 'HBA', city: 'Hobart', country: 'AU', region: 'Australia', lat: -42.84, lon: 147.51 },
  { code: 'DRW', city: 'Darwin', country: 'AU', region: 'Australia', lat: -12.41, lon: 130.88 },
  { code: 'AYQ', city: 'Uluru (Ayers Rock)', country: 'AU', region: 'Australia', lat: -25.19, lon: 130.98 },
  // New Zealand
  { code: 'AKL', city: 'Auckland', country: 'NZ', region: 'New Zealand', lat: -37.01, lon: 174.79 },
  { code: 'WLG', city: 'Wellington', country: 'NZ', region: 'New Zealand', lat: -41.33, lon: 174.81 },
  { code: 'CHC', city: 'Christchurch', country: 'NZ', region: 'New Zealand', lat: -43.49, lon: 172.53 },
  { code: 'ZQN', city: 'Queenstown', country: 'NZ', region: 'New Zealand', lat: -45.02, lon: 168.74 },
  // Asia Pacific
  { code: 'DPS', city: 'Bali (Denpasar)', country: 'ID', region: 'Asia Pacific', lat: -8.75, lon: 115.17 },
  { code: 'CGK', city: 'Jakarta', country: 'ID', region: 'Asia Pacific', lat: -6.13, lon: 106.66 },
  { code: 'SIN', city: 'Singapore', country: 'SG', region: 'Asia Pacific', lat: 1.36, lon: 103.99 },
  { code: 'KUL', city: 'Kuala Lumpur', country: 'MY', region: 'Asia Pacific', lat: 2.75, lon: 101.71 },
  { code: 'BKK', city: 'Bangkok', country: 'TH', region: 'Asia Pacific', lat: 13.69, lon: 100.75 },
  { code: 'SGN', city: 'Ho Chi Minh City', country: 'VN', region: 'Asia Pacific', lat: 10.82, lon: 106.66 },
  { code: 'HAN', city: 'Hanoi', country: 'VN', region: 'Asia Pacific', lat: 21.22, lon: 105.81 },
  { code: 'MNL', city: 'Manila', country: 'PH', region: 'Asia Pacific', lat: 14.51, lon: 121.02 },
  { code: 'HKG', city: 'Hong Kong', country: 'HK', region: 'Asia Pacific', lat: 22.31, lon: 113.91 },
  { code: 'TPE', city: 'Taipei', country: 'TW', region: 'Asia Pacific', lat: 25.08, lon: 121.23 },
  { code: 'PVG', city: 'Shanghai', country: 'CN', region: 'Asia Pacific', lat: 31.14, lon: 121.81 },
  { code: 'PEK', city: 'Beijing', country: 'CN', region: 'Asia Pacific', lat: 40.08, lon: 116.58 },
  { code: 'ICN', city: 'Seoul', country: 'KR', region: 'Asia Pacific', lat: 37.46, lon: 126.44 },
  { code: 'HND', city: 'Tokyo', country: 'JP', region: 'Asia Pacific', lat: 35.55, lon: 139.78 },
  { code: 'KIX', city: 'Osaka', country: 'JP', region: 'Asia Pacific', lat: 34.43, lon: 135.24 },
  { code: 'DEL', city: 'Delhi', country: 'IN', region: 'Asia Pacific', lat: 28.56, lon: 77.10 },
  { code: 'BOM', city: 'Mumbai', country: 'IN', region: 'Asia Pacific', lat: 19.09, lon: 72.87 },
  // Middle East
  { code: 'DXB', city: 'Dubai', country: 'AE', region: 'Middle East', lat: 25.25, lon: 55.36 },
  { code: 'DOH', city: 'Doha', country: 'QA', region: 'Middle East', lat: 25.27, lon: 51.61 },
  // Americas
  { code: 'LAX', city: 'Los Angeles', country: 'US', region: 'Americas', lat: 33.94, lon: -118.41 },
  { code: 'SFO', city: 'San Francisco', country: 'US', region: 'Americas', lat: 37.62, lon: -122.38 },
  { code: 'SEA', city: 'Seattle', country: 'US', region: 'Americas', lat: 47.45, lon: -122.31 },
  { code: 'LAS', city: 'Las Vegas', country: 'US', region: 'Americas', lat: 36.08, lon: -115.15 },
  { code: 'DEN', city: 'Denver', country: 'US', region: 'Americas', lat: 39.86, lon: -104.67 },
  { code: 'DFW', city: 'Dallas-Fort Worth', country: 'US', region: 'Americas', lat: 32.90, lon: -97.04 },
  { code: 'ORD', city: 'Chicago', country: 'US', region: 'Americas', lat: 41.98, lon: -87.90 },
  { code: 'ATL', city: 'Atlanta', country: 'US', region: 'Americas', lat: 33.64, lon: -84.43 },
  { code: 'MIA', city: 'Miami', country: 'US', region: 'Americas', lat: 25.79, lon: -80.29 },
  { code: 'JFK', city: 'New York', country: 'US', region: 'Americas', lat: 40.64, lon: -73.78 },
  { code: 'BOS', city: 'Boston', country: 'US', region: 'Americas', lat: 42.36, lon: -71.01 },
  { code: 'HNL', city: 'Honolulu', country: 'US', region: 'Americas', lat: 21.32, lon: -157.92 },
  { code: 'YVR', city: 'Vancouver', country: 'CA', region: 'Americas', lat: 49.19, lon: -123.18 },
  // Europe
  { code: 'LHR', city: 'London', country: 'GB', region: 'Europe', lat: 51.47, lon: -0.45 },
  { code: 'CDG', city: 'Paris', country: 'FR', region: 'Europe', lat: 49.01, lon: 2.55 },
  { code: 'AMS', city: 'Amsterdam', country: 'NL', region: 'Europe', lat: 52.31, lon: 4.76 },
  { code: 'FRA', city: 'Frankfurt', country: 'DE', region: 'Europe', lat: 50.04, lon: 8.56 },
  { code: 'FCO', city: 'Rome', country: 'IT', region: 'Europe', lat: 41.80, lon: 12.24 },
];

export const airportByCode = (code) => AIRPORTS.find((p) => p.code === code) || null;

// Great-circle distance in kilometres between two airports (haversine). Raw,
// un-uplifted: the engine applies the DEFRA 8% uplift when it prices, exactly
// as it does for the FLIGHT_ROUTES table.
export function greatCircleKm(a, b) {
  if (!a || !b) return 0;
  const R = 6371; // mean Earth radius, km
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const s = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(s))));
}

// Home airport suggested per region, so a new flight card opens from a
// sensible origin without ever forcing it. ACT rides on the NSW label; the
// national NZ and US rows fall through to the country default in COUNTRIES.
export const HOME_AIRPORT = {
  NSW: 'SYD', VIC: 'MEL', QLD: 'BNE', SA: 'ADL', WA: 'PER', TAS: 'HBA', NT: 'DRW',
  NZ: 'AKL', US: 'JFK',
};

// Quick-add destinations for the trips step, most-flown first, per home
// country. Codes must exist in AIRPORTS; a quick-added card opens prefilled
// from the home airport and stays fully editable.
export const POPULAR_DESTS = {
  AU: ['MEL', 'SYD', 'BNE', 'PER', 'AKL', 'DPS', 'SIN', 'LHR', 'LAX'],
  NZ: ['SYD', 'MEL', 'WLG', 'CHC', 'BNE', 'SIN', 'LHR', 'LAX'],
  US: ['JFK', 'LAX', 'SFO', 'ORD', 'MIA', 'LHR', 'CDG', 'HND'],
};

// Representative one-way sector lengths for rough flight counts, used when a
// visitor counts trips instead of naming them. Deliberately coarse and stated
// on every entry they price: domestic sits near the big east-coast sectors,
// short overseas near trans-Tasman, long overseas near an Asia/US mix. Each
// stays on the right side of the 3,700 km DEFRA band boundary.
export const ROUGH_FLIGHT_KM = { dom: 1100, short: 2400, long: 11000 };

export function flightBandForKm(km, international) {
  if (!international) return km < 3700 ? 'domestic' : 'longIntl';
  return km < 3700 ? 'shortIntl' : 'longIntl';
}

// ---------------------------------------------------------------------------
// Effective weekly public-transport spend ceiling by state. Spend above the
// ceiling buys no extra travel, so annualising uncapped weekly spend overstates
// both the money and the kilometres. Only NSW publishes a true adult weekly
// travel cap; every other network caps differently (daily caps, flat fares, or
// fare-free periods), so those ceilings are DERIVED and approximate, marked
// `approx`. Public-transport spend is a screening input (±30% tier) regardless,
// so an approximate ceiling is fair here; the point is to avoid absurd
// annualisation, not to price a fare to the cent. Figures move with fare
// policy, so they carry an as-at date and the note says so.
// ---------------------------------------------------------------------------
export const PT_FARE_CAPS_ASOF = 'July 2026';

export const PT_FARE_CAPS = {
  NSW: {
    weekly: 50, approx: false,
    label: 'the $50 Adult Opal weekly travel cap',
    source: 'Transport for NSW, Opal fares: Adult weekly travel capped at $50 (plus separate daily and Sunday caps).',
    url: 'https://transportnsw.info/tickets-opal/opal/fares-payments/adult-fares',
  },
  VIC: {
    weekly: 75, approx: true,
    label: 'myki daily fare caps',
    source: 'Public Transport Victoria: full-fare myki daily cap about $11.40 (weekday), $8.00 (weekend); a heavy week is bounded near $75. Victorian fares were half price from mid-2026, so this is the undiscounted ceiling.',
    url: 'https://www.ptv.vic.gov.au/tickets/myki/myki-money/',
  },
  QLD: {
    weekly: 10, approx: true,
    label: 'the flat 50c Translink fare',
    source: 'Translink: a permanent flat 50c fare per trip statewide (since February 2025), so even heavy weekly use stays around $10.',
    url: 'https://translink.com.au/tickets-and-fares/50-cent-fares',
  },
  WA: {
    weekly: 50, approx: true,
    label: 'Transperth daily and capped fares',
    source: 'Transperth: $7 DayRider and the capped "Go Anywhere" fares (from January 2026) bound a heavy week near $50.',
    url: 'https://www.transperth.wa.gov.au/tickets-fares/fares',
  },
  SA: {
    weekly: 50, approx: true,
    label: 'the Adelaide Metro daily two-trip cap',
    source: 'Adelaide Metro: fares are capped at two trips a day (about $8 full fare), bounding a heavy week near $50.',
    url: 'https://www.adelaidemetro.com.au/fares-and-passes/adelaide-metro-fares',
  },
  TAS: {
    weekly: 15, approx: true,
    label: 'fare-free Metro buses',
    source: 'Metro Tasmania: urban bus travel is fare-free until 30 June 2027, so most weekly spend is nil; the small ceiling covers regional coach travel.',
    url: 'https://www.metrotas.com.au/fares/',
  },
  NT: {
    weekly: 20, approx: true,
    label: 'flat Darwinbus fares',
    source: 'Darwinbus: low flat fares (about $3 for three hours, day and weekly tickets), bounding a heavy week near $20.',
    url: 'https://nt.gov.au/driving/public-transport-cycling/public-buses',
  },
};

// ---------------------------------------------------------------------------
// Freight. kg CO2-e per tonne-km by mode, plus an indicative per-parcel
// figure for people who count parcels rather than tonne-km.
// Air and sea kept at the fully verified 2024-edition cells with the vintage
// stated: the 2026 edition revised air downward, so this reads conservative.
// ---------------------------------------------------------------------------
export const FREIGHT_SOURCE = {
  name: 'UK Government (DESNZ / DEFRA) GHG Conversion Factors 2026, freighting goods',
  detail: 'Read cell for cell from the 2026 full set, sheet "Freighting goods", which carries direct (tank-to-wheel) factors only; the fuel supply chain sits on its own WTT sheet and is not added here, matching how the rest of this table treats combustion. Air: long-haul dedicated freighter with RF (D100). The 2026 edition revised air freight down 18% against 2024, so the shipped figure falls with it rather than staying conservative on a stale number. Sea: container ship average (E159). Road: average laden non-refrigerated HGV (D63). Per-parcel: indicative order-of-magnitude from courier corporate disclosures (0.4 to 1.2 kg CO2-e per parcel; Siragusa et al. 2022), which is not a DEFRA figure and stays marked as indicative.',
  url: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026',
};

export const FREIGHT_MODES = {
  road: { label: 'Road (HGV avg laden)', perTonneKm: 0.10356 },
  air: { label: 'Air (long-haul, with RF)', perTonneKm: 0.89939 },
  sea: { label: 'Sea (container)', perTonneKm: 0.01612 },
  parcel: { label: 'Parcel (indicative, each)', perParcel: 0.75 },
};

// ---------------------------------------------------------------------------
// Diet: per-day factors by diet type, from published LCA meta-analysis.
// Deliberately coarse and labelled indicative: diet LCA carries wide ranges
// and the source is UK consumption data, standardised to 2,000 kcal.
// ---------------------------------------------------------------------------
export const DIET_SOURCE = {
  name: 'Scarborough et al. 2014, Climatic Change 125:179-192 (per-day gradient), cross-checked against Australian work',
  detail: 'Diet is a coarse estimate. Per-day values by diet type come from a large UK study (n = 55,504) standardised to 2,000 kcal, chosen because it separates high-meat, medium-meat, low-meat, pescetarian, vegetarian and vegan cleanly. The size and direction hold up in later work, including Australian studies: CSIRO (Hendrie et al. 2014, Nutrients) and Ridoutt et al. find the same gradient, with meat and dairy dominating. Treat the diet line as the right order of magnitude, not a measured number.',
  url: 'https://doi.org/10.1007/s10584-014-1169-1',
};

export const DIET_TYPES = {
  highMeat: { label: 'High meat (100g+ per day)', perDay: 7.19 },
  medMeat: { label: 'Medium meat (50 to 99g)', perDay: 5.63 },
  lowMeat: { label: 'Low meat (under 50g)', perDay: 4.67 },
  pescetarian: { label: 'Pescetarian', perDay: 3.91 },
  vegetarian: { label: 'Vegetarian', perDay: 3.81 },
  vegan: { label: 'Vegan', perDay: 2.89 },
};

// Per-kg reference factors for the method page (not used in pricing).
export const FOOD_PER_KG = {
  source: 'Poore & Nemecek 2018 (Science), GWP100 means including land use, as presented by Our World in Data. Beef shown for the dedicated beef herd; dairy-herd beef is 33.3.',
  rows: [
    ['Beef (beef herd)', 99.5], ['Lamb', 39.7], ['Cheese', 23.9], ['Pork', 12.3],
    ['Poultry', 9.9], ['Eggs', 4.7], ['Rice', 4.5], ['Tofu', 3.2],
  ],
};

// ---------------------------------------------------------------------------
// Goods and services: the optional spend-based screening module. These are the
// categories the core calculator leaves out (clothing, electronics,
// entertainment, health, other), estimated from how much you spend rather than
// a physical quantity. Deliberately opt-in and clearly labelled an estimate:
// spend-based (environmentally extended input-output) factors are the right
// tool for screening a consumption basket, not a precise measurement.
//
// Base factors are the US EPA Supply Chain GHG Emission Factors v1.3.0 by
// NAICS-6, "with margins" column (kg CO2e per 2022 US dollar of purchaser-price
// spend, all GHGs at AR5 GWP-100). Every value below was read from the official
// dataset and cross-checked byte-for-byte across three independent mirrors of
// the EPA CSV. Because the factor is priced per 2022 US dollar and the audit is
// in current Australian dollars, each entry is converted AUD -> USD and
// deflated to 2022 USD before pricing; the conversion is stated in GOODS_FX and
// on the method page. USEEIO is a US model, so applying it to Australian spend
// is itself a screening approximation, noted as such.
// Research notes: docs/footprint-research/factor-sources.md.
// ---------------------------------------------------------------------------
export const GOODS_SOURCE = {
  name: 'US EPA Supply Chain GHG Emission Factors v1.3.0 (NAICS-6, with margins), spend-based screening',
  detail: 'kg CO2e per 2022 USD of purchaser-price spend, all GHGs (AR5 GWP-100). Converted to Australian dollars in the reporting year via the AUD to USD rate and US consumer-price inflation to 2022 (see below). A screening estimate for a US consumption basket applied to Australian spend, not a measurement.',
  url: 'https://catalog.data.gov/dataset/supply-chain-greenhouse-gas-emission-factors-v1-3-by-naics-6',
};

// Currency and inflation bridge from a 2022-USD factor to spend logged in
// the visitor's own current dollars. rate is USD per 1 local dollar;
// inflation is the US CPI-U ratio from the 2022 annual average to the
// reporting year, shared by all three countries because the factor itself is
// priced in 2022 US dollars. The combined multiplier applied to every base
// factor is rate / inflation. GOODS_FX keeps the AU fields as the flat
// canonical shape old code and the method page read.
export const GOODS_FX = {
  audUsd: 0.6785,
  audUsdNote: 'FY2026 average (July 2025 to June 2026), USD per 1 AUD, from the RBA daily exchange-rate series (Statistical Table F11.1, mean of the 251 trading days). Cross-checked against the ATO\'s published annual average for the year ended 30 June 2026, which is drawn from the RBA and agrees to four decimal places.',
  inflation: 1.120,
  inflationNote: 'US CPI-U (all items) rose about 12% from the 2022 annual average (292.7) to the FY2026 average (327.7), per the US Bureau of Labor Statistics series CUUR0000SA0.',
};

export const GOODS_FX_BY_COUNTRY = {
  AU: {
    rate: GOODS_FX.audUsd,
    rateNote: GOODS_FX.audUsdNote,
  },
  NZ: {
    rate: 0.5842,
    rateNote: 'Rolling 12-month average to 15 July 2026, USD per 1 NZD, from the NZ Inland Revenue overseas currency rates tables. It sits on the same twelve months as the Australian rate beside it.',
  },
  US: {
    rate: 1,
    rateNote: 'Spend is already in US dollars, so only the inflation bridge to the 2022 factor year applies.',
  },
};

// Per sub-category: usPerUsd is the EPA v1.3.0 with-margins factor (kg CO2e per
// 2022 USD). Where a household category spans several commodities its factor is
// the equal-weighted mean of the representative EPA rows named in `basis`, a
// stated screening assumption. Clothing and Other are single, uniform sectors.
export const GOODS = {
  clothing: {
    label: 'Clothing & footwear', usPerUsd: 0.12,
    basis: 'Apparel manufacturing, NAICS 315 (315220/315240/315280/315990 all 0.12 with margins).',
  },
  electronics: {
    label: 'Electronics & tech', usPerUsd: 0.102,
    basis: 'Mean of computers 334111 (0.058), phones and comms 334220 (0.111), audio and video 334310 (0.081), small appliances 335210 (0.157).',
  },
  entertainment: {
    label: 'Entertainment & recreation', usPerUsd: 0.112,
    basis: 'Mean of recreation and gyms 713940 (0.235), cinema 512131 (0.052), subscription and streaming 515210 (0.094), events and sport 711211 (0.067).',
  },
  health: {
    label: 'Health, out of pocket', usPerUsd: 0.094,
    basis: 'Mean of physicians 621111 (0.083), dentists 621210 (0.056), allied health 621300 (0.105), pharmacy 446110 (0.13).',
  },
  other: {
    label: 'Other goods & services', usPerUsd: 0.164,
    basis: 'General-merchandise retail, NAICS 452 (452311/452210/452319 all 0.164 with margins).',
  },
};

// kg CO2e per local dollar of spend, ready for the engine: the EPA
// per-2022-USD factor bridged into the home country's current dollars. round
// to 4 dp so the method table and pricing agree exactly.
export const goodsPerDollar = (kind, country = 'AU') => {
  const g = GOODS[kind] || GOODS.other;
  const fx = GOODS_FX_BY_COUNTRY[country] || GOODS_FX_BY_COUNTRY.AU;
  const v = (g.usPerUsd * fx.rate) / GOODS_FX.inflation;
  return Math.round(v * 10000) / 10000;
};

export const goodsPerAud = (kind) => goodsPerDollar(kind, 'AU');

// ---------------------------------------------------------------------------
// Clothing by item count: the physical alternative to the spend line above.
// Spend-based factors weight dollars, not garments, so a fast-fashion haul
// reads lighter than one boutique piece; counting items priced on published
// per-garment life-cycle results fixes that. Base figures are the ADEME
// consumer-products LCA study (2018), cradle-to-grave climate-change results
// per product (report annex results table, p. 180), the study behind the
// French Base Empreinte per-item factors and ADEME's national consumer
// calculator. Each bucket is the equal-weighted mean of the named product
// rows, a stated screening assumption in the same style as GOODS above.
//
// Two caveats, both stated on the method page: (1) ADEME's use phase
// attributes the garment's full laundering to the garment, which overlaps
// slightly with home electricity counted elsewhere here, so the line reads
// conservative rather than hiding the seam; (2) inter-study variance in
// garment LCA is real: Mistra Future Fashion (Sandin et al. 2019) spans
// about 1 to 20 kg CO2e per garment life cycle across six garments, and the
// WRAP UK aggregate works out near 23 kg CO2e per kg of clothing, so these
// per-item figures sit at the top of the published range.
// Research notes and extraction record: docs/footprint-research/factor-sources.md;
// source PDFs in docs/footprint-research/clothing/.
// ---------------------------------------------------------------------------
export const CLOTHING_ITEMS_SOURCE = {
  name: 'ADEME, Modélisation et évaluation des impacts environnementaux de produits de consommation et biens d\'équipement (2018), per-item LCA',
  detail: 'kg CO2e per item, cradle-to-grave (climate-change results per product, report annex, p. 180); the study behind the French Base Empreinte per-item textile factors. Buckets are equal-weighted means of the named product rows. Includes the garment\'s laundering per the ADEME method, which overlaps slightly with home electricity counted elsewhere, so the line reads conservative. Cross-checks: Mistra Future Fashion (Sandin et al. 2019) spans about 1 to 20 kg CO2e per garment life cycle; the WRAP Valuing Our Clothes UK aggregate (26.2 Mt CO2e over 1.13 Mt of clothing, 2016) is about 23 kg CO2e per kg.',
  url: 'https://librairie.ademe.fr/consommer-autrement/1189-modelisation-et-evaluation-des-impacts-environnementaux-de-produits-de-consommation-et-biens-d-equipement.html',
};

export const CLOTHING_ITEMS = {
  tops: {
    label: 'Tops, tees & shirts', perItem: 9.6,
    basis: 'Mean of cotton T-shirt 7, polo 10, sport polyester T-shirt 6, cotton shirt 13, viscose shirt 12.',
  },
  jumpers: {
    label: 'Jumpers & hoodies', perItem: 30.6,
    basis: 'Mean of acrylic jumper 28, recycled-polyester fleece 26, cotton sweat 31, wool jumper 56, recycled-cotton jumper 12.',
  },
  trousers: {
    label: 'Trousers & jeans', perItem: 25,
    basis: 'Cotton jeans 25, the study\'s trouser row.',
  },
  dresses: {
    label: 'Dresses', perItem: 54.3,
    basis: 'Mean of polyester 56, cotton 56, viscose 51.',
  },
  coats: {
    label: 'Coats & jackets', perItem: 51,
    basis: 'Mean of average coat 89, rain jacket 39, imitation-leather jacket 25.',
  },
  shoes: {
    label: 'Shoes (pairs)', perItem: 18,
    basis: 'Mean of leather 15, fabric 19, sport 20.',
  },
};

// ---------------------------------------------------------------------------
// Hotel nights: the other half of the optional detail. Per occupied room-night
// by country, UK Government (DESNZ / DEFRA) GHG Conversion Factors 2025, "Hotel
// stay" tab. The figures come from the Greenview Hotel Footprinting Tool, built
// on the Cornell Hotel Sustainability Benchmarking Index, so a night is priced
// at the country average rather than the specific hotel: an estimate, labelled.
// Country keys match the ISO codes used in AIRPORTS. Both the guided audit
// and the worked example price each trip's nights at the destination-country
// figure; nights logged without a flight use the Australian figure. `default`
// covers a country not carried here.
// Research notes: docs/footprint-research/factor-sources.md.
// ---------------------------------------------------------------------------
export const HOTEL_SOURCE = {
  name: 'UK Government (DESNZ / DEFRA) GHG Conversion Factors 2026, hotel stay',
  detail: 'kg CO2e per occupied room-night by country, from the "Hotel stay" tab (Greenview Hotel Footprinting Tool, built on the Cornell Hotel Sustainability Benchmarking Index). The 2026 table is identical to 2025 row for row, so only the edition cited moves. An estimate priced at the country average, not the specific hotel; nights are priced at the destination country of the trip they belong to, with the home country\'s figure for stays logged without a flight. Sixteen countries appear as rows with no factor published against them, New Zealand among them, so those still fall back to the default; New Zealand is the exception, now priced from its own national catalogue instead.',
  url: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026',
};

// Per occupied room-night, kg CO2e. `default` is the Australian figure,
// applied when a country is not carried here. Sixteen DEFRA rows (Taiwan and
// New Zealand among them) exist but carry no factor, so they are not
// available to read; New Zealand is priced from the MfE catalogue instead,
// which lands 4.2 times below the Australian default the tool used before.
// Nights logged with no flight attached price at the home country's own row.
export const HOTEL = {
  default: 35,
  countries: {
    AU: { label: 'Australia', perNight: 35 },
    // The one row not from the DEFRA table: DEFRA lists New Zealand but
    // publishes no factor against it, and the MfE catalogue does. At 8.34 it
    // lands 4.2 times below the Australian default a NZ stay used to price at.
    NZ: { label: 'New Zealand', perNight: 8.33691, source: 'mfe' },
    JP: { label: 'Japan', perNight: 39 },
    KR: { label: 'South Korea', perNight: 55.8 },
    SG: { label: 'Singapore', perNight: 24.5 },
    PH: { label: 'Philippines', perNight: 54.3 },
    ID: { label: 'Indonesia', perNight: 62.7 },
    TH: { label: 'Thailand', perNight: 43.4 },
    VN: { label: 'Vietnam', perNight: 38.5 },
    MY: { label: 'Malaysia', perNight: 61.5 },
    HK: { label: 'Hong Kong', perNight: 51.5 },
    CN: { label: 'China', perNight: 53.5 },
    IN: { label: 'India', perNight: 58.9 },
    AE: { label: 'United Arab Emirates', perNight: 63.8 },
    QA: { label: 'Qatar', perNight: 86.2 },
    US: { label: 'United States', perNight: 16.1 },
    CA: { label: 'Canada', perNight: 7.4 },
    GB: { label: 'United Kingdom', perNight: 10.4 },
    FR: { label: 'France', perNight: 6.7 },
    NL: { label: 'Netherlands', perNight: 14.8 },
    DE: { label: 'Germany', perNight: 13.2 },
    IT: { label: 'Italy', perNight: 14.3 },
  },
};

export const hotelPerNight = (country) => {
  const c = HOTEL.countries[country];
  return c ? c.perNight : HOTEL.default;
};

// ---------------------------------------------------------------------------
// Home embodied carbon (optional). The upfront (A1-A5) carbon locked into a
// home when it is built: manufacture and transport of materials plus
// construction. Counted only for a home you built or bought new, on the
// demand-side view that a new purchase is what pulled that construction into
// existence. Buying an existing home caused no new build and carries nothing
// here, so buying existing reads as the lower-carbon choice it is.
//
// The one-off pulse is turned into an annual line by straight-line
// amortisation over a 50-year building life (the design life the GBCA and NCC
// treat as a residential minimum), then split per adult like the energy bills.
// Per-m2 intensities are indicative: residential upfront carbon spans a wide
// range in the literature, so treat this as a screening estimate, not a
// measured figure. kg CO2-e per m2 of gross floor area, A1-A5.
// ---------------------------------------------------------------------------
export const HOME_SOURCE = {
  name: 'Indicative residential upfront embodied carbon (A1-A5), amortised over a 50-year life',
  detail: 'Detached-house intensity from Illankoon et al. 2023 (Buildings 13(10):2559), three Class 1a case-study homes at 193-233 kg CO2-e/m2 A1-A5; apartment intensity set higher for the concrete structure, basement and shared cores, anchored on GBCA and thinkstep-anz 2021 (Embodied Carbon and Embodied Energy in Australia\'s Buildings). Both are indicative screening figures across a wide literature range, amortised straight-line over 50 years and split per adult. Counted only for a home built or bought new.',
  url: 'https://www.mdpi.com/2075-5309/13/10/2559',
};

// Amortisation life in years, and the per-m2 upfront (A1-A5) intensity by
// dwelling type. Keys match the onboarding dwelling chips (house / apartment).
export const HOME = {
  amortiseYears: 50,
  types: {
    house: { label: 'House (detached)', perM2: 210 },
    apartment: { label: 'Apartment / unit', perM2: 500 },
  },
};

export const dwellingPerM2 = (dwelling) =>
  (HOME.types[dwelling] || HOME.types.house).perM2;

// ---------------------------------------------------------------------------
// Data quality tiers and the uncertainty band each carries. The central
// estimate never moves; the tiers only set the width of the range shown
// around the total. Band percentages are stated assumptions of this method
// (the framework is published, the exact widths are editorial), applied to
// each entry and summed without correlation credit: the conservative worst case
// each way, screening-grade and labelled as such.
// ---------------------------------------------------------------------------
export const QUALITY_SOURCE = {
  name: 'GHG Protocol, Quantitative Inventory Uncertainty guidance; IPCC 2006 Guidelines Vol 1 Ch 3',
  detail: 'Tier framework per the published guidance (measured data carries materially less uncertainty than proxies or extrapolation). The band widths themselves are assumptions stated by this method: they size the range, never the central estimate.',
  url: 'https://ghgprotocol.org/sites/default/files/2023-03/ghg-uncertainty.pdf',
};

export const QUALITY_TIERS = {
  metered: {
    label: 'Metered or billed',
    band: 0.05,
    plain: 'Meter reads, bill quantities, actual itineraries.',
  },
  forecast: {
    label: 'Forecast',
    band: 0.15,
    plain: 'A metered daily average extended over an unbilled period.',
  },
  estimated: {
    label: 'Estimated',
    band: 0.30,
    plain: 'Spend conversions, counts from memory, survey answers.',
  },
};

// Default tier per category when an entry does not say otherwise. Flights
// come from itineraries and bills from meters; most of the rest arrives as
// an estimate until a real quantity replaces it.
export const DEFAULT_QUALITY = {
  electricity: 'metered', gas: 'metered', flight: 'metered', other: 'metered',
  road: 'estimated', freight: 'estimated', diet: 'estimated',
  // Spend-based goods and hotel nights are always screening estimates.
  goods: 'estimated', hotel: 'estimated',
  // Home embodied carbon is an indicative per-m2 estimate across a wide range.
  dwelling: 'estimated',
};

export const qualityOf = (entry) =>
  QUALITY_TIERS[entry.quality] ? entry.quality : (DEFAULT_QUALITY[entry.category] || 'estimated');

// ---------------------------------------------------------------------------
// Other fuels occasionally logged at home. kg CO2-e per unit shown.
// ---------------------------------------------------------------------------
export const OTHER_SOURCE = {
  name: 'DCCEEW, Australian National Greenhouse Accounts Factors 2025',
  detail: 'LPG per litre (scope 1 plus scope 3); firewood treated as biogenic CO2 with non-CO2 gases only, per NGA treatment.',
  url: 'https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors-2025',
};

export const OTHER_FUELS = {
  lpg: { label: 'LPG (bottled)', unit: 'L', s1: 1.55, s3: 0.10 },
  firewood: { label: 'Firewood (non-CO2 only)', unit: 'kg', s1: 0.03, s3: 0 },
};
