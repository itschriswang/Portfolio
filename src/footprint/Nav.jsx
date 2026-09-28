// Shared chrome for the footprint pages: the main dashboard at /footprint/
// and the basis of preparation at /footprint/method/. `home` is the relative
// path back to the site root from wherever the page sits.

import { useEffect, useState } from 'react';
import { NAV_LINKS } from '../data/content';
import { navLinkClass, useStickyNavHeight } from '../components/Chrome';
import { FOOTER, NAV_UI } from './data/copy';
import Mark from '../components/Mark';

export function FootprintNav({ home = '../' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  // Publishes --nav-h, which the footprint pages' in-page anchors clear.
  useStickyNavHeight();
  // Escape closes the open mobile menu, matching every other dismissable
  // surface on the page.
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
        <div id="fp-nav-links" className={`nav-links${menuOpen ? ' open' : ''}`}>
          {NAV_LINKS.map((l) => {
            const self = l.href === 'footprint/';
            // From the dashboard itself the footprint link stays in place;
            // from the method page it climbs back up to the dashboard.
            const href = self && home === '../' ? './' : home + l.href;
            return (
              <a key={l.label} href={href} className={navLinkClass(l, self)} aria-current={self ? 'true' : undefined} onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            );
          })}
        </div>
        <button
          type="button"
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? NAV_UI.menuClose : NAV_UI.menuOpen}
          aria-expanded={menuOpen}
          aria-controls="fp-nav-links"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

export function FootprintFooter({ home = '../' }) {
  return (
    <footer className="fp-footer">
      <div className="canvas fp-footer-inner">
        <a href={home} className="fp-footer-home" aria-label="Chris Wang, home"><Mark /></a>
        <span className="fp-footer-name">{FOOTER.name}</span>
        <a href={home} className="fp-footer-back">← {FOOTER.back}</a>
      </div>
    </footer>
  );
}
