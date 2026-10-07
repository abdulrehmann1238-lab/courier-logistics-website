'use client';

import React from 'react';
import { PricingResult } from '../../lib/pricing';
import { formatCurrency } from '../../lib/format';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { FindingPin } from '../audit/FindingPin';

export function PriceBreakdown({
  pricing,
  showFindingPin = true,
}: {
  pricing: PricingResult;
  showFindingPin?: boolean;
}) {
  return (
    <div className="bg-surface-elevated rounded-md border border-border p-5 shadow-1 relative">
      {/* Finding Pin for F-004 (Pricing Overlap) */}
      {showFindingPin && (
        <div className="absolute top-4 right-4">
          <FindingPin findingId="F-004" label="F-004 Overlapping Pricing Rule" />
        </div>
      )}

      {/* Header Total */}
      <div className="border-b border-border pb-4 mb-4">
        <span className="text-xs uppercase font-semibold tracking-wider text-text-muted block">
          Calculated Total (Inc. GST)
        </span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-serif text-3xl font-normal text-ink tabular-nums">
            {formatCurrency(pricing.total)}
          </span>
          <span className="text-xs text-text-secondary font-medium">AUD</span>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-primary font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Estimated arrival: {pricing.eta}</span>
        </div>
      </div>

      {/* Rule Conflict Banner if F-004 bug triggered */}
      {pricing.hasRuleConflict && (
        <div className="mb-4 p-3 rounded-sm bg-warning-tint/60 border border-warning/40 text-xs">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-ink block">Pricing Rule Conflict Detected</span>
              <p className="text-text-secondary mt-0.5 leading-snug">
                {pricing.conflictDescription}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Itemised Breakdown Lines */}
      <div className="space-y-2.5">
        <span className="text-[11px] uppercase font-semibold tracking-wider text-text-muted block">
          Transparent Rate Breakdown
        </span>
        {pricing.lines.map((line, idx) => (
          <div
            key={idx}
            className={`flex items-start justify-between py-1.5 text-xs border-b border-border/40 last:border-b-0 ${
              line.hasConflict ? 'bg-warning-tint/30 px-2 rounded-xs' : ''
            }`}
          >
            <div className="flex-1 pr-3">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-text-muted bg-surface-sunken px-1 rounded">
                  {line.ruleId}
                </span>
                <span className="font-medium text-ink">{line.name}</span>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5 leading-tight">
                {line.description}
              </p>
            </div>
            <span className="font-mono font-medium text-ink tabular-nums shrink-0">
              {formatCurrency(line.amount)}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Subtotal and Taxes */}
      <div className="mt-4 pt-3 border-t border-border/70 space-y-1 text-xs">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal</span>
          <span className="font-mono tabular-nums">{formatCurrency(pricing.subtotal)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Fuel Levy (8.5%)</span>
          <span className="font-mono tabular-nums">{formatCurrency(pricing.fuelLevy)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>GST (10%)</span>
          <span className="font-mono tabular-nums">{formatCurrency(pricing.gst)}</span>
        </div>
      </div>
    </div>
  );
}
