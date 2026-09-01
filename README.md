# TOMODAKI SERVER Dashboard

Dashboard untuk **TOMODAKI SERVER** — Minecraft Bedrock Survival Server yang berjalan di VPS.

> **Status**: Frontend (React + Vite) & Backend (Node.js/Express, plain JS) dipisah dalam satu repo.
> Backend berjalan langsung tanpa build. Fitur server (Pterodactyl, Minecraft ping, Behavior Pack),
> database, realtime, dan dashboard sudah lengkap.

## Struktur Project (Frontend & Backend Terpisah)

```text
.
├── backend/            # Backend Node.js + Express (plain JS — jalan langsung, tanpa build)
│   ├── src/            # config, controllers, routes, middleware, socket, services, lib, utils
│   ├── prisma/         # Prisma schema, migrations, dev.db
│   └── package.json
├── frontend/           # Frontend React + Vite + TypeScript (build normal)
│   ├── src/            # app + src/types/shared.ts (tipe bersama)
│   └── package.json
├── minecraft/          # Behavior Pack Bedrock + Companion (VPS B)
├── package.json        # script helper (dev:backend / dev:frontend)
└── README.md
```

## Persyaratan

- Node.js >= 18 (disarankan 20+)
- npm >= 9

## Setup & Menjalankan

```bash
# Backend (terminal 1)
cd backend
npm install        # install deps + prisma generate (otomatis)
npm run dev        # atau: node --watch src/index.js   → port 3001

# Frontend (terminal 2)
cd ../frontend
npm install
npm run dev        # Vite → http://localhost:5173
```

- Frontend dev memakai proxy `/api` & `/socket.io` → `http://localhost:3002`.
- Backend juga bisa dijalankan langsung: `node backend/src/index.js` (restart saat source berubah).

## Script Tersedia

| Script | Fungsi |
|---|---|
| `npm run dev:backend` | Jalankan backend (Node, port 3001) |
| `npm run dev:frontend` | Jalankan frontend (Vite, port 5173) |
| `npm run dev` | Jalankan backend + frontend sekaligus (concurrently) |
| `npm run start:backend` | Jalankan backend (produksi) |
| `npm run build:frontend` | Build frontend → `frontend/dist` |

## Environment

- **Backend (`backend/.env`):** salin `backend/.env.example` → `backend/.env` — dibaca oleh server & Prisma CLI (`DATABASE_URL`, `CORS_ORIGIN`, secret, dst.).
- **Frontend (`frontend/.env`):** salin `frontend/.env.example` → `frontend/.env`. Isi `VITE_API_URL` untuk menunjuk backend (kosongkan jika memakai proxy same-origin).
- Jangan pernah commit file `.env`.

## Database (SQLite + Prisma)

- Skema database: `backend/prisma/schema.prisma`
- Jalankan migrasi: `cd backend && npx prisma migrate dev --name <nama>`
- Generate client: `cd backend && npx prisma generate` (juga otomatis saat `npm install`)
- SQLite lokal: `backend/prisma/dev.db` (tidak di-commit).

### Service Layer (Backend)

Semua logika database berada di `backend/src/services/` — **tidak ada query Prisma langsung di route**:

- `playerService` — findOrCreatePlayer, setOnline/Offline, updateDimension
- `sessionService` — start/finish session + kalkulasi playtime
- `eventService` — createPlayerEvent, getRecentActivity
- `statsService` — increment (atomic), getPlayerStats, getLeaderboard
- `serverSnapshotService` — snapshot & history
- `composite.js` — handler transaksional (join/leave/death/kill/spawn/dimension) memakai `prisma.$transaction`

### API & Realtime

- `GET /api/health` → `{ "status": "ok" }`
- `GET /api/server` → gabungan status Minecraft + resources Pterodactyl
- `GET /api/server/status` → status Minecraft Bedrock (online/offline, version, gamemode, players, ping)
- `GET /api/server/resources` → resource server (CPU, RAM, Disk, uptime, network)
- `GET /api/server/history?period=24h|7d` → histori player count (downsample)
- `GET /api/players` (search, online, sort, page/pageSize) · `/online` · `/recent` · `/:id` · `/:id/stats` · `/:id/activity`
- `GET /api/activity` (type, player, from, to, cursor, limit) — timeline dengan cursor pagination
- `GET /api/leaderboards?sort=&limit=` — whitelist: playtime/deaths/playerKills/mobKills/joins
- `POST /api/minecraft/events` — secure endpoint untuk event collector (auth secret, rate limit, timestamp, dedup)
- CORS (whitelist origin), Helmet, JSON body limit, request logging, centralized error handler
- Validasi environment dengan **Zod** saat startup (gagal cepat jika `.env` tidak lengkap)
- **Socket.IO** dengan event realtime:
  `server:status`, `server:resources`, `player:join`, `player:leave`, `player:event`,
  `player:dimension`, `players:update`
- **Dev endpoint** (hanya `NODE_ENV=development`):
  - `POST /api/dev/events` — simulasi broadcast socket
    body `{ "event": "<nama_event>", "data": { ... } }`
  - `POST /api/dev/collector/events` — simulasi event dari Minecraft collector
    (join/leave/spawn/respawn) → database + broadcast socket

## Frontend

Struktur `frontend/src/`:

- **Layout** — `AppLayout` (Navbar + Outlet) + `Navbar` (responsive, 4 nav, LIVE indicator)
- **Pages** — `OverviewPage`, `PlayersPage`, `ActivityPage`, `StatisticsPage` (router `/`, `/players`, `/activity`, `/statistics`)
- **API Client** — `lib/apiClient.ts` (fetch wrapper, typed, `ApiError`), `lib/queryKeys.ts` (TanStack Query keys)
- **Socket.IO** — `hooks/useServerSocket.tsx` (provider + hook, single socket, reconnect, update query cache)
- **UI Components** — `Spinner`, `ErrorState`, `EmptyState` (reusable)
- **Overview** — `ServerHeroStatus` (status + occupancy bar), `OnlinePlayers`, `ServerInfoCard`, `ServerResources`, `RecentActivity`; util `format.ts`, `constants.ts`, `activity.ts`
- **Players** — `PlayersPage` (search/filter/sort/pagination), `PlayerCard`, `PlayerProfilePage` (`/players/:id` + 404 UI), `StatItem`, `NotFound`
- **Activity** — `ActivityPage` (filter grup + `useInfiniteQuery` cursor pagination + Load More + realtime)
- **Statistics** — `StatisticsPage` + `LeaderboardPanel` (5 leaderboard, top 10, player klik)
- **History Chart** — `PlayerHistoryChart` (AreaChart Recharts, toggle 24h/7d, summary: peak/avg/unique players/playtime)
- **Reliability** — `reconcileService` (tutup sesi + offline saat startup & deteksi server restart), dedup event (`ProcessedEvent`), test `reliability:test`
- **Security & Privacy** — public rate limit, `TRUST_PROXY`, body-parser errors (413/400), audit test (XUID, credential, auth, 404 generic)

Teknologi: **React 18 + TypeScript + Vite + Tailwind CSS 3 + React Router 6 + TanStack Query 5 + Socket.IO Client**

Script test: `npm run api:test` — uji public API (server, players, activity, leaderboards)

## Workspace

- `backend/` — backend Express (plain JS, jalan langsung).
- `frontend/` — frontend React + Vite (tipe bersama di `frontend/src/types/shared.ts`).
