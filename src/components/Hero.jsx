import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useReducedMotion, animate } from 'framer-motion';
import { HERO, yearsSince } from '../data/content';
import SplitText from './SplitText';
import ContourField from './ContourField';
import TreeRings from './TreeRings';
import Icon, { LinkedInIcon } from './Icons';

// The live "years" figure comes from yearsSince (content.js), a whole number.
// The tween floors, so it counts up in whole years and never passes the target.
function formatYears(v) {
  return String(Math.floor(v + 1e-9));
}

function Counter({ target, suffix, still }) {
  const ref = useRef(null);
  const mv = useMotionValue(0);
  useEffect(() => {
    // Under reduced motion the figure is simply there, not counted up to.
    if (still) {
      if (ref.current) ref.current.textContent = formatYears(target) + suffix;
      return undefined;
    }
    const controls = animate(mv, target, {
      duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4,
      onUpdate: (v) => { if (ref.current) ref.current.textContent = formatYears(v) + suffix; },
    });
    return controls.stop;
  }, [target, suffix, mv, still]);
  return <span ref={ref}>{still ? formatYears(target) : 0}{suffix}</span>;
}

function RoleCycle({ roles, still }) {
  const [idx, setIdx] = useState(0);
  // Reduced motion: the first role holds still and the cycle never starts.
  useEffect(() => {
    if (still) { setIdx(0); return undefined; }
    const id = setInterval(() => setIdx((i) => (i + 1) % roles.length), 3200);
    return () => clearInterval(id);
  }, [roles.length, still]);
  return (
    // The cycling text is decorative motion: announcing a new job title every
    // 3.2s would spam assistive tech, so the animated span is hidden from it
    // and a single static label carries the role list instead.
    <span className="role-cycle" style={{ overflow: 'hidden' }}>
      <span className="sr-only">{roles.join(', ')}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={idx}
          aria-hidden="true"
          initial={{ y: '60%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-60%', opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1] }}
          style={{ display: 'inline-block' }}
        >
          {roles[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// The hero holds still on scroll. It used to drift at three speeds (a scroll
// parallax plus a nudge from scroll velocity) over three blurred colour blooms;
// none of that said anything about the work, so the one entrance below is the
// only motion the text block has, and the aurora and contour field carry the
// backdrop on their own.
export default function Hero() {
  // Reduced motion: the entrance is skipped and everything renders in place.
  const still = useReducedMotion();

  return (
    <section id="about">
      <ContourField tone="dark" />

      <div className="canvas matrix hero-grid">
        <h1 className="hero-name display">
          <SplitText text={HERO.name[0]} /> <SplitText text={HERO.name[1]} />
        </h1>
        <div className="hero-side">
          <RoleCycle roles={HERO.roles} still={still} />
          <div className="hero-meta">
            <span><Icon name="pin" size={26} className="fpi-lead" />{HERO.location}</span>
          </div>
        </div>
      </div>

      <motion.div
        className="canvas matrix hero-lower"
        initial={still ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 1, 0.5, 1] }}
      >
        <p className="hero-prop">{HERO.prop}</p>
        <div className="hero-cta">
          {HERO.ctas.map((c) => (
            <a key={c.href} className={'btn ' + (c.primary ? 'btn-primary' : 'btn-secondary')} href={c.href}>
              {c.icon === 'linkedin' && <LinkedInIcon />}{c.label}
            </a>
          ))}
        </div>
        <div className="instr-stack">
          <TreeRings still={still} />
          {HERO.instruments.map((it) => (
            <div className="instr" key={it.id}>
              <div className="instr-lbl">{it.label[0]}<br />{it.label[1]}</div>
              <div className="instr-val"><Counter target={yearsSince(it.start)} suffix={it.suffix} still={still} /></div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
