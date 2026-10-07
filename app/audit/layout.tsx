'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  GitMerge,
  ListFilter,
  Milestone as MilestoneIcon,
  CheckCircle,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const auditNav = [
    { href: '/audit', label: 'Audit Overview', icon: ShieldAlert },
    { href: '/audit/architecture', label: 'Architecture Map', icon: GitMerge },
    { href: '/audit/findings', label: 'Findings Register', icon: ListFilter },
    { href: '/audit/roadmap', label: 'Milestone Roadmap', icon: MilestoneIcon },
    { href: '/audit/protocol', label: 'Safe Deploy Protocol', icon: CheckCircle },
    { href: '/audit/approach', label: 'Approach & Case Studies', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-bg font-sans">
      {/* Sub-header navigation for Audit Suite */}
      <div className="bg-surface border-b border-border sticky top-10 z-sticky select-none">
        <div className="max-w-[1240px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="font-serif text-lg text-ink font-normal">
                Takeover Audit Lens
              </span>
            </div>
            <span className="hidden sm:inline text-xs font-mono text-text-muted bg-surface-sunken px-2 py-0.5 rounded">
              Read-Only Technical Evaluation
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs text-text-secondary hover:text-ink flex items-center gap-1 font-medium"
            >
              <span>Back to Demo</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Tab Links */}
        <div className="max-w-[1240px] mx-auto px-6 flex items-center gap-1 overflow-x-auto text-xs font-medium pb-2">
          {auditNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/audit'
                ? pathname === '/audit'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-accent text-surface-elevated font-semibold shadow-sm'
                    : 'text-text-secondary hover:bg-surface-sunken hover:text-ink'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Audit Content */}
      <main className="max-w-[1240px] mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
