import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { ActivityEvent, CursorPage } from "@shared";
import { apiClient } from "../lib/apiClient";
import { queryKeys } from "../lib/queryKeys";
import { formatActivityMessage } from "../lib/activity";
import { formatTime } from "../lib/format";
import { Icon, type IconName } from "../lib/icons";
import { Avatar } from "../components/ui/Avatar";
import { EventBadge } from "../components/ui/EventBadge";
import { Spinner } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";

const FILTER_GROUPS: { id: string; label: string; icon: IconName; types: string[] }[] = [
  { id: "all", label: "All", icon: "layers", types: [] },
  { id: "session", label: "Join / Leave", icon: "log-in", types: ["join", "leave"] },
  { id: "deaths", label: "Deaths", icon: "skull", types: ["death"] },
  { id: "kills", label: "Kills", icon: "swords", types: ["player_kill", "mob_kill"] },
  { id: "dimension", label: "Dimension", icon: "portal", types: ["dimension_change"] },
  { id: "spawn", label: "Spawn", icon: "sprout", types: ["spawn", "respawn"] },
  { id: "xp", label: "XP", icon: "star", types: ["xp_update"] },
  { id: "items", label: "Items", icon: "gem", types: ["item_collect"] },
];

export default function ActivityPage() {
  const [groupId, setGroupId] = useState("all");
  const group = FILTER_GROUPS.find((g) => g.id === groupId) ?? FILTER_GROUPS[0]!;
  const types = group.types.join(",");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: queryKeys.activity.list({ group: groupId, types }),
    queryFn: ({ pageParam }: { pageParam: string }) => {
      const params = new URLSearchParams();
      if (types) params.set("type", types);
      params.set("limit", "30");
      if (pageParam) params.set("cursor", pageParam);
      return apiClient.get<CursorPage<ActivityEvent>>(
        `/activity?${params.toString()}`,
      );
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const events = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <section className="space-y-6">
      {/* Page header */}
      <div className="animate-fade-up">
        <p className="eyebrow flex items-center gap-2">
          <Icon name="activity" className="h-3.5 w-3.5 text-grass-400" />
          Realtime Feed
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-slate-100">
          Activity
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Timeline semua kejadian di server — diperbarui secara realtime.
        </p>
      </div>

      {/* Filter pills */}
      <div
        role="tablist"
        aria-label="Filter aktivitas"
        className="animate-fade-up flex flex-wrap gap-2"
      >
        {FILTER_GROUPS.map((g) => {
          const active = groupId === g.id;
          return (
            <button
              key={g.id}
              role="tab"
              aria-selected={active}
              onClick={() => setGroupId(g.id)}
              className={`focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                active
                  ? "bg-grass-500/15 text-grass-300 ring-1 ring-inset ring-grass-400/30 shadow-glow"
                  : "border border-white/[0.07] bg-white/[0.03] text-slate-400 hover:border-white/[0.14] hover:text-slate-200"
              }`}
            >
              <Icon name={g.icon} className="h-3.5 w-3.5" />
              {g.label}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="glass-card">
          <Spinner label="Memuat aktivitas..." />
        </div>
      ) : isError ? (
        <ErrorState error={error} />
      ) : events.length === 0 ? (
        <EmptyState message="Belum ada aktivitas untuk filter ini." icon="activity" />
      ) : (
        <>
          <ol className="glass-card animate-fade-up relative mx-2 space-y-0 overflow-hidden p-3 sm:mx-0 sm:p-4">
            {/* Vertical timeline rail */}
            <span
              aria-hidden="true"
              className="absolute bottom-6 left-[34px] top-6 w-px bg-gradient-to-b from-grass-400/30 via-white/[0.07] to-transparent sm:left-[38px]"
            />
            {events.map((event) => (
              <li
                key={event.id}
                className="relative flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/[0.04]"
              >
                <span className="relative z-10 ring-4 ring-night-900/60 rounded-xl">
                  <EventBadge type={event.type} />
                </span>
                <span className="relative z-10 hidden shrink-0 sm:block">
                  <Avatar name={event.playerName} size={30} className="rounded-lg" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-slate-200">
                  {formatActivityMessage(event)}
                </span>
                <span className="shrink-0 font-mono text-[11px] font-medium tabular-nums text-slate-500">
                  {formatTime(event.createdAt)}
                </span>
              </li>
            ))}
          </ol>

          {/* Load More */}
          {hasNextPage && (
            <div className="flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-6 py-2.5 text-sm font-bold text-slate-300 transition-all hover:border-grass-400/30 hover:text-grass-300 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isFetchingNextPage ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-grass-400" />
                    Memuat...
                  </>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
