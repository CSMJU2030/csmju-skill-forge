'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import { CareerPath } from '@/lib/types';
import { Select } from './ui/Select';

// Lets the student change their target career path later — not just pick one
// the first time. Shown inline in the dashboard hero.
export function CareerPathSwitcher({
  currentId,
  currentName,
  careerPaths,
}: {
  currentId: string;
  currentName: string;
  careerPaths: CareerPath[];
}) {
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState(currentId);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  if (!editing) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className="font-display font-bold text-3xl">{currentName}</h2>
        <button
          onClick={() => setEditing(true)}
          className="font-body text-xs text-white/70 hover:text-white flex items-center gap-1 rounded-full border border-white/25 px-2.5 py-1 transition-colors"
        >
          <PencilSquareIcon className="h-3.5 w-3.5" /> เปลี่ยนเส้นทาง
        </button>
      </div>
    );
  }

  async function handleConfirm() {
    setSubmitting(true);
    try {
      await api.post('/students/me/target-career-path', { career_path_id: selected });
      setEditing(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 max-w-sm">
      <Select value={selected} onChange={setSelected} options={careerPaths.map((cp) => ({ value: cp.id, label: cp.name, hint: cp.description ?? undefined }))} />
      <div className="flex gap-2">
        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="font-body text-sm font-medium rounded-module bg-white text-primary-deep px-4 py-2 hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {submitting ? 'กำลังบันทึก…' : 'ยืนยัน'}
        </button>
        <button
          onClick={() => { setEditing(false); setSelected(currentId); }}
          className="font-body text-sm rounded-module border border-white/30 px-4 py-2 hover:bg-white/10 transition-colors"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
}
