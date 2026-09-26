import { motion, useReducedMotion } from 'framer-motion';

// Character-splitting headline with staggered springs. Each character rises
// from y:80 to y:0 on viewport entry, staggered by 0.015s, on an organic
// spring curve (stiffness 80, damping 14). Words are kept together so wrapping
// stays clean; whitespace between words is preserved.
// Rise kept short and the spring firm so near-opaque glyphs never transit
// through the paragraph below (they used to fall from 80px at damping 14).
//
// Accessibility: the whole string is carried once as .sr-only text and the
// split glyphs are aria-hidden. (aria-label on the wrapping span was ignored
// by some assistive tech, because a plain span has no role to name.) Under
// reduced motion the glyphs render in place with no reveal at all, so the
// heading never depends on an in-view trigger to become visible.
const charVariants = {
  hidden: { y: 34, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 110, damping: 16 },
  },
};

export default function SplitText({ text, as = 'span', className, accentIndex = -1, style }) {
  const MotionTag = motion[as] || motion.span;
  const words = String(text).split(' ');
  const still = useReducedMotion();
  let charCounter = 0;

  return (
    <MotionTag
      className={className}
      style={{ display: 'inline-block', ...style }}
      initial={still ? false : 'hidden'}
      animate={still ? 'visible' : undefined}
      whileInView={still ? undefined : 'visible'}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ staggerChildren: 0.015 }}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, wi) => (
        <span
          key={wi}
          style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
          aria-hidden="true"
        >
          {word.split('').map((ch, ci) => {
            const isAccent = wi === accentIndex;
            charCounter += 1;
            return (
              <motion.span
                key={ci}
                variants={charVariants}
                style={{
                  display: 'inline-block',
                  color: isAccent ? 'var(--split-accent, var(--matcha))' : undefined,
                  willChange: 'transform',
                }}
              >
                {ch}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span style={{ display: 'inline-block', width: '0.28em' }}>&nbsp;</span>}
        </span>
      ))}
    </MotionTag>
  );
}
