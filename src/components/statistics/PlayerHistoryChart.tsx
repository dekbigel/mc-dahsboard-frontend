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
import { Spinner } from "../ui/Spinner";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";

const PERIODS = [
  { id: "24h", label: "Last 24 Hours" },
  { id: "7d", label: "Last 7 Days" },
] as const;

const btnClass =
  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors";

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
    <div className="rounded-xl border border-slate-800 bg-surface-light p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Player History
        </h2>
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`${btnClass} ${
                period === p.id
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard
          label="Peak Players"
          value={
            summary?.pointCount
              ? String(summary.peakPlayers)
              : "Unavailable"
          }
        />
        <SummaryCard
          label="Average Online"
          value={
            summary?.pointCount
              ? String(summary.averageOnline)
              : "Unavailable"
          }
        />
        <SummaryCard
          label="Unique Players Today"
          value={String(summary?.uniquePlayersToday ?? 0)}
        />
        <SummaryCard
          label="Total Playtime Today"
          value={formatDuration(summary?.playtimeTodaySeconds ?? null)}
        />
      </div>

      {/* Chart */}
      {historyQuery.isLoading ? (
        <Spinner />
      ) : historyQuery.isError ? (
        <ErrorState error={historyQuery.error} />
      ) : chartData.length === 0 ? (
        <EmptyState message="Belum ada data histori." />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#64748b"
              allowDecimals={false}
              width={30}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#171a21",
                border: "1px solid #2a2f3a",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#e2e8f0",
              }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Area
              type="monotone"
              dataKey="online"
              stroke="#34d399"
              strokeWidth={2}
              fill="url(#colorOnline)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-slate-100">{value}</p>
    </div>
  );
}