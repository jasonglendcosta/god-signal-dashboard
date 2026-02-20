// ============================================================
// GOD SIGNAL — Mock Data
// Realistic data that makes the dashboard look alive
// ============================================================

export interface Signal {
  id: string;
  token: string;
  symbol: string;
  chain: 'ETH' | 'SOL' | 'BNB' | 'ARB' | 'BASE';
  type: 'BUY' | 'SELL' | 'WATCH';
  confidence: number;
  timestamp: string;
  price: number;
  priceChange24h: number;
  marketCap: string;
  volume24h: string;
  modules: {
    sentiment: number;
    whaleActivity: number;
    technicalAnalysis: number;
    onChainMetrics: number;
    socialBuzz: number;
    smartMoney: number;
  };
  result?: 'WIN' | 'LOSS' | 'PENDING';
  pnl?: number;
}

export interface WhaleTransaction {
  id: string;
  wallet: string;
  walletLabel?: string;
  type: 'BUY' | 'SELL' | 'TRANSFER';
  token: string;
  symbol: string;
  chain: 'ETH' | 'SOL' | 'BNB';
  amount: number;
  value: number;
  timestamp: string;
  txHash: string;
}

export interface TrendingToken {
  symbol: string;
  name: string;
  chain: 'ETH' | 'SOL' | 'BNB' | 'ARB' | 'BASE';
  price: number;
  change24h: number;
  volume: string;
  signals: number;
  whaleInterest: 'HIGH' | 'MEDIUM' | 'LOW';
}

// Generate timestamps for last 30 days
const now = new Date();
const ts = (daysAgo: number, hoursAgo = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
};

