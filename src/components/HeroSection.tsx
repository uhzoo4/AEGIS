import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const SCENES = [
  { tagline: "Awaiting the signal.", sub: "System in standby mode." },
  { tagline: "Scanning environment.", sub: "Parsing calendar density and workload." },
  { tagline: "Signal detected.", sub: "Collision imminent. Scroll to intercept." }
];

export default function HeroSection() {
  const container = useRef<HTMLElement>(null);
  const [sceneIndex, setSceneIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSceneIndex(prev => {
        if (prev >= SCENES.length - 1) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, []);

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

        {/* Scene Cycling Text */}
        <div className="h-24 mt-8 flex flex-col items-center justify-start relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={sceneIndex}
              initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
              transition={{ duration: 0.8, ease: aegisResolveFM }}
              className="flex flex-col items-center absolute top-0"
            >
              <p
                className="text-lg md:text-xl font-light tracking-wide text-text-secondary"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {SCENES[sceneIndex].tagline}
              </p>
              <p className="mt-4 text-sm text-text-tertiary tracking-wider">
                {SCENES[sceneIndex].sub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

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
