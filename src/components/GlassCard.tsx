'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  glow?: boolean;
}

export default function GlassCard({ children, className = '', delay = 0, hover = true, glow = false }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={`glass-card p-5 ${hover ? 'hover:scale-[1.01]' : ''} ${glow ? 'glow-pulse' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
