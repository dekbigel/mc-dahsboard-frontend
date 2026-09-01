/**
 * TOMODAKI — Frontend Types (dipindahkan dari @tomodaki/shared)
 *
 * Setelah pemisahan project, tipe bersama disimpan lokal di frontend.
 * Backend (plain JS) tidak mengimpor tipe ini; kontrak API tetap =
 * perilaku runtime + tipe validasi di sini.
 */

// ============================================================================
// Common unions
// ============================================================================

/** Dimensi di Minecraft Bedrock (dinormalisasi dari nilai raw Minecraft). */
export type MinecraftDimension = "overworld" | "nether" | "the_end" | "unknown";

/** Tipe event player yang dicatat oleh Minecraft collector. */
export type PlayerEventType =
  | "join"
  | "leave"
  | "spawn"
  | "respawn"
  | "death"
  | "player_kill"
  | "mob_kill"
  | "dimension_change"
  | "xp_update"
  | "item_collect";

/** Metrik yang didukung leaderboard (whitelist aman untuk sorting). */
export type LeaderboardMetric =
  | "playtime"
  | "deaths"
  | "playerKills"
  | "mobKills"
  | "joins"
  | "level"
  | "ironIngot"
  | "goldIngot"
  | "diamond"
  | "emerald";

/** Role player di server (bisa dari permissions.json, string bebas). */
export type PlayerRole = string;

/** State server Minecraft yang di-normalisasi. */
export type ServerState = "online" | "offline" | "starting" | "stopping" | "unknown";

// ============================================================================
// Server
// ============================================================================

/**
 * Hasil ping Minecraft Bedrock server.
 * Jangan mengasumsikan player list tersedia melalui ping.
 */
export interface ServerStatus {
  online: boolean;
  /** Nama server (jika tersedia dari ping). */
  name: string | null;
  version: string | null;
  protocol: number | null;
  gamemode: string | null;
  /** Difficulty server (jika tersedia). */
  difficulty: string | null;
  /** Apakah cheats diizinkan (dari server.properties via companion; opsional). */
  allowCheats?: boolean | null;
  players: {
    online: number;
    max: number;
  };
  /** Latency ping dalam milidetik (jika tersedia). */
  ping: number | null;
  /** Waktu terakhir status diperiksa (ISO 8601). */
  lastCheckedAt: string;
}

/** Telemetri resource server dari Pterodactyl API (dinormalisasi). */
export interface ServerResources {
  state: string;
  cpuPercent: number | null;
  /** Total core usage (jika tersedia). */
  cpuAbsolute?: number | null;
  memoryBytes: number | null;
  memoryLimitBytes: number | null;
  diskBytes: number | null;
  diskLimitBytes: number | null;
  networkRxBytes?: number | null;
  networkTxBytes?: number | null;
  uptimeSeconds?: number | null;
}

/** Informasi server yang ditampilkan di UI (hanya nilai yang aman untuk publik). */
export interface MinecraftServerInfo {
  online: boolean;
  version: string | null;
  gamemode: string | null;
  difficulty: string | null;
  ping: number | null;
}

// ============================================================================
// Players
// ============================================================================

/** Player yang sedang online (data ringan untuk daftar realtime). */
export interface OnlinePlayer {
  id: string;
  name: string;
  /** XUID internal — JANGAN expose ke public API / frontend. */
  xuid: string | null;
  dimension: MinecraftDimension;
  /** Waktu join sesi terakhir (ISO 8601). */
  joinedAt: string | null;
  /** Waktu mulai sesi aktif (ISO 8601) — untuk playtime live. */
  sessionStartedAt?: string | null;
  /** Playtime terakumulasi (detik) — untuk playtime live. */
  playtimeSeconds?: number;
}

/**
 * Profil player publik.
 * `xuid` TIDAK boleh dikirim ke frontend — API layer wajib meng-hapus field ini.
 */
export interface PlayerProfile {
  id: string;
  name: string;
  xuid: string | null;
  role: PlayerRole;
  online: boolean;
  currentDimension: MinecraftDimension;
  firstJoinedAt: string | null;
  lastSeenAt: string | null;
  createdAt: string;
  updatedAt: string;
  /** Waktu mulai sesi aktif (ISO 8601) saat player online — untuk playtime live. */
  sessionStartedAt: string | null;
  stats?: PlayerStats;
}

