'use client';

import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { FindingPin } from '../../../components/audit/FindingPin';
import {
  Compass,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  FileText,
  ChevronDown,
  ChevronUp,
  FolderLock,
  ExternalLink,
} from 'lucide-react';

interface PhaseItem {
  id: number;
  title: string;
  tagline: string;
  whatIDo: string;
  whatIDeliver: string;
  whatINeedFromYou: string;
}

const PHASES: PhaseItem[] = [
  {
    id: 1,
    title: 'Phase 1 · Orient & Baseline (Read-Only)',
    tagline: 'Zero changes made to live code. Establish truth on local clone.',
    whatIDo: 'Clone the repository to an isolated local dev environment. Seed local PostgreSQL instance with test jobs. Verify how the application boots and catalogue all environment variables and secrets.',
    whatIDeliver: 'Local reproducible docker-compose environment, sanitized .env.example, and setup checklist confirming frontend, backend, and DB status.',
    whatINeedFromYou: 'Read-only GitHub repo access and schema read permissions on a staging or sanitized replica database.',
  },
  {
    id: 2,
    title: 'Phase 2 · Trace the Money & the Proof',
    tagline: 'Map core commercial transactions and customer accountability.',
    whatIDo: 'Trace the two most critical revenue and liability paths in your business: (1) The Money Path: Instant Quote → Booking → Stripe Payment → Xero/MYOB Invoice; (2) The Proof Path: Driver POD Canvas → Geotag → S3 Storage → SMS/Email Notification.',
    whatIDeliver: 'Data-flow diagram highlighting where money or proof can be dropped or desynchronised due to network blips or unhandled edge cases.',
    whatINeedFromYou: 'Clarification on your intended commercial rate rules (e.g. distance bands, fuel levy schedules, pallet surcharges).',
  },
  {
    id: 3,
    title: 'Phase 3 · Verify Production Guardrails',
    tagline: 'Check secrets hygiene, backup recovery, and staging parity.',
    whatIDo: 'Inspect public client JavaScript bundles for leaked service credentials. Confirm database backup schedules and point-in-time recovery capabilities. Audit Vercel and staging branch isolation.',
    whatIDeliver: 'Security and infrastructure health scorecard with immediate risk ratings.',
    whatINeedFromYou: 'Overview of current hosting and cloud provider access (Vercel, AWS/Cloudflare, Supabase/RDS).',
  },
  {
    id: 4,
    title: 'Phase 4 · Prioritise & Align Fix Schedule',
    tagline: 'Written, plain-language recommended fixes before touching code.',
    whatIDo: 'Consolidate all observed vulnerabilities, partial features, and technical debt into a structured findings register. Rank each item by business impact, risk of change, and required effort.',
    whatIDeliver: 'A comprehensive written fix list grouped into Milestones M0–M3 with cost and capacity estimates.',
    whatINeedFromYou: '30-minute alignment call to review priorities and approve Milestone 1 scope.',
  },
  {
    id: 5,
    title: 'Phase 5 · Execute First High-Priority Group (M1)',
    tagline: 'Safe, tested production stabilisation with rollback plans.',
    whatIDo: 'Execute Milestone 1 changes on isolated feature branches. Deploy to staging, verify test matrices, and schedule production releases during off-peak operational windows with verified rollbacks.',
    whatIDeliver: 'Remediated production code, automated regression test harness, and signed-off change reports for each deploy.',
    whatINeedFromYou: 'Review and sign-off on staging previews.',
  },
  {
    id: 6,
    title: 'Phase 6 · Hardening, Runbooks & Handover',
    tagline: 'Leave the codebase documented and maintainable for your team.',
    whatIDo: 'Implement end-to-end smoke tests, document recovery runbooks, clean up obsolete packages and dead code, and record video walkthroughs of every operational workflow.',
    whatIDeliver: 'Complete System Runbook (architecture docs, disaster recovery steps, developer onboarding guide) and clean codebase sign-off.',
    whatINeedFromYou: 'Final milestone review and acceptance confirmation.',
  },
];

