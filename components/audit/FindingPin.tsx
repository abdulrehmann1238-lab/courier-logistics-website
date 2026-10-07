'use client';

import React from 'react';
import { useDemoStore } from '../../store/useDemoStore';

export function FindingPin({
  findingId,
  label,
  className = '',
}: {
  findingId: string;
  label?: string;
  className?: string;
}) {
  const { auditLensActive, setActiveFindingId, seenFindingIds } = useDemoStore();

  if (!auditLensActive) return null;

  const isSeen = seenFindingIds.includes(findingId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setActiveFindingId(findingId);
      }}
      className={`relative inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/15 border border-accent/40 text-accent text-[11px] font-mono font-medium hover:bg-accent hover:text-surface-elevated transition-colors z-20 cursor-pointer shadow-sm ${className}`}
      title={`Audit Lens Finding: ${findingId}`}
    >
      <span className="relative flex h-2 w-2">
        {!isSeen && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
        )}
        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
      </span>
      <span>{findingId}</span>
    </button>
  );
}
