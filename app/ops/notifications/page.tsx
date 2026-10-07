'use client';

import React, { useState } from 'react';
import { useDemoStore } from '../../../store/useDemoStore';
import { SEED_TEMPLATES, NotificationTemplate } from '../../../mocks/templates';
import { Button } from '../../../components/ui/Button';
import { FindingPin } from '../../../components/audit/FindingPin';
import {
  Bell,
  Smartphone,
  Mail,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';

interface OutboundLogItem {
  id: string;
  time: string;
  channel: 'SMS' | 'Email';
  recipient: string;
  event: string;
  status: 'Sent' | 'Failed' | 'Queued';
  content: string;
  jobId: string;
}

export default function NotificationsPage() {
  const { sendTestNotification, addToast } = useDemoStore();

  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate>(SEED_TEMPLATES[0]);
  const [testRecipient, setTestRecipient] = useState('0412 883 910');

  // Seeded outbound logs
  const [logs, setLogs] = useState<OutboundLogItem[]>([
    {
      id: 'LOG-881',
      time: '11:43 AEST',
      channel: 'SMS',
      recipient: '0419 ··· 519',
      event: 'Delivered',
      status: 'Sent',
      content: 'Meridian: Parcel MRD-481905 delivered at 11:42, signed by A. Whitlock. Proof: mrd.co/481905',
      jobId: 'MRD-481905',
    },
    {
      id: 'LOG-880',
      time: '11:43 AEST',
      channel: 'Email',
      recipient: 'logistics@northgatelabs.com.au',
      event: 'Delivered',
      status: 'Sent',
      content: 'Delivered: MRD-481905 signed by A. Whitlock at 11:42 with attached signed PDF receipt.',
      jobId: 'MRD-481905',
    },
    {
      id: 'LOG-879',
      time: '11:36 AEST',
      channel: 'SMS',
      recipient: '0412 ··· 910',
      event: 'Exception',
      status: 'Sent',
      content: 'Meridian: We attempted delivery for MRD-481911 at 11:35 but were unable to reach you. Please select next action.',
      jobId: 'MRD-481911',
    },
    {
      id: 'LOG-878',
      time: '10:05 AEST',
      channel: 'SMS',
      recipient: '0421 ··· 880',
      event: 'In transit',
      status: 'Sent',
      content: 'Meridian: Callum Ng has collected MRD-481920. En route to Docklands Tower 4. ETA 14:20.',
      jobId: 'MRD-481920',
    },
    {
      id: 'LOG-877',
      time: '09:45 AEST',
      channel: 'SMS',
      recipient: '0434 ··· 120',
      event: 'Driver assigned',
      status: 'Failed',
      content: 'Meridian: Priya Raghavan assigned to your delivery MRD-481899. [Provider Gateway Timeout]',
      jobId: 'MRD-481899',
    },
  ]);

  function handleSendTest() {
    sendTestNotification(selectedTemplate.channel, testRecipient);
  }

  function handleRetryFailed(logId: string) {
    setLogs((prev) =>
      prev.map((item) => (item.id === logId ? { ...item, status: 'Sent' } : item))
    );
    addToast({
      type: 'success',
      title: 'Message Re-dispatched',
      message: `Notification ${logId} sent successfully via backup gateway.`,
    });
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
            Transactional Messaging & Audit Trail
          </span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-0.5">
            Outbound Communications & Templates
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <FindingPin findingId="F-013" label="Outbox Pattern Queue" />
          <FindingPin findingId="F-014" label="Spam Act Compliance" />
        </div>
      </div>

      {/* Grid: Outbound Log (7 cols) & Template Preview Phone Frame (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 cols: Outbound Log Table */}
        <div className="lg:col-span-7 bg-surface rounded-md border border-border overflow-hidden shadow-1 space-y-4 p-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-xs font-semibold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              Outbound Transmission Log
            </h3>
            <span className="text-[11px] font-mono text-text-muted">Live Stream</span>
          </div>

          <div className="divide-y divide-border/60">
            {logs.map((log) => (
              <div key={log.id} className="py-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-primary">{log.jobId}</span>
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        log.channel === 'SMS'
                          ? 'bg-primary-tint text-primary'
                          : 'bg-secondary/15 text-secondary'
                      }`}
                    >
                      {log.channel}
                    </span>
                    <span className="text-text-muted text-[11px]">{log.event}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                        log.status === 'Sent'
                          ? 'bg-success-tint text-success'
                          : 'bg-error-tint text-error font-semibold'
                      }`}
                    >
                      {log.status}
                    </span>
                    <span className="font-mono text-[10px] text-text-muted">{log.time}</span>
                  </div>
                </div>

                <p className="text-text-secondary leading-snug text-[11px] font-mono bg-surface-sunken/40 p-2 rounded">
                  {log.content}
                </p>

                {log.status === 'Failed' && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-error flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Inline send failed (F-013 inline handler)
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRetryFailed(log.id)}
                      className="text-[11px] px-2 py-0.5"
                    >
                      Retry Outbox Send
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 cols: Template Selector & Mobile / Email Preview Frame */}
        <div className="lg:col-span-5 bg-surface-elevated rounded-md border border-border p-6 shadow-2 space-y-5">
          <div className="border-b border-border pb-3">
            <h3 className="text-sm font-semibold text-ink">
              Template Preview & Test Dispatcher
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Review live transactional rendering across mobile SMS and email clients.
            </p>
          </div>

          {/* Template Select */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-text-secondary uppercase">
              Choose Event Template
            </label>
            <select
              value={selectedTemplate.id}
              onChange={(e) => {
                const found = SEED_TEMPLATES.find((t) => t.id === e.target.value);
                if (found) setSelectedTemplate(found);
              }}
              className="w-full bg-surface text-ink text-xs rounded border border-border-strong p-2 focus:outline-none"
            >
              {SEED_TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.channel}: {tmpl.name}
                </option>
              ))}
            </select>
          </div>

          {/* Phone Frame or Email Frame */}
          {selectedTemplate.channel === 'SMS' ? (
            /* Styled Device Frame for SMS */
            <div className="w-full max-w-[320px] mx-auto bg-surface-sunken rounded-2xl border-4 border-border-strong p-3 shadow-2 text-xs">
              <div className="w-16 h-3 bg-border rounded-full mx-auto mb-3" />
              <div className="text-center pb-2 border-b border-border/50">
                <span className="font-semibold text-ink block text-[11px]">
                  {selectedTemplate.senderName}
                </span>
                <span className="text-[10px] text-text-muted">SMS · Today 14:20</span>
              </div>
              <div className="py-4">
                <div className="bg-surface-elevated p-3 rounded-lg border border-border shadow-sm text-[11px] leading-relaxed text-ink font-mono">
                  {selectedTemplate.body
                    .replace('{{jobId}}', 'MRD-481920')
                    .replace('{{driverName}}', 'Callum Ng')
                    .replace('{{eta}}', '14:20')
                    .replace('{{fromSuburb}}', 'Richmond')
                    .replace('{{trackingUrl}}', 'mrd.co/481920')
                    .replace('{{deliveredTime}}', '11:42')
                    .replace('{{recipientName}}', 'A. Whitlock')}
                </div>
              </div>
            </div>
          ) : (
            /* Styled Email Preview Frame */
            <div className="bg-surface rounded-md border border-border p-4 text-xs space-y-2 shadow-sm font-sans">
              <div className="border-b border-border/60 pb-2 space-y-1 text-[11px]">
                <div>
                  <span className="text-text-muted">From: </span>
                  <span className="font-medium text-ink">{selectedTemplate.senderName}</span>
                </div>
                <div>
                  <span className="text-text-muted">Subject: </span>
                  <strong className="text-ink">
                    {selectedTemplate.subject
                      ?.replace('{{jobId}}', 'MRD-481920')
                      .replace('{{recipientName}}', 'A. Whitlock')
                      .replace('{{deliveredTime}}', '11:42')}
                  </strong>
                </div>
              </div>
              <pre className="p-2 whitespace-pre-wrap font-sans text-xs text-text-secondary leading-relaxed bg-surface-elevated rounded">
                {selectedTemplate.body
                  .replace('{{jobId}}', 'MRD-481920')
                  .replace('{{recipientName}}', 'A. Whitlock')
                  .replace('{{deliveredTime}}', '11:42')
                  .replace('{{toAddress}}', 'Tower 4, 727 Collins St, Docklands VIC')
                  .replace('{{driverName}}', 'Callum Ng')
                  .replace('{{depot}}', 'Melbourne')
                  .replace('{{trackingUrl}}', 'https://meridiancouriers.com.au/track/MRD-481920')}
              </pre>
            </div>
          )}

          {/* Test Dispatch Bar */}
          <div className="pt-2 border-t border-border space-y-2 text-xs">
            <div className="flex gap-2">
              <input
                type="text"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                placeholder="Test phone or email..."
                className="flex-1 bg-surface border border-border-strong rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleSendTest}
                icon={<Send className="w-3.5 h-3.5" />}
              >
                Send Test
              </Button>
            </div>
            <span className="text-[10px] text-text-muted block">
              Test dispatches are logged as simulations; no external SMS/email credits consumed.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
