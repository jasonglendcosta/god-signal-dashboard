'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Signal,
  Fish,
  BarChart3,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/signals', label: 'Signals', icon: Signal },
  { href: '/whales', label: 'Whales', icon: Fish },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden glass-card p-2"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 bg-[#0d0d15]/95 backdrop-blur-xl border-r border-[rgba(216,109,203,0.1)] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[rgba(216,109,203,0.1)]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D86DCB] to-[#7B2FBE] flex items-center justify-center">
              <Zap size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight gradient-text">
                GOD SIGNAL
              </h1>
              <p className="text-[10px] text-text-secondary tracking-widest uppercase">
                Alpha Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-[rgba(216,109,203,0.15)] to-transparent'
                    : 'text-text-secondary hover:text-white hover:bg-[rgba(255,255,255,0.03)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b from-[#D86DCB] to-[#7B2FBE]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon size={18} className={isActive ? 'text-accent' : ''} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[rgba(216,109,203,0.1)]">
          <div className="glass-card p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="status-dot bg-green" />
              <span className="text-xs font-medium text-green">SYSTEM ONLINE</span>
            </div>
            <p className="text-[10px] text-text-muted">6/6 modules active</p>
          </div>
        </div>
      </aside>
    </>
  );
}
