import type { ActivityEvent } from "@shared";
import { DIMENSION_LABELS, ITEM_LABELS } from "./constants";

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function dimLabel(dimension: string | null): string {
  if (!dimension) return "Unknown";
  const key = dimension as keyof typeof DIMENSION_LABELS;
  return DIMENSION_LABELS[key] ?? capitalize(dimension);
}

/**
 * Format event activity menjadi kalimat yang mudah dibaca, mis.:
 *   "Steve entered The Nether"
 *   "Alex was slain by Zombie"
 *   "Rains joined the server"
 */
export function formatActivityMessage(event: ActivityEvent): string {
  switch (event.type) {
    case "join":
      return `${event.playerName} joined the server`;
    case "leave":
      return `${event.playerName} left the server`;
    case "spawn":
      return `${event.playerName} spawned in ${dimLabel(event.dimension)}`;
    case "respawn":
      return `${event.playerName} respawned in ${dimLabel(event.dimension)}`;
    case "death": {
      const cause = event.cause;
      if (cause && cause !== "unknown" && cause !== "player") {
        return `${event.playerName} was slain by ${capitalize(cause)}`;
      }
      return `${event.playerName} died`;
    }
    case "player_kill":
      return `${event.playerName} killed ${event.targetName ?? "someone"}`;
    case "mob_kill":
      return `${event.playerName} killed ${event.mobType ?? "a mob"}`;
    case "dimension_change":
      return `${event.playerName} entered ${dimLabel(event.dimension)}`;
    case "xp_update": {
      const level = (event.metadata?.level as number | undefined) ?? 0;
      const progress = (event.metadata?.xpProgress as number | undefined) ?? 0;
      return `${event.playerName} reached level ${level} (${progress}% XP)`;
    }
    case "item_collect": {
      const itemKey = event.metadata?.itemStatKey as string | undefined;
      const count = (event.metadata?.count as number | undefined) ?? 0;
      const label = ITEM_LABELS[itemKey ?? ""] ?? itemKey ?? "item";
      return `${event.playerName} collected ${count.toLocaleString()} ${label}`;
    }
    default:
      return `${event.playerName} ${event.type}`;
  }
}