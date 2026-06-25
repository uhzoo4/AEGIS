import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../utils/gsap';
import { useSectionContext } from '../hooks/useSectionContext';

/**
 * SIGNALTRACK — COGNITIVE ECHO SYSTEM
 * ─────────────────────────────────────────────────────────────────────────
 * This is not a list of floating UI labels. It is a generative visualization
 * of intrusive-thought formation: every phrase is born from a central
 * singularity, assembles into something readable, holds, decays, and is
 * reabsorbed — forever, on a loop, for as long as this section is in view.
 *
 * LIFECYCLE (per thought instance):
 *   1. BIRTH      — characters appear near the core as faint, rotated debris.
 *   2. ASSEMBLY    — characters travel from the core out to their resting
 *                    position in the field, aligning into reading order.
 *                    Movement only — no opacity change happens here.
 *   3. PRESENCE    — the thought holds at its own font / weight / color /
 *                    opacity / scale, breathing gently.
 *   4. DECAY       — the letters separate from each other and from clarity.
 *   5. VOID        — the remains travel back to the core and are absorbed.
 *
 * RULES THIS FILE FOLLOWS:
 *   - GSAP only. No Framer Motion. No CSS @keyframes.
 *   - Exactly two eases, ever: 'aegis-pressure' (anxious / sharp) and
 *     'aegis-resolve' (settling / clarifying). Both are registered in
 *     ../utils/gsap.ts. No other easing curve appears anywhere below.
 *   - Thought DOM is created and animated imperatively (outside React's
 *     render cycle). With up to 15 concurrent thoughts × ~20 characters
 *     each, this avoids reconciling hundreds of nodes on every spawn/despawn
 *     and keeps the system at 60fps.
 *   - Max 15 concurrent thoughts on desktop, 8 on touch / small viewports.
 *
 * FONT REQUIREMENT:
 *   Six families are referenced below: Cormorant Garamond, Playfair Display,
 *   JetBrains Mono, IBM Plex Mono, Inter, Space Grotesk. This file assumes
 *   they are already loaded globally (Google Fonts <link> or @font-face) —
 *   it does not load fonts itself. Cormorant Garamond was already in use
 *   elsewhere in AEGIS; the other five are new and must be added to
 *   index.html (or wherever fonts are currently linked) or they will
 *   silently fall back to system fonts and the "no two thoughts share a
 *   style" effect will be far less visible.
 */

// ─────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────

type Category = 'ANXIETY' | 'EXHAUSTION' | 'PRESSURE' | 'SELF_DOUBT' | 'OVERLOAD';
type DepthLayer = 'near' | 'mid' | 'far';

interface ThoughtSeed {
  text: string;
  category: Category;
}

interface FontVariant {
  fontFamily: string;
  fontWeight: number;
  italic?: boolean;
  tracking?: string;
  transform?: 'none' | 'uppercase';
}

interface LayerSpec {
  fontSize: () => string;
  opacityRange: [number, number];
  parallax: number;
}

interface ActiveThought {
  anchor: HTMLDivElement;
  timeline: gsap.core.Timeline;
  leftPct: number;
  topPct: number;
  layer: DepthLayer;
  fontIdx: number;
  color: string;
}

// ─────────────────────────────────────────────────────────────────────────
// CONTENT — the thought bank. ~80 entries across five emotional registers.
// Randomized on every load; never hand-placed, never guaranteed-no-overlap.
// ─────────────────────────────────────────────────────────────────────────

