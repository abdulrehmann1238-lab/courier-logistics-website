'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Drawer({
  isOpen,
  onClose,
  title,
  badge,
  children,
  width = 'w-full md:w-[500px]',
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  width?: string;
}) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-drawer overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#151B19]/40 backdrop-blur-[1px] transition-opacity duration-200 animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 ${width} bg-surface-elevated shadow-3 border-l border-border flex flex-col z-10 transition-transform duration-300 animate-in slide-in-from-right`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface shrink-0">
          <div className="flex items-center gap-2.5">
            {title && <h3 className="text-base font-semibold text-ink">{title}</h3>}
            {badge}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-ink hover:bg-surface-sunken rounded-sm transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
