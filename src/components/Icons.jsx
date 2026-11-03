// Hand-drawn icon set for the Life Footprint page.
//
// One visual language: round, slightly wobbly line art with a single matcha
// accent shape per icon (the brand hue, echoing the accent-fill highlights in
// the reference). Every glyph is drawn on a 32x32 grid with rounded caps and
// joins so it reads as friendly and hand-made rather than a stock pictogram.
//
// Icons are decorative. They sit beside a text label that already carries the
// meaning, so the <svg> is aria-hidden by default; pass a `title` only when an
// icon must stand alone as its own label.

// Shared frame. `stroke` is currentColor (inherits the ink of its context);
// accent shapes carry className="fpi-fill" and are painted matcha in CSS, so a
// single token change re-tints every icon at once.
function Glyph({ children, size = 24, className = '', title }) {
  return (
    <svg
      className={'fpi' + (className ? ' ' + className : '')}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

// --- Survey steps + big category glyphs -----------------------------------

// A cosy house with a round matcha window.
const house = (
  <>
    <path d="M5.5 15.6 L16 6 L26.5 15.6" />
    <path d="M8 14.4 V25.4 Q8 26 8.6 26 H23.4 Q24 26 24 25.4 V14.4" />
    <circle className="fpi-fill" cx="16" cy="19.2" r="3.1" />
  </>
);

// A lightning bolt, filled matcha.
const bolt = (
  <path className="fpi-fill" d="M17.6 4 L8.8 18.2 Q8.3 19 9.3 19 H14.4 L13 27.6 Q12.8 29 13.8 27.7 L23.4 13.7 Q23.9 12.9 22.9 12.9 H17.6 L18.6 4.6 Q18.7 3.3 17.6 4 Z" />
);

// A round little car with one matcha window.
const car = (
  <>
    <path d="M6 21.5 Q5 21.5 5 20 Q5 17.2 7.6 17 L9.7 11.9 Q10.2 10.5 11.6 10.5 H20.4 Q21.8 10.5 22.3 11.9 L24.4 17 Q27 17.2 27 20 Q27 21.5 26 21.5" />
    <path className="fpi-fill" d="M11.4 16.6 L12.7 12.6 Q12.9 12.2 13.4 12.2 H15.4 V16.6 Z" />
    <path d="M16.6 12.2 H18.4 Q18.9 12.2 19.1 12.6 L20.4 16.6 H16.6 Z" />
    <circle cx="10.5" cy="21.6" r="2.3" />
    <circle cx="21.5" cy="21.6" r="2.3" />
  </>
);

// A paper plane, near wing filled matcha.
const plane = (
  <>
    <path d="M28 5 L4.6 13.8 Q3.9 14.1 4.6 14.5 L13 17.4 L16.4 26 Q16.7 26.7 17.1 26 L28 5 Z" />
    <path className="fpi-fill" d="M28 5 L13 17.4 L16.4 26 Z" />
  </>
);

// A rounded bowl with a matcha leaf sprig.
const bowl = (
  <>
    <path d="M4.6 15.4 H27.4" />
    <path d="M6 15.4 Q6 25 16 25 Q26 25 26 15.4" />
    <path className="fpi-fill" d="M16 15 Q14.8 8.8 20.4 6.6 Q19.9 12.6 16 15 Z" />
    <path d="M16 15 Q16.6 11.6 19.4 8.8" />
  </>
);

// A four-point sparkle with two tiny companions.
const spark = (
  <>
    <path className="fpi-fill" d="M16 4 Q17 12.8 25.6 15 Q17 17.2 16 26 Q15 17.2 6.4 15 Q15 12.8 16 4 Z" />
    <circle className="fpi-fill" cx="25" cy="7" r="1.5" />
    <circle className="fpi-fill" cx="8" cy="24.2" r="1.2" />
  </>
);

// --- Survey field glyphs ---------------------------------------------------

// A map pin with a matcha hole.
const pin = (
  <>
    <path d="M16 27.5 Q8.8 19.4 8.8 13 Q8.8 6.4 16 6.4 Q23.2 6.4 23.2 13 Q23.2 19.4 16 27.5 Z" />
    <circle className="fpi-fill" cx="16" cy="12.7" r="3" />
  </>
);

// Two figures; the front one's head filled matcha.
const people = (
  <>
    <circle cx="20.8" cy="12.2" r="2.7" />
    <path d="M18 24.5 Q18.4 18.4 20.8 18.4 Q24.8 18.4 25.4 23.2" />
    <circle className="fpi-fill" cx="12.2" cy="11.4" r="3.2" />
    <path d="M6.6 24.5 Q6.6 16.8 12.2 16.8 Q17.8 16.8 17.8 24.5" />
  </>
);

// A little apartment block with one lit matcha window.
const building = (
  <>
    <path d="M6 27 H26" />
    <path d="M9 27 V9 Q9 7.8 10.2 7.8 H21.8 Q23 7.8 23 9 V27" />
    <rect className="fpi-fill" x="12" y="11.5" width="3.2" height="3.2" rx="0.6" />
    <path d="M17.4 13.1 H20" />
    <path d="M12 18.4 H20" />
    <path d="M12 22.4 H20" />
  </>
);

// A flame, filled matcha.
const flame = (
  <path className="fpi-fill" d="M16 27.4 Q8.8 25 8.8 18.6 Q8.8 13.4 14 8.4 Q13.4 13.6 16.6 13.4 Q16 9 19.2 5.6 Q18 12 21.4 15 Q23.2 16.8 23.2 20.2 Q23.2 25 16 27.4 Z" />
);

// A single leaf, filled matcha, with a drawn vein.
const leaf = (
  <>
    <path className="fpi-fill" d="M7.6 24.4 Q7.6 9.6 24.4 7.6 Q24.4 24.4 7.6 24.4 Z" />
    <path d="M8.6 23.4 Q15.4 16.6 23.2 8.8" stroke="var(--slate,#1f2a1e)" />
  </>
);

// A fuel pump with a matcha gauge window.
const fuel = (
  <>
    <path d="M6.5 27 H18.5" />
    <path d="M8 27 V11 Q8 9.4 9.6 9.4 H15.4 Q17 9.4 17 11 V27" />
    <rect className="fpi-fill" x="10" y="12" width="5" height="4" rx="0.6" />
    <path d="M17 14.5 H20 Q21.6 14.5 21.6 16.1 V21 Q21.6 22.6 23.2 22.6 Q24.8 22.6 24.8 21 V13.5 L22.4 10.6" />
  </>
);

// A phone with a matcha screen and a pinned dot.
const phone = (
  <>
    <rect x="9.6" y="4.5" width="12.8" height="23" rx="2.6" />
    <rect className="fpi-fill" x="11.6" y="7.4" width="8.8" height="13.6" rx="1" />
    <path d="M14.4 24.4 H17.6" stroke="currentColor" />
  </>
);

// A rounded bus with matcha windows.
const bus = (
  <>
    <path d="M7 22 V10 Q7 8 9 8 H23 Q25 8 25 10 V22 Q25 23 24 23 H8 Q7 23 7 22 Z" />
    <path d="M7 15 H25" />
    <rect className="fpi-fill" x="9.2" y="10.6" width="4" height="2.8" rx="0.5" />
    <path d="M15 10.6 H18.8" />
    <path d="M20.6 10.6 H22.8" />
    <circle cx="11" cy="25" r="1.7" />
    <circle cx="21" cy="25" r="1.7" />
  </>
);

// Fork and spoon; spoon bowl filled matcha.
const fork = (
  <>
    <path d="M11 15.2 V27" />
    <path d="M11 15.2 Q8.4 15.2 8.4 11.2 V5.4" />
    <path d="M11 15.2 Q13.6 15.2 13.6 11.2 V5.4" />
    <path d="M11 5.4 V11" />
    <path className="fpi-fill" d="M21 4.8 Q24.6 4.8 24.6 9.6 Q24.6 13.6 21 13.6 Q17.4 13.6 17.4 9.6 Q17.4 4.8 21 4.8 Z" />
    <path d="M21 13.6 V27" />
  </>
);

// A parcel with matcha tape.
const box = (
  <>
    <path d="M7 12 H25 V24.4 Q25 25 24.4 25 H7.6 Q7 25 7 24.4 Z" />
    <path d="M7 12 L16 6.6 L25 12" />
    <rect className="fpi-fill" x="14" y="12" width="4" height="13" />
    <path d="M16 6.6 V12" />
  </>
);

// A globe with a matcha destination dot.
const globe = (
  <>
    <circle cx="16" cy="16" r="10" />
    <path d="M6.2 16 H25.8" />
    <path d="M16 6 Q10 11 10 16 Q10 21 16 26 Q22 21 22 16 Q22 11 16 6 Z" />
    <path d="M8.4 10.4 Q16 13 23.6 10.4" />
    <path d="M8.4 21.6 Q16 19 23.6 21.6" />
    <circle className="fpi-fill" cx="22.4" cy="10.2" r="1.7" stroke="none" />
  </>
);

// A clock; centre dot filled matcha.
const clock = (
  <>
    <circle cx="16" cy="16" r="9.4" />
    <path d="M16 16 L16 10" />
    <path d="M16 16 L20.6 18.4" />
    <circle className="fpi-fill" cx="16" cy="16" r="1.5" stroke="none" />
  </>
);

// A shopping bag with a matcha tag.
const bag = (
  <>
    <path d="M8.5 12 H23.5 L24.6 25.4 Q24.7 26 24.1 26 H7.9 Q7.3 26 7.4 25.4 Z" />
    <path d="M12 12 V10 Q12 6.5 16 6.5 Q20 6.5 20 10 V12" />
    <rect className="fpi-fill" x="14.2" y="15.4" width="3.6" height="3.6" rx="0.7" />
  </>
);

// A bed with a matcha pillow.
const bed = (
  <>
    <path d="M5 12 V25" />
    <path d="M5 15.6 H23.4 Q26.5 15.6 26.5 18.7 V25" />
    <path d="M5 20.6 H26.5" />
    <path className="fpi-fill" d="M7.6 12.9 H13.2 Q13.8 12.9 13.8 13.5 V15.6 H7 V13.5 Q7 12.9 7.6 12.9 Z" />
    <path d="M5 25 V26.7" />
    <path d="M26.5 25 V26.7" />
  </>
);

// A coin stack with a matcha dollar face.
const coins = (
  <>
    <ellipse cx="12.5" cy="10.5" rx="6.4" ry="2.8" />
    <path d="M6.1 10.5 V14 Q6.1 16.8 12.5 16.8 Q18.9 16.8 18.9 14 V10.5" />
    <circle className="fpi-fill" cx="21" cy="20.6" r="6" />
    <path d="M21 17.7 V23.5" stroke="var(--slate,#1f2a1e)" strokeWidth="1.5" />
    <path d="M19.2 19.3 H22.8" stroke="var(--slate,#1f2a1e)" strokeWidth="1.2" />
    <path d="M19.2 21.9 H22.8" stroke="var(--slate,#1f2a1e)" strokeWidth="1.2" />
  </>
);

// A rubbish bin with a matcha handle on the lid.
const bin = (
  <>
    <path className="fpi-fill" d="M13 8 H19 V10.4 H13 Z" />
    <path d="M7.5 10.6 H24.5" />
    <path d="M9.4 10.6 L10.8 26 H21.2 L22.6 10.6" />
    <path d="M13.4 14.6 V22.4" />
    <path d="M16 14.6 V22.4" />
    <path d="M18.6 14.6 V22.4" />
  </>
);

// --- Section-header glyphs -------------------------------------------------

// A small bar chart; tallest bar filled matcha.
const chart = (
  <>
    <path d="M6 26 H27" />
    <path d="M9.5 26 V17" />
    <path className="fpi-fill" d="M14.6 26 V9 H18 V26 Z" stroke="none" />
    <path d="M14.6 26 V9 H18 V26" />
    <path d="M23 26 V13" />
  </>
);

// A target; centre filled matcha.
const target = (
  <>
    <circle cx="16" cy="16" r="10" />
    <circle cx="16" cy="16" r="5.6" />
    <circle className="fpi-fill" cx="16" cy="16" r="2" stroke="none" />
  </>
);

// A receipt / log page with a folded matcha corner.
const list = (
  <>
    <path d="M8 5.5 H19 L24 10.5 V26.5 H8 Z" />
    <path className="fpi-fill" d="M19 5.5 L24 10.5 H19 Z" />
    <path d="M11.5 15 H20.5" />
    <path d="M11.5 19 H20.5" />
    <path d="M11.5 23 H17" />
  </>
);

// An open book with a matcha ribbon.
const book = (
  <>
    <path d="M16 8.5 Q12 6 7 7 V24 Q12 23 16 25.5 Q20 23 25 24 V7 Q20 6 16 8.5 Z" />
    <path d="M16 8.5 V25.5" />
    <path className="fpi-fill" d="M20 6.4 H23 V13 L21.5 11.4 L20 13 Z" stroke="none" />
  </>
);

// --- Fashion / Cost Per Wear glyphs -----------------------------------------------

// A swing tag on its string, with a matcha punched hole.
const tag = (
  <>
    <path d="M13.2 10.6 L19.6 5.4 Q20.4 4.8 21.3 5.3 L26 8 Q26.9 8.5 26.8 9.5 L26 15 L15.4 27.2 Q14.7 28 13.9 27.3 L7.4 21.7 Q6.6 21 7.3 20.2 Z" transform="rotate(-8 16 16)" />
    <circle className="fpi-fill" cx="21.6" cy="10.2" r="1.9" />
    <path d="M21.6 10.2 Q24 5.5 20.5 3.4" />
  </>
);

// A tee with a matcha pocket square.
const shirt = (
  <>
    <path d="M11.3 6.6 Q13 9 16 9 Q19 9 20.7 6.6 L26.4 9.4 Q27.3 9.8 27 10.8 L25.3 15.2 Q25 16 24.1 15.8 L21.8 15.2 V25.4 Q21.8 26.4 20.8 26.4 H11.2 Q10.2 26.4 10.2 25.4 V15.2 L7.9 15.8 Q7 16 6.7 15.2 L5 10.8 Q4.7 9.8 5.6 9.4 Z" />
    <rect className="fpi-fill" x="16.8" y="17.6" width="3.4" height="3.9" rx="0.8" stroke="none" />
  </>
);

// Tailor's scissors, one matcha handle ring.
const scissors = (
  <>
    <path d="M13.1 15.1 L26 6.4" />
    <path d="M13.1 16.9 L26 25.6" />
    <circle cx="9.4" cy="11.5" r="3.4" />
    <circle className="fpi-fill" cx="9.4" cy="20.5" r="3.4" />
    <circle cx="14.6" cy="16" r="1.1" />
  </>
);

// A water drop with a matcha catchlight.
const drop = (
  <>
    <path d="M16 4.5 Q23.5 14 23.5 19.5 Q23.5 26.5 16 26.5 Q8.5 26.5 8.5 19.5 Q8.5 14 16 4.5 Z" />
    <path className="fpi-fill" d="M12.4 18.2 Q12 22.4 15 23.4 Q11.6 24.4 10.6 21 Q10.2 19.4 11 18.2 Z" stroke="none" />
  </>
);

// Two arrows closing a loop; one matcha arrowhead.
const loop = (
  <>
    <path d="M9.5 12.5 Q11 7.5 16 7.5 Q21.5 7.5 23.5 12.5" />
    <path d="M22.5 19.5 Q21 24.5 16 24.5 Q10.5 24.5 8.5 19.5" />
    <path d="M23.5 12.5 L26 8.5 M23.5 12.5 L19.5 11" />
    <path className="fpi-fill" d="M8.5 19.5 L5.6 23.2 L12.4 21.4 Z" stroke="none" />
  </>
);

// Two stacked sheets, the front one with a matcha dog-ear.
const copy = (
  <>
    <path d="M11.5 11.5 Q11.5 9.5 13.5 9.5 L23 9.5 Q25 9.5 25 11.5 L25 23 Q25 25 23 25 L13.5 25 Q11.5 25 11.5 23 Z" />
    <path d="M8.5 20.5 Q7 20.2 7 18.5 L7 9 Q7 7 9 7 L18.5 7 Q20.2 7 20.5 8.5" />
    <path className="fpi-fill" d="M21.4 9.6 L25 13.2 L25 11.5 Q25 9.6 23.1 9.5 Z" stroke="none" />
  </>
);

// A tick with a matcha dot tucked under the heel of the stroke.
const check = (
  <>
    <path d="M7.5 16.6 Q11.4 19.4 13.6 23.4 Q17.6 13.4 25 8.6" />
    <circle className="fpi-fill" cx="7.2" cy="22.6" r="2" stroke="none" />
  </>
);

// A desk calculator with a matcha readout. Stands for calculation and for the
// tools built on it, where the sparkle used to stand in.
const calc = (
  <>
    <path d="M10.4 4.8 H21.6 Q24 4.8 24 7.2 V24.8 Q24 27.2 21.6 27.2 H10.4 Q8 27.2 8 24.8 V7.2 Q8 4.8 10.4 4.8 Z" />
    <path className="fpi-fill" d="M12 8.4 H20 Q21 8.4 21 9.4 V11.8 Q21 12.8 20 12.8 H12 Q11 12.8 11 11.8 V9.4 Q11 8.4 12 8.4 Z" />
    <path d="M12 17.4 H12.1 M16 17.4 H16.1 M20 17.4 H20.1 M12 22.4 H12.1 M16 22.4 H16.1" strokeWidth="2.4" />
    <path d="M20 20.6 V24.2" strokeWidth="2.4" />
  </>
);

const GLYPHS = {
  house, bolt, car, plane, bowl, spark,
  pin, people, building, flame, leaf, fuel, phone, bus, fork, box, globe, clock,
  bag, bed, coins, bin,
  chart, target, list, book,
  tag, shirt, scissors, drop, loop,
  copy, check,
  calc,
};

// Public component: <Icon name="bolt" size={28} />. Unknown names render
// nothing rather than throwing, so a typo degrades to a plain label.
// LinkedIn wordmark, inlined so it inherits currentColor and needs no request.
// A real brand mark rather than hand-drawn line art, so it lives outside the
// Glyph()/GLYPHS system above but ships from the shared icon module.
export function LinkedInIcon() {
  return (
    <svg className="li-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.44-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.75V1.75C24 .78 23.2 0 22.22 0z"/>
    </svg>
  );
}

export default function Icon({ name, size = 24, className = '', title }) {
  const glyph = GLYPHS[name];
  if (!glyph) return null;
  return (
    <Glyph size={size} className={className} title={title}>
      {glyph}
    </Glyph>
  );
}

export { GLYPHS };
