import { useEffect, useRef, useState } from 'react';
import { BASELINE_SECTORS, CASE_FIGS as F, CASE_STEPS } from './workData';

// Phase 01 reads the infrastructure profile's scope split, so the case study
// and the baseline tool can never disagree on it.
const INFRA = BASELINE_SECTORS.infrastructure;
const SCOPES = [INFRA.s1, INFRA.s2, INFRA.s3].map((v, i) => ({ label: F.baseline.labels[i], v, n: parseFloat(v) }));

// Bar length relative to the largest value in its set.
const share = (n, set) => (n / Math.max(...set.map((x) => x.n))) * 100 + '%';
const kicker = (i) => F.phase + ' ' + CASE_STEPS[i].num + ' · ' + CASE_STEPS[i].title;

function Bars({ rows }) {
  return (
    <div className="sfig-bars">
      {rows.map((r) => (
        <div className="sfig-bar-row" key={r.label}>
          <span className="sfig-bar-lbl">{r.label}</span>
          <div className={'sfig-bar' + (r.muted ? ' muted' : '')}><i style={{ '--w': share(r.n, rows) }} /></div>
          <span className="sfig-bar-val">{r.v ?? r.n}</span>
        </div>
      ))}
    </div>
  );
}

// The four sticky figures, one per phase. The long-list bar is the starting
// pool, so it sits in a quiet tone and the screened counts carry the accent.
function Figures({ active }) {
  const funnel = F.roadmap.bars.map((b, i) => ({ ...b, muted: i === 0 }));
  return (
    <div className="scrolly-fig" aria-hidden="true">
      <div className="sfig-dots">
        {CASE_STEPS.map((s, i) => <span key={s.num} className={'sfig-dot' + (active === i ? ' on' : '')} />)}
      </div>

      <div className={'sfig' + (active === 0 ? ' on' : '')}>
        <div className="sfig-kick">{kicker(0)}</div>
        <div className="sfig-big">{INFRA.s3}</div>
        <div className="sfig-cap">{F.baseline.cap}</div>
        <Bars rows={SCOPES} />
      </div>

      <div className={'sfig' + (active === 1 ? ' on' : '')}>
        <div className="sfig-kick">{kicker(1)}</div>
        <div className="sfig-big">{funnel[0].n}→{funnel[funnel.length - 1].n}</div>
        <div className="sfig-cap">{F.roadmap.cap}</div>
        <Bars rows={funnel} />
      </div>

      <div className={'sfig' + (active === 2 ? ' on' : '')}>
        <div className="sfig-kick">{kicker(2)}</div>
        <svg className="sfig-chart" viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
          <line className="sfig-grid" x1="10" y1="130" x2="330" y2="130" />
          <line className="sfig-grid" x1="10" y1="90" x2="330" y2="90" />
          <line className="sfig-grid" x1="10" y1="50" x2="330" y2="50" />
          <polyline className="sfig-bau" points="10,28 330,42" />
          <path className="sfig-path" d="M10,28 C90,32 150,52 210,84 C260,110 300,122 330,127" />
          <text className="sfig-t" x="10" y="16" fontSize="13" letterSpacing="0.06em">{F.pathway.start}</text>
          <text className="sfig-t" x="330" y="16" fontSize="13" letterSpacing="0.06em" textAnchor="end">{F.pathway.end}</text>
          <text className="sfig-t" x="240" y="30" fontSize="13">{F.pathway.bau}</text>
          <text className="sfig-t sfig-t-acc" x="30" y="80" fontSize="13">{F.pathway.net}</text>
        </svg>
        <div className="sfig-cap sfig-cap-end">{F.pathway.cap}</div>
      </div>

      <div className={'sfig' + (active === 3 ? ' on' : '')}>
        <div className="sfig-kick">{kicker(3)}</div>
        <div className="sfig-cap">{F.repeat.cap}</div>
        <ul className="sfig-checks">
          {F.repeat.checks.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default function CaseStudy() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    // Deterministic: the active figure tracks whichever step is nearest the
    // viewport centre. Robust to fast scrolls and tall steps alike.
    const steps = stepRefs.current.filter(Boolean);
    if (!steps.length) return;
    let tick = false;
    const update = () => {
      const mid = window.innerHeight / 2;
      let best = 0, bestDist = Infinity;
      steps.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      setActive(best);
    };
    const onScroll = () => { if (!tick) { requestAnimationFrame(() => { update(); tick = false; }); tick = true; } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  return (
    <div className="scrolly">
      <Figures active={active} />
      <div className="scrolly-steps">
        {CASE_STEPS.map((s, i) => (
          <div className="sstep" data-fig={i} key={i} ref={(el) => (stepRefs.current[i] = el)}>
            <div className="sstep-num">{s.num}</div>
            <h3 className="sstep-title">{s.title}</h3>
            <p className="sstep-body">{s.body}</p>
            <div className="sstep-src">{s.src}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
