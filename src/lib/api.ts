import type { Signal, WhaleTransaction, TrendingToken } from '@/data/mock';

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';

async function fetchAPI<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API_BASE}${endpoint}`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return fallback;
  }
}

// ─── Signals ──────────────────────────────────────────────────────────────────
export async function getSignals(): Promise<Signal[]> {
  const data = await fetchAPI<{ signals?: Signal[] } | Signal[]>('/api/signals', { signals: [] });
  if (Array.isArray(data)) return data;
  return (data as { signals?: Signal[] }).signals ?? [];
}

// ─── Whale Transactions ────────────────────────────────────────────────────────
export async function getWhaleTransactions(): Promise<WhaleTransaction[]> {
  const data = await fetchAPI<{ whale_transactions?: WhaleTransaction[] } | WhaleTransaction[]>('/api/whales', { whale_transactions: [] });
  if (Array.isArray(data)) return data;
  return (data as { whale_transactions?: WhaleTransaction[] }).whale_transactions ?? [];
}

// ─── Trending Tokens ──────────────────────────────────────────────────────────
export async function getTrendingTokens(): Promise<TrendingToken[]> {
  const data = await fetchAPI<{ trending_by_signals?: TrendingToken[] } | TrendingToken[]>('/api/trending', { trending_by_signals: [] });
  if (Array.isArray(data)) return data;
  return (data as { trending_by_signals?: TrendingToken[] }).trending_by_signals ?? [];
}

// ─── System Status ─────────────────────────────────────────────────────────────
export async function getSystemStatus() {
  const raw = await fetchAPI<Record<string, unknown>>('/api/status', {});
  if (!raw || !raw.status) {
    return {
      status: 'OFFLINE' as const,
      uptime: '0h',
      lastScan: new Date().toISOString(),
      activeSignals: 0,
      totalSignalsGenerated: 0,
      accuracyRate: 0,
      modulesOnline: 0,
      totalModules: 6,
    };
  }
  const db = (raw.database as Record<string, number>) ?? {};
  return {
    status: String(raw.status).toUpperCase() as 'OPERATIONAL',
    uptime: raw.uptime_seconds ? `${((raw.uptime_seconds as number) / 3600).toFixed(1)}h` : '0h',
    lastScan: (raw.last_signal_at as string) ?? new Date().toISOString(),
    activeSignals: db.total_signals ?? 0,
    totalSignalsGenerated: db.total_signals ?? 0,
    accuracyRate: 0,
    modulesOnline: 6,
    totalModules: 6,
  };
}

// ─── Fear & Greed (real — alternative.me) ─────────────────────────────────────
export async function getFearGreed() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://api.alternative.me/fng/?limit=2', {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const current = json.data?.[0];
    const previous = json.data?.[1];
    const value = parseInt(current?.value ?? '50', 10);
    const prevValue = parseInt(previous?.value ?? '50', 10);
    return {
      value,
      label: current?.value_classification ?? 'Neutral',
      previousValue: prevValue,
      change: value - prevValue,
    };
  } catch {
    return { value: 50, label: 'Neutral', previousValue: 50, change: 0 };
  }
}

// ─── Analytics (empty until engine generates data) ────────────────────────────
export async function getAccuracyOverTime() {
  return fetchAPI('/api/analytics/accuracy', []);
}

export async function getModuleContribution() {
  return fetchAPI('/api/analytics/modules', []);
}

export async function getEquitySimulation() {
  return fetchAPI('/api/analytics/equity', []);
}

export async function getConfidenceOverTime() {
  return fetchAPI('/api/analytics/confidence', []);
}

export async function getWhaleVolumeChart() {
  return fetchAPI('/api/whales/volume', []);
}

export async function getTopWhaleWallets() {
  return fetchAPI('/api/whales/top', []);
}

// Re-export types for convenience
export type { Signal, WhaleTransaction, TrendingToken };
