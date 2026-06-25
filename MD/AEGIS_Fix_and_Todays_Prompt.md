# AEGIS — The Fix, and Today's Prompt

This resolves the four gaps from the review (thin AI section, no demo floor, demo pacing risk, underspecified canvas/cursor call) into actual decisions, then gives you one copy-paste prompt for your coding agent to execute today. No new open questions left for "later" — anything still genuinely unknown is flagged explicitly as a question for *you*, not punted to the agent to guess at.

A note on dates first, since it changes the calculus: Vibe2Ship's problem statements only dropped June 22 and only solo entries are allowed with a live finalist presentation round. That means the AI layer isn't a "nice to have to wire up eventually" — it's very likely the single biggest lever on whether you place. Today's prompt is ordered accordingly: **the AI call comes before the cinematics, not after.**

---

## Part A — The Fix

### A.0 — Before anything else: does the brief still match your actual problem statement?

Everything in the design dissection — calendar density, message backlog, "two threads collide at 2:40" — was illustrative content I invented for a hypothetical AI-productivity scenario. It is not your assigned Vibe2Ship problem statement. Before you write a single Gemini prompt, confirm what signal AEGIS is actually supposed to detect and what intervention it's actually supposed to recommend, *for the problem statement you picked*. The five-beat emotional architecture (Pressure → Understanding → Prediction → Intervention → Recovery) and the whole visual/motion system survive unchanged regardless of which problem statement you chose — only the *content* of Sections 02–04 needs to map to it. Don't let the cinematic scaffolding quietly lock you into demoing the wrong problem.

### A.1 — AI Experience Strategy, resolved (replaces §12)

| Open question | Decision |
|---|---|
| Live OAuth integration (real Calendar/Gmail) vs. seeded data? | **Seeded.** Build one realistic, hand-authored "day in the life" JSON dataset (events, message threads, deadlines, a couple of genuine collisions) and feed *that* to Gemini. The AI call is 100% real — it's reasoning over realistic data, not live personal accounts. OAuth flows are a multi-day sink for near-zero demo payoff; building one is the highest-regret way to lose a day this week. |
| Which model? | **`gemini-2.5-flash`** as the default — stable, fast, cheap, well-documented, not on Google's deprecation list. If your AI Studio key has access to **`gemini-3.5-flash`** (GA since May 2026, stronger reasoning at similar latency), gate it behind one env var so you can A/B the forecast quality without a code change. Avoid anything still `-preview` for the parts of the demo you can't afford to fail live. |
| Where does the API key live? | **A one-file proxy, not a direct client call.** A Vite/React bundle ships every string in it to the browser — a direct call from `SignalTrack`/`ForecastScene` exposes the key to anyone who opens devtools. If you can deploy a single serverless function today (Vercel Edge Function or Cloudflare Worker, ~20 lines, proxies the request and holds the key server-side), do that. If you genuinely can't today, the fallback is a domain-restricted key (HTTP referrer restriction in Google Cloud Console) plus a one-line disclosure in your README that it's demo-scoped — not silence. |
| What happens on a slow/failed call during the live demo? | **Pre-warm + cached fallback, never a visible error.** Fire the Gemini call the instant the gate (`SysInit`) completes — don't wait for the user to scroll into Section 02 — so the response is likely ready before it's needed. Set an explicit timeout (~6s). On timeout or error, fall back to one pre-baked "last known good" response bundled in the repo. A live demo can never show a stack trace or a spinner that doesn't resolve. |
| What does "AEGIS is thinking" look like? | System register, not a generic spinner: `[ SYS.AEGIS // ANALYZING SIGNAL... ]` with an animated ellipsis (CSS only, not JS-driven) — consistent with the rest of the system-voice convention. |

### A.2 — Demo Floor (new — this didn't exist before, and it's the thing that actually prevents a bad Thursday)

| Tier | Scope | Ships no matter what? |
|---|---|---|
| **Floor** | Gate (`SysInit`, simple — no scratch-reveal needed) → Hero with a masked headline (no scene-cycling) → **one real, visible Gemini call** in the System register, fed by the seeded dataset → Recovery close. Three to four sections, one genuinely working AI moment. | **Yes — non-negotiable.** This alone is a coherent, demoable, honest submission. |
| **Target** | The full five-beat arc as scoped: `SignalTrack`, `ForecastScene`, `InterventionPreview`, magnetic CTAs, section-aware cursor temperature. | What you're building toward, time permitting. |
| **Stretch** | Scratch-reveal canvas, scene-cycling hero, mobile polish beyond "doesn't visibly break." | Cut without guilt if any earlier tier is still shaky. |

