import { useEffect, useRef, useState } from 'react';
import {
  Chart, BarController, BarElement, LineController, LineElement, PointElement,
  LinearScale, CategoryScale, Filler, Tooltip,
} from 'chart.js';
import { CATEGORIES, categoryById } from './data/factors';
import { CHART_UI, EFFORT_LABELS } from './data/copy';
import { fill } from './data/storyCopy';
import { prefersReducedMotion } from '../utils/media';

// Register only what these charts use; chart.js/auto doubles the bundle.
Chart.register(BarController, BarElement, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

const MONO = "'JetBrains Mono',monospace";
const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(23,28,19,0.96)', titleColor: '#F4F6EE', bodyColor: 'rgba(244,246,238,0.85)',
  titleFont: { family: MONO, size: 11 }, bodyFont: { family: MONO, size: 11 },
  borderColor: 'rgba(181,196,43,0.5)', borderWidth: 1,
};
const AXIS_TICKS = { font: { family: MONO, size: 11 }, color: '#65695B' };
const GRID = { color: 'rgba(33,48,15,0.06)' };

// The one month list the footprint charts and dashboard both read from.
export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const monthLabel = (key) => {
  const [y, m] = key.split('-');
  return MONTH_NAMES[Number(m) - 1].slice(0, 3) + ' ' + y.slice(2);
};

// Pathway series colours, exported so the legend in Plan.jsx renders from the
// same values the datasets draw with.
export const PATHWAY_COLORS = { bau: '#6E7469', plan: '#1F2A1E', planFill: 'rgba(117,130,29,0.14)', budget: '#C7274A' };

