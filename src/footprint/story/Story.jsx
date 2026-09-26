import { useEffect, useMemo, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../utils/media';
import { CATEGORIES, categoryById, countryOf } from '../data/factors';
import { gridSwapFor, modeSwapFor } from '../lib/swaps';
import { BENCHMARKS, homeAverageFor } from '../data/benchmarks';
import {
  CHROME, CHAPTERS, CATEGORY_QUIPS, BENCH_ST,
  YEAR, GUESS, LOCKIN, EQUIV_ST, SCOPES, MONTHS_ST, CHARACTER_ST, GRID_ST, NEEDLE, OUTRO,
} from '../data/storyCopy';
import { classifyCharacter } from '../data/characters';
import {
  Cover, YearTicker, ReferencePoints, LockIn, TotalReveal, Equivalences,
  Scopes, Hotspots, GridSwap, WorstMonth, Bench, Needle, Outro,
} from './moments';
import CharacterMoment from './CharacterMoment';
import Mark from '../../components/Mark';

// Section-tag text per chapter, numbered live from the rendered chapter list
// so a skipped moment never leaves a hole in the numbering.
const TAG_TEXT = {
  'st-year': YEAR.tag,
  'st-guess': GUESS.tag,
  'st-lockin': LOCKIN.tag,
  'st-equiv': EQUIV_ST.tag,
  'st-scopes': SCOPES.tag,
  'st-months': MONTHS_ST.tag,
  'st-bench': BENCH_ST.tag,
  'st-grid': GRID_ST.tag,
  'st-character': CHARACTER_ST.tag,
  'st-needle': NEEDLE.tag,
  'st-outro': OUTRO.tag,
};

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Distils the audit into the handful of numbers the story tells.
function buildStoryData(profile, agg, macc, voice) {
  const ranked = CATEGORIES
    .map((c) => ({ ...c, t: agg.byCategory[c.id] || 0 }))
    .filter((c) => c.t > 0.005)
    .sort((a, b) => b.t - a.t)
    .map((c) => ({
      ...c,
      pct: agg.total > 0 ? Math.round((c.t / agg.total) * 100) : 0,
      quip: (CATEGORY_QUIPS[c.id] || CATEGORY_QUIPS.other)[voice],
    }));

  const tickerEntries = [...profile.entries]
    .filter((e) => e.tco2e > 0.001)
    .sort((a, b) => b.tco2e - a.tco2e)
    .slice(0, 24)
    .map((e) => ({ label: e.label, t: e.tco2e, hex: categoryById(e.category).hex }));

  const monthly = agg.months.map((key) => {
    const total = Object.values(agg.byMonth[key] || {}).reduce((s, v) => s + v, 0);
    return {
      key,
      total,
      letter: MONTH_NAMES[Number(key.split('-')[1]) - 1][0],
      worst: agg.worstMonth && key === agg.worstMonth.month && total > 0,
    };
  });
  // A "worst month" is only a story when the months are real and uneven.
  // Guided-audit entries sit on synthetic dates (structural meta.synthetic
  // tag, with a text fallback for older saves), so the moment is skipped
  // unless the worst month contains at least one genuinely dated entry and
  // clearly spikes above the mean.
  const synthetic = (e) => (e.meta && e.meta.synthetic)
    || (e.notes || '').includes('guided audit') || (e.label || '').includes('(onboarding)');
  const worstKey = agg.worstMonth ? agg.worstMonth.month : null;
  const worstMonthReal = worstKey && profile.entries.some(
    (e) => !synthetic(e) && e.date.slice(0, 7) === worstKey,
  );
  const meanMonth = agg.total / Math.max(1, agg.months.length);
  const monthsWorthTelling = worstMonthReal && agg.worstMonth.total > meanMonth * 1.35;
  const worst = monthsWorthTelling
    ? {
      name: MONTH_NAMES[Number(agg.worstMonth.month.split('-')[1]) - 1] + ' ' + agg.worstMonth.month.split('-')[0],
      total: agg.worstMonth.total,
    }
    : null;

  // The national row is the home country's own average (Australian, American
  // or New Zealand), so the comparison never reads someone else's country
  // back at them; its label rides the benchmark data.
  const homeAvg = homeAverageFor(countryOf(profile.settings));
  const bench = [
    { id: 'you', label: BENCH_ST.rows.you[voice], t: agg.total, you: true },
    { id: 'home', label: homeAvg.short, t: homeAvg.tco2e },
    { id: 'global', label: BENCH_ST.rows.global, t: BENCHMARKS.find((b) => b.id === 'global').tco2e },
    { id: 'budget', label: BENCH_ST.rows.budget, t: BENCHMARKS.find((b) => b.id === 'budget2030').tco2e },
  ];

  // Personal overshoot day: at this year's pace, the date the 2.5 t budget
  // ran out, counted from the start of the audit window.
  const budgetT = BENCHMARKS.find((b) => b.id === 'budget2030').tco2e;
  let overshoot = null;
  if (agg.total > budgetT) {
    const day = Math.max(1, Math.round(365 * (budgetT / agg.total)));
    const dt = new Date(profile.period.start + 'T00:00:00');
    dt.setDate(dt.getDate() + day - 1);
    overshoot = { day, date: dt.getDate() + ' ' + MONTH_NAMES[dt.getMonth()] + ' ' + dt.getFullYear() };
  } else if (agg.total > 0.005) {
    overshoot = { within: true };
  }

  // Physical tallies for the year moment. A count of ledger rows is an
  // artifact of how bills aggregate (41 lines could be one week of ordinary
  // spending), so the moment leads with quantities that mean something on
  // their own: kilometres flown, kilometres on the ground, energy through
  // the meter, parcels, nights, days of meals.
  const inWindow = profile.entries.filter((e) => e.date >= profile.period.start && e.date <= profile.period.end);
  const tally = (cat, f) => Math.round(inWindow.reduce((s, e) => s + (e.category === cat ? f(e.meta || {}) : 0), 0));
  const kmFlown = tally('flight', (m) => (m.km || 0) * (m.return ? 2 : 1));
  const tallies = [
    { id: 'kmFlown', v: kmFlown },
    { id: 'kmGround', v: tally('road', (m) => m.km || 0) },
    { id: 'kwh', v: tally('electricity', (m) => m.kwh || 0) },
    { id: 'parcels', v: tally('freight', (m) => m.parcels || 0) },
    { id: 'nights', v: tally('hotel', (m) => m.nights || 0) },
    { id: 'mealDays', v: tally('diet', (m) => m.days || 0) },
  ].filter((t) => t.v > 0).slice(0, 4);

  const gridSwap = gridSwapFor(profile, agg);
  const modeSwap = modeSwapFor(profile);

  const effortLabel = { low: 'Easy', med: 'Moderate', high: 'Harder' };
  const needle = macc
    .filter((r) => r.applicable && r.reduction > 0.05)
    .sort((a, b) => b.reduction - a.reduction)
    .slice(0, 3)
    .map((r) => ({
      ...r,
      hex: categoryById(r.category).hex,
      effortLabel: effortLabel[r.effort] || 'Moderate',
      // Lead figure: the cut as a share of this year, capped so rounding can
      // never claim more than the whole.
      pct: agg.total > 0 ? Math.min(100, Math.round((r.reduction / agg.total) * 100)) : 0,
    }));

  return {
    fy: profile.period.label,
    name: (profile.settings && profile.settings.name || '').trim(),
    // Picks the diet silhouette (drumstick, fish or leaf) on the total moment.
    dietType: (profile.settings && profile.settings.dietType) || 'medMeat',
    total: agg.total,
    tallies,
    planetX: kmFlown / 40075, // mean equatorial circumference, km
    byScope: agg.byScope,
    ranked,
    tickerEntries,
    monthly,
    worst,
    bench,
    overshoot,
    largest: agg.largest ? { label: agg.largest.label, t: agg.largest.tco2e } : null,
    gridSwap,
    modeSwap,
    needle,
  };
}

// Scroll to a moment AND move focus there, so a keyboard user's next Tab
// continues from the destination instead of yanking the page back.
export function goToMoment(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

// The rail is one stop in the tab order, not twelve: the dot for the chapter
// on screen takes focus, and the arrow keys walk the rest (a roving tabindex),
// so a keyboard user reaches the cover's call to action straight away.
function ChapterRail({ active, chapters }) {
  const [cursor, setCursor] = useState(null);
  const refs = useRef({});
  const current = cursor || active;
  const onKeyDown = (e) => {
    const ids = chapters.map((c) => c.id);
    const i = Math.max(0, ids.indexOf(current));
    let j = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = Math.min(ids.length - 1, i + 1);
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = Math.max(0, i - 1);
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = ids.length - 1;
    if (j == null) return;
    e.preventDefault();
    setCursor(ids[j]);
    refs.current[ids[j]]?.focus();
  };
  return (
    <nav
      className="st-rail"
      aria-label={CHROME.progressLabel}
      onKeyDown={onKeyDown}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setCursor(null); }}
    >
      {chapters.map((c) => (
        <button
          key={c.id}
          ref={(el) => { refs.current[c.id] = el; }}
          type="button"
          className={'st-rail-dot' + (active === c.id ? ' on' : '')}
          aria-label={c.label}
          aria-current={active === c.id ? 'step' : undefined}
          tabIndex={current === c.id ? 0 : -1}
          onClick={() => goToMoment(c.id)}
        >
          <span className="st-rail-label" aria-hidden="true">{c.label}</span>
        </button>
      ))}
    </nav>
  );
}

