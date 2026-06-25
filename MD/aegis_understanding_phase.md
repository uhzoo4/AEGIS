# AEGIS Phase 2: Understanding

## 1. Emotional Flow Analysis

### What feels static & disconnected
Currently, the transition from `PressureHero` into `WhySection` is a massive emotional drop. `PressureHero` builds intense, visceral tension ("YOU ARE OVERLOADED"), but the user is immediately met with static, generic marketing copy ("Why AEGIS?"). The system presence vanishes completely. AEGIS stops feeling like an active intelligence and reverts to feeling like a standard landing page. 

### What lacks system presence
We have the `SectionIndex` globally mounted, but the sections themselves (`WhySection`, `TimelineSection`) don't react to it. The system isn't *showing* that it understands the pressure it just diagnosed.

### What the next emotional beat should be
**Understanding.** Before AEGIS can intervene or predict, it must prove that it *sees the specific signals* causing the pressure. The user must feel observed and understood.

## 2. Implementation Plan

### Exact next phase
**Phase 2: Understanding (The Signal Track)**

### Files to create
*   `src/components/SignalTrack.tsx`

### Files to modify
*   `src/App.tsx` (To insert `SignalTrack` and wire `ScrollTrigger` to `SectionContext`)

### Emotional purpose
To visualize the "noise" (cognitive overload, deadline collisions, declining energy) and show AEGIS actively parsing it. It validates the user's overwhelming state before proposing a solution.

### Technical approach
1.  **Component:** Create `SignalTrack.tsx`.
2.  **Visuals:** A stark, terminal-like interface that visually lists the detected signals ("DEADLINE COLLISION", "MOMENTUM LOSS"). 
3.  **Motion (GSAP):** Use `ScrollTrigger` to pin the section and reveal the signals sequentially using `SplitText` with `mask: true` and the `aegis-resolve` ease, signifying the system bringing order to the chaos.
4.  **State Wiring:** Wire `ScrollTrigger` callbacks across the sections (`PressureHero`, `SignalTrack`, `WhySection`) to update the global `useSectionContext` state, ensuring the `SectionIndex` reads `[ 02 // UNDERSTANDING ]` dynamically.
