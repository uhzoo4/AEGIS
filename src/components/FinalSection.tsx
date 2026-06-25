import { useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap, SplitText, useGSAP, ScrollTrigger } from '../utils/gsap';
import { useSectionContext } from '../hooks/useSectionContext';
import { aegisResolveFM } from '../utils/gsap';

const words = ['Build.', 'Adapt.', 'Awaken.'];

const metadata = [
  'Vibe2Ship 2026',
  'Google AI Studio',
  'Solo Developer',
  'India',
];

export default function FinalSection() {
  const containerRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const { setActiveSection } = useSectionContext();

  useGSAP(() => {
    if (!containerRef.current || !textContainerRef.current) return;

    // Broadcast active section for the SectionIndex
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top center',
      onEnter: () => setActiveSection('recovery'),
      onEnterBack: () => setActiveSection('recovery'),
    });

    // SplitText for headline-grade reveals per AEGIS architectural rules (mask: true)
    const wordElements = gsap.utils.toArray('.manifesto-word') as HTMLElement[];
    const splits = wordElements.map(
      (el) => new SplitText(el, { type: 'lines', linesClass: 'line', mask: true } as any)
    );

    // Initial state
    splits.forEach(split => {
      gsap.set(split.lines, { yPercent: 100 });
    });

    // Sequence the manifesto words with the deep, calming aegis-resolve ease
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 60%',
        toggleActions: 'play reverse play reverse',
      }
    });

    splits.forEach((split, index) => {
      tl.to(split.lines, {
        yPercent: 0,
        duration: 1.2,
        ease: 'aegis-resolve',
        stagger: 0.1
      }, index * 0.4); // Overlapping sequence
    });

    return () => {
      splits.forEach(split => split.revert());
    };
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="final"
      className="section-padding min-h-screen flex flex-col items-center justify-center relative z-10"
    >
      {/* Manifesto */}
      <div
        ref={textContainerRef}
        className="flex flex-col items-center text-center mb-24"
      >
        {words.map((word) => (
          <span
            key={word}
            className="manifesto-word font-light tracking-wide block"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(2.5rem, 6vw, 7rem)',
              lineHeight: 1.3,
              color: 'var(--color-text-primary)',
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Metadata - Keeps Framer Motion since it is secondary, state-bound, and not headline-grade */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1.2, ease: aegisResolveFM, delay: 1 }}
      >
        {metadata.map((item, index) => (
          <span key={item} className="flex items-center gap-6">
            <span className="text-xs md:text-sm text-text-secondary tracking-widest uppercase font-light font-mono">
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
        transition={{ duration: 1.5, ease: aegisResolveFM, delay: 1.2 }}
      />
    </section>
  );
}
