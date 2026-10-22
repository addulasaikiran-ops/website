import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { sceneMotion, motionConfig } from './motionConfig.js';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollRig() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const mobile = window.matchMedia(`(max-width: ${motionConfig.performance.mobileBreakpoint}px)`).matches;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
    lenis.on('scroll', ScrollTrigger.update);
    const ticker = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      // Main scene choreography: hero -> fleet -> towing -> contact.
      ScrollTrigger.create({
        trigger: '.premium-page',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => { sceneMotion.progress = self.progress; },
      });

      // Pin the fleet story and scrub its cards horizontally on larger screens.
      const story = document.querySelector('.fleet-story');
      const track = document.querySelector('.fleet-story-track');
      if (story && track && !mobile) {
        gsap.to(track, {
          x: () => Math.min(0, window.innerWidth - track.scrollWidth - 72),
          ease: 'none',
          scrollTrigger: {
            trigger: story,
            start: 'top top',
            end: () => `+=${Math.max(window.innerHeight * 1.3, track.scrollWidth - window.innerWidth + 100)}`,
            scrub: motionConfig.scroll.scrub,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, y: motionConfig.reveal.y, filter: `blur(${motionConfig.reveal.blur}px)` }, {
          autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: motionConfig.reveal.duration, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });
      });
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      context.revert();
      gsap.ticker.remove(ticker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      sceneMotion.progress = 0;
    };
  }, []);
  return null;
}
