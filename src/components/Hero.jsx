import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useVelocity, useSpring, useMotionValue, useReducedMotion, animate } from 'framer-motion';
import { HERO, yearsSince } from '../data/content';
import SplitText from './SplitText';
import ContourField from './ContourField';
import Aurora from './Aurora';
import Icon, { LinkedInIcon } from './Icons';

// The live "years" figure comes from yearsSince (content.js), floored to the
// half year. The tween floors too, so no frame ever shows more than the target.
function formatYears(v) {
  const floored = Math.floor(v * 2 + 1e-9) / 2;
  return Number.isInteger(floored) ? String(floored) : floored.toFixed(1);
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

export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollY } = useScroll();
  // Velocity-driven parallax: base depth from scroll position, nudged by speed.
  const scrollVelocity = useVelocity(scrollY);
  const smoothVel = useSpring(scrollVelocity, { stiffness: 200, damping: 40 });
  const baseY = useTransform(scrollY, [0, 600], [0, 80]);
  const velY = useTransform(smoothVel, [-1500, 0, 1500], [-24, 0, 24]);
  const lowerY = useTransform(scrollY, [0, 600], [0, 140]);
  // Parallax and the scroll-speed nudge are decorative, so under reduced
  // motion the transforms are simply not bound and the hero stays put.
  const still = useReducedMotion();

  return (
    <section id="about" ref={sectionRef}>
      <div className="bloom-wrap" aria-hidden="true">
        <div className="bloom bloom-a" /><div className="bloom bloom-b" /><div className="bloom bloom-c" />
      </div>
      <Aurora
        colorStops={['#635BFF', '#B5C42B', '#FF9500', '#FF3B60']}
        amplitude={0.6}
        blend={0.5}
        opacity={0.2}
      />
      <ContourField />

      <motion.div className="canvas matrix hero-grid" style={still ? undefined : { y: baseY }}>
        <motion.h1 className="hero-name display" style={still ? undefined : { y: velY }}>
          <SplitText text={HERO.name[0]} /> <SplitText text={HERO.name[1]} accentIndex={0} />
        </motion.h1>
        <div className="hero-side">
          <RoleCycle roles={HERO.roles} still={still} />
          <div className="hero-meta">
            <span><Icon name="pin" size={26} className="fpi-lead" />{HERO.location}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="canvas matrix hero-lower"
        style={still ? undefined : { y: lowerY }}
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
