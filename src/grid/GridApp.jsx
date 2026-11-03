import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Grain, ScrollProgress, SkipLink } from '../components/Chrome';
import { ToolNav, ToolFooter } from '../components/ToolNav';
import Icon from '../components/Icons';
import Range from '../components/Range';
import { fetchLiveIntensity, OPENNEM_SOURCE } from '../lib/opennem';
import {
  INTRO, TABS, TABS_LABEL, REGIONS, NON_NEM_NOTE,
  TYPICAL_CURVES, TYPICAL_LABEL,
  bandFor, mixLine, windowLine, LIVE_COPY,
  LOCATION_FACTORS, EXPLORER_YEARS, EXPLORER_COPY,
  METHOD, METHOD_SOURCES, LAST_UPDATED,
} from './data';

const REFRESH_MS = 5 * 60 * 1000;

// Format an ISO timestamp as a local HH:MM. Falls back to null on bad input.
function hhmm(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false });
}

// Min/max of a numeric series, ignoring nulls.
function rangeOf(arr) {
  const vals = arr.filter((v) => typeof v === 'number' && Number.isFinite(v));
  if (!vals.length) return null;
  return { min: Math.min(...vals), max: Math.max(...vals) };
}

// The day chart. Measured, not scaled: the plot reports its pixel width and
// the svg takes a 1:1 viewBox from it, so the marker stays a circle at any
// width. The dot marks the reading shown above (markIdx), the axis names both
// ends, and the low and high of the series are printed under it. The
// accessible summary is the aria-label here plus the note the caller renders.
const SPARK_H = 120;
const SPARK_PAD = 6;
function Sparkline({ series, markIdx, ends, ariaLabel }) {
  const plotRef = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = plotRef.current;
    if (!el) return undefined;
    const measure = () => setW(Math.round(el.getBoundingClientRect().width));
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pts = series.map((v) => (typeof v === 'number' && Number.isFinite(v) ? v : null));
  const r = rangeOf(pts);
  if (!r) return null;
  const span = Math.max(1, r.max - r.min);
  const n = pts.length;
  const x = (i) => SPARK_PAD + (i / Math.max(1, n - 1)) * (w - SPARK_PAD * 2);
  const y = (v) => SPARK_H - SPARK_PAD - ((v - r.min) / span) * (SPARK_H - SPARK_PAD * 2);
  // Build a path, breaking the line across null gaps.
  let d = '';
  let pen = false;
  pts.forEach((v, i) => {
    if (v == null) { pen = false; return; }
    d += `${pen ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)} `;
    pen = true;
  });
  const lastIdx = (() => { for (let i = pts.length - 1; i >= 0; i--) if (pts[i] != null) return i; return -1; })();
  const dotIdx = markIdx != null && pts[markIdx] != null ? markIdx : lastIdx;
  return (
    <>
      <div className="gi-spark-plot" ref={plotRef}>
        {w > 0 && (
          <svg className="gi-spark-svg" width={w} height={SPARK_H} viewBox={`0 0 ${w} ${SPARK_H}`}
            role="img" aria-label={ariaLabel} focusable="false">
            <path className="gi-spark-line" d={d.trim()} />
            {dotIdx >= 0 && <circle className="gi-spark-dot" cx={x(dotIdx)} cy={y(pts[dotIdx])} r="4" />}
          </svg>
        )}
      </div>
      <div className="gi-spark-axis">
        <span>{ends[0]}</span>
        <span className="gi-spark-range">{LIVE_COPY.sparkRange(Math.round(r.min), Math.round(r.max))}</span>
        <span>{ends[1]}</span>
      </div>
    </>
  );
}

