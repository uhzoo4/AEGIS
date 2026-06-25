import { useRef } from 'react';
import { gsap, SplitText, useGSAP, ScrollTrigger } from '../utils/gsap';
import { useSectionContext } from '../hooks/useSectionContext';

const NOISE_WORDS = ['Physics', 'Hackathon', 'Chemistry', 'Assignments', 'Sleep', 'Deadlines', 'Projects', 'Exams'];

export default function SignalTrack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const signalRef = useRef<HTMLDivElement>(null);
  const { setActiveSection } = useSectionContext();

  useGSAP(() => {
    if (!containerRef.current || !noiseRef.current || !signalRef.current) return;

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top center',
      onEnter: () => setActiveSection('understanding'),
      onEnterBack: () => setActiveSection('understanding'),
    });

    const noiseElements = gsap.utils.toArray('.noise-word') as HTMLElement[];
    const splitSignal = new SplitText(signalRef.current.querySelector('h2'), { type: 'words,chars', charsClass: 'char' } as any);

    // Initial state
    gsap.set(noiseElements, { opacity: 0 });
    gsap.set(splitSignal.chars, { opacity: 0, scale: 0.8, filter: 'blur(10px)' });
    gsap.set('.signal-sub', { opacity: 0, y: 20 });
    gsap.set(signalRef.current, { opacity: 0 });

    // Scatter noise words randomly across the screen initially
    noiseElements.forEach((el) => {
      gsap.set(el, {
        x: (Math.random() - 0.5) * window.innerWidth * 0.8,
        y: (Math.random() - 0.5) * window.innerHeight * 0.8,
        scale: 0.5 + Math.random() * 1.5,
        rotation: (Math.random() - 0.5) * 45,
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1, // Smooth scrub to feel systemically precise
      }
    });

    // 1. Fade in the scattered noise words
    tl.to(noiseElements, {
      opacity: 0.6,
      duration: 1,
      ease: 'aegis-resolve'
    })
    // 2. Collapse all noise into the center
    .to(noiseElements, {
      x: 0,
      y: 0,
      scale: 0,
      rotation: 0,
      opacity: 0,
      duration: 2,
      ease: 'aegis-pressure',
      stagger: { each: 0.05, from: 'edges' }
    })
    // 3. Reveal the structured signal from the collapse point
    .set(signalRef.current, { opacity: 1 })
    .to(splitSignal.chars, {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 2,
      ease: 'aegis-resolve',
      stagger: 0.05
    }, '-=0.5')
    .to('.signal-sub', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'aegis-resolve'
    }, '-=1');

    return () => {
      splitSignal.revert();
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="understanding" className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 bg-void z-10 overflow-hidden">
      
      {/* Noise Field */}
      <div ref={noiseRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {NOISE_WORDS.map((word, i) => (
          <div 
            key={i} 
            className="noise-word absolute font-mono text-xl md:text-4xl text-text-secondary opacity-0 whitespace-nowrap"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-signal)' }}
          >
            {word}
          </div>
        ))}
      </div>

      {/* Structured Signal */}
      <div ref={signalRef} className="z-10 text-center pointer-events-none w-full">
        <h2 className="font-mono text-3xl md:text-5xl lg:text-6xl tracking-[0.1em] md:tracking-[0.2em] uppercase text-signal leading-tight max-w-4xl mx-auto">
          COGNITIVE OVERLOAD DETECTED
        </h2>
        <div className="signal-sub">
          <div className="mt-8 w-24 h-px bg-signal/50 mx-auto" />
          <p className="mt-4 text-sm text-text-tertiary tracking-widest uppercase font-mono">
            Noise parsed. Trajectory mapped.
          </p>
        </div>
      </div>

    </section>
  );
}
