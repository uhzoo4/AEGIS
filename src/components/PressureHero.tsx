import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '../utils/gsap';

export default function PressureHero() {
  const container = useRef<HTMLDivElement>(null);
  const headlineRef1 = useRef<HTMLHeadingElement>(null);
  const headlineRef2 = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!headlineRef1.current || !headlineRef2.current) return;

    // Use SplitText for headline-grade reveals as per aegis_design_analysis.md Rules
    // Ensure mask: true behavior (we pass it directly; if SplitText version requires wrapper, 
    // it's handled by GSAP's premium features or custom wrapper extensions in this setup)
    const split1 = new SplitText(headlineRef1.current, { type: 'lines', linesClass: 'line', mask: true } as any);
    const split2 = new SplitText(headlineRef2.current, { type: 'lines', linesClass: 'line', mask: true } as any);

    // Initial state: translated down out of the mask
    gsap.set([split1.lines, split2.lines], { yPercent: 100 });

    const tl = gsap.timeline({ delay: 0.5 }); // Delay for Gate completion

    // aegis-pressure ease (sharp, anxious snap) specifically for the Pressure beat
    tl.to(split1.lines, {
      yPercent: 0,
      duration: 1.2,
      ease: 'aegis-pressure',
      stagger: 0.1,
    })
    // Overlapping sequences: "-=0.8" instead of sequential waiting
    .to(split2.lines, {
      yPercent: 0,
      duration: 1.2,
      ease: 'aegis-pressure',
      stagger: 0.1,
    }, '-=0.8');

    // Cleanup
    return () => {
      split1.revert();
      split2.revert();
    };
  }, { scope: container });

  return (
    <section ref={container} id="pressure" className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 py-32 z-10">
      
      {/* Primary Copy: Display register, Cormorant Garamond */}
      <h2
        ref={headlineRef1}
        className="font-light text-5xl md:text-7xl lg:text-[7.5rem] leading-[1.05] text-text-primary tracking-wide mb-8 md:mb-12"
        style={{ fontFamily: '"Cormorant Garamond", serif' }}
      >
        YOU ARE NOT<br />
        FALLING BEHIND.
      </h2>

      {/* The Pressure Warm Accent */}
      <h2
        ref={headlineRef2}
        className="font-light text-5xl md:text-7xl lg:text-[7.5rem] leading-[1.05] tracking-wide"
        style={{ fontFamily: '"Cormorant Garamond", serif', color: 'var(--color-pressure, #D4A574)' }}
      >
        YOU ARE<br />
        OVERLOADED.
      </h2>

      {/* Small Signal: System Register */}
      <div className="mt-32 pt-8 border-t border-[rgba(212,165,116,0.1)] w-full max-w-xs opacity-70">
        <p className="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-pressure, #D4A574)' }}>
          COGNITIVE LOAD DETECTED.
        </p>
      </div>

    </section>
  );
}
