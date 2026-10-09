import { serverApi as api } from '@/lib/server-api';
import { Certificate } from '@/lib/types';
import { EmptyState } from '@/components/EmptyState';

export const dynamic = 'force-dynamic';

export default async function CertificatesPage() {
  let recommended: Certificate[] = [];
  try {
    recommended = await api.get<Certificate[]>('/students/me/certificate-recommendations');
  } catch {
    recommended = [];
  }
  const all = await api.get<Certificate[]>('/certificates');

  return (
    <div>
      <div className="mb-6">
        <div className="font-body text-xs text-neutral/50">Certificates</div>
        <h1 className="font-display font-bold text-2xl text-neutral">ใบรับรองฟรีที่ใช้หางานได้</h1>
      </div>

      {recommended.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display font-semibold text-neutral mb-3">แนะนำสำหรับจุดที่ต้องพัฒนา</h2>
          <CertGrid items={recommended} />
        </section>
      )}

      <section>
        <h2 className="font-display font-semibold text-neutral mb-3">ทั้งหมด</h2>
        {all.length === 0 ? (
          <EmptyState title="ยังไม่มีข้อมูลใบรับรอง" description="รอทีม PM เพิ่มข้อมูลในระบบทะเบียนกลาง" />
        ) : (
          <CertGrid items={all} />
        )}
      </section>
    </div>
  );
}

function CertGrid({ items }: { items: Certificate[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.map((c) => (
        <a
          key={c.id}
          href={c.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-module bg-white border border-secondary p-4 hover:border-primary transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display font-semibold text-sm text-neutral">{c.name}</h3>
            {c.is_free && <span className="font-body text-xs rounded-full bg-strength/10 text-strength px-2 py-0.5 shrink-0">ฟรี</span>}
          </div>
          <div className="font-body text-xs text-neutral/50 mb-2">{c.provider}{c.effort_hours ? ` · ~${c.effort_hours} ชม.` : ''}</div>
          <div className="flex flex-wrap gap-1">
            {c.skills.map((s) => (
              <span key={s.skill.id} className="font-body text-[11px] rounded-full bg-secondary text-primary px-2 py-0.5">
                {s.skill.name}
              </span>
            ))}
          </div>
        </a>
      ))}
    </div>
  );
}