const THOUGHT_BANK: ThoughtSeed[] = [
  // ANXIETY
  { text: 'what if I fail', category: 'ANXIETY' },
  { text: 'not enough time', category: 'ANXIETY' },
  { text: 'unfinished', category: 'ANXIETY' },
  { text: 'what if they notice', category: 'ANXIETY' },
  { text: "I'm so behind", category: 'ANXIETY' },
  { text: 'running out of time', category: 'ANXIETY' },
  { text: "what if it's not enough", category: 'ANXIETY' },
  { text: 'did I forget something', category: 'ANXIETY' },
  { text: 'what if this is wrong', category: 'ANXIETY' },
  { text: 'too many open tabs', category: 'ANXIETY' },
  { text: 'what am I missing', category: 'ANXIETY' },
  { text: 'is this even good', category: 'ANXIETY' },
  { text: 'what if no one reads it', category: 'ANXIETY' },
  { text: 'I should be further along', category: 'ANXIETY' },
  { text: "what if I'm too late", category: 'ANXIETY' },
  { text: 'second-guessing everything', category: 'ANXIETY' },

  // EXHAUSTION
  { text: 'why am I tired', category: 'EXHAUSTION' },
  { text: 'sleep later', category: 'EXHAUSTION' },
  { text: '2:43 AM', category: 'EXHAUSTION' },
  { text: 'why am I still awake', category: 'EXHAUSTION' },
  { text: 'just five more minutes', category: 'EXHAUSTION' },
  { text: "I can't keep my eyes open", category: 'EXHAUSTION' },
  { text: 'when did I eat last', category: 'EXHAUSTION' },
  { text: 'my brain feels foggy', category: 'EXHAUSTION' },
  { text: "coffee isn't working anymore", category: 'EXHAUSTION' },
  { text: "I'm running on nothing", category: 'EXHAUSTION' },
  { text: 'everything feels heavier today', category: 'EXHAUSTION' },
  { text: 'I should have slept', category: 'EXHAUSTION' },
  { text: '4:17 AM', category: 'EXHAUSTION' },
  { text: 'still not done', category: 'EXHAUSTION' },
  { text: 'tired of being tired', category: 'EXHAUSTION' },
  { text: "my eyes won't focus", category: 'EXHAUSTION' },

  // PRESSURE
  { text: 'deadline tomorrow', category: 'PRESSURE' },
  { text: 'too late', category: 'PRESSURE' },
  { text: 'everyone is ahead', category: 'PRESSURE' },
  { text: 'no room for mistakes', category: 'PRESSURE' },
  { text: "the clock won't stop", category: 'PRESSURE' },
  { text: "everyone's already submitted", category: 'PRESSURE' },
  { text: "there's no time to fix this", category: 'PRESSURE' },
  { text: "I can't slow down", category: 'PRESSURE' },
  { text: 'it has to be perfect', category: 'PRESSURE' },
  { text: 'one shot at this', category: 'PRESSURE' },
  { text: "they're all watching", category: 'PRESSURE' },
  { text: 'the bar keeps moving', category: 'PRESSURE' },
  { text: "can't afford a bad day", category: 'PRESSURE' },
  { text: "there's always something due", category: 'PRESSURE' },
  { text: 'not enough hours left', category: 'PRESSURE' },
  { text: 'the deadline moved up again', category: 'PRESSURE' },

  // SELF_DOUBT
  { text: 'not good enough', category: 'SELF_DOUBT' },
  { text: 'I wasted today', category: 'SELF_DOUBT' },
  { text: 'I forgot', category: 'SELF_DOUBT' },
  { text: "maybe I'm not cut out for this", category: 'SELF_DOUBT' },
  { text: 'everyone else makes it look easy', category: 'SELF_DOUBT' },
  { text: 'I should know this by now', category: 'SELF_DOUBT' },
  { text: 'I keep messing this up', category: 'SELF_DOUBT' },
  { text: 'what was the point of today', category: 'SELF_DOUBT' },
  { text: "I'm always one step behind", category: 'SELF_DOUBT' },
  { text: "they'll find out I don't know", category: 'SELF_DOUBT' },
  { text: 'I used to be better at this', category: 'SELF_DOUBT' },
  { text: 'nothing I do feels like enough', category: 'SELF_DOUBT' },
  { text: 'I let myself down again', category: 'SELF_DOUBT' },
  { text: 'I should be better than this', category: 'SELF_DOUBT' },
  { text: "I'm not as sharp as I was", category: 'SELF_DOUBT' },
  { text: "why can't I just get it right", category: 'SELF_DOUBT' },

  // OVERLOAD
  { text: 'one more hour', category: 'OVERLOAD' },
  { text: 'stop scrolling', category: 'OVERLOAD' },
  { text: "can't focus", category: 'OVERLOAD' },
  { text: 'too many things at once', category: 'OVERLOAD' },
  { text: 'everything is due at once', category: 'OVERLOAD' },
  { text: "my mind won't stop moving", category: 'OVERLOAD' },
  { text: "there's no space left to think", category: 'OVERLOAD' },
  { text: "I can't keep up with this", category: 'OVERLOAD' },
  { text: 'so much noise', category: 'OVERLOAD' },
  { text: 'where do I even start', category: 'OVERLOAD' },
  { text: 'everything is loud right now', category: 'OVERLOAD' },
  { text: "I can't process all of this", category: 'OVERLOAD' },
  { text: 'just one thing at a time', category: 'OVERLOAD' },
  { text: 'too many open loops', category: 'OVERLOAD' },
  { text: 'my head is full', category: 'OVERLOAD' },
  { text: "I can't think straight", category: 'OVERLOAD' },
];

