// The "how it works" page, on its own route (/footprint/method/). Rendered
// from the live factor set the calculator prices from, so the tables can
// never drift from the maths. Any change to the engine, factors, reduction
// options or pathway model must land here in the same change (see CLAUDE.md).

import SplitText from '../components/SplitText';
import {
  ELECTRICITY, ELECTRICITY_SOURCE, ELECTRICITY_SOURCE_NZ, ELECTRICITY_SOURCE_US,
  GAS, GAS_SOURCE, GAS_INTL, GAS_SOURCE_US, GAS_SOURCE_NZ,
  ROAD_FUELS, ROAD_FUELS_INTL, ROAD_SOURCE_US, ROAD_SOURCE_NZ,
  ROAD_MODES, ROAD_SOURCE, FLIGHT_FACTORS, FLIGHT_SOURCE, FLIGHT_RF_MULTIPLIER,
  FREIGHT_MODES, FREIGHT_SOURCE, DIET_TYPES, DIET_SOURCE, FOOD_PER_KG, GRID_DECLINE,
  GOODS, GOODS_SOURCE, GOODS_FX, GOODS_FX_BY_COUNTRY, goodsPerDollar,
  CLOTHING_ITEMS, CLOTHING_ITEMS_SOURCE,
  HOTEL, HOTEL_SOURCE,
  HOME, HOME_SOURCE,
} from './data/factors';
import { EQUIVALENCES, EQUIV_SOURCE } from './data/equivalences';
import { METHOD } from './data/copy';
import Icon from '../components/Icons';

