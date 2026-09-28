import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { NAV_LINKS } from '../data/content';
import { prefersReducedMotion } from '../utils/media';
import Mark from './Mark';

export function Grain() {
  return <div className="grain-overlay" aria-hidden="true" />;
}

// First focusable element on the page: lets keyboard and screen-reader users
// jump straight past the sticky nav to the content. Visually hidden until
// focused (see .skip-link in global.css).
export function SkipLink() {
  return <a href="#main-content" className="skip-link">Skip to content</a>;
}

// Publish the sticky nav's real height as --nav-h, which is what every anchor
// landing and focus scroll clears (see STICKY-NAV HEADROOM in global.css).
//
// Measured rather than hardcoded, for the same reason the footer's tab notch is
// (see useEquidistantNotch in SiteFooter.jsx): a constant goes stale. The bar is
// 53px at every width from 681px with today's six links, but the old eight did
// not fit one row between about 680px and 750px (the bar went to 71px, then
// 104px), and any future label or link can open a band like that again. The
// open mobile menu is taller still. A ResizeObserver on the bar itself is right
// at every width without anyone having to remember to re-measure. The CSS keeps
// 53px as the value before this runs.
//
// The same measurement serves anything pinned at the top of a page, so it is
// written once here. More than one bar can share top:0 and overlap (the
// footprint page pins its mode bar under the site nav), so `selectors` takes
// all of them and the headroom is the tallest: a bar the stylesheet has left
// static at this breakpoint counts as nothing, because it scrolls away with
// the page rather than standing over it. `holdWhile` names a descendant whose
// presence means the height on show is a transient one to ignore, and `watch`
// is any value that changes when a bar mounts or unmounts.
export function useStickyBarHeight(selectors, prop, { holdWhile, watch } = {}) {
  const list = Array.isArray(selectors) ? selectors.join(',') : selectors;
  useEffect(() => {
    const bars = [...document.querySelectorAll(list)];
    const set = (h) => document.documentElement.style.setProperty(prop, h + 'px');
    if (!bars.length) { set(0); return undefined; }
    const sync = () => {
      if (holdWhile && bars.some((b) => b.querySelector(holdWhile))) return;
      const h = bars.reduce((tallest, b) => (
        getComputedStyle(b).position === 'sticky'
          ? Math.max(tallest, Math.round(b.getBoundingClientRect().height))
          : tallest
      ), 0);
      set(h);
    };
    sync();
    const ro = new ResizeObserver(sync);
    bars.forEach((b) => ro.observe(b));
    // Crossing the breakpoint that unpins a bar need not change its size, so
    // the observer alone can miss it.
    window.addEventListener('resize', sync);
    document.fonts?.ready?.then(sync).catch(() => {});
    return () => { ro.disconnect(); window.removeEventListener('resize', sync); };
  }, [list, prop, holdWhile, watch]);
}

export function useStickyNavHeight() {
  // An open mobile menu makes the bar as tall as the stacked link list. That is
  // not headroom anything needs to clear: the menu closes the moment a link in
  // it is chosen, so the closed height is what a landing arrives under. Hold
  // the last closed measurement while it is open.
  useStickyBarHeight('.nav', '--nav-h', { holdWhile: '.nav-links.open' });
}

