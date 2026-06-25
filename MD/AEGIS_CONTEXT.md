# AEGIS
## Creative & Technical Dissection of Reference Systems
### A design, motion, and interaction architecture for "The Intelligence Between Intention and Action"

Prepared as a foundation, not a template. Every reference below was opened up for its underlying *mechanism*, not its surface. Nothing here should be recognizable as its source once it's wearing AEGIS's typography and palette — if it is, the extraction failed.

---

## 0. The brief, restated in engineering terms

AEGIS is not a dashboard, a SaaS shell, a chatbot, or a to-do list. It is the system that lives in the gap between *intention* and *action* — and its entire visual and motion language has one job: perform a five-beat emotional arc before a single feature is explained.

**Pressure → Understanding → Prediction → Intervention → Recovery**

Before a visitor believes AEGIS is *useful*, they need to feel it is *paying attention*. Feeling observed before feeling helped is the hardest sequencing problem in interface design — and it's exactly what six of the seven references below were independently solving, in unrelated domains (an editorial/fashion agency, a moody black-and-white Bushido-and-Mt.-Fuji photography site, a generic mask-reveal preloader, a parallax-tutorial build, a gaming-metaverse launch, and a cinematic developer portfolio). None of them are about productivity software. All of them are about making someone *feel* something before they read a word of copy. That feeling-first sequencing is the one thing worth taking from every single one of them.

---

## 1. Reference Dissection

Each reference is broken into its systems (typography, hero, loader, reveal, scroll, cursor, motion, pacing, interaction philosophy), then judged on what it's actually worth to AEGIS.

### 1.1 — OBYS — Editorial Typography & Cursor Culture

**What it is:** An editorial/agency-style site built on the classic "Obys Agency" interaction vocabulary — dual-font display typography, a cursor that behaves like a second UI layer, and image-on-hover storytelling.

