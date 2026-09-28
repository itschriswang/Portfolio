# CLAUDE.md — Christopher Wang Portfolio

Editorial portfolio for Christopher Wang (Senior Sustainability Advisor),
built as a React + Vite multi-page app and deployed to GitHub Pages.

## Stack

- React 18 + Vite 5, `framer-motion` for motion, `chart.js` for the scenario
  model, `ogl` for the hero aurora (WebGL), plus a hand-written canvas renderer
  (contour field).
- Fonts are self-hosted from `@fontsource` (Space Grotesk, Inter, JetBrains
  Mono), imported once in `src/styles/fonts.css` with metric-matched Arial
  fallbacks. No page requests Google Fonts except the out-of-build `404.html`.
  Import only the weights already listed there: CSS asks for heavier weights
  that currently resolve to the nearest loaded face, and adding one changes
  how that text renders.
- Public pages: the main profile (`index.html` → `src/main.jsx` → `App.jsx`), a
  standalone work-samples page (`work/index.html` → `src/work/main.jsx`) at
  `/work/`, the Life Footprint dashboard (`footprint/index.html` →
  `src/footprint/main.jsx`) at `/footprint/`, and its basis of preparation
  (`footprint/method/index.html` → `src/footprint/method/main.jsx`) at
  `/footprint/method/`.
- Drafts, unlisted and behind a passphrase (see **The drafts** below): Target
  Tracker at `/targets/`, Cost Per Wear at `/fashion/`, Super Fund Holdings at
  `/super/` (methodology at `/super/method/`), Grid Intensity at `/grid/`,
  Australia's Climate Progress at `/progress/` and Sustainability Daily at
  `/daily/`, indexed only by `/lab/`.
- Every page has its entry html at the repo root and its source under
  `src/<page>/`.

## Layout

