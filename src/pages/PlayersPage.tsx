import { useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import type { PaginatedPlayers } from "@shared";
import { apiClient } from "../lib/apiClient";
import { queryKeys } from "../lib/queryKeys";
import { PlayerCard } from "../components/players/PlayerCard";
import { Icon } from "../lib/icons";
import { Spinner } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "lastSeenAt", label: "Last seen" },
  { value: "name", label: "Name" },
  { value: "playtime", label: "Playtime" },
  { value: "firstJoinedAt", label: "First joined" },
];

const inputClass =
  "focus-ring rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm font-medium text-slate-200 placeholder:text-slate-600 transition-colors hover:border-white/[0.14]";

export default function PlayersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [online, setOnline] = useState(""); // "" | "true" | "false"
  const [sort, setSort] = useState("lastSeenAt");
  const [page, setPage] = useState(1);

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (online) p.set("online", online);
    p.set("sort", sort);
    p.set("page", String(page));
    p.set("pageSize", String(PAGE_SIZE));
    return p.toString();
  }, [search, online, sort, page]);

  const { data, isLoading, isError, error } = useQuery<PaginatedPlayers>({
    queryKey: queryKeys.players.list({ q: params }),
    queryFn: () => apiClient.get<PaginatedPlayers>(`/players?${params}`),
  });

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleFilter = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <section className="space-y-6">
      {/* Page header */}
      <div className="animate-fade-up flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <Icon name="users" className="h-3.5 w-3.5 text-grass-400" />
            Community
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-slate-100">
            Players
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Semua player yang pernah bermain di TOMODAKI SERVER.
          </p>
        </div>
        {data && (
          <p className="text-sm font-semibold tabular-nums text-slate-400">
            {data.total} player terdaftar
          </p>
        )}
      </div>

      {/* Controls — search, filter, sort */}
      <form
        onSubmit={handleSubmit}
        className="glass-card animate-fade-up flex flex-col gap-3 p-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari player..."
            className={`${inputClass} w-full pl-10`}
          />
        </div>
        <select
          value={online}
          onChange={(e) => handleFilter(setOnline)(e.target.value)}
          className={inputClass}
          aria-label="Filter status"
        >
          <option value="">Semua status</option>
          <option value="true">Online</option>
          <option value="false">Offline</option>
        </select>
        <select
          value={sort}
          onChange={(e) => handleFilter(setSort)(e.target.value)}
          className={inputClass}
          aria-label="Sort by"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-grass-500/15 px-5 py-2.5 text-sm font-bold text-grass-300 ring-1 ring-inset ring-grass-400/30 transition-all hover:bg-grass-500/25 hover:shadow-glow"
        >
          <Icon name="search" className="h-4 w-4" />
          Search
        </button>
      </form>

      {/* Content */}
      {isLoading ? (
        <div className="glass-card">
          <Spinner label="Memuat daftar player..." />
        </div>
      ) : isError ? (
        <ErrorState error={error} />
      ) : !data || data.items.length === 0 ? (
        <EmptyState message="Tidak ada player yang cocok." icon="search" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>

          {/* Pagination — filter tetap dipertahankan */}
          <div className="glass-card flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
            <p className="text-sm font-medium tabular-nums text-slate-400">
              Page{" "}
              <span className="font-bold text-slate-200">{data.page}</span> of{" "}
              <span className="font-bold text-slate-200">{data.totalPages}</span>{" "}
              · {data.total} players
            </p>
            <div className="flex gap-2">
              <button
                disabled={data.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="focus-ring inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-grass-400/30 hover:text-grass-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/[0.08] disabled:hover:text-slate-300"
              >
                <Icon name="chevron-left" className="h-4 w-4" />
                Prev
              </button>
              <button
                disabled={data.page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="focus-ring inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-grass-400/30 hover:text-grass-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/[0.08] disabled:hover:text-slate-300"
              >
                Next
                <Icon name="chevron-right" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
