import { RoadmapMilestone } from '@/lib/types';

// Echoes the "Module" plug icons connected to the Core Hub in the blueprint —
// each roadmap stop is a node on a single vertical route line, not a card grid.
export function RouteMilestone({ milestone, index }: { milestone: RoadmapMilestone; index: number }) {
  return (
    <div className="relative pl-14 pb-10 last:pb-0">
      <div className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white font-display font-bold text-sm shrink-0 z-10">
        {index + 1}
      </div>
      <div className="rounded-module bg-white border border-secondary p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display font-semibold text-neutral">{milestone.skill_name}</h3>
          <span className="font-body text-xs text-neutral/50">ความพร้อม {milestone.readiness_percent}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden mb-4">
          <div className="h-full rounded-full bg-primary" style={{ width: `${milestone.readiness_percent}%` }} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4 font-body text-sm">
          <Column title="วิชาที่ควรเรียน">
            {milestone.recommended_courses.length === 0 ? (
              <Empty />
            ) : (
              milestone.recommended_courses.map((c) => (
                <div key={c.code}>{c.code} — {c.name_th}</div>
              ))
            )}
          </Column>
          <Column title="ใบรับรองฟรี">
            {milestone.recommended_certificates.length === 0 ? (
              <Empty />
            ) : (
              milestone.recommended_certificates.map((c) => (
                <a key={c.name} href={c.url} target="_blank" rel="noreferrer" className="block hover:text-primary underline decoration-secondary underline-offset-2">
                  {c.name}
                </a>
              ))
            )}
          </Column>
          <Column title="ผลงานที่ควรทำ">
            {milestone.recommended_projects.length === 0 ? (
              <Empty />
            ) : (
              milestone.recommended_projects.map((p) => <div key={p.title}>{p.title}</div>)
            )}
          </Column>
        </div>
      </div>
    </div>
  );
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-neutral/50 mb-1.5">{title}</div>
      <div className="space-y-1 text-neutral">{children}</div>
    </div>
  );
}

function Empty() {
  return <span className="text-neutral/30">—</span>;
}
