import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import type { ActivityEvent, CursorPage } from "@shared";
import { apiClient } from "../../lib/apiClient";
import { queryKeys } from "../../lib/queryKeys";
import { formatActivityMessage } from "../../lib/activity";
import { formatTime } from "../../lib/format";
import { Icon } from "../../lib/icons";
import { EventBadge } from "../ui/EventBadge";
import { Card } from "../ui/Card";
import { Spinner } from "../ui/Spinner";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";

export default function RecentActivity() {
  const { data, isLoading, isError, error } = useQuery<CursorPage<ActivityEvent>>({
    queryKey: queryKeys.activity.list({ limit: "10" }),
    queryFn: () =>
      apiClient.get<CursorPage<ActivityEvent>>("/activity?limit=10"),
  });

  const events = data?.items ?? [];

  return (
    <Card
      title="Live Activity"
      icon={<Icon name="activity" />}
      action={
        <Link
          to="/activity"
          className="group inline-flex items-center gap-1 text-xs font-bold text-grass-400 transition-colors hover:text-grass-300"
        >
          View all
          <Icon
            name="arrow-up-right"
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      }
      bodyClassName="px-3 py-3 sm:px-4"
    >
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorState error={error} />
      ) : events.length === 0 ? (
        <EmptyState message="Belum ada aktivitas." icon="activity" />
      ) : (
        <ul className="space-y-0.5">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-white/[0.04]"
            >
              <EventBadge type={event.type} />
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
  );
}
