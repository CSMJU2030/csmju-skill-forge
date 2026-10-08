// Faint decorative echo of the "CORE HUB" hub-and-spoke diagram from the
// CSMJU2030 blueprint — a subtle nod to the ecosystem this subsystem plugs
// into, kept low-opacity so it never competes with real content.
export function HubMotif({ className = '', tone = 'primary' }: { className?: string; tone?: 'primary' | 'white' }) {
  const colorClass = tone === 'white' ? 'text-white' : 'text-primary';
  return (
    <svg viewBox="0 0 400 400" className={`pointer-events-none absolute ${colorClass} ${className}`} aria-hidden="true">
      <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
      <circle cx="200" cy="200" r="110" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
      <circle cx="200" cy="200" r="70" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 200 + 70 * Math.cos(rad);
        const y1 = 200 + 70 * Math.sin(rad);
        const x2 = 200 + 150 * Math.cos(rad);
        const y2 = 200 + 150 * Math.sin(rad);
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />;
      })}
    </svg>
  );
}
