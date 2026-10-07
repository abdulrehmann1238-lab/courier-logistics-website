'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function Loader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Deep links skip loader
    if (pathname !== '/') {
      setHidden(true);
      return;
    }

    // Check repeat visits
    const visited = sessionStorage.getItem('meridian_visited');
    if (visited) {
      setHidden(true);
      return;
    }

    setMounted(true);

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.floor((elapsed / 900) * 100));
      setProgress(pct);

      if (elapsed >= 1100) {
        clearInterval(interval);
        try {
          sessionStorage.setItem('meridian_visited', 'true');
        } catch {}
        setTimeout(() => {
          setHidden(true);
        }, 300);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [pathname]);

  if (hidden || !mounted) return null;

  return (
    <div
      className="fixed inset-0 z-loader bg-bg flex flex-col items-center justify-center transition-all duration-500 ease-in-out select-none"
      style={{
        clipPath: progress >= 100 ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)',
      }}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Monogram SVG drawing */}
        <div className="relative w-14 h-14">
          <svg className="w-14 h-14" viewBox="0 0 60 60" fill="none">
            {/* Outer Circle */}
            <circle
              cx="30"
              cy="30"
              r="24"
              stroke="#2E4A42"
              strokeWidth="1.5"
              strokeDasharray="150"
              strokeDashoffset={progress < 20 ? 150 : 0}
              className="transition-all duration-700 ease-out"
            />
            {/* Meridian Cross line */}
            <line
              x1="30"
              y1="6"
              x2="30"
              y2="54"
              stroke="#B4633F"
              strokeWidth="1.5"
              strokeDasharray="48"
              strokeDashoffset={progress < 40 ? 48 : 0}
              className="transition-all duration-500 ease-out"
            />
          </svg>
        </div>

        {/* Wordmark */}
        <div className="flex flex-col items-center">
          <span className="font-serif text-2xl tracking-tight text-ink">
            Meridian Couriers
          </span>
          <span className="text-[11px] uppercase tracking-widest text-text-muted mt-0.5">
            Melbourne · Sydney · Brisbane
          </span>
        </div>

        {/* 1px Hairline Progress Bar */}
        <div className="w-40 h-[1.5px] bg-border mt-3 overflow-hidden rounded-full">
          <div
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
