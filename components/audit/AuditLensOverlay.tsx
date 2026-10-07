'use client';

import React from 'react';
import Link from 'next/link';
import { useDemoStore } from '../../store/useDemoStore';
import { Drawer } from '../ui/Drawer';
import { SeverityChip } from '../ui/StatusChip';
import {
  Eye,
  ShieldAlert,
  Code,
  CheckCircle2,
  Undo2,
  Calendar,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export function AuditLensOverlay() {
  const {
    auditLensActive,
    toggleAuditLens,
    activeFindingId,
    setActiveFindingId,
    findings,
    updateFindingMilestone,
  } = useDemoStore();

  const activeFinding = findings.find((f) => f.id === activeFindingId);

  return (
    <>
      {/* Floating Pill bottom-left */}
      <div className="fixed bottom-6 left-6 z-lens flex items-center gap-2">
        <button
          onClick={toggleAuditLens}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full shadow-2 border text-xs font-medium transition-all ${
            auditLensActive
              ? 'bg-accent text-surface-elevated border-accent shadow-accent/20'
              : 'bg-surface-elevated/95 text-ink border-border hover:bg-surface-elevated'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Audit Lens {auditLensActive ? 'Active' : 'Off'}</span>
          <span
            className={`w-2 h-2 rounded-full ${
              auditLensActive ? 'bg-surface-elevated animate-pulse' : 'bg-text-muted'
            }`}
          />
        </button>

        {auditLensActive && (
          <Link
            href="/audit"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-surface-elevated/95 border border-border text-xs font-medium text-ink hover:text-accent shadow-1 transition-colors"
          >
            <span>Full Audit Hub</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* Finding Inspector Drawer */}
      <Drawer
        isOpen={!!activeFinding}
        onClose={() => setActiveFindingId(null)}
        title={activeFinding ? `${activeFinding.id} · ${activeFinding.area}` : ''}
        badge={
          activeFinding && <SeverityChip severity={activeFinding.severity} />
        }
      >
        {activeFinding && (
          <div className="space-y-6 text-xs font-sans">
            {/* Title & Metadata Strip */}
            <div>
              <h4 className="text-base font-semibold text-ink leading-snug">
                {activeFinding.title}
              </h4>
              <div className="flex flex-wrap items-center gap-3 mt-2.5 text-text-muted">
                <span className="font-mono">Effort: {activeFinding.effort}</span>
                <span>·</span>
                <span>Change Risk: {activeFinding.riskOfChange}</span>
                <span>·</span>
                <span>Owner: {activeFinding.owner}</span>
              </div>
            </div>

            {/* Evidence Block */}
            <div>
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Code className="w-3.5 h-3.5 text-text-muted" />
                Observed Evidence
              </span>
              <pre className="p-3 bg-[#1D2522] text-[#EDE9E0] font-mono text-[11px] rounded-sm overflow-x-auto border border-border-strong whitespace-pre-wrap leading-relaxed">
                {activeFinding.evidence}
              </pre>
            </div>

            {/* Business Impact */}
            <div>
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                Operational & Business Impact
              </span>
              <p className="text-ink leading-relaxed bg-surface p-3 rounded-sm border border-border">
                {activeFinding.impact}
              </p>
            </div>

            {/* Recommended Fix */}
            <div>
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                Proposed Remediation
              </span>
              <p className="text-ink leading-relaxed bg-primary-tint/30 p-3 rounded-sm border border-primary/20">
                {activeFinding.recommendedFix}
              </p>
            </div>

            {/* Verification / Test Plan */}
            <div>
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                Verification & Regression Test Plan
              </span>
              <p className="text-text-secondary leading-relaxed bg-surface p-3 rounded-sm border border-border">
                {activeFinding.verificationPlan}
              </p>
            </div>

            {/* Rollback Plan */}
            <div>
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Undo2 className="w-3.5 h-3.5 text-accent" />
                Safe Rollback Strategy
              </span>
              <p className="text-text-secondary leading-relaxed bg-surface p-3 rounded-sm border border-border">
                {activeFinding.rollbackPlan}
              </p>
            </div>

            {/* Milestone Allocation */}
            <div className="pt-2 border-t border-border">
              <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                Roadmap Milestone Target
              </label>
              <select
                value={activeFinding.milestone}
                onChange={(e) =>
                  updateFindingMilestone(activeFinding.id, e.target.value as any)
                }
                className="w-full bg-surface-elevated text-ink text-xs rounded-sm border border-border-strong p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="M0">M0 · Read-Only Audit & Baseline Setup</option>
                <option value="M1">M1 · Stabilise Production & Fix Vulnerabilities</option>
                <option value="M2">M2 · Complete Incomplete Operational Workflows</option>
                <option value="M3">M3 · Harden, Automated Tests & Handover</option>
              </select>
              <p className="text-[11px] text-text-muted mt-1.5">
                Altering milestone allocation updates the capacity plan and live roadmap in the Audit section.
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