const DUST_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// ─────────────────────────────────────────────────────────────────────────
// STYLE SYSTEM — every thought gets a font/weight combination and a color
// drawn from its category's palette. Twelve font variants × five palettes
// gives more than enough combinatorial variety that, combined with the
// "no nearby repeat" rule in EchoEngine, no two thoughts near each other
// ever read the same.
// ─────────────────────────────────────────────────────────────────────────

const FONT_STACK: FontVariant[] = [
  { fontFamily: `'Cormorant Garamond', serif`, fontWeight: 600 },
  { fontFamily: `'Cormorant Garamond', serif`, fontWeight: 400, italic: true },
  { fontFamily: `'Playfair Display', serif`, fontWeight: 700 },
  { fontFamily: `'Playfair Display', serif`, fontWeight: 400, italic: true },
  { fontFamily: `'JetBrains Mono', monospace`, fontWeight: 500, transform: 'uppercase', tracking: '0.08em' },
  { fontFamily: `'JetBrains Mono', monospace`, fontWeight: 300, tracking: '0.03em' },
  { fontFamily: `'IBM Plex Mono', monospace`, fontWeight: 600, transform: 'uppercase', tracking: '0.1em' },
  { fontFamily: `'IBM Plex Mono', monospace`, fontWeight: 300 },
  { fontFamily: `'Inter', sans-serif`, fontWeight: 300 },
  { fontFamily: `'Inter', sans-serif`, fontWeight: 600 },
  { fontFamily: `'Space Grotesk', sans-serif`, fontWeight: 500 },
  { fontFamily: `'Space Grotesk', sans-serif`, fontWeight: 700, transform: 'uppercase', tracking: '-0.01em' },
];

const COLOR_PALETTES: Record<Category, string[]> = {
  ANXIETY: ['#D4A574', '#C99A65', '#E0B888'],
  EXHAUSTION: ['#8A8A93', '#707079', '#9CA3AE'],
  PRESSURE: ['#CC1818', '#A91D1D', '#E0453E'],
  SELF_DOUBT: ['#B7B7C2', '#8E8E99', '#D8D8DE'],
  OVERLOAD: ['var(--color-signal)', '#4FD1C5', '#3FA9A0'],
};

const rand = (min: number, max: number): number => gsap.utils.random(min, max) as number;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const LAYER_CONFIG: Record<DepthLayer, LayerSpec> = {
  near: { fontSize: () => `${rand(3.2, 6.4)}rem`, opacityRange: [0.78, 0.95], parallax: 32 },
  mid: { fontSize: () => `${rand(1.5, 2.6)}rem`, opacityRange: [0.45, 0.68], parallax: 15 },
  far: { fontSize: () => `${rand(0.8, 1.3)}rem`, opacityRange: [0.2, 0.36], parallax: 6 },
};

