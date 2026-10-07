import { useDemoStore } from '../store/useDemoStore';
import { Job, JobPOD } from '../mocks/jobs';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomDelay(min = 350, max = 800) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function apiGetJobs(): Promise<Job[]> {
  await wait(getRandomDelay(250, 500));
  return useDemoStore.getState().jobs;
}

export async function apiCreateBooking(data: Partial<Job>): Promise<Job> {
  await wait(getRandomDelay(400, 900));
  return useDemoStore.getState().createBooking(data);
}

export async function apiAssignDriver(jobId: string, driverId: string): Promise<void> {
  await wait(getRandomDelay(350, 700));
  return useDemoStore.getState().assignDriver(jobId, driverId);
}

export async function apiAdvanceJobStatus(jobId: string, nextStatus: any): Promise<void> {
  await wait(getRandomDelay(350, 650));
  return useDemoStore.getState().advanceJobStatus(jobId, nextStatus);
}

export async function apiSubmitPOD(jobId: string, pod: JobPOD): Promise<void> {
  await wait(getRandomDelay(500, 900));
  return useDemoStore.getState().submitPOD(jobId, pod);
}

export async function apiResolveException(jobId: string, action: string, note: string): Promise<void> {
  await wait(getRandomDelay(400, 800));
  return useDemoStore.getState().resolveException(jobId, action, note);
}

export async function apiSendTest(channel: 'SMS' | 'Email', recipient: string): Promise<void> {
  await wait(getRandomDelay(300, 600));
  return useDemoStore.getState().sendTestNotification(channel, recipient);
}
