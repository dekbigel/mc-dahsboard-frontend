import { Icon } from "../../lib/icons";

export function ErrorState({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : "Terjadi kesalahan";
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-300">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/15 ring-1 ring-inset ring-red-400/25">
        <Icon name="alert" className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="font-bold">Gagal memuat data</p>
        <p className="mt-0.5 break-words text-red-300/80">{message}</p>
      </div>
    </div>
  );
}
