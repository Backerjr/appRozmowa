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

## Quickstart (use pnpm)
```bash
# enable corepack if needed (recommended on CI)
corepack enable
pnpm install
cp api/.env.example api/.env
cp proxy/.env.example proxy/.env
docker compose up -d
pnpm -r dev
```

Quick preflight: run one of the following to catch merge conflicts and malformed package.json files before pushing:

- Preferred (pnpm workspace): `pnpm -w run check:repo`
- Fallback (npm): `npm run check:repo`

- Web: http://localhost:3000
- API: http://localhost:4000
- Proxy (WS): ws://localhost:4100/ws/asr

## Notes
- The speech proxy is a **stub** producing fake transcripts so you can build UI & flow offline.
- Replace the proxy with Azure Speech when ready (env keys in `proxy/.env`).

## Vendored tsconfig note

- This repository vendors a small `@ljharb/tsconfig` package under `vendor/@ljharb/tsconfig`.
- During `pnpm install` the root `postinstall` script copies that folder into `node_modules/@ljharb/tsconfig` so tools (TypeScript, ESLint, etc.) can resolve the package normally.
- If you see an error like `File '@ljharb/tsconfig' not found.` then either:
  - Run the installer manually:

```bash
node scripts/install-vendored-tsconfig.cjs
```

  - Or run a fresh install which runs the postinstall hook:

```bash
pnpm install
```

This keeps the vendored config in-tree while preserving standard node module resolution.

### Quick local start script

Use the bundled start script to bring up Docker infra, install deps, and run the dev servers detached:

```bash
# from repo root
pnpm start:local
```

This will:
- copy missing `app/.env` and `proxy/.env` from their `.env.example` files,
- run `docker compose up -d` (Postgres + Redis),
- run `pnpm install`,
- start the dev servers detached and write logs to `/tmp/polyglot-dev.log` and PID to `/tmp/polyglot-dev.pid`.

To stop the running dev servers started by the script:

```bash
kill $(cat /tmp/polyglot-dev.pid) && rm /tmp/polyglot-dev.pid
```


## Workspaces and CI
- Root `package.json` defines pnpm workspaces for `api`, `web`, and `proxy`.
 fix/root-packagejson
-- This repo uses pnpm in CI. If you see errors about `npm ci` or missing lockfiles, run `pnpm install` (or update workflows to use pnpm). See `.github/workflows/lint.yml` and `.github/workflows/lockfile-check.yml` for lint and lockfile checks.


- name: Show repo location and package.json
  run: |
    pwd
    ls -la
    echo '--- package.json ---'
    sed -n '1,200p' package.json || true
    echo '--- end ---'
 main