export const mockSignals: Signal[] = [
  {
    id: 'sig-001',
    token: 'Pepe',
    symbol: 'PEPE',
    chain: 'ETH',
    type: 'BUY',
    confidence: 94,
    timestamp: ts(0, 1),
    price: 0.00001847,
    priceChange24h: 12.5,
    marketCap: '$7.8B',
    volume24h: '$1.2B',
    modules: { sentiment: 92, whaleActivity: 96, technicalAnalysis: 88, onChainMetrics: 95, socialBuzz: 97, smartMoney: 94 },
    result: 'PENDING',
  },
  {
    id: 'sig-002',
    token: 'Render',
    symbol: 'RNDR',
    chain: 'ETH',
    type: 'BUY',
    confidence: 91,
    timestamp: ts(0, 3),
    price: 11.42,
    priceChange24h: 8.3,
    marketCap: '$5.9B',
    volume24h: '$890M',
    modules: { sentiment: 88, whaleActivity: 93, technicalAnalysis: 92, onChainMetrics: 89, socialBuzz: 85, smartMoney: 96 },
    result: 'PENDING',
  },
  {
    id: 'sig-003',
    token: 'Jupiter',
    symbol: 'JUP',
    chain: 'SOL',
    type: 'BUY',
    confidence: 89,
    timestamp: ts(0, 5),
    price: 1.87,
    priceChange24h: 15.2,
    marketCap: '$2.5B',
    volume24h: '$420M',
    modules: { sentiment: 91, whaleActivity: 87, technicalAnalysis: 85, onChainMetrics: 92, socialBuzz: 90, smartMoney: 88 },
    result: 'PENDING',
  },
  {
    id: 'sig-004',
    token: 'Bonk',
    symbol: 'BONK',
    chain: 'SOL',
    type: 'BUY',
    confidence: 87,
    timestamp: ts(0, 8),
    price: 0.0000382,
    priceChange24h: 22.1,
    marketCap: '$2.8B',
    volume24h: '$650M',
    modules: { sentiment: 95, whaleActivity: 82, technicalAnalysis: 78, onChainMetrics: 88, socialBuzz: 96, smartMoney: 84 },
    result: 'WIN',
    pnl: 22.1,
  },
  {
    id: 'sig-005',
    token: 'Arbitrum',
    symbol: 'ARB',
    chain: 'ARB',
    type: 'SELL',
    confidence: 85,
    timestamp: ts(1, 2),
    price: 1.92,
    priceChange24h: -5.4,
    marketCap: '$7.1B',
    volume24h: '$380M',
    modules: { sentiment: 72, whaleActivity: 88, technicalAnalysis: 90, onChainMetrics: 85, socialBuzz: 68, smartMoney: 92 },
    result: 'WIN',
    pnl: 5.4,
  },
  {
    id: 'sig-006',
    token: 'Worldcoin',
    symbol: 'WLD',
    chain: 'ETH',
    type: 'BUY',
    confidence: 83,
    timestamp: ts(1, 6),
    price: 8.75,
    priceChange24h: 18.9,
    marketCap: '$3.2B',
    volume24h: '$290M',
    modules: { sentiment: 85, whaleActivity: 80, technicalAnalysis: 82, onChainMetrics: 78, socialBuzz: 92, smartMoney: 81 },
    result: 'WIN',
    pnl: 18.9,
  },
  {
    id: 'sig-007',
    token: 'Injective',
    symbol: 'INJ',
    chain: 'ETH',
    type: 'BUY',
    confidence: 81,
    timestamp: ts(2, 1),
    price: 42.30,
    priceChange24h: 6.7,
    marketCap: '$4.1B',
    volume24h: '$210M',
    modules: { sentiment: 78, whaleActivity: 85, technicalAnalysis: 84, onChainMetrics: 80, socialBuzz: 72, smartMoney: 86 },
    result: 'WIN',
    pnl: 6.7,
  },
  {
    id: 'sig-008',
    token: 'Floki',
    symbol: 'FLOKI',
    chain: 'BNB',
    type: 'SELL',
    confidence: 78,
    timestamp: ts(2, 4),
    price: 0.000312,
    priceChange24h: -8.2,
    marketCap: '$3.0B',
    volume24h: '$450M',
    modules: { sentiment: 65, whaleActivity: 82, technicalAnalysis: 85, onChainMetrics: 76, socialBuzz: 70, smartMoney: 80 },
    result: 'WIN',
    pnl: 8.2,
  },
  {
    id: 'sig-009',
    token: 'Ondo',
    symbol: 'ONDO',
    chain: 'ETH',
    type: 'BUY',
    confidence: 76,
    timestamp: ts(3, 3),
    price: 4.15,
    priceChange24h: -2.1,
    marketCap: '$5.8B',
    volume24h: '$180M',
    modules: { sentiment: 82, whaleActivity: 73, technicalAnalysis: 70, onChainMetrics: 78, socialBuzz: 75, smartMoney: 77 },
    result: 'LOSS',
    pnl: -2.1,
  },
  {
    id: 'sig-010',
    token: 'Sei',
    symbol: 'SEI',
    chain: 'ETH',
    type: 'BUY',
    confidence: 74,
    timestamp: ts(3, 8),
    price: 0.89,
    priceChange24h: 4.5,
    marketCap: '$3.4B',
    volume24h: '$160M',
    modules: { sentiment: 76, whaleActivity: 70, technicalAnalysis: 75, onChainMetrics: 72, socialBuzz: 78, smartMoney: 73 },
    result: 'WIN',
    pnl: 4.5,
  },
  {
    id: 'sig-011',
    token: 'Aave',
    symbol: 'AAVE',
    chain: 'ETH',
    type: 'BUY',
    confidence: 72,
    timestamp: ts(4, 2),
    price: 358.40,
    priceChange24h: 3.2,
    marketCap: '$5.3B',
    volume24h: '$220M',
    modules: { sentiment: 74, whaleActivity: 78, technicalAnalysis: 71, onChainMetrics: 69, socialBuzz: 65, smartMoney: 75 },
    result: 'WIN',
    pnl: 3.2,
  },
  {
    id: 'sig-012',
    token: 'Dogwifhat',
    symbol: 'WIF',
    chain: 'SOL',
    type: 'BUY',
    confidence: 88,
    timestamp: ts(4, 5),
    price: 3.42,
    priceChange24h: 28.5,
    marketCap: '$3.4B',
    volume24h: '$780M',
    modules: { sentiment: 93, whaleActivity: 86, technicalAnalysis: 80, onChainMetrics: 88, socialBuzz: 95, smartMoney: 85 },
    result: 'WIN',
    pnl: 28.5,
  },
  {
    id: 'sig-013',
    token: 'Stacks',
    symbol: 'STX',
    chain: 'ETH',
    type: 'SELL',
    confidence: 70,
    timestamp: ts(5, 3),
    price: 2.85,
    priceChange24h: -3.8,
    marketCap: '$4.1B',
    volume24h: '$140M',
    modules: { sentiment: 62, whaleActivity: 74, technicalAnalysis: 76, onChainMetrics: 70, socialBuzz: 60, smartMoney: 72 },
    result: 'LOSS',
    pnl: -3.8,
  },
  {
    id: 'sig-014',
    token: 'Chainlink',
    symbol: 'LINK',
    chain: 'ETH',
    type: 'BUY',
    confidence: 86,
    timestamp: ts(5, 7),
    price: 24.80,
    priceChange24h: 9.1,
    marketCap: '$15.2B',
    volume24h: '$520M',
    modules: { sentiment: 84, whaleActivity: 90, technicalAnalysis: 87, onChainMetrics: 83, socialBuzz: 80, smartMoney: 89 },
    result: 'WIN',
    pnl: 9.1,
  },
  {
    id: 'sig-015',
    token: 'PancakeSwap',
    symbol: 'CAKE',
    chain: 'BNB',
    type: 'BUY',
    confidence: 68,
    timestamp: ts(6, 2),
    price: 4.52,
    priceChange24h: -1.3,
    marketCap: '$1.3B',
    volume24h: '$95M',
    modules: { sentiment: 70, whaleActivity: 65, technicalAnalysis: 68, onChainMetrics: 72, socialBuzz: 62, smartMoney: 70 },
    result: 'LOSS',
    pnl: -1.3,
  },
];

