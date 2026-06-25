'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '@/components/Global/Magnetic';

const projects = [
  {
    num: '01',
    title: 'Spiderverse Multiverse HUD',
    desc: 'A futuristic cinematic UI concept inspired by the visual language of Into the Spider-Verse. Exploring multiverse storytelling through interface design.',
    tags: ['Cinematic UI', 'React', 'Motion Design'],
    status: 'In Progress',
    link: 'https://your-spiderverse-link.vercel.app',
    image: '/spiderverse.jpg' // <-- Connects to public/spiderverse.jpg
  },
  {
    num: '02',
    title: 'Kuro Cafe',
    desc: 'A dark aesthetic cafe landing page built around cinematic minimalism and Japanese-inspired visual identity. Typography-first responsive design.',
    tags: ['Japanese Minimalism', 'Tailwind', 'Dark UI'],
    status: 'Completed',
    link: 'https://your-kurocafe-link.vercel.app',
    image: '/kuro-cafe.jpg' // <-- Connects to public/kuro-cafe.jpg
  },
  {
    num: '03',
    title: 'Manga Studio',
    desc: 'An immersive manga-inspired interface using bold typographic systems and black-and-white visual storytelling.',
    tags: ['Manga Aesthetic', 'Typography', 'Immersive'],
    status: 'Completed',
    link: 'https://your-manga-link.vercel.app',
    image: '/manga-studio.png' // <-- Connects to public/manga-studio.png
  }
];

export default function ProjectArchive() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const images = gsap.utils.toArray('.parallax-container');
    images.forEach((container: any) => {
      // We animate the image inside the container for the parallax effect
      const img = container.querySelector('.parallax-img');
      gsap.to(img, {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t: any) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#080808] text-[#e8e4dc] py-32 px-6 md:px-16 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.25em] text-[#c8a96e] uppercase mb-16">
          [ SEC_003 // THE ARCHIVES ]
        </p>

        <div className="flex flex-col gap-24">
          {projects.map((project, idx) => (
            <div key={idx} className="group flex flex-col md:flex-row gap-12 md:gap-20 items-start border-t border-[#c8a96e]/10 pt-10">
              
              {/* Left: Metadata & Description */}
              <div className="w-full md:w-[40%] flex flex-col z-10">
                <div className="font-mono text-sm tracking-widest text-[#5a5652] mb-6">
                  {project.num} / <span className="text-[#c8a96e] text-[10px]">{project.status}</span>
                </div>
                
                <Magnetic>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-block w-fit">
                    <h3 className="font-serif text-3xl md:text-4xl font-light leading-tight mb-6 group-hover:text-[#c8a96e] transition-colors duration-500">
                      {project.title}
                    </h3>
                  </a>
                </Magnetic>

                <p className="font-sans text-[#9e9a92] text-sm md:text-base font-light leading-relaxed mb-8">
                  {project.desc}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="font-mono text-[9px] tracking-[0.15em] uppercase px-3 py-1 border border-[#5a5652]/40 text-[#5a5652]">
                      {tag}
                    </span>
                  ))}
                </div>

                <Magnetic>
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] tracking-[0.2em] text-[#e8e4dc] uppercase w-fit border-b border-[#c8a96e]/50 pb-1 hover:text-[#c8a96e] hover:border-[#c8a96e] transition-all duration-300 flex items-center gap-2"
                  >
                    View Live <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
                  </a>
                </Magnetic>
              </div>

              {/* Right: The Real Image Viewer */}
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={`View ${project.title} live`} 
                className="parallax-container w-full md:w-[60%] h-350px md:h-500px bg-[#050505] overflow-hidden relative border border-white/5 cursor-pointer block"
              >
                {/* The Image Container (taller than the wrapper to allow scrolling) */}
                <div className="parallax-img absolute top-[-15%] left-0 w-full h-[130%] transition-transform duration-700 group-hover:scale-105">
                  <Image 
                    src={project.image} 
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                    priority={idx === 0} // Pre-load the first image
                  />
                  {/* Subtle scanline overlay on top of the image to keep the texture */}
                  <div className="absolute inset-0 bg-scanlines mix-blend-overlay opacity-30 pointer-events-none" />
                </div>
                
                {/* Vignette Shadow */}
                <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(8,8,8,0.9)] pointer-events-none transition-opacity duration-700 group-hover:opacity-0" />
              </a>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}