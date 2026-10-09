import { StatusBadge } from './StatusBadge';
import { SkillGapEntry } from '@/lib/types';

const BAR_COLOR: Record<string, string> = {
  strength: 'bg-strength',
  developing: 'bg-developing',
  gap: 'bg-gap',
};

export function SkillBar({ entry }: { entry: SkillGapEntry }) {
  return (
    <div className="py-3 border-b border-secondary last:border-none">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-body text-sm text-neutral">{entry.skill_name}</span>
        <StatusBadge status={entry.status} />
      </div>
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full ${BAR_COLOR[entry.status]}`}
          style={{ width: `${entry.readiness_percent}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-neutral/50 font-body">
        ความพร้อม {entry.readiness_percent}% · ความสำคัญต่อสายอาชีพ {entry.importance_level}/5
      </div>
    </div>
  );
}
