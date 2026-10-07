'use client';

import React, { useState } from 'react';
import { Check, ShieldCheck, MapPin, Smartphone, FileSignature } from 'lucide-react';

interface StoryStep {
  number: string;
  title: string;
  subtitle: string;
  detail: string;
}

const STEPS: StoryStep[] = [
  {
    number: '01',
    title: 'Instant Transparent Quote',
    subtitle: 'Point-to-point distance bands & weight calculations',
    detail: 'Suburb-to-suburb rates calculate instantly with transparent fuel levies and GST. No hidden regional access surcharges.',
  },
  {
    number: '02',
    title: 'Guaranteed Slot Booking',
    subtitle: 'Direct dispatch integration with zero friction',
    detail: 'Confirm in 4 clear steps with precise address instructions, declared values, and automated pickup time reservation.',
  },
  {
    number: '03',
    title: 'Field Execution & Tracking',
    subtitle: 'Live courier telemetry & timely notifications',
    detail: 'Consignments advance through strict status gates. Customers receive SMS and tracking alerts when the driver is within 20 minutes.',
  },
  {
    number: '04',
    title: 'Verifiable Proof of Delivery',
    subtitle: 'Signed canvas, photo capture & GPS verification',
    detail: 'Every single parcel concludes with a signed recipient canvas, geotagged coordinate lock, and instantaneous PDF delivery receipt.',
  },
];

export function PinnedStory() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-24 px-6 max-w-[1240px] mx-auto">
      <div className="mb-14">
        <span className="text-xs font-mono uppercase tracking-widest text-accent">
          Operational Precision
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-1">
          How every consignment moves.
        </h2>
        <p className="text-text-secondary text-sm max-w-xl mt-2">
          From first quote to signed delivery, our workflow eliminates hand-off friction and ensures full chain-of-custody accountability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Interactive Step Selector */}
        <div className="lg:col-span-5 space-y-4">
          {STEPS.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`p-5 rounded-md border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-surface-elevated border-primary shadow-2 ring-1 ring-primary/20'
                    : 'bg-surface border-border hover:border-border-strong'
                }`}
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <span
                    className={`font-mono text-xs px-1.5 py-0.5 rounded-xs ${
                      isActive ? 'bg-primary text-surface-elevated font-semibold' : 'bg-surface-sunken text-text-muted'
                    }`}
                  >
                    {step.number}
                  </span>
                  <h4 className="font-sans font-semibold text-sm text-ink">{step.title}</h4>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed pl-8">
                  {step.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Interactive UI Preview */}
        <div className="lg:col-span-7 bg-surface-elevated rounded-lg border border-border p-6 shadow-2 relative min-h-[380px] flex flex-col justify-center">
          {activeStep === 0 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Live Rate Preview
                </span>
                <span className="font-mono text-xs text-primary bg-primary-tint px-2 py-0.5 rounded">
                  Same-day Metro
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-surface-sunken p-3 rounded">
                  <span className="text-text-muted block text-[11px]">Route</span>
                  <span className="font-medium text-ink">Richmond VIC → Docklands VIC</span>
                </div>
                <div className="bg-surface-sunken p-3 rounded">
                  <span className="text-text-muted block text-[11px]">Distance / Weight</span>
                  <span className="font-medium text-ink">8.2 km · 6.5 kg Box</span>
                </div>
              </div>
              <div className="p-4 bg-surface rounded border border-border/70 flex items-center justify-between">
                <div>
                  <span className="text-xs text-text-muted block">Quoted Price (inc. GST)</span>
                  <span className="font-serif text-3xl text-ink font-normal">$38.60 AUD</span>
                </div>
                <span className="text-xs text-success font-medium flex items-center gap-1">
                  <Check className="w-4 h-4" /> Ready to book
                </span>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Booking Confirmation
                </span>
                <span className="font-mono text-xs text-ink font-semibold">MRD-481920</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>Pickup: Level 2, 88 Swan St, Richmond VIC</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="w-4 h-4 text-accent shrink-0" />
                  <span>Drop: Tower 4, 727 Collins St, Docklands VIC</span>
                </div>
              </div>
              <div className="p-3 bg-surface-sunken rounded text-xs text-text-secondary">
                <span className="font-semibold text-ink block mb-0.5">Automated SMS Preview:</span>
                "Meridian: Booking MRD-481920 confirmed. Driver Callum Ng assigned. Track: mrd.co/481920"
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Courier Status Gate
                </span>
                <span className="text-xs font-mono text-accent font-semibold">In Transit · Callum Ng</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 bg-primary-tint rounded text-primary font-medium">1. Accepted</div>
                <div className="p-2 bg-primary-tint rounded text-primary font-medium">2. Picked Up</div>
                <div className="p-2 bg-accent text-surface-elevated rounded font-medium shadow-sm">3. In Transit</div>
                <div className="p-2 bg-surface-sunken rounded text-text-muted">4. Delivered</div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface rounded border border-border text-xs">
                <Smartphone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-text-secondary">
                  Field driver app updating live via GPS location tracking with ETA adjustments.
                </span>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Signed Proof of Delivery
                </span>
                <span className="text-xs text-success font-medium flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Verified POD
                </span>
              </div>
              <div className="p-4 bg-surface rounded border border-border flex items-center justify-between">
                <div>
                  <span className="text-xs text-text-muted block">Signed by Recipient:</span>
                  <span className="text-sm font-semibold text-ink">A. Whitlock</span>
                  <span className="text-[11px] text-text-muted block mt-0.5">Today at 11:42 AEST</span>
                </div>
                {/* Visual SVG Signature line */}
                <div className="w-36 h-12 bg-surface-sunken rounded border border-border flex items-center justify-center p-2">
                  <svg className="w-full h-full" viewBox="0 0 200 60" fill="none">
                    <path
                      d="M 10 40 Q 30 10, 50 35 T 90 30 Q 120 15, 140 45 Q 160 25, 190 40"
                      stroke="#1D2421"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-[11px] text-text-muted flex items-center justify-between">
                <span>Geotag: Lat -27.4381 · Lng 153.0824 (Accuracy 3m)</span>
                <span className="font-mono text-primary">PDF Stored</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
