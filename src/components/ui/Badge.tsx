import { Icon } from "../../lib/icons";
import { DEFAULT_ROLE_META, ROLE_META } from "../../lib/constants";

/** Pill status online/offline dengan dot beranimasi. */
export function StatusPill({
  online,
  onlineLabel = "Online",
  offlineLabel = "Offline",
  className = "",
}: {
  online: boolean;
  onlineLabel?: string;
  offlineLabel?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ring-inset ${
        online
          ? "bg-grass-500/10 text-grass-300 ring-grass-400/30"
          : "bg-white/[0.04] text-slate-400 ring-white/10"
      } ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          online ? "animate-pulse-dot bg-grass-400" : "bg-slate-500"
        }`}
      />
      {online ? onlineLabel : offlineLabel}
    </span>
  );
}

/** Badge role player (Owner/Admin/Mod/VIP/Member) — warna dari ROLE_META. */
export function RoleBadge({ role }: { role: string }) {
  const meta = ROLE_META[role] ?? {
    label: role || DEFAULT_ROLE_META.label,
    color: DEFAULT_ROLE_META.color,
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${meta.color}`}
    >
      {meta.label}
    </span>
  );
}

/** Chip level XP dengan ikon bintang. */
export function LevelChip({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/10 px-2.5 py-0.5 text-[11px] font-bold text-gold-300 ring-1 ring-inset ring-gold-400/25">
      <Icon name="star" className="h-3 w-3" />
      Lv.{level}
    </span>
  );
}
