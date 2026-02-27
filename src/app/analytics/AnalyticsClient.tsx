'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';
import {
  BarChart3, Target, TrendingUp, PieChart as PieIcon,
  DollarSign, Award, Percent, Zap,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import StatCard from '@/components/StatCard';
import AutoRefresh from '@/components/AutoRefresh';
import { Signal } from '@/data/mock';

interface AnalyticsClientProps {
  accuracyData: Array<{ date: string; accuracy: number; signals: number }>;
  moduleData: Array<{ name: string; value: number; color: string }>;
  equityData: Array<{ date: string; equity: number; benchmark: number }>;
  signals: Signal[];
}

export default function AnalyticsClient({ accuracyData, moduleData, equityData, signals }: AnalyticsClientProps) {
  const stats = useMemo(() => {
    const closed = signals.filter((s) => s.result && s.result !== 'PENDING');
    const wins = closed.filter((s) => s.result === 'WIN');
    const losses = closed.filter((s) => s.result === 'LOSS');
    const avgPnl = closed.reduce((sum, s) => sum + (s.pnl || 0), 0) / (closed.length || 1);
    const bestSignal = [...closed].sort((a, b) => (b.pnl || 0) - (a.pnl || 0))[0];

    return {
      totalClosed: closed.length,
      wins: wins.length,
      losses: losses.length,
      winRate: closed.length ? ((wins.length / closed.length) * 100).toFixed(1) : '0',
      avgPnl: avgPnl.toFixed(1),
      bestSignal,
      totalReturn: equityData[equityData.length - 1]?.equity
        ? (((equityData[equityData.length - 1].equity - 10000) / 10000) * 100).toFixed(1)
        : '0',
    };
  }, [signals, equityData]);

  const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#9999AA"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={10}
      >
        {name} ({value}%)
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            <span className="gradient-text">Performance Analytics</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Track signal accuracy, module performance, and simulated returns
          </p>
        </motion.div>
        <AutoRefresh />
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Win Rate"
          value={`${stats.winRate}%`}
          icon={Target}
          subtitle={`${stats.wins}W / ${stats.losses}L`}
          delay={0.05}
          accentColor="#00E676"
        />
        <StatCard
          label="Avg PnL per Signal"
          value={`${Number(stats.avgPnl) >= 0 ? '+' : ''}${stats.avgPnl}%`}
          icon={Percent}
          subtitle={`${stats.totalClosed} closed signals`}
          delay={0.1}
          accentColor="#D86DCB"
        />
        <StatCard
          label="Simulated Return"
          value={`+${stats.totalReturn}%`}
          icon={DollarSign}
          subtitle="Following every signal"
          trend={12.5}
          delay={0.15}
          accentColor="#7B2FBE"
        />
        <StatCard
          label="Best Signal"
          value={stats.bestSignal ? `${stats.bestSignal.symbol} +${stats.bestSignal.pnl?.toFixed(1)}%` : 'N/A'}
          icon={Award}
          subtitle={stats.bestSignal ? `${stats.bestSignal.type} on ${stats.bestSignal.chain}` : ''}
          delay={0.2}
          accentColor="#FFD600"
        />
      </div>

      {/* Accuracy Over Time */}
      <GlassCard delay={0.25}>
        <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
          <BarChart3 size={16} className="text-accent" />
          Signal Accuracy Over Time
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={accuracyData}>
              <defs>
                <linearGradient id="accuracyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00E676" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#00E676" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#666677', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: '#666677', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(20,20,35,0.95)',
                  border: '1px solid rgba(216,109,203,0.2)',
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={((value: any, name: any) => {
                  if (name === 'accuracy') return [`${value}%`, 'Accuracy'];
                  return [value, 'Signals'];
                }) as any}
              />
              <Area
                type="monotone"
                dataKey="accuracy"
                stroke="#00E676"
                fill="url(#accuracyGrad)"
                strokeWidth={2}
                dot={{ fill: '#00E676', strokeWidth: 0, r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Module Contribution + Win/Loss Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <GlassCard delay={0.3}>
          <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
            <PieIcon size={16} className="text-accent" />
            Module Contribution to Winning Signals
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moduleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={CustomPieLabel}
                >
                  {moduleData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(20,20,35,0.95)',
                    border: '1px solid rgba(216,109,203,0.2)',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={((value: any) => [`${value}%`, 'Contribution']) as any}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Best Performing Signals */}
        <GlassCard delay={0.35}>
          <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
            <Award size={16} className="text-yellow" />
            Best Performing Signals
          </h3>
          <div className="space-y-3">
            {signals
              .filter((s) => s.result === 'WIN')
              .sort((a, b) => (b.pnl || 0) - (a.pnl || 0))
              .slice(0, 8)
              .map((signal, i) => (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors"
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-yellow/20 text-yellow' :
                    i === 1 ? 'bg-text-secondary/20 text-text-secondary' :
                    i === 2 ? 'bg-orange/20 text-orange' :
                    'bg-white/5 text-text-muted'
                  }`}>
                    #{i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-sm">{signal.symbol}</span>
                      <span className="text-[10px] text-text-muted">{signal.token}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
                      <span>{signal.type}</span>
                      <span>•</span>
                      <span>{signal.chain}</span>
                      <span>•</span>
                      <span>Conf: {signal.confidence}%</span>
                    </div>
                  </div>
                  <span className="text-sm font-display font-bold text-green">
                    +{signal.pnl?.toFixed(1)}%
                  </span>
                </motion.div>
              ))}
          </div>
        </GlassCard>
      </div>

      {/* Equity Simulation */}
      <GlassCard delay={0.4}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-sm flex items-center gap-2">
              <DollarSign size={16} className="text-green" />
              Equity Simulation
            </h3>
            <p className="text-xs text-text-muted mt-1">
              &ldquo;If you followed every GOD SIGNAL with $10,000...&rdquo;
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-display font-bold text-green">
              ${equityData[equityData.length - 1]?.equity?.toLocaleString() ?? '0'}
            </span>
            <p className="text-xs text-green">+{stats.totalReturn}% return</p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityData}>
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D86DCB" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#D86DCB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="benchGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#666677" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#666677" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                formatter={((value: any, name: any) => {
                  return [`$${Number(value).toLocaleString()}`, name === 'equity' ? 'GOD SIGNAL' : 'BTC Benchmark'];
                }) as any}
              />
              <Area
                type="monotone"
                dataKey="benchmark"
                stroke="#666677"
                fill="url(#benchGrad)"
                strokeWidth={1}
                strokeDasharray="5 5"
              />
              <Area
                type="monotone"
                dataKey="equity"
                stroke="#D86DCB"
                fill="url(#equityGrad)"
                strokeWidth={2}
                dot={{ fill: '#D86DCB', strokeWidth: 0, r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-accent rounded" />
            <span>GOD SIGNAL Portfolio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-text-muted rounded border-dashed" />
            <span>BTC Buy & Hold</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