**Systems observed (from the actual code):**
- **Typography** — Two serif families (`silkSerif`, `silkSerifReg`) paired against two grotesk weights (`PlainReg`, `plainLight`). Display headlines (`.title`) are set in uppercase with tight `105%` line-height; a numeral/index column (`.counter`) is set in the serif at `line-height: 1`, doing the classic agency move of pairing *index numbers* in serif against *titles* in grotesk to imply editorial pedigree.
- **Cursor** — A two-part fixed-position cursor: a small solid pointer (`.fls-cursor__pointer`) and a larger, slower "shadow" ring (`.fls-cursor__shadow`) that **continuously rotates** via a 5s linear CSS animation on its border. State is driven entirely by CSS custom properties (`--cursor-scale`, swapped via `.--hover` / `.--active` classes), so the *visual* scale change is GPU-cheap — only a `transform: scale(var(...))` — while JS only ever writes `translate3d` on `mousemove`. A `[data-cursor-skip]` attribute lets specific zones (e.g. embedded video) opt out and restore the system cursor.
- **Magnetic system** — A production-grade RAF-driven magnetic effect (`data-fls-magnet`), config-driven via data attributes (`max`, `scale`, `rotate`, `ease`, `target`). It computes pull as a function of distance-from-center clamped to a max radius, optionally rotates proportional to horizontal offset, lerps toward the target every frame, and **kills its own RAF loop the moment it settles** (`Math.abs(ex) < 0.1 …`) rather than running forever. It also respects `prefers-reduced-motion` by swapping to a plain CSS transition.
- **Text-swap hover** — A per-character "typed swap" effect (`data-fls-typed`): every character is duplicated into a base layer and an "alt" layer (skewed via `skewX`), each character gets its own `transition-delay` based on stagger position, and hovering cross-fades/slides between the two layers character-by-character. Uses `Intl.Segmenter` for correct grapheme splitting (so emoji/diacritics don't break).
- **The "flag" cursor-follow image** — The single most technically ambitious thing in any reference here: hovering specific words (`.hero__word--flag-target`) spawns a **Three.js WebGL plane** with a custom vertex shader that deforms the image like fabric in wind, driven by cursor *velocity* (`dx/dy` between frames), not just position. The plane lerps toward the cursor, fades in/out, and even has a tiny parallax offset tied to global mouse position.
- **Scroll-direction-aware indicator** — A "scroll down" ticker that fades out the instant the user scrolls past a 10px threshold, using a single global `ScrollTrigger` (not one per element) broadcasting delta-Y to all indicator instances via a stored callback — a smart pattern for avoiding N separate scroll listeners.

**Why it's emotionally effective:** Everything responds to you specifically — the cursor knows what's beneath it, headlines swap when you approach them, an image is *summoned* by your hover. It manufactures the feeling of "this thing notices me," which is precisely AEGIS's required first beat (*observed*).

**Why it's memorable:** The flag-shader hover effect. Nobody forgets the first time an image visually reacts to the *speed* of their cursor, not just its position.

**Extract:** The dual-layer rotating-ring cursor architecture (cheap, CSS-variable-driven). The self-terminating RAF magnetic-pull pattern. The single-global-ScrollTrigger-broadcast pattern for anything that needs scroll delta. The principle of *velocity-reactive* motion (not just position-reactive) — this is the actual transferable idea behind the flag shader, even if AEGIS never touches WebGL.

**Ignore:** The literal Three.js fabric shader (gorgeous, but it's a fashion-editorial flourish with no narrative purpose in a productivity-intelligence product — it would read as "this AI is showing off," which directly undercuts the "calm authority" goal). The serif/grotesk *index-number* agency aesthetic — too fashion-house for AEGIS's register.

**Implementation difficulty:** Cursor + magnet system = low-medium (a few hundred lines, no dependencies beyond RAF). Text-swap = medium (grapheme handling). Flag shader = high (Three.js, custom GLSL, texture preloading) — and explicitly **not recommended** for AEGIS (see above).

**React strategy:** Port the cursor and magnet systems as two small singleton hooks (`useCursor()`, `useMagnetic(ref, opts)`) living outside React's render cycle — write directly to `style.transform` in a RAF loop, never through `useState`, exactly like the vanilla version. This is one of the few places where *not* using Framer Motion's state-driven model is the right call, because per-frame `setState` for a cursor will visibly jank under React's reconciliation.

---

### 1.2 — SAMURAI — Loader, Immersion, Atmosphere

**What it is:** A minimal-CSS, JS-driven loader-gate experience built around moody black-and-white photography — a kendoka gripping a katana in a wooden dojo, fog-wrapped traditional gate architecture, Mt. Fuji in silhouette, all desaturated and overlaid with large kanji typography — paired with a click-through overlay gate and full-bleed pinned sections.

**Systems observed:**
- **Atmosphere via photography, not effects** — the six preloader images (`preloader-1` through `preloader-6`) are themselves the entire mood: high-contrast black-and-white, environmental fog/mist used as natural depth-of-field, traditional Japanese architecture and a single human figure, never more than one focal subject per frame. Large kanji characters are overlaid directly on the photography at partial opacity — text-as-texture, not text-as-information (most visitors can't read it; it's doing atmospheric work, not communicative work). This is worth naming explicitly because it's easy to credit Samurai's "immersion" entirely to its clip-path/pin-and-snap *code* — in fact roughly half the emotional weight is simply: **restrained, consistent, high-contrast photography with one human or one structure per frame, and nothing else in it.**
- **Loader/gate** — `.loader` and `.overlay` are both `position: fixed`, full-viewport, and pre-clipped to a closed `clip-path: polygon(0 100%, 100% 100%, 100% 0, 0 0)` shape — i.e. visually present but geometrically collapsed to nothing. A single click handler then animates **four layers in a stacked sequence**: the headline (`h2 div`, via `yPercent` + its own `clipPath` mask) slides up and unmasks, the overlay itself collapses to a sliver via `clipPath`, the loader image unmasks via its own `clipPath`, and finally the entire `.loader` collapses — each on the *same* `power4.inOut` curve but staggered with explicit `delay` values so they read as one continuous reveal, not four separate animations.
- **Pinned/snapped sections** — Every `.block` section is pinned (`pin: true`, `pinSpacing: false`) with `scrub: true` and a `snap: { snapTo: 1, duration: 0.5, ease: 'power1.inOut' }`. This produces the "cinematic scene" feeling — scrolling doesn't move content past you, it *holds* a full-bleed frame and snaps cleanly into the next one, like a slide projector rather than a webpage.
- **Typography/atmosphere** — `Roboto Mono` at `1.125rem` body size, white text on `#0f0f0f`, zero decorative chrome. The atmosphere is carried entirely by darkness + monospace + the gating ritual, not by ornament.

**Why it's emotionally effective:** The click-to-enter gate is a *threshold ritual*. It tells the visitor "what's behind this is worth a deliberate act," and the stacked clip-path reveal that follows pays that off in under two seconds.

**Why it's memorable:** The pin-and-snap section rhythm. Scroll position stops feeling like "where am I on a page" and starts feeling like "which scene am I in."

**Extract:** The principle of *gating reveal behind one user action* (not the literal click-required pattern — adapt it, don't import friction into a marketing site). The stacked-clipPath-reveal choreography (multiple layers unmasking on the same ease, staggered by `delay`, not by separate timelines). The pin+snap section rhythm for any "scene" that needs to be *held* rather than scrolled past. Most importantly: **one focal subject per frame, high contrast, nothing competing for attention** — the actual reason this reference feels cinematic has as much to do with photographic restraint as with any animation, and it's the cheapest, most transferable lesson here. AEGIS's own forecast/intervention visualizations should obey the same rule — one signal in focus at a time, not a dashboard's worth of simultaneous detail.

**Ignore:** The hard click-gate itself as implemented — it adds a mandatory interaction before any value proposition is visible, which is a real cost on a product marketing site (analytics, SEO, impatient visitors). The total absence of responsive/structural CSS — this reference is ~370 lines of CSS because almost everything is JS-driven; that's fine for a single-page stunt site, risky for a production app that needs to scale across sections.

**Implementation difficulty:** Low-medium. No exotic libraries — just GSAP core + ScrollTrigger, `clip-path`, and disciplined sequencing.

**React strategy:** Build the stacked-reveal as a single `gsap.timeline()` inside a dedicated `<Loader>` component that fires `onComplete` to hand off to the page (same contract as the `OpeningSequence` component examined in 1.7). Build pin+snap sections as a reusable `<PinnedScene trigger snapTo>` wrapper around `ScrollTrigger.create`, so every cinematic "scene" section in AEGIS shares one implementation instead of being hand-rolled per section.

---

### 1.3 — FURROW — Storytelling, Pacing, Transitions

**What it is:** A studio/agency site (Ukrainian-authored build system, "FLS" boilerplate conventions) built around a configurable scroll-watcher reveal system, an inverse-color cursor, and a literal scratch-to-reveal hero canvas.

**Systems observed:**
- **Scroll-reveal architecture** — Instead of hand-wiring `ScrollTrigger` per element, this reference uses a generic `ScrollWatcher` class: any element gets `data-fls-watcher` plus optional `data-fls-watcher-root/-margin/-threshold`, and a single `IntersectionObserver` (grouped and deduplicated by matching root/margin/threshold combinations, so elements sharing settings share one observer) toggles a `.--watcher-view` class. CSS then owns the actual animation: every revealable element has the same shape of rule —
  `opacity:0; transform:translate(0,1.875rem); transition: opacity .4s ease, transform .4s ease;` and `.--watcher-view { opacity:1; transform:translate(0,0); transition-delay: 0.3s|0.4s|0.5s|0.6s }`. The **delay ladder** (0.3 → 0.4 → 0.5 → 0.6s) across sibling elements is what produces the felt "cascade" — it's a CSS-only stagger, no JS stagger math at all.
  - This is a meaningfully different philosophy from GSAP's `ScrollTrigger.batch`/timeline approach: **JS only decides *when* something enters view; CSS owns *how* it moves.** Cheaper, more declarative, easier to art-direct per-component.
- **Cursor** — A single dot cursor that **inverts to red whenever every element under it has a pure-black background**, computed by walking up the DOM with `getComputedStyle` (temporarily disabling `pointer-events` to "see through" stacked layers via `elementFromPoint`). A separate `--sticky` mode snaps the cursor to the *center* of designated `.sticky-item` elements on hover, rather than following the raw pointer — a "magnetic cursor," distinct from a magnetic *element*.
- **Hero canvas (scratch reveal)** — A literal `<canvas>` using `globalCompositeOperation = 'destination-out'`: the hero is filled solid, and mouse movement "erases" a 70px-wide, round-capped stroke wherever the cursor travels, revealing whatever sits beneath. This is a *direct manipulation* metaphor — the user isn't watching a reveal, they're *causing* it.
- **Footer/about reveal pacing** — Same delay-ladder pattern as above, applied to contact/address/socials blocks, each staggered 0.3–0.4s after their sibling.

**Why it's emotionally effective:** The scratch-reveal canvas is the strongest "you did this" mechanic in any reference here — agency is transferred directly to the visitor's hand motion, not just their scroll position.

**Why it's memorable:** The inverse cursor (red-on-black) — it's a tiny detail that nonetheless makes the whole UI feel like it's *reacting to its own darkness*, which is thematically perfect for an interface about noticing pressure.

**Extract:** The grouped-IntersectionObserver / CSS-owns-the-motion reveal pattern — this is the **cheapest, most maintainable way to do scroll reveals at scale** and should be AEGIS's default reveal mechanism for anything that isn't a hero-grade set-piece. The delay-ladder stagger convention. The "erase to reveal" canvas metaphor, repurposed (see Interaction DNA, below) as AEGIS's signature hero device. The cursor-reacts-to-background-luminance idea, repurposed as a cursor that reacts to *system state* rather than pixel color.

**Ignore:** The literal `destination-out` drawing canvas left as a free-draw toy with no narrative gate (in the source it's just decorative) — AEGIS needs this mechanic to have a *destination* (revealing something specific, then locking), not infinite scribbling. The luminance-detection cursor logic verbatim — walking the DOM and reading `getComputedStyle` on every `mousemove` (even with `pointerEvents` toggling) is a real perf cost at scale; AEGIS should drive cursor state from **known section context** (a data attribute or React context value) instead of detecting pixel color at runtime.

**Implementation difficulty:** Scroll-watcher = low. Inverse cursor (as a state-driven version, not pixel-sampled) = low. Scratch-reveal canvas = medium (canvas compositing is simple, but needs care on resize/devicePixelRatio and a "reveal threshold → lock" exit condition that the reference doesn't have).

**React strategy:** Replace the vanilla `IntersectionObserver` class with a single `useInView`-style hook (or the well-known `react-intersection-observer` library) wrapping a `<Reveal delay={n}>` component whose *only* job is toggling a class — keep the actual motion in CSS/Tailwind, not JS, mirroring the reference's own division of labor.

---

### 1.4 — PARALLAX — Depth, Movement

**What it is:** A tutorial-grade parallax build combining `luxy.js` (a lerp-based smooth-scroll wrapper) with `Splitting.js` (char/word DOM splitting) and GSAP `ScrollTrigger` for layered depth.

**Systems observed:**
- **Smooth-scroll engine (`luxy.js`)** — Sets the scroll wrapper to `position: fixed`, fakes page height via `document.body.style.height`, and on every `requestAnimationFrame` lerps an internal `wrapperOffset` toward the real scroll position at `wrapperSpeed: 0.08`, then writes `translate3d` to the wrapper. Individual `.luxy-el` targets get their *own* independent speed (`data-speed-x/y`) lerped at `targetSpeed: 0.02` toward a percentage of scroll — i.e. **two nested lerps**: one for the whole page's smoothing, one per-element for differential depth. This is the literal mechanism of "things at different depths move at different speeds" rather than a metaphor.
- **GSAP-driven layered depth** — On top of (conceptually) the smooth-scroll, every section applies `scrub: 1.9` (a specific damping constant reused identically across header/about/benefits/portfolio/services/footer — clearly a deliberate, tuned "house feel" rather than a default) to differential `yPercent`/`xPercent`/`scale`/`rotate` values: titles move at `-150%`, background images scale from `1.6` down to `1` while moving, decorative squares rotate `720°` tied 1:1 to scroll position, numerals/arrows offset by an inline `data-speed` attribute per item (`x: (i, el) => 1 - parseFloat(el.dataset.speed)`).
- **Entrance choreography** — A simple opening `gsap.timeline()`: split title chars fly in (`yPercent:130 → 0`, `back.out`, stagger `0.06`), then the header image unmasks via `clipPath`, then the marquee fades up — all chained with negative time offsets (`-=1`, `-=1.5`) so they overlap rather than wait.

**Why it's emotionally effective:** Differential speed is the single cheapest way to make a flat page feel like it has physical depth — closer elements (numerals, foreground images) literally outrun farther ones (titles, backgrounds) as you scroll, which your visual cortex reads as "layers in space" without any 3D engine.

**Why it's memorable:** Less memorable as a "wow" moment, more memorable as *texture* — it's the reference that proves restraint (one tuned `scrub` constant, reused everywhere) reads as more premium than novelty.

**Extract:** The `scrub` constant as a *house value*, not a per-animation guess — AEGIS should pick one or two scrub/lerp constants and reuse them everywhere for consistency of "weight." The per-element `data-speed` attribute convention for differential parallax — clean, declarative, designer-tunable without touching JS. The principle of pairing a *global* smoothing lerp with *local* per-element lerps for true layered depth (rather than only one or the other).

**Ignore:** `luxy.js` itself as a dependency — it's a 2018-era library, unmaintained, and its `position:fixed` wrapper + fake `body.style.height` technique is exactly the kind of layout hack that **Lenis** (already used correctly in the Components reference, see 1.7) was built to replace more robustly and with better scroll-anchoring/accessibility behavior. The literal `720°` decorative-square spin and marquee-star rotation — too "agency flourish," no narrative function for AEGIS.

**Implementation difficulty:** Low. This is the most copy-paste-portable reference here — it's GSAP `ScrollTrigger` + `scrub`, nothing exotic.

**React strategy:** Use Lenis (already in AEGIS's stack via the Components reference) for the global smoothing layer instead of `luxy.js`, then attach `ScrollTrigger` directly to GSAP-controlled refs for the per-layer `scrub` parallax — Lenis and GSAP ScrollTrigger are explicitly designed to sync via `lenis.on('scroll', ScrollTrigger.update)`, so AEGIS gets both halves of this reference's depth system without its outdated dependency.

---

### 1.5 — GAMELAND — Hero Transitions, Cinematic Scenes

**What's actually in the file set:** Only four font files — `zentry-regular.woff2`, `general.woff2`, `robert-regular.woff2`, `robert-medium.woff2` — with no accompanying markup or JS. These four filenames are an exact fingerprint match for a widely-circulated open-source tutorial build inspired by the "Zentry" gaming/metaverse brand (the project nicknamed "Gameland" here is functionally that build). Because no implementation code shipped in this reference, the analysis below is explicitly **typographic-evidence-plus-public-knowledge of that known project**, flagged as such rather than asserted as something inspected first-hand.

**What that lineage is known for (for context, not for cloning):**
- A **display font (`zentry`)** reserved for a handful of huge, almost-logo-like hero words, paired with a **workhorse grotesk (`general`)** for UI/nav copy and a **serif/slab pairing (`robert-regular` / `robert-medium`)** for supporting headlines — three distinct typographic registers used as *role labels* (logo-voice, system-voice, editorial-voice), not as a stylistic accident.
- A signature hero mechanic: a small, rounded, clickable video tile sits inside the main hero; clicking it triggers a `clip-path`-driven scale/morph transition that expands the tile to fill the viewport, swapping to the *next* scene's video — i.e., the hero is a **cyclical set of "scenes,"** not a single static frame, and scene transitions are literal shape transformations rather than cuts or fades.
- Bento-style feature grids, animated nav underlines, and 3D-tilt hover cards layered on top, all reinforcing a "trailer for a product, not a webpage for a product" tone.

**Why it's emotionally effective:** Treating the hero as a *cycling set of scenes you advance by clicking* (rather than a single hero you scroll past) borrows directly from game-trailer pacing — it implies the product has more "story" than a single screenshot could hold.

**Why it's memorable:** The clip-path video-tile-to-fullscreen morph. It's a transition type most visitors have never consciously deconstructed, which is exactly why it lands as "premium."

**Extract:** The three-register type system (display/system/editorial), mapped onto AEGIS's own three voices (see Typography DNA). The *scene-cycling* hero structure as a narrative device — AEGIS's Pressure→Recovery arc is already a sequence of "scenes"; this reference validates building the hero as a rotation rather than a single static composition. The clip-path shape-morph as a transition *type* (not the literal video-tile asset).

**Ignore:** Treating the hero as something the user must *click to advance* — for AEGIS, the scene progression should be driven by **scroll** (matching the rest of the references and AEGIS's own scrollytelling needs), not by requiring discrete clicks through a gaming-style "next" tile. The gaming/metaverse visual register itself (glossy 3D bevels, saturated trailer color grading) is the wrong genre entirely for a calm intelligence product.

**Implementation difficulty:** Medium-high if reconstructed faithfully (clip-path morph animation between two differently-shaped/sized elements is fiddly to get pixel-perfect across breakpoints) — but AEGIS only needs the *principle* (scene-cycling, advanced by scroll instead of click), which is low-medium.

**React strategy:** Model AEGIS's hero as an array of "scene" objects driven by a single `ScrollTrigger`-controlled index, each scene cross-fading/clip-revealing into the next as the user scrolls through the hero's pinned duration — same underlying idea as Gameland's clickable cycling, re-wired to scroll position instead of click events.

---

### 1.6 — LANDING REVEAL — Mask Reveals, Entrances

**What it is:** A short, extremely disciplined GSAP `SplitText` + `CustomEase` preloader-to-hero handoff. The single best-engineered reveal sequence in the set.

**Systems observed:**
- **Custom ease as a brand signature** — `CustomEase.create('hop', '0.9, 0, 0.1, 1')` is registered once and reused for *every* animation in the sequence — progress bar, image reveals, character reveals, line reveals, the final divider. One ease, applied everywhere, is what makes a five-second sequence feel like one move instead of five.
- **`SplitText` with `mask: true`** — Modern `SplitText.create(selector, { type: 'chars'|'lines', mask: type })` auto-wraps each character/line in its own `overflow:hidden` mask span, so a simple `yPercent` tween produces a clean "wipe" reveal with zero manual DOM wrapping. This is the actual mechanism behind nearly every "lines slide up from nothing" effect across *all seven* references — Landing Reveal is just the one that uses the modern, built-in version instead of hand-rolling it.
- **Choreography, beat by beat:**
  1. Progress bar fills (4s) then snaps shut from the right (1s) — a deliberate "loading, then a hard cut" rhythm, not a smooth fade-out.
  2. Preloader images unmask via `clip-path`, staggered `0.75s` apart, *overlapping backward* into the progress-bar's timeline via `'-=5'` (GSAP's relative-position syntax) so nothing waits for anything else to fully finish.
  3. Headline characters fly in from alternating directions (even-indexed chars from `yPercent:-100`, odd from `+100` — a literal "converging from above and below" motion).
  4. The single most distinctive beat: the **first and last character of the preloader headline detach** from the rest, animate to the horizontal center of the viewport (computed live via `getBoundingClientRect`), get a `mix-blend-mode: difference` applied, then scale down to become the *persistent site logo* — i.e. **the preloader doesn't just disappear, two of its own letters physically become the header logo.**
  5. Hero content unmasks immediately after on a faster `power4.out` curve, breaking from the cinematic `hop` ease deliberately — the *arrival* feels different in kind from the *departure*.

**Why it's emotionally effective:** Step 4 above is a genuine piece of motion storytelling, not decoration — the brand mark is *revealed to have been there all along*, hiding inside the loading copy. That's a "the system already understood you" beat, which maps directly onto AEGIS's required first emotional turn.

**Why it's memorable:** The exact same beat — letters detaching from a sentence to become the permanent logo.

**Extract:** Registering one `CustomEase` and using it everywhere (a real, copy-paste-ready discipline, not just a nice idea). `SplitText` with `mask:true` as the default reveal primitive. GSAP's relative-time overlap syntax (`'-=N'`) as the standard way to keep a multi-beat sequence feeling continuous instead of sequential. The "preloader element becomes the persistent UI element" idea, repurposed for AEGIS (see AEGIS Visual System).

**Ignore:** Nothing structural — this is the cleanest reference in the set. The only caution is scope: a 5+ second mandatory preloader is a real cost on return visits; AEGIS needs a **first-visit-only** version of this sequence (persisted via a session flag), not a "every load" tax.

**Implementation difficulty:** Low-medium — entirely GSAP core + `SplitText` + `CustomEase`, all of which are part of the free public GSAP package as of the 2025 Webflow-driven licensing change (see GSAP Strategy, below), so there is no plugin-cost barrier to using this exact toolchain in AEGIS.

**React strategy:** This entire sequence belongs in one component (mirrors `OpeningSequence.tsx` in 1.7 almost exactly) using `@gsap/react`'s `useGSAP()` hook for automatic timeline cleanup, gated behind a `sessionStorage` flag so it plays once per session, not once per route change.

---

### 1.7 — COMPONENTS (React/Next.js reference build) — Identity, Atmosphere, Emotional Language

**What it is:** The most directly portable reference, because it's already React/TypeScript/Tailwind/GSAP/Framer Motion — a one-page "cinematic creative-developer portfolio" with a full section pipeline: `OpeningSequence → HeroSection → IntroSection → MonologueSection → ProjectArchive → Manifesto`.

**Systems observed:**
- **Stack decisions** — `Lenis` via `ReactLenis` (`lerp: 0.05`, `duration: 1.5`) for global smooth scroll; GSAP `CustomEase` registered **once**, globally, in `utils/gsap.ts` (`cinematicEase: 'M0,0 C0.25,1 0.5,1 1,1'` — a slow-start, hard-settle curve, GSAP's SVG-path ease syntax rather than a cubic-bezier string) and re-exported so every component imports from one place instead of re-registering plugins; Framer Motion reserved specifically for **physically-simulated, state-driven** micro-interactions (cursor, magnetic pull) where spring physics matter more than scripted timing.
- **Loader (`OpeningSequence.tsx`)** — A `SYS.INIT // CREATIVE DEVELOPER` technical header, a centered two-line "manifesto" statement revealed via masked `yPercent` lines on `cinematicEase`, and a live-counting `00 → 100` numeric counter driven by tweening a plain object's `.value` property and reading it back in `onUpdate` (the standard GSAP-to-React-state bridge pattern: **never `setState` every frame from a render-driving source; tween a ref object and sync state only where text needs to display it**). The whole loader fades out on `power4.inOut` and calls an `onComplete` prop — clean, composable handoff, no global state needed.
- **Hero (`HeroSection.tsx`)** — A **mouse-reactive radial-gradient spotlight** (`mix-blend-mode: screen`) tracked via plain `useState`+`mousemove`, masked two-line title reveal (`overflow-hidden` wrapper + inner `y:'120%' → '0%'` on `cinematicEase`), and a small mono "technical badge" (`[ SEC_001 // THE ESTABLISHING SHOT ]`) — a recurring device across the whole build: **every section opens with a bracketed mono index label**, which does a lot of work establishing "this is a system speaking," not "this is a webpage."
- **Identity (`MonologueSection.tsx`)** — A **pinned horizontal scroll** built the standard GSAP way: compute `wrapper.scrollWidth - window.innerWidth`, tween the wrapper's `x` to that negative value with `scrollTrigger: { pin:true, scrub:1, end: () => '+=' + amount, invalidateOnRefresh:true }`. Four "philosophy plaques" scroll past horizontally as the page scrolls vertically — vertical scroll input, horizontal visual motion, a classic and very effective decoupling.
- **About (`IntroSection.tsx`)** — A plain `gsap.fromTo` stagger over a text block's children, triggered at `'top 70%'` — the simplest, most reusable reveal in the whole reference set, useful as the "default, no-ceremony" reveal for body copy that doesn't need a set-piece.
- **Archive (`ProjectArchive.tsx`)** — Per-item internal parallax: each project image sits inside an oversized (`130%` height) container and tweens `yPercent: 25` on `scrub: true` as that specific card crosses the viewport — local parallax, not global, so each card has its own depth independent of scroll position elsewhere on the page.
- **Outro (`Manifesto.tsx`)** — A wrapping grid of single words (`Cinematic. Atmospheric. Intentional. Alive. Immersive. Yours.`) that fade in as a block on scroll, then individually invert color on hover via a `group-hover` Tailwind pattern (hovering the *group* dims all words to near-invisible, while the *specific* hovered word brightens) — a "your attention picks one word out of the field" interaction.
- **Global utilities** — `CinematicCursor.tsx` (Framer Motion spring, `mix-blend-mode: difference`, scales to `4×`/fades to `0.5` opacity on hover-target detection via `closest()`), `Magnetic.tsx` (a simpler, state-driven version of Obys's magnet effect — same pull-toward-center idea, implemented as `useState` + Framer Motion spring instead of a manual RAF loop — easier to read, slightly less performant under heavy reuse).

**Notable engineering smells (useful as cautionary evidence, not just style notes):** `Global/NoiseOverlay.tsx` and `utils/animations.ts` both exist as **empty files** — referenced in spirit but never implemented, a real risk when a team's "noise texture" and "shared animation helpers" live only as TODOs. `Outro/Manifesto.tsx` contains a **duplicated, garbled footer block** (the JSX appears once correctly, then the import statement and an entire second copy of the footer reappear *after* the closing of the component, outside any valid JSX context) — a clear copy-paste/edit artifact that would fail to compile as-is. Both are flagged explicitly under Components To Avoid.

**Why it's emotionally effective:** The bracketed mono "system label" device (`[ SEC_00X // … ]`) on every section, combined with the `SYS.INIT` loader framing, makes the entire site read as **a system narrating itself to you** — which is the exact register AEGIS needs, just pointed at a different emotional payload (this reference uses it for "creative authorship," AEGIS needs it for "I am watching your pressure levels").

**Why it's memorable:** The live numeric counter in the loader and the section-index labels — small, cheap, and disproportionately effective at making a static page feel instrumented.

**Extract:** The entire stack decision (Lenis + GSAP CustomEase, globally registered once + Framer Motion reserved for state-driven micro-interactions) as AEGIS's literal starting architecture. The bracketed mono section-label convention. The tween-an-object/read-back-into-text counter pattern. The pinned-horizontal-scroll implementation for the "Understanding" stage of AEGIS's journey. The local-parallax-per-card pattern for any project/feature archive.

**Ignore:** The literal copy ("Creative Developer," "I build worlds") and the gold/cream/charcoal palette — both belong to a personal-portfolio register, not an enterprise-intelligence one. The dead files and duplicated-JSX pattern, as an engineering practice.

**Implementation difficulty:** Low — this is already idiomatic React/Next.js/Tailwind/GSAP/Framer Motion, directly adaptable.

**React strategy:** Use this reference's file structure almost as-is for AEGIS's folder architecture (`Global/`, `Hero/`, `Loader/`, section-named folders), but route every GSAP usage through `@gsap/react`'s `useGSAP()` hook instead of manual `useEffect` + `tl.kill()` cleanup (less boilerplate, automatic revert on unmount/dependency change, fewer chances to leak a ScrollTrigger).

---

## 2. Design DNA

*The patterns that showed up independently, without coordination, across most or all seven references — these are treated as load-bearing, not coincidental.*

- **Darkness as default, not as theme.** Six of seven references default to near-black (`#080808`, `#0f0f0f`) rather than pure black. Pure black reads as "off"; a near-black with a hint of warmth or cool reads as "a room with the lights down," which is the actual goal — depth, not absence.
- **One accent, used sparingly, never decoratively.** Every reference has exactly one accent color (gold `#c8a96e`, red `#ea281e`, white-on-black inversion) and uses it almost exclusively for **interactive or attention-bearing elements** — never for large fills. The accent is a pointer, not a paint job.
- **The bracketed/mono "system label" device.** Present explicitly in the Components reference (`[ SEC_001 // … ]`) and implicitly in Samurai's `Roboto Mono` body copy — small monospace text in brackets or all-caps tracking reads instantly as "machine speaking," which is a free, low-effort way to manufacture the feeling of being inside a system rather than on a page.
- **Index numerals as a structural device.** Obys's serif counters, the Components reference's `01/02/03` philosophy plaques, Forrow's `01–04` story counters — numbering sections explicitly (not just visually separating them) reinforces "this is a sequence with a beginning and an end," which matters enormously for a five-beat emotional arc like AEGIS's.
- **Everything is masked, nothing just appears.** `overflow:hidden` + inner-element translate is the *near-universal* reveal primitive (Landing Reveal's `SplitText mask:true`, the Components reference's manual title masks, Forrow's `--watcher-view` translate). Content doesn't fade into existence; it's revealed from behind a wipe, as if it were already there and the mask simply moved.
- **The cursor is never just a pointer.** All four references with custom cursors (Obys, Forrow, the Components reference, implicitly Samurai's `cursor:none` system) treat the cursor as a *status indicator*, not a click target — its size, color, or rotation state communicates something about what's beneath it.

## 3. Motion DNA

*Concrete, numeric patterns extracted directly from the reference code — treated as tunable constants, not vibes.*

- **One ease, everywhere, per "mode."** Landing Reveal registers a single `CustomEase('hop', '0.9, 0, 0.1,1')` and uses it for every beat of its sequence; the Components reference registers a single `cinematicEase` (`M0,0 C0.25,1 0.5,1 1,1`) and reuses it across loader and hero. The lesson isn't "use this exact curve" — it's **pick 1–2 named eases for the whole product and never improvise a third.** AEGIS will define two (see Motion Language, below): one for *tension* and one for *resolution*.
- **`scrub` and lerp constants are house values.** Parallax reuses `scrub: 1.9` identically across six unrelated sections; the Components reference's Lenis config uses `lerp: 0.05` globally. A reused damping constant is what makes unrelated sections feel like the same physical material.
- **Negative-offset overlap, not sequential waiting.** Nearly every multi-beat timeline in the set (Landing Reveal, Parallax's entrance, the Components reference's hero) uses GSAP's relative position syntax (`'-=1'`, `'-=0.8'`) to start the next beat before the previous one finishes. A timeline that waits for full completion between beats reads as a slideshow; one with negative overlaps reads as one continuous gesture.
- **Stagger via fixed delay-ladders, not magic stagger math, for state-based reveals.** Forrow's `--watcher-view` system uses literal per-sibling `transition-delay` values (0.3s, 0.4s, 0.5s, 0.6s) rather than computed `stagger` — appropriate because these are *state toggles* (an `IntersectionObserver` flipping a class), not a single timeline animating many targets at once.
- **Distinct entrance vs. exit grammar.** Landing Reveal's hero content arrives on a snappier `power4.out`, deliberately different from the cinematic `hop` ease used for the loader's departure — arrival and departure are allowed to *feel* different, which AEGIS should exploit directly: **Pressure-stage motion should feel different in kind from Recovery-stage motion**, not just be the same curve played in two places.
- **Settling logic that actually terminates.** Obys's magnetic effect explicitly stops its RAF loop once displacement is below a tiny epsilon — motion systems in AEGIS must follow this discipline everywhere a loop could otherwise run forever in the background.

### Animation Guidelines (numeric defaults for AEGIS)

| Parameter | Default | Source pattern | Notes |
|---|---|---|---|
| Resolve ease | `cubic-bezier(0.16, 1, 0.3, 1)` ("aegis-resolve") | Landing Reveal's `hop`, Components' `cinematicEase` | Use for anything settling into clarity — hero arrival, Recovery-stage reveals, magnetic settle |
| Pressure ease | `cubic-bezier(0.65, 0, 0.35, 1)` ("aegis-pressure") | Samurai's `power4.inOut`, sharper | Use only in the Pressure beat — chaos elements should snap, not glide |
| Scroll-bound scrub | `1.2–1.6` | Parallax's `1.9`, tightened for a calmer product | One constant, reused across every `scrub` ScrollTrigger |
| Global smooth-scroll lerp | `0.08–0.1` | Components' Lenis `lerp:0.05`, loosened slightly | Too low reads as sluggish on a product site where people need to scan, not just admire |
| Magnetic pull radius | `14–18px`, **rotate: 0** | Obys's `max:18, rotate:4` | Rotation reads as playful; disable it for AEGIS's calmer register |
| Reveal stagger (per char/word) | `0.02–0.03s` | Landing Reveal's `0.025`, Obys's `0.03` | Above ~0.04s, multi-word headlines start to feel slow rather than deliberate |
| Section-reveal delay ladder | `+0.1s` per sibling | Forrow's `0.3 → 0.6s` | Cap at 4 staggered siblings before switching to computed `stagger` |

## 4. Typography DNA

- **Three registers, not two.** The strongest references (Gameland's font fingerprint, the Components reference, Forrow) all separate type into at least three functional roles rather than a simple heading/body split: a **display/identity face** (huge, rare, almost logo-like), a **system/data face** (monospace or heavily tracked grotesk, small, used for labels/counters/status), and a **body/editorial face** (the actual sentences a human reads). Two-register systems (just a sans and a serif) read as "a nice website"; three-register systems read as "an instrumented system with a voice."
- **Massive display type is structural, not decorative.** `clamp(4rem, 12vw, 12rem)` (Components), `font-size: 18.75rem` at desktop (Forrow) — display type in every reference is sized to dominate the viewport, not to "fit" a heading slot. AEGIS's Pressure-stage headline needs this scale to register as a statement, not a label.
- **Uppercase + negative letter-spacing for density-implying headlines, generous tracking for system labels.** Landing Reveal's `h1` uses `letter-spacing: -0.5rem` at `8rem` size (tight, heavy, urgent); its system copy and most references' mono labels use `tracking-[0.25em]` or wider (airy, procedural). The contraction/expansion of letter-spacing is doing emotional work by itself — tight type feels urgent, loose tracked type feels calm and systemic.
- **Italics as the "this is a feeling, not a fact" marker.** The Components reference consistently italicizes the *emotional* clause of a sentence (`I build *worlds*`, `*emotional temperature*`) while keeping the factual clause upright. AEGIS can reuse this exact device for any sentence that pairs a system fact with a human consequence.
- **Line-height compressed for display, relaxed for body.** `line-height: 70–105%` on every display headline across every reference, vs. `1.5–1.75` implied normal leading on body copy. The contrast itself communicates hierarchy as strongly as size does.

## 5. Section DNA

*The skeleton, abstracted from the Components reference's actual page assembly (`Loader → Hero → Intro → Monologue(horizontal) → Archive → Manifesto`) and cross-checked against Samurai's pin/snap rhythm and Landing Reveal's gated-entry pattern.*

A reference build's section rhythm typically alternates **held cinematic beats** (hero, loader, manifesto — things meant to be looked at, not scrolled past) with **traversal beats** (horizontal monologue, vertical archive — things meant to be moved through). AEGIS's beat list should follow the same alternation, mapped onto its own five-stage arc — full architecture in **Section Architecture**, below.

- A site almost never opens directly into scrollable content. There's always a gate (loader, click-to-enter, or a hero held in place by a pin) that establishes *tone* before *information*.
- Horizontal-scroll-on-vertical-input shows up specifically at the point in the journey where the content is a **set of parallel, equally-weighted items** (philosophy plaques, archive — not a sequence with dependencies). Sequential/causal content (a forecast, a timeline) stays vertical.
- The outro is always a held, centered, low-motion beat — after a build full of staggered reveals and pinned scenes, the last beat *should* feel calm by contrast, or the calm doesn't register.

## 6. Interaction DNA

- **Cursor-as-status-indicator** (Obys, Forrow, Components) — extract the *pattern* (cursor communicates state), not any single implementation. AEGIS's cursor should communicate **AEGIS's read of the current section's emotional register** (see AEGIS Visual System) via subtle color-temperature shift, not via novelty shapes.
- **Magnetic elements for primary actions only** (Obys's `data-fls-magnet`, Components' `<Magnetic>`) — never apply magnetism to body text links or low-priority actions; it's a "this matters, lean toward it" signal, and it loses meaning if it's everywhere.
- **Hover reveals a preview, not just a state change** (Obys's flag-image-on-word-hover) — the *principle*, repurposed: hovering an AEGIS task/signal previews what AEGIS would *do* about it, not just a tooltip.
- **Direct-manipulation reveal** (Forrow's scratch canvas) — the user's own motion causes the reveal, rather than time or scroll position causing it. This is rare across the set and disproportionately powerful when present.
- **Scroll-direction awareness, not just scroll-position awareness** (Obys's fade-out-on-scroll-down indicator) — UI chrome (indicators, nav) should react to *which way* the user is moving, not just *how far*.

---

## 7. Components To Build

### 7.1 React Component Map

| Section (AEGIS stage) | Component | Core technique | Difficulty |
|---|---|---|---|
| Gate | `<SysInit>` | Counter-tween + masked manifesto lines + session-gated (1.6, 1.7) | Low-med |
| Pressure (hero) | `<PressureHero>` | Scene-cycling masked headline, chars converging from alternating directions, scratch-reveal canvas as cursor interaction (1.6, 1.3, 1.5) | Med-high |
| Understanding | `<SignalTrack>` | Pinned horizontal scroll of "what AEGIS is reading" cards (1.7 §Identity) | Medium |
| Prediction | `<ForecastScene>` | Pinned/snapped scroll-scrubbed timeline visualization (1.2) | Medium |
| Intervention | `<InterventionPreview>` | Hover-to-preview action cards, magnetic CTAs (1.1, 1.7) | Low-med |
| Recovery | `<Manifesto>` | Word-grid, group-hover isolate, calm centered close (1.7 §Outro) | Low |
| Global | `<Cursor>` | Dual-layer RAF cursor, state driven by section context (1.1, 1.3) | Low-med |
| Global | `<Magnetic>` | Self-terminating RAF lerp, rotate disabled (1.1) | Low |
| Global | `<Reveal>` | IntersectionObserver + CSS-owned motion, delay-ladder (1.3) | Low |
| Global | `<SmoothScroll>` | Lenis root wrapper, synced to ScrollTrigger (1.4, 1.7) | Low |
| Global | `<PinnedScene>` | Reusable `ScrollTrigger.create({pin, scrub, snap})` wrapper (1.2) | Low-med |

### 7.2 GSAP Strategy

GSAP owns **anything bound to scroll position or requiring multi-beat choreography**: the gate sequence, hero scene-cycling, pinned/horizontal sections, scroll-scrubbed parallax, and all `SplitText`-based headline reveals. As of the April 2025 Webflow-driven licensing change, the entire GSAP toolset — including `SplitText`, `CustomEase`, `ScrollSmoother`, and `Observer`, all of which appear in the references above — is free for commercial use with no Club GreenSock membership required, so there is no cost barrier to using the exact toolchain these references demonstrate.

- Register plugins **once**, globally (mirroring the Components reference's `utils/gsap.ts`): `gsap.registerPlugin(CustomEase, SplitText, ScrollTrigger, Observer)`.
- Define `aegis-resolve` and `aegis-pressure` as named `CustomEase` curves at startup (see Animation Guidelines table) — every timeline references these by name, never an inline bezier string.
- Use `@gsap/react`'s `useGSAP()` hook in every component instead of manual `useEffect` + `tl.kill()` — automatic scoping and revert removes an entire class of ScrollTrigger-leak bugs visible in how carefully (and manually) the reference components have to clean up.
- Sync Lenis to ScrollTrigger explicitly (`lenis.on('scroll', ScrollTrigger.update)`, and drive Lenis's RAF loop through `gsap.ticker` rather than its own) — this is the one piece of plumbing every reference using a separate smooth-scroll library had to solve, and getting it wrong produces visible drift between pinned sections and the smoothed scrollbar.
- `SplitText` with `mask: true` is the default primitive for **every** headline reveal in AEGIS — do not hand-roll `overflow:hidden` wrapper spans the way the older references (pre-2025 `SplitText`) had to.

### 7.3 Framer Motion Strategy

Framer Motion owns **discrete, state-driven, physically-simulated micro-interactions** that live inside React's render cycle rather than a global timeline: cursor hover-state transitions, magnetic button springs (where reuse count is low enough that a RAF loop isn't worth the complexity — high-traffic magnetic elements like primary nav should still use the manual RAF pattern from 1.1), card hover/tilt states, and any `AnimatePresence`-driven mount/unmount (modal-style intervention previews, toast-style "AEGIS just did X" confirmations).

- Treat the GSAP/Framer Motion boundary as a hard rule, not a preference: **if it's bound to scroll position, it's GSAP; if it's bound to component state, it's Framer Motion.** Letting both libraries fight over the same element (animating the same `transform` from two different systems) is the most common bug class in builds that mix them, and none of the references above make this mistake — each uses exactly one tool per element.
- Springs, not durations, for anything meant to feel alive/responsive (cursor, magnetic, hover tilt) — `{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }` is the Components reference's tuned default and is a reasonable starting point for AEGIS.

### 7.4 Scroll Storytelling Strategy

- **One global smoothing layer (Lenis), many local scrub layers (ScrollTrigger).** Exactly the Parallax reference's two-nested-lerp principle (1.4), implemented with modern tooling.
- **Pin only when a scene must be *held*, scrub-without-pin when content should simply move at a different rate than the viewport.** Samurai pins because each block *is* the scene; Parallax doesn't pin because its layers are texture, not scenes. AEGIS's Prediction and Pressure beats should pin; its Understanding (signal-track) and ambient background motion should scrub without pinning.
- **`invalidateOnRefresh: true` on every horizontal/pinned section** (per the Components reference's `MonologueSection`) — without it, resizing the window (or a font finishing its load and reflowing text) leaves the pinned distance permanently wrong.
- **One `IntersectionObserver`, many listeners** for any state that's binary (visible/not-visible) rather than continuous (Forrow's `ScrollWatcher` grouping pattern, 1.3) — reserve per-element `ScrollTrigger` instances for things that need continuous scroll-bound values (`scrub`), not for simple reveal-on-view.

## 8. Components To Avoid

- **A mandatory click-to-enter gate** (Samurai, 1.2) on the production marketing site — it's friction before value, and it directly contradicts a product whose entire pitch is *reducing* friction. Keep the *reveal choreography* this pattern teaches; drop the *requirement* to click before seeing anything.
- **The literal Three.js fabric-shader image-follow** (Obys, 1.1) — gorgeous, but it signals "look at our agency's craft," which is the wrong register for a product that should signal "we are watching *your* situation," not its own cleverness. High implementation/maintenance cost for a feature with no narrative payoff in this product.
- **Pixel-sampling cursor logic** (Forrow's `getComputedStyle`-walking luminance detector, 1.3) — real per-frame cost; AEGIS has section context available for free (it's a known React state value), so cursor state should be driven by that, never by reading rendered pixel color.
- **`luxy.js`** (Parallax, 1.4) as a literal dependency — unmaintained since ~2018, and its `position:fixed` + faked `body.style.height` technique is precisely what Lenis exists to do better, with proper scroll-anchoring and accessibility behavior.
- **Horizontal-scroll-as-the-only-path** on touch/mobile (Components' `MonologueSection`, 1.7) — pinned horizontal scroll on a vertical-swipe device is a well-documented usability trap; AEGIS must collapse this pattern to a normal vertical stack below a defined breakpoint, not just shrink it.
- **Empty placeholder files and copy-paste JSX duplication** (`NoiseOverlay.tsx`, `utils/animations.ts`, the garbled `Manifesto.tsx` footer — all 1.7) — these are evidence of a real failure mode (a "noise texture" or "shared animation helper" referenced everywhere but implemented nowhere, and a footer block duplicated outside valid JSX during an edit). Treat as a checklist item during review, not just a style note.
- **Decorative-only motion with no narrative function** (Parallax's `720°` spinning squares, Gameland's glossy 3D bevels) — anything that animates *because it can* rather than because it's carrying a piece of the Pressure→Recovery story should be cut, even if it tested well in isolation.
- **A third, improvised easing curve appearing anywhere in the codebase** — the single fastest way to make a cinematic build feel like a webpage again is letting a third, un-named bezier curve creep into a component because a developer eyeballed "something that feels right." Two named eases, enforced by lint/convention, or it doesn't ship.

---

## 9. AEGIS Visual System

*The Design Language — what the seven references' principles look like once they're actually wearing AEGIS's brand, not anyone else's.*

### Color: a temperature gradient, not a palette

Every reference picks one accent and holds it constant from top to bottom. AEGIS should do something none of them do, because none of them needed to: **let color temperature itself perform the emotional arc.**

- **Base:** a near-black with a faint cool cast — `#0A0B0D`-range, not a pure `#000`. Consistent with the near-universal "darkness as default" pattern (Design DNA), but the cool cast (vs. Forrow/Samurai's neutral black, or the Components reference's warm charcoal) signals *precision* rather than *mood* from the first frame.
- **Pressure register (top of page):** a desaturated, alarm-adjacent warm — amber/red used the way Forrow's cursor uses red: sparingly, as a signal, never as a fill. This is the only place in the entire build warm color appears.
- **Resolution register (bottom of page):** a cool, clear signal blue/cyan — the "clarity" color. Every other accent use in the build (links, magnetic CTAs, cursor ring) sits somewhere on the line between these two, and **which point on that line it sits at is determined by which stage of the journey it's currently in**, not by a fixed brand rule. The cursor ring (Interaction DNA) is the most visible carrier of this: it should warm slightly in the Pressure section and cool by Recovery, the same red-on-black logic Forrow uses for *background luminance*, repointed at *narrative stage* instead.
- **Neutral ink:** off-white (`#EDEDEF`-range) for body copy, never pure white — matches the near-universal pattern of avoiding pure black/white pairs anywhere in the reference set.

### Typography: three registers, AEGIS-specific

| Register | Role | Reference lineage | Treatment |
|---|---|---|---|
| **Display** | The two or three words per section that *are* the statement (hero headline, Recovery close) | Gameland's `zentry`, Landing Reveal's `8rem` tight headline | Huge (`clamp(3.5rem, 10vw, 9rem)`), tight tracking (`-0.02em` to `-0.04em`), masked-reveal only — never typed-on |
| **System** | Status labels, counters, timestamps, the "AEGIS is speaking" voice — bracketed mono tags, the SYS.INIT-style gate copy | Samurai's `Roboto Mono`, Components' `[ SEC_00X // … ]` | A monospace, uppercase, wide tracking (`0.2–0.3em`), small size — never used for anything a human is meant to feel, only for anything the *system* is reporting |
| **Editorial** | The actual sentences — body copy, the human-facing explanation of what's happening | Components' Cormorant-style serif pairing, OBYS's `silkSerif` | A quiet, slightly humanist serif or high-legibility sans at relaxed leading (`1.6–1.75`); italicize the *consequence* clause of any sentence that pairs a fact with a felt effect (Typography DNA's "this is a feeling, not a fact" device), e.g. "AEGIS noticed your calendar density doubled — *and flagged it before you had to ask.*" |

### Motifs

- **Index numerals on every stage** — `01 PRESSURE / 02 UNDERSTANDING / 03 PREDICTION / 04 INTERVENTION / 05 RECOVERY`, set in the System register, present in every section's corner. This is the single cheapest device in the entire reference set (Design DNA) and it's the one most directly load-bearing for a five-beat arc that needs the visitor to feel *progression*, not just mood.
- **The gate's own typography survives into the persistent UI** — borrowing Landing Reveal's "two letters detach and become the logo" beat (1.6) directly: AEGIS's `SYS.INIT` gate sequence should end with a fragment of its own counter or status text contracting into the persistent header mark, so the header doesn't simply *appear* after the gate — it's *revealed to have been generated by it*.
- **The cursor as the one continuously-present "AEGIS is here" signal** — carrying the color-temperature logic above, at every point in the scroll.

## 10. AEGIS Emotional System

*Mapping the five-beat arc to the feeling ladder the brief specifies: observed → understood → guided → protected → (only then) productive.*

| Stage | Feeling required | Visual carrier | Motion carrier | Copy register |
|---|---|---|---|---|
| **Pressure** | *Observed* | Warm-register cursor; dense, almost-overlapping fragments of type (notification-shaped noise) | `aegis-pressure` ease (sharp, anxious snap); the scratch-reveal canvas (1.3) repurposed so the visitor's own cursor motion clears the noise — **they reveal their own pressure**, AEGIS doesn't show it to them | Second person, present tense, specific and slightly uncomfortable: naming a real failure mode of overwhelm, not a generic pain point |
| **Understanding** | *Understood* | Pinned horizontal `<SignalTrack>` (1.7 §Identity) — discrete signal cards (calendar density, message backlog, tone shift) drifting past at reading pace | `scrub`-bound horizontal traversal, no pin-snap yet — this stage should feel like being walked through, not held | Diagnostic, calm, naming specifics back to the visitor ("we don't ask what you're working on — we can already see it") |
| **Prediction** | *Guided* | `<ForecastScene>` — a pinned/snapped timeline visualization (Samurai's pin+snap rhythm, 1.2) showing a forecasted collision point before it happens | First appearance of the cool/resolution accent, arriving as a single highlighted point on the timeline — the moment AEGIS stops describing the present and starts describing what's coming | Future-conditional, confident, specific ("at 2:40 your two highest-priority threads collide — here's what we'd move") |
| **Intervention** | *Protected* | `<InterventionPreview>` — hover-to-preview action cards (Obys's hover-summons-content principle, 1.1, repurposed), magnetic CTA (rotate disabled — Interaction DNA) | Direct manipulation, not autoplay: the visitor hovers/holds to see AEGIS act, mirroring the agency-transfer device of Forrow's scratch canvas — protection should be something you *witness happening*, not something narrated at you | Declarative, low-drama — the system already decided; it's explaining, not asking permission |
| **Recovery** | *(then) Productive* | `<Manifesto>` — word-grid close (1.7 §Outro), fully resolved to the cool register, generous whitespace, the lowest motion-density of the entire page | Held, centered, near-static — the contrast with everything preceding it is the entire point (Section DNA: "the outro should feel calm *by contrast*, or the calm doesn't register") | Short. The shortest copy on the page. This is the only stage allowed to sound *relieved* rather than *instrumented* |

The throughline across all five rows: **AEGIS never opens with what it can do. It opens with what it noticed.** Every reference analyzed above earns emotional impact in roughly the first two seconds, before any feature or benefit is stated — that ordering is the actual asset being extracted from this entire set, more than any single animation.

---

## 11. Final Recommendations

**Build order.** Build in this sequence, not page order — each phase de-risks the next:
1. **Global plumbing first:** `<SmoothScroll>` (Lenis), GSAP plugin registration + the two named eases, `<Cursor>`, `<Reveal>`. None of this is visible as a "feature," but every later section depends on it existing correctly, and it's exactly the layer where the reference set's engineering smells (re-registered plugins, leaked ScrollTriggers, pixel-sampling cursors) actually originated.
2. **The gate and hero** (`<SysInit>`, `<PressureHero>`) — highest emotional stakes, highest motion complexity (scene-cycling, scratch-reveal). Build and user-test this in isolation before touching anything downstream; if the first ten seconds don't land, no amount of polish further down the page recovers it.
3. **The three middle stages** (`<SignalTrack>`, `<ForecastScene>`, `<InterventionPreview>`) — these can be built in parallel once the global plumbing and hero are stable, since each owns its own pinned/scrubbed scroll range independently.
4. **Recovery last, deliberately** — its entire job is to read as calm *relative to* everything before it, so it can't be properly tuned until the rest of the build's motion density is locked.

**Performance budget.** The riskiest single decision in this whole document is keeping a scratch-reveal canvas *and* a dual-layer RAF cursor *and* scroll-bound GSAP timelines all live simultaneously during the Pressure beat. Profile this combination specifically on a mid-tier mobile device early — not at the end. If frame budget is tight, the cursor ring is the first thing to simplify (drop the rotation, keep the lerp), not the scratch-reveal (it's carrying more narrative weight).

**Reduced motion and accessibility.** Every animated reference in this set is silent on `prefers-reduced-motion` except Obys's magnetic effect, which explicitly degrades to a plain CSS transition. AEGIS should follow that one example everywhere: a `prefers-reduced-motion` branch that keeps every *state change* (reveals happen, sections still progress) but removes every *physically-simulated* motion (no scratch-reveal requirement to proceed, no magnetic pull, no cursor ring rotation, masked reveals become simple opacity fades). The Pressure-stage scratch-reveal in particular needs a non-motion fallback path — it cannot be the *only* way to reach the hero's content, or the whole gate becomes inaccessible by design.

**Mobile.** Three things in this document explicitly do not survive touch input unmodified: pinned horizontal scroll (`<SignalTrack>`) must collapse to vertical stacking below ~768px; the magnetic cursor-pull system has no touch equivalent and should simply not initialize (not degrade — just not run) on touch devices; the scratch-reveal canvas should map to a swipe gesture rather than a hover-trail, with a generous touch-target radius.

**Licensing.** No plugin-cost risk: GSAP's full plugin set (`SplitText`, `CustomEase`, `ScrollSmoother`, `Observer`) became free for commercial use following the 2025 Webflow acquisition, so every technique cited above is buildable without a Club GreenSock membership.

**What not to do, restated once more because it's the easiest mistake available:** none of the seven references are productivity software, and that is *why* they work as raw material — they're solving "make someone feel something in two seconds" with zero feature obligations. AEGIS has feature obligations. The discipline this whole document is arguing for is borrowing the *feeling-first sequencing* from a fashion-editorial agency, a gaming-trailer site, and a personal portfolio, while refusing to borrow their *content* or their *register* — gold/cream warmth, glossy gaming bevels, agency self-regard, and click-gated friction all stay behind. What ships is calmer, more instrumented, and — if the Emotional System above is followed in order — felt before it's understood.
