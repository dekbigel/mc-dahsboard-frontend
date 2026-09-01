import type { PlayerEventType } from "@shared";
import { Icon, type IconName } from "../../lib/icons";

/** Ikon + warna kategori per tipe event aktivitas. */
const EVENT_STYLE: Record<
  PlayerEventType,
  { icon: IconName; className: string }
> = {
  join: { icon: "log-in", className: "bg-grass-500/12 text-grass-300 ring-grass-400/25" },
  leave: { icon: "log-out", className: "bg-slate-500/10 text-slate-400 ring-white/10" },
  spawn: { icon: "sprout", className: "bg-creeper-500/10 text-creeper-300 ring-creeper-400/25" },
  respawn: { icon: "sparkles", className: "bg-creeper-500/10 text-creeper-300 ring-creeper-400/25" },
  death: { icon: "skull", className: "bg-red-500/10 text-red-300 ring-red-400/25" },
  player_kill: { icon: "swords", className: "bg-orange-500/10 text-orange-300 ring-orange-400/25" },
  mob_kill: { icon: "axe", className: "bg-amber-500/10 text-amber-300 ring-amber-400/25" },
  dimension_change: { icon: "portal", className: "bg-amethyst-500/10 text-amethyst-300 ring-amethyst-400/25" },
  xp_update: { icon: "star", className: "bg-gold-500/10 text-gold-300 ring-gold-400/25" },
  item_collect: { icon: "gem", className: "bg-sky-500/10 text-sky-300 ring-sky-400/25" },
};

/** Badge ikon kecil untuk satu event activity (timeline, list, dll). */
export function EventBadge({
  type,
  size = "md",
}: {
  type: PlayerEventType;
  size?: "sm" | "md";
}) {
  const style = EVENT_STYLE[type] ?? EVENT_STYLE.spawn;
  const box =
    size === "sm" ? "h-7 w-7 rounded-lg [&>svg]:h-3.5 [&>svg]:w-3.5" : "h-9 w-9 rounded-xl [&>svg]:h-4 [&>svg]:w-4";
  return (
    <span
      className={`flex shrink-0 items-center justify-center ring-1 ring-inset ${box} ${style.className}`}
    >
      <Icon name={style.icon} />
    </span>
  );
}