// Stage durations, in seconds. Sum is ~15s — close to the 14s reading-speed
// target — with VOID treated as a short coda rather than a full beat.
const BIRTH_DURATION = 3;
const ASSEMBLY_DURATION = 2;
const SNAP_DURATION = 0.6;
const PRESENCE_DURATION = 6;
const DECAY_DURATION = 3;
const VOID_DURATION = 1.3;

// ─────────────────────────────────────────────────────────────────────────
// GEOMETRY HELPER
// Computes, for every character span, the vector from its natural (resting)
// position to the center of the cognitive core. This vector is what BIRTH
// and VOID animate from/to — it's why thoughts visibly emerge from and
// return to the singularity no matter where in the field they live.
// ─────────────────────────────────────────────────────────────────────────

function measureBirthOffsets(chars: HTMLSpanElement[], coreEl: HTMLElement): { x: number; y: number }[] {
  const coreRect = coreEl.getBoundingClientRect();
  const coreX = coreRect.left + coreRect.width / 2;
  const coreY = coreRect.top + coreRect.height / 2;
  return chars.map((span) => {
    const r = span.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    return { x: coreX - cx, y: coreY - cy };
  });
}

// ─────────────────────────────────────────────────────────────────────────
// PARALLAX
// Three depth layers drift at different rates under the pointer. Uses
// gsap.quickTo (a single interpolator per axis per layer) rather than
// retargeting tweens on every mousemove — this is the cheap, correct way
// to do continuous pointer-follow in GSAP.
// ─────────────────────────────────────────────────────────────────────────

function setupParallax(
  host: HTMLElement,
  layers: { near: HTMLElement; mid: HTMLElement; far: HTMLElement }
): () => void {
  const nearX = gsap.quickTo(layers.near, 'x', { duration: 0.9, ease: 'aegis-resolve' });
  const nearY = gsap.quickTo(layers.near, 'y', { duration: 0.9, ease: 'aegis-resolve' });
  const midX = gsap.quickTo(layers.mid, 'x', { duration: 1.15, ease: 'aegis-resolve' });
  const midY = gsap.quickTo(layers.mid, 'y', { duration: 1.15, ease: 'aegis-resolve' });
  const farX = gsap.quickTo(layers.far, 'x', { duration: 1.4, ease: 'aegis-resolve' });
  const farY = gsap.quickTo(layers.far, 'y', { duration: 1.4, ease: 'aegis-resolve' });

  const handleMove = (e: PointerEvent) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    nearX(nx * LAYER_CONFIG.near.parallax);
    nearY(ny * LAYER_CONFIG.near.parallax);
    midX(nx * LAYER_CONFIG.mid.parallax);
    midY(ny * LAYER_CONFIG.mid.parallax);
    farX(nx * LAYER_CONFIG.far.parallax);
    farY(ny * LAYER_CONFIG.far.parallax);
  };

  host.addEventListener('pointermove', handleMove);
  return () => host.removeEventListener('pointermove', handleMove);
}

// ─────────────────────────────────────────────────────────────────────────
// DUST FIELD
// Pure atmosphere: a handful of single, unrelated characters drifting in
// slow orbits close to the core, occasionally swapping to a different
// random letter. These never resolve into words and aren't counted toward
// the 15-thought cap — they're mental static, not thoughts.
// ─────────────────────────────────────────────────────────────────────────

class DustField {
  private host: HTMLElement;
  private coreEl: HTMLElement;
  private count: number;
  private glyphs: HTMLSpanElement[] = [];
  private tweens: gsap.core.Tween[] = [];
  private running = false;

  constructor(host: HTMLElement, coreEl: HTMLElement, count: number) {
    this.host = host;
    this.coreEl = coreEl;
    this.count = count;
  }

