import { useEffect, useRef, useState } from 'react';
import SplitText from '../components/SplitText';
import { categoryById } from './data/factors';
import { BUDGET_2030 } from './data/benchmarks';
import { PLAN, EFFORT_LABELS, fmtT, listOf } from './data/copy';
import { fill } from './data/storyCopy';
import { prefersReducedMotion } from '../utils/media';
import { PathwayChart, MaccChart, PATHWAY_COLORS } from './charts';
import Icon from '../components/Icons';

// A cut as a share of the year: whole percentages, small-but-real shown as "<1".
const pctOf = (reduction, baseline) => {
  if (!(baseline > 0) || !(reduction > 0)) return '0';
  const p = (reduction / baseline) * 100;
  return p < 1 ? '<1' : String(Math.round(p));
};

function OptionCard({ r, on, baseline, onToggle }) {
  // The card carries its own dollars: the argument that moves a household is
  // "saves $400 a year", not dollars per tonne. Same figures the impact strip
  // totals, same thresholds.
  const money = r.cost < -20
    ? fill(PLAN.cardSaves, { n: Math.abs(r.cost).toLocaleString() })
    : r.cost > 20
      ? fill(PLAN.cardCosts, { n: r.cost.toLocaleString() })
      : PLAN.cardEven;
  return (
    <li className={'fp-opt' + (r.applicable ? '' : ' na') + (on ? ' on' : '')} style={{ '--ac': categoryById(r.category).hex }}>
      <div className="fp-opt-name"><span className="fp-action-dot" aria-hidden="true" />{r.action}</div>
      {r.applicable ? (
        <>
          <div className="fp-opt-pct display">-{pctOf(r.reduction, baseline)}<span>%</span></div>
          <div className="fp-opt-meta">
            {fmtT(r.reduction, 2)} t {PLAN.reductionLabel} · {money} · {PLAN.effortLabel}: {EFFORT_LABELS[r.effort] || EFFORT_LABELS.med}
          </div>
        </>
      ) : (
        <div className="fp-opt-meta na">{PLAN.na}</div>
      )}
      <div className="fp-opt-detail"><span className="fp-opt-why">{PLAN.whyLabel}. </span>{r.detail}</div>
      <button
        type="button"
        className={'fp-toggle fp-opt-toggle' + (on && r.applicable ? ' on' : '')}
        aria-pressed={on && r.applicable}
        disabled={!r.applicable}
        onClick={() => onToggle(r.id)}
      >
        {r.applicable ? (on ? PLAN.toggleOn + ' ✓' : PLAN.toggleOff + ' +') : PLAN.na}
      </button>
    </li>
  );
}

