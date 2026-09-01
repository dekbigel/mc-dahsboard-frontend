import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useServerSocket } from "../../hooks/useServerSocket";
import { GrassBlock, Icon, type IconName } from "../../lib/icons";

const links: { to: string; label: string; icon: IconName; end: boolean }[] = [
  { to: "/", label: "Overview", icon: "dashboard", end: true },
  { to: "/players", label: "Players", icon: "users", end: false },
  { to: "/activity", label: "Activity", icon: "activity", end: false },
  { to: "/statistics", label: "Statistics", icon: "chart", end: false },
];

export default function Navbar() {
  const { connected } = useServerSocket();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-night-950/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand */}
        <NavLink to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-b from-grass-400/20 to-grass-600/10 ring-1 ring-inset ring-grass-400/30 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-glow">
            <GrassBlock className="h-6 w-6" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold tracking-widest text-slate-100">
              TOMODAKI
            </span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-grass-400/80">
              Server Panel
            </span>
          </span>
        </NavLink>

        {/* Desktop nav — segmented pill */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.03] p-1 md:flex"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `focus-ring flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-grass-500/15 text-grass-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ring-1 ring-inset ring-grass-400/25"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                }`
              }
            >
              <Icon name={link.icon} className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Connection status + mobile toggle */}
        <div className="flex items-center gap-2">
          <span
            role="status"
            aria-label={connected ? "Realtime connected" : "Realtime disconnected"}
            className={`hidden items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ring-1 ring-inset sm:inline-flex ${
              connected
                ? "bg-grass-500/10 text-grass-300 ring-grass-400/30"
                : "bg-red-500/10 text-red-300 ring-red-400/30"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                connected
                  ? "animate-pulse-dot bg-grass-400"
                  : "animate-pulse-dot-red bg-red-400"
              }`}
            />
            {connected ? "Live" : "Offline"}
          </span>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-slate-300 transition-colors hover:bg-white/[0.07] md:hidden"
          >
            <Icon name={open ? "x" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {open && (
        <nav
          aria-label="Mobile navigation"
          className="animate-fade-up border-t border-white/[0.06] px-4 pb-4 pt-2 md:hidden"
        >
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-grass-500/15 text-grass-300 ring-1 ring-inset ring-grass-400/25"
                        : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                    }`
                  }
                >
                  <Icon name={link.icon} className="h-4 w-4" />
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div
            className={`mt-3 flex items-center gap-2 rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider ${
              connected ? "text-grass-300" : "text-red-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                connected ? "animate-pulse-dot bg-grass-400" : "animate-pulse-dot-red bg-red-400"
              }`}
            />
            {connected ? "Realtime connected" : "Realtime offline"}
          </div>
        </nav>
      )}
    </header>
  );
}
