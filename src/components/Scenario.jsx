import { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip } from 'chart.js';

// Register only what the pathway chart uses, chart.js/auto pulls in every
// controller, scale, and plugin and roughly doubles the chart bundle.
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);
import { runModel, chartLabels, LEVER_LABELS, SECTOR_OPTIONS, resolveSector } from '../data/scenario';
import { SCENARIO_UI } from '../data/content';
import FloatingDots from './FloatingDots';
import SplitText from './SplitText';
import Icon from './Icons';
import { prefersReducedMotion } from '../utils/media';

// Every selector lists the lever's default first. The default takes the full
// top row of its card and the alternatives share the row beneath, least to most
// ambitious (see .seg-sm in global.css), so the wide button is always the
// setting the model starts from.
const LEVERS = [
  // Lever colours step along the green ramp (see LIME, BLACK AND WHITE in
  // global.css): bright lime, olive, grey, near-black, matching the wedges.
  { key: 'grid', lc: 'var(--series-1)', sc: 'var(--series-1-ink)', opts: ['base', 'off', 'slower', 'faster'] },
  { key: 'lv', lc: 'var(--series-2)', sc: 'var(--series-2-ink)', opts: ['base', 'slower', 'faster'] },
  { key: 'hv', lc: 'var(--series-3)', sc: 'var(--series-3-ink)', opts: ['base', 'slower', 'faster'] },
  { key: 'plant', lc: 'var(--series-4)', sc: 'var(--series-4-ink)', opts: ['base', 'off', 'slower', 'faster'] },
];
const OPT_LABEL = { base: 'Base', faster: 'Faster', slower: 'Slower', off: 'Off' };
const REV_OPTS = [
  { v: 'moderate', l: '+1.5% / yr' },
  { v: 'flat', l: 'Flat' },
  { v: 'high', l: '+3.0% / yr' },
];

const LEGEND_SWATCH = [
  '<span class="cl-swatch line" style="color:#17190D"></span>',
  '<span class="cl-swatch" style="background:rgba(208,240,85,0.75)"></span>',
  '<span class="cl-swatch" style="background:rgba(94,107,30,0.55)"></span>',
  '<span class="cl-swatch" style="background:rgba(140,144,128,0.5)"></span>',
  '<span class="cl-swatch" style="background:rgba(39,46,9,0.42)"></span>',
  '<span class="cl-swatch dash" style="color:rgba(23,25,13,0.5)"></span>',
  '<span class="cl-swatch dash" style="color:#535648"></span>',
];

// A row of mutually exclusive option buttons. The group carries the lever's
// name and each button its pressed state, so assistive tech hears
// "Grid decarbonisation, group. Faster, toggle button, pressed" rather than
// four anonymous "Base" buttons.
function Seg({ value, options, onChange, sc, small, label }) {
  return (
    <div className={'seg-row' + (small ? ' seg-sm' : '')} role="group" aria-label={label} style={small ? { '--sc': sc, '--seg-alt': options.length - 1 } : undefined}>
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.v;
        const l = typeof o === 'string' ? OPT_LABEL[o] : o.l;
        return (
          <button key={v} type="button" className={'seg-btn' + (value === v ? ' on' : '')} aria-pressed={value === v} onClick={() => onChange(v)}>
            {l}
          </button>
        );
      })}
    </div>
  );
}

// FY30 as dots at one fixed scale (dotField() in src/data/scenario.js), drawn
// as a living field by FloatingDots: solid for net emissions, hollow for what
// the levers abate against business as usual.
function DotField({ dots }) {
  const c = SCENARIO_UI.dots;
  return (
    <div className="dotfield">
      <div className="df-head">
        <span className="df-title">{c.title}</span>
        <span className="df-scale">{c.scale}</span>
      </div>
      <div className="df-field" role="img" aria-label={`${c.title}: ${dots.net} kt ${c.net.toLowerCase()}, ${dots.avoided} kt ${c.avoided.toLowerCase()}. ${c.scale}.`}>
        <FloatingDots net={dots.net} avoided={dots.avoided} />
      </div>
      <div className="df-legend">
        <span><i className="on" aria-hidden="true" />{c.net}<b>{dots.net} kt</b></span>
        <span><i aria-hidden="true" />{c.avoided}<b>{dots.avoided} kt</b></span>
        <span className="df-basis">{c.basis}</span>
      </div>
    </div>
  );
}

