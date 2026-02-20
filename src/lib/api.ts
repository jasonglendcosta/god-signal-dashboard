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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';

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
  return fetchWithFallback('/api/signals', mockSignals);
}

export async function getWhaleTransactions(): Promise<WhaleTransaction[]> {
  return fetchWithFallback('/api/whales', mockWhaleTransactions);
}

export async function getTrendingTokens(): Promise<TrendingToken[]> {
  return fetchWithFallback('/api/trending', mockTrendingTokens);
}

export async function getSystemStatus() {
  return fetchWithFallback('/api/status', mockSystemStatus);
}

export async function getFearGreed() {
  return fetchWithFallback('/api/fear-greed', mockFearGreed);
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
