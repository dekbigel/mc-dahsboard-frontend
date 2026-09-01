import { useEffect, useState } from "react";

/**
 * Playtime LIVE: nilai terakumulasi (base) + durasi sesi aktif berjalan.
 *
 * - Jika player online (sessionStartedAt ada), nilai dihitung ulang tiap detik
 *   sehingga playtime "berjalan" realtime tanpa polling API.
 * - Jika offline / tanpa sesi aktif, cukup kembalikan base.
 */
export function useLivePlaytime(
  baseSeconds: number | null | undefined,
  sessionStartedAt: string | null | undefined,
): number | null {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!sessionStartedAt) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [sessionStartedAt]);

  if (baseSeconds == null) return null;
  if (!sessionStartedAt) return baseSeconds;

  const start = new Date(sessionStartedAt).getTime();
  if (Number.isNaN(start)) return baseSeconds;

  const elapsed = Math.max(0, Math.floor((now - start) / 1000));
  return baseSeconds + elapsed;
}
