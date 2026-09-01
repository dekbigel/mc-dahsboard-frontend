import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import type { OnlinePlayer } from "@shared";
import { apiClient } from "../../lib/apiClient";
import { queryKeys } from "../../lib/queryKeys";
import { DIMENSION_LABELS } from "../../lib/constants";
import { Icon, type IconName } from "../../lib/icons";
import { Avatar } from "../ui/Avatar";
import { Card } from "../ui/Card";
import { LivePlaytime } from "../ui/LivePlaytime";
import { Spinner } from "../ui/Spinner";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";

/** Ikon + warna per dimensi Minecraft. */
const DIMENSION_META: Record<string, { icon: IconName; className: string }> = {
  overworld: { icon: "globe", className: "text-grass-400 bg-grass-500/10 ring-grass-400/20" },
  nether: { icon: "flame", className: "text-red-400 bg-red-500/10 ring-red-400/20" },
  the_end: { icon: "moon", className: "text-amethyst-300 bg-amethyst-500/10 ring-amethyst-400/20" },
  unknown: { icon: "help-circle", className: "text-slate-400 bg-white/[0.05] ring-white/10" },
};

export function DimensionChip({
  dimension,
  className = "",
}: {
  dimension: string;
  className?: string;
}) {
  const meta = DIMENSION_META[dimension] ?? DIMENSION_META.unknown!;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${meta.className} ${className}`}
    >
      <Icon name={meta.icon} className="h-3 w-3" />
      {DIMENSION_LABELS[dimension as keyof typeof DIMENSION_LABELS] ?? dimension}
    </span>
  );
}

export default function OnlinePlayers() {
  const { data: players, isLoading, isError, error } = useQuery<OnlinePlayer[]>({
    queryKey: queryKeys.players.online,
    queryFn: () => apiClient.get<OnlinePlayer[]>("/players/online"),
  });

  return (
    <Card
      title={
        <>
          Online Players
          {players && players.length > 0 && (
            <span className="ml-1 rounded-full bg-grass-500/15 px-2 py-0.5 text-[11px] font-bold tabular-nums text-grass-300 ring-1 ring-inset ring-grass-400/25">
              {players.length}
            </span>
          )}
        </>
      }
      icon={<Icon name="user-check" />}
      className="h-full"
      bodyClassName="px-3 py-3 sm:px-4"
    >
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorState error={error} />
      ) : !players || players.length === 0 ? (
        <EmptyState message="Tidak ada player online." icon="users" />
      ) : (
        <ul className="space-y-1">
          {players.map((p) => (
            <li key={p.id}>
              <Link
                to={`/players/${p.id}`}
                className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-white/[0.05]"
              >
                <span className="relative">
                  <Avatar name={p.name} size={38} />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-night-900 bg-grass-400" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-100 transition-colors group-hover:text-grass-300">
                    {p.name}
                  </span>
                  <span className="mt-1 block">
                    <DimensionChip dimension={p.dimension} />
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-grass-300/90">
                  <Icon name="timer" className="h-3.5 w-3.5 text-slate-500" />
                  <LivePlaytime
                    seconds={p.playtimeSeconds}
                    sessionStartedAt={p.sessionStartedAt}
                  />
                </span>
                <Icon
                  name="chevron-right"
                  className="h-4 w-4 text-slate-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-grass-400"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
