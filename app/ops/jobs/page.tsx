'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useDemoStore } from '../../../store/useDemoStore';
import { Job, JobStatus } from '../../../mocks/jobs';
import { JobStatusChip } from '../../../components/ui/StatusChip';
import { Button } from '../../../components/ui/Button';
import { Drawer } from '../../../components/ui/Drawer';
import { Tabs } from '../../../components/ui/Tabs';
import { formatTime, formatDateTime } from '../../../lib/format';
import { FindingPin } from '../../../components/audit/FindingPin';
import {
  Search,
  Filter,
  Download,
  Plus,
  Clock,
  User,
  ShieldCheck,
  RotateCcw,
  Send,
  Camera,
  MapPin,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export default function JobsPage() {
  const { jobs, drivers, selectedDepot, assignDriver, addToast } = useDemoStore();

  // Filters & State
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unassigned' | 'transit' | 'exceptions' | 'delivered'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [depotFilter, setDepotFilter] = useState<string>(selectedDepot);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Selected Job for 5-Tab Detail Drawer
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<'overview' | 'timeline' | 'pricing' | 'pod' | 'comms'>('overview');

  // Reassign Driver State inside drawer
  const [reassignDriverId, setReassignDriverId] = useState('');
  const [reassigning, setReassigning] = useState(false);

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  // Tab filtering
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Tab matching
      if (activeTab === 'unassigned' && job.status !== 'Unassigned') return false;
      if (activeTab === 'transit' && job.status !== 'In transit') return false;
      if (activeTab === 'exceptions' && job.status !== 'Exception') return false;
      if (activeTab === 'delivered' && job.status !== 'Delivered') return false;

      // Depot filter
      if (depotFilter !== 'All' && job.depot !== depotFilter) return false;

      // Status dropdown filter
      if (statusFilter !== 'all' && job.status !== statusFilter) return false;

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          job.id.toLowerCase().includes(q) ||
          job.customerName.toLowerCase().includes(q) ||
          job.fromSuburb.toLowerCase().includes(q) ||
          job.toSuburb.toLowerCase().includes(q) ||
          (job.driverName && job.driverName.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [jobs, activeTab, depotFilter, statusFilter, search]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / pageSize) || 1;
  const paginatedJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize);

  // Reassign Driver Action
  async function handleReassign() {
    if (!selectedJob || !reassignDriverId) return;
    setReassigning(true);
    await assignDriver(selectedJob.id, reassignDriverId);
    setReassigning(false);
  }

  function handleExport() {
    addToast({
      type: 'success',
      title: 'Consignments Exported',
      message: `Exported ${filteredJobs.length} consignment rows to CSV.`,
    });
  }

  function handleResendComms(msgId: string) {
    addToast({
      type: 'info',
      title: 'Notification Re-queued (Preview only)',
      message: `Simulated re-send for notification ${msgId}.`,
    });
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
            Fleet Operations Dispatch
          </span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-0.5">
            Consignments Register ({filteredJobs.length})
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={handleExport} icon={<Download className="w-3.5 h-3.5" />}>
            Export CSV
          </Button>
          <Link href="/book">
            <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
              Create Consignment
            </Button>
          </Link>
          <FindingPin findingId="F-015" label="Status State Machine" />
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="bg-surface rounded-md border border-border p-4 shadow-1 space-y-4">
        {/* Saved Views Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-3">
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'All Jobs', count: jobs.length },
              { id: 'unassigned', label: 'Unassigned', count: jobs.filter((j) => j.status === 'Unassigned').length },
              { id: 'transit', label: 'In Transit', count: jobs.filter((j) => j.status === 'In transit').length },
              { id: 'exceptions', label: 'Exceptions', count: jobs.filter((j) => j.status === 'Exception').length },
              { id: 'delivered', label: 'Delivered', count: jobs.filter((j) => j.status === 'Delivered').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-surface-elevated font-semibold'
                    : 'text-text-secondary hover:bg-surface-sunken hover:text-ink'
                }`}
              >
                <span>{tab.label}</span>
                <span className="ml-1.5 font-mono text-[10px] opacity-80">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Depot Filter dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-muted">Depot:</span>
            <select
              value={depotFilter}
              onChange={(e) => {
                setDepotFilter(e.target.value);
                setPage(1);
              }}
              className="bg-surface-elevated border border-border-strong rounded p-1 text-xs focus:outline-none"
            >
              <option value="All">All Depots</option>
              <option value="Melbourne">Melbourne</option>
              <option value="Sydney">Sydney</option>
              <option value="Brisbane">Brisbane</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by job ID (MRD-48xxxx), client name, suburb, or driver..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-surface-elevated border border-border-strong rounded-sm py-2 pl-9 pr-4 text-xs text-ink placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Main Jobs Table */}
      <div className="bg-surface rounded-md border border-border overflow-hidden shadow-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-sunken border-b border-border text-[11px] font-mono uppercase tracking-wider text-text-muted">
                <th className="py-3 px-4 font-semibold">Job ID</th>
                <th className="py-3 px-4 font-semibold">Client Consignor</th>
                <th className="py-3 px-4 font-semibold">Route (From → To)</th>
                <th className="py-3 px-4 font-semibold">Tier</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Courier</th>
                <th className="py-3 px-4 font-semibold">ETA / Delivered</th>
                <th className="py-3 px-4 font-semibold text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginatedJobs.map((job) => (
                <tr
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className="hover:bg-primary-tint/30 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-mono font-semibold text-primary">
                    {job.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-ink max-w-[180px] truncate">
                    {job.customerName}
                  </td>
                  <td className="py-3 px-4 text-text-secondary">
                    {job.fromSuburb} → {job.toSuburb}
                  </td>
                  <td className="py-3 px-4 font-mono text-text-muted uppercase text-[10px]">
                    {job.service}
                  </td>
                  <td className="py-3 px-4">
                    <JobStatusChip status={job.status} />
                  </td>
                  <td className="py-3 px-4 text-text-secondary">
                    {job.driverName || <span className="text-text-muted italic">Unassigned</span>}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-text-secondary">
                    {job.deliveredAt ? formatTime(job.deliveredAt) : job.eta}
                  </td>
                  <td className="py-3 px-4 font-serif text-ink text-right font-normal tabular-nums text-sm">
                    ${job.price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="p-4 border-t border-border bg-surface-sunken/40 flex items-center justify-between text-xs text-text-muted">
          <span>
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredJobs.length)} of {filteredJobs.length} consignments
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              icon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Prev
            </Button>
            <span className="font-mono text-xs px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              iconRight={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* 5-Tab Detail Drawer */}
      <Drawer
        isOpen={!!selectedJob}
        onClose={() => setSelectedJobId(null)}
        title={selectedJob ? `${selectedJob.id} Details` : ''}
        badge={selectedJob && <JobStatusChip status={selectedJob.status} />}
        width="w-full md:w-[540px]"
      >
        {selectedJob && (
          <div className="space-y-6 text-xs font-sans">
            {/* Drawer Tabs */}
            <Tabs
              activeTab={drawerTab}
              onChange={(t) => setDrawerTab(t as any)}
              tabs={[
                { id: 'overview', label: 'Overview' },
                { id: 'timeline', label: 'Timeline' },
                { id: 'pricing', label: 'Pricing' },
                { id: 'pod', label: 'POD' },
                { id: 'comms', label: 'Comms' },
              ]}
            />

            {/* TAB 1: OVERVIEW */}
            {drawerTab === 'overview' && (
              <div className="space-y-5 animate-in fade-in">
                {/* Consignor / Consignee */}
                <div className="space-y-3">
                  <div className="p-3.5 bg-surface rounded border border-border">
                    <span className="text-[11px] font-mono uppercase text-text-muted block mb-1">
                      Consignor (Sender)
                    </span>
                    <strong className="text-ink font-semibold block">{selectedJob.customerName}</strong>
                    <span className="text-text-secondary block mt-0.5">{selectedJob.fromAddress}</span>
                    <span className="text-text-muted text-[11px] block mt-1">
                      Phone: {selectedJob.customerPhone} · Email: {selectedJob.customerEmail}
                    </span>
                  </div>

                  <div className="p-3.5 bg-surface rounded border border-border">
                    <span className="text-[11px] font-mono uppercase text-text-muted block mb-1">
                      Consignee (Recipient)
                    </span>
                    <strong className="text-ink font-semibold block">{selectedJob.toSuburb} Destination</strong>
                    <span className="text-text-secondary block mt-0.5">{selectedJob.toAddress}</span>
                  </div>
                </div>

                {/* Parcel Specs */}
                <div className="p-3.5 bg-surface-sunken rounded border border-border/70 space-y-2">
                  <span className="font-semibold text-ink block">Consignment Parcel Specs</span>
                  <p className="text-text-secondary">{selectedJob.parcel.description}</p>
                  <div className="flex flex-wrap gap-3 text-text-muted font-mono text-[11px]">
                    <span>Weight: {selectedJob.parcel.weightKg} kg</span>
                    <span>·</span>
                    <span>Dimensions: {selectedJob.parcel.dimensions}</span>
                    <span>·</span>
                    <span>Fragile: {selectedJob.parcel.isFragile ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                {/* Assigned Courier & Reassignment Workflow */}
                <div className="p-4 bg-surface rounded border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">Assigned Courier</span>
                    <span className="font-mono text-text-muted">Depot: {selectedJob.depot}</span>
                  </div>
                  <div className="flex items-center justify-between text-text-secondary">
                    <span>Current: <strong className="text-ink">{selectedJob.driverName || 'None'}</strong></span>
                    <span>ETA: {selectedJob.eta}</span>
                  </div>

                  {/* Reassign select */}
                  <div className="pt-2 border-t border-border/60">
                    <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1.5">
                      Reassign to another driver
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={reassignDriverId}
                        onChange={(e) => setReassignDriverId(e.target.value)}
                        className="flex-1 bg-surface-elevated border border-border-strong rounded p-2 text-xs text-ink focus:outline-none"
                      >
                        <option value="">Select available courier...</option>
                        {drivers.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.depot} · {d.status} · {d.completedToday} completed)
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!reassignDriverId}
                        isLoading={reassigning}
                        onClick={handleReassign}
                      >
                        Reassign
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TIMELINE */}
            {drawerTab === 'timeline' && (
              <div className="space-y-4 animate-in fade-in">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary block">
                  Consignment Event Log
                </span>
                <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-border">
                  {selectedJob.timeline.map((ev, idx) => (
                    <div key={ev.id || idx} className="relative">
                      <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface" />
                      <div className="flex items-baseline justify-between">
                        <strong className="text-ink font-semibold">{ev.label}</strong>
                        <span className="font-mono text-[10px] text-text-muted">
                          {formatDateTime(ev.timestamp)}
                        </span>
                      </div>
                      <span className="text-[11px] text-text-muted block mt-0.5">
                        Actor: {ev.actor}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PRICING */}
            {drawerTab === 'pricing' && (
              <div className="space-y-4 animate-in fade-in relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Pricing Breakdown & Applied Rules
                  </span>
                  <FindingPin findingId="F-004" label="F-004 Overlapping Rules" />
                </div>

                <div className="space-y-2 border border-border rounded p-4 bg-surface">
                  {selectedJob.pricingBreakdown && selectedJob.pricingBreakdown.length > 0 ? (
                    selectedJob.pricingBreakdown.map((line, idx) => (
                      <div key={idx} className="flex justify-between py-1 border-b border-border/40 last:border-b-0">
                        <div>
                          <span className="font-mono text-[10px] text-text-muted bg-surface-sunken px-1 rounded mr-1.5">
                            {line.ruleId}
                          </span>
                          <span className="text-ink font-medium">{line.name}</span>
                        </div>
                        <span className="font-mono text-ink font-medium">
                          ${line.amount.toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-text-muted">
                      Standard pricing schedule applied: ${selectedJob.price.toFixed(2)} AUD.
                    </div>
                  )}

                  <div className="pt-3 border-t border-border flex justify-between font-semibold text-ink text-sm">
                    <span>Total Invoiced</span>
                    <span className="font-serif text-lg">${selectedJob.price.toFixed(2)} AUD</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: POD */}
            {drawerTab === 'pod' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Proof of Delivery Artifacts
                  </span>
                  <FindingPin findingId="F-012" label="Base64 Image Storage" />
                </div>

                {selectedJob.pod ? (
                  <div className="bg-surface rounded border border-border p-4 space-y-4">
                    <div>
                      <span className="text-[11px] font-semibold text-text-secondary block mb-1">
                        Captured Recipient Signature:
                      </span>
                      <div className="w-full h-24 bg-surface-sunken rounded border border-border flex items-center justify-center p-3">
                        {selectedJob.pod.signatureDataUrl ? (
                          <img
                            src={selectedJob.pod.signatureDataUrl}
                            alt="Recipient signature"
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : selectedJob.pod.signatureSvgPath ? (
                          <svg className="w-full h-full" viewBox="0 0 300 90" fill="none">
                            <path
                              d={selectedJob.pod.signatureSvgPath}
                              stroke="#1D2421"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <span className="font-serif italic text-lg text-ink">
                            {selectedJob.pod.recipientName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Recipient Name:</span>
                        <strong className="text-ink">{selectedJob.pod.recipientName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Delivered Timestamp:</span>
                        <span className="font-mono">{selectedJob.pod.timestamp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Geotag Coordinates:</span>
                        <span className="font-mono text-text-secondary text-[11px]">
                          {selectedJob.pod.geotag}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center bg-surface-sunken rounded border border-border text-text-muted">
                    No POD submitted yet. Consignment status: {selectedJob.status}.
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: COMMS */}
            {drawerTab === 'comms' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Customer Communications Log
                  </span>
                  <FindingPin findingId="F-013" label="Outbox Pattern" />
                </div>

                {selectedJob.notifications.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedJob.notifications.map((msg) => (
                      <div key={msg.id} className="p-3 bg-surface rounded border border-border space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-semibold text-primary">
                            {msg.channel} · {msg.event}
                          </span>
                          <span className="font-mono text-text-muted text-[10px]">{msg.sentAt}</span>
                        </div>
                        <p className="text-text-secondary leading-snug">{msg.preview}</p>
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => handleResendComms(msg.id)}
                            className="text-[11px] font-medium text-text-muted hover:text-ink flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Resend</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-text-muted">
                    No outbound messages recorded for this consignment.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