  start(): void {
    if (this.glyphs.length) {
      this.running = true;
      this.tweens.forEach((t) => t.play());
      return;
    }
    this.running = true;
    const coreRect = this.coreEl.getBoundingClientRect();
    const baseRadius = Math.max(coreRect.width, 160);

    for (let i = 0; i < this.count; i++) {
      const span = document.createElement('span');
      span.textContent = pick(DUST_CHARS);
      span.style.position = 'absolute';
      span.style.left = '50%';
      span.style.top = '50%';
      span.style.fontFamily = `'JetBrains Mono', monospace`;
      span.style.fontSize = `${rand(0.7, 1.3)}rem`;
      span.style.color = '#9A9AA4';
      span.style.opacity = `${rand(0.04, 0.12)}`;
      span.style.pointerEvents = 'none';
      span.style.willChange = 'transform';
      this.host.appendChild(span);
      this.glyphs.push(span);

      const angle = rand(0, Math.PI * 2);
      const radius = rand(baseRadius * 0.6, baseRadius * 1.8);
      gsap.set(span, { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });

      this.driftLoop(span, baseRadius);
    }
  }

  private driftLoop(span: HTMLSpanElement, baseRadius: number): void {
    const angle = rand(0, Math.PI * 2);
    const radius = rand(baseRadius * 0.6, baseRadius * 2.2);
    const tween = gsap.to(span, {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      rotation: `+=${rand(-30, 30)}`,
      duration: rand(7, 13),
      ease: 'aegis-resolve',
      onComplete: () => {
        if (Math.random() < 0.4) span.textContent = pick(DUST_CHARS);
        if (this.running) this.driftLoop(span, baseRadius);
      },
    });
    this.tweens.push(tween);
  }

  pause(): void {
    this.running = false;
    this.tweens.forEach((t) => t.pause());
  }

  destroy(): void {
    this.running = false;
    this.tweens.forEach((t) => t.kill());
    this.tweens = [];
    this.glyphs.forEach((g) => g.remove());
    this.glyphs = [];
  }
}

// ─────────────────────────────────────────────────────────────────────────
// ECHO ENGINE
// Owns the spawn loop and the five-stage lifecycle for every thought.
// Spawning is a self-scheduling chain of gsap.delayedCall (not setInterval)
// so it can be paused/resumed in lockstep with the rest of GSAP's timeline
// — and so it stops cleanly the instant the section scrolls out of view.
// ─────────────────────────────────────────────────────────────────────────

class EchoEngine {
  private layers: { near: HTMLElement; mid: HTMLElement; far: HTMLElement };
  private coreEl: HTMLElement;
  private maxThoughts: number;
  private reduceMotion: boolean;
  private active = new Map<number, ActiveThought>();
  private recentTexts: string[] = [];
  private nextId = 0;
  private running = false;
  private spawnTimer: gsap.core.Tween | null = null;

  constructor(opts: {
    layers: { near: HTMLElement; mid: HTMLElement; far: HTMLElement };
    core: HTMLElement;
    maxThoughts: number;
    reduceMotion: boolean;
  }) {
    this.layers = opts.layers;
    this.coreEl = opts.core;
    this.maxThoughts = opts.maxThoughts;
    this.reduceMotion = opts.reduceMotion;
  }

  start(): void {
    this.active.forEach((t) => t.timeline.play());
    if (this.running) return;
    this.running = true;
    this.scheduleNext(true);
  }

  pause(): void {
    this.running = false;
    this.spawnTimer?.kill();
    this.active.forEach((t) => t.timeline.pause());
  }

  destroy(): void {
    this.running = false;
    this.spawnTimer?.kill();
    this.active.forEach((t) => {
      t.timeline.kill();
      t.anchor.remove();
    });
    this.active.clear();
  }

  // ── spawn scheduling ─────────────────────────────────────────────────

  private scheduleNext(immediate = false): void {
    const delay = immediate ? rand(0.1, 0.4) : rand(0.9, this.reduceMotion ? 3.6 : 2.3);
    this.spawnTimer = gsap.delayedCall(delay, () => {
      if (!this.running) return;
      if (this.active.size < this.maxThoughts) {
        this.spawnThought();
      }
      this.scheduleNext();
    });
  }

