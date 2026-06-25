import { useRef } from 'react';
import { gsap, SplitText, useGSAP, ScrollTrigger } from '../utils/gsap';
import { useSectionContext } from '../hooks/useSectionContext';

const INTERVENTIONS = [
  { id: '01', text: 'Complete Physics Chapter 3 tonight.' },
  { id: '02', text: 'Move Chemistry revision to Saturday morning.' },
  { id: '03', text: 'Sleep before 11 PM.' },
  { id: '04', text: 'Delay non-critical tasks.' }
];

export default function InterventionPreview() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { setActiveSection } = useSectionContext();

  useGSAP(() => {
    if (!containerRef.current || !headlineRef.current || !trackRef.current) return;

    // Broadcast active section
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top center',
      onEnter: () => setActiveSection('intervention'),
      onEnterBack: () => setActiveSection('intervention'),
    });

    const splitHeadline = new SplitText(headlineRef.current, { type: 'lines', linesClass: 'line', mask: true } as any);
    const blocks = gsap.utils.toArray('.intervention-block') as HTMLElement[];

    // Initial state
    gsap.set(splitHeadline.lines, { yPercent: 100 });
    gsap.set(blocks, { opacity: 0, x: -20 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 60%',
        toggleActions: 'play reverse play reverse',
      }
    });

    // Animate headline
    tl.to(splitHeadline.lines, {
      yPercent: 0,
      duration: 1,
      ease: 'aegis-resolve',
      stagger: 0.1,
    });

    // Animate intervention blocks
    tl.to(blocks, {
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: 'aegis-resolve',
      stagger: 0.15,
    }, '-=0.5');

    return () => {
      splitHeadline.revert();
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="intervention" className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 bg-void z-10">
      
      <div className="max-w-4xl">
        <h2 
          ref={headlineRef}
          className="font-light text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-text-primary tracking-wide mb-16"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          SYSTEM INTERVENTION
        </h2>

        <div className="w-16 h-px bg-signal/50 mb-12" />

        {/* Intervention Track */}
        <div ref={trackRef} className="flex flex-col gap-6 md:gap-8">
          {INTERVENTIONS.map((item) => (
            <div 
              key={item.id} 
              className="intervention-block flex flex-col md:flex-row md:items-center gap-4 md:gap-8 border border-signal/10 bg-signal/5 p-6 md:p-8"
            >
              <span className="font-mono text-xs md:text-sm tracking-[0.25em] text-signal/70 uppercase">
                [ PROTOCOL {item.id} ]
              </span>
              <p className="font-sans text-lg md:text-xl text-text-secondary tracking-wide">
                {item.text}
              </p>
            </div>
          ))}
        </div>
        
      </div>

    </section>
  );
}
