// The check-in reminder: a calendar file for the day after next year's audit
// window closes, listing the changes the visitor switched on. Nothing is sent
// anywhere; the file is built here and handed to the browser to save, and any
// calendar app can open it.
//
// buildReminderIcs is pure (RFC 5545 text, CRLF line endings, escaped and
// folded), so the suite can check the file without a browser.

const pad = (n) => String(n).padStart(2, '0');

// The day after the same window closes a year later: when this year's audit
// rolls over and the next one has a full twelve months to show.
export function reminderDate(periodEndIso) {
  const [y, m, d] = periodEndIso.split('-').map(Number);
  const dt = new Date(Date.UTC(y + 1, m - 1, d));
  // 29 February has no twin next year; Date rolls it to 1 March, which is
  // already the day after the window, so no extra day is added then.
  if (dt.getUTCMonth() === m - 1) dt.setUTCDate(dt.getUTCDate() + 1);
  return dt.getUTCFullYear() + '-' + pad(dt.getUTCMonth() + 1) + '-' + pad(dt.getUTCDate());
}

const basicDate = (iso) => iso.replace(/-/g, '');
const nextDay = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + 1));
  return dt.getUTCFullYear() + pad(dt.getUTCMonth() + 1) + pad(dt.getUTCDate());
};

// Text values escape backslash, semicolon, comma and newline (RFC 5545 3.3.11).
const esc = (v) => String(v)
  .replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

// Content lines fold at 75 octets, continuing on a line that opens with a
// space (RFC 5545 3.1). Counted in UTF-8 bytes, never splitting a character.
function fold(line) {
  const out = [];
  let cur = '';
  let bytes = 0;
  for (const ch of line) {
    const b = new TextEncoder().encode(ch).length;
    const limit = out.length ? 74 : 75;
    if (bytes + b > limit) {
      out.push(cur);
      cur = '';
      bytes = 0;
    }
    cur += ch;
    bytes += b;
  }
  out.push(cur);
  return out.join('\r\n ');
}

export function buildReminderIcs({ date, title, description, url, uid, stamp }) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//itschriswang.com//Life Footprint//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:' + uid,
    'DTSTAMP:' + stamp,
    'DTSTART;VALUE=DATE:' + basicDate(date),
    'DTEND;VALUE=DATE:' + nextDay(date),
    'SUMMARY:' + esc(title),
    'DESCRIPTION:' + esc(description),
    ...(url ? ['URL:' + url] : []),
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

// UTC timestamp in the basic format DTSTAMP wants: 20260703T091500Z.
export const icsStamp = (d = new Date()) =>
  d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate())
  + 'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + 'Z';