export const mockWhaleTransactions: WhaleTransaction[] = [
  {
    id: 'wh-001',
    wallet: '0x7a16...3f9e',
    walletLabel: 'Galaxy Digital',
    type: 'BUY',
    token: 'Ethereum',
    symbol: 'ETH',
    chain: 'ETH',
    amount: 12500,
    value: 48750000,
    timestamp: ts(0, 0.5),
    txHash: '0xabc...def',
  },
  {
    id: 'wh-002',
    wallet: '0x3d8c...7a2b',
    walletLabel: 'Jump Trading',
    type: 'BUY',
    token: 'Solana',
    symbol: 'SOL',
    chain: 'SOL',
    amount: 250000,
    value: 37500000,
    timestamp: ts(0, 1),
    txHash: '0x123...456',
  },
  {
    id: 'wh-003',
    wallet: '0x9f2e...1c4d',
    walletLabel: 'Wintermute',
    type: 'SELL',
    token: 'Bitcoin',
    symbol: 'BTC',
    chain: 'ETH',
    amount: 340,
    value: 33320000,
    timestamp: ts(0, 1.5),
    txHash: '0xdef...789',
  },
  {
    id: 'wh-004',
    wallet: '0x5b7a...9e3f',
    walletLabel: 'Alameda Remnant',
    type: 'TRANSFER',
    token: 'USDC',
    symbol: 'USDC',
    chain: 'ETH',
    amount: 25000000,
    value: 25000000,
    timestamp: ts(0, 2),
    txHash: '0x456...abc',
  },
  {
    id: 'wh-005',
    wallet: '0x1c3d...8f2a',
    walletLabel: 'DWF Labs',
    type: 'BUY',
    token: 'Pepe',
    symbol: 'PEPE',
    chain: 'ETH',
    amount: 1200000000000,
    value: 22200000,
    timestamp: ts(0, 3),
    txHash: '0x789...ghi',
  },
  {
    id: 'wh-006',
    wallet: '0x8e4f...2d7c',
    walletLabel: 'Paradigm',
    type: 'BUY',
    token: 'Render',
    symbol: 'RNDR',
    chain: 'ETH',
    amount: 1500000,
    value: 17130000,
    timestamp: ts(0, 4),
    txHash: '0xaaa...bbb',
  },
  {
    id: 'wh-007',
    wallet: '0x4a9b...6e1f',
    walletLabel: 'Three Arrows (New)',
    type: 'SELL',
    token: 'BNB',
    symbol: 'BNB',
    chain: 'BNB',
    amount: 42000,
    value: 15540000,
    timestamp: ts(0, 5),
    txHash: '0xccc...ddd',
  },
  {
    id: 'wh-008',
    wallet: '0x2f6e...4b8a',
    walletLabel: 'Cumberland',
    type: 'BUY',
    token: 'Jupiter',
    symbol: 'JUP',
    chain: 'SOL',
    amount: 8000000,
    value: 14960000,
    timestamp: ts(0, 6),
    txHash: '0xeee...fff',
  },
  {
    id: 'wh-009',
    wallet: '0x7c1d...9a3e',
    type: 'BUY',
    token: 'Chainlink',
    symbol: 'LINK',
    chain: 'ETH',
    amount: 500000,
    value: 12400000,
    timestamp: ts(0, 8),
    txHash: '0x111...222',
  },
  {
    id: 'wh-010',
    wallet: '0x6b3f...2e8d',
    walletLabel: 'Binance Hot',
    type: 'TRANSFER',
    token: 'USDT',
    symbol: 'USDT',
    chain: 'ETH',
    amount: 50000000,
    value: 50000000,
    timestamp: ts(0, 10),
    txHash: '0x333...444',
  },
  {
    id: 'wh-011',
    wallet: '0xa2e8...5f1c',
    walletLabel: 'a16z',
    type: 'BUY',
    token: 'Worldcoin',
    symbol: 'WLD',
    chain: 'ETH',
    amount: 1200000,
    value: 10500000,
    timestamp: ts(0, 12),
    txHash: '0x555...666',
  },
  {
    id: 'wh-012',
    wallet: '0xd4c7...3a9b',
    type: 'SELL',
    token: 'Dogwifhat',
    symbol: 'WIF',
    chain: 'SOL',
    amount: 2500000,
    value: 8550000,
    timestamp: ts(0, 14),
    txHash: '0x777...888',
  },
  {
    id: 'wh-013',
    wallet: '0xf1a3...7c2e',
    walletLabel: 'Polychain',
    type: 'BUY',
    token: 'Injective',
    symbol: 'INJ',
    chain: 'ETH',
    amount: 180000,
    value: 7614000,
    timestamp: ts(1, 2),
    txHash: '0x999...aaa',
  },
  {
    id: 'wh-014',
    wallet: '0x3e9d...8b4f',
    type: 'BUY',
    token: 'Aave',
    symbol: 'AAVE',
    chain: 'ETH',
    amount: 18000,
    value: 6451200,
    timestamp: ts(1, 5),
    txHash: '0xbbb...ccc',
  },
  {
    id: 'wh-015',
    wallet: '0x8d2a...1f6e',
    walletLabel: 'Sequoia Scout',
    type: 'BUY',
    token: 'Sei',
    symbol: 'SEI',
    chain: 'ETH',
    amount: 5000000,
    value: 4450000,
    timestamp: ts(1, 8),
    txHash: '0xddd...eee',
  },
];

