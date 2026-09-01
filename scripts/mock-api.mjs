/**
 * Mock API server (port 3001) — utility opsional untuk pengembangan UI
 * tanpa backend asli. Menjawab endpoint yang di-proxy Vite (/api/*)
 * dengan data contoh. Jalankan: node scripts/mock-api.mjs
 * TIDAK untuk produksi.
 */
import http from "node:http";

const now = Date.now();
const iso = (msAgo) => new Date(now - msAgo).toISOString();

const players = [
  { id: "p1", name: "SteveCraft", role: "Owner", online: true, dimension: "overworld", level: 42 },
  { id: "p2", name: "AlexMiner", role: "Admin", online: true, dimension: "nether", level: 37 },
  { id: "p3", name: "DiamondHunter", role: "VIP", online: true, dimension: "the_end", level: 28 },
  { id: "p4", name: "RedstoneWiz", role: "Mod", online: false, dimension: "overworld", level: 31 },
  { id: "p5", name: "CreeperSlayer", role: "Member", online: false, dimension: "overworld", level: 19 },
  { id: "p6", name: "EnderQueen", role: "VIP", online: true, dimension: "the_end", level: 44 },
  { id: "p7", name: "BuildMaster", role: "Member", online: false, dimension: "overworld", level: 12 },
  { id: "p8", name: "NetherNomad", role: "Member", online: false, dimension: "nether", level: 9 },
];

const toProfile = (p, i) => ({
  id: p.id, name: p.name, xuid: null, role: p.role, online: p.online,
  currentDimension: p.dimension,
  firstJoinedAt: iso(86400000 * (10 + i * 7)),
  lastSeenAt: p.online ? iso(0) : iso(3600000 * (i + 2)),
  createdAt: iso(86400000 * (10 + i * 7)), updatedAt: iso(60000 * i),
  sessionStartedAt: p.online ? iso(1800000 + i * 300000) : null,
  stats: {
    playtimeSeconds: 3600 * (20 - i * 2), deaths: 30 - i * 3,
    playerKills: 25 - i * 2, mobKills: 400 - i * 40, joins: 90 - i * 8,
    level: p.level, xpProgress: 30 + i * 8,
    ironIngot: 500 - i * 60, goldIngot: 200 - i * 20,
    diamond: 64 - i * 8, emerald: 30 - i * 3,
  },
});

const profiles = players.map(toProfile);

const eventTypes = [
  ["join", {}], ["mob_kill", { mobType: "Zombie" }], ["dimension_change", { dimension: "nether" }],
  ["death", { cause: "skeleton" }], ["player_kill", { targetName: "SteveCraft" }],
  ["xp_update", { metadata: { level: 12, xpProgress: 45 } }],
  ["item_collect", { metadata: { itemStatKey: "diamond", count: 7 } }],
  ["leave", {}], ["spawn", { dimension: "overworld" }], ["respawn", { dimension: "overworld" }],
];

const activity = Array.from({ length: 40 }, (_, i) => {
  const [type, extra] = eventTypes[i % eventTypes.length];
  const p = players[i % players.length];
  return {
    id: `e${i}`, playerId: p.id, playerName: p.name, type,
    dimension: extra.dimension ?? null, targetPlayerId: null,
    targetName: extra.targetName ?? null, mobType: extra.mobType ?? null,
    cause: extra.cause ?? null, metadata: extra.metadata ?? null,
    createdAt: iso(i * 240000),
  };
});

const json = (res, data, status = 200) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const path = url.pathname;
  const q = url.searchParams;

  if (path === "/api/health") return json(res, { status: "ok" });
  if (path === "/api/server/status") {
    return json(res, {
      online: true, name: "TOMODAKI SERVER", version: "1.21.44", protocol: 766,
      gamemode: "Survival", difficulty: "Normal", players: { online: 4, max: 20 },
      ping: 23, lastCheckedAt: iso(0),
    });
  }
  if (path === "/api/server/resources") {
    return json(res, {
      state: "running", cpuPercent: 34.7, memoryBytes: 1.7e9,
      memoryLimitBytes: 4e9, diskBytes: 8.2e9, diskLimitBytes: 25e9,
      uptimeSeconds: 414720,
    });
  }
  if (path === "/api/server/history") {
    const pts = Array.from({ length: 48 }, (_, i) => ({
      time: iso((47 - i) * 1800000),
      onlinePlayers: Math.max(0, Math.round(6 + 5 * Math.sin(i / 5) + (i % 7))),
      maxPlayers: 20,
    }));
    return json(res, pts);
  }
  if (path === "/api/server/summary") {
    return json(res, { period: "24h", pointCount: 48, peakPlayers: 12, averageOnline: 7, uniquePlayersToday: 15, playtimeTodaySeconds: 26400 });
  }
  if (path === "/api/players/online") {
    return json(res, profiles.filter((p) => p.online).map((p) => ({
      id: p.id, name: p.name, xuid: null, dimension: p.currentDimension,
      joinedAt: p.sessionStartedAt, sessionStartedAt: p.sessionStartedAt,
      playtimeSeconds: p.stats.playtimeSeconds,
    })));
  }
  if (path === "/api/players") {
    const page = Number(q.get("page") ?? 1);
    const pageSize = Number(q.get("pageSize") ?? 12);
    const online = q.get("online");
    let items = profiles;
    if (online === "true") items = items.filter((p) => p.online);
    if (online === "false") items = items.filter((p) => !p.online);
    const search = q.get("search");
    if (search) items = items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    return json(res, {
      items: items.slice((page - 1) * pageSize, page * pageSize),
      total: items.length, page, pageSize,
      totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
    });
  }
  const profileMatch = path.match(/^\/api\/players\/(p\d+)$/);
  if (profileMatch) {
    const p = profiles.find((x) => x.id === profileMatch[1]);
    return p ? json(res, p) : json(res, { error: { code: "NOT_FOUND", message: "Player not found" } }, 404);
  }
  const activityMatch = path.match(/^\/api\/players\/(p\d+)\/activity$/);
  if (activityMatch) {
    return json(res, activity.filter((e) => e.playerId === activityMatch[1]).slice(0, 10));
  }
  if (path === "/api/activity") {
    const types = q.get("type")?.split(",").filter(Boolean);
    const limit = Number(q.get("limit") ?? 30);
    const cursor = Number(q.get("cursor") ?? 0);
    let items = activity;
    if (types?.length) items = items.filter((e) => types.includes(e.type));
    const slice = items.slice(cursor, cursor + limit);
    const next = cursor + limit < items.length ? String(cursor + limit) : null;
    return json(res, { items: slice, nextCursor: next, hasMore: next !== null });
  }
  if (path === "/api/leaderboards") {
    const sort = q.get("sort") ?? "playtime";
    const keyMap = { playtime: "playtimeSeconds", deaths: "deaths", playerKills: "playerKills", mobKills: "mobKills", joins: "joins", level: "level", diamond: "diamond", emerald: "emerald" };
    const key = keyMap[sort] ?? "playtimeSeconds";
    const entries = [...profiles]
      .sort((a, b) => b.stats[key] - a.stats[key])
      .slice(0, Number(q.get("limit") ?? 10))
      .map((p, i) => ({
        playerId: p.id, name: p.name, rank: i + 1,
        metric: sort, value: p.stats[key],
        sessionStartedAt: p.sessionStartedAt,
      }));
    return json(res, entries);
  }
  json(res, { error: { code: "NOT_FOUND", message: "Not found" } }, 404);
});

server.listen(3001, "127.0.0.1", () => console.log("mock api on :3001"));
