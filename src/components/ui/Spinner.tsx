export function Spinner({ label = "Memuat..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 py-8 text-slate-400">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400" />
      <span className="text-sm">{label}</span>
    </div>
  );
}