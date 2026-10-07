'use client';

import React, { useState, useMemo } from 'react';
import { useDemoStore } from '../../../store/useDemoStore';
import { Finding, FindingSeverity, FindingArea } from '../../../mocks/findings';
import { SeverityChip } from '../../../components/ui/StatusChip';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { FindingPin } from '../../../components/audit/FindingPin';
import {
  ListFilter,
  Grid,
  Search,
  Download,
  FileText,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

export default function FindingsPage() {
  const {
    findings,
    activeFindingId,
    setActiveFindingId,
    setAuditLensActive,
    updateFindingMilestone,
    addToast,
  } = useDemoStore();

  const [viewMode, setViewMode] = useState<'table' | 'matrix'>('table');
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [milestoneFilter, setMilestoneFilter] = useState<string>('all');
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Filtered findings list
  const filteredFindings = useMemo(() => {
    return findings.filter((f) => {
      if (severityFilter !== 'all' && f.severity !== severityFilter) return false;
      if (areaFilter !== 'all' && f.area !== areaFilter) return false;
      if (milestoneFilter !== 'all' && f.milestone !== milestoneFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          f.id.toLowerCase().includes(q) ||
          f.title.toLowerCase().includes(q) ||
          f.area.toLowerCase().includes(q) ||
          f.impact.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [findings, severityFilter, areaFilter, milestoneFilter, search]);

  function handleOpenFinding(id: string) {
    setAuditLensActive(true);
    setActiveFindingId(id);
  }

  function handleExportReport() {
    setReportModalOpen(true);
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
            Prioritised Technical Debt & Vulnerability Log
          </span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-0.5">
            Audit Findings Register ({filteredFindings.length} of {findings.length})
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-surface-sunken p-0.5 rounded border border-border">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-xs text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-surface-elevated text-primary font-semibold shadow-sm'
                  : 'text-text-secondary hover:text-ink'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-2.5 py-1 rounded-xs text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'matrix'
                  ? 'bg-surface-elevated text-accent font-semibold shadow-sm'
                  : 'text-text-secondary hover:text-ink'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>2×2 Matrix</span>
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportReport}
            icon={<FileText className="w-3.5 h-3.5" />}
          >
            Export Written Report
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-surface rounded-md border border-border p-4 shadow-1 space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-1">
            <input
              type="text"
              placeholder="Search findings, code, impact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-elevated border border-border-strong rounded py-2 pl-8 pr-3 text-xs text-ink focus:outline-none focus:border-primary"
            />
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Severity filter */}
          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-surface-elevated border border-border-strong rounded p-2 text-xs focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Area filter */}
          <div>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full bg-surface-elevated border border-border-strong rounded p-2 text-xs focus:outline-none"
            >
              <option value="all">All Technical Areas</option>
              <option value="Security">Security</option>
              <option value="Pricing">Pricing</option>
              <option value="Data Integrity">Data Integrity</option>
              <option value="Integrations">Integrations</option>
              <option value="Proof of Delivery">Proof of Delivery</option>
              <option value="Notifications">Notifications</option>
              <option value="Complexity">Complexity</option>
              <option value="Payload CMS">Payload CMS</option>
              <option value="Testing">Testing</option>
              <option value="Observability">Observability</option>
            </select>
          </div>

          {/* Milestone filter */}
          <div>
            <select
              value={milestoneFilter}
              onChange={(e) => setMilestoneFilter(e.target.value)}
              className="w-full bg-surface-elevated border border-border-strong rounded p-2 text-xs focus:outline-none"
            >
              <option value="all">All Milestones</option>
              <option value="M0">M0 · Audit & Setup</option>
              <option value="M1">M1 · Stabilise</option>
              <option value="M2">M2 · Complete Workflows</option>
              <option value="M3">M3 · Harden & Handover</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW 1: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-surface rounded-md border border-border overflow-hidden shadow-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-sunken border-b border-border text-[11px] font-mono uppercase text-text-muted">
                  <th className="py-3 px-4 font-semibold">ID</th>
                  <th className="py-3 px-4 font-semibold">Severity</th>
                  <th className="py-3 px-4 font-semibold">Area</th>
                  <th className="py-3 px-4 font-semibold">Finding Title & Observed Issue</th>
                  <th className="py-3 px-4 font-semibold">Effort</th>
                  <th className="py-3 px-4 font-semibold">Change Risk</th>
                  <th className="py-3 px-4 font-semibold">Target Milestone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredFindings.map((finding) => (
                  <tr
                    key={finding.id}
                    onClick={() => handleOpenFinding(finding.id)}
                    className="hover:bg-primary-tint/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-accent">
                      {finding.id}
                    </td>
                    <td className="py-3 px-4">
                      <SeverityChip severity={finding.severity} />
                    </td>
                    <td className="py-3 px-4 text-text-secondary font-medium">
                      {finding.area}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-ink font-semibold block">{finding.title}</strong>
                      <span className="text-[11px] text-text-muted font-mono block mt-0.5 line-clamp-1">
                        {finding.evidence}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-center">
                      <span className="px-1.5 py-0.5 rounded bg-surface-sunken text-text-secondary">
                        {finding.effort}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-text-secondary">
                      {finding.riskOfChange}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-primary">
                      {finding.milestone}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: 2×2 IMPACT vs EFFORT MATRIX VIEW */}
      {viewMode === 'matrix' && (
        <div className="bg-surface-elevated rounded-md border border-border p-6 shadow-2 space-y-4">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-ink">
                Prioritisation Matrix (Business Impact vs Engineering Effort)
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Click any dot to inspect findings. Items in the top-left quadrant represent urgent fixes for Milestone 1.
              </p>
            </div>
            <span className="text-[11px] font-mono text-text-muted">
              {filteredFindings.length} plotted
            </span>
          </div>

          {/* 2×2 Visual Grid */}
          <div className="relative aspect-[16/9] max-h-[500px] w-full bg-surface rounded-lg border-2 border-border p-8 select-none">
            {/* Axis Lines */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-border-strong border-dashed" />
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-border-strong border-dashed" />

            {/* Quadrant Labels */}
            <div className="absolute top-3 left-4 text-[11px] font-mono uppercase text-error font-semibold">
              Fix First (High Impact · Low/Med Effort)
            </div>
            <div className="absolute top-3 right-4 text-[11px] font-mono uppercase text-primary font-semibold text-right">
              Strategic Plan (High Impact · High Effort)
            </div>
            <div className="absolute bottom-3 left-4 text-[11px] font-mono uppercase text-success font-semibold">
              Quick Wins (Low Impact · Low Effort)
            </div>
            <div className="absolute bottom-3 right-4 text-[11px] font-mono uppercase text-text-muted font-semibold text-right">
              Defer / Backlog (Low Impact · High Effort)
            </div>

            {/* Plotted Finding Dots */}
            {filteredFindings.map((finding) => {
              // Map score 1-10 to percentage
              const leftPct = (finding.matrixPosition.effortScore / 10) * 88 + 6;
              const topPct = 94 - (finding.matrixPosition.impactScore / 10) * 88;

              const colors = {
                Critical: 'bg-error text-surface-elevated ring-error/30',
                High: 'bg-accent text-surface-elevated ring-accent/30',
                Medium: 'bg-warning text-surface-elevated ring-warning/30',
                Low: 'bg-text-muted text-surface-elevated ring-text-muted/30',
              };

              return (
                <button
                  key={finding.id}
                  onClick={() => handleOpenFinding(finding.id)}
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ring-2 shadow-sm hover:scale-125 transition-transform z-10 cursor-pointer ${
                    colors[finding.severity]
                  }`}
                  title={`${finding.id}: ${finding.title}`}
                >
                  {finding.id}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sample Formal Report Modal (PDF Preview) */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Technical Takeover & Repository Audit Report"
        subtitle="Confidential evaluation prepared for Platform Owner"
        maxWidth="max-w-2xl"
      >
        <div className="p-6 bg-surface border border-border rounded-md font-sans text-xs space-y-5 text-ink leading-relaxed">
          {/* Formal PDF Header */}
          <div className="border-b border-border pb-4 flex items-center justify-between">
            <div>
              <span className="font-serif text-xl font-normal text-ink block">
                Meridian Couriers Logistics Platform
              </span>
              <span className="font-mono text-[11px] text-text-muted">
                Document Ref: AGY-TA-2026-01 · Version 1.0 (Final)
              </span>
            </div>
            <span className="text-[11px] font-mono bg-primary-tint text-primary px-2 py-1 rounded">
              Confidential Review
            </span>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-1">1. Executive Summary</h4>
            <p className="text-text-secondary leading-relaxed">
              This report details the technical assessment conducted on the production Next.js, Payload CMS, and PostgreSQL code repository. The core architecture is fundamentally viable for commercial scaling. A phased takeover schedule is prioritised to remediate 6 high-severity vulnerabilities before introducing new features.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-1">2. Recommended High-Priority Actions</h4>
            <ul className="list-disc pl-5 space-y-1 text-text-secondary">
              <li>Immediate rotation of client-exposed Stripe secret keys (Finding F-001).</li>
              <li>Consolidation of 24–26km distance tier overlaps in pricing engine (Finding F-004).</li>
              <li>Connection pooling configuration on PostgreSQL to prevent 500 webhooks (Finding F-002).</li>
              <li>Implementation of transactional guarantees around customer booking insertions (Finding F-007).</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-1">3. Delivery Milestone Allocation</h4>
            <p className="text-text-secondary leading-relaxed">
              Milestone M0 (Week 1, read-only setup) → Milestone M1 (Weeks 2–3, core stabilisation) → Milestone M2 (Weeks 4–6, workflow completion) → Milestone M3 (Weeks 7–8, regression testing and handover).
            </p>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setReportModalOpen(false);
                addToast({
                  type: 'success',
                  title: 'Formal PDF Downloaded',
                  message: 'Generated comprehensive 14-page platform takeover audit PDF report.',
                });
              }}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Download Complete Audit PDF
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
