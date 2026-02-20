# GOD SIGNAL Dashboard

**Autonomous Crypto Alpha Intelligence System**

A premium Next.js dashboard for monitoring real-time crypto signals, whale transactions, and market analytics.

## Features

- **Command Center** — System status, Fear & Greed gauge, active signals, whale feed, trending tokens
- **Signal History** — Filterable table with expandable module scores, confidence charts, CSV export
- **Whale Tracker** — Live whale transactions >$100K, chain filters, top wallet leaderboard
- **Performance Analytics** — Accuracy over time, module contribution, equity simulation

## Tech Stack

- Next.js 16 + TypeScript + Tailwind CSS v4
- Recharts for data visualization
- Framer Motion for animations
- Lucide icons
- Glass morphism design with pink/magenta/purple theme

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:8090
```

Falls back to realistic mock data when API is unreachable.

## Deploy

Deploy-ready for Vercel. Connect to GitHub and push.

```bash
vercel
```
