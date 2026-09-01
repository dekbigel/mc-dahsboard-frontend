import { useQuery } from "@tanstack/react-query";
import type { ServerStatus } from "@shared";
import { apiClient } from "../../lib/apiClient";
import { queryKeys } from "../../lib/queryKeys";
import { formatTime } from "../../lib/format";
import { GrassBlock, Icon } from "../../lib/icons";
import { Spinner } from "../ui/Spinner";
import { ErrorState } from "../ui/ErrorState";

export default function ServerHeroStatus() {
  const { data: status, isLoading, isError, error } = useQuery<ServerStatus>({
    queryKey: queryKeys.server.status,
    queryFn: () => apiClient.get<ServerStatus>("/server/status"),
  });

  if (isLoading)
    return (
      <div className="glass-card min-h-64">
        <Spinner label="Memuat status server..." />
      </div>
    );
  if (isError) return <ErrorState error={error} />;
  if (!status) return null;

  const online = status.online;
  const occupancy =
    status.players.max > 0
      ? Math.min(1, Math.max(0, status.players.online / status.players.max))
      : 0;
  const pct = Math.round(occupancy * 100);

  return (
    <section className="glass-card animate-fade-up relative overflow-hidden">
      {/* Glow accents */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl ${
          online ? "bg-grass-500/15" : "bg-red-500/10"
        }`}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-creeper-500/10 blur-3xl"
      />

      <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        {/* Left: identity */}
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span
              className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ring-inset ${
                online
                  ? "bg-grass-500/15 ring-grass-400/30 shadow-glow"
                  : "bg-red-500/10 ring-red-400/25"
              }`}
            >
              <GrassBlock className="h-8 w-8" />
            </span>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] ring-1 ring-inset ${
                online
                  ? "bg-grass-500/10 text-grass-300 ring-grass-400/30"
                  : "bg-red-500/10 text-red-300 ring-red-400/30"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  online
                    ? "animate-pulse-dot bg-grass-400"
                    : "animate-pulse-dot-red bg-red-400"
                }`}
              />
              {online ? "Server Online" : "Server Offline"}
            </span>
          </div>

          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-gradient">TOMODAKI</span>{" "}
            <span className="text-slate-100">SERVER</span>
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
            Minecraft Bedrock Survival — {status.gamemode ?? "Survival"} ·{" "}
            {status.version ?? "Unknown version"}
            {status.ping != null ? ` · ${status.ping} ms` : ""}
          </p>

          {/* Quick chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            {status.ping != null && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1.5 font-semibold text-slate-300 ring-1 ring-inset ring-white/[0.08]">
                <Icon name="wifi" className="h-3.5 w-3.5 text-grass-400" />
                {status.ping} ms
              </span>
            )}
            {status.version && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1.5 font-semibold text-slate-300 ring-1 ring-inset ring-white/[0.08]">
                <Icon name="layers" className="h-3.5 w-3.5 text-creeper-400" />
                v{status.version}
              </span>
            )}
            {status.gamemode && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1.5 font-semibold text-slate-300 ring-1 ring-inset ring-white/[0.08]">
                <Icon name="swords" className="h-3.5 w-3.5 text-amethyst-300" />
                {status.gamemode}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1.5 font-semibold text-slate-300 ring-1 ring-inset ring-white/[0.08]">
              <Icon name="clock" className="h-3.5 w-3.5 text-slate-400" />
              Checked {formatTime(status.lastCheckedAt)}
            </span>
          </div>
        </div>

        {/* Right: player occupancy */}
        <div className="w-full shrink-0 lg:w-80">
          <div className="flex items-end justify-between">
            <p className="eyebrow">Players Online</p>
            <p className="font-display text-3xl font-bold tabular-nums text-slate-100">
              {online ? status.players.online : 0}
              <span className="text-lg font-semibold text-slate-500">
                {" "}
                / {online ? status.players.max : 0}
              </span>
            </p>
          </div>
          <div
            role="progressbar"
            aria-valuenow={online ? pct : 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Kapasitas player"
            className="mt-3 h-3 w-full overflow-hidden rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/[0.06]"
          >
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                online
                  ? "bg-gradient-to-r from-grass-500 via-grass-400 to-creeper-400 shadow-glow"
                  : "bg-slate-700"
              }`}
              style={{ width: online ? `${pct}%` : "0%" }}
            />
          </div>
          <p className="mt-2 text-right text-xs font-medium text-slate-500">
            {online ? `${pct}% kapasitas terisi` : "Server sedang offline"}
          </p>
        </div>
      </div>
    </section>
  );
}
