'use client';

import { useCallback, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import {
  CAREER_LEARNING_GUIDES,
  GENERAL_LEARNING_REFERENCES,
} from '@/lib/career-learning';
import {
  ASSESSMENT_BANKS,
} from '@/lib/assessment-questions';
import { AssessmentAttempt, CareerPath } from '@/lib/types';
import { CareerAssessment } from './CareerAssessment';

type View = 'learn' | 'test' | 'history';

export function AssessmentWorkspace({
  careerPaths,
  currentCareerPathId,
  initialAttempts,
}: {
  careerPaths: CareerPath[];
  currentCareerPathId: string | null;
  initialAttempts: AssessmentAttempt[];
}) {
  const [selectedCareerPathId, setSelectedCareerPathId] = useState(
    currentCareerPathId ?? careerPaths[0]?.id ?? '',
  );
  const [view, setView] = useState<View>('learn');
  const [attempts, setAttempts] = useState(initialAttempts);
  const careerPath = careerPaths.find((path) => path.id === selectedCareerPathId);
  const questionBank = careerPath
    ? ASSESSMENT_BANKS[careerPath.name]
    : undefined;
  const guide = careerPath
    ? CAREER_LEARNING_GUIDES[careerPath.name]
    : undefined;
  const careerAttempts = useMemo(
    () =>
      attempts.filter(
        (attempt) => attempt.career_path_id === selectedCareerPathId,
      ),
    [attempts, selectedCareerPathId],
  );

  const recordScore = useCallback(
    async (
      careerPathId: string,
      score: number,
      totalQuestions: number,
    ) => {
      const saved = await api.post<AssessmentAttempt>(
        '/students/me/assessment-attempts',
        {
          career_path_id: careerPathId,
          score,
          total_questions: totalQuestions,
        },
      );
      setAttempts((current) => [saved, ...current]);
    },
    [],
  );

  return (
    <div>
      <section className="mb-5 rounded-module border border-secondary bg-white p-5 sm:p-6">
        <label
          htmlFor="assessment-career-path"
          className="mb-2 block font-body text-sm font-semibold text-neutral"
        >
          เลือกอาชีพที่ต้องการเรียนรู้
        </label>
        {careerPaths.length > 0 ? (
          <select
            id="assessment-career-path"
            value={selectedCareerPathId}
            onChange={(event) => setSelectedCareerPathId(event.target.value)}
            className="min-h-11 w-full max-w-xl rounded-full border border-secondary bg-white px-4 font-body text-sm text-neutral focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
          >
            {careerPaths.map((path) => (
              <option key={path.id} value={path.id}>
                {path.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="font-body text-sm text-neutral/60">
            ยังโหลดรายการอาชีพไม่ได้ ลองโหลดหน้านี้อีกครั้ง
          </p>
        )}
        {careerPath?.description && (
          <p className="mt-2 max-w-3xl font-body text-sm leading-relaxed text-neutral/60">
            {careerPath.description}
          </p>
        )}
      </section>

      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="เนื้อหาอาชีพ">
        {([
          ['learn', 'ภาพรวมความรู้'],
          ['test', 'แบบทดสอบ'],
          ['history', 'ประวัติคะแนน'],
        ] as [View, string][]).map(([tab, label]) => (
          <button
            key={tab}
            id={`career-tab-${tab}`}
            type="button"
            role="tab"
            aria-selected={view === tab}
            aria-controls={`career-panel-${tab}`}
            onClick={() => setView(tab)}
            className={`min-h-10 rounded-full px-4 font-body text-sm font-medium transition-colors ${
              view === tab
                ? 'bg-primary text-white'
                : 'border border-secondary bg-white text-neutral hover:bg-tertiary'
            }`}
          >
            {label}
            {tab === 'history' && careerAttempts.length > 0
              ? ` (${careerAttempts.length})`
              : ''}
          </button>
        ))}
      </div>

      <section
        id={`career-panel-${view}`}
        role="tabpanel"
        aria-labelledby={`career-tab-${view}`}
      >
        {view === 'learn' && (
          <div>
            {!careerPath ? (
              <div className="rounded-module border border-secondary bg-white p-5 font-body text-sm text-neutral/60">
                เลือกสายอาชีพเพื่อดูเนื้อหา
              </div>
            ) : !guide ? (
              <div className="rounded-module border border-secondary bg-white p-5 font-body text-sm text-neutral/60">
                ยังไม่มีคู่มือสรุปสำหรับอาชีพนี้
                เนื้อหาจะเพิ่มตามทักษะและแหล่งอ้างอิงที่ตรวจสอบได้
              </div>
            ) : (
              <>
                <div className="mb-4 rounded-module border border-secondary bg-white p-5 sm:p-6">
                  <h2 className="font-display text-lg font-semibold text-neutral">
                    อาชีพนี้ทำอะไร
                  </h2>
                  <p className="mt-2 font-body text-sm leading-relaxed text-neutral/70">
                    {guide.overview}
                  </p>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <GuideList title="ตัวอย่างงานที่ทำ" items={guide.work} />
                  <GuideList title="ลำดับหัวข้อที่ควรเรียน" items={guide.learn} />
                  <div className="rounded-module border border-secondary bg-white p-5 lg:col-span-2">
                    <h3 className="font-display font-semibold text-neutral">
                      ทักษะที่เชื่อมกับเส้นทางนี้
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {careerPath.skills.map(({ skill, importance_level }) => (
                        <span
                          key={skill.id}
                          title={`ระดับความสำคัญ ${importance_level} จาก 5`}
                          className="rounded-full bg-secondary px-3 py-1.5 font-body text-xs text-primary"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-module border border-secondary bg-white p-5">
                  {guide.sourceNotes && (
                    <>
                      <h3 className="font-display font-semibold text-neutral">
                        สรุปที่มาของหัวข้อ
                      </h3>
                      <ul className="mt-3 list-disc space-y-2 pl-5">
                        {guide.sourceNotes.map((note) => (
                          <li
                            key={note}
                            className="font-body text-xs leading-relaxed text-neutral/65"
                          >
                            {note}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <h3 className="font-display font-semibold text-neutral">
                    แหล่งอ้างอิงสาธารณะสำหรับเรียนต่อ
                  </h3>
                  <p className="mt-1 font-body text-xs leading-relaxed text-neutral/55">
                    เป็นแหล่งเรียนรู้และกรอบอ้างอิง ไม่ใช่การรับรองว่าเนื้อหาครอบคลุมทุกงานหรือทุกนายจ้าง
                  </p>
                  <ul className="mt-3 space-y-2">
                    {guide.references.map((reference) => (
                      <li key={reference.url}>
                        <a
                          href={reference.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-body text-sm text-primary underline decoration-secondary underline-offset-2 hover:text-primary-deep"
                        >
                          {reference.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <h3 className="mt-5 font-display font-semibold text-neutral">
                    สำรวจเส้นทางเรียนรู้อื่น
                  </h3>
                  <p className="mt-1 font-body text-xs leading-relaxed text-neutral/55">
                    ใช้ค้นหา roadmap เพิ่มเติมได้ โดยเนื้อหาอาจปรับตามเส้นทางที่เลือกในเว็บไซต์นั้น
                  </p>
                  <ul className="mt-3 space-y-2">
                    {GENERAL_LEARNING_REFERENCES.map((reference) => (
                      <li key={reference.url}>
                        <a
                          href={reference.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-body text-sm text-primary underline decoration-secondary underline-offset-2 hover:text-primary-deep"
                        >
                          {reference.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {view === 'test' && (
          careerPath && questionBank ? (
            <CareerAssessment
              key={careerPath.id}
              careerPathId={careerPath.id}
              careerPathName={careerPath.name}
              questionBank={questionBank}
              onRecordScore={recordScore}
            />
          ) : (
            <div className="rounded-module border border-secondary bg-white p-5 sm:p-6">
              <h2 className="font-display font-semibold text-neutral">
                คลังข้อสอบสำหรับ {careerPath?.name ?? 'อาชีพที่เลือก'}
              </h2>
              <p className="mt-2 font-body text-sm leading-relaxed text-neutral/65">
                คลังข้อสอบของสายอาชีพนี้ยังอยู่ระหว่างจัดทำ
                ระหว่างนี้อ่านภาพรวมและแหล่งอ้างอิงได้จากแท็บ “ภาพรวมความรู้”
              </p>
            </div>
          )
        )}

        {view === 'history' && (
          <div className="rounded-module border border-secondary bg-white p-5 sm:p-6">
            <h2 className="font-display font-semibold text-neutral">
              ประวัติคะแนน — {careerPath?.name ?? 'เลือกอาชีพ'}
            </h2>
            <p className="mt-1 font-body text-xs text-neutral/50">
              บันทึกเฉพาะคะแนน จำนวนข้อ และวันที่ทำ ไม่บันทึกคำตอบรายข้อ
            </p>
            {careerAttempts.length === 0 ? (
              <p className="mt-5 font-body text-sm text-neutral/55">
                ยังไม่มีประวัติการทำแบบทดสอบของอาชีพนี้
              </p>
            ) : (
              <ol className="mt-4 divide-y divide-secondary">
                {careerAttempts.map((attempt) => (
                  <li
                    key={attempt.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0"
                  >
                    <span className="font-body text-sm text-neutral">
                      {attempt.score} / {attempt.total_questions} ข้อ
                    </span>
                    <time
                      dateTime={attempt.created_at}
                      className="font-body text-xs text-neutral/50"
                    >
                      {new Date(attempt.created_at).toLocaleString('th-TH')}
                    </time>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function GuideList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-module border border-secondary bg-white p-5">
      <h3 className="font-display font-semibold text-neutral">{title}</h3>
      <ol className="mt-3 space-y-2">
        {items.map((item, index) => (
          <li
            key={item}
            className="flex gap-3 font-body text-sm leading-relaxed text-neutral/70"
          >
            <span className="font-display text-xs font-semibold text-primary">
              {index + 1}.
            </span>
            {item}
          </li>
        ))}
      </ol>
    </div>
  );
}
