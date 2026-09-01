import { NavLink } from "react-router-dom";
import { useServerSocket } from "../../hooks/useServerSocket";

const links = [
  { to: "/", label: "Overview", end: true },
  { to: "/players", label: "Players", end: false },
  { to: "/activity", label: "Activity", end: false },
  { to: "/statistics", label: "Statistics", end: false },
];

export default function Navbar() {
  const { connected } = useServerSocket();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold tracking-wide text-emerald-400">
            ⛏ TOMODAKI
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              connected
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-red-500/15 text-red-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                connected ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
            {connected ? "LIVE" : "OFFLINE"}
          </span>
        </div>

        <nav className="flex flex-wrap gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}