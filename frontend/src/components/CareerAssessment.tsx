'use client';

import { useEffect, useState } from 'react';
import { AssessmentQuestion } from '@/lib/assessment-questions';

const QUESTION_COUNT = 10;
const DURATION_SECONDS = 15 * 60;

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function CareerAssessment({
  careerPathId,
  careerPathName,
  questionBank,
  onRecordScore,
}: {
  careerPathId: string;
  careerPathName: string;
  questionBank: AssessmentQuestion[];
  onRecordScore: (
    careerPathId: string,
    score: number,
    totalQuestions: number,
  ) => Promise<void>;
}) {
  const [questions, setQuestions] = useState(
    questionBank.slice(0, QUESTION_COUNT),
  );
  const questionCount = Math.min(QUESTION_COUNT, questionBank.length);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [savingScore, setSavingScore] = useState(false);
  const [scoreSaveError, setScoreSaveError] = useState<string | null>(null);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(DURATION_SECONDS);
  const started = deadline !== null || submitted;
  const correctCount = questions.filter(
    (question) => answers[question.id] === question.answer,
  ).length;
  const skillResults = Array.from(
    questions.reduce((results, question) => {
      const result = results.get(question.skill) ?? { correct: 0, total: 0 };
      result.total += 1;
      if (answers[question.id] === question.answer) result.correct += 1;
      results.set(question.skill, result);
      return results;
    }, new Map<string, { correct: number; total: number }>()),
  );

  useEffect(() => {
    if (!submitted || scoreSaved || scoreSaveError) return;
    let cancelled = false;
    setSavingScore(true);
    onRecordScore(careerPathId, correctCount, questions.length)
      .then(() => {
        if (!cancelled) setScoreSaved(true);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setScoreSaveError(
            error instanceof Error ? error.message : 'บันทึกคะแนนไม่สำเร็จ',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setSavingScore(false);
      });
    return () => {
      cancelled = true;
    };
  }, [
    correctCount,
    careerPathId,
    onRecordScore,
    questions.length,
    scoreSaveError,
    scoreSaved,
    submitted,
  ]);

  useEffect(() => {
    if (deadline === null || submitted) return;

    const updateRemainingTime = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemainingSeconds(remaining);
      if (remaining === 0) {
        setDeadline(null);
        setSubmitted(true);
      }
    };

    updateRemainingTime();
    const intervalId = window.setInterval(updateRemainingTime, 1000);
    return () => window.clearInterval(intervalId);
  }, [deadline, submitted]);

  function startAssessment() {
    const questionsBySkill = new Map<string, AssessmentQuestion[]>();
    for (const question of questionBank) {
      const skillQuestions = questionsBySkill.get(question.skill) ?? [];
      skillQuestions.push(question);
      questionsBySkill.set(question.skill, skillQuestions);
    }
    const onePerSkill = Array.from(questionsBySkill.values()).map(
      (skillQuestions) => shuffled(skillQuestions)[0],
    );
    const includedIds = new Set(onePerSkill.map((question) => question.id));
    const additionalQuestions = shuffled(
      questionBank.filter((question) => !includedIds.has(question.id)),
    ).slice(0, questionCount - onePerSkill.length);
    const selectedQuestions = shuffled([...onePerSkill, ...additionalQuestions]);
    setQuestions(
      selectedQuestions.map((question) => ({
        ...question,
        options: shuffled(question.options),
      })),
    );
    setAnswers({});
    setRemainingSeconds(DURATION_SECONDS);
    setSubmitted(false);
    setScoreSaveError(null);
    setScoreSaved(false);
    setDeadline(Date.now() + DURATION_SECONDS * 1000);
  }

  function submitAssessment() {
    setSubmitted(true);
    setDeadline(null);
  }

  function retakeAssessment() {
    setAnswers({});
    setSubmitted(false);
    setDeadline(null);
    setRemainingSeconds(DURATION_SECONDS);
    setScoreSaveError(null);
    setScoreSaved(false);
  }

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <div>
      <div className="mb-6 rounded-module border border-secondary bg-white p-5 sm:p-6">
        <p className="font-body text-sm leading-relaxed text-neutral/70">
          แบบทดสอบสถานการณ์จำลองสำหรับ {careerPathName}
          ผลนี้เป็นแบบฝึกหัดประเมินตนเอง ไม่ใช่ใบรับรองหรือการยืนยันความพร้อมทำงาน
        </p>
        <p className="mt-2 font-body text-xs text-neutral/50">
          ระบบจะสุ่ม {questionCount} ข้อจากคลัง {questionBank.length} ข้อ
          ให้เวลา 15 นาที เริ่มจับเวลาเมื่อกดเริ่มทำแบบทดสอบ
          คำตอบจะถูกตรวจในเว็บโดยไม่มีการส่งไป AI หรือบริการภายนอก
          โจทย์เป็นข้อเขียนใหม่ตามหัวข้อความรู้ ไม่ใช่ข้อสอบที่คัดลอกจากแหล่งอ้างอิง
        </p>
      </div>

      {!started ? (
        <div className="rounded-module border border-secondary bg-white p-5 sm:p-6">
          <h2 className="font-display font-semibold text-neutral">
            พร้อมเริ่มทำแบบทดสอบหรือยัง?
          </h2>
          <p className="mt-2 font-body text-sm text-neutral/60">
            เมื่อเริ่มแล้ว เวลาจะนับต่อเนื่องจนครบ 15 นาทีหรือจนกดส่งคำตอบ
            หากหมดเวลา ระบบจะส่งคำตอบที่ทำไว้โดยอัตโนมัติ
          </p>
          <button
            type="button"
            onClick={startAssessment}
            className="mt-5 min-h-11 rounded-full bg-primary px-6 font-body text-sm font-semibold text-white transition-colors hover:bg-primary-deep"
          >
            เริ่มทดสอบ · {questionCount} ข้อ · 15:00
          </button>
        </div>
      ) : !submitted ? (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display font-semibold text-neutral">สถานการณ์ทดสอบ</h2>
            <div className="flex items-center gap-4">
              <span
                role="timer"
                aria-live="off"
                className={`font-display text-sm font-semibold tabular-nums ${
                  remainingSeconds <= 60 ? 'text-gap' : 'text-primary'
                }`}
              >
                เหลือเวลา {minutes}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="font-body text-xs text-neutral/55">
                ตอบแล้ว {Object.keys(answers).length} / {questions.length}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <fieldset
                key={question.id}
                className="rounded-module border border-secondary bg-white p-5"
              >
                <legend className="sr-only">ข้อที่ {index + 1}</legend>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-secondary px-2.5 py-1 font-body text-xs text-primary">
                    {question.skill}
                  </span>
                  <span className="font-body text-xs text-neutral/45">
                    ข้อ {index + 1}
                  </span>
                </div>
                <p className="mb-4 font-body text-sm font-medium leading-relaxed text-neutral">
                  {question.prompt}
                </p>
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 font-body text-sm leading-relaxed transition-colors ${
                        answers[question.id] === option.id
                          ? 'border-primary/40 bg-primary/5 text-primary'
                          : 'border-secondary text-neutral hover:bg-tertiary/60'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.id}
                        checked={answers[question.id] === option.id}
                        onChange={() =>
                          setAnswers((current) => ({
                            ...current,
                            [question.id]: option.id,
                          }))
                        }
                        className="mt-1 accent-primary"
                      />
                      <span>{option.text}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <button
            type="button"
            onClick={submitAssessment}
            className="mt-5 min-h-11 rounded-full bg-primary px-6 font-body text-sm font-semibold text-white transition-colors hover:bg-primary-deep"
          >
            ส่งคำตอบและจบการทดสอบ
          </button>
        </>
      ) : (
        <section aria-live="polite">
          <div className="rounded-module border border-primary/15 bg-white p-5 sm:p-6">
            <p className="font-body text-xs text-neutral/50">ผลการทำแบบฝึกหัด</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-neutral">
              {correctCount} / {questions.length} ข้อ
            </h2>
            <p className="mt-1 font-body text-sm text-neutral/60">
              ใช้ผลนี้เลือกหัวข้อที่ควรทบทวน ไม่ใช่เกณฑ์ตัดสินว่าได้หรือไม่ได้งาน
              {Object.keys(answers).length < questions.length &&
                ` (ไม่ได้ตอบ ${questions.length - Object.keys(answers).length} ข้อ)`}
            </p>
            {savingScore && (
              <p role="status" className="mt-3 font-body text-xs text-neutral/55">
                กำลังบันทึกคะแนน…
              </p>
            )}
            {scoreSaved && (
              <p role="status" className="mt-3 font-body text-xs text-strength">
                บันทึกคะแนนลงประวัติแล้ว
              </p>
            )}
            {scoreSaveError && (
              <p role="alert" className="mt-3 font-body text-xs text-gap">
                บันทึกประวัติไม่สำเร็จ: {scoreSaveError}
              </p>
            )}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {skillResults.map(([skill, result]) => (
                <div key={skill} className="rounded-xl bg-tertiary/70 p-3">
                  <p className="font-body text-xs text-neutral/60">{skill}</p>
                  <p className="mt-1 font-display font-semibold text-neutral">
                    {result.correct} / {result.total} ข้อ
                  </p>
                </div>
              ))}
            </div>
          </div>
          <h3 className="mb-3 mt-6 font-display font-semibold text-neutral">
            เฉลยและคำอธิบาย
          </h3>
          <div className="space-y-3">
            {questions.map((question, index) => {
              const isCorrect = answers[question.id] === question.answer;
              const correctOption = question.options.find(
                (option) => option.id === question.answer,
              );
              return (
                <article
                  key={question.id}
                  className="rounded-module border border-secondary bg-white p-4"
                >
                  <p className="font-body text-xs text-neutral/50">
                    ข้อ {index + 1} · {question.skill} ·{' '}
                    <span className={isCorrect ? 'text-strength' : 'text-gap'}>
                      {isCorrect ? 'ตอบถูก' : 'ควรทบทวน'}
                    </span>
                  </p>
                  <p className="mt-1 font-body text-sm font-medium text-neutral">
                    {question.prompt}
                  </p>
                  <p className="mt-2 font-body text-sm text-neutral/70">
                    คำตอบที่เหมาะสม: {correctOption?.text}
                  </p>
                  <p className="mt-1 font-body text-sm leading-relaxed text-neutral/60">
                    {question.explanation}
                  </p>
                </article>
              );
            })}
          </div>
          <button
            type="button"
            onClick={retakeAssessment}
            disabled={savingScore}
            className="mt-5 min-h-11 rounded-full border border-secondary bg-white px-6 font-body text-sm font-semibold text-neutral transition-colors hover:bg-tertiary"
          >
            กลับไปหน้าเริ่มต้น
          </button>
        </section>
      )}
    </div>
  );
}
