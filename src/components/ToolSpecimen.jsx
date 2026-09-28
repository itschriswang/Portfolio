import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SPECIMENS } from '../data/specimens';
import { prefersReducedMotion } from '../utils/media';

// ---------------------------------------------------------------------------
// The live specimen inside each home page tool card. One small chart per tool,
// drawn from that tool's real numbers (see src/data/specimens.js).
//
// Each chart is measured rather than scaled. The plate reports its own pixel
// size and the svg takes a 1:1 viewBox from it, so a chart in a four-column
// card is genuinely wider than one in a two-column card instead of being the
// same drawing stretched up: strokes stay 1px, labels stay at their set size,
// and bars use the room they are given. That is also why every chart takes
// (w, h) and computes its geometry rather than carrying fixed coordinates.
//
// Eight different charts still have to read as one set, so they share a strict
// palette rather than each picking its own: the card's accent (--tc) carries
// the figure being argued, INK carries whatever it is being measured against,
// and RULE is structure. Nothing else gets a colour.
//
// The svg is decorative in the accessibility sense. The caption and basis
// lines beneath it carry the same information as text and the card is already
// labelled by its heading, so it stays aria-hidden.
// ---------------------------------------------------------------------------
const INK = 'rgba(210,223,206,0.34)';
const RULE = 'rgba(210,223,206,0.16)';
const LBL = 'rgba(210,223,206,0.82)';
// The same stacks as --mono and --disp in global.css, fallbacks included.
const MONO = "'JetBrains Mono',ui-monospace,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace";
const DISP = "'Space Grotesk','Space Grotesk Fallback',system-ui,sans-serif";

const VIEW = { once: true, margin: '-40px' };
const EASE = [0.25, 1, 0.5, 1];

// A label set in the site's mono. Sizes are real pixels, because the viewBox
// is the plate's own pixel box.
function T({ x, y, children, size = 9, fill = LBL, anchor = 'start', weight = 500, font = MONO }) {
  return (
    <text x={x} y={y} fontFamily={font} fontSize={size} fill={fill} textAnchor={anchor} fontWeight={weight}>
      {children}
    </text>
  );
}

// A big figure with its caption trailing it. The label is a tspan rather than
// a second <text> at a guessed x, so the two lay out sequentially and cannot
// collide however wide the number renders.
function Figure({ x, y, value, label, size = 19 }) {
  return (
    <text x={x} y={y} fontFamily={DISP} fontSize={size} fill="var(--tc)" fontWeight={700}>
      {value}
      <tspan dx="7" fontFamily={MONO} fontSize="9" fill={LBL} fontWeight={500}>{label}</tspan>
    </text>
  );
}