// ---- Live view -------------------------------------------------------------
function LiveView() {
  const [regionCode, setRegionCode] = useState('NSW1');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDay, setShowDay] = useState(false);
  const region = REGIONS.find((r) => r.code === regionCode);

  const load = useCallback(async (code) => {
    setLoading(true);
    const res = await fetchLiveIntensity(code);
    setLoading(false);
    setData({ ...res, _for: code });
  }, []);

  useEffect(() => {
    if (!region || !region.nem) { setData(null); return undefined; }
    let cancelled = false;
    const run = async () => { if (!cancelled) await load(regionCode); };
    run();
    const id = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') run();
    }, REFRESH_MS);
    const onVis = () => { if (document.visibilityState === 'visible') run(); };
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelled = true;
      clearInterval(id);
      if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVis);
    };
  }, [regionCode, region, load]);

  // Resolve the display model: live if we have it, otherwise the indicative
  // fallback for the region. Non-NEM regions get neither.
  const model = useMemo(() => {
    if (!region || !region.nem) return { kind: 'non-nem' };
    const hour = new Date().getHours();
    const live = data && data.live && data._for === regionCode;
    if (live) {
      const r = rangeOf(data.curve || []);
      const frac = r && r.max > r.min ? (data.gPerKWh - r.min) / (r.max - r.min) : null;
      return {
        kind: 'live',
        value: data.gPerKWh,
        curve: data.curve || [],
        band: bandFor(frac),
        asOf: hhmm(data.asOfISO),
        renewableShare: data.renewableShare,
        coalShare: data.coalShare,
        generationMW: data.generationMW,
        hour,
      };
    }
    // Fallback: read the indicative curve at the local hour.
    const curve = TYPICAL_CURVES[regionCode] || [];
    const val = curve[Math.min(hour, curve.length - 1)];
    const r = rangeOf(curve);
    const frac = r && r.max > r.min ? (val - r.min) / (r.max - r.min) : null;
    return {
      kind: 'fallback',
      value: val,
      curve,
      band: bandFor(frac),
      hour,
    };
  }, [region, regionCode, data]);

  const narrative = useMemo(() => {
    if (model.kind === 'live') {
      return `${mixLine({ renewableShare: model.renewableShare, coalShare: model.coalShare, label: region.label })} ${windowLine(model.hour)}`;
    }
    if (model.kind === 'fallback') {
      return `On a typical day the ${region.label} grid follows this shape. ${windowLine(model.hour)}`;
    }
    return '';
  }, [model, region]);

  return (
    <section id="gi-live">
      <div className="canvas">
        <div className="sec-tag" data-idx="01"><Icon name="bolt" size={32} />{LIVE_COPY.tag}</div>
        <h2 className="display gi-h2">{LIVE_COPY.heading}</h2>
        <p className="gi-sub">{LIVE_COPY.sub}</p>

        <div className="seg-row gi-regions" role="group" aria-label={LIVE_COPY.regionsLabel}>
          {REGIONS.map((r) => (
            <button
              key={r.code}
              type="button"
              className={`seg-btn${r.code === regionCode ? ' on' : ''}`}
              aria-pressed={r.code === regionCode}
              onClick={() => setRegionCode(r.code)}
            >
              {r.state}
            </button>
          ))}
        </div>

        {model.kind === 'non-nem' ? (
          <div className="gi-answer-card gi-non-nem">
            <div className="gi-kicker">{region.label} · {region.grid} grid</div>
            <p className="gi-non-nem-body">{NON_NEM_NOTE}</p>
          </div>
        ) : (
          <>
            <div className="gi-statebar">
              {model.kind === 'live' ? (
                <span className="gi-datastate gi-datastate-live">
                  <span className="gi-dot" aria-hidden="true" />
                  {model.asOf ? LIVE_COPY.liveState(model.asOf) : LIVE_COPY.liveStateNoTime}
                  <span className="gi-est-tag">{LIVE_COPY.estimateTag}</span>
                </span>
              ) : (
                <span className="gi-datastate gi-datastate-fallback">
                  {LIVE_COPY.fallbackState}
                </span>
              )}
              {loading && <span className="gi-refreshing" aria-live="polite">{LIVE_COPY.refreshing}</span>}
            </div>

            <div className={`gi-answer-card gi-band gi-band-${model.band.tone}`}>
              <div className="gi-answer-grid">
                <div className="gi-numblock">
                  <div className="gi-kicker">
                    {model.kind === 'fallback' ? LIVE_COPY.typicalNowLabel : LIVE_COPY.liveNowLabel}
                  </div>
                  <div className="gi-num" aria-hidden="true">
                    {model.value != null ? Math.round(model.value) : LIVE_COPY.noValue}
                    <span className="gi-unit">{LIVE_COPY.unit}</span>
                  </div>
                  <p className="sr-only">
                    {LIVE_COPY.srValue(model.value != null ? Math.round(model.value) : null)}
                  </p>
                </div>
                <div className="gi-verdictblock">
                  <div className="gi-band-kicker">{model.band.kicker}</div>
                  <div className="gi-verdict">{model.band.verdict}</div>
                  <p className="gi-logic">{model.band.logic}</p>
                </div>
              </div>
            </div>

            <p className="gi-context">{narrative}</p>

            {model.kind === 'live' && (
              <div className="gi-facts">
                <div className="gi-fact">
                  <span className="gi-fact-l">{LIVE_COPY.renewLabel}</span>
                  <span className="gi-fact-v">{Math.round((model.renewableShare || 0) * 100)}%</span>
                </div>
                <div className="gi-fact">
                  <span className="gi-fact-l">{LIVE_COPY.coalLabel}</span>
                  <span className="gi-fact-v">{Math.round((model.coalShare || 0) * 100)}%</span>
                </div>
                {model.generationMW != null && (
                  <div className="gi-fact">
                    <span className="gi-fact-l">{LIVE_COPY.genLabel}</span>
                    <span className="gi-fact-v">{model.generationMW.toLocaleString('en-AU')} MW</span>
                  </div>
                )}
              </div>
            )}

            <details className="gi-disclose" open={showDay}
              onToggle={(e) => setShowDay(e.currentTarget.open)}>
              <summary>{showDay ? LIVE_COPY.hideDay : LIVE_COPY.showDay}</summary>
              <div className="gi-spark">
                <Sparkline
                  series={model.curve}
                  markIdx={model.kind === 'fallback' ? model.hour : null}
                  ends={model.kind === 'fallback' ? LIVE_COPY.sparkEnds.typical : LIVE_COPY.sparkEnds.live}
                  ariaLabel={LIVE_COPY.sparkLabel(region.label, model.kind === 'live')}
                />
                <p className="gi-note">
                  {model.kind === 'fallback' ? LIVE_COPY.typicalSparkNote : LIVE_COPY.sparkNote}
                </p>
              </div>
            </details>

            {model.kind === 'fallback' && <p className="gi-note gi-typical-note">{TYPICAL_LABEL}</p>}
            <p className="gi-note">{LIVE_COPY.estimateFootnote}</p>
          </>
        )}
      </div>
    </section>
  );
}

