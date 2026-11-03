// The Target Tracker (/targets/). An ASX50 net zero tracker that puts one
// thing next to another: the trajectory a company has claimed, and the Scope 1
// and 2 emissions it has actually reported.
//
// Closest sibling on the site is /progress/ and it shares that page's chrome,
// its sec-tag rhythm and its data honesty conventions (one META.updated field
// rendered top and bottom, sources with access dates, a status flag on
// everything). The difference is that this page is a ledger rather than a
// scroll story, so the middle of it is a filterable card grid.
//
// Charts are hand-drawn SVG, no chart library. They are decorative in the
// accessibility sense: the plain sentence beside each one carries the reading.

import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { useInView } from 'framer-motion';
import { SkipLink, Grain, ScrollProgress } from '../components/Chrome';
import { ToolNav, ToolFooter } from '../components/ToolNav';
import Icon from '../components/Icons';
import { prefersReducedMotion } from '../utils/media';
import {
  claimedPath, chartDomain, assess, aggregate, sectors, fmtMt, yearLabel,
} from './lib';
import {
  META, INTRO, READING, STATUS, TRACK, UI, COMPANIES, SPOTLIGHTS, SUMMARY,
  METHOD, SOURCES, FOOT,
} from './data';

const TRACK_ORDER = ['ahead', 'on', 'behind', 'na'];

// How many company cards, and how many companies' source lists, show before
// "Show all". Rendering all fifty cards made the ledger about 23,000px tall on
// desktop, so it opens on a preview. Filters and sorts always run over the
// whole set; only the rendering is capped.
const PREVIEW = { wide: 6, narrow: 3 };
const NARROW_QUERY = '(max-width: 680px)';

