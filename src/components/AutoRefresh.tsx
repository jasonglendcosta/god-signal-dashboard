'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function AutoRefresh({ interval = 30000 }: { interval?: number }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(interval / 1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.refresh();
          return interval / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, interval]);

  return (
    <div className="flex items-center gap-2 text-xs text-text-muted">
      <RefreshCw size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
      <span>Auto-refresh in {countdown}s</span>
    </div>
  );
}
