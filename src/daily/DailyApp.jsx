// Sustainability Daily: page spine. Two independent daily games sharing only
// this landing, plus a method/honesty section. Chrome and tool nav/footer are
// shared components; all copy lives in data.js.

import { useEffect, useRef, useState } from 'react';
import { SkipLink, Grain, ScrollProgress } from '../components/Chrome';
import { ToolNav, ToolFooter } from '../components/ToolNav';
import Icon from '../components/Icons';
import { INTRO, GAMES, METHOD, ACCC_PRINCIPLES } from './data';
import { melbourneDayIndex } from './lib';
import GuessGame from './GuessGame';
import ClaimGame from './ClaimGame';

export default function DailyApp() {
  // The day index is fixed for the whole session at mount. Australia/Melbourne
  // calendar day, the same puzzle for everyone.
  const [dayIndex] = useState(() => melbourneDayIndex());

  // A single shared toast for both games' copy actions.
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2600);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  return (
    <>
      <SkipLink />
      <Grain />
      <ScrollProgress />
      <ToolNav home="../" />

      <main id="main-content">
        <section id="dy-intro">
          <div className="canvas">
            <div className="sec-tag" data-idx="01"><Icon name="clock" size={32} />{INTRO.tag}</div>
            <h1 className="display dy-h1">{INTRO.h1a} <em>{INTRO.h1b}</em></h1>
            {INTRO.paras.map((p, i) => <p key={i} className="dy-intro-p">{p}</p>)}
            <div className="dy-chips">
              {INTRO.chips.map((c) => <span key={c} className="dy-chip">{c}</span>)}
            </div>
          </div>
        </section>

        <section id="dy-games">
          <div className="canvas">
            <div className="sec-tag" data-idx="02"><Icon name="bolt" size={32} />{GAMES.tag}</div>
            <h2 className="display dy-h2">{GAMES.title}</h2>
            <p className="dy-sub">{GAMES.sub}</p>
            <div className="dy-deck">
              <GuessGame dayIndex={dayIndex} showToast={showToast} />
              <ClaimGame dayIndex={dayIndex} showToast={showToast} />
            </div>
          </div>
        </section>

        <section id="dy-method">
          <div className="canvas">
            <div className="sec-tag" data-idx="03"><Icon name="book" size={32} />{METHOD.tag}</div>
            <h2 className="display dy-h2">{METHOD.title}</h2>
            <p className="dy-sub">{METHOD.sub}</p>

            <div className="dy-method-grid">
              {METHOD.blocks.map((b, i) => (
                <div key={i} className="dy-method-block">
                  <h3><Icon name={b.icon} size={26} />{b.title}</h3>
                  {b.paras.map((p, j) => <p key={j}>{p}</p>)}
                  {b.title.startsWith('Greenwash') && (
                    <div className="dy-principles">
                      {ACCC_PRINCIPLES.map((p) => <span key={p} className="dy-principle">{p}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="dy-updated">{METHOD.updatedLabel} {METHOD.lastUpdated}. {METHOD.cadence}</p>
          </div>
        </section>
      </main>

      <ToolFooter home="../" />

      <div className={'dy-toast' + (toast ? ' show' : '')} role="status" aria-live="polite">{toast}</div>
    </>
  );
}
