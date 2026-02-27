'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

export default function AutoRefresh({ interval = 30000 }: { interval?: number }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(interval / 1000);
  const shouldRefresh = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          shouldRefresh.current = true;
          return interval / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [interval]);

  useEffect(() => {
    if (shouldRefresh.current) {
      shouldRefresh.current = false;
      router.refresh();
    }
  }, [countdown, router]);

  return (
    <div className="flex items-center gap-2 text-xs text-text-muted">
      <RefreshCw size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
      <span>Auto-refresh in {countdown}s</span>
    </div>
  );
}
