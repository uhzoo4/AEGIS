import { useRef } from 'react';
import { motion } from 'framer-motion';
import StatusIndicator from './StatusIndicator';
import AnimatedLine from './AnimatedLine';
import { aegisResolveFM, gsap, useGSAP } from '../utils/gsap';

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const childVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      ease: aegisResolveFM,
    },
  },
};

export default function HeroSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Fade out the hero section entirely as the user scrolls down
    // This prevents the passive "Awaiting the signal" text from colliding
    // with the visceral "YOU ARE OVERLOADED" PressureHero text.
    gsap.to(container.current, {
      opacity: 0,
      y: -50,
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });
  }, { scope: container });

  return (
    <section
      ref={container}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6"
    >
      <motion.div
        className="flex flex-col items-center text-center"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Title */}
        <motion.h1
          variants={childVariants}
          className="font-serif font-light tracking-[0.3em] uppercase animate-breathe"
          style={{
            fontSize: 'clamp(3rem, 8vw, 10rem)',
            lineHeight: 1,
            color: 'var(--color-text-primary)',
          }}
        >
          AEGIS
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={childVariants}
          className="mt-8 text-lg md:text-xl font-light tracking-wide text-text-secondary"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Awaiting the signal.
        </motion.p>

        {/* Sub-text */}
        <motion.p
          variants={childVariants}
          className="mt-4 text-sm text-text-tertiary tracking-wider"
        >
          Official problem statement releases soon.
        </motion.p>

        {/* Animated Line */}
        <motion.div variants={childVariants} className="w-full mt-10">
          <AnimatedLine />
        </motion.div>

        {/* Status Indicator */}
        <motion.div variants={childVariants} className="mt-8">
          <StatusIndicator />
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-12 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.2 }}
      >
        <span className="text-xs text-text-tertiary tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-text-tertiary to-transparent" />
      </motion.div>
    </section>
  );
}
