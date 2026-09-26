// Registers the resolve hook above for the test process and every test file
// the runner spawns. Loaded with --import from the npm test script.
import { register } from 'node:module';

register('./resolve-hook.mjs', import.meta.url);
