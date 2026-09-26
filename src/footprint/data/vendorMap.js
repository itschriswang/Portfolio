// Vendor-to-category rules for the bank CSV import.
//
// The design principle is the same as organisational scope 3 screening:
// spend data is a screening tool, not a measurement. Dollars convert to
// activity only where the conversion is roughly sound (fuel dollars to
// litres, fares to kilometres, orders to parcels). Where it would be junk
// (flights, energy retailers), the import surfaces a checklist and asks for
// the real itinerary or the real bill instead. Groceries and dining never
// convert: diet is priced from the diet entry, and counting the same meals
// twice would flatter nobody.

export const CONVERSIONS = {
  petrolPerLitre: { value: 1.90, label: 'average unleaded price, $/L (ACCC petrol monitoring, indicative)' },
  ridesharePerKm: { value: 2.10, label: 'average rideshare fare, $/km (indicative)' },
  ptPerKm: { value: 0.25, label: 'average Opal/myki fare, $/km (indicative)' },
};

export const VENDOR_RULES = [
  {
    group: 'fuel',
    label: 'Petrol stations',
    how: 'Dollars to litres at the average pump price, then the NGA petrol factors.',
    pattern: /\b(bp|shell|ampol|caltex|7.?eleven|united petro|metro petro|mobil|liberty oil|otr|puma energy|astron|speedway|reddy express)\b/i,
  },
  {
    group: 'rideshare',
    label: 'Rideshare and taxis',
    how: 'Dollars to kilometres at an average fare, then a petrol-car per-km factor.',
    pattern: /\buber(?!\s*eats)\b|\bdidi\b|\bola\b|13cabs|silver service|gocatch|shebah|kakao ?t|kakao mobility|\bgrab\b|\bbolt\b/i,
  },
  {
    group: 'pt',
    label: 'Public transport',
    how: 'Dollars to kilometres at an average fare, then an indicative rail factor.',
    pattern: /\bopal\b|transport ?for ?nsw|tfnsw|\bmyki\b|\bptv\b|translink|adelaide metro|transperth|metro tas|\bsuica\b|\bpasmo\b|ez.?link|\boyster\b/i,
  },
  {
    group: 'parcels',
    label: 'Online orders (parcel deliveries)',
    how: 'Each purchase counted as one parcel at the indicative per-parcel factor. Overseas marketplaces flagged separately: air express freight is its own line.',
    pattern: /\bamazon(?!\s*prime)\b|\bebay\b|\btemu\b|\bshein\b|aliexpress|\btaobao\b|the iconic|\basos\b|\bkogan\b|catch\.com|\bwish\b|\bmyer\b|david jones online/i,
    intlPattern: /aliexpress|\btaobao\b|\btemu\b|\bshein\b|\bwish\b/i,
  },
  {
    group: 'airline',
    label: 'Airlines',
    how: 'Never spend-converted. Each charge appears in a checklist so you can log the actual route: distance-based beats dollars by a mile, literally.',
    pattern: /qantas|jetstar|virgin a|\brex\b|bonza|scoot|airasia|cebu pacific|air ?nz|air new zealand|singapore ?air|emirates|qatar air|cathay|\bana\b|japan air|\bjal\b|korean air|asiana|t.?way|jin ?air|jeju air|vietjet|batik|garuda|zipair|peach aviation|fiji air|latam|delta air|united air|american air/i,
  },
  {
    group: 'energy',
    label: 'Energy retailers',
    how: 'Never spend-converted: tariffs and supply charges make dollars a poor proxy. The checklist asks for the kWh and MJ off the bill instead.',
    pattern: /\bagl\b|origin energy|energyaustralia|red energy|alinta|momentum energy|\bovo\b|amber electric|powershop|globird|simply energy|tango energy|dodo power|engie/i,
  },
  {
    group: 'dining',
    label: 'Groceries and dining',
    how: 'Counted for a diet sanity check only, never converted. Diet is priced from your diet entry; pricing the same meals twice would be double counting.',
    pattern: /woolworths|coles\b|\baldi\b|\biga\b|harris farm|uber eats|menulog|doordash|deliveroo|hungrypanda|mcdonald|\bkfc\b|hungry jack|domino|guzman|grill.?d|sushi|restaurant|cafe|kitchen|bakery|espresso|dumpling|noodle|ramen|thai\b|pizzeria|bistro/i,
  },
];
