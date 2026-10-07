export interface Milestone {
  id: 'M0' | 'M1' | 'M2' | 'M3';
  code: string;
  name: string;
  duration: string;
  timing: string;
  goal: string;
  baseCapacityDays: number;
  findingIds: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  deliverables: string[];
  acceptanceCriteria: string[];
  whatWillNotChange: string[];
}

export const SEED_MILESTONES: Milestone[] = [
  {
    id: 'M0',
    code: 'M0 · Audit & Plan',
    name: 'Read-Only Audit, System Mapping & Fix Prioritisation',
    duration: 'Week 1 (5 days)',
    timing: 'Days 1–5',
    goal: 'Establish baseline truth across frontend, backend, PostgreSQL database, and third-party APIs without modifying any live production systems.',
    baseCapacityDays: 5,
    findingIds: ['F-020'],
    riskLevel: 'Low',
    deliverables: [
      'Comprehensive findings register with severity and impact ratings',
      'Interactive architecture diagram detailing data flow and failure points',
      'Prioritised written fix plan with milestone estimates and cost breakdown',
      'Local development setup guide with clean .env.example and seed data',
    ],
    acceptanceCriteria: [
      'Complete code review conducted without making any live production commits',
      'Database schema, connection pools, and migration history mapped',
      'All third-party integration endpoints (Stripe, Twilio, Google Maps) catalogued',
      'Client alignment meeting held to approve prioritised Milestone 1 scope',
    ],
    whatWillNotChange: [
      'Zero changes to live Vercel deployments',
      'No database schema modifications or migrations',
      'No API credentials rotated or touched until M1 signoff',
    ],
  },
  {
    id: 'M1',
    code: 'M1 · Stabilise',
    name: 'Production Security, Staging Parity & Core Integrity',
    duration: 'Weeks 2–3 (10 days)',
    timing: 'Days 6–15',
    goal: 'Eliminate production vulnerabilities, secure credentials, prevent connection exhaustion, and protect live dispatch operations.',
    baseCapacityDays: 10,
    findingIds: ['F-001', 'F-002', 'F-003', 'F-004', 'F-007', 'F-009', 'F-010', 'F-019', 'F-021', 'F-022', 'F-024'],
    riskLevel: 'Medium',
    deliverables: [
      'Client-exposed secrets removed and rotated; Stripe webhooks cryptographically verified',
      'PostgreSQL connection pooler configured with safe concurrency limits',
      'Isolated staging environment matching production with branch protection on main',
      'Overlapping distance-band pricing bug resolved with unit test coverage',
      'Transactional guarantees on booking and invoice creation',
      'Structured error logging and Sentry uptime alerting operational',
    ],
    acceptanceCriteria: [
      'Zero production secrets exposed in client-facing JavaScript bundles',
      'Simulated database disconnections handle gracefully with user retry cues',
      'Pull requests require CI green checks and code review before merge to main',
      'Automated pricing tests pass across 100% of distance tier boundaries',
      'Every production deployment accompanied by a documented rollback verification',
    ],
    whatWillNotChange: [
      'Driver mobile application UI remains unchanged to prevent driver disorientation',
      'No alterations to existing customer account authentication schemes',
      'Public pricing formulas remain identical outside the verified 24-26km overlap fix',
    ],
  },
  {
    id: 'M2',
    code: 'M2 · Complete',
    name: 'Workflow Completion, POD Object Storage & Outbox Architecture',
    duration: 'Weeks 4–6 (15 days)',
    timing: 'Days 16–30',
    goal: 'Finish incomplete operational features, streamline job status transitions into a canonical state machine, and optimize storage.',
    baseCapacityDays: 15,
    findingIds: ['F-005', 'F-006', 'F-008', 'F-011', 'F-012', 'F-013', 'F-015', 'F-016', 'F-018'],
    riskLevel: 'Medium',
    deliverables: [
      'Canonical job state machine unifying dispatch, driver, and tracking statuses',
      'Proof of Delivery signature and photo uploads migrated to secure object storage',
      'Asynchronous transactional outbox pattern for customer SMS/email notifications',
      'Optimistic locking on driver assignment to eliminate dispatch races',
      'Consolidated shared pricing library removing 800+ lines of duplicated logic',
      'Payload CMS collections harmonised with core application PostgreSQL tables',
    ],
    acceptanceCriteria: [
      'Status transitions strictly enforced; contradictory states mathematically impossible',
      'Job listing API payload size reduced by > 80% through object storage migration',
      'Driver "Complete Delivery" action completes in < 150ms even during SMS gateway lag',
      'Simultaneous driver assignment by multiple coordinators prompts clear conflict resolution',
    ],
    whatWillNotChange: [
      'Customer-facing booking step sequence remains familiar 4-step structure',
      'No disruption to existing third-party merchant processor accounts',
    ],
  },
  {
    id: 'M3',
    code: 'M3 · Harden & Hand Over',
    name: 'Automated Testing, Performance Tuning & Client Documentation',
    duration: 'Weeks 7–8 (10 days)',
    timing: 'Days 31–40',
    goal: 'Lock in platform stability with end-to-end regression testing, eliminate serverless quota waste, and deliver full handover documentation.',
    baseCapacityDays: 10,
    findingIds: ['F-014', 'F-017', 'F-023'],
    riskLevel: 'Low',
    deliverables: [
      'Playwright end-to-end smoke test suite verifying Quote -> Book -> Pay -> Track',
      'Client-side backoff polling eliminating unnecessary Vercel serverless executions',
      'Australian Spam Act 2003 compliance verification across all transactional emails',
      'Comprehensive system architecture handbook, runbooks, and disaster recovery procedures',
      'Handover recorded walkthrough sessions for operations staff and company leadership',
    ],
    acceptanceCriteria: [
      'Automated smoke test suite runs on every staging deployment in under 90 seconds',
      'Vercel monthly function invocation volume reduced by measured > 60%',
      'Runbook verified by performing simulated cold-start staging recovery drill',
      'Client leadership accepts platform sign-off with zero high-priority open defects',
    ],
    whatWillNotChange: [
      'Platform contracts, data schemas, and deployment pipelines remain frozen post-handover',
    ],
  },
];
