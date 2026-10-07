import React from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { ArrowRight, Check, Shield, Clock, MapPin, Truck } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="max-w-[1240px] mx-auto px-6 py-12 font-sans">
      <div className="mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-accent">
          Service Levels & Depot Coverage
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal mt-1">
          Express point-to-point courier network.
        </h1>
        <p className="text-text-secondary text-sm max-w-xl mt-3 leading-relaxed">
          Operating across Victoria, New South Wales, and Queensland with dedicated hub facilities in Port Melbourne, Alexandria, and Eagle Farm.
        </p>
      </div>

      {/* Grid of Detailed Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-surface rounded-md border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs bg-primary-tint text-primary px-2 py-0.5 rounded">
              Tier 1 · Same-day
            </span>
            <span className="font-serif text-2xl text-ink">$16.00 base</span>
          </div>
          <h3 className="text-lg font-semibold text-ink">Same-day Metro Express</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Urgent point-to-point delivery for contracts, sensitive medical specimens, dental impressions, and design prototypes.
          </p>
          <ul className="space-y-2 text-xs text-text-muted border-t border-border pt-4">
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-primary" /> 2 to 4 hour metro transit SLA
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-primary" /> Dedicated courier allocation
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-primary" /> Real-time mobile signature POD
            </li>
          </ul>
          <Link href="/quote?service=sameday" className="block pt-2">
            <Button variant="primary" size="sm" className="w-full">
              Quote Same-day
            </Button>
          </Link>
        </div>

        <div className="bg-surface rounded-md border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs bg-secondary/15 text-secondary px-2 py-0.5 rounded">
              Tier 2 · Next-day
            </span>
            <span className="font-serif text-2xl text-ink">$11.00 base</span>
          </div>
          <h3 className="text-lg font-semibold text-ink">Next-day Priority Linehaul</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Scheduled overnight trunking between Melbourne, Sydney, and Brisbane hubs with early morning drop off.
          </p>
          <ul className="space-y-2 text-xs text-text-muted border-t border-border pt-4">
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-primary" /> Delivered by 12:00 or 17:00 next business day
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-primary" /> Inter-depot security barcode scanning
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-primary" /> Automated SMS delivery notice
            </li>
          </ul>
          <Link href="/quote?service=nextday" className="block pt-2">
            <Button variant="secondary" size="sm" className="w-full">
              Quote Next-day
            </Button>
          </Link>
        </div>

        <div className="bg-surface rounded-md border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs bg-surface-sunken text-text-secondary px-2 py-0.5 rounded">
              Tier 3 · Contract
            </span>
            <span className="font-serif text-2xl text-ink">$9.50 base</span>
          </div>
          <h3 className="text-lg font-semibold text-ink">Scheduled Business Runs</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Recurring morning and afternoon multi-drop circuits tailored for business accounts with consolidated weekly billing.
          </p>
          <ul className="space-y-2 text-xs text-text-muted border-t border-border pt-4">
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-primary" /> Fixed route timing windows
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-primary" /> Consistent assigned driver familiar with site
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-primary" /> Volume surcharge discounts applied
            </li>
          </ul>
          <Link href="/quote?service=scheduled" className="block pt-2">
            <Button variant="secondary" size="sm" className="w-full">
              Quote Scheduled Run
            </Button>
          </Link>
        </div>
      </div>

      {/* Depot Hub Facilities */}
      <div className="bg-surface rounded-md border border-border p-8 space-y-6">
        <h2 className="font-serif text-2xl text-ink font-normal">
          Direct Operating Depot Infrastructure
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="border border-border/70 p-4 rounded bg-surface-elevated">
            <strong className="text-sm font-semibold text-ink block">Melbourne (Head Office)</strong>
            <span className="text-text-muted block mt-0.5">Port Melbourne VIC 3207</span>
            <p className="text-text-secondary mt-2">
              Main fleet maintenance facility, sorting depot, and central dispatch control desk.
            </p>
          </div>
          <div className="border border-border/70 p-4 rounded bg-surface-elevated">
            <strong className="text-sm font-semibold text-ink block">Sydney Hub</strong>
            <span className="text-text-muted block mt-0.5">Alexandria NSW 2015</span>
            <p className="text-text-secondary mt-2">
              Express distribution center covering CBD, North Shore, Parramatta, and airport precinct.
            </p>
          </div>
          <div className="border border-border/70 p-4 rounded bg-surface-elevated">
            <strong className="text-sm font-semibold text-ink block">Brisbane Hub</strong>
            <span className="text-text-muted block mt-0.5">Eagle Farm QLD 4009</span>
            <p className="text-text-secondary mt-2">
              Gateway hub servicing Greater Brisbane, Gold Coast corridor, and regional medical runs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
