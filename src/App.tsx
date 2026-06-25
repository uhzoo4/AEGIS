import { useState, useCallback } from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { SectionProvider } from './hooks/useSectionContext';
import SectionIndex from './components/SectionIndex';
import CursorField from './components/CursorField';
import HeroSection from './components/HeroSection';
import PressureHero from './components/PressureHero';
import WhySection from './components/WhySection';
import TimelineSection from './components/TimelineSection';
import FinalSection from './components/FinalSection';
import SysInit from './components/SysInit';
const DEV_MODE = true;

export default function App() {
  useSmoothScroll();

  // If already played this session, skip. Otherwise false.
  const [hasPlayedInit] = useState(() => {
    try {
      return !DEV_MODE && sessionStorage.getItem('aegis_sys_init') === 'true';
    } catch (e) {
      return false; // Fallback for strict privacy settings that block sessionStorage
    }
  });

  // Determines when to mount the actual content. If skipped, mount immediately.
  const [showContent, setShowContent] = useState(hasPlayedInit);
  
  // Determines when to completely unmount the SysInit component.
  const [initUnmounted, setInitUnmounted] = useState(hasPlayedInit);

  // Stable reference to prevent SysInit re-renders and timeline restarts
  const handleReveal = useCallback(() => {
    setShowContent(true);
  }, []);

  // Stable reference to prevent SysInit re-renders
  const handleComplete = useCallback(() => {
    try {
      sessionStorage.setItem('aegis_sys_init', 'true');
    } catch (e) {
      // Ignore storage errors
    }
    setInitUnmounted(true);
  }, []);

  return (
    <>
      {!initUnmounted && (
        <SysInit onReveal={handleReveal} onComplete={handleComplete} />
      )}

      {showContent && (
        <SectionProvider>
          {/* Cursor particle field — fixed, behind everything interactive */}
          <CursorField />

          {/* Background gradient overlay for depth */}
          <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 50% 0%, rgba(127, 219, 202, 0.015) 0%, transparent 60%),
                radial-gradient(ellipse 60% 40% at 50% 100%, rgba(127, 219, 202, 0.01) 0%, transparent 50%)
              `,
            }}
            aria-hidden="true"
          />

          <SectionIndex />

          {/* Main content */}
          <main className="relative z-10">
            <HeroSection />
            <PressureHero />
            <WhySection />
            <TimelineSection />
            <FinalSection />
          </main>
        </SectionProvider>
      )}
    </>
  );
}