// ---------------------------------------------------------------------------
// 01 · Target Tracker: the claimed trajectory against the reported series.
// The two lines are the whole tool: dashed is what the company said it would
// do, solid is what it filed. The distance between them is the page's point.
// ---------------------------------------------------------------------------
function Trajectory({ d, w, h, still, uid }) {
  const X0 = 30, X1 = w - 16, Y0 = 26, Y1 = h - 20;
  const yMax = d.baseMt * 1.1;
  const x = (yr) => X0 + ((yr - d.baseYear) / (d.netZeroYear - d.baseYear)) * (X1 - X0);
  const y = (mt) => Y1 - (mt / yMax) * (Y1 - Y0);

  const claimed = [[d.baseYear, d.baseMt]];
  d.interim.forEach((i) => claimed.push([i.year, d.baseMt * (1 - i.cutPct / 100)]));
  claimed.push([d.netZeroYear, 0]);

  const path = (pts) => pts.map(([yr, mt], i) => `${i ? 'L' : 'M'}${x(yr).toFixed(1)} ${y(mt).toFixed(1)}`).join(' ');
  const last = d.reported[d.reported.length - 1];
  // Where the claimed line actually sits at a given year, so its label can be
  // parked clear of it rather than at a guessed height.
  const claimedAt = (yr) => {
    for (let i = 1; i < claimed.length; i += 1) {
      const [y0, v0] = claimed[i - 1];
      const [y1, v1] = claimed[i];
      if (yr <= y1) return v0 + ((yr - y0) / (y1 - y0)) * (v1 - v0);
    }
    return 0;
  };
  // Both series wipe in behind one moving edge. A clip does this without
  // touching strokeDasharray, which animating pathLength would overwrite and
  // which is what makes the claimed line legible as a claim.
  const clip = `spec-traj-${uid}`;

  return (
    <>
      <defs>
        <clipPath id={clip}>
          <motion.rect
            x="0" y="0" height={h}
            initial={still ? false : { width: 0 }}
            whileInView={still ? false : { width: w }}
            viewport={VIEW} transition={{ duration: 1.15, ease: EASE }}
            width={still ? w : undefined}
          />
        </clipPath>
      </defs>

      <line x1={X0} y1={Y1} x2={X1} y2={Y1} stroke={RULE} strokeWidth="1" />
      {/* Where the reported series runs out and the claim carries on alone. */}
      <line x1={x(d.nowYear)} y1={Y0 - 12} x2={x(d.nowYear)} y2={Y1} stroke={RULE} strokeWidth="1" strokeDasharray="2 3" />
      <T x={x(d.nowYear) + 4} y={Y0 - 4} size={9} fill={INK}>now</T>

      <g clipPath={`url(#${clip})`}>
        <path
          d={path(claimed)} stroke={INK} strokeWidth="1.6" strokeDasharray="5 4"
          strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d={path(d.reported)} stroke="var(--tc)" strokeWidth="2.4"
          strokeLinecap="round" strokeLinejoin="round"
        />
        {d.reported.map(([yr, mt]) => (
          <circle key={yr} cx={x(yr)} cy={y(mt)} r="3" fill="var(--tc)" />
        ))}
      </g>

      <T x={X0 - 4} y={y(d.baseMt) + 3} size={9} anchor="end" fill={INK}>{d.baseMt}</T>
      <T x={X0} y={Y1 + 14} size={9} fill={INK}>{d.baseYear}</T>
      <T x={x(d.interim[0].year)} y={Y1 + 14} size={9} anchor="middle" fill={INK}>{d.interim[0].year}</T>
      <T x={X1} y={Y1 + 14} size={9} anchor="end" fill={INK}>{d.netZeroYear}</T>
      <T x={X0} y={Y0 - 6} size={11} fill="var(--tc)" weight={700}>{d.company}</T>
      <T x={x(2042)} y={y(claimedAt(2042)) - 9} size={9} anchor="middle" fill={INK}>claimed</T>
      <T x={x(last[0]) + 8} y={y(last[1]) + 4} size={9} fill="var(--tc)">reported</T>
    </>
  );
}

// ---------------------------------------------------------------------------
// 02 · Work Samples: one stacked bar, because the first finding of nearly
// every baseline is the same shape: the value chain owns the footprint.
// ---------------------------------------------------------------------------
function Scopes({ d, w, h, still }) {
  const X0 = 2, W = w - 4, BH = Math.min(34, Math.max(20, h * 0.34)), BY = (h - BH) / 2 + 4;
  let run = X0;
  const segs = d.parts.map((p, i) => {
    const sw = (p.pct / 100) * W;
    const s = { ...p, x: run, w: sw, i };
    run += sw;
    return s;
  });
  const big = segs[2];
  return (
    <>
      <T x={X0} y={BY - 10} size={9}>{d.parts[2].label} · value chain</T>
      {segs.map((s) => (
        <motion.rect
          key={s.label} x={s.x} y={BY} height={BH} rx="3"
          fill={s.i === 2 ? 'var(--tc)' : INK} fillOpacity={s.i === 2 ? 1 : 0.5 + s.i * 0.2}
          initial={still ? false : { width: 0 }}
          whileInView={still ? false : { width: Math.max(2, s.w - 2) }}
          viewport={VIEW} transition={{ duration: 0.6, ease: EASE, delay: s.i * 0.1 }}
          width={still ? Math.max(2, s.w - 2) : undefined}
        />
      ))}
      <T x={big.x + 8} y={BY + BH / 2 + 5} size={14} fill="#1A2A0B" weight={700} font={DISP}>{d.parts[2].pct}%</T>
      {/* The two operational scopes are only a sliver of the bar, so they share
          one label at the left rather than each pointing at a segment too
          narrow to sit under. */}
      <T x={X0} y={BY + BH + 15} size={9} fill={INK}>
        {d.parts[0].label} {d.parts[0].pct}% · {d.parts[1].label} {d.parts[1].pct}%
      </T>

    </>
  );
}

