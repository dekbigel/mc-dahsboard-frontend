import { useQuery } from "@tanstack/react-query";
import type { ServerResources } from "@shared";
import { apiClient } from "../../lib/apiClient";
import { queryKeys } from "../../lib/queryKeys";
import { formatBytes, formatUptime } from "../../lib/format";
import { Spinner } from "../ui/Spinner";
import { ErrorState } from "../ui/ErrorState";

export default function ServerResources() {
  const { data: res, isLoading, isError, error } = useQuery<ServerResources>({
    queryKey: queryKeys.server.resources,
    queryFn: () => apiClient.get<ServerResources>("/server/resources"),
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState error={error} />;
  if (!res) return null;

  const cpu = res.cpuPercent != null ? `${res.cpuPercent.toFixed(1)}%` : "Unknown";
  const ram = formatBytes(res.memoryBytes);
  const ramLimit = res.memoryLimitBytes != null ? formatBytes(res.memoryLimitBytes) : null;
  const ramPct = res.memoryLimitBytes ? Math.min(100, (res.memoryBytes ?? 0) / res.memoryLimitBytes * 100) : null;
  const disk = formatBytes(res.diskBytes);
  const uptime = formatUptime(res.uptimeSeconds);

  return (
    <div className="rounded-xl border border-slate-800 bg-surface-light p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Server Resources
      </h2>
      <dl className="space-y-4 text-sm">
        {/* CPU */}
        <div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">CPU</dt>
            <dd className="font-medium text-slate-200">{cpu}</dd>
          </div>
          {res.cpuPercent != null && (
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(100, res.cpuPercent)}%` }}
              />
            </div>
          )}
        </div>

        {/* RAM */}
        <div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">RAM</dt>
            <dd className="font-medium text-slate-200">
              {ram}
              {ramLimit ? ` / ${ramLimit}` : ""}
            </dd>
          </div>
          {ramPct != null && (
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  ramPct > 80
                    ? "bg-red-500"
                    : ramPct > 60
                      ? "bg-yellow-500"
                      : "bg-emerald-500"
                }`}
                style={{ width: `${ramPct}%` }}
              />
            </div>
          )}
        </div>

        {/* Disk */}
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Disk</dt>
          <dd className="font-medium text-slate-200">{disk}</dd>
        </div>

        {/* Uptime */}
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Uptime</dt>
          <dd className="font-medium text-slate-200">{uptime}</dd>
        </div>
      </dl>
    </div>
  );
}