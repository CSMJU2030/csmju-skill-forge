import 'server-only';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Envelope } from './types';

function getBackendUrl(): string {
  const value = process.env.BACKEND_URL;
  if (!value) throw new Error('BACKEND_URL must be configured for server-side API requests.');
  return value.replace(/\/$/, '');
}

function getSubsystemId(): string {
  const value = process.env.SUBSYSTEM_ID;
  if (!value) throw new Error('SUBSYSTEM_ID must be configured.');
  return value;
}

async function get<T>(path: string): Promise<T> {
  const cookieName = `${getSubsystemId().replace(/-/g, '_')}_access_token`;
  const token = cookies().get(cookieName)?.value;
  const response = await fetch(`${getBackendUrl()}/api/v1${path}`, {
    headers: token ? { Cookie: `${cookieName}=${encodeURIComponent(token)}` } : {},
    cache: 'no-store',
  });

  if (response.status === 401) {
    const currentPath = headers().get('x-skillforge-path') || '/dashboard';
    redirect(`/auth/login?next=${encodeURIComponent(currentPath)}`);
  }

  const body = (await response.json()) as Envelope<T>;
  if (!response.ok || !body.success) {
    throw new Error(body.error?.message || `Request to ${path} failed (${response.status})`);
  }
  return body.data;
}

export const serverApi = { get };
