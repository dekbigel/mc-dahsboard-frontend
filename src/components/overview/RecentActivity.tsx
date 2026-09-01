import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import type { ActivityEvent, CursorPage } from "@shared";
import { apiClient } from "../../lib/apiClient";
import { queryKeys } from "../../lib/queryKeys";
import { EVENT_META } from "../../lib/constants";
import { formatActivityMessage } from "../../lib/activity";
import { formatTime } from "../../lib/format";
import { Spinner } from "../ui/Spinner";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";

export default function RecentActivity() {
  const { data, isLoading, isError, error } = useQuery<CursorPage<ActivityEvent>>({
    queryKey: queryKeys.activity.list({ limit: "10" }),
    queryFn: () =>
      apiClient.get<CursorPage<ActivityEvent>>("/activity?limit=10"),
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState error={error} />;

  const events = data?.items ?? [];

  return (
    <div className="rounded-xl border border-slate-800 bg-surface-light p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Live Activity
        </h2>
        <Link
          to="/activity"
          className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          View all
        </Link>
      </div>

      {events.length === 0 ? (
        <EmptyState message="Belum ada aktivitas." />
      ) : (
        <ul className="divide-y divide-slate-800">
          {events.map((event) => {
            const meta = EVENT_META[event.type];
            return (
              <li
                key={event.id}
                className="flex items-start gap-3 py-2.5 text-sm"
              >
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
  );
}