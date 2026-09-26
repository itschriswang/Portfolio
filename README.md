# itschriswang.com

Source for the portfolio of Chris Wang, Senior Sustainability Advisor in Melbourne: greenhouse gas reporting, assurance, climate disclosure and decarbonisation modelling.

Live at https://itschriswang.com

## What is here

- `/`: profile, how the work fits together, and an interactive decarbonisation scenario model on illustrative data
- `/work/`: four work samples (emissions baseline, decarbonisation roadmap, multi-criteria analysis, lifecycle carbon), each on illustrative data
- `/footprint/`: Life Footprint, a carbon calculator that prices a year of bills, tickets and receipts on published emission factors, with its method at `/footprint/method/`

Other tools in `src/` are drafts. They are built and deployed but unlinked, left out of the sitemap, marked `noindex` and behind a passphrase screen (`src/components/Gate.jsx`). CLAUDE.md records how to publish one.

## Built with

React 18, Vite 5 (multi-page build, no backend), Framer Motion and Chart.js. The pages target WCAG 2.1 AA and respect reduced-motion settings.

## Run it

```bash
npm install
npm run dev      # local server
npm test         # engine and factor tests (Node's built-in runner)
npm run build    # production build to dist/
```

## Data and method

Figures on the site carry their source in the page. Factor sources, verification notes and the open sourcing list are in `docs/footprint-research/` and `docs/data-needed.md`. Third-party reports are cited and linked rather than stored here.

## Deployment

Pull requests run `.github/workflows/ci.yml` (tests and build). A push to `main` runs `.github/workflows/deploy.yml`, which tests, builds and publishes `dist/` to GitHub Pages on the custom domain in `public/CNAME`.

## Rights

Copy, data compilations and images are © Chris Wang unless credited otherwise. Third-party logos and cited figures belong to their owners.
