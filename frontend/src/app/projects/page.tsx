import { api } from '@/lib/api';
import { ProjectIdea } from '@/lib/types';
import { EmptyState } from '@/components/EmptyState';

export const dynamic = 'force-dynamic';

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: 'เริ่มต้น',
  intermediate: 'กลาง',
  advanced: 'ขั้นสูง',
};

export default async function ProjectsPage() {
  let recommended: ProjectIdea[] = [];
  try {
    recommended = await api.get<ProjectIdea[]>('/students/me/project-recommendations');
  } catch {
    recommended = [];
  }
  const all = await api.get<ProjectIdea[]>('/project-ideas');

  return (
    <div>
      <div className="mb-6">
        <div className="font-body text-xs text-neutral/50">Portfolio projects</div>
        <h1 className="font-display font-bold text-2xl text-neutral">ผลงานที่ควรทำเพื่อพอร์ตโฟลิโอ</h1>
      </div>

      {recommended.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display font-semibold text-neutral mb-3">แนะนำสำหรับจุดที่ต้องพัฒนา</h2>
          <ProjectList items={recommended} />
        </section>
      )}

      <section>
        <h2 className="font-display font-semibold text-neutral mb-3">ทั้งหมด</h2>
        {all.length === 0 ? (
          <EmptyState title="ยังไม่มีไอเดียผลงาน" description="รอทีม PM เพิ่มข้อมูลในระบบทะเบียนกลาง" />
        ) : (
          <ProjectList items={all} />
        )}
      </section>
    </div>
  );
}

function ProjectList({ items }: { items: ProjectIdea[] }) {
  return (
    <div className="space-y-3">
      {items.map((p) => (
        <div key={p.id} className="rounded-module bg-white border border-secondary p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display font-semibold text-sm text-neutral">{p.title}</h3>
            <span className="font-body text-xs text-neutral/50">{DIFFICULTY_LABEL[p.difficulty] ?? p.difficulty}</span>
          </div>
          <p className="font-body text-sm text-neutral/70 mb-2">{p.description}</p>
          <div className="flex flex-wrap gap-1">
            {p.skills.map((s) => (
              <span key={s.skill.id} className="font-body text-[11px] rounded-full bg-secondary text-primary px-2 py-0.5">
                {s.skill.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
