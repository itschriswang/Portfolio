# Data needed: the sourcing list

One list of every document worth obtaining to firm up the site's tools, with
direct links, what to pull from each, and the exact file and field in the repo
it updates.

**Last refresh: August 2026.** A large upload closed most of what this list
used to ask for. Section 1 records what closed, so nobody re-sources it.
Sections 2 onward are what is still open, in priority order.

## How to use this

For each item, either hand the file over in a session pointed at this document,
or update the field yourself and bump its `accessed` / `VERIFIED` /
`LAST_UPDATED` / `META.updated` date in the same edit.

**Where to put files.** Uploading in the chat is best: the file lands where it
can be read immediately. Committing to the repo works too, but see the note on
redistribution at the bottom before adding a copyrighted report.

The one rule that never bends: if a figure cannot be verified to its source it
stays named-but-marked (`pending`, `estimate`, or left out), never invented. A
partial pass is fine. Firm up what you can, and the rest keeps its honest flag.

---

## 1. Closed in the August 2026 refresh

Every figure below was read from the primary document, cited to its sheet and
cell or its page, and re-read by an independent verification pass before being
applied. Nothing here needs sourcing again until a new edition publishes.

| Source | What it closed |
|---|---|
| DESNZ/DEFRA GHG conversion factors **2026** | Flights (all bands and cabins, with and without radiative forcing, as published rather than derived), air/sea/road freight, hotel nights by country, national rail, and a new local bus factor |
| EPA **eGRID2023 rev2** | US electricity for all 50 states, DC and Puerto Rico, plus the 4.2% grid gross loss. Replaced a single national average that spanned a 38x real spread |
| EPA **GHG Emission Factors Hub 2025** | Confirmed the shipped US natural gas factor exactly (0.05034 kg CO2e/MJ) and the motor fuel factors |
| **EDGAR / JRC 2025** report | All four benchmark rows, now read from country fact sheets with page numbers. New Zealand moved 14.6 to 15.6 t and stopped being a derived figure |
| MfE **Measuring Emissions Catalogue 2026** | New Zealand electricity, its separate transmission-loss factor, reticulated gas, petrol and diesel, and a NZ hotel factor. NZ stopped borrowing Australian numbers for everything but one line |
| **ATO** FY2026 rates, **RBA** F11.1, **NZ IRD** rolling averages | Confirmed the AUD/USD bridge to four decimals; brought the NZD bridge forward a year onto the same twelve months |
| **Clean Energy Regulator** scope 2 guideline | Corrected `/grid/`: the residual mix factor is the 2025-26 year, and the state-level expectation the page carried is not supported by the source |
| **AEMO** QED Q4 2025 and final 2026 ISP, **AER** State of the Energy Market, **CER** quarterly report, **CEC** rooftop report, **DCCEEW** NGGI, **CCA** Annual Progress Report | `/progress/`, including a substantive correction: the final ISP has the optimal path reaching the 82% target by 2030, where the page had said 75% and short |
| **Carbon Trust** streaming study, **Pedrinelli et al. 2022** | `/daily/`, including a wrong author attribution that had been on the page |
| **SBTi** export (6 Aug 2026) | `/targets/` status corrections including several expired commitments, and 20 further `/fashion/` brands qualifying under the existing rule |
| Company sustainability reports | `/targets/` emissions series for Aristocrat, James Hardie, Brambles, Evolution Mining, NAB, APA and Santos |
| **AER** Annual Retail Markets Report 2024-25 | Sanity-checked the Australian energy presets against published average consumption (Table A2.1) |

---

## 2. Super Fund Holdings (`/super/`) — the highest priority, still fully open

Nothing for this tool was in the August upload, and it remains the largest gap
on the site: **all ten funds still show `topHoldingsConf: 'pending'`** and every
flagged holding reads "not verified this cycle".

**The gap.** Under section 1017BB of the Corporations Act every fund must
publish full holdings for each investment option twice a year, within 90 days of
31 December and 30 June. The **30 June 2026 cycle** is due by the end of
September 2026; the 31 December 2025 cycle is already published.

**Two numbers, not one.** For a holding like Commonwealth Bank, capture both its
weight in the *whole option* and, if broken out, its weight in the *Australian
shares sleeve*. They differ a lot (a name at ~8% of the equities sleeve is only
a few per cent of the whole option). The tool shows the whole-option figure and
notes the sleeve figure.

For each fund grab three things: the **portfolio holdings disclosure** for the
named default option, the **investment guide or PDS** for the strategic asset
allocation, and the **sustainability page** for the marketing line verbatim.

