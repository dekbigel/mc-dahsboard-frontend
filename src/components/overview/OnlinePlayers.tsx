import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import type { OnlinePlayer } from "@shared";
import { apiClient } from "../../lib/apiClient";
import { queryKeys } from "../../lib/queryKeys";
import { DIMENSION_LABELS } from "../../lib/constants";
import { LivePlaytime } from "../ui/LivePlaytime";
import { Spinner } from "../ui/Spinner";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";

export default function OnlinePlayers() {
  const { data: players, isLoading, isError, error } = useQuery<OnlinePlayer[]>({
    queryKey: queryKeys.players.online,
    queryFn: () => apiClient.get<OnlinePlayer[]>("/players/online"),
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState error={error} />;

  return (
    <div className="rounded-xl border border-slate-800 bg-surface-light p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Online Players
      </h2>

      {!players || players.length === 0 ? (
        <EmptyState message="Tidak ada player online." />
      ) : (
        <ul className="divide-y divide-slate-800">
          {players.map((p) => (
            <li key={p.id}>
              <Link
                to={`/players/${p.id}`}
                className="flex items-center justify-between py-2 transition-colors hover:text-emerald-300"
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="font-medium text-slate-200">{p.name}</span>
                </span>
                <span className="flex items-center gap-3 text-sm text-slate-400">
                  <span>{DIMENSION_LABELS[p.dimension] ?? p.dimension}</span>
                  <span className="tabular-nums text-emerald-400/90">
                    <LivePlaytime
                      seconds={p.playtimeSeconds}
                      sessionStartedAt={p.sessionStartedAt}
                    />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}