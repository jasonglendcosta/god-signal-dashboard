import {
  mockSignals,
  mockWhaleTransactions,
  mockTrendingTokens,
  mockSystemStatus,
  mockFearGreed,
  mockAccuracyOverTime,
  mockModuleContribution,
  mockEquitySimulation,
  mockConfidenceOverTime,
  mockWhaleVolumeChart,
  mockTopWhaleWallets,
  type Signal,
  type WhaleTransaction,
  type TrendingToken,
} from '@/data/mock';

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';

async function fetchWithFallback<T>(endpoint: string, fallback: T): Promise<T> {
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

export async function getSignals(): Promise<Signal[]> {
  const data = await fetchWithFallback<{ signals?: Signal[] } | Signal[]>('/api/signals', mockSignals);
  if (Array.isArray(data)) return data.length ? data : mockSignals;
  const arr = (data as { signals?: Signal[] }).signals ?? [];
  return arr.length ? arr : mockSignals;
}

export async function getWhaleTransactions(): Promise<WhaleTransaction[]> {
  const data = await fetchWithFallback<{ whale_transactions?: WhaleTransaction[] } | WhaleTransaction[]>('/api/whales', mockWhaleTransactions);
  if (Array.isArray(data)) return data.length ? data : mockWhaleTransactions;
  const arr = (data as { whale_transactions?: WhaleTransaction[] }).whale_transactions ?? [];
  return arr.length ? arr : mockWhaleTransactions;
}

export async function getTrendingTokens(): Promise<TrendingToken[]> {
  const data = await fetchWithFallback<{ trending_by_signals?: TrendingToken[]; trending_by_market?: TrendingToken[] } | TrendingToken[]>('/api/trending', mockTrendingTokens);
  if (Array.isArray(data)) return data.length ? data : mockTrendingTokens;
  const arr = (data as { trending_by_signals?: TrendingToken[] }).trending_by_signals ?? [];
  return arr.length ? arr : mockTrendingTokens;
}

export async function getSystemStatus() {
  const raw = await fetchWithFallback<Record<string, unknown>>('/api/status', {});
  if (!raw || !raw.status) return mockSystemStatus;
  // Normalize real API shape → dashboard shape
  const db = (raw.database as Record<string, number>) ?? {};
  return {
    status: String(raw.status).toUpperCase() as 'OPERATIONAL',
    uptime: raw.uptime_seconds ? `${((raw.uptime_seconds as number) / 3600).toFixed(1)}h` : '0h',
    lastScan: (raw.last_signal_at as string) ?? new Date().toISOString(),
    activeSignals: db.total_signals ?? 0,
    totalSignalsGenerated: db.total_signals ?? 0,
    accuracyRate: mockSystemStatus.accuracyRate, // not tracked yet by engine
    modulesOnline: 6,
    totalModules: 6,
  };
}

export async function getFearGreed() {
  // /api/fear-greed not implemented in engine yet — use mock
  return mockFearGreed;
}

export async function getAccuracyOverTime() {
  return fetchWithFallback('/api/analytics/accuracy', mockAccuracyOverTime);
}

export async function getModuleContribution() {
  return fetchWithFallback('/api/analytics/modules', mockModuleContribution);
}

export async function getEquitySimulation() {
  return fetchWithFallback('/api/analytics/equity', mockEquitySimulation);
}

export async function getConfidenceOverTime() {
  return fetchWithFallback('/api/analytics/confidence', mockConfidenceOverTime);
}

export async function getWhaleVolumeChart() {
  return fetchWithFallback('/api/whales/volume', mockWhaleVolumeChart);
}

export async function getTopWhaleWallets() {
  return fetchWithFallback('/api/whales/top', mockTopWhaleWallets);
}
