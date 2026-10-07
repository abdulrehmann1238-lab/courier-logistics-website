import React from 'react';
import { JobStatus } from '../../mocks/jobs';
import { FindingSeverity } from '../../mocks/findings';

export function JobStatusChip({ status }: { status: JobStatus | string }) {
  const configs: Record<string, { bg: string; text: string; dot: string; icon?: string }> = {
    Unassigned: { bg: 'bg-surface-sunken', text: 'text-text-secondary', dot: 'bg-text-muted' },
    Accepted: { bg: 'bg-primary-tint', text: 'text-primary', dot: 'bg-primary' },
    'Picked up': { bg: 'bg-[#E3EAF2]', text: 'text-secondary', dot: 'bg-secondary' },
    'In transit': { bg: 'bg-warning-tint', text: 'text-[#875F13]', dot: 'bg-warning' },
    Delivered: { bg: 'bg-success-tint', text: 'text-success', dot: 'bg-success' },
    Exception: { bg: 'bg-error-tint', text: 'text-error', dot: 'bg-error' },
  };

  const config = configs[status] || { bg: 'bg-surface-sunken', text: 'text-ink', dot: 'bg-text-muted' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs text-xs font-medium ${config.bg} ${config.text} border border-border/40`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} />
      {status}
    </span>
  );
}

export function SeverityChip({ severity }: { severity: FindingSeverity }) {
  const configs: Record<FindingSeverity, { bg: string; text: string; dot: string }> = {
    Critical: { bg: 'bg-error-tint', text: 'text-error', dot: 'bg-error' },
    High: { bg: 'bg-[#F9ECE4]', text: 'text-accent', dot: 'bg-accent' },
    Medium: { bg: 'bg-warning-tint', text: 'text-[#8A6715]', dot: 'bg-warning' },
    Low: { bg: 'bg-surface-sunken', text: 'text-text-secondary', dot: 'bg-text-muted' },
  };

  const c = configs[severity] || configs.Low;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {severity}
    </span>
  );
}
