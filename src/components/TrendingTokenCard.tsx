'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { TrendingToken } from '@/data/mock';
import { getChainColor, formatPrice } from '@/lib/utils';

interface TrendingTokenCardProps {
  token: TrendingToken;
  index: number;
}

export default function TrendingTokenCard({ token, index }: TrendingTokenCardProps) {
  const chainColor = getChainColor(token.chain);
  const isPositive = token.change24h > 0;

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
            {token.symbol.slice(0, 3)}
          </div>
          <div>
            <span className="font-display font-semibold text-sm">{token.symbol}</span>
            <p className="text-[10px] text-text-muted">{token.name}</p>
          </div>
        </div>
        <span
          className="px-1.5 py-0.5 rounded text-[9px] font-bold"
          style={{ background: `${chainColor}20`, color: chainColor }}
        >
          {token.chain}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <span className="text-lg font-display font-bold">${formatPrice(token.price)}</span>
          <div className="flex items-center gap-1 mt-0.5">
            {isPositive ? (
              <TrendingUp size={12} className="text-green" />
            ) : (
              <TrendingDown size={12} className="text-red" />
            )}
            <span
              className="text-xs font-semibold"
              style={{ color: isPositive ? '#00E676' : '#FF1744' }}
            >
              {isPositive ? '+' : ''}
              {token.change24h.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-[10px] text-text-muted mb-0.5">
            <Activity size={10} />
            <span>{token.signals} signals</span>
          </div>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              token.whaleInterest === 'HIGH'
                ? 'bg-accent/10 text-accent'
                : token.whaleInterest === 'MEDIUM'
                ? 'bg-yellow/10 text-yellow'
                : 'bg-white/5 text-text-muted'
            }`}
          >
            🐋 {token.whaleInterest}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
