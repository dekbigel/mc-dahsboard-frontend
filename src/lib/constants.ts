import type { MinecraftDimension, PlayerEventType } from "@shared";

/** Label dimensi yang ditampilkan ke user. */
export const DIMENSION_LABELS: Record<MinecraftDimension, string> = {
  overworld: "Overworld",
  nether: "Nether",
  the_end: "The End",
  unknown: "Unknown",
};

/** Label item yang dilacak (iron_ingot → "Iron Ingot"). */
export const ITEM_LABELS: Record<string, string> = {
  iron_ingot: "Iron Ingot",
  gold_ingot: "Gold Ingot",
  diamond: "Diamond",
  emerald: "Emerald",
};

/** Metadata role player (warna badge). Role dari permissions.json bisa string dinamis.
 *  Role yang tidak dikenal akan memakai fallback "Member". */
export const ROLE_META: Record<string, { label: string; color: string }> = {
  Member: { label: "Member", color: "bg-slate-600/40 text-slate-300" },
  VIP: { label: "VIP", color: "bg-amber-500/20 text-amber-300" },
  Mod: { label: "Mod", color: "bg-blue-500/20 text-blue-300" },
  Admin: { label: "Admin", color: "bg-red-500/20 text-red-300" },
  Owner: { label: "Owner", color: "bg-purple-500/20 text-purple-300" },
};

/** Role fallback untuk role yang tidak dikenal (mis. "Operator" dari permissions.json). */
export const DEFAULT_ROLE_META: { label: string; color: string } = {
  label: "Member",
  color: "bg-slate-600/40 text-slate-300",
};

export interface EventMeta {
  label: string;
  icon: string;
}

/** Metadata per tipe event (icon + kata kerja). */
export const EVENT_META: Record<PlayerEventType, EventMeta> = {
  join: { label: "joined the server", icon: "🎮" },
  leave: { label: "left the server", icon: "🚪" },
  spawn: { label: "spawned", icon: "🌱" },
  respawn: { label: "respawned", icon: "✨" },
  death: { label: "died", icon: "💀" },
  player_kill: { label: "killed", icon: "⚔️" },
  mob_kill: { label: "killed a", icon: "🪓" },
  dimension_change: { label: "entered", icon: "🌀" },
  xp_update: { label: "gained XP", icon: "⭐" },
  item_collect: { label: "collected", icon: "🎒" },
};