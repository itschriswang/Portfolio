// ============================================================================
// THE GARMENT STUDIO — the working half of Cost Per Wear.
//
// Four tools over one shared garment: the carbon footprint estimator (build
// it), the fabric comparator (choose its cloth), the supply chain mapper
// (follow it to Melbourne) and the circularity scorecard (design its second
// life). All figures come from buildGarment() in data.js: indicative estimates
// from published LCA factors, said plainly, once, in the estimator.
//
// Motion rules: the particle field and the route dash are decorative,
// aria-hidden, paused off-screen via IntersectionObserver, skipped entirely
// under prefers-reduced-motion (a static scatter renders instead), and
// cleaned up on unmount.
// ============================================================================
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  STUDIO_FIBRES, FIBRE_BY_ID, GARMENT_TYPES, SIZES, ORIGINS, ORIGIN_BY_ID,
  WORLD_MASK, DEST, STREAMS, CHAIN_STAGES, LOOP_CHOICES,
  buildGarment, scoreCircularity, COPY,
} from './data';
import { prefersReducedMotion } from '../utils/media';
import Icon from '../components/Icons';
import Range from '../components/Range';

const C = COPY.studio;

const fmtKg = (v) => (v >= 10 ? Math.round(v) : v >= 1 ? v.toFixed(1) : v.toFixed(2));
const fmtInt = (v) => Math.round(v).toLocaleString('en-AU');

function StudioHead({ c }) {
  return (
    <>
      <div className="ow-sechead">
        <div className="sec-tag" data-idx={`${c.idx} / `}>
          {c.icon && <Icon name={c.icon} size={30} />}{c.sub}
        </div>
        <h2 className="display ow-h2">{c.title}</h2>
      </div>
      <p className="ow-lede">{c.lede}</p>
    </>
  );
}

// --------------------------------------------------------------- silhouettes
// Simple line-art garment shapes, decorative only; the particle field drifts
// around whichever one is being built.
const SILHOUETTES = {
  tee: 'M20 20 L38 11 C42 18 58 18 62 11 L80 20 L89 36 L71 42 L71 89 L29 89 L29 42 L11 36 Z',
  shirt: 'M20 20 L40 12 L46 20 L50 26 L54 20 L60 12 L80 20 L89 36 L71 42 L71 89 L29 89 L29 42 L11 36 Z M50 32 L50 84',
  hoodie: 'M20 24 L34 15 C34 2 66 2 66 15 L80 24 L90 44 L72 50 L72 90 L28 90 L28 50 L10 44 Z M38 68 L62 68 L58 84 L42 84 Z',
  jeans: 'M30 10 L70 10 L74 50 L76 92 L58 92 L52 46 L48 46 L42 92 L24 92 L26 50 Z',
  dress: 'M32 12 L45 18 L55 18 L68 12 L72 30 L62 38 L74 88 L26 88 L38 38 L28 30 Z',
};

function GarmentGlyph({ typeId }) {
  return (
    <svg viewBox="0 0 100 100" className="ow-garment" aria-hidden="true">
      <path d={SILHOUETTES[typeId] || SILHOUETTES.tee} />
    </svg>
  );
}

// ------------------------------------------------------------ particle field
// One mote per 50 g of CO2e, capped per stream. Motes rise from four labelled
// emitters and settle into a slow orbit around the garment.
const MOTE_KG = 0.05;
const STREAM_CAP = 220;