export default function Plan({ macc, pathway, plan, onToggle, voice = 'own', dwellingNudge, onDwellingAnswer }) {
  const trackRef = useRef(null);
  const plannerRef = useRef(null);
  const impactRef = useRef(null);
  const cardsHeadRef = useRef(null);
  // Answering removes the nudge, and the button with it, so focus moves to the
  // card list the answer changed rather than dropping to the page.
  const answerDwelling = (ownsRoof) => {
    onDwellingAnswer(ownsRoof);
    requestAnimationFrame(() => { if (cardsHeadRef.current) cardsHeadRef.current.focus({ preventScroll: true }); });
  };
  const [view, setView] = useState('pathway');
  const horizonYear = pathway.years[pathway.years.length - 1];
  const landing = pathway.plan[pathway.plan.length - 1];
  const bauLanding = pathway.bau[pathway.bau.length - 1];
  const y2030i = pathway.years.indexOf(2030) !== -1 ? pathway.years.indexOf(2030) : 4;
  const at2030 = pathway.plan[y2030i];
  const bau2030 = pathway.bau[y2030i];
  const gap = at2030 - BUDGET_2030.tco2e;
  const baseline = pathway.bau[0] || 0;
  const enabledCount = pathway.enabled.length;
  const cut2030 = bau2030 > 0 ? Math.max(0, Math.round((1 - at2030 / bau2030) * 100)) : 0;
  // Indicative net annual dollars across the chosen changes (negative = a
  // saving). Each option states its own basis; this sums what is switched on.
  const chosenCost = macc
    .filter((r) => r.applicable && plan.enabled.includes(r.id))
    .reduce((s, r) => s + (r.cost || 0), 0);
  const moneyLine = chosenCost < -20
    ? fill(voice === 'example' ? PLAN.impact.savesExample : PLAN.impact.saves, { n: Math.abs(Math.round(chosenCost)).toLocaleString() })
    : chosenCost > 20
      ? fill(PLAN.impact.costs, { n: Math.round(chosenCost).toLocaleString() })
      : PLAN.impact.evens;

  // Biggest, doable options first; the not-relevant cards sit at the end.
  const options = [
    ...macc.filter((r) => r.applicable).sort((a, b) => b.reduction - a.reduction),
    ...macc.filter((r) => !r.applicable),
  ];

  // The readout pins to the top of the planner, so the chart card beside it has
  // to stop below the readout rather than behind it. Its height is one line on
  // a wide screen and three on a phone, so it is measured rather than assumed.
  useEffect(() => {
    const bar = impactRef.current;
    const planner = plannerRef.current;
    if (!bar || !planner) return undefined;
    const sync = () => {
      const h = Math.round(bar.getBoundingClientRect().height);
      if (h > 0) planner.style.setProperty('--fp-impact-h', h + 'px');
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  // Which ends of the rail are reached, so an arrow that has nowhere to go
  // says so instead of doing nothing.
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const syncEnds = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  };
  useEffect(() => {
    syncEnds();
    const el = trackRef.current;
    if (!el || !('ResizeObserver' in window)) return undefined;
    const ro = new ResizeObserver(syncEnds);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const nudge = (dir) => {
    const el = trackRef.current;
    if (!el || (dir < 0 && atStart) || (dir > 0 && atEnd)) return;
    const card = el.querySelector('.fp-opt');
    const step = card ? card.getBoundingClientRect().width + 14 : 300;
    // A whole view at a time on wide rails, one card on a phone.
    const perView = card ? Math.max(1, Math.floor((el.clientWidth + 14) / step)) : 1;
    el.scrollBy({ left: dir * step * perView, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <section id="fp-plan">
      <div className="canvas">
        <div className="sec-tag" data-idx="02 / "><Icon name="target" size={32} />What if</div>
        <h2 className="display fp-h2"><SplitText text={PLAN.title[0]} /> <SplitText text={PLAN.title[1]} accentIndex={1} /></h2>
        <p className="fp-sub">{voice === 'example' ? PLAN.subExample : PLAN.sub}</p>

        {/* Options as a carousel with the chart alongside, so a choice changes
            the chart in view. The readout heads the planner and pins there, so
            it keeps the effect visible without ever sitting over a card. */}
        <div className="fp-planner" ref={plannerRef}>
          <div className="fp-impact" role="status" ref={impactRef}>
            <span className="fp-impact-l">{voice === 'example' ? PLAN.impact.labelExample : PLAN.impact.label}</span>
            {enabledCount === 0 ? (
              <span className="fp-impact-line">{PLAN.impact.none}</span>
            ) : (
              <span className="fp-impact-line">
                {fill(voice === 'example' ? PLAN.impact.lineExample : PLAN.impact.line, {
                  n: enabledCount, s: enabledCount > 1 ? 's' : '',
                  at2030: fmtT(at2030), bau2030: fmtT(bau2030), pct: cut2030,
                })}{' · '}
                <em className={gap > 0 ? 'over' : 'within'}>
                  {gap > 0 ? fill(PLAN.impact.over, { gap: fmtT(gap) }) : PLAN.impact.within}
                </em>{' · '}
                <em className="money">{moneyLine}</em>
              </span>
            )}
          </div>

          <div className="fp-card fp-planner-cards">
            <div className="fp-card-head" ref={cardsHeadRef} tabIndex={-1}>{PLAN.tableTitle}</div>
            <div className="fp-card-sub">{PLAN.tableSub}</div>
            {/* The quick path never asked where you live, so two whole-home
                measures sit greyed out on an assumption. The correction lands
                here, beside the cards it unlocks, rather than costing every
                visitor a question in a one-minute flow. */}
            {dwellingNudge && (
              <section className="fp-dwelling-nudge" aria-labelledby="fp-dwelling-k">
                <h3 className="fp-dwelling-k" id="fp-dwelling-k">
                  {fill(PLAN.dwellingNudge.kicker, {
                    n: PLAN.dwellingNudge.counts[dwellingNudge.actions.length] || dwellingNudge.actions.length,
                    verb: dwellingNudge.actions.length > 1 ? 'are' : 'is',
                  })}
                </h3>
                <p className="fp-dwelling-body">
                  {/* The card names keep their own casing, so the sentence
                      points at labels the visitor can find right below it. */}
                  {fill(PLAN.dwellingNudge.body, {
                    list: listOf(dwellingNudge.actions),
                    verb: dwellingNudge.actions.length > 1 ? 'are' : 'is',
                  })}
                </p>
                <div className="fp-ctrl-row">
                  <button type="button" className="btn btn-primary fp-btn" onClick={() => answerDwelling(true)}>
                    {PLAN.dwellingNudge.cta}
                  </button>
                  <button type="button" className="fp-linkbtn" onClick={() => answerDwelling(false)}>
                    {PLAN.dwellingNudge.dismiss}
                  </button>
                </div>
              </section>
            )}
            <div className="fp-carousel">
              {/* The arrows sit in their own row, never over a card. */}
              <div className="fp-car-nav">
                <span className="fp-car-count">{fill(PLAN.carouselCount, { n: options.length })}</span>
                <button type="button" className="fp-car-btn prev" aria-label={PLAN.prev} aria-controls="fp-car-track" aria-disabled={atStart} onClick={() => nudge(-1)}>‹</button>
                <button type="button" className="fp-car-btn next" aria-label={PLAN.next} aria-controls="fp-car-track" aria-disabled={atEnd} onClick={() => nudge(1)}>›</button>
              </div>
              <ul className="fp-car-track" id="fp-car-track" ref={trackRef} aria-label={PLAN.carouselLabel} onScroll={syncEnds}>
                {options.map((r) => (
                  <OptionCard key={r.id} r={r} on={plan.enabled.includes(r.id)} baseline={baseline} onToggle={onToggle} />
                ))}
              </ul>
            </div>
          </div>

          <div className="fp-card fp-scenario">
            <div className="fp-card-toprow">
              <div className="fp-card-head">{view === 'cost' ? PLAN.costTitle : PLAN.scenarioTitle}</div>
              <div className="fp-viewtabs" role="group" aria-label={PLAN.chartViewLabel}>
                <button type="button" aria-pressed={view === 'pathway'} className={'fp-viewtab' + (view === 'pathway' ? ' on' : '')} onClick={() => setView('pathway')}>{PLAN.pathTab}</button>
                <button type="button" aria-pressed={view === 'cost'} className={'fp-viewtab' + (view === 'cost' ? ' on' : '')} onClick={() => setView('cost')}>{PLAN.costTab}</button>
              </div>
            </div>
            <div className="fp-card-sub">{view === 'cost' ? PLAN.costSub : PLAN.scenarioSub}</div>
            {view === 'cost' ? (
              <>
                <MaccChart rows={macc} />
                <p className="fp-note">{PLAN.costMoneyNote}</p>
              </>
            ) : (
              <>
                <PathwayChart
                  pathway={pathway}
                  budget={BUDGET_2030.tco2e}
                  labels={{ bau: PLAN.bauLabel, plan: PLAN.planLabel, budget: PLAN.budgetLabel }}
                />
                <div className="fp-legend" aria-hidden="true">
                  <span className="fp-leg-item"><span className="fp-leg-line dash" style={{ color: PATHWAY_COLORS.bau }} />{PLAN.bauLabel}</span>
                  <span className="fp-leg-item"><span className="fp-leg-line" style={{ color: PATHWAY_COLORS.plan }} />{PLAN.planLabel}</span>
                  <span className="fp-leg-item"><span className="fp-leg-line dash" style={{ color: PATHWAY_COLORS.budget }} />{PLAN.budgetLabel}</span>
                </div>
                <p className="fp-takeaway">
                  {fill(voice === 'example' ? PLAN.takeaway.leadExample : PLAN.takeaway.lead, { year: horizonYear })} <em>{fmtT(landing)} t</em>, {fill(PLAN.takeaway.mid, { bau: fmtT(bauLanding), at2030: fmtT(at2030) })} {gap > 0
                    ? <>{PLAN.takeaway.over} <em>{fill(PLAN.impact.over, { gap: fmtT(gap) })}</em>.</>
                    : <>{PLAN.takeaway.within} <em>{PLAN.impact.within}</em>.</>}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
