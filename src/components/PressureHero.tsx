import { motion } from 'framer-motion';
import { revealVariants, staggerContainer, viewportConfig } from '../hooks/useScrollReveal';

export default function PressureHero() {
  return (
    <section
      id="pressure"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 py-32"
    >
      <motion.div
        className="flex flex-col w-full max-w-6xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {/* Top Label */}
        <motion.div 
          variants={revealVariants}
          className="mb-16 md:mb-24 font-mono text-xs md:text-sm text-text-tertiary tracking-[0.25em] uppercase"
        >
          [ 01 // PRESSURE ]
        </motion.div>

        {/* Primary Copy */}
        <motion.h2
          variants={revealVariants}
          className="font-light text-5xl md:text-7xl lg:text-[7.5rem] leading-[1.05] text-text-primary tracking-wide mb-8 md:mb-12"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          YOU ARE NOT<br />
          FALLING BEHIND.
        </motion.h2>

        <motion.h2
          variants={revealVariants}
          className="font-light text-5xl md:text-7xl lg:text-[7.5rem] leading-[1.05] tracking-wide"
          style={{ 
            fontFamily: '"Cormorant Garamond", serif',
            color: 'rgba(127, 219, 202, 0.45)' // Subtle teal accent
          }}
        >
          YOU ARE<br />
          OVERLOADED.
        </motion.h2>

        {/* Small Signal */}
        <motion.div 
          variants={revealVariants}
          className="mt-32 pt-8 border-t border-[rgba(127,219,202,0.1)] w-full max-w-xs"
        >
          <p className="font-mono text-[10px] md:text-xs text-[rgba(127,219,202,0.6)] tracking-[0.3em] uppercase">
            COGNITIVE LOAD DETECTED.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
