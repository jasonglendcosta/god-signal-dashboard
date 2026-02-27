'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Fish, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import AutoRefresh from '@/components/AutoRefresh';
import { timeAgo, getChainColor } from '@/lib/utils';

interface WhalesClientProps {
  transactions: Record<string, any>[];
  volumeChart: any[];
  topWallets: any[];
}

export default function WhalesClient({ transactions, volumeChart, topWallets }: WhalesClientProps) {
  const [chainFilter, setChainFilter] = useState<string>('ALL');
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const filtered = useMemo(() => {
    if (chainFilter === 'ALL') return transactions;
    return transactions.filter((tx) => tx.chain === chainFilter);
  }, [transactions, chainFilter]);

  // Compute live stats from actual data
  const stats = useMemo(() => {
    const totalVolume = transactions.reduce((sum, tx) => sum + (tx.volume_24h ?? 0), 0);
    const accumulations = transactions.filter(tx => (tx.signal_type ?? '').includes('accumulation')).length;
    const distributions = transactions.filter(tx => (tx.signal_type ?? '').includes('distribution')).length;
    const ratio = distributions > 0 ? (accumulations / distributions).toFixed(1) : accumulations > 0 ? '∞' : '0';
    const maxConf = transactions.length > 0 ? Math.max(...transactions.map(tx => tx.confidence ?? 0)) : 0;
    const topToken = transactions.length > 0 ? transactions.reduce((best, tx) => (tx.confidence ?? 0) > (best.confidence ?? 0) ? tx : best, transactions[0]) : null;

    return {
      totalVolume,
      count: transactions.length,
      ratio,
      isBullish: accumulations >= distributions,
      maxConf,
      topToken: topToken?.token ?? '—',
    };
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            <span className="gradient-text">🐋 Whale Tracker</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Volume anomalies & institutional activity signals
          </p>
        </motion.div>
        <AutoRefresh />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard delay={0.05}>
          <p className="text-xs text-text-muted mb-1">Whale Signals</p>
          <p className="text-2xl font-display font-bold">{stats.count}</p>
          <p className="text-[10px] text-text-secondary mt-1">Active detections</p>
        </GlassCard>
        <GlassCard delay={0.1}>
          <p className="text-xs text-text-muted mb-1">Accum/Distrib Ratio</p>
          <p className={`text-2xl font-display font-bold ${stats.isBullish ? 'text-green' : 'text-red'}`}>
            {stats.ratio}:1
          </p>
          <p className="text-[10px] text-text-secondary mt-1">{stats.isBullish ? 'Bullish bias' : 'Bearish bias'}</p>
        </GlassCard>
        <GlassCard delay={0.15}>
          <p className="text-xs text-text-muted mb-1">Strongest Signal</p>
          <p className="text-2xl font-display font-bold">{Math.round(stats.maxConf)}</p>
          <p className="text-[10px] text-accent mt-1">{stats.topToken}</p>
        </GlassCard>
        <GlassCard delay={0.2}>
          <p className="text-xs text-text-muted mb-1">Detection Method</p>
          <p className="text-2xl font-display font-bold">CoinGecko</p>
          <p className="text-[10px] text-text-secondary mt-1">Vol anomaly + price moves</p>
        </GlassCard>
      </div>

      {/* Live Feed with Filter */}
      <GlassCard delay={0.25} hover={false}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🐋</span>
            <h3 className="font-display font-semibold text-sm">Live Whale Feed</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red/10 text-red animate-pulse">● LIVE</span>
          </div>
          <div className="flex gap-1.5">
            {['ALL', 'multi'].map((chain) => (
              <button
                key={chain}
                onClick={() => setChainFilter(chain)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  chainFilter === chain
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'bg-white/5 text-text-muted border border-transparent hover:bg-white/10'
                }`}
              >
                {chain === 'ALL' ? 'ALL' : chain.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1 max-h-[600px] overflow-y-auto">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-text-muted text-sm">
              No whale signals detected yet. Engine scanning every 60s.
            </div>
          )}
          {filtered.map((tx, i) => {
            const chain = tx.chain ?? 'multi';
            const chainColor = getChainColor(chain);
            const details = typeof tx.details === 'object' ? tx.details : {};
            const isAccumulation = (tx.signal_type ?? '').includes('accumulation');
            const TypeIcon = isAccumulation ? ArrowUpRight : ArrowDownRight;
            const typeColor = isAccumulation ? '#00E676' : '#FF1744';
            const typeLabel = isAccumulation ? 'ACCUMULATION' : 'DISTRIBUTION';
            const name = details?.name ?? tx.token;
            const change24h = details?.change_24h;
            const change1h = details?.change_1h;
            const volMcap = details?.vol_mcap_ratio;
            const reasons = details?.reasons ?? [];
            const volume = tx.volume_24h;

            return (
              <motion.div
                key={tx.id ?? i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 py-3 px-4 hover:bg-white/[0.02] rounded-lg transition-colors border-b border-white/[0.03]"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${typeColor}15` }}>
                  <TypeIcon size={18} style={{ color: typeColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-sm">{tx.token}</span>
                    {name !== tx.token && (
                      <span className="text-[10px] text-text-muted">{name}</span>
                    )}
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: `${chainColor}20`, color: chainColor }}>
                      {chain}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${typeColor}15`, color: typeColor }}>
                      {typeLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5 flex-wrap">
                    <span>Score: <strong style={{ color: typeColor }}>{Math.round(tx.confidence ?? 0)}</strong></span>
                    {change1h != null && (
                      <span style={{ color: change1h >= 0 ? '#00E676' : '#FF1744' }}>
                        1h: {change1h >= 0 ? '+' : ''}{change1h.toFixed(1)}%
                      </span>
                    )}
                    {change24h != null && (
                      <span style={{ color: change24h >= 0 ? '#00E676' : '#FF1744' }}>
                        24h: {change24h >= 0 ? '+' : ''}{change24h.toFixed(1)}%
                      </span>
                    )}
                    {volMcap != null && volMcap > 0.1 && (
                      <span>V/MC: {(volMcap * 100).toFixed(0)}%</span>
                    )}
                    {reasons.length > 0 && (
                      <span className="text-[10px]">💡 {reasons.join(', ')}</span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {volume ? (
                    <span className="text-sm font-display font-bold">
                      ${volume >= 1e9 ? `${(volume / 1e9).toFixed(1)}B` : `${(volume / 1e6).toFixed(0)}M`}
                    </span>
                  ) : null}
                  <p className="text-[10px] text-text-muted">
                    {mounted && tx.created_at ? timeAgo(tx.created_at) : '—'}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
