// The twelve carbon characters, Wrapped-style: three measured axes, read
// straight off the audit, place every year in exactly one cell.
//
//   Weight  (3): featherweight / middleweight / heavyweight, split at the
//                6.6 t global average and 16 t (EDGAR-basis Australian
//                inventory including the land sink, cited in benchmarks.js).
//   Shape   (2): specialist (top wedge >= 40% of the total) / generalist.
//   Rhythm  (2): spiky (worst month >= 2x the average month) / steady.
//
// 3 x 2 x 2 = 12. The cell names the character; the dominant wedge flavours
// the reading but never changes it. An audit at or under the 2.5 t lifestyle
// budget also unlocks The Pacifist Run, whatever its cell.
//
// The names are pop-culture shapes of consumption, chosen so each column of
// the matrix reads as an escalating triplet: Rerun -> Season Ticket -> Grind
// (one thing, steadily), Side Quest -> Festival Season -> Crossover Event
// (everything, in bursts), Slice of Life -> Playlist -> Completionist
// (everything, steadily), with Speedrun / Cheat Day / World Tour up the
// one-thing-in-bursts column.
//
// Emblems are abstract dot stencils ('#' cells), one geometric idea per
// character rather than a literal icon: the double chevron is speed, the
// open loop is repetition, the seventh mark is the blowout, the full grid
// is 100%. The WebGL field morphs its particles into them; the same
// stencils draw the static badges and share cards, so the character looks
// identical everywhere.

import { BENCHMARKS } from './benchmarks';

const S = {
  // Speedrun: a double chevron, pure forward motion.
  chevrons: [
    '#.....#......',
    '##.....##....',
    '.##.....##...',
    '..##.....##..',
    '...##.....##.',
    '..##.....##..',
    '.##.....##...',
    '##.....##....',
    '#.....#......',
  ],
  // Rerun: an open loop, thickening where it comes back around.
  loop: [
    '....#####....',
    '..##.....##..',
    '.#.........#.',
    '#...........#',
    '#...........#',
    '#...........#',
    '.#.........#.',
    '..##.....###.',
    '....###......',
  ],
  // Side Quest: a dotted trail that wanders off the direct route.
  meander: [
    '.........####',
    '.......##....',
    '......#......',
    '......#......',
    '.......##....',
    '.........##..',
    '..........#..',
    '.........##..',
    '......###....',
    '...###.......',
    '.##..........',
    '##...........',
  ],
  // Slice of Life: a sparse, even field; everything present, nothing loud.
  field: [
    '#...#...#...#',
    '.............',
    '..#...#...#..',
    '.............',
    '#...#...#...#',
    '.............',
    '..#...#...#..',
    '.............',
    '#...#...#...#',
  ],
  // Cheat Day: six small marks of discipline, then the seventh.
  seventh: [
    '#.#.#.#.#.#..',
    '.............',
    '.............',
    '.......####..',
    '......######.',
    '......######.',
    '......######.',
    '.......####..',
  ],
  // Season Ticket: the same bar, over and over, with a perforation line.
  turnstile: [
    '#..#..#..#..#',
    '#..#..#..#..#',
    '#..#..#..#..#',
    '.............',
    '#..#..#..#..#',
    '#..#..#..#..#',
    '#..#..#..#..#',
  ],
  // Festival Season: a radial flare; everything, at once, from one point.
  flare: [
    '......#......',
    '..#...#...#..',
    '...#..#..#...',
    '....#.#.#....',
    '.....###.....',
    '..#########..',
    '.....###.....',
    '....#.#.#....',
    '...#..#..#...',
    '..#...#...#..',
    '......#......',
  ],
  // Playlist: offset bars of near-equal length; a tracklist on shuffle.
  shuffle: [
    '#########....',
    '.............',
    '....#########',
    '.............',
    '##########...',
    '.............',
    '...##########',
    '.............',
    '#######......',
  ],
  // World Tour: a globe crossed by dotted routes.
  orbit: [
    '....#####....',
    '..##.....##..',
    '.#.........#.',
    '#..#..#..#..#',
    '#...........#',
    '#..#..#..#..#',
    '.#.........#.',
    '..##.....##..',
    '....#####....',
  ],
  // The Grind: full bars laid down like strata, layer after layer.
  strata: [
    '#############',
    '.............',
    '#############',
    '.............',
    '#############',
    '.............',
    '#############',
    '.............',
    '#############',
  ],
  // Crossover Event: every line converging on a single point.
  converge: [
    '#.....#.....#',
    '.#....#....#.',
    '..#...#...#..',
    '...#..#..#...',
    '....#.#.#....',
    '.....###.....',
    '.....###.....',
    '......#......',
  ],
  // Completionist: the whole grid, every box filled.
  grid: [
    '##.##.##.##',
    '##.##.##.##',
    '...........',
    '##.##.##.##',
    '##.##.##.##',
    '...........',
    '##.##.##.##',
    '##.##.##.##',
  ],
  // Pacifist Run: a small core held inside the boundary.
  core: [
    '....#####....',
    '..##.....##..',
    '.#.........#.',
    '#.....#.....#',
    '#....###....#',
    '#.....#.....#',
    '.#.........#.',
    '..##.....##..',
    '....#####....',
  ],
};