  // ── selection helpers ────────────────────────────────────────────────

  private pickThought(): ThoughtSeed {
    const pool = THOUGHT_BANK.filter((t) => !this.recentTexts.includes(t.text));
    const choice = pick(pool.length ? pool : THOUGHT_BANK);
    this.recentTexts.push(choice.text);
    if (this.recentTexts.length > 12) this.recentTexts.shift();
    return choice;
  }

  private pickLayer(): DepthLayer {
    const r = Math.random();
    if (r < 0.22) return 'near';
    if (r < 0.62) return 'mid';
    return 'far';
  }

  private pickPosition(layer: DepthLayer): { leftPct: number; topPct: number } {
    const minDist = layer === 'near' ? 24 : layer === 'mid' ? 16 : 11;
    const others = Array.from(this.active.values());
    for (let attempt = 0; attempt < 10; attempt++) {
      const leftPct = rand(6, 92);
      const topPct = rand(9, 90);
      if (Math.hypot(leftPct - 50, topPct - 50) < 17) continue; // keep clear of the core
      const blocked = others.some((o) => Math.hypot(o.leftPct - leftPct, o.topPct - topPct) < minDist);
      if (!blocked) return { leftPct, topPct };
    }
    return { leftPct: rand(6, 92), topPct: rand(9, 90) };
  }

  /** Active thoughts within a 30-pct-point radius of `position` — their
   *  font index and color are off-limits for the new thought. */
  private nearbyStyles(position: { leftPct: number; topPct: number }): { fontIdxs: number[]; colors: string[] } {
    const fontIdxs: number[] = [];
    const colors: string[] = [];
    this.active.forEach((t) => {
      if (Math.hypot(t.leftPct - position.leftPct, t.topPct - position.topPct) < 30) {
        fontIdxs.push(t.fontIdx);
        colors.push(t.color);
      }
    });
    return { fontIdxs, colors };
  }

  private pickStyle(exclude: number[]): FontVariant & { idx: number } {
    const candidates = FONT_STACK.map((f, idx) => ({ f, idx })).filter((c) => !exclude.includes(c.idx));
    const chosen = pick(candidates.length ? candidates : FONT_STACK.map((f, idx) => ({ f, idx })));
    return { ...chosen.f, idx: chosen.idx };
  }

  private pickColor(category: Category, exclude: string[]): string {
    const palette = COLOR_PALETTES[category].filter((c) => !exclude.includes(c));
    return pick(palette.length ? palette : COLOR_PALETTES[category]);
  }

  // ── spawn + lifecycle ────────────────────────────────────────────────

  private spawnThought(): void {
    const seed = this.pickThought();
    const layer = this.pickLayer();
    const position = this.pickPosition(layer);
    const { fontIdxs, colors } = this.nearbyStyles(position);
    const variant = this.pickStyle(fontIdxs);
    const color = this.pickColor(seed.category, colors);
    const presenceOpacity = rand(LAYER_CONFIG[layer].opacityRange[0], LAYER_CONFIG[layer].opacityRange[1]);

    const anchor = document.createElement('div');
    anchor.style.position = 'absolute';
    anchor.style.left = `${position.leftPct}%`;
    anchor.style.top = `${position.topPct}%`;
    anchor.style.transform = 'translate(-50%, -50%)';
    anchor.style.whiteSpace = 'nowrap';
    anchor.style.pointerEvents = 'none';
    anchor.style.lineHeight = '1';
    anchor.style.fontFamily = variant.fontFamily;
    anchor.style.fontWeight = String(variant.fontWeight);
    anchor.style.fontStyle = variant.italic ? 'italic' : 'normal';
    anchor.style.fontSize = LAYER_CONFIG[layer].fontSize();
    anchor.style.color = color;
    anchor.style.letterSpacing = variant.tracking ?? 'normal';
    anchor.style.textTransform = variant.transform ?? 'none';

    const chars: HTMLSpanElement[] = [];
    Array.from(seed.text).forEach((ch) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.filter = 'blur(0px)';
      span.style.willChange = 'transform, opacity, filter';
      anchor.appendChild(span);
      chars.push(span);
    });