export default function ApproachPage() {
  const [expandedPhase, setExpandedPhase] = useState<number>(1);

  return (
    <div className="space-y-10 font-sans">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
          Bid Methodology & Takeover Experience
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal mt-1 leading-tight">
          How I Audit & Stabilise an Unfamiliar Codebase
        </h1>
        <p className="text-text-secondary text-sm max-w-2xl mt-2 leading-relaxed">
          My disciplined 6-phase approach designed to protect live production courier operations while methodically uncovering defects and eliminating technical debt.
        </p>
      </div>

      {/* 6 Phases Accordion */}
      <div className="space-y-3">
        {PHASES.map((p) => {
          const isExpanded = expandedPhase === p.id;
          return (
            <div
              key={p.id}
              className="bg-surface rounded-md border border-border overflow-hidden shadow-1 transition-all"
            >
              <div
                onClick={() => setExpandedPhase(isExpanded ? 0 : p.id)}
                className="p-5 flex items-center justify-between cursor-pointer bg-surface-elevated hover:bg-surface-sunken/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary-tint text-primary font-mono text-xs font-semibold flex items-center justify-center shrink-0">
                    {p.id}
                  </span>
                  <div>
                    <h3 className="font-sans text-sm sm:text-base font-semibold text-ink">
                      {p.title}
                    </h3>
                    <span className="text-xs text-text-muted">{p.tagline}</span>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                )}
              </div>

              {isExpanded && (
                <div className="p-6 border-t border-border/60 bg-surface text-xs space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3.5 bg-surface-elevated rounded border border-border space-y-1">
                      <strong className="text-ink font-semibold block text-[11px] uppercase tracking-wider">
                        What I Do:
                      </strong>
                      <p className="text-text-secondary leading-relaxed">{p.whatIDo}</p>
                    </div>

                    <div className="p-3.5 bg-primary-tint/30 rounded border border-primary/20 space-y-1">
                      <strong className="text-primary font-semibold block text-[11px] uppercase tracking-wider">
                        What I Deliver:
                      </strong>
                      <p className="text-text-secondary leading-relaxed">{p.whatIDeliver}</p>
                    </div>

                    <div className="p-3.5 bg-surface-sunken rounded border border-border space-y-1">
                      <strong className="text-text-muted font-semibold block text-[11px] uppercase tracking-wider">
                        What I Need From You:
                      </strong>
                      <p className="text-text-secondary leading-relaxed">{p.whatINeedFromYou}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Case Studies Section */}
      <div className="pt-6 border-t border-border space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-warning-tint text-warning font-mono text-[10px] uppercase font-semibold mb-1">
            [PLACEHOLDER — replace with your real case studies before sending]
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
            Past Codebase Takeover Case Studies
          </h2>
          <p className="text-xs text-text-secondary max-w-xl mt-1">
            Real-world examples of inherited production systems stabilized without breaking ongoing operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Case Study 1 */}
          <div className="bg-surface rounded-md border border-border p-5 shadow-1 space-y-3 text-xs">
            <span className="font-mono text-[10px] text-text-muted uppercase">
              B2B Cold-Chain Logistics Platform (Melbourne)
            </span>
            <h4 className="font-semibold text-sm text-ink">
              Next.js + Supabase Fleet Dispatch Rescue
            </h4>
            <div className="space-y-1 text-text-secondary leading-relaxed">
              <p>
                <strong>Situation:</strong> Inherited a 65% complete temperature-monitored courier app where deliveries frequently failed to sync when drivers lost 4G reception in basement carparks.
              </p>
              <p>
                <strong>What was found:</strong> Supabase table mutations lacked client-side queuing, causing unhandled Promise rejections and lost proof of delivery signatures.
              </p>
              <p>
                <strong>What changed:</strong> Implemented IndexedDB offline outbox pattern with automatic reconnect sync; wrapped dispatch mutations in idempotent transactions.
              </p>
              <p className="text-primary font-medium pt-1">
                <strong>Outcome:</strong> 100% of offline drops synced reliably; platform handed over on schedule without a single lost delivery.
              </p>
            </div>
          </div>

          {/* Case Study 2 */}
          <div className="bg-surface rounded-md border border-border p-5 shadow-1 space-y-3 text-xs">
            <span className="font-mono text-[10px] text-text-muted uppercase">
              On-Demand Freight Courier (Sydney)
            </span>
            <h4 className="font-semibold text-sm text-ink">
              Multi-Tier Dynamic Pricing Consolidation
            </h4>
            <div className="space-y-1 text-text-secondary leading-relaxed">
              <p>
                <strong>Situation:</strong> Inherited legacy quoting system where clients complained rates fluctuated by up to $14 for the exact same trip.
              </p>
              <p>
                <strong>What was found:</strong> 4 overlapping distance-band algorithms were running concurrently across Next.js API routes and mobile app frontend.
              </p>
              <p>
                <strong>What changed:</strong> Refactored calculation into a single tested pure TypeScript module with 45 unit tests covering edge-case distance boundaries.
              </p>
              <p className="text-primary font-medium pt-1">
                <strong>Outcome:</strong> Quote discrepancies dropped to zero; customer booking conversion increased by 18%.
              </p>
            </div>
          </div>

          {/* Case Study 3 */}
          <div className="bg-surface rounded-md border border-border p-5 shadow-1 space-y-3 text-xs">
            <span className="font-mono text-[10px] text-text-muted uppercase">
              Regional Express Linehaul (Brisbane)
            </span>
            <h4 className="font-semibold text-sm text-ink">
              PostgreSQL Deadlock Remediation & Sentry Telemetry
            </h4>
            <div className="space-y-1 text-text-secondary leading-relaxed">
              <p>
                <strong>Situation:</strong> Production database ground to a halt every morning at 8:00am when 40+ couriers simultaneously accepted assigned manifests.
              </p>
              <p>
                <strong>What was found:</strong> Unindexed SQL table scans combined with connection pool exhaustion on serverless lambdas.
              </p>
              <p>
                <strong>What changed:</strong> Configured PgBouncer connection pooling, added composite B-tree indexes, and set up real-time Sentry and BetterStack monitoring.
              </p>
              <p className="text-primary font-medium pt-1">
                <strong>Outcome:</strong> 95th percentile database latency dropped from 3,400ms to 42ms; morning peak handled with zero downtime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
