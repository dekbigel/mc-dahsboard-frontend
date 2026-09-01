import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import type { ActivityEvent, PlayerProfile } from "@shared";
import { apiClient, ApiError } from "../lib/apiClient";
import { queryKeys } from "../lib/queryKeys";
import { ITEM_LABELS } from "../lib/constants";
import { formatActivityMessage } from "../lib/activity";
import { formatDate, formatDuration, formatTime } from "../lib/format";
import { useLivePlaytime } from "../hooks/useLivePlaytime";
import { Icon } from "../lib/icons";
import { Avatar } from "../components/ui/Avatar";
import { LevelChip, RoleBadge, StatusPill } from "../components/ui/Badge";
import { EventBadge } from "../components/ui/EventBadge";
import { Card } from "../components/ui/Card";
import { DimensionChip } from "../components/overview/OnlinePlayers";
import { Spinner } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { NotFound } from "../components/ui/NotFound";
import { StatItem } from "../components/players/StatItem";

/** Item terlacak — ikon + warna tematik Minecraft. */
const ITEM_META: Record<string, { icon: "gem" | "zap"; color: string }> = {
  iron_ingot: { icon: "zap", color: "bg-slate-500/10 text-slate-300 ring-white/15" },
  gold_ingot: { icon: "zap", color: "bg-gold-500/10 text-gold-300 ring-gold-400/25" },
  diamond: { icon: "gem", color: "bg-sky-500/10 text-sky-300 ring-sky-400/25" },
  emerald: { icon: "gem", color: "bg-grass-500/10 text-grass-300 ring-grass-400/25" },
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
  if (profileQuery.isLoading)
    return (
      <div className="glass-card">
        <Spinner label="Memuat profil player..." />
      </div>
    );
  if (profileQuery.isError) {
    if (
      profileQuery.error instanceof ApiError &&
      profileQuery.error.status === 404
    ) {
      return <NotFound />;
    }
    return <ErrorState error={profileQuery.error} />;
  }

  const player = profileQuery.data;
  if (!player) return null;

  const stats = player.stats;

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
        className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-grass-300"
      >
        <Icon
          name="arrow-left"
          className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
        />
        Back to players
      </Link>

      {/* Header card */}
      <div className="glass-card animate-fade-up relative overflow-hidden p-6 sm:p-8">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl ${
            player.online ? "bg-grass-500/12" : "bg-white/[0.03]"
          }`}
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="relative">
              <Avatar name={player.name} size={72} className="rounded-2xl" />
              <span
                className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-[3px] border-night-900 ${
                  player.online ? "bg-grass-400" : "bg-slate-600"
                }`}
              />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate font-display text-3xl font-bold tracking-tight text-slate-100">
                  {player.name}
                </h1>
                <RoleBadge role={player.role} />
                <LevelChip level={stats?.level ?? 0} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <DimensionChip dimension={player.currentDimension} />
                <StatusPill online={player.online} />
              </div>
            </div>
          </div>

          {/* XP panel */}
          <div className="w-full shrink-0 sm:w-72">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-bold text-gold-300">
                <Icon name="star" className="h-4 w-4" />
                Level {stats?.level ?? 0}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {stats?.xpProgress ?? 0}% menuju level berikutnya
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={stats?.xpProgress ?? 0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progress XP"
              className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/[0.05]"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-grass-400 transition-all duration-700"
                style={{
                  width: `${Math.min(100, Math.max(0, stats?.xpProgress ?? 0))}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatItem
          label="Playtime"
          value={formatDuration(playtimeSeconds)}
          icon="timer"
          tone="grass"
        />
        <StatItem label="Days Played" value={String(daysPlayed)} icon="calendar" />
        <StatItem label="Deaths" value={String(stats?.deaths ?? 0)} icon="skull" tone="red" />
        <StatItem
          label="Player Kills"
          value={String(stats?.playerKills ?? 0)}
          icon="swords"
          tone="amethyst"
        />
        <StatItem label="Mob Kills" value={String(stats?.mobKills ?? 0)} icon="axe" tone="gold" />
        <StatItem label="Joins" value={String(stats?.joins ?? 0)} icon="log-in" tone="creeper" />
        <StatItem label="Level" value={String(stats?.level ?? 0)} icon="star" tone="gold" />
        <StatItem
          label="Last Seen"
          value={player.online ? "Online" : formatDate(player.lastSeenAt)}
          icon="clock"
        />
      </dl>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Items collected */}
        <Card title="Items Collected" icon={<Icon name="gem" />}>
          <div className="grid grid-cols-2 gap-3">
            {trackedItems.map((item) => {
              const meta = ITEM_META[item.key] ?? ITEM_META.iron_ingot!;
              return (
                <div
                  key={item.key}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${meta.color}`}
                  >
                    <Icon name={meta.icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      {ITEM_LABELS[item.key] ?? item.key}
                    </p>
                    <p className="font-display text-lg font-bold tabular-nums text-slate-100">
                      {item.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* First joined footer */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm">
            <span className="flex items-center gap-2 font-medium text-slate-400">
              <Icon name="calendar" className="h-4 w-4 text-creeper-400" />
              First joined
            </span>
            <span className="font-semibold text-slate-200">
              {formatDate(player.firstJoinedAt)}
            </span>
          </div>
        </Card>

        {/* Recent activity */}
        <Card
          title="Recent Activity"
          icon={<Icon name="activity" />}
          bodyClassName="px-3 py-3 sm:px-4"
        >
          {activityQuery.isLoading ? (
            <Spinner />
          ) : activityQuery.isError ? (
            <ErrorState error={activityQuery.error} />
          ) : !activityQuery.data || activityQuery.data.length === 0 ? (
            <EmptyState message="Belum ada aktivitas untuk player ini." icon="activity" />
          ) : (
            <ul className="space-y-0.5">
              {activityQuery.data.map((event) => (
                <li
                  key={event.id}
                  className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-white/[0.04]"
                >
                  <EventBadge type={event.type} size="sm" />
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-200">
                    {formatActivityMessage(event)}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] font-medium tabular-nums text-slate-500">
                    {formatTime(event.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </section>
  );
}
