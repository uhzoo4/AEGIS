'use client';
// 1. Import at the top
import Magnetic from '@/components/Global/Magnetic';

// ... (keep the rest the same until the footer section) ...

      {/* The Cinematic Footer */}
      <footer className="w-full max-w-6xl mt-48 flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-8 pb-8 gap-6">
        <div className="font-serif italic text-2xl text-[#5a5652]">
          Creative Developer.
        </div>
        
        <div className="flex gap-8 font-mono text-[10px] tracking-widest text-[#5a5652] uppercase">
          <Magnetic><a href="#" className="hover:text-[#c8a96e] transition-colors block p-2">LinkedIn</a></Magnetic>
          <Magnetic><a href="#" className="hover:text-[#c8a96e] transition-colors block p-2">GitHub</a></Magnetic>
          <Magnetic><a href="#" className="hover:text-[#c8a96e] transition-colors block p-2">Contact</a></Magnetic>
        </div>

        <div className="font-mono text-[10px] tracking-widest text-[#5a5652] uppercase">
          India // 2026
        </div>
      </footer>

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const words = [
  "Cinematic.",
  "Atmospheric.",
  "Intentional.",
  "Alive.",
  "Immersive.",
  "Yours."
];

export default function Manifesto() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // A slow, heavy fade-in as the user scrolls to the bottom
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: 'cinematicEase',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    );
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-[#080808] pt-32 pb-16 px-6 flex flex-col items-center justify-center border-t border-[#c8a96e]/10">
      
      <p className="font-mono text-[10px] tracking-[0.25em] text-[#c8a96e] uppercase mb-16">
        [ SEC_004 // THE VISION ]
      </p>

      {/* The Interactive Manifesto Text */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 max-w-5xl group cursor-default">
        {words.map((word, idx) => (
          <span 
            key={idx}
            className="font-serif text-[clamp(3rem,8vw,8rem)] italic font-light leading-none text-[#5a5652] transition-colors duration-700 hover:text-[#e8e4dc]! group-hover:text-[#1a1a1a]"
          >
            {word}
          </span>
        ))}
      </div>

      <p className="font-sans font-light text-[#9e9a92] mt-16 text-center max-w-md leading-relaxed">
        Every project I build carries a specific feeling. That feeling is the brief. Everything else is craft.
      </p>

      {/* The Cinematic Footer */}
      <footer className="w-full max-w-6xl mt-48 flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-8 pb-8 gap-6">
        <div className="font-serif italic text-2xl text-[#5a5652]">
          Creative Developer.
        </div>
        
        <div className="flex gap-8 font-mono text-[10px] tracking-widest text-[#5a5652] uppercase">
          <a href="#" className="hover:text-[#c8a96e] transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-[#c8a96e] transition-colors">GitHub</a>
          <a href="#" className="hover:text-[#c8a96e] transition-colors">Contact</a>
        </div>

        <div className="font-mono text-[10px] tracking-widest text-[#5a5652] uppercase">
          India // 2026
        </div>
      </footer>

    </section>
  );
}