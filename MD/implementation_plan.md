# AEGIS — Cinematic Pre-Development Landing Page

A digital artifact representing preparation, curiosity, and anticipation. The page should feel like an AI system waiting for activation — not a website waiting for users.

## Visual Reference

The cursor system is inspired by the [triangle pattern generator](file:///d:/WebProjects/AEGIS/tools/js/script.js) from the tools folder — a Delaunay-triangulated mesh with FSS lighting that follows the mouse. We'll reimplement this as a lightweight Canvas2D particle system with triangle connections and mouse-attracted light points.

---

## Proposed Changes

### 1. Project Scaffold

#### [NEW] Vite + React + TypeScript project

Initialize with `npx -y create-vite@latest ./ --template react-ts` inside `d:\WebProjects\AEGIS`.

Install dependencies:
```
npm install tailwindcss @tailwindcss/vite framer-motion lenis gsap
```

> [!NOTE]
> Tailwind v4 is used per the user's request. We use `@tailwindcss/vite` plugin for zero-config integration. No `tailwind.config` file needed — all theming via CSS `@theme`.

---

### 2. Folder Structure

```
src/
├── components/
│   ├── CursorField.tsx          # Canvas-based particle cursor system
│   ├── HeroSection.tsx          # Main hero with AEGIS title
│   ├── WhySection.tsx           # "Why AEGIS?" glass cards
│   ├── TimelineSection.tsx      # Vertical timeline progression
│   ├── FinalSection.tsx         # Closing manifesto
│   ├── StatusIndicator.tsx      # Pulsing "PREPARATION PHASE" badge
│   └── AnimatedLine.tsx         # Thin animated horizontal line
├── hooks/
│   ├── useSmoothScroll.ts       # Lenis initialization
│   ├── useMousePosition.ts      # Smoothly interpolated mouse tracking
│   └── useScrollReveal.ts       # Framer Motion viewport trigger
├── styles/
│   └── index.css                # Tailwind directives + @theme + global styles
├── App.tsx
└── main.tsx
```

---

### 3. Design System (`index.css`)

#### [NEW] [index.css](file:///d:/WebProjects/AEGIS/src/styles/index.css)

- **Tailwind v4** with `@import "tailwindcss"` and `@theme` block
- Custom properties:
  - `--color-void`: `#050505` (primary background)
  - `--color-ash`: `#0a0a0a` (card backgrounds)
  - `--color-signal`: `#7fdbca` (seafoam accent)
  - `--color-signal-dim`: `#5fb8a5` (muted accent)
  - `--color-ghost`: `rgba(127, 219, 202, 0.06)` (glass borders)
  - `--color-text-primary`: `#e8e8e8`
  - `--color-text-secondary`: `#6b6b6b`
- Google Fonts: `Cormorant Garamond` (hero serif), `Inter` (body)
- Global `cursor: none` on body
- Smooth `::selection` styling with accent color
- Custom keyframes: `breathe` (slow scale pulse), `drift` (line animation), `pulse-dot` (status indicator)

---

### 4. Cursor Particle System

#### [NEW] [CursorField.tsx](file:///d:/WebProjects/AEGIS/src/components/CursorField.tsx)

The crown jewel. A full-viewport `<canvas>` rendered at 60fps using `requestAnimationFrame`.

**Architecture:**
- **~40 particles** (lightweight for integrated graphics) as small luminous points
- Each particle has: `x, y, vx, vy, baseX, baseY, opacity, size`
- **Mouse attraction**: particles within 200px radius are gently pulled toward cursor (spring force, k ≈ 0.015)
- **Repulsion**: when mouse is very close (< 60px), particles push away softly
- **Inertia**: velocity is dampened per frame (`vx *= 0.95`)
- **Drift**: when mouse is idle (> 1.5s no movement), particles slowly drift away from cursor with gentle sine-wave oscillation back toward `baseX/baseY`
- **Triangle connections**: Delaunay triangulation is **not** recomputed per frame (too expensive). Instead, we draw lines between particles within a distance threshold (~150px), with opacity proportional to distance. This creates ephemeral triangle-like geometries.
- **Colors**: Lines and particles use `rgba(127, 219, 202, alpha)` — the seafoam accent at varying opacity
- **Smooth interpolation**: mouse position is lerped (`current += (target - current) * 0.08`) for buttery movement

#### [NEW] [useMousePosition.ts](file:///d:/WebProjects/AEGIS/src/hooks/useMousePosition.ts)

Returns `{ x, y, isIdle }` with:
- Raw mouse coordinates tracked via `mousemove`
- Smooth interpolation via `requestAnimationFrame`
- Idle detection after 1500ms of no movement

---

### 5. Smooth Scrolling

#### [NEW] [useSmoothScroll.ts](file:///d:/WebProjects/AEGIS/src/hooks/useSmoothScroll.ts)

- Initializes `Lenis` with `duration: 1.2`, `easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`
- Connects to `requestAnimationFrame` loop
- Cleanup on unmount

---

### 6. Sections

#### [NEW] [HeroSection.tsx](file:///d:/WebProjects/AEGIS/src/components/HeroSection.tsx)

- **"AEGIS"** in `Cormorant Garamond`, ~8vw font size, letter-spacing 0.3em, uppercase
- Slow breathing animation (CSS `animation: breathe 6s ease-in-out infinite`) — subtle 1.02 scale oscillation
- **Tagline**: "Awaiting the signal." — Inter, light weight, text-secondary, fade-in with 0.8s delay
- **Sub-text**: "Official problem statement releases soon." — smaller, dimmer
- **StatusIndicator**: `● PREPARATION PHASE` — pulsing cyan dot + monospace label
- **AnimatedLine**: thin 1px gradient line that sweeps left-to-right infinitely below the hero content, width ~60vw, very low opacity

#### [NEW] [WhySection.tsx](file:///d:/WebProjects/AEGIS/src/components/WhySection.tsx)

- Section title: "Why AEGIS?" — Cormorant Garamond
- Three glass cards: **Observe**, **Adapt**, **Protect**
- Each card has:
  - Glass effect: `backdrop-blur-md`, `bg-white/[0.03]`, `border border-white/[0.06]`
  - A single word title + 1-2 line description
  - Staggered scroll-triggered entrance (Framer Motion `whileInView` with `staggerChildren: 0.15`)
  - Animations: `opacity: 0→1`, `y: 40→0`, `filter: blur(8px)→blur(0px)`, `duration: 0.8s`

#### [NEW] [TimelineSection.tsx](file:///d:/WebProjects/AEGIS/src/components/TimelineSection.tsx)

- Vertical line on the left with milestone nodes
- Items:
  - Registration ✓ (completed)
  - Research ✓ (completed)
  - Preparation ✓ (completed)
  - Problem Statement — Pending (accent color, pulsing)
  - Build Phase — Awaiting (dimmed)
- Each item appears on scroll with fade + translateY
- Completed items use `text-signal`, pending uses pulse animation, awaiting is `text-secondary`

#### [NEW] [FinalSection.tsx](file:///d:/WebProjects/AEGIS/src/components/FinalSection.tsx)

- Large centered text stack:
  ```
  Build.
  Adapt.
  Awaken.
  ```
  Each word on its own line, Cormorant Garamond, staggered fade-in on scroll
- Footer metadata (Inter, small, secondary):
  ```
  Vibe2Ship 2026 · Google AI Studio · Solo Developer · India
  ```

---

### 7. Animation Rules (Global)

| Rule | Implementation |
|------|---------------|
| No animation < 0.8s | All Framer Motion `duration` ≥ 0.8 |
| No bounce/elastic | `ease: [0.25, 0.1, 0.25, 1]` (cubic-bezier) or `"easeOut"` only |
| Fade + blur + translate | Every reveal: `opacity: 0→1`, `y: 30-50→0`, `filter: blur(6-10px)→blur(0px)` |
| Breathing feel | Hero title has slow scale pulse; status dot pulses; timeline pending item pulses |

---

### 8. Performance Strategy

| Constraint | Solution |
|-----------|----------|
| Intel i5 + Iris Xe | Canvas 2D only — no WebGL, no Three.js |
| 60fps target | ~40 particles max, no Delaunay recomputation, simple distance-based line drawing |
| No heavy shaders | Pure CSS animations for UI elements, canvas only for cursor |
| Memory | Single canvas, reused arrays, no per-frame allocations |
| Responsive | Canvas resizes on window resize (debounced 200ms) |

---

### 9. App Assembly

#### [NEW] [App.tsx](file:///d:/WebProjects/AEGIS/src/App.tsx)

```tsx
<CursorField />        {/* Fixed, full-viewport canvas behind everything */}
<main>
  <HeroSection />
  <WhySection />
  <TimelineSection />
  <FinalSection />
</main>
```

`useSmoothScroll()` called at top-level.

---

### 10. Responsive Design

- Hero font scales: `clamp(3rem, 8vw, 10rem)`
- Cards stack vertically on mobile (< 768px)
- Timeline stays left-aligned, narrower padding on mobile
- Cursor field still works on desktop; hidden on touch devices (`pointer: coarse` media query)
- All sections use `max-w-5xl mx-auto` with generous padding

---

## Verification Plan

### Build Verification
```bash
npm run build
```
Ensures zero TypeScript errors and clean production bundle.

### Dev Server
```bash
npm run dev
```
Visual inspection in browser for:
- 60fps canvas animation
- Smooth Lenis scrolling
- All four sections rendering correctly
- Glass card effects
- Timeline progression
- Responsive at 768px and 375px breakpoints
- Cursor particle behavior (attraction, repulsion, drift, idle)

### Performance
- Chrome DevTools Performance tab: verify < 16ms frame time
- No jank during scroll
- No memory leaks (heap snapshot over 60s)
