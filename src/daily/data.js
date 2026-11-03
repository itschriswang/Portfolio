// Sustainability Daily: all editorial copy and both puzzle pools live here,
// never inline in the components. Australian English, Chris's voice: plain,
// direct, a little dry, honest about uncertainty. No em dashes. Titles never
// end in a full stop.
//
// CONSISTENCY RULE (binding). Wherever an item also exists in the site's own
// Life Footprint model, its number is DERIVED from the same factor tables the
// footprint engine prices from, so a factor refresh moves this page with it.
// Nothing here is hand-typed where the model already holds the figure. Items
// beyond the model carry a published external source and are flagged an
// estimate in the reveal.

import {
  FLIGHT_FACTORS, FLIGHT_DISTANCE_UPLIFT, FLIGHT_ROUTES, FLIGHT_SOURCE,
  ROAD_FUELS, ROAD_SOURCE,
  DIET_TYPES, DIET_SOURCE, FOOD_PER_KG,
  CLOTHING_ITEMS, CLOTHING_ITEMS_SOURCE,
  HOTEL, HOTEL_SOURCE,
  FREIGHT_MODES, FREIGHT_SOURCE,
  OTHER_FUELS, OTHER_SOURCE,
} from '../footprint/data/factors';
import { EQUIVALENCES, EQUIV_SOURCE, equivalenceById } from '../footprint/data/equivalences';

// ---------------------------------------------------------------------------
// Derivation helpers. Every figure a footprint factor can price is priced from
// the factor, at module load, so the two pages can never drift.
// ---------------------------------------------------------------------------

// A return economy flight on one of the model's routes, priced exactly as the
// footprint engine prices it: great-circle distance uplifted 8% (the DEFRA
// method), doubled for the return leg, at the band's economy factor with
// radiative forcing included.
function flightReturnKg(routeId) {
  const r = FLIGHT_ROUTES.find((x) => x.id === routeId);
  if (!r) return 0;
  return r.km * FLIGHT_DISTANCE_UPLIFT * 2 * FLIGHT_FACTORS[r.band].withRF.economy;
}

// One kilometre in the default petrol car, fuel cycle included (the same
// derivation the footprint equivalences table uses).
const PETROL_PER_KM =
  ((ROAD_FUELS.petrol.s1_per_L + ROAD_FUELS.petrol.s3_per_L) * ROAD_FUELS.petrol.defaultL100km) / 100;

// A per-kg food factor from the model's reference table (Poore & Nemecek 2018).
const foodPerKg = (name) => (FOOD_PER_KG.rows.find(([n]) => n === name) || [null, 0])[1];

// A diet year, from the model's per-day gradient.
const dietYearKg = (kind) => DIET_TYPES[kind].perDay * 365;

// Everyday electric trickles the model already prices per event.
const showerKg = equivalenceById('shower').kg;   // 0.57 kg, gas-heated 8 min
const dryerKg = equivalenceById('dryer').kg;      // 1.68 kg, one vented load
const phoneKg = equivalenceById('phone').kg;      // 0.008 kg, one full charge
const burgerKg = equivalenceById('burger').kg;    // 3.8 kg, quarter-pounder
const coffeeKg = equivalenceById('coffee').kg;    // 0.4 kg, dairy flat white

// A litre of bottled LPG, scope 1 plus scope 3, from the model's other-fuels
// table.
const lpgLitreKg = OTHER_FUELS.lpg.s1 + OTHER_FUELS.lpg.s3;

// ---------------------------------------------------------------------------
// External sources: for items the footprint model does not carry. Every item
// that uses one is flagged an estimate in its reveal. The streaming and pet-diet
// figures are read from the primary documents themselves, accessed 13 August
// 2026; the rest stand on a web-search verification of 22 July 2026.
// ---------------------------------------------------------------------------
const SRC = {
  carbonTrustStreaming: {
    name: 'Carbon Trust, Carbon impact of video streaming, white paper, June 2021 (accessed 13 August 2026)',
    url: 'https://www.carbontrust.com/news-and-insights/news/updated-calculation-released-on-the-carbon-impact-of-online-video-streaming',
  },
  petDiets: {
    name: 'Pedrinelli et al. 2022, Environmental impact of diets for dogs and cats, Scientific Reports 12:18510 (accessed 13 August 2026)',
    url: 'https://www.nature.com/articles/s41598-022-22631-0',
  },
  poore: {
    name: 'Poore & Nemecek 2018 (Science), via Our World in Data',
    url: 'https://ourworldindata.org/environmental-impacts-of-food',
  },
};

// Reuse the footprint model's own source objects where the number is the
// model's, so the citation on the card matches the citation on the method page.
const SITE = {
  flight: { name: FLIGHT_SOURCE.name, url: FLIGHT_SOURCE.url },
  road: { name: ROAD_SOURCE.name, url: ROAD_SOURCE.url },
  diet: { name: DIET_SOURCE.name, url: DIET_SOURCE.url },
  clothing: { name: CLOTHING_ITEMS_SOURCE.name, url: CLOTHING_ITEMS_SOURCE.url },
  hotel: { name: HOTEL_SOURCE.name, url: HOTEL_SOURCE.url },
  freight: { name: FREIGHT_SOURCE.name, url: FREIGHT_SOURCE.url },
  other: { name: OTHER_SOURCE.name, url: OTHER_SOURCE.url },
  food: { name: FOOD_PER_KG.source, url: 'https://ourworldindata.org/environmental-impacts-of-food' },
  equiv: { name: EQUIV_SOURCE.name, url: EQUIV_SOURCE.url },
};

