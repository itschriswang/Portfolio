// Canvas share cards: every story moment can be saved as a 1080x1350 PNG
// composed for social. Drawn by hand on a dark brand surface; bars are
// single-hue matcha (magnitude, labelled in text) so the dark card needs no
// separate palette validation. Uses the Web Share API where it exists and
// falls back to a straight download.

import { SHARE_ST, CARD_TEXT, NEEDLE } from '../data/storyCopy';
import { BADGE } from '../data/characters';
import { drawEmblemDots, drawMark, lighten } from './emblem';

const W = 1080;
const H = 1350;
const INK = '#F4F6EE';
const MID = '#9AA694';
const MATCHA = '#B5C42B';
const BG = '#12120E'; // --night
const RULE = 'rgba(244,246,238,0.16)';

const DISP = '"Space Grotesk", sans-serif';
const MONO = '"JetBrains Mono", monospace';
const SANS = '"Inter", sans-serif';

async function ensureFonts() {
  if (!document.fonts || !document.fonts.load) return;
  try {
    await Promise.all([
      document.fonts.load(`700 300px ${DISP}`),
      document.fonts.load(`500 30px ${MONO}`),
      document.fonts.load(`400 34px ${SANS}`),
    ]);
  } catch { /* draw with fallbacks */ }
}

function roundedBar(ctx, x, y, w, h, r) {
  roundRectPath(ctx, x, y, w, h, r);
  ctx.fill();
}

// Path only: the caller fills, clips or strokes. Shared by the bars and the
// story-card frame that lifts a post card onto a 9:16 canvas.
function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function frame(ctx, title, fy) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);
  // A faint bloom in the top corner so the card is not flat black.
  const g = ctx.createRadialGradient(W * 0.85, -60, 0, W * 0.85, -60, 700);
  g.addColorStop(0, 'rgba(181,196,43,0.14)');
  g.addColorStop(1, 'rgba(181,196,43,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.textBaseline = 'alphabetic';
  drawMark(ctx, 97, 106, 13, MATCHA, 3.5);
  ctx.fillStyle = MID;
  ctx.font = `500 27px ${MONO}`;
  ctx.textAlign = 'right';
  ctx.fillText(fy.toUpperCase(), W - 84, 112);
  ctx.textAlign = 'left';
  ctx.letterSpacing = '6px';
  ctx.fillStyle = INK;
  ctx.font = `500 30px ${MONO}`;
  ctx.fillText(title, 84, 208);
  ctx.letterSpacing = '0px';
  ctx.strokeStyle = RULE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(84, 240);
  ctx.lineTo(W - 84, 240);
  ctx.stroke();
}

function footer(ctx) {
  ctx.strokeStyle = RULE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(84, H - 168);
  ctx.lineTo(W - 84, H - 168);
  ctx.stroke();
  ctx.fillStyle = MID;
  ctx.font = `400 26px ${SANS}`;
  ctx.fillText(SHARE_ST.method, 84, H - 108);
  ctx.fillStyle = MATCHA;
  ctx.font = `500 24px ${MONO}`;
  ctx.fillText(SHARE_ST.site, 84, H - 62);
}

function bigNumber(ctx, value, unit, y, size = 320) {
  ctx.fillStyle = INK;
  ctx.font = `700 ${size}px ${DISP}`;
  const num = String(value);
  ctx.fillText(num, 78, y);
  const w = ctx.measureText(num).width;
  ctx.fillStyle = MATCHA;
  ctx.font = `700 52px ${DISP}`;
  ctx.fillText(unit, 78 + w + 26, y - 14);
}

// Labelled matcha bars, widths proportional to the max value.
function bars(ctx, rows, top, opts = {}) {
  const { barH = 34, gap = 78, maxW = W - 168 - 260 } = opts;
  const max = Math.max(...rows.map((r) => r.t), 0.001);
  rows.forEach((r, i) => {
    const y = top + i * gap;
    ctx.fillStyle = INK;
    ctx.font = `600 30px ${SANS}`;
    ctx.fillText(r.label, 84, y);
    ctx.fillStyle = r.dim ? 'rgba(181,196,43,0.38)' : MATCHA;
    roundedBar(ctx, 84, y + 16, Math.max(10, (r.t / max) * maxW), barH, 5);
    ctx.fillStyle = MID;
    ctx.font = `500 28px ${MONO}`;
    ctx.textAlign = 'right';
    ctx.fillText(r.value ?? r.t.toFixed(1) + ' t', W - 84, y + 44);
    ctx.textAlign = 'left';
  });
}