| Fund | Default option | Disclosure page |
|---|---|---|
| AustralianSuper | Balanced (MySuper) | https://www.australiansuper.com/investments/what-we-invest-in |
| Australian Retirement Trust | Lifecycle (Balanced Pool) | https://www.australianretirementtrust.com.au/investments/portfolio-holdings |
| Rest | Core Strategy (MySuper) | https://rest.com.au/investments/how-we-invest/portfolio-holdings |
| Hostplus | Balanced (MySuper) | https://hostplus.com.au/investment/managing-your-investment/portfolio-holdings-disclosure |
| HESTA | Balanced Growth (MySuper) | https://www.hesta.com.au/members/investments/how-hesta-invests/portfolio-holdings |
| Aware Super | FutureSaver MySuper Lifecycle | https://aware.com.au/member/what-we-offer/investments/what-we-invest-in/portfolio-holdings-disclosure |
| Cbus | Growth (MySuper) | https://www.cbussuper.com.au/super/my-investment-options/portfolio-holdings-disclosure |
| UniSuper | Balanced (MySuper) | https://www.unisuper.com.au/investments/how-we-invest/portfolio-holdings |
| Vanguard Super | Lifecycle (MySuper) | https://www.vanguard.com.au/super/help-and-resources/forms-and-documents |
| Colonial First State | FirstChoice Employer, CFS Lifestage | https://www.cfs.com.au/personal/resources/funds-and-performance/portfolio-holdings.html |