// ===========================================================================
// GAME 1 POOL: Guess the Footprint
//
// Each entry: kg CO2-e (the answer), a stated unit assumption, whether the
// number is derived from the site's own model or from an external source, the
// source, and a one or two sentence reveal note in Chris's voice explaining
// what drives the number. `estimate: true` marks the low-confidence items.
//
// ORDER IS FROZEN. The daily puzzle is pool[dayIndex % pool.length], so
// reordering these would silently change which puzzle every past day shows.
// Never reorder. Append new items to the END only. This is a deliberate,
// fixed shuffle rather than a topic-sorted list.
// ===========================================================================
export const GUESS_POOL = [
  {
    id: 'flight-bali', item: 'A return flight to Bali', short: 'Sydney to Bali return',
    kg: flightReturnKg('SYD-DPS'), unit: 'One seat, economy, Sydney to Denpasar and back',
    source: SITE.flight, estimate: false,
    note: 'One long-haul return in economy runs to well over a tonne per seat. Distance and radiative forcing do the damage: a single holiday burns close to half the 2.5 t a person 1.5°C lifestyle benchmark the footprint calculator uses.',
  },
  {
    id: 'burger', item: 'A beef cheeseburger', short: 'One beef burger',
    kg: burgerKg, unit: 'A quarter-pounder, 113 g of beef',
    source: SITE.equiv, estimate: false,
    note: 'Almost all of it is the patty. Beef carries the dairy-herd mean here, and even that reads conservative: a dedicated beef herd would nearly triple the number. The bun and salad barely register.',
  },
  {
    id: 'netflix-year', item: 'A year of Netflix', short: 'A year of streaming',
    kg: 0.055 * 2 * 365, unit: 'About two hours a day for a year, device included, European average grid',
    source: SRC.carbonTrustStreaming, estimate: true,
    note: 'Streaming is a famous over-estimate. At the Carbon Trust figure of about 55 g an hour, two hours a night for a year lands near 40 kg. The screen is 46% of that hour and your home router another 38%, while the data centre is under 1%, so your TV does far more of the work than the data centre does. Smaller than one cheeseburger a week.',
  },
  {
    id: 'dog-year', item: "A year of feeding a dog", short: 'A dog year, dry food',
    kg: 828, unit: 'A 10 kg dog on a dry diet for a year, 534 kcal a day',
    source: SRC.petDiets, estimate: true,
    note: 'Pet food is mostly meat, so it lands heavier than people expect: 828 kg a year for a 10 kg dog on dry food, taken from the median of 316 Brazilian commercial dry diets in this study. Wet food is roughly eight times worse for the same calories, and a bigger dog eats more, so a Labrador sits well above this.',
  },
  {
    id: 'tee', item: 'A new cotton tee or shirt', short: 'A new top',
    kg: CLOTHING_ITEMS.tops.perItem, unit: 'One new garment, cradle to grave, tops bucket average',
    source: SITE.clothing, estimate: false,
    note: 'A single new top is about ten kilos once you count fibre, spinning, dyeing and a life of washing. The washing is folded in here, which double counts a sliver of home power, so the line reads a touch conservative, and the seam is stated here.',
  },
  {
    id: 'shower-year', item: 'A daily hot shower for a year', short: 'Hot shower, every day, a year',
    kg: showerKg * 365, unit: 'An eight-minute gas-heated shower a day for 365 days',
    source: SITE.equiv, estimate: false,
    note: 'One shower is small, about 570 grams on gas. Do it every day for a year and it stacks to roughly 200 kg. The lesson of the whole game in one item: frequency is what builds a footprint.',
  },
  {
    id: 'flight-london', item: 'A return flight to London', short: 'Sydney to London return',
    kg: flightReturnKg('SYD-LHR'), unit: 'One seat, economy, Sydney to London and back',
    source: SITE.flight, estimate: false,
    note: 'The big one. A Kangaroo-route return in economy is over four tonnes per seat, more than an average Australian diet for a whole year. Fly it in business and the factor triples again.',
  },
  {
    id: 'diet-highmeat', item: 'A year of eating a high-meat diet', short: 'High-meat diet, one year',
    kg: dietYearKg('highMeat'), unit: 'Over 100 g of meat a day, standardised to 2,000 kcal',
    source: SITE.diet, estimate: true,
    note: 'A heavy-meat year of food is around 2.6 tonnes, and meat and dairy are nearly all of it. Diet carries a wide range, so treat this as the right order of magnitude. The vegan version of the same year is about a tonne.',
  },
  {
    id: 'cheese-kg', item: 'A kilo of cheese', short: '1 kg of cheese',
    kg: foodPerKg('Cheese'), unit: 'One kilogram, at the global production mean',
    source: SITE.food, estimate: false,
    note: 'Cheese is dairy concentrated: it takes about ten litres of milk to make a kilo, so it lands near 24 kg. Heavier per kilo than chicken or pork, and not far off farmed prawns.',
  },
  {
    id: 'flight-mel', item: 'A return flight Sydney to Melbourne', short: 'Sydney to Melbourne return',
    kg: flightReturnKg('SYD-MEL'), unit: 'One seat, economy, 706 km each way',
    source: SITE.flight, estimate: false,
    note: 'The most-flown route in the country. A single economy return is about 350 kg per seat with the high-altitude warming effect counted, which is why a weekly commuter flight adds up frighteningly fast.',
  },
  {
    id: 'parcel', item: 'A home-delivered parcel', short: 'One delivered parcel',
    kg: FREIGHT_MODES.parcel.perParcel, unit: 'One typical courier parcel, last-mile delivery',
    source: SITE.freight, estimate: true,
    note: 'The van drop itself is small, well under a kilo of order-of-magnitude, because it is shared across a whole route. What is inside the box is almost always the bigger number. Air freight, if the item flew, changes the story entirely.',
  },
  {
    id: 'drive-10k', item: 'A year of average driving', short: '10,000 km in a petrol car',
    kg: PETROL_PER_KM * 10000, unit: '10,000 km in the default 7.0 L/100km petrol car',
    source: SITE.road, estimate: false,
    note: 'Ten thousand kilometres, a fairly light year of driving, is around two tonnes with the fuel cycle counted. Roughly one Bali return per five thousand kilometres, which is a useful way to feel the size of a flight.',
  },
  {
    id: 'coffee', item: 'A cafe flat white', short: 'One flat white',
    kg: coffeeKg, unit: 'About 18 g of beans and 150 ml of dairy milk',
    source: SITE.equiv, estimate: false,
    note: 'The milk is most of it. Order the same cup black and it drops by well over half. A small number that a daily habit turns into a real one.',
  },
  {
    id: 'jeans', item: 'A new pair of jeans', short: 'New jeans',
    kg: CLOTHING_ITEMS.trousers.perItem, unit: 'One new pair of cotton jeans, cradle to grave',
    source: SITE.clothing, estimate: false,
    note: 'Cotton is thirsty and denim is heavy, so a new pair is about 25 kg over its life. Wearing the pair you own twice as long halves that number more effectively than any label ever will.',
  },
  {
    id: 'diet-vegan', item: 'A year of eating vegan', short: 'Vegan diet, one year',
    kg: dietYearKg('vegan'), unit: 'A fully plant-based year, standardised to 2,000 kcal',
    source: SITE.diet, estimate: true,
    note: 'About a tonne of food for the year, and the floor for a normal diet: even a vegan still eats. It is roughly a third less than a high-meat year. Diet ranges are wide, so read the gap.',
  },
  {
    id: 'hotel-au', item: 'A night in an Australian hotel', short: 'One hotel night, Australia',
    kg: HOTEL.countries.AU.perNight, unit: 'One occupied room-night, country average',
    source: SITE.hotel, estimate: true,
    note: 'A room-night in Australia averages about 35 kg, priced at the country average. Warmer, more air-conditioned countries run much higher: an Indonesian night is nearly double.',
  },
  {
    id: 'flight-la', item: 'A return flight to Los Angeles', short: 'Sydney to LA return',
    kg: flightReturnKg('SYD-LAX'), unit: 'One seat, economy, Sydney to Los Angeles and back',
    source: SITE.flight, estimate: false,
    note: 'A trans-Pacific return is about three tonnes per seat in economy, most of an average person\'s entire annual budget for staying under two degrees. Long-haul is where the aviation numbers stop being small.',
  },
  {
    id: 'beef-kg', item: 'A kilo of beef', short: '1 kg of beef',
    kg: foodPerKg('Beef (beef herd)'), unit: 'One kilogram, dedicated beef herd',
    source: SITE.food, estimate: false,
    note: 'The single heaviest common food by a distance, about 100 kg a kilo from a dedicated beef herd. Land clearing and cattle burping methane drive it. Nothing else on a normal plate is close.',
  },
  {
    id: 'jumper', item: 'A new jumper or hoodie', short: 'New jumper',
    kg: CLOTHING_ITEMS.jumpers.perItem, unit: 'One new garment, cradle to grave, jumpers bucket average',
    source: SITE.clothing, estimate: false,
    note: 'About 30 kg on average, though the fibre swings it wildly: a recycled-cotton sweat is a fraction of a new wool jumper. These per-item figures sit at the top of the published range, on purpose.',
  },
  {
    id: 'phone-year', item: 'Charging your phone for a year', short: 'A year of phone charges',
    kg: phoneKg * 365, unit: 'One full 12 Wh charge a day for 365 days, NSW grid',
    source: SITE.equiv, estimate: false,
    note: 'A whole year of nightly charging is about three kilos, less than one cheeseburger. Making the phone dwarfs charging it many times over, which is the real lesson: keep the handset, do not sweat the charger.',
  },
  {
    id: 'flight-perth', item: 'A return flight to Perth', short: 'Sydney to Perth return',
    kg: flightReturnKg('SYD-PER'), unit: 'One seat, economy, Sydney to Perth and back',
    source: SITE.flight, estimate: false,
    note: 'Domestic, but the longest domestic hop there is: about 1.6 tonnes per seat return. Distance drives this far more than the domestic or international label does, so a coast-to-coast hop beats plenty of short international trips.',
  },
  {
    id: 'rice-kg', item: 'A kilo of rice', short: '1 kg of rice',
    kg: foodPerKg('Rice'), unit: 'One kilogram, at the global production mean',
    source: SITE.food, estimate: false,
    note: 'Higher than most grains, about 4.5 kg a kilo, because flooded paddies breathe out methane. Still a small fraction of any meat, and the staple that feeds half the planet.',
  },
  {
    id: 'lamb-kg', item: 'A kilo of lamb', short: '1 kg of lamb',
    kg: foodPerKg('Lamb'), unit: 'One kilogram, at the global production mean',
    source: SITE.food, estimate: false,
    note: 'Second only to beef, around 40 kg a kilo. Sheep are ruminants too, so the methane story repeats. A Sunday roast is a bigger climate decision than a week of showers.',
  },
  {
    id: 'shoes', item: 'A new pair of shoes', short: 'New shoes',
    kg: CLOTHING_ITEMS.shoes.perItem, unit: 'One new pair, cradle to grave, shoes bucket average',
    source: SITE.clothing, estimate: false,
    note: 'About 18 kg a pair, averaged across leather, fabric and sports styles. Lots of small glued components, each with its own supply chain, which is why footwear is stubbornly hard to make clean.',
  },
  {
    id: 'hotel-bali-week', item: 'A week in a Bali hotel', short: 'Seven hotel nights, Bali',
    kg: HOTEL.countries.ID.perNight * 7, unit: 'Seven occupied room-nights at the Indonesia average',
    source: SITE.hotel, estimate: true,
    note: 'Seven nights in Indonesia is about 440 kg on the room alone, before you count the flight that got you there. Hot climates and heavy air-conditioning make tropical room-nights some of the highest going.',
  },
  {
    id: 'beer', item: 'A pint of beer', short: 'One beer',
    kg: 0.5, unit: 'A pint, roughly 570 ml, in glass; a packaging-dependent estimate',
    source: SRC.poore, estimate: true,
    note: 'Around half a kilo, and most of that is the packaging and refrigeration. Published figures range widely with the packaging: the same beer in a returnable keg is several times lighter than in single-use glass, so the container moves this more than the brew does.',
  },
  {
    id: 'dryer-load', item: 'One tumble-dryer load', short: 'A dryer load',
    kg: dryerKg, unit: 'One 2.5 kWh vented tumble-dryer cycle, NSW grid',
    source: SITE.equiv, estimate: false,
    note: 'About 1.7 kg a load on the current grid. The line on the airer costs nothing, which is the rare case where the low-carbon option is also the free and slightly annoying one.',
  },
  {
    id: 'flight-auckland', item: 'A return flight to Auckland', short: 'Sydney to Auckland return',
    kg: flightReturnKg('SYD-AKL'), unit: 'One seat, economy, Sydney to Auckland and back',
    source: SITE.flight, estimate: false,
    note: 'The shortest international hop from Sydney, and still close to 600 kg per seat return. There is no such thing as a small international flight once you cross the water.',
  },
  {
    id: 'eggs', item: 'A dozen eggs', short: 'Twelve eggs',
    kg: foodPerKg('Eggs') * 0.72, unit: 'Twelve eggs, about 720 g, at the production mean',
    source: SITE.food, estimate: false,
    note: 'Around 3.4 kg a dozen. Among the lightest animal proteins going, a fraction of red meat per gram, which is why eggs are the quiet workhorse of a lower-carbon plate.',
  },
  {
    id: 'diet-vegetarian', item: 'A year of eating vegetarian', short: 'Vegetarian diet, one year',
    kg: dietYearKg('vegetarian'), unit: 'Dairy and eggs, no meat, standardised to 2,000 kcal',
    source: SITE.diet, estimate: true,
    note: 'About 1.4 tonnes for the year, closer to vegan than to high-meat: dropping the meat does most of the work, and the remaining dairy is what separates it from a fully plant-based year.',
  },
  {
    id: 'coat', item: 'A new winter coat', short: 'New coat',
    kg: CLOTHING_ITEMS.coats.perItem, unit: 'One new garment, cradle to grave, coats bucket average',
    source: SITE.clothing, estimate: false,
    note: 'The heaviest thing in most wardrobes at about 50 kg, driven by the sheer mass of material. A coat you keep for a decade is one of the easiest good decisions in fashion.',
  },
  {
    id: 'tofu-block', item: 'A block of tofu', short: 'One block of tofu',
    kg: foodPerKg('Tofu') * 0.4, unit: 'A 400 g block, at the production mean',
    source: SITE.food, estimate: false,
    note: 'About 1.3 kg a block. Soy grown to feed people directly is efficient; the soy problem is the vast majority grown to feed livestock instead. Eaten as tofu, it is one of the lowest-impact proteins there is.',
  },
  {
    id: 'lpg-litre', item: 'A litre of BBQ gas', short: 'One litre of LPG',
    kg: lpgLitreKg, unit: 'One litre of bottled LPG burned, scope 1 plus scope 3',
    source: SITE.other, estimate: false,
    note: 'About 1.65 kg a litre. A 9 kg patio bottle holds roughly 17 litres, so a full swap-and-go bottle is around 28 kg once it is all burned. Fossil gas, small but not nothing.',
  },
];

