import { Link } from "react-router-dom";

export function NotFound({ message = "Player tidak ditemukan." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-800 bg-surface-light px-6 py-16 text-center">
      <span className="text-4xl">🕳️</span>
      <h1 className="text-xl font-bold text-slate-200">Not Found</h1>
      <p className="text-sm text-slate-400">{message}</p>
      <Link
        to="/players"
        className="mt-2 rounded-md bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/30"
      >
        Back to players
      </Link>
    </div>
  );
}