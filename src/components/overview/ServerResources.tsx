import { useQuery } from "@tanstack/react-query";
import type { ServerResources } from "@shared";
import { apiClient } from "../../lib/apiClient";
import { queryKeys } from "../../lib/queryKeys";
import { formatBytes, formatUptime } from "../../lib/format";
import { Icon, type IconName } from "../../lib/icons";
import { Card } from "../ui/Card";
import { Spinner } from "../ui/Spinner";
import { ErrorState } from "../ui/ErrorState";

export default function ServerResources() {
  const { data: res, isLoading, isError, error } = useQuery<ServerResources>({
    queryKey: queryKeys.server.resources,
    queryFn: () => apiClient.get<ServerResources>("/server/resources"),
  });

  const ramPct =
    res?.memoryLimitBytes && res.memoryBytes != null
      ? Math.min(100, (res.memoryBytes / res.memoryLimitBytes) * 100)
      : null;
  const diskPct =
    res?.diskLimitBytes && res.diskBytes != null
      ? Math.min(100, (res.diskBytes / res.diskLimitBytes) * 100)
      : null;

  return (
    <Card title="Server Resources" icon={<Icon name="cpu" />}>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorState error={error} />
      ) : !res ? null : (
        <div className="space-y-5">
          <ResourceBar
            icon="cpu"
            label="CPU"
            value={res.cpuPercent != null ? `${res.cpuPercent.toFixed(1)}%` : "Unknown"}
            percent={res.cpuPercent ?? null}
          />
          <ResourceBar
            icon="memory"
            label="RAM"
            value={
              res.memoryLimitBytes
                ? `${formatBytes(res.memoryBytes)} / ${formatBytes(res.memoryLimitBytes)}`
                : formatBytes(res.memoryBytes)
            }
            percent={ramPct}
          />
          <ResourceBar
            icon="disk"
            label="Disk"
            value={
              res.diskLimitBytes
                ? `${formatBytes(res.diskBytes)} / ${formatBytes(res.diskLimitBytes)}`
                : formatBytes(res.diskBytes)
            }
            percent={diskPct}
          />
          <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-400">
              <Icon name="clock" className="h-4 w-4 text-creeper-400" />
              Uptime
            </span>
            <span className="font-mono text-sm font-bold tabular-nums text-slate-100">
              {formatUptime(res.uptimeSeconds)}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}

function ResourceBar({
  icon,
  label,
  value,
  percent,
}: {
  icon: IconName;
  label: string;
  value: string;
  percent: number | null;
}) {
  const tone =
    percent == null
      ? "from-slate-600 to-slate-500"
      : percent > 85
        ? "from-red-500 to-red-400"
        : percent > 65
          ? "from-gold-500 to-gold-400"
          : "from-grass-500 to-creeper-400";

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-slate-400">
          <Icon name={icon} className="h-4 w-4 text-slate-500" />
          {label}
        </span>
        <span className="font-mono text-sm font-bold tabular-nums text-slate-100">
          {value}
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/[0.05]">
        {percent != null && (
          <div
            className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${tone}`}
            style={{ width: `${percent}%` }}
          />
        )}
      </div>
    </div>
  );
}