function ParticleField({ garment, typeId }) {
  const canvasRef = useRef(null);
  const garmentRef = useRef(garment);
  garmentRef.current = garment;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const reduced = prefersReducedMotion();
    let raf = 0;
    let visible = false;
    let last = 0;
    const parts = [];

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || 300;
      const h = canvas.clientHeight || 300;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return [w, h];
    };

    const targetCounts = () => {
      const s = garmentRef.current.streams;
      const out = {};
      for (const st of STREAMS) out[st.id] = Math.min(STREAM_CAP, Math.round(s[st.id] / MOTE_KG));
      return out;
    };

    const emitterX = (w, i) => w * (0.14 + i * 0.24);

    const makeMote = (stream, i, w, h, settled) => {
      const angle = Math.random() * Math.PI * 2;
      const ring = Math.min(w, h) * (0.24 + Math.random() * 0.16);
      return {
        stream, angle, ring,
        spin: (0.12 + Math.random() * 0.25) * (Math.random() < 0.5 ? -1 : 1),
        r: 1.2 + Math.random() * 1.5,
        wob: Math.random() * Math.PI * 2,
        x: settled ? w / 2 + Math.cos(angle) * ring : emitterX(w, i) + (Math.random() - 0.5) * 14,
        y: settled ? h * 0.46 + Math.sin(angle) * ring * 0.82 : h - 6,
        mode: settled ? 'orbit' : 'rise',
        alpha: settled ? 0.75 : 0,
        dying: false,
      };
    };

    const reconcile = (w, h, settled) => {
      const want = targetCounts();
      const have = {};
      for (const p of parts) if (!p.dying) have[p.stream] = (have[p.stream] || 0) + 1;
      STREAMS.forEach((st, i) => {
        const need = (want[st.id] || 0) - (have[st.id] || 0);
        if (need > 0) {
          for (let k = 0; k < need; k += 1) parts.push(makeMote(st.id, i, w, h, settled));
        } else if (need < 0) {
          let left = -need;
          for (const p of parts) {
            if (left === 0) break;
            if (p.stream === st.id && !p.dying) { p.dying = true; left -= 1; }
          }
        }
      });
    };

    const colour = Object.fromEntries(STREAMS.map((s) => [s.id, s.color]));

    const draw = (w, h) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = colour[p.stream];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const step = (t) => {
      raf = 0;
      const [w, h] = [canvas.clientWidth, canvas.clientHeight];
      const dt = Math.min(0.05, last ? (t - last) / 1000 : 0.016);
      last = t;
      reconcile(w, h, false);
      const cx = w / 2;
      const cy = h * 0.46;
      for (let i = parts.length - 1; i >= 0; i -= 1) {
        const p = parts[i];
        if (p.dying) {
          p.alpha -= dt * 1.6;
          if (p.alpha <= 0) { parts.splice(i, 1); continue; }
        } else if (p.alpha < 0.75) p.alpha = Math.min(0.75, p.alpha + dt * 1.4);
        if (p.mode === 'rise') {
          const tx = cx + Math.cos(p.angle) * p.ring;
          const ty = cy + Math.sin(p.angle) * p.ring * 0.82;
          p.wob += dt * 5;
          p.x += (tx - p.x) * dt * 1.6 + Math.sin(p.wob) * 0.35;
          p.y += (ty - p.y) * dt * 1.6;
          if (Math.abs(tx - p.x) + Math.abs(ty - p.y) < 6) p.mode = 'orbit';
        } else {
          p.angle += p.spin * dt;
          p.wob += dt * 1.8;
          const breathe = p.ring + Math.sin(p.wob) * 4;
          p.x = cx + Math.cos(p.angle) * breathe;
          p.y = cy + Math.sin(p.angle) * breathe * 0.82;
        }
      }
      draw(w, h);
      if (visible) raf = requestAnimationFrame(step);
    };

    const renderStatic = () => {
      const [w, h] = fit();
      parts.length = 0;
      reconcile(w, h, true);
      draw(w, h);
    };

    const start = () => {
      if (reduced) { renderStatic(); return; }
      if (!raf && visible) { last = 0; raf = requestAnimationFrame(step); }
    };

    fit();
    const io = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver((entries) => {
        visible = entries.some((e) => e.isIntersecting);
        if (visible) start();
        else if (raf) { cancelAnimationFrame(raf); raf = 0; }
      }, { rootMargin: '80px' })
      : null;
    if (io) io.observe(canvas);
    else { visible = true; start(); }
    if (reduced) renderStatic();

    const onResize = () => { fit(); if (reduced) renderStatic(); };
    window.addEventListener('resize', onResize);
    // Under reduced motion there is no loop to pick up changes, so re-render
    // the static scatter whenever the garment totals move.
    let interval = 0;
    if (reduced) {
      let lastTotal = garmentRef.current.total;
      interval = window.setInterval(() => {
        if (Math.abs(garmentRef.current.total - lastTotal) > 0.01) {
          lastTotal = garmentRef.current.total;
          renderStatic();
        }
      }, 400);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (io) io.disconnect();
      if (interval) window.clearInterval(interval);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="ow-motes">
      <canvas ref={canvasRef} className="ow-motes-canvas" aria-hidden="true" />
      <GarmentGlyph typeId={typeId} />
      <span className="sr-only">{C.estimator.srField}</span>
    </div>
  );
}

