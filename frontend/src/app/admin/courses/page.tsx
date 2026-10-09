import { ShieldAlert } from 'lucide-react';
import { serverApi as api } from '@/lib/server-api';
import { Course, Identity, Skill } from '@/lib/types';
import { CourseManager } from '@/components/CourseManager';

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
  const identity = await api.get<Identity>('/identity');
  const isStaff = identity.subsystem_role === 'STAFF' || identity.subsystem_role === 'ADMIN';

  if (!isStaff) {
    return (
      <div>
        <Header />
        <div className="rounded-module border border-secondary bg-white px-8 py-14 text-center">
          <ShieldAlert className="h-8 w-8 text-gap mx-auto mb-3" strokeWidth={1.6} />
          <h3 className="font-display font-semibold text-lg text-neutral mb-2">ไม่มีสิทธิ์เข้าถึงหน้านี้</h3>
          <p className="font-body text-sm text-neutral/60 max-w-md mx-auto">
            การจัดการวิชา/ทักษะเป็นสิทธิ์ของบัญชีสาขา (staff/admin) เท่านั้น — ไม่ใช่บัญชีนักศึกษารายบุคคล
            ติดต่อทีม PM ของสาขาหากต้องการเพิ่ม/แก้ไขวิชา
          </p>
        </div>
      </div>
    );
  }

  const [courses, skills] = await Promise.all([
    api.get<Course[]>('/courses'),
    api.get<Skill[]>('/skills'),
  ]);

  return (
    <div>
      <Header />
      <CourseManager courses={courses} skills={skills} />
    </div>
  );
}

function Header() {
  return (
    <div className="mb-6">
      <div className="font-body text-xs text-neutral/50">Course catalog (staff/admin)</div>
      <h1 className="font-display font-bold text-2xl text-neutral">จัดการวิชาในหลักสูตร</h1>
      <p className="font-body text-sm text-neutral/60 mt-1">
        วิชาที่นี่ใช้ร่วมกันทุกบัญชีในสาขา — แก้ไขที่นี่ที่เดียว มีผลกับนักศึกษาทุกคน
      </p>
    </div>
  );
}
