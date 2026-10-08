'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  MapIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

// Styled after the "Subsystem Registry" module from the CSMJU2030 blueprint —
// each nav item reads as a plugged-in module off the Core, not a generic sidebar.
const NAV = [
  { href: '/dashboard', label: 'ภาพรวม', sub: 'Dashboard', icon: HomeIcon },
  { href: '/roadmap', label: 'เส้นทางอาชีพ', sub: 'Roadmap', icon: MapIcon },
  { href: '/skills', label: 'จุดแข็ง / จุดพัฒนา', sub: 'Skill gap', icon: ChartBarIcon },
  { href: '/certificates', label: 'ใบรับรองฟรี', sub: 'Certificates', icon: AcademicCapIcon },
  { href: '/assessment', label: 'ทดสอบทักษะ', sub: 'Skill assessment', icon: ClipboardDocumentCheckIcon },
  { href: '/projects', label: 'ผลงานที่ควรทำ', sub: 'Projects', icon: BriefcaseIcon },
  { href: '/documents', label: 'เรซูเม่ / จดหมาย', sub: 'Documents', icon: DocumentTextIcon },
];

const ADMIN_NAV = { href: '/admin/courses', label: 'จัดการวิชา', sub: 'Course catalog (staff)', icon: Cog6ToothIcon };

export function Sidebar({
  role,
}: {
  role?: 'student' | 'alumni' | 'staff' | 'lecturer' | 'guest' | 'admin';
}) {
  const pathname = usePathname();
  const items = role === 'staff' || role === 'admin' ? [...NAV, ADMIN_NAV] : NAV;

  return (
    <aside className="hidden md:flex md:w-64 flex-col border-r border-secondary bg-white px-5 py-8 shrink-0">
      <div className="mb-10 px-1 flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center shrink-0">
          <div className="h-3.5 w-3.5 rounded-full bg-white" />
        </div>
        <div>
          <div className="text-[11px] tracking-wide text-neutral/50 font-body leading-none">csmju-skillforge</div>
          <div className="font-display font-bold text-lg text-primary leading-tight">SkillForge</div>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-module px-3 py-2.5 transition-colors ${
                active ? 'bg-secondary' : 'hover:bg-secondary/60'
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 transition-colors ${
                  active ? 'bg-primary text-white' : 'bg-tertiary text-neutral/50 group-hover:text-primary'
                }`}
              >
                <item.icon className="h-4.5 w-4.5" strokeWidth={1.8} />
              </span>
              <span>
                <span className={`block font-body text-sm ${active ? 'text-primary font-medium' : 'text-neutral'}`}>{item.label}</span>
                <span className="block font-body text-[11px] text-neutral/40">{item.sub}</span>
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-1 pt-8 text-xs text-neutral/40 font-body leading-relaxed">
        เชื่อมต่อผ่าน CSMJU2030 API Gateway<br />ไม่มีระบบ Login ของตัวเอง
        <form action="/auth/logout" method="post" className="mt-4">
          <button
            type="submit"
            className="font-body text-sm text-neutral/60 underline underline-offset-2 hover:text-primary"
          >
            ออกจากระบบ
          </button>
        </form>
      </div>
    </aside>
  );
}
