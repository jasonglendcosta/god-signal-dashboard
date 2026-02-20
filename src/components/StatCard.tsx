'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: number;
  delay?: number;
  accentColor?: string;
}

export default function StatCard({ label, value, icon: Icon, subtitle, trend, delay = 0, accentColor = '#D86DCB' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-5 hover:scale-[1.02] transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accentColor}15` }}
        >
          <Icon size={20} style={{ color: accentColor }} />
        </div>
        {trend !== undefined && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: trend >= 0 ? 'rgba(0,230,118,0.1)' : 'rgba(255,23,68,0.1)',
              color: trend >= 0 ? '#00E676' : '#FF1744',
            }}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-display font-bold">{value}</p>
      <p className="text-xs text-text-muted mt-1">{label}</p>
      {subtitle && <p className="text-[10px] text-text-secondary mt-0.5">{subtitle}</p>}
    </motion.div>
  );
}
