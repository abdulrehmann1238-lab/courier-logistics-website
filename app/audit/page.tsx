'use client';

import React from 'react';
import Link from 'next/link';
import { useDemoStore } from '../../store/useDemoStore';
import { Button } from '../../components/ui/Button';
import { SeverityChip } from '../../components/ui/StatusChip';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  GitMerge,
  ListFilter,
  Milestone as MilestoneIcon,
  CheckCircle,
  FileText,
} from 'lucide-react';

export default function AuditOverviewPage() {
  const { findings, setActiveFindingId, setAuditLensActive } = useDemoStore();

  const criticalCount = findings.filter((f) => f.severity === 'Critical').length;
  const highCount = findings.filter((f) => f.severity === 'High').length;
  const mediumCount = findings.filter((f) => f.severity === 'Medium').length;

  const topPriorities = findings
    .filter((f) => f.severity === 'Critical' || f.severity === 'High')
    .slice(0, 5);

  const scorecards = [
    { area: 'Security & Secrets', score: 2, max: 5, status: 'At Risk', note: 'Exposed Stripe keys and missing webhook HMAC verification require immediate rotation.' },
    { area: 'Data Integrity', score: 3, max: 5, status: 'Moderate', note: 'PostgreSQL connection exhaustion and lack of multi-row booking transactions.' },
    { area: 'Pricing Correctness', score: 2, max: 5, status: 'At Risk', note: '24-26km distance tier overlaps (F-004) and floating-point cent roundoff inconsistencies.' },
    { area: 'Third-Party Integrations', score: 3, max: 5, status: 'Moderate', note: 'Google Maps geocoding and Twilio SMS calls lack timeout fallback and backoff retry.' },
    { area: 'Maintainability & DX', score: 3, max: 5, status: 'Moderate', note: '840 lines duplicate pricing logic and lack of staging branch protection.' },
    { area: 'Observability & Testing', score: 1, max: 5, status: 'Critical', note: 'Zero automated unit tests on dispatch logic and no structured Sentry error tracing.' },
  ];

  return (
    <div className="space-y-10 font-sans">
      {/* Page Heading & Honesty Statement */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-sunken border border-border text-[11px] font-mono text-text-muted mb-2">
          <span>Illustrative Sample Findings</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal leading-tight">
          Platform Review: Sample Output
        </h1>
        <p className="text-text-secondary text-sm max-w-2xl mt-2 leading-relaxed">
          Illustrative findings for a fictional courier platform. Your real takeover audit begins with a read-only review of your GitHub repository, mapping the exact data flows and identifying production risks before making any changes.
        </p>
      </div>

      {/* Strategic Verdict Card */}
      <div className="bg-surface-elevated rounded-lg border border-border p-6 sm:p-8 shadow-2 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-success" />
            <h3 className="text-lg font-semibold text-ink">
              Executive Verdict: Viable to Stabilise
            </h3>
          </div>
          <span className="font-mono text-xs text-text-muted bg-surface-sunken px-2.5 py-1 rounded">
            Estimated M1–M3 Timeline: 6–8 Weeks
          </span>
        </div>

        <p className="text-ink leading-relaxed text-sm">
          The core Next.js and PostgreSQL architecture is viable and does not warrant an expensive or high-risk ground-up rewrite. Production stability can be achieved by executing a disciplined stabilisation milestone (M1) focusing on credential security and pricing consolidation, followed by completing the offline proof of delivery and transactional outbox patterns (M2).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3 bg-surface rounded border border-border">
            <span className="text-[11px] font-mono uppercase text-text-muted block">
              High / Critical Risks
            </span>
            <span className="font-serif text-2xl text-accent font-normal mt-0.5 block">
              {criticalCount + highCount} Issues
            </span>
            <span className="text-[11px] text-text-secondary">Prioritised into Milestone 1</span>
          </div>

          <div className="p-3 bg-surface rounded border border-border">
            <span className="text-[11px] font-mono uppercase text-text-muted block">
              Technical Debt & Refactors
            </span>
            <span className="font-serif text-2xl text-primary font-normal mt-0.5 block">
              {mediumCount} Findings
            </span>
            <span className="text-[11px] text-text-secondary">Allocated to Milestones M2–M3</span>
          </div>

          <div className="p-3 bg-surface rounded border border-border">
            <span className="text-[11px] font-mono uppercase text-text-muted block">
              Recommended Protocol
            </span>
            <span className="font-sans text-sm font-semibold text-ink mt-1 block">
              Safe-Change Rollback
            </span>
            <span className="text-[11px] text-text-secondary">Zero direct pushes to production</span>
          </div>
        </div>
      </div>

      {/* 6-Area Architecture Scorecard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl text-ink font-normal">
            Platform Health Scorecard
          </h3>
          <span className="text-xs font-mono text-text-muted">6 Core Evaluation Dimensions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scorecards.map((card) => (
            <div
              key={card.area}
              className="bg-surface rounded-md border border-border p-5 space-y-3 shadow-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink">{card.area}</span>
                <span
                  className={`font-mono text-[11px] px-2 py-0.5 rounded ${
                    card.status === 'Critical'
                      ? 'bg-error-tint text-error font-semibold'
                      : card.status === 'At Risk'
                      ? 'bg-warning-tint text-warning font-semibold'
                      : 'bg-primary-tint text-primary'
                  }`}
                >
                  {card.status}
                </span>
              </div>

              {/* 5-Segment Bar */}
              <div className="flex items-center gap-1.5 h-2">
                {[1, 2, 3, 4, 5].map((seg) => (
                  <div
                    key={seg}
                    className={`flex-1 h-full rounded-xs transition-colors ${
                      seg <= card.score
                        ? card.score <= 2
                          ? 'bg-accent'
                          : card.score <= 3
                          ? 'bg-warning'
                          : 'bg-primary'
                        : 'bg-surface-sunken'
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">{card.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top 5 Urgent Priorities */}
      <div className="bg-surface rounded-md border border-border p-6 shadow-1 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold text-ink">
              Top 5 High-Priority Fixes Recommended for Week 1–2
            </h3>
          </div>
          <Link href="/audit/findings" className="text-xs text-primary hover:underline font-medium">
            View all 24 findings →
          </Link>
        </div>

        <div className="divide-y divide-border/60">
          {topPriorities.map((finding) => (
            <div
              key={finding.id}
              onClick={() => {
                setAuditLensActive(true);
                setActiveFindingId(finding.id);
              }}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer hover:bg-surface-sunken/60 p-2 rounded transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-primary">{finding.id}</span>
                  <SeverityChip severity={finding.severity} />
                  <span className="text-text-muted">· {finding.area}</span>
                </div>
                <strong className="text-ink font-semibold block">{finding.title}</strong>
                <p className="text-text-secondary text-[11px] leading-snug line-clamp-1">
                  {finding.impact}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-text-muted font-mono text-[11px]">
                <span>Effort: {finding.effort}</span>
                <span>Risk: {finding.riskOfChange}</span>
                <span className="text-primary font-semibold">Inspect ↗</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links across Audit Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
        <Link
          href="/audit/architecture"
          className="p-4 bg-surface rounded border border-border hover:border-border-strong hover:shadow-1 transition-all flex flex-col justify-between"
        >
          <div>
            <GitMerge className="w-5 h-5 text-primary mb-2" />
            <h4 className="font-semibold text-sm text-ink">System Architecture Map</h4>
            <p className="text-xs text-text-muted mt-1 leading-snug">
              Interactive SVG map covering Next.js, Postgres, Payload, and APIs.
            </p>
          </div>
          <span className="text-xs text-primary font-medium mt-4 flex items-center gap-1">
            <span>Explore Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/audit/findings"
          className="p-4 bg-surface rounded border border-border hover:border-border-strong hover:shadow-1 transition-all flex flex-col justify-between"
        >
          <div>
            <ListFilter className="w-5 h-5 text-accent mb-2" />
            <h4 className="font-semibold text-sm text-ink">24 Findings Register</h4>
            <p className="text-xs text-text-muted mt-1 leading-snug">
              Filterable table and 2×2 Impact vs Effort matrix view.
            </p>
          </div>
          <span className="text-xs text-accent font-medium mt-4 flex items-center gap-1">
            <span>Open Register</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/audit/roadmap"
          className="p-4 bg-surface rounded border border-border hover:border-border-strong hover:shadow-1 transition-all flex flex-col justify-between"
        >
          <div>
            <MilestoneIcon className="w-5 h-5 text-secondary mb-2" />
            <h4 className="font-semibold text-sm text-ink">Milestone Roadmap (M0–M3)</h4>
            <p className="text-xs text-text-muted mt-1 leading-snug">
              Clear scope, acceptance criteria, and what will NOT change.
            </p>
          </div>
          <span className="text-xs text-secondary font-medium mt-4 flex items-center gap-1">
            <span>View Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/audit/protocol"
          className="p-4 bg-surface rounded border border-border hover:border-border-strong hover:shadow-1 transition-all flex flex-col justify-between"
        >
          <div>
            <CheckCircle className="w-5 h-5 text-primary mb-2" />
            <h4 className="font-semibold text-sm text-ink">Safe Deploy Protocol</h4>
            <p className="text-xs text-text-muted mt-1 leading-snug">
              Animated deployment player with simulated 42s staging rollback.
            </p>
          </div>
          <span className="text-xs text-primary font-medium mt-4 flex items-center gap-1">
            <span>Play Protocol</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