/** Statistik kumulatif seorang player. */
export interface PlayerStats {
  playtimeSeconds: number;
  deaths: number;
  playerKills: number;
  mobKills: number;
  joins: number;
  level: number;
  xpProgress: number;
  ironIngot: number;
  goldIngot: number;
  diamond: number;
  emerald: number;
}

/** Satu sesi join–leave seorang player. */
export interface PlayerSession {
  id: string;
  playerId: string;
  joinedAt: string;
  leftAt: string | null;
  /** Durasi sesi dalam detik; `null` selama sesi masih berjalan. */
  playtimeSeconds: number | null;
  createdAt: string;
}

/** Event aktivitas player yang dicatat oleh collector. */
export interface PlayerEvent {
  id: string;
  playerId: string;
  type: PlayerEventType;
  dimension: MinecraftDimension | null;
  targetPlayerId: string | null;
  targetName: string | null;
  mobType: string | null;
  /** Penyebab kematian (mis. "zombie", "fall"); "unknown" jika tidak diketahui. */
  cause: string | null;
  /** Metadata tambahan JSON-safe (mis. from/to untuk dimension change). */
  metadata: Record<string, unknown> | null;
  /** Waktu event (ISO 8601). */
  createdAt: string;
}

// ============================================================================
// Leaderboard & history
// ============================================================================

/** Entri leaderboard. */
export interface LeaderboardEntry {
  playerId: string;
  name: string;
  rank: number;
  metric: LeaderboardMetric;
  value: number;
  /** Waktu mulai sesi aktif (ISO 8601) — playtime live. */
  sessionStartedAt: string | null;
}

/** Satu titik histori jumlah player online (berasal dari ServerSnapshot). */
export interface PlayerHistoryPoint {
  /** ISO 8601 timestamp. */
  time: string;
  onlinePlayers: number;
  maxPlayers: number;
}

/** Event activity lengkap dengan nama player (untuk timeline UI). */
export interface ActivityEvent extends PlayerEvent {
  playerName: string;
}

/** Hasil pagination daftar player. */
export interface PaginatedPlayers {
  items: PlayerProfile[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Ringkasan histori server (grafik player count). */
export interface ServerHistorySummary {
  period: string;
  pointCount: number;
  peakPlayers: number;
  averageOnline: number;
  uniquePlayersToday: number;
  playtimeTodaySeconds: number;
}

// ============================================================================
// API umum
// ============================================================================

/** Format error konsisten untuk REST API. */
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}

/** Hasil pagination berbasis cursor (untuk timeline activity). */
export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

// ============================================================================
// Minecraft collector
// ============================================================================

/**
 * Event yang dikirim Minecraft Behavior Pack (collector) ke backend.
 * Format ini adalah kontrak antara Behavior Pack dan ingestion API (TASK 17).
 */
export interface MinecraftCollectorEvent {
  /** ID unik event (untuk deduplication — TASK 38). */
  id?: string;
  type: PlayerEventType;
  player: {
    name: string;
    /** XUID jika tersedia; `null` → backend memakai name sebagai fallback. */
    xuid: string | null;
  };
  /** Waktu event (epoch ms). */
  timestamp: number;
  /** Dimension (nilai raw dari Minecraft atau kanonik). */
  dimension?: string | null;
  /** spawn: true jika spawn awal (bukan respawn). */
  initialSpawn?: boolean;
  /** death: penyebab kematian ("unknown" jika tidak diketahui). */
  cause?: string | null;
  /** player_kill: target player. */
  targetPlayer?: {
    name: string;
    xuid: string | null;
  } | null;
  /** mob_kill: tipe mob. */
  mobType?: string | null;
  /** dimension_change: dari → ke. */
  fromDimension?: string | null;
  toDimension?: string | null;
  /** xp_update: level & progres XP player (0-100). */
  level?: number;
  xpProgress?: number;
  /** item_collect: key item ternormalisasi & jumlah yang didapat. */
  itemStatKey?: string;
  count?: number;
}