// ---------------------------------------------------------------------------
// 03 · Cost Per Wear: the shape of fashion disclosure. The bars fall off a
// cliff, which is the finding: most brands publish very little.
// ---------------------------------------------------------------------------
function Histogram({ d, w, h, still }) {
  const X0 = 2, GW = w - 4, BASE = h - 18, TOP = 40, GAP = Math.max(4, GW * 0.03);
  const BW = (GW - GAP * (d.bins.length - 1)) / d.bins.length;
  const max = Math.max(...d.bins.map((b) => b.n));
  return (
    <>
      <line x1={X0} y1={BASE} x2={X0 + GW} y2={BASE} stroke={RULE} strokeWidth="1" />
      {d.bins.map((b, i) => {
        const bh = Math.max(2, (b.n / max) * (BASE - TOP));
        return (
          <g key={b.label}>
            <motion.rect
              x={X0 + i * (BW + GAP)} width={BW} rx="2" fill="var(--tc)" fillOpacity={i === 0 ? 1 : 0.32}
              initial={still ? false : { height: 0, y: BASE }}
              whileInView={still ? false : { height: bh, y: BASE - bh }}
              viewport={VIEW} transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
              height={still ? bh : undefined} y={still ? BASE - bh : undefined}
            />
            <T x={X0 + i * (BW + GAP) + BW / 2} y={BASE + 14} size={9} anchor="middle" fill={INK}>{b.label}</T>
          </g>
        );
      })}
      <Figure x={X0} y={17} size={15} value={`${d.bins[0].n} of ${d.scored}`} label="score under 20 out of 100" />
      <T x={X0 + GW} y={16} size={9} anchor="end" fill={INK}>median {d.median}</T>
    </>
  );
}

// ---------------------------------------------------------------------------
// 04 · Super Fund Holdings: one column per default option, one dot per
// flagged holding. Every column lights up, which is the whole point.
// ---------------------------------------------------------------------------
function Matrix({ d, w, h, still }) {
  const X0 = 2, GW = w - 4, TOP = 44, FOOT = h - 20, STEP = GW / d.dots.length;
  // The dot stack grows to whatever height the row hands this card, so a
  // stretched bento cell fills instead of leaving the columns stranded at the
  // bottom of an empty plate.
  const maxN = Math.max(...d.dots);
  const rise = Math.max(11, Math.min(26, (FOOT - TOP) / (maxN + 0.5)));
  const R = Math.max(4, Math.min(7, rise * 0.32));
  return (
    <>
      {d.dots.map((n, i) => {
        const cx = X0 + STEP * (i + 0.5);
        return (
          <g key={i}>
            <line x1={cx} y1={FOOT - rise * maxN} x2={cx} y2={FOOT} stroke={RULE} strokeWidth="1" />
            {Array.from({ length: n }, (_, k) => (
              <motion.circle
                key={k} cx={cx} cy={FOOT - rise * 0.55 - k * rise} r={R} fill="var(--tc)"
                initial={still ? false : { opacity: 0, scale: 0.2 }}
                whileInView={still ? false : { opacity: 1, scale: 1 }}
                viewport={VIEW} transition={{ duration: 0.32, ease: EASE, delay: i * 0.05 + k * 0.05 }}
              />
            ))}
          </g>
        );
      })}
      <line x1={X0} y1={FOOT + 1} x2={X0 + GW} y2={FOOT + 1} stroke={RULE} strokeWidth="1" />
      <Figure x={X0} y={17} size={15} value={`${d.flaggedFunds} of ${d.funds}`} label="default options carry a flagged holding" />
      <T x={X0} y={FOOT + 15} size={9} fill={INK}>one column per fund</T>
      <T x={X0 + GW} y={FOOT + 15} size={9} anchor="end" fill={INK}>one dot per flagged holding</T>
    </>
  );
}

// ---------------------------------------------------------------------------
// 05 · Grid Intensity: the same kilowatt hour under six different factors.
// The location-based rows sit muted; the two market-based references carry the
// accent, because the distance between those two is what the explorer teaches.
// ---------------------------------------------------------------------------
function Factors({ d, w, h, still }) {
  const LX = 74, VW = 30, BX = LX + 8, BW = Math.max(30, w - LX - VW - 12);
  // The rows share out whatever height the row hands this card, rather than
  // sitting at a fixed pitch with the slack left at the bottom.
  const STEP = Math.max(13, (h - 22) / d.bars.length);
  const TOP = 4, BH = Math.max(7, Math.min(13, STEP - 6));
  const max = Math.max(...d.bars.map((b) => b.v));
  return (
    <>
      {d.bars.map((b, i) => {
        const bw = (b.v / max) * BW;
        const y = TOP + i * STEP;
        const mkt = b.mode === 'market';
        return (
          <g key={b.label}>
            <T x={LX} y={y + BH} size={9} anchor="end" fill={mkt ? LBL : INK}>{b.label}</T>
            <line x1={BX} y1={y + BH / 2} x2={BX + BW} y2={y + BH / 2} stroke={RULE} strokeWidth="0.8" />
            {b.v > 0 ? (
              <motion.rect
                x={BX} y={y} height={BH} rx="2" fill={mkt ? 'var(--tc)' : INK} fillOpacity={mkt ? 1 : 0.72}
                initial={still ? false : { width: 0 }}
                whileInView={still ? false : { width: bw }}
                viewport={VIEW} transition={{ duration: 0.55, ease: EASE, delay: i * 0.07 }}
                width={still ? bw : undefined}
              />
            ) : (
              <line x1={BX} y1={y} x2={BX} y2={y + BH} stroke="var(--tc)" strokeWidth="2.5" />
            )}
            <T x={BX + BW + 8} y={y + BH} size={9} fill={mkt ? LBL : INK}>{b.v.toFixed(2)}</T>
          </g>
        );
      })}
      <T x={LX} y={TOP + d.bars.length * STEP + 11} size={9} anchor="end" fill={INK}>{d.unit}</T>
    </>
  );
}