// ===========================================================================
// GAME 2 POOL: Greenwash or Not
//
// Real-ish marketing claims, one a day, called legitimate or greenwash. Every
// claim is a GENERIC COMPOSITE ("a fashion label says...", "an airline's site
// reads..."): no invented claim is ever attributed to a real named company.
// The reasoning states the actual rule being exploited, grounded in the ACCC's
// eight principles (reused verbatim from the Cost Per Wear claim-check research
// in src/fashion/data.js), the Australian Consumer Law, and ASIC for financial
// claims. `verdict` is 'greenwash' or 'legit'. A legitimate claim is specific,
// substantiated and qualified.
//
// ORDER IS FROZEN, same rule as the guess pool. Append only; never reorder.
// ===========================================================================

// Shared rule sources, cited on the reveal so a player can check the rule.
export const RULE = {
  accc: {
    name: 'ACCC, Making environmental claims: a guide for business (the eight principles)',
    url: 'https://www.accc.gov.au/media-release/accc-releases-eight-principles-to-guide-businesses%E2%80%99-environmental-claims',
  },
  acl: {
    name: 'Australian Consumer Law, s18 (misleading or deceptive conduct) and s29 (false or misleading representations)',
    url: 'https://www.accc.gov.au/business/selling-products-and-services/advertising-and-promotions/making-environmental-claims',
  },
  asic: {
    name: 'ASIC, How to avoid greenwashing when offering or promoting sustainability-related products',
    url: 'https://www.asic.gov.au/regulatory-resources/financial-services/how-to-avoid-greenwashing-when-offering-or-promoting-sustainability-related-products/',
  },
};

