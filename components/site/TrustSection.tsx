import React from 'react';
import Link from 'next/link';
import { Shield, Bell, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function TrustSection() {
  return (
    <section className="py-24 px-6 border-t border-border bg-surface">
      <div className="max-w-[1240px] mx-auto">
        {/* Two Columns Trust Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-5">
            <span className="text-xs font-mono uppercase tracking-widest text-accent">
              Chain of Custody
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-1 leading-tight">
              Built for jobs that cannot go wrong.
            </h2>
            <p className="text-text-secondary text-sm mt-3 leading-relaxed">
              Medical laboratories, legal partners, architectural studios, and precision manufacturers rely on Meridian when delivery failure is not an option.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-surface-elevated rounded border border-border">
              <Shield className="w-5 h-5 text-primary mb-2" />
              <h4 className="font-semibold text-sm text-ink">Proof on Every Job</h4>
              <p className="text-xs text-text-muted mt-1 leading-snug">
                Signed canvas and GPS coordinate lock captured on 100% of consignments.
              </p>
            </div>

            <div className="p-4 bg-surface-elevated rounded border border-border">
              <Bell className="w-5 h-5 text-accent mb-2" />
              <h4 className="font-semibold text-sm text-ink">Active Exception Alert</h4>
              <p className="text-xs text-text-muted mt-1 leading-snug">
                If an intercom fails or gate is locked, our ops desk notifies you in 15 minutes.
              </p>
            </div>

            <div className="p-4 bg-surface-elevated rounded border border-border">
              <CheckCircle className="w-5 h-5 text-secondary mb-2" />
              <h4 className="font-semibold text-sm text-ink">Transparent Pricing</h4>
              <p className="text-xs text-text-muted mt-1 leading-snug">
                Itemised fuel levy and distance bands. The quote you receive is the final invoice.
              </p>
            </div>
          </div>
        </div>

        {/* Fictional Client Logos Wordmarks */}
        <div className="pt-8 border-t border-border/60">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted text-center block mb-6">
            Trusted by precision Australian enterprises
          </span>
          <div className="flex flex-wrap items-center justify-between gap-8 opacity-70">
            <span className="font-serif text-xl text-ink tracking-tight font-normal">
              Harlow & Finch Architects
            </span>
            <span className="font-sans font-semibold tracking-wider text-sm uppercase text-text-secondary">
              Tasman Dental Supply
            </span>
            <span className="font-mono text-sm tracking-tight text-ink font-semibold">
              NORTHGATE LABS
            </span>
            <span className="font-serif italic text-lg text-text-secondary">
              Ostrava Printworks
            </span>
            <span className="font-sans text-sm font-semibold tracking-tight text-ink">
              Cobalt Bike Co.
            </span>
          </div>
        </div>

        {/* Ops Bridge Card (Reviewer Shortcut) */}
        <div className="mt-20 bg-dark-bg text-on-dark rounded-lg p-8 sm:p-10 border border-[#2E3C37] relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-accent">
              Platform Takeover Bid Preview
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-on-dark font-normal mt-1 leading-tight">
              See the operations side.
            </h3>
            <p className="text-text-muted text-sm mt-3 leading-relaxed">
              Explore the operations dispatcher dashboard, driver field application, and the interactive Audit Lens reviewing the client codebase architecture.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/ops">
                <Button variant="accent" size="sm" iconRight={<ArrowRight className="w-3.5 h-3.5" />}>
                  Open Ops Dashboard
                </Button>
              </Link>
              <Link href="/driver">
                <Button variant="secondary" size="sm" className="bg-[#1D2522] text-on-dark border-[#3A4A44] hover:bg-[#25302C]">
                  Open Driver Mobile App
                </Button>
              </Link>
              <Link href="/audit">
                <Button variant="ghost" size="sm" className="text-on-dark hover:bg-[#1D2522]">
                  Review Platform Audit Plan ↗
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
