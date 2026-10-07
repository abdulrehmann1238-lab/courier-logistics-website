'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search, ShieldCheck, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { NetworkMap } from '../components/site/NetworkMap';
import { StatsStrip } from '../components/site/StatsStrip';
import { ServiceCard } from '../components/site/ServiceCard';
import { PinnedStory } from '../components/site/PinnedStory';
import { TrustSection } from '../components/site/TrustSection';

export default function LandingPage() {
  const router = useRouter();
  const [trackInput, setTrackInput] = useState('MRD-481920');

  function handleTrackSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trackInput.trim()) return;
    router.push(`/track/${trackInput.trim()}`);
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:py-24 px-6 overflow-hidden">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-sunken border border-border text-[11px] font-mono uppercase tracking-widest text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Melbourne · Sydney · Brisbane</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink font-normal leading-[1.05] tracking-tight">
              Every parcel, accounted for.
            </h1>

            <p className="text-text-secondary text-base sm:text-lg max-w-lg leading-relaxed">
              Same-day and next-day courier across the east coast, with live tracking and signed proof of delivery on every job.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link href="/quote">
                <Button variant="primary" size="lg" className="w-full sm:w-auto" iconRight={<ArrowRight className="w-4 h-4" />}>
                  Get an instant quote
                </Button>
              </Link>

              {/* Inline Quick Track Form */}
              <form onSubmit={handleTrackSubmit} className="flex items-center">
                <div className="relative w-full sm:w-56">
                  <input
                    type="text"
                    value={trackInput}
                    onChange={(e) => setTrackInput(e.target.value)}
                    placeholder="e.g. MRD-481920"
                    className="w-full h-12 bg-surface-elevated text-ink text-xs font-mono rounded-l-md border border-border-strong px-3 pl-8 focus:outline-none focus:border-primary"
                  />
                  <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <Button type="submit" variant="secondary" size="lg" className="rounded-l-none rounded-r-md border-l-0 text-xs px-3">
                  Track
                </Button>
              </form>
            </div>

            {/* Trust Micro-Row */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-primary" />
                <span>Live dispatch tracking</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Signed proof on every drop</span>
              </span>
              <span>·</span>
              <span>Business billing accounts</span>
            </div>
          </div>

          {/* Right Column: The Living Route Map Visual */}
          <div className="lg:col-span-6">
            <NetworkMap />
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <StatsStrip />

      {/* Services Section */}
      <section className="py-24 px-6 max-w-[1240px] mx-auto w-full">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-accent">
            Core Service Offerings
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-1">
            Engineered for predictable timelines.
          </h2>
          <p className="text-text-secondary text-sm max-w-lg mt-2">
            Clear SLA commitments across express point-to-point courier and scheduled business routes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard
            service={{
              id: 'sameday',
              title: 'Same-day Metro',
              badge: 'Express',
              priceFrom: '$16.00',
              desc: 'Dedicated urgent point-to-point courier across Melbourne, Sydney, and Brisbane metro areas within 2 to 4 hours.',
              icon: 'zap',
              features: ['Direct driver dispatch', '15m arrival notification', 'Signed POD within 60s of drop'],
            }}
          />
          <ServiceCard
            service={{
              id: 'nextday',
              title: 'Next-day Express',
              badge: 'Standard',
              priceFrom: '$11.00',
              desc: 'Inter-hub linehaul and outer metro delivery completed by 12:00pm or 5:00pm the following business day.',
              icon: 'clock',
              features: ['Overnight interstate trunking', 'Secure depot staging', 'Morning delivery window guarantee'],
            }}
          />
          <ServiceCard
            service={{
              id: 'scheduled',
              title: 'Scheduled Business Runs',
              badge: 'Contract',
              priceFrom: '$9.50',
              desc: 'Recurring daily or weekly multi-drop runs for laboratory, dental, and corporate architectural firms.',
              icon: 'calendar',
              features: ['Dedicated assigned courier', 'Fixed route rate discounts', 'Consolidated monthly invoicing'],
            }}
          />
        </div>
      </section>

      {/* Pinned "How It Works" Story */}
      <PinnedStory />

      {/* Trust & Ops Bridge */}
      <TrustSection />
    </div>
  );
}
