'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  Zap,
  Target,
  Clock,
  Signal as SignalIcon,
  TrendingUp,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import StatCard from '@/components/StatCard';
import FearGreedGauge from '@/components/FearGreedGauge';
import SignalCard from '@/components/SignalCard';
import WhaleTransactionItem from '@/components/WhaleTransactionItem';
import TrendingTokenCard from '@/components/TrendingTokenCard';
import AutoRefresh from '@/components/AutoRefresh';
import { Signal, WhaleTransaction, TrendingToken } from '@/data/mock';
import { timeAgo } from '@/lib/utils';

interface DashboardClientProps {
  signals: Signal[];
  whaleTransactions: WhaleTransaction[];
  trendingTokens: TrendingToken[];
  systemStatus: {
    status: string;
    uptime: string;
    lastScan: string;
    activeSignals: number;
    totalSignalsGenerated: number;
    accuracyRate: number;
    modulesOnline: number;
    totalModules: number;
  };
  fearGreed: {
    value: number;
    previousValue: number;
    change: number;
  };
}

export default function DashboardClient({
  signals,
  whaleTransactions,
  trendingTokens,
  systemStatus,
  fearGreed,
}: DashboardClientProps) {
  const activeSignals = signals.filter((s) => s.result === 'PENDING');
  const sortedSignals = [...signals].sort((a, b) => b.confidence - a.confidence);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            <span className="gradient-text">Command Center</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Real-time alpha intelligence • {systemStatus.modulesOnline}/{systemStatus.totalModules} modules online
          </p>
        </motion.div>
        <AutoRefresh />
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Signals"
          value={systemStatus.totalSignalsGenerated.toLocaleString()}
          icon={Zap}
          subtitle="All-time generated"
          delay={0.05}
          accentColor="#D86DCB"
        />
        <StatCard
          label="Accuracy Rate"
          value={`${systemStatus.accuracyRate}%`}
          icon={Target}
          trend={3.2}
          subtitle="Win rate on closed signals"
          delay={0.1}
          accentColor="#00E676"
        />
        <StatCard
          label="Active Signals"
          value={activeSignals.length}
          icon={Activity}
          subtitle="Currently being tracked"
          delay={0.15}
          accentColor="#FFD600"
        />
        <StatCard
          label="System Uptime"
          value={systemStatus.uptime}
          icon={ShieldCheck}
          subtitle={`Last scan ${timeAgo(systemStatus.lastScan)}`}
          delay={0.2}
          accentColor="#7B2FBE"
        />
      </div>

      {/* Main grid: Fear&Greed + System Status + Active Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fear & Greed */}
        <GlassCard delay={0.25} className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={16} className="text-accent" />
            <h2 className="font-display font-semibold text-sm">Fear & Greed Index</h2>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <FearGreedGauge value={fearGreed.value} previousValue={fearGreed.previousValue} />
          </div>
        </GlassCard>

        {/* System Status */}
        <GlassCard delay={0.3} glow>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={16} className="text-green" />
            <h2 className="font-display font-semibold text-sm">System Status</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-xs text-text-muted">Status</span>
              <span className="text-xs font-bold text-green flex items-center gap-1.5">
                <span className="status-dot bg-green" />
                {systemStatus.status}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-xs text-text-muted">Uptime</span>
              <span className="text-xs font-semibold">{systemStatus.uptime}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-xs text-text-muted">Last Scan</span>
              <span className="text-xs font-semibold">{timeAgo(systemStatus.lastScan)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-xs text-text-muted">Modules Online</span>
              <span className="text-xs font-semibold">{systemStatus.modulesOnline}/{systemStatus.totalModules}</span>
            </div>
            {/* Module list */}
            <div className="space-y-2 pt-2">
              {['Sentiment', 'Whale Activity', 'Technical Analysis', 'On-Chain Metrics', 'Social Buzz', 'Smart Money'].map((mod, i) => (
                <div key={mod} className="flex items-center gap-2">
                  <div className="status-dot bg-green" />
                  <span className="text-[11px] text-text-secondary">{mod}</span>
                  <span className="ml-auto text-[10px] text-green">Active</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Active Signals */}
        <GlassCard delay={0.35} className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <SignalIcon size={16} className="text-accent" />
              <h2 className="font-display font-semibold text-sm">Active Signals</h2>
            </div>
            <span className="text-[10px] text-text-muted">Sorted by confidence</span>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[400px] pr-1">
            {sortedSignals.slice(0, 6).map((signal, i) => (
              <SignalCard key={signal.id} signal={signal} index={i} />
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Bottom: Whale Feed + Trending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Whale Feed */}
        <GlassCard delay={0.4} className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🐋</span>
              <h2 className="font-display font-semibold text-sm">Whale Transactions</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red/10 text-red animate-pulse">
              ● LIVE
            </span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px] -mx-1">
            {whaleTransactions.slice(0, 8).map((tx, i) => (
              <WhaleTransactionItem key={tx.id} tx={tx} index={i} />
            ))}
          </div>
        </GlassCard>

        {/* Trending Tokens */}
        <GlassCard delay={0.45} className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-accent" />
              <h2 className="font-display font-semibold text-sm">Trending Tokens</h2>
            </div>
            <span className="text-[10px] text-text-muted">{trendingTokens.length} tokens</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 overflow-y-auto max-h-[400px]">
            {trendingTokens.map((token, i) => (
              <TrendingTokenCard key={token.symbol} token={token} index={i} />
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
