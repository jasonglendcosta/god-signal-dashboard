'use client';

import { motion } from 'framer-motion';
import { getFearGreedColor, getFearGreedLabel } from '@/lib/utils';

interface FearGreedGaugeProps {
  value: number;
  previousValue: number;
}

export default function FearGreedGauge({ value, previousValue }: FearGreedGaugeProps) {
  const color = getFearGreedColor(value);
  const label = getFearGreedLabel(value);
  const change = value - previousValue;
  const rotation = (value / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div className="flex flex-col items-center">
      {/* Gauge */}
      <div className="relative w-56 h-28 overflow-hidden">
        {/* Background arc */}
        <div className="absolute inset-0">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF1744" />
                <stop offset="25%" stopColor="#FF9100" />
                <stop offset="50%" stopColor="#FFD600" />
                <stop offset="75%" stopColor="#00E676" />
                <stop offset="100%" stopColor="#00E676" />
              </linearGradient>
            </defs>
            <path
              d="M 20 95 A 80 80 0 0 1 180 95"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <motion.path
              d="M 20 95 A 80 80 0 0 1 180 95"
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: value / 100 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
        </div>

        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 origin-bottom"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ width: '2px', height: '70px', marginLeft: '-1px' }}
        >
          <div className="w-full h-full bg-gradient-to-t from-transparent to-white rounded-full" />
        </motion.div>

        {/* Center dot */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full bg-white/20 border-2 border-white/40" />
      </div>

      {/* Value */}
      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-5xl font-display font-bold" style={{ color }}>
          {value}
        </span>
        <p className="text-sm font-medium mt-1" style={{ color }}>
          {label}
        </p>
        <p className="text-xs text-text-muted mt-1">
          {change > 0 ? '↑' : '↓'} {Math.abs(change)} from yesterday
        </p>
      </motion.div>
    </div>
  );
}
