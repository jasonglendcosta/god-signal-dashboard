'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Eye, ExternalLink } from 'lucide-react';
import { Signal } from '@/data/mock';
import { getConfidenceColor, getChainColor, formatPrice, timeAgo } from '@/lib/utils';

interface SignalCardProps {
  signal: Signal;
  index: number;
  onClick?: () => void;
}

export default function SignalCard({ signal, index, onClick }: SignalCardProps) {
  const confColor = getConfidenceColor(signal.confidence);
  const chainColor = getChainColor(signal.chain);

  const TypeIcon = signal.type === 'BUY' ? TrendingUp : signal.type === 'SELL' ? TrendingDown : Eye;
  const typeColor = signal.type === 'BUY' ? '#00E676' : signal.type === 'SELL' ? '#FF1744' : '#FFD600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="glass-card p-4 cursor-pointer hover:scale-[1.01] transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-display"
            style={{ background: `${chainColor}20`, color: chainColor }}
          >
            {signal.symbol.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-sm">{signal.token}</span>
              <span
                className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
                style={{ background: `${chainColor}20`, color: chainColor }}
              >
                {signal.chain}
              </span>
            </div>
            <span className="text-xs text-text-muted">${formatPrice(signal.price)}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end">
            <TypeIcon size={14} style={{ color: typeColor }} />
            <span className="text-xs font-bold" style={{ color: typeColor }}>
              {signal.type}
            </span>
          </div>
          <span className="text-[10px] text-text-muted">{timeAgo(signal.timestamp)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* Confidence bar */}
        <div className="flex-1 mr-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-text-muted uppercase tracking-wider">Confidence</span>
            <span className="text-xs font-bold font-display" style={{ color: confColor }}>
              {signal.confidence}%
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: confColor }}
              initial={{ width: 0 }}
              animate={{ width: `${signal.confidence}%` }}
              transition={{ duration: 0.8, delay: index * 0.05 + 0.3 }}
            />
          </div>
        </div>

        {/* PnL or status */}
        {signal.result && (
          <div className="text-right">
            {signal.result === 'PENDING' ? (
              <span className="text-[10px] px-2 py-1 rounded-full bg-yellow/10 text-yellow">
                ● LIVE
              </span>
            ) : (
              <span
                className="text-xs font-bold"
                style={{ color: signal.result === 'WIN' ? '#00E676' : '#FF1744' }}
              >
                {signal.pnl && signal.pnl > 0 ? '+' : ''}
                {signal.pnl?.toFixed(1)}%
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
