'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/Button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (pathname.startsWith('/ops') || pathname.startsWith('/driver')) {
    return null;
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setIsSending(true);
    await new Promise((res) => setTimeout(res, 800));
    setIsSending(false);
    setSubmitted(true);
  }

  return (
    <footer className="bg-dark-bg text-on-dark pt-24 pb-12 px-6 overflow-hidden relative border-t border-[#25302C]">
      <div className="max-w-[1240px] mx-auto">
        {/* Top Split: Questions & Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 border-b border-[#25302C]">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-accent">
              Direct Dispatch Support
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-on-dark font-normal leading-tight">
              Questions about a delivery?
            </h2>
            <p className="text-text-muted text-sm max-w-md leading-relaxed">
              Our Port Melbourne operational dispatch desk responds directly within 15 minutes, 6:00am–8:00pm AEST Monday through Friday.
            </p>
            <div className="pt-4 flex flex-wrap gap-4 text-xs font-mono text-text-muted">
              <div>
                <span className="block text-on-dark">Head Office</span>
                <span>Port Melbourne VIC 3207</span>
              </div>
              <div className="border-l border-[#2E3C37] pl-4">
                <span className="block text-on-dark">Phone</span>
                <span>1300 000 MRD</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-6">
            <div className="bg-dark-surface p-6 rounded-md border border-[#2E3C37]">
              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-success-tint/20 text-success flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-xl text-on-dark">Message received</h4>
                  <p className="text-xs text-text-muted max-w-xs mx-auto">
                    Thanks {name || 'there'}, Priya from our Port Melbourne dispatch team will reply shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <h4 className="text-sm font-semibold text-on-dark">
                    Quick dispatch enquiry
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase font-mono text-text-muted mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Shannon Reyes"
                        className="w-full bg-[#151B19] border border-[#2E3C37] rounded-sm px-3 py-2 text-xs text-on-dark focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-mono text-text-muted mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com.au"
                        className="w-full bg-[#151B19] border border-[#2E3C37] rounded-sm px-3 py-2 text-xs text-on-dark focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase font-mono text-text-muted mb-1">
                      Message / Job Reference
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Include your consignment number if checking status..."
                      className="w-full bg-[#151B19] border border-[#2E3C37] rounded-sm px-3 py-2 text-xs text-on-dark focus:outline-none focus:border-accent resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="accent"
                    size="sm"
                    isLoading={isSending}
                    className="w-full"
                  >
                    Send message to dispatch
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4 Navigation Link Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-14 text-xs">
          <div>
            <h5 className="font-semibold text-on-dark uppercase tracking-wider text-[11px] mb-3">
              Courier Services
            </h5>
            <ul className="space-y-2 text-text-muted">
              <li>
                <Link href="/quote?service=sameday" className="hover:text-on-dark transition-colors">
                  Same-day Metro
                </Link>
              </li>
              <li>
                <Link href="/quote?service=nextday" className="hover:text-on-dark transition-colors">
                  Next-day Express
                </Link>
              </li>
              <li>
                <Link href="/quote?service=scheduled" className="hover:text-on-dark transition-colors">
                  Scheduled Business Runs
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-on-dark transition-colors">
                  Interstate Linehaul
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-on-dark uppercase tracking-wider text-[11px] mb-3">
              Operations & Demo
            </h5>
            <ul className="space-y-2 text-text-muted">
              <li>
                <Link href="/ops" className="hover:text-on-dark transition-colors">
                  Ops Dashboard
                </Link>
              </li>
              <li>
                <Link href="/ops/jobs" className="hover:text-on-dark transition-colors">
                  Live Consignments
                </Link>
              </li>
              <li>
                <Link href="/ops/exceptions" className="hover:text-on-dark transition-colors">
                  Exceptions Queue
                </Link>
              </li>
              <li>
                <Link href="/driver" className="hover:text-on-dark transition-colors">
                  Mobile Driver App
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-on-dark uppercase tracking-wider text-[11px] mb-3">
              Platform Takeover
            </h5>
            <ul className="space-y-2 text-text-muted">
              <li>
                <Link href="/audit" className="text-accent hover:underline">
                  Audit Scorecard
                </Link>
              </li>
              <li>
                <Link href="/audit/architecture" className="hover:text-on-dark transition-colors">
                  Architecture Map
                </Link>
              </li>
              <li>
                <Link href="/audit/findings" className="hover:text-on-dark transition-colors">
                  24 Audit Findings
                </Link>
              </li>
              <li>
                <Link href="/audit/protocol" className="hover:text-on-dark transition-colors">
                  Safe Deploy Protocol
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-on-dark uppercase tracking-wider text-[11px] mb-3">
              Compliance & Legal
            </h5>
            <ul className="space-y-2 text-text-muted">
              <li>
                <span className="cursor-not-allowed text-text-muted" title="Demo mode">
                  Standard Terms of Carriage
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed text-text-muted" title="Demo mode">
                  Dangerous Goods Policy
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed text-text-muted" title="Demo mode">
                  Australian Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-[11px] font-mono text-[#6A7872]">ABN 00 000 000 000</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Audit Callout Banner */}
        <div className="p-4 rounded-md bg-[#1D2522] border border-[#2E3C37] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs mb-10">
          <p className="text-text-muted">
            <span className="text-on-dark font-medium">Built as an interactive takeover demonstration.</span> Ready to review your real platform codebase safely:
          </p>
          <Link
            href="/audit"
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-accent text-surface-elevated font-medium hover:brightness-110 transition-all"
          >
            <span>Start with the Audit Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Bottom Meta & Faint Giant Serif Wordmark */}
        <div className="pt-6 border-t border-[#25302C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div>© 2026 Meridian Couriers · Interactive Takeover Bid Demo · Fictional Data</div>
          <div className="font-mono text-[11px]">Stack: Next.js · React · TypeScript · PostgreSQL Mock</div>
        </div>

        {/* Faint Giant Background Watermark */}
        <div
          aria-hidden="true"
          className="font-serif text-[120px] sm:text-[180px] lg:text-[240px] text-on-dark opacity-[0.03] select-none pointer-events-none text-center -mb-20 sm:-mb-28 font-normal leading-none"
        >
          Meridian
        </div>
      </div>
    </footer>
  );
}
