'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import {
  Search, Filter, Download, ChevronDown, ChevronUp, X,
  TrendingUp, TrendingDown, Eye,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import AutoRefresh from '@/components/AutoRefresh';
import { Signal } from '@/data/mock';
import { getConfidenceColor, getChainColor, formatPrice, timeAgo } from '@/lib/utils';

interface SignalsClientProps {
  signals: Signal[];
  confidenceData: Array<{ date: string; avgConfidence: number; high: number; low: number }>;
}

export default function SignalsClient({ signals, confidenceData }: SignalsClientProps) {
  const [search, setSearch] = useState('');
  const [chainFilter, setChainFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredSignals = useMemo(() => {
    return signals.filter((s) => {
      const matchesSearch = s.token.toLowerCase().includes(search.toLowerCase()) ||
        s.symbol.toLowerCase().includes(search.toLowerCase());
      const matchesChain = chainFilter === 'ALL' || s.chain === chainFilter;
      const matchesType = typeFilter === 'ALL' || s.type === typeFilter;
      return matchesSearch && matchesChain && matchesType;
    });
  }, [signals, search, chainFilter, typeFilter]);

  const exportCSV = () => {
    const headers = ['Token', 'Symbol', 'Chain', 'Type', 'Confidence', 'Price', 'Change 24h', 'Timestamp', 'Result', 'PnL'];
    const rows = filteredSignals.map((s) => [
      s.token, s.symbol, s.chain, s.type, s.confidence, s.price, s.priceChange24h, s.timestamp, s.result || '', s.pnl || '',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'god-signal-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const chains = ['ALL', 'ETH', 'SOL', 'BNB', 'ARB', 'BASE'];
  const types = ['ALL', 'BUY', 'SELL', 'WATCH'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            <span className="gradient-text">Signal History</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {filteredSignals.length} signals • Filter and analyze performance
          </p>
        </motion.div>
        <AutoRefresh />
      </div>

      {/* Confidence Over Time Chart */}
      <GlassCard delay={0.1}>
        <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-accent" />
          Signal Confidence Over Time
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={confidenceData}>
              <defs>
                <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D86DCB" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#D86DCB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#666677', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fill: '#666677', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(20,20,35,0.95)',
                  border: '1px solid rgba(216,109,203,0.2)',
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="high" stroke="rgba(216,109,203,0.3)" fill="none" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="avgConfidence" stroke="#D86DCB" fill="url(#confGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="low" stroke="rgba(216,109,203,0.3)" fill="none" strokeDasharray="3 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Filters */}
      <GlassCard delay={0.15} hover={false}>
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tokens..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>

          {/* Chain filter */}
          <div className="flex gap-1.5 flex-wrap">
            {chains.map((chain) => (
              <button
                key={chain}
                onClick={() => setChainFilter(chain)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  chainFilter === chain
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'bg-white/5 text-text-muted border border-transparent hover:bg-white/10'
                }`}
              >
                {chain}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div className="flex gap-1.5">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  typeFilter === type
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'bg-white/5 text-text-muted border border-transparent hover:bg-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Export */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-xl text-xs font-medium transition-all border border-accent/20"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </GlassCard>

      {/* Signals Table */}
      <GlassCard delay={0.2} hover={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider py-3 px-3">Token</th>
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider py-3 px-3">Chain</th>
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider py-3 px-3">Type</th>
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider py-3 px-3">Confidence</th>
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider py-3 px-3">Price</th>
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider py-3 px-3">24h</th>
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider py-3 px-3">Time</th>
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider py-3 px-3">Result</th>
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider py-3 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredSignals.map((signal) => {
                const isExpanded = expandedId === signal.id;
                const TypeIcon = signal.type === 'BUY' ? TrendingUp : signal.type === 'SELL' ? TrendingDown : Eye;
                const typeColor = signal.type === 'BUY' ? '#00E676' : signal.type === 'SELL' ? '#FF1744' : '#FFD600';
                const confColor = getConfidenceColor(signal.confidence);
                const chainColor = getChainColor(signal.chain);

                return (
                  <motion.tbody key={signal.id} layout>
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : signal.id)}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-semibold text-sm">{signal.symbol}</span>
                          <span className="text-xs text-text-muted">{signal.token}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold"
                          style={{ background: `${chainColor}20`, color: chainColor }}
                        >
                          {signal.chain}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <TypeIcon size={13} style={{ color: typeColor }} />
                          <span className="text-xs font-semibold" style={{ color: typeColor }}>{signal.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${signal.confidence}%`, background: confColor }} />
                          </div>
                          <span className="text-xs font-bold font-display" style={{ color: confColor }}>{signal.confidence}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-xs font-mono">${formatPrice(signal.price)}</td>
                      <td className="py-3 px-3">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: signal.priceChange24h >= 0 ? '#00E676' : '#FF1744' }}
                        >
                          {signal.priceChange24h >= 0 ? '+' : ''}{signal.priceChange24h}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs text-text-muted">{timeAgo(signal.timestamp)}</td>
                      <td className="py-3 px-3">
                        {signal.result === 'PENDING' ? (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-yellow/10 text-yellow">● LIVE</span>
                        ) : signal.result === 'WIN' ? (
                          <span className="text-xs font-bold text-green">+{signal.pnl?.toFixed(1)}%</span>
                        ) : (
                          <span className="text-xs font-bold text-red">{signal.pnl?.toFixed(1)}%</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {isExpanded ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
                      </td>
                    </tr>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <td colSpan={9} className="px-3 pb-4">
                            <div className="bg-white/[0.02] rounded-xl p-4 mt-1">
                              <h4 className="text-xs font-display font-semibold mb-3 text-accent">Module Scores</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                {Object.entries(signal.modules).map(([key, value]) => {
                                  const moduleColor = getConfidenceColor(value);
                                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
                                  return (
                                    <div key={key} className="text-center">
                                      <div className="text-lg font-display font-bold" style={{ color: moduleColor }}>
                                        {value}
                                      </div>
                                      <div className="h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${value}%`, background: moduleColor }} />
                                      </div>
                                      <p className="text-[10px] text-text-muted mt-1">{label}</p>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-4 text-xs text-text-muted">
                                <span>Market Cap: {signal.marketCap}</span>
                                <span>Volume: {signal.volume24h}</span>
                                <span>Generated: {new Date(signal.timestamp).toLocaleString()}</span>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </motion.tbody>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
