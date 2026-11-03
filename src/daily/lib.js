// Sustainability Daily: pure logic. Daily puzzle selection (Melbourne time),
// per-game local storage, scoring, mass formatting and share-text building.
// No React, no side effects beyond localStorage reads and writes.

import { GUESS_POOL, CLAIM_POOL, SHARE } from './data';

// Fixed launch date. The day index counts calendar days from here in
// Australia/Melbourne time, so day 0 is the launch day and today's puzzle is
// deterministic and identical for every visitor. Never change this: it would
// re-phase every past puzzle.
const EPOCH_UTC = Date.UTC(2026, 6, 22); // 2026-07-22, launch day

// The calendar day in Melbourne, as a whole-day count from the epoch. Using
// Intl to read the Melbourne Y-M-D handles daylight saving without us tracking
// the offset ourselves. Falls back to a plain UTC day count if Intl is missing.
export function melbourneDayIndex(now = new Date()) {
  let y, m, d;
  try {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Australia/Melbourne', year: 'numeric', month: '2-digit', day: '2-digit',
    });
    const parts = fmt.format(now); // 'YYYY-MM-DD'
    [y, m, d] = parts.split('-').map(Number);
  } catch (e) {
    const u = new Date(now);
    y = u.getUTCFullYear(); m = u.getUTCMonth() + 1; d = u.getUTCDate();
  }
  const dayUtc = Date.UTC(y, m - 1, d);
  return Math.round((dayUtc - EPOCH_UTC) / 86400000);
}

// The item / claim for a given day index. A non-negative modulo so a day before
// the epoch (should not happen, but is handled) never throws.
const pick = (pool, dayIndex) => pool[((dayIndex % pool.length) + pool.length) % pool.length];
export const guessForDay = (dayIndex) => pick(GUESS_POOL, dayIndex);
export const claimForDay = (dayIndex) => pick(CLAIM_POOL, dayIndex);

// The public-facing puzzle number: 1 on launch day.
export const puzzleNumber = (dayIndex) => dayIndex + 1;

// ---------------------------------------------------------------------------
// Scoring: Guess the Footprint. Score on orders of magnitude, not raw
// difference. ratio = larger / smaller of guess and answer.
//   within x1.5 -> 3, within x3 -> 2, within x10 -> 1, else 0.
// ---------------------------------------------------------------------------
export function scoreGuess(guessKg, answerKg) {
  if (!(guessKg > 0) || !(answerKg > 0)) return { score: 0, ratio: Infinity };
  const ratio = guessKg > answerKg ? guessKg / answerKg : answerKg / guessKg;
  let score = 0;
  if (ratio <= 1.5) score = 3;
  else if (ratio <= 3) score = 2;
  else if (ratio <= 10) score = 1;
  return { score, ratio };
}

// ---------------------------------------------------------------------------
// Mass formatting. One helper for the slider readout, the reveal and shares.
// Adaptive unit: grams under a kilo, kilograms up to a tonne, tonnes above.
// ---------------------------------------------------------------------------
export function formatMass(kg) {
  if (!(kg > 0)) return { value: '0', unit: 'kg' };
  if (kg < 1) {
    const g = kg * 1000;
    const v = g >= 100 ? Math.round(g) : g >= 10 ? Math.round(g) : Math.round(g * 10) / 10;
    return { value: String(v), unit: 'g' };
  }
  if (kg < 1000) {
    const v = kg >= 100 ? Math.round(kg) : kg >= 10 ? Math.round(kg * 10) / 10 : Math.round(kg * 100) / 100;
    return { value: String(v), unit: 'kg' };
  }
  const t = kg / 1000;
  const v = t >= 10 ? Math.round(t * 10) / 10 : Math.round(t * 100) / 100;
  return { value: String(v), unit: 't' };
}

export const massText = (kg) => {
  const { value, unit } = formatMass(kg);
  return value + ' ' + unit;
};

// The log scale for the slider and the reveal ruler. Runs from 1 gram (0.001
// kg) to 10 tonnes (10000 kg): seven decades.
export const LOG_MIN = -3; // log10(0.001 kg) = 1 g
export const LOG_MAX = 4;  // log10(10000 kg) = 10 t
export const clampKg = (kg) => Math.min(10 ** LOG_MAX, Math.max(10 ** LOG_MIN, kg));
export const kgToLog = (kg) => Math.log10(clampKg(kg));
export const logToKg = (l) => 10 ** l;
// Position 0..1 along the ruler for a value in kg.
export const logPos = (kg) => (kgToLog(kg) - LOG_MIN) / (LOG_MAX - LOG_MIN);

// Decade ticks for the reveal ruler.
export const RULER_TICKS = [
  { kg: 0.001, label: '1 g' },
  { kg: 0.01, label: '10 g' },
  { kg: 0.1, label: '100 g' },
  { kg: 1, label: '1 kg' },
  { kg: 10, label: '10 kg' },
  { kg: 100, label: '100 kg' },
  { kg: 1000, label: '1 t' },
  { kg: 10000, label: '10 t' },
];

