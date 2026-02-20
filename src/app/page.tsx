import { getSignals, getWhaleTransactions, getTrendingTokens, getSystemStatus, getFearGreed } from '@/lib/api';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [signals, whaleTransactions, trendingTokens, systemStatus, fearGreed] = await Promise.all([
    getSignals(),
    getWhaleTransactions(),
    getTrendingTokens(),
    getSystemStatus(),
    getFearGreed(),
  ]);

  return (
    <DashboardClient
      signals={signals}
      whaleTransactions={whaleTransactions}
      trendingTokens={trendingTokens}
      systemStatus={systemStatus}
      fearGreed={fearGreed}
    />
  );
}
