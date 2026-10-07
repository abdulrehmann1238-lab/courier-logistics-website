'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDemoStore } from '../../store/useDemoStore';
import {
  RotateCcw,
  Eye,
  WifiOff,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Command,
} from 'lucide-react';

export function DemoBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMinimized, setIsMinimized] = useState(false);

  const {
    auditLensActive,
    toggleAuditLens,
    offlineMode,
    toggleOfflineMode,
    simulateApiError,
    toggleSimulateApiError,
    resetDemo,
    setTourOpen,
    setTourStep,
    setCommandPaletteOpen,
  } = useDemoStore();

  // Determine current active mode from pathname
  const isDriver = pathname.startsWith('/driver');
  const isOps = pathname.startsWith('/ops');
  const isAudit = pathname.startsWith('/audit');
  const isCustomer = !isDriver && !isOps && !isAudit;

  if (isMinimized) {
    return (
      <div className="fixed top-2 right-4 z-demo flex items-center gap-1.5 bg-surface-elevated/95 backdrop-blur border border-border shadow-2 rounded-full px-3 py-1 text-xs text-text-secondary">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="font-medium text-ink">Demo Bar</span>
        <button
          onClick={() => setIsMinimized(false)}
          className="p-1 hover:text-ink transition-colors ml-1"
          title="Expand Demo Bar"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Demo Bar" className="relative z-demo w-full bg-[#EAE6DE] border-b border-border text-ink text-xs font-sans select-none">
      <div className="max-w-[1440px] mx-auto px-4 h-10 flex items-center justify-between gap-3">
        {/* Left: Branding & Disclaimer */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 font-medium text-ink">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-semibold tracking-tight">Meridian Interactive Demo</span>
            <span className="text-text-muted hidden sm:inline">· Fictional AU Data</span>
          </div>

          <button
            onClick={() => {
              setTourStep(0);
              setTourOpen(true);
            }}
            className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-surface-elevated/80 border border-border hover:bg-surface-elevated text-[11px] font-medium text-primary transition-colors"
          >
            <Sparkles className="w-3 h-3 text-accent" />
            <span>90s Tour</span>
          </button>
        </div>

        {/* Center: Mode Switcher */}
        <div className="flex items-center bg-surface-sunken/80 rounded-sm p-0.5 border border-border/60">
          <Link
            href="/"
            className={`px-2.5 py-1 rounded-xs text-[11px] font-medium transition-colors ${
              isCustomer
                ? 'bg-surface-elevated text-primary shadow-sm font-semibold'
                : 'text-text-secondary hover:text-ink'
            }`}
          >
            Customer
          </Link>
          <Link
            href="/ops"
            className={`px-2.5 py-1 rounded-xs text-[11px] font-medium transition-colors ${
              isOps
                ? 'bg-surface-elevated text-primary shadow-sm font-semibold'
                : 'text-text-secondary hover:text-ink'
            }`}
          >
            Operations
          </Link>
          <Link
            href="/driver"
            className={`px-2.5 py-1 rounded-xs text-[11px] font-medium transition-colors ${
              isDriver
                ? 'bg-surface-elevated text-primary shadow-sm font-semibold'
                : 'text-text-secondary hover:text-ink'
            }`}
          >
            Driver App
          </Link>
          <Link
            href="/audit"
            className={`px-2.5 py-1 rounded-xs text-[11px] font-medium transition-colors ${
              isAudit
                ? 'bg-surface-elevated text-accent shadow-sm font-semibold'
                : 'text-text-secondary hover:text-ink'
            }`}
          >
            Audit Hub ↗
          </Link>
        </div>

        {/* Right: Controls & Toggles */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Audit Lens Toggle */}
          <button
            onClick={toggleAuditLens}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[11px] font-medium transition-all ${
              auditLensActive
                ? 'bg-accent text-surface-elevated shadow-sm'
                : 'bg-surface-elevated/70 border border-border text-ink hover:bg-surface-elevated'
            }`}
            title="Toggle Audit Lens findings overlay"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Audit Lens</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                auditLensActive ? 'bg-surface-elevated' : 'bg-accent'
              }`}
            />
          </button>

          {/* Command Palette Trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden lg:inline-flex items-center gap-1 px-2 py-1 rounded-xs bg-surface-elevated/50 hover:bg-surface-elevated border border-border text-[11px] text-text-secondary transition-colors"
            title="Open command palette (Ctrl+K / ⌘K)"
          >
            <Command className="w-3 h-3" />
            <span>K</span>
          </button>

          {/* Offline Toggle */}
          <button
            onClick={toggleOfflineMode}
            className={`p-1.5 rounded-xs transition-colors ${
              offlineMode
                ? 'bg-warning text-surface-elevated'
                : 'text-text-secondary hover:text-ink hover:bg-surface-sunken'
            }`}
            title={offlineMode ? 'Offline mode active (Click to reconnect)' : 'Simulate offline driver mode'}
          >
            <WifiOff className="w-3.5 h-3.5" />
          </button>

          {/* Fault Simulation */}
          <button
            onClick={toggleSimulateApiError}
            className={`p-1.5 rounded-xs transition-colors ${
              simulateApiError
                ? 'bg-error text-surface-elevated'
                : 'text-text-secondary hover:text-ink hover:bg-surface-sunken'
            }`}
            title={simulateApiError ? 'API fault armed (Next call fails)' : 'Simulate API 500 error'}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
          </button>

          {/* Reset Demo */}
          <button
            onClick={resetDemo}
            className="p-1.5 text-text-secondary hover:text-ink hover:bg-surface-sunken rounded-xs transition-colors"
            title="Reset demo data to seeds"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Minimize */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-text-muted hover:text-ink transition-colors"
            title="Minimize demo bar"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