Decide the floor is non-negotiable *today*, in writing, so a bad afternoon later this week doesn't turn into an all-nighter protecting features nobody required.

### A.3 — Cursor/canvas decision, resolved

Two independent canvas RAF loops (the existing 45-particle mesh in `CursorField` *and* a new `destination-out` scratch-reveal layer) running simultaneously during the Pressure beat was the underspecified item in the performance table. Resolved: **the scratch-reveal is Stretch-tier and is deferred.** `CursorField`'s particle mesh keeps running everywhere, including the hero, with two small fixes that were already correctly identified as gaps — an epsilon-settle so the RAF loop doesn't run forever at rest, and a pause when the tab is hidden or on `pointer: coarse` (touch) devices. The section-context color-temperature shift is Target-tier: the provider gets built today (cheap), but wiring `CursorField`'s color to it is not required for the Floor.

### A.4 — Two small consistency fixes

- `WhySection` and `TimelineSection` are listed as **PRESERVED** in the component map but **"gains a section index" / "gains GSAP reveal"** in the emotional mapping. Pick one verb: relabel both as **EXTENDED (adds `<SectionIndex>` label only — internals untouched)** so scope doesn't quietly grow later.
- The component map lists a new global `<Reveal>` (IntersectionObserver + CSS-owned motion) component — but §8's own Scroll Rules already say binary-state reveals are what Framer Motion's `whileInView` is for, and `useScrollReveal.ts` already does this. Building `<Reveal>` today would be duplicating machinery you already have. **Cut it from today's scope.** Reserve GSAP `SplitText` + `mask:true` specifically for headline-grade reveals; keep everything else on the existing FM `whileInView` system.

---

## Part B — Today's Prompt

Copy everything in the block below into your coding agent, working in the `AEGIS` repo.

```
You're working in my existing AEGIS repo (React 19, TypeScript, Vite, Tailwind v4,
GSAP, Framer Motion, Lenis). This is a solo hackathon build (Vibe2Ship 2026 — Google
AI Studio is the mandatory core tool, finalists present live), and today's work is
scoped deliberately small and AI-first. Do not start on hero scene-cycling, the
scratch-reveal canvas, ForecastScene, InterventionPreview, or any motion polish
today — those come later. If you find yourself reaching for Three.js, a third
easing curve, or a third canvas system at any point, stop and tell me instead of
proceeding.

GROUND TRUTH — read before touching anything:
- Existing, working, do not break: CursorField.tsx, HeroSection.tsx,
  StatusIndicator.tsx, AnimatedLine.tsx, WhySection.tsx, TimelineSection.tsx,
  FinalSection.tsx, useSmoothScroll.ts, useMousePosition.ts, useScrollReveal.ts,
  index.css.
- Two named eases only, ever: aegis-resolve = cubic-bezier(0.16, 1, 0.3, 1)
  (anything settling into clarity), aegis-pressure = cubic-bezier(0.65, 0, 0.35, 1)
  (Pressure beat only, sharp/anxious). No inline bezier strings anywhere in the
  codebase after today — if you see one, replace it with a reference to one of
  these two.
- GSAP/Framer Motion boundary is a hard rule: scroll-position-bound → GSAP +
  ScrollTrigger. Component-state-bound (hover, mount, toggle) → Framer Motion.
  Never both on the same transform on the same element.
- Do NOT build a new global <Reveal> component. useScrollReveal.ts's existing
  Framer Motion whileInView pattern already covers binary-state reveals — extend
  it if needed, don't duplicate it. GSAP SplitText with mask:true is reserved
  specifically for headline-grade text reveals, nothing else.

TODAY'S ACTUAL GOAL, IN ORDER (do not reorder — each step de-risks the next):

1. CONFIRM THE CONTENT MAPS TO THE REAL PROBLEM STATEMENT.
   Before writing any AI code: ask me what signal AEGIS should actually detect and
   what intervention it should recommend, for the Vibe2Ship problem statement I
   actually chose. Do not assume it's calendar density / message backlog — that
   was illustrative placeholder content from an earlier design exercise, not a
   confirmed requirement. Wait for my answer before writing the seeded dataset
   in step 3 if it would meaningfully change its shape.

2. AI ARCHITECTURE — DECIDE AND IMPLEMENT, DON'T LEAVE OPEN:
   - Create a single proxy endpoint (Vercel Edge Function or Cloudflare Worker —
     pick whichever fits how I'm already deploying this; if I haven't told you,
     ask) that holds the Gemini API key server-side and forwards a request to
     gemini-2.5-flash. Do not call generativelanguage.googleapis.com directly
     from any client-side component — if you genuinely cannot stand up a proxy
     today, stop and tell me why, don't silently fall back to a client-side call.
   - Use the current official Gemini SDK pattern — check the latest quickstart
     in AI Studio / ai.google.dev rather than assuming a remembered snippet is
     still current, since the API has changed shape recently.
   - Build one hand-authored "day in the life" seed dataset (a small JSON file:
     a handful of calendar events, message threads, and at least one genuine
     scheduling collision) reflecting whatever I confirm in step 1.
   - Wire one real end-to-end call: seed data → proxy → Gemini → a response
     rendered in the System register (mono, uppercase, bracketed —
     `[ SYS.AEGIS // SIGNAL DETECTED ]` style, matching StatusIndicator's
     existing font-mono tracking-[0.25em] convention).
   - Fire this call the instant the gate sequence completes, not on scroll —
     hide latency behind scroll time, don't show it.
   - Add a 6-second timeout. On timeout or error, fall back to one pre-baked
     response (hardcode a good one in the repo). Never show a raw error or an
     unresolved spinner.
   - Add a loading state in System register: "[ SYS.AEGIS // ANALYZING
     SIGNAL... ]" with a CSS-only animated ellipsis (no JS-driven animation for
     this).
   PROVE THIS WORKS END TO END BEFORE MOVING ON. This is the most important
   thing that happens today.

