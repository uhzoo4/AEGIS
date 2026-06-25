import { useRef } from 'react';
import { gsap, SplitText, useGSAP, ScrollTrigger } from '../utils/gsap';
import { useSectionContext } from '../hooks/useSectionContext';

const SIGNALS = [
  'COGNITIVE OVERLOAD DETECTED',
  'DEADLINE COLLISION: 48 HOURS',
  'MOMENTUM LOSS',
  'REDUCED AVAILABLE TIME',
  'DECLINING ENERGY METRICS'
];

export default function SignalTrack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { setActiveSection } = useSectionContext();

  useGSAP(() => {
    if (!containerRef.current || !trackRef.current) return;

    // Broadcast active section when this section enters the viewport
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top center',
      onEnter: () => setActiveSection('understanding'),
      onEnterBack: () => setActiveSection('understanding'),
    });

    // Get all signal rows
    const signals = gsap.utils.toArray('.signal-row') as HTMLElement[];

    // Split text for each signal for precise mask reveals
    const splits = signals.map(signal => 
      new SplitText(signal, { type: 'lines', linesClass: 'line', mask: true } as any)
    );

    // Initial state
    splits.forEach(split => {
      gsap.set(split.lines, { yPercent: 100, opacity: 0 });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1, // Smooth scrub to feel systemically precise
      }
    });

    // Animate signals in sequence using the calming resolve ease 
    // to contrast with the anxiety of PressureHero
    splits.forEach((split, index) => {
      tl.to(split.lines, {
        yPercent: 0,
        opacity: index === 0 ? 1 : 0.4, // Highlight first, fade others slightly
        duration: 1,
        ease: 'aegis-resolve',
        stagger: 0.1
      }, index * 0.4); // Overlapping sequence
      
      // Dim the previous signal as the new one comes in
      if (index > 0) {
        tl.to(splits[index - 1].lines, {
          opacity: 0.15,
          duration: 0.5,
          ease: 'aegis-resolve'
        }, '<');
      }
    });

    return () => {
      splits.forEach(split => split.revert());
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="understanding" className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 bg-void z-10">
      
      {/* Narrative bridge: System acknowledges the noise */}
      <div className="absolute top-32 max-w-sm text-text-secondary font-light text-lg md:text-xl leading-relaxed tracking-wide opacity-80" style={{ fontFamily: 'var(--font-sans)' }}>
        We see the collision. Parsing external noise into structured signal.
      </div>

      {/* Signal Track */}
      <div ref={trackRef} className="mt-24 flex flex-col gap-6 md:gap-8 border-l border-signal/20 pl-6 md:pl-12 py-8">
        {SIGNALS.map((signal, i) => (
          <div 
            key={i} 
            className="signal-row font-mono text-lg md:text-2xl lg:text-3xl tracking-[0.15em] uppercase text-signal"
          >
            {signal}
          </div>
        ))}
      </div>

    </section>
  );
}
