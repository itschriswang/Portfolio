import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grain, ScrollProgress, SkipLink, navLinkClass, useHashLanding, useStickyNavHeight } from '../components/Chrome';
import SplitText from '../components/SplitText';
import { NAV_LINKS } from '../data/content';
import {
  TABS, WORK_NARRATIVE, ROADMAP_INTRO, ROADMAP_STAGES, ROADMAP_LEVERS,
  MCA_INTRO, MCA_CRITERIA, MCA_ANALYSIS, LCA,
  CASE_INTRO,
} from './workData';
import Baseline from './Baseline';
import CaseStudy from './CaseStudy';
import SiteFooter from '../components/SiteFooter';
import Mark from '../components/Mark';
import Icon from '../components/Icons';
import Aurora from '../components/Aurora';
import ContourField from '../components/ContourField';

function WorkNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  // Height first, then the landing: the landing clears whatever the bar measures.
  useStickyNavHeight();
  useHashLanding();
  // Escape closes the open mobile menu, matching every other nav on the site.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav-inner canvas">
        <a href="../" className="nav-logo"><Mark label="Chris Wang, home" /></a>
        {/* No role here: this sits inside <nav aria-label="Primary">, and a
            second role="navigation" published a duplicate, unnamed landmark. */}
        <div className={`nav-links${menuOpen ? ' open' : ''}`} id="nav-links">
          {NAV_LINKS.map((l) => {
            // Self-link stays './'; every other target (anchors on the main
            // page, sibling sub-pages) is reached via the parent directory.
            const active = l.href === 'work/';
            const href = active ? './' : '../' + l.href;
            return <a key={l.label} href={href} className={navLinkClass(l, active)} aria-current={active ? 'true' : undefined}>{l.label}</a>;
          })}
        </div>
        <button
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}

