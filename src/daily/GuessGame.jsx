// Game 1: Guess the Footprint. One everyday item a day; guess its carbon
// footprint on a log slider (grams to tonnes) with a typed override, scored on
// closeness in orders of magnitude. One play a day, locked once made.

import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../components/Icons';
import Range from '../components/Range';
import CopyButton from '../components/CopyButton';
import PlayGrid from './PlayGrid';
import { prefersReducedMotion } from '../utils/media';
import { GUESS, GAMES, STATS } from './data';
import {
  guessForDay, scoreGuess, massText, formatMass,
  kgToLog, logToKg, clampKg, logPos, LOG_MIN, LOG_MAX, RULER_TICKS,
  loadState, playedToday, displayStreak, recordPlay, guessShare, copyText,
} from './lib';

const UNIT_FACTOR = { g: 0.001, kg: 1, t: 1000 };

// The score as three pips, filled to the score, in the play grid's own tones.
// The same reading as the share text's squares, drawn rather than typed.
function ScorePips({ score }) {
  return (
    <span className="dy-pips" aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <span key={n} className={'dy-pip' + (n <= score ? ' is-on' : '')} />
      ))}
    </span>
  );
}

// Reveal entrance, gated on reduced-motion.
function Rise({ children }) {
  if (prefersReducedMotion()) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Ruler({ guessKg, answerKg }) {
  const gp = logPos(guessKg) * 100;
  const ap = logPos(answerKg) * 100;
  return (
    <div className="dy-ruler" aria-hidden="true">
      <div className="dy-ruler-track">
        <div className="dy-marker-lbl dy-marker-lbl-guess" style={{ left: gp + '%' }}>
          {GUESS.rulerGuess}<em>{massText(guessKg)}</em>
        </div>
        <div className="dy-marker dy-marker-guess" style={{ left: gp + '%' }} />
        <div className="dy-marker dy-marker-answer" style={{ left: ap + '%' }} />
        <div className="dy-marker-lbl dy-marker-lbl-answer" style={{ left: ap + '%' }}>
          {GUESS.rulerAnswer}<em>{massText(answerKg)}</em>
        </div>
        {RULER_TICKS.map((t, i) => (
          <div key={t.label} className={'dy-ruler-tick' + (i % 2 && i < RULER_TICKS.length - 1 ? ' dy-ruler-tick-minor' : '')} style={{ left: logPos(t.kg) * 100 + '%' }}>{t.label}</div>
        ))}
      </div>
    </div>
  );
}

export default function GuessGame({ dayIndex, showToast }) {
  const item = guessForDay(dayIndex);
  const [state, setState] = useState(() => loadState('guess'));
  const [guessKg, setGuessKg] = useState(10);
  const [typed, setTyped] = useState('');
  const [unit, setUnit] = useState('kg');

  const played = playedToday(state, dayIndex);
  const streak = displayStreak(state, dayIndex);

  const onSlider = (e) => { setGuessKg(logToKg(Number(e.target.value))); setTyped(''); };
  const onType = (e) => {
    const v = e.target.value;
    setTyped(v);
    const n = parseFloat(v);
    if (n > 0) setGuessKg(clampKg(n * UNIT_FACTOR[unit]));
  };
  const onUnit = (u) => {
    setUnit(u);
    const n = parseFloat(typed);
    if (n > 0) setGuessKg(clampKg(n * UNIT_FACTOR[u]));
  };

  const submit = () => {
    const { score, ratio } = scoreGuess(guessKg, item.kg);
    const next = recordPlay('guess', dayIndex, score, { guessKg, score, ratio });
    setState(next);
  };

  // The button confirms on itself; the toast is kept for the one case it can't
  // show, a clipboard the browser refused.
  const share = async () => {
    const r = state.result;
    const ok = await copyText(guessShare(dayIndex, r.score, r.ratio, state.streak));
    if (!ok) showToast(GAMES.copyFailed);
    return ok;
  };

  const disp = formatMass(guessKg);

  return (
    <div className="dy-card">
      <div className="dy-card-head">
        <Icon name="target" size={30} />
        <span className="dy-card-eyebrow">{GUESS.eyebrow}</span>
      </div>
      <h3 className="dy-card-title">{GUESS.title}</h3>
      <p className="dy-card-blurb">{GUESS.blurb}</p>

      <div className="dy-stats">
        <div className={streak >= 7 ? 'dy-stat dy-stat-hot' : 'dy-stat'}><div className="dy-stat-l">{STATS.streak}</div><div className="dy-stat-v">{streak}</div></div>
        <div className="dy-stat"><div className="dy-stat-l">{STATS.best}</div><div className="dy-stat-v">{state.best}</div></div>
        <div className="dy-stat"><div className="dy-stat-l">{STATS.plays}</div><div className="dy-stat-v">{state.plays}</div></div>
      </div>

      <PlayGrid state={state} dayIndex={dayIndex} />

      <div className="dy-item">
        <div className="dy-item-k">{GUESS.cardKicker} · {STATS.dayLabel} {dayIndex + 1}</div>
        <div className="dy-item-name">{item.item}</div>
        <div className="dy-item-unit">{item.unit}</div>
      </div>

      {!played ? (
        <>
          <div className="dy-guessbox">
            <div className="dy-guess-head">
              <span className="dy-guess-lbl">{GUESS.sliderLabel}</span>
              <span className="dy-guess-val">{disp.value}<em>{disp.unit} CO₂e</em></span>
            </div>
            <Range
              className="dy-range" min={LOG_MIN} max={LOG_MAX} step={0.01}
              ticks={LOG_MAX - LOG_MIN}
              value={kgToLog(guessKg)} onChange={onSlider}
              aria-label={GUESS.sliderLabel + ', in carbon dioxide equivalent, log scale from one gram to ten tonnes'}
            />
            <div className="dy-range-scale"><span>1 g</span><span>1 kg</span><span>10 t</span></div>
            <p className="dy-hint">{GUESS.sliderHint}</p>
          </div>

          <div className="dy-override">
            <label>
              <span>{GUESS.overrideLabel}</span>
              <input type="number" inputMode="decimal" min="0" step="any" value={typed} onChange={onType} placeholder={GUESS.overridePlaceholder} />
            </label>
            <div className="dy-unit" role="group" aria-label={GUESS.unitGroupLabel}>
              {['g', 'kg', 't'].map((u) => (
                <button key={u} type="button" className={unit === u ? 'on' : undefined} aria-pressed={unit === u} onClick={() => onUnit(u)}>{u}</button>
              ))}
            </div>
          </div>

          <button className="dy-btn dy-btn-full" onClick={submit}>{GUESS.playCta}</button>
        </>
      ) : (
        <Rise>
          <div className="dy-reveal">
            <div className={'dy-verdict ' + (state.result.score >= 2 ? 'dy-verdict-good' : 'dy-verdict-bad')}>
              {state.result.score}/3
              <ScorePips score={state.result.score} />
            </div>
            <p className="dy-verdict-line">{GUESS.scoreLines[state.result.score]}</p>

            <Ruler guessKg={state.result.guessKg} answerKg={item.kg} />

            <div className="dy-answer-k">{GUESS.revealAnswer}</div>
            <div className="dy-answer-big">{formatMass(item.kg).value} <small>{formatMass(item.kg).unit} CO₂e</small></div>
            <p className="sr-only">You guessed {massText(state.result.guessKg)}. The answer is {massText(item.kg)}.</p>
            <p className="dy-note">{item.note}</p>
            <div>
              <span className={'dy-flag' + (item.estimate ? ' dy-flag-est' : '')}>
                {item.estimate ? GUESS.estimateFlag : GUESS.sitFlag}
              </span>
            </div>
            <div className="dy-src">{GUESS.sourceLabel}: {item.source.name}{' '}
              <a href={item.source.url} target="_blank" rel="noopener noreferrer">{GAMES.sourceLink}</a>
            </div>

            <div className="dy-share-row">
              <CopyButton className="dy-btn dy-btn-ghost" onCopy={share} label={GUESS.shareCta} doneLabel={GUESS.shareDone} />
            </div>
            <p className="dy-played-note">{GUESS.playedNote}</p>
          </div>
        </Rise>
      )}
    </div>
  );
}
