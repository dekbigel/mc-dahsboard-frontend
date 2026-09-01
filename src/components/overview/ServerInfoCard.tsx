import { useQuery } from "@tanstack/react-query";
import type { ServerStatus } from "@shared";
import { apiClient } from "../../lib/apiClient";
import { queryKeys } from "../../lib/queryKeys";
import { Spinner } from "../ui/Spinner";
import { ErrorState } from "../ui/ErrorState";

export default function ServerInfoCard() {
  const { data: status, isLoading, isError, error } = useQuery<ServerStatus>({
    queryKey: queryKeys.server.status,
    queryFn: () => apiClient.get<ServerStatus>("/server/status"),
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState error={error} />;
  if (!status) return null;

  const rows: { label: string; value: string }[] = [
    { label: "Version", value: status.version ?? "Unknown" },
    { label: "Gamemode", value: status.gamemode ?? "Unknown" },
    { label: "Difficulty", value: status.difficulty ?? "Unknown" },
    { label: "Ping", value: status.ping != null ? `${status.ping} ms` : "Unknown" },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-surface-light p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Server Information
      </h2>
      <dl className="space-y-3 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <dt className="text-slate-500">{r.label}</dt>
            <dd className="font-medium text-slate-200">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}