// Land on the section a hash names, on a cold load.
//
// Every page here is client-rendered: the served HTML is an empty #root, so
// when the browser resolves the URL fragment the target section does not exist
// yet, and it never retries once React paints. The visitor lands at the top of
// the page instead of the section they asked for. That silently broke every
// cross-page anchor on the site (the nav and footer of /work/ and of all five
// tool pages link back with '../#bio', '../#scenario' and the like), plus any
// deep link that was shared or bookmarked.
//
// So do the browser's job once the element is there: poll a few frames for it
// and scroll it into view. scrollIntoView honours the scroll-margin-top set in
// global.css, so the landing clears the sticky nav like an in-page nav click
// does. 'auto' rather than 'smooth' on purpose: this is an arrival, not a
// journey, and a smooth scroll would drag the reader through the whole page.
export function useHashLanding() {
  useEffect(() => {
    const raw = window.location.hash.slice(1);
    if (!raw) return undefined;

    // Back, Forward and reload restore the scroll position the reader left,
    // and that has to survive: someone who read to the footer of /#tools,
    // followed a link and came back expects the footer, not a jump to the top
    // of the section. Only a fresh navigation gets the landing treatment.
    // Testing window.scrollY instead would not work here, the served HTML is
    // an empty #root, so the page has no height and no restored offset yet at
    // the moment this runs.
    const navEntry = performance.getEntriesByType?.('navigation')?.[0];
    if (navEntry && navEntry.type !== 'navigate') return undefined;

    let id;
    try { id = decodeURIComponent(raw); } catch { id = raw; }

    let frame = 0;
    let tries = 0;
    const land = () => {
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: 'auto', block: 'start' }); return; }
      if (tries++ < 90) frame = requestAnimationFrame(land);
    };
    // If a section renders late and the reader starts moving the page in the
    // meantime, their input wins over the pending jump.
    const stop = () => { tries = Infinity; cancelAnimationFrame(frame); };
    const opts = { once: true, passive: true };
    window.addEventListener('wheel', stop, opts);
    window.addEventListener('touchstart', stop, opts);
    window.addEventListener('keydown', stop, { once: true });
    frame = requestAnimationFrame(land);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('keydown', stop);
    };
  }, []);
}

// Class for one NAV_LINKS entry, shared by every nav on the site (home, work,
// footprint and the tool pages). A link to another page carries `nav-page`,
// which is what sets the page links apart from the in-page anchors (see NAV in
// global.css); the link for where the reader is carries `active`.
export function navLinkClass(link, active) {
  return [link.external && 'nav-page', active && 'active'].filter(Boolean).join(' ') || undefined;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  return <motion.div id="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

export function Nav() {
  const [active, setActive] = useState('about');
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  // Height first, then the landing: the landing clears whatever the bar measures.
  useStickyNavHeight();
  useHashLanding();

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // A pointer outside the bar closes the open mobile menu, and so does Escape:
  // the same dismissal the footprint pages' nav already has, so the menu behaves
  // the same on every page whether you are using a finger or a keyboard.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('pointerdown', handler);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', handler);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const onClick = (e, href) => {
    if (!href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const wasOpen = menuOpen;
    setMenuOpen(false);
    // scrollIntoView, not hand-rolled offset maths. The headroom lives in one
    // place now, scroll-margin-top (see global.css), so a tap here, a shared
    // link and a focus scroll all land identically. Measuring the bar here was
    // wrong on mobile anyway: setMenuOpen is asynchronous, so offsetHeight
    // still returned the open menu's full stacked height.
    //
    // On mobile the scroll also has to wait for that menu to actually collapse.
    // Closing it removes roughly 390px from the top of the document, and a
    // scroll aimed before the collapse lands that far past the section. Two
    // frames: one for React to commit the closed menu, one for layout to
    // settle at the new height.
    const go = () => target.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
    if (wasOpen) requestAnimationFrame(() => requestAnimationFrame(go));
    else go();
  };

  return (
    <nav className="nav" aria-label="Primary" ref={navRef}>
      <div className="nav-inner canvas">
        <a href="#about" className="nav-logo" onClick={(e) => onClick(e, '#about')}><Mark label="Chris Wang, home" /></a>
        {/* No role on this wrapper: it sits inside <nav aria-label="Primary">,
            and a second role="navigation" here published an extra, unnamed
            navigation landmark that a screen reader's landmark list showed as a
            duplicate of the one around it. */}
        <div className={`nav-links${menuOpen ? ' open' : ''}`} id="nav-links">
          {NAV_LINKS.map((l) => {
            const isActive = !l.external && active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                className={navLinkClass(l, isActive)}
                aria-current={isActive ? 'true' : undefined}
                onClick={(e) => onClick(e, l.href)}
              >
                {l.label}
              </a>
            );
          })}
        </div>
        <button
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
