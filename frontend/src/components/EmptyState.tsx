export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-module border border-dashed border-secondary bg-white px-8 py-12 text-center">
      <h3 className="font-display font-semibold text-lg text-primary mb-2">{title}</h3>
      <p className="font-body text-sm text-neutral/60 mb-5 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
}
