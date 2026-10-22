import { useEffect, useState } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { business } from './data.js';

export default function ExperienceChrome() {
  const [cursor, setCursor] = useState({ x: -100, y: -100, visible: false });
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      document.documentElement.style.setProperty('--page-progress', `${progress * 100}%`); document.documentElement.style.setProperty('--page-progress-number', String(progress));
    };
    const onPointer = (event) => {
      if (event.pointerType === 'touch') return;
      setCursor({ x: event.clientX, y: event.clientY, visible: true });
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    if (!reduce && window.matchMedia('(pointer:fine)').matches) window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);
  const whatsapp = `https://wa.me/${business.phone}?text=${encodeURIComponent('Hello Sriram Travels & Towing Services, I would like to enquire about your services.')}`;
  return <>
    <div className="scroll-progress-track" aria-hidden="true"><span /></div>
    <svg className="roadline-drawing" viewBox="0 0 120 680" preserveAspectRatio="none" aria-hidden="true">
      <path className="roadline-shadow" d="M60 0 C15 110 100 155 58 270 S25 420 60 510 S80 620 60 680" />
      <path className="roadline-stroke" d="M60 0 C15 110 100 155 58 270 S25 420 60 510 S80 620 60 680" />
    </svg>
    <div className={`custom-cursor ${cursor.visible ? 'is-visible' : ''}`} style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }} aria-hidden="true"><span /></div>
    <div className="floating-contact" aria-label="Quick contact">
      <a href={`tel:+${business.phone}`} aria-label={`Call ${business.name}`}><Phone size={17} /><span>Call</span></a>
      <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="Enquire on WhatsApp"><MessageCircle size={18} /><span>WhatsApp</span></a>
    </div>
  </>;
}