// ---------------------------------------------------------------------------
// 06 · Life Footprint: one year, priced by category. Flights take the accent
// because in this year flights are close to two thirds of the whole total.
// ---------------------------------------------------------------------------
function Stack({ d, w, h, still }) {
  const X0 = 2, W = w - 4, BH = Math.min(30, Math.max(18, h * 0.3)), BY = (h - BH) / 2 + 8;
  let run = X0;
  const segs = d.parts.map((p, i) => {
    const sw = (p.pct / 100) * W;
    const s = { ...p, x: run, w: sw, i };
    run += sw;
    return s;
  });
  // Three labels share one baseline: the first segment's at the left edge,
  // the second's at its own segment, the last end-anchored at the right. On a
  // narrow plate the middle one runs into its neighbours ("DiEverything
  // else"), so it is only drawn when it clears both by 8px. The mono face
  // advances 0.6em a glyph, so the widths are known without measuring.
  const labelW = (t) => String(t).length * 9 * 0.6;
  const secondL = segs[1].x;
  const secondR = secondL + labelW(d.parts[1].label);
  const showSecond =
    secondL >= X0 + labelW(d.parts[0].label) + 8 &&
    secondR + 8 <= X0 + W - labelW(d.parts[5].label);
  return (
    <>
      <Figure x={X0} y={20} value={`${d.totalT} t`} label="CO2e, one real year" />
      {segs.map((s) => (
        <motion.rect
          key={s.label} x={s.x} y={BY} height={BH} rx="3"
          fill={s.i === 0 ? 'var(--tc)' : INK} fillOpacity={s.i === 0 ? 1 : 0.82 - s.i * 0.11}
          initial={still ? false : { width: 0 }}
          whileInView={still ? false : { width: Math.max(2, s.w - 2) }}
          viewport={VIEW} transition={{ duration: 0.55, ease: EASE, delay: s.i * 0.07 }}
          width={still ? Math.max(2, s.w - 2) : undefined}
        />
      ))}
      <T x={X0 + 8} y={BY + BH / 2 + 5} size={13} fill="#1A2A0B" weight={700} font={DISP}>{d.parts[0].pct}%</T>
      <T x={X0} y={BY + BH + 15} size={9} fill="var(--tc)">{d.parts[0].label}</T>
      {showSecond && <T x={segs[1].x} y={BY + BH + 15} size={9} fill={INK}>{d.parts[1].label}</T>}
      <T x={X0 + W} y={BY + BH + 15} size={9} anchor="end" fill={INK}>{d.parts[5].label}</T>
    </>
  );
}

// ---------------------------------------------------------------------------
// 07 · Australia's Climate Progress: one track running to the target, filled
// to where emissions actually are, with the pace the target implies marked on
// it. Progress and shortfall in one picture, which is the page's thesis.
// ---------------------------------------------------------------------------
function Gap({ d, w, h, still }) {
  const X0 = 2, W = w - 4, BH = Math.min(22, Math.max(14, h * 0.22)), BY = (h - BH) / 2 + 8;
  const at = (pct) => X0 + (pct / d.targetPct) * W;
  return (
    <>
      <Figure x={X0} y={20} value={`${d.nowPct}%`} label="below 2005, year to Dec 2025" />

      <rect x={X0} y={BY} width={W} height={BH} rx="4" fill={RULE} />
      <motion.rect
        x={X0} y={BY} height={BH} rx="4" fill="var(--tc)"
        initial={still ? false : { width: 0 }}
        whileInView={still ? false : { width: at(d.nowPct) - X0 }}
        viewport={VIEW} transition={{ duration: 0.8, ease: EASE }}
        width={still ? at(d.nowPct) - X0 : undefined}
      />
      {/* The straight line from 2005 to the target, i.e. the pace it needs. */}
      <line x1={at(d.pacePct)} y1={BY - 7} x2={at(d.pacePct)} y2={BY + BH + 7} stroke={INK} strokeWidth="1.5" strokeDasharray="3 2" />
      <T x={at(d.pacePct)} y={BY - 11} size={9} anchor="middle" fill={INK}>on pace</T>
      <line x1={X0 + W} y1={BY - 7} x2={X0 + W} y2={BY + BH + 7} stroke={LBL} strokeWidth="1.5" />

      <T x={X0} y={BY + BH + 20} size={9} fill={INK}>2005 baseline</T>
      <T x={X0 + W} y={BY + BH + 20} size={9} anchor="end">{d.targetPct}% by {d.targetYear}</T>
    </>
  );
}

