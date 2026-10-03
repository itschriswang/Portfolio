// Persistence and portability. Everything is client-side by design: the
// visitor's audit lives in their own localStorage, never leaves the device,
// and can be exported to a JSON file they control. The privacy model
// is the feature, not the fallback.

const KEY = 'cw-footprint-v1';

// Schema history: cw-footprint/1 was single-year; /2 adds pastYears (closed
// reporting periods, archived verbatim). Old saves migrate on read; nothing
// in a v1 profile is rewritten.
const migrate = (p) => {
  if (!p || !Array.isArray(p.entries)) return null;
  if (p.schema === 'cw-footprint/2') {
    return Array.isArray(p.pastYears) ? p : { ...p, pastYears: [] };
  }
  if (p.schema === 'cw-footprint/1') {
    return { ...p, schema: 'cw-footprint/2', pastYears: [] };
  }
  return null;
};

export function loadOwnProfile() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const p = migrate(parsed);
    // A save written by a newer schema than this bundle knows (plausible on
    // GitHub Pages, where a cached old bundle can outlive a deploy) must not
    // be clobbered by the fresh profile the app would then create: park the
    // raw payload under a backup key before treating it as absent.
    if (!p && parsed && typeof parsed.schema === 'string' && parsed.schema.startsWith('cw-footprint/')) {
      window.localStorage.setItem(KEY + '-unrecognised-backup', raw);
    }
    return p;
  } catch {
    return null;
  }
}

export function saveOwnProfile(profile) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(profile));
    return true;
  } catch {
    return false; // private browsing or quota; the session still works in memory
  }
}

export function clearOwnProfile() {
  try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
}

// ---- Story flag -------------------------------------------------------------
// Whether this browser has watched the reveal story. Separate key so the
// audit store above stays exactly as it is; returning visitors land on the
// dashboard and can replay the story on demand.

const STORY_KEY = 'cw-footprint-story-v1';

export function storySeen() {
  try { return window.localStorage.getItem(STORY_KEY) === 'seen'; } catch { return false; }
}

export function markStorySeen() {
  try { window.localStorage.setItem(STORY_KEY, 'seen'); } catch { /* session-only */ }
}

// A friend's shared summary, kept so it can be overlaid on the visitor's own
// dashboard after they run their audit. Only what the link itself carried
// (total and top categories); cleared on request.

const FRIEND_KEY = 'cw-footprint-friend-v1';

export function loadFriend() {
  try {
    const s = JSON.parse(window.localStorage.getItem(FRIEND_KEY) || 'null');
    return s && Number.isFinite(s.total) && Array.isArray(s.cats) ? s : null;
  } catch {
    return null;
  }
}

export function saveFriend(snapshot) {
  try {
    if (snapshot) window.localStorage.setItem(FRIEND_KEY, JSON.stringify(snapshot));
    else window.localStorage.removeItem(FRIEND_KEY);
  } catch { /* session-only */ }
}

// ---- Export / import -------------------------------------------------------

export function exportProfile(profile) {
  const payload = { ...profile, exported_at: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'my-carbon-footprint-' + payload.period.label.toLowerCase() + '.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Entries from a file are numerically sanitised before the engine sees them:
// a string or missing tco2e would otherwise turn every aggregate into NaN or
// string concatenation. Entries with no usable date are dropped; values are
// coerced to finite numbers.
const numOr0 = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const sanitiseEntry = (e) => {
  if (!e || typeof e !== 'object' || typeof e.date !== 'string' || typeof e.category !== 'string') return null;
  return {
    ...e,
    tco2e: numOr0(e.tco2e),
    period_months: numOr0(e.period_months),
    components: Array.isArray(e.components)
      ? e.components.map((c) => ({ scope: String((c && c.scope) || '3'), tco2e: numOr0(c && c.tco2e) }))
      : undefined,
  };
};
const sanitiseEntries = (list) => list.map(sanitiseEntry).filter(Boolean);

export function parseImported(text) {
  const p = JSON.parse(text);
  if (!p || (p.schema !== 'cw-footprint/1' && p.schema !== 'cw-footprint/2')) throw new Error('Not a footprint export file.');
  if (!Array.isArray(p.entries) || !p.period || !p.settings) throw new Error('File is missing entries, period or settings.');
  return {
    schema: 'cw-footprint/2',
    kind: 'own',
    settings: p.settings,
    period: p.period,
    entries: sanitiseEntries(p.entries),
    plan: p.plan && Array.isArray(p.plan.enabled) ? p.plan : { enabled: [] },
    ...(Number.isFinite(p.guess) ? { guess: p.guess } : {}),
    pastYears: Array.isArray(p.pastYears)
      ? p.pastYears
        .filter((y) => y && y.label && y.start && y.end && Array.isArray(y.entries))
        .map((y) => ({ ...y, entries: sanitiseEntries(y.entries) }))
      : [],
  };
}

// ---- Shareable snapshot -----------------------------------------------------
// A summary only (totals, category split, plan headline): the raw log never
// travels. Encoded base64url into the fragment so it is never sent to any
// server, GitHub Pages included.

export function encodeSnapshot(summary) {
  const json = JSON.stringify(summary);
  const b64 = btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const url = new URL(window.location.href);
  url.hash = 's=' + b64;
  return url.toString();
}

export function decodeSnapshot() {
  try {
    const m = window.location.hash.match(/^#s=([A-Za-z0-9_-]+)/);
    if (!m) return null;
    const b64 = m[1].replace(/-/g, '+').replace(/_/g, '/');
    const s = JSON.parse(decodeURIComponent(escape(atob(b64))));
    if (!Number.isFinite(s.total) || !Array.isArray(s.cats)) return null;
    // A crafted link must render labels and numbers, not NaN tiles.
    s.cats = s.cats.filter((c) => Array.isArray(c) && typeof c[0] === 'string' && Number.isFinite(c[1]));
    return s;
  } catch {
    return null;
  }
}
