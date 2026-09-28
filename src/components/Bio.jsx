import { motion, useReducedMotion } from 'framer-motion';
import { BIO_PARAS, OUTCOMES, OUTCOMES_HEAD, PIPELINE_INTRO } from '../data/content';
import Pipeline from './Pipeline';
import Icon from './Icons';

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.55, ease: [0.25, 1, 0.5, 1] } }),
};

export default function Bio() {
  // Reduced motion: render in place rather than reveal on scroll.
  const still = useReducedMotion();
  return (
    <section id="bio">
      <div className="canvas matrix bio-matrix">
        <div className="bio-head">
          <div className="sec-tag" data-idx="00 / "><Icon name="people" size={30} />Profile</div>
        </div>
        <div className="bio-body">
          {BIO_PARAS.map((p, i) => (
            <p className="bio-text" key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="canvas">
        <div className="outcomes">
          <h2 className="sub-head"><Icon name="chart" size={30} />{OUTCOMES_HEAD}</h2>
          <div className="outcomes-grid">
            {OUTCOMES.map((o, i) => (
              <motion.div
                className="outcome" key={i} style={{ '--oc': o.color }}
                custom={i} variants={reveal} initial={still ? false : 'hidden'} whileInView="visible" viewport={{ once: true, margin: '-40px' }}
              >
                <div className="outcome-num">{o.from && <span className="outcome-from"><s>{o.from}</s><span className="sr-only"> cut to </span><span aria-hidden="true">→</span></span>}{o.num}<small>{o.small}</small></div>
                <div className="outcome-what">{o.what}</div>
                <div className="outcome-where">{o.where}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="pipe-head">
          <h2 className="sub-head"><Icon name="loop" size={30} />{PIPELINE_INTRO.head}</h2>
          <p className="pipe-sub">{PIPELINE_INTRO.sub}</p>
        </div>
        <Pipeline />
      </div>
    </section>
  );
}
