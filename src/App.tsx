import { useSmoothScroll } from './hooks/useSmoothScroll';
import CursorField from './components/CursorField';
import HeroSection from './components/HeroSection';
import WhySection from './components/WhySection';
import TimelineSection from './components/TimelineSection';
import FinalSection from './components/FinalSection';

export default function App() {
  useSmoothScroll();

  return (
    <>
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

      {/* Main content */}
      <main className="relative z-10">
        <HeroSection />
        <WhySection />
        <TimelineSection />
        <FinalSection />
      </main>
    </>
  );
}
