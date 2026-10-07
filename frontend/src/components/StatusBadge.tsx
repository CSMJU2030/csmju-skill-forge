const STYLES: Record<string, { bg: string; text: string; label: string }> = {
  strength: { bg: 'bg-strength/10', text: 'text-strength', label: 'จุดแข็ง' },
  developing: { bg: 'bg-developing/10', text: 'text-developing', label: 'กำลังพัฒนา' },
  gap: { bg: 'bg-gap/10', text: 'text-gap', label: 'ต้องพัฒนา' },
};

export function StatusBadge({ status }: { status: 'strength' | 'developing' | 'gap' }) {
  const s = STYLES[status];
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-body font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}
