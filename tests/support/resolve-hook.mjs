// Module resolve hook for the test runner.
//
// The app's own imports are extensionless ('../data/factors'), because Vite
// resolves them and every source file in the repo is written that way. Node's
// ESM loader is stricter, so this hook tries the extensions Vite would try
// before handing the specifier back. It exists so the tests can import the
// real modules the site ships, unmodified: nothing in src/ is rewritten to
// suit the runner.
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const EXTS = ['.js', '.jsx'];

export async function resolve(specifier, context, next) {
  const relative = specifier.startsWith('./') || specifier.startsWith('../');
  if (relative && !/\.[a-z]+$/i.test(specifier)) {
    for (const ext of EXTS) {
      try {
        const resolved = await next(specifier + ext, context);
        if (existsSync(fileURLToPath(resolved.url))) return resolved;
      } catch { /* try the next extension */ }
    }
  }
  return next(specifier, context);
}
