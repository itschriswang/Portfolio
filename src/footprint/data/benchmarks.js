// Benchmarks used to contextualise a personal total. Each carries its basis,
// because the comparisons are only fair if the boundaries are named:
// this tool's boundary (household energy, personal travel, freight, diet) is
// narrower than the national accounting behind the averages. Rendered
// directly in the Basis of Preparation. `short` is the compact label the
// reveal uses on tiles and reference cards.

export const BENCHMARKS = [
  {
    id: 'budget2030',
    label: '1.5°C lifestyle benchmark',
    short: '1.5°C lifestyle benchmark',
    kind: 'lifestyle',
    tco2e: 2.5,
    basis: 'A 1.5°C-aligned lifestyle benchmark: where an average person\'s footprint needs to be by 2030 to hold warming near 1.5°C. From 1.5-Degree Lifestyles (IGES, Aalto University and D-mat, 2019; Hot or Cool Institute 2021 update): 2.5 t a person by 2030, 1.4 t by 2040, 0.7 t by 2050. It is a consumption-based lifestyle figure, the same kind this calculator estimates.',
    url: 'https://hotorcool.org/1-5-degree-lifestyles-report/',
  },
  {
    id: 'global',
    label: 'World average per person',
    short: 'World average',
    kind: 'national',
    tco2e: 6.6,
    basis: 'National per-capita emissions of all greenhouse gases, world total, 2024: 6.562 t CO2-e (EDGAR / JRC 2025 report, Annex 5 world fact sheet, printed page 65, verified August 2026; all anthropogenic sectors, excludes land use and large-scale biomass burning). The world total includes international shipping and aviation, which the country fact sheets leave out, so it sits on a marginally wider boundary than the national rows below. This is territorial accounting across whole economies, so it is broader than a personal lifestyle footprint.',
    url: 'https://edgar.jrc.ec.europa.eu/report_2025',
  },
  {
    id: 'aus',
    label: 'Australian average per person',
    short: 'Australian average',
    kind: 'national',
    country: 'AU',
    tco2e: 22.3,
    basis: 'National per-capita emissions of all greenhouse gases, Australia, 2024: 22.258 t CO2-e (EDGAR / JRC 2025 report, Annex 6 Australia fact sheet, printed page 79, verified August 2026; excludes land use, large-scale biomass burning and international transport). Including the land sink, the national inventory works out nearer 16 t a person. Territorial accounting across the whole economy, so it counts far more than a personal footprint.',
    url: 'https://edgar.jrc.ec.europa.eu/report_2025',
  },
  {
    id: 'us',
    label: 'American average per person',
    short: 'American average',
    kind: 'national',
    country: 'US',
    tco2e: 17.3,
    basis: 'National per-capita emissions of all greenhouse gases, United States, 2024: 17.344 t CO2-e (EDGAR / JRC 2025 report, Annex 6 United States fact sheet, printed page 268, verified August 2026; excludes land use, large-scale biomass burning and international transport). Territorial accounting across the whole economy, so it counts far more than a personal footprint.',
    url: 'https://edgar.jrc.ec.europa.eu/report_2025',
  },
  {
    id: 'nz',
    label: 'New Zealand average per person',
    short: 'New Zealand average',
    kind: 'national',
    country: 'NZ',
    tco2e: 15.6,
    basis: 'National per-capita emissions of all greenhouse gases, New Zealand, 2024: 15.586 t CO2-e (EDGAR / JRC 2025 report, Annex 6 New Zealand fact sheet, printed page 202, verified August 2026), read from the fact sheet rather than derived from an inventory total. The boundary is every greenhouse gas, CO2, methane, nitrous oxide and F-gases aggregated on AR5 GWP-100, and it excludes land use, land-use change and forestry as well as large-scale biomass burning. That boundary does more work here than anywhere else on this list: methane is the largest single gas at 44.2% of the national total, and no forest sink is netted off against it. Territorial accounting across the whole economy, so it counts far more than a personal footprint.',
    url: 'https://edgar.jrc.ec.europa.eu/report_2025',
  },
];

export const BUDGET_2030 = BENCHMARKS[0];
export const AUS_AVG = BENCHMARKS[2];

// The home-country national average for a settings object's country code,
// falling back to Australia for profiles saved before country support.
export const homeAverageFor = (country) =>
  BENCHMARKS.find((b) => b.country === country) || AUS_AVG;

// Boundary caveat shown wherever a benchmark comparison appears.
export const BENCHMARK_CAVEAT =
  'Boundary note: this counts household energy, personal travel, freight and diet, plus the optional goods, hotel and new-build home basket if you added it. National per-capita figures still cover a wider boundary, so any total here understates a full consumption footprint.';
