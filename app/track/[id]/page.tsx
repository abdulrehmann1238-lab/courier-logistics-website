'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useDemoStore } from '../../../store/useDemoStore';
import { JobStatusChip } from '../../../components/ui/StatusChip';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { formatTime, formatDateTime } from '../../../lib/format';
import { FindingPin } from '../../../components/audit/FindingPin';
import {
  Search,
  MapPin,
  Clock,
  Package,
  User,
  ShieldCheck,
  Download,
  AlertTriangle,
  Calendar,
  MessageSquare,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || 'MRD-481920';

  const { jobs, addToast } = useDemoStore();
  const [searchInput, setSearchInput] = useState(id);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('Tomorrow 10:00 - 14:00');

  const currentJob = jobs.find((j) => j.id.toLowerCase() === id.toLowerCase());

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchInput.trim()) return;
    router.push(`/track/${searchInput.trim()}`);
  }

  function handleDownloadPdf() {
    addToast({
      type: 'success',
      title: 'Proof of Delivery PDF Generated',
      message: `Downloaded consignment receipt for ${currentJob?.id}. (Simulated PDF download)`,
    });
  }

  function handleRescheduleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRescheduleModalOpen(false);
    addToast({
      type: 'info',
      title: 'Delivery Rescheduled',
      message: `Consignment ${currentJob?.id} set for ${rescheduleDate}. Dispatch informed.`,
    });
  }

  return (
    <div className="max-w-[1240px] mx-auto px-6 py-10 font-sans">
      {/* Search Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent">
            Consignment Tracking & Proof of Delivery
          </span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-0.5">
            {currentJob ? currentJob.id : 'Track Consignment'}
          </h1>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter MRD-48xxxx"
              className="bg-surface-elevated text-ink text-xs font-mono rounded-sm border border-border-strong px-3 py-2 pl-8 focus:outline-none focus:border-primary w-48 sm:w-56"
            />
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Lookup
          </Button>
        </form>
      </div>

      {/* Unknown ID Empty State */}
      {!currentJob ? (
        <div className="bg-surface rounded-lg border border-border p-12 text-center max-w-lg mx-auto space-y-4">
          <Package className="w-10 h-10 text-text-muted mx-auto" />
          <h3 className="font-serif text-2xl text-ink font-normal">
            Consignment not found
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            We couldn't locate tracking record for "{id}". Try searching for one of our active seeded jobs:
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {['MRD-481920', 'MRD-481921', 'MRD-481905', 'MRD-481911', 'MRD-481899'].map((sId) => (
              <button
                key={sId}
                onClick={() => router.push(`/track/${sId}`)}
                className="px-2.5 py-1 rounded bg-surface-sunken hover:bg-primary-tint hover:text-primary text-xs font-mono transition-colors"
              >
                {sId}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Exception Alert Banner (if applicable) */}
          {currentJob.status === 'Exception' && (
            <div className="p-4 rounded-md bg-warning-tint border border-warning/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink font-semibold block">
                    Action Required: Delivery Interruption
                  </strong>
                  <p className="text-text-secondary mt-0.5">
                    {currentJob.exception?.reason || 'Recipient unavailable or address query.'}
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setRescheduleModalOpen(true)}
              >
                Reschedule Delivery Window
              </Button>
            </div>
          )}

          {/* Top Status & Route Summary Banner */}
          <div className="bg-surface rounded-md border border-border p-6 shadow-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <JobStatusChip status={currentJob.status} />
                <span className="text-xs text-text-muted font-mono">
                  {currentJob.service.toUpperCase()} Service
                </span>
                <FindingPin findingId="F-012" label="POD Signature Storage" />
              </div>
              <div className="text-xs text-text-secondary flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>ETA: <strong className="text-ink">{currentJob.eta}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-text-muted block text-[11px]">Collection Origin</span>
                  <strong className="text-ink block">{currentJob.fromSuburb}</strong>
                  <span className="text-text-secondary">{currentJob.fromAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="text-text-muted block text-[11px]">Final Destination</span>
                  <strong className="text-ink block">{currentJob.toSuburb}</strong>
                  <span className="text-text-secondary">{currentJob.toAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Split: Timeline (Left) & POD / Driver Details (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Vertical Progress Timeline */}
            <div className="lg:col-span-7 bg-surface rounded-md border border-border p-6 shadow-1 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5 border-b border-border/60 pb-3">
                <Clock className="w-3.5 h-3.5 text-primary" />
                Chain of Custody Timeline
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-border">
                {currentJob.timeline.map((event, idx) => (
                  <div key={event.id || idx} className="relative text-xs">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface" />
                    <div className="flex items-baseline justify-between gap-2">
                      <strong className="text-ink font-semibold">{event.label}</strong>
                      <span className="text-[11px] font-mono text-text-muted shrink-0">
                        {formatDateTime(event.timestamp)}
                      </span>
                    </div>
                    <span className="text-[11px] text-text-muted block mt-0.5">
                      Actor: {event.actor}
                    </span>
                    {event.note && (
                      <p className="mt-1 p-2 bg-surface-sunken rounded text-[11px] text-text-secondary font-mono">
                        {event.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 cols: POD & Assigned Courier */}
            <div className="lg:col-span-5 space-y-6">
              {/* Proof of Delivery Card (If Delivered) */}
              {currentJob.pod && (
                <div className="bg-surface-elevated rounded-md border border-border p-5 shadow-2 space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-1.5 text-success font-semibold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Signed Proof of Delivery</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDownloadPdf}
                      icon={<Download className="w-3.5 h-3.5" />}
                    >
                      PDF
                    </Button>
                  </div>

                  {/* Render Signature */}
                  <div>
                    <span className="text-[11px] font-semibold text-text-secondary block mb-1">
                      Recipient Signature:
                    </span>
                    <div className="w-full h-24 bg-surface-sunken rounded border border-border flex items-center justify-center p-3">
                      {currentJob.pod.signatureDataUrl ? (
                        <img
                          src={currentJob.pod.signatureDataUrl}
                          alt="Recipient signature"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : currentJob.pod.signatureSvgPath ? (
                        <svg className="w-full h-full" viewBox="0 0 300 90" fill="none">
                          <path
                            d={currentJob.pod.signatureSvgPath}
                            stroke="#1D2421"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <span className="font-serif italic text-lg text-ink">
                          {currentJob.pod.recipientName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Signed By:</span>
                      <strong className="text-ink">{currentJob.pod.recipientName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Recorded Time:</span>
                      <span className="text-ink font-mono">{currentJob.pod.timestamp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Geotag:</span>
                      <span className="text-[11px] font-mono text-text-secondary">
                        {currentJob.pod.geotag}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Courier Vehicle Card */}
              <div className="bg-surface rounded-md border border-border p-5 space-y-3 shadow-1 text-xs">
                <h4 className="font-semibold text-ink flex items-center gap-1.5 border-b border-border/60 pb-2">
                  <User className="w-3.5 h-3.5 text-primary" />
                  Assigned Courier
                </h4>
                {currentJob.driverName ? (
                  <div className="space-y-1 text-text-secondary">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Courier:</span>
                      <strong className="text-ink">{currentJob.driverName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Fleet Unit:</span>
                      <span>Toyota HiAce (LWB)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Depot Hub:</span>
                      <span>{currentJob.depot} Operations</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-text-muted italic">
                    Courier allocation in progress at {currentJob.depot} dispatch.
                  </p>
                )}
              </div>

              {/* Notification History */}
              <div className="bg-surface rounded-md border border-border p-5 space-y-3 shadow-1 text-xs">
                <h4 className="font-semibold text-ink flex items-center gap-1.5 border-b border-border/60 pb-2">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  Outbound Notification Log
                </h4>
                {currentJob.notifications.length > 0 ? (
                  <div className="space-y-2">
                    {currentJob.notifications.map((n) => (
                      <div key={n.id} className="p-2.5 bg-surface-sunken rounded text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-text-muted">
                          <span className="font-mono font-medium text-primary">
                            {n.channel} · {n.event}
                          </span>
                          <span className="font-mono">{n.sentAt}</span>
                        </div>
                        <p className="text-text-secondary leading-snug">{n.preview}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-muted italic">No notifications dispatched yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      <Modal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        title="Reschedule Consignment Delivery"
        subtitle={`Select updated delivery window for ${currentJob?.id}`}
      >
        <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-text-secondary mb-1">
              Preferred Delivery Window
            </label>
            <select
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              className="w-full bg-surface-elevated border border-border-strong rounded-sm p-2 text-xs text-ink focus:outline-none"
            >
              <option value="Tomorrow 09:00 - 12:00">Tomorrow Morning (09:00 - 12:00 AEST)</option>
              <option value="Tomorrow 13:00 - 17:00">Tomorrow Afternoon (13:00 - 17:00 AEST)</option>
              <option value="Next Business Day 09:00 - 17:00">Next Business Day Priority</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-text-secondary mb-1">
              Updated Access Instructions for Driver
            </label>
            <input
              type="text"
              placeholder="e.g. Leave with reception or ring code 1402"
              className="w-full bg-surface-elevated border border-border-strong rounded-sm p-2 text-xs text-ink focus:outline-none"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Confirm Rescheduled Window
          </Button>
        </form>
      </Modal>
    </div>
  );
}