function FTable({ caption, head, rows, source }) {
  return (
    <div className="fp-ftable">
      <div className="fp-ftable-cap">{caption}</div>
      <div className="fp-scroll-x">
        <table className="fp-table">
          <thead><tr>{head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
        </table>
      </div>
      {source && <div className="fp-ftable-src">{source.name}. {source.detail}{' '}
        {source.url && <a href={source.url} target="_blank" rel="noopener noreferrer">Source</a>}
      </div>}
    </div>
  );
}

const n3 = (v) => Number(v).toFixed(v < 0.01 ? 4 : 3);

export default function Method() {
  return (
    <section id="fp-method">
      <div className="canvas">
        <div className="sec-tag" data-idx="./ "><Icon name="book" size={32} />{METHOD.tag}</div>
        <h1 className="display fp-h2"><SplitText text={METHOD.title[0]} /> <SplitText text={METHOD.title[1]} accentIndex={1} /></h1>
        <p className="fp-sub">{METHOD.sub}</p>
        <p className="fp-note">← <a href="../">{METHOD.backToDash}</a></p>

        <div className="fp-method-grid">
          <div className="fp-method-block">
            <h3><Icon name="globe" size={32} className="fpi-lead" />{METHOD.boundary.title}</h3>
            {METHOD.boundary.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="fp-method-block">
            <h3><Icon name="clock" size={32} className="fpi-lead" />{METHOD.period.title}</h3>
            {METHOD.period.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="fp-method-block">
            <h3><Icon name="list" size={32} className="fpi-lead" />{METHOD.sources.title}</h3>
            {METHOD.sources.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="fp-method-block">
            <h3><Icon name="target" size={32} className="fpi-lead" />{METHOD.quality.title}</h3>
            {METHOD.quality.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="fp-method-block">
            <h3><Icon name="book" size={32} className="fpi-lead" />{METHOD.interpret.title}</h3>
            {METHOD.interpret.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="fp-method-block">
            <h3><Icon name="chart" size={32} className="fpi-lead" />{METHOD.plan.title}</h3>
            {METHOD.plan.paras.map((p, i) => <p key={i}>{p}</p>)}
            <p className="fp-note">Grid trajectory used in the chart: the electricity factor declines about {Math.round((1 - GRID_DECLINE.ratePerYear) * 100)}% a year toward a floor, {GRID_DECLINE.source}</p>
          </div>
          <div className="fp-method-block fp-method-wide">
            <h3><Icon name="people" size={32} className="fpi-lead" />{METHOD.character.title}</h3>
            {METHOD.character.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="fp-method-block fp-method-wide">
            <h3>{METHOD.equiv.title}</h3>
            {METHOD.equiv.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        <div className="fp-method-block fp-method-wide">
          <h3>{METHOD.factorsTitle}</h3>
          <p>{METHOD.factorsSub}</p>

          <FTable
            caption="Electricity, Australia, by state and grid region · kg CO₂-e per kWh"
            head={['State / region', 'Scope 2', 'Scope 3']}
            rows={Object.values(ELECTRICITY).filter((r) => r.country === 'AU')
              .map((r) => [r.label + (r.grid ? ' · ' + r.grid : ''), r.s2.toFixed(2), r.s3.toFixed(2)])}
            source={ELECTRICITY_SOURCE}
          />
          <FTable
            caption="Electricity, New Zealand · kg CO₂-e per kWh (national grid)"
            head={['Region', 'Scope 2', 'Scope 3']}
            rows={[[ELECTRICITY.NZ.label + ' · ' + ELECTRICITY.NZ.grid, ELECTRICITY.NZ.s2.toFixed(4), ELECTRICITY.NZ.s3.toFixed(4)]]}
            source={ELECTRICITY_SOURCE_NZ}
          />
          <FTable
            caption="Electricity, United States · kg CO₂-e per kWh, every state from its own eGRID row"
            head={['State / region', 'Scope 2', 'Scope 3']}
            rows={Object.values(ELECTRICITY).filter((r) => r.country === 'US')
              .map((r) => [r.label, r.s2.toFixed(4), r.s3.toFixed(4)])}
            source={ELECTRICITY_SOURCE_US}
          />
          <FTable
            caption="Natural gas, Australia (metro residential) · kg CO₂-e per MJ"
            head={['Component', 'Factor']}
            rows={[
              ['Scope 1 combustion', GAS.s1_per_MJ.toFixed(5)],
              ...Object.entries(GAS.s3_per_MJ).map(([st, v]) => ['Scope 3 fuel-cycle, ' + st, v.toFixed(4)]),
            ]}
            source={GAS_SOURCE}
          />
          <FTable
            caption="Natural gas, United States · kg CO₂-e per MJ (bills in therms convert at 105.505 MJ per therm)"
            head={['Component', 'Factor']}
            rows={[
              ['Scope 1 combustion', GAS_INTL.US.s1_per_MJ.toFixed(5)],
              ['Scope 3 fuel-cycle', 'not counted (queued); understates slightly'],
            ]}
            source={GAS_SOURCE_US}
          />
          <FTable
            caption="Natural gas, New Zealand · kg CO₂-e per MJ (bills in kWh convert at 3.6 MJ per kWh)"
            head={['Component', 'Factor']}
            rows={[
              ['Scope 1 combustion', GAS_INTL.NZ.s1_per_MJ.toFixed(5)],
              ['Scope 3 network losses', GAS_INTL.NZ.s3_per_MJ.toFixed(5)],
            ]}
            source={GAS_SOURCE_NZ}
          />
          <FTable
            caption="Road, Australia · fuels per litre, modes per passenger-km (the per-passenger modes apply in every country)"
            head={['Item', 'Scope 1', 'Scope 3', 'Basis']}
            rows={[
              ['Petrol (per L)', ROAD_FUELS.petrol.s1_per_L.toFixed(2), ROAD_FUELS.petrol.s3_per_L.toFixed(2), 'NGA 2025 Table 9'],
              ['Hybrid (per L)', ROAD_FUELS.hybrid.s1_per_L.toFixed(2), ROAD_FUELS.hybrid.s3_per_L.toFixed(2), 'Petrol factors at ' + ROAD_FUELS.hybrid.defaultL100km + ' L/100km default consumption'],
              ['Diesel (per L)', ROAD_FUELS.diesel.s1_per_L.toFixed(2), ROAD_FUELS.diesel.s3_per_L.toFixed(2), 'NGA 2025 Table 9'],
              ['EV (per km)', '0', 'grid factors', ROAD_FUELS.ev.kWhPerKm + ' kWh/km at the home grid electricity factors'],
              ['Rideshare / taxi (per km)', 'n/a', ROAD_MODES.rideshare.perKm.toFixed(3), ROAD_MODES.rideshare.source],
              ['Public transport, rail (per km)', 'n/a', ROAD_MODES.pt.perKm.toFixed(3), ROAD_MODES.pt.source],
              ['Public transport, bus (per km)', 'n/a', ROAD_MODES.bus.perKm.toFixed(3), ROAD_MODES.bus.source],
            ]}
            source={ROAD_SOURCE}
          />
          <FTable
            caption="Road, United States · fuels per litre"
            head={['Item', 'Scope 1', 'Scope 3', 'Basis']}
            rows={[
              ['Gasoline (per L)', ROAD_FUELS_INTL.US.petrol.s1_per_L.toFixed(2), ROAD_FUELS_INTL.US.petrol.s3_per_L.toFixed(2), 'EPA Hub 8.78 kg CO2/gal; scope 3 is the NGA fuel-cycle proxy'],
              ['Hybrid (per L)', ROAD_FUELS_INTL.US.hybrid.s1_per_L.toFixed(2), ROAD_FUELS_INTL.US.hybrid.s3_per_L.toFixed(2), 'Gasoline factors at ' + ROAD_FUELS_INTL.US.hybrid.defaultL100km + ' L/100km default consumption'],
              ['Diesel (per L)', ROAD_FUELS_INTL.US.diesel.s1_per_L.toFixed(2), ROAD_FUELS_INTL.US.diesel.s3_per_L.toFixed(2), 'EPA Hub 10.21 kg CO2/gal; scope 3 is the NGA fuel-cycle proxy'],
              ['EV (per km)', '0', 'grid factors', ROAD_FUELS_INTL.US.ev.kWhPerKm + ' kWh/km at the US grid average'],
            ]}
            source={ROAD_SOURCE_US}
          />
          <FTable
            caption="Road, New Zealand · fuels per litre (combustion read from the MfE catalogue; the fuel-cycle line stays an Australian proxy)"
            head={['Item', 'Scope 1', 'Scope 3', 'Basis']}
            rows={[
              ['Petrol (per L)', ROAD_FUELS_INTL.NZ.petrol.s1_per_L.toFixed(5), ROAD_FUELS_INTL.NZ.petrol.s3_per_L.toFixed(2), 'MfE 2026 Table 3.3, regular petrol; scope 3 is the NGA fuel-cycle proxy'],
              ['Hybrid (per L)', ROAD_FUELS_INTL.NZ.hybrid.s1_per_L.toFixed(5), ROAD_FUELS_INTL.NZ.hybrid.s3_per_L.toFixed(2), 'Petrol factors at ' + ROAD_FUELS_INTL.NZ.hybrid.defaultL100km + ' L/100km default consumption'],
              ['Diesel (per L)', ROAD_FUELS_INTL.NZ.diesel.s1_per_L.toFixed(5), ROAD_FUELS_INTL.NZ.diesel.s3_per_L.toFixed(2), 'MfE 2026 Table 3.3; scope 3 is the NGA fuel-cycle proxy'],
              ['EV (per km)', '0', 'grid factors', ROAD_FUELS_INTL.NZ.ev.kWhPerKm + ' kWh/km at the NZ grid factors'],
            ]}
            source={ROAD_SOURCE_NZ}
          />
          <FTable
            caption={'Flights · kg CO₂-e per passenger-km, with radiative forcing (the ×' + FLIGHT_RF_MULTIPLIER + ' uplift lands on the CO₂ component alone). Economy without RF is shown beside it, as published'}
            head={['Band', 'Economy', 'Premium', 'Business', 'First', 'Economy, no RF']}
            rows={Object.values(FLIGHT_FACTORS).map((b) => [
              b.label + (b.noCabinSplit ? ' (average passenger, no cabin split)' : ''),
              n3(b.withRF.economy), n3(b.withRF.premium), n3(b.withRF.business), n3(b.withRF.first),
              n3(b.withoutRF.economy),
            ])}
            source={FLIGHT_SOURCE}
          />
          <FTable
            caption="Freight · kg CO₂-e"
            head={['Mode', 'Factor', 'Unit']}
            rows={[
              [FREIGHT_MODES.road.label, FREIGHT_MODES.road.perTonneKm.toFixed(3), 'per t-km'],
              [FREIGHT_MODES.air.label, FREIGHT_MODES.air.perTonneKm.toFixed(2), 'per t-km'],
              [FREIGHT_MODES.sea.label, FREIGHT_MODES.sea.perTonneKm.toFixed(3), 'per t-km'],
              [FREIGHT_MODES.parcel.label, FREIGHT_MODES.parcel.perParcel.toFixed(2), 'per parcel'],
            ]}
            source={FREIGHT_SOURCE}
          />
          <FTable
            caption="Diet · kg CO₂-e per day, by diet type (estimate)"
            head={['Diet', 'Per day', 'Per year (t)']}
            rows={Object.values(DIET_TYPES).map((d) => [d.label, d.perDay.toFixed(2), ((d.perDay * 365) / 1000).toFixed(2)])}
            source={DIET_SOURCE}
          />
          <FTable
            caption="Reference: per-kg food factors (context for the diet bands, shown for reference)"
            head={['Food', 'kg CO₂-e per kg']}
            rows={FOOD_PER_KG.rows.map(([f, v]) => [f, v.toFixed(1)])}
            source={{ name: FOOD_PER_KG.source, detail: '' }}
          />
          <FTable
            caption="Everyday equivalences · kg CO₂-e per item (display only)"
            head={['Item', 'kg CO₂-e each', 'Basis']}
            rows={EQUIVALENCES.map((e) => [e.label, e.kg < 0.05 ? e.kg.toFixed(3) : e.kg.toFixed(2), e.basis])}
            source={EQUIV_SOURCE}
          />
          <FTable
            caption="Goods & services (optional detail) · spend-based screening estimate, per dollar spent in the home currency"
            head={['Category', 'kg CO₂-e / 2022 USD', 'kg / A$', 'kg / NZ$', 'kg / US$', 'Representative EPA commodities (with margins)']}
            rows={Object.entries(GOODS).map(([k, g]) => [
              g.label, g.usPerUsd.toFixed(3),
              goodsPerDollar(k, 'AU').toFixed(4), goodsPerDollar(k, 'NZ').toFixed(4), goodsPerDollar(k, 'US').toFixed(4),
              g.basis,
            ])}
            source={GOODS_SOURCE}
          />
          <p className="fp-note">
            Currency and inflation bridge: each per-2022-USD factor is multiplied by the home currency's USD rate (A$ {GOODS_FX_BY_COUNTRY.AU.rate}, NZ$ {GOODS_FX_BY_COUNTRY.NZ.rate}, US$ {GOODS_FX_BY_COUNTRY.US.rate}) and divided by {GOODS_FX.inflation} (US CPI-U, 2022 to reporting year) to price spend in current local dollars. {GOODS_FX_BY_COUNTRY.AU.rateNote} {GOODS_FX_BY_COUNTRY.NZ.rateNote} {GOODS_FX.inflationNote} This block is a screening estimate for a US consumption basket applied to the home country's spend; treat it as coarse and lower-confidence than the metered lines above.
          </p>
          <FTable
            caption="Clothing by item (optional detail) · kg CO₂-e per item, cradle-to-grave"
            head={['Bucket', 'kg CO₂-e / item', 'Product rows behind the mean (ADEME 2018, per item)']}
            rows={Object.values(CLOTHING_ITEMS).map((c) => [c.label, c.perItem.toFixed(1), c.basis])}
            source={CLOTHING_ITEMS_SOURCE}
          />
          <FTable
            caption="Hotel nights (optional detail) · kg CO₂-e per occupied room-night, by country"
            head={['Country', 'kg CO₂-e / room-night']}
            rows={Object.values(HOTEL.countries).map((h) => [h.label, h.perNight.toFixed(1)])}
            source={HOTEL_SOURCE}
          />
          <FTable
            caption={'Home embodied carbon (optional detail) · upfront (A1-A5) kg CO₂-e per m², amortised over ' + HOME.amortiseYears + ' years'}
            head={['Dwelling type', 'kg CO₂-e / m² upfront', 'Annual per m² (÷ ' + HOME.amortiseYears + ')']}
            rows={Object.values(HOME.types).map((t) => [t.label, t.perM2.toFixed(0), (t.perM2 / HOME.amortiseYears).toFixed(1)])}
            source={HOME_SOURCE}
          />
        </div>

        <div className="fp-method-block fp-method-wide">
          <h3><Icon name="bin" size={32} className="fpi-lead" />{METHOD.exclusions.title}</h3>
          {METHOD.exclusions.groups.map((g, gi) => (
            <div key={gi} className="fp-excl-group">
              <div className="fp-card-head">{g.head}</div>
              <ul className="fp-exclusions">
                {g.items.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="fp-method-block fp-method-wide">
          <h3>{METHOD.changes.title}</h3>
          <ul className="fp-exclusions">
            {METHOD.changes.items.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
