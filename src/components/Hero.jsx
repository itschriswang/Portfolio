import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useReducedMotion, useInView, animate } from 'framer-motion';
import { HERO, yearsSince } from '../data/content';
import SplitText from './SplitText';
import ContourField from './ContourField';
import TreeRings from './TreeRings';
import Icon, { LinkedInIcon } from './Icons';

// The live "years" figure comes from yearsSince (content.js), a whole number.
// The tween rounds, so each year appears halfway to it and the count never
// passes the target. It used to floor on a steep ease-out, which reaches 80%
// of the way in a third of the time and then creeps: the second-last year sat
// on screen for most of a second before the real one landed.
function formatYears(v) {
  return String(Math.round(v));
}

// The count starts when the tile reaches the screen, not on page load: on a
// phone the tiles sit below the first screen, and a count that has already
// finished by the time it is seen is motion nobody gets.
function Counter({ target, suffix, still }) {
  const ref = useRef(null);
  const mv = useMotionValue(0);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  useEffect(() => {
    // Under reduced motion the figure is simply there, not counted up to.
    if (still) {
      if (ref.current) ref.current.textContent = formatYears(target) + suffix;
      return undefined;
    }
    if (!seen) return undefined;
    const controls = animate(mv, target, {
      // A gentle ease-out over a second: the years tick at a slowing, even
      // pace and the last one lands about halfway through, then holds.
      duration: 1.0, ease: [0.33, 1, 0.68, 1], delay: 0.3,
      onUpdate: (v) => { if (ref.current) ref.current.textContent = formatYears(v) + suffix; },
    });
    return controls.stop;
  }, [target, suffix, mv, still, seen]);
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
// On a phone the hero paces itself to the screen it is on. It measures what
// the first screen has to hold (everything down to the button, then a beat,
// the year tiles and the band's foot) against the screen's height, and picks:
// 'one' when it all fits, a single composed screen; 'two' when it does not,
// so the tiles land just below the first screen in full rather than cut in
// half by its edge. Width matters as much as height (a narrow phone wraps the
// paragraph onto more lines), which is why this is measured, not a breakpoint.
// The layout itself lives in the MOBILE HERO PACING block of global.css.
const PACE_BEAT = 48;   // px between the button and the tiles in one screen
const PACE_FOOT = 32;   // the band's bottom padding on a phone
function usePace(ref) {
  const [pace, setPace] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const mq = window.matchMedia('(max-width: 680px)');
    let raf = 0;
    const measure = () => {
      if (!mq.matches) { setPace(null); return; }
      const last = el.querySelector('.hero-cta');
      const tile = el.querySelector('.instr');
      if (!last || !tile) return;
      const top = el.getBoundingClientRect().top;
      const need = last.getBoundingClientRect().bottom - top + PACE_BEAT + tile.offsetHeight + PACE_FOOT;
      const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 53;
      setPace(need <= window.innerHeight - nav ? 'one' : 'two');
    };
    const queue = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    measure();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(queue);
    window.addEventListener('resize', queue);
    mq.addEventListener('change', queue);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', queue);
      mq.removeEventListener('change', queue);
    };
  }, [ref]);
  return pace;
}

export default function Hero() {
  // Reduced motion: the entrance is skipped and everything renders in place.
  const still = useReducedMotion();
  const sectionRef = useRef(null);
  const pace = usePace(sectionRef);

  return (
    <section id="about" ref={sectionRef} data-pace={pace || undefined}>
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