// ---------------------------------------------------------------------------
// 08 · Sustainability Daily: one item on the scale it gets guessed against,
// with the lifestyle benchmark holding the far end of the track.
// ---------------------------------------------------------------------------
function Scale({ d, w, h, still }) {
  const X0 = 2, W = w - 4, BY = h / 2 + 12;
  const at = (kg) => X0 + (kg / d.benchmarkKg) * W;
  return (
    <>
      <T x={X0} y={16} size={9}>{d.item}</T>
      <Figure x={X0} y={38} value={`${d.kg.toLocaleString('en-AU')} kg`} label={d.unitNote || ''} />

      <line x1={X0} y1={BY} x2={X0 + W} y2={BY} stroke={RULE} strokeWidth="4" strokeLinecap="round" />
      <motion.line
        x1={X0} y1={BY} x2={at(d.kg)} y2={BY} stroke="var(--tc)" strokeWidth="4" strokeLinecap="round"
        initial={still ? false : { pathLength: 0 }}
        whileInView={still ? false : { pathLength: 1 }}
        viewport={VIEW} transition={{ duration: 0.7, ease: EASE }}
      />
      <motion.circle
        cx={at(d.kg)} cy={BY} r="6" fill="var(--tc)"
        initial={still ? false : { opacity: 0, scale: 0.3 }}
        whileInView={still ? false : { opacity: 1, scale: 1 }}
        viewport={VIEW} transition={{ duration: 0.35, delay: 0.6, ease: EASE }}
      />
      <line x1={X0 + W} y1={BY - 9} x2={X0 + W} y2={BY + 9} stroke={LBL} strokeWidth="1.5" />
      <T x={X0} y={BY + 20} size={9} fill={INK}>0</T>
      <T x={X0 + W} y={BY + 20} size={9} anchor="end">{d.benchmarkLabel}</T>
    </>
  );
}

const KINDS = {
  trajectory: Trajectory,
  scopes: Scopes,
  histogram: Histogram,
  matrix: Matrix,
  factors: Factors,
  stack: Stack,
  gap: Gap,
  scale: Scale,
};

// The plate reports its own size so the chart can be drawn in real pixels.
// offsetWidth on mount covers the first paint and the no-ResizeObserver case;
// the observer takes over for resizes and for the card growing to fill a
// bento row.
function useBox(ref) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    setBox({ w: el.offsetWidth, h: el.offsetHeight });
    return undefined;
  }, [ref]);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([e]) => {
      const r = e.contentRect;
      setBox((b) => (Math.abs(b.w - r.width) < 1 && Math.abs(b.h - r.height) < 1
        ? b : { w: Math.round(r.width), h: Math.round(r.height) }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return box;
}

export default function ToolSpecimen({ id }) {
  // Read once on mount: the point is to skip the draw-in entirely for a reader
  // who has asked for less motion, not to run it faster.
  const [still] = useState(() => prefersReducedMotion());
  const ref = useRef(null);
  // Scoped id for the svg-local clip path, so two specimens never collide.
  const uid = useId().replace(/:/g, '');
  const { w, h } = useBox(ref);
  const d = SPECIMENS[id];
  if (!d) return null;
  const Chart = KINDS[d.kind];
  if (!Chart) return null;
  return (
    <figure className="tool-spec">
      <div className={`spec-plate${d.kind === 'trajectory' ? ' spec-plate-tall' : ''}`} ref={ref}>
        {w > 0 && h > 0 && (
          <svg
            className="spec-svg" viewBox={`0 0 ${w} ${h}`} width={w} height={h}
            fill="none" aria-hidden="true" focusable="false"
          >
            <Chart d={d} w={w} h={h} still={still} uid={uid} />
          </svg>
        )}
      </div>
      <figcaption className="tool-spec-cap">
        {d.caption}
        <span className="tool-spec-basis">{d.basis}</span>
      </figcaption>
    </figure>
  );
}
