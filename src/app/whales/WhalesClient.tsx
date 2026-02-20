'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Fish, Trophy, Activity, ArrowUpRight, ArrowDownRight, ArrowRightLeft } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import AutoRefresh from '@/components/AutoRefresh';
import { WhaleTransaction } from '@/data/mock';
import { formatNumber, timeAgo, getChainColor } from '@/lib/utils';

interface WhalesClientProps {
  transactions: WhaleTransaction[];
  volumeChart: Array<{ date: string; eth: number; sol: number; bnb: number }>;
  topWallets: Array<{
    rank: number;
    wallet: string;
    label: string;
    totalVolume: string;
    txCount: number;
    profitRate: number;
  }>;
}

export default function WhalesClient({ transactions, volumeChart, topWallets }: WhalesClientProps) {
  const [chainFilter, setChainFilter] = useState<string>('ALL');

  const filtered = useMemo(() => {
    if (chainFilter === 'ALL') return transactions;
    return transactions.filter((tx) => tx.chain === chainFilter);
  }, [transactions, chainFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            <span className="gradient-text">🐋 Whale Tracker</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Monitoring transactions &gt;$100K across chains
          </p>
        </motion.div>
        <AutoRefresh />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard delay={0.05}>
          <p className="text-xs text-text-muted mb-1">Total Volume (24h)</p>
          <p className="text-2xl font-display font-bold">$284M</p>
          <p className="text-[10px] text-green mt-1">↑ 12.3% from yesterday</p>
        </GlassCard>
        <GlassCard delay={0.1}>
          <p className="text-xs text-text-muted mb-1">Transactions (24h)</p>
          <p className="text-2xl font-display font-bold">{transactions.length}</p>
          <p className="text-[10px] text-text-secondary mt-1">&gt;$100K each</p>
        </GlassCard>
        <GlassCard delay={0.15}>
          <p className="text-xs text-text-muted mb-1">Largest TX</p>
          <p className="text-2xl font-display font-bold">$50M</p>
          <p className="text-[10px] text-accent mt-1">Binance Hot → USDT</p>
        </GlassCard>
        <GlassCard delay={0.2}>
          <p className="text-xs text-text-muted mb-1">Buy/Sell Ratio</p>
          <p className="text-2xl font-display font-bold text-green">2.3:1</p>
          <p className="text-[10px] text-text-secondary mt-1">Bullish sentiment</p>
        </GlassCard>
      </div>

      {/* Volume Chart + Top Wallets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Chart */}
        <GlassCard delay={0.25}>
          <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
            <Activity size={16} className="text-accent" />
            Transaction Volume by Chain ($M)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#666677', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#666677', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(20,20,35,0.95)',
                    border: '1px solid rgba(216,109,203,0.2)',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="eth" name="Ethereum" fill="#627EEA" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sol" name="Solana" fill="#9945FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bnb" name="BNB" fill="#F3BA2F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Top Whale Wallets */}
        <GlassCard delay={0.3}>
          <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
            <Trophy size={16} className="text-yellow" />
            Top Whale Wallets
          </h3>
          <div className="space-y-2 overflow-y-auto max-h-[340px]">
            {topWallets.map((w, i) => (
              <motion.div
                key={w.wallet}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors"
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-yellow/20 text-yellow' :
                    i === 1 ? 'bg-text-secondary/20 text-text-secondary' :
                    i === 2 ? 'bg-orange/20 text-orange' :
                    'bg-white/5 text-text-muted'
                  }`}
                >
                  {w.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-sm truncate">{w.label}</span>
                    <span className="text-[10px] text-text-muted font-mono">{w.wallet}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-text-muted mt-0.5">
                    <span>Vol: {w.totalVolume}</span>
                    <span>{w.txCount} txs</span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="text-xs font-bold"
                    style={{ color: w.profitRate >= 80 ? '#00E676' : w.profitRate >= 70 ? '#FFD600' : '#FF9100' }}
                  >
                    {w.profitRate}%
                  </span>
                  <p className="text-[9px] text-text-muted">win rate</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Live Feed with Filter */}
      <GlassCard delay={0.35} hover={false}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🐋</span>
            <h3 className="font-display font-semibold text-sm">Live Whale Feed</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red/10 text-red animate-pulse">● LIVE</span>
          </div>
          <div className="flex gap-1.5">
            {['ALL', 'ETH', 'SOL', 'BNB'].map((chain) => (
              <button
                key={chain}
                onClick={() => setChainFilter(chain)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  chainFilter === chain
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'bg-white/5 text-text-muted border border-transparent hover:bg-white/10'
                }`}
              >
                {chain}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1 max-h-[500px] overflow-y-auto">
          {filtered.map((tx, i) => {
            const chainColor = getChainColor(tx.chain);
            const TypeIcon = tx.type === 'BUY' ? ArrowUpRight : tx.type === 'SELL' ? ArrowDownRight : ArrowRightLeft;
            const typeColor = tx.type === 'BUY' ? '#00E676' : tx.type === 'SELL' ? '#FF1744' : '#FFD600';

            return (
              <motion.div
                key={tx.id}
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
                    <span className="font-display font-semibold text-sm">{tx.walletLabel || tx.wallet}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: `${chainColor}20`, color: chainColor }}>
                      {tx.chain}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                    <span className="font-semibold" style={{ color: typeColor }}>{tx.type}</span>
                    <span>{tx.amount.toLocaleString()} {tx.symbol}</span>
                    <span>•</span>
                    <span className="font-mono text-[10px]">{tx.txHash}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-display font-bold">{formatNumber(tx.value)}</span>
                  <p className="text-[10px] text-text-muted">{timeAgo(tx.timestamp)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