// The eight ACCC principles, reused verbatim from the Cost Per Wear research so
// the two tools apply the same standard. Rendered in the method section.
export const ACCC_PRINCIPLES = [
  'Make accurate and truthful claims',
  'Have evidence to back up your claims',
  'Do not leave out or hide important information',
  'Explain any conditions or qualifications',
  'Avoid broad and unqualified claims',
  'Use clear and easy-to-understand language',
  'Visuals and imagery should not mislead',
  'Be transparent about your sustainability transition',
];

export const CLAIM_POOL = [
  {
    id: 'carbon-neutral-2050', speaker: 'An oil company advert says',
    claim: 'Committed to being carbon neutral by 2050*',
    verdict: 'greenwash', principle: 'Be transparent about your sustainability transition',
    rule: RULE.accc,
    reasoning: 'A target three decades out with an asterisk and no interim milestone is aspiration. The ACCC asks for the near-term steps and the current trajectory, and a headline date supplies neither, least of all one the people making the promise will never be held to. The asterisk is usually where the offsets and the exclusions live.',
  },
  {
    id: 'recycled-fibres', speaker: 'A fast-fashion label tags a dress',
    claim: 'Made with recycled fibres',
    verdict: 'greenwash', principle: 'Avoid broad and unqualified claims',
    rule: RULE.accc,
    reasoning: 'How much, of which component, certified by whom? "Made with" can mean two per cent. A claim with no percentage and no standard is the textbook unqualified claim the ACCC warns against, and the Federal Court has already pinged an Australian brand for exactly this shape of recycled-content wording.',
  },
  {
    id: 'gots-41pc', speaker: 'A denim brand states',
    claim: 'Cut from GOTS-certified organic cotton, using 41% less irrigation than our 2020 baseline',
    verdict: 'legit', principle: 'Have evidence to back up your claims',
    rule: RULE.accc,
    reasoning: 'This is what a claim that survives scrutiny looks like: a named certification you can check, a specific number, and a stated baseline year to measure it against. Specific, substantiated and qualified. Nothing here is doing unpaid work.',
  },
  {
    id: '100pc-sustainable-packaging', speaker: 'A skincare brand prints',
    claim: '100% sustainable packaging',
    verdict: 'greenwash', principle: 'Use clear and easy-to-understand language',
    rule: RULE.accc,
    reasoning: 'Two problems in three words. "Sustainable" has no fixed meaning, so it fails the clear-language test, and "100%" is an absolute that fails on the first exception. Sustaining what, measured how? Recyclable is not the same as recycled, and neither is stated.',
  },
  {
    id: 'offset-flight', speaker: "An airline's booking page reads",
    claim: 'This flight is carbon neutral, offset through our verified tree-planting program',
    verdict: 'greenwash', principle: 'Do not leave out or hide important information',
    rule: RULE.accc,
    reasoning: 'The emissions still happened and were paid for after the fact. The ACCC expects offset-based neutrality to say so plainly, name the scheme and the vintage, and not bury the reduction that did not occur. Tree offsets carry their own additionality and permanence problems, and from late 2026 the EU bans this exact claim outright.',
  },
  {
    id: 'sustainable-super', speaker: 'A super fund brochure promises',
    claim: 'Our Sustainable option is fossil-fuel free',
    verdict: 'greenwash', principle: 'Have evidence to back up your claims',
    rule: RULE.asic,
    reasoning: 'This is the exact pattern ASIC has taken to the Federal Court and won on, more than once, with multi-million-dollar penalties. An unqualified "fossil-fuel free" that turns out to hold fossil exposure through pooled or indirect holdings is a false representation under the Corporations Act and the ACL. If there are screens, state precisely what they exclude.',
  },
  {
    id: 'b-corp', speaker: 'A homewares company notes',
    claim: 'Certified B Corporation since 2021',
    verdict: 'legit', principle: 'Make accurate and truthful claims',
    rule: RULE.accc,
    reasoning: 'B Corp is a real, independently audited certification of a whole company against a published standard, with a date you can verify on the register. It is a governance credential covering the management system, and it is specific, checkable and true. This is the substantiated end of the spectrum.',
  },
  {
    id: 'eco-friendly-range', speaker: 'A supermarket own-brand says',
    claim: 'Our new eco-friendly cleaning range',
    verdict: 'greenwash', principle: 'Avoid broad and unqualified claims',
    rule: RULE.accc,
    reasoning: 'Friendly compared with what? "Eco-friendly" is a flagged vague term with no fixed meaning: every product has a footprint, so the word tells you nothing without the measured impact beside it. From late 2026 the EU bans generic environmental claims like this one entirely.',
  },
  {
    id: 'up-to-50', speaker: 'A shoe brand advertises',
    claim: 'Made with up to 50% recycled ocean plastic',
    verdict: 'greenwash', principle: 'Do not leave out or hide important information',
    rule: RULE.accc,
    reasoning: '"Up to" includes zero. The ceiling is the number that gets printed and the typical figure is the number that gets hidden. State the actual average content, name the certification, and define "ocean plastic", because that term is notoriously elastic.',
  },
  {
    id: 'scope12-28pc', speaker: 'A manufacturer reports',
    claim: 'We cut our Scope 1 and 2 emissions 28% against a verified 2019 baseline, disclosed to the CDP',
    verdict: 'legit', principle: 'Have evidence to back up your claims',
    rule: RULE.accc,
    reasoning: 'Named scopes, a real percentage, a stated baseline year and third-party disclosure. It is careful to claim only Scopes 1 and 2, and says so, which is the kind of boundary honesty regulators reward. Substantiated and qualified.',
  },
  {
    id: 'climate-positive', speaker: 'A drinks start-up claims',
    claim: 'Every bottle is climate positive',
    verdict: 'greenwash', principle: 'Have evidence to back up your claims',
    rule: RULE.accc,
    reasoning: 'Beyond neutral is a bold accounting position that demands extraordinary evidence, and it almost never comes with the ledger. Absent a published, audited account showing net removals greater than emissions, "climate positive" is an absolute claim regulators expect struck out.',
  },
  {
    id: 'natural-ingredients', speaker: 'A cosmetics label reads',
    claim: 'Made with natural ingredients, kind to the planet',
    verdict: 'greenwash', principle: 'Use clear and easy-to-understand language',
    rule: RULE.accc,
    reasoning: 'Natural is not the same as low impact: crude oil and arsenic are natural. "Kind to the planet" is a feeling, and the planet has not been consulted. Two vague terms stacked together, neither carrying a measured number.',
  },
  {
    id: 'climate-active', speaker: 'A coffee roaster states',
    claim: 'Certified carbon neutral under Climate Active, offsets and boundary disclosed on our site',
    verdict: 'legit', principle: 'Explain any conditions or qualifications',
    rule: RULE.accc,
    reasoning: 'Climate Active is a real Commonwealth certification with a public register, and the claim points to a disclosed boundary and the offsets it relies on. It leans on offsetting, which the ACCC says you must disclose, and this one does. A named, verifiable certification with its conditions on the table is the qualified end of the spectrum.',
  },
  {
    id: 'plant-a-tree', speaker: 'An online store promises',
    claim: 'We plant a tree with every order',
    verdict: 'greenwash', principle: 'Have evidence to back up your claims',
    rule: RULE.accc,
    reasoning: 'A tree planted is not a tonne abated. Without the survival rate, the land tenure, and whether the planting is additional to what would have grown anyway, this is a marketing gesture dressed as a climate action. It also says nothing about the order\'s own footprint.',
  },
  {
    id: 'compostable-as5810', speaker: 'A mailer is printed with',
    claim: 'Home compostable, certified to AS 5810',
    verdict: 'legit', principle: 'Explain any conditions or qualifications',
    rule: RULE.accc,
    reasoning: 'It names the composting condition (home composting, the harder of the two) and the exact Australian standard it meets. That is precisely the qualification the ACCC asks for on a "compostable" claim, because a home compost heap and an industrial facility are completely different tests. Checkable and specific.',
  },
  {
    id: 'green-collection', speaker: 'A fashion retailer badges a rack',
    claim: 'Shop the Conscious Collection',
    verdict: 'greenwash', principle: 'Avoid broad and unqualified claims',
    rule: RULE.accc,
    reasoning: 'Consciousness is not a supply-chain attribute. A self-created label with a wholesome name and no defined criteria is exactly the kind of unqualified in-house eco-badge the EU rules will ban from late 2026, and that the ACCC already treats as a broad, unsubstantiated claim.',
  },
  {
    id: 'vegan-leather', speaker: 'An accessories brand markets',
    claim: 'Cruelty-free vegan leather, better for the earth',
    verdict: 'greenwash', principle: 'Do not leave out or hide important information',
    rule: RULE.accc,
    reasoning: 'Most "vegan leather" is polyurethane, which is plastic made from fossil fuels. "Vegan" answers an animal-welfare question and leaves the environmental one open, and "better for the earth" is left undefined and unmeasured. Leaving out that the material is plastic is the hidden information here.',
  },
  {
    id: 'renewable-powered', speaker: 'A brewery\'s site says',
    claim: 'Our brewery runs on 100% renewable electricity, GreenPower-accredited and contracted to 2028',
    verdict: 'legit', principle: 'Have evidence to back up your claims',
    rule: RULE.accc,
    reasoning: 'It states the share, names the accreditation scheme, and gives the contract period, so the claim is bounded and checkable. It is careful to say electricity, not "the whole brewery is renewable", which keeps it accurate. This is a qualified, evidenced claim.',
  },
  {
    id: 'ocean-bound-vague', speaker: 'A bottle label reads',
    claim: 'Made from ocean-bound plastic',
    verdict: 'greenwash', principle: 'Do not leave out or hide important information',
    rule: RULE.accc,
    reasoning: '"Ocean-bound" is a marketing term: definitions stretch to any plastic collected within tens of kilometres of a coast, which is most plastic on Earth. Without the certified share and a real definition, it implies a beach cleanup that may not have happened.',
  },
  {
    id: 'lowest-impact-denim', speaker: 'A jeans campaign claims',
    claim: 'The lowest-impact denim in Australia',
    verdict: 'greenwash', principle: 'Have evidence to back up your claims',
    rule: RULE.acl,
    reasoning: 'A superlative is a factual claim about every competitor, and it needs the comparative evidence to prove it. An unqualified "lowest" with no study, no boundary and no source is a false or misleading representation under s18 and s29 of the Australian Consumer Law.',
  },
  {
    id: 'ethical-factory', speaker: 'A brand\'s about page says',
    claim: 'Handmade in our ethical factory',
    verdict: 'greenwash', principle: 'Avoid broad and unqualified claims',
    rule: RULE.accc,
    reasoning: '"Ethical" against whose code, audited by whom, and when was the last audit? On its own the word is unverifiable and does the emotional work of a social-compliance program without any of the substance. Name the standard and the auditor or drop the word.',
  },
  {
    id: 'recyclable-no-stream', speaker: 'A pouch is marked',
    claim: 'Recyclable',
    verdict: 'greenwash', principle: 'Explain any conditions or qualifications',
    rule: RULE.accc,
    reasoning: 'Recyclable in which stream, in which country, and what share is actually recycled today? A soft-plastic pouch that is technically recyclable but that no kerbside bin will take is misleading by omission. Whether a facility exists that will really take it is the condition that matters.',
  },
  {
    id: '40pc-verified', speaker: 'An appliance maker states',
    claim: '40% lower lifetime emissions than our previous model, independently verified',
    verdict: 'legit', principle: 'Have evidence to back up your claims',
    rule: RULE.accc,
    reasoning: 'A specific figure, a clear comparison point (the previous model), a stated boundary (lifetime), and third-party verification. Comparative claims are legitimate when the basis is named and evidenced, which this one is. Substantiated and qualified.',
  },
  {
    id: 'net-zero-website', speaker: 'A retailer\'s banner announces',
    claim: 'We are a net zero company',
    verdict: 'greenwash', principle: 'Do not leave out or hide important information',
    rule: RULE.accc,
    reasoning: 'Net zero across which scopes, and how much of it is offsets versus real cuts? A blanket "net zero company" almost always excludes Scope 3, which is the overwhelming majority of a retailer\'s footprint, and leans heavily on offsets. The missing boundary is the hidden information.',
  },
  {
    id: 'less-plastic-no-baseline', speaker: 'A bottle boasts',
    claim: 'Now with 30% less plastic',
    verdict: 'greenwash', principle: 'Explain any conditions or qualifications',
    rule: RULE.accc,
    reasoning: 'Less than what, and when? A comparative with no baseline is unanchored: 30% less than a deliberately heavy old design still tells you nothing useful. State the reference point, or the number is just decoration.',
  },
  {
    id: 'responsible-wool', speaker: 'A knitwear tag reads',
    claim: 'Made with responsibly sourced wool, certified to the Responsible Wool Standard',
    verdict: 'legit', principle: 'Explain any conditions or qualifications',
    rule: RULE.accc,
    reasoning: 'It names an actual third-party standard with published criteria and an audit chain, which is what pins "responsible" down. RWS covers animal welfare and land management specifically, and the claim does not overreach into a carbon promise it cannot keep. Specific and checkable.',
  },
  {
    id: 'guilt-free', speaker: 'A swimwear brand advertises',
    claim: 'Guilt-free swimwear for a cleaner ocean',
    verdict: 'greenwash', principle: 'Use clear and easy-to-understand language',
    rule: RULE.accc,
    reasoning: 'Feelings are not a metric, and "a cleaner ocean" is an unmeasured outcome the garment cannot deliver on its own. This is mood. State what the product is and does, or the claim says nothing at all.',
  },
  {
    id: 'green-energy-tariff', speaker: 'An energy retailer\'s ad says',
    claim: 'Switch to our Green plan and go 100% green',
    verdict: 'greenwash', principle: 'Use clear and easy-to-understand language',
    rule: RULE.accc,
    reasoning: 'Green is a colour. Whether the plan is backed by accredited GreenPower or by unbundled certificates of dubious additionality is the entire question, and the word hides it. Name the accreditation and what share it covers.',
  },
  {
    id: 'plastic-free-packaging', speaker: 'A parcel states',
    claim: 'Plastic-free packaging',
    verdict: 'legit', principle: 'Make accurate and truthful claims',
    rule: RULE.accc,
    reasoning: 'This one is specific and testable: it claims the packaging only, and "plastic-free" is a binary fact you can verify by opening the box. As long as the tape and label are plastic-free too, it is an accurate, bounded claim. Scope kept honest.',
  },
  {
    id: 'biodegradable-no-conditions', speaker: 'A phone case is sold as',
    claim: '100% biodegradable',
    verdict: 'greenwash', principle: 'Explain any conditions or qualifications',
    rule: RULE.accc,
    reasoning: 'Biodegradable under what conditions, and in how long? Almost everything breaks down eventually; a landfill is not a compost heap and can take centuries. With no timeframe, no conditions and an absolute "100%", this is the qualifier-free claim regulators single out.',
  },
];

