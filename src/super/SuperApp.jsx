// ============================================================================
// SUPER FUND HOLDINGS (/super/)
//
// Pick a fund, see the holdings picture of its default (MySuper) option next
// to that fund's own sustainability marketing. Neutral and factual: the point
// is legibility, not an accusation. Let any gap between marketing and holdings
// speak for itself.
//
// The most restrained of the four tools: tables, quiet cards, mono labels,
// factual chips. Flags are facts against a stated criterion, carried by a
// small chip in the criterion's ink, never as a red alarm. Every field carries a
// confidence flag, and any weighting that could not be verified against the
// disclosure CSV is named, marked pending, and never given an invented number.
//
// Chrome is the site's own shared tool chrome (ToolNav / ToolFooter), grain,
// scroll progress and design tokens, exactly as the footprint pages do. The
// selected fund is deep-linked into the URL hash so a lookup is shareable.
// ============================================================================
import { useEffect, useState, useCallback } from 'react';
import { SkipLink, Grain, ScrollProgress } from '../components/Chrome';
import { ToolNav, ToolFooter } from '../components/ToolNav';
import Icon from '../components/Icons';
import {
  FUNDS, COPY, CONFIDENCE, CRITERIA, CHANGELOG, FOOTER, VERIFIED,
} from './data';

const CRIT_COLOR = {
  thermalCoal: 'var(--sf-coal)',
  oilGas: 'var(--sf-oil)',
  weapons: 'var(--sf-weapon)',
  tobacco: 'var(--sf-tobacco)',
};

// A small confidence chip. The label is short; the full note rides in the
// title attribute so a reader can hover or focus to learn what stands behind
// the figure. sr-only text keeps it legible to assistive tech.
function Conf({ level }) {
  const c = CONFIDENCE[level];
  if (!c) return null;
  return (
    <span className={`sf-conf sf-conf-${level}`} title={c.note}>
      {c.label}
      <span className="sr-only">: {c.note}</span>
    </span>
  );
}

