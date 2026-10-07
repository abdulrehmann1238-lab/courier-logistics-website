'use client';

import React, { useState } from 'react';
import { useDemoStore } from '../../../store/useDemoStore';
import { Milestone } from '../../../mocks/milestones';
import { FindingPin } from '../../../components/audit/FindingPin';
import { Button } from '../../../components/ui/Button';
import {
  Calendar,
  CheckCircle2,
  ShieldAlert,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
} from 'lucide-react';

export default function RoadmapPage() {
  const { milestones, findings, setActiveFindingId, setAuditLensActive } = useDemoStore();

  const [expandedMilestone, setExpandedMilestone] = useState<string>('M1');

  // Calculate live capacity days dynamically based on findings in store
  const milestoneCapacities = milestones.map((m) => {
    const allocatedFindings = findings.filter((f) => f.milestone === m.id);
    const effortDays = allocatedFindings.reduce((sum, f) => {
      const days = f.effort === 'S' ? 0.75 : f.effort === 'M' ? 1.5 : 3.0;
      return sum + days;
    }, 0);

    const totalDays = Math.max(m.baseCapacityDays, Math.round(m.baseCapacityDays + effortDays * 0.5));
    return {
      ...m,
      allocatedFindings,
      totalEstimatedDays: totalDays,
    };
  });

  const totalProjectDays = milestoneCapacities.reduce(
    (sum, m) => sum + m.totalEstimatedDays,
    0
  );

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
            Controlled Phased Takeover
          </span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-0.5">
            Milestone Roadmap & Capacity Model
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Structured delivery preventing large uncontrolled changes. Total estimated duration: {totalProjectDays} working days (~7–8 weeks).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <FindingPin findingId="F-020" label="README & Onboarding" />
          <FindingPin findingId="F-021" label="Staging Parity" />
        </div>
      </div>

      {/* Change-Control Rule Banner */}
      <div className="p-4 rounded-md bg-[#1D2522] border border-[#2E3C37] text-on-dark flex items-start sm:items-center gap-3 text-xs shadow-1">
        <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5 sm:mt-0" />
        <div className="space-y-0.5">
          <strong className="text-on-dark font-semibold block">
            Strict Takeover Change-Control Protocol:
          </strong>
          <span className="text-text-muted">
            "No change ships to production without: a written issue description, an automated test or reproduction verification step, and an immediate rollback plan."
          </span>
        </div>
      </div>

      {/* Horizontal Milestone Timeline Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {milestoneCapacities.map((m) => {
          const isSelected = expandedMilestone === m.id;
          return (
            <div
              key={m.id}
              onClick={() => setExpandedMilestone(m.id)}
              className={`p-4 rounded-md border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-surface-elevated border-primary shadow-2 ring-1 ring-primary/20'
                  : 'bg-surface border-border hover:border-border-strong'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-semibold text-primary">{m.id}</span>
                <span className="text-[10px] font-mono text-text-muted">{m.duration}</span>
              </div>
              <h4 className="font-sans font-semibold text-sm text-ink leading-tight">
                {m.name.split(',')[0]}
              </h4>
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/60 text-xs text-text-muted">
                <span>{m.allocatedFindings.length} findings</span>
                <strong className="font-mono text-ink">{m.totalEstimatedDays} days</strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Accordion for Selected Milestone */}
      <div className="space-y-4">
        {milestoneCapacities.map((m) => {
          const isExpanded = expandedMilestone === m.id;

          return (
            <div
              key={m.id}
              className="bg-surface rounded-md border border-border overflow-hidden shadow-1 transition-all"
            >
              <div
                onClick={() => setExpandedMilestone(isExpanded ? '' : m.id)}
                className="p-5 flex items-center justify-between cursor-pointer bg-surface-elevated hover:bg-surface-sunken/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-sm bg-primary-tint text-primary font-mono text-xs font-semibold flex items-center justify-center shrink-0">
                    {m.id}
                  </span>
                  <div>
                    <h3 className="font-sans text-base font-semibold text-ink">
                      {m.code} — {m.name}
                    </h3>
                    <span className="text-xs text-text-muted font-mono">{m.timing} · Risk Level: {m.riskLevel}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-ink bg-surface-sunken px-2.5 py-1 rounded">
                    {m.totalEstimatedDays} capacity days
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-6 border-t border-border/60 space-y-6 text-xs bg-surface animate-in fade-in">
                  {/* Goal Statement */}
                  <div>
                    <span className="font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                      Milestone Mission Goal
                    </span>
                    <p className="text-ink leading-relaxed text-sm bg-surface-elevated p-3 rounded border border-border">
                      {m.goal}
                    </p>
                  </div>

                  {/* Allocated Findings */}
                  <div>
                    <span className="font-semibold text-text-secondary uppercase tracking-wider block mb-2">
                      Allocated Audit Findings ({m.allocatedFindings.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {m.allocatedFindings.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => {
                            setAuditLensActive(true);
                            setActiveFindingId(f.id);
                          }}
                          className="px-2.5 py-1 rounded bg-surface-elevated hover:bg-accent hover:text-surface-elevated border border-border text-xs font-mono transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="font-semibold text-accent">{f.id}</span>
                          <span className="truncate max-w-[200px]">{f.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Two Columns: Acceptance Criteria & What Will NOT Change */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="bg-surface-elevated p-4 rounded border border-border space-y-2">
                      <span className="font-semibold text-primary uppercase tracking-wider text-[11px] block">
                        Strict Acceptance Criteria (Exit Gates)
                      </span>
                      <ul className="space-y-1.5 text-text-secondary">
                        {m.acceptanceCriteria.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-surface-sunken/60 p-4 rounded border border-border space-y-2">
                      <span className="font-semibold text-text-muted uppercase tracking-wider text-[11px] block">
                        What Will NOT Change (Regression Safety)
                      </span>
                      <ul className="space-y-1.5 text-text-secondary">
                        {m.whatWillNotChange.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-text-muted shrink-0 mt-1.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Concrete Deliverables */}
                  <div>
                    <span className="font-semibold text-text-secondary uppercase tracking-wider block mb-2">
                      Concrete Client Deliverables
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {m.deliverables.map((d, idx) => (
                        <div key={idx} className="p-2.5 bg-surface-elevated rounded border border-border flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="text-ink">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
