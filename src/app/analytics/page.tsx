import { getAccuracyOverTime, getModuleContribution, getEquitySimulation, getSignals } from '@/lib/api';
import AnalyticsClient from './AnalyticsClient';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const [accuracyData, moduleData, equityData, signals] = await Promise.all([
    getAccuracyOverTime(),
    getModuleContribution(),
    getEquitySimulation(),
    getSignals(),
  ]);

  return (
    <AnalyticsClient
      accuracyData={accuracyData}
      moduleData={moduleData}
      equityData={equityData}
      signals={signals}
    />
  );
}
