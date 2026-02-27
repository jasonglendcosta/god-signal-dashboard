'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatNumber, timeAgo, getChainColor } from '@/lib/utils';

interface WhaleTransactionItemProps {
  tx: Record<string, any>;
  index: number;
}

export default function WhaleTransactionItem({ tx, index }: WhaleTransactionItemProps) {
  const chain = tx.chain ?? 'multi';
  const chainColor = getChainColor(chain);
  const details = typeof tx.details === 'object' ? tx.details : {};
  const reasons = details?.reasons ?? [];
  const name = details?.name ?? tx.token;

  const isAccumulation = (tx.signal_type ?? '').includes('accumulation');
  const TypeIcon = isAccumulation ? ArrowUpRight : ArrowDownRight;
  const typeColor = isAccumulation ? '#00E676' : '#FF1744';
  const typeLabel = isAccumulation ? 'ACCUMULATION' : 'DISTRIBUTION';

  const change24h = details?.change_24h;
  const volMcap = details?.vol_mcap_ratio;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex items-center gap-3 py-3 px-4 hover:bg-white/[0.02] rounded-lg transition-colors border-b border-white/[0.03] last:border-0"
    >
      {/* Icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${typeColor}15` }}
      >
        <TypeIcon size={16} style={{ color: typeColor }} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{tx.token}</span>
          {name !== tx.token && (
            <span className="text-[10px] text-text-muted truncate">{name}</span>
          )}
          <span
            className="px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0"
            style={{ background: `${chainColor}20`, color: chainColor }}
          >
            {chain}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span style={{ color: typeColor }}>{typeLabel}</span>
          <span>•</span>
          <span>Score: {Math.round(tx.confidence ?? 0)}</span>
          {change24h != null && (
            <>
              <span>•</span>
              <span style={{ color: change24h >= 0 ? '#00E676' : '#FF1744' }}>
                24h: {change24h >= 0 ? '+' : ''}{change24h.toFixed(1)}%
              </span>
            </>
          )}
          <span>•</span>
          <span>{tx.created_at ? timeAgo(tx.created_at) : '—'}</span>
        </div>
      </div>

      {/* Volume / Reasons */}
      <div className="text-right shrink-0">
        {tx.volume_24h ? (
          <span className="text-sm font-display font-semibold">
            ${tx.volume_24h >= 1e9 ? `${(tx.volume_24h / 1e9).toFixed(1)}B` : `${(tx.volume_24h / 1e6).toFixed(0)}M`}
          </span>
        ) : null}
        {volMcap != null && volMcap > 0.1 && (
          <p className="text-[10px] text-text-muted">V/MC: {(volMcap * 100).toFixed(0)}%</p>
        )}
      </div>
    </motion.div>
  );
}
