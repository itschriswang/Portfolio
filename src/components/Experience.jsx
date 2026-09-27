import { useEffect, useRef } from 'react';
import { EXPERIENCE, EDUCATION } from '../data/content';
import SplitText from './SplitText';
import Icon from './Icons';
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

    // Map the rail gradient to actual node positions so each node sits exactly
    // on its own colour, guarantees the UNSW node reads yellow, not black.
    function paintRail() {
      const stops = [`var(--${marks[0].clr}) 0%`];
      entries.forEach((en, i) => {
        const pt = parseFloat(getComputedStyle(en).paddingTop) || 0;
        const center = en.offsetTop + pt + 2;
        const pct = Math.max(0, Math.min(100, (center / railLen) * 100));
        stops.push(`var(--${marks[i].clr}) ${pct.toFixed(1)}%`);
      });
      stops.push(`var(--${marks[marks.length - 1].clr}) 100%`);
      fill.style.background = `linear-gradient(180deg, ${stops.join(', ')})`;
    }

    function layout() {
      railLen = Math.max(1, tl.offsetHeight - 8);
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
      nodes.forEach((n, i) => { n.classList.toggle('lit', entries[i].offsetTop + 12 <= h); });
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
        <div className="sec-tag" data-idx="04 / "><Icon name="building" size={30} />Experience</div>
        <h2 className="display" style={{ fontSize: 'clamp(2rem,6vw,4.5rem)', marginTop: '1.2rem' }}>
          <SplitText text="Track record" accentIndex={1} />
        </h2>

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
                <div className="exp-eyebrow"><Icon name="book" size={28} className="fpi-lead" />Education</div>
                <div className="exp-org-name">{EDUCATION.org}</div>
                <div className="exp-dept">{EDUCATION.dept}</div>
              </div>
              <div className="exp-meta">
                {EDUCATION.roles.map((r, i) => (
                  <div className="exp-meta-row" key={i}>
                    <span className="exp-role-title">{r.title}</span>
                    <span className="exp-date">{r.date}</span>
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
    </section>
  );
}
