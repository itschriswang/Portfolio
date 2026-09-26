import { useEffect, useMemo, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { canHover, prefersReducedMotion } from '../../utils/media';
import SplitText from '../../components/SplitText';
import CopyButton from '../../components/CopyButton';
import Range from '../../components/Range';
import CarbonField from './CarbonField';
import { CountUp, ScrubNumber } from './CountUp';
import { fmtT } from '../data/copy';
import { categoryShapes } from '../data/shapes';
import ShareSheet from './ShareSheet';
import { renderShare } from '../lib/shareCard';
import { EQUIVALENCES, equivCount } from '../data/equivalences';
import { baselineState, stateEmissions } from '../lib/engine';
import { ABATEMENT_OPTIONS, APPLY_ORDER } from '../data/abatement';
import {
  CHROME, COVER, YEAR, GUESS, LOCKIN, TOTAL, EQUIV_ST, SCOPES, HOTSPOTS_ST,
  MONTHS_ST, BENCH_ST, NEEDLE, OUTRO, SHARE_ST, fill, ratioPhrase,
} from '../data/storyCopy';

// Standard whileInView reveal used by the calm moments.
const rise = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.25, 1, 0.5, 1] },
  }),
};
const inView = { once: true, margin: '-18% 0px' };

// ---------------------------------------------------------------------------
// A shareable card in the outro gallery: the card itself is drawn up front as
// a thumbnail (square-post format), so the gallery shows what you would be
// sharing instead of a row of identical buttons. Tapping the preview or the
// button opens the share sheet with the full format choices.
// ---------------------------------------------------------------------------
// The gallery thumbnails render as square posts; the sheet opens on the same
// format so the preview and the sheet agree.
const PREVIEW_FORMAT = 'post';

