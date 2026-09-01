import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { ActivityEvent, CursorPage } from "@shared";
import { apiClient } from "../lib/apiClient";
import { queryKeys } from "../lib/queryKeys";
import { EVENT_META } from "../lib/constants";
import { formatActivityMessage } from "../lib/activity";
import { formatTime } from "../lib/format";
import { Spinner } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";

const FILTER_GROUPS = [
  { id: "all", label: "All", types: [] as string[] },
  { id: "session", label: "Join / Leave", types: ["join", "leave"] },
  { id: "deaths", label: "Deaths", types: ["death"] },
  { id: "kills", label: "Kills", types: ["player_kill", "mob_kill"] },
  { id: "dimension", label: "Dimension", types: ["dimension_change"] },
  { id: "spawn", label: "Spawn / Respawn", types: ["spawn", "respawn"] },
  { id: "xp", label: "XP", types: ["xp_update"] },
  { id: "items", label: "Items", types: ["item_collect"] },
];

const btnClass =
  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors";

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
      <h1 className="text-2xl font-bold">Activity</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_GROUPS.map((g) => (
          <button
            key={g.id}
            onClick={() => setGroupId(g.id)}
            className={`${btnClass} ${
              groupId === g.id
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorState error={error} />
      ) : events.length === 0 ? (
        <EmptyState message="Belum ada aktivitas." />
      ) : (
        <>
          <ul className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-surface-light">
            {events.map((event) => {
              const meta = EVENT_META[event.type];
              return (
                <li
                  key={event.id}
                  className="flex items-start gap-3 px-5 py-3 text-sm"
                >
                  <span
                    className="mt-0.5 shrink-0 text-base"
                    title={meta?.label}
                  >
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

          {/* Load More */}
          {hasNextPage && (
            <div className="flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-md bg-slate-800 px-6 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isFetchingNextPage ? "Memuat..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}