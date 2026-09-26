import { useEffect, useRef, useState } from 'react';
import { CASE_STEPS } from './workData';

// The four sticky figures, one per phase.
function Figures({ active }) {
  return (
    <div className="scrolly-fig" aria-hidden="true">
      <div className="sfig-dots">
        {[0, 1, 2, 3].map((i) => <span key={i} className={'sfig-dot' + (active === i ? ' on' : '')} />)}
      </div>

      <div className={'sfig' + (active === 0 ? ' on' : '')}>
        <div className="sfig-kick">Phase 01 · Establish the baseline</div>
        <div className="sfig-big">82.7%</div>
        <div className="sfig-cap">of the footprint sits in the value chain (Scope 3), illustrative infrastructure portfolio</div>
        <div className="sfig-bars">
          <div className="sfig-bar-row"><span className="sfig-bar-lbl">Scope 1</span><div className="sfig-bar"><i style={{ '--w': '14%' }} /></div><span className="sfig-bar-val">11.5%</span></div>
          <div className="sfig-bar-row"><span className="sfig-bar-lbl">Scope 2</span><div className="sfig-bar"><i style={{ '--w': '7%' }} /></div><span className="sfig-bar-val">5.8%</span></div>
          <div className="sfig-bar-row"><span className="sfig-bar-lbl">Scope 3</span><div className="sfig-bar"><i style={{ '--w': '100%' }} /></div><span className="sfig-bar-val">82.7%</span></div>
        </div>
      </div>

      <div className={'sfig' + (active === 1 ? ' on' : '')}>
        <div className="sfig-kick">Phase 02 · Build the roadmap</div>
        <div className="sfig-big">27→9</div>
        <div className="sfig-cap">illustrative count: initiatives long-listed, quantified, then screened with stakeholders into a sequenced roadmap</div>
        <div className="sfig-bars">
          <div className="sfig-bar-row"><span className="sfig-bar-lbl">Long-list</span><div className="sfig-bar"><i style={{ '--w': '100%', background: 'var(--rule-dk)' }} /></div><span className="sfig-bar-val">27</span></div>
          <div className="sfig-bar-row"><span className="sfig-bar-lbl">MCA screen</span><div className="sfig-bar"><i style={{ '--w': '55%' }} /></div><span className="sfig-bar-val">15</span></div>
          <div className="sfig-bar-row"><span className="sfig-bar-lbl">Roadmap</span><div className="sfig-bar"><i style={{ '--w': '33%' }} /></div><span className="sfig-bar-val">9</span></div>
        </div>
      </div>

      <div className={'sfig' + (active === 2 ? ' on' : '')}>
        <div className="sfig-kick">Phase 03 · Model the pathway</div>
        <svg className="sfig-chart" viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
          <line className="sfig-grid" x1="10" y1="130" x2="330" y2="130" />
          <line className="sfig-grid" x1="10" y1="90" x2="330" y2="90" />
          <line className="sfig-grid" x1="10" y1="50" x2="330" y2="50" />
          <polyline className="sfig-bau" points="10,28 330,42" />
          <path className="sfig-path" d="M10,28 C90,32 150,52 210,84 C260,110 300,122 330,127" />
          <text className="sfig-t" x="10" y="16" fontSize="13" letterSpacing="0.06em">FY25</text>
          <text className="sfig-t" x="330" y="16" fontSize="13" letterSpacing="0.06em" textAnchor="end">FY50</text>
          <text className="sfig-t" x="240" y="30" fontSize="13">BAU</text>
          <text className="sfig-t sfig-t-acc" x="30" y="80" fontSize="13">NET PATHWAY</text>
        </svg>
        <div className="sfig-cap" style={{ marginTop: '1rem', marginBottom: 0 }}>Toggle-based levers, each tied to a published source</div>
      </div>

      <div className={'sfig' + (active === 3 ? ' on' : '')}>
        <div className="sfig-kick">Phase 04 · Make it repeatable</div>
        <div className="sfig-cap">What is in place before the numbers leave the model</div>
        <ul className="sfig-checks">
          <li>Method documented for assurance</li>
          <li>Repetitive steps scripted and templated</li>
          <li>Next cycle reruns the same logic</li>
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
