import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-surface-sunken rounded-sm animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className = '',
}: {
  tabs: { id: T; label: string; badge?: number | string }[];
  activeTab: T;
  onChange: (id: T) => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1 border-b border-border ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative py-2.5 px-3.5 text-xs font-medium transition-colors select-none ${
              isActive ? 'text-primary font-semibold' : 'text-text-secondary hover:text-ink'
            }`}
          >
            <span className="flex items-center gap-1.5">
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-primary-tint text-primary' : 'bg-surface-sunken text-text-muted'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all duration-200" />
            )}
          </button>
        );
      })}
    </div>
  );
}
