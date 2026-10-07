import { api } from '@/lib/api';
import { GeneratedDocument } from '@/lib/types';
import { DocumentGenerator } from '@/components/DocumentGenerator';

export const dynamic = 'force-dynamic';

export default async function DocumentsPage() {
  let documents: GeneratedDocument[] = [];
  try {
    documents = await api.get<GeneratedDocument[]>('/students/me/documents');
  } catch {
    documents = [];
  }

  return (
    <div>
      <div className="mb-6">
        <div className="font-body text-xs text-neutral/50">Documents</div>
        <h1 className="font-display font-bold text-2xl text-neutral">เรซูเม่ / จดหมายสมัครงาน / พอร์ตโฟลิโอ</h1>
        <p className="font-body text-sm text-neutral/60 mt-1">
          ใช้ AI API และค่าใช้บริการจากผู้ให้บริการที่คุณเลือก ระบบจะใช้จุดแข็งและวิชาที่เรียนเป็นบริบทช่วยร่าง — ตรวจทานก่อนใช้จริงเสมอ
        </p>
      </div>
      <DocumentGenerator initialDocuments={documents} />
    </div>
  );
}
