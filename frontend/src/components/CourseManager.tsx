'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Course, Skill } from '@/lib/types';
import { CourseForm } from './CourseForm';

const CATEGORY_LABEL: Record<string, string> = {
  core: 'วิชาแกน',
  major_elective: 'เอกเลือก',
  free_elective: 'เลือกเสรี',
  general_ed: 'ศึกษาทั่วไป',
};

export function CourseManager({ courses, skills }: { courses: Course[]; skills: Skill[] }) {
  const [mode, setMode] = useState<'idle' | 'create' | 'edit'>('idle');
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();

  function startEdit(course: Course) {
    setEditingCourse(course);
    setMode('edit');
  }

  function startCreate() {
    setEditingCourse(undefined);
    setMode('create');
  }

  function closeForm() {
    setMode('idle');
    setEditingCourse(undefined);
  }

  async function handleDelete(course: Course) {
    if (!confirm(`ลบวิชา ${course.code} — ${course.name_th}? การลบไม่สามารถย้อนกลับได้`)) return;
    setDeletingId(course.id);
    setDeleteError(null);
    try {
      await api.delete(`/courses/${course.id}`);
      router.refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'ลบไม่สำเร็จ');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-body text-sm text-neutral/60">{courses.length} วิชาในระบบ</p>
        {mode === 'idle' && (
          <button
            onClick={startCreate}
            className="font-body text-sm font-medium rounded-module bg-primary text-white px-4 py-2 hover:bg-primary-deep transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> เพิ่มวิชาใหม่
          </button>
        )}
      </div>

      {mode !== 'idle' && (
        <div className="mb-6">
          <CourseForm course={editingCourse} skills={skills} onDone={closeForm} />
        </div>
      )}

      {deleteError && <p className="font-body text-xs text-gap mb-3">{deleteError}</p>}

      <div className="rounded-module border border-secondary bg-white overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="border-b border-secondary text-left text-neutral/50 text-xs">
              <th className="px-4 py-3 font-medium">รหัสวิชา</th>
              <th className="px-4 py-3 font-medium">ชื่อวิชา</th>
              <th className="px-4 py-3 font-medium">หน่วยกิต</th>
              <th className="px-4 py-3 font-medium">หมวด</th>
              <th className="px-4 py-3 font-medium">ทักษะที่เกี่ยวข้อง</th>
              <th className="px-4 py-3 font-medium text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-b border-secondary last:border-none hover:bg-tertiary/50">
                <td className="px-4 py-3 text-neutral whitespace-nowrap">{c.code}</td>
                <td className="px-4 py-3 text-neutral">
                  <div>{c.name_th}</div>
                  <div className="text-xs text-neutral/40">{c.name_en}</div>
                </td>
                <td className="px-4 py-3 text-neutral/70">{c.credits}</td>
                <td className="px-4 py-3">
                  <span className="font-body text-xs rounded-full bg-secondary text-primary px-2.5 py-1">
                    {CATEGORY_LABEL[c.category] ?? c.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {c.course_skills?.length ? (
                      c.course_skills.map((cs) => (
                        <span key={cs.skill_id} className="font-body text-[11px] rounded-full bg-tertiary text-neutral/60 px-2 py-0.5">
                          {cs.skill.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-neutral/30 text-xs">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => startEdit(c)} className="p-1.5 text-neutral/40 hover:text-primary rounded-module hover:bg-secondary transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      disabled={deletingId === c.id}
                      className="p-1.5 text-neutral/40 hover:text-gap rounded-module hover:bg-secondary transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
