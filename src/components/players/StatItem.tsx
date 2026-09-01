import { Icon, type IconName } from "../../lib/icons";

export function StatItem({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: string;
  icon?: IconName;
  tone?: "default" | "grass" | "red" | "gold" | "amethyst" | "creeper";
}) {
  const tones = {
    default: "bg-white/[0.05] text-slate-400 ring-white/[0.08]",
    grass: "bg-grass-500/10 text-grass-300 ring-grass-400/20",
    red: "bg-red-500/10 text-red-300 ring-red-400/20",
    gold: "bg-gold-500/10 text-gold-300 ring-gold-400/20",
    amethyst: "bg-amethyst-500/10 text-amethyst-300 ring-amethyst-400/20",
    creeper: "bg-creeper-500/10 text-creeper-300 ring-creeper-400/20",
  };

  return (
    <div className="glass-card flex items-center gap-3 p-4">
      {icon && (
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${tones[tone]}`}
        >
          <Icon name={icon} className="h-4 w-4" />
        </span>
      )}
      <div className="min-w-0">
        <dt className="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </dt>
        <dd className="truncate font-display text-lg font-bold tabular-nums text-slate-100">
          {value}
        </dd>
      </div>
    </div>
  );
}
