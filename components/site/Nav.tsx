'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Search } from 'lucide-react';
import { Button } from '../ui/Button';

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trackNumber, setTrackNumber] = useState('');

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname.startsWith('/ops') || pathname.startsWith('/driver')) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-nav w-full transition-all duration-200 ${
        scrolled
          ? 'bg-surface/95 backdrop-blur-md border-b border-border shadow-1'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-6 h-16 md:h-18 flex items-center justify-between gap-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-8 h-8 rounded-full border border-primary flex items-center justify-center bg-surface-elevated shadow-1 group-hover:border-primary-hover transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="24" stroke="#2E4A42" strokeWidth="2.5" />
              <line x1="30" y1="6" x2="30" y2="54" stroke="#B4633F" strokeWidth="2.5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl tracking-tight text-ink font-normal leading-none">
              Meridian
            </span>
            <span className="text-[10px] tracking-widest uppercase text-text-muted mt-0.5">
              Couriers
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-medium text-text-secondary">
          <Link href="/services" className="hover:text-ink transition-colors">
            Services
          </Link>
          <a href="/#how-it-works" className="hover:text-ink transition-colors">
            How It Works
          </a>
          <Link href="/track/MRD-481920" className="hover:text-ink transition-colors">
            Tracking
          </Link>

          {/* Reviewer shortcuts with Demo pills */}
          <Link
            href="/ops"
            className="flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors py-1 px-2 rounded-xs hover:bg-surface-sunken"
          >
            <span>Operations</span>
            <span className="text-[10px] font-mono uppercase bg-primary-tint text-primary px-1 rounded">
              Demo
            </span>
          </Link>

          <Link
            href="/audit"
            className="flex items-center gap-1.5 text-text-secondary hover:text-accent transition-colors py-1 px-2 rounded-xs hover:bg-accent-tint/30"
          >
            <span>Audit Lens</span>
            <span className="text-[10px] font-mono uppercase bg-accent-tint text-accent px-1 rounded">
              Review
            </span>
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/track/MRD-481920">
            <Button variant="ghost" size="sm">
              Track Parcel
            </Button>
          </Link>
          <Link href="/quote">
            <Button variant="primary" size="sm" iconRight={<ArrowRight className="w-3.5 h-3.5" />}>
              Get a Quote
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-text-secondary hover:text-ink"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Sheet */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-surface-elevated border-b border-border shadow-3 p-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-4 text-sm font-medium">
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border/50 text-ink"
            >
              Services & Coverage
            </Link>
            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border/50 text-ink"
            >
              How It Works
            </a>
            <Link
              href="/track/MRD-481920"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border/50 text-ink"
            >
              Live Tracking
            </Link>
            <Link
              href="/ops"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border/50 text-primary flex items-center justify-between"
            >
              <span>Operations Dispatch</span>
              <span className="text-xs font-mono bg-primary-tint px-1.5 py-0.5 rounded">Demo</span>
            </Link>
            <Link
              href="/audit"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border/50 text-accent flex items-center justify-between"
            >
              <span>Platform Takeover Audit</span>
              <span className="text-xs font-mono bg-accent-tint px-1.5 py-0.5 rounded">Review</span>
            </Link>
            <div className="pt-2 flex flex-col gap-2.5">
              <Link href="/quote" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">
                  Get Instant Quote
                </Button>
              </Link>
              <Link href="/driver" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" className="w-full">
                  Open Driver Mobile App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
