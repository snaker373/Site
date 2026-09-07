'use client';
import { motion, useReducedMotion } from 'framer-motion';
export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduced ? undefined : { y: [14, 0] }} viewport={{ once: true, amount: .15 }} transition={{ duration: .5, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
