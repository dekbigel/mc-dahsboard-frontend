import { useQuery } from "@tanstack/react-query";
import type { LeaderboardEntry } from "@shared";
import { apiClient } from "../lib/apiClient";
import { queryKeys } from "../lib/queryKeys";
import { LeaderboardPanel } from "../components/statistics/LeaderboardPanel";
import PlayerHistoryChart from "../components/statistics/PlayerHistoryChart";
import { Icon } from "../lib/icons";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/ErrorState";

const SECTIONS = [
  { sort: "playtime" as const, title: "Most Active" },
  { sort: "level" as const, title: "Highest Level" },
  { sort: "deaths" as const, title: "Most Deaths" },
  { sort: "playerKills" as const, title: "Most Player Kills" },
  { sort: "mobKills" as const, title: "Most Mob Kills" },
  { sort: "joins" as const, title: "Most Joins" },
  { sort: "diamond" as const, title: "Most Diamonds" },
  { sort: "emerald" as const, title: "Most Emeralds" },
];

function LeaderboardSection({
  sort,
  title,
}: {
  sort: string;
  title: string;
}) {
  const { data, isLoading, isError, error } = useQuery<LeaderboardEntry[]>({
    queryKey: queryKeys.leaderboards.list(sort, 10),
    queryFn: () =>
      apiClient.get<LeaderboardEntry[]>(
        `/leaderboards?sort=${sort}&limit=10`,
      ),
  });

  if (isLoading)
    return (
      <Card title={title} icon={<Icon name="trophy" />} className="h-full">
        <Spinner />
      </Card>
    );
  if (isError) return <ErrorState error={error} />;
  return <LeaderboardPanel title={title} entries={data ?? []} />;
}

export default function StatisticsPage() {
  return (
    <section className="space-y-6">
      {/* Page header */}
      <div className="animate-fade-up">
        <p className="eyebrow flex items-center gap-2">
          <Icon name="chart" className="h-3.5 w-3.5 text-grass-400" />
          Analytics
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-slate-100">
          Statistics
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Grafik player online dan leaderboard komunitas TOMODAKI SERVER.
        </p>
      </div>

      <PlayerHistoryChart />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {SECTIONS.map((section) => (
          <LeaderboardSection
            key={section.sort}
            sort={section.sort}
            title={section.title}
          />
        ))}
      </div>
    </section>
  );
}
