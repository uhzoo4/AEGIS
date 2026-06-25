'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface OpeningSequenceProps {
  onComplete: () => void;
}

export default function OpeningSequence({ onComplete }: OpeningSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const textLine1Ref = useRef<HTMLSpanElement>(null);
  const textLine2Ref = useRef<HTMLSpanElement>(null);
  
  const [count, setCount] = useState('00');

  useEffect(() => {
    // 1. Matrix Counter Increment Simulation
    const counterObj = { value: 0 };
    const counterTimeline = gsap.to(counterObj, {
      value: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        const formatted = Math.floor(counterObj.value)
          .toString()
          .padStart(3, '0');
        setCount(formatted);
      },
    });

    // 2. Main Title Design Reveal Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Dramatic fade out of entire loader screen
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1,
          ease: 'power4.inOut',
          onComplete: onComplete,
        });
      }
    });

    // Set initial positions for typography masking
    gsap.set([textLine1Ref.current, textLine2Ref.current], { y: '100%' });

    tl.to(textLine1Ref.current, {
      y: '0%',
      duration: 1.2,
      ease: 'cinematicEase',
      delay: 0.4,
    })
    .to(textLine2Ref.current, {
      y: '0%',
      duration: 1.4,
      ease: 'cinematicEase',
    }, '-=0.8')
    .to([textLine1Ref.current, textLine2Ref.current], {
      opacity: 0,
      y: '-50%',
      duration: 0.8,
      ease: 'power3.in',
      delay: 0.8,
    })
    .to(counterRef.current, {
      opacity: 0,
      duration: 0.4,
    }, '-=0.4');

    return () => {
      counterTimeline.kill();
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen bg-[#080808] z-99999 flex flex-col justify-between p-10 md:p-16 overflow-hidden select-none"
    >
      {/* Top Meta Info */}
      <div className="flex justify-between items-start w-full font-mono text-[9px] tracking-[0.25em] text-[#5a5652] uppercase">
        <div>SYS.INIT // CREATIVE DEVELOPER</div>
        <div className="text-right font-jp">クリエイティブ・デベロッパー</div>
      </div>

      {/* Center Cinematic Manifesto Statement */}
      <div className="max-w-xl md:max-w-3xl self-start my-auto">
        <h2 className="font-serif font-light text-2xl md:text-4xl text-[#e8e4dc] leading-relaxed tracking-wide">
          <span className="block overflow-hidden py-1">
            <span ref={textLine1Ref} className="block will-change-transform">
              I don&apos;t build interfaces.
            </span>
          </span>
          <span className="block overflow-hidden py-1 text-[#c8a96e] italic">
            <span ref={textLine2Ref} className="block will-change-transform">
              I build worlds — dark, atmospheric, alive.
            </span>
          </span>
        </h2>
      </div>

      {/* Bottom Progress Counter System */}
      <div className="flex justify-between items-end w-full">
        <div className="font-mono text-[10px] tracking-widest text-[#5a5652]">
          STAGE_01 // ATMOSPHERE
        </div>
        <div 
          ref={counterRef} 
          className="font-mono text-4xl md:text-6xl font-light tracking-tighter text-[#e8e4dc] opacity-40 select-none"
        >
          {count}
        </div>
      </div>
    </div>
  );
}