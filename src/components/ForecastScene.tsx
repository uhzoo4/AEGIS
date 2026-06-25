import { useRef } from 'react';
import { gsap, SplitText, useGSAP, ScrollTrigger } from '../utils/gsap';
import { useSectionContext } from '../hooks/useSectionContext';

export default function ForecastScene() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const reasonRef = useRef<HTMLParagraphElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { setActiveSection } = useSectionContext();

  useGSAP(() => {
    if (!containerRef.current || !headlineRef.current || !scoreRef.current || !reasonRef.current || !pathRef.current) return;

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top center',
      onEnter: () => setActiveSection('prediction'),
      onEnterBack: () => setActiveSection('prediction'),
    });

    const splitHeadline = new SplitText(headlineRef.current, { type: 'lines', linesClass: 'line', mask: true } as any);
    const splitReason = new SplitText(reasonRef.current, { type: 'lines', linesClass: 'line', mask: true } as any);

    gsap.set([splitHeadline.lines, splitReason.lines], { yPercent: 100 });
    gsap.set(scoreRef.current, { opacity: 0, scale: 0.8 });
    
    // Setup SVG path for drawSVG effect
    const length = pathRef.current.getTotalLength();
    gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });

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

    // Draw the trajectory curve
    tl.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 2,
      ease: 'aegis-pressure'
    }, '<');

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
    <section ref={containerRef} id="prediction" className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 z-10 overflow-hidden">
      
      {/* Background Trajectory Curve */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 1000">
          <path
            ref={pathRef}
            d="M 0,1000 C 400,1000 600,800 1000,0"
            fill="none"
            stroke="#ff0000"
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="max-w-4xl relative z-10">
        <h2 
          ref={headlineRef}
          className="font-light text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-text-primary tracking-wide mb-16"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          TRAJECTORY FORECAST
        </h2>

        <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
          <div className="flex flex-col">
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#ff0000] mb-2">
              RISK SCORE [ HIGH ]
            </span>
            <div 
              ref={scoreRef} 
              className="font-serif font-light text-8xl md:text-[10rem] lg:text-[12rem] leading-none tracking-tighter text-[#ff0000]"
            >
              0
            </div>
          </div>

          <div className="max-w-sm pb-4 md:pb-8">
            <div className="w-8 h-px bg-[#ff0000]/50 mb-6" />
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
