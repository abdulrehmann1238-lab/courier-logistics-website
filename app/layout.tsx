import '../styles/globals.css';
import type { Metadata } from 'next';
import { DemoBar } from '../components/shared/DemoBar';
import { Nav } from '../components/site/Nav';
import { Footer } from '../components/site/Footer';
import { AuditLensOverlay } from '../components/audit/AuditLensOverlay';
import { CommandPalette } from '../components/shared/CommandPalette';
import { ToastContainer } from '../components/shared/ToastContainer';
import { GuidedTour } from '../components/shared/GuidedTour';
import { Loader } from '../components/shared/Loader';

export const metadata: Metadata = {
  title: 'Meridian Couriers · Express Logistics Platform & Takeover Audit Lens',
  description:
    'Interactive demonstration of Meridian Couriers logistics platform and codebase takeover bid methodology. Melbourne, Sydney & Brisbane express point-to-point courier.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className="scroll-smooth">
      <body className="bg-bg text-ink min-h-screen flex flex-col font-sans antialiased overflow-x-hidden selection:bg-primary-tint selection:text-primary">
        {/* Entry Paper Loader */}
        <Loader />

        {/* Global Persistent Demo Bar */}
        <DemoBar />

        {/* Layout Shell */}
        <div className="flex-1 flex flex-col min-h-0">
          <Nav />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>

        {/* Global Overlays */}
        <AuditLensOverlay />
        <CommandPalette />
        <ToastContainer />
        <GuidedTour />
      </body>
    </html>
  );
}
