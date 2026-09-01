import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import type { ActivityEvent, PlayerProfile } from "@shared";
import { apiClient, ApiError } from "../lib/apiClient";
import { queryKeys } from "../lib/queryKeys";
import { DEFAULT_ROLE_META, DIMENSION_LABELS, EVENT_META, ITEM_LABELS, ROLE_META } from "../lib/constants";
import { formatActivityMessage } from "../lib/activity";
import { formatDate, formatDuration, formatTime } from "../lib/format";
import { useLivePlaytime } from "../hooks/useLivePlaytime";
import { Spinner } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { NotFound } from "../components/ui/NotFound";
import { StatItem } from "../components/players/StatItem";

/** Ikon sederhana per item terlacak (fallback emoji jika tidak ada sprite). */
const ITEM_ICONS: Record<string, string> = {
  iron_ingot: "⛏️",
  gold_ingot: "🪙",
  diamond: "💎",
  emerald: "🟢",
};

export default function PlayerProfilePage() {
  const { id } = useParams();
  const playerId = id ?? "";

  const profileQuery = useQuery<PlayerProfile>({
    queryKey: queryKeys.players.detail(playerId),
    queryFn: () => apiClient.get<PlayerProfile>(`/players/${playerId}`),
    enabled: Boolean(playerId),
  });

  const activityQuery = useQuery<ActivityEvent[]>({
    queryKey: queryKeys.players.detailActivity(playerId),
    queryFn: () =>
      apiClient.get<ActivityEvent[]>(`/players/${playerId}/activity`),
    enabled: Boolean(playerId) && profileQuery.isSuccess,
  });

  // Playtime live (Rules of Hooks — dipanggil di top-level)
  const playtimeSeconds = useLivePlaytime(
    profileQuery.data?.stats?.playtimeSeconds,
    profileQuery.data?.sessionStartedAt,
  );

  if (!playerId) return <NotFound />;
  if (profileQuery.isLoading) return <Spinner />;
  if (profileQuery.isError) {
    if (profileQuery.error instanceof ApiError && profileQuery.error.status === 404) {
      return <NotFound />;
    }
    return <ErrorState error={profileQuery.error} />;
  }

  const player = profileQuery.data;
  if (!player) return null;

  const stats = player.stats;
  const roleMeta = ROLE_META[player.role] ?? {
    label: player.role ?? "Member",
    color: DEFAULT_ROLE_META.color,
  };

  // Days Played = total playtime / 86400 (bulatkan ke 1 desimal)
  const totalSeconds = playtimeSeconds ?? 0;
  const daysPlayed =
    totalSeconds > 0 ? Math.floor((totalSeconds / 86400) * 10) / 10 : 0;

  const trackedItems = [
    { key: "iron_ingot", value: stats?.ironIngot ?? 0 },
    { key: "gold_ingot", value: stats?.goldIngot ?? 0 },
    { key: "diamond", value: stats?.diamond ?? 0 },
    { key: "emerald", value: stats?.emerald ?? 0 },
  ] as const;

  return (
    <section className="space-y-6">
      <Link
        to="/players"
        className="text-sm text-emerald-400 transition-colors hover:text-emerald-300"
      >
        ← Back to players
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-surface-light p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-100">{player.name}</h1>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${roleMeta.color}`}
              >
                {roleMeta.label}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Dimension:{" "}
              {DIMENSION_LABELS[player.currentDimension] ?? player.currentDimension}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-bold ${
              player.online
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-slate-700/40 text-slate-400"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                player.online ? "bg-emerald-400" : "bg-slate-500"
              }`}
            />
            {player.online ? "Online" : "Offline"}
          </span>
        </div>

        {/* XP Bar */}
        <div className="mt-5">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-semibold text-emerald-300">
              ⭐ Level {stats?.level ?? 0}
            </span>
            <span className="text-xs text-slate-400">
              {(stats?.xpProgress ?? 0)}% toward next level
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, stats?.xpProgress ?? 0))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatItem
          label="Playtime"
          value={formatDuration(playtimeSeconds)}
        />
        <StatItem label="Days Played" value={String(daysPlayed)} />
        <StatItem label="Deaths" value={String(stats?.deaths ?? 0)} />
        <StatItem label="Player Kills" value={String(stats?.playerKills ?? 0)} />
        <StatItem label="Mob Kills" value={String(stats?.mobKills ?? 0)} />
        <StatItem label="Joins" value={String(stats?.joins ?? 0)} />
        <StatItem label="Level" value={String(stats?.level ?? 0)} />
      </dl>

      {/* Items Collected */}
      <div className="rounded-xl border border-slate-800 bg-surface-light p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Items Collected (Total)
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {trackedItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-3 rounded-lg border border-slate-800 bg-surface p-3"
            >
              <span className="text-2xl">{ITEM_ICONS[item.key] ?? "📦"}</span>
              <div className="min-w-0">
                <p className="truncate text-xs text-slate-500">
                  {ITEM_LABELS[item.key] ?? item.key}
                </p>
                <p className="text-lg font-bold tabular-nums text-slate-100">
                  {item.value.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-surface-light p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            First Joined
          </p>
          <p className="mt-1 font-medium text-slate-200">
            {formatDate(player.firstJoinedAt)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-surface-light p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Last Seen
          </p>
          <p className="mt-1 font-medium text-slate-200">
            {player.online ? "Online" : formatDate(player.lastSeenAt)}
          </p>
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-slate-800 bg-surface-light p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Recent Activity
        </h2>

        {activityQuery.isLoading ? (
          <Spinner />
        ) : activityQuery.isError ? (
          <ErrorState error={activityQuery.error} />
        ) : !activityQuery.data || activityQuery.data.length === 0 ? (
          <EmptyState message="Belum ada aktivitas untuk player ini." />
        ) : (
          <ul className="divide-y divide-slate-800">
            {activityQuery.data.map((event) => {
              const meta = EVENT_META[event.type];
              return (
                <li key={event.id} className="flex items-start gap-3 py-2.5 text-sm">
                  <span className="mt-0.5 shrink-0 text-base" title={meta?.label}>
                    {meta?.icon ?? "•"}
                  </span>
                  <span className="flex-1 text-slate-200">
                    {formatActivityMessage(event)}
                  </span>
                  <span className="shrink-0 text-xs text-slate-500">
                    {formatTime(event.createdAt)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}