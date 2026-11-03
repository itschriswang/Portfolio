import { Grain, SkipLink } from '../components/Chrome';
import Gate from '../components/Gate';
import Icon from '../components/Icons';
import SplitText from '../components/SplitText';
import ToolCard from '../components/ToolCard';
import { PRIVATE_TOOLS } from '../data/content';
import { lock } from '../lib/gate';
import { LAB } from './data';

// The drafts index. One dark band carrying the same tool cards the home page
// uses, so a draft is read here exactly as it would be read once it moves back
// to the public list. No site nav: this page is not part of the site's
// navigation and should not pretend to be.
function Bench() {
  return (
    <>
      <SkipLink />
      <Grain />
      <main id="main" className="tools-band lab">
        <div className="canvas">
          <div className="sec-tag" data-idx={LAB.idx}><Icon name="calc" size={30} />{LAB.tag}</div>

          <div className="tools-head">
            <h1 className="display tools-headline">
              <SplitText text={LAB.title[0]} />{' '}
              <SplitText text={LAB.title[1]} accentIndex={1} />
            </h1>
            <div className="tools-lead">
              {LAB.paras.map((p, i) => <p className="tools-lead-p" key={i}>{p}</p>)}
            </div>
          </div>

          <div className="tools-grid">
            {PRIVATE_TOOLS.map((t, i) => <ToolCard tool={t} index={i} key={t.href} />)}
          </div>

          <p className="tools-note">{LAB.note}</p>

          <div className="lab-foot">
            <a className="lab-back" href="../">← {LAB.back}</a>
            <span className="lab-name">{LAB.name}</span>
            <button
              type="button"
              className="lab-lock"
              onClick={() => { lock(); window.location.reload(); }}
            >
              {LAB.lock}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default function LabApp() {
  // No name passed: the gate's own title is the right one for the index
  // itself, where a single draft's page names the draft being asked for.
  return <Gate><Bench /></Gate>;
}
