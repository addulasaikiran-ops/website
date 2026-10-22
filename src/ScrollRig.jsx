import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { sceneMotion, motionConfig } from './motionConfig.js';

gsap.registerPlugin(ScrollTrigger);
export default function ScrollRig() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const mobile = window.matchMedia(`(max-width: ${motionConfig.performance.mobileBreakpoint}px)`).matches;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
    lenis.on('scroll', ScrollTrigger.update);
    const ticker = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
    const context = gsap.context(() => {
      const story = document.querySelector('.fleet-story');
      if (story && !mobile) {
        gsap.to(sceneMotion, { progress: 1, ease: 'none', scrollTrigger: { trigger: story, start: motionConfig.scroll.start, end: motionConfig.scroll.end, scrub: motionConfig.scroll.scrub, pin: motionConfig.scroll.pin, invalidateOnRefresh: true } });
      } else {
        ScrollTrigger.create({ trigger: '.premium-page', start: 'top top', end: 'bottom bottom', onUpdate: (self) => { sceneMotion.progress = self.progress; } });
      }
      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, y: motionConfig.reveal.y, filter: `blur(${motionConfig.reveal.blur}px)` }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: motionConfig.reveal.duration, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
      });
    });
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); context.revert(); gsap.ticker.remove(ticker); lenis.destroy(); ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); sceneMotion.progress = 0; };
  }, []);
  return null;
}
