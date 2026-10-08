import type { Envelope } from './types';

const API_BASE = '/api/v1';

function handleUnauthorized() {
  if (typeof window === 'undefined') return;

  if (document.querySelector('form')) {
    window.dispatchEvent(new CustomEvent('skillforge:reauth-required'));
    return;
  }

  const subsystemId = process.env.NEXT_PUBLIC_SUBSYSTEM_ID;
  if (!subsystemId) throw new Error('NEXT_PUBLIC_SUBSYSTEM_ID must be configured.');

  const marker = `${subsystemId.replace(/-/g, '_')}_sso_started`;
  const now = Date.now();
  const previousAttempt = Number(window.sessionStorage.getItem(marker));
  if (Number.isFinite(previousAttempt) && now - previousAttempt >= 0 && now - previousAttempt < 30_000) {
    window.dispatchEvent(new CustomEvent('skillforge:reauth-required'));
    return;
  }

  window.sessionStorage.setItem(marker, String(now));
  const next = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.location.assign(`/auth/login?next=${encodeURIComponent(next)}`);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormData = init?.body instanceof FormData;
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(init?.headers || {}),
    },
    cache: 'no-store',
    credentials: 'same-origin',
  });
  if (response.status === 401) handleUnauthorized();

  const body: Envelope<T> = await response.json();
  if (!response.ok || !body.success) {
    throw new Error(body.error?.message || `Request to ${path} failed (${response.status})`);
  }
  return body.data;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  put: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PUT', body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  upload: <T>(path: string, formData: FormData) =>
    request<T>(path, { method: 'POST', body: formData }),
};

export async function uploadTranscriptPdf(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  return api.upload<any>('/students/me/documents/upload-transcript', formData);
}