3. GLOBAL PLUMBING (only after step 2 works):
   - Create src/utils/gsap.ts: register CustomEase + SplitText + ScrollTrigger
     once, define the two named eases above, export gsap/ScrollTrigger/etc. from
     this one file. Nothing else in the codebase should import gsap directly.
   - Extend useSmoothScroll.ts: sync Lenis to the GSAP ticker and to
     ScrollTrigger.update so the two scroll systems don't drift once
     ScrollTrigger sections exist.
   - Add a useSectionContext hook: scroll position → which of the five named
     stages (pressure/understanding/prediction/intervention/recovery) is
     currently active, broadcast via context. Build the provider; do NOT wire
     CursorField's color to it yet — that's tomorrow's work (Target tier, not
     today's Floor).
   - Add a <SectionIndex> component: a small fixed-position mono label,
     `[ 0X // STAGE NAME ]`, that reads from useSectionContext.
   - In CursorField.tsx: add an epsilon-settle so the RAF loop actually stops
     when the particle system is at rest, and pause the loop when the tab is
     hidden (visibilitychange) or on pointer: coarse devices. Don't add the
     color-temperature shift yet.
   - In useScrollReveal.ts: replace the inline ease array with a reference to
     the named aegis-resolve constant from utils/gsap.ts.

4. RELABEL, DON'T REBUILD:
   - WhySection and TimelineSection are EXTENDED (gain a <SectionIndex> label
     only), not touched internally, and not "PRESERVED" — make sure whatever
     planning doc or comments you're tracking this in reflects that consistently.

DEFINITION OF DONE FOR TODAY:
- [ ] I've confirmed what the AI signal/intervention content actually is for
      our real problem statement (step 1)
- [ ] One real Gemini call works end-to-end through a server-side proxy, with a
      visible System-register response, a working timeout, and a working
      cached fallback — demonstrated to me, not just claimed
- [ ] utils/gsap.ts exists with exactly two named eases and is the only import
      path for GSAP in the codebase
- [ ] useSmoothScroll is synced to GSAP's ticker
- [ ] useSectionContext + <SectionIndex> exist and render correctly across all
      five stages, even though nothing visually reacts to section changes yet
- [ ] CursorField's RAF loop provably stops at rest and pauses on tab-hidden /
      touch
- [ ] Nothing in HeroSection, WhySection, TimelineSection, or FinalSection was
      modified beyond adding a <SectionIndex> label

If at any point something here conflicts with what you find in the actual code,
or a decision above doesn't fit how the repo is actually structured, stop and
ask me rather than improvising a workaround. I'd rather lose five minutes to a
question than discover a wrong assumption on Thursday.
```

---

That's the whole of today. Tomorrow's prompt — hero scene-cycling, `SignalTrack`, `ForecastScene`, the cursor color-temperature wiring — only gets written once the AI call in step 2 above is actually working end to end. Building the cinematics around an AI integration that doesn't exist yet is exactly the ordering mistake the original plan made.
