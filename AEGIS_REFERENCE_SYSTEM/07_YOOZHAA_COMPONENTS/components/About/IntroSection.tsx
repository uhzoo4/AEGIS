'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap'; // <-- Official package
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // <-- Official package

// Register the plugin right here to bypass all folder pathing issues
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

// ... (keep the rest of your component exactly the same)
  useEffect(() => {
    // If textRef.current exists, animate its children
    if (textRef.current) {
      gsap.fromTo(textRef.current.children, 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      );
    }
    
    // Cleanup function to prevent ghost animations
    return () => {
      ScrollTrigger.getAll().forEach((t: any) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#080808] py-32 px-6 flex justify-center border-t border-white/5">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Left: Section Label & Meta */}
        <div className="md:col-span-4 flex flex-col justify-start">
          <p className="font-mono text-[10px] tracking-[0.25em] text-[#c8a96e] uppercase mb-8">
            [ SEC_001.5 // THE DIRECTOR ]
          </p>
          <div className="font-mono text-xs tracking-widest text-[#5a5652] uppercase flex flex-col gap-2">
            <span>Location: India</span>
            <span>Status: Higher Secondary / PCM</span>
            <span>Track: Self-Taught Frontend</span>
          </div>
        </div>

        {/* Right: The Story */}
        <div ref={textRef} className="md:col-span-8 flex flex-col gap-8">
          <h2 className="font-serif text-3xl md:text-5xl text-[#e8e4dc] font-light leading-tight">
            A student who thinks like a <em className="text-[#c8a96e] italic">director.</em>
          </h2>
          
          <p className="font-sans text-[#9e9a92] font-light leading-relaxed text-lg max-w-2xl">
            I didn't get into code because I wanted to build apps. I got into it because I saw what the web could feel like — cinematic, atmospheric, heavy with intention — and I wanted to make things that feel that way too. 
          </p>
          
          <p className="font-sans text-[#9e9a92] font-light leading-relaxed text-lg max-w-2xl">
            When I build something, I'm thinking about how it <strong className="text-[#e8e4dc] font-normal">breathes</strong>. How the typography sits on the screen. How the darkness feels like texture, not emptiness. How a transition becomes a moment.
          </p>
        </div>

      </div>
    </section>
  );
}