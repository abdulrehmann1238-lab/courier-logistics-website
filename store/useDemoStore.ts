import { create } from 'zustand';
import { Job, JobStatus, SEED_JOBS, JobPOD, JobTimelineEvent, JobNotification } from '../mocks/jobs';
import { Driver, SEED_DRIVERS } from '../mocks/drivers';
import { Finding, SEED_FINDINGS } from '../mocks/findings';
import { Milestone, SEED_MILESTONES } from '../mocks/milestones';
import { formatTime } from '../lib/format';

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  durationMs?: number;
}

export type DemoMode = 'customer' | 'ops' | 'driver';

interface DemoStoreState {
  // Navigation & Demo Modes
  mode: DemoMode;
  setMode: (mode: DemoMode) => void;

  // Audit Lens
  auditLensActive: boolean;
  toggleAuditLens: () => void;
  setAuditLensActive: (active: boolean) => void;
  activeFindingId: string | null;
  setActiveFindingId: (id: string | null) => void;
  seenFindingIds: string[];
  markFindingAsSeen: (id: string) => void;
  proposedPricingFix: boolean;
  setProposedPricingFix: (enabled: boolean) => void;

  // Guided Tour
  tourOpen: boolean;
  tourStep: number;
  setTourOpen: (open: boolean) => void;
  setTourStep: (step: number) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;

  // Command Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Demo Controls
  offlineMode: boolean;
  toggleOfflineMode: () => void;
  simulateApiError: boolean;
  toggleSimulateApiError: () => void;
  resetDemo: () => void;

  // Filters & State
  selectedDepot: 'All' | 'Melbourne' | 'Sydney' | 'Brisbane';
  setSelectedDepot: (depot: 'All' | 'Melbourne' | 'Sydney' | 'Brisbane') => void;

  // Toasts
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;

  // Domain Entities
  jobs: Job[];
  drivers: Driver[];
  findings: Finding[];
  milestones: Milestone[];
  offlineQueue: Array<{ type: string; payload: any; timestamp: string }>;

  // Actions
  createBooking: (newJob: Partial<Job>) => Promise<Job>;
  assignDriver: (jobId: string, driverId: string) => Promise<void>;
  advanceJobStatus: (jobId: string, nextStatus: JobStatus) => Promise<void>;
  submitPOD: (jobId: string, pod: JobPOD) => Promise<void>;
  reportDriverFailure: (jobId: string, reason: string, notes: string) => Promise<void>;
  resolveException: (jobId: string, resolutionAction: string, note: string) => Promise<void>;
  updateFindingMilestone: (findingId: string, milestone: 'M0' | 'M1' | 'M2' | 'M3') => void;
  updateDriverStatus: (driverId: string, status: 'On job' | 'Available' | 'Break') => void;
  sendTestNotification: (channel: 'SMS' | 'Email', recipient: string) => void;
}

const STORAGE_KEY = 'meridian_demo_v1';

function getInitialState() {
  if (typeof window === 'undefined') {
    return {
      jobs: SEED_JOBS,
      drivers: SEED_DRIVERS,
      findings: SEED_FINDINGS,
      milestones: SEED_MILESTONES,
      seenFindingIds: [],
    };
  }

  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        jobs: parsed.jobs || SEED_JOBS,
        drivers: parsed.drivers || SEED_DRIVERS,
        findings: parsed.findings || SEED_FINDINGS,
        milestones: parsed.milestones || SEED_MILESTONES,
        seenFindingIds: parsed.seenFindingIds || [],
      };
    }
  } catch (err) {
    console.warn('Could not read sessionStorage', err);
  }

  return {
    jobs: SEED_JOBS,
    drivers: SEED_DRIVERS,
    findings: SEED_FINDINGS,
    milestones: SEED_MILESTONES,
    seenFindingIds: [],
  };
}

const initialData = getInitialState();

