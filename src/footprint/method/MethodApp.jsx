// The "how it works" page: a plain explanation of what the calculator counts
// and the live factor tables it prices from.

import { MotionConfig } from 'framer-motion';
import { Grain, ScrollProgress, SkipLink } from '../../components/Chrome';
import { FootprintNav, FootprintFooter } from '../Nav';
import Method from '../Method';

export default function MethodApp() {
  return (
    <MotionConfig reducedMotion="user">
      <SkipLink />
      <Grain />
      <ScrollProgress />
      <FootprintNav home="../../" />
      <main id="main-content">
        <Method />
      </main>
      <FootprintFooter home="../../" />
    </MotionConfig>
  );
}
