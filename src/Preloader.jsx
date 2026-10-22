import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { motionConfig } from './motionConfig.js';

export default function Preloader({ onComplete }) {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(reduce ? 100 : 8);
  useEffect(() => {
    if (reduce) { onComplete?.(); return; }
    let value = 8;
    const interval = window.setInterval(() => {
      value = Math.min(100, value + (value < 68 ? 13 : value < 90 ? 7 : 3));
      setProgress(value);
      if (value >= 100) {
        window.clearInterval(interval);
        window.setTimeout(() => onComplete?.(), motionConfig.preloader.minimumVisibleMs);
      }
    }, 48);
    return () => window.clearInterval(interval);
  }, [onComplete, reduce]);
  return <motion.div className="brand-preloader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} aria-label="Loading Sriram Travels" role="status">
    <div className="preloader-emblem">S</div>
    <span className="preloader-name">SRIRAM TRAVELS</span>
    <span className="preloader-subtitle">TRAVELS & TOWING SERVICES · GOOTY</span>
    <div className="preloader-track"><motion.span animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut', duration: 0.12 }} /></div>
    <span className="preloader-progress">{String(progress).padStart(3, '0')}%</span>
  </motion.div>;
}