function fitText(ctx, text, x, y, maxW, weight, family, startPx, minPx = 40) {
  let px = startPx;
  ctx.font = `${weight} ${px}px ${family}`;
  while (px > minPx && ctx.measureText(text).width > maxW) {
    px -= 4;
    ctx.font = `${weight} ${px}px ${family}`;
  }
  ctx.fillText(text, x, y);
  return px;
}

function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = text.split(' ');
  let line = '', yy = y;
  for (const w of words) {
    const probe = line ? line + ' ' + w : w;
    if (ctx.measureText(probe).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = w;
      yy += lineH;
    } else line = probe;
  }
  if (line) ctx.fillText(line, x, yy);
  return yy;
}

const PAINTERS = {
  character(ctx, d) {
    drawEmblemDots(ctx, d.stencil, { x: 84, y: 280, size: 380, color: d.hex });
    ctx.fillStyle = INK;
    ctx.font = `700 230px ${DISP}`;
    ctx.fillText(d.total, 520, 450);
    ctx.fillStyle = MID;
    ctx.font = `500 28px ${MONO}`;
    ctx.fillText(CARD_TEXT.tonnes + d.fy.toUpperCase(), 524, 510);
    if (d.badge) {
      drawEmblemDots(ctx, BADGE.stencil, { x: 524, y: 556, size: 64, color: lighten(BADGE.hex, 0.3) });
      ctx.fillStyle = MID;
      ctx.font = `500 26px ${MONO}`;
      ctx.fillText(BADGE.name.toUpperCase(), 608, 598);
    }
    ctx.fillStyle = INK;
    fitText(ctx, d.name, 78, 820, W - 156, 700, DISP, 96);
    ctx.fillStyle = d.hex;
    ctx.font = `600 40px ${DISP}`;
    ctx.fillText(d.tagline, 80, 884);
    // The three-axis read-out that produced the verdict.
    (d.axes || []).forEach((a, i) => {
      const y = 966 + i * 84;
      ctx.fillStyle = MID;
      ctx.font = `500 26px ${MONO}`;
      ctx.fillText(a.label.toUpperCase(), 84, y);
      ctx.fillStyle = 'rgba(244,246,238,0.12)';
      roundedBar(ctx, 300, y - 24, 440, 30, 5);
      ctx.fillStyle = d.hex;
      roundedBar(ctx, 300, y - 24, Math.max(14, a.frac * 440), 30, 5);
      ctx.fillStyle = INK;
      ctx.font = `600 30px ${SANS}`;
      ctx.fillText(a.level, 776, y + 1);
    });
  },
  total(ctx, d) {
    bigNumber(ctx, d.total, 't', 560);
    ctx.fillStyle = MID;
    ctx.font = `500 30px ${MONO}`;
    ctx.fillText(CARD_TEXT.tonnes + d.fy.toUpperCase(), 84, 622);
    bars(ctx, d.cats.slice(0, 5), 760);
  },
  hotspot(ctx, d) {
    ctx.fillStyle = MID;
    ctx.font = `500 34px ${MONO}`;
    ctx.fillText('№' + d.rank, 84, 360);
    ctx.fillStyle = INK;
    ctx.font = `700 120px ${DISP}`;
    ctx.fillText(d.label, 78, 480);
    bigNumber(ctx, d.t, 't', 850, 300);
    ctx.fillStyle = MATCHA;
    ctx.font = `500 32px ${MONO}`;
    ctx.fillText(d.pct + CARD_TEXT.ofYear, 84, 920);
    ctx.fillStyle = MID;
    ctx.font = `400 34px ${SANS}`;
    ctx.fillText(d.quip, 84, 1010);
  },
  bench(ctx, d) {
    bars(ctx, d.rows, 420, { gap: 150, barH: 44 });
    ctx.fillStyle = MID;
    ctx.font = `400 28px ${SANS}`;
    ctx.fillText(CARD_TEXT.benchNote, 84, 1080);
  },
  needle(ctx, d) {
    d.actions.slice(0, 3).forEach((a, i) => {
      const y = 430 + i * 220;
      ctx.fillStyle = MATCHA;
      ctx.font = `700 84px ${DISP}`;
      ctx.fillText('-' + a.pct + '%', 84, y);
      ctx.fillStyle = INK;
      ctx.font = `600 36px ${SANS}`;
      ctx.fillText(a.action, 84, y + 56);
      ctx.fillStyle = MID;
      ctx.font = `500 28px ${MONO}`;
      ctx.fillText(a.t + ' t/yr · ' + a.cost, 84, y + 104);
    });
    ctx.fillStyle = INK;
    ctx.font = `400 38px ${SANS}`;
    ctx.fillText(NEEDLE.punch, 84, 1120);
  },
};