// ---- Explorer view ---------------------------------------------------------
function ExplorerView() {
  const [yearId, setYearId] = useState(EXPLORER_YEARS[0].id);
  const [state, setState] = useState('NSW');
  const [cover, setCover] = useState(0); // 0..100
  const [lgc, setLgc] = useState(true);

  const year = EXPLORER_YEARS.find((y) => y.id === yearId) || EXPLORER_YEARS[0];
  const loc = LOCATION_FACTORS[state];
  const rmf = year.rmf;

  const coverFrac = cover / 100;
  const effective = lgc ? coverFrac : 0;
  const marketBased = (1 - effective) * rmf;

  const stateList = Object.keys(LOCATION_FACTORS);

  return (
    <section id="gi-explorer">
      <div className="canvas">
        <div className="sec-tag" data-idx="02"><Icon name="globe" size={32} />{EXPLORER_COPY.tag}</div>
        <h2 className="display gi-h2">{EXPLORER_COPY.heading}</h2>
        <p className="gi-sub">{EXPLORER_COPY.sub}</p>

        <div className="gi-ex-controls">
          <label className="gi-field">
            <span>{EXPLORER_COPY.yearLabel}</span>
            <select value={yearId} onChange={(e) => setYearId(e.target.value)}>
              {EXPLORER_YEARS.map((y) => <option key={y.id} value={y.id}>{y.label}</option>)}
            </select>
          </label>
          <label className="gi-field">
            <span>{EXPLORER_COPY.stateLabel}</span>
            <select value={state} onChange={(e) => setState(e.target.value)}>
              {stateList.map((s) => <option key={s} value={s}>{LOCATION_FACTORS[s].label}</option>)}
            </select>
          </label>
        </div>
        <p className="gi-note gi-year-note">{EXPLORER_COPY.yearNote}</p>

        <div className="gi-pair">
          <div className="gi-pairnum gi-pairnum-loc">
            <div className="gi-kicker">{EXPLORER_COPY.locTitle}</div>
            <div className="gi-pair-v">{loc.s2.toFixed(2)}<span>{EXPLORER_COPY.unit}</span></div>
            <p className="gi-pair-sub">{EXPLORER_COPY.locSub}</p>
            <div className="gi-pair-tag gi-pair-tag-fixed">{EXPLORER_COPY.locTag}</div>
          </div>
          <div className="gi-pairnum gi-pairnum-mkt">
            <div className="gi-kicker">{EXPLORER_COPY.mktTitle}</div>
            <div className="gi-pair-v">{marketBased.toFixed(2)}<span>{EXPLORER_COPY.unit}</span></div>
            <p className="gi-pair-sub">{EXPLORER_COPY.mktSub}</p>
            <div className="gi-pair-tag gi-pair-tag-live">{EXPLORER_COPY.mktTag}</div>
          </div>
        </div>

        <div className="gi-levers">
          <div className="gi-lever">
            <div className="gi-lever-top">
              <span className="gi-lever-name">{EXPLORER_COPY.coverLabel}</span>
              <span className="gi-lever-val">{cover}%</span>
            </div>
            <Range
              className="gi-range"
              min={0} max={100} step={5}
              ticks={20}
              value={cover}
              onChange={(e) => setCover(Number(e.target.value))}
              aria-label={EXPLORER_COPY.coverLabel}
              aria-valuetext={EXPLORER_COPY.coverValueText(cover)}
            />
            <p className="gi-lever-hint">{EXPLORER_COPY.coverHint}</p>
          </div>
          <div className="gi-lever">
            <div className="gi-lever-top">
              <span className="gi-lever-name">{EXPLORER_COPY.lgcLabel}</span>
            </div>
            <div className="seg-row gi-lgc" role="group" aria-label={EXPLORER_COPY.lgcLabel}>
              <button type="button" className={`seg-btn${lgc ? ' on' : ''}`} aria-pressed={lgc} onClick={() => setLgc(true)}>{EXPLORER_COPY.lgcOn}</button>
              <button type="button" className={`seg-btn${!lgc ? ' on' : ''}`} aria-pressed={!lgc} onClick={() => setLgc(false)}>{EXPLORER_COPY.lgcOff}</button>
            </div>
            <p className="gi-lever-hint">{EXPLORER_COPY.lgcHint}</p>
          </div>
        </div>

        <p className="gi-explain" aria-live="polite">{EXPLORER_COPY.explain(loc.s2, effective, lgc)}</p>

        <div className="gi-math">
          <div className="gi-kicker"><Icon name="list" size={28} className="fpi-lead" />{EXPLORER_COPY.mathTitle}</div>
          <p className="gi-math-line">{EXPLORER_COPY.mathLine}</p>
          <p className="gi-math-now">
            {LOCATION_FACTORS[state].label}, {year.label}: (1 − {effective.toFixed(2)}) × {rmf.toFixed(2)} = <strong>{marketBased.toFixed(2)}</strong> {EXPLORER_COPY.unit}
          </p>
          <p className="gi-note">{EXPLORER_COPY.mathNote}</p>
        </div>
      </div>
    </section>
  );
}

