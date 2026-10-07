'use client';

import React, { useState, useMemo } from 'react';
import { useDemoStore } from '../../../store/useDemoStore';
import { calculateQuote, PricingInput } from '../../../lib/pricing';
import { formatCurrency } from '../../../lib/format';
import { Button } from '../../../components/ui/Button';
import { Toggle } from '../../../components/ui/Toggle';
import { FindingPin } from '../../../components/audit/FindingPin';
import {
  Calculator,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Sparkles,
  Info,
} from 'lucide-react';

interface PricingRuleRow {
  id: string;
  category: string;
  condition: string;
  effect: string;
  lastModified: string;
  hasConflict?: boolean;
}

export default function PricingRulesPage() {
  const { proposedPricingFix, setProposedPricingFix } = useDemoStore();

  // Simulator Inputs
  const [simService, setSimService] = useState<'sameday' | 'nextday' | 'scheduled'>('sameday');
  const [simDistanceKm, setSimDistanceKm] = useState(24.8); // Defaults right in the 24-26km overlap zone!
  const [simWeightKg, setSimWeightKg] = useState(8.5);
  const [simParcelType, setSimParcelType] = useState<'document' | 'small' | 'medium' | 'large' | 'pallet'>('medium');

  // Compute pricing via shared pure function
  const simResult = useMemo(() => {
    return calculateQuote({
      service: simService,
      distanceKm: simDistanceKm,
      weightKg: simWeightKg,
      parcelType: simParcelType,
      proposedFixApplied: proposedPricingFix,
    });
  }, [simService, simDistanceKm, simWeightKg, simParcelType, proposedPricingFix]);

  // Master Rules Table Data
  const rules: PricingRuleRow[] = [
    { id: 'PR-01', category: 'Base Rate', condition: 'Service == "Same-day"', effect: '$16.00 AUD', lastModified: '14 May 2025' },
    { id: 'PR-02', category: 'Base Rate', condition: 'Service == "Next-day"', effect: '$11.00 AUD', lastModified: '14 May 2025' },
    { id: 'PR-03', category: 'Base Rate', condition: 'Service == "Scheduled"', effect: '$9.50 AUD', lastModified: '02 Jun 2025' },
    { id: 'PR-04', category: 'Distance Band', condition: 'Distance in [0, 10km)', effect: '$0.00 (Included in base)', lastModified: '14 May 2025' },
    {
      id: 'PR-05',
      category: 'Distance Band',
      condition: proposedPricingFix ? 'Distance in [10km, 25km)' : 'Distance in [10km, 26km] (Legacy Overlap)',
      effect: '$8.50 AUD surcharge',
      lastModified: proposedPricingFix ? 'Patch M1-PR05' : '14 May 2025',
      hasConflict: !proposedPricingFix,
    },
    {
      id: 'PR-06',
      category: 'Distance Band',
      condition: proposedPricingFix ? 'Distance in [25km, 60km)' : 'Distance in [24km, 60km] (Legacy Overlap)',
      effect: '$19.00 AUD surcharge',
      lastModified: proposedPricingFix ? 'Patch M1-PR06' : '14 May 2025',
      hasConflict: !proposedPricingFix,
    },
    { id: 'PR-07', category: 'Distance Band', condition: 'Distance >= 60km', effect: '$34.00 AUD outer regional', lastModified: '14 May 2025' },
    { id: 'PR-08', category: 'Weight Tier', condition: 'Weight <= 5.0 kg', effect: '$0.00 standard parcel', lastModified: '14 May 2025' },
    { id: 'PR-09', category: 'Weight Tier', condition: 'Weight in (5.0, 15.0] kg', effect: '+$4.00 AUD carton surcharge', lastModified: '14 May 2025' },
    { id: 'PR-10', category: 'Weight Tier', condition: 'Weight in (15.0, 30.0] kg', effect: '+$11.50 AUD medium freight', lastModified: '14 May 2025' },
    { id: 'PR-11', category: 'Weight Tier', condition: 'Weight > 30.0 kg', effect: '+$24.00 AUD van heavy lift', lastModified: '14 May 2025' },
    { id: 'PR-12', category: 'Volume', condition: 'Parcel is Medium/Large/Pallet', effect: '+$3.50 / +$7.00 / +$22.00', lastModified: '14 May 2025' },
    { id: 'PR-13', category: 'Fuel Levy', condition: 'All consignments subtotal', effect: '+8.5% Indexed diesel levy', lastModified: '01 Jul 2025' },
    { id: 'PR-14', category: 'Tax (GST)', condition: 'Statutory GST liability', effect: '+10.0% GST on taxable total', lastModified: 'Statutory' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
            Commercial Pricing Engine & Simulator
          </span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-0.5">
            Pricing Calculation Rules
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <FindingPin findingId="F-004" label="F-004 Overlapping Rules" />
          <FindingPin findingId="F-005" label="GST Roundoff" />
        </div>
      </div>

      {/* Simulator Card & Proposed Fix Toggle */}
      <div className="bg-surface-elevated rounded-md border border-border p-6 shadow-2 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              <span>Interactive Pricing Simulator & Boundary Tester</span>
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Simulate how rules fire. Notice how distances between 24.0km and 26.0km trigger finding F-004.
            </p>
          </div>

          {/* Toggle Proposed Fix */}
          <div className="flex items-center gap-2.5 bg-surface-sunken p-2 rounded-sm border border-border">
            <span className="text-xs font-medium text-ink">Proposed Consolidated Fix (F-004):</span>
            <Toggle
              checked={proposedPricingFix}
              onChange={setProposedPricingFix}
            />
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-text-secondary font-semibold mb-1">Service Tier</label>
            <select
              value={simService}
              onChange={(e) => setSimService(e.target.value as any)}
              className="w-full bg-surface border border-border-strong rounded p-2 text-xs focus:outline-none"
            >
              <option value="sameday">Same-day ($16.00)</option>
              <option value="nextday">Next-day ($11.00)</option>
              <option value="scheduled">Scheduled ($9.50)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-text-secondary mb-1">
              <span>Distance (km)</span>
              <span className="font-mono text-primary">{simDistanceKm.toFixed(1)} km</span>
            </div>
            <input
              type="range"
              min="2"
              max="70"
              step="0.2"
              value={simDistanceKm}
              onChange={(e) => setSimDistanceKm(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-muted font-mono mt-0.5">
              <span>0km</span>
              <span className={simDistanceKm >= 24 && simDistanceKm <= 26 ? 'text-accent font-bold' : ''}>
                24-26km overlap zone
              </span>
              <span>70km</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-text-secondary mb-1">
              <span>Weight (kg)</span>
              <span className="font-mono text-primary">{simWeightKg.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="40"
              step="0.5"
              value={simWeightKg}
              onChange={(e) => setSimWeightKg(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-text-secondary font-semibold mb-1">Parcel Type</label>
            <select
              value={simParcelType}
              onChange={(e) => setSimParcelType(e.target.value as any)}
              className="w-full bg-surface border border-border-strong rounded p-2 text-xs focus:outline-none"
            >
              <option value="document">Document</option>
              <option value="small">Small Box</option>
              <option value="medium">Medium Box</option>
              <option value="large">Large Box</option>
              <option value="pallet">Pallet Freight</option>
            </select>
          </div>
        </div>

        {/* Simulation Output Banner */}
        <div
          className={`p-4 rounded-md border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            simResult.hasRuleConflict
              ? 'bg-warning-tint/50 border-warning/60'
              : 'bg-primary-tint/30 border-primary/20'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              {simResult.hasRuleConflict ? (
                <>
                  <AlertCircle className="w-4 h-4 text-warning" />
                  <strong className="text-ink font-semibold">
                    Finding F-004 Triggered: Overlapping Distance Bounds Active
                  </strong>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <strong className="text-ink font-semibold">
                    Unambiguous Calculation: Half-Open Intervals Applied Cleanly
                  </strong>
                </>
              )}
            </div>
            <p className="text-text-secondary mt-1">
              {simResult.hasRuleConflict
                ? simResult.conflictDescription
                : 'All distance and weight tiers match canonical half-open intervals with zero ambiguity.'}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] text-text-muted block">Simulated Total (inc GST)</span>
            <span className="font-serif text-3xl font-normal text-ink tabular-nums">
              {formatCurrency(simResult.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Rules Schedule Table */}
      <div className="bg-surface rounded-md border border-border overflow-hidden shadow-1">
        <div className="p-4 border-b border-border/60 bg-surface-sunken/40 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">
            Canonical Business Rules Schedule (PR-01 through PR-14)
          </h3>
          <span className="text-text-muted font-mono text-[11px]">Source: lib/pricing.ts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-sunken border-b border-border text-[11px] font-mono uppercase text-text-muted">
                <th className="py-2.5 px-4 font-semibold">Rule ID</th>
                <th className="py-2.5 px-4 font-semibold">Category</th>
                <th className="py-2.5 px-4 font-semibold">Evaluation Condition</th>
                <th className="py-2.5 px-4 font-semibold">Pricing Effect</th>
                <th className="py-2.5 px-4 font-semibold">Modified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rules.map((r) => {
                const isFiringInSim = simResult.lines.some(
                  (l) => l.ruleId === r.id || l.ruleId.includes(r.id.replace('PR-', ''))
                );

                return (
                  <tr
                    key={r.id}
                    className={`transition-colors ${
                      r.hasConflict && !proposedPricingFix
                        ? 'bg-warning-tint/30 text-ink'
                        : isFiringInSim
                        ? 'bg-primary-tint/20 font-medium'
                        : 'hover:bg-surface-sunken/50'
                    }`}
                  >
                    <td className="py-2.5 px-4 font-mono font-semibold text-primary">
                      {r.id}
                      {r.hasConflict && !proposedPricingFix && (
                        <span className="ml-1 text-[10px] text-accent font-sans font-bold">
                          [CONFLICT]
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-text-secondary">{r.category}</td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-ink">{r.condition}</td>
                    <td className="py-2.5 px-4 font-medium text-ink">{r.effect}</td>
                    <td className="py-2.5 px-4 font-mono text-text-muted text-[11px]">
                      {r.lastModified}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
