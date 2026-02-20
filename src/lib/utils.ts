export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
  return `$${num.toFixed(2)}`;
}

export function formatPrice(price: number): string {
  if (price < 0.0001) return price.toFixed(8);
  if (price < 1) return price.toFixed(6);
  if (price < 100) return price.toFixed(2);
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 85) return '#00E676';
  if (confidence >= 70) return '#FFD600';
  if (confidence >= 55) return '#FF9100';
  return '#FF1744';
}

export function getChainColor(chain: string): string {
  switch (chain) {
    case 'ETH': return '#627EEA';
    case 'SOL': return '#9945FF';
    case 'BNB': return '#F3BA2F';
    case 'ARB': return '#28A0F0';
    case 'BASE': return '#0052FF';
    default: return '#D86DCB';
  }
}

export function getFearGreedColor(value: number): string {
  if (value <= 20) return '#FF1744';
  if (value <= 40) return '#FF9100';
  if (value <= 60) return '#FFD600';
  if (value <= 80) return '#00E676';
  return '#00E676';
}

export function getFearGreedLabel(value: number): string {
  if (value <= 20) return 'Extreme Fear';
  if (value <= 40) return 'Fear';
  if (value <= 60) return 'Neutral';
  if (value <= 80) return 'Greed';
  return 'Extreme Greed';
}
