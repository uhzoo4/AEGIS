import { motion } from 'framer-motion';
import { aegisResolveFM } from '../utils/gsap';

interface SectionIndexProps {
  index: string;
  label: string;
}

export default function SectionIndex({ index, label }: SectionIndexProps) {
  return (
    <motion.div
      className="absolute top-8 left-6 md:top-12 md:left-12 z-10 font-mono text-xs tracking-[0.25em] uppercase text-text-secondary pointer-events-none"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1.2, ease: aegisResolveFM }}
    >
      [ {index} // {label} ]
    </motion.div>
  );
}
