import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { GrassBlock } from "../../lib/icons";

export default function AppLayout() {
  return (
    <div className="relative min-h-screen bg-night-950 text-slate-100">
      {/* Ambient background mesh + grid */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-hero-mesh" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-grass-500/[0.06] to-transparent" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <Outlet />
        </main>
        <footer className="border-t border-white/[0.06] py-6">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-slate-500 sm:flex-row sm:px-6">
            <span className="flex items-center gap-2">
              <GrassBlock className="h-4 w-4 opacity-70" />
              <span className="font-semibold tracking-wide text-slate-400">
                TOMODAKI SERVER
              </span>
              — Bedrock Survival
            </span>
            <span className="tabular-nums">
              Dashboard v2.0 · Realtime via Socket.IO
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
