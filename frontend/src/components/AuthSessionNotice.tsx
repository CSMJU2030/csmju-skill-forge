'use client';

import { useEffect, useState } from 'react';

export function AuthSessionNotice() {
  const [required, setRequired] = useState(false);

  useEffect(() => {
    const showNotice = () => setRequired(true);
    window.addEventListener('skillforge:reauth-required', showNotice);
    return () => window.removeEventListener('skillforge:reauth-required', showNotice);
  }, []);

  if (!required) return null;

  const next = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  return (
    <div role="alert" className="fixed inset-x-4 top-4 z-50 rounded-module border border-secondary bg-white p-4 shadow-lg md:inset-x-auto md:right-6 md:max-w-md">
      <p className="font-body text-sm text-neutral">
        เซสชันหมดอายุหรือยืนยันตัวตนไม่สำเร็จ กรุณาเข้าสู่ระบบอีกครั้ง
      </p>
      <a
        className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 font-body text-sm text-white"
        href={`/auth/login?next=${encodeURIComponent(next)}`}
      >
        เข้าสู่ระบบอีกครั้ง
      </a>
    </div>
  );
}
