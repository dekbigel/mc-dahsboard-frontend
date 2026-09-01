import { Link } from "react-router-dom";
import type { LeaderboardEntry } from "@shared";
import { LivePlaytime } from "../ui/LivePlaytime";

const RANK_COLORS = [
  "text-yellow-400",
  "text-slate-300",
  "text-amber-600",
];

function ValueCell({ entry }: { entry: LeaderboardEntry }) {
  if (entry.metric === "playtime") {
    return <LivePlaytime seconds={entry.value} sessionStartedAt={entry.sessionStartedAt} />;
  }
  return <>{entry.value.toLocaleString()}</>;
}

export function LeaderboardPanel({
  title,
  entries,
}: {
  title: string;
  entries: LeaderboardEntry[];
}) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-surface-light p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </h2>
        <p className="text-sm text-slate-500">Belum ada data.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-surface-light p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </h2>
      <ol className="space-y-1">
        {entries.map((entry) => (
          <li key={entry.playerId}>
            <Link
              to={`/players/${entry.playerId}`}
              className="flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-slate-800"
            >
              <span className="flex items-center gap-3">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    entry.rank <= 3
                      ? RANK_COLORS[entry.rank - 1]
                      : "text-slate-500"
                  }`}
                >
                  {entry.rank}
                </span>
                <span className="text-sm font-medium text-slate-200">
                  {entry.name}
                </span>
              </span>
              <span className="text-sm text-slate-400">
                <ValueCell entry={entry} />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}