export const useDemoStore = create<DemoStoreState>((set, get) => ({
  mode: 'customer',
  setMode: (mode) => set({ mode }),

  auditLensActive: false,
  toggleAuditLens: () => set((s) => ({ auditLensActive: !s.auditLensActive })),
  setAuditLensActive: (auditLensActive) => set({ auditLensActive }),
  activeFindingId: null,
  setActiveFindingId: (activeFindingId) => {
    set({ activeFindingId });
    if (activeFindingId) {
      get().markFindingAsSeen(activeFindingId);
    }
  },
  seenFindingIds: initialData.seenFindingIds,
  markFindingAsSeen: (id) =>
    set((s) => {
      if (s.seenFindingIds.includes(id)) return s;
      const next = [...s.seenFindingIds, id];
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), seenFindingIds: next }));
      } catch {}
      return { seenFindingIds: next };
    }),
  proposedPricingFix: false,
  setProposedPricingFix: (proposedPricingFix) => set({ proposedPricingFix }),

  tourOpen: false,
  tourStep: 0,
  setTourOpen: (tourOpen) => set({ tourOpen }),
  setTourStep: (tourStep) => set({ tourStep }),
  nextTourStep: () => set((s) => ({ tourStep: Math.min(s.tourStep + 1, 5) })),
  prevTourStep: () => set((s) => ({ tourStep: Math.max(s.tourStep - 1, 0) })),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),

  offlineMode: false,
  toggleOfflineMode: () => {
    const isOffline = !get().offlineMode;
    set({ offlineMode: isOffline });
    if (!isOffline && get().offlineQueue.length > 0) {
      // Reconnect sync
      const count = get().offlineQueue.length;
      set({ offlineQueue: [] });
      get().addToast({
        type: 'success',
        title: 'Connection restored',
        message: `Synced ${count} offline updates successfully with dispatch hub.`,
      });
    } else if (isOffline) {
      get().addToast({
        type: 'warning',
        title: 'Offline mode active',
        message: 'Driver app now operating offline. Field changes will queue and sync on reconnect.',
      });
    }
  },

  simulateApiError: false,
  toggleSimulateApiError: () => {
    const willError = !get().simulateApiError;
    set({ simulateApiError: willError });
    get().addToast({
      type: willError ? 'warning' : 'info',
      title: willError ? 'API error simulation: ON' : 'API error simulation: OFF',
      message: willError
        ? 'Next server mutation will fail with 500 to demonstrate fault handling.'
        : 'Normal operations restored.',
    });
  },

  resetDemo: () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
    set({
      jobs: SEED_JOBS,
      drivers: SEED_DRIVERS,
      findings: SEED_FINDINGS,
      milestones: SEED_MILESTONES,
      seenFindingIds: [],
      offlineMode: false,
      offlineQueue: [],
      simulateApiError: false,
      activeFindingId: null,
      proposedPricingFix: false,
      selectedDepot: 'All',
    });
    get().addToast({
      type: 'info',
      title: 'Demo reset',
      message: 'Restored baseline jobs, driver rosters, and audit register.',
    });
  },

  selectedDepot: 'All',
  setSelectedDepot: (selectedDepot) => set({ selectedDepot }),

  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastItem = { ...toast, id };
    set((s) => ({ toasts: [...s.toasts.slice(-2), newToast] }));
    const duration = toast.durationMs || 4000;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
    return id;
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  jobs: initialData.jobs,
  drivers: initialData.drivers,
  findings: initialData.findings,
  milestones: initialData.milestones,
  offlineQueue: [],

  // Domain Actions
  createBooking: async (newJobData) => {
    if (get().simulateApiError) {
      set({ simulateApiError: false });
      throw new Error('500 Internal Server Error: Simulated pricing service timeout.');
    }

    const nextIdNum = 481900 + get().jobs.length + 1;
    const jobId = `MRD-${nextIdNum}`;
    const nowIso = new Date().toISOString();
    const timeFormatted = formatTime(nowIso);

    const fullJob: Job = {
      id: jobId,
      customerName: newJobData.customerName || 'Harlow & Finch Architects',
      customerType: newJobData.customerType || 'business',
      customerEmail: newJobData.customerEmail || 'dispatch@client.com.au',
      customerPhone: newJobData.customerPhone || '0412 000 000',
      fromSuburb: newJobData.fromSuburb || 'Richmond',
      fromAddress: newJobData.fromAddress || 'Richmond VIC 3121',
      toSuburb: newJobData.toSuburb || 'Docklands',
      toAddress: newJobData.toAddress || 'Docklands VIC 3008',
      depot: newJobData.depot || 'Melbourne',
      service: newJobData.service || 'sameday',
      status: 'Unassigned',
      eta: newJobData.eta || 'Today 17:00',
      price: newJobData.price || 38.60,
      distanceKm: newJobData.distanceKm || 8.5,
      createdAt: nowIso,
      parcel: newJobData.parcel || {
        description: 'Commercial consignment',
        type: 'small',
        weightKg: 2.5,
        dimensions: '30 × 20 × 15 cm',
        isFragile: false,
        signatureRequired: true,
      },
      pricingBreakdown: newJobData.pricingBreakdown || [],
      timeline: [
        {
          id: `TL-${Date.now()}`,
          status: 'Booking created',
          label: 'Booking confirmed via customer portal',
          actor: newJobData.customerName || 'Customer',
          timestamp: nowIso,
        },
      ],
      notifications: [
        {
          id: `NT-${Date.now()}`,
          channel: 'SMS',
          recipient: newJobData.customerPhone || '0412 ··· 000',
          event: 'Booked',
          preview: `Meridian: Your booking ${jobId} is confirmed. A driver is assigned ~30m prior to pickup.`,
          sentAt: timeFormatted,
          status: 'Sent',
        },
      ],
    };

    set((s) => {
      const nextJobs = [fullJob, ...s.jobs];
      return { jobs: nextJobs };
    });

    get().addToast({
      type: 'success',
      title: `Booking ${jobId} created`,
      message: 'New job added to Operations queue as Unassigned.',
    });

    return fullJob;
  },

  assignDriver: async (jobId, driverId) => {
    if (get().simulateApiError) {
      set({ simulateApiError: false });
      throw new Error('500 Internal Server Error: Database deadlock during driver lock.');
    }

    const driver = get().drivers.find((d) => d.id === driverId);
    if (!driver) return;

    const nowIso = new Date().toISOString();
    const timeFormatted = formatTime(nowIso);

    set((s) => {
      const nextJobs = s.jobs.map((job) => {
        if (job.id !== jobId) return job;
        const newTimelineEvent: JobTimelineEvent = {
          id: `TL-${Date.now()}`,
          status: 'Driver assigned',
          label: `Assigned to ${driver.name} (${driver.id})`,
          actor: 'Shannon Reyes (Ops)',
          timestamp: nowIso,
        };
        const newNotification: JobNotification = {
          id: `NT-${Date.now()}`,
          channel: 'SMS',
          recipient: job.customerPhone,
          event: 'Driver assigned',
          preview: `Meridian: ${driver.name} assigned to your job ${job.id}. ETA: ${job.eta}`,
          sentAt: timeFormatted,
          status: 'Sent',
        };
        return {
          ...job,
          driverId: driver.id,
          driverName: driver.name,
          status: (job.status === 'Unassigned' ? 'Accepted' : job.status) as JobStatus,
          timeline: [...job.timeline, newTimelineEvent],
          notifications: [newNotification, ...job.notifications],
        };
      });

      const nextDrivers = s.drivers.map((d) =>
        d.id === driverId ? { ...d, currentJobId: jobId, status: 'On job' as const } : d
      );

      return { jobs: nextJobs, drivers: nextDrivers };
    });

    get().addToast({
      type: 'success',
      title: 'Driver assigned',
      message: `Assigned ${driver.name} to ${jobId}. Notification sent to customer.`,
    });
  },

  advanceJobStatus: async (jobId, nextStatus) => {
    if (get().offlineMode) {
      set((s) => ({
        offlineQueue: [
          ...s.offlineQueue,
          { type: 'ADVANCE_STATUS', payload: { jobId, nextStatus }, timestamp: new Date().toISOString() },
        ],
      }));
      get().addToast({
        type: 'info',
        title: 'Queued offline',
        message: `Status update to "${nextStatus}" queued for sync.`,
      });
    }

    const nowIso = new Date().toISOString();
    const timeFormatted = formatTime(nowIso);

    set((s) => {
      const nextJobs = s.jobs.map((job) => {
        if (job.id !== jobId) return job;
        const newTimeline: JobTimelineEvent = {
          id: `TL-${Date.now()}`,
          status: nextStatus,
          label: `Status advanced to ${nextStatus}`,
          actor: job.driverName || 'Courier Driver',
          timestamp: nowIso,
        };
        const newNotification: JobNotification = {
          id: `NT-${Date.now()}`,
          channel: 'SMS',
          recipient: job.customerPhone,
          event: nextStatus,
          preview: `Meridian: Parcel ${job.id} is now ${nextStatus.toLowerCase()}.`,
          sentAt: timeFormatted,
          status: 'Sent',
        };
        return {
          ...job,
          status: nextStatus,
          timeline: [...job.timeline, newTimeline],
          notifications: [newNotification, ...job.notifications],
        };
      });
      return { jobs: nextJobs };
    });

    get().addToast({
      type: 'info',
      title: 'Status updated',
      message: `Consignment ${jobId} is now ${nextStatus}.`,
    });
  },

  submitPOD: async (jobId, pod) => {
    if (get().offlineMode) {
      set((s) => ({
        offlineQueue: [
          ...s.offlineQueue,
          { type: 'SUBMIT_POD', payload: { jobId, pod }, timestamp: new Date().toISOString() },
        ],
      }));
    }

    const nowIso = new Date().toISOString();
    const timeFormatted = formatTime(nowIso);

    set((s) => {
      const nextJobs = s.jobs.map((job) => {
        if (job.id !== jobId) return job;
        const timelineItem: JobTimelineEvent = {
          id: `TL-${Date.now()}`,
          status: 'Delivered',
          label: `Delivered and signed by ${pod.recipientName}`,
          actor: job.driverName || 'Courier Driver',
          timestamp: nowIso,
          note: `Geotag verified: ${pod.geotag}`,
        };
        const smsNotification: JobNotification = {
          id: `NT-${Date.now()}-1`,
          channel: 'SMS',
          recipient: job.customerPhone,
          event: 'Delivered',
          preview: `Meridian: Consignment ${job.id} delivered at ${timeFormatted}, signed by ${pod.recipientName}.`,
          sentAt: timeFormatted,
          status: 'Sent',
        };
        const emailNotification: JobNotification = {
          id: `NT-${Date.now()}-2`,
          channel: 'Email',
          recipient: job.customerEmail,
          event: 'Delivered',
          preview: `Subject: Delivered: ${job.id} signed by ${pod.recipientName}`,
          sentAt: timeFormatted,
          status: 'Sent',
        };

        return {
          ...job,
          status: 'Delivered' as JobStatus,
          deliveredAt: nowIso,
          pod,
          timeline: [...job.timeline, timelineItem],
          notifications: [smsNotification, emailNotification, ...job.notifications],
        };
      });

      // Increment driver completed count
      const currentJob = s.jobs.find((j) => j.id === jobId);
      const nextDrivers = s.drivers.map((d) => {
        if (currentJob?.driverId === d.id) {
          return {
            ...d,
            completedToday: d.completedToday + 1,
            currentJobId: undefined,
            status: 'Available' as const,
          };
        }
        return d;
      });

      return { jobs: nextJobs, drivers: nextDrivers };
    });

    get().addToast({
      type: 'success',
      title: 'Proof of Delivery recorded',
      message: `Signed by ${pod.recipientName}. Customer notified and tracking updated.`,
    });
  },

  reportDriverFailure: async (jobId, reason, notes) => {
    const nowIso = new Date().toISOString();
    const timelineEvent: JobTimelineEvent = {
      id: `TL-${Date.now()}`,
      status: 'Exception noted',
      label: `Delivery issue reported: ${reason}`,
      actor: 'Courier Driver',
      timestamp: nowIso,
      note: notes,
    };
    set((s) => {
      const nextJobs = s.jobs.map((job) => {
        if (job.id !== jobId) return job;
        return {
          ...job,
          status: 'Exception' as JobStatus,
          exception: {
            code: 'UNAVAILABLE' as const,
            reason,
            timestamp: `Today at ${formatTime(nowIso)} AEST`,
            severity: 'High' as const,
            evidenceNotes: notes,
            resolved: false,
          },
          timeline: [...job.timeline, timelineEvent],
        };
      });
      return { jobs: nextJobs };
    });

    get().addToast({
      type: 'warning',
      title: 'Exception flagged',
      message: `Job ${jobId} moved to Operations Exceptions queue for resolution.`,
    });
  },

  resolveException: async (jobId, resolutionAction, note) => {
    const nowIso = new Date().toISOString();
    const resolutionStatus: JobStatus = resolutionAction === 'Retry delivery today' ? 'Accepted' : 'Picked up';
    const timelineEvent: JobTimelineEvent = {
      id: `TL-${Date.now()}`,
      status: 'Accepted',
      label: `Exception resolved: ${resolutionAction}`,
      actor: 'Shannon Reyes (Ops)',
      timestamp: nowIso,
      note,
    };
    set((s) => {
      const nextJobs = s.jobs.map((job) => {
        if (job.id !== jobId) return job;
        const currentEx = job.exception;
        return {
          ...job,
          status: resolutionStatus,
          exception: currentEx
            ? {
                ...currentEx,
                resolved: true,
                resolution: `${resolutionAction}: ${note}`,
                resolvedAt: nowIso,
              }
            : undefined,
          timeline: [...job.timeline, timelineEvent],
        };
      });
      return { jobs: nextJobs };
    });

    get().addToast({
      type: 'success',
      title: 'Exception resolved',
      message: `Action recorded: ${resolutionAction}. Job returned to active dispatch.`,
    });
  },

  updateFindingMilestone: (findingId, milestone) => {
    set((s) => {
      const nextFindings = s.findings.map((f) =>
        f.id === findingId ? { ...f, milestone } : f
      );
      return { findings: nextFindings };
    });
    get().addToast({
      type: 'info',
      title: `Finding ${findingId} updated`,
      message: `Reallocated to milestone ${milestone}. Roadmap capacity recalculated.`,
    });
  },

  updateDriverStatus: (driverId, status) => {
    set((s) => ({
      drivers: s.drivers.map((d) => (d.id === driverId ? { ...d, status } : d)),
    }));
  },

  sendTestNotification: (channel, recipient) => {
    get().addToast({
      type: 'info',
      title: `Test ${channel} dispatched (Preview only)`,
      message: `Simulated transmission to ${recipient}. No external billable message was sent.`,
    });
  },
}));
