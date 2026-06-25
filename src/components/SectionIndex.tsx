import { useSectionContext } from '../hooks/useSectionContext';
import { motion, AnimatePresence } from 'framer-motion';

const sectionConfig = {
  pressure: { index: '01', label: 'PRESSURE' },
  understanding: { index: '02', label: 'UNDERSTANDING' },
  prediction: { index: '03', label: 'PREDICTION' },
  intervention: { index: '04', label: 'INTERVENTION' },
  recovery: { index: '05', label: 'RECOVERY' },
};

export default function SectionIndex() {
  const { activeSection } = useSectionContext();
  const current = sectionConfig[activeSection];

  return (
    <div className="fixed top-8 left-6 md:top-12 md:left-12 z-50 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          className="font-mono text-xs tracking-[0.25em] uppercase text-text-tertiary opacity-70"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          [ {current.index} // {current.label} ]
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
