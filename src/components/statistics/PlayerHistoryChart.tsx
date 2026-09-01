import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PlayerHistoryPoint, ServerHistorySummary } from "@shared";
import { apiClient } from "../../lib/apiClient";
import { queryKeys } from "../../lib/queryKeys";
import { formatDuration, formatTime } from "../../lib/format";
import { Icon, type IconName } from "../../lib/icons";
import { Card } from "../ui/Card";
import { Spinner } from "../ui/Spinner";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";

const PERIODS = [
  { id: "24h", label: "24 Jam" },
  { id: "7d", label: "7 Hari" },
] as const;

function formatAxisTime(iso: string, period: string): string {
  if (period === "7d") {
    const d = new Date(iso);
    return d.toLocaleDateString([], { day: "numeric", month: "short" });
  }
  return formatTime(iso);
}

export default function PlayerHistoryChart() {
  const [period, setPeriod] = useState<string>("24h");

  const historyQuery = useQuery<PlayerHistoryPoint[]>({
    queryKey: queryKeys.server.history(period),
    queryFn: () =>
      apiClient.get<PlayerHistoryPoint[]>(`/server/history?period=${period}`),
  });

  const summaryQuery = useQuery<ServerHistorySummary>({
    queryKey: queryKeys.server.summary(period),
    queryFn: () =>
      apiClient.get<ServerHistorySummary>(`/server/summary?period=${period}`),
  });

  const chartData =
    historyQuery.data?.map((p) => ({
      time: formatAxisTime(p.time, period),
      online: p.onlinePlayers,
    })) ?? [];

  const summary = summaryQuery.data;

  return (
    <Card
      title="Player History"
      icon={<Icon name="trending-up" />}
      action={
        <div className="flex gap-1 rounded-full border border-white/[0.07] bg-white/[0.03] p-1">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`focus-ring rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                period === p.id
                  ? "bg-grass-500/15 text-grass-300 ring-1 ring-inset ring-grass-400/25"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      }
      className="animate-fade-up"
    >
      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          icon="trending-up"
          label="Peak Players"
          value={summary?.pointCount ? String(summary.peakPlayers) : "—"}
          tone="text-grass-300 bg-grass-500/10 ring-grass-400/20"
        />
        <SummaryCard
          icon="chart"
          label="Average Online"
          value={summary?.pointCount ? String(summary.averageOnline) : "—"}
          tone="text-creeper-300 bg-creeper-500/10 ring-creeper-400/20"
        />
        <SummaryCard
          icon="user-check"
          label="Unique Today"
          value={String(summary?.uniquePlayersToday ?? 0)}
          tone="text-amethyst-300 bg-amethyst-500/10 ring-amethyst-400/20"
        />
        <SummaryCard
          icon="timer"
          label="Playtime Today"
          value={formatDuration(summary?.playtimeTodaySeconds ?? null)}
          tone="text-gold-300 bg-gold-500/10 ring-gold-400/20"
        />
      </div>

      {/* Chart */}
      {historyQuery.isLoading ? (
        <Spinner label="Memuat histori..." />
      ) : historyQuery.isError ? (
        <ErrorState error={historyQuery.error} />
      ) : chartData.length === 0 ? (
        <EmptyState message="Belum ada data histori." icon="chart" />
      ) : (
        <div className="rounded-xl border border-white/[0.05] bg-night-900/40 p-3">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
              <defs>
                <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity={0.35} />
                  <stop offset="60%" stopColor="#4ade80" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 6"
                stroke="rgba(148,163,184,0.10)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                stroke="#475569"
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#475569"
                allowDecimals={false}
                width={32}
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ stroke: "rgba(74,222,128,0.3)", strokeWidth: 1 }}
                contentStyle={{
                  backgroundColor: "#0d1220",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: "13px",
                  color: "#e6ecf5",
                  boxShadow: "0 8px 30px -8px rgba(0,0,0,0.6)",
                }}
                labelStyle={{ color: "#94a3b8", fontWeight: 600 }}
                itemStyle={{ color: "#4ade80", fontWeight: 700 }}
              />
              <Area
                type="monotone"
                dataKey="online"
                name="Players online"
                stroke="#4ade80"
                strokeWidth={2.5}
                fill="url(#colorOnline)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#4ade80",
                  stroke: "#07090f",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: IconName;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${tone}`}
      >
        <Icon name={icon} className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="truncate font-display text-lg font-bold tabular-nums text-slate-100">
          {value}
        </p>
      </div>
    </div>
  );
}
