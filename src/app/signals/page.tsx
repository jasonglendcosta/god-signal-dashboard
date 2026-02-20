import { getSignals, getConfidenceOverTime } from '@/lib/api';
import SignalsClient from './SignalsClient';

export const dynamic = 'force-dynamic';

export default async function SignalsPage() {
  const [signals, confidenceData] = await Promise.all([
    getSignals(),
    getConfidenceOverTime(),
  ]);

  return <SignalsClient signals={signals} confidenceData={confidenceData} />;
}
