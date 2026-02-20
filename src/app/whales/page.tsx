import { getWhaleTransactions, getWhaleVolumeChart, getTopWhaleWallets } from '@/lib/api';
import WhalesClient from './WhalesClient';

export const dynamic = 'force-dynamic';

export default async function WhalesPage() {
  const [transactions, volumeChart, topWallets] = await Promise.all([
    getWhaleTransactions(),
    getWhaleVolumeChart(),
    getTopWhaleWallets(),
  ]);

  return <WhalesClient transactions={transactions} volumeChart={volumeChart} topWallets={topWallets} />;
}
