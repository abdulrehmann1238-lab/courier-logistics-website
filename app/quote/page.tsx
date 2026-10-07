'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AU_SUBURBS, calculateDistanceBetweenSuburbs, Suburb } from '../../mocks/suburbs';
import { calculateQuote, PricingInput } from '../../lib/pricing';
import { PriceBreakdown } from '../../components/shared/PriceBreakdown';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useDemoStore } from '../../store/useDemoStore';
import { FindingPin } from '../../components/audit/FindingPin';
import {
  MapPin,
  Package,
  Clock,
  ArrowRight,
  Mail,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';

function QuoteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { proposedPricingFix, addToast, auditLensActive } = useDemoStore();

  // Initial service from query param if provided
  const initialService = (searchParams.get('service') as any) || 'sameday';

  // Form State
  const [fromSuburb, setFromSuburb] = useState('Richmond');
  const [toSuburb, setToSuburb] = useState('Docklands');
  const [parcelType, setParcelType] = useState<'document' | 'small' | 'medium' | 'large' | 'pallet'>('medium');
  const [weightKg, setWeightKg] = useState(6.5);
  const [service, setService] = useState<'sameday' | 'nextday' | 'scheduled'>(initialService);
  const [pickupTime, setPickupTime] = useState<'now' | 'today' | 'schedule'>('today');

  // Modal State
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailSending, setEmailSending] = useState(false);

  // Suburb search state
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  // Simulated Geocode Timeout Toggle
  const [simulateTimeout, setSimulateTimeout] = useState(false);

  // Calculate Distance & Pricing
  const { distanceKm, isInterstate } = useMemo(() => {
    return calculateDistanceBetweenSuburbs(fromSuburb, toSuburb);
  }, [fromSuburb, toSuburb]);

  const pricing = useMemo(() => {
    const input: PricingInput = {
      service,
      parcelType,
      weightKg,
      distanceKm: simulateTimeout ? 12.0 : distanceKm, // fallback band on timeout
      isInterstate,
      proposedFixApplied: proposedPricingFix,
    };
    return calculateQuote(input);
  }, [service, parcelType, weightKg, distanceKm, isInterstate, proposedPricingFix, simulateTimeout]);

  // Suburb filters
  const filteredFromSuburbs = AU_SUBURBS.filter((s) =>
    s.name.toLowerCase().includes(fromSearch.toLowerCase()) || s.postcode.includes(fromSearch)
  ).slice(0, 6);

  const filteredToSuburbs = AU_SUBURBS.filter((s) =>
    s.name.toLowerCase().includes(toSearch.toLowerCase()) || s.postcode.includes(toSearch)
  ).slice(0, 6);

  function proceedToBooking() {
    const query = new URLSearchParams({
      from: fromSuburb,
      to: toSuburb,
      service,
      parcelType,
      weight: weightKg.toString(),
      price: pricing.total.toString(),
    }).toString();
    router.push(`/book?${query}`);
  }

  async function handleSendEmailQuote(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput) return;
    setEmailSending(true);
    await new Promise((r) => setTimeout(r, 600));
    setEmailSending(false);
    setEmailModalOpen(false);
    addToast({
      type: 'success',
      title: 'Quote Sent (Preview)',
      message: `Simulated quote transmission to ${emailInput}. No external email dispatched.`,
    });
    setEmailInput('');
  }

  return (
    <div className="max-w-[1240px] mx-auto px-6 py-10 font-sans">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono uppercase tracking-widest text-accent">
            Instant Freight Quoting
          </span>
          <FindingPin findingId="F-004" label="Pricing Rules" />
          <FindingPin findingId="F-009" label="Geocoding Timeout" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
          Calculate your delivery rate.
        </h1>
        <p className="text-text-secondary text-xs sm:text-sm mt-1 max-w-xl">
          Point-to-point courier quoting with transparent fuel levies and GST calculation.
        </p>
      </div>

      {/* Grid: Form (7 cols) / Summary (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Suburb Selection Card */}
          <div className="bg-surface rounded-md border border-border p-5 space-y-4 shadow-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              1. Pickup & Delivery Locations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pickup Suburb */}
              <div className="relative">
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Pickup Suburb
                </label>
                <div
                  onClick={() => setFromOpen(!fromOpen)}
                  className="w-full bg-surface-elevated border border-border-strong rounded-sm p-2.5 text-xs font-medium text-ink cursor-pointer flex items-center justify-between"
                >
                  <span>{fromSuburb}</span>
                  <span className="text-text-muted text-[10px]">Change ▾</span>
                </div>
                {fromOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-surface-elevated border border-border-strong rounded-sm shadow-3 z-30 p-2">
                    <input
                      type="text"
                      placeholder="Search suburb or postcode..."
                      value={fromSearch}
                      onChange={(e) => setFromSearch(e.target.value)}
                      className="w-full bg-surface-sunken p-1.5 text-xs rounded border border-border focus:outline-none mb-1.5"
                      autoFocus
                    />
                    <div className="max-h-40 overflow-y-auto space-y-0.5">
                      {filteredFromSuburbs.map((sub) => (
                        <div
                          key={sub.name}
                          onClick={() => {
                            setFromSuburb(sub.name);
                            setFromOpen(false);
                            setFromSearch('');
                          }}
                          className="px-2 py-1.5 text-xs hover:bg-surface-sunken rounded cursor-pointer flex justify-between"
                        >
                          <span className="font-medium text-ink">{sub.name}</span>
                          <span className="text-text-muted font-mono">{sub.postcode} {sub.state}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Suburb */}
              <div className="relative">
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Delivery Destination
                </label>
                <div
                  onClick={() => setToOpen(!toOpen)}
                  className="w-full bg-surface-elevated border border-border-strong rounded-sm p-2.5 text-xs font-medium text-ink cursor-pointer flex items-center justify-between"
                >
                  <span>{toSuburb}</span>
                  <span className="text-text-muted text-[10px]">Change ▾</span>
                </div>
                {toOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-surface-elevated border border-border-strong rounded-sm shadow-3 z-30 p-2">
                    <input
                      type="text"
                      placeholder="Search suburb or postcode..."
                      value={toSearch}
                      onChange={(e) => setToSearch(e.target.value)}
                      className="w-full bg-surface-sunken p-1.5 text-xs rounded border border-border focus:outline-none mb-1.5"
                      autoFocus
                    />
                    <div className="max-h-40 overflow-y-auto space-y-0.5">
                      {filteredToSuburbs.map((sub) => (
                        <div
                          key={sub.name}
                          onClick={() => {
                            setToSuburb(sub.name);
                            setToOpen(false);
                            setToSearch('');
                          }}
                          className="px-2 py-1.5 text-xs hover:bg-surface-sunken rounded cursor-pointer flex justify-between"
                        >
                          <span className="font-medium text-ink">{sub.name}</span>
                          <span className="text-text-muted font-mono">{sub.postcode} {sub.state}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Suburb Distance Context */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs text-text-secondary">
              <span>
                Calculated Distance:{' '}
                <strong className="text-ink font-mono">{distanceKm.toFixed(1)} km</strong>
              </span>
              {isInterstate && (
                <span className="text-accent font-medium">Interstate Route (Air/Trunk)</span>
              )}
              {fromSuburb === toSuburb && (
                <span className="text-text-muted">Local intra-suburb rate applied</span>
              )}
            </div>

            {/* Audit Lens Geocoding Fault Simulator */}
            {auditLensActive && (
              <div className="mt-2 p-2.5 rounded bg-surface-sunken border border-border text-xs flex items-center justify-between">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-accent" />
                  <span>Finding F-009: Simulate maps API timeout fallback</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSimulateTimeout(!simulateTimeout)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                    simulateTimeout ? 'bg-accent text-surface-elevated' : 'bg-surface border border-border text-ink'
                  }`}
                >
                  {simulateTimeout ? 'Fallback Active' : 'Normal'}
                </button>
              </div>
            )}
          </div>

          {/* Parcel Type Segmented Control */}
          <div className="bg-surface rounded-md border border-border p-5 space-y-3 shadow-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-primary" />
              2. Parcel Dimensions & Classification
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'document', label: 'Document', sub: 'Up to 0.5kg' },
                { id: 'small', label: 'Small Box', sub: 'Shoebox size' },
                { id: 'medium', label: 'Medium Box', sub: 'Standard carton' },
                { id: 'large', label: 'Large Box', sub: 'Bulky freight' },
                { id: 'pallet', label: 'Pallet / Crate', sub: 'Over 30kg' },
              ].map((p) => {
                const isSelected = parcelType === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setParcelType(p.id as any)}
                    className={`p-3 rounded-sm border text-left transition-all ${
                      isSelected
                        ? 'bg-primary-tint border-primary shadow-sm'
                        : 'bg-surface-elevated border-border hover:border-border-strong'
                    }`}
                  >
                    <span className="block text-xs font-semibold text-ink">{p.label}</span>
                    <span className="block text-[10px] text-text-muted mt-0.5">{p.sub}</span>
                  </button>
                );
              })}
            </div>

            {/* Weight Slider & Synced Input */}
            <div className="pt-3 border-t border-border/60">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-text-secondary">
                  Consignment Weight (kg)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0.5"
                    max="60"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0.5)}
                    className="w-16 bg-surface-elevated border border-border-strong rounded-xs p-1 text-xs text-right font-mono font-semibold text-ink focus:outline-none"
                  />
                  <span className="text-xs text-text-muted font-mono">kg</span>
                </div>
              </div>
              <input
                type="range"
                min="0.5"
                max="40"
                step="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              {weightKg > 30 && (
                <p className="text-[11px] text-accent mt-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Over 30kg allocated to heavy-freight van run.
                </p>
              )}
            </div>
          </div>

          {/* Service Level Radio Cards */}
          <div className="bg-surface rounded-md border border-border p-5 space-y-3 shadow-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              3. Service Tier
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'sameday',
                  title: 'Same-day Metro',
                  eta: 'Today by 17:00',
                  desc: 'Direct courier point-to-point',
                },
                {
                  id: 'nextday',
                  title: 'Next-day Express',
                  eta: 'Tomorrow by 12:00',
                  desc: 'Overnight linehaul dispatch',
                },
                {
                  id: 'scheduled',
                  title: 'Scheduled Run',
                  eta: 'Contract window',
                  desc: 'Recurring business allocation',
                },
              ].map((s) => {
                const isSelected = service === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setService(s.id as any)}
                    className={`p-3.5 rounded-sm border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-primary-tint border-primary shadow-sm ring-1 ring-primary/20'
                        : 'bg-surface-elevated border-border hover:border-border-strong'
                    }`}
                  >
                    <span className="block text-xs font-semibold text-ink">{s.title}</span>
                    <span className="block text-[11px] text-primary font-medium mt-0.5">
                      {s.eta}
                    </span>
                    <span className="block text-[10px] text-text-muted mt-1 leading-snug">
                      {s.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Summary Panel (Sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <PriceBreakdown pricing={pricing} showFindingPin={true} />

          {/* Actions */}
          <div className="space-y-2.5">
            <Button
              variant="primary"
              size="lg"
              className="w-full text-sm font-semibold"
              onClick={proceedToBooking}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Book this consignment
            </Button>

            <Button
              variant="secondary"
              size="md"
              className="w-full text-xs"
              onClick={() => setEmailModalOpen(true)}
              icon={<Mail className="w-3.5 h-3.5" />}
            >
              Email formal quote receipt
            </Button>
          </div>
        </div>
      </div>

      {/* Email Quote Modal */}
      <Modal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        title="Email Quote Summary"
        subtitle="Receive an itemised breakdown for internal approval"
      >
        <form onSubmit={handleSendEmailQuote} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Recipient Email Address
            </label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="billing@yourfirm.com.au"
              className="w-full bg-surface-elevated border border-border-strong rounded-sm p-2 text-xs text-ink focus:outline-none focus:border-primary"
            />
          </div>
          <div className="p-3 bg-surface-sunken rounded text-xs text-text-secondary">
            <span className="font-semibold text-ink block mb-0.5">Quote summary:</span>
            {fromSuburb} to {toSuburb} · {service.toUpperCase()} · ${pricing.total.toFixed(2)} AUD (inc. GST)
          </div>
          <Button
            type="submit"
            variant="primary"
            isLoading={emailSending}
            className="w-full"
          >
            Send quote summary
          </Button>
        </form>
      </Modal>
    </div>
  );
}

export default function QuotePage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-[1240px] mx-auto px-6 py-20 text-center text-xs text-text-muted">
          Loading quote calculator...
        </div>
      }
    >
      <QuoteContent />
    </React.Suspense>
  );
}
