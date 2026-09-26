import { motion, useReducedMotion } from 'framer-motion';
import Icon from './Icons';
import ToolSpecimen from './ToolSpecimen';

// One tile in a tools grid, from a TOOLS or PRIVATE_TOOLS entry. The whole tile
// is a single anchor, so it is one tab stop, and it carries a live specimen
// (see ToolSpecimen.jsx) drawn from that tool's real numbers, because a section
// arguing "sourced or it does not ship" should not be paragraphs describing
// charts a reader cannot see.
//
// The stagger goes by row rather than by index, so a row lands together instead
// of stepping across the page.
const reveal = {
  hidden: { opacity: 0, y: 26 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: (i % 2) * 0.07 + Math.floor(i / 2) * 0.05, duration: 0.55, ease: [0.25, 1, 0.5, 1] },
  }),
};

export default function ToolCard({ tool, index }) {
  // Reduced motion: render in place rather than reveal on scroll.
  const still = useReducedMotion();
  return (
    <motion.a
      className="tool-card" href={tool.href} data-span={tool.span}
      style={{ '--tc': tool.color }}
      custom={index} variants={reveal} initial={still ? false : 'hidden'} whileInView="visible" viewport={{ once: true, margin: '-60px' }}
    >
      <span className="tool-rule" aria-hidden="true" />
      <div className="tool-top">
        <span className="tool-n">{tool.n}</span>
        <Icon name={tool.icon} size={34} className="tool-icon" />
        <span className="tool-arrow" aria-hidden="true">↗</span>
      </div>
      <h3 className="tool-name">{tool.name}</h3>

      <ToolSpecimen id={tool.spec} />

      <p className="tool-what">{tool.what}</p>
      <p className="tool-proves"><span className="tool-proves-lbl">Shows</span>{tool.proves}</p>
      <ul className="tool-tags">
        {tool.tags.map((tag) => <li key={tag}>{tag}</li>)}
      </ul>
      <div className="tool-scope">{tool.scope}</div>
    </motion.a>
  );
}
