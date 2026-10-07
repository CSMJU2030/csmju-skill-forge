'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import { Course, Skill } from '@/lib/types';
import { Select } from './ui/Select';

const CATEGORY_OPTIONS = [
  { value: 'core', label: 'วิชาแกน (core)' },
  { value: 'major_elective', label: 'วิชาเอกเลือก (major elective)' },
  { value: 'free_elective', label: 'วิชาเลือกเสรี (free elective)' },
  { value: 'general_ed', label: 'วิชาศึกษาทั่วไป (general ed)' },
];

interface SkillWeightRow {
  skill_id: string;
  weight: number;
}

export function CourseForm({
  course,
  skills,
  onDone,
}: {
  course?: Course;
  skills: Skill[];
  onDone: () => void;
}) {
  const isEdit = !!course;
  const [code, setCode] = useState(course?.code ?? '');
  const [nameTh, setNameTh] = useState(course?.name_th ?? '');
  const [nameEn, setNameEn] = useState(course?.name_en ?? '');
  const [credits, setCredits] = useState(course?.credits ?? 3);
  const [category, setCategory] = useState(course?.category ?? 'core');
  const [rows, setRows] = useState<SkillWeightRow[]>(
    course?.course_skills?.map((cs) => ({ skill_id: cs.skill_id, weight: cs.weight })) ?? [],
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const skillOptions = skills.map((s) => ({ value: s.id, label: s.name }));

  function addRow() {
    const unused = skills.find((s) => !rows.some((r) => r.skill_id === s.id));
    if (!unused) return;
    setRows([...rows, { skill_id: unused.id, weight: 0.5 }]);
  }

  function updateRow(index: number, patch: Partial<SkillWeightRow>) {
    setRows(rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function removeRow(index: number) {
    setRows(rows.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const payload = {
      code,
      name_th: nameTh,
      name_en: nameEn,
      credits: Number(credits),
      category,
      skill_weights: rows,
    };
    try {
      if (isEdit) {
        await api.patch(`/courses/${course!.id}`, payload);
      } else {
        await api.post('/courses', payload);
      }
      router.refresh();
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'บันทึกไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-module bg-white border border-secondary p-5 space-y-4">
      <h3 className="font-display font-semibold text-neutral">{isEdit ? `แก้ไขวิชา ${course!.code}` : 'เพิ่มวิชาใหม่'}</h3>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="รหัสวิชา">
          <input value={code} onChange={(e) => setCode(e.target.value)} required className={inputClass} />
        </Field>
        <Field label="หน่วยกิต">
          <input type="number" min={0} value={credits} onChange={(e) => setCredits(Number(e.target.value))} required className={inputClass} />
        </Field>
        <Field label="ชื่อวิชา (ไทย)">
          <input value={nameTh} onChange={(e) => setNameTh(e.target.value)} required className={inputClass} />
        </Field>
        <Field label="ชื่อวิชา (อังกฤษ)">
          <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} required className={inputClass} />
        </Field>
        <Field label="หมวดวิชา">
          <Select value={category} onChange={setCategory} options={CATEGORY_OPTIONS} />
        </Field>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-body text-xs text-neutral/50">ทักษะที่วิชานี้สร้าง (ใช้คำนวณ skill gap)</span>
          <button
            type="button"
            onClick={addRow}
            disabled={rows.length >= skills.length}
            className="font-body text-xs flex items-center gap-1 text-primary hover:text-primary-deep disabled:opacity-40"
          >
            <PlusIcon className="h-3.5 w-3.5" /> เพิ่มทักษะ
          </button>
        </div>
        {rows.length === 0 ? (
          <p className="font-body text-xs text-neutral/40">ยังไม่ผูกกับทักษะใด — วิชานี้จะไม่ถูกใช้คำนวณ skill gap</p>
        ) : (
          <div className="space-y-2">
            {rows.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1">
                  <Select
                    value={row.skill_id}
                    onChange={(v) => updateRow(i, { skill_id: v })}
                    options={skillOptions.filter((o) => o.value === row.skill_id || !rows.some((r) => r.skill_id === o.value))}
                  />
                </div>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                  value={row.weight}
                  onChange={(e) => updateRow(i, { weight: Number(e.target.value) })}
                  className={`${inputClass} w-24`}
                  title="น้ำหนัก 0-1"
                />
                <button type="button" onClick={() => removeRow(i)} className="p-2 text-neutral/40 hover:text-gap">
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="font-body text-xs text-gap">{error}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="font-body text-sm font-medium rounded-module bg-primary text-white px-5 py-2.5 hover:bg-primary-deep transition-colors disabled:opacity-50">
          {submitting ? 'กำลังบันทึก…' : 'บันทึก'}
        </button>
        <button type="button" onClick={onDone} className="font-body text-sm rounded-module border border-secondary px-5 py-2.5 hover:bg-secondary transition-colors">
          ยกเลิก
        </button>
      </div>
    </form>
  );
}

const inputClass = 'font-body text-sm rounded-module border border-secondary px-3 py-2 bg-white text-neutral w-full focus:outline-none focus:ring-2 focus:ring-primary/40';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-body text-xs text-neutral/50">{label}</span>
      {children}
    </label>
  );
}
