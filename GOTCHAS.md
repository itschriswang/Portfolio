# Gotchas

- **Commit author email.** GitHub rejects pushes from commits authored with a private personal email, because of the account's email privacy setting. Commit under a no-reply address.
- **Squash merges.** After a squash merge, reset the working branch to `origin/main` before the next change, or the next pull request conflicts.
- **Confirming a deploy.** Some sandboxed environments cannot reach the live domain. Confirm a deploy from the "Deploy portfolio to GitHub Pages" Actions run instead.
- **Checks before pushing.** Run `npm test && npm run build`. Then serve `dist/` and check the public pages (`/`, `/work/`, `/footprint/`, `/footprint/method/`, the 404) with axe at 1440 and 390 wide. The bar is 0 violations and no horizontal overflow.
- **Screenshots.** A Playwright element screenshot that scrolls the page can capture the skip link mid-transition. That is not a bug: check `document.activeElement` before chasing it.
- **Deleting files is not enough.** In a public repository, a deleted file stays reachable through old commits and `refs/pull/*`. Anything sensitive needs a fresh repository, not a delete.
