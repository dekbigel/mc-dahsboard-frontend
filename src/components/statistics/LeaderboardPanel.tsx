import { Link } from "react-router-dom";
import type { LeaderboardEntry } from "@shared";
import { LivePlaytime } from "../ui/LivePlaytime";
import { Avatar } from "../ui/Avatar";
import { Card } from "../ui/Card";
import { Icon } from "../../lib/icons";

/** Gaya medal untuk 3 peringkat teratas. */
const RANK_STYLE = [
  "bg-gold-500/15 text-gold-300 ring-gold-400/40 shadow-[0_0_12px_-2px_rgba(251,191,36,0.35)]",
  "bg-slate-300/10 text-slate-200 ring-slate-300/30",
  "bg-amber-700/15 text-amber-500 ring-amber-600/40",
];

function ValueCell({ entry }: { entry: LeaderboardEntry }) {
  if (entry.metric === "playtime") {
    return (
      <LivePlaytime seconds={entry.value} sessionStartedAt={entry.sessionStartedAt} />
    );
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
  const top = entries[0];
  const max = top && top.value > 0 ? top.value : 1;

  return (
    <Card
      title={title}
      icon={<Icon name="trophy" />}
      className="h-full"
      bodyClassName="px-3 py-3 sm:px-4"
    >
      {entries.length === 0 ? (
        <p className="py-6 text-center text-sm font-medium text-slate-500">
          Belum ada data.
        </p>
      ) : (
        <ol className="space-y-1">
          {entries.map((entry) => {
            const isTop = entry.rank <= 3;
            const barWidth = Math.max(4, Math.round((entry.value / max) * 100));
            return (
              <li key={entry.playerId}>
                <Link
                  to={`/players/${entry.playerId}`}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-xl px-2.5 py-2 transition-colors hover:bg-white/[0.05]"
                >
                  {/* Relative value bar */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-y-1 left-0 rounded-lg opacity-[0.07] transition-all duration-500 ${
                      isTop ? "bg-grass-400" : "bg-slate-400"
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                  <span
                    className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-display text-xs font-bold ring-1 ring-inset ${
                      isTop
                        ? RANK_STYLE[entry.rank - 1]
                        : "bg-white/[0.04] text-slate-500 ring-white/[0.08]"
                    }`}
                  >
                    {entry.rank}
                  </span>
                  <Avatar name={entry.name} size={28} className="relative rounded-lg" />
                  <span className="relative min-w-0 flex-1 truncate text-sm font-semibold text-slate-200 transition-colors group-hover:text-grass-300">
                    {entry.name}
                  </span>
                  <span className="relative shrink-0 font-mono text-sm font-bold tabular-nums text-slate-300">
                    <ValueCell entry={entry} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}
