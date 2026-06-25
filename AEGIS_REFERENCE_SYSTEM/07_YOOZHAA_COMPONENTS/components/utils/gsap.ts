import { gsap } from 'gsap';
import { CustomEase, ScrollTrigger } from 'gsap/all';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase, ScrollTrigger);
  
  // Custom premium, slow cinematic ease
  CustomEase.create('cinematicEase', 'M0,0 C0.25,1 0.5,1 1,1');
}

export * from 'gsap';
export { CustomEase, ScrollTrigger };