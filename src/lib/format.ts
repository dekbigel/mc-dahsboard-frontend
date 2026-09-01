/** Format byte → "1.7 GB". Return "Unknown" jika tidak tersedia. */
export function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined) return "Unknown";
  if (!Number.isFinite(bytes)) return "Unknown";
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );
  const value = bytes / 1024 ** i;
  const precision = value >= 100 || i === 0 ? 0 : 1;
  return `${value.toFixed(precision)} ${units[i]}`;
}

/** Format uptime → "4d 17h". */
export function formatUptime(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return "Unknown";
  if (seconds < 0 || !Number.isFinite(seconds)) return "Unknown";

  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/** Format durasi playtime → "37h 12m". */
export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return "Unknown";
  if (seconds < 0 || !Number.isFinite(seconds)) return "Unknown";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

/** Format waktu lokal (HH:MM) dari ISO string. */
export function formatTime(iso: string | null | undefined): string {
  if (!iso) return "Unknown";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format tanggal lokal → "12 Aug 2026". */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "Unknown";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}