export default function Scenario() {
  const [scn, setScn] = useState({ sector: 'property', grid: 'base', lv: 'base', hv: 'base', plant: 'base', rev: 'moderate' });
  const result = useMemo(() => runModel(scn), [scn]);
  const labels = LEVER_LABELS[result.leverKey];
  const sectorDesc = resolveSector(scn.sector).desc;

  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const builtRef = useRef(false);
  const legendRef = useRef(null);

  const set = (key, value) => setScn((s) => ({ ...s, [key]: value }));

  // Build the chart once.
  useEffect(() => {
    const ctx = canvasRef.current;
    if (!ctx) return;
    const ch = new Chart(ctx.getContext('2d'), {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [
          { label: 'Net emissions', data: [], borderColor: '#17190D', borderWidth: 2.5, backgroundColor: 'rgba(23,25,13,0.10)', fill: 'origin', pointRadius: 0, tension: 0.15 },
          { label: 'Grid Decarbonisation', data: [], borderColor: 'transparent', borderWidth: 0, backgroundColor: 'rgba(208,240,85,0.55)', fill: '-1', pointRadius: 0, tension: 0.15 },
          { label: 'LV Fleet', data: [], borderColor: 'transparent', borderWidth: 0, backgroundColor: 'rgba(94,107,30,0.38)', fill: '-1', pointRadius: 0, tension: 0.15 },
          { label: 'HV Fleet', data: [], borderColor: 'transparent', borderWidth: 0, backgroundColor: 'rgba(140,144,128,0.34)', fill: '-1', pointRadius: 0, tension: 0.15 },
          { label: 'Plant Electrification', data: [], borderColor: 'transparent', borderWidth: 0, backgroundColor: 'rgba(39,46,9,0.26)', fill: '-1', pointRadius: 0, tension: 0.15 },
          { label: 'Business as usual', data: [], borderColor: 'rgba(23,25,13,0.45)', borderWidth: 1.5, borderDash: [5, 4], backgroundColor: 'transparent', fill: false, pointRadius: 0, tension: 0 },
          { label: 'History (illustrative)', data: [], borderColor: '#535648', borderWidth: 1.5, borderDash: [2, 3], backgroundColor: 'transparent', fill: false, pointRadius: 3, tension: 0, pointBackgroundColor: '#535648' },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (c) => c.dataset.label + ': ' + Math.round(c.raw).toLocaleString() + ' tCO₂-e' },
            backgroundColor: 'rgba(23,25,13,0.96)', titleColor: '#F9FAF6', bodyColor: 'rgba(249,250,246,0.85)',
            titleFont: { family: "'JetBrains Mono',monospace", size: 11 }, bodyFont: { family: "'JetBrains Mono',monospace", size: 11 },
            borderColor: 'rgba(181,196,43,0.5)', borderWidth: 1,
          },
        },
        scales: {
          x: { grid: { color: 'rgba(23,25,13,0.05)' }, ticks: { font: { family: "'JetBrains Mono',monospace", size: 11 }, color: '#626557', callback: (v, i) => (i % 5 === 0 ? 'FY' + (2020 + i) : '') } },
          y: { grid: { color: 'rgba(23,25,13,0.05)' }, title: { display: true, text: 'tCO₂-e', font: { size: 11 }, color: '#626557' }, ticks: { font: { family: "'JetBrains Mono',monospace", size: 11 }, color: '#626557', callback: (v) => (v / 1000).toFixed(0) + 'k' } },
        },
      },
    });
    chartRef.current = ch;

    // Scrollytelling build: wedges assemble on first view (unless already visible).
    const card = ctx.closest('.chart-card');
    const ORDER = [6, 5, 0, 1, 2, 3, 4];
    const reduce = prefersReducedMotion();
    let io;
    const timers = [];
    if (!reduce && card) {
      const r = card.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        builtRef.current = true;
      } else {
        ORDER.forEach((i) => ch.setDatasetVisibility(i, false));
        ch.update('none');
        io = new IntersectionObserver((es, o) => {
          es.forEach((e) => {
            if (!e.isIntersecting || builtRef.current) return;
            builtRef.current = true; o.disconnect();
            ORDER.forEach((i, k) => timers.push(setTimeout(() => { ch.setDatasetVisibility(i, true); ch.update(); }, k * 320)));
          });
        }, { threshold: 0.3 });
        io.observe(card);
      }
    } else {
      builtRef.current = true;
    }

    return () => { timers.forEach(clearTimeout); if (io) io.disconnect(); ch.destroy(); chartRef.current = null; };
  }, []);

  // Push model output + labels into the chart and the HTML legend whenever state changes.
  useEffect(() => {
    const ch = chartRef.current;
    if (!ch) return;
    const s = result.series;
    ch.data.datasets[0].data = s.net;
    ch.data.datasets[1].data = s.gridLayer;
    ch.data.datasets[2].data = s.lvLayer;
    ch.data.datasets[3].data = s.hvLayer;
    ch.data.datasets[4].data = s.plantLayer;
    ch.data.datasets[5].data = s.bau;
    ch.data.datasets[6].data = s.actuals;
    ch.data.datasets[1].label = labels.cbar.grid;
    ch.data.datasets[2].label = labels.cbar.lv;
    ch.data.datasets[3].label = labels.cbar.hv;
    ch.data.datasets[4].label = labels.cbar.plant;
    ch.update('none');
    if (legendRef.current) {
      legendRef.current.innerHTML = ch.data.datasets
        .map((d, i) => '<span class="cl-item">' + LEGEND_SWATCH[i] + d.label + '</span>').join('');
    }
  }, [result, labels]);

  const cbars = [
    { key: 'grid', cls: 'grid', fill: 'var(--series-1)', name: labels.cbar.grid, data: result.contrib.grid },
    { key: 'lv', cls: 'lv', fill: 'var(--series-2)', name: labels.cbar.lv, data: result.contrib.lv },
    { key: 'hv', cls: 'hv', fill: 'var(--series-3)', name: labels.cbar.hv, data: result.contrib.hv },
    { key: 'plant', cls: 'plant', fill: 'var(--series-4)', name: labels.cbar.plant, data: result.contrib.plant },
  ];

  return (
    <section id="scenario">
      <div className="canvas">
        <div className="sec-tag" data-idx={SCENARIO_UI.idx}><Icon name="target" size={30} />{SCENARIO_UI.tag}</div>
        <h2 className="display sec-title">
          <SplitText text={SCENARIO_UI.title} accentIndex={SCENARIO_UI.titleAccent} />
        </h2>
        <p className="tool-sub">{labels.sub}</p>
        {/* The state of the data, said before the data: a basis of preparation
            compressed to one paragraph, the same thing every tool page on this
            site carries. Deliberately not the "locked, approved, available for
            reporting" banner enterprise platforms run across a dataset. That one
            states who may still edit a figure, which says nothing about whether
            the figure was measured or modelled, and over a projection it reads
            as though approval had made the number true. This sentence used to
            sit under the sub-heading in 11px grey mono, far too quiet for the
            governing fact about every number below. */}
        <div className="basis-strip" role="note">
          <span className="basis-badge"><Icon name="book" size={18} />{SCENARIO_UI.basis.label}</span>
          <p className="basis-text">{SCENARIO_UI.basis.text}</p>
          <span className="basis-meta">{SCENARIO_UI.basis.meta}</span>
        </div>

        <div className="scn-grid">
          <div className="scn-controls">
            {/* Step 01 */}
            <div className="scn-step">
              <span className="scn-step-num"><Icon name="building" size={28} className="fpi-lead" />{SCENARIO_UI.steps[0].num}</span>
              <h3 className="scn-step-title">{SCENARIO_UI.steps[0].title}</h3>
              <p className="scn-step-sub">{SCENARIO_UI.steps[0].sub}</p>
              <div className="seg-profiles" role="group" aria-label="Operating profile">
                {SECTOR_OPTIONS.map((o) => (
                  <button key={o.value} type="button" className={'seg-btn' + (scn.sector === o.value ? ' on' : '')} aria-pressed={scn.sector === o.value} onClick={() => set('sector', o.value)}>{o.label}</button>
                ))}
              </div>
              <p className="sector-desc">{sectorDesc}</p>
            </div>

            {/* Step 02 */}
            <div className="scn-step">
              <span className="scn-step-num"><Icon name="bolt" size={28} className="fpi-lead" />{SCENARIO_UI.steps[1].num}</span>
              <h3 className="scn-step-title">{SCENARIO_UI.steps[1].title}</h3>
              <p className="scn-step-sub">{SCENARIO_UI.steps[1].sub}</p>
              <div className="lever-deck">
                {LEVERS.map((lv) => (
                  <div className="lever-card" key={lv.key} style={{ '--lc': lv.lc }}>
                    <div className="lever-top"><span className="lever-dot" aria-hidden="true" /><span className="lever-name">{labels[lv.key].name}</span></div>
                    <div className="lever-src">{labels[lv.key].src}</div>
                    <Seg value={scn[lv.key]} options={lv.opts} onChange={(v) => set(lv.key, v)} sc={lv.sc} small label={labels[lv.key].name} />
                  </div>
                ))}
                <div className="lever-card lever-card-rev" style={{ '--lc': 'var(--grey-mid)' }}>
                  <div className="lever-top"><span className="lever-dot" aria-hidden="true" /><span className="lever-name">{SCENARIO_UI.growth.name}</span></div>
                  <div className="lever-src">{SCENARIO_UI.growth.src}</div>
                  <Seg value={scn.rev} options={REV_OPTS} onChange={(v) => set('rev', v)} sc="var(--ink-2)" small label={SCENARIO_UI.growth.name} />
                </div>
              </div>
            </div>
          </div>

          {/* Step 03 */}
          <div className="scn-results">
            <div className="scn-step">
              <span className="scn-step-num"><Icon name="chart" size={28} className="fpi-lead" />{SCENARIO_UI.steps[2].num}</span>
              <h3 className="scn-step-title">{SCENARIO_UI.steps[2].title}</h3>
              <p className="scn-step-sub">{SCENARIO_UI.steps[2].sub}</p>
              <p className="takeaway" aria-live="polite">
                {result.takeaway.head}<em>{result.takeaway.value}</em>{result.takeaway.tail}
                <span className="tk-note">{result.takeaway.note}</span>
              </p>
              {/* What produced the numbers. On a wide screen the levers sit
                  alongside; on anything narrower they are several screens back,
                  and a result panel that does not restate its own settings
                  makes you go and find them. */}
              <div className="scn-frame">
                <span className="scn-frame-lead">{SCENARIO_UI.frameLead}</span>
                <span className="scn-frame-chip scn-frame-profile">{result.frame.profile}</span>
                {result.frame.levers.map((l) => (
                  <span className="scn-frame-chip" key={l.name}>{l.name}<b>{l.set}</b></span>
                ))}
                <span className="scn-frame-chip">{SCENARIO_UI.frameGrowth}<b>{result.frame.growth}</b></span>
              </div>
              {/* Each tile carries its comparator and its change rather than a
                  bare value. The change is signed, so its direction survives
                  without the colour. */}
              <div className="kpi-strip">
                {result.kpis.map((k) => (
                  <div className={'kpi' + (k.live ? ' live' : '')} key={k.key}>
                    <div className="kpi-l">{k.label}</div>
                    <div className="kpi-v">{k.value}</div>
                    {k.base && <div className="kpi-base">{k.base}</div>}
                    {k.change && (
                      <div className={'kpi-chg kpi-chg-' + k.dir}>
                        {k.change.map((c) => <span key={c}>{c}</span>)}
                      </div>
                    )}
                    {k.note && <div className="kpi-note">{k.note}</div>}
                  </div>
                ))}
              </div>
              <DotField dots={result.dots} />
              <div className="chart-card">
                <div className="chart-head"><div className="chart-title">{result.chartTitle}</div></div>
                <div className="chart-sub">{SCENARIO_UI.chartSub}</div>
                <div className="chart-wrap"><canvas ref={canvasRef} role="img" aria-label="Line chart of the modelled emissions pathway from FY2020 to FY2050, showing net emissions against business-as-usual with coloured abatement wedges per lever" /></div>
                <div className="chart-legend" ref={legendRef} aria-hidden="true" />
              </div>
              <div className="contrib-card">
                <div className="chart-head"><div className="chart-title">{SCENARIO_UI.contrib.title}</div></div>
                <div className="chart-sub contrib-sub">{SCENARIO_UI.contrib.sub}</div>
                {/* One grid for all four rows, so the bars start on one line
                    whatever the length of each lever's name. */}
                <div className="cbar-list">
                  {cbars.map((c) => (
                    <div className="cbar" key={c.key}>
                      <div className={'cbar-name ' + c.cls}>{c.name}</div>
                      <div className="cbar-track"><div className="cbar-fill" style={{ transform: 'scaleX(' + c.data.width / 100 + ')', background: c.fill }} /></div>
                      <div className="cbar-val">{c.data.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="scn-foot">
          <p>{SCENARIO_UI.foot}</p>
          <a href="work/" className="btn btn-primary">{SCENARIO_UI.footCta}</a>
        </div>
      </div>
    </section>
  );
}
