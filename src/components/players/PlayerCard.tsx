import { Link } from "react-router-dom";
import type { PlayerProfile } from "@shared";
import { formatDate } from "../../lib/format";
import { Icon } from "../../lib/icons";
import { Avatar } from "../ui/Avatar";
import { LevelChip, RoleBadge, StatusPill } from "../ui/Badge";
import { DimensionChip } from "../overview/OnlinePlayers";
import { LivePlaytime } from "../ui/LivePlaytime";

export function PlayerCard({ player }: { player: PlayerProfile }) {
  return (
    <Link
      to={`/players/${player.id}`}
      className="glass-card glass-card-hover group block p-5"
    >
      {/* Header: avatar + name + status */}
      <div className="flex items-start gap-3">
        <span className="relative">
          <Avatar name={player.name} size={48} />
          <span
            className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-night-900 ${
              player.online ? "bg-grass-400" : "bg-slate-600"
            }`}
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-display text-base font-bold text-slate-100 transition-colors group-hover:text-grass-300">
              {player.name}
            </span>
            <StatusPill online={player.online} />
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <RoleBadge role={player.role} />
            <LevelChip level={player.stats?.level ?? 0} />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Meta rows */}
      <dl className="space-y-2 text-sm">
        <div className="flex items-center justify-between gap-2">
          <dt className="flex items-center gap-1.5 text-slate-500">
            <Icon name="portal" className="h-3.5 w-3.5" />
            Dimension
          </dt>
          <dd>
            <DimensionChip dimension={player.currentDimension} />
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="flex items-center gap-1.5 text-slate-500">
            <Icon name="timer" className="h-3.5 w-3.5" />
            Playtime
          </dt>
          <dd className="font-semibold tabular-nums text-slate-200">
            <LivePlaytime
              seconds={player.stats?.playtimeSeconds}
              sessionStartedAt={player.sessionStartedAt}
            />
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="flex items-center gap-1.5 text-slate-500">
            <Icon name="clock" className="h-3.5 w-3.5" />
            Last seen
          </dt>
          <dd className="font-semibold tabular-nums text-slate-200">
            {player.online ? (
              <span className="text-grass-300">Online now</span>
            ) : (
              formatDate(player.lastSeenAt)
            )}
          </dd>
        </div>
      </dl>
    </Link>
  );
}
