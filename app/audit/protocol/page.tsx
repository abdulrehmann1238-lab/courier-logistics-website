'use client';

import React, { useState, useEffect } from 'react';
import { useDemoStore } from '../../../store/useDemoStore';
import { Button } from '../../../components/ui/Button';
import { FindingPin } from '../../../components/audit/FindingPin';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Undo2,
  GitBranch,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

interface StepItem {
  id: number;
  label: string;
  action: string;
  detail: string;
  logLine: string;
}

const PROTOCOL_STEPS: StepItem[] = [
  {
    id: 1,
    label: '1. Isolated Branch',
    action: 'git checkout -b fix/f-001-secrets',
    detail: 'Branch created from production baseline. Zero commits made directly to main.',
    logLine: '$ git checkout -b fix/f-001-secrets\nSwitched to a new branch "fix/f-001-secrets"',
  },
  {
    id: 2,
    label: '2. Reproduce Defect',
    action: 'npm run test:bundle-audit',
    detail: 'Inspect production client chunk bundle; confirm secret key string leaks in JS.',
    logLine: '$ npm run test:bundle-audit\n[WARN] Secret string "sk_live_51M..." found in chunks/client-app.js',
  },
  {
    id: 3,
    label: '3. Remediate & Unit Test',
    action: 'npm test -- --grep "secrets"',
    detail: 'Remove NEXT_PUBLIC_ prefix, restrict key to Route Handler, run unit tests.',
    logLine: '$ npm test\n✓ server/auth.test.ts (14 tests passed in 480ms)\n✓ CI check passed: 0 secret tokens in client bundle',
  },
  {
    id: 4,
    label: '4. Staging Verification',
    action: 'Deploy to staging.meridian.internal',
    detail: 'Deploy to isolated staging environment pointing to sanitized database clone.',
    logLine: 'Deploying staging preview...\nPreview URL: https://meridian-git-fix-f001.vercel.app\nStripe test charges verified. Webhooks verified with 200 OK.',
  },
  {
    id: 5,
    label: '5. Off-Peak Production Deploy',
    action: 'Promote PR with CI Green check',
    detail: 'Merge PR during off-peak operational window (21:00 AEST). Zero downtime deploy.',
    logLine: 'PR #42 merged into main by Shannon Reyes.\nVercel instant immutable build #8819 published to production.',
  },
  {
    id: 6,
    label: '6. Telemetry & Rollback Window',
    action: '15-Minute Observation Window',
    detail: 'Monitor Sentry error rates, live job dispatches, and webhook receipts.',
    logLine: 'Telemetry monitor active.\np99 response time: 84ms\nError rate: 0.00%\nDefect F-001 successfully verified resolved in production.',
  },
];

function ProtocolPlayer() {
  const { addToast } = useDemoStore();
  const [currentStep, setCurrentStep] = useState(0); // 0 = idle
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'Meridian Safe-Change Protocol Initialised.',
    'Target Remediation: Finding F-001 (Production Secrets in Client Prefix)',
    'Ready to step through controlled deployment pipeline.',
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (simulateFailure && currentStep === 3) {
          // Failure triggered at staging!
          setIsPlaying(false);
          setLogs((prev) => [
            ...prev,
            '🚨 [STAGING DEFECT DETECTED] Simulated integration test failure on webhook handshake.',
            'Executing automated rollback script...',
            'Rollback command dispatched: vercel rollback --prod --yes',
            '✓ Production restored to build #8818 in 42s. Zero live dispatch impact.',
          ]);
          addToast({
            type: 'error',
            title: 'Staging Defect Caught',
            message: 'Pipeline aborted before production. Rolled back in 42 seconds.',
          });
          return;
        }

        if (currentStep < 6) {
          const next = currentStep + 1;
          setCurrentStep(next);
          const stepData = PROTOCOL_STEPS[next - 1];
          if (stepData) {
            setLogs((prev) => [...prev, stepData.logLine]);
          }
        } else {
          setIsPlaying(false);
          addToast({
            type: 'success',
            title: 'Protocol Completed',
            message: 'All 6 stages verified. Safe change deployed without disruption.',
          });
        }
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, simulateFailure]);

  function handleReset() {
    setIsPlaying(false);
    setCurrentStep(0);
    setLogs([
      'Meridian Safe-Change Protocol Initialised.',
      'Target Remediation: Finding F-001 (Production Secrets in Client Prefix)',
      'Ready to step through controlled deployment pipeline.',
    ]);
  }

  return (
    <div className="bg-surface-elevated rounded-md border border-border p-6 shadow-2 space-y-6 text-xs font-sans">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-primary" />
            <span>Interactive Safe-Change Execution Player</span>
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Step through a sample production change (remediating F-001) using our 6-step discipline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isPlaying ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            icon={isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          >
            {isPlaying ? 'Pause Run' : currentStep === 0 ? 'Start Pipeline' : 'Resume'}
          </Button>

          <Button variant="ghost" size="sm" onClick={handleReset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>

          <button
            onClick={() => setSimulateFailure(!simulateFailure)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-colors ${
              simulateFailure
                ? 'bg-error text-surface-elevated border-error'
                : 'bg-surface border-border text-text-secondary hover:text-ink'
            }`}
          >
            {simulateFailure ? 'Staging Failure Armed' : 'Simulate Staging Defect'}
          </button>
        </div>
      </div>

      {/* 6-Step Visual Horizontal Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
        {PROTOCOL_STEPS.map((s) => {
          const isDone = currentStep >= s.id;
          const isCurrent = currentStep === s.id;

          return (
            <div
              key={s.id}
              className={`p-3 rounded border transition-all ${
                isCurrent
                  ? 'bg-primary-tint border-primary ring-1 ring-primary/20 shadow-sm'
                  : isDone
                  ? 'bg-surface border-border/80 text-ink'
                  : 'bg-surface-sunken/40 border-border/40 text-text-muted'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] font-bold">
                  {s.id}. {s.label.split('. ')[1]}
                </span>
                {isDone && <CheckCircle2 className="w-3 h-3 text-success" />}
              </div>
              <span className="text-[10px] text-text-secondary block font-mono truncate">
                {s.action}
              </span>
            </div>
          );
        })}
      </div>

      {/* Terminal Output Log Box */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-text-muted px-1">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            <span>Continuous Deployment & Telemetry Log</span>
          </span>
          <span>bash · x86_64</span>
        </div>
        <pre className="p-4 bg-[#151B19] text-[#EDE9E0] rounded-md font-mono text-[11px] leading-relaxed border border-[#2E3C37] h-52 overflow-y-auto whitespace-pre-wrap select-text">
          {logs.join('\n\n')}
        </pre>
      </div>
    </div>
  );
}

export default function ProtocolPage() {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
            Production Safety & Risk Mitigation
          </span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-0.5">
            Safe-Change Protocol & Rollback Mechanism
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            How we protect live courier operations from regressions during the codebase takeover.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <FindingPin findingId="F-001" label="Secret Exposure" />
        </div>
      </div>

      <ProtocolPlayer />
    </div>
  );
}
