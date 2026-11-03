// Game 2: Greenwash or Not. One generic marketing claim a day; call it
// legitimate or greenwash, then read the actual regulatory reasoning. One play
// a day, locked once made. Its own streak, its own share card.

import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../components/Icons';
import CopyButton from '../components/CopyButton';
import PlayGrid from './PlayGrid';
import { prefersReducedMotion } from '../utils/media';
import { CLAIM, GAMES, STATS } from './data';
import {
  claimForDay, loadState, playedToday, displayStreak, recordPlay, claimShare, copyText,
} from './lib';

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

export default function ClaimGame({ dayIndex, showToast }) {
  const claim = claimForDay(dayIndex);
  const [state, setState] = useState(() => loadState('claim'));

  const played = playedToday(state, dayIndex);
  const streak = displayStreak(state, dayIndex);

  const call = (choice) => {
    const correct = choice === claim.verdict;
    const next = recordPlay('claim', dayIndex, correct ? 3 : 0, { choice, correct });
    setState(next);
  };

  // The button confirms on itself; the toast is kept for the one case it can't
  // show, a clipboard the browser refused.
  const share = async () => {
    const ok = await copyText(claimShare(dayIndex, state.result.correct, state.streak));
    if (!ok) showToast(GAMES.copyFailed);
    return ok;
  };

  return (
    <div className="dy-card">
      <div className="dy-card-head">
        <Icon name="list" size={30} />
        <span className="dy-card-eyebrow">{CLAIM.eyebrow}</span>
      </div>
      <h3 className="dy-card-title">{CLAIM.title}</h3>
      <p className="dy-card-blurb">{CLAIM.blurb}</p>

      <div className="dy-stats">
        <div className={streak >= 7 ? 'dy-stat dy-stat-hot' : 'dy-stat'}><div className="dy-stat-l">{STATS.streak}</div><div className="dy-stat-v">{streak}</div></div>
        <div className="dy-stat"><div className="dy-stat-l">{STATS.best}</div><div className="dy-stat-v">{state.best}</div></div>
        <div className="dy-stat"><div className="dy-stat-l">{STATS.plays}</div><div className="dy-stat-v">{state.plays}</div></div>
      </div>

      <PlayGrid state={state} dayIndex={dayIndex} />

      <div className="dy-claim">
        <div className="dy-claim-speaker">{CLAIM.cardKicker} · {STATS.dayLabel} {dayIndex + 1} · {claim.speaker}</div>
        <p className="dy-claim-text">{claim.claim}</p>
      </div>

      {!played ? (
        <div className="dy-calls">
          <button className="dy-call dy-call-legit" onClick={() => call('legit')}>
            {CLAIM.legitBtn}
            <small>{CLAIM.legitHint}</small>
          </button>
          <button className="dy-call dy-call-green" onClick={() => call('greenwash')}>
            {CLAIM.greenwashBtn}
            <small>{CLAIM.greenwashHint}</small>
          </button>
        </div>
      ) : (
        <Rise>
          <div className="dy-reveal">
            <div className={'dy-verdict ' + (state.result.correct ? 'dy-verdict-good' : 'dy-verdict-bad')}>
              {state.result.correct ? CLAIM.verdictRight : CLAIM.verdictWrong}
            </div>
            <p className="dy-verdict-line">
              {CLAIM.readsAs} <strong>{CLAIM.verdictWord[claim.verdict]}</strong>.
            </p>

            <div className="dy-rulebox">
              <div className="dy-rule-k">{CLAIM.principleLabel}</div>
              <div className="dy-rule-principle">{claim.principle}</div>
              <p className="dy-note">{claim.reasoning}</p>
              <div className="dy-src">{CLAIM.ruleLabel}: {claim.rule.name}{' '}
                <a href={claim.rule.url} target="_blank" rel="noopener noreferrer">{GAMES.sourceLink}</a>
              </div>
            </div>

            <div className="dy-share-row">
              <CopyButton className="dy-btn dy-btn-ghost" onCopy={share} label={CLAIM.shareCta} doneLabel={CLAIM.shareDone} />
            </div>
            <p className="dy-played-note">{CLAIM.playedNote}</p>
          </div>
        </Rise>
      )}
    </div>
  );
}