Cross-checks: Market Forces fund profiles
(https://www.marketforces.org.au/superfunds/), APRA MySuper statistics
(https://www.apra.gov.au/quarterly-superannuation-statistics), and ASX
substantial-holder notices to date any specific stake.

Queued new funds: AMP (https://www.amp.com.au/superannuation/portfolio-holdings),
HUB24, Brighter Super, Spirit Super, NGS Super, and Australian Ethical as a
screened contrast.

---

## 3. Australian NGA Factors 2025 and 2026 — the largest footprint gap left

This is now the **only part of the footprint factor table not read from a
primary workbook**. The August upload included the 2023 and 2024 editions, but
the tool ships 2025 values, and replacing them with an older vintage would go
backwards, so they were left as they stand and the method page says so.

- **Publication page:** https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors
- **Want:** the **2025** workbook, and the **2026** edition (usually published
  around August, so it may now exist).
- **Read:** scope 2 and scope 3 electricity factors by state; natural gas scope
  1 (kg CO2e/GJ, with the CO2/CH4/N2O split) and scope 3 by state; petrol and
  diesel scope 1 per litre and fuel-cycle scope 3.
- **Lands in:** `ELECTRICITY`, `GAS`, `ROAD_FUELS` in
  `src/footprint/data/factors.js`, and `LOCATION_FACTORS` in `src/grid/data.js`,
  which must move together.

---

## 4. Fashion Transparency Index (`/fashion/`)

Every brand's transparency score still comes from the **2023** edition. This is
the core number on the page and it is now three editions old.

- **Fashion Revolution:** https://www.fashionrevolution.org/about/transparency/
- **What Fuels Fashion** (the climate-specific companion):
  https://www.fashionrevolution.org/what-fuels-fashion/
- **Read:** the Final Scores table for the current edition, and note which
  edition and page.
- **Lands in:** the per-brand score and its `accessed` date in
  `src/fashion/data.js`, plus the `CHANGELOG` and the scope count on the home
  page tool card if the brand count moves.
- **Note:** copyrighted, so do not commit the PDF; the values are used with
  attribution, which is the existing policy for this tool.

Also worth refreshing while there: Baptist World Aid's Ethical Fashion Report
(https://baptistworldaid.org.au/resources/ethical-fashion-report/) and the
Fashion Pact signatory list (https://www.thefashionpact.org/).

---

## 5. The rest of `/targets/`

Seven cards were filled from the August upload. Roughly nineteen companies still
carry an unverified or thin series. Each needs one emissions data table, usually
in a sustainability data pack appendix.

Highest value, because the card currently shows a commitment with no chart:
Westpac, ANZ, Macquarie, QBE, IAG, Suncorp, ASX Limited, Cochlear, Stockland,
GPT, Medibank, Newmont (awaiting the post-Newcrest re-baselined inventory), Light
& Wonder, ALS and Computershare.

Thin series needing earlier years: Fortescue, Qantas, Wesfarmers, Coles,
Telstra, Woolworths, Northern Star, South32, Amcor, Transurban, ResMed,
WiseTech, Xero, The Lottery Corporation, Goodman, Scentre, Sigma, CBA and
Woodside.

Conflicts to resolve: Rio Tinto's restated 2018 baseline (34.5 vs 32.6 Mt), CSL
and Sonic Healthcare base years, and Soul Pattinson's 2025 restructure.

One download that cross-checks every Australian operation at once:
**CER National Greenhouse and Energy Reporting data** —
https://cer.gov.au/markets/reports-and-data/national-greenhouse-and-energy-reporting-data

Index maintenance: the S&P DJI ASX 50 constituent list at the next rebalance,
which the method page commits to checking each review.

---

## 6. Replace the remaining proxies in the footprint

Each of these is a stated proxy today. The method page names them; closing one
removes a caveat.

- **Australian rail and bus per passenger-km.** Public transport uses UK
  figures. An Australian source would close both at once. Candidates: the
  Australian Transport Assessment and Planning guidelines
  (https://www.atap.gov.au/), state transport authority sustainability reports,
  or BITRE (https://www.bitre.gov.au/publications).
- **Australian spend-based (EEIO) factors** to replace the US EPA supply-chain
  set behind the optional goods step. Candidate: the Industrial Ecology Lab
  (https://ielab.info/), or ABS input-output tables
  (https://www.abs.gov.au/statistics/economy/national-accounts).
- **New Zealand fuel-cycle (well-to-tank) factors**, the one NZ line still using
  Australian numbers. If MfE publishes no equivalent, this may simply stay
  stated.
- **US natural gas fuel-cycle**, currently not counted at all, so that line
  understates. The EPA hub gives combustion only.
- **US and NZ upstream electricity (fuel-cycle) factors.** Newly written up on
  the method page, which now carries a section on it: the three countries do not
  use the same scope 3 boundary on the electricity line. Australia's NGA factor
  covers the fuel supply chain plus network losses, which is why its scope 3
  runs from about 5% of the generation factor in NSW to about 18% in SA. eGRID
  publishes only a 4.2% grid gross loss, and MfE only its own transmission and
  distribution loss, so both of those countries carry losses and no fuel cycle.
  The gap is a few per cent of an electricity line, not of a year, and it is
  declared rather than closed because no primary upstream figure could be read
  for either country; borrowing Australia's would be inventing one. Closing it
  needs a published US or NZ well-to-tank electricity factor. `tests/factors.test.js`
  holds the three conventions in place, so a refresh that quietly switches one
  fails the suite.
- **eGRID2024** when EPA publishes it. Production appeared paused as at
  March 2026, so eGRID2023 rev2 remains current:
  https://www.epa.gov/egrid/download-data

---

## 7. Smaller, well-defined gaps

- **A citable Australian c/kWh or the DMO determination.** The AER prints
  residential bills only as chart images, so no dollar figure in that report can
  be read to this page's standard, and the onboarding's dollar anchors are
  therefore marked indicative. The **Default Market Offer** determination
  (https://www.aer.gov.au/industry/registers/resources/reviews/default-market-offer-prices-2025-26)
  publishes representative annual supply amounts and prices in tables, which
  would let the anchors become sourced.
- **EIA RECS consumption tables (the CE series).** The uploaded RECS 2024 files
  are housing characteristics (square footage, household size), not consumption,
  so only the US "house" preset could be anchored, on the EIA average of 10,791
  kWh a year. The CE tables would anchor the rest:
  https://www.eia.gov/consumption/residential/data/2020/ (2024 tables as they
  publish).
- **Queued footprint categories**, each excluded rather than guessed: household
  waste to landfill, pets (dog and cat food), the embodied carbon of building or
  buying a car, and mains water supply.
- **A published NZ domestic aviation factor is now in hand** (MfE 2026 Tables
  7.23/7.24, 0.196964 with RF) but is not applied, because flight pricing has no
  country dimension yet. Applying it is a code change, not a sourcing one.

---

## 8. A note on committing source documents

`docs/data-sources/README.md` states the policy: to avoid redistributing third
parties' copyrighted reports, full report PDFs are **not** stored in this repo.
The August 2026 upload added about 175 MB of exactly those, which took `.git`
past 240 MB on a public repository.

Now that every figure has been extracted with a page or cell citation, the
source PDFs have served their purpose. The consistent position is to remove them
from the working tree and keep the citations plus the links above. Note that
removing them from the tree does not remove them from git history; that needs a
history rewrite, which is a separate decision.

Government publications (DEFRA, eGRID, EPA, MfE, AER, AEMO, CER, DCCEEW, EDGAR)
are generally open-licensed and are the safer ones to keep. Company reports and
paid or restricted research are the ones the policy is really about.
