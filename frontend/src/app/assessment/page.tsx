import { AssessmentWorkspace } from '@/components/AssessmentWorkspace';
import { serverApi as api } from '@/lib/server-api';
import { AssessmentAttempt, CareerPath, Student } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AssessmentPage() {
  const [careerPaths, student, attempts] = await Promise.all([
    api.get<CareerPath[]>('/career-paths'),
    api.get<Student>('/students/me'),
    api.get<AssessmentAttempt[]>('/students/me/assessment-attempts'),
  ]);

  return (
    <div>
      <div className="mb-6">
        <div className="font-body text-xs text-neutral/50">
          Career learning & assessment
        </div>
        <h1 className="font-display font-bold text-2xl text-neutral">
          เรียนรู้และประเมินทักษะตามสายอาชีพ
        </h1>
        <p className="mt-1 font-body text-sm text-neutral/60">
          อ่านภาพรวมงานและแหล่งเรียนรู้สาธารณะ พร้อมทำแบบทดสอบตามสายอาชีพ
        </p>
      </div>
      <AssessmentWorkspace
        careerPaths={careerPaths}
        currentCareerPathId={student.target_career_path_id}
        initialAttempts={attempts}
      />
    </div>
  );
}