export const mockTrendingTokens: TrendingToken[] = [
  { symbol: 'PEPE', name: 'Pepe', chain: 'ETH', price: 0.00001847, change24h: 12.5, volume: '$1.2B', signals: 8, whaleInterest: 'HIGH' },
  { symbol: 'WIF', name: 'Dogwifhat', chain: 'SOL', price: 3.42, change24h: 28.5, volume: '$780M', signals: 5, whaleInterest: 'HIGH' },
  { symbol: 'JUP', name: 'Jupiter', chain: 'SOL', price: 1.87, change24h: 15.2, volume: '$420M', signals: 4, whaleInterest: 'MEDIUM' },
  { symbol: 'RNDR', name: 'Render', chain: 'ETH', price: 11.42, change24h: 8.3, volume: '$890M', signals: 6, whaleInterest: 'HIGH' },
  { symbol: 'BONK', name: 'Bonk', chain: 'SOL', price: 0.0000382, change24h: 22.1, volume: '$650M', signals: 3, whaleInterest: 'MEDIUM' },
  { symbol: 'WLD', name: 'Worldcoin', chain: 'ETH', price: 8.75, change24h: 18.9, volume: '$290M', signals: 4, whaleInterest: 'MEDIUM' },
  { symbol: 'INJ', name: 'Injective', chain: 'ETH', price: 42.30, change24h: 6.7, volume: '$210M', signals: 3, whaleInterest: 'LOW' },
  { symbol: 'LINK', name: 'Chainlink', chain: 'ETH', price: 24.80, change24h: 9.1, volume: '$520M', signals: 5, whaleInterest: 'HIGH' },
];

// Analytics mock data
export const mockAccuracyOverTime = [
  { date: 'Jan 15', accuracy: 72, signals: 12 },
  { date: 'Jan 22', accuracy: 78, signals: 15 },
  { date: 'Jan 29', accuracy: 74, signals: 18 },
  { date: 'Feb 5', accuracy: 82, signals: 14 },
  { date: 'Feb 12', accuracy: 85, signals: 20 },
  { date: 'Feb 19', accuracy: 79, signals: 16 },
  { date: 'Feb 26', accuracy: 88, signals: 22 },
  { date: 'Mar 5', accuracy: 84, signals: 19 },
  { date: 'Mar 12', accuracy: 91, signals: 24 },
  { date: 'Mar 19', accuracy: 87, signals: 21 },
  { date: 'Mar 26', accuracy: 86, signals: 18 },
  { date: 'Apr 2', accuracy: 89, signals: 25 },
];

