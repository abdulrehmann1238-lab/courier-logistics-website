'use client';

import React from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useDemoStore();

  if (toasts.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-toast flex flex-col gap-2 max-w-sm w-full pointer-events-none select-none"
    >
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-success shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-error shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-warning shrink-0" />,
          info: <Info className="w-4 h-4 text-primary shrink-0" />,
        };

        const borderStyles = {
          success: 'border-success/30',
          error: 'border-error/30',
          warning: 'border-warning/30',
          info: 'border-border',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 bg-surface-elevated text-ink rounded-md shadow-3 border ${
              borderStyles[toast.type]
            } animate-in slide-in-from-bottom-3 duration-200`}
          >
            <div className="pt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-semibold text-ink leading-tight">{toast.title}</h5>
              {toast.message && (
                <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-muted hover:text-ink p-1 rounded-xs transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
