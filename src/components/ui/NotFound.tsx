import { Link } from "react-router-dom";
import { Icon } from "../../lib/icons";

export function NotFound({
  message = "Player tidak ditemukan.",
}: {
  message?: string;
}) {
  return (
    <div className="glass-card flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-amethyst-500/10 text-amethyst-300 ring-1 ring-inset ring-amethyst-400/25">
        <Icon name="portal" className="h-8 w-8" />
        <span className="absolute inset-0 -z-10 rounded-2xl bg-amethyst-500/20 blur-xl" />
      </span>
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100">
          Lost in The End
        </h1>
        <p className="mt-1 text-sm text-slate-400">{message}</p>
      </div>
      <Link
        to="/players"
        className="focus-ring inline-flex items-center gap-2 rounded-full bg-grass-500/15 px-5 py-2.5 text-sm font-bold text-grass-300 ring-1 ring-inset ring-grass-400/30 transition-all hover:bg-grass-500/25 hover:shadow-glow"
      >
        <Icon name="arrow-left" className="h-4 w-4" />
        Back to players
      </Link>
    </div>
  );
}
