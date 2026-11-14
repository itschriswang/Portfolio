import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PIPELINE } from '../data/content';
import Icon from './Icons';

// Organic spring used for the drawer open/close.
const drawerSpring = { type: 'spring', duration: 0.35, bounce: 0 };

function PipeRow({ item, open, onToggle }) {
  return (
    <motion.div className="pipe-row" layout transition={drawerSpring}>
      <div
        className={'pipe-step' + (open ? ' open' : '')}
        style={{ '--pc': item.color }}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      >
        <span className="pipe-n">{item.n}</span>
        {item.icon && <Icon name={item.icon} size={32} />}
        <span className="pipe-label">{item.label}</span>
        <span className="pipe-step-right">
          <span className="pipe-badge">{item.examples.length} example{item.examples.length > 1 ? 's' : ''}</span>
          <span className="pipe-chevron" aria-hidden="true">▼</span>
        </span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={drawerSpring}
            style={{ overflow: 'hidden' }}
          >
            <div className="pipe-panel-inner">
              <p className="pipe-desc">{item.desc}</p>
              <div className="pipe-examples">
                {item.examples.map((ex, i) => (
                  <div className="pipe-example" key={i}>
                    <div className="pipe-ex-title">{ex.title}</div>
                    <div className="pipe-ex-body">{ex.body}</div>
                    <div className="pipe-ex-outcome">{ex.outcome}</div>
                  </div>
                ))}
              </div>
              {item.cta && <a href={item.cta.href} className="pipe-cta">{item.cta.label}</a>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Pipeline() {
  const [openStep, setOpenStep] = useState(null);
  return (
    <div className="pipeline" aria-label="Capability pipeline">
      {PIPELINE.map((item) => (
        <PipeRow
          key={item.step}
          item={item}
          open={openStep === item.step}
          onToggle={() => setOpenStep((s) => (s === item.step ? null : item.step))}
        />
      ))}
    </div>
  );
}
