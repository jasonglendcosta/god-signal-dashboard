'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Search, Download, ChevronDown, ChevronUp,
  TrendingUp, Flame, Zap, Eye, Radio, TrendingDown,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import AutoRefresh from '@/components/AutoRefresh';
import { getConfidenceColor, getChainColor, formatPrice, timeAgo } from '@/lib/utils';

interface SignalsClientProps {
  signals: Record<string, any>[];
  confidenceData: Array<{ date: string; avgConfidence: number; high: number; low: number }>;
}

const ALERT_TYPES = ['ALL', 'bullish', 'momentum', 'whale_alert', 'new_listing', 'bearish', 'neutral'];
const TYPE_CONFIG: Record<string, { icon: typeof Flame; color: string; label: string }> = {
  bullish:     { icon: Flame,       color: '#00E676', label: 'BULLISH' },
  momentum:    { icon: Zap,         color: '#FFD600', label: 'MOMENTUM' },
  whale_alert: { icon: TrendingUp,  color: '#2196F3', label: 'WHALE' },
  new_listing: { icon: Radio,       color: '#E040FB', label: 'NEW' },
  bearish:     { icon: TrendingDown, color: '#FF1744', label: 'BEARISH' },
  neutral:     { icon: Eye,         color: '#9E9E9E', label: 'WATCHING' },
};

export default function SignalsClient({ signals, confidenceData }: SignalsClientProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredSignals = useMemo(() => {
    return signals.filter((s) => {
      const token = s.token ?? '';
      const matchesSearch = token.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'ALL' || s.alert_type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [signals, search, typeFilter]);

  const exportCSV = () => {
    const headers = ['Token', 'Chain', 'Type', 'Score', 'Whale', 'DEX', 'Social', 'SmartMoney', 'Prediction', 'Time'];
    const rows = filteredSignals.map((s) => [
      s.token, s.chain, s.alert_type, s.score,
      s.whale_score, s.dex_score, s.social_score, s.smart_money_score, s.prediction_score,
      s.created_at ?? '',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            <span className="gradient-text">Signal History</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {filteredSignals.length} alerts • Filter and analyze
          </p>
        </motion.div>
        <AutoRefresh />
      </div>

      {/* Score Over Time Chart */}
      {confidenceData.length > 0 && (
        <GlassCard delay={0.1}>
          <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-accent" />
            Signal Score Over Time
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
                <YAxis domain={[30, 100]} tick={{ fill: '#666677', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(20,20,35,0.95)',
                    border: '1px solid rgba(216,109,203,0.2)',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="avgConfidence" stroke="#D86DCB" fill="url(#confGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {/* Filters */}
      <GlassCard delay={0.15} hover={false}>
        <div className="flex flex-col md:flex-row gap-3">
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

          <div className="flex gap-1.5 flex-wrap">
            {ALERT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  typeFilter === type
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'bg-white/5 text-text-muted border border-transparent hover:bg-white/10'
                }`}
              >
                {type === 'ALL' ? 'ALL' : (TYPE_CONFIG[type]?.label ?? type)}
              </button>
            ))}
          </div>

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
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider py-3 px-3">Score</th>
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider py-3 px-3">Sources</th>
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider py-3 px-3">Time</th>
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider py-3 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredSignals.map((signal) => {
                const isExpanded = expandedId === signal.id;
                const alertType = signal.alert_type ?? 'neutral';
                const tc = TYPE_CONFIG[alertType] ?? TYPE_CONFIG.neutral;
                const TypeIcon = tc.icon;
                const confColor = getConfidenceColor(signal.score ?? 0);
                const chainColor = getChainColor(signal.chain ?? 'multi');
                const details = typeof signal.details === 'object' ? signal.details : {};
                const sources = details?.active_sources ?? [];
                const price = details?.price_usd;

                return (
                  <motion.tbody key={signal.id} layout>
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : signal.id)}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-semibold text-sm">{signal.token}</span>
                          {details?.name && details.name !== signal.token && (
                            <span className="text-[10px] text-text-muted">{details.name}</span>
                          )}
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
                          <TypeIcon size={13} style={{ color: tc.color }} />
                          <span className="text-xs font-semibold" style={{ color: tc.color }}>{tc.label}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${signal.score}%`, background: confColor }} />
                          </div>
                          <span className="text-xs font-bold font-display" style={{ color: confColor }}>{Math.round(signal.score)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-text-muted">{sources.join(' + ') || '—'}</span>
                      </td>
                      <td className="py-3 px-3 text-xs text-text-muted">
                        {signal.created_at ? timeAgo(signal.created_at) : '—'}
                      </td>
                      <td className="py-3 px-3">
                        {isExpanded ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
                      </td>
                    </tr>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <td colSpan={7} className="px-3 pb-4">
                            <div className="bg-white/[0.02] rounded-xl p-4 mt-1">
                              <h4 className="text-xs font-display font-semibold mb-3 text-accent">Module Scores</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                {[
                                  { key: 'whale_score', label: '🐋 Whale' },
                                  { key: 'dex_score', label: '📈 DEX' },
                                  { key: 'social_score', label: '💬 Social' },
                                  { key: 'smart_money_score', label: '🧠 Smart $' },
                                  { key: 'prediction_score', label: '🔮 Prediction' },
                                ].map(({ key, label }) => {
                                  const value = signal[key] ?? 0;
                                  const moduleColor = getConfidenceColor(value);
                                  return (
                                    <div key={key} className="text-center">
                                      <div className="text-lg font-display font-bold" style={{ color: value > 0 ? moduleColor : '#333' }}>
                                        {Math.round(value)}
                                      </div>
                                      <div className="h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${value}%`, background: value > 0 ? moduleColor : '#333' }} />
                                      </div>
                                      <p className="text-[10px] text-text-muted mt-1">{label}</p>
                                    </div>
                                  );
                                })}
                              </div>
                              {(price || details?.volume_24h || details?.reasons) && (
                                <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-4 text-xs text-text-muted">
                                  {price && <span>Price: ${formatPrice(price)}</span>}
                                  {details?.volume_24h && <span>Volume: ${(details.volume_24h / 1e6).toFixed(0)}M</span>}
                                  {details?.change_24h != null && (
                                    <span style={{ color: details.change_24h >= 0 ? '#00E676' : '#FF1744' }}>
                                      24h: {details.change_24h >= 0 ? '+' : ''}{details.change_24h.toFixed(1)}%
                                    </span>
                                  )}
                                  {details?.reasons && (
                                    <span>💡 {details.reasons.join(', ')}</span>
                                  )}
                                </div>
                              )}
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
