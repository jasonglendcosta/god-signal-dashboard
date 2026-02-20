import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'GOD SIGNAL — Autonomous Crypto Alpha Intelligence',
  description: 'Real-time crypto signals powered by AI. Whale tracking, sentiment analysis, and smart money intelligence.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg-primary text-text-primary font-sans antialiased">
        <Sidebar />
        <main className="lg:pl-64 min-h-screen">
          <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