// ---- Method ----------------------------------------------------------------
function MethodSection() {
  const allSources = [OPENNEM_SOURCE, ...METHOD_SOURCES];
  return (
    <section id="gi-method">
      <div className="canvas">
        <div className="sec-tag" data-idx="03"><Icon name="book" size={32} />{METHOD.tag}</div>
        <h2 className="display gi-h2">{METHOD.title[0]} {METHOD.title[1]}</h2>
        <p className="gi-sub">{METHOD.sub}</p>

        <div className="gi-method-grid">
          {METHOD.blocks.filter((b) => !b.wide).map((b, i) => (
            <div className="gi-method-block" key={i}>
              <h3><Icon name={b.icon} size={30} className="fpi-lead" />{b.title}</h3>
              {b.paras.map((p, j) => <p key={j}>{p}</p>)}
            </div>
          ))}
          {METHOD.blocks.filter((b) => b.wide).map((b, i) => (
            <div className="gi-method-block gi-method-wide" key={i}>
              <h3><Icon name={b.icon} size={30} className="fpi-lead" />{b.title}</h3>
              <ul className="gi-exclusions">
                {b.exclusions.map((x, j) => <li key={j}>{x}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="gi-method-block gi-method-sources">
          <h3><Icon name="list" size={30} className="fpi-lead" />{METHOD.sourcesTitle}</h3>
          <p>{METHOD.sourcesSub}</p>
          <ul className="gi-sources">
            {allSources.map((s, i) => (
              <li key={i}>
                <span className="gi-src-name">{s.name}</span>
                <span className="gi-src-detail">{s.detail}</span>
                <span className="gi-src-meta">
                  {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer">{METHOD.sourceLink}</a>}
                  {s.accessed && <span className="gi-src-acc">{METHOD.accessed(s.accessed)}</span>}
                </span>
              </li>
            ))}
          </ul>
          <p className="gi-note">{METHOD.lastChecked(LAST_UPDATED)}</p>
        </div>
      </div>
    </section>
  );
}

export default function GridApp() {
  const [tab, setTab] = useState('live');

  return (
    <div className="gi-page">
      <SkipLink />
      <Grain />
      <ScrollProgress />
      <ToolNav home="../" />

      <main id="main-content">
        <section id="gi-intro">
          <div className="canvas">
            <div className="sec-tag" data-idx="00"><Icon name="bolt" size={32} />{INTRO.tag}</div>
            <h1 className="display gi-h1">{INTRO.title[0]} <em>{INTRO.title[1]}</em></h1>
            <p className="gi-lead">{INTRO.lead}</p>
            <div className="gi-chips">
              {INTRO.chips.map((c) => <span className="gi-chip" key={c}>{c}</span>)}
            </div>
            <p className="gi-disc">{INTRO.note}</p>

            <div className="seg-row gi-tabs" role="group" aria-label={TABS_LABEL}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={tab === t.id}
                  className={`seg-btn${tab === t.id ? ' on' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {tab === 'live' ? <LiveView /> : <ExplorerView />}
        <MethodSection />
      </main>

      <ToolFooter home="../" />
    </div>
  );
}
