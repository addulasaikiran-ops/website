import { motion, useReducedMotion } from 'framer-motion';

export default function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const reduce = useReducedMotion();
  const Component = motion[as] || motion.div;
  return <Component className={className} initial={reduce ? false : { opacity: 0, y: 18, filter: 'blur(4px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reduce ? 0 : 0.7, delay, ease: [0.2, 0.75, 0.2, 1] }}>{children}</Component>;
}