export async function drawShareCard(kind, data) {
  await ensureFonts();
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  frame(ctx, data.title, data.fy);
  PAINTERS[kind](ctx, data);
  footer(ctx);
  return canvas;
}

// Instagram / TikTok story: 1080 x 1920 (9:16). The standard 4:5 post card is
// composed and then lifted onto the taller canvas as a floating card, so a
// single card design serves both the feed and the story.
const SW = 1080;
const SH = 1920;

export async function drawStoryCard(kind, data) {
  const card = await drawShareCard(kind, data);
  const canvas = document.createElement('canvas');
  canvas.width = SW;
  canvas.height = SH;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, SW, SH);
  const g = ctx.createRadialGradient(SW * 0.82, -90, 0, SW * 0.82, -90, 980);
  g.addColorStop(0, 'rgba(181,196,43,0.16)');
  g.addColorStop(1, 'rgba(181,196,43,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SW, SH);
  // A faint vignette at the foot so the card reads as lifted, not tiled.
  const v = ctx.createLinearGradient(0, SH * 0.6, 0, SH);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(0,0,0,0.28)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, SW, SH);

  const margin = 66;
  const cw = SW - margin * 2;
  const scale = cw / W;
  const ch = H * scale;
  const top = Math.round((SH - ch) / 2) + 24;
  const r = 44;

  ctx.save();
  roundRectPath(ctx, margin, top, cw, ch, r);
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 46;
  ctx.shadowOffsetY = 20;
  ctx.fillStyle = BG;
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRectPath(ctx, margin, top, cw, ch, r);
  ctx.clip();
  ctx.drawImage(card, margin, top, cw, ch);
  ctx.restore();

  ctx.save();
  roundRectPath(ctx, margin, top, cw, ch, r);
  ctx.strokeStyle = 'rgba(181,196,43,0.30)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  ctx.textBaseline = 'alphabetic';
  drawMark(ctx, margin + 13, top - 56, 13, MATCHA, 3.5);
  ctx.fillStyle = MID;
  ctx.font = `500 26px ${MONO}`;
  ctx.textAlign = 'right';
  ctx.fillText((data.fy || '').toUpperCase(), SW - margin, top - 44);
  ctx.textAlign = 'center';
  ctx.fillStyle = MID;
  ctx.font = `500 24px ${MONO}`;
  ctx.fillText(SHARE_ST.site, SW / 2, top + ch + 76);
  ctx.textAlign = 'left';
  return canvas;
}

// LinkedIn banner: 1200 x 627, the feed's native landscape ratio, so the
// card posts full-bleed with nothing cropped.
const LW = 1200;
const LH = 627;

