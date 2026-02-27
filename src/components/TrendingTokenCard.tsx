'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { getChainColor, formatPrice } from '@/lib/utils';

interface TrendingTokenCardProps {
  token: Record<string, any>;
  index: number;
}

export default function TrendingTokenCard({ token, index }: TrendingTokenCardProps) {
  const chain = token.chain ?? 'multi';
  const symbol = token.token ?? token.symbol ?? '???';
  const name = token.name ?? symbol;
  const chainColor = getChainColor(chain);

  // API fields: alert_count, avg_score, peak_score, max_whale, max_dex, max_social
  const alertCount = token.alert_count ?? token.signals ?? 0;
  const avgScore = token.avg_score ?? 0;
  const peakScore = token.peak_score ?? 0;

  // Whale interest based on max_whale score
  const maxWhale = token.max_whale ?? 0;
  const whaleInterest = maxWhale >= 60 ? 'HIGH' : maxWhale >= 30 ? 'MEDIUM' : 'LOW';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass-card p-4 hover:scale-[1.02] transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold font-display"
            style={{ background: `${chainColor}20`, color: chainColor }}
          >
            {symbol.slice(0, 3)}
          </div>
          <div>
            <span className="font-display font-semibold text-sm">{symbol}</span>
            {name !== symbol && <p className="text-[10px] text-text-muted">{name}</p>}
          </div>
        </div>
        <span
          className="px-1.5 py-0.5 rounded text-[9px] font-bold"
          style={{ background: `${chainColor}20`, color: chainColor }}
        >
          {chain}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-display font-bold">{Math.round(avgScore)}</span>
            <span className="text-[10px] text-text-muted">avg</span>
            <span className="text-sm font-display font-semibold text-accent">{Math.round(peakScore)}</span>
            <span className="text-[10px] text-text-muted">peak</span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-[10px] text-text-muted mb-0.5">
            <Activity size={10} />
            <span>{alertCount} alerts</span>
          </div>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              whaleInterest === 'HIGH'
                ? 'bg-accent/10 text-accent'
                : whaleInterest === 'MEDIUM'
                ? 'bg-yellow/10 text-yellow'
                : 'bg-white/5 text-text-muted'
            }`}
          >
            🐋 {whaleInterest}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