// A persistent, obvious way forward: one tap scrolls to the next moment.
// The scroll cue on the cover starts the journey; this keeps it going.
function NextChapter({ active, chapters }) {
  const ids = chapters.map((c) => c.id);
  const i = ids.indexOf(active);
  const next = i >= 0 && i < ids.length - 1 ? chapters[i + 1] : null;
  if (!next) return null;
  return (
    <button
      type="button"
      className="st-next"
      onClick={() => goToMoment(next.id)}
    >
      {CHROME.next} <strong>{next.label}</strong> <span aria-hidden="true">↓</span>
    </button>
  );
}

// Act I: the reveal. A continuous scroll of full-screen moments above the
// working dashboard. Purely presentational: it reads the same aggregates the
// dashboard reads and never touches the store.
export default function Story({ profile, agg, macc, voice, onStart, onSkip, onEnd, onFinish, onPlan, onCopyLink }) {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const d = useMemo(() => buildStoryData(profile, agg, macc, voice), [profile, agg, macc, voice]);
  const character = useMemo(() => classifyCharacter(agg), [agg]);
  const [active, setActive] = useState('st-cover');
  const [chromeOn, setChromeOn] = useState(true);
  // The lock-in guess (own voice only). Locked means locked: the verdict on
  // the total moment reads from it, and it never travels anywhere.
  const [guess, setGuess] = useState(10);
  const [guessLocked, setGuessLocked] = useState(false);
  const rootRef = useRef(null);
  const endRef = useRef(null);

  // Chapters whose moments actually render for this audit.
  const chapters = useMemo(() => CHAPTERS.filter((c) => {
    if (c.id === 'st-lockin') return voice === 'own';
    if (c.id === 'st-equiv') return d.total > 0.005;
    if (c.id === 'st-months') return !!d.worst;
    if (c.id === 'st-grid') return !!d.gridSwap;
    if (c.id === 'st-needle') return d.needle.length > 0;
    if (c.id === 'st-hotspots') return d.ranked.length > 0;
    return true;
  }), [d, voice]);

  // "03 · Your guess" style section tags, numbered by position among the
  // tagged chapters only: an untagged moment (the cover, the total, the
  // hotspots) never consumes a number, so the sequence runs without gaps.
  const tags = useMemo(() => {
    let n = 0;
    return chapters.reduce((acc, c) => {
      if (TAG_TEXT[c.id]) { n += 1; acc[c.id] = String(n).padStart(2, '0') + ' · ' + TAG_TEXT[c.id]; }
      return acc;
    }, {});
  }, [chapters]);

  // Track the active chapter for the rail. Re-registered whenever the
  // chapter set changes, so moments that appear or vanish after a log edit
  // stay observed and `active` never points at an unmounted section.
  useEffect(() => {
    const sections = rootRef.current?.querySelectorAll('.st-moment');
    if (!sections || !('IntersectionObserver' in window)) return undefined;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [chapters]);

  // Reaching the outro marks the story as seen for future visits.
  useEffect(() => {
    const el = endRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const obs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { onEnd(); obs.disconnect(); }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [onEnd]);

  // The story chrome belongs to the story: once the visitor scrolls past it
  // into the dashboard, the skip button and rail step aside.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { setChromeOn(e.isIntersecting); });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const onReplay = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };
  const onExplore = () => { onFinish(); };

  return (
    <div className="st-root" ref={rootRef}>
      {chromeOn && (
        <header className="st-chrome">
          <a href="../" className="st-home" aria-label="Back to the profile"><Mark /></a>
          <div className="st-chrome-right">
            {/* The worked example keeps a way in on screen the whole way
                through: motivation peaks mid-story, not at the cover. */}
            {voice === 'example' && active !== 'st-cover' && (
              <button type="button" className="st-cta-pill" onClick={onStart}>{CHROME.floatCta} →</button>
            )}
            <button type="button" className="st-skip" onClick={onSkip}>{CHROME.skip} ↓</button>
          </div>
        </header>
      )}
      {chromeOn && <ChapterRail active={active} chapters={chapters} />}
      {chromeOn && <NextChapter active={active} chapters={chapters} />}

      <Cover d={d} voice={voice} onStart={onStart} reduced={reduced} />
      <YearTicker d={d} voice={voice} tags={tags} reduced={reduced} />
      <ReferencePoints d={d} voice={voice} tags={tags} goTo={goToMoment} />
      {voice === 'own' && (
        <LockIn
          tags={tags} goTo={goToMoment}
          guess={guess} setGuess={setGuess} locked={guessLocked}
          onLock={() => setGuessLocked(true)}
          onSkip={() => setGuessLocked(false)}
        />
      )}
      <TotalReveal d={d} voice={voice} guess={guessLocked ? guess : null} onCopyLink={onCopyLink} reduced={reduced} />
      <Bench d={d} voice={voice} tags={tags} />
      {d.total > 0.005 && <Equivalences d={d} voice={voice} tags={tags} />}
      <Scopes d={d} voice={voice} tags={tags} />
      <Hotspots d={d} voice={voice} tags={tags} reduced={reduced} />
      <GridSwap d={d} tags={tags} />
      <WorstMonth d={d} voice={voice} tags={tags} />
      <CharacterMoment d={d} voice={voice} tags={tags} character={character} />
      <Needle d={d} profile={profile} agg={agg} voice={voice} tags={tags} onPlan={onPlan} />
      <Outro d={d} voice={voice} character={character} tags={tags} onStart={onStart} onExplore={onExplore} onReplay={onReplay} onCopyLink={onCopyLink} endRef={endRef} />
    </div>
  );
}
