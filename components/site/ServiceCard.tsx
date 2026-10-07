import React from 'react';
import Link from 'next/link';
import { Clock, Zap, Calendar, ArrowRight } from 'lucide-react';

interface ServiceProps {
  id: string;
  title: string;
  badge: string;
  priceFrom: string;
  desc: string;
  features: string[];
  icon: 'zap' | 'clock' | 'calendar';
}

export function ServiceCard({ service }: { service: ServiceProps }) {
  const icons = {
    zap: <Zap className="w-5 h-5 text-accent" />,
    clock: <Clock className="w-5 h-5 text-primary" />,
    calendar: <Calendar className="w-5 h-5 text-secondary" />,
  };

  return (
    <div className="bg-surface rounded-md border border-border p-6 flex flex-col justify-between hover:border-border-strong hover:-translate-y-0.5 hover:shadow-2 transition-all duration-200">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-sm bg-surface-sunken flex items-center justify-center">
            {icons[service.icon]}
          </div>
          <span className="font-mono text-xs text-text-secondary bg-surface-sunken px-2 py-0.5 rounded-xs">
            From {service.priceFrom}
          </span>
        </div>

        <h3 className="font-sans text-lg font-semibold text-ink">{service.title}</h3>
        <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{service.desc}</p>

        <ul className="mt-4 space-y-1.5 border-t border-border/50 pt-4">
          {service.features.map((feat, idx) => (
            <li key={idx} className="text-xs text-text-muted flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-primary" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-6 mt-4 border-t border-border/40">
        <Link
          href={`/quote?service=${service.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover group"
        >
          <span>Calculate {service.title} Quote</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
