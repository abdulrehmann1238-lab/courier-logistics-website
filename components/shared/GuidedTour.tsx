'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDemoStore } from '../../store/useDemoStore';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

interface TourStop {
  step: number;
  title: string;
  desc: string;
  path: string;
  actionText: string;
}

const TOUR_STOPS: TourStop[] = [
  {
    step: 0,
    title: '1. The Living Route Hero',
    desc: 'Editorial linework network map with travelling parcels. Proves logistics domain craft with pure CSS & zero stock video.',
    path: '/',
    actionText: 'View Hero',
  },
  {
    step: 1,
    title: '2. Transparent Pricing Calculator',
    desc: 'Instant quote with live itemised rules (PR-01 to PR-14). Toggle Audit Lens to uncover rule overlap F-004.',
    path: '/quote',
    actionText: 'Try Quote',
  },
  {
    step: 2,
    title: '3. End-to-End Booking Flow',
    desc: '4-step checkout with address autocomplete, Luhn card check, and customer notification preview accordion.',
    path: '/book',
    actionText: 'Go to Booking',
  },
  {
    step: 3,
    title: '4. Driver Field App & Real POD',
    desc: 'Mobile-first driver interface with 6 status steps, HTML5 signature canvas, and offline simulation mode.',
    path: '/driver',
    actionText: 'Open Driver App',
  },
  {
    step: 4,
    title: '5. Operations Dispatch Suite',
    desc: 'Ops dashboard, live jobs table, 5-tab detail drawer, driver reassignments, and guided exceptions queue.',
    path: '/ops',
    actionText: 'Open Ops',
  },
  {
    step: 5,
    title: '6. The Audit Lens & Takeover Bid',
    desc: 'Architecture map, 24 findings, M0–M3 milestone roadmap, and animated safe-change deployment player with rollback.',
    path: '/audit',
    actionText: 'Review Audit',
  },
];

export function GuidedTour() {
  const router = useRouter();
  const { tourOpen, setTourOpen, tourStep, setTourStep, nextTourStep, prevTourStep } = useDemoStore();

  if (!tourOpen) return null;

  const current = TOUR_STOPS[tourStep] || TOUR_STOPS[0];

  function jumpToStep(stepIndex: number) {
    setTourStep(stepIndex);
    router.push(TOUR_STOPS[stepIndex].path);
  }

  return (
    <div className="fixed bottom-6 right-6 z-modal max-w-sm w-full bg-surface-elevated/95 backdrop-blur-md rounded-lg shadow-3 border border-border p-4 text-xs font-sans animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-start justify-between gap-2 pb-2 border-b border-border">
        <div className="flex items-center gap-1.5 font-semibold text-ink">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>90-Second Guided Tour</span>
          <span className="text-[10px] text-text-muted font-mono ml-1">
            ({tourStep + 1}/6)
          </span>
        </div>
        <button
          onClick={() => setTourOpen(false)}
          className="text-text-muted hover:text-ink p-1 rounded-xs"
          aria-label="Close Tour"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="py-2.5">
        <h4 className="font-semibold text-sm text-ink mb-1">{current.title}</h4>
        <p className="text-text-secondary leading-relaxed text-xs">{current.desc}</p>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-1">
          {TOUR_STOPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => jumpToStep(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === tourStep ? 'w-5 bg-primary' : 'bg-border-strong hover:bg-text-muted'
              }`}
              title={s.title}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {tourStep > 0 && (
            <button
              onClick={() => {
                prevTourStep();
                router.push(TOUR_STOPS[tourStep - 1].path);
              }}
              className="px-2 py-1 rounded-xs border border-border hover:bg-surface-sunken text-ink text-[11px] font-medium"
            >
              Back
            </button>
          )}

          {tourStep < TOUR_STOPS.length - 1 ? (
            <button
              onClick={() => {
                nextTourStep();
                router.push(TOUR_STOPS[tourStep + 1].path);
              }}
              className="px-2.5 py-1 rounded-xs bg-primary text-surface-elevated hover:bg-primary-hover text-[11px] font-medium flex items-center gap-1"
            >
              <span>Next stop</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <button
              onClick={() => setTourOpen(false)}
              className="px-2.5 py-1 rounded-xs bg-success text-surface-elevated text-[11px] font-medium flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Finish Tour</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
