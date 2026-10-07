import { api } from '@/lib/api';
import { Grade, SkillGapResult } from '@/lib/types';
import { SkillBar } from '@/components/SkillBar';
import { GradeEntryForm } from '@/components/GradeEntryForm';
import { EmptyState } from '@/components/EmptyState';

export const dynamic = 'force-dynamic';

export default async function SkillsPage() {
  const grades = await api.get<Grade[]>('/students/me/grades');
  let gap: SkillGapResult | null = null;
  try {
    gap = await api.get<SkillGapResult>('/students/me/skill-gap-analysis');
  } catch {
    gap = null;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="font-body text-xs text-neutral/50">Skill gap</div>
        <h1 className="font-display font-bold text-2xl text-neutral">จุดแข็ง / จุดที่ต้องพัฒนา</h1>
      </div>

      <section className="mb-8">
        <GradeEntryForm grades={grades} />
      </section>

      {!gap ? (
        <EmptyState title="ยังไม่ได้เลือกเส้นทางอาชีพ" description="ไปที่หน้าภาพรวมเพื่อเลือกเส้นทางอาชีพก่อน แล้วกลับมาดูผลวิเคราะห์ทักษะที่นี่" />
      ) : (
        <div className="rounded-module bg-white border border-secondary p-5">
          <h2 className="font-display font-semibold text-neutral mb-2">
            เทียบกับสายอาชีพ: {gap.career_path_name}
          </h2>
          {[...gap.gaps, ...gap.developing, ...gap.strengths].map((entry) => (
            <SkillBar key={entry.skill_id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
