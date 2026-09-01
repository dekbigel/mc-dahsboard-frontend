export function ErrorState({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : "Terjadi kesalahan";
  return (
    <div className="rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
      <p className="font-semibold">Gagal memuat data</p>
      <p className="mt-1 break-words">{message}</p>
    </div>
  );
}