// Axis thresholds. The benchmark lines are the published figures used
// everywhere on this page; HEAVY_T sits on the EDGAR-basis Australian
// inventory including the land sink (see benchmarks.js). The share and
// spike cut-offs are stated editorial rules: they decide which label an
// audit gets, never any number.
export const BUDGET_T = BENCHMARKS.find((b) => b.id === 'budget2030').tco2e;
export const GLOBAL_T = BENCHMARKS.find((b) => b.id === 'global').tco2e;
export const HEAVY_T = 16;
export const SPECIALIST_SHARE = 0.4;
export const SPIKE_MULTIPLE = 2;

// The Pacifist Run: not a cell but an unlock, carried by any audit at or
// under the 2.5 t lifestyle budget on top of whatever character it
// classifies as.
export const BADGE = {
  id: 'pacifist-run', name: 'The Pacifist Run', hex: '#75821D', stencil: S.core,
  tagline: 'Finished the year, harmed almost nothing.',
};

// The roster, one character per cell, ordered for the 3 x 4 matrix:
// weight rows (feather, middle, heavy) by temperament columns
// (specialist-spiky, specialist-steady, generalist-spiky, generalist-steady).
export const CHARACTERS = [
  {
    id: 'speedrun', name: 'The Speedrun', hex: '#B5C42B', stencil: S.chevrons,
    weight: 'feather', shape: 'specialist', rhythm: 'spiky',
    tagline: 'A tiny total, done in one burst.',
    line: 'Under the global average with almost nothing on the clock, and most of it happened in one go. One category, one big day, credits.',
  },
  {
    id: 'rerun', name: 'The Rerun', hex: '#75821D', stencil: S.loop,
    weight: 'feather', shape: 'specialist', rhythm: 'steady',
    tagline: 'The same quiet episode, all year.',
    line: 'One small habit on loop. Nothing new ever airs, which is exactly why the total stays small.',
  },
  {
    id: 'side-quest', name: 'The Side Quest', hex: '#0891B2', stencil: S.meander,
    weight: 'feather', shape: 'generalist', rhythm: 'spiky',
    tagline: 'Wandering everywhere, low stakes.',
    line: 'A light year spent drifting across the categories, with one detour that briefly became the main plot. Still nowhere near the main storyline.',
  },
  {
    id: 'slice-of-life', name: 'The Slice of Life', hex: '#B5C42B', stencil: S.field,
    weight: 'feather', shape: 'generalist', rhythm: 'steady',
    tagline: 'Everyday, gentle, counted in full.',
    line: 'The genre where nothing dramatic happens. A bit of everything, spread thin, observed closely and added up anyway.',
  },
  {
    id: 'cheat-day', name: 'The Cheat Day', hex: '#8A4FBE', stencil: S.seventh,
    weight: 'middle', shape: 'specialist', rhythm: 'spiky',
    tagline: 'Disciplined all week, undone in a day.',
    line: 'A careful, tidy ledger with a handful of days that ignored it completely. The everyday barely registers; the exceptions are the inventory.',
  },
  {
    id: 'season-ticket', name: 'The Season Ticket', hex: '#B56A00', stencil: S.turnstile,
    weight: 'middle', shape: 'specialist', rhythm: 'steady',
    tagline: 'The same seat, every single week.',
    line: 'One category on subscription: the commute, the meter, the standing order. The total is built by attendance, one ordinary day at a time.',
  },
  {
    id: 'festival-season', name: 'The Festival Season', hex: '#C7274A', stencil: S.flare,
    weight: 'middle', shape: 'generalist', rhythm: 'spiky',
    tagline: 'Everything happened in one loud stretch.',
    line: 'An ordinary spread of a year that concentrated into one hot window.',
  },
  {
    id: 'playlist', name: 'The Playlist', hex: '#6E7469', stencil: S.shuffle,
    weight: 'middle', shape: 'generalist', rhythm: 'steady',
    tagline: 'A bit of everything, on shuffle.',
    line: 'Evenly sampled across every category, no track dominating.',
  },
  {
    id: 'world-tour', name: 'The World Tour', hex: '#635BFF', stencil: S.orbit,
    weight: 'heavy', shape: 'specialist', rhythm: 'spiky',
    tagline: 'One act, huge, lived in departures.',
    line: 'A serious total from a single dominant mode, delivered as an event calendar. The quiet weeks barely register; the dates are the inventory.',
  },
  {
    id: 'grind', name: 'The Grind', hex: '#B56A00', stencil: S.strata,
    weight: 'heavy', shape: 'specialist', rhythm: 'steady',
    tagline: 'One loop, enormous hours.',
    line: 'A big total built the slow way: the same dominant category, week after week. Nothing ever spiked.',
  },
  {
    id: 'crossover-event', name: 'The Crossover Event', hex: '#C7274A', stencil: S.converge,
    weight: 'heavy', shape: 'generalist', rhythm: 'spiky',
    tagline: 'Every storyline converged at once.',
    line: 'Heavy across the board, then the stretch where everything showed up in the same frame.',
  },
  {
    id: 'completionist', name: 'The Completionist', hex: '#475569', stencil: S.grid,
    weight: 'heavy', shape: 'generalist', rhythm: 'steady',
    tagline: 'One hundred percent, in every category.',
    line: 'Every category maxed, steadily, all year. The one result nobody should chase. A single change will not undo it.',
  },
];

