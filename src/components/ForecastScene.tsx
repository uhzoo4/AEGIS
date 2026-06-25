import { useRef } from 'react';
import { gsap, SplitText, useGSAP, ScrollTrigger } from '../utils/gsap';
import { useSectionContext } from '../hooks/useSectionContext';

export default function ForecastScene() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const reasonRef = useRef<HTMLParagraphElement>(null);
  const { setActiveSection } = useSectionContext();

  useGSAP(() => {
    if (!containerRef.current || !headlineRef.current || !scoreRef.current || !reasonRef.current) return;

    // Broadcast active section
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top center',
      onEnter: () => setActiveSection('prediction'),
      onEnterBack: () => setActiveSection('prediction'),
    });

    // SplitText for headline reveal per architecture rules
    const splitHeadline = new SplitText(headlineRef.current, { type: 'lines', linesClass: 'line', mask: true } as any);
    const splitReason = new SplitText(reasonRef.current, { type: 'lines', linesClass: 'line', mask: true } as any);

    gsap.set([splitHeadline.lines, splitReason.lines], { yPercent: 100 });
    gsap.set(scoreRef.current, { opacity: 0, scale: 0.8 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 60%',
        toggleActions: 'play reverse play reverse', // Replays if you scroll back
      }
    });

    // Animate headline
    tl.to(splitHeadline.lines, {
      yPercent: 0,
      duration: 1,
      ease: 'aegis-resolve',
      stagger: 0.1,
    });

    // Animate the score counting up using aegis-pressure for tension
    const scoreObj = { val: 0 };
    tl.to(scoreObj, {
      val: 68,
      duration: 1.5,
      ease: 'aegis-pressure',
      onUpdate: () => {
        if (scoreRef.current) {
          scoreRef.current.innerText = Math.round(scoreObj.val).toString();
        }
      }
    }, '-=0.5')
    .to(scoreRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: 'aegis-pressure'
    }, '<');

    // Reveal the reason text
    tl.to(splitReason.lines, {
      yPercent: 0,
      duration: 1.2,
      ease: 'aegis-resolve',
      stagger: 0.1
    }, '-=1.0');

    return () => {
      splitHeadline.revert();
      splitReason.revert();
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="prediction" className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 z-10">
      
      <div className="max-w-4xl">
        <h2 
          ref={headlineRef}
          className="font-light text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-text-primary tracking-wide mb-16"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          TRAJECTORY FORECAST
        </h2>

        <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
          
          {/* Large Risk Score */}
          <div className="flex flex-col">
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-signal mb-2">
              RISK SCORE [ HIGH ]
            </span>
            <div 
              ref={scoreRef} 
              className="font-serif font-light text-8xl md:text-[10rem] lg:text-[12rem] leading-none tracking-tighter"
              style={{ color: 'var(--color-pressure, #D4A574)' }}
            >
              0
            </div>
          </div>

          {/* Forecast Reason */}
          <div className="max-w-sm pb-4 md:pb-8">
            <div className="w-8 h-px bg-signal/30 mb-6" />
            <p 
              ref={reasonRef}
              className="font-mono text-sm md:text-base leading-relaxed tracking-wider text-text-secondary uppercase"
            >
              Multiple high-priority tasks colliding with insufficient recovery periods. Failure is imminent without intervention.
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}