// A wide table scrolls sideways inside its own frame on narrow screens. The
// frame is a named, focusable region so a keyboard user can reach it and
// scroll it with the arrow keys, and a short hint shows only while there is
// something to scroll to.
function DataTable({ data }) {
  const ref = useRef(null);
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const check = () => setOverflows(el.scrollWidth > el.clientWidth + 1);
    check();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <>
      <div className="scroll-x" ref={ref} tabIndex={0} role="region" aria-label={data.caption}>
        <table className={`c-table cols-${data.head.length}`}>
          <thead><tr>{data.head.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr></thead>
          <tbody>
            {data.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
      {overflows && <p className="scroll-hint" aria-hidden="true">Scroll sideways for more columns <span>→</span></p>}
    </>
  );
}

function RoadmapPanel() {
  return (
    <div>
      <p className="panel-intro">{ROADMAP_INTRO}</p>
      <div className="stage-grid">
        {ROADMAP_STAGES.map((s) => (
          <div className="stage" key={s.n}>
            <div className="stage-n">{s.n}</div>
            <div className="stage-title">{s.title}</div>
            <div className="stage-obj">{s.obj}</div>
            <ul className="stage-pts">{s.pts.map((p, i) => <li key={i}>{p}</li>)}</ul>
            <div className="stage-note">{s.note}</div>
          </div>
        ))}
      </div>
      <div className="sec-sub">{ROADMAP_LEVERS.caption}</div>
      <DataTable data={ROADMAP_LEVERS} />
    </div>
  );
}

function McaPanel() {
  return (
    <div>
      <p className="panel-intro">{MCA_INTRO}</p>
      <div className="mca-grid">
        {MCA_CRITERIA.map((m) => (
          <div className="mca" key={m.crit}>
            <div className="mca-crit">{m.crit}</div>
            <div className="mca-metric">{m.metric}</div>
            <div className="mca-body">{m.body}</div>
          </div>
        ))}
      </div>
      <div className="sec-sub mt2">{MCA_ANALYSIS.caption}</div>
      <DataTable data={MCA_ANALYSIS} />
    </div>
  );
}

function LcaPanel() {
  return (
    <div>
      <div className="bl-banner">
        <div className="bl-claim">{LCA.claim}</div>
        <div className="bl-meta">{LCA.meta}</div>
      </div>
      <div className="lc-modwrap">
        <div className="lc-modwrap-head">{LCA.modulesHead}</div>
        <div className="lc-modules">
          {LCA.modules.map((m) => (
            <div className={'lcm ' + m.state} key={m.ref}>
              <span className="lcm-ref">{m.ref}</span><span className="lcm-label">{m.label}</span>
            </div>
          ))}
        </div>
        <div className="lcm-legend">
          {LCA.legend.map((l, i) => (
            <div className="lcm-leg-item" key={i}><div className={'lcm-leg-dot ' + l.cls} />{l.text}</div>
          ))}
        </div>
      </div>
      <div className="sec-sub mt2">{LCA.methodHead}</div>
      <p className="panel-intro">{LCA.methodNote}</p>
      <div className="sec-sub">{LCA.pathwaysHead}</div>
      <div className="scope-grid" style={{ marginTop: '1px' }}>
        {LCA.pathways.map((p, i) => (
          <div className="scope-cell" key={i}><div className="scope-tag">{p.tag}</div><div className="scope-body">{p.body}</div></div>
        ))}
      </div>
      <div className="sec-sub">{LCA.hierarchy.caption}</div>
      <DataTable data={LCA.hierarchy} />
      <div className="sec-sub mt2">{LCA.systemsHead}</div>
      <div className="scope-grid" style={{ marginTop: '1px' }}>
        {LCA.systems.map((s, i) => (
          <div className="scope-cell" key={i}><div className="scope-tag">{s.tag}</div><div className="scope-pct">{s.pct}</div><div className="scope-body">{s.body}</div></div>
        ))}
      </div>
      <div className="sec-sub mt2">{LCA.hotspotsCaption}</div>
      <div className="s3-head"><span>Material / system</span><span>Share</span><span>Scale</span></div>
      {LCA.hotspots.map((h, i) => (
        <div className="s3-row" key={i}>
          <div className="s3-name">{h.name}<span className="s3-sub">{h.sub}</span></div>
          <div className="s3-pct">{h.pct}</div>
          <div className="s3-bar-wrap"><div className="s3-bar-fill" style={{ width: h.w + '%', background: h.bg }} /></div>
        </div>
      ))}
      <div className="bench-wrap mt2">
        <div className="bench-head">{LCA.benchHead}</div>
        <div className="bench-scale">
          <div className="bench-bar-bg" /><div className="bench-range" />
          <div className="bench-mark this-b"><div className="bench-mark-label">520: this building</div></div>
          <div className="bench-mark target-b"><div className="bench-mark-label">&lt;400 target</div></div>
        </div>
        <div className="bench-ticks">{LCA.benchTicks.map((t, i) => <span className="bench-tick" key={i}>{t}</span>)}</div>
        <div className="bench-legend">
          {LCA.benchLegend.map((l, i) => (
            <div className="bench-leg-item" key={i}><div className="bench-leg-line" style={{ background: l.color }} />{l.text}</div>
          ))}
        </div>
        <div className="bench-note">{LCA.benchNote}</div>
      </div>
      <div className="sec-sub">{LCA.levers.caption}</div>
      <DataTable data={LCA.levers} />
      <div className="impl-grid mt2">
        {LCA.tiles.map((t, i) => (
          <div className="impl" key={i}><div className="impl-head">{t.h}</div><div className="impl-body">{t.b}</div></div>
        ))}
      </div>
    </div>
  );
}

const PANELS = { baseline: Baseline, roadmap: RoadmapPanel, mca: McaPanel, lca: LcaPanel };

export default function WorkApp() {
  const [tab, setTab] = useState('baseline');
  const Panel = PANELS[tab];

  // Roving tabindex with arrow-key movement, per the ARIA tabs pattern.
  const onTabKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const idx = TABS.findIndex((t) => t.id === tab);
    const next = TABS[(idx + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length];
    setTab(next.id);
    document.getElementById(`work-tab-${next.id}`)?.focus();
  };

  return (
    <>
      <SkipLink />
      <Grain />
      <ScrollProgress />
      <WorkNav />

      <main id="main-content" className="page-work">
      <section id="work-intro">
        <div className="bloom-wrap" aria-hidden="true"><div className="bloom bloom-a" /><div className="bloom bloom-b" /><div className="bloom bloom-c" /></div>
        <Aurora
          colorStops={['#635BFF', '#B5C42B', '#FF9500', '#FF3B60']}
          amplitude={0.6}
          blend={0.5}
          opacity={0.2}
        />
        <ContourField />
        <div className="canvas" style={{ position: 'relative', zIndex: 1 }}>
          <div className="sec-tag" data-idx="01 / "><Icon name="chart" size={30} />Work samples</div>
          <h1 className="wi-title display"><SplitText text="Frameworks" /> <SplitText text="in practice" accentIndex={1} /></h1>
          <p className="wi-sub">Four analytical frameworks for infrastructure, built environment and government work, each shown as an interactive example on illustrative data. Select a tab to see the method.</p>
          <a href="../" className="wi-back"><span>←</span>&nbsp;Back to profile</a>
        </div>
      </section>

      <section id="work-narrative">
        <div className="canvas">
          <div className="sec-tag" data-idx="02 / "><Icon name="book" size={30} />{WORK_NARRATIVE.tag}</div>
          <h2 className="wn-title display"><SplitText text={WORK_NARRATIVE.title} accentIndex={1} /></h2>
          <div className="wn-body">
            {WORK_NARRATIVE.paras.map((p, i) => <p className="wn-para" key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      <section id="work-samples">
        <div className="canvas">
          {/* Four samples, one panel at a time: the ARIA tabs contract in full.
              Roving tabindex makes the strip a single tab stop and the arrows
              move within it, and each tab names the panel it swaps in. The
              roles were here before the keyboard behaviour was, which promised
              assistive tech arrow keys that did nothing. */}
          <div className="tabs" role="tablist" aria-label="Work samples" onKeyDown={onTabKey}>
            {TABS.map((t) => (
              <button
                key={t.id}
                id={`work-tab-${t.id}`}
                className={'tab' + (tab === t.id ? ' on' : '')}
                role="tab"
                aria-selected={tab === t.id}
                aria-controls="work-tabpanel"
                tabIndex={tab === t.id ? 0 : -1}
                onClick={() => setTab(t.id)}
              >
                {t.icon && <Icon name={t.icon} size={30} className="fpi-lead" aria-hidden="true" />}<span className="tab-lt">{t.letter}&nbsp;</span>{t.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              id="work-tabpanel"
              role="tabpanel"
              aria-labelledby={`work-tab-${tab}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            >
              <Panel />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section id="casestudy">
        <div className="canvas">
          <div className="sec-tag" data-idx="03 / "><Icon name="book" size={30} />Case study</div>
          <h2 className="display" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', marginTop: '1.2rem', marginBottom: '1rem' }}>
            <SplitText text="Baseline to boardroom" accentIndex={2} />
          </h2>
          <p className="panel-intro" style={{ marginBottom: 0 }}>{CASE_INTRO}</p>
          <CaseStudy />
        </div>
      </section>
      </main>

      <SiteFooter base="../" />
    </>
  );
}
