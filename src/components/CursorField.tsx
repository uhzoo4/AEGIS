import { useEffect, useRef, useCallback } from 'react';
import { useSectionContext, SectionState } from '../hooks/useSectionContext';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  phase: number;
}

const PARTICLE_COUNT = 45;
const ATTRACTION_RADIUS = 220;
const REPULSION_RADIUS = 60;
const ATTRACTION_FORCE = 0.012;
const REPULSION_FORCE = 0.08;
const DAMPING = 0.94;
const CONNECTION_DISTANCE = 160;
const DRIFT_SPEED = 0.3;

const SECTION_COLORS: Record<SectionState, { r: number, g: number, b: number }> = {
  pressure: { r: 212, g: 165, b: 116 },      // #D4A574 (Anxious amber)
  understanding: { r: 127, g: 219, b: 202 }, // #7FDBCA (Clinical teal)
  prediction: { r: 204, g: 24, b: 24 },      // #CC1818 (High Risk Crimson)
  intervention: { r: 127, g: 219, b: 202 },  // #7FDBCA (Clinical teal)
  recovery: { r: 240, g: 248, b: 255 }       // Alice Blue (Calm)
};

export default function CursorField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, smoothX: -1000, smoothY: -1000 });
  const isIdleRef = useRef(true);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);
  const dprRef = useRef(1);
  
  const { activeSection } = useSectionContext();
  const targetColorRef = useRef(SECTION_COLORS[activeSection]);
  const currentColorRef = useRef({ ...SECTION_COLORS[activeSection] });

  // Update target color safely without restarting RAF
  useEffect(() => {
    targetColorRef.current = SECTION_COLORS[activeSection];
  }, [activeSection]);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: 0,
        vy: 0,
        size: 1 + Math.random() * 1.5,
        opacity: 0.15 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    initParticles(width, height);
  }, [initParticles]);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    handleResize();

    let time = 0;

    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Color temperature lerp
      const current = currentColorRef.current;
      const target = targetColorRef.current;
      current.r += (target.r - current.r) * 0.05;
      current.g += (target.g - current.g) * 0.05;
      current.b += (target.b - current.b) * 0.05;

      const r = Math.round(current.r);
      const g = Math.round(current.g);
      const b = Math.round(current.b);

      // Smooth mouse interpolation
      const dx = mouse.x - mouse.smoothX;
      const dy = mouse.y - mouse.smoothY;
      mouse.smoothX += dx * 0.08;
      mouse.smoothY += dy * 0.08;

      ctx.clearRect(0, 0, width, height);
      time += 0.008;

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const pdx = mouse.smoothX - p.x;
        const pdy = mouse.smoothY - p.y;
        const dist = Math.sqrt(pdx * pdx + pdy * pdy);

        if (!isIdleRef.current && dist < ATTRACTION_RADIUS) {
          const force = ATTRACTION_FORCE * (1 - dist / ATTRACTION_RADIUS);
          p.vx += pdx * force * 0.01;
          p.vy += pdy * force * 0.01;

          if (dist < REPULSION_RADIUS && dist > 0) {
            const repel = REPULSION_FORCE * (1 - dist / REPULSION_RADIUS);
            p.vx -= (pdx / dist) * repel;
            p.vy -= (pdy / dist) * repel;
          }
        }

        const homeX = p.baseX - p.x;
        const homeY = p.baseY - p.y;
        p.vx += homeX * 0.003;
        p.vy += homeY * 0.003;

        if (isIdleRef.current) {
          p.vx += Math.sin(time + p.phase) * DRIFT_SPEED * 0.02;
          p.vy += Math.cos(time * 0.7 + p.phase) * DRIFT_SPEED * 0.02;
        }

        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const cdx = a.x - b.x;
          const cdy = a.y - b.y;
          const dist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.12;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw filled triangles
      for (let i = 0; i < particles.length; i += 3) {
        if (i + 2 >= particles.length) break;
        const a = particles[i];
        const b = particles[i + 1];
        const c = particles[i + 2];

        const dAB = Math.hypot(a.x - b.x, a.y - b.y);
        const dBC = Math.hypot(b.x - c.x, b.y - c.y);
        const dCA = Math.hypot(c.x - a.x, c.y - a.y);

        if (dAB < CONNECTION_DISTANCE && dBC < CONNECTION_DISTANCE && dCA < CONNECTION_DISTANCE) {
          const avgDist = (dAB + dBC + dCA) / 3;
          const alpha = (1 - avgDist / CONNECTION_DISTANCE) * 0.025;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.lineTo(c.x, c.y);
          ctx.closePath();
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.fill();
        }
      }

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.4})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
        ctx.fill();
      }

      // Draw cursor glow
      if (!isIdleRef.current) {
        const cursorGradient = ctx.createRadialGradient(
          mouse.smoothX, mouse.smoothY, 0,
          mouse.smoothX, mouse.smoothY, 120
        );
        cursorGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.06)`);
        cursorGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.beginPath();
        ctx.arc(mouse.smoothX, mouse.smoothY, 120, 0, Math.PI * 2);
        ctx.fillStyle = cursorGradient;
        ctx.fill();
      }

      // Draw small cursor dot
      ctx.beginPath();
      ctx.arc(mouse.smoothX, mouse.smoothY, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
      ctx.fill();

      rafRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      isIdleRef.current = false;

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        isIdleRef.current = true;
      }, 1500);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
      } else {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [handleResize]); // intentional exclusion of activeSection to prevent RAF restart

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
}
