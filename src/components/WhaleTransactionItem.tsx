'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, ArrowRightLeft } from 'lucide-react';
import { WhaleTransaction } from '@/data/mock';
import { formatNumber, timeAgo, getChainColor } from '@/lib/utils';

interface WhaleTransactionItemProps {
  tx: WhaleTransaction;
  index: number;
}

export default function WhaleTransactionItem({ tx, index }: WhaleTransactionItemProps) {
  const chainColor = getChainColor(tx.chain);
  const typeIcon = tx.type === 'BUY' ? ArrowUpRight : tx.type === 'SELL' ? ArrowDownRight : ArrowRightLeft;
  const TypeIcon = typeIcon;
  const typeColor = tx.type === 'BUY' ? '#00E676' : tx.type === 'SELL' ? '#FF1744' : '#FFD600';

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
          <span className="text-sm font-medium truncate">
            {tx.walletLabel || tx.wallet}
          </span>
          <span
            className="px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0"
            style={{ background: `${chainColor}20`, color: chainColor }}
          >
            {tx.chain}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span style={{ color: typeColor }}>{tx.type}</span>
          <span>•</span>
          <span>{tx.symbol}</span>
          <span>•</span>
          <span>{timeAgo(tx.timestamp)}</span>
        </div>
      </div>

      {/* Value */}
      <div className="text-right shrink-0">
        <span className="text-sm font-display font-semibold">{formatNumber(tx.value)}</span>
      </div>
    </motion.div>
  );
}