// ------------------------------------------------------------------ dot map
const cellPt = ([c, r]) => [c * 10 + 5, r * 10 + 5];

function WorldMap({ originId, onSelect, showRoute = false, freight = 'sea', tall = false }) {
  const dots = useMemo(() => {
    const out = [];
    WORLD_MASK.forEach((row, r) => {
      [...row].forEach((ch, c) => { if (ch === '#' || ch === '*') out.push([c, r]); });
    });
    return out;
  }, []);
  const origin = ORIGIN_BY_ID[originId] || ORIGINS[0];
  const [ox, oy] = cellPt(origin.cell);
  const [dx, dy] = cellPt(DEST.cell);
  const mx = (ox + dx) / 2;
  const my = Math.min(oy, dy) - Math.max(26, Math.abs(ox - dx) * 0.22);

  return (
    <svg
      viewBox="0 0 640 230"
      className={`ow-map ${tall ? 'tall' : ''}`}
      role="group"
      aria-label={`Making origin map. Selected: ${origin.name}.`}
    >
      {dots.map(([c, r]) => (
        <circle key={`${c}-${r}`} cx={c * 10 + 5} cy={r * 10 + 5} r="2.1" className="owm-dot" />
      ))}
      {showRoute && (
        <path d={`M ${ox} ${oy} Q ${mx} ${my} ${dx} ${dy}`} className={`owm-route ${freight}`} />
      )}
      {ORIGINS.map((o) => {
        const [x, y] = cellPt(o.cell);
        const on = o.id === origin.id;
        return (
          <g
            key={o.id}
            className={`owm-pin ${on ? 'on' : ''}`}
            transform={`translate(${x},${y})`}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={`Made in ${o.name}`}
            onClick={() => onSelect(o.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(o.id); }
            }}
          >
            <title>{o.name}</title>
            <circle r="11" className="hit" />
            <circle r={on ? 5.5 : 3.6} className="dot" />
            {on && <circle r="9" className="ring" />}
            {on && <text y="-12" textAnchor="middle" className="lbl">{o.name}</text>}
          </g>
        );
      })}
      <g className="owm-dest" transform={`translate(${dx},${dy})`} aria-hidden="true">
        <rect x="-3.4" y="-3.4" width="6.8" height="6.8" transform="rotate(45)" />
        <text y="15" textAnchor="middle" className="lbl">{DEST.name}</text>
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------- estimator
function EstimatorSection({ g, spec, set }) {
  const c = C.estimator;
  const type = g.type;
  const shareMax = Math.max(...STREAMS.map((s) => g.streams[s.id]));

  return (
    <section className="ow-section ow-reveal" id="estimator">
      <div className="canvas">
        <div className="ow-studio-intro">
          <span className="kicker">{C.kicker}</span>
          <p>{C.lede}</p>
        </div>
        <StudioHead c={c} />
        <div className="ow-est-grid">
          <div className="ow-est-controls ow-card-soft">
            <div className="ow-ctl">
              <span className="ow-ctl-l">{c.typeLabel}</span>
              <div className="ow-pills" role="group" aria-label={c.typeLabel}>
                {GARMENT_TYPES.map((t) => (
                  <button
                    key={t.id}
                    className={`ow-pillbtn ${spec.typeId === t.id ? 'on' : ''}`}
                    aria-pressed={spec.typeId === t.id}
                    onClick={() => set({ typeId: t.id, gsm: t.gsmDefault })}
                  >{t.name}</button>
                ))}
              </div>
            </div>
            <div className="ow-ctl">
              <span className="ow-ctl-l">{c.sizeLabel}</span>
              <div className="ow-pills" role="group" aria-label={c.sizeLabel}>
                {SIZES.map((s) => (
                  <button
                    key={s.id}
                    className={`ow-pillbtn sm ${spec.sizeId === s.id ? 'on' : ''}`}
                    aria-pressed={spec.sizeId === s.id}
                    onClick={() => set({ sizeId: s.id })}
                  >{s.label}</button>
                ))}
              </div>
            </div>
            <div className="ow-ctl">
              <span className="ow-ctl-l">{c.blendLabel}</span>
              <div className="ow-blend">
                <label className="ow-field">
                  <span>{c.blendALabel}</span>
                  <select
                    value={spec.blend.a}
                    onChange={(e) => set({ blend: { ...spec.blend, a: e.target.value } })}
                  >
                    {STUDIO_FIBRES.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </label>
                <label className="ow-field">
                  <span>{c.blendBLabel}</span>
                  <select
                    value={spec.blend.b || ''}
                    onChange={(e) => set({ blend: { ...spec.blend, b: e.target.value || null } })}
                  >
                    <option value="">{c.blendNone}</option>
                    {STUDIO_FIBRES.filter((f) => f.id !== spec.blend.a).map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              {spec.blend.b && (
                <div className="ow-slider">
                  <Range
                    min={50} max={95} step={5}
                    ticks={9}
                    value={spec.blend.pctA}
                    aria-label="Blend share of main fibre"
                    onChange={(e) => set({ blend: { ...spec.blend, pctA: Number(e.target.value) } })}
                  />
                  <span className="ow-slider-v">
                    {c.pctTemplate
                      .replace('{a}', spec.blend.pctA).replace('{an}', g.fibreA.name.toLowerCase())
                      .replace('{b}', 100 - spec.blend.pctA).replace('{bn}', g.fibreB.name.toLowerCase())}
                  </span>
                </div>
              )}
              <p className="ow-ctl-note">{g.fibreA.read}</p>
            </div>
            <div className="ow-ctl">
              <span className="ow-ctl-l">{c.gsmLabel}</span>
              <div className="ow-slider">
                <Range
                  min={type.gsmMin} max={type.gsmMax} step={10}
                  ticks={(type.gsmMax - type.gsmMin) / 10}
                  value={spec.gsm}
                  aria-label={c.gsmLabel}
                  onChange={(e) => set({ gsm: Number(e.target.value) })}
                />
                <span className="ow-slider-v">{spec.gsm} gsm · {g.clothKg.toFixed(2)} kg of cloth</span>
              </div>
            </div>
            <div className="ow-ctl">
              <span className="ow-ctl-l">{c.originLabel}</span>
              <label className="ow-field">
                <span className="sr-only">{c.originLabel}</span>
                <select value={spec.originId} onChange={(e) => set({ originId: e.target.value })}>
                  {ORIGINS.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </label>
              <WorldMap originId={spec.originId} onSelect={(id) => set({ originId: id })} />
              <p className="ow-ctl-note">{g.origin.note}</p>
            </div>
          </div>

          <div className="ow-est-readout ow-card-soft">
            <ParticleField garment={g} typeId={spec.typeId} />
            <div className="ow-total" aria-live="polite">
              <span className="l">{c.totalLabel}</span>
              <span className="n">{fmtKg(g.total)}<em> {c.unit}</em></span>
            </div>
            <div className="ow-streams">
              {STREAMS.map((s) => (
                <div className="ow-stream" key={s.id} title={s.note}>
                  <span className="dot" style={{ background: s.color }} aria-hidden="true" />
                  <span className="sl">{s.label}</span>
                  <span className="bar" aria-hidden="true">
                    <i style={{ width: `${(g.streams[s.id] / shareMax) * 100}%`, background: s.color }} />
                  </span>
                  <span className="sv">{fmtKg(g.streams[s.id])} kg</span>
                </div>
              ))}
            </div>
            <div className="ow-est-facts">
              <span>{c.waterLabel}: <b>{fmtInt(g.waterL)} L</b></span>
              <span>{c.wearsTemplate.replace('{n}', g.wears)}</span>
              <span>{c.carTemplate.replace('{n}', fmtInt(g.carKm))}</span>
            </div>
            <p className="ow-disclaimer">{c.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------------------------- comparator
const COMPARE_MAX = 3;

function FabricsSection({ onUse }) {
  const c = C.fabrics;
  const [pinned, setPinned] = useState(['cotton', 'poly', 'hemp']);
  const toggle = (id) => setPinned((prev) => (
    prev.includes(id) ? prev.filter((x) => x !== id)
      : prev.length >= COMPARE_MAX ? [...prev.slice(1), id] : [...prev, id]
  ));
  const fibres = pinned.map((id) => FIBRE_BY_ID[id]);
  const maxOf = (k) => Math.max(...STUDIO_FIBRES.map((f) => f[k]));

  const rows = [
    { id: 'ef', get: (f) => f.ef, fmt: (f) => f.ef.toFixed(1), scale: 'lin' },
    { id: 'waterL', get: (f) => f.waterL, fmt: (f) => fmtInt(f.waterL), scale: 'lin' },
    { id: 'microMg', get: (f) => f.microMg, fmt: (f) => f.microMg, scale: 'lin' },
    { id: 'wears', get: (f) => f.wearsMod, fmt: (f) => `×${f.wearsMod.toFixed(2)}`, scale: 'lin', invert: true },
    { id: 'decayYr', get: (f) => f.decayYr, fmt: (f) => (f.decayYr >= 500 ? '500+' : f.decayYr), scale: 'log' },
  ];
  const width = (row, f) => {
    const v = row.get(f);
    const max = maxOf(row.id === 'wears' ? 'wearsMod' : row.id);
    if (row.scale === 'log') return (Math.log10(1 + v) / Math.log10(1 + max)) * 100;
    return (v / max) * 100;
  };

  return (
    <section className="ow-section alt ow-reveal" id="fabrics">
      <div className="canvas">
        <StudioHead c={c} />
        <div className="ow-shelf" role="group" aria-label={c.pinHint}>
          <span className="ow-shelf-l">{c.pinHint}</span>
          {STUDIO_FIBRES.map((f) => (
            <button
              key={f.id}
              className={`ow-pillbtn ${pinned.includes(f.id) ? 'on' : ''}`}
              aria-pressed={pinned.includes(f.id)}
              onClick={() => toggle(f.id)}
            >{f.name}</button>
          ))}
        </div>
        {fibres.length === 0 ? (
          <div className="ow-empty"><p>Pin a fibre to put it on the bench.</p></div>
        ) : (
          <div className="ow-bench" style={{ '--cols': fibres.length }}>
            <div className="ow-bench-corner" aria-hidden="true" />
            {fibres.map((f) => (
              <div className="ow-bench-head" key={f.id}>
                <span className="fn">{f.name}</span>
                <span className="fk">{f.kind}</span>
              </div>
            ))}
            {rows.map((row) => (
              <div key={row.id} style={{ display: 'contents' }}>
                <div className="ow-bench-rk">
                  {c.rows[row.id].icon && <Icon name={c.rows[row.id].icon} size={28} className="fpi-lead" />}{c.rows[row.id].label}
                  <span>{c.rows[row.id].unit}</span>
                </div>
                {fibres.map((f) => (
                  <div className="ow-bench-cell" key={f.id + row.id}>
                    <span className="v">{row.fmt(f)}</span>
                    <span className={`bar ${row.invert ? 'good' : ''}`} aria-hidden="true">
                      <i style={{ width: `${width(row, f)}%` }} />
                    </span>
                  </div>
                ))}
              </div>
            ))}
              <div className="ow-bench-rk last">Plain read</div>
              {fibres.map((f) => (
                <div className="ow-bench-cell read" key={f.id + 'read'}>
                  <p>{f.read}</p>
                  <button className="ow-btn sm" onClick={() => onUse(f.id)}>{c.useThis}</button>
                </div>
              ))}
          </div>
        )}
        <p className="ow-note-line">{c.decayCapNote}</p>
      </div>
    </section>
  );
}

// -------------------------------------------------------------- chain mapper
function ChainSection({ g, spec, set }) {
  const c = C.chain;
  const stages = CHAIN_STAGES.map((s) => {
    const kg = s.frac != null ? g.streams[s.from] * s.frac : g.chain[s.id];
    return { ...s, kg };
  });
  const maxKg = Math.max(...stages.map((s) => s.kg));
  const airMult = useMemo(() => {
    const sea = buildGarment({ ...spec, freight: 'sea' }).streams.transport;
    const air = buildGarment({ ...spec, freight: 'air' }).streams.transport;
    return Math.round(air / sea);
  }, [spec]);

  return (
    <section className="ow-section ow-reveal" id="chain">
      <div className="canvas">
        <StudioHead c={c} />
        <div className="ow-chain-card ow-card-soft">
          <div className="ow-chain-top">
            <span className="ow-route-l">
              {c.routeTemplate
                .replace('{origin}', g.origin.name)
                .replace('{dest}', DEST.name)
                .replace('{km}', fmtInt(g.origin.km))}
            </span>
            <div className="ow-seg2" role="group" aria-label="Freight mode">
              <button
                className={spec.freight === 'sea' ? 'on' : ''}
                aria-pressed={spec.freight === 'sea'}
                onClick={() => set({ freight: 'sea' })}
              >{c.seaLabel}</button>
              <button
                className={spec.freight === 'air' ? 'on' : ''}
                aria-pressed={spec.freight === 'air'}
                onClick={() => set({ freight: 'air' })}
              >{c.airLabel}</button>
            </div>
          </div>
          <WorldMap
            originId={spec.originId}
            onSelect={(id) => set({ originId: id })}
            showRoute
            freight={spec.freight}
            tall
          />
          {spec.freight === 'air' && (
            <p className="ow-airwarn" role="status">{c.airWarnTemplate.replace('{n}', airMult)}</p>
          )}
        </div>
        <div className="ow-stages">
          {stages.map((s, i) => (
            <div className={`ow-stage ${s.id === 'dye' ? 'hot' : ''}`} key={s.id}>
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <span className="sn">{s.name}</span>
              <span className="sv">{fmtKg(s.kg)} kg CO2e</span>
              <span className="bar" aria-hidden="true"><i style={{ width: `${(s.kg / maxKg) * 100}%` }} /></span>
              <p>{s.hud}</p>
            </div>
          ))}
        </div>
        <p className="ow-note-line">{c.hotspotNote}</p>
      </div>
    </section>
  );
}

// -------------------------------------------------------- circularity score
function LoopSection({ g }) {
  const c = C.loop;
  const [choices, setChoices] = useState(['spares']);
  const toggle = (id) => setChoices((prev) => (
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  ));
  const result = scoreCircularity(g, choices);

  return (
    <section className="ow-section alt ow-reveal" id="loop">
      <div className="canvas">
        <StudioHead c={c} />
        <div className="ow-loop-grid">
          <div className="ow-loop-left">
            <span className="ow-ctl-l">{c.choicesLabel}</span>
            <div className="ow-choices">
              {LOOP_CHOICES.map((ch) => (
                <button
                  key={ch.id}
                  className={`ow-choice ${choices.includes(ch.id) ? 'on' : ''}`}
                  aria-pressed={choices.includes(ch.id)}
                  onClick={() => toggle(ch.id)}
                >
                  <span className="cl">{ch.label}</span>
                  <span className="cb">{ch.blurb}</span>
                </button>
              ))}
            </div>
            <p className="ow-note-line">{c.rubricNote}</p>
          </div>
          <div className="ow-loop-score ow-card-soft">
            <div className="ow-score-dial" aria-live="polite">
              <span className="n">{result.score}</span>
              <span className="d">/ 100</span>
              <span className={`band b-${result.band.id}`}>{result.band.label}</span>
            </div>
            <div className="ow-rubric">
              {result.rows.map((r) => (
                <div className="ow-rubric-row" key={r.id}>
                  <span className="rl">{r.label}</span>
                  <span className="rp">{r.pts} <em>{c.maxLabel.replace('{n}', r.max)}</em></span>
                  <span className="bar" aria-hidden="true"><i style={{ width: `${(r.pts / r.max) * 100}%` }} /></span>
                  <p>{r.why}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------------- shell
export default function Studio() {
  const [spec, setSpec] = useState({
    typeId: 'tee',
    sizeId: 'm',
    gsm: GARMENT_TYPES[0].gsmDefault,
    blend: { a: 'cotton', b: null, pctA: 65 },
    originId: 'vn',
    freight: 'sea',
  });
  const set = (patch) => setSpec((prev) => ({ ...prev, ...patch }));
  const g = useMemo(() => buildGarment(spec), [spec]);

  const useFibre = (id) => {
    set({ blend: { a: id, b: null, pctA: 65 } });
    requestAnimationFrame(() => {
      const el = document.getElementById('estimator');
      if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    });
  };

  return (
    <>
      <EstimatorSection g={g} spec={spec} set={set} />
      <FabricsSection onUse={useFibre} />
      <ChainSection g={g} spec={spec} set={set} />
      <LoopSection g={g} />
    </>
  );
}
