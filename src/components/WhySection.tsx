import { motion } from 'framer-motion';
import { revealVariants, staggerContainer, viewportConfig } from '../hooks/useScrollReveal';

const cards = [
  {
    title: 'Observe.',
    description: 'Perceive patterns invisible to the surface. Gather signal from noise.',
  },
  {
    title: 'Adapt.',
    description: 'Reshape strategy in real-time. No rigidity, only evolution.',
  },
  {
    title: 'Protect.',
    description: 'Shield what matters. Build systems that defend by design.',
  },
];

export default function WhySection() {
  return (
    <section id="why-aegis" className="section-padding">
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.h2
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-center mb-20 tracking-wide"
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          Why <span className="text-signal">AEGIS</span>?
        </motion.h2>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={revealVariants}
              className="glass-card rounded-2xl p-8 md:p-10 group transition-all duration-700 hover:border-signal/15"
            >
              <h3 className="font-serif text-2xl md:text-3xl font-light text-signal mb-4 tracking-wide">
                {card.title}
              </h3>
              <p className="text-sm md:text-base text-text-secondary leading-relaxed font-light">
                {card.description}
              </p>

              {/* Subtle bottom accent */}
              <div className="mt-8 w-8 h-px bg-gradient-to-r from-signal/40 to-transparent group-hover:w-16 transition-all duration-700" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
