'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const principles = [
  {
    num: '01',
    title: 'Atmosphere before function',
    body: "The first thing a user feels is the mood of an interface. Before they read anything, the color, weight, and spacing have already told them what kind of world they've entered."
  },
  {
    num: '02',
    title: 'Typography is the voice',
    body: "Font choice, size relationships, and letter spacing communicate personality before content does. I treat typography as an expressive force, not a holder for words."
  },
  {
    num: '03',
    title: 'Darkness is a texture',
    body: "Dark interfaces are not just aesthetic choices. When done right, they create depth, focus, and weight. Darkness lets light mean something."
  },
  {
    num: '04',
    title: 'Motion means something',
    body: "Transitions are narrative tools. A slow fade says something different than a sharp cut. Every piece of motion should have pacing, emphasis, and emotional punctuation."
  }
];

export default function MonologueSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper) return;

    // Calculate how far to move the wrapper horizontally
    const getScrollAmount = () => {
      let wrapperWidth = wrapper.scrollWidth;
      return -(wrapperWidth - window.innerWidth);
    };

    const tween = gsap.to(wrapper, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`, // The length of the scroll matches the horizontal width
        pin: true,
        scrub: 1, // Smooth scrubbing tied to scrollbar (adds weight)
        invalidateOnRefresh: true, // Recalculates on window resize
      }
    });

    return () => {
      tween.kill();
     ScrollTrigger.getAll().forEach((t: any) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-[#080808]">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[50vw] h-full bg-[#c8a96e] opacity-[0.015] blur-[100px] pointer-events-none" />

      {/* The Track that slides left */}
      <div 
        ref={wrapperRef} 
        className="flex h-full w-max items-center px-[10vw]"
      >
        {/* Intro Panel */}
        <div className="w-[80vw] md:w-[50vw] shrink-0 pr-12 md:pr-32">
          <p className="font-mono text-[10px] tracking-[0.25em] text-[#c8a96e] uppercase mb-8">
            [ SEC_002 // CREATIVE IDENTITY ]
          </p>
          <h2 className="font-serif text-4xl md:text-6xl text-[#e8e4dc] font-light leading-tight">
            Design is the <br/>
            <span className="italic text-[#9e9a92]">emotional temperature</span> <br/>
            of an experience.
          </h2>
        </div>

        {/* Philosophy Plaques */}
        {principles.map((item, index) => (
          <div 
            key={index} 
            className="w-[80vw] md:w-[40vw] h-[60vh] shrink-0 border border-[#c8a96e]/10 bg-[#0d0d0d]/50 backdrop-blur-sm p-10 md:p-16 flex flex-col justify-between mr-8 md:mr-16 relative group transition-colors duration-700 hover:bg-[#111111]/80"
          >
            <div className="font-mono text-[11px] tracking-widest text-[#5a5652] transition-colors duration-500 group-hover:text-[#c8a96e]">
              — {item.num}
            </div>
            
            <div>
              <h3 className="font-serif text-2xl md:text-3xl text-[#e8e4dc] italic mb-6">
                {item.title}
              </h3>
              <p className="font-sans text-sm md:text-base font-light text-[#9e9a92] leading-relaxed max-w-sm">
                {item.body}
              </p>
            </div>

            {/* Decorative corner accent */}
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#c8a96e]/30 m-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}