import { type Variants } from 'framer-motion';
import { aegisResolveFM } from '../utils/gsap';

/** Standard reveal animation — fade in from below with blur dissolve */
export const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      ease: aegisResolveFM,
    },
  },
};

/** Container variant that staggers children */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

/** Viewport trigger settings for whileInView */
export const viewportConfig = {
  once: true,
  amount: 0.3 as const,
  margin: '-50px' as const,
};
