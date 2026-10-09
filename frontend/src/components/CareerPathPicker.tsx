'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CareerPath } from '@/lib/types';
import { Select } from './ui/Select';

export function CareerPathPicker({ careerPaths }: { careerPaths: CareerPath[] }) {
  const [selected, setSelected] = useState(careerPaths[0]?.id ?? '');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  if (careerPaths.length === 0) {
    return (
      <p className="font-body text-sm text-neutral/50">
        ยังไม่มีข้อมูลเส้นทางอาชีพในระบบ — รอทีม PM เพิ่มข้อมูลผ่านระบบทะเบียนกลาง
      </p>
    );
  }

  async function handleSubmit() {
    if (!selected) return;
    setSubmitting(true);
    try {
      await api.post('/students/me/target-career-path', { career_path_id: selected });
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      <div className="w-full">
        <Select
          value={selected}
          onChange={setSelected}
          options={careerPaths.map((cp) => ({ value: cp.id, label: cp.name, hint: cp.description ?? undefined }))}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="font-body text-sm font-medium rounded-module bg-primary text-white px-6 py-2.5 w-full hover:bg-primary-deep transition-colors disabled:opacity-50 shadow-sm shadow-primary/20"
      >
        {submitting ? 'กำลังบันทึก…' : 'เลือกเส้นทางนี้'}
      </button>
    </div>
  );
}
