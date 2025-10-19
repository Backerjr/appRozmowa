# Polyglot Starter (Web PWA + API + Speech Proxy)

Monorepo starter for the **Polish→English Duolingo-like** app.
Tooling: **pnpm**, Node 20+, **email/password auth** in dev, **Azure Speech** ready (proxy stubbed).

## Stack
- **api/** – NestJS-style Node service (GraphQL-ready) with Prisma schema, REST `POST /attempts`.
- **web/** – Next.js PWA with lesson page and `<ExercisePlayer/>` + `useAsr()` hook.
- **proxy/** – WebSocket speech proxy (stubbed) mapping mic chunks → partial/final transcripts.
- **docker-compose.yml** – Postgres + Redis for local dev.

## Prereqs
- Node 20+, pnpm 9+, Docker Desktop
- macOS/Linux recommended

## Quickstart
```bash
pnpm install
cp api/.env.example api/.env
cp proxy/.env.example proxy/.env
docker compose up -d
pnpm -r dev
```

Quick preflight: run `npm run check:repo` to catch merge conflicts and malformed package.json files before pushing.

- Web: http://localhost:3000
- API: http://localhost:4000
- Proxy (WS): ws://localhost:4100/ws/asr

## Notes
- The speech proxy is a **stub** producing fake transcripts so you can build UI & flow offline.
- Replace the proxy with Azure Speech when ready (env keys in `proxy/.env`).

## Workspaces
- Root `package.json` defines pnpm workspaces for `api`, `web`, and `proxy`.

- name: Show repo location and package.json
  run: |
    pwd
    ls -la
    echo '--- package.json ---'
    sed -n '1,200p' package.json || true
    echo '--- end ---'
