import { useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import type { PaginatedPlayers } from "@shared";
import { apiClient } from "../lib/apiClient";
import { queryKeys } from "../lib/queryKeys";
import { PlayerCard } from "../components/players/PlayerCard";
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
  "rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500";

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
      <h1 className="text-2xl font-bold">Players</h1>

      {/* Controls — search, filter, sort */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search player..."
          className={`${inputClass} flex-1`}
        />
        <button
          type="submit"
          className="rounded-md bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/30"
        >
          Search
        </button>
        <select
          value={online}
          onChange={(e) => handleFilter(setOnline)(e.target.value)}
          className={inputClass}
          aria-label="Filter status"
        >
          <option value="">All</option>
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
      </form>

      {/* Content */}
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorState error={error} />
      ) : !data || data.items.length === 0 ? (
        <EmptyState message="Tidak ada player yang cocok." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>

          {/* Pagination — filter tetap dipertahankan */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              Page {data.page} of {data.totalPages} · {data.total} players
            </p>
            <div className="flex gap-2">
              <button
                disabled={data.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Prev
              </button>
              <button
                disabled={data.page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}