// ============================================================================
// OPENWEAVE — fashion brand transparency lookup.
//
// A practical, editorial tool. You search a brand you recognise and get its
// real corporate parent, its market segment, and a plain reading of what it
// discloses. No fictional brands, no invented metrics, no spinning artwork.
// The one quantified signal is the Fashion Transparency Index 2023 score; the
// rest is honestly marked "Needs research" until a source is confirmed.
//
// Structure: Hero (search) -> Lookup -> Compare -> Lens (what you can't
// know) -> Directory (brands + corporate groups) -> Spotlight + ownership
// map -> Field guide (materials, certifications, regulation, claim check as
// tabs) -> What the signals mean -> Research backlog + change log -> Footer.
// State (selected brand + compare set) is deep-linked into the URL hash, so
// any lookup is shareable and the back button works.
//
// Chrome is the site's own: the shared ToolNav, grain and design tokens come
// from global.css, exactly as the footprint pages do.
// ============================================================================
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  BRANDS, BRAND_BY_ID, SEGMENTS, SIGNAL_FIELDS, STATUS, COPY, SOURCES,
  MULTI_GROUPS, segmentCount, ftiBand, groupFamily,
  digLinks, analyseClaim, SPECIMEN_CLAIMS, ACCC_PRINCIPLES, CLAIM_VERDICTS,
  COMMITMENT_INFO, FIBRES, CERTS, REGULATION, VERIFIED_AS_OF,
  LENS_CONCERNS, LENS_READING, CHANGELOG,
  deriveMonogram, segmentStyle, logoUrl, GROUP_DOMAIN,
} from './data';
import { Grain } from '../components/Chrome';
import Icon from '../components/Icons';
import CopyButton from '../components/CopyButton';
import { copyText } from '../utils/clipboard';
import Aurora from '../components/Aurora';
import ContourField from '../components/ContourField';
import Studio from './Studio';
import { prefersReducedMotion } from '../utils/media';
import SiteFooter from '../components/SiteFooter';
import { ToolNav } from '../components/ToolNav';

const MAX_COMPARE = 3;
const RECENT_KEY = 'ow-recent-v1';

