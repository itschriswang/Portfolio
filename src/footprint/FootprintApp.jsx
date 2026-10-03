import { useCallback, useMemo, useRef, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { Grain, ScrollProgress, SkipLink, useStickyBarHeight } from '../components/Chrome';
import Aurora from '../components/Aurora';
import ContourField from '../components/ContourField';
import SplitText from '../components/SplitText';
import { buildSeedProfile, SEED_SETTINGS } from './data/seedProfile';
import { INTRO, MODE, PLAN, SHARE, FRIEND, DATA_CTRL, TOASTS, YEARS, METHOD_LINK, fmtT, listOf } from './data/copy';
import { DASH_EXTRA, fill } from './data/storyCopy';
import { CATEGORIES, categoryById } from './data/factors';
import { CHARACTERS, classifyCharacter } from './data/characters';
import CarbonField, { EmblemDots } from './story/CarbonField';
import { CountUp } from './story/CountUp';
import { lighten } from './lib/emblem';
import { aggregate, projectPathway, maccData, rolloverProfile } from './lib/engine';
import {
  loadOwnProfile, saveOwnProfile, clearOwnProfile, exportProfile, parseImported,
  encodeSnapshot, decodeSnapshot, storySeen, markStorySeen, loadFriend, saveFriend,
} from './lib/store';
import { prefersReducedMotion } from '../utils/media';
import { copyText } from '../utils/clipboard';
import CopyButton from '../components/CopyButton';
import Story from './story/Story';
import Dashboard from './Dashboard';
import Plan from './Plan';
import Onboarding from './Onboarding';
import { FootprintNav } from './Nav';
import Icon from '../components/Icons';
import SiteFooter from '../components/SiteFooter';

// Local date, never toISOString: UTC lands on yesterday in Australian zones.
const todayIso = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

// Compact pointer to the basis of preparation page: the method itself, with
// its factor tables, lives at method/ rather than weighing down this page.
function MethodLink() {
  return (
    <section id="fp-methodlink">
      <div className="canvas">
        <div className="sec-tag" data-idx="03 / "><Icon name="book" size={32} />How it works</div>
        <h2 className="display fp-h2"><SplitText text={METHOD_LINK.title[0]} /> <SplitText text={METHOD_LINK.title[1]} accentIndex={1} /></h2>
        <p className="fp-sub">{METHOD_LINK.body}</p>
        <div className="fp-ctrl-row">
          <a className="btn btn-primary fp-btn" href="method/">{METHOD_LINK.cta} →</a>
        </div>
        <p className="fp-note">{METHOD_LINK.factorLine}</p>
      </div>
    </section>
  );
}

// A compact "your data" strip for someone viewing their own footprint: export
// a backup, restore one, or delete it. No per-item log is ever shown; the raw
// entries stay in the browser.
function DataControls({ onExport, onImportFile, onReset, onShare }) {
  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { onImportFile(parseImported(String(reader.result))); }
      catch { window.alert(DATA_CTRL.importError); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };
  return (
    <section id="fp-data" aria-label={DATA_CTRL.title}>
      <div className="canvas">
        <div className="fp-data-card">
          <div className="fp-card-head">{DATA_CTRL.title}</div>
          <p className="fp-card-sub">{DATA_CTRL.body}</p>
          <div className="fp-ctrl-row">
            <CopyButton className="fp-linkbtn" label={DATA_CTRL.share} onCopy={onShare} iconSize={14} />
            <button type="button" className="fp-linkbtn" onClick={onExport}>{DATA_CTRL.export}</button>
            <label className="fp-linkbtn fp-import-label">
              {DATA_CTRL.import}
              <input type="file" accept="application/json,.json" onChange={onFile} className="sr-only" />
            </label>
            <button type="button" className="fp-linkbtn danger" onClick={onReset}>{DATA_CTRL.reset}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function FootprintApp() {
  const seed = useMemo(() => buildSeedProfile(), []);
  const [own, setOwn] = useState(() => loadOwnProfile());
  const [mode, setMode] = useState(own ? 'mine' : 'example');
  const [seedPlanEnabled, setSeedPlanEnabled] = useState(seed.plan.enabled);
  const [onboarding, setOnboarding] = useState(false);
  const [toast, setToast] = useState('');
  const [snapshot, setSnapshot] = useState(() => decodeSnapshot());
  // A shared link stays available as a dashboard overlay after the banner is
  // dismissed: comparing with someone you know beats a national average.
  const [friend, setFriend] = useState(() => {
    const s = decodeSnapshot();
    if (s) { saveFriend(s); return s; }
    return loadFriend();
  });
  // The reveal story opens for first-time visitors; shared-snapshot links and
  // returning visitors land straight on the dashboard.
  const [storyOpen, setStoryOpen] = useState(() => !decodeSnapshot() && !storySeen());
  // Which closed year is on screen; null means the open year.
  const [pastIdx, setPastIdx] = useState(null);

  // What this page pins at top:0: the mode bar always, and the site nav over it
  // once the reveal story is behind us. --fp-chrome-h is the taller of the two,
  // which is the headroom the planner's readout pins under. Re-measured when
  // the story closes, because that is when the nav arrives.
  useStickyBarHeight(['.nav', '.fp-modebar'], '--fp-chrome-h', { watch: storyOpen });

  const isExample = !(mode === 'mine' && own);
  const pastYear = !isExample && pastIdx != null ? (own.pastYears || [])[pastIdx] : null;
  const archived = !!pastYear;
  const profile = isExample
    ? { ...seed, plan: { ...seed.plan, enabled: seedPlanEnabled } }
    : archived
      ? {
        ...own,
        settings: pastYear.settingsAtClose || own.settings,
        period: { label: pastYear.label, start: pastYear.start, end: pastYear.end },
        entries: pastYear.entries,
        plan: pastYear.plan || { enabled: [] },
      }
      : own;
  const voice = isExample ? 'example' : 'own';
  // The open year is due to close once today passes its end date.
  const rolloverDue = !isExample && !archived && todayIso() > own.period.end;

  const agg = useMemo(() => aggregate(profile), [profile]);
  const macc = useMemo(() => maccData(profile, agg), [profile, agg]);
  const pathway = useMemo(() => projectPathway(profile, agg), [profile, agg]);
  // The audit not currently on screen, aggregated for the comparison overlay.
  // A closed year compares against the open one (year over year); the open
  // year compares against the worked example, and vice versa.
  // The quick path never asks about the building or the roof, so it assumes a
  // flat and rooftop solar and gas electrification never reach the plan. Rather
  // than spend two questions of a one-minute path on it, the correction is
  // offered here, next to the greyed-out cards it would unlock. Computed by
  // re-running the curve as a house, so the nudge only appears when answering
  // would genuinely change something: no gas and no meter, no nudge.
  const dwellingNudge = useMemo(() => {
    if (isExample || archived || !own || !own.settings.dwellingAssumed) return null;
    const asHouse = { ...own, settings: { ...own.settings, dwelling: 'house', roofOwn: true } };
    const unlocked = maccData(asHouse, agg)
      .filter((r) => r.applicable && r.reduction > 0.05)
      .filter((r) => !(macc.find((m) => m.id === r.id) || {}).applicable);
    return unlocked.length ? { actions: unlocked.map((r) => r.action) } : null;
  }, [isExample, archived, own, agg, macc]);

  const compareAgg = useMemo(() => {
    if (archived) return aggregate(own);
    return own ? aggregate(isExample ? own : seed) : null;
  }, [own, isExample, seed, archived]);
  const comparePeriod = archived ? own.period : (own ? (isExample ? own.period : seed.period) : null);

  // The overlays the category card offers: the other audit (year over year,
  // or own against the example), and a shared link when there is one. A
  // link carries category labels, mapped back to ids here.
  const compares = useMemo(() => {
    const list = [];
    if (compareAgg) {
      list.push({
        id: 'audit',
        label: isExample ? DASH_EXTRA.compare.vsOwn : DASH_EXTRA.compare.vsExample,
        agg: compareAgg,
        period: comparePeriod,
      });
    }
    if (friend) {
      const byCategory = {};
      for (const [label, t] of friend.cats) {
        const c = CATEGORIES.find((x) => x.label === label);
        if (c) byCategory[c.id] = t;
      }
      list.push({
        id: 'friend',
        label: fill(FRIEND.overlay, { who: friend.name ? friend.name + "'s " : FRIEND.someone, label: friend.label || '' }).trim(),
        agg: { total: friend.total, byCategory },
        period: { label: (friend.name ? friend.name + "'s " : '') + (friend.label || '') },
        note: FRIEND.note,
        onForget: () => { saveFriend(null); setFriend(null); },
        forgetLabel: FRIEND.forget,
      });
    }
    return list;
  }, [compareAgg, comparePeriod, isExample, friend]);

  // The guess, kept on the open audit so next year's lock-in can say how it
  // went. Only a visitor's own open year records one.
  const onGuessLock = (g) => {
    if (isExample || archived || !own) return;
    updateOwn((p) => ({ ...p, guess: g }));
  };
  const lastYear = useMemo(() => {
    if (isExample || archived || !own) return null;
    const past = (own.pastYears || [])[(own.pastYears || []).length - 1];
    if (!past || !Number.isFinite(past.guess)) return null;
    const total = past.entries
      .filter((e) => e.date >= past.start && e.date <= past.end)
      .reduce((t, e) => t + (e.tco2e || 0), 0);
    return { guess: past.guess, total };
  }, [isExample, archived, own]);

  const updateOwn = (fn) => {
    setOwn((p) => {
      const next = fn(p);
      saveOwnProfile(next);
      return next;
    });
  };

  // One timer for the toast: a second flash inside the first one's 3.5 s
  // would otherwise be blanked early by the stale timeout.
  const toastTimer = useRef(null);
  const flash = (msg) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 3500);
  };

  const onToggle = (id) => {
    if (isExample) {
      setSeedPlanEnabled((en) => (en.includes(id) ? en.filter((x) => x !== id) : [...en, id]));
    } else {
      updateOwn((p) => ({
        ...p,
        plan: { ...p.plan, enabled: p.plan.enabled.includes(id) ? p.plan.enabled.filter((x) => x !== id) : [...p.plan.enabled, id] },
      }));
    }
  };

  const onDwellingAnswer = (ownsRoof) => {
    updateOwn((p) => ({
      ...p,
      settings: {
        ...p.settings,
        dwellingAssumed: false,
        ...(ownsRoof ? { dwelling: 'house', roofOwn: true } : {}),
      },
    }));
    flash(ownsRoof
      ? fill(PLAN.dwellingNudge.added, { list: listOf(dwellingNudge ? dwellingNudge.actions : []) })
      : PLAN.dwellingNudge.dismissed);
  };

  const onExport = () => { exportProfile(own); };
  const onImportFile = (imported) => {
    saveOwnProfile(imported);
    setOwn(imported);
    setMode('mine');
    // The imported file may hold a different set of closed years than the
    // one on screen; never leave the view pointing at a stale index.
    setPastIdx(null);
    flash(TOASTS.backupImported);
  };
  // Sharing: ask whether to put a name on the shared page. A name makes the
  // title "[Name]'s FY2026 carbon emissions"; blank makes it "My ...", because
  // whoever opens the link is now looking at it as theirs to pass on.
  const onShare = async () => {
    const name = (window.prompt(fill(SHARE.namePrompt, { label: profile.period.label }), isExample ? SEED_NAME : '') || '').trim();
    const cats = Object.entries(agg.byCategory)
      .sort((a, b) => b[1] - a[1]).slice(0, 4)
      .map(([id, t]) => [categoryById(id).label, Math.round(t * 100) / 100]);
    const url = encodeSnapshot({
      v: 1, label: profile.period.label,
      name: name || undefined,
      total: Math.round(agg.total * 100) / 100,
      cats,
      // The character travels as its id only; the stencil and name resolve
      // locally on the other side, and old links without it still decode.
      ch: classifyCharacter(agg).id,
      plan: pathway.enabled.length,
      at2030: Math.round((pathway.plan[Math.max(0, pathway.years.indexOf(2030))] || 0) * 100) / 100,
    });
    // The button that called this confirms on itself. The toast is not a
    // second "copied": it is the one thing the button cannot say, which is
    // what the link does and does not carry.
    const ok = await copyText(url);
    if (ok) flash(TOASTS.shareCopied);
    else window.prompt(TOASTS.sharePrompt, url);
    return ok;
  };
  const onReset = () => {
    if (!window.confirm(DATA_CTRL.resetConfirm)) return;
    clearOwnProfile();
    setOwn(null);
    setMode('example');
    setPastIdx(null);
    flash(TOASTS.auditDeleted);
  };
  const SEED_NAME = SEED_SETTINGS.name;
  const onStart = () => setOnboarding(true);
  const onRollover = () => {
    const next = rolloverProfile(own, todayIso());
    saveOwnProfile(next);
    setOwn(next);
    setPastIdx(null);
    flash(fill(YEARS.rolledToast, { label: own.period.label, next: next.period.label }));
  };
  // The audit persists the moment it is built (the done pane says so), not
  // only when a closing button is pressed; Escape can no longer discard it.
  // Rebuilding on top of an existing audit keeps the closed years: starting
  // over is allowed, deleting history by accident is not.
  const onOnboardBuilt = useCallback((built) => {
    setOwn((prev) => {
      const merged = { ...built, pastYears: prev && prev.pastYears ? prev.pastYears : [] };
      saveOwnProfile(merged);
      return merged;
    });
    setMode('mine');
    setPastIdx(null);
  }, []);
  const onOnboardDone = (built, { watch } = {}) => {
    onOnboardBuilt(built);
    setOnboarding(false);
    if (watch) {
      setStoryOpen(true);
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      flash(TOASTS.auditLive);
      markStorySeen();
      setStoryOpen(false);
      window.setTimeout(() => document.getElementById('fp-dash')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' }), 60);
    }
  };

  const landOnDashboard = () => {
    window.setTimeout(() => document.getElementById('fp-dash')?.scrollIntoView({ behavior: 'auto' }), 50);
  };
  const onStorySkip = () => {
    markStorySeen();
    setStoryOpen(false);
    landOnDashboard();
  };
  // "Open the full plan" from the needle moment: the story has made its
  // point, so it closes properly and the page lands on the plan itself
  // instead of anchor-jumping over the sections in between.
  const onStoryPlan = () => {
    markStorySeen();
    setStoryOpen(false);
    window.setTimeout(() => {
      const el = document.getElementById('fp-plan');
      if (!el) return;
      el.scrollIntoView({ behavior: 'auto' });
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }, 50);
  };
  // "See the detail below" from the outro: the reveal ends, the page lands on
  // the working detail.
  const onStoryFinish = () => {
    markStorySeen();
    setStoryOpen(false);
    landOnDashboard();
  };
  const onStoryEnd = useCallback(() => { markStorySeen(); }, []);
  const onReplay = () => {
    setStoryOpen(true);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const dismissSnapshot = () => {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setSnapshot(null);
  };

  return (
    <MotionConfig reducedMotion="user">
      {/* While the guided audit is open, the whole page behind it is inert:
          declaratively, so a story remount mid-flow is covered too. */}
      <div inert={onboarding ? '' : undefined}>
      <SkipLink />
      <Grain />
      <ScrollProgress />

      {storyOpen && (
        <Story
          key={voice}
          profile={profile}
          agg={agg}
          macc={macc}
          voice={voice}
          onStart={onStart}
          onSkip={onStorySkip}
          onEnd={onStoryEnd}
          onFinish={onStoryFinish}
          onPlan={onStoryPlan}
          onCopyLink={onShare}
          onGuessLock={onGuessLock}
          lastYear={lastYear}
        />
      )}

      {/* The reveal carries its own chrome (home mark, skip, rail); the site
          nav would otherwise stick to the top the moment you scroll past the
          story, reappearing out of nowhere. It mounts once the story closes. */}
      {!storyOpen && <FootprintNav />}

      <main id="main-content">
        {snapshot && (() => {
          // A taste of the reveal, not a table: the recipient should feel the
          // toy for ten seconds, because that is what sells the click-through.
          const snapCats = (snapshot.cats || []).map(([label, t]) => ({
            label, t,
            hex: (CATEGORIES.find((c) => c.label === label) || {}).hex || '#6E7469',
          }));
          const snapChar = snapshot.ch ? CHARACTERS.find((c) => c.id === snapshot.ch) : null;
          return (
            <section className="fp-snaphero" aria-label="Shared snapshot">
              <CarbonField
                mode="swarm"
                total={snapshot.total}
                categories={snapCats.map((c) => ({ id: c.label, hex: c.hex, share: c.t }))}
                alpha={0.5}
                className="fp-snaphero-field"
              />
              <div className="canvas fp-snaphero-inner">
                <div className="sec-tag" data-idx="">{fill(SHARE.bannerTitle, { who: snapshot.name ? snapshot.name + "'s" : 'My', label: snapshot.label })}</div>
                <div className="fp-snaphero-num display">
                  <CountUp value={snapshot.total} decimals={1} duration={1.1} /><span> t CO₂-e</span>
                </div>
                {snapChar && (
                  <div className="fp-snaphero-char">
                    <EmblemDots stencil={snapChar.stencil} hex={lighten(snapChar.hex, 0.25)} size={44} />
                    <span>{SHARE.readsAs} <strong>{snapChar.name}</strong></span>
                  </div>
                )}
                <div className="fp-snaphero-cats" role="list">
                  {snapCats.map((c) => (
                    <span role="listitem" className="fp-snaphero-cat" key={c.label}>
                      <span className="fp-leg-dot" style={{ background: c.hex }} aria-hidden="true" />{c.label} · {fmtT(c.t)} t
                    </span>
                  ))}
                </div>
                <p className="fp-snaphero-body">{SHARE.bannerBody}</p>
                <p className="fp-snaphero-tease">{SHARE.tease}</p>
                <div className="fp-ctrl-row">
                  <button type="button" className="btn btn-primary fp-btn" onClick={() => { dismissSnapshot(); setOnboarding(true); }}>{SHARE.cta} →</button>
                  <button type="button" className="fp-linkbtn fp-snaphero-quiet" onClick={dismissSnapshot}>{SHARE.dismiss}</button>
                </div>
                <p className="fp-note fp-snaphero-note">{SHARE.provenance} <a href="method/">{SHARE.provenanceCta}</a></p>
              </div>
            </section>
          );
        })()}

        {!storyOpen && (
          <section id="fp-intro">
            <div className="bloom-wrap" aria-hidden="true"><div className="bloom bloom-a" /><div className="bloom bloom-b" /><div className="bloom bloom-c" /></div>
            <Aurora
              colorStops={['#635BFF', '#B5C42B', '#FF9500', '#FF3B60']}
              amplitude={0.55}
              blend={0.5}
              opacity={0.18}
            />
            <ContourField />
            <div className="canvas" style={{ position: 'relative', zIndex: 1 }}>
              <div className="sec-tag" data-idx="00 / "><Icon name="leaf" size={32} />{INTRO.tag}</div>
              <h1 className="fp-h1 display">
                <SplitText text={INTRO.h1a} /> <SplitText text={INTRO.h1b} accentIndex={1} />
              </h1>
              {INTRO.paras.map((p, i) => <p className="fp-intro-p" key={i}>{p}</p>)}
              <div className="fp-chips" role="list">
                {INTRO.chips.map((c) => <span className="fp-chip" role="listitem" key={c}>{c}</span>)}
              </div>
              <div className="fp-ctas">
                <button type="button" className="btn btn-primary fp-btn" onClick={onStart}>{INTRO.ctaStart} →</button>
                <a className="btn btn-secondary" href="#fp-dash">{INTRO.ctaExample}</a>
                <button type="button" className="fp-replay" onClick={onReplay}>▶ {DASH_EXTRA.replayChip}</button>
              </div>
              <span className="fp-disc">{INTRO.disc}</span>
            </div>
          </section>
        )}

        <div className="fp-modebar">
          <div className="canvas fp-modebar-inner">
            <span role="status">
              {isExample ? MODE.example : archived ? MODE.archived : MODE.mine}
              {!isExample && !archived && own.period.note && (
                <span className="fp-fresh"> {fill(YEARS.gapNote, { note: own.period.note })}</span>
              )}
            </span>
            <span className="fp-modebar-btns">
              {/* The switcher earns its place only once there are two audits
                  to switch between; a control that does nothing serves nobody. */}
              {own && (
                <>
                  <button type="button" className={'fp-mode-btn' + (!isExample ? ' on' : '')} onClick={() => setMode('mine')}>{MODE.switchToMine}</button>
                  <button type="button" className={'fp-mode-btn' + (isExample ? ' on' : '')} onClick={() => { setMode('example'); setPastIdx(null); }}>{MODE.switchToExample}</button>
                </>
              )}
              {own && !isExample && (own.pastYears || []).length > 0 && (
                <label className="fp-yearpick">
                  <span className="sr-only">{YEARS.switcherAria}</span>
                  <select
                    value={pastIdx == null ? 'current' : String(pastIdx)}
                    onChange={(e) => setPastIdx(e.target.value === 'current' ? null : Number(e.target.value))}
                  >
                    <option value="current">{own.period.label}</option>
                    {own.pastYears.map((y, i) => (
                      <option key={y.label + i} value={i}>{y.label}</option>
                    ))}
                  </select>
                </label>
              )}
              {!own && <button type="button" className="fp-mode-btn cta" onClick={onStart}>{MODE.startCta}</button>}
            </span>
          </div>
        </div>

        {rolloverDue && (
          <section className="fp-rollover" aria-label="Close the year">
            <div className="canvas">
              <div className="fp-roll-card">
                <div className="fp-card-head">{fill(YEARS.rollTitle, { label: own.period.label })}</div>
                <p className="fp-card-sub">{fill(YEARS.rollBody, { end: own.period.end })}</p>
                <button type="button" className="btn btn-primary fp-btn" onClick={onRollover}>
                  {fill(YEARS.rollCta, { label: own.period.label })} →
                </button>
              </div>
            </div>
          </section>
        )}
        {archived && (
          <div className="fp-archivebar">
            <div className="canvas">
              <span>{fill(YEARS.archiveNote, { closedAt: pastYear.closedAt || '', factorSet: pastYear.factorSetAtClose || '' })}</span>
              {profile.period.note && <span> {fill(YEARS.gapNote, { note: profile.period.note })}</span>}
            </div>
          </div>
        )}

        <Dashboard agg={agg} period={profile.period} compares={compares} country={profile.settings.country} />
        {!archived && (
          <Plan
            macc={macc} pathway={pathway} plan={profile.plan} onToggle={onToggle} voice={voice}
            dwellingNudge={dwellingNudge} onDwellingAnswer={onDwellingAnswer}
            periodEnd={isExample ? null : profile.period.end} total={agg.total}
          />
        )}
        {!isExample && !archived && (
          <DataControls onExport={onExport} onImportFile={onImportFile} onReset={onReset} onShare={onShare} />
        )}
        <MethodLink />
      </main>

      {/* One footer, one contentinfo landmark: the site footer carries the
          way home that the compact strip used to duplicate. */}
      <SiteFooter base="../" />
      </div>

      {onboarding && <Onboarding onDone={onOnboardDone} onBuilt={onOnboardBuilt} onCancel={() => setOnboarding(false)} />}
      {/* Mounted permanently so assistive tech announces text arriving in it. */}
      <div className={'fp-toast' + (toast ? ' show' : '')} role="status">{toast}</div>
    </MotionConfig>
  );
}
