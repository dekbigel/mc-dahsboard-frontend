export function Spinner({ label = "Memuat..." }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-3 py-10 text-slate-400"
    >
      <span className="relative inline-flex h-5 w-5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-grass-400/30" />
        <span className="relative inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-grass-400" />
      </span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
