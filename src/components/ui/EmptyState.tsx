export function EmptyState({
  message = "Belum ada data.",
}: {
  message?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}