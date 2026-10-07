'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoStore } from '../../store/useDemoStore';
import { Search, X, Package, User, FileText, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export function CommandPalette() {
  const router = useRouter();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    jobs,
    drivers,
    findings,
    setActiveFindingId,
    setAuditLensActive,
    setTourOpen,
    setTourStep,
  } = useDemoStore();

  const [query, setQuery] = useState('');

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  // Search filtered results
  const filteredJobs = jobs.filter(
    (j) =>
      j.id.toLowerCase().includes(q) ||
      j.customerName.toLowerCase().includes(q) ||
      j.toSuburb.toLowerCase().includes(q)
  ).slice(0, 4);

  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.depot.toLowerCase().includes(q) ||
      d.vehicle.toLowerCase().includes(q)
  ).slice(0, 3);

  const filteredFindings = findings.filter(
    (f) =>
      f.id.toLowerCase().includes(q) ||
      f.title.toLowerCase().includes(q) ||
      f.area.toLowerCase().includes(q)
  ).slice(0, 4);

  function navigateTo(path: string) {
    router.push(path);
    setCommandPaletteOpen(false);
    setQuery('');
  }

  function openFinding(id: string) {
    setAuditLensActive(true);
    setActiveFindingId(id);
    setCommandPaletteOpen(false);
    setQuery('');
  }

  return (
    <div className="fixed inset-0 z-modal flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#151B19]/50 backdrop-blur-[2px]"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Palette Box */}
      <div className="relative w-full max-w-2xl bg-surface-elevated rounded-lg shadow-3 border border-border overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border bg-surface">
          <Search className="w-5 h-5 text-text-muted shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Search jobs, drivers, findings, or jump to actions... (e.g. 481920, Callum, F-001)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-ink placeholder:text-text-muted text-sm focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-text-muted hover:text-ink rounded-xs"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-border text-text-muted">
              ESC
            </span>
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-border/50 text-xs">
          {/* Quick Actions */}
          {!query && (
            <div className="p-2">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-2 block mb-1.5">
                Quick Shortcuts
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => navigateTo('/quote')}
                  className="w-full flex items-center justify-between p-2 rounded-sm hover:bg-surface-sunken text-left text-ink transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span>Instant Freight Quote & Calculator</span>
                  </span>
                  <span className="text-text-muted font-mono text-[11px]">/quote</span>
                </button>
                <button
                  onClick={() => navigateTo('/ops')}
                  className="w-full flex items-center justify-between p-2 rounded-sm hover:bg-surface-sunken text-left text-ink transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span>Operations Dispatch Dashboard</span>
                  </span>
                  <span className="text-text-muted font-mono text-[11px]">/ops</span>
                </button>
                <button
                  onClick={() => navigateTo('/driver')}
                  className="w-full flex items-center justify-between p-2 rounded-sm hover:bg-surface-sunken text-left text-ink transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span>Driver Mobile Field Application</span>
                  </span>
                  <span className="text-text-muted font-mono text-[11px]">/driver</span>
                </button>
                <button
                  onClick={() => navigateTo('/audit')}
                  className="w-full flex items-center justify-between p-2 rounded-sm hover:bg-surface-sunken text-left text-ink transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-accent" />
                    <span>Platform Takeover Audit Scorecard</span>
                  </span>
                  <span className="text-text-muted font-mono text-[11px]">/audit</span>
                </button>
                <button
                  onClick={() => {
                    setCommandPaletteOpen(false);
                    setTourStep(0);
                    setTourOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-sm hover:bg-surface-sunken text-left text-ink transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span>Launch 90-Second Interactive Guided Tour</span>
                  </span>
                  <span className="text-accent text-[11px] font-medium">Tour</span>
                </button>
              </div>
            </div>
          )}

          {/* Jobs Matches */}
          {filteredJobs.length > 0 && (
            <div className="p-2">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-2 block mb-1">
                Active Consignments
              </span>
              <div className="space-y-1">
                {filteredJobs.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => navigateTo(`/track/${j.id}`)}
                    className="w-full flex items-center justify-between p-2 rounded-sm hover:bg-surface-sunken text-left text-ink transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-semibold text-primary">{j.id}</span>
                      <span className="truncate max-w-[280px]">{j.customerName}</span>
                      <span className="text-text-muted">→ {j.toSuburb}</span>
                    </div>
                    <span className="text-text-muted font-mono">{j.status}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Drivers Matches */}
          {filteredDrivers.length > 0 && (
            <div className="p-2">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-2 block mb-1">
                Fleet Drivers
              </span>
              <div className="space-y-1">
                {filteredDrivers.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => navigateTo('/ops/drivers')}
                    className="w-full flex items-center justify-between p-2 rounded-sm hover:bg-surface-sunken text-left text-ink transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-text-secondary">{d.id}</span>
                      <span className="font-medium">{d.name}</span>
                      <span className="text-text-muted text-[11px]">({d.depot} Depot)</span>
                    </div>
                    <span className="text-text-muted">{d.status}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Audit Findings Matches */}
          {filteredFindings.length > 0 && (
            <div className="p-2">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-2 block mb-1">
                Audit Lens Findings
              </span>
              <div className="space-y-1">
                {filteredFindings.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => openFinding(f.id)}
                    className="w-full flex items-center justify-between p-2 rounded-sm hover:bg-surface-sunken text-left text-ink transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-accent font-semibold">{f.id}</span>
                      <span className="truncate max-w-[340px]">{f.title}</span>
                    </div>
                    <span className="text-accent font-medium">{f.severity}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query &&
            filteredJobs.length === 0 &&
            filteredDrivers.length === 0 &&
            filteredFindings.length === 0 && (
              <div className="py-8 text-center text-text-muted">
                No matching records found for "{query}".
              </div>
            )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-border bg-surface-sunken/60 flex items-center justify-between text-[11px] text-text-muted">
          <span>Navigate with mouse or tap</span>
          <span>Meridian Courier Takeover Demo</span>
        </div>
      </div>
    </div>
  );
}
