// Australia's Climate Progress (/progress/). A lighter, scroll-driven take on
// the Life Footprint reveal, pointed at the country instead of one person:
// reference point first, then the number as it stands, then the gap. No WebGL.
// framer-motion useInView triggers a CountUp; everything degrades to plain
// stacked content under prefers-reduced-motion.

import { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { SkipLink, Grain, ScrollProgress } from '../components/Chrome';
import { ToolNav, ToolFooter } from '../components/ToolNav';
import Icon from '../components/Icons';
import { prefersReducedMotion } from '../utils/media';
import { fetchNemSnapshot } from '../lib/opennem';
import {
  META, INTRO, CHAPTERS, SUMMARY, METHOD, SOURCES, STATUS, LABELS, FOOT,
} from './data';

// Section numbers run on from the chapters: the summary, then the method.
const pad = (n) => String(n).padStart(2, '0');
const SUMMARY_IDX = pad(CHAPTERS.length + 1);
const METHOD_IDX = pad(CHAPTERS.length + 2);

// Count from 0 to `to` once `run` turns true. Under reduced motion it renders
// the final value immediately and never animates.
function CountUp({ to, decimals = 0, prefix = '', suffix = '', run }) {
  const reduced = useMemo(prefersReducedMotion, []);
  const [val, setVal] = useState(reduced ? to : 0);
  useEffect(() => {
    if (reduced || !run) return undefined;
    let raf;
    const dur = 1100;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to, reduced]);
  const shown = reduced ? to : val;
  return <>{prefix}{shown.toFixed(decimals)}{suffix}</>;
}

// A source line, resolved from an id.
function SourceLine({ id }) {
  const s = SOURCES[id];
  if (!s) return null;
  return (
    <li className="pr-src-item">
      <span className="pr-src-name">{s.name}</span>
      <span className="pr-src-detail">{s.detail}</span>
      <span className="pr-src-meta">
        {LABELS.accessed} {s.accessed}
        {s.url && <> · <a href={s.url} target="_blank" rel="noopener noreferrer">{LABELS.sourceLink}</a></>}
      </span>
    </li>
  );
}

// One chapter: reference point (quiet), the reveal (loud), the gap (plain).
function Chapter({ m, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' });
  const idx = pad(index + 1);
  return (
    <section
      className={'pr-chapter' + (inView ? ' in' : '')}
      ref={ref}
      aria-labelledby={'pr-ch-' + m.id}
    >
      <div className="canvas pr-chapter-inner">
        <div className="sec-tag" data-idx={idx}>
          <Icon name={m.icon} size={32} />{m.tag}
        </div>

        {/* Reference point first, deliberately quieter than the reveal. */}
        <div className="pr-ref">
          <div className="pr-ref-label">{m.reference.label}</div>
          <div className="pr-ref-value">{m.reference.value}</div>
          <p className="pr-ref-note">{m.reference.note}</p>
        </div>

        {/* The reveal. */}
        <div className="pr-reveal">
          <div className="pr-reveal-num" id={'pr-ch-' + m.id}>
            {m.reveal.big
              ? m.reveal.big
              : (
                <CountUp
                  to={m.reveal.value}
                  decimals={m.reveal.decimals}
                  prefix={m.reveal.prefix}
                  suffix={m.reveal.suffix}
                  run={inView}
                />
              )}
          </div>
          <p className="pr-reveal-label">{m.reveal.label}</p>
          {m.reveal.sub && <p className="pr-reveal-sub">{m.reveal.sub}</p>}
        </div>

        {/* The gap, one plain reading. */}
        <p className="pr-gap">{m.gap}</p>

        <div className="pr-meta">
          <span className="pr-chip">
            <span className="pr-chip-k">{LABELS.period}</span>{m.period}
          </span>
          <span className={'pr-chip pr-chip-status pr-chip-' + m.status}>{STATUS[m.status]}</span>
          <span className="pr-meta-src">
            {m.sources.map((id) => SOURCES[id] && SOURCES[id].name).filter(Boolean).join(' · ')}
          </span>
        </div>
      </div>
    </section>
  );
}

// The live grid garnish. Honest: shows nothing unless a live snapshot arrives,
// and never mixes the live shares into the annual figures.
function LiveSnapshot() {
  const [snap, setSnap] = useState(null);
  useEffect(() => {
    let alive = true;
    fetchNemSnapshot().then((r) => {
      if (alive && r && r.live) setSnap(r);
    }).catch(() => {});
    return () => { alive = false; };
  }, []);
  if (!snap) return null;
  const when = snap.asOfISO
    ? new Date(snap.asOfISO).toLocaleString('en-AU', {
      hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short',
    })
    : null;
  return (
    <>
      <div className="pr-live" role="status">
        <span className="pr-live-dot" aria-hidden="true" />
        <span className="pr-live-label">{META.live.label}</span>
        <span className="pr-live-val">
          {META.live.renewLabel} <strong>{Math.round(snap.renewableShare * 100)}%</strong>
        </span>
        <span className="pr-live-val">
          {META.live.coalLabel} <strong>{Math.round(snap.coalShare * 100)}%</strong>
        </span>
        {when && <span className="pr-live-asof">{META.live.asOf} {when}</span>}
      </div>
      {/* The note explains the reading, so it shows only alongside one. */}
      <p className="pr-live-note">{META.live.note}</p>
    </>
  );
}

function UpdatedStamp({ placement }) {
  return (
    <div className={'pr-updated pr-updated-' + placement}>
      <span className="pr-updated-dot" aria-hidden="true" />
      <span className="pr-updated-label">{META.updatedLabel}</span>
      <span className="pr-updated-date">{META.updated}</span>
      <span className="pr-updated-cadence">{META.cadence}</span>
    </div>
  );
}

export default function ProgressApp() {
  return (
    <>
      <SkipLink />
      <Grain />
      <ScrollProgress />
      <ToolNav home="../" />

      <main id="main-content">
        {/* Intro */}
        <section className="pr-hero" aria-labelledby="pr-hero-h">
          <div className="canvas pr-hero-inner">
            <div className="sec-tag" data-idx="00">
              <Icon name="target" size={32} />{INTRO.tag}
            </div>
            <div className="pr-kicker">{INTRO.kicker}</div>
            <h1 className="display pr-h1" id="pr-hero-h">
              {INTRO.title[0]}<br />
              <em>{INTRO.title[1]}</em>
            </h1>
            <p className="pr-sub">{INTRO.sub}</p>
            <p className="pr-read">{INTRO.read}</p>

            <UpdatedStamp placement="top" />
            <LiveSnapshot />

            <div className="pr-scroll-hint" aria-hidden="true">
              <span className="pr-scroll-line" />{INTRO.scroll} ↓
            </div>
          </div>
        </section>

        {/* Chapters */}
        {CHAPTERS.map((m, i) => (
          <Chapter key={m.id} m={m} index={i} />
        ))}

        {/* Summary, on the one restrained dark band. */}
        <section className="pr-dark" aria-labelledby="pr-sum-h">
          <div className="canvas pr-dark-inner">
            <div className="sec-tag" data-idx={SUMMARY_IDX}>
              <Icon name="target" size={32} />{SUMMARY.tag}
            </div>
            <div className="pr-kicker pr-kicker-dark">{SUMMARY.kicker}</div>
            <h2 className="display pr-h2" id="pr-sum-h">
              {SUMMARY.title[0]}<br />
              <em>{SUMMARY.title[1]}</em>
            </h2>
            <p className="pr-dark-lead">{SUMMARY.lead}</p>

            <div className="pr-cols">
              <div className="pr-col">
                <div className="pr-col-head pr-col-up">{SUMMARY.moving.head}</div>
                <ul className="pr-col-list">
                  {SUMMARY.moving.items.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              </div>
              <div className="pr-col">
                <div className="pr-col-head pr-col-down">{SUMMARY.short.head}</div>
                <ul className="pr-col-list">
                  {SUMMARY.short.items.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              </div>
            </div>

            <p className="pr-dark-close">{SUMMARY.close}</p>
          </div>
        </section>

        {/* Method / basis of preparation */}
        <section id="pr-method" aria-labelledby="pr-method-h">
          <div className="canvas">
            <div className="sec-tag" data-idx={METHOD_IDX}>
              <Icon name="book" size={32} />{METHOD.tag}
            </div>
            <h2 className="display pr-h2 pr-h2-light" id="pr-method-h">
              {METHOD.title[0]} <em>{METHOD.title[1]}</em>
            </h2>
            <p className="pr-sub">{METHOD.sub}</p>

            <div className="pr-method-grid">
              {METHOD.blocks.map((b, i) => (
                <div className="pr-method-block" key={i}>
                  <h3><Icon name={b.icon} size={32} className="fpi-lead" />{b.title}</h3>
                  {b.paras.map((p, j) => <p key={j}>{p}</p>)}
                </div>
              ))}
            </div>

            <div className="pr-method-block pr-method-wide">
              <h3><Icon name="list" size={32} className="fpi-lead" />{METHOD.sourcesTitle}</h3>
              <ul className="pr-src-list">
                {Object.keys(SOURCES).map((id) => <SourceLine key={id} id={id} />)}
              </ul>
            </div>

            <UpdatedStamp placement="bottom" />
          </div>
        </section>
      </main>

      <ToolFooter home="../" name={FOOT.name} back={FOOT.back} />
    </>
  );
}
