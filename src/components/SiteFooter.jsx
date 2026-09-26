import { useLayoutEffect, useRef } from 'react';
import { FOOTER } from '../data/content';
import Icon, { LinkedInIcon } from './Icons';
import Mark from './Mark';

// Keeps the folder-tab notch equidistant from the wordmark on both sides.
// The tab width used to be a hardcoded px guess for the wordmark's rendered
// size (stale the moment the copy changed, see git history for "Christopher
// Wang" -> "Chris Wang"), and negative letter-spacing makes the element's own
// box wider than its visible glyphs, so even a fresh guess would still read
// as an oversized right gap. Measuring the live text range sidesteps both:
// it tracks copy and font-load changes, and it reflects what's actually painted.
function useEquidistantNotch(cardRef, wordmarkRef) {
  useLayoutEffect(() => {
    const card = cardRef.current;
    const mark = wordmarkRef.current;
    if (!card || !mark || !mark.firstChild) return;

    const sync = () => {
      const cardRect = card.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(mark.firstChild);
      const textRect = range.getBoundingClientRect();
      if (!textRect.width || !cardRect.width) return;
      const padX = textRect.left - cardRect.left;
      const cap = window.innerWidth <= 600 ? 0.88 : 0.82; // mirrors the mobile clip-path cap
      const tabW = Math.min(padX + textRect.width + padX, cardRect.width * cap);
      card.style.setProperty('--tab-w', tabW + 'px');
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(card);
    window.addEventListener('resize', sync);
    document.fonts?.ready?.then(sync).catch(() => {});
    return () => { ro.disconnect(); window.removeEventListener('resize', sync); };
  }, [cardRef, wordmarkRef]);
}

// Resolve a footer link against the page it renders on. Home-page anchors
// (#about) and sub-page paths (work/) are written relative to the site root;
// `base` ('' at root, '../' under /work/) rebases them so the same footer works
// from either page. Absolute and mailto links are left untouched.
function resolve(href, base) {
  if (/^(https?:|mailto:)/.test(href)) return href;
  return base + href;
}

export default function SiteFooter({ base = '' }) {
  const cardRef = useRef(null);
  const wordmarkRef = useRef(null);
  useEquidistantNotch(cardRef, wordmarkRef);

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-card" ref={cardRef}>
        <div className="footer-wordmark" ref={wordmarkRef}>{FOOTER.wordmark}</div>

        {/* The single primary call to action. Availability + location fold in
            from the former Contact section; one LinkedIn button, nothing else. */}
        <div className="footer-cta">
          <div className="footer-cta-copy">
            <span className="footer-cta-line">{FOOTER.availability}</span>
            <span className="footer-cta-loc">{FOOTER.location}</span>
          </div>
          <a className="footer-cta-btn" href={FOOTER.ctaHref} target="_blank" rel="noopener noreferrer">
            <LinkedInIcon />{FOOTER.ctaLabel}<span aria-hidden="true">&nbsp;→</span>
          </a>
        </div>

        {/* The column count comes from the data, so a column emptied by a page
            moving behind the gate closes up rather than leaving a hole. */}
        <nav className="footer-cols" aria-label="Footer" style={{ '--footer-col-n': FOOTER.columns.length }}>
          {FOOTER.columns.map((col) => (
            <div className="footer-col" key={col.head}>
              <div className="footer-col-head">{col.icon && <Icon name={col.icon} size={28} className="fpi-lead" />}{col.head}</div>
              <ul className="footer-col-list">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={resolve(l.href, base)}
                      {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="footer-baseline">
          <a href={base || '#about'} className="footer-mark" aria-label="Chris Wang, home"><Mark /></a>
          <span className="footer-legal">{FOOTER.rights}</span>
        </div>
      </div>
    </footer>
  );
}