// ===========================================================================
// EDITORIAL COPY
// ===========================================================================

export const META = {
  title: 'Sustainability Daily | Two carbon puzzles, one a day',
};

export const INTRO = {
  tag: 'Sustainability Daily',
  h1a: 'Two carbon puzzles,',
  h1b: 'one a day',
  paras: [
    'The Life Footprint reveal was a one-off: audit a year, see where it went. This turns the same instinct into a daily habit. Two small puzzles, a new one every day, played in under a minute each. One trains your gut feel for the size of things. The other trains your ear for a dodgy green claim.',
    'They share nothing but this page. Each keeps its own streak and its own shareable result. No account and no server: your streaks live in this browser and nowhere else.',
  ],
  chips: ['New puzzle daily', 'No account', 'Stays in your browser', 'Two streaks to keep'],
};

// The band that holds both game cards (DailyApp.jsx).
export const GAMES = {
  tag: "Today's puzzles",
  title: 'Play both, keep both streaks',
  sub: 'Two separate games. Each has its own mechanic, its own streak and its own shareable card. One a day, no do-overs, and the next unlocks at midnight Melbourne time.',
  copyFailed: 'Could not copy',
  sourceLink: 'Source',
};

export const GUESS = {
  tag: 'Guess the Footprint',
  eyebrow: 'Game 1',
  title: 'Guess the Footprint',
  blurb: 'One everyday thing a day. Guess its carbon footprint before the reveal, on a slider that runs from grams to tonnes. Get within one and a half times the answer for a perfect score.',
  cardKicker: "Today's item",
  playCta: 'Lock in my guess',
  sliderLabel: 'Your guess',
  sliderHint: 'Slide from a gram to ten tonnes, or type an exact figure',
  overrideLabel: 'Or type it',
  overridePlaceholder: 'e.g. 50',
  unitGroupLabel: 'Guess unit',
  rulerGuess: 'You',
  rulerAnswer: 'Actual',
  revealAnswer: 'The answer',
  yourGuess: 'Your guess',
  sourceLabel: 'Source',
  estimateFlag: 'Estimate: reasoning and assumption stated above',
  sitFlag: 'Priced from this site\'s own Life Footprint factor tables',
  shareCta: 'Copy result',
  shareDone: 'Copied',
  playedNote: "You have played today. The next item unlocks at midnight, Melbourne time.",
  scoreLines: {
    3: 'Bang on. Within one and a half times the real number.',
    2: 'Close. Within three times either way.',
    1: 'The right ballpark. Within a factor of ten.',
    0: 'Out by more than ten times. It happens: some of these surprise everyone.',
  },
};

