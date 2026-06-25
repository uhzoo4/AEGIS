'use client';

import { useState } from 'react';
import OpeningSequence from '@/components/Loader/OpeningSequence';
import HeroSection from '@/components/Hero/HeroSection';
import IntroSection from '@/components/About/IntroSection'; // <-- Import the Intro
import MonologueSection from '@/components/Identity/MonologueSection';
import ProjectArchive from '@/components/Projects/ProjectArchive';
import Manifesto from '@/components/Outro/Manifesto';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && <OpeningSequence onComplete={() => setIsLoaded(true)} />}

      <main className={`w-full relative transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        
        {isLoaded && <HeroSection />}
        
        {/* The new "Who Am I" block */}
        {isLoaded && <IntroSection />}
        
        {isLoaded && <MonologueSection />}
        {isLoaded && <ProjectArchive />}
        {isLoaded && <Manifesto />}
        
      </main>
    </>
  );
}