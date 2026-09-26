import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../components/Icons';
import { prefersReducedMotion } from '../utils/media';
import { BASELINE_SECTORS, buildSankey } from './workData';

const SECTORS = Object.keys(BASELINE_SECTORS);

function SankeyFigure({ sk }) {
  const wrapRef = useRef(null);
  // The figure is drawn for the width it actually has (see buildSankey), so
  // labels stay at 12px or more from a phone up rather than scaling down with
  // a fixed viewBox.
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const measure = () => setWidth(Math.round(el.clientWidth));
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const html = width ? buildSankey(sk[0], sk[1], sk[2], sk[3], sk[4], sk[5], width) : '';
  // Reveal via clip-path wipe on first view. Under reduced motion the figure
  // is simply there.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') { el.classList.add('sk-on'); return undefined; }
    const io = new IntersectionObserver((es, o) => {
      es.forEach((e) => { if (e.isIntersecting) { el.classList.add('sk-on'); o.disconnect(); } });
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div className="sankey-wrap" ref={wrapRef} dangerouslySetInnerHTML={{ __html: html }} />;
}

const tileReveal = {
  hidden: { opacity: 0, y: 18 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5, ease: [0.25, 1, 0.5, 1] } }),
};

export default function Baseline() {
  const [sector, setSector] = useState('property');
  // Reveals enhance a visible default: under reduced motion the tiles render
  // in place rather than waiting on an in-view trigger.
  const [still] = useState(() => prefersReducedMotion());
  const d = BASELINE_SECTORS[sector];

  return (
    <div>
      {/* One connected tool: profile selector, headline claim, and the scope
          split read as a single card, the same stepped language as the home
          decarb model, no floating divider between the selector and the split. */}
      <div className="baseline-tool">
        <div className="baseline-ctrl">
          <span className="baseline-ctrl-lbl">Operating profile</span>
          <div className="baseline-seg" role="group" aria-label="Operating profile">
            {SECTORS.map((k) => (
              <button key={k} type="button" className={sector === k ? 'on' : ''} aria-pressed={sector === k} onClick={() => setSector(k)}>
                {BASELINE_SECTORS[k].label}
              </button>
            ))}
          </div>
        </div>
        <div className="bl-banner">
          <div className="bl-claim">{d.claim}</div>
          <div className="bl-meta">{d.meta}</div>
        </div>
        <div className="scope-grid">
          <div className="scope-cell"><div className="scope-tag"><Icon name="flame" size={30} className="fpi-lead" />Scope 1: direct</div><div className="scope-pct">{d.s1}</div><div className="scope-body">{d.s1b}</div></div>
          <div className="scope-cell"><div className="scope-tag"><Icon name="bolt" size={30} className="fpi-lead" />Scope 2: electricity</div><div className="scope-pct">{d.s2}</div><div className="scope-body">{d.s2b}</div></div>
          <div className="scope-cell"><div className="scope-tag"><Icon name="globe" size={30} className="fpi-lead" />Scope 3: value chain</div><div className="scope-pct">{d.s3}</div><div className="scope-body">{d.s3b}</div></div>
        </div>
      </div>
      <div className="sankey-band">
        <div className="sankey-band-inner">
          <div className="sk-kicker">Fig. A · Emissions flow · FY25 baseline</div>
          <h2 className="sk-head">Where the footprint <em>flows</em></h2>
          <p className="sk-sub">Scope 1-3 distribution and the Scope 3 category breakdown for the selected organisation type. The value chain dominates, which is why reduction starts with suppliers and design choices.</p>
          <SankeyFigure key={sector} sk={d.sk} />
        </div>
      </div>
      <div className="impl-grid mt2">
        {d.tiles.map((t, i) => (
          <motion.div className="impl" key={i} custom={i} variants={tileReveal} initial={still ? false : 'hidden'} whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
            <div className="impl-head">{t.h}</div>
            <div className="impl-body">{t.b}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
