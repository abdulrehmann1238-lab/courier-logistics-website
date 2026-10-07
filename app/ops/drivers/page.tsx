'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemoStore } from '../../../store/useDemoStore';
import { Driver } from '../../../mocks/drivers';
import { Button } from '../../../components/ui/Button';
import { FindingPin } from '../../../components/audit/FindingPin';
import {
  Users,
  Truck,
  Phone,
  MessageSquare,
  MapPin,
  Star,
  CheckCircle2,
  Clock,
  Shield,
} from 'lucide-react';

export default function DriversPage() {
  const { drivers, jobs, selectedDepot, updateDriverStatus, addToast } = useDemoStore();

  const [depotFilter, setDepotFilter] = useState<string>(selectedDepot);
  const [selectedDriverId, setSelectedDriverId] = useState<string>(drivers[0]?.id || 'D-101');

  const filteredDrivers = drivers.filter(
    (d) => depotFilter === 'All' || d.depot === depotFilter
  );

  const activeDriver = drivers.find((d) => d.id === selectedDriverId) || filteredDrivers[0];

  function handleMessageDriver(name: string) {
    addToast({
      type: 'info',
      title: `Message Dispatched to ${name}`,
      message: 'Simulated cellular dispatch message delivered to vehicle console.',
    });
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
            Fleet Operations & Mobile Workforce
          </span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-0.5">
            Courier Roster & Telemetry
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <FindingPin findingId="F-015" label="Driver State Enums" />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between bg-surface p-4 rounded-md border border-border shadow-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-text-muted font-medium">Filter Depot:</span>
          {['All', 'Melbourne', 'Sydney', 'Brisbane'].map((depot) => (
            <button
              key={depot}
              onClick={() => setDepotFilter(depot)}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                depotFilter === depot
                  ? 'bg-primary text-surface-elevated font-medium'
                  : 'bg-surface-sunken text-text-secondary hover:text-ink'
              }`}
            >
              {depot}
            </button>
          ))}
        </div>
        <span className="font-mono text-text-muted">
          {filteredDrivers.length} active couriers
        </span>
      </div>

      {/* Grid: Driver List (5 cols) & Live Telemetry Map (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 cols: Driver Roster Cards */}
        <div className="lg:col-span-5 bg-surface rounded-md border border-border overflow-hidden shadow-1 divide-y divide-border/60">
          {filteredDrivers.map((driver) => {
            const isSelected = activeDriver?.id === driver.id;
            return (
              <div
                key={driver.id}
                onClick={() => setSelectedDriverId(driver.id)}
                className={`p-4 cursor-pointer transition-colors text-xs space-y-2 ${
                  isSelected
                    ? 'bg-primary-tint/40 border-l-2 border-primary'
                    : 'hover:bg-surface-sunken'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-ink">{driver.id}</span>
                    <strong className="text-ink">{driver.name}</strong>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      driver.status === 'On job'
                        ? 'bg-primary-tint text-primary'
                        : driver.status === 'Available'
                        ? 'bg-success-tint text-success'
                        : 'bg-warning-tint text-warning'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {driver.status}
                  </span>
                </div>

                <div className="text-[11px] text-text-secondary flex justify-between">
                  <span>{driver.vehicle} ({driver.vehiclePlate})</span>
                  <span className="font-mono text-text-muted">{driver.depot} Depot</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-text-muted pt-1 border-t border-border/40">
                  <span>{driver.completedToday} consignments completed today</span>
                  <span className="flex items-center gap-1 text-ink font-medium">
                    <Star className="w-3 h-3 text-warning fill-warning" /> {driver.rating}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 7 cols: Driver Telemetry & Stylised Map Card */}
        <div className="lg:col-span-7 bg-surface-elevated rounded-md border border-border p-6 shadow-2 space-y-6">
          {activeDriver ? (
            <>
              {/* Active Driver Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-primary">
                      {activeDriver.id}
                    </span>
                    <span className="text-xs text-text-muted">· {activeDriver.depot} Depot</span>
                  </div>
                  <h3 className="text-xl font-serif text-ink font-normal mt-0.5">
                    {activeDriver.name}
                  </h3>
                  <span className="text-xs text-text-secondary">
                    {activeDriver.vehicle} ({activeDriver.vehiclePlate})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleMessageDriver(activeDriver.name)}
                    icon={<MessageSquare className="w-3.5 h-3.5" />}
                  >
                    Message
                  </Button>
                </div>
              </div>

              {/* Status & Shift Controls */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-surface rounded border border-border">
                  <span className="text-text-muted block text-[11px]">Direct Line</span>
                  <strong className="text-ink font-mono">{activeDriver.phoneMasked}</strong>
                </div>
                <div className="p-3 bg-surface rounded border border-border">
                  <span className="text-text-muted block text-[11px]">Today Completed</span>
                  <strong className="text-ink font-serif text-lg">{activeDriver.completedToday}</strong>
                </div>
                <div className="p-3 bg-surface rounded border border-border">
                  <span className="text-text-muted block text-[11px]">Driver Rating</span>
                  <strong className="text-ink font-serif text-lg">{activeDriver.rating} / 5.0</strong>
                </div>
              </div>

              {/* Stylised Linework Regional Route Visual */}
              <div className="bg-surface rounded-md border border-border p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    Simulated Telemetry Track ({activeDriver.depot} Metro Area)
                  </span>
                  <span className="font-mono text-[11px] text-text-muted">
                    Lat {activeDriver.lat} · Lng {activeDriver.lng}
                  </span>
                </div>

                {/* SVG linework route */}
                <div className="w-full h-44 bg-surface-sunken/60 rounded border border-border/80 relative overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 400 160" fill="none">
                    {/* Road Network Linework */}
                    <path
                      d="M 20 80 Q 90 20, 160 70 T 260 110 T 380 60"
                      stroke="#C5BEB0"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <path
                      d="M 60 140 Q 140 100, 200 40 T 320 80"
                      stroke="#C5BEB0"
                      strokeWidth="1.5"
                    />

                    {/* Driver Position Node */}
                    <circle cx="200" cy="75" r="7" fill="#2E4A42" />
                    <circle cx="200" cy="75" r="14" fill="#2E4A42" opacity="0.2" className="animate-ping" />

                    {/* Depot Hub Node */}
                    <circle cx="60" cy="80" r="5" fill="#B4633F" />
                    <text x="68" y="84" className="text-[10px] font-mono fill-[#4A5550]">
                      Depot
                    </text>

                    {/* Next Stop Node */}
                    <circle cx="340" cy="65" r="5" fill="#3E7A58" />
                    <text x="310" y="55" className="text-[10px] font-mono fill-[#4A5550]">
                      Next Drop
                    </text>
                  </svg>
                </div>
              </div>

              {/* Current Job Link */}
              {activeDriver.currentJobId ? (
                <div className="p-3 bg-primary-tint/30 rounded border border-primary/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-text-muted text-[11px] block">Current Active Job:</span>
                    <strong className="text-ink font-mono">{activeDriver.currentJobId}</strong>
                  </div>
                  <Link href={`/track/${activeDriver.currentJobId}`}>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Inspect Consignment ↗
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="p-3 bg-surface-sunken rounded text-xs text-text-muted text-center">
                  Driver currently available for instant job allocation.
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center text-text-muted text-xs">
              Select a courier to view vehicle details and telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
