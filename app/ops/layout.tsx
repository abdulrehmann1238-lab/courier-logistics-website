'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemoStore } from '../../store/useDemoStore';
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  Users,
  Calculator,
  Bell,
  Search,
  ChevronDown,
  Building,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    jobs,
    selectedDepot,
    setSelectedDepot,
    setCommandPaletteOpen,
  } = useDemoStore();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Exceptions count
  const openExceptionsCount = jobs.filter(
    (j) => j.status === 'Exception' && !j.exception?.resolved
  ).length;

  const navItems = [
    { href: '/ops', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/ops/jobs', label: 'Consignments', icon: Package },
    {
      href: '/ops/exceptions',
      label: 'Exceptions',
      icon: AlertTriangle,
      badge: openExceptionsCount > 0 ? openExceptionsCount : undefined,
    },
    { href: '/ops/drivers', label: 'Driver Fleet', icon: Users },
    { href: '/ops/pricing', label: 'Pricing Rules', icon: Calculator },
    { href: '/ops/notifications', label: 'Outbound Comms', icon: Bell },
  ];

  return (
    <div className="min-h-screen flex bg-bg font-sans">
      {/* Desktop Sidebar (248px) */}
      <aside className="hidden lg:flex w-60 bg-surface border-r border-border flex-col justify-between shrink-0 select-none">
        <div>
          {/* Brand & Workspace */}
          <div className="p-5 border-b border-border/70 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full border border-primary flex items-center justify-center bg-surface-elevated shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="30" r="24" stroke="#2E4A42" strokeWidth="2.5" />
                  <line x1="30" y1="6" x2="30" y2="54" stroke="#B4633F" strokeWidth="2.5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg text-ink font-normal leading-none">
                  Meridian
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted mt-0.5">
                  Ops Console
                </span>
              </div>
            </Link>

            <Link href="/" className="text-text-muted hover:text-ink text-[11px]" title="Back to customer website">
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Depot Selector */}
          <div className="p-4 border-b border-border/50">
            <label className="block text-[10px] font-mono uppercase text-text-muted mb-1.5 flex items-center gap-1">
              <Building className="w-3 h-3 text-primary" />
              <span>Depot Filter</span>
            </label>
            <select
              value={selectedDepot}
              onChange={(e) => setSelectedDepot(e.target.value as any)}
              className="w-full bg-surface-elevated text-ink text-xs rounded-sm border border-border-strong p-2 focus:outline-none focus:border-primary font-medium"
            >
              <option value="All">All Depots (National)</option>
              <option value="Melbourne">Melbourne (Port Melb)</option>
              <option value="Sydney">Sydney (Alexandria)</option>
              <option value="Brisbane">Brisbane (Eagle Farm)</option>
            </select>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/ops'
                  ? pathname === '/ops'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-sm text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-tint text-primary font-semibold'
                      : 'text-text-secondary hover:bg-surface-sunken hover:text-ink'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-error text-surface-elevated font-mono font-semibold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card bottom */}
        <div className="p-4 border-t border-border bg-surface-sunken/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary text-surface-elevated flex items-center justify-center font-serif text-sm font-normal">
              SR
            </div>
            <div>
              <span className="font-semibold text-ink block leading-tight">Shannon Reyes</span>
              <span className="text-[10px] text-text-muted">Operations Manager</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (64px) */}
        <header className="h-16 border-b border-border bg-surface px-6 flex items-center justify-between gap-4 sticky top-10 z-sticky select-none">
          {/* Left: Mobile hamburger & breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-1.5 text-text-secondary hover:text-ink"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="text-xs text-text-muted flex items-center gap-1.5 font-medium">
              <span>Operations</span>
              <span>/</span>
              <span className="text-ink font-semibold capitalize">
                {pathname.replace('/ops/', '').replace('/ops', 'Dashboard')}
              </span>
            </div>
          </div>

          {/* Right: Search trigger & Alerts bell */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-surface-sunken hover:bg-border/60 text-text-muted px-3 py-1.5 rounded-sm border border-border text-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search consignments, drivers...</span>
              <span className="text-[10px] font-mono border border-border bg-surface-elevated px-1 rounded ml-1">
                ⌘K
              </span>
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-text-secondary hover:text-ink hover:bg-surface-sunken rounded-sm transition-colors"
                aria-label="Operations alerts"
              >
                <Bell className="w-4 h-4" />
                {openExceptionsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-surface-elevated rounded-md shadow-3 border border-border p-3 z-30 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-border mb-2 font-semibold text-ink">
                    <span>Operations Dispatch Alerts</span>
                    <span className="text-[10px] font-mono text-accent">
                      {openExceptionsCount} open
                    </span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {jobs
                      .filter((j) => j.status === 'Exception')
                      .slice(0, 4)
                      .map((ex) => (
                        <Link
                          key={ex.id}
                          href="/ops/exceptions"
                          onClick={() => setNotificationsOpen(false)}
                          className="block p-2 rounded bg-surface-sunken hover:bg-border/40 transition-colors"
                        >
                          <div className="flex justify-between font-mono font-medium text-ink text-[11px]">
                            <span>{ex.id}</span>
                            <span className="text-accent">{ex.exception?.severity}</span>
                          </div>
                          <p className="text-[11px] text-text-secondary mt-0.5 truncate">
                            {ex.exception?.reason}
                          </p>
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden bg-surface border-b border-border p-4 space-y-1 animate-in slide-in-from-top-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded text-xs font-medium text-ink hover:bg-surface-sunken"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-primary" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-error text-surface-elevated font-mono">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Page Children */}
        <main className="flex-1 p-6 max-w-[1440px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
