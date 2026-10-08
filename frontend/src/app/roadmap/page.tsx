import { serverApi as api } from '@/lib/server-api';
import { Roadmap } from '@/lib/types';
import { RouteMilestone } from '@/components/RouteMilestone';
import { EmptyState } from '@/components/EmptyState';

export const dynamic = 'force-dynamic';

export default async function RoadmapPage() {
  const roadmap = await api.get<Roadmap | null>('/students/me/roadmap');

  return (
    <div>
      <div className="mb-6">
        <div className="font-body text-xs text-neutral/50">Roadmap</div>
        <h1 className="font-display font-bold text-2xl text-neutral">เส้นทางสู่ {roadmap?.career_path_name ?? '...'}</h1>
      </div>

      {!roadmap ? (
        <EmptyState title="ยังไม่มีข้อมูลเพียงพอ" description="เลือกเส้นทางอาชีพและกรอกเกรดก่อน เพื่อให้ระบบคำนวณ roadmap ได้" />
      ) : roadmap.milestones.length === 0 ? (
        <EmptyState title="ทักษะพร้อมครบแล้ว" description="ไม่มีช่องว่างสำคัญที่ต้องปิดตอนนี้ — ลองดูผลงานเพิ่มเติมในหน้าผลงาน" />
      ) : (
        <div className="relative">
          <div className="route-line absolute left-[21px] top-2 bottom-2" />
          {roadmap.milestones.map((m, i) => (
            <RouteMilestone key={m.skill_id} milestone={m} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
