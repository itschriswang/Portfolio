// The passphrase gate on the drafts at /lab/ and on the four tool pages it
// indexes (/targets/, /fashion/, /super/ with /super/method/, and /grid/).
//
// Since November 2026 the drafts are not in the production build at all
// (vite.config.js), so on the live site there is nothing behind this gate. It
// still runs in `npm run dev` and in a BUILD_DRAFTS=1 build.
//
// What this is, plainly: those tools are not finished enough to put in front of
// a visitor, so they are unlinked from the site, kept out of the sitemap,
// marked noindex, and asked for a passphrase before they render. That hides
// them from anyone browsing or searching. It is not a lock. The site is a
// static build on GitHub Pages with no server to check anything, this file
// ships to the browser like the rest of the bundle, and the repository behind
// the site is public, so the pages are still there for anyone who has the URL
// and the will to look. Nothing here should be treated as private in the way a
// password on a server would make it private.
//
// To change the passphrase, hash the new one and paste the result below:
//
//   printf '%s' 'the new passphrase' | sha256sum
//
// Changing it invalidates every browser already let in, because what is stored
// is the hash that was accepted and it is checked against this one on the way
// back in.
export const PASSPHRASE_HASH = 'd2f4d1ebcc0fe4408e7c1ee22831e95299bd4afdc9328669d161baa8a89d0bd9';

const KEY = 'cw-lab-unlocked';
// Long enough not to be retyped every visit, short enough that a borrowed
// laptop does not stay open forever.
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

// Case and surrounding space are not the secret, so they are not part of it.
const normalise = (input) => String(input == null ? '' : input).trim().toLowerCase();

async function sha256Hex(text) {
  // crypto.subtle exists on https and on localhost, which covers the deployed
  // site and local development. Opened from the file system it does not, and
  // there is no honest way to check the passphrase without it.
  if (!globalThis.crypto?.subtle) return null;
  const bytes = new TextEncoder().encode(text);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// null means the browser could not tell us, which the caller reports as such
// rather than as a wrong passphrase.
export async function unlock(input) {
  const hash = await sha256Hex(normalise(input));
  if (hash == null) return null;
  if (hash !== PASSPHRASE_HASH) return false;
  try {
    localStorage.setItem(KEY, JSON.stringify({ hash, at: Date.now() }));
  } catch {
    // Private browsing with storage refused: this visit still gets through,
    // the next one asks again.
  }
  return true;
}

export function isUnlocked() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    const { hash, at } = JSON.parse(raw);
    return hash === PASSPHRASE_HASH && typeof at === 'number' && Date.now() - at < TTL_MS;
  } catch {
    return false;
  }
}

export function lock() {
  try { localStorage.removeItem(KEY); } catch { /* nothing stored to clear */ }
}
