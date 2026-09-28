// Shared chrome for the standalone tool pages, all of them drafts now:
// /grid/, /super/, /targets/, /fashion/, /progress/ and /daily/ keep the site's
// chrome behind their gate so they read as part of the portfolio. Same pattern
// as the footprint pages' Nav: the site-wide
// NAV_LINKS with hrefs prefixed back to the site root, plus the compact
// tool footer. `home` is the relative path back to the root from wherever
// the page sits ('../' for a top-level tool, '../../' for a sub-page).

import { useEffect, useState } from 'react';
import { NAV_LINKS } from '../data/content';
import { navLinkClass, useStickyNavHeight } from './Chrome';
import Mark from './Mark';

export function ToolNav({ home = '../' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  // Publishes --nav-h, which the tool pages' own in-page anchors clear.
  useStickyNavHeight();
  // Escape closes the open mobile menu, matching the home and footprint navs.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);
  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav-inner canvas">
        <a href={home} className="nav-logo"><Mark label="Chris Wang, home" /></a>
        <div className={`nav-links${menuOpen ? ' open' : ''}`} id="nav-links">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={home + l.href} className={navLinkClass(l, false)}>{l.label}</a>
          ))}
        </div>
        <button
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

export function ToolFooter({ home = '../', name = 'Chris Wang · 2026', back = 'Back to profile' }) {
  return (
    <footer className="fp-footer">
      <div className="canvas fp-footer-inner">
        <a href={home} className="fp-footer-home" aria-label="Chris Wang, home"><Mark /></a>
        <span className="fp-footer-name">{name}</span>
        <a href={home} className="fp-footer-back">← {back}</a>
      </div>
    </footer>
  );
}
