import { useEffect, useRef } from 'react';
import { gsap } from '../utils/gsap';

interface SysInitProps {
  onReveal: () => void;
  onComplete: () => void;
}

export default function SysInit({ onReveal, onComplete }: SysInitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const text4Ref = useRef<HTMLDivElement>(null);

  // Use refs to stabilize callbacks and prevent GSAP from restarting on re-renders
  const onRevealRef = useRef(onReveal);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onRevealRef.current = onReveal;
    onCompleteRef.current = onComplete;
  }, [onReveal, onComplete]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => onCompleteRef.current(),
      });

      // 0-1s: Black screen (delay built into the timeline start times)

      // Beat 1: [ SYS.AEGIS // AWAKE ]
      // Fade in (0.4s) -> Hold (0.6s) -> Fade out (0.4s)
      tl.to(text1Ref.current, { opacity: 1, duration: 0.4, ease: 'aegis-resolve' }, 0.8)
        .to(text1Ref.current, { opacity: 0, duration: 0.4, ease: 'aegis-resolve' }, 1.8)

      // Beat 2: SIGNAL DETECTED
      // Slightly sharper entrance
        .to(text2Ref.current, { opacity: 1, duration: 0.3, ease: 'aegis-resolve' }, 2.4)
        .to(text2Ref.current, { opacity: 0, duration: 0.4, ease: 'aegis-resolve' }, 3.2)

      // Beat 3: ASSESSING PRESSURE
      // Longer hold because reading "pressure" implies calculation
        .to(text3Ref.current, { opacity: 1, duration: 0.6, ease: 'aegis-resolve' }, 3.8)
        .to(text3Ref.current, { opacity: 0, duration: 0.4, ease: 'aegis-resolve' }, 4.8)

      // Beat 4: [ INTERVENTION READY ]
      // Quick, resolved finish
        .to(text4Ref.current, { opacity: 1, duration: 0.4, ease: 'aegis-resolve' }, 5.2)
        .to(text4Ref.current, { opacity: 0, duration: 0.4, ease: 'aegis-resolve' }, 6.2)

      // At 6.2s, trigger the reveal of the underlying content
        .call(() => onRevealRef.current(), [], 6.2)

      // 6.2-7.2s: Fade out the black screen
        .to(containerRef.current, { opacity: 0, duration: 1, ease: 'aegis-resolve' }, 6.2);
        
    }, containerRef);

    return () => ctx.revert();
  }, []); // Empty dependency array ensures this timeline ONLY runs once per mount

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-void font-mono text-xs md:text-sm tracking-[0.25em] md:tracking-[0.3em] uppercase pointer-events-none"
    >
      <div ref={text1Ref} className="absolute opacity-0" style={{ color: 'rgba(127, 219, 202, 0.4)' }}>
        [ SYS.AEGIS // AWAKE ]
      </div>
      <div ref={text2Ref} className="absolute opacity-0" style={{ color: 'rgba(127, 219, 202, 0.4)' }}>
        SIGNAL DETECTED
      </div>
      <div ref={text3Ref} className="absolute opacity-0" style={{ color: 'rgba(127, 219, 202, 0.4)' }}>
        ASSESSING PRESSURE
      </div>
      <div ref={text4Ref} className="absolute opacity-0" style={{ color: 'rgba(127, 219, 202, 0.4)' }}>
        [ INTERVENTION READY ]
      </div>
    </div>
  );
}
