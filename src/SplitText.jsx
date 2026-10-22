import { motion, useReducedMotion } from 'framer-motion';

export default function SplitText({ text, className = '', delay = 0 }) {
  const reduce = useReducedMotion();
  return <span className={`split-text ${className}`} aria-label={text}>
    {text.split('').map((character, index) => <span className="split-text-mask" key={`${character}-${index}`} aria-hidden="true"><motion.span className="split-text-char" initial={reduce ? false : { y: '110%', opacity: 0, rotateX: -35 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} transition={{ duration: reduce ? 0 : 0.62, delay: reduce ? 0 : delay + index * 0.018, ease: [0.2, 0.75, 0.2, 1] }}>{character === ' ' ? '\u00a0' : character}</motion.span></span>)}
  </span>;
}
