'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemoStore } from '../../../store/useDemoStore';
import { FindingPin } from '../../../components/audit/FindingPin';
import { Button } from '../../../components/ui/Button';
import {
  Layers,
  Server,
  Database,
  Globe,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
} from 'lucide-react';

interface ArchNode {
  id: string;
  name: string;
  layer: 'hosting' | 'app' | 'data' | 'integrations';
  status: 'healthy' | 'warning' | 'critical';
  purpose: string;
  findings: string[];
  testStatus: string;
  riskOfTouching: 'Low' | 'Medium' | 'High';
  approach: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const NODES: ArchNode[] = [
  {
    id: 'vercel',
    name: 'Vercel Edge & Hosting',
    layer: 'hosting',
    status: 'warning',
    purpose: 'Global CDN edge routing, SSR execution, and serverless compute scaling.',
    findings: ['F-001 (Exposed Secrets in Bundle)', 'F-017 (Serverless Quota Waste)', 'F-021 (Branch Protection Missing)'],
    testStatus: 'No preview branch isolation or branch rules on main.',
    riskOfTouching: 'Low',
    approach: 'Configure GitHub branch protection, rotate client env prefixes, and establish clean staging preview environments.',
    x: 40,
    y: 40,
    w: 220,
    h: 70,
  },
  {
    id: 'nextjs',
    name: 'Next.js App Router & API',
    layer: 'app',
    status: 'warning',
    purpose: 'Core booking portal, ops dashboard, Route Handlers, and customer tracking.',
    findings: ['F-004 (24-26km Rule Overlap)', 'F-015 (Overlapping Status Enums)', 'F-016 (Duplicate Pricing Code)'],
    testStatus: 'Zero unit tests on pricing logic or status transitions.',
    riskOfTouching: 'Medium',
    approach: 'Extract shared pure pricing library; introduce single canonical state machine; add Vitest test harness.',
    x: 320,
    y: 40,
    w: 250,
    h: 70,
  },
  {
    id: 'payload',
    name: 'Payload CMS (Headless)',
    layer: 'app',
    status: 'warning',
    purpose: 'Content management, fuel levy rates, customer directory, and system configs.',
    findings: ['F-006 (Hardcoded Fuel Levy)', 'F-018 (Duplicate Customer Columns)', 'F-019 (Public Unthrottled Admin)'],
    testStatus: 'Manual testing only; missing rate limits on /admin/login.',
    riskOfTouching: 'Medium',
    approach: 'Move fuel levy to CMS global config; enforce Vercel edge IP rate-limits on admin login.',
    x: 630,
    y: 40,
    w: 240,
    h: 70,
  },
  {
    id: 'postgres',
    name: 'PostgreSQL Database',
    layer: 'data',
    status: 'critical',
    purpose: 'Relational data store for jobs, driver manifests, consignment timelines, and invoices.',
    findings: ['F-002 (Connection Pool Exhaustion)', 'F-003 (Unencrypted SSL Missing)', 'F-007 (Missing Multi-Row Transactions)', 'F-012 (Base64 Signatures in Rows)'],
    testStatus: 'No automated migration verification or rollback tests.',
    riskOfTouching: 'High',
    approach: 'Deploy PgBouncer / Prisma connection pooler; wrap bookings in BEGIN/COMMIT transactions; migrate blobs to object storage.',
    x: 180,
    y: 190,
    w: 260,
    h: 75,
  },
  {
    id: 'storage',
    name: 'Object Storage (S3 / R2)',
    layer: 'data',
    status: 'warning',
    purpose: 'Binary storage for recipient signature drawings, drop-off photos, and PDF invoices.',
    findings: ['F-012 (Raw Base64 stored directly in PostgreSQL)'],
    testStatus: 'Direct database text columns currently used instead of CDN URLs.',
    riskOfTouching: 'Low',
    approach: 'Stream POD image uploads to object bucket; persist clean HTTPS signed URLs in Postgres.',
    x: 520,
    y: 190,
    w: 260,
    h: 75,
  },
  {
    id: 'stripe',
    name: 'Stripe Payments API',
    layer: 'integrations',
    status: 'critical',
    purpose: 'Merchant credit card processing and corporate account billing.',
    findings: ['F-001 (Secret Key in Client Prefix)', 'F-010 (Webhook Lacks Cryptographic HMAC Check)'],
    testStatus: 'Tested with test cards; live webhooks unprotected.',
    riskOfTouching: 'Medium',
    approach: 'Rotate live Stripe secret key; implement stripe.webhooks.constructEvent signature validation.',
    x: 40,
    y: 330,
    w: 190,
    h: 70,
  },
  {
    id: 'maps',
    name: 'Google Maps / Geocoding',
    layer: 'integrations',
    status: 'warning',
    purpose: 'Address validation, suburb geocoding, and distance calculations.',
    findings: ['F-009 (Geocode Calls Lack Timeout Fallback)'],
    testStatus: 'No timeout or graceful fallback on API rate limit.',
    riskOfTouching: 'Low',
    approach: 'Wrap geocoding in 2.5s AbortController with automatic fallback to cached suburb-to-depot distance table.',
    x: 260,
    y: 330,
    w: 210,
    h: 70,
  },
  {
    id: 'twilio',
    name: 'Twilio SMS & Resend Email',
    layer: 'integrations',
    status: 'warning',
    purpose: 'Outbound arrival alerts, ETA notifications, and delivery receipt emails.',
    findings: ['F-011 (SMS Failures Break Statuses)', 'F-013 (Inline Sends in Request Handlers)', 'F-014 (Spam Act Compliance)'],
    testStatus: 'Inline synchronous dispatches without retry queue.',
    riskOfTouching: 'Low',
    approach: 'Adopt asynchronous transactional outbox table with automated background retry worker.',
    x: 500,
    y: 330,
    w: 240,
    h: 70,
  },
  {
    id: 'telemetry',
    name: 'Sentry & Telemetry',
    layer: 'integrations',
    status: 'critical',
    purpose: 'Application error capture, uptime monitoring, and structured diagnostic logging.',
    findings: ['F-024 (Zero Structured Logging or Sentry in Prod)'],
    testStatus: 'Raw console.log calls without correlation IDs.',
    riskOfTouching: 'Low',
    approach: 'Integrate Sentry with source maps; configure BetterStack uptime alerting with 24/7 Slack webhooks.',
    x: 770,
    y: 330,
    w: 180,
    h: 70,
  },
];

export default function ArchitecturePage() {
  const { setActiveFindingId, setAuditLensActive } = useDemoStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('postgres');
  const [dataFlowActive, setDataFlowActive] = useState(true);

  const activeNode = NODES.find((n) => n.id === selectedNodeId) || NODES[3];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
            System Topology & Risk Mapping
          </span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-0.5">
            Interactive Architecture Diagram
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Click any component node to inspect identified vulnerabilities, test status, and proposed takeover approach.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDataFlowActive(!dataFlowActive)}
            icon={dataFlowActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          >
            {dataFlowActive ? 'Pause Data Flow' : 'Simulate Data Flow'}
          </Button>
          <FindingPin findingId="F-002" label="PostgreSQL Connections" />
        </div>
      </div>

      {/* Main Container: SVG Diagram (Left) & Node Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Interactive SVG Architecture Canvas */}
        <div className="lg:col-span-8 bg-surface rounded-md border border-border p-4 shadow-1 overflow-x-auto">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-border/60 text-xs">
            <span className="font-semibold text-ink flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span>Full-Stack Component Graph</span>
            </span>
            <div className="flex items-center gap-3 text-[11px] font-mono text-text-muted">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success" /> Healthy
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-warning" /> Warning
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-error" /> Critical
              </span>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="relative min-w-[700px] aspect-[16/10]">
            <svg viewBox="0 0 980 440" className="w-full h-full select-none">
              <defs>
                {/* Arrowhead marker */}
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#C5BEB0" />
                </marker>
              </defs>

              {/* Layer Background Bands */}
              <rect x="20" y="25" width="940" height="100" rx="8" fill="#FBFAF7" stroke="#DDD7CC" strokeDasharray="3 3" />
              <text x="35" y="38" className="text-[10px] font-mono fill-[#7A857F] uppercase tracking-wider">
                Layer 1: Edge, Web Application & CMS
              </text>

              <rect x="20" y="170" width="940" height="110" rx="8" fill="#FBFAF7" stroke="#DDD7CC" strokeDasharray="3 3" />
              <text x="35" y="183" className="text-[10px] font-mono fill-[#7A857F] uppercase tracking-wider">
                Layer 2: Persistent Relational & Object Storage
              </text>

              <rect x="20" y="310" width="940" height="110" rx="8" fill="#FBFAF7" stroke="#DDD7CC" strokeDasharray="3 3" />
              <text x="35" y="323" className="text-[10px] font-mono fill-[#7A857F] uppercase tracking-wider">
                Layer 3: External Integrations & Telemetry
              </text>

              {/* Connection Lines between Nodes */}
              {/* Vercel -> Next.js */}
              <line x1="260" y1="75" x2="320" y2="75" stroke="#C5BEB0" strokeWidth="1.5" markerEnd="url(#arrow)" />
              {/* Next.js -> Payload */}
              <line x1="570" y1="75" x2="630" y2="75" stroke="#C5BEB0" strokeWidth="1.5" markerEnd="url(#arrow)" />
              {/* Next.js -> Postgres */}
              <path d="M 445 110 L 445 150 L 310 150 L 310 190" fill="none" stroke="#C5BEB0" strokeWidth="1.5" markerEnd="url(#arrow)" />
              {/* Next.js -> Storage */}
              <path d="M 445 110 L 445 150 L 650 150 L 650 190" fill="none" stroke="#C5BEB0" strokeWidth="1.5" markerEnd="url(#arrow)" />
              {/* Next.js -> Stripe */}
              <path d="M 370 110 L 370 290 L 135 290 L 135 330" fill="none" stroke="#C5BEB0" strokeWidth="1.5" markerEnd="url(#arrow)" />
              {/* Next.js -> Maps */}
              <path d="M 445 110 L 445 290 L 365 290 L 365 330" fill="none" stroke="#C5BEB0" strokeWidth="1.5" markerEnd="url(#arrow)" />
              {/* Next.js -> Twilio */}
              <path d="M 445 110 L 445 290 L 620 290 L 620 330" fill="none" stroke="#C5BEB0" strokeWidth="1.5" markerEnd="url(#arrow)" />
              {/* Next.js -> Telemetry */}
              <path d="M 445 110 L 445 290 L 860 290 L 860 330" fill="none" stroke="#C5BEB0" strokeWidth="1.5" markerEnd="url(#arrow)" />

              {/* Animated Data Flow Dots along Booking Path */}
              {dataFlowActive && (
                <>
                  <circle r="4" fill="#B4633F">
                    <animateMotion
                      dur="3.5s"
                      repeatCount="indefinite"
                      path="M 260 75 L 445 75 L 445 150 L 310 150 L 310 190"
                    />
                  </circle>
                  <circle r="3.5" fill="#2E4A42">
                    <animateMotion
                      dur="4s"
                      begin="1.5s"
                      repeatCount="indefinite"
                      path="M 310 190 L 445 190 L 445 290 L 620 290 L 620 330"
                    />
                  </circle>
                </>
              )}

              {/* Render Architecture Component Nodes */}
              {NODES.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const statusColors = {
                  healthy: '#3E7A58',
                  warning: '#B78A2B',
                  critical: '#A8453B',
                };

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer group"
                  >
                    {/* Node Card Box */}
                    <rect
                      x={node.x}
                      y={node.y}
                      width={node.w}
                      height={node.h}
                      rx="6"
                      fill={isSelected ? '#FFFFFF' : '#FBFAF7'}
                      stroke={isSelected ? '#2E4A42' : '#DDD7CC'}
                      strokeWidth={isSelected ? '2' : '1'}
                      className="transition-all duration-150 group-hover:stroke-[#2E4A42]"
                    />

                    {/* Left Severity Status Bar Indicator */}
                    <rect
                      x={node.x}
                      y={node.y}
                      width="5"
                      height={node.h}
                      rx="2"
                      fill={statusColors[node.status]}
                    />

                    {/* Node Text Name */}
                    <text
                      x={node.x + 14}
                      y={node.y + 26}
                      className="text-xs font-sans font-semibold fill-[#1D2421]"
                    >
                      {node.name}
                    </text>

                    {/* Secondary Info */}
                    <text
                      x={node.x + 14}
                      y={node.y + 44}
                      className="text-[10px] font-mono fill-[#7A857F]"
                    >
                      {node.findings.length} findings identified
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right 4 cols: Node Detail Inspector */}
        <div className="lg:col-span-4 bg-surface-elevated rounded-md border border-border p-6 shadow-2 space-y-5">
          <div className="border-b border-border pb-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
                Component Inspector
              </span>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                  activeNode.status === 'critical'
                    ? 'bg-error-tint text-error'
                    : 'bg-warning-tint text-warning'
                }`}
              >
                {activeNode.status.toUpperCase()}
              </span>
            </div>
            <h3 className="text-lg font-serif text-ink font-normal mt-1">
              {activeNode.name}
            </h3>
          </div>

          <div className="space-y-1.5 text-xs">
            <span className="font-semibold text-text-secondary block">Component Role:</span>
            <p className="text-ink leading-relaxed">{activeNode.purpose}</p>
          </div>

          {/* Observed Findings List */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-text-secondary block">
              Observed Takeover Findings ({activeNode.findings.length}):
            </span>
            <div className="space-y-1.5">
              {activeNode.findings.map((f, idx) => {
                const fId = f.split(' ')[0];
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setAuditLensActive(true);
                      setActiveFindingId(fId);
                    }}
                    className="p-2 bg-surface rounded border border-border hover:bg-surface-sunken cursor-pointer transition-colors text-[11px] font-mono flex items-center justify-between"
                  >
                    <span className="text-accent font-semibold">{f}</span>
                    <span className="text-text-muted">Inspect ↗</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Status */}
          <div className="space-y-1 text-xs">
            <span className="font-semibold text-text-secondary block">Automated Test Coverage:</span>
            <p className="text-text-muted leading-snug">{activeNode.testStatus}</p>
          </div>

          {/* Risk of Touching */}
          <div className="flex justify-between items-center text-xs p-2.5 bg-surface-sunken rounded border border-border/60">
            <span className="text-text-secondary">Risk of Production Change:</span>
            <strong className="font-mono text-ink">{activeNode.riskOfTouching} Risk</strong>
          </div>

          {/* Recommended Takeover Approach */}
          <div className="space-y-1 text-xs pt-2 border-t border-border">
            <span className="font-semibold text-primary block">Recommended Takeover Plan:</span>
            <p className="text-text-secondary leading-relaxed bg-primary-tint/20 p-2.5 rounded border border-primary/20">
              {activeNode.approach}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