function FundDetail({ fund }) {
  const d = COPY.detail;
  return (
    <div className="sf-detail">
      <div className="sf-detail-head">
        <div className="sf-detail-name">{fund.name}</div>
        <div className="sf-verified">
          <span className="sf-verified-dot" aria-hidden="true" />
          {d.lastVerified}: {VERIFIED}
        </div>
        <div className="sf-meta-grid">
          <div>
            <div className="sf-meta-l">{d.optionLabel}</div>
            <div className="sf-meta-v">{fund.defaultOption}</div>
          </div>
          <div>
            <div className="sf-meta-l">{d.typeLabel}</div>
            <div className="sf-meta-v">{fund.optionType}</div>
          </div>
        </div>
      </div>

      <div className="sf-split">
        {/* Left: what the option holds */}
        <div className="sf-panel">
          <div className="sf-panel-head">
            <Icon name="chart" size={22} /><span className="sf-panel-title">{d.saaHead} <Conf level={fund.saaConf} /></span>
          </div>
          <p className="sf-panel-sub">{d.saaSub}</p>
          <div className="sf-growth">
            <strong>{d.growthLabel}:</strong> {fund.growthDefensive}.
          </div>
          <div className="sf-cats">
            {fund.saa.map((row, i) => (
              <div className="sf-cat-row" key={i}>
                <span className="sf-cat-name">{row.class}</span>
                <span className="sf-cat-pct">{row.pct}</span>
              </div>
            ))}
          </div>
          <p className="sf-note">
            {d.sourceLabel}: {fund.saaSource.doc}
            {fund.saaSource.asOf && !fund.saaSource.doc.includes(fund.saaSource.asOf) ? ` (${fund.saaSource.asOf})` : ''}.{' '}
            <a href={fund.saaSource.url} target="_blank" rel="noopener noreferrer">{d.fundPageLink}</a>
          </p>
        </div>

        {/* Right: what the fund says */}
        <div className="sf-panel">
          <div className="sf-panel-head">
            <Icon name="book" size={22} /><span className="sf-panel-title">{d.marketingHead} <Conf level="quote" /></span>
          </div>
          <p className="sf-panel-sub">{d.marketingSub}</p>
          {/* Deliberately not a <blockquote>: these are close statements of each
              fund's published position, not verbatim quotations, and the markup
              must not claim otherwise (see the method page's sources note). */}
          <div className="sf-quotes">
            {fund.marketing.map((m, i) => (
              <div className="sf-quote" key={i}>
                <p className="sf-quote-t">{m.quote}</p>
                <div className="sf-quote-attr">
                  {m.attribution}.{' '}
                  <a href={m.url} target="_blank" rel="noopener noreferrer">{d.quoteSourceLink}</a>
                  <span className="sf-accessed">{d.accessedLabel} {m.accessed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top listed holdings */}
      <div className="sf-panel">
        <div className="sf-panel-head">
          <Icon name="list" size={22} /><span className="sf-panel-title">{d.topHead} <Conf level={fund.topHoldingsConf} /></span>
        </div>
        <div className="sf-holdings">
          {fund.topHoldings.map((h) => (
            <span className="sf-hold" key={h}>{h}</span>
          ))}
        </div>
        <p className="sf-note">{fund.topHoldingsNote}</p>
      </div>

      {/* Flagged holdings */}
      <div className="sf-panel">
        <div className="sf-panel-head">
          <Icon name="target" size={22} /><span className="sf-panel-title">{d.flaggedHead}</span>
        </div>
        <p className="sf-panel-sub">{d.flaggedSub}</p>
        {fund.flagged.length === 0 ? (
          <p className="sf-empty">{d.noFlagged}</p>
        ) : (
          <div className="sf-flag-list">
            {fund.flagged.map((f, i) => {
              const crit = CRITERIA[f.criterion];
              return (
                <div className="sf-flag" key={i} style={{ '--fc': CRIT_COLOR[f.criterion] }}>
                  <div className="sf-flag-top">
                    <span className="sf-flag-co">{f.company}</span>
                    <span className="sf-flag-crit">{crit ? crit.label : f.criterion}</span>
                  </div>
                  <p className="sf-flag-basis">{f.basis}</p>
                  <div className="sf-flag-foot">
                    <span className="sf-flag-wt">{d.weightingLabel}: {f.weighting}</span>
                    <Conf level={f.conf} />
                    {f.source && (
                      <span className="sf-flag-src">
                        <a href={f.source.url} target="_blank" rel="noopener noreferrer">{f.source.doc}</a>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Disclosure this reads from */}
      <div className="sf-panel">
        <div className="sf-panel-head">
          <Icon name="coins" size={22} /><span className="sf-panel-title">{d.disclosureHead}</span>
        </div>
        <p className="sf-panel-sub sf-disclosure">
          {fund.disclosure.doc}. {d.holdingsAsAt} {fund.disclosure.asOf}.{' '}
          <a href={fund.disclosure.url} target="_blank" rel="noopener noreferrer">{d.disclosureLink}</a>
        </p>
      </div>
    </div>
  );
}

export default function SuperApp() {
  const [selected, setSelected] = useState(FUNDS[0].id);

  // Deep-link the selected fund into the hash so a lookup is shareable and the
  // back button works. Read on mount, and follow hash changes.
  useEffect(() => {
    const read = () => {
      const h = (window.location.hash || '').replace(/^#/, '');
      if (h && FUNDS.some((f) => f.id === h)) setSelected(h);
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  const pick = useCallback((id) => {
    setSelected(id);
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#' + id);
    } else {
      window.location.hash = id;
    }
  }, []);

  const fund = FUNDS.find((f) => f.id === selected) || FUNDS[0];

  return (
    <>
      <SkipLink />
      <Grain />
      <ScrollProgress />
      <ToolNav home="../" />

      <main id="main-content">
        {/* Intro */}
        <section id="sf-intro">
          <div className="canvas">
            <div className="sec-tag" data-idx="01"><Icon name="coins" size={32} />{COPY.intro.tag}</div>
            <h1 className="display sf-h1">
              {COPY.intro.title[0]}<br />{COPY.intro.title[1]}
            </h1>
            {COPY.intro.paras.map((p, i) => <p className="sf-intro-p" key={i}>{p}</p>)}
            <div className="sf-chips">
              {COPY.intro.chips.map((c) => <span className="sf-chip" key={c}>{c}</span>)}
            </div>
          </div>
        </section>

        {/* The tool */}
        <section id="sf-tool">
          <div className="canvas">
            <div className="sec-tag" data-idx="02"><Icon name="list" size={32} />{COPY.tool.tag}</div>
            <span id="sf-pick" className="sf-pick-label">{COPY.intro.pick}</span>
            <div className="sf-pick-grid" role="group" aria-label={COPY.intro.pickAria}>
              {FUNDS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`sf-pick${f.id === selected ? ' on' : ''}`}
                  aria-pressed={f.id === selected}
                  onClick={() => pick(f.id)}
                >
                  <span className="sf-pick-name">{f.name}</span>
                  <span className="sf-pick-opt">{f.defaultOption}</span>
                </button>
              ))}
            </div>
            <FundDetail fund={fund} />
          </div>
        </section>

        {/* What you are looking at */}
        <section id="sf-looking">
          <div className="canvas">
            <div className="sec-tag" data-idx="03"><Icon name="book" size={32} />{COPY.looking.tag}</div>
            <h2 className="display sf-h2">{COPY.looking.head}</h2>
            <ul className="sf-looking-list">
              {COPY.looking.points.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        </section>

        {/* Method pointer */}
        <section id="sf-method">
          <div className="canvas">
            <div className="sec-tag" data-idx="04"><Icon name="target" size={32} />{COPY.method.tag}</div>
            <h2 className="display sf-h2">{COPY.method.title[0]} {COPY.method.title[1]}</h2>
            <div className="sf-method-card">
              <p>{COPY.method.body}</p>
              <a className="sf-cta" href={COPY.method.href}>{COPY.method.cta} →</a>
            </div>
          </div>
        </section>

        {/* Backlog + change log */}
        <section id="sf-backlog">
          <div className="canvas">
            <div className="sec-tag" data-idx="05"><Icon name="clock" size={32} />{COPY.backlog.tag}</div>
            <h2 className="display sf-h2">{COPY.backlog.title[0]} {COPY.backlog.title[1]}</h2>
            <p className="sf-sub">{COPY.backlog.sub}</p>
            <div className="sf-back-grid">
              <div>
                <div className="sf-subhead">{COPY.backlog.queuedHead}</div>
                <ul className="sf-queued">
                  {COPY.backlog.queued.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </div>
              <div>
                <div className="sf-subhead">{COPY.backlog.changelogHead}</div>
                <ul className="sf-changelog">
                  {CHANGELOG.map((c, i) => (
                    <li className="sf-change" key={i}>
                      <div className="sf-change-date">{c.date}</div>
                      <div className="sf-change-text">{c.text}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ToolFooter home="../" name={FOOTER.name} back={FOOTER.back} />
    </>
  );
}
