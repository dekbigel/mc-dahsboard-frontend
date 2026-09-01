import { Icon, type IconName } from "../../lib/icons";

export function EmptyState({
  message = "Belum ada data.",
  icon = "box",
}: {
  message?: string;
  icon?: IconName;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 py-10 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-500 ring-1 ring-inset ring-white/[0.08]">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}
