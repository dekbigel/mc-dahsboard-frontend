import { useLivePlaytime } from "../../hooks/useLivePlaytime";
import { formatDuration } from "../../lib/format";

/**
 * Menampilkan playtime (detik) dengan format durasi, diperbarui LIVE
 * setiap detik selama player memiliki sesi aktif.
 */
export function LivePlaytime({
  seconds,
  sessionStartedAt,
}: {
  seconds: number | null | undefined;
  sessionStartedAt?: string | null;
}) {
  const live = useLivePlaytime(seconds, sessionStartedAt);
  return <>{formatDuration(live)}</>;
}
