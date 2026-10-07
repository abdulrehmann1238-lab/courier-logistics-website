'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemoStore } from '../../../store/useDemoStore';
import { Job, JobException } from '../../../mocks/jobs';
import { SeverityChip } from '../../../components/ui/StatusChip';
import { Button } from '../../../components/ui/Button';
import { FindingPin } from '../../../components/audit/FindingPin';
import {
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  RotateCcw,
  Calendar,
  Send,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';

export default function ExceptionsPage() {
  const { jobs, resolveException, addToast } = useDemoStore();

  const [activeTab, setActiveTab] = useState<'open' | 'resolved'>('open');

  const openExceptions = jobs.filter((j) => j.status === 'Exception' && !j.exception?.resolved);
  const resolvedExceptions = jobs.filter((j) => j.exception?.resolved);

  const displayedList = activeTab === 'open' ? openExceptions : resolvedExceptions;

  // Selected Exception Job
  const [selectedJobId, setSelectedJobId] = useState<string>(
    openExceptions[0]?.id || resolvedExceptions[0]?.id || ''
  );

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || displayedList[0];

  // Resolution workflow state
  const [actionChoice, setActionChoice] = useState<string>('Retry delivery today');
  const [resolutionNote, setResolutionNote] = useState<string>(
    'Contacted client directly via phone. Gate code provided for courier retry.'
  );
  const [isResolving, setIsResolving] = useState(false);

  async function handleResolve() {
    if (!selectedJob) return;
    setIsResolving(true);
    await resolveException(selectedJob.id, actionChoice, resolutionNote);
    setIsResolving(false);
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent">
            Incident Management & SLA Protection
          </span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-0.5">
            Exceptions Resolution Desk
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <FindingPin findingId="F-011" label="SMS Exception Handlers" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-medium">
        <button
          onClick={() => {
            setActiveTab('open');
            if (openExceptions.length > 0) setSelectedJobId(openExceptions[0].id);
          }}
          className={`px-3 py-1.5 rounded-sm transition-colors ${
            activeTab === 'open'
              ? 'bg-error-tint text-error font-semibold'
              : 'text-text-secondary hover:bg-surface-sunken'
          }`}
        >
          <span>Open Incidents ({openExceptions.length})</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('resolved');
            if (resolvedExceptions.length > 0) setSelectedJobId(resolvedExceptions[0].id);
          }}
          className={`px-3 py-1.5 rounded-sm transition-colors ${
            activeTab === 'resolved'
              ? 'bg-success-tint text-success font-semibold'
              : 'text-text-secondary hover:bg-surface-sunken'
          }`}
        >
          <span>Resolved History ({resolvedExceptions.length})</span>
        </button>
      </div>

      {/* Two-Pane Layout: List (5 cols) & Resolution Detail (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 cols: Incident List */}
        <div className="lg:col-span-5 bg-surface rounded-md border border-border overflow-hidden shadow-1">
          <div className="p-4 border-b border-border/60 bg-surface-sunken/40 flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">
              {activeTab === 'open' ? 'Pending Actions' : 'Resolved Incidents'}
            </span>
            <span className="font-mono text-[11px] text-text-muted">
              {displayedList.length} items
            </span>
          </div>

          {displayedList.length === 0 ? (
            <div className="py-16 text-center text-xs text-text-muted space-y-2">
              <CheckCircle2 className="w-8 h-8 text-success mx-auto" />
              <strong className="text-ink block">All Clear</strong>
              <p>No {activeTab} exceptions in queue.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {displayedList.map((job) => {
                const isSelected = selectedJob?.id === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`p-4 cursor-pointer transition-colors text-xs space-y-1.5 ${
                      isSelected
                        ? 'bg-primary-tint/40 border-l-2 border-primary'
                        : 'hover:bg-surface-sunken'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-primary">{job.id}</span>
                      <SeverityChip severity={job.exception?.severity || 'Medium'} />
                    </div>
                    <strong className="text-ink block">{job.customerName}</strong>
                    <p className="text-text-secondary line-clamp-2 text-[11px]">
                      {job.exception?.reason}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-text-muted pt-1">
                      <span>{job.depot} Depot</span>
                      <span className="font-mono">{job.exception?.timestamp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 7 cols: Incident Details & Guided Resolution */}
        <div className="lg:col-span-7 bg-surface-elevated rounded-md border border-border p-6 shadow-2 space-y-6">
          {!selectedJob ? (
            <div className="py-20 text-center text-text-muted text-xs">
              Select an incident from the queue to view evidence and guide resolution.
            </div>
          ) : (
            <>
              {/* Header Title */}
              <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-primary">
                      {selectedJob.id}
                    </span>
                    <SeverityChip severity={selectedJob.exception?.severity || 'Medium'} />
                    <span className="text-xs text-text-muted">· {selectedJob.depot} Hub</span>
                  </div>
                  <h3 className="text-base font-semibold text-ink mt-1">
                    {selectedJob.exception?.reason}
                  </h3>
                </div>
                <Link href={`/track/${selectedJob.id}`}>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View Tracking ↗
                  </Button>
                </Link>
              </div>

              {/* Evidence & Field Observation */}
              <div className="space-y-3 text-xs">
                <span className="font-semibold text-text-secondary uppercase tracking-wider text-[11px] block">
                  Field Courier Observation
                </span>
                <div className="p-3.5 bg-surface-sunken rounded border border-border/80 font-mono text-[11px] leading-relaxed text-text-secondary">
                  {selectedJob.exception?.evidenceNotes}
                </div>
              </div>

              {/* Client & Consignment Context */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-surface rounded border border-border">
                  <span className="text-text-muted text-[11px] block mb-1">Customer Contact</span>
                  <strong className="text-ink block">{selectedJob.customerName}</strong>
                  <span className="text-text-secondary block mt-0.5">{selectedJob.customerPhone}</span>
                  <span className="text-text-secondary block">{selectedJob.customerEmail}</span>
                </div>
                <div className="p-3 bg-surface rounded border border-border">
                  <span className="text-text-muted text-[11px] block mb-1">Delivery Address</span>
                  <strong className="text-ink block">{selectedJob.toSuburb} Destination</strong>
                  <span className="text-text-secondary block mt-0.5">{selectedJob.toAddress}</span>
                </div>
              </div>

              {/* Resolution Workflow (if open) */}
              {!selectedJob.exception?.resolved ? (
                <div className="pt-4 border-t border-border space-y-4">
                  <span className="font-semibold text-ink text-xs uppercase tracking-wider block">
                    Guided Ops Resolution Workflow
                  </span>

                  {/* Radio Action Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'Retry delivery today', label: '1. Re-attempt drop today' },
                      { id: 'Reschedule next day', label: '2. Reschedule next day' },
                      { id: 'Return to depot staging', label: '3. Return to depot' },
                      { id: 'Direct customer contact', label: '4. Hold for client collection' },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`p-3 rounded border flex items-center gap-2.5 cursor-pointer transition-colors ${
                          actionChoice === opt.id
                            ? 'bg-primary-tint border-primary font-medium text-ink'
                            : 'bg-surface border-border hover:bg-surface-sunken'
                        }`}
                      >
                        <input
                          type="radio"
                          name="resolutionAction"
                          checked={actionChoice === opt.id}
                          onChange={() => setActionChoice(opt.id)}
                          className="accent-primary"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Message / Resolution Note Composer */}
                  <div>
                    <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                      Resolution Action Log & Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      placeholder="Enter resolution notes and instructions for courier..."
                      className="w-full bg-surface-elevated border border-border-strong rounded p-2.5 text-xs text-ink focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      variant="primary"
                      isLoading={isResolving}
                      onClick={handleResolve}
                      icon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Resolve Exception & Dispatch
                    </Button>
                  </div>
                </div>
              ) : (
                /* Already Resolved state */
                <div className="p-4 rounded bg-success-tint/40 border border-success/30 text-xs space-y-2">
                  <span className="font-semibold text-success flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Incident Resolved
                  </span>
                  <p className="text-text-secondary">
                    {selectedJob.exception.resolution || 'Resolution logged successfully.'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