// ---------------------------------------------------------------------------
// Local storage. One versioned key per game. Never sent anywhere. Shape:
//   { last: dayIndex|null, streak, best, plays, dist:[c0,c1,c2,c3],
//     days: [{ d: dayIndex, b: bucket }], result: { day, ...perGameFields } }
// `days` is the play history the grid on each card reads: one entry per day
// played, with the bucket scored, kept for the last HISTORY_KEEP days only.
// ---------------------------------------------------------------------------
const KEYS = { guess: 'dy-guess-v1', claim: 'dy-claim-v1' };

// Long enough to fill the grid several times over, short enough that the
// stored blob stays trivial. Older days fall off the end.
export const HISTORY_KEEP = 120;

const EMPTY = () => ({ last: null, streak: 0, best: 0, plays: 0, dist: [0, 0, 0, 0], days: [], result: null });

// Play history, sanitised. Anyone who played before the grid existed has no
// `days` array, so their last locked result seeds one entry rather than the
// grid claiming they have never played.
function readDays(s) {
  if (Array.isArray(s.days)) {
    return s.days
      .filter((e) => e && typeof e.d === 'number' && typeof e.b === 'number')
      .map((e) => ({ d: e.d, b: Math.max(0, Math.min(3, Math.round(e.b))) }))
      .slice(-HISTORY_KEEP);
  }
  if (typeof s.last === 'number' && s.result) {
    const b = typeof s.result.score === 'number' ? s.result.score : (s.result.correct ? 3 : 0);
    return [{ d: s.last, b }];
  }
  return [];
}

export function loadState(game) {
  if (typeof localStorage === 'undefined') return EMPTY();
  try {
    const raw = localStorage.getItem(KEYS[game]);
    if (!raw) return EMPTY();
    const s = JSON.parse(raw);
    return {
      last: typeof s.last === 'number' ? s.last : null,
      streak: s.streak || 0,
      best: s.best || 0,
      plays: s.plays || 0,
      dist: Array.isArray(s.dist) && s.dist.length === 4 ? s.dist : [0, 0, 0, 0],
      days: readDays(s),
      result: s.result || null,
    };
  } catch (e) {
    return EMPTY();
  }
}

// The play history as a lookup from day index to bucket, for the grid.
export function historyMap(state) {
  const map = new Map();
  for (const e of state.days || []) map.set(e.d, e.b);
  return map;
}

function save(game, state) {
  if (typeof localStorage === 'undefined') return;
  try { localStorage.setItem(KEYS[game], JSON.stringify(state)); } catch (e) { /* ignore quota */ }
}

// The streak as it stands for a given day, before any play today. Alive if the
// last play was today or yesterday; otherwise broken to zero.
export function displayStreak(state, dayIndex) {
  if (state.last == null) return 0;
  if (state.last === dayIndex || state.last === dayIndex - 1) return state.streak;
  return 0;
}

export const playedToday = (state, dayIndex) => state.last === dayIndex && state.result && state.result.day === dayIndex;

// Record a completed play for `dayIndex`. `bucket` is 0..3 (a guess score, or
// for the claim game 3 for a correct call and 0 for wrong). `result` is the
// per-game payload to lock in. Idempotent: replaying a locked day is a no-op.
export function recordPlay(game, dayIndex, bucket, result) {
  const state = loadState(game);
  if (playedToday(state, dayIndex)) return state; // locked, no do-overs
  const continues = state.last === dayIndex - 1;
  const streak = continues ? state.streak + 1 : 1;
  const dist = state.dist.slice();
  dist[bucket] = (dist[bucket] || 0) + 1;
  const days = state.days.filter((e) => e.d !== dayIndex).concat({ d: dayIndex, b: bucket });
  days.sort((a, b) => a.d - b.d);
  const next = {
    last: dayIndex,
    streak,
    best: Math.max(state.best, streak),
    plays: state.plays + 1,
    dist,
    days: days.slice(-HISTORY_KEEP),
    result: { day: dayIndex, ...result },
  };
  save(game, next);
  return next;
}

// ---------------------------------------------------------------------------
// Share text. Emoji grids, no URLs to trackers, the page URL at the foot.
// ---------------------------------------------------------------------------
const scoreSquares = (score) =>
  ['🟥⬜⬜', '🟩⬜⬜', '🟩🟩⬜', '🟩🟩🟩'][score];

// ×1.4 style ratio, one decimal, for the share line.
const ratioText = (ratio) => (ratio < 1.05 ? 'spot on' : '×' + (Math.round(ratio * 10) / 10) + ' off');

export function guessShare(dayIndex, score, ratio, streak) {
  return [
    SHARE.guessTitle + ' #' + puzzleNumber(dayIndex),
    scoreSquares(score) + '  ' + ratioText(ratio) + '  (' + score + '/3)',
    SHARE.streak + ' ' + streak,
    SHARE.url,
  ].join('\n');
}

export function claimShare(dayIndex, correct, streak) {
  return [
    SHARE.claimTitle + ' #' + puzzleNumber(dayIndex),
    correct ? SHARE.claimRight : SHARE.claimWrong,
    SHARE.streak + ' ' + streak,
    SHARE.url,
  ].join('\n');
}

// Copying is the same everywhere on the site, so it lives in one place. Games
// keep importing it from here; the implementation is shared.
export { copyText } from '../utils/clipboard';
