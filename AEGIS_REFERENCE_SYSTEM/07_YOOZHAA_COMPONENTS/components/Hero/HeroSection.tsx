'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const title1Ref = useRef<HTMLDivElement>(null);
  const title2Ref = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for the cinematic spotlight
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // The Entry Choreography
    const tl = gsap.timeline({ delay: 0.2 }); // Slight delay to let the loader fade out completely

    gsap.set([title1Ref.current, title2Ref.current], { y: '120%' });
    gsap.set([subtextRef.current, badgeRef.current], { opacity: 0, y: 20 });

    tl.to(title1Ref.current, {
      y: '0%',
      duration: 1.6,
      ease: 'cinematicEase',
    })
    .to(title2Ref.current, {
      y: '0%',
      duration: 1.6,
      ease: 'cinematicEase',
    }, '-=1.2')
    .to(badgeRef.current, {
      opacity: 0.8,
      y: 0,
      duration: 1,
      ease: 'power2.out',
    }, '-=1.0')
    .to(subtextRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power2.out',
    }, '-=0.8');

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden px-6"
    >
      {/* 1. Reactive Spotlight Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen z-0"
        animate={{
          background: `radial-gradient(circle 800px at ${mousePos.x}px ${mousePos.y}px, rgba(200, 169, 110, 0.07), transparent 80%)`
        }}
        transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
      />

      {/* 2. Content Architecture */}
      <div className="z-10 flex flex-col items-center w-full max-w-6xl">
        
        {/* Technical Badge */}
        <div 
          ref={badgeRef}
          className="font-mono text-[9px] md:text-[11px] tracking-[0.4em] text-[#c8a96e] uppercase mb-12 will-change-transform"
        >
          [ SEC_001 // THE ESTABLISHING SHOT ]
        </div>

        {/* Massive Typography */}
        <h1 className="font-serif text-[clamp(4rem,12vw,12rem)] leading-[0.85] tracking-tighter text-[#e8e4dc] font-light flex flex-col items-center select-none">
          <div className="overflow-hidden pb-4 md:pb-8">
            <div ref={title1Ref} className="will-change-transform pr-4">Creative</div>
          </div>
          <div className="overflow-hidden pb-4 md:pb-8">
            <div ref={title2Ref} className="italic text-[#c8a96e] will-change-transform pr-4">Developer.</div>
          </div>
        </h1>

        {/* Atmospheric Subtext */}
        <div 
          ref={subtextRef} 
          className="mt-16 md:mt-24 max-w-xl border-l border-[#c8a96e]/30 pl-6 md:pl-8 self-center md:self-end mr-0 md:mr-24"
        >
          <p className="font-serif text-xl md:text-3xl italic text-[#9e9a92] font-light leading-relaxed">
            I don&apos;t build websites. <br />
            I build <strong className="text-[#e8e4dc] font-normal">worlds</strong>.
          </p>
          <div className="flex gap-6 mt-8 font-mono text-[10px] tracking-widest text-[#5a5652] uppercase">
            <span>Frontend Architecture</span>
            <span>Motion Systems</span>
          </div>
        </div>

      </div>
    </section>
  );
}