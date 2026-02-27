'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Eye, Flame, Zap, Radio } from 'lucide-react';
import { getConfidenceColor, getChainColor, formatPrice, timeAgo } from '@/lib/utils';

interface SignalCardProps {
  signal: Record<string, any>;
  index: number;
  onClick?: () => void;
}

export default function SignalCard({ signal, index, onClick }: SignalCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Map API fields (token_alerts table) to display fields
  const token = signal.token ?? signal.symbol ?? '???';
  const chain = signal.chain ?? 'multi';
  const score = signal.score ?? signal.confidence ?? 0;
  const alertType = signal.alert_type ?? signal.type ?? 'neutral';
  const details = typeof signal.details === 'object' ? signal.details : {};
  const price = details?.price_usd ?? signal.price ?? null;
  const name = details?.name ?? token;
  const timestamp = signal.created_at ?? signal.timestamp;
  const sources = details?.active_sources ?? [];
  const sourceCount = details?.active_source_count ?? sources.length;

  const confColor = getConfidenceColor(score);
  const chainColor = getChainColor(chain);

  // Alert type icon + color
  const typeConfig: Record<string, { icon: typeof TrendingUp; color: string; label: string }> = {
    bullish:     { icon: Flame,       color: '#00E676', label: 'BULLISH' },
    momentum:    { icon: Zap,         color: '#FFD600', label: 'MOMENTUM' },
    whale_alert: { icon: TrendingUp,  color: '#2196F3', label: 'WHALE' },
    new_listing: { icon: Radio,       color: '#E040FB', label: 'NEW' },
    bearish:     { icon: TrendingDown, color: '#FF1744', label: 'BEARISH' },
    neutral:     { icon: Eye,         color: '#9E9E9E', label: 'WATCHING' },
  };
  const { icon: TypeIcon, color: typeColor, label: typeLabel } = typeConfig[alertType] ?? typeConfig.neutral;

  // Confidence label
  const confLabel = score >= 75 ? 'HIGH' : score >= 55 ? 'MEDIUM' : 'LOW';

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
            {token.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-sm">{token}</span>
              {name !== token && (
                <span className="text-[10px] text-text-muted">{name}</span>
              )}
              <span
                className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
                style={{ background: `${chainColor}20`, color: chainColor }}
              >
                {chain}
              </span>
            </div>
            {price != null && (
              <span className="text-xs text-text-muted">${formatPrice(price)}</span>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end">
            <TypeIcon size={14} style={{ color: typeColor }} />
            <span className="text-xs font-bold" style={{ color: typeColor }}>
              {typeLabel}
            </span>
          </div>
          {timestamp && (
            <span className="text-[10px] text-text-muted">{mounted && timestamp ? timeAgo(timestamp) : '—'}</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* Confidence bar */}
        <div className="flex-1 mr-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-text-muted uppercase tracking-wider">
              Score ({confLabel})
            </span>
            <span className="text-xs font-bold font-display" style={{ color: confColor }}>
              {Math.round(score)}
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: confColor }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(score, 100)}%` }}
              transition={{ duration: 0.8, delay: index * 0.05 + 0.3 }}
            />
          </div>
        </div>

        {/* Source count badge */}
        {sourceCount > 0 && (
          <div className="text-right">
            <span className="text-[10px] px-2 py-1 rounded-full bg-accent/10 text-accent">
              {sourceCount} {sourceCount === 1 ? 'source' : 'sources'}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