export const CLAIM = {
  tag: 'Greenwash or Not',
  eyebrow: 'Game 2',
  title: 'Greenwash or Not',
  blurb: 'One real-ish marketing claim a day. Call it legitimate or greenwash, then read the actual rule it does or does not break. Claims are generic composites, invented for the game.',
  cardKicker: "Today's claim",
  legitBtn: 'Legitimate',
  greenwashBtn: 'Greenwash',
  legitHint: 'Specific, evidenced, qualified',
  greenwashHint: 'Vague, absolute or unbacked',
  verdictRight: 'You called it',
  verdictWrong: 'Not this time',
  // "The claim reads as <strong>legitimate</strong>." The word is the verdict.
  readsAs: 'The claim reads as',
  verdictWord: { legit: 'legitimate', greenwash: 'greenwash' },
  principleLabel: 'Principle in play',
  ruleLabel: 'The rule',
  shareCta: 'Copy result',
  shareDone: 'Copied',
  playedNote: "You have played today. The next claim unlocks at midnight, Melbourne time.",
};

// The play grid under each card's stats strip (src/daily/PlayGrid.jsx).
export const HISTORY = {
  label: 'Last 28 days',
  none: 'Nothing played yet',
  count: (n, of) => `${n} of ${of} played`,
  aria: (n, of) => `Play history: ${n} of the last ${of} days played, most recent on the right.`,
  oldest: '28 days ago',
  today: 'Today, still open',
};

