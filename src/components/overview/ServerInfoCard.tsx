import { useQuery } from "@tanstack/react-query";
import type { ServerStatus } from "@shared";
import { apiClient } from "../../lib/apiClient";
import { queryKeys } from "../../lib/queryKeys";
import { Icon, type IconName } from "../../lib/icons";
import { Card } from "../ui/Card";
import { Spinner } from "../ui/Spinner";
import { ErrorState } from "../ui/ErrorState";

export default function ServerInfoCard() {
  const { data: status, isLoading, isError, error } = useQuery<ServerStatus>({
    queryKey: queryKeys.server.status,
    queryFn: () => apiClient.get<ServerStatus>("/server/status"),
  });

  return (
    <Card title="Server Information" icon={<Icon name="server" />}>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorState error={error} />
      ) : !status ? null : (
        <dl className="grid grid-cols-2 gap-3">
          <InfoTile icon="layers" label="Version" value={status.version ?? "Unknown"} />
          <InfoTile icon="swords" label="Gamemode" value={status.gamemode ?? "Unknown"} />
          <InfoTile
            icon="shield"
            label="Difficulty"
            value={status.difficulty ?? "Unknown"}
          />
          <InfoTile
            icon="wifi"
            label="Ping"
            value={status.ping != null ? `${status.ping} ms` : "Unknown"}
            highlight={status.ping != null && status.ping < 60}
          />
        </dl>
      )}
    </Card>
  );
}

function InfoTile({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: IconName;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5">
      <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        <Icon name={icon} className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd
        className={`mt-1.5 truncate font-display text-lg font-bold ${
          highlight ? "text-grass-300" : "text-slate-100"
        }`}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}
