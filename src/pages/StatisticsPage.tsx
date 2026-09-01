import { useQuery } from "@tanstack/react-query";
import type { LeaderboardEntry } from "@shared";
import { apiClient } from "../lib/apiClient";
import { queryKeys } from "../lib/queryKeys";
import { LeaderboardPanel } from "../components/statistics/LeaderboardPanel";
import PlayerHistoryChart from "../components/statistics/PlayerHistoryChart";
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

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState error={error} />;
  return <LeaderboardPanel title={title} entries={data ?? []} />;
}

export default function StatisticsPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Statistics</h1>
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