| Path | What lives here |
|---|---|
| `src/components/` | Main-page sections (Hero, Bio, Principles, Ticker, Scenario, Tools + its `ToolSpecimen` charts, Experience, Contact) plus the shared SiteFooter (big lime card with signup + link columns, used by the home and work pages), shared Chrome (nav, grain, scroll progress, skip link), the shared hand-drawn `Icons` set (round line art, one matcha accent shape per glyph, used beside sec-tags on every page), and the `Aurora` (WebGL) + `ContourField` (canvas) hero backdrops, mounted on the home, work, footprint and fashion intros. `ToolNav.jsx` carries the shared nav + compact footer for the standalone tool pages, all of them drafts now (`/grid/`, `/super/`, `/targets/`, `/fashion/`, `/progress/`, `/daily/`). `ToolCard.jsx` is the one tool tile, used by the home page's Tools band and by the drafts index. `Gate.jsx` is the passphrase screen in front of the drafts. Two shared controls sit alongside them: `Range.jsx` (every slider on the site, see the convention below) and `CopyButton.jsx` (every copy-to-clipboard action). |
| `src/work/` | Work-samples page: `WorkApp`, `Baseline`, `CaseStudy`, data in `workData.js`, styles in `work.css`. |
| `src/footprint/` | Life Footprint page: calculation engine and factor data in `lib/` and `data/` (keep rigorous; every factor cites its source), the Wrapped-style reveal in `story/` (WebGL carbon field, carbon characters, share cards), guided audit in `Onboarding.jsx`, dashboard sections alongside. Copy lives in `data/copy.js` and `data/storyCopy.js`. |
| `src/footprint/method/` | The basis of preparation page (`/footprint/method/`): the written method plus the live factor tables, rendered from the same factor set the engine prices from. |
| `src/fashion/` | Cost Per Wear (`/fashion/`): fashion brand transparency lookup. `FashionApp.jsx` holds the page spine: lookup, compare, the personal lens ("what you can't know": user-picked concerns read against a brand's disclosure statuses, never a brand ranking), directory, the ownership-map treemap in the dark spotlight band, the tabbed field guide (materials, certifications, regulation, claim check), the signals explainer, and the backlog with its dated change log. Between the directory and the field guide sits the Garment Studio (`Studio.jsx`: carbon footprint estimator with live CO2e particle streams, fabric comparator, supply chain mapper over the dot-matrix world map, circularity scorecard; all studio factors are indicative published-LCA estimates and the UI says so once, plainly). All brand data, studio factors, lens concerns, changelog and editorial copy in `data.js`, styles in `fashion.css` (layered on `global.css` tokens like the footprint pages), intent in `design-notes.md`. Every company shows its real logo via `BrandLogo` (walked through the keyless `LOGO_SOURCES` provider chain by `BRAND_DOMAIN` in `data.js`), with a generated woven-label monogram (`deriveMonogram`/`SEGMENT_STYLE`) as the automatic fallback. |
| `src/grid/` | Grid Intensity (`/grid/`): live NEM emissions-intensity view ("run it now or wait") plus the Scope 2 explorer (location-based vs market-based factors with GreenPower/PPA and LGC toggles). Copy and factors in `data.js`, styles in `grid.css` (`gi-` prefix). |
| `src/daily/` | Sustainability Daily (`/daily/`): two independent daily games, Guess the Footprint and Greenwash or Not, each with its own streak and share card. Puzzles rotate deterministically by date; results and streaks live in localStorage only. Item and claim pools with sources in `data.js`; the claim reasoning stays consistent with the Cost Per Wear claim checker. Styles in `daily.css` (`dy-` prefix). |
| `src/super/` | Super Fund Holdings (`/super/`): default (MySuper) option holdings and sector exposure next to each fund's own sustainability marketing, with flagged holdings named under stated criteria and a per-fund "last verified" date. Methodology on its own route (`/super/method/`, from the same data). All fund data and copy in `data.js`, styles in `super.css` (`sf-` prefix). |
| `src/progress/` | Australia's Climate Progress (`/progress/`): scroll-driven reveal of national numbers (grid mix, EV sales, capacity additions, emissions vs target), each with a reference point, ending on a progress-and-shortfall summary. Reviewed quarterly; the last-updated date renders from one field in `data.js`. Styles in `progress.css` (`pr-` prefix). |
| `src/targets/` | Target Tracker (`/targets/`): ASX50 net zero commitments plotted against reported Scope 1 and 2 emissions. Each company card draws the claimed path (baseline through absolute interim targets to the net zero year) as an SVG chart with the reported series overlaid, and carries a verification status (`sourced`/`partial`/`unverified`), flags (offsets, intensity, weakened, alliance exits) and per-company sources. Trajectory maths in `lib.js`; all company data and copy in `data.js`; in-page basis of preparation; last-updated date from one field in `data.js`. Styles in `targets.css` (`tt-` prefix). |
| `src/lab/` | The drafts index (`/lab/`): the six unpublished tools as the same `ToolCard` tiles the home page uses, behind `Gate`. Copy in `data.js`, page frame in `lab.css`; the tools themselves are `PRIVATE_TOOLS` in `src/data/content.js`. Unlisted, and nothing public links to it. |
| `src/lib/` | `opennem.js` — the one shared OpenNEM/AEMO client both `/grid/` and `/progress/` read (live NEM data with honest `{ live: false }` failure; callers must label fallbacks as estimates). `gate.js` — the passphrase check behind `/lab/` and the drafts, and the written record of what that gate is and is not. |
| `src/data/` | Content and model inputs: `content.js` (all editorial copy, including footer links, the public `TOOLS` index, the unlisted `PRIVATE_TOOLS` index and the gate's copy), `scenario.js` (decarbonisation model), `specimens.js` (the small slices of each tool's real data that the tool-card charts are drawn from). |
| `src/hooks/` | `useMagnetic` — cursor-follow interaction. |
| `src/utils/` | `media.js` — `prefersReducedMotion()` / `canHover()` guards. `clipboard.js` — the one `copyText()` helper, with the hidden-textarea fallback. |
| `src/styles/global.css` | Design tokens + all main-page styles. Imports `fonts.css` (the self-hosted faces and their fallbacks) first. |
| `public/` | Shared static assets (logos, favicon, `robots.txt`, `sitemap.xml`, and the Open Graph share cards: the profile card `og-image.png` plus one generated per-page card, `og-<page>.png`), plus `404.html` — hand-written, self-contained and outside the build, because GitHub Pages serves it for any unresolved path at any depth so it cannot use the relative asset paths the built pages rely on. Its tokens are a deliberate copy of the `:root` block in `global.css`, and its font fallbacks a copy of those in `fonts.css`. |
| `scripts/og/` | Share-thumbnail generator. `cards.mjs` (per-page copy and motifs), `draw.js` (the shared canvas renderer), `generate.mjs` (headless-Chromium harness). `npm run og:cards` writes the `og-*.png` cards into `public/`. Not part of the site build. |
| `tests/` | The engine's test suite, on Node's built-in runner with no test dependency added. `support/resolve-hook.mjs` lets Node read the app's extensionless imports as they are, so nothing in `src/` is shaped to suit the runner. Covers the pure layer only (`src/footprint/lib/` and `data/`), because Node cannot parse JSX. See `tests/README.md`. Not built or deployed. |
| `docs/` | Non-app material: `skill-reference/` and research source data. Not built or deployed. No personal or career material; see Personal material below. |

## Conventions

- **Design tokens** (colours, fonts, easing, z-index) live in `:root` in
  `global.css`. Neutrals are intentionally tinted toward the matcha brand hue at
  low chroma — do not "restore" cool-blue slate values; the green lean is
  deliberate and contrast is held to the original lightness, except `--mid`, darkened to oklch 0.50 in September 2026 so small text clears 4.5:1 on the tinted bands.
- **All editorial copy is data**, not JSX. Add or edit words in `src/data/`,
  never inline in components.
- **The basis of preparation stays in sync.** The footprint's method page
  (`/footprint/method/`, rendered from `METHOD` in `src/footprint/data/copy.js`
  by `src/footprint/Method.jsx`) is the written record of the model. Any change
  to the footprint engine, factors, abatement options, pathway or forecasting
  logic, boundary or exclusions must update the basis of preparation page in
  the same change. Titles across the site never end in a full stop.
- **Every fashion brand carries a logo.** In Cost Per Wear each company shows its
  real logo through the `BrandLogo` component (`src/fashion/FashionApp.jsx`),
  loaded at runtime by walking the ordered keyless provider chain
  `LOGO_SOURCES` in `src/fashion/data.js` (Google s2 favicons; the earlier
  DuckDuckGo provider was dropped because corporate web filters commonly block
  `icons.duckduckgo.com` as a proxy/anonymiser, which flagged the whole page),
  keyed by the brand's `BRAND_DOMAIN` entry. A load error moves to the next
  provider, and a tiny placeholder response (Google's generic globe) is
  detected by rendered size and treated as a miss. When a domain is missing
  or every provider misses, it falls back to a generated "woven-label" monogram
  (`deriveMonogram()` + `SEGMENT_STYLE`), so every brand always has a mark.
  When adding a brand: add its domain to `BRAND_DOMAIN` (and, for a new
  corporate parent, `GROUP_DOMAIN`) so the real logo resolves, and set its
  `segment` so the monogram fallback reads correctly; add a `MONO_OVERRIDES`
  entry only for a house whose established lettermark differs from the plain
  initials (e.g. Gucci `GG`, Saint Laurent `YSL`). `LOGO_SOURCES` is the single
  swap-point for the logo providers.
- **Every tool states its basis.** Each tool page, public or draft, carries its own
  methodology section (Super Fund Holdings has a whole route,
  `/super/method/`) in the footprint-method pattern: sources with URLs and
  access dates, calculation logic, exclusions named, update cadence, and
  estimate-vs-sourced flags wherever the two mix. A change to a tool's data
  or logic updates its methodology in the same change. On `/super/` every
  fund shows its "last verified" date; on `/progress/` the last-updated date
  renders from a single field in `data.js`.
- **Every subpage is indexed, publicly or privately.** `TOOLS` in
  `src/data/content.js` (rendered by `src/components/Tools.jsx` into the `#tools`
  band) carries one card per public page; `PRIVATE_TOOLS`, right beside it,
  carries one per draft and is rendered by `src/lab/LabApp.jsx` at `/lab/`. Both
  use `ToolCard.jsx`, and an entry in either carries what the tool does, the
  capability it demonstrates, a `scope` line, a `spec` (its chart) and a `span`
  (its width in the bento grid). Those scope figures are hand-typed counts of the
  real data (50 ASX50 companies, 258 fashion brands, 10 super funds, and so on),
  so adding a subpage means adding a card, and growing a tool's data set means
  updating its count in the same change. Each list's spans are written to fill
  its rows across the six-column grid (3-3 for the public pair; 4-2, 2-4, 3-3
  for the drafts), so moving a tool between the lists means renumbering `n` and
  repicking `span` in both. The footer's link columns follow the same rule from
  the other side: `FOOTER.columns.length` drives the grid through
  `--footer-col-n`, so a column emptied by a page moving behind the gate closes
  up rather than leaving a hole. The accent
  colours are chosen to clear contrast on the forest band, which is why
  `--indigo` is absent there.
- **The drafts are unlisted, not secured.** Target Tracker, Cost Per Wear, Super
  Fund Holdings, Grid Intensity, Australia's Climate Progress and Sustainability
  Daily are not finished enough to show, so they are kept out of
  `public/sitemap.xml` and `public/404.html`, carry
  `<meta name="robots" content="noindex, nofollow">`, are absent from `NAV_LINKS`
  and `FOOTER`, and wrap their app in `Gate` in `src/<tool>/main.jsx`. They still
  build and deploy. The passphrase and the limits of the arrangement are written
  at the top of `src/lib/gate.js`: the site is a static build with no server and
  the repository is public, so the gate hides the drafts from visitors and search
  engines and is not security. Never describe it as more than that, and never put
  anything genuinely confidential behind it. Publishing a draft is the reverse of
  the list above, plus moving its entry from `PRIVATE_TOOLS` to `TOOLS`.
- **Every tool card draws a chart from that tool's real data.** The specimens
  (`src/components/ToolSpecimen.jsx`, data in `src/data/specimens.js`) are small
  SVG charts: a claimed-versus-reported trajectory, a disclosure histogram, a
  factor comparison, and so on. The numbers are **copied** into `specimens.js`
  rather than imported, because each tool's data module is 130 kB or more and
  none of it tree-shakes, so importing one would land the whole file in the home
  page bundle. That copy is the price, and the rule that pays for it: every slice
  names the file and export it came from, no figure is ever rounded or invented
  to suit the drawing, and **a change to a tool's data updates its slice in the
  same change**. Each specimen also carries a `caption` and a `basis` line
  (sourced, derived, or illustrative), rendered under the chart, because an
  unattributed chart is the thing this section argues against. Charts are
  measured, not scaled: the plate reports its pixel size and the svg takes a 1:1
  viewBox from it, so every chart takes `(w, h)` and computes its geometry.
  Animation is skipped outright under `prefersReducedMotion()`, not sped up.
- **Share thumbnails are generated, and kept current.** Every page's Open
  Graph card (`public/og-<page>.png`) is rendered by `scripts/og`
  (`npm run og:cards`) as one dark card in a shared visual family: the site
  mark and a mono eyebrow, a headline whose lime second line names the page, a
  short support line, a colour-chip row of what the tool covers, a big faint
  monogram behind a dotted mesh network, and the page URL. **Whenever a page
  gets a major function or UI pass, regenerate its card in the same change** so
  the link preview reflects the page, then commit the updated PNG and keep the
  page's `og:image:alt` in sync. Card copy and motifs live in
  `scripts/og/cards.mjs`; the shared renderer is `scripts/og/draw.js`. The
  headline must say what the page is (the card markets the page), all copy
  follows the writing rules below, and a card never shows personal numbers.
  Home (`/`) and Work (`/work/`) intentionally keep the profile card
  `og-image.png`; method pages reuse their parent page's card. The drafts keep
  the cards they already have, so publishing one needs no new artwork; `/lab/`
  has no card, because nothing should be previewing it.
- **One slider, one copy button.** Every `<input type="range">` on the site
  goes through `src/components/Range.jsx`, and every copy-to-clipboard action
  through `src/components/CopyButton.jsx`. Both stay native controls underneath
  (full keyboard and assistive-tech behaviour); the shared part is a track that
  fills to the value with optional step notches, and a confirmation that lands
  on the control that was pressed. Pages tune the slider through
  `--rng-thumb` / `--rng-track` / `--rng-fill` on the wrapper and pass their own
  button class to `CopyButton`, so a control looks like its neighbours rather
  than like an import. Do not hand-roll a fifth range or a fifth copy state.
- **A calculation that matters lives in a plain module, not a component.**
  Node cannot parse JSX, so anything inside a `.jsx` file is beyond the reach of
  the tests. `src/footprint/lib/swaps.js` exists for that reason: the reveal's
  two counterfactuals (the American grid swap and the bus-versus-rail line) are
  derived there and rendered in `story/moments.jsx`, so their numbers are
  checked against the factor tables rather than against a screenshot. When a
  component grows arithmetic, move the arithmetic out and test it.
- **A figure quoted in prose is pinned to the table it came from.**
  `tests/published-figures.test.js` reads the copy and the factor set together:
  the 38x American grid spread, the 4.9 t swing between the lightest and
  heaviest state grids, and the four-times bus-to-rail ratio all have to keep
  matching the data. A refresh that moves one of them fails the suite, and the
  sentence quoting it has to move in the same change. Where a number can be
  derived rather than typed, derive it: `US_GRID_SPREAD` and `PT_MODE_RATIO` in
  `factors.js` are exported for exactly this, and the reveal's copy carries
  `{name}` placeholders instead of hard-coded state names.
- **Motion respects preferences.** Gate every animation/loop on
  `prefersReducedMotion()` and cursor-only interactions on `canHover()` (both
  from `src/utils/media.js`). Canvas/WebGL loops must pause off-screen via
  `IntersectionObserver` and clean up on unmount.
- **One place for the sticky nav's headroom.** `.nav` is sticky at `top:0` on
  every page, so anything scrolled to the top of the viewport lands under it.
  That clearance is expressed once, as `scroll-margin-top:calc(var(--nav-h) +
  0.75rem)` in `global.css`, and `--nav-h` is measured from the live bar by
  `useStickyNavHeight()` (`Chrome.jsx`) rather than hardcoded, because the bar
  is not one height everywhere: the six nav links hold one 53px row from 681px
  up (the tightening band in the NAV block of `global.css` is tuned to that),
  but a longer label or another link reopens a two-row band, as the old eight
  did between about 680px and 750px. Anything else pinned at the top of a page is measured the
  same way, by `useStickyBarHeight()` in the same file: it takes the bars that
  share `top:0`, publishes the tallest as a custom property, and treats a bar the
  stylesheet has left static at that breakpoint as no headroom at all. That is
  how the footprint planner's readout knows where to pin under the mode bar and
  the nav (`--fp-chrome-h`). Every route that lands on a section goes through it: a nav click calls
  `scrollIntoView` instead of doing its own offset maths, and `useHashLanding()`
  covers a hash that arrives before React has rendered the target (a shared
  link, or the cross-page `../#scenario` anchors in every sub-page's nav and
  footer) while leaving Back/Forward scroll restoration alone. Do not
  reintroduce a per-call offset calculation.
- **Native form controls reach 16px on touch.** iOS Safari zooms the page in,
  irreversibly, when a focused text control is under 16px, and the site's
  controls are typed small on purpose. Each page's stylesheet carries a
  `@media (pointer: coarse), (max-width: 680px)` block raising its own inputs
  and selects to 16px, filed under the heading `MOBILE FORM CONTROLS` (the
  rationale lives once, in `global.css`). Add a control under 16px, add it
  there. Never fix this with `maximum-scale=1`: pinch zoom stays available.
- **Accessibility:** keep the skip link first, `aria-current` on the active nav
  link, decorative canvases `aria-hidden`, and purely visual motion (e.g. the
  cycling role text) hidden from assistive tech with a static `.sr-only` label.
  A tab strip is the full WAI-ARIA contract or it is not a tab strip: roving
  `tabIndex`, arrow keys, `aria-controls` and a matching `role="tabpanel"` (see
  `FieldGuide` in `src/fashion/FashionApp.jsx` for the reference shape). Roles
  without the keyboard behaviour behind them are worse than plain buttons.
  Prefer explicit transition property lists over `transition:all`, which
  animates layout properties by accident.

## Develop

```bash
npm install
npm run dev      # local dev server
npm test         # engine + factor tests (node:test, no test dependency)
npm run build    # production build to dist/
npm run preview  # preview the production build
```

Run `npm test && npm run build` before committing. Both gate CI: `ci.yml` runs
them on every branch and pull request, and `deploy.yml` runs them again before
publishing from `main`.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) tests, builds and publishes
`dist/` to GitHub Pages on push to `main`; `.github/workflows/ci.yml` runs the
same two steps on every pull request, so the gate fires before a merge rather
than after it. `base: './'` in `vite.config.js` keeps asset
paths relative so both the domain root and a `/Portfolio/` sub-path work.

## Writing rules (for any site copy)

Australian English. No em dashes. No en dash clause separators in prose. Active
voice. Written in Chris's voice.

## Personal material

This repository is public. Personal career material, application drafts and
anything naming colleagues or internal employer data does not belong in it, in
`docs/` or anywhere else.