export function GalleryCard({ kind, data, fy, linkedIn, label }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const boxRef = useRef(null);

  // Draw the preview once the card scrolls near the viewport; the canvas
  // render is not free and the outro holds several of these.
  useEffect(() => {
    let alive = true;
    let objUrl = '';
    const el = boxRef.current;
    const draw = async () => {
      let canvas;
      try { canvas = await renderShare(PREVIEW_FORMAT, kind, { ...data, fy }); }
      catch { return; }
      if (!alive) return;
      canvas.toBlob((blob) => {
        if (!alive || !blob) return;
        objUrl = URL.createObjectURL(blob);
        setUrl(objUrl);
      }, 'image/png');
    };
    if (!el || !('IntersectionObserver' in window)) {
      draw();
    } else {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { io.disconnect(); draw(); }
      }, { rootMargin: '300px' });
      io.observe(el);
      return () => { alive = false; io.disconnect(); if (objUrl) URL.revokeObjectURL(objUrl); };
    }
    return () => { alive = false; if (objUrl) URL.revokeObjectURL(objUrl); };
    // Card data is frozen for the life of the outro; draw once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="st-gallery-card" ref={boxRef}>
      <button
        type="button"
        className="st-gallery-thumb"
        onClick={() => setOpen(true)}
        aria-label={label + ': ' + SHARE_ST.button}
      >
        {url
          ? <img src={url} alt="" />
          : <span className="st-gallery-loading">{SHARE_ST.sheet.rendering}</span>}
      </button>
      <span className="st-gallery-label">{label}</span>
      <button type="button" className="st-share" onClick={() => setOpen(true)}>
        <span aria-hidden="true">↗</span> {SHARE_ST.button}
      </button>
      {open && (
        <ShareSheet kind={kind} data={{ ...data, fy }} linkedIn={linkedIn} initialFormat={PREVIEW_FORMAT} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 0 · Cover
// ---------------------------------------------------------------------------
export function Cover({ d, voice, onStart, reduced }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const ghostY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '34%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  // Cursor parallax: the ghost layer and the headline sit on different planes.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const ghostX = useSpring(useTransform(mx, [-1, 1], [26, -26]), { stiffness: 60, damping: 18 });
  const ghostYc = useSpring(useTransform(my, [-1, 1], [18, -18]), { stiffness: 60, damping: 18 });
  const innerX = useSpring(useTransform(mx, [-1, 1], [-7, 7]), { stiffness: 60, damping: 18 });
  const onMove = (e) => {
    if (reduced || !canHover()) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  // The cover is deliberately unlike the site's home hero: a dark title card
  // with the audited year already alive as a field of particles behind the
  // words, so a first-time visitor reads "this is a walk-through", not another
  // landing page. The swarm is a teaser, not a spoiler; the number stays for
  // the reveal three chapters down.
  return (
    <section className="st-moment st-cover" id="st-cover" ref={ref} aria-label="Opening" onPointerMove={onMove}>
      <CarbonField
        mode="swarm"
        total={d.total}
        categories={d.ranked.map((c) => ({ id: c.id, hex: c.hex, share: c.t }))}
        alpha={0.55}
        className="st-field st-cover-field"
      />
      <motion.div className="st-ghost st-ghost-cover" style={{ y: ghostY }} aria-hidden="true">
        <motion.span style={{ x: ghostX, y: ghostYc, display: 'inline-block' }}>CO₂</motion.span>
      </motion.div>
      <motion.div className="st-cover-inner" style={reduced ? undefined : { opacity: fade, x: innerX }}>
        <div className="st-cover-eyebrow">
          <span className="st-cover-eyebrow-dot" aria-hidden="true" />{COVER.eyebrow}
        </div>
        <div className="sec-tag" data-idx={d.fy + ' / '}>{COVER.tag}</div>
        <h1 className="st-h1 display">
          <SplitText text={COVER.h1a[voice]} /> <SplitText text={COVER.h1b} accentIndex={1} />
        </h1>
        <p className="st-cover-sub">{COVER.sub[voice]}</p>
        <p className="st-cover-meta">{fill(COVER.meta[voice], { fy: d.fy })}</p>
        {voice === 'example' && (
          <div className="st-cover-cta">
            <button type="button" className="btn btn-primary fp-btn" onClick={onStart}>{COVER.start} →</button>
          </div>
        )}
        <p className="st-cover-note">
          <span className="st-cover-note-dot" aria-hidden="true" />{COVER.startNote}
        </p>
      </motion.div>
      <div className="st-cue" aria-hidden="true">
        <span>{COVER.scrollCue}</span>
        <span className="st-cue-line" />
      </div>
    </section>
  );
}

// A quiet, recurring "keep scrolling" mark for the pinned moments, where the
// animation only advances if you scroll. It fades out as the moment's scrub
// completes, and never shows under reduced motion (those moments are static).
export function ScrollHint({ progress, fadeEnd = 0.45, label = CHROME.keepScrolling, tone }) {
  const opacity = useTransform(progress, [0, fadeEnd * 0.35, fadeEnd], [0.9, 0.9, 0]);
  if (prefersReducedMotion()) return null;
  return (
    <motion.div className={'st-scrollhint' + (tone === 'dark' ? ' dark' : '')} style={{ opacity }} aria-hidden="true">
      <span>{label}</span>
      <span className="st-cue-line" />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// 1 · The year: the audited year as raw material. A big count lands first,
// then the log itself streams past: three rows of priced line items, tinted
// by category, drifting on their own and steered by the scroll.
// ---------------------------------------------------------------------------
// Animates a number toward its latest value, for the live toys: the needle's
// rebuilt total and the equivalence counter. Reduced motion snaps.
function useAnimatedNumber(value) {
  const [disp, setDisp] = useState(value);
  const prevRef = useRef(value);
  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = value;
    if (prefersReducedMotion() || from === value) { setDisp(value); return undefined; }
    const controls = animate(from, value, {
      duration: 0.7,
      ease: [0.25, 1, 0.5, 1],
      onUpdate: (v) => setDisp(v),
    });
    return () => controls.stop();
  }, [value]);
  return disp;
}

export function YearTicker({ d, voice, tags, reduced }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rows = [[], [], []];
  d.tickerEntries.forEach((e, i) => rows[i % 3].push(e));
  const x0 = useTransform(scrollYProgress, [0, 1], ['4%', '-30%']);
  const x1 = useTransform(scrollYProgress, [0, 1], ['-30%', '4%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['2%', '-24%']);
  const xs = [x0, x1, x2];

  return (
    <section className="st-moment st-year" id="st-year" ref={ref} aria-label="The year in entries">
      <div className="st-sticky">
        <div className="st-ghost st-ghost-year" aria-hidden="true">{d.fy}</div>
        <motion.div className="st-center" initial="hidden" whileInView="visible" viewport={inView}>
          <motion.div className="sec-tag" data-idx="" variants={rise}>{tags['st-year']}</motion.div>
          <motion.h2 className="st-h2 display" variants={rise} custom={1}>{YEAR.headline[voice]}</motion.h2>
          <motion.div className="st-year-tallies" variants={rise} custom={2}>
            {d.tallies.map((t, i) => (
              <div className={'st-tally' + (i === 0 ? ' lead' : '')} key={t.id}>
                <span className="st-tally-v display">
                  <CountUp value={t.v} decimals={0} duration={1.2} delay={i * 0.12} />
                </span>
                <span className="st-tally-l">{YEAR.tallies[t.id]}</span>
                {t.id === 'kmFlown' && d.planetX >= 1 && (
                  <span className="st-tally-sub">{fill(YEAR.tallies.planet, { x: d.planetX.toFixed(1) })}</span>
                )}
              </div>
            ))}
          </motion.div>
          <motion.p className="st-line" variants={rise} custom={3}>{YEAR.sub[voice]}</motion.p>
        </motion.div>
        <div className="st-ticker" role="img" aria-label={YEAR.tickerAria}>
          {rows.map((row, ri) => (
            <motion.div className="st-ticker-row" key={ri} style={reduced ? undefined : { x: xs[ri] }}>
              <div className={'st-ticker-drift st-drift-' + ri}>
                {row.map((e, i) => (
                  <span className="st-tick-chip" key={i} style={{ borderColor: e.hex + '66' }}>
                    <span className="fp-leg-dot" style={{ background: e.hex }} aria-hidden="true" />
                    {e.label} · <strong>{fmtT(e.t, 2)} t</strong>
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <ScrollHint progress={scrollYProgress} fadeEnd={0.5} />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 2 · Your benchmarks: three published benchmarks, so the total lands with
// context instead of arriving cold. Replaces the old "guess my number", which
// asked people to guess against nothing.
// ---------------------------------------------------------------------------
export function ReferencePoints({ d, voice, tags, goTo }) {
  return (
    <section className="st-moment st-guess" id="st-guess" aria-label="Your benchmarks">
      <motion.div className="st-center st-wide" initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div className="sec-tag" data-idx="" variants={rise}>{tags['st-guess']}</motion.div>
        <motion.h2 className="st-h2 display" variants={rise} custom={1}>{GUESS.headline[voice]}</motion.h2>
        <motion.p className="st-line" variants={rise} custom={2}>{GUESS.sub[voice]}</motion.p>
        <div className="st-ref-cards">
          {GUESS.refs.map((r, i) => {
            const b = d.bench.find((x) => x.id === r.id);
            return (
              <motion.div className="st-ref-card" key={r.id} variants={rise} custom={3 + i}>
                <div className="st-ref-v display">
                  <CountUp value={b ? b.t : 0} decimals={1} delay={0.2 + i * 0.15} /><span className="st-ref-unit"> {r.unit}</span>
                </div>
                <div className="st-ref-label">{r.label || (b ? b.label : '')}</div>
                <div className="st-ref-note">{r.note}</div>
              </motion.div>
            );
          })}
        </div>
        <motion.button
          type="button" className="btn btn-secondary" variants={rise} custom={6}
          onClick={() => goTo(voice === 'example' ? 'st-total' : 'st-lockin')}
        >
          {voice === 'example' ? GUESS.cont : GUESS.contOwn} ↓
        </motion.button>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 2b · The lock-in (own voice only): call the number before it lands. The
// guess is display-only theatre, but it is the single most memorable stat the
// reveal produces, so locked means locked; the verdict waits on the total.
// ---------------------------------------------------------------------------
export function LockIn({ tags, goTo, guess, setGuess, locked, onLock, onSkip }) {
  return (
    <section className="st-moment st-lockin" id="st-lockin" aria-label="Your guess">
      <motion.div className="st-center" initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div className="sec-tag" data-idx="" variants={rise}>{tags['st-lockin']}</motion.div>
        <motion.h2 className="st-h2 display" variants={rise} custom={1}>{LOCKIN.headline}</motion.h2>
        <motion.p className="st-line" variants={rise} custom={2}>{LOCKIN.sub}</motion.p>
        <motion.div className="st-guess-box" variants={rise} custom={3}>
          <div className="st-guess-num display" aria-hidden="true">{fmtT(guess)}<span> {LOCKIN.unit}</span></div>
          <Range
            className="st-slider"
            min={0.5} max={40} step={0.5} value={guess}
            aria-label={LOCKIN.sliderLabel}
            aria-valuetext={fmtT(guess) + ' tonnes'}
            disabled={locked}
            onChange={(e) => setGuess(Number(e.target.value))}
          />
          <div className="st-guess-ctas">
            {locked ? (
              <>
                <p className="st-locked" role="status">{fill(LOCKIN.locked, { g: fmtT(guess) })}</p>
                <button type="button" className="btn btn-primary fp-btn" onClick={() => goTo('st-total')}>{LOCKIN.cta} ↓</button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-primary fp-btn" onClick={onLock}>{LOCKIN.lock}</button>
                <button type="button" className="st-quiet" onClick={() => { onSkip(); goTo('st-total'); }}>{LOCKIN.skip}</button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 3 · The total: the number answers "what was it?" immediately on arrival.
// The particle field lives in its own stage beside the words (behind them
// only on phones, masked low), so the text never fights the dots. Tapping a
// category pulls its share of the particles into that category's silhouette:
// the flights become a plane, dinner becomes a drumstick, a fish or a leaf.
// ---------------------------------------------------------------------------
export function TotalReveal({ d, voice, guess, onCopyLink, reduced }) {
  // One everyday anchor in the same breath as the number: the familiar
  // domestic return, from the same table the equivalences moment counts with.
  const anchorEq = EQUIVALENCES.find((e) => e.id === 'flight');
  const anchorN = anchorEq ? (d.total * 1000) / anchorEq.kg : 0;
  const anchorLine = anchorEq && anchorN >= 1
    ? fill(TOTAL.anchor, { n: fmtCount(anchorN), unit: anchorN >= 1.5 ? anchorEq.unit[1] : anchorEq.unit[0] })
    : null;
  // The guess, settled: under, over, or close enough to brag about.
  let guessLine = null;
  if (guess != null && d.total > 0.005) {
    const diff = guess - d.total;
    const offPct = Math.abs(diff) / d.total;
    guessLine = offPct <= 0.1
      ? fill(TOTAL.guess.close, { g: fmtT(guess), pct: Math.max(1, Math.round(offPct * 100)) })
      : diff < 0
        ? fill(TOTAL.guess.under, { g: fmtT(guess), d: fmtT(-diff) })
        : fill(TOTAL.guess.over, { g: fmtT(guess), d: fmtT(diff) });
  }
  const ref = useRef(null);
  // One particle per 10 kg. Pinned (clicked) and hover/focus previews are
  // separate states so a tap pins, a second tap unpins, and mouse traversal
  // only previews.
  const [pinnedCat, setPinnedCat] = useState(null);
  const [hoverCat, setHoverCat] = useState(null);
  const focusCat = pinnedCat ?? hoverCat;
  const focusName = focusCat ? (d.ranked.find((c) => c.id === focusCat) || {}) : null;
  // Gentle parallax on the unit ghost only; the number itself reveals on view.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const ghostY = useTransform(scrollYProgress, [0, 1], ['16%', '-16%']);

  return (
    <section className={'st-moment st-total' + (reduced ? ' st-static' : '')} id="st-total" ref={ref} aria-label="The total">
      <div className="st-sticky">
        <motion.div className="st-ghost st-ghost-unit" style={reduced ? undefined : { y: ghostY }} aria-hidden="true">tCO₂e</motion.div>
        <div className="st-total-grid">
          <div className="st-total-copy">
            <div className="st-kicker">{TOTAL.kicker[voice]}</div>
            <motion.div
              className="st-total-num display"
              initial={reduced ? false : { scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.7 }}
            >
              {reduced ? fmtT(d.total, 1) : <CountUp value={d.total} decimals={1} duration={1.4} />}
              <span className="st-total-unit">{TOTAL.unit}</span>
            </motion.div>
            <motion.div
              className="st-total-tail"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.25, 1, 0.5, 1] }}
            >
              {anchorLine && <p className="st-anchor">{anchorLine}</p>}
              <p className="st-line">{TOTAL.line[voice]}</p>
              {guessLine && (
                <p className="st-verdict"><strong>{TOTAL.guess.kicker}.</strong> {guessLine}</p>
              )}
              <p className="st-enote">{TOTAL.eNote}</p>
              {onCopyLink && (
                <div className="st-share-row">
                  <CopyButton className="st-quiet" onCopy={onCopyLink} label={SHARE_ST.copyLink} doneLabel={SHARE_ST.copyLinkDone} iconSize={16} />
                </div>
              )}
            </motion.div>
          </div>
          <div className="st-total-stage">
            <div className="st-total-fieldbox">
              <CarbonField
                mode="swarm"
                total={d.total}
                categories={d.ranked.map((c) => ({ id: c.id, hex: c.hex, share: c.t }))}
                focus={focusCat}
                shapes={categoryShapes(d.dietType)}
                className="st-field"
              />
            </div>
            <p className="st-cat-hint" aria-hidden="true">
              {focusName ? `${focusName.label}: ${fmtT(focusName.t)} t, ${focusName.pct}% of the total` : TOTAL.chipsHint}
            </p>
            <div className="st-cat-chips" role="group" aria-label={TOTAL.chipsLabel}>
              {d.ranked.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={'st-cat-chip' + (focusCat === c.id ? ' on' : '')}
                  aria-pressed={pinnedCat === c.id}
                  onPointerEnter={() => { if (canHover()) setHoverCat(c.id); }}
                  onPointerLeave={() => { if (canHover()) setHoverCat((f) => (f === c.id ? null : f)); }}
                  onFocus={(e) => { if (e.target.matches(':focus-visible')) setHoverCat(c.id); }}
                  onBlur={() => setHoverCat((f) => (f === c.id ? null : f))}
                  onClick={() => setPinnedCat((f) => (f === c.id ? null : c.id))}
                >
                  <span className="fp-leg-dot" style={{ background: c.hex }} aria-hidden="true" />
                  {c.label} · {fmtT(c.t)} t
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 3b · Everyday equivalences: the same total counted out in things a person
// actually chooses. A live toy: pick a unit, the counter re-rolls and the
// dot wall rebuilds. Factors and assumptions live in data/equivalences.js
// and on the method page; nothing here changes any number.
// ---------------------------------------------------------------------------
const fmtCount = (v) => (v >= 20 ? Math.round(v).toLocaleString('en-AU') : String(Math.round(v * 10) / 10));

export function Equivalences({ d, voice, tags }) {
  const [sel, setSel] = useState(EQUIVALENCES[0].id);
  const eq = EQUIVALENCES.find((e) => e.id === sel) || EQUIVALENCES[0];
  const { count, dots, per } = useMemo(() => equivCount(d.total, eq), [d.total, eq]);
  const disp = useAnimatedNumber(count);
  const unit = count >= 1.5 ? eq.unit[1] : eq.unit[0];

  let cadLine = EQUIV_ST.cadence.year;
  if (eq.cadence !== 'year') {
    const n = eq.cadence === 'day' ? count / 365 : count / 52;
    cadLine = fill(EQUIV_ST.cadence[eq.cadence], { n: fmtCount(n) });
  }
  const legend = per > 1
    ? fill(EQUIV_ST.legendMany, { k: per.toLocaleString('en-AU'), unit: eq.unit[1] })
    : fill(EQUIV_ST.legendOne, { unit: eq.unit[0] });

  return (
    <section className="st-moment st-equiv" id="st-equiv" aria-label="The total in everyday things">
      <motion.div className="st-center st-wide" initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div className="sec-tag" data-idx="" variants={rise}>{tags['st-equiv']}</motion.div>
        <motion.h2 className="st-h2 display" variants={rise} custom={1}>{EQUIV_ST.headline[voice]}</motion.h2>
        <motion.p className="st-line" variants={rise} custom={2}>{EQUIV_ST.sub[voice]}</motion.p>
        <motion.div className="st-eq-chips" role="group" aria-label={EQUIV_ST.chipsLabel} variants={rise} custom={3}>
          {EQUIVALENCES.map((e) => (
            <button
              key={e.id} type="button"
              className={'st-eq-chip' + (sel === e.id ? ' on' : '')}
              aria-pressed={sel === e.id}
              onClick={() => setSel(e.id)}
            >
              {e.label}
            </button>
          ))}
        </motion.div>
        <motion.div className="st-eq-stage" variants={rise} custom={4}>
          <div className="st-eq-big" role="status">
            <span className="st-eq-num display">{fmtCount(disp)}</span>
            <span className="st-eq-unit">{unit}</span>
          </div>
          <p className="st-eq-cad">{cadLine}</p>
          {/* The wall of dots: felt scale, one glance. Decorative; the readout
              above carries the number. */}
          {/* equivCount snaps the per-dot grain so dots never exceeds 150. */}
          <div className="st-eq-dots" key={eq.id} aria-hidden="true">
            {Array.from({ length: dots }).map((_, i) => (
              <i key={i} style={{ animationDelay: `${Math.min(i * 7, 1100)}ms` }} />
            ))}
          </div>
          <p className="st-eq-legend" aria-hidden="true">{legend}</p>
          <p className="st-eq-basis">{eq.basis}</p>
        </motion.div>
        <motion.p className="st-caveat" variants={rise} custom={5}>{EQUIV_ST.note[voice]}</motion.p>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 4 · Scopes
// ---------------------------------------------------------------------------
// Light-to-dark matcha steps for the stacked scope bar (light scene).
const SCOPE_STEPS = ['#DCE3A8', '#B5C42B', '#75821D'];

export function Scopes({ d, voice, tags }) {
  const total = Math.max(d.total, 0.001);
  const s3pct = Math.round((d.byScope['3'] / total) * 100);
  return (
    <section className="st-moment st-scopes" id="st-scopes" aria-label="The three scopes">
      <motion.div className="st-center st-wide" initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div className="sec-tag" data-idx="" variants={rise}>{tags['st-scopes']}</motion.div>
        <motion.h2 className="st-h2 display" variants={rise} custom={1}>{SCOPES.headline}</motion.h2>
        <motion.p className="st-line" variants={rise} custom={1.5}>{SCOPES.gloss[voice]}</motion.p>
        <div className="st-scope-rows">
          {SCOPES.items.map((s, i) => (
            <motion.div className="st-scope-row" key={s.n} variants={rise} custom={2 + i}>
              <span className="st-scope-n" aria-hidden="true">{s.n}</span>
              <div>
                <div className="st-scope-name">{s.name}</div>
                <div className="st-scope-plain">{s.plain[voice]}</div>
                <div className="st-scope-val">
                  <CountUp value={d.byScope[s.n] || 0} decimals={2} duration={1.2} delay={i * 0.15} /> t
                </div>
                <p className="st-scope-line">{s.line[voice]}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div className="st-scope-bar" variants={rise} custom={5} role="img"
          aria-label={`Scope 1 ${fmtT(d.byScope['1'], 2)} tonnes, scope 2 ${fmtT(d.byScope['2'], 2)} tonnes, scope 3 ${fmtT(d.byScope['3'], 2)} tonnes.`}>
          {['1', '2', '3'].map((n, i) => (
            <span key={n} style={{ width: `${Math.max(1, ((d.byScope[n] || 0) / total) * 100)}%`, background: SCOPE_STEPS[i] }} />
          ))}
        </motion.div>
        <motion.p className="st-punch" variants={rise} custom={6}>
          <CountUp value={s3pct} decimals={0} duration={1.3} className="st-punch-num" /><span className="st-punch-pct">%</span> {SCOPES.punch[voice]}
        </motion.p>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 5 · Hotspots: title card, then the ranked bars build.
// ---------------------------------------------------------------------------
export function Hotspots({ d, voice, tags, reduced }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const top = d.ranked[0];
  const titleO = useTransform(scrollYProgress, [0, 0.08, 0.3, 0.4], [0, 1, 1, 0]);
  const titleS = useTransform(scrollYProgress, [0, 0.3], [0.92, 1.06]);
  const numP = useTransform(scrollYProgress, [0.34, 0.52], [0, 1]);
  const restO = useTransform(scrollYProgress, [0.34, 0.46], [0, 1]);
  const barsP = useTransform(scrollYProgress, [0.5, 0.85], [0, 1]);
  if (!top) return null;

  return (
    <section className={'st-moment st-hot' + (reduced ? ' st-static' : '')} id="st-hotspots" ref={ref} aria-label="Hotspots">
      <div className="st-sticky">
        <motion.div className="st-hot-title" style={reduced ? undefined : { opacity: titleO, scale: titleS }} aria-hidden="true">
          <div className="st-kicker">{HOTSPOTS_ST.rankWord} №1</div>
          <div className="st-hot-name display" style={{ color: top.hex }}>{top.label}</div>
          <p className="st-line">{top.quip}</p>
        </motion.div>
        <motion.div className="st-hot-detail" style={reduced ? undefined : { opacity: restO }}>
          <h2 className="st-h2 display">{HOTSPOTS_ST.headline[voice]}</h2>
          {/* The title card is visual-only (aria-hidden, removed under reduced
              motion), so the quip also lives here: visibly when the card is
              gone, sr-only otherwise. */}
          <p className={reduced ? 'st-line' : 'sr-only'}>{HOTSPOTS_ST.rankWord} 1: {top.label}. {top.quip}</p>
          <div className="st-hot-big">
            <span className="st-hot-num display" style={{ color: top.hex }}>
              <ScrubNumber progress={numP} value={top.t} decimals={1} />
            </span>
            <span className="st-hot-meta">t · {top.pct}% {HOTSPOTS_ST.ofYear}</span>
          </div>
          <div className="st-rank">
            {d.ranked.map((c, i) => (
              <StoryBar key={c.id} c={c} i={i} max={top.t} progress={barsP} reduced={reduced} />
            ))}
          </div>
          <p className="st-punch-sm">{HOTSPOTS_ST.punch[voice]}</p>
        </motion.div>
        <ScrollHint progress={scrollYProgress} fadeEnd={0.72} />
      </div>
    </section>
  );
}

function StoryBar({ c, i, max, progress, reduced }) {
  // Each bar grows over its own slice of the build phase.
  const lo = i * 0.09;
  const scaleX = useTransform(progress, [lo, lo + 0.35], [0, 1]);
  return (
    <div className="st-rank-row">
      <span className="st-rank-name"><span className="fp-leg-dot" style={{ background: c.hex }} aria-hidden="true" />{c.label}</span>
      <span className="st-rank-track" aria-hidden="true">
        <motion.span className="st-rank-fill" style={{ background: c.hex, scaleX: reduced ? 1 : scaleX, width: `${Math.max(2, (c.t / max) * 100)}%` }} />
      </span>
      <span className="st-rank-val">{fmtT(c.t)} t</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6 · Worst month
// ---------------------------------------------------------------------------
export function WorstMonth({ d, voice, tags }) {
  if (!d.worst) return null;
  return (
    <section className="st-moment st-months" id="st-months" aria-label="The worst month">
      <motion.div className="st-center st-wide" initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div className="sec-tag" data-idx="" variants={rise}>{tags['st-months']}</motion.div>
        <motion.h2 className="st-h2 display" variants={rise} custom={1}>{d.worst.name}</motion.h2>
        <motion.p className="st-line" variants={rise} custom={2}>
          <CountUp value={d.worst.total} decimals={1} className="st-line-num" /> t {MONTHS_ST.line[voice]}
        </motion.p>
        <motion.div className="st-months-chart" variants={rise} custom={3} role="img"
          aria-label={fill(MONTHS_ST.chartAria, { name: d.worst.name, t: fmtT(d.worst.total) })}>
          {d.monthly.map((m, i) => (
            <div className="st-month-col" key={m.key}>
              {m.worst && <span className="st-month-flag">{fmtT(m.total, 1)} t</span>}
              <motion.span
                className={'st-month-bar' + (m.worst ? ' worst' : '')}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={inView}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease: [0.25, 1, 0.5, 1] }}
                style={{ height: `${Math.max(3, (m.total / d.worst.total) * 100)}%` }}
              />
              <span className="st-month-l" aria-hidden="true">{m.letter}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 7 · Benchmarks
// ---------------------------------------------------------------------------
// A comparison as a big tile: under 100% reads as a percentage, over reads
// as a multiplier, so "57%" and "5.1×" both land at a glance.
const ratioLabel = (total, base) => {
  const r = total / base;
  return r < 1 ? Math.round(r * 100) + '%' : (Math.round(r * 10) / 10).toFixed(1) + '×';
};

export function Bench({ d, voice, tags }) {
  const max = Math.max(...d.bench.map((b) => b.t));
  const tiles = [
    { key: 'home', base: d.bench[1] },
    { key: 'global', base: d.bench[2] },
    { key: 'budget', base: d.bench[3] },
  ].filter((t) => t.base && t.base.t > 0);
  return (
    <section className="st-moment st-bench" id="st-bench" aria-label="Context and benchmarks">
      <motion.div className="st-center st-wide" initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div className="sec-tag" data-idx="" variants={rise}>{tags['st-bench']}</motion.div>
        <motion.h2 className="st-h2 display" variants={rise} custom={1}>{BENCH_ST.headline[voice]}</motion.h2>
        {/* The synthesis first: one sentence to leave with, then the tiles
            and bars unpack it. */}
        {tiles.length === 3 && (
          <motion.p className="st-line" variants={rise} custom={1.3}>
            {fill(BENCH_ST.verdict[voice], {
              t: fmtT(d.total),
              home: ratioPhrase(d.total, tiles[0].base.t),
              homeName: tiles[0].base.label,
              world: ratioPhrase(d.total, tiles[1].base.t),
              budget: ratioPhrase(d.total, tiles[2].base.t),
            })}
          </motion.p>
        )}
        <div className="st-bench-tiles">
          {tiles.map((t, i) => (
            <motion.div className="st-bench-tile" key={t.key} variants={rise} custom={1.5 + i * 0.5}>
              <span className="st-bench-tile-v display">{ratioLabel(d.total, t.base.t)}</span>
              <span className="st-bench-tile-l">
                {(() => {
                  // The home tile carries the home country's own label.
                  const label = fill(BENCH_ST.tiles[t.key], { name: t.base.label });
                  return d.total / t.base.t < 1 ? label : label.replace(/^of /, '');
                })()}
              </span>
              {t.key === 'budget' && <span className="st-bench-tile-aim">{BENCH_ST.benchNoteLabel}</span>}
            </motion.div>
          ))}
        </div>
        <div className="st-bench-rows">
          {d.bench.map((b, i) => (
            <motion.div className="st-bench-row" key={b.label} variants={rise} custom={2 + i}>
              <span className="st-bench-name" title={b.id === 'budget' ? BENCH_ST.benchNoteTooltip : undefined}>{b.label}</span>
              <span className="st-bench-track" aria-hidden="true">
                <motion.span
                  className={'st-bench-fill' + (b.you ? ' you' : '')}
                  variants={{
                    hidden: { scaleX: 0 },
                    visible: { scaleX: 1, transition: { duration: 0.7, delay: 0.25 + i * 0.12, ease: [0.25, 1, 0.5, 1] } },
                  }}
                  style={{ width: `${Math.max(1.5, (b.t / max) * 100)}%` }}
                />
              </span>
              <span className="st-bench-val"><CountUp value={b.t} decimals={1} delay={0.2 + i * 0.12} /> t</span>
            </motion.div>
          ))}
        </div>
        {d.overshoot && (
          <motion.div className="st-overshoot" variants={rise} custom={5.5}>
            <span className="st-overshoot-k">{BENCH_ST.overshoot.kicker}</span>
            <span className="st-overshoot-line">
              {d.overshoot.within
                ? BENCH_ST.overshoot.within[voice]
                : fill(BENCH_ST.overshoot.line[voice], { date: d.overshoot.date, day: d.overshoot.day })}
            </span>
          </motion.div>
        )}
        <motion.p className="st-punch-sm" variants={rise} custom={6}>{BENCH_ST.line[voice]}</motion.p>
        <motion.p className="st-benchnote" variants={rise} custom={7}>{BENCH_ST.benchNote}</motion.p>
        <motion.p className="st-caveat" variants={rise} custom={8}>{BENCH_ST.caveat}</motion.p>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 8 · The needle, as a live toy: the top three cuts are switches. Flipping
// them re-prices the year through the same engine the pathway uses, applied
// in APPLY_ORDER at full phase, so overlapping levers compose instead of
// double counting; the standalone figure on each card stays the true
// "this one alone" number.
// ---------------------------------------------------------------------------
export function Needle({ d, profile, agg, voice, tags, onPlan }) {
  const [on, setOn] = useState(() => new Set());
  const base = useMemo(() => baselineState(profile, agg), [profile, agg]);
  const before = useMemo(() => stateEmissions({ ...base, addedKwh0: 0 }, 0).total, [base]);
  const reduction = useMemo(() => {
    if (!on.size) return 0;
    const st = { ...base, addedKwh0: 0 };
    for (const id of APPLY_ORDER) {
      if (!on.has(id)) continue;
      const opt = ABATEMENT_OPTIONS.find((o) => o.id === id);
      if (opt && opt.applicable(base)) opt.apply(st, 1);
    }
    return Math.max(0, before - stateEmissions(st, 0).total);
  }, [base, before, on]);
  const newTotal = Math.max(0, agg.total - reduction);
  const disp = useAnimatedNumber(newTotal);
  const pct = agg.total > 0 ? Math.round((reduction / agg.total) * 100) : 0;
  const budgetFrac = agg.total > 0 ? 2.5 / agg.total : 0;
  const toggle = (id) => setOn((s) => {
    const next = new Set(s);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  if (!d.needle.length) return null;
  return (
    <section className="st-moment st-needle" id="st-needle" aria-label="How to cut it down">
      <motion.div className="st-center st-wide" initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div className="sec-tag" data-idx="" variants={rise}>{tags['st-needle']}</motion.div>
        <motion.h2 className="st-h2 display" variants={rise} custom={1}>{voice === 'example' ? NEEDLE.headline : NEEDLE.headlineOwn}</motion.h2>
        <motion.p className="st-line" variants={rise} custom={2}>{NEEDLE.sub[voice]}</motion.p>
        <div className="st-needle-cards">
          {d.needle.map((a, i) => {
            const isOn = on.has(a.id);
            return (
              <motion.button
                type="button"
                className={'st-needle-card st-needle-btn' + (isOn ? ' on' : '')}
                key={a.id} variants={rise} custom={3 + i}
                style={{ '--ac': a.hex }}
                aria-pressed={isOn}
                onClick={() => toggle(a.id)}
              >
                <span className="st-needle-state" aria-hidden="true">{isOn ? NEEDLE.live.on : NEEDLE.live.off}</span>
                <span className="st-needle-t display">-<CountUp value={a.pct} decimals={0} delay={0.15 + i * 0.12} /><span className="st-needle-pct">%</span></span>
                <span className="st-needle-of">{NEEDLE.ofYear} · {fmtT(a.reduction)} {NEEDLE.perYear}</span>
                <span className="st-needle-name">{a.action}</span>
                <span className="st-needle-effort">{a.effortLabel}</span>
              </motion.button>
            );
          })}
        </div>
        <motion.div className="st-needle-live" variants={rise} custom={6} role="status">
          <span className="st-needle-live-l">{NEEDLE.live.label[voice]}</span>
          <span className="st-needle-live-num display">{fmtT(disp)}<span> t</span></span>
          <span className="st-needle-live-line">
            {on.size === 0 ? NEEDLE.live.none : fill(NEEDLE.live.cut, { cut: fmtT(reduction), pct })}
          </span>
          <span className="st-needle-track" aria-hidden="true">
            <span className="st-needle-fill" style={{ width: `${agg.total > 0 ? (newTotal / agg.total) * 100 : 0}%` }} />
            {budgetFrac > 0 && budgetFrac < 1 && (
              <span className="st-needle-tick" style={{ left: `${budgetFrac * 100}%` }}>
                <i /><em>{NEEDLE.live.benchTick}</em>
              </span>
            )}
          </span>
          {on.size > 1 && <span className="st-caveat">{NEEDLE.live.note}</span>}
        </motion.div>
        <motion.div className="st-share-row" variants={rise} custom={8}>
          <button type="button" className="btn btn-secondary" onClick={onPlan}>{NEEDLE.cta} ↓</button>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 9 · Outro and share gallery. All the shareable cards are gathered here, in a
// horizontal scroller, so they never interrupt the reveal itself: someone
// leaving to post something does it once, at the end.
// ---------------------------------------------------------------------------
export function Outro({ d, voice, character, tags, onStart, onExplore, onReplay, onCopyLink, endRef }) {
  const top = d.ranked[0];
  // Put a name on the marquee card when we have one: "ADA'S CARBON EMISSIONS".
  const totalTitle = d.name ? d.name.toUpperCase() + "'S CARBON EMISSIONS" : SHARE_ST.cards.total[voice];
  const cards = [];
  // The character leads the gallery: it is the most identity-shaped card, the
  // one people actually post. The plain total follows for the literal-minded.
  if (character) {
    cards.push({
      key: 'character', kind: 'character', label: 'Your result',
      linkedIn: {
        title: SHARE_ST.cards.character[voice], fy: d.fy, name: character.name,
        tagline: character.tagline, stencil: character.stencil, hex: character.hex,
        total: fmtT(d.total), badge: character.badge,
      },
      data: {
        title: SHARE_ST.cards.character[voice], name: character.name, tagline: character.tagline,
        stencil: character.stencil, hex: character.hex, total: fmtT(d.total), badge: character.badge, axes: [],
      },
    });
  }
  cards.push({
    key: 'total', kind: 'total', label: 'The total',
    data: { title: totalTitle, total: fmtT(d.total), cats: d.ranked.map((c) => ({ label: c.label, t: c.t })) },
  });
  if (top) {
    cards.push({
      key: 'hotspot', kind: 'hotspot', label: 'Biggest source',
      data: { title: SHARE_ST.cards.hotspot[voice], rank: 1, label: top.label, t: fmtT(top.t), pct: top.pct, quip: top.quip },
    });
  }
  cards.push({
    key: 'bench', kind: 'bench', label: 'In context',
    data: { title: SHARE_ST.cards.bench[voice], rows: d.bench.map((b) => ({ label: b.label, t: b.t, dim: !b.you })) },
  });
  if (d.needle.length) {
    cards.push({
      key: 'needle', kind: 'needle', label: 'Biggest cuts',
      data: {
        title: SHARE_ST.cards.needle[voice],
        actions: d.needle.map((a) => ({ action: a.action, pct: a.pct, t: fmtT(a.reduction), cost: a.effortLabel })),
      },
    });
  }

  return (
    <section className="st-moment st-outro" id="st-outro" aria-label="Share">
      <div ref={endRef} className="st-end-sentinel" aria-hidden="true" />
      <motion.div className="st-center st-wide" initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div className="sec-tag" data-idx="" variants={rise}>{tags['st-outro']}</motion.div>
        <motion.h2 className="st-h2 display" variants={rise} custom={1}>{OUTRO.headline[voice]}</motion.h2>
        <motion.p className="st-line" variants={rise} custom={2}>{OUTRO.sub[voice]}</motion.p>

        <motion.div className="st-gallery" variants={rise} custom={3} role="group" aria-label={OUTRO.galleryLabel}>
          {cards.map((c) => (
            <GalleryCard key={c.key} kind={c.kind} fy={d.fy} data={c.data} linkedIn={c.linkedIn} label={c.label} />
          ))}
        </motion.div>

        <motion.div className="st-share-row" variants={rise} custom={4}>
          {onCopyLink && <CopyButton className="btn btn-secondary" onCopy={onCopyLink} label={SHARE_ST.copyLink} doneLabel={SHARE_ST.copyLinkDone} iconSize={16} />}
          <button type="button" className="fp-linkbtn" onClick={onExplore}>{OUTRO.explore} ↓</button>
          {voice === 'example' && (
            <button type="button" className="fp-linkbtn" onClick={onStart}>{OUTRO.start}</button>
          )}
          <button type="button" className="st-quiet" onClick={onReplay}>{OUTRO.again}</button>
        </motion.div>
      </motion.div>
    </section>
  );
}
