import Link from 'next/link';
import { BarChart3, Map, Sparkles } from 'lucide-react';
import { serverApi as api } from '@/lib/server-api';
import { CareerPath, SkillGapResult, Student } from '@/lib/types';
import { ReadinessGauge } from '@/components/ReadinessGauge';
import { StatusBadge } from '@/components/StatusBadge';
import { CareerPathPicker } from '@/components/CareerPathPicker';
import { CareerPathSwitcher } from '@/components/CareerPathSwitcher';
import { HubMotif } from '@/components/HubMotif';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [student, careerPaths] = await Promise.all([
    api.get<Student>('/students/me'),
    api.get<CareerPath[]>('/career-paths'),
  ]);

  if (!student.target_career_path_id) {
    return (
      <div>
        <Header title="ภาพรวม" subtitle="Dashboard" />
        <div className="relative overflow-hidden rounded-module border border-secondary bg-white px-8 py-14 text-center">
          <HubMotif className="-right-24 -top-24 h-96 w-96" />
          <HubMotif className="-left-20 -bottom-20 h-72 w-72" />
          <div className="relative">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
              <Sparkles className="h-6 w-6 text-primary" strokeWidth={1.6} />
            </div>
            <h3 className="font-display font-semibold text-xl text-primary mb-2">ยังไม่ได้เลือกเส้นทางอาชีพ</h3>
            <p className="font-body text-sm text-neutral/60 mb-7 max-w-md mx-auto">
              เลือกเส้นทางอาชีพที่อยากเป็นก่อน ระบบจะเทียบเกรดและวิชาที่เรียนกับทักษะที่ต้อง
              ใช้ในสายงานนั้น แล้วสร้าง roadmap ให้อัตโนมัติ — เลือกได้ {careerPaths.length || 0} สายงาน สาย Computer Science
              (เปลี่ยนใจภายหลังได้เสมอ)
            </p>
            <CareerPathPicker careerPaths={careerPaths} />
          </div>
        </div>
      </div>
    );
  }

  const gap = await api.get<SkillGapResult>('/students/me/skill-gap-analysis');

  return (
    <div>
      <Header title="ภาพรวม" subtitle="Dashboard" />

      <div className="relative overflow-hidden rounded-module bg-primary-deep text-white p-7 mb-8 flex flex-col sm:flex-row items-center gap-8">
        <HubMotif tone="white" className="-right-16 -top-16 h-80 w-80" />
        <div className="relative shrink-0">
          <div className="rounded-full bg-white p-1">
            <ReadinessGauge percent={gap.overall_readiness_percent} label="ความพร้อมสำหรับสายอาชีพนี้" />
          </div>
        </div>
        <div className="relative">
          <div className="font-body text-xs text-white/60 mb-1 tracking-wide">เป้าหมายสายอาชีพ</div>
          <div className="mb-2">
            <CareerPathSwitcher currentId={student.target_career_path_id} currentName={gap.career_path_name} careerPaths={careerPaths} />
          </div>
          <p className="font-body text-sm text-white/70 max-w-md mb-5">
            อิงจากเกรดในวิชาที่เรียนแล้ว เทียบกับน้ำหนักความสำคัญของแต่ละทักษะในสายอาชีพนี้
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/roadmap" className="font-body text-sm font-medium rounded-module bg-white text-primary-deep px-4 py-2.5 hover:bg-secondary transition-colors flex items-center gap-2">
              <Map className="h-4 w-4" strokeWidth={2} /> ดู Roadmap
            </Link>
            <Link href="/skills" className="font-body text-sm font-medium rounded-module border border-white/30 px-4 py-2.5 hover:bg-white/10 transition-colors flex items-center gap-2">
              <BarChart3 className="h-4 w-4" strokeWidth={2} /> ดูทักษะทั้งหมด
            </Link>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="rounded-module bg-white border border-secondary p-5 shadow-sm shadow-neutral/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-neutral">จุดแข็ง</h3>
            <StatusBadge status="strength" />
          </div>
          {gap.strengths.length === 0 ? (
            <p className="font-body text-sm text-neutral/50">ยังไม่มีทักษะที่แข็งพอ — เริ่มจากวิชาแกนของสายนี้</p>
          ) : (
            <ul className="font-body text-sm text-neutral space-y-2">
              {gap.strengths.slice(0, 5).map((s) => (
                <li key={s.skill_id} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-strength shrink-0" /> {s.skill_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-module bg-white border border-secondary p-5 shadow-sm shadow-neutral/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-neutral">ต้องพัฒนาก่อน</h3>
            <StatusBadge status="gap" />
          </div>
          {gap.gaps.length === 0 ? (
            <p className="font-body text-sm text-neutral/50">ไม่มีช่องว่างสำคัญตอนนี้ เยี่ยมมาก</p>
          ) : (
            <ul className="font-body text-sm text-neutral space-y-2">
              {gap.gaps.slice(0, 5).map((s) => (
                <li key={s.skill_id} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gap shrink-0" /> {s.skill_name}
                  <span className="text-neutral/40 text-xs">({s.readiness_percent}%)</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <div className="font-body text-xs text-neutral/50">{subtitle}</div>
      <h1 className="font-display font-bold text-2xl text-neutral">{title}</h1>
    </div>
  );
}
