import { motion, useReducedMotion } from 'framer-motion';
import { PRINCIPLES } from '../data/content';
import Icon from './Icons';
import SplitText from './SplitText';

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 1, 0.5, 1] } }),
};

export default function Principles() {
  // Reduced motion: render in place rather than reveal on scroll.
  const still = useReducedMotion();
  return (
    <section id="principles">
      <div className="canvas">
        <div className="sec-tag" data-idx="01 / "><Icon name="leaf" size={30} />My practice</div>
        <h2 className="display sec-title princ-headline">
          <SplitText text="How I work" accentIndex={1} />
        </h2>
        <div className="princ-grid">
          {PRINCIPLES.map((p, i) => (
            <motion.div
              className="princ" key={p.num}
              custom={i} variants={reveal} initial={still ? false : 'hidden'} whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            >
              <div className="princ-num">{p.num}</div>
              <div className="princ-main">
                <div className="princ-title">{p.icon && <Icon name={p.icon} size={36} className="fpi-lead" />}{p.title}</div>
                <div className="princ-body">{p.body}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
