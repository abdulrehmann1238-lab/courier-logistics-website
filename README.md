# Meridian Couriers — Logistics Platform & Takeover Audit Lens

A high-fidelity interactive demonstration of **Meridian Couriers** (a Melbourne-based express courier logistics platform) coupled with the **Audit Lens Takeover Framework**.

This application is engineered specifically for a technical takeover bid. It proves both **deep logistics product craft** (instant pricing, 4-step booking, live dispatch operations, mobile driver app with real signature capture, and customer tracking) and **engineering rigor & communication** (interactive architecture topology, 24-finding audit register, capacity-planned M0–M3 roadmap, and a simulated safe-deploy rollback protocol).

---

## Key Features & Demonstrated Workflows

### 1. Customer Freight Experience
* **Instant Dynamic Quoting (`/quote`):** Multi-tier pricing calculation across Melbourne, Sydney, and Brisbane suburbs with live itemised breakdown lines (`PR-01` to `PR-14`).
* **End-to-End Booking (`/book`):** 4-step stepper with address autocomplete, declared value warranties, fragile/signature flags, Luhn card validation, and customer notification preview accordions.
* **Live Consignment Tracking (`/track/[id]`):** Real-time chain of custody vertical timeline, driver assignment, geotag coordinates, verified signature proof of delivery, and exception alerts.

### 2. Operations Console (`/ops`)
* **Real-Time KPIs:** Active jobs, delivered consignments, rolling on-time SLA sparklines, and depot capacity stacked bars.
* **Consignments Register (`/ops/jobs`):** Filterable, searchable data table with a 5-tab detail drawer (**Overview**, **Timeline**, **Pricing**, **POD**, **Comms**) and live courier reassignment.
* **Exceptions Desk (`/ops/exceptions`):** Guided operational incident workflow with automated resolution logging.
* **Fleet Telemetry (`/ops/drivers`):** Live driver status, vehicle manifests, and simulated regional telemetry linework map.
* **Commercial Pricing Engine (`/ops/pricing`):** Complete schedule of business rules with an interactive simulator and live toggle for the proposed F-004 fix.
* **Outbound Communications (`/ops/notifications`):** Live transmission logs with device-framed SMS and email previews.

### 3. Driver Field App (`/driver`)
* **Mobile-First Interface:** Formatted in a realistic 390×844 device frame on desktop and full viewport on mobile.
* **6-Stage Status Progression:** Step jobs through *Accepted → Arrived at pickup → Picked up → Start delivery → Arrived → Complete*.
* **HTML5 Signature Canvas:** Real pointer-driven signature pad with stroke smoothing, instant clear, and typed legal fallback.
* **Offline Field Simulation:** Toggle offline mode via the Demo Bar to queue actions and test automatic reconnect sync.

### 4. The Takeover Audit Lens (`/audit`)
* **Executive Scorecard (`/audit`):** Strategic verdict, 6-area technical maturity scorecard, and top-5 urgent priorities.
* **Interactive Architecture Map (`/audit/architecture`):** SVG system diagram across Edge, Application, Database, and Integrations layers with animated data flow simulation.
* **24 Findings Register (`/audit/findings`):** Sortable table and 2×2 Business Impact vs Engineering Effort prioritisation matrix.
* **Milestone Roadmap (`/audit/roadmap`):** Phased M0–M3 roadmap with live capacity estimation math and change-control rules.
* **Safe-Change Protocol (`/audit/protocol`):** Animated deployment player demonstrating an automated 42-second rollback on simulated staging defect.
* **Methodology & Case Studies (`/audit/approach`):** 6-phase codebase takeover framework and documented past takeover examples.

---

## Technology Stack

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript 5
* **Styling:** Tailwind CSS mapped to strict design tokens (`styles/tokens.css`)
* **Typography:** Instrument Serif (display/numerals), Inter (UI/body), JetBrains Mono (code/IDs)
* **State Management:** Zustand with session persistence and event triggers
* **Icons:** Lucide React
* **Testing:** Pure unit tests in `lib/pricing.test.ts` via `tsx`

---

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run the Pricing Unit Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## Interactive Controls (Top Demo Bar)

* **Mode Switcher:** Instantly toggle between **Customer**, **Operations**, **Driver**, and **Audit Hub**.
* **Audit Lens Toggle:** Renders finding pins directly onto product interfaces.
* **Offline Mode:** Simulates field driver offline operation with pending action queuing.
* **Simulate API Error:** Injects a 500 error on the next server mutation to test fault tolerance.
* **Reset Demo:** Restores all seed consignments, driver rosters, and audit records in one click.
* **90-Second Guided Tour:** Step-by-step walkthrough highlighting the 6 core stops.
* **Command Palette (⌘K / Ctrl+K):** Fast fuzzy navigation across jobs, drivers, customers, and audit findings.

---

## License & Fictional Data Note

*Meridian Couriers* is a fictional Australian brand created for bid evaluation purposes. All data, driver manifests, and audit findings are illustrative representations designed to showcase technical competence, system design, and production safety discipline.