export const STATS = {
  streak: 'Streak',
  best: 'Best',
  plays: 'Played',
  notPlayed: 'Not played yet',
  playedToday: 'Played today',
  dayLabel: 'Day',
};

// The method and honesty section, following the footprint's basis-of-preparation
// pattern: what the numbers are, where they come from, how scoring works, how
// the daily rotation works, and what the page deliberately does not do.
export const METHOD = {
  tag: 'How this works',
  title: 'Where the numbers and the rules come from',
  sub: 'The same honesty standard as the rest of the site. Every figure is either priced from this site\'s own footprint model or carries a published external source, and the two are always flagged apart.',
  updatedLabel: 'Last updated',
  lastUpdated: '13 August 2026',
  cadence: 'Updated when the underlying footprint factors change or a new item or claim is added. New items append to the end of each pool so the daily rotation stays stable.',
  blocks: [
    {
      icon: 'target',
      title: 'Guess the Footprint: the numbers',
      paras: [
        'Wherever an item also exists in the site\'s Life Footprint model, its answer is derived live from the very same factor tables the footprint engine prices from: the DCCEEW National Greenhouse Accounts Factors 2025 for electricity, gas and fuels, the UK Government (DEFRA) conversion factors for flights, hotels and freight, and Poore & Nemecek 2018 for food. Flights are priced exactly as the calculator prices them: great-circle distance uplifted 8%, doubled for the return, at the economy factor with radiative forcing counted. Clothing uses the per-item ADEME life-cycle figures. So a factor refresh moves this game in the same change.',
        'A handful of items sit outside the model: a year of streaming, a year of dog food, a pint of beer. Those carry a published external source and are marked an estimate on the reveal. Two of them were read back against the original documents on 13 August 2026. The streaming figure is the Carbon Trust\'s European average for 2020, about 55 g an hour on a 2018-vintage European grid, and the paper itself warns those figures are not designed to be representative of any given scenario, so an Australian hour on a dirtier grid runs higher. The dog-food figure is the median of 316 Brazilian commercial dry diets in Pedrinelli et al. 2022, a worked illustration for a 10 kg dog. Every card states its unit assumption plainly, for example "one seat, economy" or "one occupied room-night at the country average". Numbers are rounded to the confidence behind them.',
      ],
    },
    {
      icon: 'chart',
      title: 'Guess the Footprint: the scoring',
      paras: [
        'You are scored on the ratio between your guess and the answer, taken whichever way round, because these numbers span four orders of magnitude. Within one and a half times scores three, the top mark. Within three times scores two. Within ten times scores one. More than ten times off scores zero.',
      ],
    },
    {
      icon: 'list',
      title: 'Greenwash or Not: the rules',
      paras: [
        'Each claim is judged against the ACCC\'s eight principles for environmental claims, plus the Australian Consumer Law (sections 18 and 29) and, for financial and super claims, ASIC\'s greenwashing guidance. The reasoning names the specific rule a claim exploits. A legitimate claim is one that is specific, substantiated and qualified: a named standard, a real number, a stated baseline.',
        'Every claim is a generic composite, invented to illustrate a pattern. None is attributed to a real named company, ever. Where the reasoning refers to enforcement, it points at the real regulatory pattern (the ASIC super-fund cases, the ACCC recycled-plastic case) without pinning any invented words on a real brand.',
      ],
    },
    {
      icon: 'clock',
      title: 'The daily rotation',
      paras: [
        'One puzzle per calendar day, in Australia/Melbourne time, the same for everyone. The day index counts days from a fixed launch date, and the day\'s puzzle is item number (day index modulo pool size) in each frozen pool. Once you play, the result locks for the day: no do-overs, and the next puzzle unlocks at midnight Melbourne time.',
        'Streaks count consecutive days played and scored; miss a day and the streak resets to zero. Each card also shows the last 28 days as a grid, filled by how each day scored, so the streak number has the run behind it in view. Your streaks, your best runs, your play counts and that history (the last 120 days, as a day number and a score, nothing else) are stored in this browser\'s local storage under versioned keys, and never sent anywhere. Clear your browser data and they are gone, which is the trade for keeping all of it on your device.',
      ],
    },
  ],
};

export const SHARE = {
  guessTitle: 'Guess the Footprint',
  claimTitle: 'Greenwash or Not',
  // Plain-text share lines. The coloured squares are the one notation that
  // survives a paste into any chat, so both games use them and nothing else.
  streak: 'Streak',
  claimRight: '🟩 Called it',
  claimWrong: '🟥 Fooled me',
  url: 'https://itschriswang.com/daily/',
};