// ---------------------------------------------------------------------------
// Monthly stacked bars by category.
// ---------------------------------------------------------------------------
export function TrendChart({ agg }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;
    if (!ctx) return;
    const ch = new Chart(ctx.getContext('2d'), {
      type: 'bar',
      data: { labels: [], datasets: [] },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: prefersReducedMotion() ? false : { duration: 350 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            ...TOOLTIP_STYLE,
            callbacks: {
              label: (c) => ' ' + c.dataset.label + ': ' + (Math.round(c.raw * 100) / 100).toFixed(2) + ' t',
              footer: (items) => fill(CHART_UI.monthTotal, { t: (Math.round(items.reduce((s, i) => s + i.raw, 0) * 100) / 100).toFixed(2) }),
            },
            footerFont: { family: MONO, size: 11 },
          },
        },
        scales: {
          // Horizontal month labels with auto-skip: on a phone the twelve
          // labels would otherwise rotate and collide.
          x: { stacked: true, grid: { display: false }, ticks: { ...AXIS_TICKS, maxRotation: 0, autoSkip: true, autoSkipPadding: 10 } },
          y: { stacked: true, grid: GRID, ticks: AXIS_TICKS, title: { display: true, text: 'tCO₂-e / month', font: { size: 11 }, color: '#65695B' } },
        },
      },
    });
    chartRef.current = ch;
    return () => { ch.destroy(); chartRef.current = null; };
  }, []);

  useEffect(() => {
    const ch = chartRef.current;
    if (!ch) return;
    ch.data.labels = agg.months.map(monthLabel);
    ch.data.datasets = CATEGORIES
      .filter((cat) => agg.months.some((m) => (agg.byMonth[m][cat.id] || 0) > 0))
      .map((cat) => ({
        label: cat.label,
        data: agg.months.map((m) => agg.byMonth[m][cat.id] || 0),
        backgroundColor: cat.hex,
        // 2px surface gap between stacked segments and bars.
        borderColor: '#FFFFFF', borderWidth: 1,
        maxBarThickness: 44,
      }));
    ch.update(prefersReducedMotion() ? 'none' : undefined);
  }, [agg]);

  return (
    <div className="fp-chart-wrap" style={{ height: 260 }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={'Stacked monthly bar chart of the footprint by category. Worst month ' + (agg.worstMonth ? monthLabel(agg.worstMonth.month) + ' at ' + agg.worstMonth.total.toFixed(2) + ' tonnes.' : 'not available.')}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pathway line chart: frozen habits vs plan vs the 2030 budget line.
// ---------------------------------------------------------------------------
export function PathwayChart({ pathway, budget, labels }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;
    if (!ctx) return;
    const ch = new Chart(ctx.getContext('2d'), {
      type: 'line',
      data: { labels: [], datasets: [
        { label: labels.bau, data: [], borderColor: PATHWAY_COLORS.bau, borderWidth: 2, borderDash: [5, 4], pointRadius: 0, fill: false, tension: 0.15 },
        { label: labels.plan, data: [], borderColor: PATHWAY_COLORS.plan, borderWidth: 2.5, backgroundColor: PATHWAY_COLORS.planFill, fill: 'origin', pointRadius: 0, tension: 0.15 },
        { label: labels.budget, data: [], borderColor: PATHWAY_COLORS.budget, borderWidth: 1.5, borderDash: [2, 3], pointRadius: 0, fill: false },
      ] },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: prefersReducedMotion() ? false : { duration: 350 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            ...TOOLTIP_STYLE,
            callbacks: { label: (c) => ' ' + c.dataset.label + ': ' + (Math.round(c.raw * 100) / 100).toFixed(2) + ' t' },
          },
        },
        scales: {
          x: { grid: GRID, ticks: AXIS_TICKS },
          y: { grid: GRID, beginAtZero: true, ticks: AXIS_TICKS, title: { display: true, text: 'tCO₂-e / year', font: { size: 11 }, color: '#65695B' } },
        },
      },
    });
    chartRef.current = ch;
    return () => { ch.destroy(); chartRef.current = null; };
  }, [labels.bau, labels.plan, labels.budget]);

  useEffect(() => {
    const ch = chartRef.current;
    if (!ch) return;
    ch.data.labels = pathway.years.map((y) => 'FY' + y);
    ch.data.datasets[0].data = pathway.bau;
    ch.data.datasets[1].data = pathway.plan;
    ch.data.datasets[2].data = pathway.years.map(() => budget);
    ch.update('none');
  }, [pathway, budget]);

  return (
    <div className="fp-chart-wrap" style={{ height: 280 }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={'Line chart of the projected annual footprint. With the current plan the pathway reaches ' + pathway.plan[pathway.plan.length - 1].toFixed(1) + ' tonnes by FY' + pathway.years[pathway.years.length - 1] + ', against a 1.5 degree budget of ' + budget + ' tonnes.'}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Personal MACC: variable-width bars, cost per tonne (y) against cumulative
// abatement (x). Custom SVG because no charting library draws one accurately.
// The drawing squeezes to the container: below ~620px the viewBox narrows so
// on-chart text renders near CSS size instead of scaling away to nothing,
// and bars answer to tap as well as hover and focus.
// ---------------------------------------------------------------------------
export function MaccChart({ rows }) {
  const [tip, setTip] = useState(null);
  const [compact, setCompact] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver((entries) => {
      const w = entries[entries.length - 1].contentRect.width;
      if (w > 0) setCompact(w < 620);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const live = rows.filter((r) => r.applicable && r.reduction > 0.004 && r.costPerTonne != null)
    .sort((a, b) => a.costPerTonne - b.costPerTonne);
  if (!live.length) return <p className="fp-empty">{CHART_UI.maccEmpty}</p>;

  const W = compact ? 440 : 720;
  const H = compact ? 330 : 300;
  const padL = compact ? 52 : 56;
  const padR = compact ? 6 : 10;
  const padT = compact ? 20 : 16;
  const padB = compact ? 40 : 34;
  // Font sizes in viewBox units: the compact viewBox renders close to 1:1 on
  // a phone, so these land near their CSS-pixel size.
  const fsTick = compact ? 13 : 11;
  const fsLabel = compact ? 12.5 : 11.5;
  const totalRed = live.reduce((s, r) => s + r.reduction, 0);

  // MACC-standard axis capping: tiny-tonnage behavioural options can carry
  // enormous negative $/t and would squash every other bar. Bars beyond the
  // cap draw to the cap and are flagged; the exact figure stays in the label.
  const CAP_MIN = -1200, CAP_MAX = 2500;
  const disp = (c) => Math.max(CAP_MIN, Math.min(CAP_MAX, c));
  const clamped = live.some((r) => r.costPerTonne < CAP_MIN || r.costPerTonne > CAP_MAX);
  const minC = Math.min(-50, ...live.map((r) => disp(r.costPerTonne)));
  const maxC = Math.max(150, ...live.map((r) => disp(r.costPerTonne)));
  const xFor = (cum) => padL + (cum / totalRed) * (W - padL - padR);
  const yFor = (c) => padT + ((maxC - c) / (maxC - minC)) * (H - padT - padB);
  const y0 = yFor(0);

  let tickStep = (maxC - minC) > 1500 ? 500 : (maxC - minC) > 600 ? 250 : 100;
  // Fewer, bigger gridline labels on a narrow chart.
  if (compact && (maxC - minC) / tickStep > 4) tickStep *= 2;
  const yTicks = [];
  for (let v = Math.ceil(minC / tickStep) * tickStep; v <= maxC; v += tickStep) yTicks.push(v);
  if (!yTicks.includes(0)) yTicks.push(0);

  const pinnedId = tip && tip.pinned ? tip.id : null;
  const togglePin = (b) => setTip((t) => (t && t.id === b.id && t.pinned ? null : { ...b, pinned: true }));

  let cum = 0;
  const bars = live.map((r) => {
    const x = xFor(cum) + 1;
    const w = Math.max(2, xFor(cum + r.reduction) - xFor(cum) - 2);
    cum += r.reduction;
    const yv = yFor(disp(r.costPerTonne));
    const offScale = r.costPerTonne < CAP_MIN || r.costPerTonne > CAP_MAX;
    return { ...r, x, w, y: Math.min(y0, yv), h: Math.max(2, Math.abs(y0 - yv)), below: r.costPerTonne < 0, offScale };
  });

  return (
    <div className="fp-macc" ref={wrapRef}>
      {/* role="group", not "img": the bars inside are focusable buttons, and
          an img ancestor would flatten them away from assistive tech. */}
      <svg viewBox={'0 0 ' + W + ' ' + H} role="group" style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-label={'Marginal abatement cost curve: ' + live.map((r) => r.action + ' abates ' + r.reduction.toFixed(2) + ' tonnes a year at ' + (r.costPerTonne < 0 ? 'a saving of $' + Math.abs(r.costPerTonne) : '$' + r.costPerTonne) + ' per tonne').join('; ') + '.'}>
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={padL} x2={W - padR} y1={yFor(v)} y2={yFor(v)} stroke="rgba(33,48,15,0.08)" strokeWidth="1" />
            <text x={padL - 6} y={yFor(v) + 4} textAnchor="end" fontSize={fsTick} fontFamily="JetBrains Mono, monospace" fill="#65695B">{'$' + v.toLocaleString()}</text>
          </g>
        ))}
        <line x1={padL} x2={W - padR} y1={y0} y2={y0} stroke="#4A4F42" strokeWidth="1.5" />
        {/* Enter and Space never reach onClick on an SVG group, so the pin
            toggle answers the keys itself via onKeyDown. */}
        {bars.map((b) => (
          <g key={b.id} tabIndex={0} className="fp-macc-bar" role="button" aria-pressed={pinnedId === b.id}
            aria-label={b.action + ': ' + b.reduction.toFixed(2) + ' tonnes a year at ' + (b.costPerTonne < 0 ? 'a saving of $' + Math.abs(b.costPerTonne) : '$' + b.costPerTonne) + ' per tonne' + (b.offScale ? ', beyond the axis cap' : '')}
            onMouseEnter={() => setTip(b)} onMouseLeave={() => setTip((t) => (t && t.id === b.id && !t.pinned ? null : t))}
            onFocus={() => setTip(b)} onBlur={() => setTip((t) => (t && t.id === b.id && !t.pinned ? null : t))}
            onClick={() => togglePin(b)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePin(b); } }}>
            <title>{b.action + ': ' + b.reduction.toFixed(2) + ' t/yr at ' + (b.costPerTonne < 0 ? '-$' + Math.abs(b.costPerTonne) : '$' + b.costPerTonne) + '/t' + (b.offScale ? ' (beyond the axis cap)' : '')}</title>
            {/* Invisible hit area widens skinny bars to a tappable target. */}
            <rect x={b.x - 4} y={padT} width={b.w + 8} height={H - padT - padB} fill="transparent" />
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={categoryById(b.category).hex} opacity="0.85" rx="2" />
            {b.offScale && (
              <text x={b.x + b.w / 2} y={b.below ? b.y + b.h - 4 : b.y + 12} textAnchor="middle" fontSize={fsTick} fontWeight="700" fill="#FFFFFF">⌄</text>
            )}
          </g>
        ))}
        <text x={W - padR} y={H - 8} textAnchor="end" fontSize={fsLabel} fontFamily="JetBrains Mono, monospace" fill="#65695B">
          {'cumulative abatement → ' + totalRed.toFixed(1) + ' t/yr'}
        </text>
        <text x={14} y={padT + 2} fontSize={fsLabel} fontFamily="JetBrains Mono, monospace" fill="#65695B" transform={'rotate(-90 14 ' + (padT + 2) + ')'} textAnchor="end">$ per tonne</text>
      </svg>
      <div className="fp-macc-tip" aria-live="polite">
        {tip ? (
          <>
            <span className="fp-macc-tip-dot" style={{ background: categoryById(tip.category).hex }} />
            <strong>{tip.action}</strong>
            <span>{tip.reduction.toFixed(2)} t/yr · {tip.costPerTonne < 0 ? 'saves $' + Math.abs(tip.costPerTonne) : 'costs $' + tip.costPerTonne}/t · {EFFORT_LABELS[tip.effort] || EFFORT_LABELS.med} {CHART_UI.maccEffortSuffix}</span>
          </>
        ) : (
          <span>
            {CHART_UI.maccHint}
            {clamped ? ' ' + fill(CHART_UI.maccCapNote, { cap: Math.abs(CAP_MIN).toLocaleString() }) : ''}
          </span>
        )}
      </div>
    </div>
  );
}
