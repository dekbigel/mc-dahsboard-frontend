import { useQuery } from "@tanstack/react-query";
import type { ServerStatus } from "@shared";
import { apiClient } from "../../lib/apiClient";
import { queryKeys } from "../../lib/queryKeys";
import { Spinner } from "../ui/Spinner";
import { ErrorState } from "../ui/ErrorState";

export default function ServerHeroStatus() {
  const { data: status, isLoading, isError, error } = useQuery<ServerStatus>({
    queryKey: queryKeys.server.status,
    queryFn: () => apiClient.get<ServerStatus>("/server/status"),
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState error={error} />;
  if (!status) return null;

  const online = status.online;
  const occupancy =
    status.players.max > 0
      ? Math.min(1, Math.max(0, status.players.online / status.players.max))
      : 0;
  const pct = Math.round(occupancy * 100);

  return (
    <div className="rounded-xl border border-slate-800 bg-surface-light p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            TOMODAKI SERVER
          </h2>
          <p className="mt-1 text-sm text-slate-400">Survival Bedrock Server</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-bold ${
            online
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-red-500/15 text-red-300"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              online ? "bg-emerald-400" : "bg-red-400"
            }`}
          />
          {online ? "SERVER ONLINE" : "SERVER OFFLINE"}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-lg font-semibold text-slate-200">
          {online
            ? `${status.players.online} / ${status.players.max} Players`
            : "0 / 0 Players"}
        </p>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              online ? "bg-emerald-500" : "bg-slate-600"
            }`}
            style={{ width: online ? `${pct}%` : "0%" }}
          />
        </div>
      </div>
    </div>
  );
}