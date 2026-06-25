import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

CustomEase.create('aegis-resolve', '0.16, 1, 0.3, 1');
CustomEase.create('aegis-pressure', '0.65, 0, 0.35, 1');

// Framer Motion equivalents for use in React components
export const aegisResolveFM = [0.16, 1, 0.3, 1] as const;
export const aegisPressureFM = [0.65, 0, 0.35, 1] as const;

export { gsap, ScrollTrigger, CustomEase };
