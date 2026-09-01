/** Query keys untuk TanStack Query — menghindari string literal yang tercecer. */
export const queryKeys = {
  server: {
    all: ["server"] as const,
    status: ["server", "status"] as const,
    resources: ["server", "resources"] as const,
    history: (period: string) => ["server", "history", period] as const,
    summary: (period: string) => ["server", "summary", period] as const,
  },
  players: {
    all: ["players"] as const,
    online: ["players", "online"] as const,
    recent: ["players", "recent"] as const,
    detail: (id: string) => ["players", "detail", id] as const,
    detailActivity: (id: string) =>
      ["players", "detail", id, "activity"] as const,
    list: (params?: Record<string, string>) =>
      ["players", "list", params] as const,
  },
  activity: {
    all: ["activity"] as const,
    list: (params?: Record<string, string>) =>
      ["activity", "list", params] as const,
  },
  leaderboards: {
    all: ["leaderboards"] as const,
    list: (sort: string, limit: number) =>
      ["leaderboards", sort, String(limit)] as const,
  },
};