function useNarrow() {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(NARROW_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia?.(NARROW_QUERY);
    if (!mq) return undefined;
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return narrow;
}

const fill = (tpl, vals) => Object.keys(vals).reduce((t, k) => t.replace('{' + k + '}', vals[k]), tpl);

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

// ---------------------------------------------------------------------------
// Small shared pieces
// ---------------------------------------------------------------------------

// Count from 0 to `to` once `run` turns true. Under reduced motion it renders
// the final value immediately and never animates. Same behaviour as /progress/.
function CountUp({ to, run }) {
  const reduced = useMemo(prefersReducedMotion, []);
  const [val, setVal] = useState(reduced ? to : 0);
  useEffect(() => {
    if (reduced || !run) return undefined;
    let raf;
    const dur = 1100;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to, reduced]);
  return <>{Math.round(reduced ? to : val)}</>;
}

function UpdatedStamp({ placement }) {
  return (
    <div className={'tt-updated tt-updated-' + placement}>
      <span className="tt-updated-dot" aria-hidden="true" />
      <span className="tt-updated-label">Last updated</span>
      <span className="tt-updated-date">{META.updated}</span>
      <span className="tt-updated-cadence">{META.cadence}</span>
    </div>
  );
}

// A source line, from a { name, detail, url, accessed } object.
function SourceLine({ s }) {
  if (!s) return null;
  return (
    <li className="tt-src-item">
      <span className="tt-src-name">{s.name}</span>
      {s.detail && <span className="tt-src-detail">{s.detail}</span>}
      <span className="tt-src-meta">
        Accessed {s.accessed}
        {s.url && <> · <a href={s.url} target="_blank" rel="noopener noreferrer">Source</a></>}
      </span>
    </li>
  );
}

// ---------------------------------------------------------------------------
// The chart
// ---------------------------------------------------------------------------

const VB_W = 320;
const VB_H = 132;
const PAD = {
  l: 12, r: 12, t: 14, b: 20,
};

// Three marks and nothing else: the claimed path (dashed), the reported series
// (solid, with a dot per reported year), and a rule at the present year. The
// SVG is aria-hidden because the gap sentence beside it is the reading.
function Chart({ company }) {
  const ref = useRef(null);
  const reduced = useMemo(prefersReducedMotion, []);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  const path = useMemo(() => claimedPath(company), [company]);
  const dom = useMemo(() => chartDomain(company, path), [company, path]);

  if (!dom) return null;

  const spanX = dom.xMax - dom.xMin || 1;
  const spanY = dom.yMax || 1;
  const px = (y) => PAD.l + ((y - dom.xMin) / spanX) * (VB_W - PAD.l - PAD.r);
  const py = (mt) => (VB_H - PAD.b) - (mt / spanY) * (VB_H - PAD.t - PAD.b);
  const pts = (arr) => arr.map((p) => `${px(p.y).toFixed(1)},${py(p.mt).toFixed(1)}`).join(' ');

  const reported = company.reported || [];
  const drawn = reduced || inView;
  const nowX = px(META.nowYear);
  const showNow = META.nowYear >= dom.xMin && META.nowYear <= dom.xMax;

  return (
    <svg
      ref={ref}
      className="tt-chart"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width="100%"
      aria-hidden="true"
      focusable="false"
    >
      {/* Present year: everything left of this is record, everything right is claim. */}
      {showNow && (
        <>
          <line
            className="tt-c-now"
            x1={nowX}
            x2={nowX}
            y1={PAD.t - 4}
            y2={VB_H - PAD.b}
          />
          <text className="tt-c-tick" x={nowX} y={PAD.t - 7} textAnchor="middle">
            {META.nowYear}
          </text>
        </>
      )}

      {/* Baseline rule for the reported series to sit on. */}
      <line
        className="tt-c-base"
        x1={PAD.l}
        x2={VB_W - PAD.r}
        y1={VB_H - PAD.b}
        y2={VB_H - PAD.b}
      />

      {/* The claimed path. */}
      {path && (
        <polyline className="tt-c-claim" points={pts(path)} fill="none" />
      )}

      {/* The reported series. */}
      {reported.length > 1 && (
        <polyline
          className="tt-c-rep"
          points={pts(reported)}
          fill="none"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={drawn ? 0 : 1}
          style={{ transition: reduced ? 'none' : 'stroke-dashoffset 900ms var(--ease)' }}
        />
      )}
      {reported.map((p) => (
        <circle
          key={p.y}
          className="tt-c-dot"
          cx={px(p.y)}
          cy={py(p.mt)}
          r={reported.length <= 2 ? 3.2 : 2.2}
          style={{
            opacity: drawn ? 1 : 0,
            transition: reduced ? 'none' : 'opacity 400ms var(--ease) 700ms',
          }}
        />
      ))}

      {/* Range labels. */}
      <text className="tt-c-tick" x={PAD.l} y={VB_H - 6} textAnchor="start">
        {dom.xMin}
      </text>
      <text className="tt-c-tick" x={VB_W - PAD.r} y={VB_H - 6} textAnchor="end">
        {dom.xMax}
      </text>

      {/* Intensity only: say so inside the chart, where the line would be. */}
      {!path && (
        <text className="tt-c-note" x={VB_W / 2} y={PAD.t + 8} textAnchor="middle">
          {UI.card.noAbsolutePath}
        </text>
      )}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Readings built from assess()
// ---------------------------------------------------------------------------

function gapSentence(co, a) {
  if (!a.latest) return UI.gap.noData;
  if (a.claimed === null) return UI.gap.noLine;
  return `${yearLabel(co, a.latest.y)}: ${fmtMt(a.latest.mt)} ${UI.unit} ${UI.gap.reported} `
    + `${fmtMt(a.claimed)} ${UI.unit} ${UI.gap.claimed}`;
}

function deltaText(a) {
  if (a.track === 'na') return null;
  if (a.deltaPct === null || a.deltaPct === undefined) return UI.gap.zeroLine;
  if (a.track === 'on') return UI.gap.onLine;
  const abs = Math.abs(a.deltaPct).toFixed(1);
  return `${abs} ${a.deltaPct > 0 ? UI.gap.above : UI.gap.below}`;
}

// ---------------------------------------------------------------------------
// One company card
// ---------------------------------------------------------------------------

function CompanyCard({ co, a, onSources }) {
  const c = co.commitment || {};
  const hasSeries = (co.reported || []).length > 0;
  const nSrc = (co.sources || []).length;
  return (
    <article className="tt-card">
      <header className="tt-card-head">
        <span className="tt-ticker">{co.ticker}</span>
        <h3 className="tt-name">{co.name}</h3>
        <span className="tt-sector">{co.sector}</span>
      </header>

      <div className={'tt-target' + (c.netZeroYear ? '' : ' tt-target-none')}>
        {c.netZeroYear
          ? <><span className="tt-target-pre">{UI.card.targetPrefix}</span> {c.netZeroYear}</>
          : UI.card.noTarget}
      </div>

      {(c.flags || []).length > 0 && (
        <div className="tt-flags">
          {c.flags.map((f) => (
            <span className={'tt-flag tt-flag-' + f} key={f}>{UI.flags[f] || f}</span>
          ))}
        </div>
      )}

      {hasSeries
        ? <Chart company={co} />
        : <p className="tt-chart-empty">{UI.card.unverifiedChart}</p>}

      <p className="tt-gap">{gapSentence(co, a)}</p>
      <div className="tt-gap-row">
        <span className={'tt-track tt-track-' + a.track}>{TRACK[a.track]}</span>
        {deltaText(a) && <span className="tt-delta">{deltaText(a)}</span>}
      </div>

      <dl className="tt-facts">
        <div>
          <dt>{UI.card.scopesLabel}</dt>
          <dd>{c.scopes}</dd>
        </div>
        {co.baseline && (
          <div>
            <dt>{UI.card.baseLabel}</dt>
            <dd>{yearLabel(co, co.baseline.year)}, {fmtMt(co.baseline.mt)} {UI.unit}</dd>
          </div>
        )}
        {(c.interim || []).length > 0 && (
          <div>
            <dt>{UI.card.interimLabel}</dt>
            <dd>
              {c.interim.map((i, k) => (
                <span className="tt-interim" key={k}>
                  {i.cutPct}% by {i.year} {UI.card.vsLabel} {i.vsBaseYear}
                  {' '}
                  <em>{i.absolute ? UI.card.interimAbsolute : UI.card.interimIntensity}</em>
                </span>
              ))}
            </dd>
          </div>
        )}
        {c.scope3 && (
          <div>
            <dt>{UI.card.scope3Label}</dt>
            <dd>{c.scope3}</dd>
          </div>
        )}
        {co.boundaryNote && (
          <div>
            <dt>{UI.card.boundaryLabel}</dt>
            <dd>{co.boundaryNote}</dd>
          </div>
        )}
      </dl>

      {co.note && <p className="tt-note">{co.note}</p>}

      <footer className="tt-card-foot">
        <span className={'tt-chip tt-chip-' + co.status}>
          <span className="tt-chip-dot" aria-hidden="true" />{STATUS[co.status]}
        </span>
        <span className="tt-verified">{UI.card.verified} {co.verified}</span>
        <a
          className="tt-srccount"
          href={'#tt-src-' + co.id}
          onClick={(e) => { e.preventDefault(); onSources(co.id); }}
        >
          {nSrc} {nSrc === 1 ? UI.card.sourceOne : UI.card.sourceMany}
        </a>
      </footer>
    </article>
  );
}

// ---------------------------------------------------------------------------
// The static legend chart, drawn once beside the how-to-read copy
// ---------------------------------------------------------------------------

function DemoChart() {
  return (
    <svg className="tt-chart tt-demo" viewBox="0 0 320 132" width="100%" aria-hidden="true" focusable="false">
      <line className="tt-c-now" x1="150" x2="150" y1="10" y2="112" />
      <text className="tt-c-tick" x="150" y="7" textAnchor="middle">{META.nowYear}</text>
      <line className="tt-c-base" x1="12" x2="308" y1="112" y2="112" />
      <polyline className="tt-c-claim" fill="none" points="14,26 150,66 308,112" />
      <polyline className="tt-c-rep" fill="none" points="14,26 48,32 82,44 116,48 150,54" />
      {[[14, 26], [48, 32], [82, 44], [116, 48], [150, 54]].map(([cx, cy]) => (
        <circle className="tt-c-dot" key={cx} cx={cx} cy={cy} r="2.2" />
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TargetsApp() {
  const [sector, setSector] = useState('all');
  const [sort, setSort] = useState('name');
  const [track, setTrack] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const [srcAll, setSrcAll] = useState(false);
  const [srcTarget, setSrcTarget] = useState(null);
  const narrow = useNarrow();
  const preview = narrow ? PREVIEW.narrow : PREVIEW.wide;

  const scoreRef = useRef(null);
  const scoreInView = useInView(scoreRef, { once: true, margin: '-10% 0px' });

  // One assessment per company, reused by the scoreboard, the filters and the
  // cards so the page cannot disagree with itself.
  const reads = useMemo(() => {
    const m = {};
    COMPANIES.forEach((co) => { m[co.id] = assess(co); });
    return m;
  }, []);

  const agg = useMemo(() => aggregate(COMPANIES), []);
  const sectorList = useMemo(() => sectors(COMPANIES), []);

  const shown = useMemo(() => {
    const list = COMPANIES.filter((co) => {
      if (sector !== 'all' && co.sector !== sector) return false;
      if (track !== 'all' && reads[co.id].track !== track) return false;
      return true;
    });
    const gapOf = (co) => {
      const d = reads[co.id].deltaPct;
      return (d === null || d === undefined) ? null : d;
    };
    const byGap = (dir) => (a, b) => {
      const ga = gapOf(a);
      const gb = gapOf(b);
      if (ga === null && gb === null) return a.name.localeCompare(b.name);
      if (ga === null) return 1;
      if (gb === null) return -1;
      return dir * (gb - ga);
    };
    const sorted = list.slice();
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'year') {
      sorted.sort((a, b) => {
        const ya = (a.commitment && a.commitment.netZeroYear) || Infinity;
        const yb = (b.commitment && b.commitment.netZeroYear) || Infinity;
        return ya === yb ? a.name.localeCompare(b.name) : ya - yb;
      });
    } else if (sort === 'gapWorst') sorted.sort(byGap(1));
    else if (sort === 'gapBest') sorted.sort(byGap(-1));
    return sorted;
  }, [sector, sort, track, reads]);

  const capped = !showAll && shown.length > preview;
  const visible = capped ? shown.slice(0, preview) : shown;

  const srcCapped = !srcAll && COMPANIES.length > preview;
  const srcVisible = srcCapped ? COMPANIES.slice(0, preview) : COMPANIES;
  const srcTotal = useMemo(() => COMPANIES.reduce((n, co) => n + (co.sources || []).length, 0), []);

  // A card's "n sources" link opens the full list if the company sits past the
  // preview, then lands on that company's entry once it has rendered.
  const openSources = (id) => {
    setSrcAll(true);
    setSrcTarget(id);
  };
  useEffect(() => {
    if (!srcTarget) return;
    // Landing through the hash makes the entry :target, so it takes the nav
    // headroom from the one scroll-margin rule in global.css.
    const id = 'tt-src-' + srcTarget;
    if (window.location.hash === '#' + id) scrollToId(id);
    else window.location.hash = id;
    setSrcTarget(null);
  }, [srcTarget]);

  const scoreValues = {
    netZero: agg.withNetZero,
    interim: agg.with2030Interim,
    assessable: agg.assessable,
    behind: agg.byTrack.behind,
  };

  const spotCompanies = SPOTLIGHTS.items
    .map((it) => ({ it, co: COMPANIES.find((c) => c.id === it.id) }))
    .filter((x) => x.co);

  return (
    <>
      <SkipLink />
      <Grain />
      <ScrollProgress />
      <ToolNav home="../" />

      <main id="main-content">
        {/* Intro */}
        <section className="tt-hero" aria-labelledby="tt-hero-h">
          <div className="canvas tt-hero-inner">
            <div className="sec-tag" data-idx="00">
              <Icon name="target" size={32} />{INTRO.tag}
            </div>
            <div className="tt-kicker">{INTRO.kicker}</div>
            <h1 className="display tt-h1" id="tt-hero-h">
              {INTRO.title[0]}<br />
              <em>{INTRO.title[1]}</em>
            </h1>
            <p className="tt-sub">{INTRO.sub}</p>
            <p className="tt-read">{INTRO.read}</p>

            <UpdatedStamp placement="top" />

            <div className="tt-scroll-hint" aria-hidden="true">
              <span className="tt-scroll-line" />{INTRO.scroll} ↓
            </div>
          </div>
        </section>

        {/* Scoreboard */}
        <section className="tt-score" aria-labelledby="tt-score-h" ref={scoreRef}>
          <div className="canvas tt-inner">
            <div className="sec-tag" data-idx="01">
              <Icon name="chart" size={32} />{UI.score.tag}
            </div>
            <h2 className="display tt-h2 tt-h2-light" id="tt-score-h">
              {UI.score.title[0]} <em>{UI.score.title[1]}</em>
            </h2>
            <p className="tt-sub">{UI.score.lead}</p>

            <div className="tt-score-grid">
              {UI.score.items.map((it) => (
                <div className="tt-score-item" key={it.key}>
                  <div className="tt-score-num">
                    <CountUp to={scoreValues[it.key]} run={scoreInView} />
                  </div>
                  <p className="tt-score-label">{it.label}</p>
                </div>
              ))}
            </div>
            <p className="tt-score-note">{UI.score.note}</p>
          </div>
        </section>

        {/* How to read a chart */}
        <section className="tt-reading" aria-labelledby="tt-reading-h">
          <div className="canvas tt-inner">
            <div className="sec-tag" data-idx="02">
              <Icon name="book" size={32} />{READING.tag}
            </div>
            <h2 className="display tt-h2 tt-h2-light" id="tt-reading-h">
              {READING.title[0]} <em>{READING.title[1]}</em>
            </h2>
            <p className="tt-sub">{READING.lead}</p>

            <div className="tt-reading-grid">
              <div className="tt-reading-demo"><DemoChart /></div>
              <ul className="tt-legend">
                {READING.items.map((it) => (
                  <li className={'tt-legend-item tt-legend-' + it.key} key={it.key}>
                    <span className="tt-legend-mark" aria-hidden="true" />
                    <span className="tt-legend-label">{it.label}</span>
                    <span className="tt-legend-body">{it.body}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="tt-reading-note">{READING.note}</p>
          </div>
        </section>

        {/* The ledger */}
        <section className="tt-ledger" id="tt-ledger" aria-labelledby="tt-ledger-h">
          <div className="canvas tt-inner">
            <div className="sec-tag" data-idx="03">
              <Icon name="list" size={32} />{UI.ledger.tag}
            </div>
            <div className="tt-kicker">{UI.ledger.kicker}</div>
            <h2 className="display tt-h2 tt-h2-light" id="tt-ledger-h">
              {UI.ledger.title[0]} <em>{UI.ledger.title[1]}</em>
            </h2>
            <p className="tt-sub">{UI.ledger.lead}</p>

            <div className="tt-controls">
              <div className="tt-field">
                <label className="sr-only" htmlFor="tt-sector">{UI.ledger.sectorLabel}</label>
                <select
                  id="tt-sector"
                  className="tt-select"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                >
                  <option value="all">{UI.ledger.sectorAll}</option>
                  {sectorList.map((s) => <option value={s} key={s}>{s}</option>)}
                </select>
              </div>

              <div className="tt-field">
                <label className="sr-only" htmlFor="tt-sort">{UI.ledger.sortLabel}</label>
                <select
                  id="tt-sort"
                  className="tt-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  {UI.ledger.sorts.map((s) => (
                    <option value={s.id} key={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="tt-filters" role="group" aria-label={UI.ledger.trackLabel}>
                <button
                  type="button"
                  className={'tt-fchip' + (track === 'all' ? ' on' : '')}
                  aria-pressed={track === 'all'}
                  onClick={() => setTrack('all')}
                >
                  {UI.ledger.trackAll}
                </button>
                {TRACK_ORDER.map((t) => (
                  <button
                    type="button"
                    key={t}
                    className={'tt-fchip tt-fchip-' + t + (track === t ? ' on' : '')}
                    aria-pressed={track === t}
                    onClick={() => setTrack(t)}
                  >
                    {TRACK[t]}
                  </button>
                ))}
              </div>

              <p className="tt-count" role="status">
                {capped
                  ? fill(UI.ledger.countPart, { shown: visible.length, n: shown.length })
                  : `${shown.length} ${shown.length === 1 ? UI.ledger.countOne : UI.ledger.countMany}`}
              </p>
            </div>

            {shown.length === 0
              ? <p className="tt-empty">{UI.ledger.empty}</p>
              : (
                <div className="tt-grid" id="tt-grid">
                  {visible.map((co) => (
                    <CompanyCard key={co.id} co={co} a={reads[co.id]} onSources={openSources} />
                  ))}
                </div>
              )}
            {shown.length > preview && (
              <div className="tt-more">
                <button
                  type="button"
                  className="tt-more-btn"
                  aria-expanded={showAll}
                  aria-controls="tt-grid"
                  onClick={() => {
                    if (showAll) scrollToId('tt-ledger');
                    setShowAll((v) => !v);
                  }}
                >
                  {showAll ? UI.ledger.showFewer : fill(UI.ledger.showAll, { n: shown.length })}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Spotlights, on the one dark band. */}
        <section className="tt-dark" aria-labelledby="tt-spot-h">
          <div className="canvas tt-inner">
            <div className="sec-tag" data-idx="04">
              <Icon name="pin" size={32} />{SPOTLIGHTS.tag}
            </div>
            <div className="tt-kicker tt-kicker-dark">{SPOTLIGHTS.kicker}</div>
            <h2 className="display tt-h2" id="tt-spot-h">
              {SPOTLIGHTS.title[0]}<br />
              <em>{SPOTLIGHTS.title[1]}</em>
            </h2>
            <p className="tt-dark-lead">{SPOTLIGHTS.lead}</p>

            <div className="tt-spots">
              {spotCompanies.map(({ it, co }) => (
                <article className="tt-spot" key={it.id}>
                  <div className="tt-spot-head">
                    <span className="tt-ticker">{co.ticker}</span>
                    <h3 className="tt-spot-name">{it.head}</h3>
                  </div>
                  <div className="tt-spot-chart">
                    {(co.reported || []).length
                      ? <Chart company={co} />
                      : <p className="tt-chart-empty">{UI.card.unverifiedChart}</p>}
                  </div>
                  <p className="tt-spot-gap">{gapSentence(co, reads[co.id])}</p>
                  <p className="tt-spot-body">{it.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="tt-summary" aria-labelledby="tt-sum-h">
          <div className="canvas tt-inner">
            <div className="sec-tag" data-idx="05">
              <Icon name="target" size={32} />{SUMMARY.tag}
            </div>
            <div className="tt-kicker">{SUMMARY.kicker}</div>
            <h2 className="display tt-h2 tt-h2-light" id="tt-sum-h">
              {SUMMARY.title[0]} <em>{SUMMARY.title[1]}</em>
            </h2>
            <p className="tt-sub">{SUMMARY.lead}</p>

            <div className="tt-cols">
              <div className="tt-col">
                <div className="tt-col-head tt-col-up">{SUMMARY.moving.head}</div>
                <ul className="tt-col-list">
                  {SUMMARY.moving.items.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              </div>
              <div className="tt-col">
                <div className="tt-col-head tt-col-down">{SUMMARY.short.head}</div>
                <ul className="tt-col-list">
                  {SUMMARY.short.items.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              </div>
            </div>

            <p className="tt-close">{SUMMARY.close}</p>
          </div>
        </section>

        {/* Method / basis of preparation */}
        <section id="tt-method" aria-labelledby="tt-method-h">
          <div className="canvas tt-inner">
            <div className="sec-tag" data-idx="06">
              <Icon name="book" size={32} />{METHOD.tag}
            </div>
            <h2 className="display tt-h2 tt-h2-light" id="tt-method-h">
              {METHOD.title[0]} <em>{METHOD.title[1]}</em>
            </h2>
            <p className="tt-sub">{METHOD.sub}</p>

            <div className="tt-method-grid">
              {METHOD.blocks.map((b, i) => (
                <div className="tt-method-block" key={i}>
                  <h3><Icon name={b.icon} size={32} className="fpi-lead" />{b.title}</h3>
                  {b.paras.map((p, j) => <p key={j}>{p}</p>)}
                </div>
              ))}
            </div>

            <div className="tt-method-block tt-method-wide">
              <h3><Icon name="list" size={32} className="fpi-lead" />{UI.method.commonHead}</h3>
              <ul className="tt-src-list">
                {Object.keys(SOURCES).map((id) => <SourceLine key={id} s={SOURCES[id]} />)}
              </ul>
            </div>

            <section className="tt-method-block tt-method-wide" id="tt-percomp-block" aria-labelledby="tt-percomp-h">
              <h3 id="tt-percomp-h"><Icon name="building" size={32} className="fpi-lead" />{UI.method.perCompanyHead}</h3>
              <p className="tt-percomp-count">
                {fill(UI.method.perCompanyCount, { n: srcTotal, c: COMPANIES.length })}
              </p>
              <div className="tt-percomp" id="tt-percomp">
                {srcVisible.map((co) => (
                  <div className="tt-percomp-item" id={'tt-src-' + co.id} key={co.id}>
                    <div className="tt-percomp-name">
                      <span className="tt-ticker">{co.ticker}</span>{co.name}
                    </div>
                    <ul className="tt-src-list tt-src-list-tight">
                      {(co.sources || []).map((s, i) => <SourceLine key={i} s={s} />)}
                    </ul>
                  </div>
                ))}
              </div>
              {COMPANIES.length > preview && (
                <div className="tt-more">
                  <button
                    type="button"
                    className="tt-more-btn"
                    aria-expanded={srcAll}
                    aria-controls="tt-percomp"
                    onClick={() => {
                      if (srcAll) scrollToId('tt-percomp-block');
                      setSrcAll((v) => !v);
                    }}
                  >
                    {srcAll ? UI.method.showFewerSources : fill(UI.method.showAllSources, { n: COMPANIES.length })}
                  </button>
                </div>
              )}
            </section>

            <UpdatedStamp placement="bottom" />
          </div>
        </section>
      </main>

      <ToolFooter home="../" name={FOOT.name} back={FOOT.back} />
    </>
  );
}
