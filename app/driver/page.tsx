'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemoStore } from '../../store/useDemoStore';
import { Job, JobStatus } from '../../mocks/jobs';
import { JobStatusChip } from '../../components/ui/StatusChip';
import { Button } from '../../components/ui/Button';
import { SignaturePad } from '../../components/driver/SignaturePad';
import { formatTime } from '../../lib/format';
import { FindingPin } from '../../components/audit/FindingPin';
import {
  Truck,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  WifiOff,
  Navigation,
  Clock,
  Package,
} from 'lucide-react';

export default function DriverAppPage() {
  const {
    jobs,
    drivers,
    advanceJobStatus,
    submitPOD,
    reportDriverFailure,
    offlineMode,
    offlineQueue,
    addToast,
  } = useDemoStore();

  // Active driver is Callum Ng (D-101) by default
  const driver = drivers.find((d) => d.id === 'D-101') || drivers[0];

  // View state: 'list' | 'detail' | 'pod' | 'failure' | 'success'
  const [view, setView] = useState<'list' | 'detail' | 'pod' | 'failure' | 'success'>('detail');

  // Active selected job (defaults to MRD-481920)
  const [activeJobId, setActiveJobId] = useState<string>('MRD-481920');
  const activeJob = jobs.find((j) => j.id === activeJobId) || jobs[0];

  // Shift status
  const [onShift, setOnShift] = useState(true);

  // POD Form State
  const [signatureData, setSignatureData] = useState<string>('');
  const [typedSignName, setTypedSignName] = useState<string>('');
  const [recipientNameInput, setRecipientNameInput] = useState('A. Whitlock');
  const [photoTaken, setPhotoTaken] = useState(false);
  const [isSubmittingPOD, setIsSubmittingPOD] = useState(false);

  // Failure Form State
  const [failureReason, setFailureReason] = useState('Recipient unavailable / No answer at intercom');
  const [failureNotes, setFailureNotes] = useState('Rang intercom unit 3 times over 6 minutes. Card left in slot.');
  const [isReportingFailure, setIsReportingFailure] = useState(false);

  // Stepper helper
  async function handleAdvanceStatus() {
    if (!activeJob) return;

    if (activeJob.status === 'Accepted') {
      await advanceJobStatus(activeJob.id, 'Picked up');
    } else if (activeJob.status === 'Picked up') {
      await advanceJobStatus(activeJob.id, 'In transit');
    } else if (activeJob.status === 'In transit') {
      setView('pod');
    }
  }

  // Submit Proof of Delivery
  async function handleCompleteDelivery() {
    if (!activeJob) return;
    if (!signatureData && !typedSignName) {
      addToast({
        type: 'warning',
        title: 'Signature Required',
        message: 'Please have the recipient draw or type their signature.',
      });
      return;
    }

    setIsSubmittingPOD(true);
    await new Promise((r) => setTimeout(r, 800));

    await submitPOD(activeJob.id, {
      signatureDataUrl: signatureData || undefined,
      recipientName: recipientNameInput || typedSignName || 'Authorized Recipient',
      timestamp: `Today at ${formatTime(new Date().toISOString())} AEST`,
      addressText: activeJob.toAddress,
      geotag: 'Lat -37.8182 · Lng 144.9521 (Accuracy 3m)',
    });

    setIsSubmittingPOD(false);
    setView('success');
  }

  // Submit Failure
  async function handleSubmitFailure() {
    if (!activeJob) return;
    setIsReportingFailure(true);
    await reportDriverFailure(activeJob.id, failureReason, failureNotes);
    setIsReportingFailure(false);
    setView('list');
  }

  return (
    <div className="min-h-screen bg-bg py-6 sm:py-12 px-4 flex flex-col items-center justify-center font-sans">
      {/* Top Device Context Notice */}
      <div className="mb-4 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
          Mobile Field Worker Terminal · {offlineMode ? 'Offline Sync Mode' : 'Connected'}
        </span>
        <div className="flex items-center justify-center gap-2 mt-1">
          <FindingPin findingId="F-011" label="SMS Exception Handlers" />
          <FindingPin findingId="F-012" label="POD Object Storage" />
        </div>
      </div>

      {/* 390×844 Mobile Device Frame */}
      <div className="w-full max-w-[390px] h-[780px] bg-surface-elevated rounded-[28px] border-[6px] border-[#2E3C37] shadow-3 overflow-hidden flex flex-col relative select-none">
        {/* Device Notch & Speaker Bar */}
        <div className="h-6 bg-surface-sunken/80 flex items-center justify-between px-6 text-[10px] font-mono text-text-muted shrink-0 border-b border-border/40">
          <span>09:41</span>
          <div className="w-20 h-3 bg-border-strong rounded-full mx-auto" />
          <div className="flex items-center gap-1">
            {offlineMode && <WifiOff className="w-2.5 h-2.5 text-warning" />}
            <span>5G</span>
          </div>
        </div>

        {/* Driver Top Header */}
        <div className="bg-surface p-4 border-b border-border flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] font-mono text-text-muted block">
              {driver.name} ({driver.id})
            </span>
            <span className="text-xs font-semibold text-ink block">
              {driver.vehicle}
            </span>
          </div>

          {/* Shift Toggle */}
          <button
            onClick={() => setOnShift(!onShift)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
              onShift
                ? 'bg-success-tint text-success border border-success/30'
                : 'bg-warning-tint text-warning border border-warning/30'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>{onShift ? 'On Shift' : 'On Break'}</span>
          </button>
        </div>

        {/* Offline Banner indicator */}
        {offlineMode && (
          <div className="bg-warning-tint text-[#8A6715] px-4 py-1.5 text-[11px] font-medium flex items-center justify-between shrink-0 border-b border-warning/30">
            <span className="flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline: Queued changes sync on reconnect</span>
            </span>
            <span className="font-mono text-[10px]">({offlineQueue.length})</span>
          </div>
        )}

        {/* MAIN BODY SWITCHER */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* VIEW 1: JOB LIST */}
          {view === 'list' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Today's Run Manifest ({jobs.filter((j) => j.status !== 'Delivered').length})
                </h4>
                <span className="text-[11px] text-text-muted font-mono">
                  {driver.completedToday} completed
                </span>
              </div>

              <div className="space-y-2.5">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => {
                      setActiveJobId(job.id);
                      setView('detail');
                    }}
                    className={`p-3.5 rounded-md border text-xs cursor-pointer transition-all space-y-2 ${
                      job.id === activeJobId
                        ? 'bg-primary-tint/30 border-primary shadow-sm'
                        : 'bg-surface border-border hover:border-border-strong'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-primary">{job.id}</span>
                      <JobStatusChip status={job.status} />
                    </div>
                    <strong className="text-ink block truncate">{job.customerName}</strong>
                    <div className="text-[11px] text-text-secondary flex justify-between">
                      <span>→ {job.toSuburb}</span>
                      <span className="font-mono text-text-muted">{job.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 2: JOB DETAIL & STATUS PROGRESSION */}
          {view === 'detail' && activeJob && (
            <div className="space-y-4 animate-in fade-in">
              {/* Back to list & Job ID */}
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <button
                  onClick={() => setView('list')}
                  className="text-text-secondary hover:text-ink text-xs flex items-center gap-1 font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Run Manifest</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-semibold text-xs text-primary">
                    {activeJob.id}
                  </span>
                  <JobStatusChip status={activeJob.status} />
                </div>
              </div>

              {/* Destination Address Highlight Card */}
              <div className="bg-surface p-4 rounded-md border border-border space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-accent" /> Destination Delivery Stop
                </span>
                <strong className="text-sm font-semibold text-ink block leading-snug">
                  {activeJob.toAddress}
                </strong>
                <span className="text-xs text-text-secondary block">
                  Consignee: {activeJob.customerName}
                </span>

                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`tel:${activeJob.customerPhone}`}
                    className="flex-1 py-2 px-3 rounded bg-surface-elevated border border-border hover:bg-surface-sunken text-xs font-medium text-ink flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>Call Recipient</span>
                  </a>
                  <button
                    onClick={() =>
                      addToast({
                        type: 'info',
                        title: 'Navigation Launched',
                        message: `Simulated turn-by-turn navigation route to ${activeJob.toSuburb}.`,
                      })
                    }
                    className="py-2 px-3 rounded bg-surface-elevated border border-border hover:bg-surface-sunken text-xs font-medium text-ink flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5 text-accent" />
                    <span>Route</span>
                  </button>
                </div>
              </div>

              {/* Parcel Specs */}
              <div className="p-3 bg-surface-sunken rounded border border-border/70 space-y-1 text-xs">
                <span className="font-semibold text-ink block">Consignment Information</span>
                <p className="text-text-secondary text-[11px] leading-snug">
                  {activeJob.parcel.description}
                </p>
                <div className="flex justify-between text-[10px] text-text-muted font-mono pt-1">
                  <span>Weight: {activeJob.parcel.weightKg} kg</span>
                  <span>{activeJob.parcel.isFragile ? '⚠ Fragile' : 'Standard'}</span>
                  <span>Sig: {activeJob.parcel.signatureRequired ? 'Required' : 'Optional'}</span>
                </div>
              </div>

              {/* Progress Stepper Visual */}
              <div className="bg-surface p-3.5 rounded border border-border space-y-2 text-xs">
                <span className="font-semibold text-text-secondary block text-[11px] uppercase tracking-wider">
                  Consignment Status Progression
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                  <div
                    className={`p-1.5 rounded ${
                      activeJob.status === 'Accepted' || activeJob.status === 'Picked up' || activeJob.status === 'In transit'
                        ? 'bg-primary-tint text-primary font-semibold'
                        : 'bg-surface-sunken text-text-muted'
                    }`}
                  >
                    1. Picked Up
                  </div>
                  <div
                    className={`p-1.5 rounded ${
                      activeJob.status === 'In transit'
                        ? 'bg-accent text-surface-elevated font-semibold'
                        : activeJob.status === 'Delivered'
                        ? 'bg-primary-tint text-primary'
                        : 'bg-surface-sunken text-text-muted'
                    }`}
                  >
                    2. In Transit
                  </div>
                  <div
                    className={`p-1.5 rounded ${
                      activeJob.status === 'Delivered'
                        ? 'bg-success text-surface-elevated font-semibold'
                        : 'bg-surface-sunken text-text-muted'
                    }`}
                  >
                    3. Delivered
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: POD CAPTURE */}
          {view === 'pod' && activeJob && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <button
                  onClick={() => setView('detail')}
                  className="text-text-secondary hover:text-ink text-xs flex items-center gap-1 font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to details</span>
                </button>
                <span className="font-mono text-xs font-semibold text-primary">
                  POD: {activeJob.id}
                </span>
              </div>

              {/* Recipient Name Input */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientNameInput}
                  onChange={(e) => setRecipientNameInput(e.target.value)}
                  placeholder="Full name of person signing..."
                  className="w-full bg-surface-elevated border border-border-strong rounded p-2.5 text-xs text-ink focus:outline-none focus:border-primary font-medium"
                />
              </div>

              {/* Photo Attachment Tile */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Photo Proof (Parcel at Delivery Location)
                </label>
                <div
                  onClick={() => setPhotoTaken(!photoTaken)}
                  className="border-2 border-dashed border-border-strong rounded-md p-4 text-center cursor-pointer bg-surface hover:bg-surface-sunken transition-colors"
                >
                  {photoTaken ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-success font-medium">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Photo captured (Geotag locked)</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
                      <Camera className="w-4 h-4" />
                      <span>Tap to simulate camera snapshot</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Real HTML5 Canvas Signature Pad */}
              <SignaturePad
                onSignatureCapture={(url, typed) => {
                  setSignatureData(url);
                  if (typed) setTypedSignName(typed);
                }}
              />
            </div>
          )}

          {/* VIEW 4: FAILURE / EXCEPTION REPORT */}
          {view === 'failure' && activeJob && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <button
                  onClick={() => setView('detail')}
                  className="text-text-secondary hover:text-ink text-xs flex items-center gap-1 font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <span className="font-mono text-xs font-semibold text-error">
                  Report Delivery Issue
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Select Exception Reason
                  </label>
                  <select
                    value={failureReason}
                    onChange={(e) => setFailureReason(e.target.value)}
                    className="w-full bg-surface-elevated border border-border-strong rounded p-2 text-xs focus:outline-none"
                  >
                    <option value="Recipient unavailable / No answer at intercom">
                      Recipient unavailable / No answer at intercom
                    </option>
                    <option value="Incorrect or incomplete street address">
                      Incorrect or incomplete street address
                    </option>
                    <option value="Premises closed / Security gate locked">
                      Premises closed / Security gate locked
                    </option>
                    <option value="Damaged consignment box on collection">
                      Damaged consignment box on collection
                    </option>
                    <option value="Courier vehicle mechanical issue">
                      Courier vehicle mechanical issue
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Driver Notes & Incident Details
                  </label>
                  <textarea
                    rows={3}
                    value={failureNotes}
                    onChange={(e) => setFailureNotes(e.target.value)}
                    className="w-full bg-surface-elevated border border-border-strong rounded p-2 text-xs focus:outline-none resize-none"
                  />
                </div>

                <Button
                  variant="danger"
                  className="w-full h-12"
                  isLoading={isReportingFailure}
                  onClick={handleSubmitFailure}
                >
                  Submit Exception to Operations Desk
                </Button>
              </div>
            </div>
          )}

          {/* VIEW 5: SUCCESS CONFIRMATION */}
          {view === 'success' && (
            <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-success-tint text-success flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl text-ink font-normal">
                Delivered & Signed
              </h3>
              <p className="text-xs text-text-secondary max-w-[240px] mx-auto leading-relaxed">
                Proof of Delivery uploaded. Consignment timeline, operations dashboard, and customer tracking updated live.
              </p>

              <div className="pt-4 space-y-2">
                <Button
                  variant="primary"
                  className="w-full h-11"
                  onClick={() => setView('list')}
                >
                  Return to Manifest
                </Button>
                <Link href={`/track/${activeJobId}`}>
                  <Button variant="ghost" className="w-full text-xs">
                    View Public Tracking ↗
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR (Touch targets >= 48px) */}
        {view === 'detail' && activeJob && activeJob.status !== 'Delivered' && (
          <div className="p-3 bg-surface border-t border-border flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              onClick={() => setView('failure')}
              className="h-12 px-3 text-xs text-error border-error/30"
              title="Report inability to deliver"
            >
              Issue
            </Button>

            <Button
              variant={activeJob.status === 'In transit' ? 'accent' : 'primary'}
              onClick={handleAdvanceStatus}
              className="flex-1 h-12 text-xs font-semibold"
            >
              {activeJob.status === 'Accepted' && 'Arrived at Pickup'}
              {activeJob.status === 'Picked up' && 'Start Delivery Run'}
              {activeJob.status === 'In transit' && 'Arrived at Destination → Capture POD'}
            </Button>
          </div>
        )}

        {view === 'pod' && (
          <div className="p-3 bg-surface border-t border-border shrink-0">
            <Button
              variant="accent"
              className="w-full h-12 text-xs font-semibold"
              isLoading={isSubmittingPOD}
              onClick={handleCompleteDelivery}
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              Confirm POD & Notify Customer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