export async function drawLinkedInCard(d) {
  await ensureFonts();
  const canvas = document.createElement('canvas');
  canvas.width = LW;
  canvas.height = LH;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, LW, LH);
  const g = ctx.createRadialGradient(LW * 0.9, -40, 0, LW * 0.9, -40, 620);
  g.addColorStop(0, 'rgba(181,196,43,0.16)');
  g.addColorStop(1, 'rgba(181,196,43,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, LW, LH);

  ctx.textBaseline = 'alphabetic';
  drawMark(ctx, 82, 55, 10, MATCHA, 2.7);
  ctx.letterSpacing = '5px';
  ctx.fillStyle = INK;
  ctx.font = `500 22px ${MONO}`;
  ctx.fillText(d.title, 128, 64);
  ctx.letterSpacing = '0px';
  ctx.fillStyle = MID;
  ctx.font = `500 22px ${MONO}`;
  ctx.textAlign = 'right';
  ctx.fillText(d.fy.toUpperCase(), LW - 72, 64);
  ctx.textAlign = 'left';
  ctx.strokeStyle = RULE;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(72, 92); ctx.lineTo(LW - 72, 92); ctx.stroke();

  drawEmblemDots(ctx, d.stencil, { x: 60, y: 128, size: 330, color: d.hex });

  ctx.fillStyle = INK;
  fitText(ctx, d.name, 428, 248, LW - 428 - 72, 700, DISP, 84);
  ctx.fillStyle = d.hex;
  ctx.font = `600 32px ${DISP}`;
  ctx.fillText(d.tagline, 430, 300);

  ctx.fillStyle = INK;
  ctx.font = `700 108px ${DISP}`;
  ctx.fillText(d.total + ' t', 428, 448);
  ctx.fillStyle = MID;
  ctx.font = `500 24px ${MONO}`;
  ctx.fillText(CARD_TEXT.tonnes.replace(' · ', '') + ', ' + CARD_TEXT.counted, 434, 490);
  if (d.mix) {
    ctx.fillStyle = MID;
    ctx.font = `500 24px ${MONO}`;
    ctx.fillText(d.mix, 434, 528);
  }
  if (d.badge) {
    drawEmblemDots(ctx, BADGE.stencil, { x: LW - 72 - 64, y: 420, size: 64, color: lighten(BADGE.hex, 0.3) });
    ctx.fillStyle = MID;
    ctx.font = `500 20px ${MONO}`;
    ctx.textAlign = 'right';
    ctx.fillText(BADGE.name.toUpperCase(), LW - 72, 516);
    ctx.textAlign = 'left';
  }

  ctx.beginPath(); ctx.moveTo(72, 556); ctx.lineTo(LW - 72, 556); ctx.stroke();
  // 18px keeps the method line and the site URL clear of each other at 1200 wide.
  ctx.fillStyle = MID;
  ctx.font = `400 18px ${SANS}`;
  ctx.fillText(SHARE_ST.method, 72, 596);
  ctx.fillStyle = MATCHA;
  ctx.font = `500 18px ${MONO}`;
  ctx.textAlign = 'right';
  ctx.fillText(SHARE_ST.site, LW - 72, 596);
  ctx.textAlign = 'left';
  return canvas;
}

// Whether the browser can hand a PNG file to the native share sheet (mobile
// Safari/Chrome). When true, "Share" reaches Instagram, LinkedIn and Messages
// directly; when false the sheet offers a straight download instead.
export function canShareImage() {
  try {
    const probe = new File([new Blob()], 'x.png', { type: 'image/png' });
    return !!(navigator.canShare && navigator.canShare({ files: [probe] }));
  } catch { return false; }
}

// Returns 'shared' | 'saved' | 'cancelled'. Tries the native share sheet first
// (so the user can pick Instagram Story / LinkedIn), and falls back to a
// download otherwise. The canonical page link rides beside the file so the
// shared post always leads back to the calculator.
export async function shareCanvas(canvas, filename, shareText) {
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
  if (!blob) return 'cancelled';
  const file = new File([blob], filename, { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        text: shareText || SHARE_ST.shareText,
        url: SHARE_ST.shareUrl,
      });
      return 'shared';
    } catch (err) {
      if (err && err.name === 'AbortError') return 'cancelled';
      // Fall through to a download on any other failure.
    }
  }
  return downloadBlob(blob, filename) ? 'saved' : 'cancelled';
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return true;
}

export async function downloadCanvas(canvas, filename) {
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
  return blob ? downloadBlob(blob, filename) : false;
}

// One entry point for the share sheet: draw the card at the requested format.
// 'post' is the 4:5 feed card, 'story' the 9:16 story frame, 'linkedin' the
// 1200x627 banner (its own data shape).
export async function renderShare(format, kind, data, linkedIn) {
  if (format === 'linkedin') return drawLinkedInCard(linkedIn);
  if (format === 'story') return drawStoryCard(kind, data);
  return drawShareCard(kind, data);
}
