import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

        {/* Scene Cycling Text - Editorial Right Aligned */}
        <div className="h-24 mt-12 w-full max-w-[90vw] md:max-w-3xl flex justify-end relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={sceneIndex}
              className="flex flex-col items-end text-right absolute top-0 right-0 md:pr-8"
            >
              {/* Tagline */}
              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 1, ease: aegisResolveFM }}
                  className="text-lg md:text-xl font-light tracking-wide text-signal uppercase"
                  style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.1em' }}
                >
                  {SCENES[sceneIndex].tagline}
                </motion.p>
              </div>
              {/* Sub-text */}
              <div className="overflow-hidden mt-3">
                <motion.p
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 1, ease: aegisResolveFM, delay: 0.1 }}
                  className="text-sm md:text-base text-text-tertiary tracking-widest font-mono"
                >
                  {SCENES[sceneIndex].sub}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Animated Line - Shifted to match right alignment */}
        <motion.div variants={childVariants} className="w-full max-w-[90vw] md:max-w-3xl flex justify-end mt-16">
          <div className="w-1/3 md:w-1/4 pr-8">
            <AnimatedLine />
          </div>
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
