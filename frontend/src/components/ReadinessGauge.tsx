// A circular gauge echoing the "CORE HUB" circle from the CSMJU2030 architecture
// diagram — this dashboard's hero deliberately reuses that shape instead of a
// generic stat card, since SkillForge is itself one module orbiting that hub.
export function ReadinessGauge({ percent, label }: { percent: number; label: string }) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex h-40 w-40 items-center justify-center shrink-0">
      <svg viewBox="0 0 160 160" className="h-40 w-40 -rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#E6F2FF" strokeWidth="12" />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#004C99"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-3xl font-bold text-primary">{percent}%</span>
        <span className="font-body text-xs text-neutral/60 mt-1 text-center px-2">{label}</span>
      </div>
    </div>
  );
}
