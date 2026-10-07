'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemoStore } from '../../store/useDemoStore';
import { JobStatusChip, SeverityChip } from '../../components/ui/StatusChip';
import { Button } from '../../components/ui/Button';
import { formatTime, formatRelativeTime } from '../../lib/format';
import { FindingPin } from '../../components/audit/FindingPin';
import {
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Building,
} from 'lucide-react';

export default function OpsDashboardPage() {
  const { jobs, drivers, selectedDepot, assignDriver, addToast } = useDemoStore();
  const [selectedDriverId, setSelectedDriverId] = useState<string>('D-101');

  // Filter jobs by selected depot
  const filteredJobs = jobs.filter(
    (j) => selectedDepot === 'All' || j.depot === selectedDepot
  );

  // Derived metrics
  const activeJobs = filteredJobs.filter(
    (j) => j.status === 'Accepted' || j.status === 'Picked up' || j.status === 'In transit'
  ).length;

  const deliveredToday = filteredJobs.filter((j) => j.status === 'Delivered').length;
  const unassignedJobs = filteredJobs.filter((j) => j.status === 'Unassigned');
  const exceptionJobs = filteredJobs.filter(
    (j) => j.status === 'Exception' && !j.exception?.resolved
  );

  // Sparkline generator helper
  function renderSparkline(points: number[], color = '#2E4A42') {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 100;
    const height = 28;

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    });

    return (
      <svg className="w-24 h-7 shrink-0 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={coords.join(' ')}
        />
      </svg>
    );
  }

  // Quick assign helper
  async function handleQuickAssign(jobId: string, driverId: string) {
    await assignDriver(jobId, driverId);
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
            Live Network Overview · {selectedDepot} Operations
          </span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-0.5">
            Operations Dispatch Console
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <FindingPin findingId="F-002" label="PostgreSQL Connection Pool" />
          <FindingPin findingId="F-008" label="Concurrency Lock" />
        </div>
      </div>

      {/* Row 1: What Matters (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Active Jobs */}
        <div className="bg-surface rounded-md border border-border p-5 shadow-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Active In Transit
            </span>
            <span className="text-[11px] font-mono text-primary bg-primary-tint px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="font-serif text-4xl text-ink font-normal tabular-nums">
              {activeJobs}
            </span>
            {renderSparkline([18, 22, 28, 24, 30, 34, activeJobs], '#2E4A42')}
          </div>
          <span className="text-[11px] text-text-muted mt-2">
            Dispatched & en route across {selectedDepot === 'All' ? '3 depots' : selectedDepot}
          </span>
        </div>

        {/* Delivered Today */}
        <div className="bg-surface rounded-md border border-border p-5 shadow-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Delivered Today
            </span>
            <span className="text-[11px] font-mono text-success bg-success-tint px-1.5 py-0.2 rounded font-medium">
              100% POD
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="font-serif text-4xl text-ink font-normal tabular-nums">
              {deliveredToday}
            </span>
            {renderSparkline([60, 75, 88, 92, 105, 110, deliveredToday], '#3E7A58')}
          </div>
          <span className="text-[11px] text-text-muted mt-2">
            Signed canvas and geotag confirmed
          </span>
        </div>

        {/* On-Time Rate */}
        <div className="bg-surface rounded-md border border-border p-5 shadow-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              On-Time SLA
            </span>
            <span className="text-[11px] font-mono text-text-secondary bg-surface-sunken px-1.5 py-0.2 rounded font-medium">
              Target 97.0%
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="font-serif text-4xl text-ink font-normal tabular-nums">
              97.4%
            </span>
            {renderSparkline([96.8, 97.1, 96.9, 97.5, 97.2, 97.4, 97.4], '#2E4A42')}
          </div>
          <span className="text-[11px] text-text-muted mt-2">
            Rolling 24h metro carrier compliance
          </span>
        </div>

        {/* Open Exceptions */}
        <div className="bg-surface rounded-md border border-border p-5 shadow-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Open Exceptions
            </span>
            <span className="text-[11px] font-mono text-error bg-error-tint px-1.5 py-0.2 rounded font-medium">
              Requires Action
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="font-serif text-4xl text-accent font-normal tabular-nums">
              {exceptionJobs.length}
            </span>
            {renderSparkline([2, 4, 3, 6, 5, 4, exceptionJobs.length], '#B4633F')}
          </div>
          <span className="text-[11px] text-text-muted mt-2">
            Intercom, damaged goods, or address checks
          </span>
        </div>
      </div>

      {/* Row 2: Needs Action Split (Exceptions & Unassigned) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Exceptions Requiring Resolution */}
        <div className="lg:col-span-8 bg-surface rounded-md border border-border p-6 shadow-1 space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold text-ink">
                Priority Exceptions Queue ({exceptionJobs.length})
              </h3>
            </div>
            <Link
              href="/ops/exceptions"
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              <span>View full queue</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {exceptionJobs.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-muted">
              All clear. No unresolved exceptions in {selectedDepot} queue.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {exceptionJobs.slice(0, 4).map((ex) => (
                <div key={ex.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/ops/jobs`}
                        className="font-mono font-semibold text-primary hover:underline"
                      >
                        {ex.id}
                      </Link>
                      <SeverityChip severity={ex.exception?.severity || 'Medium'} />
                      <span className="text-text-muted">· {ex.depot}</span>
                    </div>
                    <strong className="text-ink block truncate">{ex.customerName}</strong>
                    <p className="text-text-secondary text-[11px] leading-snug">
                      {ex.exception?.reason}
                    </p>
                  </div>
                  <Link href="/ops/exceptions">
                    <Button variant="secondary" size="sm" className="shrink-0 text-xs">
                      Resolve
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 4 cols: Unassigned Jobs Quick Allocation */}
        <div className="lg:col-span-4 bg-surface rounded-md border border-border p-6 shadow-1 space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold text-ink">
              Unassigned Jobs ({unassignedJobs.length})
            </h3>
            <span className="text-[11px] font-mono text-text-muted">Pending</span>
          </div>

          {unassignedJobs.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-muted">
              All consignments allocated to active couriers.
            </div>
          ) : (
            <div className="space-y-3">
              {unassignedJobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="p-3 bg-surface-elevated rounded border border-border/80 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-ink">{job.id}</span>
                    <span className="font-serif font-normal text-text-secondary">${job.price.toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] text-text-secondary">
                    {job.fromSuburb} → {job.toSuburb}
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                    <select
                      value={selectedDriverId}
                      onChange={(e) => setSelectedDriverId(e.target.value)}
                      className="flex-1 bg-surface-sunken text-[11px] p-1.5 rounded border border-border focus:outline-none"
                    >
                      {drivers.slice(0, 4).map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.depot})
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleQuickAssign(job.id, selectedDriverId)}
                      className="text-xs px-2.5 py-1"
                    >
                      Assign
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Hourly Volume Chart & Depot Status Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 cols: Hourly volume chart */}
        <div className="lg:col-span-7 bg-surface rounded-md border border-border p-6 shadow-1 space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold text-ink">Consignment Dispatch Hourly Volume</h3>
            <span className="text-[11px] font-mono text-text-muted">Today (06:00 - 18:00)</span>
          </div>

          {/* Handcrafted SVG Bar Chart */}
          <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
            {[
              { hour: '06h', count: 8 },
              { hour: '08h', count: 24 },
              { hour: '10h', count: 42 },
              { hour: '12h', count: 38 },
              { hour: '14h', count: 56 },
              { hour: '16h', count: 32 },
              { hour: '18h', count: 18 },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-mono text-text-muted tabular-nums">
                  {bar.count}
                </span>
                <div
                  className="w-full max-w-[28px] bg-primary hover:bg-primary-hover transition-all rounded-t-xs"
                  style={{ height: `${(bar.count / 60) * 100}%` }}
                  title={`${bar.hour}: ${bar.count} jobs`}
                />
                <span className="text-[10px] font-mono text-text-muted">{bar.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 cols: Depot Status Stacked Bars */}
        <div className="lg:col-span-5 bg-surface rounded-md border border-border p-6 shadow-1 space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold text-ink">Depot Facility Load</h3>
            <span className="text-[11px] font-mono text-text-muted">Capacity Status</span>
          </div>

          <div className="space-y-4 text-xs">
            {[
              { name: 'Melbourne (Port Melb)', total: 64, activePct: 65, completedPct: 30, exPct: 5 },
              { name: 'Sydney (Alexandria)', total: 48, activePct: 55, completedPct: 40, exPct: 5 },
              { name: 'Brisbane (Eagle Farm)', total: 32, activePct: 50, completedPct: 45, exPct: 5 },
            ].map((depot, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between font-medium text-ink">
                  <span>{depot.name}</span>
                  <span className="font-mono text-text-muted">{depot.total} jobs today</span>
                </div>
                {/* Horizontal Stacked Bar */}
                <div className="h-3 w-full bg-surface-sunken rounded-xs overflow-hidden flex">
                  <div
                    style={{ width: `${depot.activePct}%` }}
                    className="bg-primary h-full"
                    title={`Active: ${depot.activePct}%`}
                  />
                  <div
                    style={{ width: `${depot.completedPct}%` }}
                    className="bg-success h-full"
                    title={`Delivered: ${depot.completedPct}%`}
                  />
                  <div
                    style={{ width: `${depot.exPct}%` }}
                    className="bg-error h-full"
                    title={`Exceptions: ${depot.exPct}%`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-border/60">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" /> Active
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success" /> Delivered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-error" /> Exception
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