    this.layers[layer].appendChild(anchor);
    const offsets = measureBirthOffsets(chars, this.coreEl);
    const id = this.nextId++;
    const timeline = this.runLifecycle(id, anchor, chars, offsets, presenceOpacity);

    this.active.set(id, {
      anchor,
      timeline,
      leftPct: position.leftPct,
      topPct: position.topPct,
      layer,
      fontIdx: variant.idx,
      color,
    });
  }

  private runLifecycle(
    id: number,
    anchor: HTMLDivElement,
    chars: HTMLSpanElement[],
    offsets: { x: number; y: number }[],
    presenceOpacity: number
  ): gsap.core.Timeline {
    const tl = gsap.timeline({
      onComplete: () => {
        anchor.remove();
        this.active.delete(id);
      },
    });

    // STAGE 1 — BIRTH: scatter near the core as faint, hazy debris, then
    // orbit slowly. Letters here are not yet in reading order.
    tl.set(chars, {
      x: (i: number) => offsets[i].x + rand(-30, 30),
      y: (i: number) => offsets[i].y + rand(-30, 30),
      rotation: () => rand(-180, 180),
      scale: () => rand(0.4, 0.85),
      opacity: () => rand(0.05, 0.2),
      filter: 'blur(3px)',
    });
    tl.to(chars, {
      x: (i: number) => offsets[i].x + rand(-50, 50),
      y: (i: number) => offsets[i].y + rand(-50, 50),
      rotation: () => rand(-200, 200),
      duration: BIRTH_DURATION,
      ease: 'aegis-pressure',
      stagger: { each: 0.045, from: 'random' },
    });

    // STAGE 2 — ASSEMBLY: pure movement toward each letter's resting
    // position, sharpening into focus as it aligns. No opacity change.
    tl.to(chars, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: ASSEMBLY_DURATION,
      ease: 'aegis-resolve',
      stagger: { each: 0.035, from: 'start' },
    });

    // STAGE 3 — PRESENCE: the thought clarifies to its own designated
    // opacity (a separate tween from the assembly move above — this is
    // where it becomes fully "itself"), then breathes gently while held.
    tl.to(chars, { opacity: presenceOpacity, duration: SNAP_DURATION, ease: 'aegis-resolve' }, '-=0.15');
    tl.to(
      anchor,
      { scale: 1.025, duration: PRESENCE_DURATION / 2, ease: 'aegis-resolve', yoyo: true, repeat: 1 },
      '<'
    );

    // STAGE 4 — DECAY: the letters separate from each other and from
    // clarity at once — drift, spin, blur, dim. Falling apart, not fading.
    tl.to(chars, {
      x: () => rand(-55, 55),
      y: () => rand(-30, 85),
      rotation: () => rand(-100, 100),
      opacity: 0.12,
      filter: 'blur(5px)',
      scale: 0.82,
      duration: DECAY_DURATION,
      ease: 'aegis-pressure',
      stagger: { each: 0.05, from: 'random' },
    });

    // STAGE 5 — VOID: what's left of the thought is pulled back into the
    // singularity it came from and absorbed.
    tl.to(chars, {
      x: (i: number) => offsets[i].x,
      y: (i: number) => offsets[i].y,
      scale: 0.12,
      opacity: 0,
      filter: 'blur(14px)',
      duration: VOID_DURATION,
      ease: 'aegis-resolve',
      stagger: { each: 0.03, from: 'random' },
    });

    return tl;
  }
}

// ─────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────

const CORE_LABEL = 'COGNITIVE OVERLOAD DETECTED';
const CORE_SUBLABEL = 'Noise parsed. Trajectory mapped.';

