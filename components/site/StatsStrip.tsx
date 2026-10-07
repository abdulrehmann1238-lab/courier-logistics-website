'use client';

import React, { useEffect, useState } from 'react';

interface StatItem {
  numeral: string;
  label: string;
  detail: string;
}

const STATS: StatItem[] = [
  { numeral: '98.7%', label: 'On-time delivery', detail: 'Rolling 90-day SLA performance' },
  { numeral: '42,000+', label: 'Consignments annually', detail: 'East coast metro & regional linehaul' },
  { numeral: '100%', label: 'Proof of Delivery', detail: 'Signed or photographed on every single drop' },
  { numeral: '3 States', label: 'Direct operational reach', detail: 'VIC, NSW & QLD depot network' },
];

export function StatsStrip() {
  return (
    <section className="bg-surface-sunken border-y border-border py-12 px-6">
      <div className="max-w-[1240px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map((stat, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="font-serif text-3xl sm:text-4xl text-ink tracking-tight tabular-nums font-normal">
              {stat.numeral}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary mt-1">
              {stat.label}
            </span>
            <span className="text-xs text-text-muted mt-0.5">
              {stat.detail}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