export const mockModuleContribution = [
  { name: 'Whale Activity', value: 28, color: '#D86DCB' },
  { name: 'Smart Money', value: 22, color: '#C23ABA' },
  { name: 'Technical Analysis', value: 18, color: '#7B2FBE' },
  { name: 'On-Chain Metrics', value: 15, color: '#4A1B8A' },
  { name: 'Sentiment', value: 10, color: '#E891DF' },
  { name: 'Social Buzz', value: 7, color: '#9B3F91' },
];

export const mockEquitySimulation = [
  { date: 'Week 1', equity: 10000, benchmark: 10000 },
  { date: 'Week 2', equity: 10450, benchmark: 10120 },
  { date: 'Week 3', equity: 11200, benchmark: 10050 },
  { date: 'Week 4', equity: 10800, benchmark: 9980 },
  { date: 'Week 5', equity: 12100, benchmark: 10200 },
  { date: 'Week 6', equity: 13500, benchmark: 10350 },
  { date: 'Week 7', equity: 13200, benchmark: 10100 },
  { date: 'Week 8', equity: 14800, benchmark: 10500 },
  { date: 'Week 9', equity: 16200, benchmark: 10450 },
  { date: 'Week 10', equity: 15900, benchmark: 10600 },
  { date: 'Week 11', equity: 17500, benchmark: 10800 },
  { date: 'Week 12', equity: 19200, benchmark: 10750 },
];

export const mockConfidenceOverTime = [
  { date: 'Jan 15', avgConfidence: 72, high: 88, low: 58 },
  { date: 'Jan 22', avgConfidence: 75, high: 91, low: 62 },
  { date: 'Jan 29', avgConfidence: 78, high: 92, low: 65 },
  { date: 'Feb 5', avgConfidence: 76, high: 89, low: 60 },
  { date: 'Feb 12', avgConfidence: 80, high: 94, low: 68 },
  { date: 'Feb 19', avgConfidence: 82, high: 93, low: 70 },
  { date: 'Feb 26', avgConfidence: 79, high: 91, low: 66 },
  { date: 'Mar 5', avgConfidence: 84, high: 95, low: 72 },
  { date: 'Mar 12', avgConfidence: 86, high: 96, low: 74 },
  { date: 'Mar 19', avgConfidence: 83, high: 94, low: 71 },
];

export const mockWhaleVolumeChart = [
  { date: 'Mon', eth: 120, sol: 45, bnb: 28 },
  { date: 'Tue', eth: 95, sol: 62, bnb: 35 },
  { date: 'Wed', eth: 150, sol: 38, bnb: 42 },
  { date: 'Thu', eth: 180, sol: 72, bnb: 25 },
  { date: 'Fri', eth: 130, sol: 55, bnb: 38 },
  { date: 'Sat', eth: 88, sol: 80, bnb: 30 },
  { date: 'Sun', eth: 110, sol: 48, bnb: 22 },
];

// System status
export const mockSystemStatus = {
  status: 'OPERATIONAL' as const,
  uptime: '99.7%',
  lastScan: ts(0, 0.1),
  activeSignals: 5,
  totalSignalsGenerated: 1247,
  accuracyRate: 84.2,
  modulesOnline: 6,
  totalModules: 6,
};

// Fear & Greed
export const mockFearGreed = {
  value: 72,
  label: 'Greed' as const,
  previousValue: 65,
  change: 7,
};

// Top whale wallets
export const mockTopWhaleWallets = [
  { rank: 1, wallet: '0x7a16...3f9e', label: 'Galaxy Digital', totalVolume: '$487M', txCount: 142, profitRate: 78 },
  { rank: 2, wallet: '0x3d8c...7a2b', label: 'Jump Trading', totalVolume: '$375M', txCount: 98, profitRate: 82 },
  { rank: 3, wallet: '0x9f2e...1c4d', label: 'Wintermute', totalVolume: '$333M', txCount: 215, profitRate: 71 },
  { rank: 4, wallet: '0x1c3d...8f2a', label: 'DWF Labs', totalVolume: '$222M', txCount: 67, profitRate: 85 },
  { rank: 5, wallet: '0x8e4f...2d7c', label: 'Paradigm', totalVolume: '$171M', txCount: 43, profitRate: 89 },
  { rank: 6, wallet: '0xa2e8...5f1c', label: 'a16z', totalVolume: '$105M', txCount: 31, profitRate: 91 },
  { rank: 7, wallet: '0x6b3f...2e8d', label: 'Binance Hot', totalVolume: '$500M', txCount: 520, profitRate: 65 },
  { rank: 8, wallet: '0x2f6e...4b8a', label: 'Cumberland', totalVolume: '$149M', txCount: 78, profitRate: 76 },
];