export default function SignalTrack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const farLayerRef = useRef<HTMLDivElement>(null);
  const dustLayerRef = useRef<HTMLDivElement>(null);
  const midLayerRef = useRef<HTMLDivElement>(null);
  const nearLayerRef = useRef<HTMLDivElement>(null);
  const { setActiveSection } = useSectionContext();

  useGSAP(
    () => {
      if (
        !containerRef.current ||
        !coreRef.current ||
        !farLayerRef.current ||
        !dustLayerRef.current ||
        !midLayerRef.current ||
        !nearLayerRef.current
      ) {
        return;
      }

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
      const maxThoughts = isCoarsePointer ? 8 : 15;
      const dustCount = isCoarsePointer ? 10 : 24;

      gsap.set(coreRef.current, { opacity: 0, scale: 0.92 });
      gsap.set(subtextRef.current, { opacity: 0, y: 12 });

      const engine = new EchoEngine({
        layers: { near: nearLayerRef.current, mid: midLayerRef.current, far: farLayerRef.current },
        core: coreRef.current,
        maxThoughts,
        reduceMotion,
      });

      const dust = new DustField(dustLayerRef.current, coreRef.current, dustCount);

      const breathe = gsap.to(coreRef.current, {
        opacity: 0.92,
        scale: 1.015,
        duration: 6,
        ease: 'aegis-resolve',
        yoyo: true,
        repeat: -1,
        paused: true,
      });

      let removeParallax: (() => void) | undefined;
      if (!isCoarsePointer && !reduceMotion) {
        removeParallax = setupParallax(containerRef.current, {
          near: nearLayerRef.current,
          mid: midLayerRef.current,
          far: farLayerRef.current,
        });
      }

      const wake = () => {
        setActiveSection('understanding');
        gsap.to(coreRef.current, { opacity: 1, scale: 1, duration: 1.6, ease: 'aegis-resolve' });
        gsap.to(subtextRef.current, { opacity: 1, y: 0, duration: 1.4, ease: 'aegis-resolve', delay: 0.4 });
        breathe.play();
        engine.start();
        dust.start();
      };

      const sleep = () => {
        breathe.pause();
        engine.pause();
        dust.pause();
      };

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * 4}`,
        pin: true,
        invalidateOnRefresh: true,
        onEnter: wake,
        onEnterBack: wake,
        onLeave: sleep,
        onLeaveBack: sleep,
      });

      return () => {
        removeParallax?.();
        engine.destroy();
        dust.destroy();
        breathe.kill();
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="understanding"
      className="relative min-h-screen flex items-center justify-center bg-void z-10 overflow-hidden"
    >
      {/* Depth layer: far — small, faint, slowest parallax. Sits behind the core. */}
      <div ref={farLayerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden="true" />

      {/* Ambient mental static — never resolves into words, not counted as a thought. */}
      <div ref={dustLayerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }} aria-hidden="true" />

      {/* The singularity. Always present, breathing, emitting and absorbing thoughts. */}
      <div ref={coreRef} className="relative text-center px-6 max-w-3xl mx-auto pointer-events-none" style={{ zIndex: 3 }}>
        <h2 className="font-mono text-2xl sm:text-3xl md:text-5xl tracking-[0.15em] md:tracking-[0.22em] uppercase text-signal leading-tight">
          {CORE_LABEL}
        </h2>
        <div className="mt-8 w-20 h-px bg-signal/40 mx-auto" />
        <p ref={subtextRef} className="mt-4 text-xs sm:text-sm text-text-tertiary tracking-widest uppercase font-mono">
          {CORE_SUBLABEL}
        </p>
      </div>

      {/* Depth layer: mid — sits in front of the core. */}
      <div ref={midLayerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 4 }} aria-hidden="true" />

      {/* Depth layer: near — large, bright, fastest parallax. The most intrusive layer. */}
      <div ref={nearLayerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }} aria-hidden="true" />
    </section>
  );
}