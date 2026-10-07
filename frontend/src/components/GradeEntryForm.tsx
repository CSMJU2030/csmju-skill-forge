'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DocumentArrowUpIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { api, uploadTranscriptPdf } from '@/lib/api';
import { Grade } from '@/lib/types';
import { Select } from './ui/Select';

const GRADE_OPTIONS = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'W', 'S'].map(
  (grade) => ({ value: grade, label: grade }),
);
const TERM_OPTIONS = [
  { value: '1', label: 'ภาคเรียนที่ 1' },
  { value: '2', label: 'ภาคเรียนที่ 2' },
  { value: '3', label: 'ภาคฤดูร้อน' },
];

function currentAcademicYear() {
  return new Date().getFullYear() + 543;
}

function semesterParts(semester: string) {
  const [year, term] = semester.split('/');
  return { year, term };
}

function semesterLabel(semester: string) {
  const { year, term } = semesterParts(semester);
  return `ปีการศึกษา ${year} · ${TERM_OPTIONS.find((option) => option.value === term)?.label ?? `ภาคเรียนที่ ${term}`}`;
}

export function GradeEntryForm({ grades: initialGrades }: { grades: Grade[] }) {
  const [grades, setGrades] = useState(initialGrades);
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [letterGrade, setLetterGrade] = useState('A');
  const [year, setYear] = useState(String(currentAcademicYear()));
  const [term, setTerm] = useState('1');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingGradeId, setEditingGradeId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    setGrades(initialGrades);
  }, [initialGrades]);

  const yearOptions = useMemo(() => {
    const latestYear = currentAcademicYear() + 2;
    const earliestYear = Math.min(
      currentAcademicYear() - 10,
      ...grades.map((grade) => Number(semesterParts(grade.semester).year) || latestYear),
    );
    return Array.from(
      { length: latestYear - earliestYear + 1 },
      (_, index) => String(latestYear - index),
    ).map((value) => ({ value, label: value }));
  }, [grades]);

  const semesterOptions = useMemo(() => {
    const semesters = Array.from(new Set(grades.map((grade) => grade.semester)));
    return semesters.sort((a, b) => b.localeCompare(a));
  }, [grades]);

  const visibleGrades = useMemo(
    () =>
      grades.filter(
        (grade) => semesterFilter === 'all' || grade.semester === semesterFilter,
      ),
    [grades, semesterFilter],
  );

  const groupedGrades = useMemo(() => {
    const groups = new Map<string, Grade[]>();
    for (const grade of visibleGrades) {
      const group = groups.get(grade.semester) ?? [];
      group.push(grade);
      groups.set(grade.semester, group);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [visibleGrades]);

  const selectedVisibleCount = visibleGrades.filter((grade) =>
    selectedIds.has(grade.id),
  ).length;
  const allVisibleSelected =
    visibleGrades.length > 0 && selectedVisibleCount === visibleGrades.length;
  const busy = submitting || scanning || deletingIds.size > 0;

  function resetForm() {
    setEditingGradeId(null);
    setCourseCode('');
    setCourseName('');
    setLetterGrade('A');
    setYear(String(currentAcademicYear()));
    setTerm('1');
  }

  function startEditing(grade: Grade) {
    const parts = semesterParts(grade.semester);
    setEditingGradeId(grade.id);
    setCourseCode(grade.course.code);
    setCourseName(grade.course.name_th);
    setLetterGrade(grade.letter_grade);
    setYear(parts.year);
    setTerm(parts.term);
    setMessage(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!courseCode.trim() || !courseName.trim()) return;

    setSubmitting(true);
    setMessage(null);
    const payload = {
      course_code: courseCode.trim(),
      course_name: courseName.trim(),
      letter_grade: letterGrade,
      semester: `${year}/${term}`,
    };

    try {
      if (editingGradeId) {
        const updated = await api.patch<Grade>(
          `/students/me/grades/${editingGradeId}`,
          payload,
        );
        setGrades((current) =>
          current.map((grade) => (grade.id === updated.id ? updated : grade)),
        );
        setMessage({ text: 'อัปเดตเกรดเรียบร้อยแล้ว' });
      } else {
        const saved = await api.post<Grade>('/students/me/grades', payload);
        setGrades((current) => {
          const existing = current.find(
            (grade) =>
              grade.course_id === saved.course_id &&
              grade.semester === saved.semester,
          );
          return existing
            ? current.map((grade) =>
                grade.id === existing.id ? saved : grade,
              )
            : [saved, ...current];
        });
        setMessage({ text: 'บันทึกเกรดเรียบร้อยแล้ว' });
      }
      resetForm();
      router.refresh();
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'บันทึกเกรดไม่สำเร็จ',
        error: true,
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteGrades(ids: string[]) {
    if (ids.length === 0) return;
    setDeletingIds(new Set(ids));
    setMessage(null);
    const results = await Promise.allSettled(
      ids.map((id) => api.delete(`/students/me/grades/${id}`)),
    );
    const deletedIds = new Set(
      ids.filter((_, index) => results[index].status === 'fulfilled'),
    );
    const failedCount = ids.length - deletedIds.size;

    setGrades((current) =>
      current.filter((grade) => !deletedIds.has(grade.id)),
    );
    setSelectedIds((current) => {
      const next = new Set(current);
      deletedIds.forEach((id) => next.delete(id));
      return next;
    });
    if (editingGradeId && deletedIds.has(editingGradeId)) resetForm();

    setMessage(
      failedCount === 0
        ? { text: `ลบ ${deletedIds.size} รายการเรียบร้อยแล้ว` }
        : {
            text: `ลบสำเร็จ ${deletedIds.size} รายการ แต่ลบไม่สำเร็จ ${failedCount} รายการ`,
            error: true,
          },
    );
    setDeletingIds(new Set());
    if (deletedIds.size > 0) router.refresh();
  }

  function handleDeleteOne(grade: Grade) {
    if (
      window.confirm(
        `ต้องการลบเกรด ${grade.course.code} ภาคเรียน ${grade.semester} ใช่หรือไม่?`,
      )
    ) {
      void deleteGrades([grade.id]);
    }
  }

  function handleDeleteSelected() {
    const ids = Array.from(selectedIds);
    if (
      ids.length > 0 &&
      window.confirm(`ต้องการลบรายการเกรดที่เลือก ${ids.length} รายการใช่หรือไม่?`)
    ) {
      void deleteGrades(ids);
    }
  }

  function toggleGradeSelection(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleVisibleSelection() {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (allVisibleSelected) {
        visibleGrades.forEach((grade) => next.delete(grade.id));
      } else {
        visibleGrades.forEach((grade) => next.add(grade.id));
      }
      return next;
    });
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setMessage({ text: 'กรุณาเลือกไฟล์ PDF เท่านั้น', error: true });
      event.target.value = '';
      return;
    }

    setScanning(true);
    setMessage(null);
    try {
      const result = await uploadTranscriptPdf(file);
      setMessage({
        text: `สแกนสำเร็จ เพิ่มหรืออัปเดต ${result.coursesExtractedCount} รายวิชา`,
      });
      event.target.value = '';
      router.refresh();
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'สแกน PDF ไม่สำเร็จ',
        error: true,
      });
    } finally {
      setScanning(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-module border border-secondary bg-white shadow-sm shadow-neutral/5">
      <div className="flex flex-col gap-4 border-b border-secondary bg-gradient-to-r from-white to-tertiary/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-neutral">
            จัดการผลการเรียน
          </h2>
          <p className="mt-1 font-body text-sm text-neutral/55">
            เพิ่มรายวิชาด้วยตัวเอง หรือนำเข้าผลการเรียนจาก PDF
          </p>
        </div>
        <label
          className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-semibold text-white shadow-sm transition-colors ${
            scanning
              ? 'cursor-wait bg-strength/60'
              : 'bg-strength hover:bg-strength/90'
          }`}
        >
          {scanning ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <DocumentArrowUpIcon className="h-5 w-5" />
          )}
          {scanning ? 'กำลังสแกน PDF…' : 'นำเข้าเกรดจาก PDF'}
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="sr-only"
            onChange={handleFileChange}
            disabled={busy}
          />
        </label>
      </div>

      <div className="p-5 sm:p-6">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="scroll-mt-24 rounded-2xl border border-secondary bg-tertiary/65 p-4 sm:p-5"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-body text-sm font-semibold text-neutral">
                {editingGradeId ? 'แก้ไขรายการเกรด' : 'เพิ่มรายการเกรด'}
              </h3>
              <p className="mt-0.5 font-body text-xs text-neutral/50">
                กรอกรหัสและชื่อวิชา แล้วเลือกเกรดกับภาคเรียน
              </p>
            </div>
            {editingGradeId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-body text-xs font-medium text-neutral/65 transition-colors hover:bg-white hover:text-neutral"
              >
                <XMarkIcon className="h-4 w-4" />
                ยกเลิก
              </button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(130px,1fr)_minmax(0,2fr)_minmax(100px,0.7fr)_minmax(115px,0.8fr)_minmax(120px,0.9fr)_minmax(160px,auto)] xl:items-end">
            <Field label="รหัสวิชา">
              <input
                value={courseCode}
                onChange={(event) => setCourseCode(event.target.value)}
                className="min-h-11 w-full rounded-full border border-secondary bg-white px-4 font-body text-sm text-neutral placeholder:text-neutral/35 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
                placeholder="เช่น 10301111"
                required
                disabled={busy}
              />
            </Field>
            <Field label="ชื่อวิชา">
              <input
                value={courseName}
                onChange={(event) => setCourseName(event.target.value)}
                className="min-h-11 w-full rounded-full border border-secondary bg-white px-4 font-body text-sm text-neutral placeholder:text-neutral/35 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
                placeholder="พิมพ์ชื่อรายวิชา"
                required
                disabled={busy}
              />
            </Field>
            <Field label="เกรด">
              <Select
                value={letterGrade}
                onChange={setLetterGrade}
                options={GRADE_OPTIONS}
                disabled={busy}
              />
            </Field>
            <Field label="ปีการศึกษา">
              <Select
                value={year}
                onChange={setYear}
                options={yearOptions}
                disabled={busy}
              />
            </Field>
            <Field label="ภาคเรียน">
              <Select
                value={term}
                onChange={setTerm}
                options={TERM_OPTIONS}
                disabled={busy}
              />
            </Field>
            <button
              type="submit"
              disabled={busy}
              className="h-11 min-h-0 w-36 justify-self-start self-end rounded-full bg-primary px-4 font-body text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-deep focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? 'กำลังบันทึก…'
                : editingGradeId
                  ? 'บันทึกการแก้ไข'
                  : 'บันทึกเกรด'}
            </button>
          </div>
        </form>

        {message && (
          <div
            role="status"
            className={`mt-4 rounded-xl border px-4 py-3 font-body text-sm ${
              message.error
                ? 'border-gap/15 bg-gap/5 text-gap'
                : 'border-strength/15 bg-strength/5 text-strength'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-6">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="font-body text-sm font-semibold text-neutral">
                รายการเกรด
              </h3>
              <p className="mt-0.5 font-body text-xs text-neutral/50">
                แสดง {visibleGrades.length} จาก {grades.length} รายการ
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="grade-semester-filter" className="sr-only">
                กรองตามภาคเรียน
              </label>
              <select
                id="grade-semester-filter"
                value={semesterFilter}
                onChange={(event) => setSemesterFilter(event.target.value)}
                className="min-h-10 rounded-full border border-secondary bg-white px-4 font-body text-sm text-neutral focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
              >
                <option value="all">แสดงทั้งหมด</option>
                {semesterOptions.map((semester) => (
                  <option key={semester} value={semester}>
                    {semesterLabel(semester)}
                  </option>
                ))}
              </select>
              {selectedIds.size > 0 && (
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  disabled={busy}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-gap px-4 font-body text-sm font-semibold text-white transition-colors hover:bg-gap/90 disabled:opacity-50"
                >
                  <TrashIcon className="h-4 w-4" />
                  ลบที่เลือก ({selectedIds.size})
                </button>
              )}
            </div>
          </div>

          {grades.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-secondary bg-tertiary/50 px-4 py-8 text-center">
              <p className="font-body text-sm font-medium text-neutral/70">
                ยังไม่มีรายการเกรด
              </p>
              <p className="mt-1 font-body text-xs text-neutral/45">
                เพิ่มเกรดด้วยแบบฟอร์มด้านบน หรือนำเข้าจากไฟล์ PDF
              </p>
            </div>
          ) : visibleGrades.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-secondary bg-tertiary/50 px-4 py-8 text-center font-body text-sm text-neutral/60">
              ไม่มีเกรดในภาคเรียนที่เลือก
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <input
                  id="select-visible-grades"
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleVisibleSelection}
                  aria-label="เลือกเกรดทั้งหมดที่แสดง"
                  className="h-4 w-4 rounded border-secondary accent-primary"
                />
                <label
                  htmlFor="select-visible-grades"
                  className="font-body text-xs text-neutral/60"
                >
                  เลือกทั้งหมดที่แสดง
                </label>
              </div>
              {groupedGrades.map(([semester, semesterGrades]) => (
                <section
                  key={semester}
                  aria-label={semesterLabel(semester)}
                  className="overflow-hidden rounded-2xl border border-secondary"
                >
                  <div className="flex items-center justify-between bg-tertiary/70 px-4 py-3 sm:px-5">
                    <h4 className="font-body text-sm font-semibold text-neutral">
                      {semesterLabel(semester)}
                    </h4>
                    <span className="rounded-full bg-white px-2.5 py-1 font-body text-xs text-neutral/55">
                      {semesterGrades.length} วิชา
                    </span>
                  </div>
                  <ul className="divide-y divide-secondary">
                    {semesterGrades.map((grade) => (
                      <li
                        key={grade.id}
                        className={`flex flex-col gap-3 px-4 py-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
                          editingGradeId === grade.id
                            ? 'bg-primary/[0.035]'
                            : 'bg-white'
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(grade.id)}
                            onChange={() => toggleGradeSelection(grade.id)}
                            aria-label={`เลือก ${grade.course.code} ${grade.course.name_th}`}
                            className="h-4 w-4 shrink-0 rounded border-secondary accent-primary"
                          />
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 font-display text-sm font-bold text-primary">
                            {grade.letter_grade}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-body text-sm font-semibold text-neutral">
                              {grade.course.name_th}
                            </p>
                            <p className="mt-0.5 font-body text-xs text-neutral/50">
                              {grade.course.code}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pl-7 sm:shrink-0 sm:pl-0">
                          <button
                            type="button"
                            onClick={() => startEditing(grade)}
                            disabled={busy}
                            aria-label={`แก้ไขเกรดวิชา ${grade.course.code}`}
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-secondary px-3.5 font-body text-xs font-medium text-neutral/70 transition-colors hover:border-primary/25 hover:bg-primary/5 hover:text-primary disabled:opacity-50"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                            แก้ไข
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOne(grade)}
                            disabled={busy}
                            aria-label={`ลบเกรดวิชา ${grade.course.code}`}
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-gap/15 px-3.5 font-body text-xs font-medium text-gap/80 transition-colors hover:bg-gap/5 disabled:opacity-50"
                          >
                            <TrashIcon className="h-4 w-4" />
                            {deletingIds.has(grade.id) ? 'กำลังลบ…' : 'ลบ'}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="font-body text-xs font-medium text-neutral/55">
        {label}
      </span>
      {children}
    </label>
  );
}
