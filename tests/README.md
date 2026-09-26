# Tests

The calculation engine is the site's core asset, so it is the thing under test.
`npm test` runs them; CI runs the same command on every pull request
(`.github/workflows/ci.yml`) and again before the deploy build on main.

```bash
npm test
```

## The runner

Node's built-in test runner (`node:test` and `node:assert`), with no test
dependency added to `package.json`. The only piece of setup is
`support/resolve-hook.mjs`, an ESM resolve hook that tries `.js` and `.jsx`
before giving up on an extensionless specifier. Every source file in the repo
imports the way Vite resolves (`'../data/factors'`), and the hook lets Node read
those files as they are, so nothing in `src/` is rewritten to suit the runner.

## What is covered, and what is not

The suites exercise the pure layer: `src/footprint/lib/` and
`src/footprint/data/`. That is where the arithmetic and the factors live, and
where a mistake is silent.

Node cannot parse JSX, so components are not imported here. Anything worth
testing therefore belongs in a plain module rather than inside a component:
`lib/swaps.js` exists for exactly that reason, holding the two counterfactuals
the reveal draws so their numbers can be checked against the factor tables
instead of only against a screenshot. If a component grows a calculation, move
the calculation out and test it.

| File | What it holds to account |
|---|---|
| `engine.pricing.test.js` | What one logged activity is charged: certified renewable netting on both the meter and an EV, per-state American electricity, the bus and rail split, household and occupancy shares, and the promise that malformed or missing input prices to zero rather than NaN. |
| `engine.aggregate.test.js` | The reporting period, and that every view of the year adds back to the same year: monthly buckets (including bills that reach back past the window start), the scope split, imported files full of junk, and the uncertainty band. |
| `engine.pathway.test.js` | That the projection opens on the audited year for every grid in the table, that dollars per tonne never move when the same home is described with a different number of adults, applicability, and how sequenced actions interact. |
| `factors.test.js` | The factor table's shape and completeness, and the scope 3 electricity conventions the basis of preparation now describes. |
| `published-figures.test.js` | Figures the site states in prose, against the tables they came from. |

That last one is the unusual one and it is deliberate. A failure there is not a
bug in the engine, it is a sentence that has gone out of date: a factor refresh
that moves the American grid spread or the bus-to-rail ratio breaks the test,
and the copy quoting it has to move in the same change. It is the house rule
about every figure carrying a source, enforced rather than remembered.
