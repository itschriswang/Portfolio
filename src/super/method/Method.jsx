// The basis of preparation for Super Fund Holdings, on its own route
// (/super/method/). Rendered from the same fund set and criteria the tool
// reads from, so the source table and the flag definitions cannot drift from
// the tool. Any change to a fund, a source, a flag criterion or the boundary
// must land here in the same change (see CLAUDE.md).

import { SkipLink, Grain, ScrollProgress } from '../../components/Chrome';
import { ToolNav, ToolFooter } from '../../components/ToolNav';
import Icon from '../../components/Icons';
import { METHOD, CRITERIA, NOT_FLAGGED, FUNDS, FOOTER, CYCLE } from '../data';

const CRIT_COLOR = {
  thermalCoal: 'var(--sf-coal)',
  oilGas: 'var(--sf-oil)',
  weapons: 'var(--sf-weapon)',
  tobacco: 'var(--sf-tobacco)',
};

function Block({ icon, title, paras, wide = true }) {
  return (
    <div className={`sf-method-block${wide ? ' sf-method-wide' : ''}`}>
      <h3>{icon && <Icon name={icon} size={26} />}{title}</h3>
      {paras.map((p, i) => <p key={i}>{p}</p>)}
    </div>
  );
}

export default function Method() {
  const T = METHOD.sourceTable;
  return (
    <>
      <SkipLink />
      <Grain />
      <ScrollProgress />
      <ToolNav home="../../" />

      <main id="main-content">
        <section id="sf-method-page">
          <div className="canvas">
            <div className="sec-tag" data-idx="./ "><Icon name="book" size={32} />{METHOD.tag}</div>
            <h1 className="display sf-h2">{METHOD.title[0]} {METHOD.title[1]}</h1>
            <p className="sf-sub">{METHOD.sub}</p>
            <p className="sf-back-note">← <a href="../">{METHOD.backToTool}</a></p>

            <div className="sf-method-grid">
              <Block icon="globe" title={METHOD.boundary.title} paras={METHOD.boundary.paras} />
              <Block icon="list" title={METHOD.sources.title} paras={METHOD.sources.paras} />
              <Block icon="target" title={METHOD.reading.title} paras={METHOD.reading.paras} />
            </div>

            {/* Flag criteria in full */}
            <div className="sf-method-block sf-method-panel">
              <h3><Icon name="target" size={26} />{METHOD.flags.title}</h3>
              <p>{METHOD.flags.intro}</p>
              <ul className="sf-crit-list">
                {Object.values(CRITERIA).map((c) => (
                  <li className="sf-crit" key={c.key} style={{ '--fc': CRIT_COLOR[c.key] }}>
                    <div className="sf-crit-name">
                      {c.full}
                      <span className="sf-crit-tag">{c.label}</span>
                    </div>
                    <div className="sf-crit-basis">{c.basis}</div>
                  </li>
                ))}
              </ul>

              <h3 className="sf-method-sub">{METHOD.flags.notFlaggedHead}</h3>
              <ul className="sf-excl">
                {NOT_FLAGGED.map((n, i) => (
                  <li key={i}><strong>{n.head}</strong>{n.body}</li>
                ))}
              </ul>

              <h3 className="sf-method-sub">{METHOD.flags.noteHead}</h3>
              <p>{METHOD.flags.note}</p>
            </div>

            <div className="sf-method-grid">
              <Block icon="clock" title={METHOD.cadence.title} paras={METHOD.cadence.paras} wide={false} />
              <Block icon="phone" title={METHOD.corrections.title} paras={METHOD.corrections.paras} wide={false} />
            </div>

            {/* Source table, rendered from the same fund data the tool uses */}
            <div className="sf-method-block sf-method-panel">
              <h3><Icon name="coins" size={26} />{METHOD.sourceTableTitle}</h3>
              <p>{METHOD.sourceTableSub}</p>
              <p className="sf-note sf-cycle">{CYCLE}.</p>
              <div className="sf-scroll-x">
                <table className="sf-table">
                  <thead>
                    <tr>
                      {T.cols.map((c) => <th key={c}>{c}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {FUNDS.map((f) => (
                      <tr key={f.id}>
                        <td className="strong">{f.name}</td>
                        <td>{f.defaultOption}</td>
                        <td><span className="mono">{T.asAt} {f.disclosure.asOf}</span><br /><a href={f.disclosure.url} target="_blank" rel="noopener noreferrer">{T.disclosureLink}</a></td>
                        <td>
                          <a href={f.saaSource.url} target="_blank" rel="noopener noreferrer">{T.guideLink}</a>
                          {f.marketing[0] && <> · <a href={f.marketing[0].url} target="_blank" rel="noopener noreferrer">{T.sustainabilityLink}</a></>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Named limitations */}
            <div className="sf-method-block sf-method-panel">
              <h3><Icon name="bin" size={26} />{METHOD.limitationsTitle}</h3>
              <ul className="sf-lim">
                {METHOD.limitations.map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <ToolFooter home="../../" name={FOOTER.name} back={FOOTER.back} />
    </>
  );
}
