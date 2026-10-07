import { Envelope } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api/v1';

// Reads whatever bearer token the Core Hub's SSO session carries for the
// current request, so it can be forwarded as `Authorization: Bearer <token>` —
// this subsystem's backend verifies that token itself against Core's JWKS
// (see backend/src/auth/jwt-identity.middleware.ts). This subsystem's
// frontend never handles login, tokens, or sessions itself; it only relays
// whatever Core's own SSO layer has already attached to the page.
//
// TODO(integration): wire this up once Core's frontend SSO integration doc
// specifies how the token reaches this app (e.g. an httpOnly cookie the
// Gateway sets, or a `getSession()` call). Until then this returns undefined,
// and in local development the backend's own DEV_IDENTITY_FALLBACK stands in
// so every page still works with no real Core session in front of it.
function getAuthToken(): string | undefined {
  return undefined;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();

  // ตรวจสอบว่าข้อมูลที่ส่งมาเป็น FormData (ส่งไฟล์) หรือไม่
  const isFormData = init?.body instanceof FormData;

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      // หากส่งไฟล์ (FormData) ห้ามระบุ Content-Type เป็น application/json เด็ดขาด
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });
  const body: Envelope<T> = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.error?.message || `Request to ${path} failed (${res.status})`);
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

  /**
   * ฟังก์ชันพิเศษสำหรับส่งไฟล์ FormData (อัปโหลดทรานสคริปต์)
   */
  upload: <T>(path: string, formData: FormData) =>
    request<T>(path, { method: 'POST', body: formData }),
};

// For places where "no identity yet" or "not found" shouldn't blow up the page —
// e.g. checking whether the current user is staff before showing an admin link.
export async function tryGet<T>(path: string): Promise<T | null> {
  try {
    return await api.get<T>(path);
  } catch {
    return null;
  }
}

/**
 * ส่งไฟล์ PDF ทรานสคริปต์ไปให้ระบบหลังบ้านวิเคราะห์และบันทึกข้อมูลวิชา/เกรดลงตาราง
 */
export async function uploadTranscriptPdf(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file); // คีย์ชื่อ 'file' ตรงล็อกกับตัวแปร @UploadedFile ใน NestJS หลังบ้านพอดี

  // ยิงหา Endpoint พิกัดที่คุณกำหนดไว้ใน Controller ด้วยตัวจัดการชุดใหม่
  return api.upload<any>('/students/me/documents/upload-transcript', formData);
}
