import { createContext, useContext, useState } from 'react';

export type SectionState = 'pressure' | 'understanding' | 'prediction' | 'intervention' | 'recovery';

interface SectionContextType {
  activeSection: SectionState;
  setActiveSection: (section: SectionState) => void;
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export function useSectionContext() {
  const context = useContext(SectionContext);
  if (context === undefined) {
    throw new Error('useSectionContext must be used within a SectionProvider');
  }
  return context;
}

export function SectionProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionState>('pressure');

  return (
    <SectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </SectionContext.Provider>
  );
}
