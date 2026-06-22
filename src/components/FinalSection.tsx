import { motion } from 'framer-motion';
import { revealVariants, staggerContainer, viewportConfig } from '../hooks/useScrollReveal';

const words = ['Build.', 'Adapt.', 'Awaken.'];

const metadata = [
  'Vibe2Ship 2026',
  'Google AI Studio',
  'Solo Developer',
  'India',
];

export default function FinalSection() {
  return (
    <section
      id="final"
      className="section-padding min-h-screen flex flex-col items-center justify-center"
    >
      {/* Manifesto */}
      <motion.div
        className="flex flex-col items-center text-center mb-24"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {words.map((word) => (
          <motion.span
            key={word}
            variants={revealVariants}
            className="font-serif font-light tracking-wide block"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 7rem)',
              lineHeight: 1.3,
              color: 'var(--color-text-primary)',
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>

      {/* Metadata */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        {metadata.map((item, index) => (
          <span key={item} className="flex items-center gap-6">
            <span className="text-xs md:text-sm text-text-secondary tracking-widest uppercase font-light">
              {item}
            </span>
            {index < metadata.length - 1 && (
              <span className="text-text-tertiary text-xs">·</span>
            )}
          </span>
        ))}
      </motion.div>

      {/* Bottom breathing line */}
      <motion.div
        className="mt-24 w-16 h-px bg-gradient-to-r from-transparent via-signal/30 to-transparent"
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
      />
    </section>
  );
}
