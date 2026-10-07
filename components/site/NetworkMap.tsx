'use client';

import React, { useState } from 'react';

interface CityNode {
  name: string;
  state: string;
  x: number;
  y: number;
  activeJobs: number;
}

const CITIES: CityNode[] = [
  { name: 'Brisbane', state: 'QLD', x: 380, y: 120, activeJobs: 14 },
  { name: 'Gold Coast', state: 'QLD', x: 395, y: 155, activeJobs: 6 },
  { name: 'Newcastle', state: 'NSW', x: 360, y: 260, activeJobs: 5 },
  { name: 'Sydney', state: 'NSW', x: 345, y: 310, activeJobs: 26 },
  { name: 'Canberra', state: 'ACT', x: 310, y: 350, activeJobs: 8 },
  { name: 'Melbourne', state: 'VIC', x: 250, y: 440, activeJobs: 38 },
  { name: 'Geelong', state: 'VIC', x: 220, y: 460, activeJobs: 7 },
];

export function NetworkMap() {
  const [hoveredCity, setHoveredCity] = useState<CityNode | null>(null);

  return (
    <div className="relative w-full aspect-[4/3] max-w-[580px] mx-auto select-none">
      {/* Editorial East Coast Map SVG */}
      <svg
        viewBox="0 0 500 520"
        className="w-full h-full overflow-visible"
        aria-label="Meridian East Coast Logistics Linework Map"
      >
        <defs>
          <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Stylised East-Coast Continental Outline */}
        <path
          d="M 330 30 Q 360 80, 410 130 T 430 200 Q 400 240, 380 290 T 350 360 Q 310 400, 260 450 T 170 480 Q 140 485, 120 460"
          fill="none"
          stroke="#DDD7CC"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Route Linework connecting nodes */}
        {/* Brisbane -> Sydney */}
        <path
          id="route-bne-syd"
          d="M 380 120 Q 390 210, 345 310"
          fill="none"
          stroke="#4A5550"
          strokeWidth="1"
          strokeOpacity="0.35"
        />
        {/* Sydney -> Melbourne */}
        <path
          id="route-syd-mel"
          d="M 345 310 Q 320 380, 250 440"
          fill="none"
          stroke="#4A5550"
          strokeWidth="1"
          strokeOpacity="0.35"
        />
        {/* Melbourne -> Geelong */}
        <path
          id="route-mel-gee"
          d="M 250 440 L 220 460"
          fill="none"
          stroke="#4A5550"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        {/* Sydney -> Canberra */}
        <path
          id="route-syd-cbr"
          d="M 345 310 L 310 350"
          fill="none"
          stroke="#4A5550"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        {/* Canberra -> Melbourne */}
        <path
          id="route-cbr-mel"
          d="M 310 350 L 250 440"
          fill="none"
          stroke="#4A5550"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        {/* Brisbane -> Gold Coast */}
        <path
          id="route-bne-gld"
          d="M 380 120 L 395 155"
          fill="none"
          stroke="#4A5550"
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* Moving Parcel Markers (using CSS animations along paths) */}
        {/* Parcel 1 (Sydney to Melbourne, Green) */}
        <circle r="3.5" fill="#2E4A42">
          <animateMotion
            dur="9s"
            repeatCount="indefinite"
            path="M 345 310 Q 320 380, 250 440"
          />
        </circle>

        {/* Parcel 2 (Melbourne to Sydney, Green) */}
        <circle r="3" fill="#2E4A42" opacity="0.8">
          <animateMotion
            dur="12s"
            begin="3s"
            repeatCount="indefinite"
            path="M 250 440 Q 320 380, 345 310"
          />
        </circle>

        {/* Parcel 3 (Brisbane to Sydney, Green) */}
        <circle r="3" fill="#2E4A42" opacity="0.8">
          <animateMotion
            dur="14s"
            repeatCount="indefinite"
            path="M 380 120 Q 390 210, 345 310"
          />
        </circle>

        {/* Parcel 4 (Sydney to Brisbane, Green) */}
        <circle r="3" fill="#2E4A42" opacity="0.8">
          <animateMotion
            dur="13s"
            begin="5s"
            repeatCount="indefinite"
            path="M 345 310 Q 390 210, 380 120"
          />
        </circle>

        {/* Parcel 5 (Melbourne to Geelong, Green) */}
        <circle r="3" fill="#2E4A42" opacity="0.8">
          <animateMotion
            dur="6s"
            repeatCount="indefinite"
            path="M 250 440 L 220 460"
          />
        </circle>

        {/* Highlighted Accent Parcel MRD-481920 (Clay Dot) */}
        <circle r="4.5" fill="#B4633F" filter="url(#subtleGlow)">
          <animateMotion
            dur="10s"
            repeatCount="indefinite"
            path="M 250 440 Q 320 380, 345 310"
          />
        </circle>

        {/* City Nodes */}
        {CITIES.map((city) => {
          const isHovered = hoveredCity?.name === city.name;
          return (
            <g
              key={city.name}
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredCity(city)}
              onMouseLeave={() => setHoveredCity(null)}
            >
              {/* Target zone */}
              <circle cx={city.x} cy={city.y} r="14" fill="transparent" />

              {/* Node Outer ring */}
              <circle
                cx={city.x}
                cy={city.y}
                r={isHovered ? 6 : 4.5}
                fill={isHovered ? '#2E4A42' : '#FBFAF7'}
                stroke="#2E4A42"
                strokeWidth="1.5"
                className="transition-all duration-200"
              />

              {/* Label */}
              <text
                x={city.x + 9}
                y={city.y + 4}
                className="text-[11px] font-sans fill-[#4A5550] group-hover:fill-[#1D2421] group-hover:font-medium select-none transition-colors"
              >
                {city.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Tracked Consignment Card */}
      <div className="absolute top-20 right-4 sm:right-8 bg-surface-elevated/95 backdrop-blur-md rounded-md p-3 shadow-2 border border-border text-xs max-w-[210px] animate-in fade-in duration-300">
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-1.5 mb-1.5">
          <span className="font-mono font-semibold text-primary">MRD-481920</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            In transit
          </span>
        </div>
        <div className="space-y-0.5 text-text-secondary">
          <div className="flex justify-between">
            <span className="text-text-muted">Route:</span>
            <span className="font-medium text-ink">MEL → SYD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Courier:</span>
            <span className="text-ink">Callum Ng</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Est. Arrival:</span>
            <span className="font-mono text-ink font-medium">14:20</span>
          </div>
        </div>
      </div>

      {/* City Tooltip */}
      {hoveredCity && (
        <div
          className="absolute pointer-events-none bg-surface-elevated px-2.5 py-1.5 rounded shadow-2 border border-border text-[11px] z-20"
          style={{
            left: `${(hoveredCity.x / 500) * 100}%`,
            top: `${(hoveredCity.y / 520) * 100 - 10}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-semibold text-ink">
            {hoveredCity.name}, {hoveredCity.state}
          </div>
          <div className="text-text-muted text-[10px]">
            {hoveredCity.activeJobs} consignments today
          </div>
        </div>
      )}
    </div>
  );
}
