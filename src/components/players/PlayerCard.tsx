import { Link } from "react-router-dom";
import type { PlayerProfile } from "@shared";
import { DIMENSION_LABELS, ROLE_META, DEFAULT_ROLE_META } from "../../lib/constants";
import { formatDate } from "../../lib/format";
import { LivePlaytime } from "../ui/LivePlaytime";

export function PlayerCard({ player }: { player: PlayerProfile }) {
  const roleMeta = ROLE_META[player.role] ?? {
    label: player.role ?? "Member",
    color: DEFAULT_ROLE_META.color,
  };
  return (
    <Link
      to={`/players/${player.id}`}
      className="block rounded-xl border border-slate-800 bg-surface-light p-5 transition-colors hover:border-emerald-600/50 hover:bg-surface-lighter"
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-100">{player.name}</span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
            player.online
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-slate-700/40 text-slate-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              player.online ? "bg-emerald-400" : "bg-slate-500"
            }`}
          />
          {player.online ? "Online" : "Offline"}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${roleMeta.color}`}
        >
          {roleMeta.label}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
          ⭐ Lv.{player.stats?.level ?? 0}
        </span>
      </div>

      <dl className="mt-3 space-y-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Dimension</dt>
          <dd className="text-slate-300">
            {DIMENSION_LABELS[player.currentDimension] ?? player.currentDimension}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Playtime</dt>
          <dd className="text-slate-300">
            <LivePlaytime seconds={player.stats?.playtimeSeconds} sessionStartedAt={player.sessionStartedAt} />
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Last seen</dt>
          <dd className="text-slate-300">
            {player.online ? "Online" : formatDate(player.lastSeenAt)}
          </dd>
        </div>
      </dl>
    </Link>
  );
}