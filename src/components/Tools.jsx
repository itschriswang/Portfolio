import { TOOLS, TOOLS_INTRO } from '../data/content';
import Icon from './Icons';
import SplitText from './SplitText';
import ToolCard from './ToolCard';

// The one dark band on the home page. It sits between the scenario model and
// the track record on purpose: a hiring manager meets the evidence of built
// work immediately after the live model and immediately before the CV.
//
// The tiles themselves are ToolCard, shared with the drafts index at /lab/.
// The bento spans come from the data so the grid has a rhythm rather than a
// checkerboard.
export default function Tools() {
  return (
    <section id="tools">
      <div className="canvas">
        <div className="sec-tag" data-idx={TOOLS_INTRO.idx}><Icon name="calc" size={30} />{TOOLS_INTRO.tag}</div>

        <h2 className="display sec-title tools-headline">
          <SplitText text={TOOLS_INTRO.title[0]} />{' '}
          <SplitText text={TOOLS_INTRO.title[1]} accentIndex={1} />
        </h2>

        <div className="tools-grid">
          {TOOLS.map((t, i) => <ToolCard tool={t} index={i} key={t.href} />)}
        </div>

        <p className="tools-note tools-bench">{TOOLS_INTRO.bench}</p>
      </div>
    </section>
  );
}