// --------------------------------------------------------------------- search
// Forgiving matcher: lowercase, partial, alias and parent-company aware.
function normalise(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function searchBrands(query, limit = 8) {
  const q = normalise(query);
  if (!q) return [];
  const scored = [];
  for (const b of BRANDS) {
    const name = normalise(b.name);
    const aliasHit = b.aliases.some((a) => normalise(a).includes(q));
    const parent = normalise(b.parent);
    const group = normalise(b.group);
    let score = 0;
    if (name === q) score = 100;
    else if (b.aliases.some((a) => normalise(a) === q)) score = 92; // exact alias (e.g. "m&s")
    else if (name.startsWith(q)) score = 85;
    else if (b.aliases.some((a) => normalise(a).startsWith(q))) score = 78;
    else if (name.includes(q)) score = 70;
    else if (aliasHit) score = 55;
    else if (parent.startsWith(q) || group.startsWith(q)) score = 45;
    else if (parent.includes(q) || group.includes(q)) score = 35;
    else if (normalise(b.knownFor).includes(q)) score = 20;
    if (score > 0) {
      score += b.recognition === 'high' ? 4 : 0;
      scored.push({ b, score });
    }
  }
  scored.sort((x, y) => y.score - x.score || x.b.name.localeCompare(y.b.name));
  return scored.slice(0, limit).map((s) => s.b);
}

function Highlight({ text, query }) {
  const trimmed = (query || '').trim();
  if (!trimmed) return text;
  const start = text.toLowerCase().indexOf(trimmed[0].toLowerCase());
  const idx = text.toLowerCase().indexOf(normalise(query));
  if (idx < 0 || start < 0) return text;
  return (
    <>
      {text.slice(0, start)}
      <mark>{text.slice(start, start + trimmed.length)}</mark>
      {text.slice(start + trimmed.length)}
    </>
  );
}

// ------------------------------------------------------------- hash routing
function readHash() {
  let h = '';
  try { h = decodeURIComponent(window.location.hash.replace(/^#/, '')); } catch { h = window.location.hash.replace(/^#/, ''); }
  if (!h || h === 'top') return { brand: null, compare: [] };
  const map = {};
  for (const kv of h.split('&')) { const [k, v] = kv.split('='); map[k] = v; }
  const brandRaw = map.brand || (!h.includes('=') ? h : null);
  const brand = brandRaw && BRAND_BY_ID[brandRaw] ? brandRaw : null;
  const compare = (map.compare || '')
    .split(',').filter((id) => BRAND_BY_ID[id]).slice(0, MAX_COMPARE);
  return { brand, compare };
}

function buildHash({ brand, compare }) {
  const parts = [];
  if (brand) parts.push('brand=' + brand);
  if (compare && compare.length) parts.push('compare=' + compare.join(','));
  return parts.length ? '#' + parts.join('&') : '#top';
}

// -------------------------------------------------------------------- pills
const STATUS_CLASS = {
  disclosed: 'disclosed', partial: 'partial', parent: 'parent',
  notFound: 'notFound', research: 'research',
};

function StatusPill({ status }) {
  const meta = STATUS[status] || STATUS.research;
  return <span className={`ow-pill ${STATUS_CLASS[status] || 'research'}`}>{meta.label}</span>;
}

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" />
  </svg>
);

// Small helper for an FTI value shown as text.
function ftiText(brand) {
  if (brand.fti != null) return `${brand.fti} / 100`;
  return brand.ftiScope === 'outside' ? 'Not assessed' : 'Needs research';
}

// A practical, honest "before you buy" read, built only from what is on file.
// No invented metrics: it uses ownership, the FTI score and general guidance.
function beforeYouBuy(brand, family) {
  const items = [];
  const parentClean = brand.parent.replace(/\.$/, '');
  items.push(family.length
    ? `Owned by ${parentClean}, which runs ${family.length} other label${family.length > 1 ? 's' : ''} on this page. Its group targets can differ from what the brand says.`
    : `Owned by ${parentClean}. Read the parent's reporting alongside the brand's marketing.`);
  if (brand.fti != null) {
    const band = (brand.ftiBand || ftiBand(brand.fti));
    items.push(`Its transparency score is ${brand.fti}/100 (${band ? band.label.toLowerCase() : 'disclosure'}). Publishing a lot is not the same as low impact.`);
  } else if (brand.ftiScope === 'outside') {
    items.push('Not assessed by the Fashion Transparency Index, so there is no disclosure score to lean on. Treat unqualified claims with extra care.');
  } else {
    items.push('No verified transparency score yet. Open its latest report yourself and note the date on it.');
  }
  items.push('Look for a dated climate target, and whether it reports Scope 3, the supply-chain emissions where most of fashion’s footprint sits.');
  items.push('See if it publishes a supplier factory list, and how far down the tiers it reaches. Most that publish one stop at final assembly.');
  items.push('Get a second opinion in Dig deeper below: Good On You for a consumer rating, Baptist World Aid for an Australian read.');
  items.push('The lowest-impact option is usually the one you already own, bought secondhand, or repaired.');
  return items;
}

// =========================================================================
// Brand logo — the real logo, with a woven care-label monogram fallback.
//
// Shows the company's actual logo, loaded from a logo CDN by domain. If no
// domain is on file or the image fails to load, it falls back to a generated
// monogram tile (from brand data), set in the segment's typeface with a
// segment-coloured stitch, so every brand always has a mark. Purely a visual
// reinforcement of the adjacent brand name, so it is aria-hidden. Pass a
// `brand` (preferred) or an explicit `name`/`segment`/`domain` (used for
// corporate parents, which are not brand records).
// =========================================================================
function BrandLogo({ brand, name, segment, domain, size = 'md', className = '' }) {
  const [source, setSource] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const mark = brand ? brand.mono : deriveMonogram(name || '');
  const seg = brand ? brand.segment : segment;
  const dom = domain || (brand ? brand.domain : null);
  const style = segmentStyle(seg);
  const src = logoUrl(dom, source);

  // A card can be re-used for a different brand (the lookup card), so the
  // provider walk restarts whenever the domain changes.
  useEffect(() => { setSource(0); setLoaded(false); }, [dom]);

  // The monogram is always rendered as the base. Providers are tried in
  // LOGO_SOURCES order: a load error moves to the next source, and so does a
  // "success" that is really a placeholder (Google's s2 endpoint serves a
  // tiny generic globe instead of a 404, so anything under 24px is a miss).
  // Only a real icon fades in over the monogram; if every source misses, the
  // monogram simply stays.
  const onLoad = (e) => {
    if (e.target.naturalWidth >= 24) setLoaded(true);
    else setSource((s) => s + 1);
  };
  return (
    <span
      className={`ow-logo s-${size} t-${style.type} l-${mark.length} ${loaded ? 'img-on' : ''} ${className}`}
      style={{ '--lc': style.accent }}
      aria-hidden="true"
    >
      <span className="mk">{mark}</span>
      {src && (
        <img
          className="ow-logo-img"
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={onLoad}
          onError={() => setSource((s) => s + 1)}
        />
      )}
    </span>
  );
}

function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const p = max > 0 ? h.scrollTop / max : 0;
        if (ref.current) ref.current.style.transform = `scaleX(${p})`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return <div className="ow-progress" ref={ref} style={{ width: '100%', transform: 'scaleX(0)' }} aria-hidden="true" />;
}

// Fixed section rail with active tracking. Hidden on narrow screens (CSS).
// The active section is the last one whose top has crossed the middle of the
// viewport, read on scroll. An IntersectionObserver band used to do this, but
// it only reported sections entering or leaving the band, so the last section
// never took over and the rail sat on "Signals" through the backlog and the
// footers. The rail steps aside once the page footer is in view.
function SectionRail() {
  const [active, setActive] = useState(COPY.rail[0].id);
  const [off, setOff] = useState(false);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const mid = window.innerHeight * 0.5;
      let current = COPY.rail[0].id;
      COPY.rail.forEach((r) => {
        const el = document.getElementById(r.id);
        if (el && el.getBoundingClientRect().top <= mid) current = r.id;
      });
      setActive(current);
      const foot = document.querySelector('.ow-footer');
      setOff(!!foot && foot.getBoundingClientRect().top < window.innerHeight * 0.75);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  const total = COPY.rail.length;
  const activeIdx = COPY.rail.findIndex((r) => r.id === active);
  return (
    <nav className={`ow-rail${off ? ' off' : ''}`} aria-label="Sections">
      <span className="ow-rail-progress" aria-hidden="true">
        {String(activeIdx + 1).padStart(2, '0')} <i>/</i> {String(total).padStart(2, '0')}
      </span>
      {COPY.rail.map((r, i) => (
        <a key={r.id} href={`#${r.id}`} className={active === r.id ? 'on' : ''}>
          <span className="num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <span className="lbl">{r.label}</span>
          <span className="dot" aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}

// Section head in the site's shared editorial language: a mono sec-tag with
// the numbered index in matcha, then a Space Grotesk display title.
function SecHead({ c }) {
  return (
    <div className="ow-sechead">
      <div className="sec-tag" data-idx={`${c.idx} / `}>
        {c.icon && <Icon name={c.icon} size={30} />}{c.sub}
      </div>
      <h2 className="display ow-h2">{c.title}</h2>
    </div>
  );
}

// =========================================================================
// Search field (used in hero and lookup)
// =========================================================================
function SearchField({ onSelect, id = 'ow-search-input', label }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef(null);
  const results = useMemo(() => searchBrands(q), [q]);
  const listId = `${id}-ac`;

  useEffect(() => {
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const choose = (b) => { if (!b) return; onSelect(b.id); setQ(''); setOpen(false); };
  const submit = () => { if (results.length) choose(results[Math.min(active, results.length - 1)]); };

  const onKey = (e) => {
    if (!open && results.length && e.key === 'ArrowDown') { setOpen(true); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); submit(); }
    else if (e.key === 'Escape') { setOpen(false); e.currentTarget.blur(); }
  };

  return (
    <div className="ow-search" ref={boxRef}>
      <label className="ow-search-label" htmlFor={id}>{label || COPY.hero.searchLabel}</label>
      <div className="ow-search-box">
        <SearchIcon />
        <input
          id={id}
          type="text"
          autoComplete="off"
          spellCheck="false"
          value={q}
          placeholder={COPY.hero.searchPlaceholder}
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
          onFocus={() => q && setOpen(true)}
          onKeyDown={onKey}
        />
        <button className="ow-search-go" onClick={submit} aria-label="Look up brand">Look up</button>
      </div>
      {open && q && (
        <div className="ow-ac" id={listId} role="listbox">
          {results.length === 0 && (
            <div className="ow-ac-empty">No match for “{q}”. Try a shorter spelling or a parent company.</div>
          )}
          {results.map((b, i) => (
            <button
              key={b.id}
              className="ow-ac-item"
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(b)}
            >
              <BrandLogo brand={b} size="sm" />
              <span className="ow-ac-name"><Highlight text={b.name} query={q} /></span>
              <span className="ow-ac-meta">{b.parent !== b.name ? b.parent : b.segmentLabel}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// Hero
// =========================================================================
// The hero's three swing tags read their brands from the data set, so the
// parent, segment and score on each tag are the lookup's own, never retyped.
function SwingTagStack() {
  const tags = COPY.hero.tagIds.map((id) => BRAND_BY_ID[id]).filter(Boolean);
  return (
    <div className="ow-tagstack" aria-hidden="true">
      {tags.map((b, i) => (
        <div className={`ow-swing s${i + 1}`} key={b.id}>
          <div className="tag-top">
            <BrandLogo brand={b} size="md" />
            <div>
              <div className="tag-brand">{b.name}</div>
              <div className="tag-parent">{b.parent}</div>
            </div>
          </div>
          <div className="tag-rule" />
          <div className="tag-row"><span>{COPY.lookup.parentLabel}</span><span>{b.parent}</span></div>
          <div className="tag-row"><span>{COPY.lookup.segmentLabel}</span><span>{b.segmentLabel}</span></div>
          <div className="tag-row"><span>FTI 2023</span><span>{b.fti != null ? `${b.fti} / 100` : 'TBC'}</span></div>
        </div>
      ))}
    </div>
  );
}

function Hero({ onSelect, recent }) {
  return (
    <section className="ow-hero" id="top">
      <Aurora
        colorStops={['#635BFF', '#B5C42B', '#FF9500', '#FF3B60']}
        amplitude={0.6}
        blend={0.5}
        opacity={0.2}
      />
      <ContourField />
      <div className="ow-wrap ow-hero-grid">
        <div>
          <span className="ow-kicker"><b>{COPY.brand}</b> · {COPY.hero.kicker}</span>
          <h1 className="display">{COPY.hero.headA} <em>{COPY.hero.headB}</em></h1>
          <p className="stand">{COPY.hero.stand}</p>
          <SearchField onSelect={onSelect} id="ow-hero-search" />
          <div className="ow-examples">
            <span className="lbl">{COPY.hero.examplesLabel}</span>
            {COPY.hero.examples.map((name) => {
              const b = searchBrands(name, 1)[0];
              return (
                <button key={name} className="ow-chip ow-chip-brand" onClick={() => b && onSelect(b.id)}>
                  {b && <BrandLogo brand={b} size="xs" />}{name}
                </button>
              );
            })}
          </div>
          {recent.length > 0 && (
            <div className="ow-examples">
              <span className="lbl">{COPY.hero.recentLabel}</span>
              {recent.map((id) => {
                const b = BRAND_BY_ID[id];
                return b ? (
                  <button key={id} className="ow-chip ow-chip-brand" onClick={() => onSelect(id)}>
                    <BrandLogo brand={b} size="xs" />{b.name}
                  </button>
                ) : null;
              })}
            </div>
          )}
          <p className="ow-hero-count">
            {COPY.hero.countTemplate.replace('{n}', BRANDS.length)}
            <span className="kbd"> · {COPY.hero.kbdHint}</span>
          </p>
        </div>
        <SwingTagStack />
      </div>
    </section>
  );
}

// =========================================================================
// Brand lookup card (the care label)
// =========================================================================
function TransparencyRow({ brand }) {
  if (brand.fti != null) {
    const band = brand.ftiBand || ftiBand(brand.fti);
    return (
      <div className="ow-fti">
        <div className="ow-fti-score">{brand.fti}<small> / 100</small></div>
        <div className="ow-fti-meta">
          <div className="band">{band ? band.label : 'Disclosure score'}</div>
          <div className="note">{brand.ftiNote || (band ? band.note : '')}</div>
        </div>
        <div className="ow-meter"><i style={{ width: `${brand.fti}%` }} /></div>
      </div>
    );
  }
  const outside = brand.ftiScope === 'outside';
  return (
    <div className="ow-fti">
      <div className="ow-fti-score na">{outside ? 'n/a' : 'TBC'}</div>
      <div className="ow-fti-meta">
        <div className="band">{outside ? 'Not assessed' : 'Needs research'}</div>
        <div className="note">{brand.ftiNote || 'No verified Fashion Transparency Index 2023 score on file yet.'}</div>
      </div>
    </div>
  );
}

function BrandCard({ brand, inCompare, onToggleCompare, onSelect, onOpenGroup }) {
  const family = groupFamily(brand.parent).filter((b) => b.id !== brand.id);
  const brandLink = () => `${window.location.origin}${window.location.pathname}#brand=${brand.id}`;

  return (
    <article className="ow-card">
      <div className="ow-card-head">
        <BrandLogo brand={brand} size="lg" className="ow-card-logo" />
        <div className="ow-card-headtext">
          <div className="ow-card-tagcode">{brand.segmentLabel} · {brand.au ? 'Australian relevant' : brand.country}</div>
          <h3 className="ow-card-name">{brand.name}</h3>
          <div className="ow-card-knownfor">{brand.knownFor}</div>
          {brand.provenance && (
            <div className="ow-provenance">
              <span className="k">{COPY.lookup.provenanceLabel}</span>
              {brand.provenance}
            </div>
          )}
        </div>
      </div>

      <div className="ow-card-facts">
        <div className="ow-fact">
          <span className="k">{COPY.lookup.parentLabel}</span>
          <span className="v">
            <button className="ow-parentlink" onClick={() => onOpenGroup(brand.parent)} title="See the group">
              {brand.parent}{family.length > 0 && <span className="ct"> ({family.length + 1})</span>}
            </button>
          </span>
        </div>
        <div className="ow-fact">
          <span className="k">{COPY.lookup.segmentLabel}</span>
          <span className="v">{brand.segmentLabel}</span>
        </div>
        <div className="ow-fact">
          <span className="k">{COPY.lookup.hqLabel}</span>
          <span className="v">{brand.country}</span>
        </div>
      </div>

      <div className="ow-signals">
        <div className="ow-signals-h"><span className="t"><Icon name="chart" size={30} className="fpi-lead" />Disclosure signals</span></div>
        <TransparencyRow brand={brand} />
        <div className="ow-signal-list">
          {SIGNAL_FIELDS.filter((f) => f.id !== 'transparency').map((f) => (
            <div className="ow-signal" key={f.id}>
              <div>
                <span className="sname">{f.label}</span>
                <span className="shelp">{f.help}</span>
              </div>
              <StatusPill status={brand.signals[f.id] || 'research'} />
            </div>
          ))}
        </div>
      </div>

      <div className="ow-commit">
        <div className="ow-commit-h"><Icon name="target" size={28} className="fpi-lead" />{COPY.lookup.commitmentsLabel} <span>· {COPY.lookup.commitmentsHint}</span></div>
        <div className="ow-commit-row">
          {(() => {
            const badges = [];
            const c = brand.commitments;
            if (c.sbti) {
              const meta = COMMITMENT_INFO.sbti;
              badges.push(<a key="sbti" className="ow-badge sbti" href={meta.url} target="_blank" rel="noopener noreferrer" title={c.sbti === 'parent' ? meta.parentHelp : meta.help}>{c.sbti === 'parent' ? meta.parentLabel : meta.label}</a>);
            }
            if (c.fashionPact === 'yes') badges.push(<a key="fp" className="ow-badge fp" href={COMMITMENT_INFO.fashionPact.url} target="_blank" rel="noopener noreferrer" title={COMMITMENT_INFO.fashionPact.help}>{COMMITMENT_INFO.fashionPact.label}</a>);
            else if (c.fashionPact === 'former') badges.push(<span key="fp" className="ow-badge former" title={COMMITMENT_INFO.fashionPact.help}>{COMMITMENT_INFO.fashionPact.former}</span>);
            if (c.bCorp) badges.push(<a key="bc" className="ow-badge bc" href={COMMITMENT_INFO.bCorp.url} target="_blank" rel="noopener noreferrer" title={COMMITMENT_INFO.bCorp.help}>{COMMITMENT_INFO.bCorp.label}</a>);
            return badges.length ? badges : <span className="ow-commit-none">{COPY.lookup.commitmentsNone}</span>;
          })()}
        </div>
      </div>

      {family.length > 0 && (
        <div className="ow-family">
          <div className="ow-family-h"><Icon name="people" size={28} className="fpi-lead" />{COPY.lookup.familyLabel} <span>· {COPY.lookup.familyHint}</span></div>
          <div className="ow-family-chips">
            {family.map((b) => (
              <button key={b.id} className="ow-familychip" onClick={() => onSelect(b.id)}>
                <BrandLogo brand={b} size="xs" />
                {b.name}
                <span className="s">{b.fti != null ? b.fti : (b.ftiScope === 'outside' ? 'n/a' : 'TBC')}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="ow-buy">
        <div className="ow-buy-h"><Icon name="list" size={28} className="fpi-lead" />{COPY.lookup.checklistLabel} <span>· {COPY.lookup.checklistHint}</span></div>
        <ol className="ow-buy-list">
          {beforeYouBuy(brand, family).map((line, i) => (
            <li key={i}><span className="n">{String(i + 1).padStart(2, '0')}</span>{line}</li>
          ))}
        </ol>
      </div>

      <div className="ow-dig">
        <div className="ow-dig-h"><Icon name="globe" size={28} className="fpi-lead" />{COPY.lookup.digLabel} <span>· {COPY.lookup.digHint}</span></div>
        <div className="ow-dig-links">
          {digLinks(brand).map((l) => (
            <a key={l.label} className="ow-diglink" href={l.url} target="_blank" rel="noopener noreferrer">
              <span className="dl-name">{l.label} ↗</span>
              <span className="dl-note">{l.note}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="ow-card-actions">
        {brand.reportUrl ? (
          <a className="ow-btn" href={brand.reportUrl} target="_blank" rel="noopener noreferrer">{COPY.lookup.reportLabel}</a>
        ) : (
          <span className="ow-btn" aria-disabled="true" style={{ opacity: 0.5, cursor: 'default' }}>{COPY.lookup.reportMissing}</span>
        )}
        <button className={`ow-btn ${inCompare ? 'on' : ''}`} onClick={() => onToggleCompare(brand.id)}>
          {inCompare ? `✓ ${COPY.lookup.compareRemove}` : COPY.lookup.compareAdd}
        </button>
        <CopyButton
          className="ow-btn"
          onCopy={() => copyText(brandLink())}
          label={COPY.lookup.shareLabel}
          doneLabel={COPY.lookup.shareDone}
          iconSize={16}
        />
      </div>

      <div className="ow-stamp">{COPY.lookup.freshnessTemplate.replace('{d}', VERIFIED_AS_OF)}</div>
    </article>
  );
}

function LookupSection({ selected, compareIds, onSelect, onToggleCompare, onOpenGroup, forwardRef }) {
  const brand = selected ? BRAND_BY_ID[selected] : null;
  return (
    <section className="ow-section ow-reveal" id="lookup" ref={forwardRef}>
      <div className="ow-wrap">
        <SecHead c={COPY.lookup} />
        <p className="ow-lede">{COPY.lookup.lede}</p>
        <SearchField onSelect={onSelect} id="ow-lookup-search" label={brand ? COPY.lookup.searchAgainLabel : COPY.hero.searchLabel} />
        <div style={{ height: '1.6rem' }} />
        {brand ? (
          <BrandCard
            brand={brand}
            inCompare={compareIds.includes(brand.id)}
            onToggleCompare={onToggleCompare}
            onSelect={onSelect}
            onOpenGroup={onOpenGroup}
          />
        ) : (
          <div className="ow-empty">
            <h3>{COPY.lookup.emptyTitle}</h3>
            <p>{COPY.lookup.emptyBody}</p>
          </div>
        )}
      </div>
    </section>
  );
}

// =========================================================================
// Compare — an aligned table, signal by signal
// =========================================================================
function CompareSection({ compareIds, onRemove, onClear, onSelect }) {
  const brands = compareIds.map((id) => BRAND_BY_ID[id]).filter(Boolean);
  const rows = [
    { k: COPY.lookup.parentLabel, cell: (b) => b.parent },
    { k: COPY.lookup.segmentLabel, cell: (b) => b.segmentLabel },
    { k: COPY.lookup.hqLabel, cell: (b) => b.country },
    { k: 'Transparency Index', fti: true },
    ...SIGNAL_FIELDS.filter((f) => f.id !== 'transparency').map((f) => ({ k: f.label, signal: f.id })),
  ];
  const cols = `minmax(120px, 1fr) repeat(${brands.length}, minmax(0, 1.3fr))`;

  return (
    <section className="ow-section ow-reveal" id="compare">
      <div className="ow-wrap">
        <SecHead c={COPY.compare} />
        <p className="ow-lede">{COPY.compare.lede}</p>
        {brands.length === 0 ? (
          <div className="ow-empty"><p>{COPY.compare.empty}</p></div>
        ) : (
          <>
            <div className="ow-ctable-scroll">
              <div className="ow-ctable" style={{ gridTemplateColumns: cols }}>
                <div className="ow-ct-corner">{COPY.compare.brandCol}</div>
                {brands.map((b) => (
                  <div className="ow-ct-head" key={b.id}>
                    <BrandLogo brand={b} size="md" className="ow-ct-logo" />
                    <button className="ow-ct-name" onClick={() => onSelect(b.id)} title="Open in lookup">{b.name}</button>
                    <button className="ow-ct-x" onClick={() => onRemove(b.id)} aria-label={`Remove ${b.name}`}>✕</button>
                    <span className="ow-ct-sub">{b.knownFor}</span>
                  </div>
                ))}
                {rows.map((r) => (
                  <div className="ow-ct-row" key={r.k} style={{ display: 'contents' }}>
                    <div className="ow-ct-rk">{r.k}</div>
                    {brands.map((b) => (
                      <div className="ow-ct-cell" key={b.id + r.k}>
                        {r.fti ? (
                          b.fti != null ? (
                            <div className="ow-ct-fti">
                              <span className="n">{b.fti}<small>/100</small></span>
                              <span className="bar"><i style={{ width: `${b.fti}%` }} /></span>
                            </div>
                          ) : <StatusPill status={b.ftiScope === 'outside' ? 'notFound' : 'research'} />
                        ) : r.signal ? (
                          <StatusPill status={b.signals[r.signal] || 'research'} />
                        ) : (
                          <span className="ow-ct-txt">{r.cell(b)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: '1.4rem' }}>
              <button className="ow-btn" onClick={onClear}>{COPY.compare.clear}</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// =========================================================================
// The lens — "what you can't know". The decision aid that keeps the
// no-ranking rule: the user picks what they care about, and the section
// re-reads the selected brand's disclosure statuses against those concerns.
// It scores the completeness of what a shopper can verify, never the brand.
// =========================================================================
const LENS_KEY = 'ow-lens-v1';

// Reading -> status-pill palette (the same classes StatusPill uses).
const LENS_PILL = { open: 'disclosed', part: 'partial', parent: 'parent', dark: 'notFound', unverified: 'research' };

function LensSection({ selected }) {
  const brand = selected ? BRAND_BY_ID[selected] : null;
  const [picked, setPicked] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(LENS_KEY) || 'null');
      if (Array.isArray(raw)) {
        const valid = raw.filter((id) => LENS_CONCERNS.some((c) => c.id === id));
        if (valid.length) return valid;
      }
    } catch { /* ignore */ }
    return ['climate', 'supply', 'ownership'];
  });

  const toggle = (id) => {
    setPicked((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem(LENS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const concerns = LENS_CONCERNS.filter((c) => picked.includes(c.id));
  const counts = { n: 0, open: 0, parent: 0, dark: 0, unverified: 0 };
  const blocks = brand
    ? concerns.map((c) => {
      if (c.ownership) {
        counts.n += 1; counts.open += 1;
        const text = brand.provenance
          || `Owned by ${brand.parent.replace(/\.$/, '')}. Verified as of ${VERIFIED_AS_OF}.`;
        return { c, rows: [{ id: 'ownership', label: 'Ownership', text, reading: LENS_READING.disclosed }] };
      }
      const rows = c.signals.map((sid) => {
        const field = SIGNAL_FIELDS.find((f) => f.id === sid);
        const reading = LENS_READING[brand.signals[sid]] || LENS_READING.research;
        counts.n += 1;
        if (reading.id === 'open' || reading.id === 'part') counts.open += 1;
        else if (reading.id === 'parent') counts.parent += 1;
        else if (reading.id === 'dark') counts.dark += 1;
        else counts.unverified += 1;
        return { id: sid, label: field ? field.label : sid, help: field ? field.help : '', reading };
      });
      return { c, rows };
    })
    : [];

  return (
    <section className="ow-section ow-reveal" id="lens">
      <div className="ow-wrap">
        <SecHead c={COPY.lens} />
        <p className="ow-lede">{COPY.lens.lede}</p>

        <div className="ow-lens-pick">
          <span className="lbl">{COPY.lens.pickLabel}</span>
          {LENS_CONCERNS.map((c) => (
            <button key={c.id} className="ow-chip alt" aria-pressed={picked.includes(c.id)} onClick={() => toggle(c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        {!brand ? (
          <div className="ow-empty">
            <h3>{COPY.lens.emptyTitle}</h3>
            <p>{COPY.lens.emptyBody}</p>
          </div>
        ) : concerns.length === 0 ? (
          <div className="ow-empty"><p>{COPY.lens.noneChecked}</p></div>
        ) : (
          <>
            <div className="ow-lens-brand">
              <BrandLogo brand={brand} size="md" />
              <div>
                <span className="bn">{brand.name}</span>
                <span className="bp">{brand.parent}</span>
              </div>
            </div>
            <div className="ow-lens-grid">
              {blocks.map(({ c, rows }) => (
                <div className="ow-lens-card ow-card-soft" key={c.id}>
                  <h3>{c.label}</h3>
                  <p className="why">{c.why}</p>
                  <div className="rows">
                    {rows.map((r) => (
                      <div className="ow-lens-row" key={r.id}>
                        <div>
                          <span className="sname">{r.label}</span>
                          <span className="shelp">{r.text || r.help}</span>
                        </div>
                        <span className={`ow-pill ${LENS_PILL[r.reading.id]}`}>{r.reading.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="ow-lens-summary">
              {COPY.lens.summaryTemplate
                .replace('{n}', counts.n)
                .replace('{open}', counts.open)
                .replace('{parent}', counts.parent)
                .replace('{dark}', counts.dark)
                .replace('{unverified}', counts.unverified)}
            </p>
            <p className="ow-lens-note">{COPY.lens.note}</p>
          </>
        )}
      </div>
    </section>
  );
}

// =========================================================================
// Directory — brands view + corporate groups view
// =========================================================================
function DirTag({ brand, onSelect }) {
  return (
    <button className="ow-tag" onClick={() => onSelect(brand.id)}>
      <div className="top">
        <BrandLogo brand={brand} size="md" />
        <span className="name">{brand.name}{brand.au && <span className="aub">AU</span>}</span>
        {brand.fti != null
          ? <span className="score">{brand.fti}</span>
          : <span className="score na">{brand.ftiScope === 'outside' ? 'n/a' : 'TBC'}</span>}
      </div>
      <span className="seg">{brand.segmentLabel}</span>
      <span className="parent">{brand.parent}</span>
    </button>
  );
}

function GroupCard({ group, focus, onSelect, cardRef }) {
  return (
    <div className={`ow-group ${focus ? 'focus' : ''}`} ref={cardRef}>
      <div className="ow-group-head">
        <div className="ow-group-id">
          <BrandLogo name={group.parent} domain={GROUP_DOMAIN[group.parent]} segment={group.brands[0] && group.brands[0].segment} size="md" />
          <div>
            <h3>{group.parent}</h3>
            <span className="ct">{COPY.directory.groupBrandsTemplate.replace('{n}', group.count)}</span>
          </div>
        </div>
        {group.avg != null && (
          <div className="ow-group-avg">
            <span className="n">{group.avg}</span>
            <span className="l">{COPY.directory.groupAvgLabel}</span>
          </div>
        )}
      </div>
      <div className="ow-group-brands">
        {group.brands.map((b) => (
          <button key={b.id} className="ow-groupchip" onClick={() => onSelect(b.id)}>
            <BrandLogo brand={b} size="xs" />
            <span className="bn">{b.name}</span>
            <span className={`bs ${b.fti != null ? '' : 'na'}`}>{b.fti != null ? b.fti : (b.ftiScope === 'outside' ? 'n/a' : 'TBC')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// The directory's two views, as tab data so the tablist and its key handler
// read from one list rather than two hand-written buttons.
const DIR_VIEWS = [
  { id: 'brands', labelKey: 'viewBrands' },
  { id: 'groups', labelKey: 'viewGroups' },
];

// How many tags the directory shows before "Show all". Rendering all 258 made
// the directory a third of the page on desktop and more than half on a phone,
// so it opens on a preview; filters and the name search still run over the
// whole set, and typing a name shows every match.
const DIR_PREVIEW = { wide: 20, narrow: 8 };
const NARROW_QUERY = '(max-width: 680px)';

function Directory({ onSelect, view, setView, focusGroup }) {
  const [seg, setSeg] = useState('all');
  const [auOnly, setAuOnly] = useState(false);
  const [scoredOnly, setScoredOnly] = useState(false);
  const [pactOnly, setPactOnly] = useState(false);
  const [bcorpOnly, setBcorpOnly] = useState(false);
  const [text, setText] = useState('');
  const [sort, setSort] = useState('name');
  const [showAll, setShowAll] = useState(false);
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(NARROW_QUERY).matches);
  const focusRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia?.(NARROW_QUERY);
    if (!mq) return undefined;
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Roving tabindex with arrow-key movement, per the ARIA tabs pattern — the
  // same handler shape as FieldGuide's.
  const onViewKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const idx = DIR_VIEWS.findIndex((v) => v.id === view);
    const next = DIR_VIEWS[(idx + (e.key === 'ArrowRight' ? 1 : DIR_VIEWS.length - 1)) % DIR_VIEWS.length];
    setView(next.id);
    document.getElementById(`ow-dirtab-${next.id}`)?.focus();
  };

  const list = useMemo(() => {
    let out = BRANDS.slice();
    if (seg !== 'all') out = out.filter((b) => b.segment === seg);
    if (auOnly) out = out.filter((b) => b.au);
    if (scoredOnly) out = out.filter((b) => b.fti != null);
    if (pactOnly) out = out.filter((b) => b.commitments.fashionPact === 'yes');
    if (bcorpOnly) out = out.filter((b) => b.commitments.bCorp);
    const q = normalise(text);
    if (q) out = out.filter((b) => normalise(b.name).includes(q) || normalise(b.parent).includes(q) || b.aliases.some((a) => normalise(a).includes(q)));
    out.sort((a, b) => {
      if (sort === 'fti') { const av = a.fti == null ? -1 : a.fti; const bv = b.fti == null ? -1 : b.fti; return bv - av || a.name.localeCompare(b.name); }
      if (sort === 'recognition') { const r = (x) => (x.recognition === 'high' ? 0 : 1); return r(a) - r(b) || a.name.localeCompare(b.name); }
      if (sort === 'segment') return a.segmentLabel.localeCompare(b.segmentLabel) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
    return out;
  }, [seg, auOnly, scoredOnly, pactOnly, bcorpOnly, text, sort]);

  const preview = narrow ? DIR_PREVIEW.narrow : DIR_PREVIEW.wide;
  const capped = !showAll && !text && list.length > preview;
  const shown = capped ? list.slice(0, preview) : list;

  useEffect(() => {
    if (view === 'groups' && focusGroup && focusRef.current) {
      focusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [view, focusGroup]);

  const standalone = BRANDS.length - MULTI_GROUPS.reduce((n, g) => n + g.count, 0);

  return (
    <section className="ow-section ow-reveal" id="directory">
      <div className="ow-wrap">
        <SecHead c={COPY.directory} />
        <p className="ow-lede">{view === 'groups' ? COPY.directory.groupsLede : COPY.directory.lede}</p>

        {/* Tabs, so the same roving-tabindex + arrow-key behaviour the field
            guide has (see FieldGuide below): the two buttons are one tab stop
            and the arrows move between them. Before this they carried tab roles
            without the keyboard contract behind them, which told assistive tech
            to expect arrow keys that did nothing. */}
        <div className="ow-viewtoggle" role="tablist" aria-label="Directory view" onKeyDown={onViewKey}>
          {DIR_VIEWS.map((v) => (
            <button
              key={v.id}
              id={`ow-dirtab-${v.id}`}
              role="tab"
              aria-selected={view === v.id}
              aria-controls={`ow-dirpanel-${v.id}`}
              tabIndex={view === v.id ? 0 : -1}
              className={view === v.id ? 'on' : ''}
              onClick={() => setView(v.id)}
            >
              {COPY.directory[v.labelKey]}
            </button>
          ))}
        </div>

        {view === 'brands' ? (
          <div id="ow-dirpanel-brands" role="tabpanel" aria-labelledby="ow-dirtab-brands">
            <div className="ow-toolbar">
              <div className="ow-dirsearch">
                <SearchIcon />
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder={COPY.directory.filterPlaceholder} aria-label="Filter directory by name" />
              </div>
              <div className="ow-sortwrap">
                <label htmlFor="ow-sort">{COPY.directory.sortLabel}</label>
                <select id="ow-sort" className="ow-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="name">{COPY.directory.sort.name}</option>
                  <option value="fti">{COPY.directory.sort.fti}</option>
                  <option value="recognition">{COPY.directory.sort.recognition}</option>
                  <option value="segment">{COPY.directory.sort.segment}</option>
                </select>
              </div>
            </div>

            <div className="ow-filters">
              <button className="ow-chip" aria-pressed={seg === 'all'} onClick={() => setSeg('all')}>{COPY.directory.filterAll}</button>
              {SEGMENTS.map((s) => (
                <button key={s.id} className="ow-chip" aria-pressed={seg === s.id} onClick={() => setSeg(s.id)}>
                  {s.label} <b>{segmentCount(s.id)}</b>
                </button>
              ))}
              <button className="ow-chip alt" aria-pressed={auOnly} onClick={() => setAuOnly((v) => !v)}>{COPY.directory.auOnly}</button>
              <button className="ow-chip alt" aria-pressed={scoredOnly} onClick={() => setScoredOnly((v) => !v)}>{COPY.directory.scored}</button>
              <button className="ow-chip alt" aria-pressed={pactOnly} onClick={() => setPactOnly((v) => !v)}>{COPY.directory.pactOnly}</button>
              <button className="ow-chip alt" aria-pressed={bcorpOnly} onClick={() => setBcorpOnly((v) => !v)}>{COPY.directory.bcorpOnly}</button>
            </div>

            <p className="ow-count">
              {capped
                ? COPY.directory.resultPartTemplate.replace('{shown}', shown.length).replace('{n}', list.length)
                : COPY.directory.resultTemplate.replace('{n}', list.length)}
              <span className="key">{COPY.directory.scoreKey}</span>
            </p>
            {list.length === 0
              ? <div className="ow-empty"><p>{COPY.directory.noMatch}</p></div>
              : <div className="ow-dir-grid" id="ow-dir-grid">{shown.map((b) => <DirTag key={b.id} brand={b} onSelect={onSelect} />)}</div>}
            {!text && list.length > preview && (
              <div className="ow-dir-more">
                <button
                  className="ow-btn"
                  aria-expanded={showAll}
                  aria-controls="ow-dir-grid"
                  onClick={() => {
                    if (showAll) {
                      document.getElementById('directory')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
                    }
                    setShowAll((v) => !v);
                  }}
                >
                  {showAll ? COPY.directory.showFewer : COPY.directory.showAllTemplate.replace('{n}', list.length)}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div id="ow-dirpanel-groups" role="tabpanel" aria-labelledby="ow-dirtab-groups">
            <div className="ow-groups">
              {MULTI_GROUPS.map((g) => (
                <GroupCard
                  key={g.parent}
                  group={g}
                  focus={focusGroup === g.parent}
                  onSelect={onSelect}
                  cardRef={focusGroup === g.parent ? focusRef : null}
                />
              ))}
            </div>
            <p className="ow-count">Plus {standalone} standalone labels that own no other brand on file.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// =========================================================================
// Stat band (form: at-a-glance editorial figures under the hero)
// =========================================================================
function StatBand() {
  const values = {
    brands: BRANDS.length,
    groups: MULTI_GROUPS.length,
    scored: BRANDS.filter((b) => b.fti != null).length,
    segments: SEGMENTS.length,
  };
  return (
    <div className="ow-statband" aria-hidden="false">
      <div className="ow-wrap ow-statband-inner">
        {COPY.stats.map((s) => (
          <div className="ow-statcell" key={s.from}>
            <span className="n">{values[s.from]}</span>
            <span className="k">{s.icon && <Icon name={s.icon} size={30} className="fpi-lead" />}{s.k}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================
// Spotlight (a dark editorial band) + the ownership map: the concentration
// fact made explorable. A squarified treemap of every multi-brand owner,
// sized by brand count only (no invented metric), each tile opening the
// group in the directory.
// =========================================================================

// Squarified treemap layout (Bruls et al.), kept plain enough to hand-check:
// rows of tiles are laid along the shorter side of the remaining space,
// keeping every tile near-square. Returns rects in the same units as w/h.
function squarifyLayout(values, width, height) {
  const total = values.reduce((n, v) => n + v, 0) || 1;
  const scaled = values.map((v) => (v / total) * width * height);
  const rects = [];
  let x = 0; let y = 0; let w = width; let h = height;
  let row = [];
  const worst = (r, side) => {
    const sum = r.reduce((n, v) => n + v, 0);
    const s2 = sum * sum;
    return Math.max((side * side * Math.max(...r)) / s2, s2 / (side * side * Math.min(...r)));
  };
  const layoutRow = () => {
    const sum = row.reduce((n, v) => n + v, 0);
    const horizontal = w < h; // the row runs along the shorter side
    const thick = sum / (horizontal ? w : h);
    let off = 0;
    for (const v of row) {
      const len = v / thick;
      rects.push(horizontal
        ? { x: x + off, y, w: len, h: thick }
        : { x, y: y + off, w: thick, h: len });
      off += len;
    }
    if (horizontal) { y += thick; h -= thick; } else { x += thick; w -= thick; }
    row = [];
  };
  let i = 0;
  while (i < scaled.length) {
    const side = Math.min(w, h) || 1;
    if (!row.length || worst([...row, scaled[i]], side) <= worst(row, side)) {
      row.push(scaled[i]); i += 1;
    } else {
      layoutRow();
    }
  }
  if (row.length) layoutRow();
  return rects;
}

const TMAP_H = 46; // internal layout height; the box itself is aspect-ratio'd

function OwnershipMap({ onOpenGroup }) {
  const standalone = BRANDS.length - MULTI_GROUPS.reduce((n, g) => n + g.count, 0);
  const tiles = useMemo(() => {
    const rects = squarifyLayout(MULTI_GROUPS.map((g) => g.count), 100, TMAP_H);
    return MULTI_GROUPS.map((g, i) => ({ group: g, r: rects[i] }));
  }, []);
  return (
    <div className="ow-tmap-wrap">
      <p className="ow-tmap-lede">{COPY.spotlight.mapLede}</p>
      <div className="ow-tmap" role="group" aria-label="Corporate owners, sized by brands on file">
        {tiles.map(({ group, r }) => (
          <button
            key={group.parent}
            className={`ow-tmap-tile ${r.w * r.h < 40 ? 'sm' : ''}`}
            style={{
              left: `${r.x}%`,
              top: `${(r.y / TMAP_H) * 100}%`,
              width: `${r.w}%`,
              height: `${(r.h / TMAP_H) * 100}%`,
            }}
            onClick={() => onOpenGroup(group.parent)}
            title={`${group.parent} · ${group.count} brands on file${group.avg != null ? ` · mean FTI ${group.avg}` : ''}`}
          >
            <span className="tn">{group.parent}</span>
            <span className="tc">{group.count}</span>
          </button>
        ))}
      </div>
      <p className="ow-tmap-note">
        {COPY.spotlight.mapNote} {COPY.spotlight.independentsTemplate.replace('{n}', standalone)}
      </p>
    </div>
  );
}

function Spotlight({ onOpenGroup }) {
  // Both figures read off the brand set, so the concentration claim stays true
  // as brands are added rather than being a hand-typed number that rots.
  const covered = MULTI_GROUPS.reduce((n, g) => n + g.count, 0);
  const fillStat = (s) => s
    .replace('{n}', MULTI_GROUPS.length)
    .replace('{covered}', covered)
    .replace('{total}', BRANDS.length);
  return (
    <aside className="ow-spotlight ow-dark" aria-label="Ownership concentration">
      <div className="ow-wrap">
        <p className="ow-spotlight-line">
          <b>{fillStat(COPY.spotlight.stat)}</b> {fillStat(COPY.spotlight.line)}
        </p>
        <p className="ow-spotlight-sub">{COPY.spotlight.sub}</p>
        <OwnershipMap onOpenGroup={onOpenGroup} />
      </div>
    </aside>
  );
}

// =========================================================================
// Claim check (greenwashing utility, grounded in ACCC guidance)
// =========================================================================
function FlagList({ title, items, noteKey }) {
  if (!items.length) return null;
  return (
    <div className="ow-flag-group">
      <div className="ow-flag-h">{title} <span>· {items.length}</span></div>
      {items.map((f, i) => (
        <div className="ow-flag" key={f.term + i}>
          <span className="ow-flag-word">“{f.word}”</span>
          <span className="ow-flag-note">{f[noteKey] || f.note}</span>
        </div>
      ))}
    </div>
  );
}

// Render the submitted claim with flagged words marker-underlined, like an
// auditor marking up a record (Madam Speaker mechanic).
function MarkedClaim({ text, result }) {
  const words = [...result.absolute, ...result.vague, ...result.qualifier].map((f) => f.word);
  if (!words.length) return <span>{text}</span>;
  const trimmed = [...new Set(words.map((w) => w.trim()))].filter(Boolean);
  const flagSet = new Set(trimmed.map((w) => w.toLowerCase()));
  const escaped = trimmed.sort((a, b) => b.length - a.length)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'));
  return (
    <span>
      {parts.map((p, i) => (p && flagSet.has(p.toLowerCase())
        ? <mark key={i} className="ow-mark">{p}</mark>
        : <span key={i}>{p}</span>))}
    </span>
  );
}

function ClaimCheckPanel() {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState('');
  const result = useMemo(() => analyseClaim(submitted), [submitted]);

  const run = () => setSubmitted(text);
  const tryOne = (c) => { setText(c); setSubmitted(c); };
  const verdictClass = result ? { sound: 'ok', vague: 'warn', risk: 'bad' }[result.verdict.id] : '';

  return (
    <>
        <p className="ow-sublede">{COPY.claim.lede}</p>

        <div className="ow-claim-grid">
          <div className="ow-claim-input">
            <textarea
              className="ow-claim-ta"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={COPY.claim.placeholder}
              rows={3}
              aria-label="Marketing claim to check"
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) run(); }}
            />
            <div className="ow-claim-controls">
              <button className="ow-btn solid" onClick={run}>{COPY.claim.run}</button>
              <div className="ow-claim-try">
                <span className="lbl">{COPY.claim.tryLabel}</span>
                {SPECIMEN_CLAIMS.map((c, i) => (
                  <button key={i} className="ow-chip" onClick={() => tryOne(c)} title={c}>{c.length > 34 ? c.slice(0, 32) + '…' : c}</button>
                ))}
              </div>
            </div>

            {result ? (
              <div className={`ow-claim-result ${verdictClass}`}>
                <div className="ow-marked">“<MarkedClaim text={submitted} result={result} />”</div>
                <div className="ow-verdict">
                  <span className="stamp">{result.verdict.label}</span>
                  <span className="line">{result.verdict.line}</span>
                </div>
                <FlagList title={COPY.claim.flaggedAbsolute} items={result.absolute} noteKey="note" />
                <FlagList title={COPY.claim.flaggedVague} items={result.vague} noteKey="note" />
                <FlagList title={COPY.claim.flaggedQualifier} items={result.qualifier} noteKey="note" />
                <div className="ow-evidence">{COPY.claim.evidenceLabel}: <b>{result.evidence}</b></div>
                <details className="ow-method">
                  <summary>How this verdict was reached</summary>
                  <p>The claim is scanned for vague terms with no fixed meaning, for absolute terms that fail on the first exception, and for terms that are legitimate only with a specific qualifier. It then looks for evidence signals: a number, a recognised certification, a third-party audit, a year, or a stated comparison. A claim with flagged terms and no evidence reads as vague; an absolute claim, or two or more flags with no evidence, reads as high risk. It is a heuristic, not a ruling.</p>
                </details>
              </div>
            ) : (
              <div className="ow-claim-result empty"><p>{COPY.claim.emptyResult}</p></div>
            )}
            <p className="ow-claim-disclaimer">{COPY.claim.disclaimer}</p>
          </div>

          <aside className="ow-principles">
            <h3>{COPY.claim.principlesLabel}</h3>
            <ol className="ow-principles-list">
              {ACCC_PRINCIPLES.map((p, i) => (
                <li key={i}><span className="pn">{String(i + 1).padStart(2, '0')}</span>{p}</li>
              ))}
            </ol>
            <p className="ow-principles-note">{COPY.claim.principlesNote}</p>
          </aside>
        </div>
    </>
  );
}

// =========================================================================
// Field guide — the four explainers as one tabbed section: materials,
// certifications, regulation and the claim check. The page's spine stays
// the lookup; the working knowledge lives here, one tab at a time.
// =========================================================================
function MaterialsPanel() {
  return (
    <>
      <p className="ow-sublede">{COPY.materials.lede}</p>
      <div className="ow-fibres">
        {FIBRES.map((f) => (
          <div className="ow-fibre" key={f.name}>
            <div className="ow-fibre-head">
              <span className="fn">{f.name}</span>
              <span className="fk">{f.kind}</span>
            </div>
            <div className="ow-fibre-body">
              <div className="ow-fibre-row good"><span className="fl">{COPY.materials.goodLabel}</span>{f.good}</div>
              <div className="ow-fibre-row watch"><span className="fl">{COPY.materials.watchLabel}</span>{f.watch}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="ow-caveat">
        <h3>{COPY.materials.caveatTitle}</h3>
        <p>{COPY.materials.caveat}</p>
      </div>
    </>
  );
}

function CertsPanel() {
  return (
    <>
      <p className="ow-sublede">{COPY.guide.certLede}</p>
      <div className="ow-certs">
        {CERTS.map((c) => (
          <div className="ow-cert" key={c.name}>
            <div className="ow-cert-name">{c.name}</div>
            <div className="ow-cert-row"><span className="cl">{COPY.guide.certVerifies}</span>{c.verifies}</div>
            <div className="ow-cert-row edge"><span className="cl">{COPY.guide.certEdge}</span>{c.edge}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function RegulationPanel() {
  return (
    <>
      <p className="ow-sublede">{COPY.guide.regLede}</p>
      <div className="ow-reg">
        {REGULATION.map((r) => (
          <div className="ow-regitem" key={r.name}>
            <div className="ow-reg-top">
              <span className="ow-reg-name">{r.name}</span>
              <span className="ow-reg-tag">{r.tag}</span>
            </div>
            <div className="ow-reg-when">{r.when}</div>
            <p className="ow-reg-what">{r.what}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function FieldGuide() {
  const [tab, setTab] = useState('materials');
  const tabs = COPY.guide.tabs;

  // Roving tabindex with arrow-key movement, per the ARIA tabs pattern.
  const onKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const idx = tabs.findIndex((t) => t.id === tab);
    const next = tabs[(idx + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    setTab(next.id);
    const el = document.getElementById(`ow-guidetab-${next.id}`);
    if (el) el.focus();
  };

  return (
    <section className="ow-section ow-reveal" id="guide">
      <div className="ow-wrap">
        <SecHead c={COPY.guide} />
        <p className="ow-lede">{COPY.guide.lede}</p>
        <div className="ow-viewtoggle ow-guidetabs" role="tablist" aria-label="Field guide topics" onKeyDown={onKey}>
          {tabs.map((t) => (
            <button
              key={t.id}
              id={`ow-guidetab-${t.id}`}
              role="tab"
              aria-selected={tab === t.id}
              aria-controls={`ow-guidepanel-${t.id}`}
              tabIndex={tab === t.id ? 0 : -1}
              className={tab === t.id ? 'on' : ''}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div
          className="ow-guidepanel"
          id={`ow-guidepanel-${tab}`}
          role="tabpanel"
          aria-labelledby={`ow-guidetab-${tab}`}
        >
          {tab === 'materials' && <MaterialsPanel />}
          {tab === 'certs' && <CertsPanel />}
          {tab === 'regulation' && <RegulationPanel />}
          {tab === 'claim' && <ClaimCheckPanel />}
        </div>
      </div>
    </section>
  );
}

// =========================================================================
// What the signals mean
// =========================================================================
function SignalsExplainer() {
  return (
    <section className="ow-section ow-reveal" id="signals">
      <div className="ow-wrap">
        <SecHead c={COPY.signals} />
        <p className="ow-lede">{COPY.signals.lede}</p>
        <div className="ow-explain">
          {COPY.signals.cards.map((c) => (
            <div className="ow-explain-card" key={c.h}>
              <h3>{c.h}</h3>
              <p>{c.b}</p>
            </div>
          ))}
        </div>
        <p className="ow-note"><b>Read this first.</b> {COPY.signals.disclaimer}</p>
      </div>
    </section>
  );
}

// =========================================================================
// Research backlog
// =========================================================================
function Backlog() {
  const needScore = BRANDS.filter((b) => b.needsResearch).length;
  const fieldCount = BRANDS.reduce((n, b) => (
    n + Object.values(b.signals).filter((s) => s === STATUS.research.id).length
  ), 0);
  const stats = [
    { n: needScore, l: 'brands still need a verified transparency score' },
    { n: fieldCount, l: 'disclosure fields awaiting a checked source' },
    { n: BRANDS.length, l: 'brands and companies on file with verified ownership' },
  ];
  return (
    <section className="ow-section ow-reveal" id="backlog">
      <div className="ow-wrap">
        <SecHead c={COPY.backlog} />
        <p className="ow-lede">{COPY.backlog.lede}</p>
        <div className="ow-backlog-stats">
          {stats.map((s) => (
            <div className="ow-stat" key={s.l}>
              <div className="n">{s.n}</div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="ow-file">
          <p>{COPY.backlog.fileNote}</p>
          <a className="path" href={COPY.backlog.fileHref} target="_blank" rel="noopener noreferrer">{COPY.backlog.filePath}</a>
          <p>{COPY.backlog.howTo}</p>
        </div>

        <div className="ow-subblock">
          <h3 className="ow-subhead">{COPY.backlog.logTitle}</h3>
          <p className="ow-sublede">{COPY.backlog.logLede}</p>
          <ol className="ow-log">
            {CHANGELOG.map((e, i) => (
              <li key={i}>
                <span className="d">{e.date}</span>
                <span className="t">{e.note}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// =========================================================================
// Footer
// =========================================================================
function Footer() {
  return (
    <footer className="ow-footer">
      <div className="ow-wrap">
        <div className="ow-footer-grid">
          <div>
            <h4><Icon name="book" size={28} className="fpi-lead" />Method</h4>
            <p className="method">{COPY.footer.method}</p>
          </div>
          <div>
            <h4><Icon name="list" size={28} className="fpi-lead" />{COPY.footer.sourcesLabel}</h4>
            {SOURCES.map((s) => (
              <a className="src" key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
            ))}
          </div>
        </div>
        <div className="ow-attribution">
          <h4><Icon name="tag" size={28} className="fpi-lead" />{COPY.footer.attributionLabel}</h4>
          <p>{COPY.footer.attribution}</p>
        </div>
        <div className="ow-footer-base">
          <span>{COPY.footer.made}</span>
          <a className="ow-top" href="#top">↑ {COPY.footer.top}</a>
        </div>
      </div>
    </footer>
  );
}

// =========================================================================
// Shell
// =========================================================================
export default function FashionApp() {
  const initial = typeof window !== 'undefined' ? readHash() : { brand: null, compare: [] };
  const [selected, setSelected] = useState(initial.brand);
  const [compareIds, setCompareIds] = useState(initial.compare);
  const [dirView, setDirView] = useState('brands');
  const [focusGroup, setFocusGroup] = useState(null);
  const [recent, setRecent] = useState([]);
  const lookupRef = useRef(null);
  const heroSearchRef = useRef(null);
  const writingHash = useRef(false);

  // Load recently-viewed from storage once.
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
      setRecent(raw.filter((id) => BRAND_BY_ID[id]).slice(0, 6));
    } catch { /* ignore */ }
  }, []);

  const pushRecent = useCallback((id) => {
    setRecent((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 6);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  // Keep the URL hash in sync with state (shareable + back button).
  useEffect(() => {
    const target = buildHash({ brand: selected, compare: compareIds });
    if (buildHash(readHash()) !== target) {
      writingHash.current = true;
      window.history.replaceState(null, '', target);
    }
  }, [selected, compareIds]);

  // React to back/forward and shared-link navigation.
  useEffect(() => {
    const onHash = () => {
      if (writingHash.current) { writingHash.current = false; return; }
      const { brand, compare } = readHash();
      setSelected(brand);
      setCompareIds(compare);
    };
    window.addEventListener('hashchange', onHash);
    window.addEventListener('popstate', onHash);
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('popstate', onHash); };
  }, []);

  const select = useCallback((id, opts = {}) => {
    setSelected(id);
    if (id) pushRecent(id);
    if (opts.scroll !== false) {
      requestAnimationFrame(() => {
        if (lookupRef.current) lookupRef.current.scrollIntoView({ behavior: opts.instant ? 'auto' : 'smooth', block: 'start' });
      });
    }
  }, [pushRecent]);

  const openGroup = useCallback((parent) => {
    setDirView('groups');
    setFocusGroup(parent);
    requestAnimationFrame(() => {
      const el = document.getElementById('directory');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const toggleCompare = useCallback((id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return [...prev.slice(1), id];
      return [...prev, id];
    });
  }, []);
  const removeCompare = useCallback((id) => setCompareIds((p) => p.filter((x) => x !== id)), []);
  const clearCompare = useCallback(() => setCompareIds([]), []);

  // On first load with a shared brand link, jump to it without a smooth crawl.
  useEffect(() => {
    if (initial.brand) requestAnimationFrame(() => {
      if (lookupRef.current) lookupRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // "/" focuses the search from anywhere.
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (typing) return;
      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        const el = document.getElementById('ow-hero-search') || document.getElementById('ow-lookup-search');
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus({ preventScroll: true }); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Scroll reveals for sections (skipped under reduced motion).
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('.ow-reveal'));
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href="#lookup">Skip to the brand lookup</a>
      <Grain />
      <ScrollProgress />
      <ToolNav />
      <SectionRail />
      <main className="ow-main" ref={heroSearchRef}>
        <Hero onSelect={select} recent={recent} />
        <StatBand />
        <LookupSection
          selected={selected}
          compareIds={compareIds}
          onSelect={select}
          onToggleCompare={toggleCompare}
          onOpenGroup={openGroup}
          forwardRef={lookupRef}
        />
        <CompareSection compareIds={compareIds} onRemove={removeCompare} onClear={clearCompare} onSelect={select} />
        <LensSection selected={selected} />
        <Directory onSelect={select} view={dirView} setView={setDirView} focusGroup={focusGroup} />
        <Spotlight onOpenGroup={openGroup} />
        <Studio />
        <FieldGuide />
        <SignalsExplainer />
        <Backlog />
      </main>
      <Footer />
      <SiteFooter base="../" />
    </>
  );
}
