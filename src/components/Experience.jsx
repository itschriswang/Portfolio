import { useEffect, useRef } from 'react';
import { EXPERIENCE, EDUCATION, EXPERIENCE_INTRO } from '../data/content';
import SplitText from './SplitText';
import Icon from './Icons';
import CareerRings from './CareerRings';
import { prefersReducedMotion } from '../utils/media';

export default function Experience() {
  const tlRef = useRef(null);
  const fillRef = useRef(null);
  const entryRefs = useRef([]);
  const nodeRefs = useRef([]);

  // The rail draws with scroll; nodes ignite as the fill passes them.
  useEffect(() => {
    const tl = tlRef.current;
    const fill = fillRef.current;
    if (!tl || !fill) return;
    const reduced = prefersReducedMotion();
    const entries = entryRefs.current.filter(Boolean);
    const nodes = nodeRefs.current.filter(Boolean);
    const marks = [...EXPERIENCE, EDUCATION];
    let railLen = 1;

    // Paint the rail in hard bands from each node to the next, so every stretch
    // is one employer's colour and no stretch blends two of them into a hue
    // neither brand uses. The bands start at the nodes' real positions.
    function paintRail() {
      const pcts = entries.map((en) => {
        const pt = parseFloat(getComputedStyle(en).paddingTop) || 0;
        const center = en.offsetTop + pt + 2;
        return Math.max(0, Math.min(100, (center / railLen) * 100));
      });
      const stops = [];
      marks.forEach((m, i) => {
        const from = i === 0 ? 0 : pcts[i];
        const to = i + 1 < marks.length ? pcts[i + 1] : 100;
        if (from === undefined || to === undefined) return;
        stops.push(`var(--${m.clr}) ${from.toFixed(1)}%`, `var(--${m.clr}) ${to.toFixed(1)}%`);
      });
      if (stops.length) fill.style.background = `linear-gradient(180deg, ${stops.join(', ')})`;
    }

    let tops = [];
    function layout() {
      railLen = Math.max(1, tl.offsetHeight - 8);
      tops = entries.map((en) => en.offsetTop);
      entries.forEach((en, i) => {
        const pt = parseFloat(getComputedStyle(en).paddingTop) || 0;
        if (nodes[i]) nodes[i].style.top = (en.offsetTop + pt + 2) + 'px';
      });
      paintRail();
    }
    function update() {
      const r = tl.getBoundingClientRect();
      let h = window.innerHeight * 0.66 - r.top;
      h = reduced ? railLen : Math.max(0, Math.min(railLen, h));
      fill.style.clipPath = 'inset(0 0 ' + ((1 - h / railLen) * 100).toFixed(2) + '% 0)';
      // Offsets are read once in layout(), so the scroll loop only writes.
      nodes.forEach((n, i) => { n.classList.toggle('lit', tops[i] + 12 <= h); });
    }
    let tick = false;
    const onScroll = () => { if (!tick) { requestAnimationFrame(() => { update(); tick = false; }); tick = true; } };
    const onResize = () => { layout(); update(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    layout(); update();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); };
  }, []);

  // entries = experience entries + education block (in DOM order)
  const allMarks = [...EXPERIENCE, EDUCATION];

  return (
    <section id="experience">
      <div className="canvas">
        <div className="sec-tag" data-idx={EXPERIENCE_INTRO.idx}><Icon name="building" size={30} />{EXPERIENCE_INTRO.tag}</div>
        <h2 className="display sec-title">
          <SplitText text={EXPERIENCE_INTRO.title} accentIndex={EXPERIENCE_INTRO.titleAccent} />
        </h2>

        <div className="exp-body">
        <aside className="exp-aside"><CareerRings /></aside>
        <div className="exp-timeline" ref={tlRef}>
          <div className="exp-rail-fill" ref={fillRef} aria-hidden="true" />

          {EXPERIENCE.map((exp, ei) => (
            <div className="exp-entry" key={exp.org} ref={(el) => (entryRefs.current[ei] = el)}>
              <div className="exp-hd">
                <div>
                  {exp.logo
                    ? <img className={'exp-logo ' + exp.logoClass} src={exp.logo} alt={exp.logoAlt} width={exp.logoW} height={exp.logoH} loading="lazy" decoding="async" />
                    : <div className="exp-eyebrow">{exp.eyebrowIcon && <Icon name={exp.eyebrowIcon} size={28} className="fpi-lead" />}{exp.eyebrow}</div>}
                  <div className="exp-org-name">{exp.org}</div>
                  <div className="exp-dept">{exp.dept}</div>
                  {exp.note && <div className="exp-note">{exp.note}</div>}
                </div>
                <div className="exp-meta">
                  {exp.roles.map((r, i) => (
                    <div className="exp-meta-row" key={i}>
                      <span className="exp-role-title">{r.title}</span>
                      <span className="exp-date">{r.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Education uses the same entry layout as the roles above so it reads
              as part of the same timeline, not an isolated card. */}
          <div className="exp-entry exp-entry-edu" ref={(el) => (entryRefs.current[EXPERIENCE.length] = el)}>
            <div className="exp-hd">
              <div>
                <div className="exp-eyebrow"><Icon name="book" size={28} className="fpi-lead" />{EXPERIENCE_INTRO.education}</div>
                <div className="exp-org-name">{EDUCATION.org}</div>
                <div className="exp-dept">{EDUCATION.dept}</div>
              </div>
              <div className="exp-meta">
                {EDUCATION.roles.map((r, i) => (
                  <div className="exp-meta-row" key={i}>
                    <span className="exp-role-title">{r.title}</span>
                    {r.date && <span className="exp-date">{r.date}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nodes, one per entry + education, positioned in layout effect. */}
          {allMarks.map((m, i) => (
            <div
              key={i}
              className="exp-node"
              aria-hidden="true"
              ref={(el) => (nodeRefs.current[i] = el)}
              style={{ '--nclr': 'var(--' + (m.clr || 'matcha') + ')' }}
            >
              <span>{m.mark}</span>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
