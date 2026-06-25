import { useEffect, useRef, useState, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
  smoothX: number;
  smoothY: number;
  isIdle: boolean;
}

export function useMousePosition(lerpFactor = 0.08, idleTimeout = 1500): MousePosition {
  const [state, setState] = useState<MousePosition>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    smoothX: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    smoothY: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    isIdle: true,
  });

  const rawRef = useRef({ x: state.x, y: state.y });
  const smoothRef = useRef({ x: state.smoothX, y: state.smoothY });
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isIdleRef = useRef(true);
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    rawRef.current.x = e.clientX;
    rawRef.current.y = e.clientY;
    isIdleRef.current = false;

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      isIdleRef.current = true;
    }, idleTimeout);
  }, [idleTimeout]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const isRunningRef = { current: true };

    const animate = () => {
      if (!isRunningRef.current) return;

      const { x: targetX, y: targetY } = rawRef.current;
      const smooth = smoothRef.current;

      const dx = targetX - smooth.x;
      const dy = targetY - smooth.y;

      // Epsilon check: if movement energy falls below threshold, snap and pause
      if (isIdleRef.current && Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        smooth.x = targetX;
        smooth.y = targetY;
        setState({
          x: targetX,
          y: targetY,
          smoothX: targetX,
          smoothY: targetY,
          isIdle: true,
        });
        isRunningRef.current = false;
        return;
      }

      smooth.x += dx * lerpFactor;
      smooth.y += dy * lerpFactor;

      setState({
        x: rawRef.current.x,
        y: rawRef.current.y,
        smoothX: smooth.x,
        smoothY: smooth.y,
        isIdle: isIdleRef.current,
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunningRef.current = false;
        cancelAnimationFrame(rafRef.current);
      } else {
        if (!isRunningRef.current) {
          isRunningRef.current = true;
          rafRef.current = requestAnimationFrame(animate);
        }
      }
    };
    
    // Patch handleMouseMove to resume animation
    const originalHandleMouseMove = handleMouseMove;
    window.removeEventListener('mousemove', originalHandleMouseMove);
    
    const newHandleMouseMove = (e: MouseEvent) => {
      originalHandleMouseMove(e);
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('mousemove', newHandleMouseMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    isRunningRef.current = true;
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', newHandleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      isRunningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [handleMouseMove, lerpFactor]);

  return state;
}