// Matrix layout helpers for the twelve-up grid.
export const WEIGHT_ROWS = ['feather', 'middle', 'heavy'];
export const TEMPERAMENT_COLS = [
  { shape: 'specialist', rhythm: 'spiky' },
  { shape: 'specialist', rhythm: 'steady' },
  { shape: 'generalist', rhythm: 'spiky' },
  { shape: 'generalist', rhythm: 'steady' },
];

// The dominant wedge flavours the reading: one line naming it, one hint
// that is actually actionable for that wedge.
export const WEDGE_FLAVOUR = {
  flight: 'The category that decides it: the flights.',
  road: 'The category that decides it: the kilometres.',
  home: 'The category that decides it: the home energy.',
  diet: 'The category that decides it: the food.',
  freight: 'The category that decides it: the parcels.',
  goods: 'The category that decides it: the things you buy.',
  none: '',
};
export const WEDGE_HINT = {
  flight: 'One fewer long-haul return does more than everything else combined.',
  road: 'Share the ride, shift to transport, then an EV, in that order.',
  home: 'Electrify the lot, then put solar over the new load.',
  diet: 'A bit less of the heaviest meals. Nobody is taking your dinner.',
  freight: 'Sea shipping cuts the freight roughly ninety percent.',
  goods: 'Buy less and keep it longer. The greenest gadget is the one you did not replace.',
  none: 'The biggest one or two categories decide most of the total.',
};

export const characterById = (id) => CHARACTERS.find((c) => c.id === id) || CHARACTERS[7];

const cellFor = (weight, shape, rhythm) =>
  CHARACTERS.find((c) => c.weight === weight && c.shape === shape && c.rhythm === rhythm);

// Classification. Reads the three axes off the aggregate and returns the
// matching cell plus the measured values, so the reveal can show the meters
// that produced the verdict rather than asserting it.
export function classifyCharacter(agg) {
  const total = agg.total || 0;

  // Nothing logged classifies as nothing: fall to the neutral cell with the
  // meters zeroed rather than crowning an empty audit.
  if (total <= 0.005) {
    return {
      ...characterById('playlist'),
      topShare: 0, topGroup: 'none', badge: false,
      flavour: '', hint: WEDGE_HINT.none,
      axes: {
        weight: { level: 'feather', total: 0 },
        shape: { level: 'generalist', topShare: 0, topGroup: 'none' },
        rhythm: { level: 'steady', spikeX: 0, worstT: 0 },
      },
    };
  }

  const share = (id) => (agg.byCategory[id] || 0) / total;
  const groups = [
    ['flight', share('flight')],
    ['road', share('road')],
    ['diet', share('diet')],
    ['freight', share('freight')],
    ['home', share('electricity') + share('gas') + share('other') + share('dwelling')],
    // The optional consumption basket, when it is switched on.
    ['goods', share('goods') + share('hotel')],
  ].sort((a, b) => b[1] - a[1]);
  const [topGroup, topShare] = groups[0];

  const weight = total <= GLOBAL_T ? 'feather' : total <= HEAVY_T ? 'middle' : 'heavy';
  const shape = topShare >= SPECIALIST_SHARE ? 'specialist' : 'generalist';

  // Rhythm: the worst month against the average month over the audit window.
  const monthCount = Math.max(1, (agg.months && agg.months.length) || 12);
  const meanMonth = total / monthCount;
  const worstT = (agg.worstMonth && agg.worstMonth.total) || 0;
  const spikeX = meanMonth > 0 ? worstT / meanMonth : 0;
  const rhythm = monthCount > 1 && spikeX >= SPIKE_MULTIPLE ? 'spiky' : 'steady';

  return {
    ...cellFor(weight, shape, rhythm),
    topShare: Math.round(topShare * 100),
    topGroup,
    badge: total <= BUDGET_T,
    flavour: WEDGE_FLAVOUR[topGroup] || WEDGE_FLAVOUR.none,
    hint: WEDGE_HINT[topGroup] || WEDGE_HINT.none,
    axes: {
      weight: { level: weight, total },
      shape: { level: shape, topShare, topGroup },
      rhythm: { level: rhythm, spikeX, worstT },
    },
  };
}
