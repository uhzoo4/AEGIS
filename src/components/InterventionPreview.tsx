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
  const scoreRef = useRef<HTMLDivElement>(null);
  const { setActiveSection } = useSectionContext();

  useGSAP(() => {
    if (!containerRef.current || !headlineRef.current || !trackRef.current || !scoreRef.current) return;

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
    gsap.set(scoreRef.current, { color: '#ff0000' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 60%',
        toggleActions: 'play reverse play reverse',
      }
    });

    tl.to(splitHeadline.lines, {
      yPercent: 0,
      duration: 1,
      ease: 'aegis-resolve',
      stagger: 0.1,
    });

    // Animate blocks
    tl.to(blocks, {
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: 'aegis-resolve',
      stagger: 0.4, // Slower stagger to match the score drop
    }, '-=0.5');

    // Risk score reduction (68 -> 31)
    const scoreObj = { val: 68 };
    tl.to(scoreObj, {
      val: 31,
      duration: 2.5, // Sync with blocks stagger
      ease: 'aegis-resolve',
      onUpdate: () => {
        if (scoreRef.current) {
          scoreRef.current.innerText = Math.round(scoreObj.val).toString();
        }
      }
    }, '<');

    // Color transition from red to teal
    tl.to(scoreRef.current, {
      color: 'var(--color-signal)',
      duration: 2.5,
      ease: 'aegis-resolve'
    }, '<');

    return () => {
      splitHeadline.revert();
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="intervention" className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 bg-void z-10">
      
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-16 justify-between items-start">
        
        {/* Left: Headline & Protocols */}
        <div className="flex-1 max-w-2xl">
          <h2 
            ref={headlineRef}
            className="font-light text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-text-primary tracking-wide mb-16"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            SYSTEM INTERVENTION
          </h2>

          <div className="w-16 h-px bg-signal/50 mb-12" />

          {/* Intervention Track */}
          <div ref={trackRef} className="flex flex-col gap-4 md:gap-6">
            {INTERVENTIONS.map((item) => (
              <div 
                key={item.id} 
                className="intervention-block flex flex-col md:flex-row md:items-center gap-4 border border-signal/10 bg-signal/5 p-4 md:p-6"
              >
                <span className="font-mono text-xs md:text-sm tracking-[0.25em] text-signal/70 uppercase min-w-[120px]">
                  [ PROTOCOL {item.id} ]
                </span>
                <p className="font-sans text-base md:text-lg text-text-secondary tracking-wide">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dynamic Risk Score Reduction */}
        <div className="hidden lg:flex flex-col items-end pt-12">
          <span className="font-mono text-xs tracking-[0.25em] text-text-tertiary uppercase mb-4">
            RECALCULATED RISK
          </span>
          <div 
            ref={scoreRef}
            className="font-serif font-light text-[8rem] xl:text-[12rem] leading-none tracking-tighter"
          >
            68
          </div>
          <div className="mt-4 text-signal font-mono text-sm tracking-widest uppercase">
            PROTOCOL EXECUTING...
          </div>
        </div>
        
      </div>

    </section>
  );
}
